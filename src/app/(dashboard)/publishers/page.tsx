"use client";

import React, { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db_local } from '@/lib/db';
import { BookOpen, Plus, Trash2, Loader2 } from "lucide-react";

export default function PublishersPage() {
  const [newPub, setNewPub] = useState("");
  const publishers = useLiveQuery(() => db_local.publishers.toArray());

  const addPublisher = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPub) return;
    try {
      await db_local.publishers.add({ nama: newPub.toUpperCase() });
      setNewPub("");
    } catch (error) {
      alert("Penerbit sudah terdaftar!");
    }
  };

  const deletePublisher = async (id: number) => {
    if (confirm("Hapus penerbit ini?")) {
      await db_local.publishers.delete(id);
    }
  };

  return (
    <div className="p-5 pb-24">
      <header className="mb-6">
        <h1 className="text-2xl font-black text-slate-800 tracking-tight text-sm uppercase">Daftar Penerbit</h1>
        <p className="text-[10px] font-bold text-orange-600 uppercase tracking-widest">Manajemen Suplier & Penerbit</p>
      </header>

      <form onSubmit={addPublisher} className="mb-8 flex gap-2">
        <input 
          type="text"
          placeholder="NAMA PENERBIT BARU..."
          className="flex-1 p-4 bg-white border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-orange-500 text-xs font-bold uppercase shadow-sm"
          value={newPub}
          onChange={(e) => setNewPub(e.target.value.toUpperCase())}
        />
        <button className="bg-orange-600 text-white p-4 rounded-2xl shadow-lg active:scale-95 transition-all">
          <Plus size={20} />
        </button>
      </form>

      <div className="grid grid-cols-1 gap-3">
        {publishers ? (
          publishers.map((pub) => (
            <div key={pub.id} className="bg-white p-4 rounded-2xl border border-slate-50 shadow-sm flex items-center justify-between group">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-orange-600">
                  <BookOpen size={18} />
                </div>
                <span className="font-bold text-slate-700 text-sm">{pub.nama}</span>
              </div>
              <button onClick={() => deletePublisher(pub.id!)} className="p-2 text-slate-300 hover:text-red-500 transition-all">
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