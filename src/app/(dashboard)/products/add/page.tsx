"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLiveQuery } from 'dexie-react-hooks';
import { db_local } from '@/lib/db';
import { 
  PackagePlus, Barcode, MapPin, Wallet, 
  Save, Layers 
} from "lucide-react";

export default function AddProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // State khusus untuk pencarian Lokasi Rak
  const [searchLoc, setSearchLoc] = useState("");
  const [showLocList, setShowLocList] = useState(false);

  // Ambil data referensi & urutkan otomatis A-Z (orderBy)
  const categories = useLiveQuery(() => db_local.categories.orderBy('nama').toArray());
  const publishers = useLiveQuery(() => db_local.publishers.orderBy('nama').toArray());
  const locations = useLiveQuery(() => db_local.locations.orderBy('nama').toArray());

  // Filter Lokasi berdasarkan input pencarian
  const filteredLocations = locations?.filter(l => 
    l.nama.toLowerCase().includes(searchLoc.toLowerCase())
  );

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

  const formatNumber = (value: string) => {
    const number = value.replace(/\D/g, "");
    return number.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const parseNumber = (value: string) => Number(value.replace(/\./g, ""));

  const generateSKU = () => {
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    setFormData(prev => ({ ...prev, kode: `TM-${randomNum}` }));
  };

  const resetForm = () => {
    setFormData({
      nama: "",
      kode: `TM-${Math.floor(100000 + Math.random() * 900000)}`,
      penerbit: "",
      kategori: "",
      lokasi: "",
      hargaModal: "",
      hargaJual: "",
      stok: "",
      deskripsi: ""
    });
    setSearchLoc("");
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    generateSKU();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validasi Field Wajib
    if (!formData.kategori || !formData.penerbit || !formData.lokasi) {
      alert("Silakan lengkapi kategori, penerbit, dan lokasi rak!");
      return;
    }

    setLoading(true);
    try {
      const cleanData = {
        nama: formData.nama.toUpperCase(),
        kode: formData.kode,
        penerbit: formData.penerbit.toUpperCase(),
        kategori: formData.kategori.toUpperCase(),
        lokasi: formData.lokasi.toUpperCase(),
        // Harga Modal & Jual sekarang opsional (jika kosong jadi 0)
        hargaModal: formData.hargaModal ? parseNumber(formData.hargaModal) : 0,
        hargaJual: formData.hargaJual ? parseNumber(formData.hargaJual) : 0,
        stok: Number(formData.stok) || 0,
        deskripsi: formData.deskripsi,
        updatedAt: Date.now()
      };
      
      await db_local.products.add(cleanData);
      alert("Barang berhasil disimpan!");
      resetForm();
    } catch (error) {
      console.error("Gagal menyimpan:", error);
      alert("Gagal menyimpan data.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pb-24">
      <form onSubmit={handleSubmit} className="p-2 space-y-2">
        
        {/* Section 1: Identitas */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-blue-600">
            <PackagePlus size={18} />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Data Identitas</span>
          </div>
          <div className="bg-white p-5 rounded-[1.5rem] border border-slate-100 shadow-sm space-y-4">
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase ml-2">Nama Produk</label>
              <input 
                required type="text" placeholder="CONTOH: AL-QUR'AN TIKRAR A5"
                className="w-full mt-1 p-4 bg-slate-50 border-none rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-sm font-semibold uppercase transition-all"
                value={formData.nama}
                onChange={(e) => setFormData({...formData, nama: e.target.value.toUpperCase()})}
              />
            </div>
            
            <div className="relative">
              <label className="text-[10px] font-bold text-slate-400 uppercase ml-2">Kode Produk (Otomatis)</label>
              <div className="relative mt-1">
                <Barcode className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <input 
                  readOnly 
                  type="text" 
                  className="w-full p-4 pl-12 bg-slate-100 border-none rounded-xl text-sm font-mono font-bold text-blue-600 outline-none cursor-not-allowed" 
                  value={formData.kode} 
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Klasifikasi */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-orange-600">
            <Layers size={18} />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Klasifikasi & Rak</span>
          </div>
          <div className="bg-white p-5 rounded-[1.5rem] border border-slate-100 shadow-sm space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase ml-2">Kategori</label>
                <select 
                  required
                  className="w-full mt-1 p-4 bg-slate-50 border-none rounded-xl outline-none focus:ring-2 focus:ring-orange-500 text-sm font-bold uppercase cursor-pointer"
                  value={formData.kategori}
                  onChange={(e) => setFormData({...formData, kategori: e.target.value})}
                >
                  <option value="">-- PILIH KATEGORI --</option>
                  {categories?.map((cat) => (
                    <option key={cat.id} value={cat.nama}>{cat.nama}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase ml-2">Penerbit / Supplier</label>
                <select 
                  required
                  className="w-full mt-1 p-4 bg-slate-50 border-none rounded-xl outline-none focus:ring-2 focus:ring-orange-500 text-sm font-bold uppercase cursor-pointer"
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

            {/* SEARCHBAR LOKASI RAK */}
            <div className="relative">
              <label className="text-[10px] font-bold text-slate-400 uppercase ml-2 text-orange-600">Titik Lokasi Rak</label>
              <div className="relative mt-1">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={16} />
                <input 
                  type="text"
                  placeholder={formData.lokasi || "CARI RAK..."}
                  className="w-full p-4 pl-11 bg-slate-50 border-none rounded-xl outline-none focus:ring-2 focus:ring-orange-500 text-sm font-bold uppercase transition-all"
                  value={searchLoc}
                  onChange={(e) => { 
                    const val = e.target.value;
                    setSearchLoc(val); 
                    setShowLocList(val.length > 0); 
                  }}
                />
              </div>

              {showLocList && searchLoc.length > 0 && (
                <div className="absolute z-50 w-full mt-2 bg-white border border-slate-100 shadow-2xl rounded-[1.5rem] overflow-hidden max-h-52 overflow-y-auto">
                  {filteredLocations?.length === 0 ? (
                    <div className="p-4 text-[10px] font-bold text-slate-400 text-center uppercase">Lokasi tidak ditemukan</div>
                  ) : (
                    filteredLocations?.map((loc) => (
                      <div 
                        key={loc.id}
                        className="p-4 text-sm font-bold uppercase hover:bg-orange-50 cursor-pointer border-b border-slate-50 last:border-none transition-colors"
                        onClick={() => {
                          setFormData({...formData, lokasi: loc.nama});
                          setSearchLoc(""); 
                          setShowLocList(false);
                        }}
                      >
                        {loc.nama}
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            <textarea 
              rows={2} placeholder="Deskripsi singkat produk (opsional)..."
              className="w-full p-4 bg-slate-50 border-none rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium transition-all"
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
          <div className="bg-white p-5 rounded-[1.5rem] border border-slate-100 shadow-sm space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold text-slate-400 ml-2 uppercase">Harga Modal</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400">Rp</span>
                  <input 
                    type="text" 
                    className="w-full mt-1 p-4 pl-10 bg-slate-50 border-none rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-black transition-all"
                    placeholder="0"
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
                    className="w-full mt-1 p-4 pl-10 bg-slate-50 border-none rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-black transition-all"
                    placeholder="0"
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
                className="w-full mt-1 p-4 bg-slate-50 border-none rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-sm font-black text-center transition-all"
                value={formData.stok}
                onChange={(e) => setFormData({...formData, stok: e.target.value})}
              />
            </div>
          </div>
        </div>

        <button 
          disabled={loading}
          className="w-full bg-slate-900 text-white p-5 rounded-[1.5rem] font-black text-sm uppercase tracking-[0.2em] shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-3 disabled:bg-slate-300"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-lg animate-spin" />
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