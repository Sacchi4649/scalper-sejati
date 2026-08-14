import { ApiError, handleApiError, json, readJson, requireFields } from "@/lib/http";
import { createClient } from "@/lib/supabase/server";

type RegisterBody = {
  email?: string;
  password?: string;
  fullName?: string;
};

export async function POST(request: Request) {
  try {
    const body = await readJson<RegisterBody>(request);
    requireFields(body, ["email", "password", "fullName"]);

    if ((body.password ?? "").length < 8) {
      throw new ApiError(400, "Kata sandi minimal 8 karakter");
    }

    const supabase = await createClient();
    const { error } = await supabase.auth.signUp({
      email: body.email!.trim(),
      password: body.password!,
      options: {
        data: {
          full_name: body.fullName!.trim(),
        },
      },
    });

    if (error) {
      throw new ApiError(400, error.message);
    }

    return json({ ok: true });
  } catch (error) {
    return handleApiError(error);
  }
}
