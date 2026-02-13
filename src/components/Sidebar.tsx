"use client";

import React, { useState, useEffect } from 'react';
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { getCookie, deleteCookie } from "cookies-next";
import { 
  LayoutDashboard, Package, PlusCircle, Users, 
  Settings, Menu, X, LogOut, Layers, BookOpen, 
  Lock, MapPin, RefreshCw 
} from "lucide-react";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [role, setRole] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const handleHardReset = async () => {
    const confirmUpdate = confirm("Perbarui sistem?");
    if (!confirmUpdate) return;

    if ('serviceWorker' in navigator) {
      try {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map(name => caches.delete(name)));
        const registrations = await navigator.serviceWorker.getRegistrations();
        for (let reg of registrations) await reg.unregister();
        window.location.href = window.location.origin + '?reload=' + Date.now();
      } catch (err) {
        window.location.reload();
      }
    } else {
      window.location.reload();
    }
  };

  useEffect(() => {
    setMounted(true);
    const userRole = getCookie("user-role"); 
    setRole(userRole as string || null);
  }, [pathname]);

  const handleLogout = () => {
    deleteCookie("user-role");
    deleteCookie("is_logged_in");
    router.push("/login");
  };

  const menuItems = [
    { 
      group: "Utama", 
      items: [
        { name: "Beranda", icon: LayoutDashboard, path: "/" },
        { name: "Daftar Barang", icon: Package, path: "/products" },
        { name: "Input Barang", icon: PlusCircle, path: "/products/add" },
      ]
    },
    ...(role === 'admin' ? [{
      group: "Master Data", 
      items: [
        { name: "Kategori Produk", icon: Layers, path: "/categories" },
        { name: "Daftar Penerbit", icon: BookOpen, path: "/publishers" },
        { name: "Lokasi Rak", icon: MapPin, path: "/locations" },
      ]
    }] : []),
    ...(role === 'admin' ? [{
      group: "Sistem", 
      items: [
        { name: "Manajemen Staff", icon: Users, path: "/admin/users" },
        { name: "Pengaturan", icon: Settings, path: "/settings" },
      ]
    }] : [])
  ];

  if (!mounted) return null;

  return (
    <>
      {/* 1. TOP HEADER (Mobile) */}
      <header className="md:hidden fixed top-0 left-0 w-full bg-white/90 backdrop-blur-md border-b border-slate-100 p-4 flex items-center justify-between z-[100] shadow-sm">
        <div className="flex items-center gap-3">
          <button onClick={() => setIsOpen(true)} className="p-2 hover:bg-slate-100 rounded-xl text-slate-600">
            <Menu size={24} />
          </button>
          <div className="flex flex-col text-xs font-black uppercase">
            <span className="text-slate-800 tracking-tighter">Toko Mekkah</span>
          </div>
        </div>
        
        {/* Tombol Update Mobile (Hanya Ikon) */}
        <button 
          onClick={handleHardReset}
          className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl text-slate-400 active:scale-90 active:bg-blue-50 active:text-blue-600 transition-all"
        >
          <RefreshCw size={18} />
        </button>
      </header>

      <div className="h-[65px] md:hidden w-full"></div>

      {/* 2. OVERLAY */}
      {isOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[110] md:hidden" onClick={() => setIsOpen(false)} />
      )}

      {/* 3. ASIDE */}
      <aside className={`
        fixed md:sticky top-0 left-0 h-screen bg-white border-r border-slate-200 z-[120]
        transition-transform duration-300 ease-in-out
        w-72 flex flex-col
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        
        <div className="p-6 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="font-black text-blue-600 text-2xl tracking-tighter uppercase leading-none">Toko Mekkah</span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Inventory</span>
          </div>
          
          {/* Tombol Update Desktop (Hanya Ikon di Pojok Atas Sidebar) */}
          <button 
            onClick={handleHardReset}
            className="hidden md:flex p-2 text-slate-300 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all group"
            title="Update Aplikasi"
          >
            <RefreshCw size={18} className="group-active:rotate-180 transition-transform duration-500" />
          </button>

          <button onClick={() => setIsOpen(false)} className="md:hidden p-2 text-slate-400 hover:bg-slate-50 rounded-lg">
            <X size={20} />
          </button>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 overflow-y-auto px-4 custom-scrollbar mt-4">
          {menuItems.map((group, gIdx) => (
            <div key={gIdx} className="mb-6">
              <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-3">{group.group}</p>
              <div className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.path;
                  return (
                    <Link key={item.path} href={item.path} onClick={() => setIsOpen(false)}
                      className={`flex items-center gap-3 p-3.5 rounded-2xl transition-all ${
                        isActive ? "bg-blue-600 text-white shadow-lg shadow-blue-200" : "text-slate-500 hover:bg-slate-50"
                      }`}>
                      <Icon size={20} />
                      <span className={`text-sm ${isActive ? "font-bold" : "font-semibold"}`}>{item.name}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-50">
          <button onClick={handleLogout} className="flex items-center justify-center gap-3 w-full p-4 text-red-500 bg-red-50/50 hover:bg-red-50 rounded-2xl transition-all font-bold text-xs uppercase tracking-widest">
            <LogOut size={18} />
            <span>Keluar</span>
          </button>
        </div>
      </aside>
    </>
  );
}