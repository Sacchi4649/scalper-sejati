"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { api } from "@/lib/api-client";
import { formatRupiah } from "@/lib/format";
import { Button } from "@/components/ui/button";

export function CommissionReviewActions({
  requestId,
  requestedCommission,
}: {
  requestId: number;
  requestedCommission: number;
}) {
  const router = useRouter();
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
      router.refresh();
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
