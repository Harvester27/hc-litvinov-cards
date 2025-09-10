import { db } from './firebase';
import { doc, setDoc, serverTimestamp, getDoc, collection, getDocs } from 'firebase/firestore';

// Hlavní funkce pro synchronizaci dat do žebříčku
export const syncToLeaderboard = async (userId, profileData = null) => {
  try {
    console.log('🔄 Starting leaderboard sync for user:', userId);
    
    // Pokud nemáme profileData, načteme je
    if (!profileData) {
      const profileRef = doc(db, 'users', userId, 'profile', 'data');
      const profileSnap = await getDoc(profileRef);
      
      if (!profileSnap.exists()) {
        console.error('❌ No profile data found for user:', userId);
        return;
      }
      
      profileData = profileSnap.data();
    }
    
    // Načíst počet karet (pokud není v profileData)
    let totalCards = profileData.totalCards;
    if (totalCards === undefined) {
      const cardsRef = collection(db, 'users', userId, 'cardCollection');
      const cardsSnap = await getDocs(cardsRef);
      totalCards = cardsSnap.size;
    }
    
    // Načíst počet kvízů (pokud není v profileData)
    let totalQuizzes = profileData.totalQuizzes;
    if (totalQuizzes === undefined) {
      const quizzesRef = collection(db, 'users', userId, 'completedQuizzes');
      const quizzesSnap = await getDocs(quizzesRef);
      totalQuizzes = quizzesSnap.size;
    }
    
    // Připravit data pro leaderboard
    const leaderboardData = {
      displayName: profileData.displayName || 'Anonymní hráč',
      avatarUrl: profileData.avatarUrl || null,
      level: profileData.level || 1,
      xp: profileData.xp || 0,
      credits: profileData.credits || 0,
      totalCards: totalCards,
      totalQuizzes: totalQuizzes,
      // Vypočítat celkové skóre
      totalScore: (profileData.credits || 0) + 
                  (totalCards * 1000) + 
                  (totalQuizzes * 500),
      lastUpdated: serverTimestamp()
    };
    
    // Uložit do veřejné kolekce leaderboard
    const leaderboardRef = doc(db, 'leaderboard', userId);
    await setDoc(leaderboardRef, leaderboardData, { merge: true });
    
    console.log('✅ Leaderboard synchronized successfully for user:', userId);
    console.log('📊 Stats:', {
      credits: leaderboardData.credits,
      cards: totalCards,
      quizzes: totalQuizzes,
      totalScore: leaderboardData.totalScore
    });
    
    return leaderboardData;
  } catch (error) {
    console.error('❌ Error syncing to leaderboard:', error);
    throw error;
  }
};

// Pomocná funkce pro rychlou aktualizaci při změně profilu
export const quickSyncProfile = async (userId, updates) => {
  try {
    const leaderboardRef = doc(db, 'leaderboard', userId);
    await setDoc(leaderboardRef, {
      ...updates,
      lastUpdated: serverTimestamp()
    }, { merge: true });
    
    console.log('⚡ Quick sync completed for:', Object.keys(updates));
  } catch (error) {
    console.error('❌ Error in quick sync:', error);
  }
};