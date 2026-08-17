export const RECENT_SOLD_LIMIT = 5;

export type SoldProductRow = {
  product_id: number;
  product_name: string;
  image_public_id: string | null;
  commission: number;
  units_sold: number;
  revenue: number;
  commission_paid: number;
};

type SaleInput = {
  product_id: number;
  quantity: number;
  unit_price: number;
  unit_commission: number;
  sold_at: string;
  products:
    | { name: string; image_public_id: string | null; commission: number }
    | { name: string; image_public_id: string | null; commission: number }[]
    | null;
};

export function soldProductsFromSales(
  sales: SaleInput[],
  limit = RECENT_SOLD_LIMIT,
) {
  const byId = new Map<number, SoldProductRow>();
  const recentIds: number[] = [];

  for (const sale of sales) {
    const product = Array.isArray(sale.products)
      ? sale.products[0]
      : sale.products;
    const quantity = Number(sale.quantity);
    const revenue = quantity * Number(sale.unit_price);
    const commissionPaid = quantity * Number(sale.unit_commission);
    const current = byId.get(sale.product_id);

    if (!current) {
      byId.set(sale.product_id, {
        product_id: sale.product_id,
        product_name: product?.name ?? "Barang",
        image_public_id: product?.image_public_id ?? null,
        commission: Number(product?.commission ?? sale.unit_commission),
        units_sold: quantity,
        revenue,
        commission_paid: commissionPaid,
      });
      recentIds.push(sale.product_id);
      continue;
    }

    current.units_sold += quantity;
    current.revenue += revenue;
    current.commission_paid += commissionPaid;
  }

  return recentIds.slice(0, limit).map((id) => byId.get(id)!);
}
