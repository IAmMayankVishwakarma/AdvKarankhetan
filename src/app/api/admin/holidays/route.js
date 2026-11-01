import { authorizeAdmin } from "@/lib/auth";
import { dayRange, parseDateKey } from "@/lib/booking";
import { readJsonBody, rejectCrossOriginRequest } from "@/lib/http";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET() {
  const { response } = await authorizeAdmin();
  if (response) return response;
  try {
    const holidays = await prisma.holiday.findMany({ orderBy: { date: "asc" } });
    return Response.json({ holidays }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("Failed to load holidays:", error);
    return Response.json({ error: "Could not load holidays." }, { status: 500 });
  }
}

export async function POST(request) {
  const originError = rejectCrossOriginRequest(request);
  if (originError) return originError;
  const { user, response } = await authorizeAdmin();
  if (response) return response;
  const parsed = await readJsonBody(request, 8192);
  if (parsed.error) return Response.json({ error: parsed.error }, { status: parsed.status });
  const date = parseDateKey(parsed.body?.date);
  const description =
    typeof parsed.body?.description === "string" ? parsed.body.description.trim() : "";
  if (!date || description.length < 2 || description.length > 180) {
    return Response.json({ error: "Enter a valid holiday date and reason." }, { status: 400 });
  }
  const { start } = dayRange(date);
  try {
    const holiday = await prisma.$transaction(async (tx) => {
      const saved = await tx.holiday.upsert({
        where: { date: start },
        update: { description },
        create: { date: start, description },
      });
      await tx.auditLog.create({
        data: {
          actorId: user.id,
          action: "HOLIDAY_SAVED",
          targetType: "Holiday",
          targetId: saved.id,
        },
      });
      return saved;
    });
    return Response.json({ holiday }, { status: 201 });
  } catch (error) {
    console.error("Failed to save holiday:", error);
    return Response.json({ error: "Could not save holiday." }, { status: 500 });
  }
}
