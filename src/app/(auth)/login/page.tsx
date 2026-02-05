"use client";

import React, { useState } from "react";
import { auth, db_cloud } from "@/lib/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { setCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { LogIn } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Autentikasi ke Firebase Auth
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 2. Ambil dokumen User dari Firestore untuk cek Role
      const userDocRef = doc(db_cloud, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

      let role = "staff"; // Default role

      if (userDoc.exists()) {
        role = userDoc.data().role || "staff";
      }

      // 3. Simpan Role di Cookie (agar bisa dibaca Middleware Server-Side)
      // Kita simpan selama 7 hari
      setCookie("user-role", role, { 
        maxAge: 60 * 60 * 24 * 7,
        path: "/", 
      });

      // 4. Redirect ke Dashboard
      router.push("/");
      router.refresh(); // Memastikan middleware mendeteksi cookie baru
      
    } catch (error: any) {
      console.error("Login Error:", error);
      alert("Login Gagal: " + (error.message || "Terjadi kesalahan"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50 p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-blue-600 p-3 rounded-xl mb-4 text-white shadow-lg shadow-blue-200">
            <LogIn size={28} />
          </div>
          <h1 className="text-2xl font-bold text-slate-800 uppercase tracking-tight">
            TokoMekkah
          </h1>
          <p className="text-slate-500 text-sm">Inventory System Login</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-sm font-semibold text-slate-700 ml-1">
              Email
            </label>
            <input
              type="email"
              className="w-full p-3 mt-1 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-slate-800"
              placeholder="admin@mekkah.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-700 ml-1">
              Password
            </label>
            <input
              type="password"
              className="w-full p-3 mt-1 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-slate-800"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white p-3 rounded-xl font-bold hover:bg-blue-700 active:scale-[0.98] transition-all disabled:bg-slate-300 disabled:pointer-events-none shadow-md shadow-blue-100"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Memproses...
                </span>
              ) : (
                "Masuk Sekarang"
              )}
            </button>
          </div>
        </form>

        <p className="mt-8 text-center text-xs text-slate-400">
          &copy; {new Date().getFullYear()} TokoMekkah Inventory System
        </p>
      </div>
    </div>
  );
}