"use client";

import { useEffect } from "react";
import { db_cloud } from "@/lib/firebase";
import { collection, onSnapshot, doc, setDoc, deleteDoc } from "firebase/firestore";
import { db_local } from "@/lib/db";

export default function SyncManager() {
  useEffect(() => {
    // --- 1. LOGIKA TERIMA DATA DARI CLOUD (DOWNLINK) ---
    // Mengambil data dari Firebase dan menyimpannya ke Dexie Lokal
    const setupDownlink = (collectionName: string, localTable: any, keyField: string) => {
      const colRef = collection(db_cloud, collectionName);
      
      return onSnapshot(colRef, (snapshot) => {
        snapshot.docChanges().forEach(async (change) => {
          const firestoreData = change.doc.data();
          
          // Cari apakah data sudah ada di lokal berdasarkan kunci unik (kode/nama)
          const existingLocalData = await localTable
            .where(keyField)
            .equals(firestoreData[keyField])
            .first();

          if (change.type === "added" || change.type === "modified") {
            try {
              // Gunakan .put() agar jika data sudah ada di-update, jika belum ada ditambah
              // Sangat penting: sertakan ID lokal jika ditemukan agar tidak terjadi baris ganda
              await localTable.put({
                ...firestoreData,
                id: existingLocalData?.id, 
              });
            } catch (err) {
              console.error(`Sync Error [Downlink ${collectionName}]:`, err);
            }
          }

          if (change.type === "removed") {
            try {
              if (existingLocalData?.id) {
                await localTable.delete(existingLocalData.id);
              }
            } catch (err) {
              console.error(`Sync Error [Downlink Delete ${collectionName}]:`, err);
            }
          }
        });
      });
    };

    // --- 2. LOGIKA KIRIM DATA KE CLOUD (UPLINK) ---
    // Mengawasi perubahan di Dexie Lokal dan mengirimnya ke Firebase
    const setupUplink = (tableName: string, localTable: any, keyField: string) => {
      // Hook saat data BARU dibuat
      localTable.hook('creating', (primKey: any, obj: any) => {
        const docId = obj[keyField]?.toString().trim();
        if (docId) {
          // Kita gunakan setDoc dengan ID manual agar tidak ganda di Cloud
          setDoc(doc(db_cloud, tableName, docId), {
            ...obj,
            updatedAt: obj.updatedAt || Date.now()
          });
        }
      });

      // Hook saat data DIUPDATE
      localTable.hook('updating', (mods: any, primKey: any, obj: any) => {
        const docId = obj[keyField]?.toString().trim();
        if (docId) {
          // Kirim perubahan terbaru ke cloud
          setDoc(doc(db_cloud, tableName, docId), {
            ...obj,
            ...mods,
            updatedAt: Date.now()
          }, { merge: true });
        }
      });

      // Hook saat data DIHAPUS
      // 'obj' berisi data sebelum dihapus, kita butuh docId dari situ
      localTable.hook('deleting', (primKey: any, obj: any) => {
        if (obj && obj[keyField]) {
          const docId = obj[keyField].toString().trim();
          deleteDoc(doc(db_cloud, tableName, docId));
        }
      });
    };

    // --- 3. EKSEKUSI SINKRONISASI ---
    
    // Aktifkan Downlink (Terima Data)
    const unsubProd = setupDownlink("products", db_local.products, "kode");
    const unsubCat = setupDownlink("categories", db_local.categories, "nama");
    const unsubPub = setupDownlink("publishers", db_local.publishers, "nama");
    const unsubStaff = setupDownlink("staff", db_local.staff, "nama");

    // Aktifkan Uplink (Kirim Data Otomatis)
    setupUplink("products", db_local.products, "kode");
    setupUplink("categories", db_local.categories, "nama");
    setupUplink("publishers", db_local.publishers, "nama");
    setupUplink("staff", db_local.staff, "nama");

    return () => {
      unsubProd();
      unsubCat();
      unsubPub();
      unsubStaff();
      // Hook Dexie bersifat global di instance db_local, 
      // biasanya tidak perlu di-unsub secara manual per render.
    };
  }, []);

  return null;
}