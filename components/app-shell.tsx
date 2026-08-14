"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";
import type { Profile } from "@/lib/database.types";
import { api } from "@/lib/api-client";
import { cn } from "@/lib/cn";
import { navItemsForRole } from "@/lib/navigation";
import {
  PageHeaderProvider,
  ShellHeader,
  ShellToolbar,
} from "@/components/page-header";
import { Button } from "@/components/ui/button";

export function AppShell({
  profile,
  children,
}: {
  profile: Profile;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const items = navItemsForRole(profile.role);
  const activeItem = items.find(
    (item) => pathname === item.href || pathname.startsWith(`${item.href}/`),
  );

  async function logout() {
    await api("/api/auth/logout", { method: "POST" });
    router.replace("/login");
    router.refresh();
  }

  return (
    <PageHeaderProvider>
      <div className="min-h-dvh lg:grid lg:grid-cols-[260px_minmax(0,1fr)]">
        <aside
          className={cn(
            "lg:sticky lg:top-0 lg:flex lg:h-dvh lg:flex-col", // layout
            "bg-sidebar text-white", // color
            open ? "fixed inset-0 z-40 flex flex-col" : "hidden lg:flex",
          )}
        >
          <div className="flex items-center justify-between px-6 py-6">
            <div>
              <p className="text-[11px] uppercase tracking-[0.24em] text-gold">
                Tracking penjualan
              </p>
              <p className="font-display text-2xl">Scalper Sejati</p>
            </div>
            <button
              type="button"
              className="text-sm text-white/70 lg:hidden"
              onClick={() => setOpen(false)}
            >
              Tutup
            </button>
          </div>
          <nav className="grid gap-1 px-3 py-4">
            {items.map((item) => {
              const active =
                pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "rounded-xl px-3 py-3", // box
                    "transition-colors", // state
                    active
                      ? "bg-white/10 text-white"
                      : "text-white/70 hover:bg-white/5 hover:text-white",
                  )}
                >
                  <span className="block text-sm font-medium">{item.label}</span>
                  <span className="block text-xs text-white/50">
                    {item.description}
                  </span>
                </Link>
              );
            })}
          </nav>
            <div className="mt-auto grid gap-3 border-t border-white/10 p-5">
            <div>
              <p className="text-sm font-medium">{profile.full_name}</p>
              <p className="text-xs uppercase tracking-wide text-gold">
                {profile.role === "super_admin" ? "Super Admin" : "Seller"}
              </p>
            </div>
            <Link
              href="/profile"
              onClick={() => setOpen(false)}
              className={cn(
                "inline-flex h-11 items-center justify-center rounded-xl px-4", // layout
                "text-sm font-medium transition-colors", // type
                pathname === "/profile"
                  ? "bg-white/10 text-white"
                  : "text-white/80 hover:bg-white/10 hover:text-white",
              )}
            >
              Atur profil
            </Link>
            <Button variant="ghost" onClick={() => void logout()}>
              Keluar
            </Button>
          </div>
        </aside>
        <div className="flex min-h-dvh flex-col">
          <ShellHeader
            fallbackTitle={activeItem?.label ?? "Scalper Sejati"}
            menuButton={
              <button
                type="button"
                className={cn(
                  "mt-1 grid h-10 w-10 shrink-0 place-items-center", // layout
                  "rounded-xl border border-line bg-white", // box
                  "text-ink lg:hidden", // type
                )}
                onClick={() => setOpen(true)}
                aria-label="Buka menu"
              >
                <MenuIcon />
              </button>
            }
          />
          <main className="flex-1 px-4 pt-8 pb-8 sm:px-8 sm:pt-10">
            <ShellToolbar />
            {children}
          </main>
        </div>
      </div>
    </PageHeaderProvider>
  );
}

function MenuIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className="h-4 w-4 fill-current">
      <rect x="1" y="3" width="14" height="1.8" rx="0.9" />
      <rect x="1" y="7.1" width="14" height="1.8" rx="0.9" />
      <rect x="1" y="11.2" width="14" height="1.8" rx="0.9" />
    </svg>
  );
}
