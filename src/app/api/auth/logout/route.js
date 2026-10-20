import { deleteCurrentSession } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST() {
  try {
    await deleteCurrentSession();
    return Response.json({ message: "Signed out." });
  } catch (error) {
    console.error("Failed to sign out:", error);
    return Response.json({ error: "Could not sign out." }, { status: 500 });
  }
}
