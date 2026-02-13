"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import SyncManager from "@/components/SyncManager";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    // 1. Dorong state baru ke history agar kita bisa mencegat tombol back
    window.history.pushState(null, "", window.location.href);

    const handleBackButton = (event: PopStateEvent) => {
      if (pathname !== "/") {
        // 2. Jika posisi TIDAK di Beranda, balik ke Beranda dulu
        router.push("/");
      } else {
        // 3. Jika SUDAH di Beranda, paksa keluar aplikasi
        window.history.pushState(null, "", window.location.href); // Kunci agar tetap di state ini
        window.close();
        
        // Cadangan jika window.close() tidak didukung browser
        setTimeout(() => {
          window.location.replace("about:blank");
        }, 50);
      }
    };

    window.addEventListener("popstate", handleBackButton);

    return () => {
      window.removeEventListener("popstate", handleBackButton);
    };
  }, [pathname, router]);

  return (
    <>
      {/* SyncManager aktif hanya di area dashboard */}
      <SyncManager />

      <div className="flex flex-col md:flex-row min-h-screen bg-slate-50">
        {/* Sidebar Area */}
        <Sidebar />

        {/* Area Konten Utama dengan desain melengkung favoritmu */}
        <main className="flex-1 w-full relative">
          <div className="max-w-7xl mx-auto p-4 md:p-8 lg:p-10">
            <section className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 min-h-[85vh] p-4 md:p-6 overflow-hidden">
              {children}
            </section>
          </div>
        </main>
      </div>
    </>
  );
}