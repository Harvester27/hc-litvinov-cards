// 🔄 RESET UŽIVATELSKÉHO ÚČTU PRO TESTOVÁNÍ
// Tento skript kompletně resetuje účet na výchozí hodnoty

import { 
  doc, 
  deleteDoc, 
  setDoc, 
  collection, 
  getDocs, 
  query, 
  where,
  serverTimestamp 
} from 'firebase/firestore';
import { 
  deleteUser,
  signOut,
  createUserWithEmailAndPassword,
  sendEmailVerification
} from 'firebase/auth';
import { db, auth } from './firebase';

// ========================================
// RESET FUNKCÍ
// ========================================

/**
 * Kompletní reset účtu - smaže všechna data a umožní novou registraci
 * @param {string} email - Email účtu k resetu
 * @param {string} password - Heslo pro ověření vlastnictví
 */
export const completeAccountReset = async (email, password) => {
  try {
    console.log('🔄 Začínám reset účtu:', email);
    
    // 1. Přihlásit se k účtu (ověření vlastnictví)
    const { signInWithEmailAndPassword } = await import('firebase/auth');
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    const uid = user.uid;
    
    console.log('✅ Přihlášení úspěšné, UID:', uid);
    
    // 2. Smazat všechna data z Firestore
    await deleteAllUserData(uid);
    
    // 3. Odhlásit uživatele
    await signOut(auth);
    console.log('✅ Uživatel odhlášen');
    
    // 4. Smazat účet z Authentication
    await deleteUser(user);
    console.log('✅ Účet smazán z Authentication');
    
    return {
      success: true,
      message: 'Účet byl kompletně resetován. Nyní se můžete znovu zaregistrovat.'
    };
    
  } catch (error) {
    console.error('❌ Chyba při resetu účtu:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Soft reset - zachová účet ale resetuje všechna data
 * @param {string} uid - User ID
 */
export const softResetAccount = async (uid) => {
  try {
    console.log('🔄 Soft reset pro UID:', uid);
    
    // Smazat stará data
    await deleteAllUserData(uid);
    
    // Vytvořit nový profil s výchozími hodnotami
    const defaultProfile = {
      displayName: `Hráč${Math.floor(Math.random() * 9999)}`,
      avatar: null,
      level: 1,
      xp: 0,
      credits: 12000,
      collectedCards: [],
      totalQuizzesCompleted: 0,
      pendingRewards: 0,
      createdAt: serverTimestamp(),
      lastLogin: serverTimestamp()
    };
    
    await setDoc(doc(db, 'users', uid, 'profile', 'data'), defaultProfile);
    
    console.log('✅ Data resetována na výchozí hodnoty');
    
    return {
      success: true,
      profile: defaultProfile
    };
    
  } catch (error) {
    console.error('❌ Chyba při soft resetu:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Smazat všechna data uživatele z Firestore
 * @param {string} uid - User ID
 */
const deleteAllUserData = async (uid) => {
  console.log('🗑️ Mažu data pro UID:', uid);
  
  try {
    // Smazat profil
    const profileRef = doc(db, 'users', uid, 'profile', 'data');
    await deleteDoc(profileRef);
    console.log('✅ Profil smazán');
    
    // Smazat dokončené kvízy
    const quizzesRef = collection(db, 'users', uid, 'completedQuizzes');
    const quizzesSnapshot = await getDocs(quizzesRef);
    for (const doc of quizzesSnapshot.docs) {
      await deleteDoc(doc.ref);
    }
    console.log(`✅ Smazáno ${quizzesSnapshot.size} kvízů`);
    
    // Smazat karty
    const cardsRef = collection(db, 'users', uid, 'cards');
    const cardsSnapshot = await getDocs(cardsRef);
    for (const doc of cardsSnapshot.docs) {
      await deleteDoc(doc.ref);
    }
    console.log(`✅ Smazáno ${cardsSnapshot.size} karet`);
    
    // Smazat úspěchy
    const achievementsRef = collection(db, 'users', uid, 'achievements');
    const achievementsSnapshot = await getDocs(achievementsRef);
    for (const doc of achievementsSnapshot.docs) {
      await deleteDoc(doc.ref);
    }
    console.log(`✅ Smazáno ${achievementsSnapshot.size} úspěchů`);
    
    // Smazat hlavní dokument uživatele (pokud existuje)
    const userDocRef = doc(db, 'users', uid);
    await deleteDoc(userDocRef);
    console.log('✅ Hlavní dokument uživatele smazán');
    
  } catch (error) {
    console.error('⚠️ Chyba při mazání dat:', error);
    // Pokračovat i když některé dokumenty neexistují
  }
};

// ========================================
// POMOCNÉ FUNKCE PRO TESTOVÁNÍ
// ========================================

/**
 * Získat informace o účtu
 * @param {string} email - Email účtu
 */
export const getAccountInfo = async (email) => {
  try {
    const user = auth.currentUser;
    
    if (!user || user.email !== email) {
      return {
        exists: false,
        message: 'Uživatel není přihlášen nebo email nesouhlasí'
      };
    }
    
    const uid = user.uid;
    const profileRef = doc(db, 'users', uid, 'profile', 'data');
    const profileDoc = await getDoc(profileRef);
    
    if (!profileDoc.exists()) {
      return {
        exists: true,
        uid: uid,
        email: email,
        profile: null,
        message: 'Účet existuje ale nemá profil'
      };
    }
    
    return {
      exists: true,
      uid: uid,
      email: email,
      profile: profileDoc.data(),
      emailVerified: user.emailVerified
    };
    
  } catch (error) {
    console.error('Chyba při získávání informací:', error);
    return {
      exists: false,
      error: error.message
    };
  }
};

/**
 * Admin reset - pouze pro vývojáře (vyžaduje admin SDK)
 * POZNÁMKA: Toto funguje pouze na backendu s admin SDK
 */
export const adminResetAccount = async (email) => {
  console.warn('⚠️ Admin reset vyžaduje backend s Firebase Admin SDK');
  console.warn('Pro testování použijte completeAccountReset() nebo softResetAccount()');
  
  return {
    success: false,
    message: 'Admin reset není dostupný z frontendu. Použijte completeAccountReset().'
  };
};