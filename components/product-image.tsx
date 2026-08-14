"use client";

import { cn } from "@/lib/cn";
import { PreviewableImage } from "@/components/preview-image";

export function ProductImage({
  publicId,
  alt,
  className,
}: {
  publicId?: string | null;
  alt: string;
  className?: string;
}) {
  if (!publicId) {
    return (
      <div
        className={cn(
          "grid place-items-center bg-canvas text-sm text-muted",
          className,
        )}
      >
        Belum ada foto
      </div>
    );
  }

  return (
    <PreviewableImage
      publicId={publicId}
      alt={alt}
      className={className}
    />
  );
}
