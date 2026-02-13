"use client";

import React from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db_local } from '@/lib/db';
import { 
  Package, Layers, AlertTriangle, TrendingUp, 
  History, ArrowUpRight, ArrowDownRight, Loader2
} from "lucide-react";

export default function DashboardPage() {
  // Ambil data asli dari Dexie
  const products = useLiveQuery(() => db_local.products.toArray());
  const categories = useLiveQuery(() => db_local.categories.toArray());

  // Logika Perhitungan (Data Nyata)
  const totalStok = products?.reduce((acc, item) => acc + (Number(item.stok) || 0), 0) || 0;
  const totalVariasi = products?.length || 0;
  const totalCat = categories?.length || 0;
  const lowStockItems = products?.filter(item => Number(item.stok) <= 5) || [];
  
  // Ambil 3 data yang paling baru diupdate/ditambah
  const recentUpdates = products 
    ? [...products].sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0)).slice(0, 3)
    : [];

  // Loading State agar tidak "flicker"
  if (!products || !categories) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-300">
        <Loader2 className="animate-spin mb-2" size={32} />
        <p className="text-[10px] font-bold uppercase tracking-widest">Sinkronisasi Data...</p>
      </div>
    );
  }

  return (
    <div className="p-2 space-y-8">

      {/* Ringkasan Statistik Utama */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-5 rounded-[1rem] border border-slate-100 shadow-sm space-y-3">
          <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
            <Package size={22} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Stok</p>
            <h2 className="text-2xl font-black text-slate-800">{totalStok.toLocaleString('id-ID')}</h2>
          </div>
          <div className="flex items-center text-emerald-500 text-[10px] font-bold">
            <ArrowUpRight size={12} />
            <span>{totalVariasi} Jenis Barang</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-[1rem] border border-slate-100 shadow-sm space-y-3">
          <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center">
            <Layers size={22} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Kategori</p>
            <h2 className="text-2xl font-black text-slate-800">{totalCat}</h2>
          </div>
          <div className="flex items-center text-slate-400 text-[10px] font-bold">
            <span>Aktif Terjaga</span>
          </div>
        </div>
      </div>

      {/* Alert Stok Menipis (Hanya muncul jika ada data) */}
      <section className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="font-black text-slate-800 text-sm uppercase tracking-tight">Perlu Perhatian</h3>
          <span className={`text-[10px] font-bold px-2 py-1 rounded-lg ${lowStockItems.length > 0 ? 'bg-red-50 text-red-500' : 'bg-emerald-50 text-emerald-500'}`}>
            {lowStockItems.length} Item
          </span>
        </div>
        
        {lowStockItems.length > 0 ? (
          <div className="bg-red-50 border border-red-100 rounded-3xl p-4 flex items-center gap-4">
            <div className="bg-white p-3 rounded-2xl text-red-500 shadow-sm">
              <AlertTriangle size={20} />
            </div>
            <div className="flex-1">
              <p className="font-bold text-slate-800 text-sm leading-none">Stok Hampir Habis!</p>
              <p className="text-[11px] text-slate-500 mt-1 uppercase font-bold">
                {lowStockItems[0].nama} sisa {lowStockItems[0].stok} pcs.
              </p>
            </div>
            <button className="text-xs font-bold text-red-600 underline">Cek</button>
          </div>
        ) : (
          <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl text-center">
             <p className="text-[11px] font-bold text-emerald-600 uppercase">Semua stok aman terjaga</p>
          </div>
        )}
      </section>

      {/* Aktivitas Terbaru (Data Nyata dari Database) */}
      <section className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="font-black text-slate-800 text-sm uppercase tracking-tight">Riwayat Terakhir</h3>
          <History size={16} className="text-slate-400" />
        </div>

        <div className="space-y-2">
          {recentUpdates.length > 0 ? recentUpdates.map((item, i) => (
            <div key={item.id || i} className="flex items-center justify-between p-4 bg-white border border-slate-50 rounded-2xl">
              <div className="flex items-center gap-3">
                <div className="bg-emerald-50 text-emerald-500 p-2 rounded-xl">
                  <ArrowDownRight size={14}/>
                </div>
                <div>
                  <p className="font-bold text-slate-800 text-xs uppercase">{item.nama}</p>
                  <p className="text-[10px] text-slate-400 font-medium uppercase">Rak: {item.lokasi || '-'}</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs font-black text-blue-600">{item.stok}</span>
                <p className="text-[8px] text-slate-300 font-bold uppercase tracking-tighter">Stok</p>
              </div>
            </div>
          )) : (
            <p className="text-center py-5 text-[10px] text-slate-300 font-bold uppercase">Belum ada barang</p>
          )}
        </div>
      </section>

      {/* Shortcut Cepat */}
      <button className="w-full bg-slate-900 text-white p-5 rounded-[1rem] flex items-center justify-between group overflow-hidden relative active:scale-95 transition-all">
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
        <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-blue-600 rounded-full blur-3xl opacity-30"></div>
      </button>
      
      <p className="text-center text-[10px] text-slate-300 font-bold uppercase tracking-[0.2em] pt-4">
        TokoMekkah V1.0 Stable
      </p>
    </div>
  );
}