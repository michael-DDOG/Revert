export {
  fetchPrayerTimes,
  getCachedPrayerTimes,
  cachePrayerTimes,
  isCacheValid,
  getNextPrayer,
  getMinutesUntilPrayer,
  formatTimeRemaining,
  hasPrayerPassed,
  formatTo12Hour,
  CALCULATION_METHODS,
} from './prayerTimesService';

export type {
  PrayerTimes,
  PrayerTimesData,
  Location,
} from './prayerTimesService';

export {
  initializeAudio,
  playAudio,
  playQuranAyah,
  pauseAudio,
  resumeAudio,
  stopAudio,
  togglePlayPause,
  seekTo,
  unloadAudio,
  playAdhan,
  setReciter,
  getCurrentReciter,
  getQuranAudioUrl,
  subscribeToAudioState,
  getAudioState,
  RECITERS,
  ADHAN_AUDIO,
} from './audioService';

export type { AudioState, ReciterKey, AdhanType } from './audioService';

// Supabase Auth
export {
  supabase,
  signUp,
  signIn,
  signOut,
  getCurrentUser,
  getSession,
  resetPassword,
  createUserProfile,
  getUserProfile,
  updateSubscriptionStatus,
  onAuthStateChange,
} from './supabase';

// RevenueCat Subscriptions
export {
  ENTITLEMENT_ID,
  PRODUCT_IDS,
  initRevenueCat,
  isRevenueCatConfigured,
  identifyUser,
  logoutUser,
  getCurrentUserId,
  getOfferings,
  getAllOfferings,
  getAvailablePackages,
  purchasePackage,
  restorePurchases,
  getCustomerInfo,
  checkPremiumAccess,
  getSubscriptionInfo,
  addCustomerInfoListener,
  getMonthlyPackage,
  getAnnualPackage,
  getLifetimePackage,
  getPackageByIdentifier,
  formatPrice,
  calculateAnnualSavings,
  presentPaywall,
  presentPaywallIfNeeded,
  PAYWALL_RESULT,
} from './revenuecat';

export type {
  PurchaseResult,
  SubscriptionInfo,
  PaywallPresentResult,
} from './revenuecat';

// Error Tracking
export {
  initErrorTracking,
  captureException,
  captureMessage,
  setUserContext,
  addBreadcrumb,
  trackScreenView,
  handleErrorBoundary,
  withErrorTracking,
} from './errorTracking';

// Quran Service
export {
  fetchSurahList,
  fetchSurah,
  fetchAyah,
  searchQuran,
  getAyahAudioUrl,
  clearQuranCache,
  TRANSLATIONS,
  RECITERS as QURAN_RECITERS,
  JUZ_INFO,
} from './quranService';

export type { TranslationKey, ReciterKey as QuranReciterKey } from './quranService';
