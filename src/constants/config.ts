// App Configuration Constants
// Centralized configuration for The Revert app

import Constants from 'expo-constants';

// Environment detection
export const isDev = __DEV__;
export const isProduction = !__DEV__;

// API Endpoints
export const API_CONFIG = {
  // Prayer Times API (Aladhan - free, no key required)
  PRAYER_TIMES_BASE_URL: 'https://api.aladhan.com/v1',

  // Quran Audio CDN (everyayah.com - free, no key required)
  QURAN_AUDIO_BASE_URL: 'https://everyayah.com/data',

  // Adhan Audio CDN
  ADHAN_AUDIO_BASE_URL: 'https://download.quranicaudio.com/adhan',
} as const;

// Supabase Configuration (from app.json extra)
export const SUPABASE_CONFIG = {
  url: Constants.expoConfig?.extra?.supabaseUrl || '',
  anonKey: Constants.expoConfig?.extra?.supabaseAnonKey || '',
} as const;

// RevenueCat Configuration
export const REVENUECAT_CONFIG = {
  apiKey: Constants.expoConfig?.extra?.revenuecatApiKey || '',
  entitlementId: 'Revert Pro',
  productIds: {
    monthly: 'monthly',
    yearly: 'yearly',
    lifetime: 'lifetime',
  },
} as const;

// Anthropic (Claude) API Configuration
export const ANTHROPIC_CONFIG = {
  apiKey: Constants.expoConfig?.extra?.anthropicApiKey || '',
  model: 'claude-3-haiku-20240307', // Fast and cost-effective for chat
  maxTokens: 1024,
  dailyFreeQueries: 20, // Rate limit for free users
} as const;

// App Limits & Thresholds
export const APP_LIMITS = {
  // Trial
  TRIAL_DAYS: 7,

  // Streak
  STREAK_FREEZE_DURATION_HOURS: 24,
  STREAK_RECOVERY_WINDOW_HOURS: 48,

  // Cache
  PRAYER_TIMES_CACHE_HOURS: 24,

  // Notifications
  MAX_SCHEDULED_NOTIFICATIONS: 64,
  NOTIFICATION_ADVANCE_MINUTES: 5,

  // Network
  API_TIMEOUT_MS: 10000,
  MAX_RETRY_ATTEMPTS: 3,

  // Journey
  TOTAL_JOURNEY_DAYS: 120,
  DAYS_PER_TRACK: 30,
} as const;

// Gamification Settings
export const GAMIFICATION = {
  // XP rewards
  XP_COMPLETE_DAY: 50,
  XP_COMPLETE_PRAYER: 10,
  XP_STREAK_BONUS_MULTIPLIER: 0.1, // 10% bonus per streak day

  // Levels
  XP_PER_LEVEL: 500,
  MAX_LEVEL: 100,

  // Streaks
  STREAK_MILESTONE_DAYS: [7, 30, 60, 90, 180, 365],
} as const;

// Prayer Calculation Methods
export const PRAYER_METHODS = {
  MUSLIM_WORLD_LEAGUE: 3,
  ISNA: 2,
  EGYPT: 5,
  MAKKAH: 4,
  KARACHI: 1,
  TEHRAN: 7,
  JAFARI: 0,
} as const;

// Default Settings
export const DEFAULT_SETTINGS = {
  // Notifications
  prayerNotifications: true,
  adhanSound: true,
  streakReminders: true,
  dailyReminders: true,

  // Prayer
  calculationMethod: PRAYER_METHODS.ISNA,
  adjustHighLatitude: true,

  // Display
  use24HourFormat: false,
  showHijriDate: true,
} as const;

// Storage Keys
export const STORAGE_KEYS = {
  // Onboarding
  ONBOARDING_COMPLETE: 'revert-onboarding-complete',
  ONBOARDING_DATA: 'revert-onboarding-data',

  // User
  USER_PROFILE: 'revert-user-profile',
  AUTH_TOKEN: 'revert-auth-token',

  // Progress
  PROGRESS_DATA: 'revert-progress',
  STREAK_DATA: 'revert-streak',

  // Settings
  SETTINGS: 'revert-settings',
  NOTIFICATION_IDS: 'revert-notification-ids',

  // Cache
  PRAYER_TIMES_CACHE: 'revert-prayer-times',
  LAST_LOCATION: 'revert-last-location',

  // Subscription
  SUBSCRIPTION_STATUS: 'revert-subscription',
} as const;

// App Info
export const APP_INFO = {
  name: 'The Revert',
  version: Constants.expoConfig?.version || '1.0.0',
  buildNumber: Constants.expoConfig?.ios?.buildNumber || '1',
  bundleId: 'com.therevert.app',

  // Support
  supportEmail: 'support@therevert.app',
  privacyEmail: 'privacy@therevert.app',

  // Links (for when you have a website)
  websiteUrl: 'https://therevert.app',
  privacyUrl: 'https://therevert.app/privacy',
  termsUrl: 'https://therevert.app/terms',
} as const;

// Feature Flags (for gradual rollout)
export const FEATURE_FLAGS = {
  enableQuranAudio: false, // Set to true when ready
  enableAdvancedTracks: false,
  enableCommunityFeatures: false,
  enableOfflineMode: true,
  enableErrorTracking: isProduction,
} as const;
