import { ApiError, handleApiError, json } from "@/lib/http";
import { soldProductsFromSales } from "@/lib/sales-summary";
import { requireApiRole } from "@/lib/server/session";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    await requireApiRole("super_admin");
    const supabase = await createClient();
    const { data: sales, error } = await supabase
      .from("sales")
      .select(
        "product_id, quantity, unit_price, unit_commission, seller_id, sold_at, products(name, image_public_id, commission), profiles!sales_seller_id_fkey(full_name)",
      )
      .order("sold_at", { ascending: false });

    if (error) {
      throw new ApiError(400, error.message);
    }

    const rows = sales ?? [];
    const sellerMap = new Map<
      string,
      {
        sellerId: string;
        fullName: string;
        unitsSold: number;
        revenue: number;
        commission: number;
      }
    >();

    const totals = rows.reduce(
      (acc, sale) => {
        const profile = Array.isArray(sale.profiles)
          ? sale.profiles[0]
          : sale.profiles;
        const sellerId = sale.seller_id ?? "unknown";
        const current = sellerMap.get(sellerId) ?? {
          sellerId,
          fullName: profile?.full_name ?? "Seller dihapus",
          unitsSold: 0,
          revenue: 0,
          commission: 0,
        };
        const quantity = Number(sale.quantity);
        const revenue = quantity * Number(sale.unit_price);
        const commission = quantity * Number(sale.unit_commission);
        current.unitsSold += quantity;
        current.revenue += revenue;
        current.commission += commission;
        sellerMap.set(sellerId, current);

        acc.unitsSold += quantity;
        acc.revenue += revenue;
        acc.commissionPaid += commission;
        acc.ownerPayout += revenue - commission;
        return acc;
      },
      { unitsSold: 0, revenue: 0, commissionPaid: 0, ownerPayout: 0 },
    );

    return json({
      totals,
      products: soldProductsFromSales(rows),
      sellers: Array.from(sellerMap.values()).sort((a, b) => b.revenue - a.revenue),
    });
  } catch (error) {
    return handleApiError(error);
  }
}
