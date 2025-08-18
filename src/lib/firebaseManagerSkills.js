// Firebase funkce pro Manager Skills
import { db } from './firebase';
import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc
} from 'firebase/firestore';

/**
 * Načíst manažerské dovednosti
 */
export const loadManagerSkills = async (userId) => {
  try {
    const docRef = doc(db, 'users', userId, 'managerProfile', 'skills');
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      // První přístup - vytvořit prázdné dovednosti
      const initialSkills = {
        // Základní dovednosti
        motivator: 0,
        ekonom: 0,
        scout: 0,
        taktik: 0,
        psycholog: 0,
        kondicak: 0,
        trener: 0,
        // Speciální perky
        stastnaRuka: 0,
        veteran: 0,
        sponzor: 0,
        legenda: 0,
        // Meta data
        totalPointsUsed: 0,
        lastUpdated: new Date().toISOString()
      };
      
      await setDoc(docRef, initialSkills);
      return initialSkills;
    }
  } catch (error) {
    console.error('Error loading manager skills:', error);
    return {};
  }
};

/**
 * Aktualizovat konkrétní dovednost
 */
export const updateManagerSkill = async (userId, skillId, newLevel) => {
  try {
    const docRef = doc(db, 'users', userId, 'managerProfile', 'skills');
    
    await updateDoc(docRef, {
      [skillId]: newLevel,
      lastUpdated: new Date().toISOString()
    });
    
    console.log(`Skill ${skillId} updated to level ${newLevel}`);
    return true;
  } catch (error) {
    console.error('Error updating manager skill:', error);
    return false;
  }
};

/**
 * Vypočítat použité skill pointy
 */
export const calculateUsedPoints = (skills) => {
  const SKILL_COSTS = {
    // Základní dovednosti s levely (každý level stojí víc)
    motivator: [1, 2, 3],
    ekonom: [1, 2, 3],
    scout: [1, 2, 3],
    // Jednorázové dovednosti
    taktik: [2],
    psycholog: [2],
    kondicak: [2],
    trener: [2],
    // Speciální perky
    stastnaRuka: [3],
    veteran: [3],
    sponzor: [4],
    legenda: [5]
  };
  
  let totalUsed = 0;
  
  Object.keys(skills).forEach(skillId => {
    const level = skills[skillId] || 0;
    const costs = SKILL_COSTS[skillId];
    
    if (costs && level > 0) {
      // Sečíst ceny všech levelů až do aktuálního
      for (let i = 0; i < level && i < costs.length; i++) {
        totalUsed += costs[i];
      }
    }
  });
  
  return totalUsed;
};

/**
 * Aplikovat skill bonusy na herní mechaniky
 */
export const applySkillBonuses = (skills) => {
  const bonuses = {
    moraleBonus: 0,        // % bonus k morálce
    discountRate: 0,       // % sleva na vylepšení
    cardChanceBonus: 0,    // % šance na lepší karty
    xpMultiplier: 1,       // Násobič XP
    dailyCredits: 0,       // Denní bonus kreditů
    regenerationBonus: 0,  // % bonus k regeneraci
    formationsUnlocked: false,  // Nové formace
    moraleLossReduction: 0,     // % snížení ztráty morálky
    activityBonus: 0            // % bonus k aktivitám
  };
  
  // Motivátor - bonus k morálce (5% za level)
  if (skills.motivator) {
    bonuses.moraleBonus = skills.motivator * 5;
  }
  
  // Ekonom - sleva na vylepšení (5% za level)
  if (skills.ekonom) {
    bonuses.discountRate = skills.ekonom * 5;
  }
  
  // Scout - lepší karty (5% za level)
  if (skills.scout) {
    bonuses.cardChanceBonus = skills.scout * 5;
  }
  
  // Taktik - nové formace
  if (skills.taktik > 0) {
    bonuses.formationsUnlocked = true;
  }
  
  // Psycholog - méně ztráty morálky
  if (skills.psycholog > 0) {
    bonuses.moraleLossReduction = 50;
  }
  
  // Kondičák - bonus k aktivitám
  if (skills.kondicak > 0) {
    bonuses.activityBonus = 25;
  }
  
  // Trenér - regenerace
  if (skills.trener > 0) {
    bonuses.regenerationBonus = 30;
  }
  
  // Šťastná ruka - 10% na extra kartu
  if (skills.stastnaRuka > 0) {
    bonuses.extraCardChance = 10;
  }
  
  // Veterán - XP bonus
  if (skills.veteran > 0) {
    bonuses.xpMultiplier = 1.2;
  }
  
  // Sponzor - denní kredity
  if (skills.sponzor > 0) {
    bonuses.dailyCredits = 100;
  }
  
  // Legenda klubu - dvojnásobné achievementy
  if (skills.legenda > 0) {
    bonuses.achievementMultiplier = 2;
  }
  
  return bonuses;
};

/**
 * Zkontrolovat dostupnost skill pointů
 */
export const getAvailableSkillPoints = async (userId, userLevel) => {
  const skills = await loadManagerSkills(userId);
  const usedPoints = calculateUsedPoints(skills);
  const totalPoints = userLevel || 1; // 1 bod za level
  
  return Math.max(0, totalPoints - usedPoints);
};

/**
 * Aplikovat denní bonus kredity (volat jednou denně)
 */
export const applyDailyCreditsBonus = async (userId) => {
  try {
    const skills = await loadManagerSkills(userId);
    
    if (skills.sponzor > 0) {
      // Přidat 100 kreditů do profilu
      const profileRef = doc(db, 'users', userId, 'profile', 'data');
      const profileDoc = await getDoc(profileRef);
      
      if (profileDoc.exists()) {
        const currentCredits = profileDoc.data().credits || 0;
        await updateDoc(profileRef, {
          credits: currentCredits + 100,
          lastDailyBonus: new Date().toISOString()
        });
        
        console.log('Daily credits bonus applied: +100');
        return true;
      }
    }
    
    return false;
  } catch (error) {
    console.error('Error applying daily credits:', error);
    return false;
  }
};

/**
 * Vypočítat finální cenu vylepšení s aplikací slevy
 */
export const calculateUpgradeCostWithDiscount = (baseCost, skills) => {
  const bonuses = applySkillBonuses(skills);
  const discountRate = bonuses.discountRate || 0;
  
  const finalCost = Math.floor(baseCost * (1 - discountRate / 100));
  return Math.max(1, finalCost); // Minimálně 1 kredit
};

export default {
  loadManagerSkills,
  updateManagerSkill,
  calculateUsedPoints,
  applySkillBonuses,
  getAvailableSkillPoints,
  applyDailyCreditsBonus,
  calculateUpgradeCostWithDiscount
};