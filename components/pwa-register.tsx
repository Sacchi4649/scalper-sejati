"use client";

import { useEffect } from "react";
import { PwaInstallBanner } from "@/components/pwa-install-banner";

export function PwaRegister() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    if (!("serviceWorker" in navigator)) return;

    void navigator.serviceWorker.register("/sw.js", { scope: "/" });
  }, []);

  return <PwaInstallBanner />;
}
