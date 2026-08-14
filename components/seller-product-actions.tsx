"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Product } from "@/lib/database.types";
import { api } from "@/lib/api-client";
import { formatRupiah } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Input, RupiahInput, Textarea } from "@/components/ui/input";

export function SellerProductActions({ product }: { product: Product }) {
  const router = useRouter();
  const [quantity, setQuantity] = useState("1");
  const [requestedCommission, setRequestedCommission] = useState<number | null>(
    Number(product.commission),
  );
  const [note, setNote] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function recordSale() {
    setBusy(true);
    setError("");
    setMessage("");
    try {
      await api("/api/sales", {
        method: "POST",
        body: JSON.stringify({
          productId: product.id,
          quantity: Number(quantity),
        }),
      });
      setMessage("Penjualan tercatat.");
      router.refresh();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Gagal");
    } finally {
      setBusy(false);
    }
  }

  async function requestCommission() {
    setError("");
    setMessage("");
    if (requestedCommission == null) {
      setError("Komisi diajukan wajib diisi");
      return;
    }
    if (requestedCommission > Number(product.price)) {
      setError("Komisi tidak boleh lebih besar dari harga");
      return;
    }

    setBusy(true);
    try {
      await api("/api/commissions", {
        method: "POST",
        body: JSON.stringify({
          productId: product.id,
          requestedCommission,
          note,
        }),
      });
      setMessage("Pengajuan komisi terkirim.");
      router.refresh();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Gagal");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid gap-3">
      <div className="grid grid-cols-[1fr_auto] items-end gap-2">
        <Input
          label={`Jumlah terjual (stok ${product.stock})`}
          type="number"
          min="1"
          max={product.stock}
          value={quantity}
          onChange={(event) => setQuantity(event.target.value)}
        />
        <Button
          disabled={busy || product.stock < 1}
          onClick={() => void recordSale()}
        >
          Catat
        </Button>
      </div>
      <RupiahInput
        label={`Ajukan komisi (saat ini ${formatRupiah(product.commission)})`}
        value={requestedCommission}
        onValueChange={setRequestedCommission}
      />
      <Textarea
        label="Catatan (opsional)"
        value={note}
        onChange={(event) => setNote(event.target.value)}
      />
      <Button
        variant="secondary"
        disabled={busy}
        onClick={() => void requestCommission()}
      >
        Ajukan perubahan komisi
      </Button>
      {message ? <p className="text-sm text-brand">{message}</p> : null}
      {error ? <p className="text-sm text-red-700">{error}</p> : null}
    </div>
  );
}
