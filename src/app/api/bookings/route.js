import { randomUUID } from "node:crypto";
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

function errorResponse(message, status = 400) {
  return Response.json({ error: message }, { status });
}

function bookingResult(booking) {
  return {
    booking: {
      id: booking.id,
      startsAt: booking.startsAt,
      endsAt: booking.endsAt,
      status: booking.status,
      paymentStatus: booking.paymentStatus,
      amountMinorUnits: booking.amountMinorUnits,
      currency: booking.service.currency,
      isFreeAppointment: booking.isFreeAppointment,
      service: { name: booking.service.name },
    },
    payment: booking.payment
      ? {
          orderId: booking.payment.providerOrderId,
          amountMinorUnits: booking.payment.amountMinorUnits,
          currency: booking.payment.currency,
          status: booking.payment.status,
          keyId: booking.payment.providerOrderId ? process.env.RAZORPAY_KEY_ID : null,
        }
      : null,
  };
}

async function existingBooking(userId, idempotencyKey) {
  const booking = await prisma.booking.findUnique({
    where: { idempotencyKey },
    include: { service: true, payment: true },
  });
  if (!booking || booking.userId !== userId) return null;
  return bookingResult(booking);
}

export async function GET() {
  const user = await getSessionUser();
  if (!user) return errorResponse("Authentication required.", 401);

  try {
    const bookings = await prisma.booking.findMany({
      where: { userId: user.id },
      include: {
        service: { select: { name: true, currency: true } },
        payment: {
          select: {
            amountMinorUnits: true,
            currency: true,
            status: true,
            providerPaymentId: true,
          },
        },
      },
      orderBy: { startsAt: "desc" },
    });
    const account = await prisma.user.findUnique({
      where: { id: user.id },
      select: { freeAppointmentUsedAt: true },
    });
    return Response.json(
      { bookings, hasFreeAppointment: !account?.freeAppointmentUsedAt },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    console.error("Failed to load user bookings:", error);
    return errorResponse("Could not load appointments.", 500);
  }
}

export async function POST(request) {
  const originError = rejectCrossOriginRequest(request);
  if (originError) return originError;

  const user = await getSessionUser();
  if (!user) return errorResponse("Authentication required.", 401);

  const idempotencyKey = request.headers.get("idempotency-key");
  if (!idempotencyKey || !/^[A-Za-z0-9-]{16,80}$/.test(idempotencyKey)) {
    return errorResponse("A valid Idempotency-Key header is required.");
  }
  const existing = await existingBooking(user.id, idempotencyKey);
  if (existing) return Response.json(existing, { status: 200 });

  const parsed = await readJsonBody(request, 8192);
  if (parsed.error) return errorResponse(parsed.error, parsed.status);
  const body = parsed.body;
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return errorResponse("Invalid request body.");
  }

  const serviceId =
    typeof body.serviceId === "string" ? body.serviceId.trim() : "";
  const dateKey = typeof body.date === "string" ? body.date : "";
  const time = typeof body.time === "string" ? body.time : "";
  const date = parseDateKey(dateKey);
  if (!serviceId || !date || parseTime(time) === null) {
    return errorResponse("Select a valid service, date, and time.");
  }

  try {
    const settings = await getBusinessSettings(prisma);
    const startsAt = dateTimeInZoneToUtc(dateKey, time, settings.timeZone);
    if (!startsAt || startsAt <= new Date()) {
      return errorResponse("Choose a valid future appointment time.");
    }
    const localDate = dateKeyInZone(startsAt, settings.timeZone);
    if (localDate !== dateKey) {
      return errorResponse("Appointment time is invalid for the business timezone.");
    }

    const service = await prisma.service.findFirst({
      where: { id: serviceId, active: true },
      select: {
        id: true,
        name: true,
        priceMinorUnits: true,
        currency: true,
        durationMinutes: true,
      },
    });
    if (!service) return errorResponse("That service is unavailable.", 404);

    const endsAt = new Date(startsAt.getTime() + service.durationMinutes * 60_000);
    const endLocalDate = dateKeyInZone(endsAt, settings.timeZone);
    const startMinutes = parseTime(time);
    const endParts = new Intl.DateTimeFormat("en-GB", {
      timeZone: settings.timeZone,
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    }).formatToParts(endsAt);
    const endTime = `${endParts.find((part) => part.type === "hour").value}:${endParts.find((part) => part.type === "minute").value}`;
    const endMinutes = parseTime(endTime);
    if (endLocalDate !== dateKey || endMinutes === null) {
      return errorResponse("Appointment must fit within one business day.");
    }

    const { start: availabilityDate } = dayRange(date);
    const businessDay = businessDayRange(dateKey, settings.timeZone);
    if (!businessDay) return errorResponse("Could not resolve the selected business date.", 400);
    const { start: dayStart, end: dayEnd } = businessDay;
    const result = await prisma.$transaction(async (tx) => {
      await tx.$queryRaw`SELECT \`id\` FROM \`User\` WHERE \`id\` = ${user.id} FOR UPDATE`;
      const availability = await lockAvailabilityDay(tx, availabilityDate, settings);
      if (!availability.isAvailable) {
        throw Object.assign(new Error("This date is unavailable."), { status: 409 });
      }
      const holiday = await tx.holiday.findUnique({ where: { date: availabilityDate } });
      if (holiday) {
        throw Object.assign(new Error("This date is unavailable."), { status: 409 });
      }
      const opening = parseTime(availability.opensAt ?? settings.defaultOpenTime);
      const closing = parseTime(availability.closesAt ?? settings.defaultCloseTime);
      if (
        opening === null ||
        closing === null ||
        startMinutes < opening ||
        endMinutes > closing
      ) {
        throw Object.assign(new Error("Choose a time within the available hours."), { status: 409 });
      }

      const now = new Date();
      const [dailyCount, overlapCount] = await Promise.all([
        tx.booking.count({
          where: {
            startsAt: { gte: dayStart, lt: dayEnd },
            OR: [
              { status: "CONFIRMED" },
              { status: "PENDING_PAYMENT", paymentExpiresAt: { gt: now } },
            ],
          },
        }),
        tx.booking.count({
          where: {
            startsAt: { lt: endsAt },
            endsAt: { gt: startsAt },
            OR: [
              { status: "CONFIRMED" },
              { status: "PENDING_PAYMENT", paymentExpiresAt: { gt: now } },
            ],
          },
        }),
      ]);
      if (dailyCount >= availability.maxMeetings) {
        throw Object.assign(new Error("No appointments remain for this date."), { status: 409 });
      }
      if (overlapCount > 0) {
        throw Object.assign(new Error("That time has already been booked."), { status: 409 });
      }

      const lockedUser = await tx.user.findUnique({
        where: { id: user.id },
        select: { freeAppointmentUsedAt: true },
      });
      const isFreeAppointment = !lockedUser.freeAppointmentUsedAt;
      const amountMinorUnits = isFreeAppointment ? 0 : service.priceMinorUnits;
      const paymentExpiresAt = isFreeAppointment
        ? null
        : new Date(now.getTime() + 15 * 60_000);
      const booking = await tx.booking.create({
        data: {
          id: randomUUID(),
          userId: user.id,
          serviceId: service.id,
          startsAt,
          endsAt,
          timeZone: settings.timeZone,
          status: isFreeAppointment ? "CONFIRMED" : "PENDING_PAYMENT",
          paymentStatus: isFreeAppointment ? "FREE" : "UNPAID",
          amountMinorUnits,
          isFreeAppointment,
          paymentExpiresAt,
          idempotencyKey,
          ...(isFreeAppointment
            ? {}
            : {
                payment: {
                  create: {
                    provider: "razorpay",
                    amountMinorUnits,
                    currency: service.currency,
                    status: "PENDING",
                  },
                },
              }),
        },
        include: { service: true, payment: true },
      });

      if (isFreeAppointment) {
        await tx.user.update({
          where: { id: user.id },
          data: { freeAppointmentUsedAt: now },
        });
      }
      return booking;
    });

    if (result.isFreeAppointment) {
      return Response.json(bookingResult(result), { status: 201 });
    }

    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keyId || !keySecret) {
      await prisma.booking.update({
        where: { id: result.id },
        data: { status: "PAYMENT_FAILED", paymentStatus: "FAILED" },
      });
      await prisma.payment.update({
        where: { bookingId: result.id },
        data: { status: "FAILED" },
      });
      return errorResponse("Online payment is not configured yet.", 503);
    }

    let order;
    try {
      const razorpayResponse = await fetch("https://api.razorpay.com/v1/orders", {
        method: "POST",
        headers: {
          Authorization: `Basic ${Buffer.from(`${keyId}:${keySecret}`).toString("base64")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: result.amountMinorUnits,
          currency: result.service.currency,
          receipt: result.id,
          notes: { bookingId: result.id },
        }),
        signal: AbortSignal.timeout(10_000),
      });
      if (!razorpayResponse.ok) {
        console.error("Razorpay order creation failed with status:", razorpayResponse.status);
        throw new Error("Razorpay rejected order creation.");
      }
      order = await razorpayResponse.json();
      if (
        typeof order?.id !== "string" ||
        order.amount !== result.amountMinorUnits ||
        order.currency !== result.service.currency
      ) {
        throw new Error("Razorpay returned an invalid order.");
      }
    } catch (error) {
      console.error("Razorpay order creation failed:", error);
      await prisma.booking.update({
        where: { id: result.id },
        data: { status: "PAYMENT_FAILED", paymentStatus: "FAILED", paymentExpiresAt: null },
      });
      await prisma.payment.update({
        where: { bookingId: result.id },
        data: { status: "FAILED" },
      });
      return errorResponse("Could not start payment. Please try booking again.", 502);
    }
    const updated = await prisma.payment.update({
      where: { bookingId: result.id },
      data: { providerOrderId: order.id },
      include: { booking: { include: { service: true, payment: true } } },
    });
    return Response.json(
      {
        ...bookingResult(updated.booking),
        payment: {
          ...bookingResult(updated.booking).payment,
          orderId: order.id,
          keyId,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    if (error?.status) return errorResponse(error.message, error.status);
    if (error?.code === "P2002") {
      const repeated = await existingBooking(user.id, idempotencyKey);
      if (repeated) return Response.json(repeated);
    }
    console.error("Failed to create appointment:", error);
    return errorResponse("Could not create the appointment. Please try again.", 500);
  }
}
