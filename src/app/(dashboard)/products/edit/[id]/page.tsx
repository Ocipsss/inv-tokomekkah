"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useLiveQuery } from 'dexie-react-hooks';
import { db_local } from '@/lib/db';
import { 
  PackagePlus, Barcode, MapPin, Wallet, 
  ChevronLeft, Save, RefreshCw, Layers, Loader2 
} from "lucide-react";

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id); // Ambil ID dari URL

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // Ambil referensi kategori & penerbit untuk dropdown
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

  // 1. Ambil data awal produk saat halaman dibuka
  useEffect(() => {
    const loadData = async () => {
      const product = await db_local.products.get(id);
      if (product) {
        setFormData({
          ...product,
          hargaModal: product.hargaModal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."),
          hargaJual: product.hargaJual.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."),
          stok: product.stok.toString(),
          deskripsi: product.deskripsi || ""
        });
      }
      setFetching(false);
    };
    loadData();
  }, [id]);

  const formatNumber = (value: string) => {
    const number = value.replace(/\D/g, "");
    return number.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const parseNumber = (value: string) => {
    return Number(value.replace(/\./g, ""));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await db_local.products.update(id, {
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
      alert("Perubahan berhasil disimpan!");
      router.back(); // Kembali ke daftar barang
    } catch (error) {
      console.error(error);
      alert("Gagal memperbarui data.");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Loader2 className="animate-spin text-blue-600" size={32} />
    </div>
  );

  return (
    <div className="pb-24">
      {/* Header */}
      <div className="bg-white p-4 border-b border-slate-100 flex items-center gap-4 sticky top-[65px] z-30">
        <button onClick={() => router.back()} className="p-2 hover:bg-slate-50 rounded-xl text-slate-400">
          <ChevronLeft size={24} />
        </button>
        <h1 className="font-black text-slate-800 tracking-tight text-sm uppercase">Edit Detail Barang</h1>
      </div>

      <form onSubmit={handleSubmit} className="p-5 space-y-6">
        {/* Section 1: Identitas */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-blue-600">
            <PackagePlus size={18} />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Identitas Produk</span>
          </div>
          <div className="bg-white p-5 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-4">
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase ml-2">Nama Produk</label>
              <input 
                required type="text" 
                className="w-full mt-1 p-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 text-sm font-semibold uppercase"
                value={formData.nama}
                onChange={(e) => setFormData({...formData, nama: e.target.value.toUpperCase()})}
              />
            </div>
            <div className="relative">
              <Barcode className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input readOnly type="text" className="w-full p-4 pl-12 bg-slate-100 border-none rounded-2xl text-sm font-mono font-bold text-slate-400 outline-none" value={formData.kode} />
            </div>
          </div>
        </div>

        {/* Section 2: Klasifikasi */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-orange-600">
            <Layers size={18} />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Klasifikasi & Lokasi</span>
          </div>
          <div className="bg-white p-5 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase ml-2">Kategori</label>
                <select 
                  required
                  className="w-full mt-1 p-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-orange-500 text-sm font-bold uppercase"
                  value={formData.kategori}
                  onChange={(e) => setFormData({...formData, kategori: e.target.value})}
                >
                  {categories?.map((cat) => (
                    <option key={cat.id} value={cat.nama}>{cat.nama}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase ml-2">Penerbit</label>
                <select 
                  required
                  className="w-full mt-1 p-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-orange-500 text-sm font-bold uppercase"
                  value={formData.penerbit}
                  onChange={(e) => setFormData({...formData, penerbit: e.target.value})}
                >
                  {publishers?.map((pub) => (
                    <option key={pub.id} value={pub.nama}>{pub.nama}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase ml-2">Lokasi Rak</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                <input 
                  type="text" 
                  className="w-full mt-1 p-4 pl-11 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-orange-500 text-sm font-bold uppercase"
                  value={formData.lokasi}
                  onChange={(e) => setFormData({...formData, lokasi: e.target.value.toUpperCase()})}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Finansial */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-emerald-600">
            <Wallet size={18} />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Harga & Stok</span>
          </div>
          <div className="bg-white p-5 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold text-slate-400 ml-2 uppercase">Harga Modal</label>
                <input 
                  required type="text" 
                  className="w-full mt-1 p-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-black"
                  value={formData.hargaModal}
                  onChange={(e) => setFormData({...formData, hargaModal: formatNumber(e.target.value)})}
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 ml-2 uppercase">Harga Jual</label>
                <input 
                  required type="text"
                  className="w-full mt-1 p-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-black text-blue-600"
                  value={formData.hargaJual}
                  onChange={(e) => setFormData({...formData, hargaJual: formatNumber(e.target.value)})}
                />
              </div>
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-400 ml-2 uppercase tracking-widest">Jumlah Stok</label>
              <input 
                required type="number"
                className="w-full mt-1 p-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 text-sm font-black text-center"
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
              Simpan Perubahan
            </>
          )}
        </button>
      </form>
    </div>
  );
}