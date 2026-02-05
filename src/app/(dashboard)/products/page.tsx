"use client";

import React, { useState, useEffect } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db_local } from '@/lib/db';
import { 
  Search, 
  Plus, 
  PackageSearch, 
  MapPin, 
  BookOpen, 
  ChevronRight,
  Loader2
} from "lucide-react";
import Link from 'next/link';

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState("");

  // Membaca data secara live dari Dexie
  const products = useLiveQuery(
    () => db_local.products
      .reverse() // Data terbaru di atas
      .toArray()
  );

  // Filter pencarian
  const filteredProducts = products?.filter(p => 
    p.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.kode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.penerbit.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!products) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="animate-spin text-blue-600" size={32} />
        <p className="text-sm font-bold text-slate-400 mt-4">Memuat data gudang...</p>
      </div>
    );
  }

  return (
    <div className="p-5 pb-24">
      {/* Header & Search */}
      <div className="space-y-4 mb-6">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">STOK BARANG</h1>
            <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">TokoMekkah Inventory</p>
          </div>
          <Link href="/products/add">
            <button className="bg-blue-600 text-white p-3 rounded-2xl shadow-lg shadow-blue-100 active:scale-95 transition-all">
              <Plus size={20} />
            </button>
          </Link>
        </div>

        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
          <input 
            type="text"
            placeholder="Cari nama, SKU, atau penerbit..."
            className="w-full p-4 pl-12 bg-white border border-slate-100 rounded-[1.5rem] outline-none shadow-sm focus:ring-2 focus:ring-blue-500 text-sm font-medium transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* List Barang */}
      <div className="space-y-3">
        {filteredProducts && filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div key={product.id} className="bg-white p-4 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-4 active:scale-[0.98] transition-all cursor-pointer">
              {/* Thumbnail / Initial */}
              <div className="w-14 h-14 bg-slate-50 rounded-2xl flex flex-col items-center justify-center border border-slate-100 text-blue-600 shrink-0">
                <span className="text-[10px] font-black uppercase">{product.kategori.substring(0,3)}</span>
                <span className="text-lg font-black">{product.stok}</span>
              </div>

              {/* Info Detail */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-[9px] font-black bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded uppercase tracking-tighter">
                    {product.kode}
                  </span>
                  {product.stok <= 5 && (
                    <span className="text-[9px] font-black bg-red-50 text-red-500 px-1.5 py-0.5 rounded uppercase">Limit</span>
                  )}
                </div>
                <h3 className="font-bold text-slate-800 text-sm truncate">{product.nama}</h3>
                
                <div className="flex items-center gap-3 mt-1">
                  <div className="flex items-center gap-1 text-slate-400">
                    <BookOpen size={12} />
                    <span className="text-[10px] font-medium truncate max-w-[80px]">{product.penerbit || '-'}</span>
                  </div>
                  <div className="flex items-center gap-1 text-orange-500">
                    <MapPin size={12} />
                    <span className="text-[10px] font-black">{product.lokasi || 'N/A'}</span>
                  </div>
                </div>
              </div>

              {/* Harga */}
              <div className="text-right">
                <p className="text-[10px] font-bold text-slate-400 uppercase leading-none mb-1">Harga</p>
                <p className="text-sm font-black text-slate-800">
                  {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(product.hargaJual)}
                </p>
                <ChevronRight size={16} className="text-slate-300 ml-auto mt-1" />
              </div>
            </div>
          ))
        ) : (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-20 text-center opacity-40">
            <PackageSearch size={64} strokeWidth={1} />
            <p className="mt-4 font-bold text-sm">Barang tidak ditemukan</p>
          </div>
        )}
      </div>
    </div>
  );
}