"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { api } from "@/lib/api-client";
import { ConfirmDeleteModal } from "@/components/confirm-delete-modal";
import { Button } from "@/components/ui/button";

export function DeleteAccountButton({
  id,
  name,
  kind,
}: {
  id: string;
  name: string;
  kind: "seller" | "admin";
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const label = kind === "seller" ? "seller" : "admin";
  const endpoint = kind === "seller" ? `/api/sellers/${id}` : `/api/admins/${id}`;

  async function remove() {
    setBusy(true);
    setError("");
    try {
      await api(endpoint, { method: "DELETE" });
      setOpen(false);
      router.refresh();
    } catch (submitError) {
      setError(
        submitError instanceof Error ? submitError.message : "Gagal menghapus akun",
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <Button
        variant="danger"
        disabled={busy}
        onClick={() => {
          setError("");
          setOpen(true);
        }}
      >
        Hapus
      </Button>
      <ConfirmDeleteModal
        open={open}
        title={`Hapus akun ${label} ${name}?`}
        description={
          kind === "seller"
            ? "Riwayat penjualan tetap tersimpan."
            : "Akun ini tidak bisa masuk lagi setelah dihapus."
        }
        error={error}
        loading={busy}
        onCancel={() => setOpen(false)}
        onConfirm={() => void remove()}
      />
    </>
  );
}
