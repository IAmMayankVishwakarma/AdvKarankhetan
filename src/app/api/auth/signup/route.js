import { createSession, hashPassword } from "@/lib/auth";
import { readJsonBody } from "@/lib/http";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function POST(request) {
  if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) {
    return Response.json({ error: "Content-Type must be application/json." }, { status: 415 });
  }

  let parsed;
  try {
    parsed = await readJsonBody(request, 8192);
  } catch (error) {
    console.error("Failed to read signup request:", error);
    return Response.json({ error: "Could not read the request." }, { status: 500 });
  }
  if (parsed.error) {
    return Response.json({ error: parsed.error }, { status: parsed.status });
  }

  const body = parsed.body;
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  const name = typeof body?.name === "string" ? body.name.trim() : "";
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body?.password === "string" ? body.password : "";

  if (
    name.length < 2 ||
    name.length > 100 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
    email.length > 254 ||
    password.length < 8 ||
    password.length > 128 ||
    !/(?=.*[A-Za-z])(?=.*\d)/.test(password)
  ) {
    return Response.json(
      { error: "Please provide a valid name, email, and password." },
      { status: 400 },
    );
  }

  try {
    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash: await hashPassword(password),
      },
      select: { id: true, name: true, email: true },
    });

    await createSession(user.id);

    return Response.json({ user }, { status: 201 });
  } catch (error) {
    if (error?.code === "P2002") {
      return Response.json(
        { error: "An account with that email already exists." },
        { status: 409 },
      );
    }

    console.error("Failed to create account:", error);
    return Response.json(
      { error: "We could not create your account. Please try again later." },
      { status: 500 },
    );
  }
}
