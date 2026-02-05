"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLiveQuery } from 'dexie-react-hooks';
import { db_local } from '@/lib/db';
import { 
  PackagePlus, Barcode, MapPin, Wallet, 
  ChevronLeft, Save, BookOpen, AlignLeft, RefreshCw, Layers 
} from "lucide-react";

export default function AddProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Ambil data referensi dari database secara realtime
  const categories = useLiveQuery(() => db_local.categories.toArray());
  const publishers = useLiveQuery(() => db_local.publishers.toArray());

  const [formData, setFormData] = useState({
    nama: "",
    kode: "",
    penerbit: "",
    kategori: "",
    lokasi: "",
    hargaModal: "",
    hargaJual: "",
    stok: "",
    deskripsi: ""
  });

  // Fungsi pemisah ribuan (Format IDR)
  const formatNumber = (value: string) => {
    const number = value.replace(/\D/g, "");
    return number.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const parseNumber = (value: string) => {
    return Number(value.replace(/\./g, ""));
  };

  const generateSKU = () => {
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    setFormData(prev => ({ ...prev, kode: `TM-${randomNum}` }));
  };

  useEffect(() => {
    generateSKU();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.kategori) {
      alert("Silakan pilih kategori terlebih dahulu!");
      return;
    }
    if (!formData.penerbit) {
      alert("Silakan pilih penerbit terlebih dahulu!");
      return;
    }

    setLoading(true);
    try {
      await db_local.products.add({
        ...formData,
        nama: formData.nama.toUpperCase(),
        penerbit: formData.penerbit.toUpperCase(),
        kategori: formData.kategori.toUpperCase(),
        lokasi: formData.lokasi.toUpperCase(),
        hargaModal: parseNumber(formData.hargaModal),
        hargaJual: parseNumber(formData.hargaJual),
        stok: Number(formData.stok),
        updatedAt: Date.now()
      });
      alert("Barang berhasil disimpan!");
      router.push("/products");
    } catch (error) {
      console.error(error);
      alert("Gagal menyimpan barang.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pb-24">
      <div className="bg-white p-4 border-b border-slate-100 flex items-center gap-4 sticky top-[65px] z-30">
        <button onClick={() => router.back()} className="p-2 hover:bg-slate-50 rounded-xl text-slate-400 transition-all">
          <ChevronLeft size={24} />
        </button>
        <h1 className="font-black text-slate-800 tracking-tight text-sm uppercase">Input Barang Baru</h1>
      </div>

      <form onSubmit={handleSubmit} className="p-5 space-y-6">
        {/* Section 1: Identitas */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-blue-600">
            <PackagePlus size={18} />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Data Identitas</span>
          </div>
          <div className="bg-white p-5 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-4">
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase ml-2">Nama Produk</label>
              <input 
                required
                type="text" 
                placeholder="CONTOH: AL-QUR'AN TIKRAR A5"
                className="w-full mt-1 p-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 text-sm font-semibold uppercase transition-all"
                value={formData.nama}
                onChange={(e) => setFormData({...formData, nama: e.target.value.toUpperCase()})}
              />
            </div>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Barcode className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <input readOnly type="text" className="w-full p-4 pl-12 bg-slate-100 border-none rounded-2xl text-sm font-mono font-bold text-blue-600 outline-none" value={formData.kode} />
              </div>
              <button type="button" onClick={generateSKU} className="bg-slate-50 p-4 rounded-2xl text-slate-400 border border-slate-100 active:rotate-180 transition-transform duration-500"><RefreshCw size={20} /></button>
            </div>
          </div>
        </div>

        {/* Section 2: Klasifikasi */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-orange-600">
            <Layers size={18} />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Klasifikasi & Rak</span>
          </div>
          <div className="bg-white p-5 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Kategori Dropdown */}
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase ml-2">Kategori</label>
                <select 
                  required
                  className="w-full mt-1 p-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-orange-500 text-sm font-bold uppercase appearance-none cursor-pointer"
                  value={formData.kategori}
                  onChange={(e) => setFormData({...formData, kategori: e.target.value})}
                >
                  <option value="">-- PILIH KATEGORI --</option>
                  {categories?.map((cat) => (
                    <option key={cat.id} value={cat.nama}>{cat.nama}</option>
                  ))}
                </select>
              </div>

              {/* Penerbit Dropdown */}
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase ml-2">Penerbit / Supplier</label>
                <select 
                  required
                  className="w-full mt-1 p-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-orange-500 text-sm font-bold uppercase appearance-none cursor-pointer"
                  value={formData.penerbit}
                  onChange={(e) => setFormData({...formData, penerbit: e.target.value})}
                >
                  <option value="">-- PILIH PENERBIT --</option>
                  {publishers?.map((pub) => (
                    <option key={pub.id} value={pub.nama}>{pub.nama}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="relative">
              <label className="text-[10px] font-bold text-slate-400 uppercase ml-2">Lokasi Rak</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                <input 
                  type="text" placeholder="LOKASI (MISAL: RAK A-5)"
                  className="w-full mt-1 p-4 pl-11 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-orange-500 text-sm font-bold uppercase transition-all"
                  value={formData.lokasi}
                  onChange={(e) => setFormData({...formData, lokasi: e.target.value.toUpperCase()})}
                />
              </div>
            </div>

            <textarea 
              rows={2} placeholder="Deskripsi singkat produk (opsional)..."
              className="w-full p-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium transition-all"
              value={formData.deskripsi}
              onChange={(e) => setFormData({...formData, deskripsi: e.target.value})}
            />
          </div>
        </div>

        {/* Section 3: Finansial */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-emerald-600">
            <Wallet size={18} />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Finansial & Stok</span>
          </div>
          <div className="bg-white p-5 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold text-slate-400 ml-2 uppercase">Harga Modal</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400">Rp</span>
                  <input 
                    required type="text" 
                    className="w-full mt-1 p-4 pl-10 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-black transition-all"
                    value={formData.hargaModal}
                    onChange={(e) => setFormData({...formData, hargaModal: formatNumber(e.target.value)})}
                  />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 ml-2 uppercase">Harga Jual</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400">Rp</span>
                  <input 
                    required type="text"
                    className="w-full mt-1 p-4 pl-10 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-black text-blue-600 transition-all"
                    value={formData.hargaJual}
                    onChange={(e) => setFormData({...formData, hargaJual: formatNumber(e.target.value)})}
                  />
                </div>
              </div>
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-400 ml-2 uppercase tracking-widest">Jumlah Stok</label>
              <input 
                required type="number" placeholder="0"
                className="w-full mt-1 p-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 text-sm font-black text-center transition-all"
                value={formData.stok}
                onChange={(e) => setFormData({...formData, stok: e.target.value})}
              />
            </div>
          </div>
        </div>

        <button 
          disabled={loading}
          className="w-full bg-slate-900 text-white p-5 rounded-[2rem] font-black text-sm uppercase tracking-[0.2em] shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-3 disabled:bg-slate-300"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <Save size={20} />
              Simpan ke Gudang
            </>
          )}
        </button>
      </form>
    </div>
  );
}