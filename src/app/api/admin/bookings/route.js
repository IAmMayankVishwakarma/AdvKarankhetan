import { authorizeAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET(request) {
  const { response } = await authorizeAdmin();
  if (response) return response;
  const url = new URL(request.url);
  const status = url.searchParams.get("status");
  const paymentStatus = url.searchParams.get("paymentStatus");
  const search = url.searchParams.get("q")?.trim();
  const validStatuses = new Set(["PENDING_PAYMENT", "CONFIRMED", "CANCELLED", "COMPLETED", "PAYMENT_FAILED"]);
  try {
    const bookings = await prisma.booking.findMany({
      where: {
        ...(status && validStatuses.has(status) ? { status } : {}),
        ...(paymentStatus ? { paymentStatus } : {}),
        ...(search
          ? {
              user: {
                OR: [
                  { name: { contains: search } },
                  { email: { contains: search } },
                ],
              },
            }
          : {}),
      },
      include: {
        user: { select: { id: true, name: true, email: true } },
        service: { select: { name: true, durationMinutes: true } },
        payment: {
          select: {
            status: true,
            amountMinorUnits: true,
            currency: true,
            provider: true,
            providerOrderId: true,
            providerPaymentId: true,
          },
        },
      },
      orderBy: { startsAt: "desc" },
      take: 100,
    });
    return Response.json({ bookings }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("Failed to load admin appointments:", error);
    return Response.json({ error: "Could not load appointments." }, { status: 500 });
  }
}
