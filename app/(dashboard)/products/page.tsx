import { notFound, redirect } from "next/navigation";
import { requireProfile } from "@/lib/auth";
import {
  isProductLanguageSlug,
  productLanguageLabel,
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
  if (!isProductLanguageSlug(lang)) {
    redirect(productsPath());
  }

  const supabase = await createClient();
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
      languageLabel={productLanguageLabel(lang)}
      languageSlug={lang}
    />
  );
}
