import { cn } from "@/lib/cn";
import { LoginForm } from "@/components/login-form";
import { PwaInstallButton } from "@/components/pwa-install-button";

export default function LoginPage() {
  return (
    <div
      className={cn(
        "grid min-h-dvh", // layout
        "lg:grid-cols-2", // split
      )}
    >
      <section
        className={cn(
          "relative hidden overflow-hidden lg:flex lg:flex-col lg:justify-between", // layout
          "bg-sidebar px-12 py-14 text-white", // box + color
        )}
      >
        <div
          className={cn(
            "pointer-events-none absolute inset-0", // layout
            "bg-[radial-gradient(circle_at_top_left,rgba(196,163,90,0.18),transparent_42%),radial-gradient(circle_at_bottom_right,rgba(15,107,77,0.55),transparent_46%)]", // wash
          )}
        />
        <div
          className={cn(
            "pointer-events-none absolute -right-24 top-1/4 h-80 w-80", // layout
            "rounded-full border border-gold/20", // box
          )}
        />
        <div
          className={cn(
            "pointer-events-none absolute -right-8 top-1/3 h-52 w-52", // layout
            "rounded-full border border-white/10", // box
          )}
        />

        <p className="relative text-xs font-medium uppercase tracking-[0.32em] text-gold">
          Scalper Sejati
        </p>
        <div className="relative max-w-lg">
          <div className="mb-6 h-px w-16 bg-gold/70" />
          <h1 className="font-display text-5xl leading-[1.12] text-balance">
            Tracking penjualan yang rapi, dari barang sampai komisi.
          </h1>
          <p className="mt-6 max-w-md text-base leading-7 text-white/70">
            Super admin mengatur katalog, harga, dan ringkasan. Seller melihat
            listing lalu mengajukan perubahan komisi.
          </p>
        </div>
        <p className="relative text-sm text-white/45">
          Masuk sesuai peran Anda.
        </p>
      </section>

      <section
        className={cn(
          "flex items-center justify-center", // layout
          "px-6 py-10 sm:px-10", // spacing
        )}
      >
        <div className="w-full max-w-md">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.28em] text-gold lg:hidden">
            Scalper Sejati
          </p>
          <h2 className="font-display text-4xl tracking-tight">
            Masuk ke dashboard
          </h2>
          <p className="mt-3 mb-8 text-sm leading-6 text-muted">
            Menu akan menyesuaikan role setelah Anda masuk.
          </p>
          <div
            className={cn(
              "rounded-3xl border border-line bg-white p-6 sm:p-7", // box
              "shadow-[0_24px_60px_rgba(19,36,28,0.06)]", // elevation
            )}
          >
            <LoginForm />
            <PwaInstallButton />
          </div>
        </div>
      </section>
    </div>
  );
}
