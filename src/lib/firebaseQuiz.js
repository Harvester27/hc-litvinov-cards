// lib/firebaseQuiz.js
import { 
    doc, 
    setDoc, 
    getDoc, 
    updateDoc, 
    collection,
    serverTimestamp,
    arrayUnion,
    increment
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
   * Uloží dokončení kvízu a přidělí odměny
   */
  export const saveQuizCompletion = async (userId, quizId, selectedCard) => {
    try {
      console.log('Saving quiz completion for user:', userId);
      
      // 1. Nejdřív zkontrolovat, jestli user dokument existuje
      const userRef = doc(db, 'users', userId);
      const userSnap = await getDoc(userRef);
      
      if (!userSnap.exists()) {
        // Vytvořit základní profil, pokud neexistuje
        console.log('Creating new user profile');
        const initialXP = 500;
        const initialLevel = calculateLevelFromXP(initialXP);
        
        await setDoc(userRef, {
          displayName: 'Hráč',
          level: initialLevel,
          xp: initialXP,
          credits: 1000,
          collectedCards: [selectedCard],
          totalQuizzesCompleted: 1,
          createdAt: serverTimestamp(),
          lastActivity: serverTimestamp()
        });
        console.log('New profile created successfully');
      } else {
        // Aktualizovat existující profil
        console.log('Updating existing profile');
        const currentData = userSnap.data();
        const currentCards = currentData.collectedCards || [];
        
        // Přidat kartu pouze pokud ji ještě nemá
        const updatedCards = currentCards.includes(selectedCard) 
          ? currentCards 
          : [...currentCards, selectedCard];
        
        // Vypočítat nové XP a level
        const newXP = (currentData.xp || 0) + 500;
        const newLevel = calculateLevelFromXP(newXP);
        
        console.log('Current XP:', currentData.xp, 'New XP:', newXP, 'New Level:', newLevel);
        console.log('Current Credits:', currentData.credits, 'Adding: 1000');
        
        await updateDoc(userRef, {
          credits: increment(1000),
          xp: newXP,
          level: newLevel,
          collectedCards: updatedCards,
          totalQuizzesCompleted: increment(1),
          lastActivity: serverTimestamp()
        });
        console.log('Profile updated successfully');
      }
      
      // 2. Uložit dokončení kvízu (aby nemohl opakovat)
      const quizRef = doc(db, 'users', userId, 'completedQuizzes', quizId);
      await setDoc(quizRef, {
        completedAt: serverTimestamp(),
        selectedCard: selectedCard,
        creditsEarned: 1000
      });
      
      // 3. Uložit kartu do sbírky
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
      console.error('Error saving quiz completion:', error);
      return { success: false, error: error.message };
    }
  };
  
  /**
   * Získá všechny karty uživatele
   */
  export const getUserCards = async (userId) => {
    try {
      const userRef = doc(db, 'users', userId);
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
   * Data kvízu pro článek o Straubingu
   */
  export const straubingQuizData = {
    id: 'straubing-2025-quiz',
    title: 'Kvíz: Turnaj ve Straubingu 2025',
    description: 'Otestujte své znalosti z článku a získejte odměny!',
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