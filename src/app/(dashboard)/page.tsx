"use client";

import React from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db_local } from '@/lib/db';
import { 
  Package, 
  Layers, 
  AlertTriangle, 
  TrendingUp, 
  History, 
  ArrowUpRight,
  ArrowDownRight,
  Loader2
} from "lucide-react";

export default function DashboardPage() {
  // Ambil data asli dari Dexie
  const products = useLiveQuery(() => db_local.products.toArray());
  const categories = useLiveQuery(() => db_local.categories.toArray());

  // Logika Perhitungan Statistik
  const totalItems = products?.reduce((acc, item) => acc + (item.stok || 0), 0) || 0;
  const totalSKU = products?.length || 0;
  const totalCat = categories?.length || 0;

  // Filter stok menipis (misal: di bawah 5 pcs)
  const lowStockItems = products?.filter(item => item.stok <= 5) || [];

  // Ambil 3 aktivitas terbaru berdasarkan waktu update
  const recentActivities = products 
    ? [...products].sort((a, b) => b.updatedAt - a.updatedAt).slice(0, 3)
    : [];

  if (!products || !categories) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-300">
        <Loader2 className="animate-spin mb-2" size={32} />
        <p className="text-[10px] font-bold uppercase tracking-widest">Memuat Data...</p>
      </div>
    );
  }

  return (
    <div className="p-5 space-y-8">

      {/* Ringkasan Statistik Utama */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm space-y-3">
          <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
            <Package size={22} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Stok</p>
            <h2 className="text-2xl font-black text-slate-800">{totalItems.toLocaleString('id-ID')}</h2>
          </div>
          <div className="flex items-center text-slate-400 text-[10px] font-bold">
            <span>{totalSKU} Variasi Produk</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm space-y-3">
          <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center">
            <Layers size={22} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Kategori</p>
            <h2 className="text-2xl font-black text-slate-800">{totalCat}</h2>
          </div>
          <div className="flex items-center text-emerald-500 text-[10px] font-bold">
            <span>Aktif Terjaga</span>
          </div>
        </div>
      </div>

      {/* Alert Stok Menipis */}
      {lowStockItems.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="font-black text-slate-800 text-sm uppercase tracking-tight">Perlu Perhatian</h3>
            <span className="text-[10px] font-bold text-red-500 bg-red-50 px-2 py-1 rounded-lg">
              {lowStockItems.length} Item
            </span>
          </div>
          
          <div className="bg-red-50 border border-red-100 rounded-3xl p-4 flex items-center gap-4">
            <div className="bg-white p-3 rounded-2xl text-red-500 shadow-sm">
              <AlertTriangle size={20} />
            </div>
            <div className="flex-1">
              <p className="font-bold text-slate-800 text-sm leading-none">Stok Hampir Habis!</p>
              <p className="text-[11px] text-slate-500 mt-1 uppercase font-bold">
                {lowStockItems[0].nama} Sisa {lowStockItems[0].stok}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Aktivitas Terbaru (Berdasarkan Update Terakhir) */}
      <section className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="font-black text-slate-800 text-sm uppercase tracking-tight">Update Terakhir</h3>
          <History size={16} className="text-slate-400" />
        </div>

        <div className="space-y-2">
          {recentActivities.length > 0 ? (
            recentActivities.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-4 bg-white border border-slate-50 rounded-2xl">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-50 text-blue-600 p-2 rounded-xl">
                    <ArrowDownRight size={14}/>
                  </div>
                  <div>
                    <p className="font-bold text-slate-800 text-xs uppercase tracking-tight">{item.nama}</p>
                    <p className="text-[10px] text-slate-400 font-medium">
                      Rak: {item.lokasi}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                   <span className="text-xs font-black text-slate-800">{item.stok}</span>
                   <p className="text-[8px] text-slate-300 font-bold uppercase">Stok</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center py-10 text-[10px] font-bold text-slate-300 uppercase tracking-[0.2em]">Belum Ada Data</p>
          )}
        </div>
      </section>

      {/* Shortcut Cepat */}
      <button className="w-full bg-slate-900 text-white p-5 rounded-[2rem] flex items-center justify-between group overflow-hidden relative active:scale-95 transition-all">
        <div className="relative z-10 flex items-center gap-3">
          <div className="bg-white/20 p-2 rounded-xl backdrop-blur-md">
            <TrendingUp size={20} />
          </div>
          <div className="text-left">
            <p className="font-bold text-sm">Manajemen Inventaris</p>
            <p className="text-[10px] opacity-60">Lihat seluruh daftar barang</p>
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