"use client";

import React, { useState, useEffect } from "react";
import { db_cloud, auth_cloud } from "@/lib/firebase"; 
import { collection, getDocs, doc, updateDoc, deleteDoc, setDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { 
  UserPlus, ShieldCheck, UserCog, Trash2, 
  Mail, Loader2, X, Lock, User, CheckCircle2,
  Fingerprint
} from "lucide-react";

interface Staff {
  id: string;
  nama: string;
  email: string;
  role: "admin" | "staff";
}

export default function StaffManagementPage() {
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);
  
  // State untuk Modal & Form
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [newStaff, setNewStaff] = useState({
    nama: "",
    email: "",
    password: "",
    role: "staff" as "admin" | "staff"
  });

  // 1. Ambil data staff dari Firestore
  const fetchStaff = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db_cloud, "users"));
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Staff[];
      setStaffList(data);
    } catch (error) {
      console.error("Error fetching staff:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  // 2. Fungsi Tambah Staff (Auth + Firestore)
  const handleAddStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth_cloud, 
        newStaff.email, 
        newStaff.password
      );
      const user = userCredential.user;

      await setDoc(doc(db_cloud, "users", user.uid), {
        nama: newStaff.nama.toUpperCase(),
        email: newStaff.email,
        role: newStaff.role,
        createdAt: new Date().toISOString()
      });

      setIsModalOpen(false);
      setNewStaff({ nama: "", email: "", password: "", role: "staff" });
      fetchStaff();
    } catch (error: any) {
      alert("Gagal: " + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const toggleRole = async (id: string, currentRole: string) => {
    const newRole = currentRole === "admin" ? "staff" : "admin";
    try {
      await updateDoc(doc(db_cloud, "users", id), { role: newRole });
      fetchStaff();
    } catch (error) {
      alert("Gagal mengubah hak akses");
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Hapus akses staff ini secara permanen?")) {
      try {
        await deleteDoc(doc(db_cloud, "users", id));
        fetchStaff();
      } catch (error) {
        alert("Gagal menghapus data");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="relative">
          <Loader2 className="animate-spin text-blue-600" size={32} />
          <Fingerprint className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-blue-100" size={16} />
        </div>
        <p className="text-[10px] font-bold text-slate-400 mt-4 uppercase tracking-widest">Memuat Data...</p>
      </div>
    );
  }

  return (
    <div className="p-5 pb-24">
      {/* Header Minimalis */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight uppercase">Manajemen Staff</h1>
          <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Akses Kontrol Sistem</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white p-3 rounded-2xl shadow-lg shadow-blue-100 active:scale-95 transition-all"
        >
          <UserPlus size={20} />
        </button>
      </div>

      {/* Staff List Style Awal */}
      <div className="space-y-4">
        {staffList.map((staff) => (
          <div key={staff.id} className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg ${
                  staff.role === 'admin' ? 'bg-blue-50 text-blue-600' : 'bg-slate-50 text-slate-400'
                }`}>
                  {staff.nama.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-sm leading-none mb-1 uppercase">{staff.nama}</h3>
                  <div className="flex items-center gap-1 text-slate-400">
                    <Mail size={12} />
                    <span className="text-[10px] font-medium">{staff.email}</span>
                  </div>
                </div>
              </div>
              <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter ${
                staff.role === 'admin' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'
              }`}>
                {staff.role}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 border-t border-slate-50 pt-4">
              <button 
                onClick={() => toggleRole(staff.id, staff.role)}
                className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-slate-50 text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition-all text-xs font-bold"
              >
                <ShieldCheck size={16} />
                Ubah Role
              </button>
              <button 
                onClick={() => handleDelete(staff.id)}
                className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-red-50 text-red-500 hover:bg-red-100 transition-all text-xs font-bold"
              >
                <Trash2 size={16} />
                Hapus
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL ADD STAFF - Minimalist Style */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => !isSaving && setIsModalOpen(false)} />
          
          <form onSubmit={handleAddStaff} className="relative bg-white w-full max-w-sm rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-black text-slate-800 uppercase italic leading-none">Tambah Staff</h2>
              <button type="button" onClick={() => setIsModalOpen(false)} className="p-2 bg-slate-50 rounded-full text-slate-300">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <input 
                required placeholder="NAMA LENGKAP" 
                className="w-full p-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 text-sm font-bold uppercase"
                value={newStaff.nama}
                onChange={(e) => setNewStaff({...newStaff, nama: e.target.value})}
              />
              <input 
                required type="email" placeholder="EMAIL" 
                className="w-full p-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 text-sm font-bold"
                value={newStaff.email}
                onChange={(e) => setNewStaff({...newStaff, email: e.target.value})}
              />
              <input 
                required type="password" placeholder="PASSWORD" 
                className="w-full p-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 text-sm font-bold"
                value={newStaff.password}
                onChange={(e) => setNewStaff({...newStaff, password: e.target.value})}
              />
              <select 
                className="w-full p-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 text-sm font-black uppercase appearance-none"
                value={newStaff.role}
                onChange={(e) => setNewStaff({...newStaff, role: e.target.value as any})}
              >
                <option value="staff">STAFF</option>
                <option value="admin">ADMIN</option>
              </select>
            </div>

            <button 
              disabled={isSaving}
              className="w-full mt-6 bg-blue-600 text-white p-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg shadow-blue-100 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              {isSaving ? <Loader2 className="animate-spin" size={18} /> : <CheckCircle2 size={18} />}
              {isSaving ? "MENYIMPAN..." : "SIMPAN STAFF"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}