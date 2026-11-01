import { authorizeAdmin } from "@/lib/auth";
import { readJsonBody, rejectCrossOriginRequest } from "@/lib/http";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

function validService(body) {
  return (
    typeof body?.name === "string" &&
    body.name.trim().length > 1 &&
    body.name.trim().length <= 100 &&
    typeof body?.description === "string" &&
    body.description.trim().length <= 2000 &&
    Number.isSafeInteger(body.priceMinorUnits) &&
    body.priceMinorUnits >= 100 &&
    body.priceMinorUnits <= 100_000_000 &&
    Number.isSafeInteger(body.durationMinutes) &&
    body.durationMinutes >= 15 &&
    body.durationMinutes <= 480 &&
    (body.currency === undefined || body.currency === "INR")
  );
}

export async function GET() {
  const { response } = await authorizeAdmin();
  if (response) return response;
  const services = await prisma.service.findMany({ orderBy: { createdAt: "desc" } });
  return Response.json({ services }, { headers: { "Cache-Control": "no-store" } });
}

export async function POST(request) {
  const originError = rejectCrossOriginRequest(request);
  if (originError) return originError;
  const { user, response } = await authorizeAdmin();
  if (response) return response;
  const parsed = await readJsonBody(request, 8192);
  if (parsed.error) return Response.json({ error: parsed.error }, { status: parsed.status });
  if (!validService(parsed.body)) {
    return Response.json({ error: "Enter a valid service name, a price of at least ₹1, and a duration." }, { status: 400 });
  }

  try {
    const service = await prisma.$transaction(async (tx) => {
      const created = await tx.service.create({
        data: {
          name: parsed.body.name.trim(),
          description: parsed.body.description.trim(),
          priceMinorUnits: parsed.body.priceMinorUnits,
          currency: "INR",
          durationMinutes: parsed.body.durationMinutes,
        },
      });
      await tx.auditLog.create({
        data: {
          actorId: user.id,
          action: "SERVICE_CREATED",
          targetType: "Service",
          targetId: created.id,
        },
      });
      return created;
    });
    return Response.json({ service }, { status: 201 });
  } catch (error) {
    console.error("Failed to create service:", error);
    return Response.json({ error: "Could not create the service." }, { status: 500 });
  }
}
