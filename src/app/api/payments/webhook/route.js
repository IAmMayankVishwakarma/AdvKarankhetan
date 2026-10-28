import { createHmac, timingSafeEqual } from "node:crypto";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

function validSignature(body, suppliedSignature, secret) {
  if (!/^[a-f0-9]{64}$/i.test(suppliedSignature ?? "")) return false;
  const expected = createHmac("sha256", secret).update(body).digest();
  const actual = Buffer.from(suppliedSignature, "hex");
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

export async function POST(request) {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret) return Response.json({ error: "Webhook is not configured." }, { status: 503 });
  const signature = request.headers.get("x-razorpay-signature");
  const eventId = request.headers.get("x-razorpay-event-id");
  const rawBody = await request.text();
  if (!eventId || eventId.length > 191 || !validSignature(rawBody, signature, secret)) {
    return Response.json({ error: "Invalid webhook signature or event id." }, { status: 400 });
  }

  let event;
  try {
    event = JSON.parse(rawBody);
  } catch {
    return Response.json({ error: "Invalid webhook payload." }, { status: 400 });
  }
  const eventType = typeof event?.event === "string" ? event.event : "";
  const paymentEntity = event?.payload?.payment?.entity ?? null;
  const refundEntity = event?.payload?.refund?.entity ?? null;
  const entity = paymentEntity ?? refundEntity;
  if (!eventType) return Response.json({ error: "Invalid webhook event." }, { status: 400 });

  try {
    await prisma.$transaction(async (tx) => {
      const exists = await tx.paymentWebhookEvent.findUnique({ where: { eventId } });
      if (exists) return;
      await tx.paymentWebhookEvent.create({
        data: {
          eventId,
          eventType,
          paymentId: typeof entity?.id === "string" ? entity.id : null,
        },
      });

      const payment = eventType === "refund.processed"
        ? typeof refundEntity?.payment_id === "string"
          ? await tx.payment.findUnique({
            where: { providerPaymentId: refundEntity?.payment_id },
            include: { booking: true },
          })
          : null
        : typeof paymentEntity?.order_id === "string"
          ? await tx.payment.findUnique({
              where: { providerOrderId: paymentEntity.order_id },
              include: { booking: true },
            })
          : null;
      if (!payment) return;

      if (eventType === "payment.captured" || eventType === "order.paid") {
        const paymentId = paymentEntity?.id;
        if (
          paymentEntity?.status !== "captured" ||
          paymentEntity.amount !== payment.amountMinorUnits ||
          paymentEntity.currency !== payment.currency ||
          typeof paymentId !== "string"
        ) {
          return;
        }
        await tx.payment.update({
          where: { id: payment.id },
          data: { status: "PAID", providerPaymentId: paymentId },
        });
        if (payment.booking.status === "PENDING_PAYMENT" && payment.booking.paymentExpiresAt > new Date()) {
          await tx.booking.update({
            where: { id: payment.bookingId, status: "PENDING_PAYMENT" },
            data: { status: "CONFIRMED", paymentStatus: "PAID", paymentExpiresAt: null },
          });
        } else if (payment.booking.status !== "CONFIRMED") {
          await tx.booking.updateMany({
            where: { id: payment.bookingId, status: "PENDING_PAYMENT" },
            data: { status: "PAYMENT_FAILED", paymentStatus: "PAID", paymentExpiresAt: null },
          });
        }
      } else if (eventType === "payment.failed") {
        if (
          paymentEntity?.amount !== payment.amountMinorUnits ||
          paymentEntity.currency !== payment.currency
        ) {
          return;
        }
        await tx.payment.update({
          where: { id: payment.id },
          data: { status: "FAILED", providerPaymentId: paymentEntity?.id ?? undefined },
        });
        await tx.booking.updateMany({
          where: { id: payment.bookingId, status: "PENDING_PAYMENT" },
          data: { status: "PAYMENT_FAILED", paymentStatus: "FAILED", paymentExpiresAt: null },
        });
      } else if (eventType === "refund.processed") {
        const fullyRefunded = refundEntity?.amount === payment.amountMinorUnits;
        await tx.payment.update({
          where: { id: payment.id },
          data: { status: fullyRefunded ? "REFUNDED" : "PARTIALLY_REFUNDED" },
        });
        await tx.booking.update({
          where: { id: payment.bookingId },
          data: { paymentStatus: fullyRefunded ? "REFUNDED" : "PARTIALLY_REFUNDED" },
        });
      }
    });
    return Response.json({ received: true });
  } catch (error) {
    if (error?.code === "P2002") return Response.json({ received: true });
    console.error("Failed to process Razorpay webhook:", error);
    return Response.json({ error: "Webhook processing failed." }, { status: 500 });
  }
}
