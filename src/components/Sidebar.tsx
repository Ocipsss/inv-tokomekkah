"use client";

import React, { useState, useEffect } from 'react';
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { getCookie, deleteCookie } from "cookies-next";
import { 
  LayoutDashboard, Package, PlusCircle, Users, 
  Settings, Menu, X, LogOut, Layers, BookOpen, 
  Lock, MapPin // <-- Tambahkan MapPin di sini
} from "lucide-react";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [role, setRole] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

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
        { name: "Lokasi Rak", icon: MapPin, path: "/locations" }, // <-- Menu Baru
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
      {/* 1. TOP HEADER (Hanya muncul di Mobile) */}
      <header className="md:hidden fixed top-0 left-0 w-full bg-white/90 backdrop-blur-md border-b border-slate-100 p-4 flex items-center justify-between z-[100] shadow-sm">
        <div className="flex items-center gap-3">
          <button onClick={() => setIsOpen(true)} className="p-2 hover:bg-slate-100 rounded-xl text-slate-600">
            <Menu size={24} />
          </button>
          <div className="flex flex-col text-xs font-black uppercase">
            <span className="text-slate-800">Toko Mekkah</span>
            <span className="text-blue-600 tracking-widest text-[8px]">Inventory</span>
          </div>
        </div>
        <div className={`px-3 py-1 rounded-full border text-[10px] font-bold ${role === 'admin' ? 'bg-blue-50 text-blue-600' : 'bg-slate-50 text-slate-500'}`}>
          {role || 'GUEST'}
        </div>
      </header>

      {/* Spacing untuk Mobile Header */}
      <div className="h-[65px] md:hidden w-full"></div>

      {/* 2. OVERLAY (Hanya di Mobile) */}
      {isOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[110] md:hidden" onClick={() => setIsOpen(false)} />
      )}

      {/* 3. ASIDE (Sidebar Desktop & Mobile) */}
      <aside className={`
        fixed md:sticky top-0 left-0 h-screen bg-white border-r border-slate-200 z-[120]
        transition-transform duration-300 ease-in-out
        w-72 flex flex-col
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        
        {/* Header Sidebar */}
        <div className="p-6 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="font-black text-blue-600 text-2xl tracking-tighter uppercase leading-none">Toko Mekkah</span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Inventory System</span>
          </div>
          <button onClick={() => setIsOpen(false)} className="md:hidden p-2 text-slate-400 hover:bg-slate-50 rounded-lg">
            <X size={20} />
          </button>
        </div>

        {/* Indikator Role (Desktop) */}
        <div className="px-6 mb-4 hidden md:block">
           <div className="bg-slate-50 border border-slate-100 rounded-2xl p-3 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white">
                <Users size={16} />
              </div>
              <div className="flex flex-col overflow-hidden">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">Status Logged In</span>
                <span className="text-sm font-bold text-slate-700 truncate">{role || 'GUEST'}</span>
              </div>
           </div>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 overflow-y-auto px-4 custom-scrollbar">
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

        {/* Logout Button */}
        <div className="p-4 border-t border-slate-50">
          <button onClick={handleLogout} className="flex items-center justify-center gap-3 w-full p-4 text-red-500 bg-red-50/50 hover:bg-red-50 rounded-2xl transition-all font-bold text-xs uppercase">
            <LogOut size={18} />
            <span>Keluar Aplikasi</span>
          </button>
        </div>
      </aside>
    </>
  );
}