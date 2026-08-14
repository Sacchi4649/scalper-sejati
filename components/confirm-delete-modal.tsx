"use client";

import { Modal } from "antd";

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
    <Modal
      title={title}
      open={open}
      onOk={onConfirm}
      onCancel={loading ? undefined : onCancel}
      okText="Hapus"
      cancelText="Batal"
      okButtonProps={{ danger: true, loading }}
      cancelButtonProps={{ disabled: loading }}
      centered
      closable={!loading}
      mask={{ closable: !loading }}
    >
      {description ? <p className="m-0 text-sm text-muted">{description}</p> : null}
      {error ? <p className="mt-3 mb-0 text-sm text-red-700">{error}</p> : null}
    </Modal>
  );
}
