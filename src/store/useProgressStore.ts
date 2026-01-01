import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PrayerName, PrayerLog } from '../types';
import { LEVELS, BADGES, calculateLevel } from '../data/gamificationData';

interface ProgressState {
  // Journey progress
  completedDays: number[];
  currentDay: number;
  currentTrack: string;

  // Gamification
  xp: number;
  level: number;
  streak: number;
  longestStreak: number;
  lastCompletedDate: string | null;
  unlockedBadges: string[];

  // Streak protection
  freezeDaysAvailable: number;
  freezeDaysUsed: number;
  activeFreeze: boolean;
  freezeStartDate: string | null;
  lastStreakLostDate: string | null;
  lastStreakValue: number;

  // Prayer tracking
  prayersCompleted: number;
  todaysPrayers: PrayerLog;

  // Stats
  totalDaysActive: number;
  joinedAt: string;

  // Actions
  markDayComplete: (dayId: number) => void;
  setCurrentDay: (dayId: number) => void;
  addXP: (amount: number, reason: string) => void;
  checkAndUpdateStreak: () => void;
  unlockBadge: (badgeId: string) => void;
  logPrayer: (prayer: PrayerName) => void;
  resetProgress: () => void;

  // Streak protection actions
  useStreakFreeze: () => boolean;
  endStreakFreeze: () => void;
  recoverStreak: () => boolean;
  addFreezeDays: (days: number) => void;
  canRecoverStreak: () => boolean;

  // Computed helpers
  getLevel: () => typeof LEVELS[0];
  getLevelProgress: () => number;
  getDayProgress: () => number;
  getCompletedDaysCount: () => number;
}

const getToday = (): string => {
  return new Date().toISOString().split('T')[0];
};

const getEmptyPrayerLog = (): PrayerLog => ({
  date: getToday(),
  fajr: false,
  dhuhr: false,
  asr: false,
  maghrib: false,
  isha: false,
});

const isConsecutiveDay = (lastDate: string | null): boolean => {
  if (!lastDate) return false;
  
  const last = new Date(lastDate);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  return last.toDateString() === yesterday.toDateString();
};

const isSameDay = (date1: string | null, date2: string): boolean => {
  if (!date1) return false;
  return new Date(date1).toDateString() === new Date(date2).toDateString();
};

// Check if within recovery window (24 hours)
const isWithinRecoveryWindow = (lostDate: string | null): boolean => {
  if (!lostDate) return false;

  const lost = new Date(lostDate);
  const now = new Date();
  const hoursDiff = (now.getTime() - lost.getTime()) / (1000 * 60 * 60);

  return hoursDiff <= 24;
};

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      // Initial state
      completedDays: [],
      currentDay: 1,
      currentTrack: 'foundation',
      xp: 0,
      level: 1,
      streak: 0,
      longestStreak: 0,
      lastCompletedDate: null,
      unlockedBadges: [],

      // Streak protection initial state
      freezeDaysAvailable: 2, // Start with 2 free freeze days
      freezeDaysUsed: 0,
      activeFreeze: false,
      freezeStartDate: null,
      lastStreakLostDate: null,
      lastStreakValue: 0,

      prayersCompleted: 0,
      todaysPrayers: getEmptyPrayerLog(),
      totalDaysActive: 0,
      joinedAt: new Date().toISOString(),

      // Mark a day as complete
      markDayComplete: (dayId: number) => {
        const state = get();
        const today = getToday();
        
        // Already completed
        if (state.completedDays.includes(dayId)) return;
        
        // Calculate XP rewards
        let xpGained = 50; // Base XP for completing a day
        
        // First time completion bonus
        if (state.completedDays.length === 0) {
          xpGained += 20;
        }
        
        // Check streak
        let newStreak = state.streak;
        if (isSameDay(state.lastCompletedDate, today)) {
          // Already completed something today, no streak change
        } else if (isConsecutiveDay(state.lastCompletedDate)) {
          newStreak += 1;
          xpGained += Math.min(newStreak * 10, 100); // Streak bonus, max 100
        } else if (!state.lastCompletedDate) {
          newStreak = 1;
        } else {
          newStreak = 1; // Streak broken, restart
        }
        
        const newLongestStreak = Math.max(newStreak, state.longestStreak);
        const newXP = state.xp + xpGained;
        const newLevel = calculateLevel(newXP);
        
        // Check for badge unlocks
        const completedCount = state.completedDays.length + 1;
        const newBadges: string[] = [];
        
        // Day milestone badges
        if (completedCount === 1) newBadges.push('first_step');
        if (completedCount === 7) newBadges.push('week_warrior');
        if (completedCount === 14) newBadges.push('two_weeks');
        if (completedCount === 21) newBadges.push('three_weeks');
        if (completedCount === 30) newBadges.push('journey_complete');
        if (completedCount === 60) newBadges.push('prayer_master');
        if (completedCount === 90) newBadges.push('quran_student');
        
        // Streak badges
        if (newStreak === 7) newBadges.push('streak_week');
        if (newStreak === 30) newBadges.push('streak_month');
        if (newStreak === 100) newBadges.push('streak_century');
        
        set({
          completedDays: [...state.completedDays, dayId],
          currentDay: dayId + 1,
          xp: newXP,
          level: newLevel,
          streak: newStreak,
          longestStreak: newLongestStreak,
          lastCompletedDate: today,
          unlockedBadges: [...state.unlockedBadges, ...newBadges.filter(b => !state.unlockedBadges.includes(b))],
          totalDaysActive: isSameDay(state.lastCompletedDate, today) 
            ? state.totalDaysActive 
            : state.totalDaysActive + 1,
        });
      },

      setCurrentDay: (dayId: number) => {
        set({ currentDay: dayId });
      },

      addXP: (amount: number, _reason: string) => {
        const state = get();
        const newXP = state.xp + amount;
        const newLevel = calculateLevel(newXP);
        
        set({
          xp: newXP,
          level: newLevel,
        });
      },

      checkAndUpdateStreak: () => {
        const state = get();
        const today = getToday();

        // Reset today's prayers if it's a new day
        if (state.todaysPrayers.date !== today) {
          set({
            todaysPrayers: getEmptyPrayerLog(),
          });
        }

        // Check if freeze should auto-expire (after 1 day)
        if (state.activeFreeze && state.freezeStartDate) {
          const freezeStart = new Date(state.freezeStartDate);
          const now = new Date();
          const daysDiff = Math.floor((now.getTime() - freezeStart.getTime()) / (1000 * 60 * 60 * 24));

          if (daysDiff >= 1) {
            // Freeze expires, update lastCompletedDate to yesterday to maintain streak
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            set({
              activeFreeze: false,
              freezeStartDate: null,
              lastCompletedDate: yesterday.toISOString().split('T')[0],
            });
            return;
          }
        }

        // If freeze is active, don't break streak
        if (state.activeFreeze) return;

        // Check if streak should be broken
        if (state.lastCompletedDate && !isConsecutiveDay(state.lastCompletedDate) && !isSameDay(state.lastCompletedDate, today)) {
          // Save streak value for potential recovery
          set({
            lastStreakLostDate: today,
            lastStreakValue: state.streak,
            streak: 0,
          });
        }
      },

      unlockBadge: (badgeId: string) => {
        const state = get();
        if (state.unlockedBadges.includes(badgeId)) return;
        
        set({
          unlockedBadges: [...state.unlockedBadges, badgeId],
          xp: state.xp + 25, // Badge unlock bonus
        });
      },

      logPrayer: (prayer: PrayerName) => {
        const state = get();
        const today = getToday();
        
        // Reset if new day
        let todaysPrayers = state.todaysPrayers;
        if (todaysPrayers.date !== today) {
          todaysPrayers = getEmptyPrayerLog();
        }
        
        // Already logged
        if (todaysPrayers[prayer]) return;
        
        const newTodaysPrayers = {
          ...todaysPrayers,
          date: today,
          [prayer]: true,
        };
        
        const prayersToday = Object.values(newTodaysPrayers).filter(v => v === true).length;
        let xpGain = 10; // Base prayer XP
        
        // Bonus for completing all 5
        if (prayersToday === 5) {
          xpGain += 25;
        }
        
        // Check for prayer badges
        const totalPrayers = state.prayersCompleted + 1;
        const newBadges: string[] = [];
        
        if (totalPrayers === 1) newBadges.push('first_prayer');
        if (totalPrayers === 100) newBadges.push('hundred_prayers');
        if (totalPrayers === 500) newBadges.push('devoted_worshipper');
        
        set({
          todaysPrayers: newTodaysPrayers,
          prayersCompleted: totalPrayers,
          xp: state.xp + xpGain,
          unlockedBadges: [...state.unlockedBadges, ...newBadges.filter(b => !state.unlockedBadges.includes(b))],
        });
      },

      resetProgress: () => {
        set({
          completedDays: [],
          currentDay: 1,
          currentTrack: 'foundation',
          xp: 0,
          level: 1,
          streak: 0,
          longestStreak: 0,
          lastCompletedDate: null,
          unlockedBadges: [],
          freezeDaysAvailable: 2,
          freezeDaysUsed: 0,
          activeFreeze: false,
          freezeStartDate: null,
          lastStreakLostDate: null,
          lastStreakValue: 0,
          prayersCompleted: 0,
          todaysPrayers: getEmptyPrayerLog(),
          totalDaysActive: 0,
          joinedAt: new Date().toISOString(),
        });
      },

      // Streak protection actions
      useStreakFreeze: () => {
        const state = get();

        // Can't freeze if no freeze days available or already frozen
        if (state.freezeDaysAvailable <= 0 || state.activeFreeze) {
          return false;
        }

        // Can't freeze if no active streak
        if (state.streak <= 0) {
          return false;
        }

        set({
          activeFreeze: true,
          freezeStartDate: getToday(),
          freezeDaysAvailable: state.freezeDaysAvailable - 1,
          freezeDaysUsed: state.freezeDaysUsed + 1,
        });

        return true;
      },

      endStreakFreeze: () => {
        const state = get();

        if (!state.activeFreeze) return;

        // When ending freeze manually, update lastCompletedDate to yesterday
        // so the streak continues when user completes something today
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);

        set({
          activeFreeze: false,
          freezeStartDate: null,
          lastCompletedDate: yesterday.toISOString().split('T')[0],
        });
      },

      recoverStreak: () => {
        const state = get();

        // Can only recover if within recovery window and had a streak to recover
        if (!isWithinRecoveryWindow(state.lastStreakLostDate) || state.lastStreakValue <= 0) {
          return false;
        }

        // Recovery costs 1 freeze day or 100 XP
        if (state.freezeDaysAvailable > 0) {
          set({
            streak: state.lastStreakValue,
            lastStreakLostDate: null,
            lastStreakValue: 0,
            freezeDaysAvailable: state.freezeDaysAvailable - 1,
            freezeDaysUsed: state.freezeDaysUsed + 1,
          });
        } else if (state.xp >= 100) {
          set({
            streak: state.lastStreakValue,
            lastStreakLostDate: null,
            lastStreakValue: 0,
            xp: state.xp - 100,
          });
        } else {
          return false;
        }

        return true;
      },

      addFreezeDays: (days: number) => {
        const state = get();
        set({
          freezeDaysAvailable: state.freezeDaysAvailable + days,
        });
      },

      canRecoverStreak: () => {
        const state = get();
        return (
          isWithinRecoveryWindow(state.lastStreakLostDate) &&
          state.lastStreakValue > 0 &&
          (state.freezeDaysAvailable > 0 || state.xp >= 100)
        );
      },

      // Computed helpers
      getLevel: () => {
        const state = get();
        return LEVELS.find(l => l.level === state.level) || LEVELS[0];
      },

      getLevelProgress: () => {
        const state = get();
        const currentLevel = LEVELS.find(l => l.level === state.level) || LEVELS[0];
        const nextLevel = LEVELS.find(l => l.level === state.level + 1);
        
        if (!nextLevel) return 100;
        
        const progressInLevel = state.xp - currentLevel.minXP;
        const levelRange = nextLevel.minXP - currentLevel.minXP;
        
        return Math.round((progressInLevel / levelRange) * 100);
      },

      getDayProgress: () => {
        const state = get();
        const totalDays = 365; // Full year journey
        return Math.round((state.completedDays.length / totalDays) * 100);
      },

      getCompletedDaysCount: () => {
        return get().completedDays.length;
      },
    }),
    {
      name: 'revert-progress',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
