import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google"; // Gunakan font yang bersih
import "./globals.css";

// Optimasi Font agar seragam di semua perangkat
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "TokoMekkah Inventory",
  description: "Sistem Manajemen Inventaris Toko Mekkah",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent", // Lebih cantik untuk layar iPhone modern
    title: "TokoMekkah",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  themeColor: "#0f172a", // Kita gunakan warna Slate-900 agar menyatu dengan header/status bar
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover", // Memastikan konten mengisi area "notch" di HP terbaru
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className="selection:bg-blue-100 selection:text-blue-700">
      <body className={`${inter.variable} font-sans bg-slate-50 text-slate-900 min-h-screen antialiased touch-pan-y`}>
        {children}
      </body>
    </html>
  );
}