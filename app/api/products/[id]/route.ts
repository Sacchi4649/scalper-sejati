import {
  ApiError,
  handleApiError,
  json,
  parseMoney,
  parseStock,
  readJson,
} from "@/lib/http";
import type { Database } from "@/lib/database.types";
import { requireApiProfile, requireApiRole } from "@/lib/server/session";
import { createClient } from "@/lib/supabase/server";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  try {
    await requireApiProfile();
    const { id } = await context.params;
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", Number(id))
      .maybeSingle();

    if (error) {
      throw new ApiError(400, error.message);
    }
    if (!data) {
      throw new ApiError(404, "Barang tidak ditemukan");
    }

    return json({ product: data });
  } catch (error) {
    return handleApiError(error);
  }
}

type ProductBody = {
  name?: string;
  price?: number;
  openPrice?: number;
  commission?: number;
  stock?: number;
  imageUrl?: string | null;
  imagePublicId?: string | null;
};

export async function PATCH(request: Request, context: RouteContext) {
  try {
    await requireApiRole("super_admin");
    const { id } = await context.params;
    const body = await readJson<ProductBody>(request);
    const supabase = await createClient();

    const patch: Database["public"]["Tables"]["products"]["Update"] = {};
    if (body.name !== undefined) patch.name = body.name.trim();
    if (body.price !== undefined) patch.price = parseMoney(body.price, "Harga");
    if (body.openPrice !== undefined) {
      patch.open_price = parseMoney(body.openPrice, "Open price");
    }
    if (body.commission !== undefined) {
      patch.commission = parseMoney(body.commission, "Komisi");
    }
    if (body.stock !== undefined) {
      patch.stock = parseStock(body.stock);
    }
    if (body.imageUrl !== undefined) patch.image_url = body.imageUrl;
    if (body.imagePublicId !== undefined) {
      patch.image_public_id = body.imagePublicId;
    }

    const { data, error } = await supabase
      .from("products")
      .update(patch)
      .eq("id", Number(id))
      .select("*")
      .single();

    if (error) {
      throw new ApiError(400, error.message);
    }

    return json({ product: data });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    await requireApiRole("super_admin");
    const { id } = await context.params;
    const supabase = await createClient();
    const { error } = await supabase.from("products").delete().eq("id", Number(id));

    if (error) {
      throw new ApiError(400, error.message);
    }

    return json({ ok: true });
  } catch (error) {
    return handleApiError(error);
  }
}
