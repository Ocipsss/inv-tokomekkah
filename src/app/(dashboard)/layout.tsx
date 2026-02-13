"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import SyncManager from "@/components/SyncManager";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  // Logika Mencegat Back Button agar tidak keluar sembarangan
  useEffect(() => {
    window.history.pushState(null, "", window.location.href);

    const handleBackButton = (event: PopStateEvent) => {
      if (pathname !== "/") {
        router.push("/");
      } else {
        window.history.pushState(null, "", window.location.href);
        // Menampilkan konfirmasi jika ingin keluar aplikasi (opsional)
        if(confirm("Keluar dari aplikasi?")) {
          window.close();
          setTimeout(() => {
            window.location.replace("about:blank");
          }, 50);
        }
      }
    };

    window.addEventListener("popstate", handleBackButton);
    return () => window.removeEventListener("popstate", handleBackButton);
  }, [pathname, router]);

  return (
    <>
      {/* Manajer Sinkronisasi Data Otomatis */}
      <SyncManager />

      <div className="flex flex-col md:flex-row min-h-screen bg-slate-50 text-slate-900 font-sans">
        
        {/* Sidebar / Navigation */}
        <Sidebar />

        {/* Area Konten Utama */}
        <main className="flex-1 w-full min-h-screen relative overflow-x-hidden">
          <div className="max-w-5xl mx-auto p-2 md:p-6 lg:p-8">
            
            {/* Wrapper Konten dengan Efek "Card" yang Mewah */}
            <section className="bg-white/70 backdrop-blur-sm rounded-[2rem] md:rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-white min-h-[90vh] relative overflow-hidden">
              
              {/* Dekorasi Aksen Halus di Pojok (Opsional) */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/50 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-orange-50/50 rounded-full blur-3xl -ml-16 -mb-16 pointer-events-none" />

              {/* Konten Halaman */}
              <div className="relative z-10 p-1 md:p-2">
                {children}
              </div>
              
            </section>

          </div>
        </main>

      </div>

      {/* Style Global untuk scrollbar agar tetap rapi */}
      <style jsx global>{`
        body {
          overscroll-behavior-y: contain; /* Mencegah pull-to-refresh yang mengganggu di webview */
        }
        ::-webkit-scrollbar {
          width: 5px;
        }
        ::-webkit-scrollbar-track {
          background: transparent;
        }
        ::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
      `}</style>
    </>
  );
}