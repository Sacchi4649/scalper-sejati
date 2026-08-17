"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Language, ProductWithLanguage } from "@/lib/database.types";
import { api } from "@/lib/api-client";
import { cn } from "@/lib/cn";
import { formatRupiah, nominalFinal } from "@/lib/format";
import { parseSearchQuery } from "@/lib/search";
import {
  isUncategorizedListing,
  productsPath,
  UNCATEGORIZED_LANGUAGE_LABEL,
  UNCATEGORIZED_LANGUAGE_SLUG,
} from "@/lib/product-languages";
import { AdminProductActions } from "@/components/admin-product-actions";
import { PageHeader } from "@/components/page-header";
import { ProductImage } from "@/components/product-image";
import { SellerProductActions } from "@/components/seller-product-actions";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Select } from "@/components/ui/input";
import { SearchInput } from "@/components/ui/search-input";
import { TruncatedName } from "@/components/ui/truncated-name";
import { ViewToggle, useListView } from "@/components/view-toggle";

export function ProductsCatalog({
  products,
  languages,
  isAdmin,
  languageSlug,
}: {
  products: ProductWithLanguage[];
  languages: Array<Pick<Language, "id" | "name" | "slug">>;
  isAdmin: boolean;
  languageSlug: string | null;
}) {
  const router = useRouter();
  const [view, setView] = useListView("scalper:products-view");
  const [query, setQuery] = useState("");
  const [base, setBase] = useState(products);
  const [results, setResults] = useState(products);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    setBase(products);
  }, [products]);

  useEffect(() => {
    if (!parseSearchQuery(query)) {
      setResults(base);
    }
  }, [base, query]);

  function patchProduct(id: number, patch: Partial<ProductWithLanguage>) {
    const apply = (list: ProductWithLanguage[]) =>
      list.map((item) => (item.id === id ? { ...item, ...patch } : item));
    setBase(apply);
    setResults(apply);
  }

  function removeProduct(id: number) {
    setBase((list) => list.filter((item) => item.id !== id));
    setResults((list) => list.filter((item) => item.id !== id));
  }

  function onLanguageFilter(next: string) {
    router.replace(productsPath(next || null));
  }

  useEffect(() => {
    const q = parseSearchQuery(query);
    if (!q) {
      setSearching(false);
      return;
    }

    const params = new URLSearchParams({ q });
    if (languageSlug) params.set("lang", languageSlug);

    const controller = new AbortController();
    const timer = window.setTimeout(() => {
      setSearching(true);
      void api<{ products: ProductWithLanguage[] }>(
        `/api/products?${params.toString()}`,
        { signal: controller.signal },
      )
        .then((payload) => {
          setResults(payload.products);
        })
        .catch((error: unknown) => {
          if (isAbortError(error)) return;
        })
        .finally(() => {
          if (!controller.signal.aborted) {
            setSearching(false);
          }
        });
    }, 300);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [languageSlug, query]);

  const hasQuery = Boolean(parseSearchQuery(query));
  const uncategorized = isUncategorizedListing(languageSlug);
  const selectedLanguage = languages.find((item) => item.slug === languageSlug);
  const emptyMessage = hasQuery
    ? "Tidak ada barang yang cocok dengan pencarian."
    : uncategorized
      ? "Tidak ada barang tanpa kategori bahasa."
      : selectedLanguage
        ? isAdmin
          ? `Belum ada barang ${selectedLanguage.name}. Mulai dengan mengunggah katalog pertama.`
          : `Belum ada barang ${selectedLanguage.name} yang bisa dijual.`
        : isAdmin
          ? "Belum ada barang. Mulai dengan mengunggah katalog pertama."
          : "Belum ada barang yang bisa dijual.";

  return (
    <>
      <PageHeader
        title={isAdmin ? "Barang" : "Listing"}
        description={
          isAdmin
            ? "Unggah barang, atur nama, kategori bahasa, harga, komisi, dan stok."
            : "Lihat barang yang dijual, catat penjualan, atau ajukan perubahan komisi."
        }
        actions={
          <>
            {isAdmin ? (
              <Link
                href="/products/new"
                className={cn(
                  "inline-flex h-11 w-full shrink-0 items-center justify-center",
                  "rounded-xl bg-brand px-4 sm:w-auto",
                  "text-sm font-medium text-white hover:bg-brand-dark",
                )}
              >
                Upload barang
              </Link>
            ) : null}
            <div className="grid min-w-0 w-full gap-3 sm:grid-cols-[minmax(0,1fr)_minmax(180px,220px)_auto] sm:items-end">
              <SearchInput
                value={query}
                onChange={setQuery}
                placeholder="Cari nama barang"
                searching={searching}
                className="min-w-0 w-full"
              />
              <Select
                label="Bahasa"
                value={languageSlug ?? ""}
                onChange={(event) => onLanguageFilter(event.target.value)}
              >
                <option value="">Semua bahasa</option>
                {languages.map((language) => (
                  <option key={language.id} value={language.slug}>
                    {language.name}
                  </option>
                ))}
                <option value={UNCATEGORIZED_LANGUAGE_SLUG}>
                  {UNCATEGORIZED_LANGUAGE_LABEL}
                </option>
              </Select>
              {products.length > 0 || results.length > 0 ? (
                <ViewToggle value={view} onChange={setView} />
              ) : null}
            </div>
          </>
        }
      />
      {results.length === 0 ? (
        <Card>
          <p className="text-sm text-muted">{emptyMessage}</p>
        </Card>
      ) : view === "grid" ? (
        <div
          className={cn(
            "grid gap-5 md:grid-cols-2 xl:grid-cols-3",
            searching && "opacity-60",
          )}
        >
          {results.map((product) => (
            <Card key={product.id} className="overflow-hidden p-0">
              <ProductImage
                publicId={product.image_public_id}
                alt={product.name}
                className="h-48 w-full"
              />
              <div className="grid gap-4 p-5">
                <ProductMeta product={product} />
                {isAdmin ? (
                  <AdminProductActions
                    product={product}
                    onDeleted={() => removeProduct(product.id)}
                  />
                ) : (
                  <SellerProductActions
                    product={product}
                    onProductUpdate={(patch) => patchProduct(product.id, patch)}
                  />
                )}
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className={cn("grid gap-3", searching && "opacity-60")}>
          {results.map((product) => (
            <Card
              key={product.id}
              className={cn(
                "min-w-0 overflow-hidden",
                "grid gap-4",
                isAdmin
                  ? "md:grid-cols-[minmax(0,1fr)_auto] md:items-center"
                  : "xl:grid-cols-[minmax(0,1fr)_minmax(280px,0.9fr)] xl:items-start",
              )}
            >
              <div className="flex min-w-0 items-start gap-3 sm:gap-4">
                <ProductImage
                  publicId={product.image_public_id}
                  alt={product.name}
                  className="h-16 w-16 shrink-0 rounded-xl sm:h-20 sm:w-20"
                />
                <ProductMeta product={product} compact />
              </div>
              {isAdmin ? (
                <div className="md:justify-self-end">
                  <AdminProductActions
                    product={product}
                    onDeleted={() => removeProduct(product.id)}
                  />
                </div>
              ) : (
                <SellerProductActions
                  product={product}
                  onProductUpdate={(patch) => patchProduct(product.id, patch)}
                />
              )}
            </Card>
          ))}
        </div>
      )}
    </>
  );
}

function languageName(product: ProductWithLanguage) {
  const language = Array.isArray(product.languages)
    ? product.languages[0]
    : product.languages;
  return language?.name ?? null;
}

function ProductMeta({
  product,
  compact = false,
}: {
  product: ProductWithLanguage;
  compact?: boolean;
}) {
  const language = languageName(product);

  return (
    <div className={cn("min-w-0", compact ? "grid gap-1.5" : "grid gap-3")}>
      <div
        className={cn(
          "min-w-0",
          compact
            ? "grid gap-1.5"
            : "grid gap-2 sm:flex sm:items-start sm:justify-between sm:gap-3",
        )}
      >
        <h2
          className={cn(
            "min-w-0 font-display tracking-tight",
            compact ? "text-lg md:text-xl" : "text-2xl sm:min-w-0 sm:flex-1",
          )}
        >
          <TruncatedName>{product.name}</TruncatedName>
        </h2>
        <div
          className={cn(
            "flex flex-wrap gap-1",
            compact ? "" : "sm:shrink-0 sm:justify-end",
          )}
        >
          {language ? <Badge tone="muted">{language}</Badge> : null}
          <Badge tone="gold">Komisi {formatRupiah(product.commission)}</Badge>
          <Badge tone={product.stock > 0 ? "green" : "danger"}>
            {product.stock > 0 ? `Stok ${product.stock}` : "Habis"}
          </Badge>
        </div>
      </div>
      {compact ? (
        <p className="flex min-w-0 flex-wrap gap-x-2 gap-y-0.5 text-sm text-muted">
          <span>Harga {formatRupiah(product.price)}</span>
          <span>Final {formatRupiah(nominalFinal(product.price, product.commission))}</span>
        </p>
      ) : (
        <p className="text-sm">
          Harga {formatRupiah(product.price)}
          <span className="mt-1 block">
            Nominal final{" "}
            <strong>
              {formatRupiah(nominalFinal(product.price, product.commission))}
            </strong>
          </span>
        </p>
      )}
    </div>
  );
}

function isAbortError(error: unknown) {
  return error instanceof Error && error.name === "AbortError";
}
