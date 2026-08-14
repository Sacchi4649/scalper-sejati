import { ApiError, handleApiError, json } from "@/lib/http";
import { requireApiRole } from "@/lib/server/session";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    await requireApiRole("super_admin");
    const supabase = await createClient();

    const [{ data: summary, error: summaryError }, { data: sales, error: salesError }] =
      await Promise.all([
        supabase
          .from("sales_summary")
          .select("*")
          .order("units_sold", { ascending: false }),
        supabase
          .from("sales")
          .select("quantity, unit_price, unit_commission, seller_id, profiles!sales_seller_id_fkey(full_name)"),
      ]);

    if (summaryError) {
      throw new ApiError(400, summaryError.message);
    }
    if (salesError) {
      throw new ApiError(400, salesError.message);
    }

    const sellerMap = new Map<
      string,
      { sellerId: string; fullName: string; unitsSold: number; revenue: number; commission: number }
    >();

    for (const sale of sales ?? []) {
      const profile = Array.isArray(sale.profiles) ? sale.profiles[0] : sale.profiles;
      const current = sellerMap.get(sale.seller_id) ?? {
        sellerId: sale.seller_id,
        fullName: profile?.full_name ?? "Seller",
        unitsSold: 0,
        revenue: 0,
        commission: 0,
      };
      current.unitsSold += sale.quantity;
      current.revenue += Number(sale.quantity) * Number(sale.unit_price);
      current.commission += Number(sale.quantity) * Number(sale.unit_commission);
      sellerMap.set(sale.seller_id, current);
    }

    const totals = (summary ?? []).reduce(
      (acc, row) => {
        acc.unitsSold += Number(row.units_sold ?? 0);
        acc.revenue += Number(row.revenue ?? 0);
        acc.commissionPaid += Number(row.commission_paid ?? 0);
        return acc;
      },
      { unitsSold: 0, revenue: 0, commissionPaid: 0 },
    );

    return json({
      totals,
      products: summary ?? [],
      sellers: Array.from(sellerMap.values()).sort((a, b) => b.revenue - a.revenue),
    });
  } catch (error) {
    return handleApiError(error);
  }
}
