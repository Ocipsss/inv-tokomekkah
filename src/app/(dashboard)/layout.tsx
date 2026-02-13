"use client";

import { useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import SyncManager from "@/components/SyncManager";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  
  useEffect(() => {
    // 1. Kunci posisi history saat ini agar tombol back tidak langsung pindah halaman
    window.history.pushState(null, "", window.location.href);

    const handleBackButton = (event: PopStateEvent) => {
      // 2. Cegah navigasi balik dengan mendorong kembali state history
      window.history.pushState(null, "", window.location.href);

      // 3. Paksa keluar/tutup aplikasi (Berfungsi optimal pada mode PWA Standalone)
      window.close();

      // 4. Fallback: Jika browser/sistem menolak window.close(), lempar ke halaman kosong
      // Ini akan membuat aplikasi seolah-olah berhenti/close
      setTimeout(() => {
        window.location.replace("about:blank");
      }, 50);
    };

    // Pasang listener untuk mencegat tombol back (termasuk back fisik Android)
    window.addEventListener("popstate", handleBackButton);

    return () => {
      window.removeEventListener("popstate", handleBackButton);
    };
  }, []);

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