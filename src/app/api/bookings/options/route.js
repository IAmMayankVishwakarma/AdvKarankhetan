import { getSessionUser } from "@/lib/auth";
import {
  businessDayRange,
  dateKeyInZone,
  getBusinessSettings,
  parseDateKey,
  dayRange,
} from "@/lib/booking";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

function keyFor(date) {
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}-${String(date.getUTCDate()).padStart(2, "0")}`;
}

export async function GET() {
  const user = await getSessionUser();
  if (!user) return Response.json({ error: "Authentication required." }, { status: 401 });

  try {
    const [settings, services, userState] = await Promise.all([
      getBusinessSettings(prisma),
      prisma.service.findMany({
        where: { active: true },
        select: { id: true, name: true, description: true, priceMinorUnits: true, currency: true, durationMinutes: true },
        orderBy: { name: "asc" },
      }),
      prisma.user.findUnique({
        where: { id: user.id },
        select: { freeAppointmentUsedAt: true },
      }),
    ]);

    const todayKey = dateKeyInZone(new Date(), settings.timeZone);
    const today = parseDateKey(todayKey);
    const keys = Array.from({ length: 60 }, (_, index) => {
      const date = new Date(today.getTime() + index * 86_400_000);
      return keyFor(date);
    });
    const dates = keys.map(parseDateKey);
    const startRecord = dayRange(dates[0]).start;
    const endRecord = new Date(dayRange(dates[dates.length - 1]).start.getTime() + 86_400_000);
    const [availabilityRows, holidays, bookings] = await Promise.all([
      prisma.dailyAvailability.findMany({
        where: { date: { gte: startRecord, lt: endRecord } },
      }),
      prisma.holiday.findMany({
        where: { date: { gte: startRecord, lt: endRecord } },
        select: { date: true, description: true },
      }),
      prisma.booking.findMany({
        where: {
          status: { in: ["CONFIRMED", "PENDING_PAYMENT"] },
          startsAt: {
            gte: businessDayRange(keys[0], settings.timeZone).start,
            lt: businessDayRange(keys[keys.length - 1], settings.timeZone).end,
          },
          OR: [
            { status: "CONFIRMED" },
            { status: "PENDING_PAYMENT", paymentExpiresAt: { gt: new Date() } },
          ],
        },
        select: { startsAt: true },
      }),
    ]);
    const availabilityByDate = new Map(
      availabilityRows.map((row) => [keyFor(row.date), row]),
    );
    const holidaysByDate = new Map(holidays.map((holiday) => [keyFor(holiday.date), holiday]));
    const counts = new Map();
    for (const booking of bookings) {
      const date = dateKeyInZone(booking.startsAt, settings.timeZone);
      counts.set(date, (counts.get(date) ?? 0) + 1);
    }
    const days = keys.map((date) => {
      const day = availabilityByDate.get(date);
      const holiday = holidaysByDate.get(date);
      const maxMeetings = day?.maxMeetings ?? settings.defaultMaxMeetings;
      const bookedCount = counts.get(date) ?? 0;
      const isAvailable = (day?.isAvailable ?? true) && !holiday && bookedCount < maxMeetings;
      return {
        date,
        available: isAvailable,
        bookedCount,
        maxMeetings,
        opensAt: day?.opensAt ?? settings.defaultOpenTime,
        closesAt: day?.closesAt ?? settings.defaultCloseTime,
        holiday: holiday?.description ?? null,
      };
    });

    return Response.json(
      {
        services,
        days,
        timeZone: settings.timeZone,
        hasFreeAppointment: !userState.freeAppointmentUsedAt,
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    console.error("Failed to load booking options:", error);
    return Response.json({ error: "Could not load booking options." }, { status: 500 });
  }
}
