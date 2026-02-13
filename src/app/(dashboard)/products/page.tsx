"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLiveQuery } from 'dexie-react-hooks';
import { db_local } from '@/lib/db';
import { getCookie } from 'cookies-next';
import { 
  Search, 
  PackageSearch, 
  MapPin, 
  BookOpen, 
  ChevronRight,
  Loader2,
  X,
  Lock,
  Eye,
  Trash2
} from "lucide-react";

export default function ProductsPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionRef = useRef<HTMLDivElement>(null);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [userRole, setUserRole] = useState<string | null>(null);

  // Mengambil data dari Dexie secara Real-time
  const products = useLiveQuery(() => db_local.products.toArray());

  useEffect(() => {
    const role = getCookie('user-role');
    setUserRole(role as string);
  }, []);

  const filteredProducts = products?.filter(p => 
    p.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.kode.toLowerCase().includes(searchTerm.toLowerCase())
  ).reverse() || [];

  const suggestions = searchTerm.length > 0 
    ? products?.filter(p => 
        p.nama.toLowerCase().includes(searchTerm.toLowerCase()) || 
        p.kode.toLowerCase().includes(searchTerm.toLowerCase())
      ).slice(0, 5)
    : [];

  // Fungsi Hapus Barang
  const handleDelete = async (id: number) => {
    const confirmDelete = confirm("⚠️ PERINGATAN: Apakah Anda yakin ingin menghapus barang ini? Data yang dihapus tidak dapat dikembalikan.");
    
    if (confirmDelete) {
      try {
        await db_local.products.delete(id);
        setSelectedProduct(null); // Tutup modal setelah hapus
        alert("Barang berhasil dihapus dari sistem.");
      } catch (error) {
        console.error("Gagal menghapus:", error);
        alert("Gagal menghapus data.");
      }
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (suggestionRef.current && !suggestionRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
      {/* Search Header Section */}
      <div className="space-y-4 mb-6 relative" ref={suggestionRef}>
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
          <input 
            type="text"
            placeholder="Cari nama atau kode barang..."
            className={`w-full p-4 pl-12 bg-white border border-slate-100 outline-none shadow-sm text-sm font-medium transition-all ${
              showSuggestions && suggestions?.length ? "rounded-t-[1.5rem] border-b-transparent" : "rounded-[1.5rem]"
            } focus:ring-2 focus:ring-blue-500`}
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
          />
          {searchTerm && (
            <button 
              onClick={() => {setSearchTerm(""); setShowSuggestions(false);}}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {showSuggestions && suggestions && suggestions.length > 0 && (
          <div className="absolute top-full left-0 w-full bg-white border-x border-b border-slate-100 rounded-b-[1.5rem] shadow-xl z-50 overflow-hidden">
            {suggestions.map((p) => (
              <div 
                key={p.id}
                onClick={() => {
                  setSearchTerm(p.nama);
                  setShowSuggestions(false);
                  setSelectedProduct(p);
                }}
                className="px-5 py-3 hover:bg-slate-50 flex items-center gap-3 cursor-pointer border-t border-slate-50"
              >
                <Search size={14} className="text-slate-300" />
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-slate-700">{p.nama}</span>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">{p.kode}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Main List Barang */}
      <div className="space-y-3">
        {filteredProducts.length > 0 ? filteredProducts.map((product) => (
          <div 
            key={product.id} 
            onClick={() => setSelectedProduct(product)} 
            className="bg-white p-4 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-4 active:scale-[0.98] transition-all cursor-pointer hover:border-blue-200"
          >
            <div className="w-14 h-14 bg-slate-50 rounded-2xl flex flex-col items-center justify-center border border-slate-100 text-blue-600 shrink-0">
              <span className="text-[10px] font-black uppercase">{product.kategori?.substring(0,3) || 'ITM'}</span>
              <span className="text-lg font-black">{product.stok}</span>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-[9px] font-black bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded uppercase tracking-tighter">
                  {product.kode}
                </span>
              </div>
              <h3 className="font-bold text-slate-800 text-sm truncate uppercase">{product.nama}</h3>
              <div className="flex items-center gap-3 mt-1">
                <div className="flex items-center gap-1 text-slate-400">
                  <BookOpen size={12} />
                  <span className="text-[10px] font-medium truncate max-w-[80px] uppercase">{product.penerbit}</span>
                </div>
                <div className="flex items-center gap-1 text-orange-500">
                  <MapPin size={12} />
                  <span className="text-[10px] font-black">{product.lokasi}</span>
                </div>
              </div>
            </div>

            <div className="text-right shrink-0">
              <p className="text-sm font-black text-slate-800">
                {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(product.hargaJual)}
              </p>
              <ChevronRight size={16} className="text-slate-300 ml-auto" />
            </div>
          </div>
        )) : (
          <div className="text-center py-20 bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-200">
            <PackageSearch className="mx-auto text-slate-300 mb-2" size={48} />
            <p className="text-slate-400 font-bold text-sm">Barang tidak ditemukan</p>
          </div>
        )}
      </div>

      {/* MODAL DETAIL */}
      {selectedProduct && (
        <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setSelectedProduct(null)} />
          
          <div className="relative bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in slide-in-from-bottom-10 duration-300">
            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <span className="text-[10px] font-black bg-blue-100 text-blue-600 px-3 py-1 rounded-full uppercase tracking-widest">
                    {selectedProduct.kode}
                  </span>
                  <h2 className="text-xl font-black text-slate-800 mt-3 uppercase leading-tight">{selectedProduct.nama}</h2>
                </div>
                <button onClick={() => setSelectedProduct(null)} className="p-2 bg-slate-50 rounded-full text-slate-400 hover:text-slate-600 transition-colors">
                  <X size={20} />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-slate-50 p-5 rounded-[2rem] border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Stok Gudang</p>
                  <p className="text-2xl font-black text-slate-800">{selectedProduct.stok} <span className="text-xs text-slate-400">Unit</span></p>
                </div>
                <div className="bg-orange-50 p-5 rounded-[2rem] border border-orange-100">
                  <p className="text-[10px] font-bold text-orange-400 uppercase mb-1">Lokasi Rak</p>
                  <p className="text-2xl font-black text-orange-600">{selectedProduct.lokasi}</p>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center pb-4 border-b border-slate-50">
                  <span className="text-xs font-bold text-slate-400 uppercase">Penerbit</span>
                  <span className="text-sm font-black text-slate-700 uppercase">{selectedProduct.penerbit}</span>
                </div>
                
                  <div className="flex justify-between items-center pb-4 border-b border-slate-100 bg-blue-50/50 -mx-2 px-2 py-1 rounded-lg">
                    <span className="text-[10px] font-bold text-blue-600 uppercase">Harga Modal</span>
                    <span className="text-sm font-bold text-slate-600 font-mono">Rp{selectedProduct.hargaModal?.toLocaleString('id-ID')}</span>
                  </div>

                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-400 uppercase">Harga Jual</span>
                  <span className="text-xl font-black text-blue-600">
                    {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(selectedProduct.hargaJual)}
                  </span>
                </div>
              </div>

              {/* ACTION BUTTON BERDASARKAN ROLE */}
              {userRole === 'admin' ? (
                <div className="grid grid-cols-12 gap-3">
                  <button 
                    onClick={() => router.push(`/products/edit/${selectedProduct.id}`)}
                    className="col-span-9 bg-slate-900 text-white p-5 rounded-[1.8rem] font-black text-xs uppercase tracking-widest shadow-xl active:scale-95 transition-all flex items-center justify-center gap-3"
                  >
                    <PackageSearch size={18} />
                    Edit Barang
                  </button>
                  <button 
                    onClick={() => handleDelete(selectedProduct.id)}
                    className="col-span-3 bg-red-50 text-red-500 p-5 rounded-[1.8rem] font-black border border-red-100 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center shadow-sm"
                    title="Hapus Barang"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => setSelectedProduct(null)}
                  className="w-full bg-blue-600 text-white p-5 rounded-[1.8rem] font-black text-sm uppercase tracking-[0.2em] shadow-xl active:scale-95 transition-all flex items-center justify-center gap-3"
                >
                  <Eye size={20} />
                  Tutup Detail
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}