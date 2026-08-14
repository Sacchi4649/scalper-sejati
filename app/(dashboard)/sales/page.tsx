import { requireRole } from "@/lib/auth";
import { formatDateTime, formatRupiah } from "@/lib/format";
import { createClient } from "@/lib/supabase/server";
import { Card, PageHeader } from "@/components/ui/card";

export default async function SalesPage() {
  const profile = await requireRole("seller");
  const supabase = await createClient();
  const { data: sales } = await supabase
    .from("sales")
    .select("*, products(name)")
    .eq("seller_id", profile.id)
    .order("sold_at", { ascending: false })
    .limit(50);

  return (
    <div>
      <PageHeader
        title="Catat penjualan"
        description="Catat transaksi dari halaman listing. Riwayat penjualan Anda tampil di sini."
      />
      <Card className="p-0">
        <div className="divide-y divide-line">
          {(sales ?? []).map((sale) => {
            const product = Array.isArray(sale.products)
              ? sale.products[0]
              : sale.products;
            return (
              <div
                key={sale.id}
                className="flex items-center justify-between gap-4 px-5 py-4"
              >
                <div>
                  <p className="font-medium">{product?.name ?? "Barang"}</p>
                  <p className="text-sm text-muted">
                    {sale.quantity} unit · {formatDateTime(sale.sold_at)}
                  </p>
                </div>
                <div className="text-right text-sm">
                  <p>{formatRupiah(Number(sale.quantity) * Number(sale.unit_price))}</p>
                  <p className="text-muted">
                    Komisi {formatRupiah(Number(sale.quantity) * Number(sale.unit_commission))}
                  </p>
                </div>
              </div>
            );
          })}
          {(sales ?? []).length === 0 ? (
            <p className="px-5 py-8 text-sm text-muted">
              Belum ada penjualan. Buka Listing untuk mencatat transaksi.
            </p>
          ) : null}
        </div>
      </Card>
    </div>
  );
}
