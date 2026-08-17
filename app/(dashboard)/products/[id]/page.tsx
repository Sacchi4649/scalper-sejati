import { notFound } from "next/navigation";
import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { ProductForm } from "@/components/product-form";
import { Card, PageHeader } from "@/components/ui/card";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireRole("super_admin");
  const { id } = await params;
  const supabase = await createClient();
  const [{ data: product }, { data: languages }] = await Promise.all([
    supabase.from("products").select("*").eq("id", Number(id)).maybeSingle(),
    supabase.from("languages").select("*").order("name", { ascending: true }),
  ]);

  if (!product) {
    notFound();
  }

  return (
    <div>
      <PageHeader
        title={`Atur ${product.name}`}
        description="Perbarui nama, kategori bahasa, harga, komisi, stok, atau gambar barang."
      />
      <Card>
        <ProductForm product={product} languages={languages ?? []} />
      </Card>
    </div>
  );
}
