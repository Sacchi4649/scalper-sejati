"use client";

import { Image } from "antd";
import { cldPreviewUrl, cldUrl } from "@/lib/cld-url";
import { cn } from "@/lib/cn";

export function PreviewableImage({
  publicId,
  alt,
  className,
  width = 800,
}: {
  publicId: string;
  alt: string;
  className?: string;
  width?: number;
}) {
  return (
    <div className={cn("relative h-full w-full overflow-hidden bg-canvas", className)}>
      <Image
        src={cldUrl(publicId, width)}
        alt={alt}
        preview={{
          src: cldPreviewUrl(publicId),
          mask: "Lihat gambar",
        }}
        rootClassName="!block h-full w-full"
        className="!h-full !w-full !object-cover"
      />
    </div>
  );
}
