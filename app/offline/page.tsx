import { cn } from "@/lib/cn";

export default function OfflinePage() {
  return (
    <div className="grid min-h-dvh place-items-center px-6">
      <div className="w-full max-w-md text-center">
        <p className="text-xs font-medium uppercase tracking-[0.28em] text-gold">
          Scalper Sejati
        </p>
        <h1 className="mt-4 font-display text-4xl tracking-tight">
          Sedang offline
        </h1>
        <p className="mt-3 text-sm leading-6 text-muted">
          Koneksi terputus. Periksa internet, lalu buka ulang aplikasi.
        </p>
        <a
          href="/"
          className={cn(
            "mt-8 inline-flex h-11 items-center justify-center",
            "rounded-xl bg-brand px-4 text-sm font-medium text-white",
            "hover:bg-brand-dark",
          )}
        >
          Coba lagi
        </a>
      </div>
    </div>
  );
}
