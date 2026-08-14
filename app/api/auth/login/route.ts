import { ApiError, handleApiError, json, readJson, requireFields } from "@/lib/http";
import { createClient } from "@/lib/supabase/server";

type LoginBody = {
  email?: string;
  password?: string;
};

export async function POST(request: Request) {
  try {
    const body = await readJson<LoginBody>(request);
    requireFields(body, ["email", "password"]);

    const supabase = await createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email: body.email!.trim(),
      password: body.password!,
    });

    if (error) {
      throw new ApiError(401, "Email atau kata sandi salah");
    }

    return json({ ok: true });
  } catch (error) {
    return handleApiError(error);
  }
}
