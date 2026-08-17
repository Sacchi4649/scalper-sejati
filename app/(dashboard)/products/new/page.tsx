import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { ProductForm } from "@/components/product-form";
import { Card, PageHeader } from "@/components/ui/card";

export default async function NewProductPage() {
  const supabase = await createClient();
  const [, { data: languages }] = await Promise.all([
    requireRole("super_admin"),
    supabase.from("languages").select("*").order("name", { ascending: true }),
  ]);

  return (
    <div>
      <PageHeader
        title="Upload barang"
        description="Isi nama, kategori bahasa, harga, komisi, dan stok, lalu unggah gambar langsung ke Cloudinary."
      />
      <Card>
        <ProductForm languages={languages ?? []} />
      </Card>
    </div>
  );
}
