"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export function SearchInput({
  value,
  onChange,
  placeholder,
  searching = false,
  className,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  searching?: boolean;
  className?: string;
}) {
  return (
    <label className={cn("relative block min-w-0 w-full", className)}>
      <span className="sr-only">{placeholder ?? "Cari"}</span>
      <span
        className={cn(
          "pointer-events-none absolute top-1/2 left-3 -translate-y-1/2",
          "text-muted",
        )}
      >
        {searching ? <SpinnerIcon /> : <SearchIcon />}
      </span>
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        autoComplete="off"
        className={cn(
          "h-11 w-full min-w-0", // layout
          "rounded-xl border border-line bg-white py-0 pr-10 pl-10", // box
          "text-sm text-ink outline-none placeholder:text-muted", // type
          "focus:border-brand focus:ring-2 focus:ring-brand/20", // state
        )}
      />
      {value ? (
        <button
          type="button"
          aria-label="Hapus pencarian"
          onClick={() => onChange("")}
          className={cn(
            "absolute top-1/2 right-2 -translate-y-1/2", // layout
            "grid h-7 w-7 place-items-center rounded-lg", // box
            "text-muted hover:bg-canvas hover:text-ink", // state
          )}
        >
          <CloseIcon />
        </button>
      ) : null}
    </label>
  );
}

function SearchIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      aria-hidden="true"
      className="h-4 w-4 fill-none stroke-current"
      strokeWidth="1.6"
    >
      <circle cx="7" cy="7" r="4.5" />
      <path strokeLinecap="round" d="m10.5 10.5 3 3" />
    </svg>
  );
}

function SpinnerIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      aria-hidden="true"
      className="h-4 w-4 animate-spin fill-none stroke-current"
      strokeWidth="1.6"
    >
      <circle cx="8" cy="8" r="5" className="opacity-25" />
      <path strokeLinecap="round" d="M13 8a5 5 0 0 0-5-5" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      aria-hidden="true"
      className="h-3.5 w-3.5 stroke-current"
      strokeWidth="1.8"
      fill="none"
    >
      <path strokeLinecap="round" d="m4 4 8 8M12 4l-8 8" />
    </svg>
  );
}
