"use client";

import Sidebar from "@/components/Sidebar";
import SyncManager from "@/components/SyncManager";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* SyncManager aktif hanya di area dashboard */}
      <SyncManager />

      <div className="flex flex-col md:flex-row min-h-screen">
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