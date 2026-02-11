"use client";

import React from 'react';
import { 
  Package, 
  Layers, 
  AlertTriangle, 
  TrendingUp, 
  History, 
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="p-5 space-y-8">

      {/* Ringkasan Statistik Utama */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm space-y-3">
          <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
            <Package size={22} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Item</p>
            <h2 className="text-2xl font-black text-slate-800">1,240</h2>
          </div>
          <div className="flex items-center text-emerald-500 text-[10px] font-bold">
            <ArrowUpRight size={12} />
            <span>+12 Hari ini</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm space-y-3">
          <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center">
            <Layers size={22} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Kategori</p>
            <h2 className="text-2xl font-black text-slate-800">24</h2>
          </div>
          <div className="flex items-center text-slate-400 text-[10px] font-bold">
            <span>Aktif Terjaga</span>
          </div>
        </div>
      </div>

      {/* Alert Stok Menipis */}
      <section className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="font-black text-slate-800 text-sm uppercase tracking-tight">Perlu Perhatian</h3>
          <span className="text-[10px] font-bold text-red-500 bg-red-50 px-2 py-1 rounded-lg">3 Item</span>
        </div>
        
        <div className="bg-red-50 border border-red-100 rounded-3xl p-4 flex items-center gap-4">
          <div className="bg-white p-3 rounded-2xl text-red-500 shadow-sm">
            <AlertTriangle size={20} />
          </div>
          <div className="flex-1">
            <p className="font-bold text-slate-800 text-sm leading-none">Stok Hampir Habis!</p>
            <p className="text-[11px] text-slate-500 mt-1">Al-Qur'an Madinah A5 tersisa 2 pcs.</p>
          </div>
          <button className="text-xs font-bold text-red-600 underline">Cek</button>
        </div>
      </section>

      {/* Aktivitas Terbaru */}
      <section className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="font-black text-slate-800 text-sm uppercase tracking-tight">Riwayat Terakhir</h3>
          <History size={16} className="text-slate-400" />
        </div>

        <div className="space-y-2">
          {/* Item Aktivitas */}
          {[
            { name: "Peci Rajut Putih", type: "Masuk", qty: "+50", time: "10 menit lalu", icon: <ArrowDownRight size={14}/>, color: "text-emerald-500", bg: "bg-emerald-50" },
            { name: "Minyak Wangi Oud", type: "Keluar", qty: "-5", time: "1 jam lalu", icon: <ArrowUpRight size={14}/>, color: "text-orange-500", bg: "bg-orange-50" },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between p-4 bg-white border border-slate-50 rounded-2xl">
              <div className="flex items-center gap-3">
                <div className={`${item.bg} ${item.color} p-2 rounded-xl`}>
                  {item.icon}
                </div>
                <div>
                  <p className="font-bold text-slate-800 text-xs">{item.name}</p>
                  <p className="text-[10px] text-slate-400 font-medium">{item.time}</p>
                </div>
              </div>
              <span className={`text-xs font-black ${item.color}`}>{item.qty}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Shortcut Cepat */}
      <button className="w-full bg-slate-900 text-white p-5 rounded-[2rem] flex items-center justify-between group overflow-hidden relative active:scale-95 transition-all">
        <div className="relative z-10 flex items-center gap-3">
          <div className="bg-white/20 p-2 rounded-xl backdrop-blur-md">
            <TrendingUp size={20} />
          </div>
          <div className="text-left">
            <p className="font-bold text-sm">Lihat Laporan Lengkap</p>
            <p className="text-[10px] opacity-60">Analisis stok & mutasi barang</p>
          </div>
        </div>
        <ArrowUpRight className="relative z-10 opacity-60 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
        {/* Dekorasi Background */}
        <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-blue-600 rounded-full blur-3xl opacity-30"></div>
      </button>
      
      <p className="text-center text-[10px] text-slate-300 font-bold uppercase tracking-[0.2em] pt-4">
        TokoMekkah V1.0 Beta
      </p>
    </div>
  );
}