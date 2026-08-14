import { requireRole } from "@/lib/auth";
import { formatDateTime } from "@/lib/format";
import { createClient } from "@/lib/supabase/server";
import { CreateAccountForm } from "@/components/create-account-form";
import { DeleteAccountButton } from "@/components/delete-account-button";
import { Card, PageHeader } from "@/components/ui/card";

export default async function SellersPage() {
  await requireRole("super_admin");
  const supabase = await createClient();
  const { data: sellers } = await supabase
    .from("profiles")
    .select("*")
    .eq("role", "seller")
    .order("created_at", { ascending: false });

  return (
    <div>
      <PageHeader
        title="Penjual"
        description="Buat akun seller baru. Mereka bisa masuk, melihat listing, dan mengajukan komisi."
      />
      <div className="grid gap-6 xl:grid-cols-[minmax(320px,0.8fr)_minmax(0,1.2fr)]">
        <Card>
          <h2 className="mb-4 font-display text-xl">Akun baru</h2>
          <CreateAccountForm
            endpoint="/api/sellers"
            nameLabel="Nama seller"
            submitLabel="Buat akun seller"
            successMessage="Akun seller berhasil dibuat."
          />
        </Card>
        <Card className="p-0">
          <div className="border-b border-line px-5 py-4">
            <h2 className="font-display text-xl">Daftar seller</h2>
          </div>
          <div className="divide-y divide-line">
            {(sellers ?? []).map((seller) => (
              <div
                key={seller.id}
                className="flex items-center justify-between gap-3 px-5 py-4"
              >
                <div>
                  <p className="font-medium">{seller.full_name}</p>
                  <p className="text-xs text-muted">
                    Bergabung {formatDateTime(seller.created_at)}
                  </p>
                </div>
                <DeleteAccountButton
                  id={seller.id}
                  name={seller.full_name}
                  kind="seller"
                />
              </div>
            ))}
            {(sellers ?? []).length === 0 ? (
              <p className="px-5 py-8 text-sm text-muted">Belum ada seller.</p>
            ) : null}
          </div>
        </Card>
      </div>
    </div>
  );
}
