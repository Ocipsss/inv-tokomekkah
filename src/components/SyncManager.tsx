"use client";

import { useEffect } from "react";
import { db_cloud } from "@/lib/firebase";
import { collection, onSnapshot, doc, setDoc, deleteDoc } from "firebase/firestore";
import { db_local } from "@/lib/db";

// Flag global untuk mencegah "Loopback" (Cloud -> Lokal -> Cloud lagi)
let isIncomingSync = false;

export default function SyncManager() {
  useEffect(() => {
    // --- 1. LOGIKA TERIMA DATA DARI CLOUD (DOWNLINK) ---
    const setupDownlink = (collectionName: string, localTable: any, keyField: string) => {
      const colRef = collection(db_cloud, collectionName);
      
      return onSnapshot(colRef, (snapshot) => {
        // Jika perubahan berasal dari pengiriman lokal yang sedang berlangsung, abaikan
        if (snapshot.metadata.hasPendingWrites) return;

        snapshot.docChanges().forEach(async (change) => {
          const firestoreData = change.doc.data();
          
          const existingLocalData = await localTable
            .where(keyField)
            .equals(firestoreData[keyField])
            .first();

          if (change.type === "added" || change.type === "modified") {
            try {
              // NYALAKAN PROTEKSI: Beritahu Hook Uplink agar diam sebentar
              isIncomingSync = true; 
              
              await localTable.put({
                ...firestoreData,
                id: existingLocalData?.id, 
              });

              // Matikan proteksi setelah operasi database selesai
              setTimeout(() => { isIncomingSync = false; }, 200);
            } catch (err) {
              isIncomingSync = false;
              console.error(`Sync Error [Downlink ${collectionName}]:`, err);
            }
          }

          if (change.type === "removed" && existingLocalData?.id) {
            try {
              isIncomingSync = true;
              await localTable.delete(existingLocalData.id);
              setTimeout(() => { isIncomingSync = false; }, 200);
            } catch (err) {
              isIncomingSync = false;
              console.error(`Sync Error [Delete ${collectionName}]:`, err);
            }
          }
        });
      });
    };

    // --- 2. LOGIKA KIRIM DATA KE CLOUD (UPLINK) ---
    const setupUplink = (tableName: string, localTable: any, keyField: string) => {
      localTable.hook('creating', (primKey: any, obj: any) => {
        if (isIncomingSync) return; // CEGAH LOOP: Jangan kirim jika data datang dari cloud
        
        const docId = obj[keyField]?.toString().trim();
        if (docId) {
          setDoc(doc(db_cloud, tableName, docId), {
            ...obj,
            updatedAt: obj.updatedAt || Date.now()
          });
        }
      });

      localTable.hook('updating', (mods: any, primKey: any, obj: any) => {
        if (isIncomingSync) return; // CEGAH LOOP
        
        const docId = obj[keyField]?.toString().trim();
        if (docId) {
          setDoc(doc(db_cloud, tableName, docId), {
            ...obj,
            ...mods,
            updatedAt: Date.now()
          }, { merge: true });
        }
      });

      localTable.hook('deleting', (primKey: any, obj: any) => {
        if (isIncomingSync) return; // CEGAH LOOP
        
        if (obj && obj[keyField]) {
          const docId = obj[keyField].toString().trim();
          deleteDoc(doc(db_cloud, tableName, docId));
        }
      });
    };

    // --- 3. EKSEKUSI SINKRONISASI ---
    const unsubProd = setupDownlink("products", db_local.products, "kode");
    const unsubCat = setupDownlink("categories", db_local.categories, "nama");
    const unsubPub = setupDownlink("publishers", db_local.publishers, "nama");
    const unsubStaff = setupDownlink("staff", db_local.staff, "nama");

    setupUplink("products", db_local.products, "kode");
    setupUplink("categories", db_local.categories, "nama");
    setupUplink("publishers", db_local.publishers, "nama");
    setupUplink("staff", db_local.staff, "nama");

    return () => {
      unsubProd(); unsubCat(); unsubPub(); unsubStaff();
    };
  }, []);

  return null;
}