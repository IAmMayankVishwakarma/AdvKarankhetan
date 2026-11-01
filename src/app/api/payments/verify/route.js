import { createHmac, timingSafeEqual } from "node:crypto";
import { getSessionUser } from "@/lib/auth";
import { readJsonBody, rejectCrossOriginRequest } from "@/lib/http";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

function matchesSignature(expectedHex, actualHex) {
  if (!/^[a-f0-9]{64}$/i.test(actualHex ?? "")) return false;
  const expected = Buffer.from(expectedHex, "hex");
  const actual = Buffer.from(actualHex, "hex");
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}

export async function POST(request) {
  const originError = rejectCrossOriginRequest(request);
  if (originError) return originError;
  const user = await getSessionUser();
  if (!user) return Response.json({ error: "Authentication required." }, { status: 401 });
  const parsed = await readJsonBody(request, 8192);
  if (parsed.error) return Response.json({ error: parsed.error }, { status: parsed.status });
  const orderId = parsed.body?.razorpay_order_id;
  const paymentId = parsed.body?.razorpay_payment_id;
  const signature = parsed.body?.razorpay_signature;
  if (
    typeof orderId !== "string" ||
    typeof paymentId !== "string" ||
    typeof signature !== "string"
  ) {
    return Response.json({ error: "Invalid payment verification data." }, { status: 400 });
  }
  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!secret || !process.env.RAZORPAY_KEY_ID) {
    return Response.json({ error: "Payment verification is not configured." }, { status: 503 });
  }

  try {
    const payment = await prisma.payment.findUnique({
      where: { providerOrderId: orderId },
      include: { booking: true },
    });
    if (!payment || payment.booking.userId !== user.id) {
      return Response.json({ error: "Payment was not found." }, { status: 404 });
    }
    const expected = createHmac("sha256", secret)
      .update(`${orderId}|${paymentId}`)
      .digest("hex");
    if (!matchesSignature(expected, signature)) {
      return Response.json({ error: "Payment signature is invalid." }, { status: 400 });
    }

    const providerResponse = await fetch(
      `https://api.razorpay.com/v1/payments/${encodeURIComponent(paymentId)}`,
      {
        headers: {
          Authorization: `Basic ${Buffer.from(`${process.env.RAZORPAY_KEY_ID}:${secret}`).toString("base64")}`,
        },
        signal: AbortSignal.timeout(10_000),
      },
    );
    if (!providerResponse.ok) {
      console.error("Razorpay payment lookup failed with status:", providerResponse.status);
      return Response.json({ error: "Could not verify payment with the provider." }, { status: 502 });
    }
    const verified = await providerResponse.json();
    if (
      verified.status !== "captured" ||
      verified.order_id !== orderId ||
      verified.amount !== payment.amountMinorUnits ||
      verified.currency !== payment.currency
    ) {
      return Response.json({ error: "Payment is not captured for this appointment." }, { status: 409 });
    }

    const result = await prisma.$transaction(async (tx) => {
      await tx.$queryRaw`SELECT "id" FROM "Payment" WHERE "id" = ${payment.id} FOR UPDATE`;
      const current = await tx.payment.findUnique({
        where: { id: payment.id },
        include: { booking: true },
      });
      if (current.status === "PAID" && current.booking.status === "CONFIRMED") {
        return { confirmed: true };
      }
      if (
        current.booking.status === "PENDING_PAYMENT" &&
        (current.booking.paymentExpiresAt <= new Date() ||
          current.booking.startsAt <= new Date())
      ) {
        await tx.payment.update({
          where: { id: payment.id },
          data: { status: "PAID", providerPaymentId: paymentId },
        });
        await tx.booking.update({
          where: { id: current.booking.id },
          data: { status: "PAYMENT_FAILED", paymentStatus: "PAID", paymentExpiresAt: null },
        });
        return { confirmed: false };
      }
      if (current.booking.status !== "PENDING_PAYMENT") {
        await tx.payment.update({
          where: { id: payment.id },
          data: { status: "PAID", providerPaymentId: paymentId },
        });
        return { confirmed: false };
      }
      await tx.payment.update({
        where: { id: payment.id },
        data: { status: "PAID", providerPaymentId: paymentId },
      });
      await tx.booking.update({
        where: { id: current.booking.id, status: "PENDING_PAYMENT" },
        data: { status: "CONFIRMED", paymentStatus: "PAID", paymentExpiresAt: null },
      });
      return { confirmed: true };
    });
    if (!result.confirmed) {
      return Response.json(
        { error: "Payment was received after the appointment could no longer be confirmed. Contact support for a refund." },
        { status: 409 },
      );
    }
    return Response.json({ status: "confirmed" });
  } catch (error) {
    console.error("Failed to verify Razorpay payment:", error);
    return Response.json({ error: "Could not verify payment." }, { status: 500 });
  }
}
