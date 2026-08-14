import { requireProfile } from "@/lib/auth";
import { formatDateTime, formatRupiah } from "@/lib/format";
import { createClient } from "@/lib/supabase/server";
import { CommissionReviewActions } from "@/components/commission-review-actions";
import { Badge } from "@/components/ui/badge";
import { Card, PageHeader } from "@/components/ui/card";

const statusTone = {
  pending: "gold",
  approved: "green",
  rejected: "danger",
} as const;

export default async function CommissionsPage() {
  const profile = await requireProfile();
  const supabase = await createClient();
  const { data: requests } = await supabase
    .from("commission_requests")
    .select(
      "*, products(name), profiles!commission_requests_seller_id_fkey(full_name)",
    )
    .order("created_at", { ascending: false });

  const isAdmin = profile.role === "super_admin";

  return (
    <div>
      <PageHeader
        title={isAdmin ? "Pengajuan komisi" : "Pengajuan komisi saya"}
        description={
          isAdmin
            ? "Setujui atau tolak permintaan perubahan komisi dari seller."
            : "Pantau status pengajuan komisi yang sudah dikirim dari halaman listing."
        }
      />
      <div className="grid gap-4">
        {(requests ?? []).map((item) => {
          const product = Array.isArray(item.products)
            ? item.products[0]
            : item.products;
          const seller = Array.isArray(item.profiles)
            ? item.profiles[0]
            : item.profiles;

          return (
            <Card key={item.id}>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="mb-2 flex items-center gap-2">
                    <h2 className="font-display text-2xl">
                      {product?.name ?? "Barang"}
                    </h2>
                    <Badge tone={statusTone[item.status]}>{item.status}</Badge>
                  </div>
                  {isAdmin ? (
                    <p className="text-sm text-muted">
                      Diajukan oleh {seller?.full_name ?? "seller"}
                    </p>
                  ) : null}
                  <p className="mt-2 text-sm">
                    {formatRupiah(item.current_commission)} →{" "}
                    <strong>{formatRupiah(item.requested_commission)}</strong>
                  </p>
                  {item.note ? (
                    <p className="mt-2 text-sm text-muted">{item.note}</p>
                  ) : null}
                  <p className="mt-2 text-xs text-muted">
                    {formatDateTime(item.created_at)}
                  </p>
                </div>
                {isAdmin && item.status === "pending" ? (
                  <CommissionReviewActions
                    requestId={item.id}
                    requestedCommission={Number(item.requested_commission)}
                  />
                ) : null}
              </div>
            </Card>
          );
        })}
        {(requests ?? []).length === 0 ? (
          <Card>
            <p className="text-sm text-muted">Belum ada pengajuan komisi.</p>
          </Card>
        ) : null}
      </div>
    </div>
  );
}
