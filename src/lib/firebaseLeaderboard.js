import { db } from './firebase';
import { collection, getDocs } from 'firebase/firestore';

// Načíst data pro žebříček z veřejné kolekce
export const getLeaderboardData = async () => {
  try {
    const leaderboardRef = collection(db, 'leaderboard');
    const snapshot = await getDocs(leaderboardRef);
    
    const leaderboardData = [];
    snapshot.forEach((doc) => {
      leaderboardData.push({
        userId: doc.id,
        ...doc.data()
      });
    });
    
    console.log(`Loaded ${leaderboardData.length} players from leaderboard`);
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