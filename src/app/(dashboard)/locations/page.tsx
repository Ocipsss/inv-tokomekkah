"use client";

import React, { useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { db_local } from "@/lib/db";
import { MapPin, Plus, Trash2, Loader2, Search } from "lucide-react";

export default function LocationsPage() {
  const [newLoc, setNewLoc] = useState("");
  const [search, setSearch] = useState("");
  
  // Ambil data lokasi dari Dexie
  const locations = useLiveQuery(() => 
    db_local.locations.toArray()
  );

  // Fungsi Tambah Lokasi
  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLoc.trim()) return;
    
    try {
      await db_local.locations.add({ 
        nama: newLoc.trim().toUpperCase() 
      });
      setNewLoc("");
    } catch (err) {
      alert("Nama lokasi sudah ada!");
    }
  };

  // Fungsi Hapus Lokasi
  const handleDelete = async (id: number) => {
    if (confirm("Hapus lokasi rak ini?")) {
      await db_local.locations.delete(id);
    }
  };

  // Filter pencarian
  const filteredData = locations?.filter(item => 
    item.nama.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header Halaman */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-slate-800 uppercase tracking-tight">Lokasi Rak</h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Titik Penyimpanan Barang</p>
        </div>
        <div className="bg-blue-50 text-blue-600 p-3 rounded-2xl">
          <MapPin size={24} />
        </div>
      </div>

      {/* Form Input Tambah Baru */}
      <form onSubmit={handleAdd} className="flex gap-2">
        <input
          type="text"
          placeholder="CONTOH: RAK A-01"
          className="flex-1 bg-slate-50 border-none p-4 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none uppercase placeholder:text-slate-300"
          value={newLoc}
          onChange={(e) => setNewLoc(e.target.value)}
        />
        <button type="submit" className="bg-slate-900 text-white p-4 rounded-2xl hover:bg-blue-600 transition-all shadow-lg shadow-slate-200">
          <Plus size={20} />
        </button>
      </form>

      {/* List Lokasi */}
      <div className="grid gap-2">
        {!locations ? (
          <div className="flex justify-center py-10">
            <Loader2 className="animate-spin text-slate-300" size={24} />
          </div>
        ) : filteredData?.length === 0 ? (
          <div className="text-center py-10 bg-slate-50 rounded-[2rem] border border-dashed border-slate-200">
            <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Data lokasi tidak ditemukan</p>
          </div>
        ) : (
          filteredData?.map((item: any) => (
            <div key={item.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl group hover:bg-white hover:shadow-md transition-all border border-transparent hover:border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-slate-400 font-black text-[10px] shadow-sm">
                  #
                </div>
                <span className="font-bold text-slate-700 text-sm uppercase">{item.nama}</span>
              </div>
              <button 
                onClick={() => handleDelete(item.id)}
                className="text-slate-200 hover:text-red-500 p-2 hover:bg-red-50 rounded-xl transition-all"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Footer Status */}
      <div className="pt-4 border-t border-slate-50">
        <p className="text-[9px] text-center font-bold text-slate-300 uppercase tracking-[0.3em]">
          Total {locations?.length || 0} Titik Rak Terdaftar
        </p>
      </div>
    </div>
  );
}