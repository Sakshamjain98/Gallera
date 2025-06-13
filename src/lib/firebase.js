// lib/firebase.ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDf_HJzwqQ4lqwIHYgBTTCdoVHHOhb0_eU",
  authDomain: "oknotes-91949.firebaseapp.com",
  projectId: "oknotes-91949",
  storageBucket: "oknotes-91949.firebasestorage.app",
  messagingSenderId: "999938457532",
  appId: "1:999938457532:web:d856ccafbfb1fc10e4f5b9"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
