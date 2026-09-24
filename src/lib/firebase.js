import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase web configuration is public. All account and game data now live in
// the new project; the previous hc-litvinov project is left untouched.
const firebaseConfig = {
  apiKey: 'AIzaSyD_TNm4d86RaHPe5I9JGx7tWPPrd8jxZFI',
  authDomain: 'lancers-web-cards-2026.firebaseapp.com',
  projectId: 'lancers-web-cards-2026',
  storageBucket: 'lancers-web-cards-2026.firebasestorage.app',
  messagingSenderId: '1044163449026',
  appId: '1:1044163449026:web:fde498f63b76fc74ceeb5b',
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();
