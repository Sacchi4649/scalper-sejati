"use client";

import { ConfirmModal } from "@/components/confirm-modal";

export function ConfirmDeleteModal({
  open,
  title,
  description,
  error,
  loading = false,
  onCancel,
  onConfirm,
}: {
  open: boolean;
  title: string;
  description?: string;
  error?: string;
  loading?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <ConfirmModal
      open={open}
      title={title}
      description={description}
      error={error}
      loading={loading}
      okText="Hapus"
      danger
      onCancel={onCancel}
      onConfirm={onConfirm}
    />
  );
}
