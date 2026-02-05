import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB6sstyerpeNiua2yndgJyRygxGEWcgVjU",
  authDomain: "inventorytokomekkah.firebaseapp.com",
  databaseURL: "https://inventorytokomekkah-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "inventorytokomekkah",
  storageBucket: "inventorytokomekkah.firebasestorage.app",
  messagingSenderId: "228675128689",
  appId: "1:228675128689:web:8ef62b55a00d91c335fad0"
};

// Singleton pattern agar tidak inisialisasi ulang saat hot-reload
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db_cloud = getFirestore(app);