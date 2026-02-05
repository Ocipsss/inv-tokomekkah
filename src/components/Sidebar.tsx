"use client";

import React, { useState } from 'react';
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Package, 
  PlusCircle, 
  Users, 
  Settings, 
  Menu, 
  X, 
  LogOut, 
  ChevronRight,
  Layers,
  BookOpen 
} from "lucide-react";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const menuItems = [
    { group: "Utama", items: [
      { name: "Beranda", icon: LayoutDashboard, path: "/" },
      { name: "Daftar Barang", icon: Package, path: "/products" },
      { name: "Input Barang", icon: PlusCircle, path: "/products/add" },
    ]},
    { group: "Master Data", items: [
      { name: "Kategori Produk", icon: Layers, path: "/categories" },
      { name: "Daftar Penerbit", icon: BookOpen, path: "/publishers" },
    ]},
    { group: "Sistem", items: [
      { name: "Manajemen Staff", icon: Users, path: "/admin/users" },
      { name: "Pengaturan", icon: Settings, path: "/settings" },
    ]}
  ];

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Top Header Bar - DIUBAH MENJADI FIXED */}
      <header className="fixed top-0 left-0 w-full bg-white/90 backdrop-blur-md border-b border-slate-100 p-4 flex items-center justify-between z-[100] shadow-sm">
        <div className="flex items-center gap-3">
          <button 
            onClick={toggleSidebar}
            className="p-2 hover:bg-slate-100 rounded-xl text-slate-600 transition-all active:scale-90"
          >
            <Menu size={24} />
          </button>
          <div className="flex flex-col">
            <span className="font-black text-slate-800 tracking-tight leading-none text-sm uppercase">Toko Mekkah</span>
            <span className="text-[10px] text-blue-600 font-bold uppercase tracking-widest">Inventory</span>
          </div>
        </div>
        <div className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 text-xs font-bold uppercase">
          ADM
        </div>
      </header>

      {/* Spacer agar konten di bawah tidak tertutup header fixed */}
      <div className="h-[73px] w-full"></div>

      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[110] transition-opacity"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar Drawer */}
      <aside className={`fixed top-0 left-0 h-full w-72 bg-white z-[120] shadow-2xl transform transition-transform duration-300 ease-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 border-b border-slate-50 flex items-center justify-between">
          <div>
            <span className="font-black text-blue-600 text-xl tracking-tighter italic">TM SYSTEM</span>
          </div>
          <button onClick={toggleSidebar} className="p-2 text-slate-400 hover:bg-slate-50 rounded-lg">
            <X size={20} />
          </button>
        </div>

        <nav className="p-4 overflow-y-auto max-h-[calc(100vh-200px)]">
          {menuItems.map((group, gIdx) => (
            <div key={gIdx} className="mb-6">
              <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-3">
                {group.group}
              </p>
              <div className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.path;
                  return (
                    <Link 
                      key={item.path} 
                      href={item.path}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center justify-between p-3.5 rounded-2xl transition-all group ${
                        isActive 
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-200" 
                        : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                        <span className={`text-sm ${isActive ? "font-bold" : "font-semibold"}`}>
                          {item.name}
                        </span>
                      </div>
                      {isActive ? (
                        <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                      ) : (
                        <ChevronRight size={14} className="text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="absolute bottom-6 w-full px-4 space-y-4">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">Status Sinyal</p>
            <div className="flex items-center gap-2 mt-1">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-[11px] font-bold text-slate-600 uppercase">Online</span>
            </div>
          </div>
          
          <button className="flex items-center gap-3 w-full p-4 text-red-500 hover:bg-red-50 rounded-2xl transition-all font-bold text-sm">
            <LogOut size={20} />
            <span>Keluar Aplikasi</span>
          </button>
        </div>
      </aside>
    </>
  );
}