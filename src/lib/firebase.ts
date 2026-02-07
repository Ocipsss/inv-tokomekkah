import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB6sstyerpeNiua2yndgJyRygxGEWcgVjU",
  authDomain: "inventorytokomekkah.firebaseapp.com",
  databaseURL: "https://inventorytokomekkah-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "inventorytokomekkah",
  storageBucket: "inventorytokomekkah.firebasestorage.app",
  messagingSenderId: "228675128689",
  appId: "1:228675128689:web:8ef62b55a00d91c335fad0"
};

const app_cloud = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

export const db_cloud = getFirestore(app_cloud);
export const auth_cloud = getAuth(app_cloud);

// TAMBAHKAN BARIS INI sebagai alias agar file login lama tidak error
export const auth = auth_cloud; 

export { app_cloud };