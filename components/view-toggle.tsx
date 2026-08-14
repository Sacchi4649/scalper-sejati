"use client";

import { useEffect, useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";

export type ListView = "grid" | "rows";

export function useListView(storageKey: string, fallback: ListView = "grid") {
  const [view, setView] = useState<ListView>(fallback);

  useEffect(() => {
    const stored = window.localStorage.getItem(storageKey);
    if (stored === "grid" || stored === "rows") {
      setView(stored);
    }
  }, [storageKey]);

  function change(next: ListView) {
    setView(next);
    window.localStorage.setItem(storageKey, next);
  }

  return [view, change] as const;
}

function GridIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className="h-4 w-4 fill-current">
      <rect x="1" y="1" width="6" height="6" rx="1.2" />
      <rect x="9" y="1" width="6" height="6" rx="1.2" />
      <rect x="1" y="9" width="6" height="6" rx="1.2" />
      <rect x="9" y="9" width="6" height="6" rx="1.2" />
    </svg>
  );
}

function RowsIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className="h-4 w-4 fill-current">
      <rect x="1" y="2" width="14" height="3" rx="1" />
      <rect x="1" y="6.5" width="14" height="3" rx="1" />
      <rect x="1" y="11" width="14" height="3" rx="1" />
    </svg>
  );
}

export function ViewToggle({
  value,
  onChange,
}: {
  value: ListView;
  onChange: (view: ListView) => void;
}) {
  const options: { id: ListView; label: string; icon: ReactNode }[] = [
    { id: "grid", label: "Grid", icon: <GridIcon /> },
    { id: "rows", label: "Baris", icon: <RowsIcon /> },
  ];

  return (
    <div
      className={cn(
        "inline-flex w-full shrink-0 justify-center rounded-xl p-1 sm:w-auto", // box
        "border border-line bg-white", // color
      )}
      role="group"
      aria-label="Ubah tampilan daftar"
    >
      {options.map((option) => {
        const active = value === option.id;
        return (
          <button
            key={option.id}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(option.id)}
            className={cn(
              "inline-flex h-9 items-center gap-2 rounded-lg px-2.5 sm:px-3", // layout
              "text-sm font-medium transition-colors", // type
              active
                ? "bg-sidebar text-white"
                : "text-muted hover:bg-canvas hover:text-ink",
            )}
          >
            {option.icon}
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
