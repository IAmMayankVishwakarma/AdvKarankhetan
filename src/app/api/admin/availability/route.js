import { authorizeAdmin } from "@/lib/auth";
import { parseDateKey, parseTime, dayRange } from "@/lib/booking";
import { readJsonBody, rejectCrossOriginRequest } from "@/lib/http";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET(request) {
  const { response } = await authorizeAdmin();
  if (response) return response;
  const url = new URL(request.url);
  const from = parseDateKey(url.searchParams.get("from"));
  const to = parseDateKey(url.searchParams.get("to"));
  if (!from || !to || to < from || to.getTime() - from.getTime() > 90 * 86400_000) {
    return Response.json({ error: "Select a date range of up to 90 days." }, { status: 400 });
  }
  try {
    const days = await prisma.dailyAvailability.findMany({
      where: { date: { gte: from, lt: new Date(to.getTime() + 86400_000) } },
      orderBy: { date: "asc" },
    });
    const settings = await prisma.businessSetting.findUnique({ where: { id: "default" } });
    return Response.json({ days, settings }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("Failed to read admin availability:", error);
    return Response.json({ error: "Could not load availability." }, { status: 500 });
  }
}

export async function PUT(request) {
  const originError = rejectCrossOriginRequest(request);
  if (originError) return originError;
  const { user, response } = await authorizeAdmin();
  if (response) return response;
  const parsed = await readJsonBody(request, 8192);
  if (parsed.error) return Response.json({ error: parsed.error }, { status: parsed.status });
  const body = parsed.body;
  const date = parseDateKey(body?.date);
  const opensAt = body?.opensAt;
  const closesAt = body?.closesAt;
  if (
    !date ||
    typeof body?.isAvailable !== "boolean" ||
    !Number.isSafeInteger(body.maxMeetings) ||
    body.maxMeetings < 0 ||
    body.maxMeetings > 100 ||
    parseTime(opensAt) === null ||
    parseTime(closesAt) === null ||
    parseTime(opensAt) >= parseTime(closesAt)
  ) {
    return Response.json({ error: "Enter a valid date, capacity, and operating hours." }, { status: 400 });
  }
  const { start: day } = dayRange(date);
  try {
    const availability = await prisma.$transaction(async (tx) => {
      const updated = await tx.dailyAvailability.upsert({
        where: { date: day },
        update: { isAvailable: body.isAvailable, maxMeetings: body.maxMeetings, opensAt, closesAt },
        create: {
          date: day,
          isAvailable: body.isAvailable,
          maxMeetings: body.maxMeetings,
          opensAt,
          closesAt,
        },
      });
      await tx.auditLog.create({
        data: {
          actorId: user.id,
          action: "AVAILABILITY_UPDATED",
          targetType: "DailyAvailability",
          targetId: updated.id,
        },
      });
      return updated;
    });
    return Response.json({ availability });
  } catch (error) {
    console.error("Failed to update availability:", error);
    return Response.json({ error: "Could not update availability." }, { status: 500 });
  }
}
