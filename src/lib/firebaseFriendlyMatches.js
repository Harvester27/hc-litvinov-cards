// Firebase funkce pro přátelské zápasy
import { db } from './firebase';
import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc,
  collection,
  addDoc,
  query,
  where,
  orderBy,
  getDocs
} from 'firebase/firestore';

/**
 * Uložit nový přátelský zápas
 * OPRAVENO: Správná struktura Firebase - lichý počet segmentů
 */
export const scheduleFriendlyMatch = async (userId, matchDetails) => {
  try {
    const matchData = {
      opponent: matchDetails.opponent,
      date: matchDetails.date,
      time: matchDetails.time,
      venue: matchDetails.venue,
      invitedBy: matchDetails.invitedBy || 'Unknown',
      status: 'scheduled',
      createdAt: new Date().toISOString(),
      result: null,
      ourScore: null,
      opponentScore: null
    };
    
    // OPRAVENO: Používáme kolekci přímo pod users/userId
    // Struktura: users/{userId}/friendlyMatches/{matchId}
    // To dává 3 segmenty, což je lichý počet
    const matchesRef = collection(db, 'users', userId, 'friendlyMatches');
    const docRef = await addDoc(matchesRef, matchData);
    
    console.log('Friendly match scheduled with ID:', docRef.id);
    
    return {
      id: docRef.id,
      ...matchData
    };
  } catch (error) {
    console.error('Error scheduling friendly match:', error);
    return null;
  }
};

/**
 * Načíst všechny přátelské zápasy
 */
export const loadFriendlyMatches = async (userId) => {
  try {
    // OPRAVENO: Správná cesta ke kolekci
    const matchesRef = collection(db, 'users', userId, 'friendlyMatches');
    const q = query(matchesRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    const matches = [];
    querySnapshot.forEach((doc) => {
      matches.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    console.log(`Loaded ${matches.length} friendly matches`);
    return matches;
  } catch (error) {
    console.error('Error loading friendly matches:', error);
    // Pokud kolekce ještě neexistuje, vrátit prázdné pole
    if (error.code === 'failed-precondition') {
      return [];
    }
    return [];
  }
};

/**
 * Načíst přátelské zápasy pro konkrétní měsíc
 */
export const loadMatchesForMonth = async (userId, year, month) => {
  try {
    const matchesRef = collection(db, 'users', userId, 'friendlyMatches');
    
    // Vytvořit rozsah dat pro měsíc
    const startDate = new Date(year, month, 1).toISOString();
    const endDate = new Date(year, month + 1, 0).toISOString();
    
    const q = query(
      matchesRef,
      where('date', '>=', startDate),
      where('date', '<=', endDate),
      orderBy('date', 'asc')
    );
    
    const querySnapshot = await getDocs(q);
    
    const matches = [];
    querySnapshot.forEach((doc) => {
      matches.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return matches;
  } catch (error) {
    console.error('Error loading matches for month:', error);
    return [];
  }
};

/**
 * Aktualizovat výsledek zápasu
 */
export const updateMatchResult = async (userId, matchId, result) => {
  try {
    const matchRef = doc(db, 'users', userId, 'friendlyMatches', matchId);
    
    await updateDoc(matchRef, {
      status: 'played',
      result: result.won ? 'won' : result.lost ? 'lost' : 'draw',
      ourScore: result.ourScore,
      opponentScore: result.opponentScore,
      playedAt: new Date().toISOString()
    });
    
    console.log('Match result updated:', matchId);
    return true;
  } catch (error) {
    console.error('Error updating match result:', error);
    return false;
  }
};

/**
 * Zrušit přátelský zápas
 */
export const cancelFriendlyMatch = async (userId, matchId) => {
  try {
    const matchRef = doc(db, 'users', userId, 'friendlyMatches', matchId);
    
    await updateDoc(matchRef, {
      status: 'cancelled',
      cancelledAt: new Date().toISOString()
    });
    
    console.log('Match cancelled:', matchId);
    return true;
  } catch (error) {
    console.error('Error cancelling match:', error);
    return false;
  }
};

/**
 * Získat statistiky přátelských zápasů
 */
export const getMatchStatistics = async (userId) => {
  try {
    const matches = await loadFriendlyMatches(userId);
    
    const stats = {
      total: matches.length,
      scheduled: matches.filter(m => m.status === 'scheduled').length,
      played: matches.filter(m => m.status === 'played').length,
      won: matches.filter(m => m.result === 'won').length,
      lost: matches.filter(m => m.result === 'lost').length,
      draw: matches.filter(m => m.result === 'draw').length,
      cancelled: matches.filter(m => m.status === 'cancelled').length,
      totalGoalsScored: 0,
      totalGoalsConceded: 0
    };
    
    // Spočítat góly
    matches.forEach(match => {
      if (match.status === 'played') {
        stats.totalGoalsScored += match.ourScore || 0;
        stats.totalGoalsConceded += match.opponentScore || 0;
      }
    });
    
    return stats;
  } catch (error) {
    console.error('Error getting match statistics:', error);
    return {
      total: 0,
      scheduled: 0,
      played: 0,
      won: 0,
      lost: 0,
      draw: 0,
      cancelled: 0,
      totalGoalsScored: 0,
      totalGoalsConceded: 0
    };
  }
};

/**
 * Kontrola, zda existuje zápas na konkrétní datum
 */
export const hasMatchOnDate = async (userId, date) => {
  try {
    const matchesRef = collection(db, 'users', userId, 'friendlyMatches');
    const q = query(matchesRef, where('date', '==', date));
    const querySnapshot = await getDocs(q);
    
    return !querySnapshot.empty;
  } catch (error) {
    console.error('Error checking match on date:', error);
    return false;
  }
};

/**
 * Získat nejbližší zápas
 */
export const getNextMatch = async (userId) => {
  try {
    const matchesRef = collection(db, 'users', userId, 'friendlyMatches');
    const today = new Date().toISOString();
    
    const q = query(
      matchesRef,
      where('status', '==', 'scheduled'),
      where('createdAt', '>=', today),
      orderBy('createdAt', 'asc')
    );
    
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const firstDoc = querySnapshot.docs[0];
      return {
        id: firstDoc.id,
        ...firstDoc.data()
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error getting next match:', error);
    return null;
  }
};

// Export all functions
export default {
  scheduleFriendlyMatch,
  loadFriendlyMatches,
  loadMatchesForMonth,
  updateMatchResult,
  cancelFriendlyMatch,
  getMatchStatistics,
  hasMatchOnDate,
  getNextMatch
};