import { db } from './firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

// Funkce pro synchronizaci dat do žebříčku
// Volejte tuto funkci po každé změně profilu, dokončení kvízu nebo získání karty
export const syncToLeaderboard = async (userId, profileData) => {
  try {
    // Načíst aktuální statistiky
    const stats = {
      displayName: profileData.displayName || 'Anonymní hráč',
      avatarUrl: profileData.avatarUrl || null,
      level: profileData.level || 1,
      xp: profileData.xp || 0,
      credits: profileData.credits || 0,
      totalCards: profileData.collectedCards?.length || 0,
      totalQuizzes: profileData.completedQuizzes || 0,
      // Vypočítat celkové skóre
      totalScore: (profileData.credits || 0) + 
                  ((profileData.collectedCards?.length || 0) * 1000) + 
                  ((profileData.completedQuizzes || 0) * 500),
      lastUpdated: serverTimestamp()
    };
    
    // Uložit do veřejné kolekce leaderboard
    const leaderboardRef = doc(db, 'leaderboard', userId);
    await setDoc(leaderboardRef, stats, { merge: true });
    
    console.log('Leaderboard synchronized for user:', userId);
  } catch (error) {
    console.error('Error syncing to leaderboard:', error);
  }
};