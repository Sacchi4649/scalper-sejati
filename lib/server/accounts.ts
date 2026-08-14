import type { AppRole } from "@/lib/database.types";
import { ApiError } from "@/lib/http";
import { requireApiRole } from "@/lib/server/session";
import { createClient } from "@/lib/supabase/server";

export async function deleteManagedAccount(id: string, expectedRole: AppRole) {
  const actor = await requireApiRole("super_admin");
  if (actor.id === id) {
    throw new ApiError(400, "Tidak bisa menghapus akun sendiri");
  }

  const supabase = await createClient();
  const { data: target, error } = await supabase
    .from("profiles")
    .select("id, role")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new ApiError(400, error.message);
  }
  if (!target) {
    throw new ApiError(404, "Akun tidak ditemukan");
  }
  if (target.role !== expectedRole) {
    throw new ApiError(400, "Jenis akun tidak sesuai");
  }

  const { error: rpcError } = await supabase.rpc("delete_account", {
    target_id: id,
  });

  if (rpcError) {
    throw new ApiError(400, rpcError.message);
  }
}
