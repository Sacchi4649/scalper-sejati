import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Scalper Sejati",
  description: "Aplikasi tracking penjualan untuk super admin dan seller.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="id" className={`${dmSans.variable} h-full antialiased`}>
      <body className="min-h-dvh bg-canvas font-sans text-ink">{children}</body>
    </html>
  );
}
