// Firebase funkce pro Lancers Dynasty Marketplace
import { db } from './firebase';
import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp
} from 'firebase/firestore';
import { savePlayerCollection } from './firebaseLancersDynasty';
import { updatePlayerCredits } from './firebaseLancersDynasty';

// Načíst všechny aktivní nabídky v marketplace
export const getMarketplaceListings = async () => {
  try {
    const listingsRef = collection(db, 'lancersDynastyMarketplace');
    const q = query(
      listingsRef,
      where('status', '==', 'active'),
      orderBy('createdAt', 'desc')
    );

    const querySnapshot = await getDocs(q);
    const listings = [];

    querySnapshot.forEach((doc) => {
      listings.push({
        listingId: doc.id,
        ...doc.data()
      });
    });

    console.log('Loaded marketplace listings:', listings.length);
    return listings;
  } catch (error) {
    console.error('Error loading marketplace listings:', error);
    return [];
  }
};

// Načíst nabídky konkrétního prodejce
export const getSellerListings = async (userId) => {
  try {
    const listingsRef = collection(db, 'lancersDynastyMarketplace');
    const q = query(
      listingsRef,
      where('sellerId', '==', userId),
      where('status', '==', 'active'),
      orderBy('createdAt', 'desc')
    );

    const querySnapshot = await getDocs(q);
    const listings = [];

    querySnapshot.forEach((doc) => {
      listings.push({
        listingId: doc.id,
        ...doc.data()
      });
    });

    console.log('Loaded seller listings:', listings.length);
    return listings;
  } catch (error) {
    console.error('Error loading seller listings:', error);
    return [];
  }
};

// Vytvořit novou nabídku (prodat kartu)
export const createListing = async (userId, userDisplayName, card, price, currentCollection) => {
  try {
    // Najít a odstranit kartu ze sbírky
    const cardIndex = currentCollection.findIndex(c => c.uniqueId === card.uniqueId);
    if (cardIndex === -1) {
      throw new Error('Karta nebyla nalezena ve sbírce');
    }

    // Vytvořit novou nabídku
    const listingId = `${userId}-${card.uniqueId}-${Date.now()}`;
    const listingRef = doc(db, 'lancersDynastyMarketplace', listingId);

    const listingData = {
      sellerId: userId,
      sellerName: userDisplayName || 'Neznámý hráč',
      card: card,
      price: price,
      status: 'active',
      createdAt: serverTimestamp()
    };

    await setDoc(listingRef, listingData);

    // Odstranit kartu ze sbírky prodejce
    const updatedCollection = currentCollection.filter(c => c.uniqueId !== card.uniqueId);
    await savePlayerCollection(userId, updatedCollection);

    console.log('Listing created successfully:', listingId);
    return { success: true, listingId, updatedCollection };
  } catch (error) {
    console.error('Error creating listing:', error);
    return { success: false, error: error.message };
  }
};

// Koupit kartu z marketplace
export const buyListing = async (buyerId, buyerDisplayName, buyerCredits, listingId, buyerCollection) => {
  try {
    // Načíst nabídku
    const listingRef = doc(db, 'lancersDynastyMarketplace', listingId);
    const listingSnap = await getDoc(listingRef);

    if (!listingSnap.exists()) {
      throw new Error('Nabídka neexistuje');
    }

    const listing = listingSnap.data();

    // Zkontrolovat, zda nabídka je stále aktivní
    if (listing.status !== 'active') {
      throw new Error('Nabídka již není aktivní');
    }

    // Zkontrolovat, zda kupující není prodávající
    if (listing.sellerId === buyerId) {
      throw new Error('Nemůžeš koupit vlastní kartu');
    }

    // Zkontrolovat kredity
    if (buyerCredits < listing.price) {
      throw new Error('Nedostatek kreditů');
    }

    // Přidat kartu kupujícímu do sbírky
    const updatedBuyerCollection = [...buyerCollection, listing.card];
    await savePlayerCollection(buyerId, updatedBuyerCollection);

    // Odečíst kredity kupujícímu
    const newBuyerCredits = buyerCredits - listing.price;
    await updatePlayerCredits(buyerId, newBuyerCredits);

    // Načíst profil prodávajícího a přidat mu kredity
    const sellerProfileRef = doc(db, 'users', listing.sellerId, 'profile', 'data');
    const sellerProfileSnap = await getDoc(sellerProfileRef);

    if (sellerProfileSnap.exists()) {
      const sellerProfile = sellerProfileSnap.data();
      const newSellerCredits = (sellerProfile.credits || 0) + listing.price;
      await updateDoc(sellerProfileRef, {
        credits: newSellerCredits
      });
    }

    // Označit nabídku jako prodanou
    await updateDoc(listingRef, {
      status: 'sold',
      buyerId: buyerId,
      buyerName: buyerDisplayName || 'Neznámý hráč',
      soldAt: serverTimestamp()
    });

    console.log('Card purchased successfully');
    return {
      success: true,
      updatedCollection: updatedBuyerCollection,
      newCredits: newBuyerCredits
    };
  } catch (error) {
    console.error('Error buying card:', error);
    return { success: false, error: error.message };
  }
};

// Zrušit nabídku (vrátit kartu do sbírky)
export const cancelListing = async (userId, listingId, currentCollection) => {
  try {
    // Načíst nabídku
    const listingRef = doc(db, 'lancersDynastyMarketplace', listingId);
    const listingSnap = await getDoc(listingRef);

    if (!listingSnap.exists()) {
      throw new Error('Nabídka neexistuje');
    }

    const listing = listingSnap.data();

    // Zkontrolovat, zda uživatel je prodávající
    if (listing.sellerId !== userId) {
      throw new Error('Nejsi majitelem této nabídky');
    }

    // Zkontrolovat, zda nabídka je stále aktivní
    if (listing.status !== 'active') {
      throw new Error('Nabídka již není aktivní');
    }

    // Vrátit kartu do sbírky
    const updatedCollection = [...currentCollection, listing.card];
    await savePlayerCollection(userId, updatedCollection);

    // Označit nabídku jako zrušenou
    await updateDoc(listingRef, {
      status: 'cancelled',
      cancelledAt: serverTimestamp()
    });

    console.log('Listing cancelled successfully');
    return { success: true, updatedCollection };
  } catch (error) {
    console.error('Error cancelling listing:', error);
    return { success: false, error: error.message };
  }
};
