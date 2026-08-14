import { requireRole } from "@/lib/auth";
import { formatRupiah } from "@/lib/format";
import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { Card, PageHeader } from "@/components/ui/card";
import { ProductImage } from "@/components/product-image";

export default async function SummaryPage() {
  await requireRole("super_admin");
  const supabase = await createClient();

  const [{ data: summary }, { data: sales }] = await Promise.all([
    supabase.from("sales_summary").select("*").order("units_sold", { ascending: false }),
    supabase
      .from("sales")
      .select("quantity, unit_price, unit_commission, seller_id, profiles!sales_seller_id_fkey(full_name)"),
  ]);

  const totals = (summary ?? []).reduce(
    (acc, row) => {
      acc.unitsSold += Number(row.units_sold ?? 0);
      acc.revenue += Number(row.revenue ?? 0);
      acc.commissionPaid += Number(row.commission_paid ?? 0);
      return acc;
    },
    { unitsSold: 0, revenue: 0, commissionPaid: 0 },
  );

  const sellerMap = new Map<
    string,
    { name: string; unitsSold: number; revenue: number }
  >();

  for (const sale of sales ?? []) {
    const profile = Array.isArray(sale.profiles) ? sale.profiles[0] : sale.profiles;
    const sellerId = sale.seller_id ?? "unknown";
    const current = sellerMap.get(sellerId) ?? {
      name: profile?.full_name ?? "Seller dihapus",
      unitsSold: 0,
      revenue: 0,
    };
    current.unitsSold += sale.quantity;
    current.revenue += Number(sale.quantity) * Number(sale.unit_price);
    sellerMap.set(sellerId, current);
  }

  const sellers = Array.from(sellerMap.entries()).map(([id, seller]) => ({
    id,
    ...seller,
  })).sort((a, b) => b.revenue - a.revenue);

  return (
    <div>
      <PageHeader
        title="Ringkasan terjual"
        description="Lihat performa katalog, omzet, dan komisi yang sudah berjalan."
      />
      <div className="mb-8 grid gap-4 md:grid-cols-3">
        <Card>
          <p className="text-sm text-muted">Unit terjual</p>
          <p className="mt-2 font-display text-4xl">{totals.unitsSold}</p>
        </Card>
        <Card>
          <p className="text-sm text-muted">Omzet open price</p>
          <p className="mt-2 font-display text-3xl">{formatRupiah(totals.revenue)}</p>
        </Card>
        <Card>
          <p className="text-sm text-muted">Komisi berjalan</p>
          <p className="mt-2 font-display text-3xl">
            {formatRupiah(totals.commissionPaid)}
          </p>
        </Card>
      </div>
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(280px,0.8fr)]">
        <Card className="p-0">
          <div className="border-b border-line px-5 py-4">
            <h2 className="font-display text-xl">Per barang</h2>
          </div>
          <div className="divide-y divide-line">
            {(summary ?? []).map((row) => (
              <div
                key={row.product_id}
                className="grid grid-cols-[72px_minmax(0,1fr)_auto] items-center gap-4 px-5 py-4"
              >
                <ProductImage
                  publicId={row.image_public_id}
                  alt={row.product_name ?? "Barang"}
                  className="h-16 w-16 rounded-xl"
                />
                <div>
                  <p className="font-medium">{row.product_name}</p>
                  <p className="text-sm text-muted">
                    {row.units_sold ?? 0} unit · komisi {formatRupiah(row.commission)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">{formatRupiah(row.revenue)}</p>
                  <Badge tone="gold">{formatRupiah(row.commission_paid)}</Badge>
                </div>
              </div>
            ))}
            {(summary ?? []).length === 0 ? (
              <p className="px-5 py-8 text-sm text-muted">Belum ada barang.</p>
            ) : null}
          </div>
        </Card>
        <Card>
          <h2 className="mb-4 font-display text-xl">Per seller</h2>
          <div className="grid gap-3">
            {sellers.map((seller) => (
              <div
                key={seller.id}
                className="flex items-center justify-between rounded-xl bg-canvas px-3 py-3"
              >
                <div>
                  <p className="font-medium">{seller.name}</p>
                  <p className="text-xs text-muted">{seller.unitsSold} unit</p>
                </div>
                <p className="text-sm font-medium">{formatRupiah(seller.revenue)}</p>
              </div>
            ))}
            {sellers.length === 0 ? (
              <p className="text-sm text-muted">Belum ada penjualan.</p>
            ) : null}
          </div>
        </Card>
      </div>
    </div>
  );
}
