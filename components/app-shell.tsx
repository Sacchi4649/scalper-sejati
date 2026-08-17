"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Suspense, use, useState, type ReactNode } from "react";
import type { Profile } from "@/lib/database.types";
import { api } from "@/lib/api-client";
import { cn } from "@/lib/cn";
import { navItemsForRole, titleForPath, type NavItem } from "@/lib/navigation";
import {
  PageHeaderProvider,
  ShellHeader,
  ShellToolbar,
} from "@/components/page-header";
import { Button } from "@/components/ui/button";

export function AppShell({
  profilePromise,
  children,
}: {
  profilePromise: Promise<Profile>;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const menuButton = (
    <button
      type="button"
      className={cn(
        "mt-1 grid h-10 w-10 shrink-0 place-items-center",
        "rounded-xl border border-line bg-white",
        "text-ink lg:hidden",
      )}
      onClick={() => setOpen(true)}
      aria-label="Buka menu"
    >
      <MenuIcon />
    </button>
  );

  return (
    <PageHeaderProvider>
      <div className="min-h-dvh lg:grid lg:grid-cols-[240px_minmax(0,1fr)]">
        <aside
          className={cn(
            "lg:sticky lg:top-0 lg:flex lg:h-dvh lg:flex-col",
            "bg-sidebar text-white",
            open ? "fixed inset-0 z-40 flex flex-col" : "hidden lg:flex",
          )}
        >
          <div className="flex items-center justify-between px-4 py-4">
            <div>
              <p className="text-[10px] uppercase tracking-[0.22em] text-gold">
                Tracking penjualan
              </p>
              <p className="font-display text-xl leading-tight">Scalper Sejati</p>
            </div>
            <button
              type="button"
              className="text-sm text-white/70 lg:hidden"
              onClick={() => setOpen(false)}
            >
              Tutup
            </button>
          </div>
          <Suspense fallback={<div className="flex-1" />}>
            <AppSidebar
              profilePromise={profilePromise}
              pathname={pathname}
              onNavigate={() => setOpen(false)}
            />
          </Suspense>
        </aside>
        <div className="flex min-h-dvh flex-col">
          <Suspense fallback={<ShellHeader menuButton={menuButton} />}>
            <AppHeader
              profilePromise={profilePromise}
              pathname={pathname}
              menuButton={menuButton}
            />
          </Suspense>
          <main className="flex-1 px-4 pt-8 pb-8 sm:px-8 sm:pt-10">
            <ShellToolbar />
            {children}
          </main>
        </div>
      </div>
    </PageHeaderProvider>
  );
}

function AppHeader({
  profilePromise,
  pathname,
  menuButton,
}: {
  profilePromise: Promise<Profile>;
  pathname: string;
  menuButton: ReactNode;
}) {
  const profile = use(profilePromise);
  return (
    <ShellHeader
      fallbackTitle={titleForPath(pathname, profile.role)}
      menuButton={menuButton}
    />
  );
}

function AppSidebar({
  profilePromise,
  pathname,
  onNavigate,
}: {
  profilePromise: Promise<Profile>;
  pathname: string;
  onNavigate: () => void;
}) {
  const profile = use(profilePromise);
  const router = useRouter();
  const items = navItemsForRole(profile.role);

  async function logout() {
    await api("/api/auth/logout", { method: "POST" });
    router.replace("/login");
    router.refresh();
  }

  return (
    <>
      <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto px-3 py-2">
        {items.map((item) => {
          const active = isNavItemActive(item, pathname);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "rounded-lg px-3 py-1.5",
                "transition-colors",
                active
                  ? "bg-white/10 text-white"
                  : "text-white/70 hover:bg-white/5 hover:text-white",
              )}
            >
              <span className="block text-sm font-medium leading-5">
                {item.label}
              </span>
              <span className="block text-[11px] leading-4 text-white/45">
                {item.description}
              </span>
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto grid gap-2 border-t border-white/10 px-4 py-3">
        <div>
          <p className="text-sm font-medium leading-5">{profile.full_name}</p>
          <p className="text-[11px] uppercase tracking-wide text-gold">
            {profile.role === "super_admin" ? "Super Admin" : "Seller"}
          </p>
        </div>
        <Link
          href="/profile"
          onClick={onNavigate}
          className={cn(
            "inline-flex h-9 items-center justify-center rounded-lg px-3",
            "text-sm font-medium transition-colors",
            pathname === "/profile"
              ? "bg-white/10 text-white"
              : "text-white/80 hover:bg-white/10 hover:text-white",
          )}
        >
          Atur profil
        </Link>
        <Button variant="ghost" className="h-9" onClick={() => void logout()}>
          Keluar
        </Button>
      </div>
    </>
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

function isNavItemActive(item: NavItem, pathname: string) {
  return pathname === item.href || pathname.startsWith(`${item.href}/`);
}
