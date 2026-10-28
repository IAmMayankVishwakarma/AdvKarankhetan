import { authorizeAdmin } from "@/lib/auth";
import { rejectCrossOriginRequest } from "@/lib/http";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function DELETE(request, { params }) {
  const originError = rejectCrossOriginRequest(request);
  if (originError) return originError;
  const { user, response } = await authorizeAdmin();
  if (response) return response;
  const { id } = await params;
  try {
    await prisma.$transaction(async (tx) => {
      await tx.holiday.delete({ where: { id } });
      await tx.auditLog.create({
        data: {
          actorId: user.id,
          action: "HOLIDAY_DELETED",
          targetType: "Holiday",
          targetId: id,
        },
      });
    });
    return Response.json({ deleted: true });
  } catch (error) {
    if (error?.code === "P2025") {
      return Response.json({ error: "Holiday not found." }, { status: 404 });
    }
    console.error("Failed to delete holiday:", error);
    return Response.json({ error: "Could not delete holiday." }, { status: 500 });
  }
}
