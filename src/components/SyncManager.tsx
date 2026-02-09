"use client";

import { useEffect } from "react";
import { db_cloud } from "@/lib/firebase";
import { collection, onSnapshot, doc, setDoc, deleteDoc, query, where, getDocs } from "firebase/firestore";
import { db_local } from "@/lib/db";

export default function SyncManager() {
  useEffect(() => {
    // --- 1. LOGIKA TERIMA DATA DARI CLOUD (DOWNLINK) ---
    const setupDownlink = (collectionName: string, localTable: any, keyField: string) => {
      const colRef = collection(db_cloud, collectionName);
      return onSnapshot(colRef, (snapshot) => {
        snapshot.docChanges().forEach(async (change) => {
          const firestoreData = change.doc.data();
          const existingLocalData = await localTable.where(keyField).equals(firestoreData[keyField]).first();

          if (change.type === "added" || change.type === "modified") {
            await localTable.put({ ...firestoreData, id: existingLocalData?.id });
          }
          if (change.type === "removed" && existingLocalData?.id) {
            await localTable.delete(existingLocalData.id);
          }
        });
      });
    };

    // --- 2. LOGIKA KIRIM DATA KE CLOUD (UPLINK) ---
    // Hook ini akan terpanggil OTOMATIS setiap kali kamu db_local.table.add()
    const setupUplink = (tableName: string, localTable: any, keyField: string) => {
      // Hook saat data dibuat/ditambah
      localTable.hook('creating', (primKey: any, obj: any) => {
        const docId = obj[keyField].toString(); // Misal: nama kategori jadi ID dokumen
        setDoc(doc(db_cloud, tableName, docId), obj);
      });

      // Hook saat data dihapus
      localTable.hook('deleting', async (primKey: any) => {
        const item = await localTable.get(primKey);
        if (item) {
          const docId = item[keyField].toString();
          deleteDoc(doc(db_cloud, tableName, docId));
        }
      });
    };

    // Jalankan Downlink (Terima)
    const unsubDownProd = setupDownlink("products", db_local.products, "kode");
    const unsubDownCat = setupDownlink("categories", db_local.categories, "nama");
    const unsubDownPub = setupDownlink("publishers", db_local.publishers, "nama");

    // Jalankan Uplink (Kirim Otomatis)
    setupUplink("products", db_local.products, "kode");
    setupUplink("categories", db_local.categories, "nama");
    setupUplink("publishers", db_local.publishers, "nama");

    return () => {
      unsubDownProd(); unsubDownCat(); unsubDownPub();
      // Dexie hooks biasanya menetap selama aplikasi jalan
    };
  }, []);

  return null;
}