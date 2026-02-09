import type { Metadata, Viewport } from "next";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import SyncManager from "@/components/SyncManager";

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
export const metadata: Metadata = {
  title: "TokoMekkah Inventory",
  description: "Sistem Manajemen Inventaris Toko Mekkah",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "TokoMekkah",
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
      <body className="bg-slate-50 text-slate-900 min-h-screen antialiased">
        {/* Komponen Tak Terlihat: Menangani sinkronisasi Firebase -> Dexie */}
        <SyncManager />

        <div className="flex flex-col md:flex-row min-h-screen">
          {/* Sidebar Area */}
          <Sidebar />

          {/* Area Konten Utama */}
          <main className="flex-1 w-full relative">
            <div className="max-w-7xl mx-auto p-4 md:p-8 lg:p-10">
              <section className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 min-h-[85vh] p-4 md:p-6 overflow-hidden">
                {children}
              </section>
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}