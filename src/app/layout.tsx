import type { Metadata, Viewport } from "next";
import "./globals.css";
import Sidebar from "@/components/Sidebar"; // Ganti import

export const metadata: Metadata = {
  title: "TokoMekkah Inventory",
  description: "Sistem Manajemen Inventaris Toko Mekkah",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "TokoMekkah",
    // startupImage: "/icons/splash.png", // Opsional jika ingin ada splash screen
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  themeColor: "#2563eb",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body className="bg-slate-100 flex justify-center min-h-screen">
        <main className="w-full max-w-md bg-white min-h-screen shadow-2xl relative overflow-x-hidden">
          <Sidebar /> {/* Sidebar menggantikan BottomNav */}
          <section className="min-h-[calc(100vh-64px)]">
            {children}
          </section>
        </main>
      </body>
    </html>
  );
}