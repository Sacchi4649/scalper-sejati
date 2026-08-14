import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
};

const variants = {
  primary: "bg-brand text-white hover:bg-brand-dark",
  secondary: "border border-line bg-white text-ink hover:bg-canvas",
  ghost: "text-white/80 hover:bg-white/10 hover:text-white",
  danger: "bg-red-700 text-white hover:bg-red-800",
};

export function Button({
  className,
  variant = "primary",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex items-center justify-center gap-2", // layout
        "h-11 rounded-xl px-4", // box
        "text-sm font-medium transition-colors disabled:opacity-60", // type + state
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}
