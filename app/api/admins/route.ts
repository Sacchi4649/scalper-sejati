import { ApiError, handleApiError, json, readJson, requireFields } from "@/lib/http";
import { requireApiRole } from "@/lib/server/session";
import { createAnonClient, createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    await requireApiRole("super_admin");
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("role", "super_admin")
      .order("created_at", { ascending: false });

    if (error) {
      throw new ApiError(400, error.message);
    }

    return json({ admins: data ?? [] });
  } catch (error) {
    return handleApiError(error);
  }
}

type AdminBody = {
  email?: string;
  password?: string;
  fullName?: string;
};

export async function POST(request: Request) {
  try {
    await requireApiRole("super_admin");
    const body = await readJson<AdminBody>(request);
    requireFields(body, ["email", "password", "fullName"]);

    if ((body.password ?? "").length < 8) {
      throw new ApiError(400, "Kata sandi minimal 8 karakter");
    }

    const anon = createAnonClient();
    const { data, error } = await anon.auth.signUp({
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

    const userId = data.user?.id;
    if (!userId) {
      throw new ApiError(400, "Akun terbuat, tetapi ID pengguna tidak tersedia");
    }

    const supabase = await createClient();
    const { error: roleError } = await supabase.rpc("promote_to_super_admin", {
      target_id: userId,
    });

    if (roleError) {
      throw new ApiError(400, roleError.message);
    }

    return json({ ok: true }, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
