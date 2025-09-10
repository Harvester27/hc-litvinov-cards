// 🔥 Firebase Profile Management - OPRAVENÁ VERZE
// Řeší permission errors a automatické vytváření profilů

import { doc, getDoc, setDoc, updateDoc, serverTimestamp, collection } from 'firebase/firestore';
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
  collectedCards: [],
  totalQuizzesCompleted: 0,
  pendingRewards: 0,
  createdAt: null,
  lastLogin: null
};

// XP potřebné pro každý level
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

export const calculateLevelFromXP = getLevelFromXP;

// ========================================
// PROFIL FUNKCE - OPRAVENÉ
// ========================================

// Vytvořit nový profil při registraci - OPRAVENÁ VERZE
export const createUserProfile = async (uid, email, displayName = null) => {
  try {
    console.log('Creating user profile for:', uid);
    
    // Pokud displayName není poskytnuto, vygenerovat
    if (!displayName) {
      const randomNum = Math.floor(Math.random() * 9999) + 1;
      displayName = `Hráč${randomNum}`;
    }
    
    const profileData = {
      ...DEFAULT_PROFILE,
      displayName,
      email,
      createdAt: serverTimestamp(),
      lastLogin: serverTimestamp()
    };
    
    // Použít správnou cestu k dokumentu
    const profileRef = doc(db, 'users', uid, 'profile', 'data');
    await setDoc(profileRef, profileData);
    
    console.log('Profile created successfully:', profileData);
    return profileData;
  } catch (error) {
    console.error('Error creating user profile:', error);
    
    // Pokud je to permission error, vrátit defaultní profil
    if (error.code === 'permission-denied') {
      console.warn('Permission denied - returning default profile');
      return {
        ...DEFAULT_PROFILE,
        displayName: displayName || `Hráč${Math.floor(Math.random() * 9999) + 1}`,
        email
      };
    }
    
    throw error;
  }
};

// Načíst profil uživatele - OPRAVENÁ VERZE
export const getUserProfile = async (uid) => {
  try {
    console.log('Loading profile for user:', uid);
    
    const profileRef = doc(db, 'users', uid, 'profile', 'data');
    const profileDoc = await getDoc(profileRef);
    
    if (!profileDoc.exists()) {
      console.log('Profile does not exist, creating new one...');
      
      // Získat aktuálního uživatele
      const user = auth.currentUser;
      if (user) {
        // Vytvořit nový profil
        const newProfile = await createUserProfile(
          uid, 
          user.email,
          user.displayName
        );
        return newProfile;
      }
      
      console.warn('No authenticated user, returning null');
      return null;
    }
    
    const profileData = profileDoc.data();
    console.log('Profile loaded successfully:', profileData);
    
    // Přidat chybějící pole pro kompatibilitu
    if (profileData.pendingRewards === undefined) {
      profileData.pendingRewards = 0;
    }
    if (profileData.collectedCards === undefined) {
      profileData.collectedCards = [];
    }
    
    return profileData;
  } catch (error) {
    console.error('Error getting user profile:', error);
    
    // Pokud je to permission error, pokusit se vytvořit profil
    if (error.code === 'permission-denied') {
      console.warn('Permission denied when reading profile');
      
      const user = auth.currentUser;
      if (user) {
        console.log('Attempting to create profile after permission error...');
        
        try {
          // Pokusit se vytvořit profil
          const newProfile = await createUserProfile(
            uid,
            user.email,
            user.displayName
          );
          return newProfile;
        } catch (createError) {
          console.error('Failed to create profile:', createError);
          
          // Vrátit fallback profil
          return {
            ...DEFAULT_PROFILE,
            displayName: user.displayName || `Hráč${Math.floor(Math.random() * 9999) + 1}`,
            email: user.email
          };
        }
      }
    }
    
    throw error;
  }
};

// Aktualizovat profil - OPRAVENÁ VERZE
export const updateUserProfile = async (uid, updates) => {
  try {
    console.log('Updating profile for user:', uid, updates);
    
    const profileRef = doc(db, 'users', uid, 'profile', 'data');
    
    await updateDoc(profileRef, {
      ...updates,
      lastLogin: serverTimestamp()
    });
    
    console.log('Profile updated successfully');
    return true;
  } catch (error) {
    console.error('Error updating user profile:', error);
    
    // Pokud dokument neexistuje, vytvořit ho
    if (error.code === 'not-found' || error.code === 'permission-denied') {
      console.log('Document not found or permission denied, creating new profile...');
      
      try {
        const user = auth.currentUser;
        if (user) {
          await createUserProfile(uid, user.email, updates.displayName);
          // Aplikovat updates znovu
          const profileRef = doc(db, 'users', uid, 'profile', 'data');
          await updateDoc(profileRef, updates);
          return true;
        }
      } catch (createError) {
        console.error('Failed to create and update profile:', createError);
      }
    }
    
    throw error;
  }
};

// ========================================
// AVATAR FUNKCE
// ========================================

export const uploadAvatar = async (uid, file) => {
  try {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      throw new Error('Neplatný formát souboru. Povolené: JPG, PNG, WebP');
    }
    
    if (file.size > 5 * 1024 * 1024) {
      throw new Error('Soubor je příliš velký. Maximum je 5MB');
    }
    
    const timestamp = Date.now();
    const fileName = `avatars/${uid}/${timestamp}_${file.name}`;
    const storageRef = ref(storage, fileName);
    
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    await updateUserProfile(uid, { avatar: downloadURL });
    
    return downloadURL;
  } catch (error) {
    console.error('Error uploading avatar:', error);
    throw error;
  }
};

export const deleteOldAvatar = async (oldAvatarUrl) => {
  if (!oldAvatarUrl) return;
  
  try {
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
  }
};

// ========================================
// HERNÍ FUNKCE
// ========================================

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

export const addXP = async (uid, amount) => {
  try {
    const profile = await getUserProfile(uid);
    const currentXP = profile?.xp || 0;
    const newXP = currentXP + amount;
    
    const newLevel = getLevelFromXP(newXP);
    const oldLevel = profile?.level || 1;
    
    await updateUserProfile(uid, { 
      xp: newXP,
      level: newLevel 
    });
    
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
// SBÍRKA KARET FUNKCE
// ========================================

export const addCardToCollection = async (uid, cardId) => {
  try {
    const profile = await getUserProfile(uid);
    const currentCards = profile?.collectedCards || [];
    
    if (!currentCards.includes(cardId)) {
      const updatedCards = [...currentCards, cardId];
      await updateUserProfile(uid, { collectedCards: updatedCards });
      return updatedCards;
    }
    
    return currentCards;
  } catch (error) {
    console.error('Error adding card to collection:', error);
    throw error;
  }
};

export const getUserCards = async (uid) => {
  try {
    const profile = await getUserProfile(uid);
    return profile?.collectedCards || [];
  } catch (error) {
    console.error('Error getting user cards:', error);
    return [];
  }
};

// ========================================
// ODMĚNY FUNKCE
// ========================================

export const updatePendingRewards = async (uid, delta) => {
  try {
    const profile = await getUserProfile(uid);
    const currentPending = profile?.pendingRewards || 0;
    const newPending = Math.max(0, currentPending + delta);
    
    await updateUserProfile(uid, { pendingRewards: newPending });
    
    return newPending;
  } catch (error) {
    console.error('Error updating pending rewards:', error);
    throw error;
  }
};

export const getPendingRewardsCount = async (uid) => {
  try {
    const profile = await getUserProfile(uid);
    return profile?.pendingRewards || 0;
  } catch (error) {
    console.error('Error getting pending rewards count:', error);
    return 0;
  }
};

// ========================================
// AUTENTIZACE
// ========================================

export const changePassword = async (currentPassword, newPassword) => {
  try {
    const user = auth.currentUser;
    if (!user || !user.email) {
      throw new Error('Uživatel není přihlášen');
    }
    
    const credential = EmailAuthProvider.credential(user.email, currentPassword);
    await reauthenticateWithCredential(user, credential);
    
    await updatePassword(user, newPassword);
    
    return true;
  } catch (error) {
    console.error('Error changing password:', error);
    
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

export const validateDisplayName = (name) => {
  if (!name || name.trim().length < 3) {
    return 'Jméno musí mít alespoň 3 znaky';
  }
  
  if (name.length > 20) {
    return 'Jméno může mít maximálně 20 znaků';
  }
  
  const validPattern = /^[a-zA-Z0-9áčďéěíňóřšťúůýžÁČĎÉĚÍŇÓŘŠŤÚŮÝŽ\s\-_]+$/;
  if (!validPattern.test(name)) {
    return 'Jméno obsahuje nepovolené znaky';
  }
  
  return null;
};