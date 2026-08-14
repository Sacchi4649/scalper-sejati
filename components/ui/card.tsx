import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export { PageHeader } from "@/components/page-header";

export function Card({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-line bg-white", // box
        "p-5 shadow-[0_10px_30px_rgba(19,36,28,0.04)]", // elevation
        className,
      )}
      {...props}
    />
  );
}
