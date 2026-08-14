import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/sw.js",
        headers: [
          {
            key: "Cache-Control",
            value: "no-cache, no-store, must-revalidate",
          },
          { key: "Service-Worker-Allowed", value: "/" },
        ],
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
  async redirects() {
    return [
      { source: "/ringkasan", destination: "/summary", permanent: true },
      { source: "/barang/baru", destination: "/products/new", permanent: true },
      { source: "/barang/:id", destination: "/products/:id", permanent: true },
      { source: "/barang", destination: "/products", permanent: true },
      { source: "/komisi", destination: "/commissions", permanent: true },
      { source: "/penjualan", destination: "/sales", permanent: true },
      { source: "/penjual", destination: "/sellers", permanent: true },
      { source: "/admin", destination: "/admins", permanent: true },
    ];
  },
};

export default nextConfig;
