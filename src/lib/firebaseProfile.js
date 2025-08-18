// 🔥 Firebase Profile Management
// Tento soubor obsahuje všechny funkce pro práci s uživatelským profilem

import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { getStorage } from 'firebase/storage';
import { updatePassword, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import { db, auth } from './firebase';

// Inicializace Firebase Storage
const storage = getStorage();

// ========================================
// KONSTANTY A DEFAULTNÍ HODNOTY
// ========================================

const DEFAULT_PROFILE = {
  displayName: null,
  avatar: null,
  level: 1,
  xp: 0,
  credits: 12000,
  createdAt: null,
  lastLogin: null
};

// XP potřebné pro každý level (progresivní systém +20 každý level)
export const getXPForLevel = (level) => {
  if (level <= 1) return 0;
  let totalXP = 0;
  let increment = 100;
  
  for (let i = 2; i <= level; i++) {
    totalXP += increment;
    increment += 20;
  }
  
  return totalXP;
};

// Vypočítat level z XP
export const getLevelFromXP = (xp) => {
  let level = 1;
  let totalXP = 0;
  let increment = 100;
  
  while (totalXP + increment <= xp) {
    totalXP += increment;
    increment += 20;
    level++;
  }
  
  return level;
};

// ========================================
// PROFIL FUNKCE
// ========================================

// Vytvořit nový profil při registraci
export const createUserProfile = async (uid, email) => {
  try {
    // Vygenerovat random číslo pro defaultní jméno
    const randomNum = Math.floor(Math.random() * 9999) + 1;
    const displayName = `Hráč${randomNum}`;
    
    const profileData = {
      ...DEFAULT_PROFILE,
      displayName,
      email,
      createdAt: serverTimestamp(),
      lastLogin: serverTimestamp()
    };
    
    await setDoc(doc(db, 'users', uid, 'profile', 'data'), profileData);
    
    return profileData;
  } catch (error) {
    console.error('Error creating user profile:', error);
    throw error;
  }
};

// Načíst profil uživatele
export const getUserProfile = async (uid) => {
  try {
    const profileDoc = await getDoc(doc(db, 'users', uid, 'profile', 'data'));
    
    if (!profileDoc.exists()) {
      // Pokud profil neexistuje, vytvoř ho
      const user = auth.currentUser;
      if (user) {
        return await createUserProfile(uid, user.email);
      }
      return null;
    }
    
    return profileDoc.data();
  } catch (error) {
    console.error('Error getting user profile:', error);
    throw error;
  }
};

// Aktualizovat profil
export const updateUserProfile = async (uid, updates) => {
  try {
    await updateDoc(doc(db, 'users', uid, 'profile', 'data'), {
      ...updates,
      lastLogin: serverTimestamp()
    });
    
    return true;
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

// ========================================
// AVATAR FUNKCE
// ========================================

// Upload avataru
export const uploadAvatar = async (uid, file) => {
  try {
    // Validace souboru
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      throw new Error('Neplatný formát souboru. Povolené: JPG, PNG, WebP');
    }
    
    // Max 5MB
    if (file.size > 5 * 1024 * 1024) {
      throw new Error('Soubor je příliš velký. Maximum je 5MB');
    }
    
    // Vytvořit referenci s unikátním názvem
    const timestamp = Date.now();
    const fileName = `avatars/${uid}/${timestamp}_${file.name}`;
    const storageRef = ref(storage, fileName);
    
    // Nahrát soubor
    const snapshot = await uploadBytes(storageRef, file);
    
    // Získat URL
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    // Aktualizovat profil s novou URL
    await updateUserProfile(uid, { avatar: downloadURL });
    
    return downloadURL;
  } catch (error) {
    console.error('Error uploading avatar:', error);
    throw error;
  }
};

// Smazat starý avatar
export const deleteOldAvatar = async (oldAvatarUrl) => {
  if (!oldAvatarUrl) return;
  
  try {
    // Extrahovat cestu ze Storage URL
    const baseUrl = 'https://firebasestorage.googleapis.com/v0/b/';
    if (oldAvatarUrl.includes(baseUrl)) {
      const pathStart = oldAvatarUrl.indexOf('/o/') + 3;
      const pathEnd = oldAvatarUrl.indexOf('?');
      const path = decodeURIComponent(oldAvatarUrl.substring(pathStart, pathEnd));
      
      const oldRef = ref(storage, path);
      await deleteObject(oldRef);
    }
  } catch (error) {
    console.error('Error deleting old avatar:', error);
    // Nevyhazovat chybu, jen logovat
  }
};

// ========================================
// HERNÍ FUNKCE
// ========================================

// Přidat kredity
export const addCredits = async (uid, amount) => {
  try {
    const profile = await getUserProfile(uid);
    const newCredits = (profile?.credits || 0) + amount;
    
    await updateUserProfile(uid, { credits: newCredits });
    
    return newCredits;
  } catch (error) {
    console.error('Error adding credits:', error);
    throw error;
  }
};

// Odebrat kredity (např. při nákupu)
export const spendCredits = async (uid, amount) => {
  try {
    const profile = await getUserProfile(uid);
    const currentCredits = profile?.credits || 0;
    
    if (currentCredits < amount) {
      throw new Error('Nedostatek kreditů');
    }
    
    const newCredits = currentCredits - amount;
    await updateUserProfile(uid, { credits: newCredits });
    
    return newCredits;
  } catch (error) {
    console.error('Error spending credits:', error);
    throw error;
  }
};

// Přidat XP
export const addXP = async (uid, amount) => {
  try {
    const profile = await getUserProfile(uid);
    const currentXP = profile?.xp || 0;
    const newXP = currentXP + amount;
    
    // Vypočítat nový level
    const newLevel = getLevelFromXP(newXP);
    const oldLevel = profile?.level || 1;
    
    await updateUserProfile(uid, { 
      xp: newXP,
      level: newLevel 
    });
    
    // Vrátit info o level up
    return {
      xp: newXP,
      level: newLevel,
      leveledUp: newLevel > oldLevel
    };
  } catch (error) {
    console.error('Error adding XP:', error);
    throw error;
  }
};

// ========================================
// AUTENTIZACE
// ========================================

// Změnit heslo
export const changePassword = async (currentPassword, newPassword) => {
  try {
    const user = auth.currentUser;
    if (!user || !user.email) {
      throw new Error('Uživatel není přihlášen');
    }
    
    // Re-autentizace s aktuálním heslem
    const credential = EmailAuthProvider.credential(user.email, currentPassword);
    await reauthenticateWithCredential(user, credential);
    
    // Změnit heslo
    await updatePassword(user, newPassword);
    
    return true;
  } catch (error) {
    console.error('Error changing password:', error);
    
    // Lepší error messages
    if (error.code === 'auth/wrong-password') {
      throw new Error('Nesprávné aktuální heslo');
    } else if (error.code === 'auth/weak-password') {
      throw new Error('Nové heslo je příliš slabé');
    }
    
    throw error;
  }
};

// ========================================
// VALIDACE
// ========================================

// Validovat display name
export const validateDisplayName = (name) => {
  if (!name || name.trim().length < 3) {
    return 'Jméno musí mít alespoň 3 znaky';
  }
  
  if (name.length > 20) {
    return 'Jméno může mít maximálně 20 znaků';
  }
  
  // Povolené znaky: písmena, čísla, mezery, pomlčky, podtržítka
  const validPattern = /^[a-zA-Z0-9čďěňřšťžýáéíóúůĎŇŤČŘŠŽÝÁÉÍÓÚŮ\s\-_]+$/;
  if (!validPattern.test(name)) {
    return 'Jméno obsahuje nepovolené znaky';
  }
  
  return null; // Validní
};