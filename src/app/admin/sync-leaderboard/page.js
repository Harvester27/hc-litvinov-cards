'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, setDoc } from 'firebase/firestore';

export default function SyncLeaderboardPage() {
  const { user } = useAuth();
  const [syncing, setSyncing] = useState(false);
  const [result, setResult] = useState('');

  const syncAllUsers = async () => {
    if (!user) {
      setResult('Musíte být přihlášeni');
      return;
    }

    setSyncing(true);
    try {
      const usersRef = collection(db, 'users');
      const usersSnapshot = await getDocs(usersRef);
      
      let count = 0;
      
      for (const userDoc of usersSnapshot.docs) {
        const userId = userDoc.id;
        
        try {
          // Načíst profil
          const profileRef = collection(db, 'users', userId, 'profile');
          const profileSnap = await getDocs(profileRef);
          const profileData = profileSnap.docs[0]?.data();
          
          if (profileData) {
            // Načíst počet karet
            const cardsRef = collection(db, 'users', userId, 'cardCollection');
            const cardsSnap = await getDocs(cardsRef);
            const totalCards = cardsSnap.size;
            
            // Načíst počet kvízů
            const quizzesRef = collection(db, 'users', userId, 'completedQuizzes');
            const quizzesSnap = await getDocs(quizzesRef);
            const totalQuizzes = quizzesSnap.size;
            
            // Vytvořit záznam v leaderboard
            const leaderboardRef = doc(db, 'leaderboard', userId);
            await setDoc(leaderboardRef, {
              displayName: profileData.displayName || 'Anonymní hráč',
              avatarUrl: profileData.avatarUrl || null,
              level: profileData.level || 1,
              xp: profileData.xp || 0,
              credits: profileData.credits || 0,
              totalCards: totalCards,
              totalQuizzes: totalQuizzes,
              totalScore: (profileData.credits || 0) + (totalCards * 1000) + (totalQuizzes * 500),
              lastUpdated: new Date()
            });
            
            count++;
          }
        } catch (error) {
          console.error(`Error syncing user ${userId}:`, error);
        }
      }
      
      setResult(`Synchronizováno ${count} uživatelů`);
    } catch (error) {
      console.error('Sync error:', error);
      setResult('Chyba při synchronizaci: ' + error.message);
    }
    
    setSyncing(false);
  };

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-4">Synchronizace žebříčku</h1>
      <button
        onClick={syncAllUsers}
        disabled={syncing}
        className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
      >
        {syncing ? 'Synchronizuji...' : 'Synchronizovat všechny uživatele'}
      </button>
      {result && <p className="mt-4">{result}</p>}
    </div>
  );
}