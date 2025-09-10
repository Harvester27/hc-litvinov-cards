// Firebase funkce pro žebříček
import { db } from './firebase';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';

// Načíst data pro žebříček
export const getLeaderboardData = async () => {
  try {
    const leaderboardData = [];
    
    // Načíst všechny uživatelské profily
    const profilesRef = collection(db, 'users');
    const profilesSnap = await getDocs(profilesRef);
    
    for (const userDoc of profilesSnap.docs) {
      const userId = userDoc.id;
      
      // Načíst profil
      const profileRef = collection(db, 'users', userId, 'profile');
      const profileSnap = await getDocs(profileRef);
      const profileData = profileSnap.docs[0]?.data();
      
      if (!profileData) continue;
      
      // Načíst dokončené kvízy
      const quizzesRef = collection(db, 'users', userId, 'completedQuizzes');
      const quizzesSnap = await getDocs(quizzesRef);
      const completedQuizzes = quizzesSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      // Načíst karty
      const cardsRef = collection(db, 'users', userId, 'cardCollection');
      const cardsSnap = await getDocs(cardsRef);
      const cards = cardsSnap.docs.map(doc => doc.id);
      
      // Vypočítat statistiky
      const totalQuizzes = completedQuizzes.length;
      const successfulQuizzes = completedQuizzes.filter(q => q.score >= 80).length; // Předpokládáme 80% jako úspěch
      const totalCards = cards.length;
      
      leaderboardData.push({
        userId,
        displayName: profileData.displayName || 'Anonymní hráč',
        avatarUrl: profileData.avatarUrl,
        level: profileData.level || 1,
        xp: profileData.xp || 0,
        credits: profileData.credits || 0,
        totalQuizzes,
        successfulQuizzes,
        totalCards,
        // Vypočítat celkové skóre pro řazení
        totalScore: (profileData.credits || 0) + (totalCards * 1000) + (totalQuizzes * 500)
      });
    }
    
    return leaderboardData;
  } catch (error) {
    console.error('Error loading leaderboard data:', error);
    return [];
  }
};

// Získat top hráče podle kategorie
export const getTopPlayers = (players, category, limit = 10) => {
  let sorted = [...players];
  
  switch(category) {
    case 'credits':
      sorted.sort((a, b) => b.credits - a.credits);
      break;
    case 'cards':
      sorted.sort((a, b) => b.totalCards - a.totalCards);
      break;
    case 'quizzes':
      sorted.sort((a, b) => b.totalQuizzes - a.totalQuizzes);
      break;
    case 'level':
      sorted.sort((a, b) => {
        if (b.level === a.level) {
          return b.xp - a.xp;
        }
        return b.level - a.level;
      });
      break;
    case 'overall':
    default:
      sorted.sort((a, b) => b.totalScore - a.totalScore);
      break;
  }
  
  return sorted.slice(0, limit);
};

// Získat pozici hráče v žebříčku
export const getPlayerRank = (players, userId, category) => {
  const sorted = getTopPlayers(players, category, players.length);
  return sorted.findIndex(p => p.userId === userId) + 1;
};