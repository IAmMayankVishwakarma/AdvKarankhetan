import { getSessionUser } from "@/lib/auth";

export const runtime = "nodejs";

export async function GET() {
  try {
    const user = await getSessionUser();

    return Response.json(
      { user },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    console.error("Failed to read session:", error);
    return Response.json({ error: "Session unavailable." }, { status: 500 });
  }
}
