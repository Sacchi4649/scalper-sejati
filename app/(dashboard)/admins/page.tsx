import { requireRole } from "@/lib/auth";
import { formatDateTime } from "@/lib/format";
import { createClient } from "@/lib/supabase/server";
import { CreateAccountForm } from "@/components/create-account-form";
import { DeleteAccountButton } from "@/components/delete-account-button";
import { Badge } from "@/components/ui/badge";
import { Card, PageHeader } from "@/components/ui/card";

export default async function AdminsPage() {
  const supabase = await createClient();
  const [profile, { data: admins }] = await Promise.all([
    requireRole("super_admin"),
    supabase
      .from("profiles")
      .select("*")
      .eq("role", "super_admin")
      .order("created_at", { ascending: false }),
  ]);

  return (
    <div>
      <PageHeader
        title="Admin"
        description="Buat akun super admin baru. Mereka bisa mengelola barang, harga, ringkasan, dan pengguna."
      />
      <div className="grid gap-6 xl:grid-cols-[minmax(320px,0.8fr)_minmax(0,1.2fr)]">
        <Card>
          <h2 className="mb-4 font-display text-xl">Akun baru</h2>
          <CreateAccountForm
            endpoint="/api/admins"
            nameLabel="Nama admin"
            submitLabel="Buat akun admin"
            successMessage="Akun admin berhasil dibuat."
          />
        </Card>
        <Card className="p-0">
          <div className="border-b border-line px-5 py-4">
            <h2 className="font-display text-xl">Daftar admin</h2>
          </div>
          <div className="divide-y divide-line">
            {(admins ?? []).map((admin) => (
              <div
                key={admin.id}
                className="flex items-center justify-between gap-3 px-5 py-4"
              >
                <div>
                  <p className="font-medium">{admin.full_name}</p>
                  <p className="text-xs text-muted">
                    Bergabung {formatDateTime(admin.created_at)}
                  </p>
                </div>
                {admin.id === profile.id ? (
                  <Badge tone="gold">Anda</Badge>
                ) : (
                  <DeleteAccountButton
                    id={admin.id}
                    name={admin.full_name}
                    kind="admin"
                  />
                )}
              </div>
            ))}
            {(admins ?? []).length === 0 ? (
              <p className="px-5 py-8 text-sm text-muted">Belum ada admin.</p>
            ) : null}
          </div>
        </Card>
      </div>
    </div>
  );
}
