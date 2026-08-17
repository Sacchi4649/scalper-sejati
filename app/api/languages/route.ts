import {
  ApiError,
  handleApiError,
  json,
  readJson,
  requireFields,
} from "@/lib/http";
import { requireApiProfile, requireApiRole } from "@/lib/server/session";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    await requireApiProfile();
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("languages")
      .select("*")
      .order("name", { ascending: true });

    if (error) {
      throw new ApiError(400, error.message);
    }

    return json({ languages: data ?? [] });
  } catch (error) {
    return handleApiError(error);
  }
}

type LanguageBody = {
  name?: string;
};

export async function POST(request: Request) {
  try {
    await requireApiRole("super_admin");
    const body = await readJson<LanguageBody>(request);
    requireFields(body, ["name"]);

    const name = body.name!.trim();
    if (!name) {
      throw new ApiError(400, "Nama kategori bahasa wajib diisi");
    }

    const supabase = await createClient();
    const { data, error } = await supabase
      .from("languages")
      .insert({ name })
      .select("*")
      .single();

    if (error) {
      if (error.code === "23505") {
        throw new ApiError(409, "Kategori bahasa ini sudah ada");
      }
      throw new ApiError(400, error.message);
    }

    return json({ language: data }, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
