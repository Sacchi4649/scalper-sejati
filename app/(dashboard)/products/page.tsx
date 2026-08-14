import { requireProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { ProductsCatalog } from "@/components/products-catalog";

export default async function ProductsPage() {
  const profile = await requireProfile();
  const supabase = await createClient();
  const { data: products } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <ProductsCatalog
      products={products ?? []}
      isAdmin={profile.role === "super_admin"}
    />
  );
}
