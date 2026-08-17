import { notFound, redirect } from "next/navigation";
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
  const profile = await requireProfile();
  const { lang } = await searchParams;
  if (!isProductListingSlug(lang)) {
    redirect(productsPath());
  }

  const supabase = await createClient();
  const uncategorized = isUncategorizedListing(lang);

  if (!uncategorized) {
    const { data: language } = await supabase
      .from("languages")
      .select("id, name, slug")
      .eq("slug", lang)
      .maybeSingle();

    if (!language) {
      notFound();
    }

    const { data: products } = await supabase
      .from("products")
      .select("*, languages(id, name)")
      .eq("language_id", language.id)
      .order("created_at", { ascending: false });

    return (
      <ProductsCatalog
        products={products ?? []}
        isAdmin={profile.role === "super_admin"}
        languageLabel={productListingLabel(lang)}
        languageSlug={lang}
      />
    );
  }

  const { data: products } = await supabase
    .from("products")
    .select("*, languages(id, name)")
    .is("language_id", null)
    .order("created_at", { ascending: false });

  return (
    <ProductsCatalog
      products={products ?? []}
      isAdmin={profile.role === "super_admin"}
      languageLabel={productListingLabel(lang)}
      languageSlug={lang}
    />
  );
}
