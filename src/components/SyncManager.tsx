"use client";

import { useEffect } from "react";
import { db_cloud } from "@/lib/firebase";
import { collection, onSnapshot } from "firebase/firestore";
import { db_local } from "@/lib/db";

export default function SyncManager() {
  useEffect(() => {
    // 1. Hubungkan ke koleksi 'products' di Firestore
    const productCol = collection(db_cloud, "products");

    // 2. Gunakan onSnapshot untuk memantau perubahan secara Real-Time
    const unsubscribe = onSnapshot(productCol, (snapshot) => {
      snapshot.docChanges().forEach(async (change) => {
        const firestoreData = change.doc.data();
        
        // Cari apakah barang ini sudah ada di Dexie lokal berdasarkan KODE
        const existingLocalData = await db_local.products
          .where("kode")
          .equals(firestoreData.kode)
          .first();

        if (change.type === "added" || change.type === "modified") {
          try {
            // Gunakan .put() agar jika data sudah ada di-update, jika belum ada ditambah (Upsert)
            // Jika sudah ada di lokal, kita sertakan 'id' lokalnya agar tidak duplikat
            await db_local.products.put({
              ...firestoreData,
              id: existingLocalData?.id, // Pertahankan ID lokal jika ada
            } as any);
            
            console.log(`Sync Success: ${firestoreData.nama} updated.`);
          } catch (err) {
            console.error("Sync Error (Add/Mod):", err);
          }
        }

        if (change.type === "removed") {
          try {
            if (existingLocalData?.id) {
              await db_local.products.delete(existingLocalData.id);
              console.log(`Sync Success: ${firestoreData.nama} removed.`);
            }
          } catch (err) {
            console.error("Sync Error (Delete):", err);
          }
        }
      });
    });

    // Bersihkan listener saat aplikasi ditutup
    return () => unsubscribe();
  }, []);

  // Komponen ini tidak merender apapun di layar
  return null;
}