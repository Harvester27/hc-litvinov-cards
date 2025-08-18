import { initializeApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCO6XhPvjWZMfPIfMIB3-v_szBTwpk6WfE",
  authDomain: "hc-litvinov.firebaseapp.com",
  projectId: "hc-litvinov",
  storageBucket: "hc-litvinov.firebasestorage.app",
  messagingSenderId: "1009236163103",
  appId: "1:1009236163103:web:9faa49bad1e1153598332a",
  measurementId: "G-15WQB9LCRM"
};

// Inicializace jen pokud ještě neexistuje
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();

// Analytics jen na klientovi
export const initAnalytics = async () => {
  if (typeof window !== 'undefined' && await isSupported()) {
    return getAnalytics(app);
  }
  return null;
};