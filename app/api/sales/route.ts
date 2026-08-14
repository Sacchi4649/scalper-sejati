import {
  ApiError,
  handleApiError,
  json,
  parseQuantity,
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
      .from("sales")
      .select("*, products(name, image_public_id), profiles!sales_seller_id_fkey(full_name)")
      .order("sold_at", { ascending: false })
      .limit(100);

    if (error) {
      throw new ApiError(400, error.message);
    }

    return json({ sales: data ?? [] });
  } catch (error) {
    return handleApiError(error);
  }
}

type SaleBody = {
  productId?: number;
  quantity?: number;
};

export async function POST(request: Request) {
  try {
    const profile = await requireApiProfile();
    if (profile.role !== "seller") {
      throw new ApiError(403, "Hanya seller yang dapat mencatat penjualan");
    }

    const body = await readJson<SaleBody>(request);
    requireFields(body, ["productId", "quantity"]);

    const supabase = await createClient();
    const { data: product, error: productError } = await supabase
      .from("products")
      .select("id, open_price, commission, stock")
      .eq("id", Number(body.productId))
      .maybeSingle();

    if (productError) {
      throw new ApiError(400, productError.message);
    }
    if (!product) {
      throw new ApiError(404, "Barang tidak ditemukan");
    }

    const quantity = parseQuantity(body.quantity);
    if (product.stock < quantity) {
      throw new ApiError(400, "Stok tidak cukup");
    }

    const { data, error } = await supabase
      .from("sales")
      .insert({
        product_id: product.id,
        seller_id: profile.id,
        quantity,
        unit_price: Number(product.open_price),
        unit_commission: Number(product.commission),
      })
      .select("*")
      .single();

    if (error) {
      throw new ApiError(400, error.message);
    }

    return json({ sale: data }, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
