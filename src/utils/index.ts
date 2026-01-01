export {
  requestNotificationPermissions,
  areNotificationsEnabled,
  cancelAllPrayerNotifications,
  schedulePrayerNotifications,
  scheduleStreakReminder,
  scheduleDailyLessonReminder,
  getScheduledNotifications,
  scheduleMidnightReschedule,
  scheduleRecurringMidnightReschedule,
  handleMidnightReschedule,
  shouldRescheduleNotifications,
  markNotificationsScheduled,
  initializeNotifications,
} from './notifications';

export {
  retryWithBackoff,
  fetchWithRetry,
  fetchJsonWithRetry,
  withRetry,
  RetryPresets,
} from './networkRetry';

export type { RetryOptions } from './networkRetry';

export {
  ANIMATION_DURATION,
  EASING,
  fadeIn,
  fadeOut,
  slideInFromBottom,
  scaleAnimation,
  staggeredFadeIn,
  createPulseAnimation,
  createShimmerAnimation,
  createBreatheAnimation,
  screenTransitionConfig,
  createFadeInterpolation,
  createSlideInterpolation,
  createListItemAnimations,
  animateProgress,
} from './animations';

export {
  validateEmail,
  validatePassword,
  validatePasswordMatch,
  validateSignupForm,
  validateLoginForm,
  sanitizeEmail,
  sanitizeText,
  EMAIL_REGEX,
  PASSWORD_MIN_LENGTH,
} from './validation';

export type { ValidationResult } from './validation';

export { logger, Logger, logDebug, logInfo, logWarn, logError } from './logger';
