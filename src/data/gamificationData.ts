// Gamification Data - Levels, Badges, XP System
// Real meaningful progression for new Muslims

import { Level, Badge } from '../types';

// ============================================
// LEVELS (10 Total)
// ============================================
export const LEVELS: Level[] = [
  {
    level: 1,
    title: 'Seeker',
    titleArabic: 'الباحث',
    minXP: 0,
    maxXP: 99,
    icon: '🌱',
  },
  {
    level: 2,
    title: 'Student',
    titleArabic: 'الطالب',
    minXP: 100,
    maxXP: 249,
    icon: '📖',
  },
  {
    level: 3,
    title: 'Learner',
    titleArabic: 'المتعلم',
    minXP: 250,
    maxXP: 499,
    icon: '✨',
  },
  {
    level: 4,
    title: 'Devoted',
    titleArabic: 'المخلص',
    minXP: 500,
    maxXP: 999,
    icon: '🤲',
  },
  {
    level: 5,
    title: 'Committed',
    titleArabic: 'الملتزم',
    minXP: 1000,
    maxXP: 1999,
    icon: '💎',
  },
  {
    level: 6,
    title: 'Faithful',
    titleArabic: 'المؤمن',
    minXP: 2000,
    maxXP: 3999,
    icon: '🕌',
  },
  {
    level: 7,
    title: 'Steadfast',
    titleArabic: 'الثابت',
    minXP: 4000,
    maxXP: 6999,
    icon: '⭐',
  },
  {
    level: 8,
    title: 'Guided',
    titleArabic: 'المهتدي',
    minXP: 7000,
    maxXP: 11999,
    icon: '🌟',
  },
  {
    level: 9,
    title: 'Enlightened',
    titleArabic: 'المستنير',
    minXP: 12000,
    maxXP: 19999,
    icon: '🌙',
  },
  {
    level: 10,
    title: 'Servant of the Most Merciful',
    titleArabic: 'عبد الرحمن',
    minXP: 20000,
    maxXP: Infinity,
    icon: '👑',
  },
];

// ============================================
// BADGES
// ============================================
export const BADGES: Badge[] = [
  // Journey Badges
  {
    id: 'first_step',
    title: 'First Step',
    description: 'Completed your first day of the journey',
    icon: '🌱',
    category: 'journey',
    requirement: { type: 'days_completed', value: 1 },
  },
  {
    id: 'week_warrior',
    title: 'Week Warrior',
    description: 'Completed 7 days of learning',
    icon: '🔥',
    category: 'journey',
    requirement: { type: 'days_completed', value: 7 },
  },
  {
    id: 'two_weeks',
    title: 'Halfway There',
    description: 'Completed 14 days - halfway through Foundation!',
    icon: '⭐',
    category: 'journey',
    requirement: { type: 'days_completed', value: 14 },
  },
  {
    id: 'three_weeks',
    title: 'Almost There',
    description: 'Completed 21 days - the finish line is near!',
    icon: '💫',
    category: 'journey',
    requirement: { type: 'days_completed', value: 21 },
  },
  {
    id: 'journey_complete',
    title: 'Journey Complete',
    description: 'Completed the 30-day Foundation track',
    icon: '🏆',
    category: 'journey',
    requirement: { type: 'days_completed', value: 30 },
  },
  {
    id: 'prayer_master',
    title: 'Prayer Established',
    description: 'Completed the 60-day Prayer track',
    icon: '🤲',
    category: 'journey',
    requirement: { type: 'days_completed', value: 60 },
  },
  {
    id: 'quran_student',
    title: 'Student of Quran',
    description: 'Completed the 90-day Quran track',
    icon: '📖',
    category: 'journey',
    requirement: { type: 'days_completed', value: 90 },
  },
  {
    id: 'half_year',
    title: 'Six Month Scholar',
    description: 'Completed 180 days of learning',
    icon: '🎓',
    category: 'journey',
    requirement: { type: 'days_completed', value: 180 },
  },
  {
    id: 'full_year',
    title: 'Year of Faith',
    description: 'Completed a full year of the journey',
    icon: '👑',
    category: 'journey',
    requirement: { type: 'days_completed', value: 365 },
  },

  // Streak Badges
  {
    id: 'streak_week',
    title: 'Consistent Soul',
    description: '7-day streak - consistency is key!',
    icon: '🔥',
    category: 'streak',
    requirement: { type: 'streak', value: 7 },
  },
  {
    id: 'streak_month',
    title: 'Devoted Heart',
    description: '30-day streak - mashaAllah!',
    icon: '💚',
    category: 'streak',
    requirement: { type: 'streak', value: 30 },
  },
  {
    id: 'streak_century',
    title: 'Unbreakable',
    description: '100-day streak - truly steadfast',
    icon: '💎',
    category: 'streak',
    requirement: { type: 'streak', value: 100 },
  },

  // Prayer Badges
  {
    id: 'first_prayer',
    title: 'First Prayer',
    description: 'Logged your first prayer',
    icon: '🕌',
    category: 'prayer',
    requirement: { type: 'prayers', value: 1 },
  },
  {
    id: 'hundred_prayers',
    title: 'Prayer Habit',
    description: 'Logged 100 prayers',
    icon: '✨',
    category: 'prayer',
    requirement: { type: 'prayers', value: 100 },
  },
  {
    id: 'devoted_worshipper',
    title: 'Devoted Worshipper',
    description: 'Logged 500 prayers',
    icon: '🌟',
    category: 'prayer',
    requirement: { type: 'prayers', value: 500 },
  },
  {
    id: 'thousand_prayers',
    title: "Mu'min",
    description: 'Logged 1000 prayers - a true believer',
    icon: '🏆',
    category: 'prayer',
    requirement: { type: 'prayers', value: 1000 },
  },

  // Quran Badges
  {
    id: 'fatiha_memorized',
    title: 'Al-Fatiha Memorized',
    description: 'Memorized the opening chapter',
    icon: '📖',
    category: 'quran',
    requirement: { type: 'surahs_memorized', value: 1 },
  },
  {
    id: 'three_quls',
    title: 'The Three Quls',
    description: 'Memorized Al-Ikhlas, Al-Falaq, An-Nas',
    icon: '🛡️',
    category: 'quran',
    requirement: { type: 'surahs_memorized', value: 4 },
  },
  {
    id: 'last_ten',
    title: 'Last Ten',
    description: 'Memorized the last 10 surahs',
    icon: '⭐',
    category: 'quran',
    requirement: { type: 'surahs_memorized', value: 10 },
  },

  // Seasonal Badges
  {
    id: 'first_ramadan',
    title: 'First Ramadan',
    description: 'Experienced your first Ramadan as a Muslim',
    icon: '🌙',
    category: 'seasonal',
    requirement: { type: 'special', value: 1 },
  },
  {
    id: 'first_eid',
    title: 'Eid Mubarak',
    description: 'Celebrated your first Eid',
    icon: '🎉',
    category: 'seasonal',
    requirement: { type: 'special', value: 1 },
  },
  {
    id: 'first_jummah',
    title: 'First Jummah',
    description: 'Attended your first Friday prayer',
    icon: '🕌',
    category: 'seasonal',
    requirement: { type: 'special', value: 1 },
  },

  // Community Badges
  {
    id: 'mosque_visit',
    title: 'House of Allah',
    description: 'Visited a mosque for the first time',
    icon: '🕌',
    category: 'community',
    requirement: { type: 'special', value: 1 },
  },
  {
    id: 'helper',
    title: 'Helping Hand',
    description: 'Helped another revert on their journey',
    icon: '🤝',
    category: 'community',
    requirement: { type: 'special', value: 1 },
  },
];

// ============================================
// XP REWARDS
// ============================================
export const XP_REWARDS = {
  // Daily activities
  completeDay: 50,
  firstDayBonus: 20,
  streakBonus: (days: number) => Math.min(days * 10, 100),
  
  // Prayers
  logPrayer: 10,
  allFivePrayers: 25,
  
  // Badges
  unlockBadge: 25,
  
  // Special
  firstRamadan: 500,
  firstEid: 200,
  firstJummah: 100,
};

// ============================================
// HELPER FUNCTIONS
// ============================================
export const calculateLevel = (xp: number): number => {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (xp >= LEVELS[i].minXP) {
      return LEVELS[i].level;
    }
  }
  return 1;
};

export const getLevelInfo = (level: number): Level => {
  return LEVELS.find(l => l.level === level) || LEVELS[0];
};

export const getNextLevelXP = (currentLevel: number): number => {
  const nextLevel = LEVELS.find(l => l.level === currentLevel + 1);
  return nextLevel ? nextLevel.minXP : Infinity;
};

export const getBadgeById = (id: string): Badge | undefined => {
  return BADGES.find(b => b.id === id);
};

export const getBadgesByCategory = (category: Badge['category']): Badge[] => {
  return BADGES.filter(b => b.category === category);
};
