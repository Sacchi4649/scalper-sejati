"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Product } from "@/lib/database.types";
import { api } from "@/lib/api-client";
import { cn } from "@/lib/cn";
import { ConfirmDeleteModal } from "@/components/confirm-delete-modal";
import { Button } from "@/components/ui/button";

export function AdminProductActions({ product }: { product: Product }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function remove() {
    setBusy(true);
    setError("");
    try {
      await api(`/api/products/${product.id}`, { method: "DELETE" });
      setOpen(false);
      router.refresh();
    } catch (submitError) {
      setError(
        submitError instanceof Error ? submitError.message : "Gagal menghapus barang",
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex gap-2">
      <Link
        href={`/products/${product.id}`}
        className={cn(
          "inline-flex h-11 items-center justify-center", // layout
          "rounded-xl border border-line bg-white px-4", // box
          "text-sm font-medium hover:bg-canvas", // type + state
        )}
      >
        Atur harga
      </Link>
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
        title={`Hapus ${product.name}?`}
        description="Barang ini akan dihapus dari katalog."
        error={error}
        loading={busy}
        onCancel={() => setOpen(false)}
        onConfirm={() => void remove()}
      />
    </div>
  );
}

