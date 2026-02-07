"use client";

import React, { useState, useEffect } from 'react';
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { getCookie, deleteCookie } from "cookies-next";
import { 
  LayoutDashboard, Package, PlusCircle, Users, 
  Settings, Menu, X, LogOut, Layers, BookOpen, Lock 
} from "lucide-react";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [role, setRole] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    const refreshRole = () => {
      const userRole = getCookie("user-role"); 
      setRole(userRole as string || null);
    };
    refreshRole();
  }, [pathname]);

  const handleLogout = () => {
    setIsOpen(false);
    setRole(null);
    deleteCookie("user-role");
    // Hapus juga cookie session lainnya jika ada
    deleteCookie("is_logged_in");
    router.push("/login");
  };

  // LOGIKA FILTER MENU
  const menuItems = [
    { 
      group: "Utama", 
      items: [
        { name: "Beranda", icon: LayoutDashboard, path: "/" },
        { name: "Daftar Barang", icon: Package, path: "/products" },
        { name: "Input Barang", icon: PlusCircle, path: "/products/add" },
      ]
    },
    // Master Data hanya untuk Admin
    ...(role === 'admin' ? [{
      group: "Master Data", 
      items: [
        { name: "Kategori Produk", icon: Layers, path: "/categories" },
        { name: "Daftar Penerbit", icon: BookOpen, path: "/publishers" },
      ]
    }] : []),
    // Sistem hanya untuk Admin
    ...(role === 'admin' ? [{
      group: "Sistem", 
      items: [
        { name: "Manajemen Staff", icon: Users, path: "/admin/users" },
        { name: "Pengaturan", icon: Settings, path: "/settings" },
      ]
    }] : [])
  ];

  const toggleSidebar = () => setIsOpen(!isOpen);

  if (!mounted) return null;

  return (
    <>
      {/* Top Header Bar */}
      <header className="fixed top-0 left-0 w-full bg-white/90 backdrop-blur-md border-b border-slate-100 p-4 flex items-center justify-between z-[100] shadow-sm">
        <div className="flex items-center gap-3">
          <button onClick={toggleSidebar} className="p-2 hover:bg-slate-100 rounded-xl text-slate-600 transition-all active:scale-90">
            <Menu size={24} />
          </button>
          <div className="flex flex-col">
            <span className="font-black text-slate-800 tracking-tight leading-none text-sm uppercase">Toko Mekkah</span>
            <span className="text-[10px] text-blue-600 font-bold uppercase tracking-widest">Inventory</span>
          </div>
        </div>
        
        {/* Indikator Role di Pojok Kanan */}
        <div className={`px-3 py-1.5 rounded-xl border flex items-center gap-2 ${
          role === 'admin' ? 'bg-blue-50 border-blue-100 text-blue-600' : 'bg-slate-50 border-slate-200 text-slate-500'
        }`}>
          {role !== 'admin' && <Lock size={12} />}
          <span className="text-[10px] font-black uppercase tracking-tighter">
            {role || 'GUEST'}
          </span>
        </div>
      </header>

      <div className="h-[73px] w-full"></div>

      {/* Overlay */}
      {isOpen && <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[110]" onClick={toggleSidebar} />}

      {/* Sidebar Drawer */}
      <aside className={`fixed top-0 left-0 h-full w-72 bg-white z-[120] shadow-2xl transform transition-transform duration-300 ease-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 border-b border-slate-50 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="font-black text-blue-600 text-xl tracking-tighter leading-none">Toko Mekkah</span>
            <span className="text-[9px] font-bold text-slate-400 uppercase">inventory</span>
          </div>
          <button onClick={toggleSidebar} className="p-2 text-slate-400 hover:bg-slate-50 rounded-lg">
            <X size={20} />
          </button>
        </div>

        <nav className="p-4 overflow-y-auto max-h-[calc(100vh-200px)]">
          {menuItems.map((group, gIdx) => (
            <div key={gIdx} className="mb-6 animate-in fade-in slide-in-from-left-4 duration-300" style={{ animationDelay: `${gIdx * 100}ms` }}>
              <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-3">{group.group}</p>
              <div className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.path;
                  return (
                    <Link key={item.path} href={item.path} onClick={() => setIsOpen(false)}
                      className={`flex items-center justify-between p-3.5 rounded-2xl transition-all group ${
                        isActive ? "bg-blue-600 text-white shadow-lg shadow-blue-100" : "text-slate-500 hover:bg-slate-50"
                      }`}>
                      <div className="flex items-center gap-3">
                        <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                        <span className={`text-sm ${isActive ? "font-bold" : "font-semibold"}`}>{item.name}</span>
                      </div>
                      {isActive && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="absolute bottom-6 w-full px-4">
          <button 
            onClick={handleLogout}
            className="flex items-center justify-center gap-3 w-full p-4 text-red-500 bg-red-50/50 hover:bg-red-50 rounded-[1.5rem] transition-all font-black text-xs uppercase tracking-widest"
          >
            <LogOut size={18} />
            <span>Keluar</span>
          </button>
        </div>
      </aside>
    </>
  );
}