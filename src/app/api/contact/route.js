import { prisma } from "@/lib/prisma";
import { readJsonBody } from "@/lib/http";

export const runtime = "nodejs";

const ALLOWED_MATTERS = new Set([
  "Family dispute",
  "Commercial or business dispute",
  "Cross-border India–US dispute",
  "Landlord and tenant",
  "Consumer dispute",
  "Workplace or ombuds",
  "Other",
]);
const ALLOWED_VALUES = new Set([
  "Under ₹5 lakh",
  "₹5 to 50 lakh",
  "₹50 lakh to 5 crore",
  "Above ₹5 crore",
]);
const ALLOWED_URGENCIES = new Set(["Within a week", "Within a month", "Not urgent"]);

function isString(value, maxLength) {
  return typeof value === "string" && value.trim().length > 0 && value.length <= maxLength;
}

export async function POST(request) {
  if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) {
    return Response.json({ error: "Content-Type must be application/json." }, { status: 415 });
  }

  let parsed;
  try {
    parsed = await readJsonBody(request);
  } catch (error) {
    console.error("Failed to read contact request:", error);
    return Response.json({ error: "Could not read the request." }, { status: 500 });
  }
  if (parsed.error) {
    return Response.json({ error: parsed.error }, { status: parsed.status });
  }

  const body = parsed.body;
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (typeof body.company === "string" && body.company.trim()) {
    return Response.json({ message: "Enquiry received." }, { status: 202 });
  }

  const firstName = typeof body.first_name === "string" ? body.first_name.trim() : "";
  const lastName = typeof body.last_name === "string" ? body.last_name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const matter = typeof body.matter === "string" ? body.matter.trim() : "";
  const value = typeof body.value === "string" ? body.value.trim() : "";
  const urgency = typeof body.urgency === "string" ? body.urgency.trim() : "";
  const message = typeof body.message === "string" ? body.message.trim() : "";

  if (
    !isString(firstName, 100) ||
    !isString(lastName, 100) ||
    !isString(email, 254) ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
    !ALLOWED_MATTERS.has(matter) ||
    (value && !ALLOWED_VALUES.has(value)) ||
    (urgency && !ALLOWED_URGENCIES.has(urgency)) ||
    !isString(message, 5000)
  ) {
    return Response.json(
      { error: "Please check the required fields and try again." },
      { status: 400 },
    );
  }

  try {
    const inquiry = await prisma.contactInquiry.create({
      data: {
        firstName,
        lastName,
        email,
        matter,
        value: value || null,
        urgency: urgency || null,
        message,
      },
      select: { id: true },
    });

    return Response.json({ message: "Enquiry received.", id: inquiry.id }, { status: 201 });
  } catch (error) {
    console.error("Failed to store contact enquiry:", error);
    return Response.json(
      { error: "We could not save your enquiry. Please try again later." },
      { status: 500 },
    );
  }
}
