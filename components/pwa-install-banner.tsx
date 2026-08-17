"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

const DISMISS_KEY = "scalper:pwa-banner-dismissed";

export function PwaInstallBanner() {
  const [installEvent, setInstallEvent] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [host, setHost] = useState("");
  const [busy, setBusy] = useState(false);
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    setHost(window.location.host);
    setDismissed(window.sessionStorage.getItem(DISMISS_KEY) === "1");

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

  if (!installEvent || dismissed) return null;

  return (
    <div
      className={cn(
        "pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center lg:hidden",
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
        <button
          type="button"
          aria-label="Tutup"
          className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-white/55 hover:bg-white/10 hover:text-white"
          onClick={() => {
            window.sessionStorage.setItem(DISMISS_KEY, "1");
            setDismissed(true);
          }}
        >
          <CloseIcon />
        </button>
      </div>
    </div>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className="h-3.5 w-3.5 fill-current">
      <path d="M3.2 3.2a.75.75 0 0 1 1.06 0L8 6.94l3.74-3.74a.75.75 0 1 1 1.06 1.06L9.06 8l3.74 3.74a.75.75 0 1 1-1.06 1.06L8 9.06l-3.74 3.74a.75.75 0 1 1-1.06-1.06L6.94 8 3.2 4.26a.75.75 0 0 1 0-1.06Z" />
    </svg>
  );
}
