import type { Metadata, Viewport } from "next";
import { DM_Sans } from "next/font/google";
import { PwaRegister } from "@/components/pwa-register";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  applicationName: "Scalper Sejati",
  title: "Scalper Sejati",
  description: "Aplikasi tracking penjualan untuk super admin dan seller.",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Scalper Sejati",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  themeColor: "#0d1f18",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="id" className={`${dmSans.variable} h-full antialiased`}>
      <body className="min-h-dvh bg-canvas font-sans text-ink">
        {children}
        <PwaRegister />
      </body>
    </html>
  );
}
