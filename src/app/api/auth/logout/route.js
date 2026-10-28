import { deleteCurrentSession } from "@/lib/auth";
import { rejectCrossOriginRequest } from "@/lib/http";

export const runtime = "nodejs";

export async function POST(request) {
  const originError = rejectCrossOriginRequest(request);
  if (originError) return originError;

  try {
    await deleteCurrentSession();
    return Response.json({ message: "Signed out." });
  } catch (error) {
    console.error("Failed to sign out:", error);
    return Response.json({ error: "Could not sign out." }, { status: 500 });
  }
}
