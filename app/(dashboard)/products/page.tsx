import { requireProfile } from "@/lib/auth";
import { isUncategorizedListing } from "@/lib/product-languages";
import { createClient } from "@/lib/supabase/server";
import { ProductsCatalog } from "@/components/products-catalog";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string }>;
}) {
  const { lang } = await searchParams;
  const languageSlug = lang?.trim() || null;
  const supabase = await createClient();
  const uncategorized = isUncategorizedListing(languageSlug);

  const listQuery = uncategorized
    ? supabase
        .from("products")
        .select("*, languages(id, name, slug)")
        .is("language_id", null)
    : languageSlug
      ? supabase
          .from("products")
          .select("*, languages!inner(id, name, slug)")
          .eq("languages.slug", languageSlug)
      : supabase.from("products").select("*, languages(id, name, slug)");

  const [profile, { data: products }, { data: languages }] = await Promise.all([
    requireProfile(),
    listQuery.order("created_at", { ascending: false }),
    supabase.from("languages").select("id, name, slug").order("name", {
      ascending: true,
    }),
  ]);

  return (
    <ProductsCatalog
      key={languageSlug ?? "all"}
      products={products ?? []}
      languages={languages ?? []}
      isAdmin={profile.role === "super_admin"}
      languageSlug={languageSlug}
    />
  );
}
