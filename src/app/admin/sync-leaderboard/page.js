'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';

export default function SyncLeaderboardPage() {
  const { user } = useAuth();
  const [syncing, setSyncing] = useState(false);
  const [result, setResult] = useState('');
  const [progress, setProgress] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);

  const syncAllUsers = async () => {
    if (!user) {
      setResult('❌ Musíte být přihlášeni');
      return;
    }

    setSyncing(true);
    setProgress(0);
    try {
      // Získat všechny uživatele
      const usersRef = collection(db, 'users');
      const usersSnapshot = await getDocs(usersRef);
      
      const totalCount = usersSnapshot.size;
      setTotalUsers(totalCount);
      
      let successCount = 0;
      let errorCount = 0;
      let currentIndex = 0;
      
      for (const userDoc of usersSnapshot.docs) {
        const userId = userDoc.id;
        currentIndex++;
        setProgress(Math.round((currentIndex / totalCount) * 100));
        
        try {
          // Načíst profil data - OPRAVA: správná cesta k dokumentu
          const profileRef = doc(db, 'users', userId, 'profile', 'data');
          const profileSnap = await getDoc(profileRef);
          
          if (profileSnap.exists()) {
            const profileData = profileSnap.data();
            
            // Načíst počet karet
            const cardsRef = collection(db, 'users', userId, 'cardCollection');
            const cardsSnap = await getDocs(cardsRef);
            const totalCards = cardsSnap.size;
            
            // Načíst počet kvízů
            const quizzesRef = collection(db, 'users', userId, 'completedQuizzes');
            const quizzesSnap = await getDocs(quizzesRef);
            const totalQuizzes = quizzesSnap.size;
            
            // Vytvořit nebo aktualizovat záznam v leaderboard
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
              lastUpdated: serverTimestamp()
            });
            
            console.log(`✅ Synchronized user ${userId}: ${profileData.displayName}`);
            successCount++;
          } else {
            console.log(`⚠️ No profile data for user ${userId}`);
          }
        } catch (error) {
          console.error(`❌ Error syncing user ${userId}:`, error);
          errorCount++;
        }
      }
      
      setResult(`✅ Synchronizace dokončena!
        - Úspěšně synchronizováno: ${successCount} uživatelů
        - Chyby: ${errorCount}
        - Celkem zpracováno: ${totalCount}`);
      
    } catch (error) {
      console.error('Sync error:', error);
      setResult(`❌ Chyba při synchronizaci: ${error.message}`);
    }
    
    setSyncing(false);
    setProgress(100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white p-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-3xl font-bold mb-2 text-gray-900">
            🔄 Synchronizace žebříčku
          </h1>
          <p className="text-gray-600 mb-6">
            Synchronizuje data všech uživatelů do veřejné kolekce leaderboard
          </p>
          
          <div className="space-y-4">
            <button
              onClick={syncAllUsers}
              disabled={syncing}
              className={`
                w-full px-6 py-4 rounded-xl font-bold text-white transition-all
                ${syncing 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 transform hover:scale-105'
                }
              `}
            >
              {syncing ? '⏳ Synchronizuji...' : '🚀 Synchronizovat všechny uživatele'}
            </button>
            
            {syncing && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Průběh synchronizace</span>
                  <span>{progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-red-500 to-red-600 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                {totalUsers > 0 && (
                  <p className="text-sm text-gray-500 text-center">
                    Zpracovávám uživatele... ({Math.round(progress * totalUsers / 100)}/{totalUsers})
                  </p>
                )}
              </div>
            )}
            
            {result && (
              <div className={`
                p-4 rounded-lg 
                ${result.includes('✅') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}
              `}>
                <pre className="whitespace-pre-wrap font-mono text-sm">{result}</pre>
              </div>
            )}
          </div>
          
          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-bold text-blue-900 mb-2">ℹ️ Informace</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Synchronizace vytvoří záznamy pro všechny uživatele</li>
              <li>• Aktualizuje kredity, karty, kvízy a celkové skóre</li>
              <li>• Data budou veřejně dostupná v žebříčku</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}