import { requireProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import {
  CommissionRequests,
  type CommissionRequestItem,
} from "@/components/commission-review-actions";
import { PageHeader } from "@/components/ui/card";

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
      <CommissionRequests
        requests={(requests ?? []) as CommissionRequestItem[]}
        isAdmin={isAdmin}
      />
    </div>
  );
}
