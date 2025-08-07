import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useGameStore = create(
  persist(
    (set) => ({
      // Player stats
      playerStats: {
        cardsOwned: 3,
        cardsNeeded: 147,
        coinsBalance: 1000,
        level: 1,
        experience: 0
      },
      
      // Actions
      updateStats: (stats) => set({ playerStats: stats }),
      
      addCoins: (amount) => set((state) => ({
        playerStats: {
          ...state.playerStats,
          coinsBalance: state.playerStats.coinsBalance + amount
        }
      })),
      
      openPack: () => set((state) => {
        if (state.playerStats.coinsBalance >= 100) {
          const newStats = {
            ...state.playerStats,
            coinsBalance: state.playerStats.coinsBalance - 100,
            cardsOwned: state.playerStats.cardsOwned + 3,
            cardsNeeded: Math.max(0, state.playerStats.cardsNeeded - 3),
            experience: state.playerStats.experience + 50
          };
          
          // Level up check
          if (newStats.experience >= newStats.level * 1000) {
            newStats.level += 1;
            newStats.experience = newStats.experience - (newStats.level - 1) * 1000;
          }
          
          return { playerStats: newStats };
        }
        return state;
      }),
    }),
    {
      name: 'game-storage',
    }
  )
);

export default useGameStore;