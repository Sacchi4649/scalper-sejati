"use client";

import Link from "next/link";
import { useState } from "react";
import type { Product } from "@/lib/database.types";
import { api } from "@/lib/api-client";
import { cn } from "@/lib/cn";
import { ConfirmDeleteModal } from "@/components/confirm-delete-modal";
import { Button } from "@/components/ui/button";

export function AdminProductActions({
  product,
  onDeleted,
}: {
  product: Product;
  onDeleted?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function remove() {
    setBusy(true);
    setError("");
    try {
      await api(`/api/products/${product.id}`, { method: "DELETE" });
      setOpen(false);
      onDeleted?.();
    } catch (submitError) {
      setError(
        submitError instanceof Error ? submitError.message : "Gagal menghapus barang",
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex min-w-0 flex-wrap gap-2">
      <Link
        href={`/products/${product.id}`}
        className={cn(
          "inline-flex h-11 min-w-0 flex-1 items-center justify-center sm:flex-none", // layout
          "rounded-xl border border-line bg-white px-4", // box
          "text-sm font-medium hover:bg-canvas", // type + state
        )}
      >
        Atur harga
      </Link>
      <Button
        variant="danger"
        className="min-w-0 flex-1 sm:flex-none"
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

