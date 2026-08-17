"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Language, Product } from "@/lib/database.types";
import { api } from "@/lib/api-client";
import { formatRupiah, nominalFinal } from "@/lib/format";
import {
  DEFAULT_PRODUCT_LANGUAGE,
  isProductLanguageSlug,
  productsPath,
} from "@/lib/product-languages";
import { Button } from "@/components/ui/button";
import { Input, RupiahInput, Select } from "@/components/ui/input";
import { ImageUpload } from "@/components/image-upload";

function toAmount(value: number | string | null | undefined) {
  if (value == null || value === "") return null;
  const amount = Number(value);
  return Number.isFinite(amount) ? amount : null;
}

export function ProductForm({
  product,
  languages,
}: {
  product?: Product;
  languages: Language[];
}) {
  const router = useRouter();
  const [name, setName] = useState(product?.name ?? "");
  const [languageId, setLanguageId] = useState(
    product?.language_id?.toString() ?? "",
  );
  const [price, setPrice] = useState<number | null>(toAmount(product?.price));
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

    if (!languageId) {
      setError("Kategori bahasa wajib dipilih");
      return;
    }

    if (price == null || commission == null) {
      setError("Harga dan komisi wajib diisi");
      return;
    }

    if (commission > price) {
      setError("Komisi tidak boleh lebih besar dari harga");
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
      languageId: Number(languageId),
      price,
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
      const selected = languages.find(
        (language) => String(language.id) === languageId,
      );
      const nextLang = isProductLanguageSlug(selected?.slug)
        ? selected.slug
        : DEFAULT_PRODUCT_LANGUAGE;
      router.push(productsPath(nextLang));
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
        <Select
          label="Kategori bahasa"
          name="languageId"
          value={languageId}
          onChange={(event) => setLanguageId(event.target.value)}
          required
        >
          <option value="">Pilih kategori bahasa</option>
          {languages.map((language) => (
            <option key={language.id} value={language.id}>
              {language.name}
            </option>
          ))}
        </Select>
        {languages.length === 0 ? (
          <p className="text-sm text-muted">
            Belum ada kategori bahasa. Tambah dulu di menu Master data.
          </p>
        ) : null}
        <RupiahInput
          label="Harga"
          name="price"
          value={price}
          onValueChange={setPrice}
          required
        />
        <RupiahInput
          label="Komisi"
          name="commission"
          value={commission}
          onValueChange={setCommission}
          required
        />
        <div className="rounded-xl border border-line bg-canvas px-3 py-3">
          <p className="text-sm font-medium">Nominal final</p>
          <p className="mt-1 font-display text-2xl">
            {price == null || commission == null
              ? "—"
              : formatRupiah(nominalFinal(price, commission))}
          </p>
          <p className="mt-1 text-xs text-muted">
            Harga dikurangi komisi. Nominal yang ditransfer ke owner.
          </p>
        </div>
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
          <Button type="submit" disabled={saving || languages.length === 0}>
            {saving ? "Menyimpan..." : "Simpan barang"}
          </Button>
          <Button variant="secondary" onClick={() => router.push(productsPath())}>
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
