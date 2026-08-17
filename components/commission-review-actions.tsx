"use client";

import { useEffect, useState } from "react";
import type { CommissionRequest, CommissionStatus } from "@/lib/database.types";
import { api } from "@/lib/api-client";
import { formatDateTime, formatRupiah } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const statusTone = {
  pending: "gold",
  approved: "green",
  rejected: "danger",
} as const;

export type CommissionRequestItem = CommissionRequest & {
  products: { name: string } | { name: string }[] | null;
  profiles: { full_name: string } | { full_name: string }[] | null;
};

export function CommissionRequests({
  requests,
  isAdmin,
}: {
  requests: CommissionRequestItem[];
  isAdmin: boolean;
}) {
  const [items, setItems] = useState(requests);

  useEffect(() => {
    setItems(requests);
  }, [requests]);

  function markReviewed(id: number, status: CommissionStatus) {
    setItems((current) =>
      current.map((item) => (item.id === id ? { ...item, status } : item)),
    );
  }

  if (items.length === 0) {
    return (
      <Card>
        <p className="text-sm text-muted">Belum ada pengajuan komisi.</p>
      </Card>
    );
  }

  return (
    <div className="grid gap-4">
      {items.map((item) => {
        const product = Array.isArray(item.products)
          ? item.products[0]
          : item.products;
        const seller = Array.isArray(item.profiles)
          ? item.profiles[0]
          : item.profiles;

        return (
          <Card key={item.id}>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="mb-2 flex items-center gap-2">
                  <h2 className="font-display text-2xl">
                    {product?.name ?? "Barang"}
                  </h2>
                  <Badge tone={statusTone[item.status]}>{item.status}</Badge>
                </div>
                {isAdmin ? (
                  <p className="text-sm text-muted">
                    Diajukan oleh {seller?.full_name ?? "seller"}
                  </p>
                ) : null}
                <p className="mt-2 text-sm">
                  {formatRupiah(item.current_commission)} →{" "}
                  <strong>{formatRupiah(item.requested_commission)}</strong>
                </p>
                {item.note ? (
                  <p className="mt-2 text-sm text-muted">{item.note}</p>
                ) : null}
                <p className="mt-2 text-xs text-muted">
                  {formatDateTime(item.created_at)}
                </p>
              </div>
              {isAdmin && item.status === "pending" ? (
                <CommissionReviewActions
                  requestId={item.id}
                  requestedCommission={Number(item.requested_commission)}
                  onReviewed={(status) => markReviewed(item.id, status)}
                />
              ) : null}
            </div>
          </Card>
        );
      })}
    </div>
  );
}

function CommissionReviewActions({
  requestId,
  requestedCommission,
  onReviewed,
}: {
  requestId: number;
  requestedCommission: number;
  onReviewed: (status: "approved" | "rejected") => void;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function review(status: "approved" | "rejected") {
    setBusy(true);
    setError("");
    try {
      await api(`/api/commissions/${requestId}`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      onReviewed(status);
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Gagal meninjau pengajuan",
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid gap-2">
      <div className="flex flex-wrap gap-2">
        <Button disabled={busy} onClick={() => void review("approved")}>
          Setujui {formatRupiah(requestedCommission)}
        </Button>
        <Button
          variant="secondary"
          disabled={busy}
          onClick={() => void review("rejected")}
        >
          Tolak
        </Button>
      </div>
      {error ? <p className="text-sm text-red-700">{error}</p> : null}
    </div>
  );
}
