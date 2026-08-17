import type { AppRole } from "@/lib/database.types";
import {
  PRODUCT_LANGUAGE_MENUS,
  productsPath,
} from "@/lib/product-languages";

export type NavChild = {
  href: string;
  label: string;
};

export type NavItem = {
  href: string;
  label: string;
  description: string;
  children?: NavChild[];
};

const productChildren: NavChild[] = PRODUCT_LANGUAGE_MENUS.map((item) => ({
  href: productsPath(item.slug),
  label: item.label,
}));

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
        children: productChildren,
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
      children: productChildren,
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
