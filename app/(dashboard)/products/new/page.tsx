import { requireRole } from "@/lib/auth";
import { ProductForm } from "@/components/product-form";
import { Card, PageHeader } from "@/components/ui/card";

export default async function NewProductPage() {
  await requireRole("super_admin");

  return (
    <div>
      <PageHeader
        title="Upload barang"
        description="Isi nama, harga, komisi, dan stok, lalu unggah gambar langsung ke Cloudinary."
      />
      <Card>
        <ProductForm />
      </Card>
    </div>
  );
}
