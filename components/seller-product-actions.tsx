"use client";

import { useState } from "react";
import type { Product } from "@/lib/database.types";
import { api } from "@/lib/api-client";
import { formatRupiah } from "@/lib/format";
import { ConfirmModal } from "@/components/confirm-modal";
import { Button } from "@/components/ui/button";
import { Input, RupiahInput, Textarea } from "@/components/ui/input";

export function SellerProductActions({
  product,
  onProductUpdate,
}: {
  product: Product;
  onProductUpdate?: (patch: Partial<Product>) => void;
}) {
  const [quantity, setQuantity] = useState("1");
  const [requestedCommission, setRequestedCommission] = useState<number | null>(
    Number(product.commission),
  );
  const [note, setNote] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [confirm, setConfirm] = useState<"sale" | "commission" | null>(null);

  function openSaleConfirm() {
    setError("");
    setMessage("");
    const qty = Number(quantity);
    if (!Number.isInteger(qty) || qty < 1) {
      setError("Jumlah tidak valid");
      return;
    }
    if (qty > product.stock) {
      setError("Stok tidak cukup");
      return;
    }
    setConfirm("sale");
  }

  function openCommissionConfirm() {
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
    setConfirm("commission");
  }

  async function recordSale() {
    setBusy(true);
    setError("");
    setMessage("");
    try {
      const payload = await api<{ product: { id: number; stock: number } }>(
        "/api/sales",
        {
          method: "POST",
          body: JSON.stringify({
            productId: product.id,
            quantity: Number(quantity),
          }),
        },
      );
      setConfirm(null);
      setQuantity("1");
      setMessage("Penjualan tercatat.");
      onProductUpdate?.({
        stock: payload.product?.stock ?? product.stock - Number(quantity),
      });
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Gagal");
    } finally {
      setBusy(false);
    }
  }

  async function requestCommission() {
    setBusy(true);
    setError("");
    setMessage("");
    try {
      await api("/api/commissions", {
        method: "POST",
        body: JSON.stringify({
          productId: product.id,
          requestedCommission,
          note,
        }),
      });
      setConfirm(null);
      setNote("");
      setMessage("Pengajuan komisi terkirim.");
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Gagal");
    } finally {
      setBusy(false);
    }
  }

  const saleQty = Number(quantity);
  const commissionConfirmOpen = confirm === "commission";
  const saleConfirmOpen = confirm === "sale";

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
          onClick={openSaleConfirm}
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
        onClick={openCommissionConfirm}
      >
        Ajukan perubahan komisi
      </Button>
      {message ? <p className="text-sm text-brand">{message}</p> : null}
      {error && !confirm ? <p className="text-sm text-red-700">{error}</p> : null}
      <ConfirmModal
        open={saleConfirmOpen}
        title={`Catat penjualan ${product.name}?`}
        description={`${saleQty} unit akan dicatat. Stok berkurang menjadi ${Math.max(product.stock - saleQty, 0)}.`}
        error={saleConfirmOpen ? error : undefined}
        loading={busy}
        okText="Catat"
        onCancel={() => setConfirm(null)}
        onConfirm={() => void recordSale()}
      />
      <ConfirmModal
        open={commissionConfirmOpen}
        title={`Ajukan perubahan komisi ${product.name}?`}
        description={`Komisi ${formatRupiah(product.commission)} menjadi ${formatRupiah(requestedCommission)}.`}
        error={commissionConfirmOpen ? error : undefined}
        loading={busy}
        okText="Ajukan"
        onCancel={() => setConfirm(null)}
        onConfirm={() => void requestCommission()}
      />
    </div>
  );
}
