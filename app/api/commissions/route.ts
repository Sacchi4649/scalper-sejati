import {
  ApiError,
  handleApiError,
  json,
  parseMoney,
  readJson,
  requireFields,
} from "@/lib/http";
import { requireApiProfile } from "@/lib/server/session";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    await requireApiProfile();
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("commission_requests")
      .select("*, products(name, commission), profiles!commission_requests_seller_id_fkey(full_name)")
      .order("created_at", { ascending: false });

    if (error) {
      throw new ApiError(400, error.message);
    }

    return json({ requests: data ?? [] });
  } catch (error) {
    return handleApiError(error);
  }
}

type CommissionBody = {
  productId?: number;
  requestedCommission?: number;
  note?: string;
};

export async function POST(request: Request) {
  try {
    const profile = await requireApiProfile();
    if (profile.role !== "seller") {
      throw new ApiError(403, "Hanya seller yang dapat mengajukan komisi");
    }

    const body = await readJson<CommissionBody>(request);
    requireFields(body, ["productId", "requestedCommission"]);

    const supabase = await createClient();
    const { data: product, error: productError } = await supabase
      .from("products")
      .select("id, commission")
      .eq("id", Number(body.productId))
      .maybeSingle();

    if (productError) {
      throw new ApiError(400, productError.message);
    }
    if (!product) {
      throw new ApiError(404, "Barang tidak ditemukan");
    }

    const { data, error } = await supabase
      .from("commission_requests")
      .insert({
        product_id: product.id,
        seller_id: profile.id,
        current_commission: Number(product.commission),
        requested_commission: parseMoney(body.requestedCommission, "Komisi diajukan"),
        note: body.note?.trim() || null,
      })
      .select("*")
      .single();

    if (error) {
      if (error.code === "23505") {
        throw new ApiError(409, "Masih ada pengajuan komisi yang menunggu tinjauan untuk barang ini");
      }
      throw new ApiError(400, error.message);
    }

    return json({ request: data }, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
