import { redirect } from "next/navigation";
import { requireProfile } from "@/lib/auth";
import {
  isProductListingSlug,
  isUncategorizedListing,
  productListingLabel,
  productsPath,
} from "@/lib/product-languages";
import { createClient } from "@/lib/supabase/server";
import { ProductsCatalog } from "@/components/products-catalog";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string }>;
}) {
  const [profile, params] = await Promise.all([requireProfile(), searchParams]);
  const { lang } = params;
  if (!isProductListingSlug(lang)) {
    redirect(productsPath());
  }

  const supabase = await createClient();
  const uncategorized = isUncategorizedListing(lang);

  const listQuery = uncategorized
    ? supabase
        .from("products")
        .select("*, languages(id, name)")
        .is("language_id", null)
    : supabase
        .from("products")
        .select("*, languages!inner(id, name)")
        .eq("languages.slug", lang);

  const { data: products } = await listQuery.order("created_at", {
    ascending: false,
  });

  return (
      <ProductsCatalog
        key={lang}
        products={products ?? []}
        isAdmin={profile.role === "super_admin"}
        languageLabel={productListingLabel(lang)}
        languageSlug={lang}
      />
  );
}
