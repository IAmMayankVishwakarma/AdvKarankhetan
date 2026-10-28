import { getSessionUser } from "@/lib/auth";
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
  const user = await getSessionUser();
  if (!user) return Response.json({ error: "Authentication required." }, { status: 401 });
  const { id } = await params;
  const parsed = await readJsonBody(request, 8192);
  if (parsed.error) return Response.json({ error: parsed.error }, { status: parsed.status });
  const action = parsed.body?.action;
  if (!["cancel", "reschedule"].includes(action)) {
    return Response.json({ error: "Unsupported appointment action." }, { status: 400 });
  }

  try {
    const settings = await getBusinessSettings(prisma);
    const booking = await prisma.booking.findFirst({
      where: { id, userId: user.id },
      include: { service: true },
    });
    if (!booking) return Response.json({ error: "Appointment not found." }, { status: 404 });
    if (!["CONFIRMED", "PENDING_PAYMENT"].includes(booking.status)) {
      return Response.json({ error: "This appointment can no longer be changed." }, { status: 409 });
    }
    if (action === "cancel") {
      const hoursLeft = (booking.startsAt.getTime() - Date.now()) / 3_600_000;
      if (hoursLeft < settings.cancellationHours) {
        return Response.json(
          { error: `Appointments can be cancelled at least ${settings.cancellationHours} hours in advance.` },
          { status: 409 },
        );
      }
      const saved = await prisma.$transaction(async (tx) => {
        const changed = await tx.booking.update({
          where: { id, userId: user.id, status: booking.status },
          data: { status: "CANCELLED" },
        });
        await tx.bookingChange.create({
          data: {
            bookingId: id,
            actorId: user.id,
            action: "USER_CANCELLED",
            previousStartsAt: booking.startsAt,
            previousEndsAt: booking.endsAt,
          },
        });
        return changed;
      });
      return Response.json({ booking: saved });
    }

    if (!settings.allowReschedule) {
      return Response.json({ error: "Rescheduling is currently unavailable." }, { status: 409 });
    }
    const dateKey = typeof parsed.body.date === "string" ? parsed.body.date : "";
    const time = typeof parsed.body.time === "string" ? parsed.body.time : "";
    const date = parseDateKey(dateKey);
    if (!date || parseTime(time) === null) {
      return Response.json({ error: "Select a valid appointment date and time." }, { status: 400 });
    }
    const startsAt = dateTimeInZoneToUtc(dateKey, time, settings.timeZone);
    if (!startsAt || startsAt <= new Date() || dateKeyInZone(startsAt, settings.timeZone) !== dateKey) {
      return Response.json({ error: "Select a valid future appointment time." }, { status: 400 });
    }
    const endsAt = new Date(startsAt.getTime() + booking.service.durationMinutes * 60_000);
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
    const endParts = new Intl.DateTimeFormat("en-GB", {
      timeZone: settings.timeZone,
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    }).formatToParts(endsAt);
    const endMinutes = parseTime(
      `${endParts.find((part) => part.type === "hour").value}:${endParts.find((part) => part.type === "minute").value}`,
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
      const changed = await tx.booking.update({
        where: { id, userId: user.id, status: booking.status },
        data: { startsAt, endsAt, timeZone: settings.timeZone },
      });
      await tx.bookingChange.create({
        data: {
          bookingId: id,
          actorId: user.id,
          action: "USER_RESCHEDULED",
          previousStartsAt: booking.startsAt,
          previousEndsAt: booking.endsAt,
          newStartsAt: startsAt,
          newEndsAt: endsAt,
        },
      });
      return changed;
    });
    return Response.json({ booking: saved });
  } catch (error) {
    if (error?.status) return Response.json({ error: error.message }, { status: error.status });
    if (error?.code === "P2025") return Response.json({ error: "Appointment changed concurrently." }, { status: 409 });
    console.error("Failed to update user appointment:", error);
    return Response.json({ error: "Could not update the appointment." }, { status: 500 });
  }
}
