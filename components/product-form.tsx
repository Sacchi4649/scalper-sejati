"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Product } from "@/lib/database.types";
import { api } from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import { Input, RupiahInput } from "@/components/ui/input";
import { ImageUpload } from "@/components/image-upload";

function toAmount(value: number | string | null | undefined) {
  if (value == null || value === "") return null;
  const amount = Number(value);
  return Number.isFinite(amount) ? amount : null;
}

export function ProductForm({ product }: { product?: Product }) {
  const router = useRouter();
  const [name, setName] = useState(product?.name ?? "");
  const [price, setPrice] = useState<number | null>(toAmount(product?.price));
  const [openPrice, setOpenPrice] = useState<number | null>(
    toAmount(product?.open_price),
  );
  const [commission, setCommission] = useState<number | null>(
    toAmount(product?.commission),
  );
  const [stock, setStock] = useState(product?.stock?.toString() ?? "1");
  const [imagePublicId, setImagePublicId] = useState(
    product?.image_public_id ?? "",
  );
  const [imageUrl, setImageUrl] = useState(product?.image_url ?? "");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (price == null || openPrice == null || commission == null) {
      setError("Harga, open price, dan komisi wajib diisi");
      return;
    }

    const stockValue = Number(stock);
    if (!Number.isInteger(stockValue) || stockValue < 1) {
      setError("Stok minimal 1");
      return;
    }

    setSaving(true);

    const payload = {
      name,
      price,
      openPrice,
      commission,
      stock: stockValue,
      imagePublicId: imagePublicId || null,
      imageUrl: imageUrl || null,
    };

    try {
      if (product) {
        await api(`/api/products/${product.id}`, {
          method: "PATCH",
          body: JSON.stringify(payload),
        });
      } else {
        await api("/api/products", {
          method: "POST",
          body: JSON.stringify(payload),
        });
      }
      router.push("/products");
      router.refresh();
    } catch (submitError) {
      setError(
        submitError instanceof Error ? submitError.message : "Gagal menyimpan",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px]"
    >
      <div className="grid gap-4">
        <Input
          label="Nama barang"
          name="name"
          placeholder="Contoh: Pokemon TCG Booster Box"
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
        />
        <RupiahInput
          label="Harga"
          name="price"
          value={price}
          onValueChange={setPrice}
          required
        />
        <RupiahInput
          label="Open price"
          name="openPrice"
          value={openPrice}
          onValueChange={setOpenPrice}
          required
        />
        <RupiahInput
          label="Komisi"
          name="commission"
          value={commission}
          onValueChange={setCommission}
          required
        />
        <Input
          label="Stok"
          name="stock"
          type="number"
          min="1"
          step="1"
          value={stock}
          onChange={(event) => setStock(event.target.value)}
          required
        />
        {error ? <p className="text-sm text-red-700">{error}</p> : null}
        <div className="flex gap-3">
          <Button type="submit" disabled={saving}>
            {saving ? "Menyimpan..." : "Simpan barang"}
          </Button>
          <Button variant="secondary" onClick={() => router.push("/products")}>
            Batal
          </Button>
        </div>
      </div>
      <ImageUpload
        value={imagePublicId}
        onChange={({ publicId, url }) => {
          setImagePublicId(publicId);
          setImageUrl(url);
        }}
      />
    </form>
  );
}
