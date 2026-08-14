import type { AppRole } from "@/lib/database.types";

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
        href: "/products",
        label: "Barang",
        description: "Kelola katalog",
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
      href: "/products",
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
