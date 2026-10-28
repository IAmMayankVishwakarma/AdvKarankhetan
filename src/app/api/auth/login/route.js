import { createSession, verifyPassword } from "@/lib/auth";
import { readJsonBody, rejectCrossOriginRequest } from "@/lib/http";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function POST(request) {
  const originError = rejectCrossOriginRequest(request);
  if (originError) return originError;

  if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) {
    return Response.json({ error: "Content-Type must be application/json." }, { status: 415 });
  }

  let parsed;
  try {
    parsed = await readJsonBody(request, 8192);
  } catch (error) {
    console.error("Failed to read login request:", error);
    return Response.json({ error: "Could not read the request." }, { status: 500 });
  }
  if (parsed.error) {
    return Response.json({ error: parsed.error }, { status: parsed.status });
  }

  const body = parsed.body;
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body?.password === "string" ? body.password : "";

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || password.length > 128) {
    return Response.json({ error: "Invalid email or password." }, { status: 400 });
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    const passwordMatches =
      user && (await verifyPassword(password, user.passwordHash));

    if (!passwordMatches || user.status !== "ACTIVE") {
      return Response.json(
        { error: "Invalid email or password." },
        { status: 401 },
      );
    }

    await createSession(user.id);

    return Response.json({
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.error("Failed to sign in:", error);
    return Response.json(
      { error: "We could not sign you in. Please try again later." },
      { status: 500 },
    );
  }
}
