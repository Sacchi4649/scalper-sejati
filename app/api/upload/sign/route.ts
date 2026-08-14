import { createSignedUpload } from "@/lib/cloudinary";
import { handleApiError, json } from "@/lib/http";
import { requireApiRole } from "@/lib/server/session";

export async function POST() {
  try {
    await requireApiRole("super_admin");
    return json(createSignedUpload());
  } catch (error) {
    return handleApiError(error);
  }
}
