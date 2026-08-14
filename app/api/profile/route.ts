import { ApiError, handleApiError, json, readJson, requireFields } from "@/lib/http";
import { requireApiProfile } from "@/lib/server/session";
import { createClient } from "@/lib/supabase/server";

type ProfileBody = {
  fullName?: string;
};

export async function PATCH(request: Request) {
  try {
    const profile = await requireApiProfile();
    const body = await readJson<ProfileBody>(request);
    requireFields(body, ["fullName"]);

    const fullName = body.fullName!.trim();
    if (!fullName) {
      throw new ApiError(400, "Nama wajib diisi");
    }

    const supabase = await createClient();
    const { data, error } = await supabase
      .from("profiles")
      .update({ full_name: fullName })
      .eq("id", profile.id)
      .select("*")
      .single();

    if (error) {
      throw new ApiError(400, error.message);
    }

    return json({ profile: data });
  } catch (error) {
    return handleApiError(error);
  }
}
