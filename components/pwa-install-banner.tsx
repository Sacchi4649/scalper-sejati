"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

export function PwaInstallBanner() {
  const [installEvent, setInstallEvent] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [host, setHost] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setHost(window.location.host);

    function onPrompt(event: Event) {
      event.preventDefault();
      setInstallEvent(event as BeforeInstallPromptEvent);
    }

    function onInstalled() {
      setInstallEvent(null);
    }

    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  if (!installEvent) return null;

  return (
    <div
      className={cn(
        "pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center",
        "px-3 pt-[max(0.75rem,env(safe-area-inset-top))]",
      )}
    >
      <div
        className={cn(
          "pointer-events-auto flex w-full max-w-lg items-center gap-3",
          "rounded-2xl bg-[#2c2c2c] px-3 py-2.5",
          "shadow-[0_12px_32px_rgba(0,0,0,0.28)]",
        )}
        role="status"
      >
        <img
          src="/icons/192"
          alt=""
          width={40}
          height={40}
          className="h-10 w-10 shrink-0 rounded-lg"
        />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-white">
            Instal Scalper Sejati
          </p>
          <p className="truncate text-xs text-white/50">{host}</p>
        </div>
        <button
          type="button"
          disabled={busy}
          className="shrink-0 px-2 text-sm font-semibold text-gold disabled:opacity-60"
          onClick={async () => {
            setBusy(true);
            try {
              await installEvent.prompt();
              await installEvent.userChoice;
            } finally {
              setInstallEvent(null);
              setBusy(false);
            }
          }}
        >
          Instal
        </button>
      </div>
    </div>
  );
}
