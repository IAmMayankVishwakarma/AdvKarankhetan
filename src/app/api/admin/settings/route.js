import { authorizeAdmin } from "@/lib/auth";
import { getBusinessSettings, parseTime } from "@/lib/booking";
import { readJsonBody, rejectCrossOriginRequest } from "@/lib/http";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET() {
  const { response } = await authorizeAdmin();
  if (response) return response;
  try {
    const settings = await getBusinessSettings(prisma);
    return Response.json({ settings }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("Failed to load business settings:", error);
    return Response.json({ error: "Could not load settings." }, { status: 500 });
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
  const timeZone = typeof body?.timeZone === "string" ? body.timeZone.trim() : "";
  try {
    new Intl.DateTimeFormat("en", { timeZone });
  } catch {
    return Response.json({ error: "Choose a valid timezone." }, { status: 400 });
  }
  if (
    !Number.isSafeInteger(body.defaultMaxMeetings) ||
    body.defaultMaxMeetings < 0 ||
    body.defaultMaxMeetings > 100 ||
    parseTime(body.defaultOpenTime) === null ||
    parseTime(body.defaultCloseTime) === null ||
    parseTime(body.defaultOpenTime) >= parseTime(body.defaultCloseTime) ||
    !Number.isSafeInteger(body.cancellationHours) ||
    body.cancellationHours < 0 ||
    body.cancellationHours > 720 ||
    typeof body.allowReschedule !== "boolean"
  ) {
    return Response.json({ error: "Enter valid operating and cancellation settings." }, { status: 400 });
  }
  try {
    await getBusinessSettings(prisma);
    const settings = await prisma.$transaction(async (tx) => {
      const saved = await tx.businessSetting.update({
        where: { id: "default" },
        data: {
          timeZone,
          defaultMaxMeetings: body.defaultMaxMeetings,
          defaultOpenTime: body.defaultOpenTime,
          defaultCloseTime: body.defaultCloseTime,
          cancellationHours: body.cancellationHours,
          allowReschedule: body.allowReschedule,
        },
      });
      await tx.auditLog.create({
        data: {
          actorId: user.id,
          action: "BUSINESS_SETTINGS_UPDATED",
          targetType: "BusinessSetting",
          targetId: "default",
        },
      });
      return saved;
    });
    return Response.json({ settings });
  } catch (error) {
    console.error("Failed to update business settings:", error);
    return Response.json({ error: "Could not save settings." }, { status: 500 });
  }
}
