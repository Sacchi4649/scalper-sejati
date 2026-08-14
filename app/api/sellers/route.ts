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
      .eq("role", "seller")
      .order("created_at", { ascending: false });

    if (error) {
      throw new ApiError(400, error.message);
    }

    return json({ sellers: data ?? [] });
  } catch (error) {
    return handleApiError(error);
  }
}

type SellerBody = {
  email?: string;
  password?: string;
  fullName?: string;
};

export async function POST(request: Request) {
  try {
    await requireApiRole("super_admin");
    const body = await readJson<SellerBody>(request);
    requireFields(body, ["email", "password", "fullName"]);

    if ((body.password ?? "").length < 8) {
      throw new ApiError(400, "Kata sandi minimal 8 karakter");
    }

    const anon = createAnonClient();
    const { error } = await anon.auth.signUp({
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

    return json({ ok: true }, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
