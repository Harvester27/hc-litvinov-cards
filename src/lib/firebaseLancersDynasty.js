// Firebase funkce pro Lancers Dynasty
import { db } from './firebase';
import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc,
  arrayUnion,
  increment
} from 'firebase/firestore';

// Načíst hráčovu sbírku
export const loadPlayerCollection = async (userId) => {
  try {
    const docRef = doc(db, 'users', userId, 'lancersDynasty', 'data');
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      // První přístup - vytvořit prázdnou sbírku
      const initialData = {
        collection: [],
        packsOpened: 0,
        totalCardsCollected: 0,
        lastUpdated: new Date().toISOString()
      };
      
      await setDoc(docRef, initialData);
      return initialData;
    }
  } catch (error) {
    console.error('Error loading collection:', error);
    return { collection: [], packsOpened: 0, totalCardsCollected: 0 };
  }
};

// Uložit celou sbírku (např. po přidání karet)
export const savePlayerCollection = async (userId, collection) => {
  try {
    const docRef = doc(db, 'users', userId, 'lancersDynasty', 'data');
    
    await updateDoc(docRef, {
      collection: collection,
      totalCardsCollected: collection.length,
      lastUpdated: new Date().toISOString()
    });
    
    console.log('Collection saved successfully');
    return true;
  } catch (error) {
    console.error('Error saving collection:', error);
    return false;
  }
};

// Přidat karty do sbírky
export const addCardsToCollection = async (userId, newCards) => {
  try {
    const docRef = doc(db, 'users', userId, 'lancersDynasty', 'data');
    
    // Nejdřív načti současnou sbírku
    const docSnap = await getDoc(docRef);
    const currentData = docSnap.exists() ? docSnap.data() : { collection: [] };
    
    // Přidej nové karty
    const updatedCollection = [...currentData.collection, ...newCards];
    
    await updateDoc(docRef, {
      collection: updatedCollection,
      packsOpened: increment(1),
      totalCardsCollected: updatedCollection.length,
      lastUpdated: new Date().toISOString()
    });
    
    console.log('Cards added to collection');
    return true;
  } catch (error) {
    console.error('Error adding cards:', error);
    return false;
  }
};

// Vylepšit kartu
export const upgradeCardInCollection = async (userId, cardIndex, attributeKey, newLevel) => {
  try {
    const docRef = doc(db, 'users', userId, 'lancersDynasty', 'data');
    
    // Načti současnou sbírku
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) return false;
    
    const currentData = docSnap.data();
    const collection = [...currentData.collection];
    
    // Aktualizuj konkrétní kartu
    if (collection[cardIndex]) {
      collection[cardIndex] = {
        ...collection[cardIndex],
        attributes: {
          ...collection[cardIndex].attributes,
          [attributeKey]: newLevel
        }
      };
      
      // Ulož zpět
      await updateDoc(docRef, {
        collection: collection,
        lastUpdated: new Date().toISOString()
      });
      
      console.log('Card upgraded successfully');
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error upgrading card:', error);
    return false;
  }
};

// Aktualizovat kredity v profilu
export const updatePlayerCredits = async (userId, newCredits) => {
  try {
    const profileRef = doc(db, 'users', userId, 'profile', 'data');
    
    await updateDoc(profileRef, {
      credits: newCredits,
      lastUpdated: new Date().toISOString()
    });
    
    console.log('Credits updated:', newCredits);
    return true;
  } catch (error) {
    console.error('Error updating credits:', error);
    return false;
  }
};