import {
  ApiError,
  handleApiError,
  json,
  readJson,
  requireFields,
} from "@/lib/http";
import { requireApiRole } from "@/lib/server/session";
import { createClient } from "@/lib/supabase/server";

type RouteContext = { params: Promise<{ id: string }> };

type LanguageBody = {
  name?: string;
};

export async function PATCH(request: Request, context: RouteContext) {
  try {
    await requireApiRole("super_admin");
    const { id } = await context.params;
    const body = await readJson<LanguageBody>(request);
    requireFields(body, ["name"]);

    const name = body.name!.trim();
    if (!name) {
      throw new ApiError(400, "Nama kategori bahasa wajib diisi");
    }

    const supabase = await createClient();
    const { data, error } = await supabase
      .from("languages")
      .update({ name })
      .eq("id", Number(id))
      .select("*")
      .single();

    if (error) {
      if (error.code === "23505") {
        throw new ApiError(409, "Kategori bahasa ini sudah ada");
      }
      throw new ApiError(400, error.message);
    }

    return json({ language: data });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    await requireApiRole("super_admin");
    const { id } = await context.params;
    const supabase = await createClient();
    const { error } = await supabase.from("languages").delete().eq("id", Number(id));

    if (error) {
      throw new ApiError(400, error.message);
    }

    return json({ ok: true });
  } catch (error) {
    return handleApiError(error);
  }
}
