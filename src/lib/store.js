// 🗃️ AKTUALIZOVANÝ ZUSTAND STORE - Pro správu karet a balíčků
'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useGameStore = create(
  persist(
    (set, get) => ({
      // Statistiky hráče
      playerStats: {
        cardsOwned: 3,
        cardsNeeded: 147,
        coinsBalance: 1000,
        level: 1,
        experience: 0,
        packsPurchased: 0,        // Počet zakoupených balíčků
        legendaryCards: 0,         // Počet legendárních karet
        goldCards: 0,              // Počet zlatých karet
        silverCards: 0,            // Počet stříbrných karet
        commonCards: 3,            // Počet obyčejných karet
      },
      
      // Kolekce karet hráče
      cardCollection: [],
      
      // Historie otevřených balíčků
      packHistory: [],
      
      // Denní bonus
      dailyBonus: {
        lastClaimed: null,
        streak: 0,
      },
      
      // === AKCE ===
      
      // Nákup balíčku
      purchasePack: (packType, price, cards) => set((state) => {
        if (state.playerStats.coinsBalance < price) {
          return state; // Nedostatek coinů
        }
        
        // Spočítej rarity karet
        const rarityCount = cards.reduce((acc, card) => {
          acc[card.rarity] = (acc[card.rarity] || 0) + 1;
          return acc;
        }, {});
        
        const newStats = {
          ...state.playerStats,
          coinsBalance: state.playerStats.coinsBalance - price,
          cardsOwned: state.playerStats.cardsOwned + cards.length,
          cardsNeeded: Math.max(0, state.playerStats.cardsNeeded - cards.length),
          packsPurchased: state.playerStats.packsPurchased + 1,
          experience: state.playerStats.experience + (cards.length * 10),
          legendaryCards: state.playerStats.legendaryCards + (rarityCount.legendary || 0),
          goldCards: state.playerStats.goldCards + (rarityCount.gold || 0),
          silverCards: state.playerStats.silverCards + (rarityCount.silver || 0),
          commonCards: state.playerStats.commonCards + (rarityCount.common || 0),
        };
        
        // Level up check
        const xpNeeded = newStats.level * 1000;
        if (newStats.experience >= xpNeeded) {
          newStats.level += 1;
          newStats.experience = newStats.experience - xpNeeded;
          newStats.coinsBalance += 500; // Level up bonus
        }
        
        // Přidej karty do kolekce
        const newCollection = [...state.cardCollection, ...cards.map(card => ({
          ...card,
          obtainedAt: new Date().toISOString(),
          packType: packType,
          id: `${card.name}-${Date.now()}-${Math.random()}`
        }))];
        
        // Přidej do historie
        const packRecord = {
          packType,
          price,
          cards: cards.map(c => ({ name: c.name, rarity: c.rarity })),
          openedAt: new Date().toISOString(),
        };
        
        return {
          playerStats: newStats,
          cardCollection: newCollection,
          packHistory: [...state.packHistory, packRecord],
        };
      }),
      
      // Přidání coinů (např. z úkolů)
      addCoins: (amount) => set((state) => ({
        playerStats: {
          ...state.playerStats,
          coinsBalance: state.playerStats.coinsBalance + amount,
        }
      })),
      
      // Přidání XP
      addExperience: (amount) => set((state) => {
        const newExp = state.playerStats.experience + amount;
        const xpNeeded = state.playerStats.level * 1000;
        
        if (newExp >= xpNeeded) {
          return {
            playerStats: {
              ...state.playerStats,
              experience: newExp - xpNeeded,
              level: state.playerStats.level + 1,
              coinsBalance: state.playerStats.coinsBalance + 500, // Level up bonus
            }
          };
        }
        
        return {
          playerStats: {
            ...state.playerStats,
            experience: newExp,
          }
        };
      }),
      
      // Denní bonus
      claimDailyBonus: () => set((state) => {
        const now = new Date();
        const lastClaimed = state.dailyBonus.lastClaimed 
          ? new Date(state.dailyBonus.lastClaimed) 
          : null;
        
        // Kontrola, zda už byl dnes bonus nárokován
        if (lastClaimed && 
            now.getDate() === lastClaimed.getDate() &&
            now.getMonth() === lastClaimed.getMonth() &&
            now.getFullYear() === lastClaimed.getFullYear()) {
          return state; // Už bylo nárokováno dnes
        }
        
        // Vypočítej streak
        let newStreak = 1;
        if (lastClaimed) {
          const dayDiff = Math.floor((now - lastClaimed) / (1000 * 60 * 60 * 24));
          if (dayDiff === 1) {
            newStreak = state.dailyBonus.streak + 1;
          }
        }
        
        // Bonus podle streak
        const bonusCoins = Math.min(100 * newStreak, 500); // Max 500 coinů
        
        return {
          playerStats: {
            ...state.playerStats,
            coinsBalance: state.playerStats.coinsBalance + bonusCoins,
          },
          dailyBonus: {
            lastClaimed: now.toISOString(),
            streak: newStreak,
          }
        };
      }),
      
      // Získat karty podle rarity
      getCardsByRarity: (rarity) => {
        const state = get();
        return state.cardCollection.filter(card => card.rarity === rarity);
      },
      
      // Získat duplikáty
      getDuplicates: () => {
        const state = get();
        const cardCounts = {};
        
        state.cardCollection.forEach(card => {
          const key = `${card.name}-${card.rating}`;
          cardCounts[key] = (cardCounts[key] || 0) + 1;
        });
        
        return Object.entries(cardCounts)
          .filter(([_, count]) => count > 1)
          .map(([key, count]) => ({
            card: key,
            duplicates: count - 1
          }));
      },
      
      // Reset store (pro testování)
      resetStore: () => set({
        playerStats: {
          cardsOwned: 3,
          cardsNeeded: 147,
          coinsBalance: 1000,
          level: 1,
          experience: 0,
          packsPurchased: 0,
          legendaryCards: 0,
          goldCards: 0,
          silverCards: 0,
          commonCards: 3,
        },
        cardCollection: [],
        packHistory: [],
        dailyBonus: {
          lastClaimed: null,
          streak: 0,
        },
      }),
      
      // Získat statistiky
      getStatistics: () => {
        const state = get();
        return {
          totalCards: state.cardCollection.length,
          uniqueCards: new Set(state.cardCollection.map(c => c.name)).size,
          totalSpent: state.packHistory.reduce((sum, pack) => sum + pack.price, 0),
          averagePackValue: state.packHistory.length > 0 
            ? state.packHistory.reduce((sum, pack) => sum + pack.cards.length, 0) / state.packHistory.length 
            : 0,
          favoriteRarity: [
            { rarity: 'legendary', count: state.playerStats.legendaryCards },
            { rarity: 'gold', count: state.playerStats.goldCards },
            { rarity: 'silver', count: state.playerStats.silverCards },
            { rarity: 'common', count: state.playerStats.commonCards },
          ].sort((a, b) => b.count - a.count)[0]?.rarity || 'none',
        };
      },
    }),
    {
      name: 'hc-litvinov-game-storage', // Klíč pro localStorage
      version: 2, // Verze pro migraci dat
    }
  )
);

export default useGameStore;