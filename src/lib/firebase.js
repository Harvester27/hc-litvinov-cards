import { getApp, getApps, initializeApp } from 'firebase/app';
import { connectAuthEmulator, getAuth, GoogleAuthProvider } from 'firebase/auth';
import { connectFirestoreEmulator, getFirestore } from 'firebase/firestore';
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

const useEmulators = process.env.NEXT_PUBLIC_FIREBASE_EMULATORS === 'true';
if (useEmulators && process.env.NODE_ENV === 'production') {
  throw new Error('Produkční sestavení nesmí používat Firebase emulátory.');
}
if (useEmulators && typeof window !== 'undefined'
  && !['localhost', '127.0.0.1'].includes(window.location.hostname)) {
  throw new Error('Firebase emulátory lze použít pouze lokálně.');
}
const app = getApps().length ? getApp() : initializeApp(useEmulators
  ? { ...firebaseConfig, projectId: 'demo-lancers-tipovacka', apiKey: 'demo-key' }
  : firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
if (useEmulators && !globalThis.__lancersEmulatorsConnected) {
  connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true });
  connectFirestoreEmulator(db, '127.0.0.1', 8080);
  globalThis.__lancersEmulatorsConnected = true;
}
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();
