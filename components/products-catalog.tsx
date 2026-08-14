"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Product } from "@/lib/database.types";
import { api } from "@/lib/api-client";
import { cn } from "@/lib/cn";
import { formatRupiah } from "@/lib/format";
import { parseSearchQuery } from "@/lib/search";
import { AdminProductActions } from "@/components/admin-product-actions";
import { PageHeader } from "@/components/page-header";
import { ProductImage } from "@/components/product-image";
import { SellerProductActions } from "@/components/seller-product-actions";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { SearchInput } from "@/components/ui/search-input";
import { ViewToggle, useListView } from "@/components/view-toggle";

export function ProductsCatalog({
  products,
  isAdmin,
}: {
  products: Product[];
  isAdmin: boolean;
}) {
  const [view, setView] = useListView("scalper:products-view");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState(products);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    const q = parseSearchQuery(query);
    if (!q) {
      setResults(products);
      setSearching(false);
      return;
    }

    const controller = new AbortController();
    const timer = window.setTimeout(() => {
      setSearching(true);
      void api<{ products: Product[] }>(
        `/api/products?q=${encodeURIComponent(q)}`,
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
  }, [products, query]);

  const hasQuery = Boolean(parseSearchQuery(query));
  const emptyMessage = hasQuery
    ? "Tidak ada barang yang cocok dengan pencarian."
    : isAdmin
      ? "Belum ada barang. Mulai dengan mengunggah katalog pertama."
      : "Belum ada barang yang bisa dijual.";

  return (
    <>
      <PageHeader
        title={isAdmin ? "Barang jualan" : "Listing barang"}
        description={
          isAdmin
            ? "Unggah barang, atur nama, harga, open price, komisi, dan stok."
            : "Lihat barang yang dijual, catat penjualan, atau ajukan perubahan komisi."
        }
        actions={
          <>
            {isAdmin ? (
              <Link
                href="/products/new"
                className={cn(
                  "inline-flex h-11 w-full shrink-0 items-center justify-center", // layout
                  "rounded-xl bg-brand px-4 sm:w-auto", // box
                  "text-sm font-medium text-white hover:bg-brand-dark", // type + state
                )}
              >
                Upload barang
              </Link>
            ) : null}
            <div className="grid min-w-0 w-full gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
              <SearchInput
                value={query}
                onChange={setQuery}
                placeholder="Cari nama barang"
                searching={searching}
                className="min-w-0 w-full"
              />
              {products.length > 0 ? (
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
                  <AdminProductActions product={product} />
                ) : (
                  <SellerProductActions product={product} />
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
                "grid gap-4",
                isAdmin
                  ? "md:grid-cols-[minmax(0,1fr)_auto] md:items-center"
                  : "xl:grid-cols-[minmax(0,1fr)_minmax(280px,0.9fr)] xl:items-start",
              )}
            >
              <div className="flex min-w-0 items-start gap-4 md:items-center">
                <ProductImage
                  publicId={product.image_public_id}
                  alt={product.name}
                  className="h-16 w-16 shrink-0 rounded-xl md:h-20 md:w-20"
                />
                <ProductMeta product={product} compact />
              </div>
              {isAdmin ? (
                <div className="md:justify-self-end">
                  <AdminProductActions product={product} />
                </div>
              ) : (
                <SellerProductActions product={product} />
              )}
            </Card>
          ))}
        </div>
      )}
    </>
  );
}

function ProductMeta({
  product,
  compact = false,
}: {
  product: Product;
  compact?: boolean;
}) {
  return (
    <div className={cn("min-w-0", compact ? "grid gap-1" : "grid gap-4")}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2
            className={cn(
              "truncate font-display tracking-tight",
              compact ? "text-lg md:text-xl" : "text-2xl",
            )}
          >
            {product.name}
          </h2>
          <p className="text-sm text-muted">
            Harga {formatRupiah(product.price)}
            {compact ? ` · Open ${formatRupiah(product.open_price)}` : ""}
          </p>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1">
          <Badge tone="gold">Komisi {formatRupiah(product.commission)}</Badge>
          <Badge tone={product.stock > 0 ? "green" : "danger"}>
            {product.stock > 0 ? `Stok ${product.stock}` : "Habis"}
          </Badge>
        </div>
      </div>
      {compact ? null : (
        <p className="text-sm">
          Open price <strong>{formatRupiah(product.open_price)}</strong>
        </p>
      )}
    </div>
  );
}

function isAbortError(error: unknown) {
  return error instanceof Error && error.name === "AbortError";
}
