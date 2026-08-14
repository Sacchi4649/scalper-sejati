import { ApiError, handleApiError, json, readJson, requireFields } from "@/lib/http";
import { requireApiProfile } from "@/lib/server/session";
import { createClient } from "@/lib/supabase/server";

type PasswordBody = {
  currentPassword?: string;
  newPassword?: string;
};

export async function POST(request: Request) {
  try {
    await requireApiProfile();
    const body = await readJson<PasswordBody>(request);
    requireFields(body, ["currentPassword", "newPassword"]);

    if ((body.newPassword ?? "").length < 8) {
      throw new ApiError(400, "Kata sandi baru minimal 8 karakter");
    }
    if (body.currentPassword === body.newPassword) {
      throw new ApiError(400, "Kata sandi baru harus berbeda dari yang sekarang");
    }

    const supabase = await createClient();
    const { data: userData, error: userError } = await supabase.auth.getUser();
    const email = userData.user?.email;

    if (userError || !email) {
      throw new ApiError(401, "Silakan masuk terlebih dahulu");
    }

    const { error: verifyError } = await supabase.auth.signInWithPassword({
      email,
      password: body.currentPassword!,
    });

    if (verifyError) {
      throw new ApiError(400, "Kata sandi saat ini salah");
    }

    const { error } = await supabase.auth.updateUser({
      password: body.newPassword!,
    });

    if (error) {
      throw new ApiError(400, error.message);
    }

    return json({ ok: true });
  } catch (error) {
    return handleApiError(error);
  }
}
