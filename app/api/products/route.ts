import {
  ApiError,
  assertCommissionFitsPrice,
  handleApiError,
  json,
  parseLanguageId,
  parseMoney,
  parseStock,
  readJson,
  requireFields,
} from "@/lib/http";
import { requireApiProfile, requireApiRole } from "@/lib/server/session";
import { createClient } from "@/lib/supabase/server";
import { parseSearchQuery, toIlikePattern } from "@/lib/search";
import { UNCATEGORIZED_LANGUAGE_SLUG } from "@/lib/product-languages";

export async function GET(request: Request) {
  try {
    await requireApiProfile();
    const search = new URL(request.url).searchParams;
    const query = parseSearchQuery(search.get("q"));
    const lang = search.get("lang");
    const supabase = await createClient();
    const uncategorized = lang === UNCATEGORIZED_LANGUAGE_SLUG;
    let listQuery = uncategorized
      ? supabase
          .from("products")
          .select("*, languages(id, name)")
          .is("language_id", null)
      : lang
        ? supabase
            .from("products")
            .select("*, languages!inner(id, name)")
            .eq("languages.slug", lang)
        : supabase.from("products").select("*, languages(id, name)");

    listQuery = listQuery.order("created_at", { ascending: false });

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
  languageId?: number;
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
    requireFields(body, ["name", "languageId", "price", "commission", "stock"]);

    const price = parseMoney(body.price, "Harga");
    const commission = parseMoney(body.commission, "Komisi");
    assertCommissionFitsPrice(price, commission);

    const supabase = await createClient();
    const { data, error } = await supabase
      .from("products")
      .insert({
        name: body.name!.trim(),
        language_id: parseLanguageId(body.languageId),
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
