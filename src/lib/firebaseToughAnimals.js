// firebaseToughAnimals.js - Firebase funkce pro Tough Animals hru

import { 
    doc, 
    getDoc, 
    setDoc, 
    updateDoc,
    serverTimestamp,
    increment
  } from 'firebase/firestore';
  import { db } from './firebase';
  import { auth } from './firebase';
  import { getXPForLevel } from './firebaseProfile';
  
  // ============================================
  // INICIALIZACE PROFILU PRO TOUGH ANIMALS
  // ============================================
  
  export const initializeToughAnimalsProfile = async (userId) => {
    try {
      const profileRef = doc(db, 'users', userId, 'toughAnimals', 'data');
      const profileSnap = await getDoc(profileRef);
  
      if (!profileSnap.exists()) {
        // Vytvoření výchozího profilu
        const defaultProfile = {
          // Bear stats
          bearLevel: 1,
          bearStats: {
            strength: 1,
            speed: 1,
            defense: 1,
            stamina: 1,
            agility: 1
          },
          
          // Game stats
          totalWins: 0,
          totalGames: 0,
          winStreak: 0,
          bestWinStreak: 0,
          totalDamageDealt: 0,
          totalDamageTaken: 0,
          
          // Achievements
          achievements: [],
          unlockedSkins: ['default'],
          currentSkin: 'default',
          
          // Timestamps
          createdAt: serverTimestamp(),
          lastPlayed: serverTimestamp(),
          lastUpdated: serverTimestamp()
        };
  
        await setDoc(profileRef, defaultProfile);
        console.log('✅ Tough Animals profil vytvořen');
        return defaultProfile;
      }
  
      return profileSnap.data();
    } catch (error) {
      console.error('❌ Chyba při inicializaci Tough Animals profilu:', error);
      throw error;
    }
  };
  
  // ============================================
  // NAČTENÍ DAT HRY
  // ============================================
  
  export const loadToughAnimalsData = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        console.log('⚠️ Uživatel není přihlášen');
        return null;
      }
  
      const profileRef = doc(db, 'users', user.uid, 'toughAnimals', 'data');
      const profileSnap = await getDoc(profileRef);
  
      if (!profileSnap.exists()) {
        // Inicializace pokud neexistuje
        return await initializeToughAnimalsProfile(user.uid);
      }
  
      return profileSnap.data();
    } catch (error) {
      console.error('❌ Chyba při načítání Tough Animals dat:', error);
      return null;
    }
  };
  
  // ============================================
  // ULOŽENÍ BEAR STATS
  // ============================================
  
  export const saveBearStats = async (bearStats) => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('Uživatel není přihlášen');
  
      const profileRef = doc(db, 'users', user.uid, 'toughAnimals', 'data');
      
      await updateDoc(profileRef, {
        bearStats: bearStats,
        lastUpdated: serverTimestamp()
      });
  
      console.log('✅ Bear stats uloženy');
      return true;
    } catch (error) {
      console.error('❌ Chyba při ukládání bear stats:', error);
      return false;
    }
  };
  
  // ============================================
  // UPGRADE BEAR STAT
  // ============================================
  
  export const upgradeBearStat = async (stat, newLevel, cost) => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('Uživatel není přihlášen');
  
      // Nejdřív zkontrolujeme kredity
      const profileRef = doc(db, 'users', user.uid, 'profile', 'data');
      const profileSnap = await getDoc(profileRef);
      
      if (!profileSnap.exists()) {
        throw new Error('Profil neexistuje');
      }
  
      const currentCredits = profileSnap.data().credits || 0;
      if (currentCredits < cost) {
        throw new Error('Nedostatek kreditů');
      }
  
      // Odečteme kredity z hlavního profilu
      await updateDoc(profileRef, {
        credits: increment(-cost)
      });
  
      // Aktualizujeme bear stat
      const toughRef = doc(db, 'users', user.uid, 'toughAnimals', 'data');
      await updateDoc(toughRef, {
        [`bearStats.${stat}`]: newLevel,
        lastUpdated: serverTimestamp()
      });
  
      console.log(`✅ ${stat} vylepšen na level ${newLevel}`);
      return true;
    } catch (error) {
      console.error('❌ Chyba při vylepšování:', error);
      throw error;
    }
  };
  
  // ============================================
  // ULOŽENÍ VÝSLEDKU HRY
  // ============================================
  
  export const saveGameResult = async (won, damageDealt, damageTaken) => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('Uživatel není přihlášen');
  
      const toughRef = doc(db, 'users', user.uid, 'toughAnimals', 'data');
      const toughSnap = await getDoc(toughRef);
      
      if (!toughSnap.exists()) {
        await initializeToughAnimalsProfile(user.uid);
      }
  
      const currentData = toughSnap.data() || {};
      const currentStreak = won ? (currentData.winStreak || 0) + 1 : 0;
      const bestStreak = Math.max(currentStreak, currentData.bestWinStreak || 0);
  
      // Update Tough Animals stats
      await updateDoc(toughRef, {
        totalGames: increment(1),
        totalWins: won ? increment(1) : increment(0),
        winStreak: currentStreak,
        bestWinStreak: bestStreak,
        totalDamageDealt: increment(damageDealt || 0),
        totalDamageTaken: increment(damageTaken || 0),
        lastPlayed: serverTimestamp()
      });
  
      // Update hlavní profil - kredity a XP
      const profileRef = doc(db, 'users', user.uid, 'profile', 'data');
      const creditsReward = won ? 500 : 100;
      const xpReward = won ? 100 : 25;
  
      // OPRAVA: Používáme správné názvy polí
      await updateDoc(profileRef, {
        credits: increment(creditsReward),
        xp: increment(xpReward)  // ZMĚNA: xp místo totalXP
      });
  
      console.log(`✅ Výsledek hry uložen - ${won ? 'Výhra' : 'Prohra'}`);
      return {
        creditsEarned: creditsReward,
        xpEarned: xpReward
      };
    } catch (error) {
      console.error('❌ Chyba při ukládání výsledku hry:', error);
      throw error;
    }
  };
  
  // ============================================
  // ZÍSKÁNÍ STATISTIK
  // ============================================
  
  export const getToughAnimalsStats = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return null;
  
      const toughRef = doc(db, 'users', user.uid, 'toughAnimals', 'data');
      const toughSnap = await getDoc(toughRef);
  
      if (!toughSnap.exists()) {
        return {
          totalGames: 0,
          totalWins: 0,
          winRate: 0,
          winStreak: 0,
          bestWinStreak: 0,
          avgDamageDealt: 0,
          avgDamageTaken: 0
        };
      }
  
      const data = toughSnap.data();
      const winRate = data.totalGames > 0 
        ? Math.round((data.totalWins / data.totalGames) * 100) 
        : 0;
      
      const avgDamageDealt = data.totalGames > 0
        ? Math.round(data.totalDamageDealt / data.totalGames)
        : 0;
        
      const avgDamageTaken = data.totalGames > 0
        ? Math.round(data.totalDamageTaken / data.totalGames)
        : 0;
  
      return {
        ...data,
        winRate,
        avgDamageDealt,
        avgDamageTaken
      };
    } catch (error) {
      console.error('❌ Chyba při získávání statistik:', error);
      return null;
    }
  };
  
  // ============================================
  // ODEMKNUTÍ ACHIEVEMENTU
  // ============================================
  
  export const unlockAchievement = async (achievementId, achievementData) => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('Uživatel není přihlášen');
  
      const toughRef = doc(db, 'users', user.uid, 'toughAnimals', 'data');
      const toughSnap = await getDoc(toughRef);
      
      if (!toughSnap.exists()) {
        await initializeToughAnimalsProfile(user.uid);
      }
  
      const currentAchievements = toughSnap.data()?.achievements || [];
      
      // Zkontroluj jestli už achievement není odemčený
      if (currentAchievements.some(a => a.id === achievementId)) {
        console.log('⚠️ Achievement už je odemčený');
        return false;
      }
  
      // Přidej nový achievement
      const newAchievement = {
        id: achievementId,
        ...achievementData,
        unlockedAt: serverTimestamp()
      };
  
      currentAchievements.push(newAchievement);
  
      await updateDoc(toughRef, {
        achievements: currentAchievements
      });
  
      // Případná odměna v kreditech
      if (achievementData.reward) {
        const profileRef = doc(db, 'users', user.uid, 'profile', 'data');
        await updateDoc(profileRef, {
          credits: increment(achievementData.reward)
        });
      }
  
      console.log(`✅ Achievement "${achievementData.name}" odemčen!`);
      return true;
    } catch (error) {
      console.error('❌ Chyba při odemykání achievementu:', error);
      return false;
    }
  };
  
  // ============================================
  // KONTROLA ACHIEVEMENTŮ
  // ============================================
  
  export const checkAchievements = async () => {
    try {
      const stats = await getToughAnimalsStats();
      if (!stats) return;
  
      const achievements = [
        {
          id: 'first_win',
          name: 'První výhra',
          description: 'Vyhraj svůj první zápas',
          condition: stats.totalWins >= 1,
          reward: 100
        },
        {
          id: 'win_streak_5',
          name: 'Neporazitelný',
          description: 'Vyhraj 5 zápasů v řadě',
          condition: stats.bestWinStreak >= 5,
          reward: 500
        },
        {
          id: 'games_10',
          name: 'Veterán',
          description: 'Odehraj 10 zápasů',
          condition: stats.totalGames >= 10,
          reward: 200
        },
        {
          id: 'max_bear',
          name: 'Maximální síla',
          description: 'Vylepši všechny staty medvěda na maximum',
          condition: Object.values(stats.bearStats || {}).every(stat => stat >= 10),
          reward: 1000
        }
      ];
  
      for (const achievement of achievements) {
        if (achievement.condition) {
          await unlockAchievement(achievement.id, {
            name: achievement.name,
            description: achievement.description,
            reward: achievement.reward
          });
        }
      }
    } catch (error) {
      console.error('❌ Chyba při kontrole achievementů:', error);
    }
  };
  
  // ============================================
  // SYNCHRONIZACE S HLAVNÍM PROFILEM
  // ============================================
  
  export const syncWithMainProfile = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return null;
  
      // Načti hlavní profil
      const profileRef = doc(db, 'users', user.uid, 'profile', 'data');
      const profileSnap = await getDoc(profileRef);
  
      if (!profileSnap.exists()) {
        console.log('⚠️ Hlavní profil neexistuje');
        return null;
      }
  
      const profileData = profileSnap.data();
  
      // Načti Tough Animals data
      const toughData = await loadToughAnimalsData();
  
      // OPRAVA: Správné názvy polí a výpočet xpNeeded
      const currentLevel = profileData.level || 1;
      const xpForCurrentLevel = getXPForLevel(currentLevel);
      const xpForNextLevel = getXPForLevel(currentLevel + 1);
      const xpInCurrentLevel = (profileData.xp || 0) - xpForCurrentLevel;
      const xpNeededForLevel = xpForNextLevel - xpForCurrentLevel;
  
      return {
        profile: {
          displayName: profileData.displayName || 'Hráč',
          avatar: profileData.avatar || null,
          level: currentLevel,
          xp: xpInCurrentLevel,  // XP v aktuálním levelu
          xpNeeded: xpNeededForLevel,  // XP potřebné pro další level
          credits: profileData.credits || 12000
        },
        toughAnimals: toughData
      };
    } catch (error) {
      console.error('❌ Chyba při synchronizaci:', error);
      return null;
    }
  };