"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import type { ReactCropperElement } from "react-cropper";
import { api } from "@/lib/api-client";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/button";
import { PreviewableImage } from "@/components/preview-image";
import "cropperjs/dist/cropper.css";

const Cropper = dynamic(() => import("react-cropper"), { ssr: false });

type SignedUpload = {
  timestamp: number;
  signature: string;
  folder: string;
  apiKey: string;
  cloudName: string;
  uploadUrl: string;
};

export function ImageUpload({
  value,
  onChange,
}: {
  value?: string | null;
  onChange: (next: { publicId: string; url: string }) => void;
}) {
  const cropperRef = useRef<ReactCropperElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [sourceUrl, setSourceUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    return () => {
      if (sourceUrl) URL.revokeObjectURL(sourceUrl);
    };
  }, [sourceUrl]);

  function closeCropper() {
    if (sourceUrl) URL.revokeObjectURL(sourceUrl);
    setSourceUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function handleFile(file: File) {
    setError("");
    if (!file.type.startsWith("image/")) {
      setError("File harus berupa gambar");
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      setError("Ukuran gambar maksimal 8 MB");
      return;
    }

    if (sourceUrl) URL.revokeObjectURL(sourceUrl);
    setSourceUrl(URL.createObjectURL(file));
  }

  async function uploadBlob(blob: Blob) {
    const signed = await api<SignedUpload>("/api/upload/sign", {
      method: "POST",
    });
    const form = new FormData();
    form.append("file", blob, "product.jpg");
    form.append("api_key", signed.apiKey);
    form.append("timestamp", String(signed.timestamp));
    form.append("signature", signed.signature);
    form.append("folder", signed.folder);

    const response = await fetch(signed.uploadUrl, {
      method: "POST",
      body: form,
    });
    const payload = (await response.json()) as {
      error?: { message?: string };
      public_id?: string;
      secure_url?: string;
    };

    if (!response.ok || !payload.public_id || !payload.secure_url) {
      throw new Error(payload.error?.message ?? "Upload ke Cloudinary gagal");
    }

    onChange({ publicId: payload.public_id, url: payload.secure_url });
  }

  async function confirmCrop() {
    const cropper = cropperRef.current?.cropper;
    if (!cropper) {
      setError("Cropper belum siap. Coba lagi.");
      return;
    }

    const canvas = cropper.getCroppedCanvas({
      maxWidth: 1600,
      maxHeight: 1600,
      imageSmoothingQuality: "high",
      fillColor: "#ffffff",
    });

    if (!canvas) {
      setError("Gagal memotong gambar");
      return;
    }

    setUploading(true);
    setError("");
    try {
      const blob = await new Promise<Blob | null>((resolve) => {
        canvas.toBlob(resolve, "image/jpeg", 0.9);
      });
      if (!blob) {
        throw new Error("Gagal menyiapkan gambar hasil crop");
      }
      await uploadBlob(blob);
      closeCropper();
    } catch (uploadError) {
      setError(
        uploadError instanceof Error ? uploadError.message : "Upload gagal",
      );
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="grid gap-3">
      <div
        className={cn(
          "relative overflow-hidden", // layout
          "h-48 rounded-2xl border border-dashed border-line bg-canvas", // box
        )}
      >
        {value ? (
          <PreviewableImage
            publicId={value}
            alt="Pratinjau barang"
            className="h-full w-full"
            width={720}
          />
        ) : (
          <div className="grid h-full place-items-center text-sm text-muted">
            {uploading ? "Mengunggah ke Cloudinary..." : "Belum ada gambar"}
          </div>
        )}
      </div>
      <label>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) handleFile(file);
          }}
        />
        <span
          className={cn(
            "inline-flex h-11 items-center justify-center", // layout
            "rounded-xl border border-line bg-white px-4", // box
            "cursor-pointer text-sm font-medium", // type
          )}
        >
          {value ? "Ganti gambar" : "Pilih gambar"}
        </span>
      </label>
      {error ? <p className="text-sm text-red-700">{error}</p> : null}
      {value ? (
        <Button
          variant="secondary"
          onClick={() => onChange({ publicId: "", url: "" })}
        >
          Hapus gambar
        </Button>
      ) : null}

      {sourceUrl ? (
        <div
          className={cn(
            "fixed inset-0 z-50 grid place-items-center p-4", // layout
            "bg-ink/50", // overlay
          )}
        >
          <div
            className={cn(
              "grid w-full max-w-2xl gap-4", // layout
              "rounded-3xl border border-line bg-white p-5", // box
              "shadow-[0_24px_60px_rgba(19,36,28,0.16)]", // elevation
            )}
          >
            <div>
              <h3 className="font-display text-xl">Potong gambar</h3>
              <p className="mt-1 text-sm text-muted">
                Geser dan zoom area crop, lalu unggah hasilnya.
              </p>
            </div>
            <div className="overflow-hidden rounded-2xl bg-canvas">
              <Cropper
                ref={cropperRef}
                src={sourceUrl}
                alt="Gambar untuk dipotong"
                aspectRatio={1}
                viewMode={1}
                dragMode="move"
                autoCropArea={0.9}
                background={false}
                responsive
                guides
                style={{ height: 360, width: "100%" }}
              />
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <Button
                variant="secondary"
                disabled={uploading}
                onClick={() => cropperRef.current?.cropper.rotate(90)}
              >
                Putar
              </Button>
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  disabled={uploading}
                  onClick={closeCropper}
                >
                  Batal
                </Button>
                <Button disabled={uploading} onClick={() => void confirmCrop()}>
                  {uploading ? "Mengunggah..." : "Potong & unggah"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
