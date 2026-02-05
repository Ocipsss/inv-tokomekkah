"use client";

import React, { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db_local } from '@/lib/db';
import { Layers, Plus, Trash2, Tag, Loader2 } from "lucide-react";

export default function CategoriesPage() {
  const [newCategory, setNewCategory] = useState("");
  const categories = useLiveQuery(() => db_local.categories.toArray());

  const addCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory) return;
    try {
      await db_local.categories.add({ nama: newCategory.toUpperCase() });
      setNewCategory("");
    } catch (error) {
      alert("Kategori sudah ada!");
    }
  };

  const deleteCategory = async (id: number) => {
    if (confirm("Hapus kategori ini?")) {
      await db_local.categories.delete(id);
    }
  };

  return (
    <div className="p-5 pb-24">
      <header className="mb-6">
        <h1 className="text-2xl font-black text-slate-800 tracking-tight text-sm uppercase">Manajemen Kategori</h1>
        <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Atur kelompok produk Anda</p>
      </header>

      {/* Form Tambah Kategori */}
      <form onSubmit={addCategory} className="mb-8 flex gap-2">
        <input 
          type="text"
          placeholder="NAMA KATEGORI BARU..."
          className="flex-1 p-4 bg-white border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 text-xs font-bold uppercase shadow-sm"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value.toUpperCase())}
        />
        <button className="bg-blue-600 text-white p-4 rounded-2xl shadow-lg active:scale-95 transition-all">
          <Plus size={20} />
        </button>
      </form>

      {/* Daftar Kategori */}
      <div className="grid grid-cols-1 gap-3">
        {categories ? (
          categories.map((cat) => (
            <div key={cat.id} className="bg-white p-4 rounded-2xl border border-slate-50 shadow-sm flex items-center justify-between group">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-blue-600">
                  <Tag size={18} />
                </div>
                <span className="font-bold text-slate-700 text-sm tracking-tight">{cat.nama}</span>
              </div>
              <button 
                onClick={() => deleteCategory(cat.id!)}
                className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))
        ) : (
          <div className="flex justify-center p-10"><Loader2 className="animate-spin text-slate-300" /></div>
        )}
      </div>
    </div>
  );
}