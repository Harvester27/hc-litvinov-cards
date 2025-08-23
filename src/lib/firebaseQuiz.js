// lib/firebaseQuiz.js
import { 
    doc, 
    setDoc, 
    getDoc, 
    getDocs,
    updateDoc, 
    collection,
    serverTimestamp,
    arrayUnion,
    increment,
    query,
    where
  } from 'firebase/firestore';
  import { db } from './firebase';
  import { calculateLevelFromXP } from './firebaseProfile';
  
  /**
   * Zkontroluje, zda uživatel již dokončil daný kvíz
   */
  export const checkQuizCompletion = async (userId, quizId) => {
    try {
      const quizRef = doc(db, 'users', userId, 'completedQuizzes', quizId);
      const quizSnap = await getDoc(quizRef);
      return quizSnap.exists();
    } catch (error) {
      console.error('Error checking quiz completion:', error);
      return false;
    }
  };
  
  /**
   * Uloží dokončení kvízu BEZ výběru karty (jen označí jako dokončený)
   */
  export const saveQuizCompletion = async (userId, quizId) => {
    try {
      console.log('Saving quiz completion for user:', userId);
      
      // 1. Uložit dokončení kvízu (ale bez výběru karty)
      const quizRef = doc(db, 'users', userId, 'completedQuizzes', quizId);
      await setDoc(quizRef, {
        completedAt: serverTimestamp(),
        rewardClaimed: false, // Odměna zatím nevyzvednutá
        creditsEarned: 1000,
        xpEarned: 150,  // ZMĚNĚNO NA 150 XP
        selectedCard: null // Zatím žádná karta
      });
      
      // 2. Přidat kredity a XP hned
      const userRef = doc(db, 'users', userId, 'profile', 'data');
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists()) {
        const currentData = userSnap.data();
        const newXP = (currentData.xp || 0) + 150;  // ZMĚNĚNO NA 150 XP
        const newLevel = calculateLevelFromXP(newXP);
        
        await updateDoc(userRef, {
          credits: increment(1000),
          xp: newXP,
          level: newLevel,
          totalQuizzesCompleted: increment(1),
          pendingRewards: increment(1), // Přidat počítadlo nevyzvednutých odměn
          lastActivity: serverTimestamp()
        });
        
        console.log('Credits and XP added successfully');
      }
      
      return { success: true };
    } catch (error) {
      console.error('Error saving quiz completion:', error);
      return { success: false, error: error.message };
    }
  };
  
  /**
   * Získat všechny dokončené kvízy uživatele
   */
  export const getCompletedQuizzes = async (userId) => {
    try {
      const quizzesRef = collection(db, 'users', userId, 'completedQuizzes');
      const snapshot = await getDocs(quizzesRef);
      
      const quizzes = [];
      snapshot.forEach((doc) => {
        quizzes.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      return quizzes;
    } catch (error) {
      console.error('Error getting completed quizzes:', error);
      return [];
    }
  };
  
  /**
   * Vyzvednout odměnu za kvíz (vybrat kartu)
   */
  export const claimQuizReward = async (userId, quizId, selectedCard) => {
    try {
      console.log('Claiming reward for quiz:', quizId, 'Card:', selectedCard);
      
      // 1. Zkontrolovat, jestli kvíz existuje a odměna nebyla už vyzvednuta
      const quizRef = doc(db, 'users', userId, 'completedQuizzes', quizId);
      const quizSnap = await getDoc(quizRef);
      
      if (!quizSnap.exists()) {
        throw new Error('Kvíz nebyl dokončen');
      }
      
      const quizData = quizSnap.data();
      if (quizData.rewardClaimed) {
        throw new Error('Odměna již byla vyzvednuta');
      }
      
      // 2. Aktualizovat kvíz - označit odměnu jako vyzvednutou
      await updateDoc(quizRef, {
        rewardClaimed: true,
        selectedCard: selectedCard,
        claimedAt: serverTimestamp()
      });
      
      // 3. Přidat kartu do kolekce uživatele
      const userRef = doc(db, 'users', userId, 'profile', 'data');
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists()) {
        const currentData = userSnap.data();
        const currentCards = currentData.collectedCards || [];
        
        // Přidat kartu pouze pokud ji ještě nemá
        const updatedCards = currentCards.includes(selectedCard) 
          ? currentCards 
          : [...currentCards, selectedCard];
        
        await updateDoc(userRef, {
          collectedCards: updatedCards,
          pendingRewards: increment(-1), // Snížit počítadlo nevyzvednutých odměn
          lastActivity: serverTimestamp()
        });
      }
      
      // 4. Uložit kartu do sbírky
      const cardRef = doc(db, 'users', userId, 'cardCollection', selectedCard);
      await setDoc(cardRef, {
        cardId: selectedCard,
        obtainedFrom: 'quiz',
        quizId: quizId,
        obtainedAt: serverTimestamp(),
        team: 'lancers',
        special: true,
        edition: 'Straubing 2025'
      });
  
      return { success: true };
    } catch (error) {
      console.error('Error claiming quiz reward:', error);
      return { success: false, error: error.message };
    }
  };
  
  /**
   * Získat počet nevyzvednutých odměn
   */
  export const getPendingRewardsCount = async (userId) => {
    try {
      const quizzesRef = collection(db, 'users', userId, 'completedQuizzes');
      const q = query(quizzesRef, where('rewardClaimed', '==', false));
      const snapshot = await getDocs(q);
      
      return snapshot.size;
    } catch (error) {
      console.error('Error getting pending rewards count:', error);
      return 0;
    }
  };
  
  /**
   * Získá všechny karty uživatele
   */
  export const getUserCards = async (userId) => {
    try {
      const userRef = doc(db, 'users', userId, 'profile', 'data');
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists()) {
        const data = userSnap.data();
        return data.collectedCards || [];
      }
      return [];
    } catch (error) {
      console.error('Error getting user cards:', error);
      return [];
    }
  };
  
  /**
   * Získat detaily kvízu podle ID
   */
  export const getQuizDetails = (quizId) => {
    // Pro teď máme jen jeden kvíz, později můžeme přidat více
    if (quizId === 'straubing-2025-quiz') {
      return straubingQuizData;
    }
    return null;
  };
  
  /**
   * Data kvízu pro článek o Straubingu
   */
  export const straubingQuizData = {
    id: 'straubing-2025-quiz',
    title: 'Kvíz: Turnaj ve Straubingu 2025',
    description: 'Otestujte své znalosti z článku a získejte odměny!',
    articleTitle: 'Straubing 2025: Hokejový víkend plný zážitků',
    questions: [
      {
        id: 1,
        question: 'Jaké bylo konečné umístění HC Litvínov Lancers na turnaji?',
        options: [
          '4. místo',
          '5. místo', 
          '6. místo',
          '7. místo'
        ],
        correctAnswer: 2,
        explanation: 'Lancers obsadili 6. místo z 12 týmů.'
      },
      {
        id: 2,
        question: 'Kdo dal rozhodující nájezd v semifinále proti Bayern Rangers?',
        options: [
          'Tomáš Tureček',
          'Michal Koreš',
          'Jan Hanuš',
          'Dan Kačeňák'
        ],
        correctAnswer: 1,
        explanation: 'Michal Koreš dal rozhodující nájezd v sudden death.'
      },
      {
        id: 3,
        question: 'Který tým porazili Lancers ve skupině?',
        options: [
          'Bayern Rangers',
          'RSC Pilnach',
          'Cologne Ravens',
          'Bruno der Bär'
        ],
        correctAnswer: 2,
        explanation: 'Jediné vítězství ve skupině bylo proti Cologne Ravens 2:1.'
      },
      {
        id: 4,
        question: 'V jakém městě se turnaj konal?',
        options: [
          'Mnichov',
          'Straubing',
          'Norimberk',
          'Stuttgart'
        ],
        correctAnswer: 1,
        explanation: 'Turnaj se konal ve Straubingu v Německu.'
      },
      {
        id: 5,
        question: 'Kolik hráčů z Lancers se turnaje zúčastnilo?',
        options: [
          '6 hráčů',
          '7 hráčů',
          '8 hráčů',
          '9 hráčů'
        ],
        correctAnswer: 2,
        explanation: 'Z Lancers se zúčastnilo 8 hráčů plus Dan Kačeňák, Lukáš Zmeškal a Pepa.'
      }
    ],
    rewards: {
      credits: 1000,
      xp: 150,  // ZMĚNĚNO NA 150 XP
      cards: [
        {
          id: 'turecek-straubing-2025',
          name: 'Tomáš Tureček',
          edition: 'Straubing 2025',
          rarity: 'special',
          videoPath: '/CardGames/Straubing/TomasTurecekStraubing2025.mp4',
          svgPath: '/CardGames/Straubing/TomasTurecekStraubing2025.svg'
        },
        {
          id: 'kores-straubing-2025',
          name: 'Michal Koreš',
          edition: 'Straubing 2025',
          rarity: 'special',
          videoPath: '/CardGames/Straubing/MichalKoresStraubing2025.mp4',
          svgPath: '/CardGames/Straubing/MichalKoresStraubing2025.svg'
        },
        {
          id: 'hanus-straubing-2025',
          name: 'Jan Hanuš',
          edition: 'Straubing 2025',
          rarity: 'special',
          videoPath: '/CardGames/Straubing/JanHanusStraubing2025.mp4',
          svgPath: '/CardGames/Straubing/JanHanusStraubing2025.svg'
        }
      ]
    }
  };
  
  // Seznam všech dostupných kvízů (pro budoucí rozšíření)
  export const availableQuizzes = [
    {
      id: 'straubing-2025-quiz',
      title: 'Turnaj ve Straubingu 2025',
      description: 'Test znalostí z mezinárodního turnaje',
      category: 'Turnaje',
      difficulty: 'Střední',
      questions: 5,
      rewards: {
        credits: 1000,
        xp: 150,  // ZMĚNĚNO NA 150 XP
        specialCard: true
      }
    }
    // Zde můžeme přidat další kvízy
  ];