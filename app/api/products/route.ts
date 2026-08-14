import {
  ApiError,
  assertCommissionFitsPrice,
  handleApiError,
  json,
  parseMoney,
  parseStock,
  readJson,
  requireFields,
} from "@/lib/http";
import { requireApiProfile, requireApiRole } from "@/lib/server/session";
import { createClient } from "@/lib/supabase/server";
import { parseSearchQuery, toIlikePattern } from "@/lib/search";

export async function GET(request: Request) {
  try {
    await requireApiProfile();
    const query = parseSearchQuery(new URL(request.url).searchParams.get("q"));
    const supabase = await createClient();
    let listQuery = supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (query) {
      listQuery = listQuery.ilike("name", toIlikePattern(query));
    }

    const { data, error } = await listQuery;

    if (error) {
      throw new ApiError(400, error.message);
    }

    return json({ products: data ?? [] });
  } catch (error) {
    return handleApiError(error);
  }
}

type ProductBody = {
  name?: string;
  price?: number;
  commission?: number;
  stock?: number;
  imageUrl?: string | null;
  imagePublicId?: string | null;
};

export async function POST(request: Request) {
  try {
    const profile = await requireApiRole("super_admin");
    const body = await readJson<ProductBody>(request);
    requireFields(body, ["name", "price", "commission", "stock"]);

    const price = parseMoney(body.price, "Harga");
    const commission = parseMoney(body.commission, "Komisi");
    assertCommissionFitsPrice(price, commission);

    const supabase = await createClient();
    const { data, error } = await supabase
      .from("products")
      .insert({
        name: body.name!.trim(),
        price,
        commission,
        stock: parseStock(body.stock),
        image_url: body.imageUrl ?? null,
        image_public_id: body.imagePublicId ?? null,
        created_by: profile.id,
      })
      .select("*")
      .single();

    if (error) {
      throw new ApiError(400, error.message);
    }

    return json({ product: data }, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
