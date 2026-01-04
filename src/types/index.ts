// Core Types - The Revert App

// Auth & Subscription Types
export type {
  User,
  UserProfile,
  SubscriptionStatus,
  AuthError,
  AuthState,
  SubscriptionPackage,
} from './auth';

// ============================================
// JOURNEY & CONTENT TYPES
// ============================================

export interface Day {
  id: number;
  title: string;
  description: string;
  guidance: string;
  reflection: string;
}

export interface Track {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  daysRange: [number, number]; // [start, end]
  isLocked: boolean;
  requiredLevel?: number;
}

// ============================================
// GAMIFICATION TYPES
// ============================================

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: BadgeCategory;
  requirement: BadgeRequirement;
  unlockedAt?: string;
}

export type BadgeCategory = 
  | 'journey'      // Day milestones
  | 'prayer'       // Prayer achievements
  | 'quran'        // Quran learning
  | 'community'    // Social achievements
  | 'seasonal'     // Ramadan, Eid, etc.
  | 'streak';      // Consistency

export interface BadgeRequirement {
  type: 'days_completed' | 'streak' | 'prayers' | 'surahs_memorized' | 'special';
  value: number;
}

export interface Level {
  level: number;
  title: string;
  titleArabic: string;
  minXP: number;
  maxXP: number;
  icon: string;
}

// ============================================
// PRAYER TRACKING TYPES
// ============================================

export type PrayerName = 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha';

export interface PrayerLog {
  date: string;
  fajr: boolean;
  dhuhr: boolean;
  asr: boolean;
  maghrib: boolean;
  isha: boolean;
}

// ============================================
// PROGRESS STATE
// ============================================

export interface ProgressState {
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
}

// ============================================
// DAILY CONTENT TYPES
// ============================================

export interface AyahOfDay {
  id: string;
  arabic: string;
  transliteration: string;
  translation: string;
  surah: string;
  surahNumber: number;
  ayahNumber: number;
  reflection: string;
}

export interface HadithOfDay {
  id: string;
  arabic: string;
  translation: string;
  narrator: string;
  source: string;
  grade: 'sahih' | 'hasan' | 'daif';
  topic: string;
}

export interface DuaOfDay {
  id: string;
  arabic: string;
  transliteration: string;
  translation: string;
  occasion: string;
  source: string;
  benefits?: string;
}

export interface NameOfAllah {
  number: number;
  arabic: string;
  transliteration: string;
  meaning: string;
  explanation: string;
}

// ============================================
// PRAYER TIMES
// ============================================

export interface PrayerTimes {
  date: string;
  fajr: string;
  sunrise: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
  location: string;
}

// ============================================
// NAVIGATION TYPES
// ============================================

export type RootStackParamList = {
  Onboarding: undefined;
  MainTabs: undefined;
};

export type TabParamList = {
  Home: undefined;
  Journey: undefined;
  Learn: undefined;
  Prayer: undefined;
  Profile: undefined;
};

export type JourneyStackParamList = {
  JourneyList: undefined;
  DayDetail: { dayId: number };
  TrackOverview: { trackId: string };
};

export type LearnStackParamList = {
  LearnHome: undefined;
  PrayerGuide: undefined;
  WuduGuide: undefined;
  DuaLibrary: undefined;
  QuranBasics: undefined;
};

// ============================================
// USER PREFERENCES
// ============================================

export interface UserPreferences {
  // Notifications
  prayerReminders: boolean;
  dailyLessonReminder: boolean;
  streakReminder: boolean;
  
  // Display
  arabicFontSize: 'small' | 'medium' | 'large';
  showTransliteration: boolean;
  
  // Prayer calculation
  prayerCalculationMethod: string;
  asrCalculation: 'standard' | 'hanafi';
  
  // Localization
  language: string;
  timezone: string;
}

// ============================================
// QURAN TYPES
// ============================================

export interface Surah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: 'Meccan' | 'Medinan';
}

export interface Ayah {
  number: number;
  numberInSurah: number;
  text: string;
  juz: number;
  page: number;
}

export interface AyahWithTranslation extends Ayah {
  translation: string;
  transliteration?: string;
  audioUrl?: string;
}

export interface SurahFull extends Surah {
  ayahs: AyahWithTranslation[];
}

// Word-by-Word Types (from Quran.com API)
export interface QuranWord {
  id: number;
  position: number;
  text_uthmani: string;
  text_simple?: string;
  translation: {
    text: string;
    language_name: string;
  };
  transliteration: {
    text: string;
  };
  audio_url?: string;
}

export interface AyahWithWords extends AyahWithTranslation {
  words: QuranWord[];
}

export interface SurahWithWords extends Surah {
  ayahs: AyahWithWords[];
}

export interface QuranBookmark {
  id: string;
  surahNumber: number;
  surahName: string;
  ayahNumber: number;
  ayahText: string;
  translation: string;
  createdAt: string;
  note?: string;
}

export interface QuranReadingProgress {
  lastSurahNumber: number;
  lastAyahNumber: number;
  lastReadAt: string;
  completedSurahs: number[];
  totalAyahsRead: number;
}

export interface QuranState {
  // Reading progress
  readingProgress: QuranReadingProgress;
  bookmarks: QuranBookmark[];

  // Settings
  showTransliteration: boolean;
  showArabic: boolean;
  showWordByWord: boolean;
  arabicFontSize: number;
  translationFontSize: number;
  wordByWordFontSize: number;
  selectedReciter: string;
  selectedTranslation: string;

  // Actions
  updateReadingProgress: (surahNumber: number, ayahNumber: number) => void;
  markSurahComplete: (surahNumber: number) => void;
  addBookmark: (bookmark: Omit<QuranBookmark, 'id' | 'createdAt'>) => void;
  removeBookmark: (id: string) => void;
  setShowTransliteration: (show: boolean) => void;
  setShowArabic: (show: boolean) => void;
  setShowWordByWord: (show: boolean) => void;
  setArabicFontSize: (size: number) => void;
  setTranslationFontSize: (size: number) => void;
  setWordByWordFontSize: (size: number) => void;
  setSelectedReciter: (reciter: string) => void;
  setSelectedTranslation: (translation: string) => void;
  resetQuranProgress: () => void;
}

// ============================================
// API RESPONSE TYPES
// ============================================

export interface ApiPrayerTimesResponse {
  code: number;
  status: string;
  data: {
    timings: {
      Fajr: string;
      Sunrise: string;
      Dhuhr: string;
      Asr: string;
      Maghrib: string;
      Isha: string;
    };
    date: {
      readable: string;
      hijri: {
        date: string;
        month: { en: string; ar: string };
        year: string;
      };
    };
  };
}

export interface ApiQuranSurahListResponse {
  code: number;
  status: string;
  data: Surah[];
}

export interface ApiQuranSurahResponse {
  code: number;
  status: string;
  data: {
    number: number;
    name: string;
    englishName: string;
    englishNameTranslation: string;
    revelationType: string;
    numberOfAyahs: number;
    ayahs: {
      number: number;
      text: string;
      numberInSurah: number;
      juz: number;
      page: number;
    }[];
  };
}
