import type { AppRole } from "@/lib/database.types";
import { productsPath } from "@/lib/product-languages";

export type NavItem = {
  href: string;
  label: string;
  description: string;
};

export function navItemsForRole(role: AppRole): NavItem[] {
  if (role === "super_admin") {
    return [
      {
        href: "/summary",
        label: "Ringkasan",
        description: "Performa penjualan",
      },
      {
        href: productsPath(),
        label: "Barang",
        description: "Kelola katalog",
      },
      {
        href: "/master",
        label: "Master data",
        description: "Kategori bahasa",
      },
      {
        href: "/commissions",
        label: "Pengajuan Komisi",
        description: "Tinjau permintaan seller",
      },
      {
        href: "/admins",
        label: "Admin",
        description: "Akun super admin",
      },
      {
        href: "/sellers",
        label: "Penjual",
        description: "Akun seller",
      },
    ];
  }

  return [
    {
      href: productsPath(),
      label: "Listing",
      description: "Barang yang dijual",
    },
    {
      href: "/sales",
      label: "Catat Penjualan",
      description: "Input transaksi",
    },
    {
      href: "/commissions",
      label: "Ajukan Komisi",
      description: "Minta penyesuaian",
    },
  ];
}

export function titleForPath(pathname: string, role: AppRole) {
  const match = navItemsForRole(role).find(
    (item) => pathname === item.href || pathname.startsWith(`${item.href}/`),
  );
  if (match) return match.label;
  if (pathname.startsWith("/profile")) return "Profil";
  return "Scalper Sejati";
}
