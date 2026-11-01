import { authorizeAdmin } from "@/lib/auth";
import { readJsonBody, rejectCrossOriginRequest } from "@/lib/http";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function PATCH(request, { params }) {
  const originError = rejectCrossOriginRequest(request);
  if (originError) return originError;
  const { user, response } = await authorizeAdmin();
  if (response) return response;
  const { id } = await params;
  const parsed = await readJsonBody(request, 8192);
  if (parsed.error) return Response.json({ error: parsed.error }, { status: parsed.status });

  const body = parsed.body;
  const data = {};
  if (typeof body?.active === "boolean") data.active = body.active;
  if (typeof body?.name === "string" && body.name.trim().length > 1 && body.name.trim().length <= 100) {
    data.name = body.name.trim();
  }
  if (typeof body?.description === "string" && body.description.trim().length <= 2000) {
    data.description = body.description.trim();
  }
  if (Number.isSafeInteger(body?.priceMinorUnits) && body.priceMinorUnits >= 100 && body.priceMinorUnits <= 100_000_000) {
    data.priceMinorUnits = body.priceMinorUnits;
  }
  if (Number.isSafeInteger(body?.durationMinutes) && body.durationMinutes >= 15 && body.durationMinutes <= 480) {
    data.durationMinutes = body.durationMinutes;
  }
  if (!Object.keys(data).length) {
    return Response.json({ error: "No valid service changes were supplied." }, { status: 400 });
  }

  try {
    const service = await prisma.$transaction(async (tx) => {
      const updated = await tx.service.update({ where: { id }, data });
      await tx.auditLog.create({
        data: {
          actorId: user.id,
          action: "SERVICE_UPDATED",
          targetType: "Service",
          targetId: id,
        },
      });
      return updated;
    });
    return Response.json({ service });
  } catch (error) {
    if (error?.code === "P2025") {
      return Response.json({ error: "Service not found." }, { status: 404 });
    }
    console.error("Failed to update service:", error);
    return Response.json({ error: "Could not update the service." }, { status: 500 });
  }
}
