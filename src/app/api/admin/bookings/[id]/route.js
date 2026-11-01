import { authorizeAdmin } from "@/lib/auth";
import {
  dateKeyInZone,
  dateTimeInZoneToUtc,
  businessDayRange,
  dayRange,
  getBusinessSettings,
  lockAvailabilityDay,
  parseDateKey,
  parseTime,
} from "@/lib/booking";
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
  if (!["cancel", "reschedule", "complete"].includes(body?.action)) {
    return Response.json({ error: "Unsupported appointment action." }, { status: 400 });
  }

  try {
    const current = await prisma.booking.findUnique({
      where: { id },
      include: { service: true },
    });
    if (!current) return Response.json({ error: "Appointment not found." }, { status: 404 });
    if (!["CONFIRMED", "PENDING_PAYMENT"].includes(current.status)) {
      return Response.json({ error: "This appointment can no longer be changed." }, { status: 409 });
    }
    if (body.action === "complete" && current.status !== "CONFIRMED") {
      return Response.json({ error: "Only confirmed appointments can be completed." }, { status: 409 });
    }

    if (body.action === "complete" || body.action === "cancel") {
      const nextStatus = body.action === "complete" ? "COMPLETED" : "CANCELLED";
      const saved = await prisma.$transaction(async (tx) => {
        const booking = await tx.booking.update({
          where: { id, status: current.status },
          data: { status: nextStatus },
        });
        await tx.bookingChange.create({
          data: {
            bookingId: id,
            actorId: user.id,
            action: body.action === "complete" ? "ADMIN_COMPLETED" : "ADMIN_CANCELLED",
            previousStartsAt: current.startsAt,
            previousEndsAt: current.endsAt,
            reason: typeof body.reason === "string" ? body.reason.trim().slice(0, 500) : null,
          },
        });
        await tx.auditLog.create({
          data: { actorId: user.id, action: `BOOKING_${nextStatus}`, targetType: "Booking", targetId: id },
        });
        return booking;
      });
      return Response.json({ booking: saved });
    }

    const dateKey = typeof body.date === "string" ? body.date : "";
    const time = typeof body.time === "string" ? body.time : "";
    const date = parseDateKey(dateKey);
    if (!date || parseTime(time) === null) {
      return Response.json({ error: "Select a valid appointment date and time." }, { status: 400 });
    }
    const settings = await getBusinessSettings(prisma);
    const startsAt = dateTimeInZoneToUtc(dateKey, time, settings.timeZone);
    if (!startsAt || startsAt <= new Date() || dateKeyInZone(startsAt, settings.timeZone) !== dateKey) {
      return Response.json({ error: "Select a valid future appointment time." }, { status: 400 });
    }
    const endsAt = new Date(startsAt.getTime() + current.service.durationMinutes * 60_000);
    if (dateKeyInZone(endsAt, settings.timeZone) !== dateKey) {
      return Response.json({ error: "Appointment must fit within one business day." }, { status: 400 });
    }
    const { start: availabilityDate } = dayRange(date);
    const businessDay = businessDayRange(dateKey, settings.timeZone);
    if (!businessDay) {
      return Response.json({ error: "Could not resolve the selected business date." }, { status: 400 });
    }
    const { start: dayStart, end: dayEnd } = businessDay;
    const startMinutes = parseTime(time);
    const endTimeParts = new Intl.DateTimeFormat("en-GB", {
      timeZone: settings.timeZone,
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    }).formatToParts(endsAt);
    const endMinutes = parseTime(
      `${endTimeParts.find((part) => part.type === "hour").value}:${endTimeParts.find((part) => part.type === "minute").value}`,
    );

    const saved = await prisma.$transaction(async (tx) => {
      const availability = await lockAvailabilityDay(tx, availabilityDate, settings);
      const holiday = await tx.holiday.findUnique({ where: { date: availabilityDate } });
      const opening = parseTime(availability.opensAt ?? settings.defaultOpenTime);
      const closing = parseTime(availability.closesAt ?? settings.defaultCloseTime);
      if (
        !availability.isAvailable ||
        holiday ||
        opening === null ||
        closing === null ||
        startMinutes < opening ||
        endMinutes === null ||
        endMinutes > closing
      ) {
        throw Object.assign(new Error("The selected date or time is unavailable."), { status: 409 });
      }
      const now = new Date();
      const [dailyCount, overlaps] = await Promise.all([
        tx.booking.count({
          where: {
            id: { not: id },
            startsAt: { gte: dayStart, lt: dayEnd },
            OR: [
              { status: "CONFIRMED" },
              { status: "PENDING_PAYMENT", paymentExpiresAt: { gt: now } },
            ],
          },
        }),
        tx.booking.count({
          where: {
            id: { not: id },
            startsAt: { lt: endsAt },
            endsAt: { gt: startsAt },
            OR: [
              { status: "CONFIRMED" },
              { status: "PENDING_PAYMENT", paymentExpiresAt: { gt: now } },
            ],
          },
        }),
      ]);
      if (dailyCount >= availability.maxMeetings || overlaps > 0) {
        throw Object.assign(new Error("The selected time is full or conflicts with another appointment."), { status: 409 });
      }
      const booking = await tx.booking.update({
        where: { id },
        data: { startsAt, endsAt, timeZone: settings.timeZone },
      });
      await tx.bookingChange.create({
        data: {
          bookingId: id,
          actorId: user.id,
          action: "ADMIN_RESCHEDULED",
          previousStartsAt: current.startsAt,
          previousEndsAt: current.endsAt,
          newStartsAt: startsAt,
          newEndsAt: endsAt,
          reason: typeof body.reason === "string" ? body.reason.trim().slice(0, 500) : null,
        },
      });
      await tx.auditLog.create({
        data: { actorId: user.id, action: "BOOKING_RESCHEDULED", targetType: "Booking", targetId: id },
      });
      return booking;
    });
    return Response.json({ booking: saved });
  } catch (error) {
    if (error?.status) return Response.json({ error: error.message }, { status: error.status });
    if (error?.code === "P2025") return Response.json({ error: "Appointment changed concurrently." }, { status: 409 });
    console.error("Failed to update appointment:", error);
    return Response.json({ error: "Could not update the appointment." }, { status: 500 });
  }
}
