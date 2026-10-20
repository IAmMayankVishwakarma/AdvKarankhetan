import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;

    return Response.json(
      { status: "ok", database: "connected" },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    console.error("API health check failed:", error);

    return Response.json(
      { status: "error", database: "unavailable" },
      {
        status: 503,
        headers: { "Cache-Control": "no-store" },
      },
    );
  }
}
