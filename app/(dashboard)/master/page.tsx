import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { LanguageMaster } from "@/components/language-master";
import { Card, PageHeader } from "@/components/ui/card";

export default async function MasterPage() {
  const supabase = await createClient();
  const [, { data: languages }] = await Promise.all([
    requireRole("super_admin"),
    supabase.from("languages").select("*").order("name", { ascending: true }),
  ]);

  return (
    <div>
      <PageHeader
        title="Master data"
        description="Kelola opsi kategori bahasa yang bisa dipilih saat menambah barang."
      />
      <Card>
        <h2 className="mb-4 font-display text-xl">Kategori bahasa</h2>
        <LanguageMaster languages={languages ?? []} />
      </Card>
    </div>
  );
}
