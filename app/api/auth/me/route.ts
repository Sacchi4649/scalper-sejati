import { handleApiError, json } from "@/lib/http";
import { requireApiProfile } from "@/lib/server/session";

export async function GET() {
  try {
    const profile = await requireApiProfile();
    return json({ profile });
  } catch (error) {
    return handleApiError(error);
  }
}
