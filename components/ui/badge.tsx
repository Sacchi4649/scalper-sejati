import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

const tones = {
  gold: "bg-gold/15 text-brand-dark",
  green: "bg-brand/10 text-brand",
  muted: "bg-line text-muted",
  danger: "bg-red-100 text-red-800",
};

export function Badge({
  children,
  tone = "muted",
  className,
}: {
  children: ReactNode;
  tone?: keyof typeof tones;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center", // layout
        "rounded-full px-2.5 py-1", // box
        "text-[11px] font-semibold uppercase tracking-wide", // type
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
