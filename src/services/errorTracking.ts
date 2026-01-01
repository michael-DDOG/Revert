// Error Tracking Service
// Abstraction for error tracking that can be configured with Sentry, LogRocket, etc.

interface ErrorContext {
  screen?: string;
  action?: string;
  userId?: string;
  extra?: Record<string, any>;
}

interface ErrorTrackingConfig {
  enabled: boolean;
  dsn?: string;
  environment: 'development' | 'staging' | 'production';
}

let config: ErrorTrackingConfig = {
  enabled: false,
  environment: __DEV__ ? 'development' : 'production',
};

// Initialize error tracking (call this early in app startup)
export const initErrorTracking = async (options: Partial<ErrorTrackingConfig> = {}): Promise<void> => {
  config = { ...config, ...options };

  if (!config.enabled || __DEV__) {
    console.log('[ErrorTracking] Disabled in development mode');
    return;
  }

  // TODO: Initialize your error tracking service here
  // Example with Sentry:
  // import * as Sentry from '@sentry/react-native';
  // Sentry.init({
  //   dsn: config.dsn,
  //   environment: config.environment,
  //   enableAutoSessionTracking: true,
  //   sessionTrackingIntervalMillis: 30000,
  // });

  console.log('[ErrorTracking] Initialized');
};

// Capture an exception
export const captureException = (
  error: Error | unknown,
  context?: ErrorContext
): void => {
  if (!config.enabled) {
    // In development, just log to console
    console.error('[ErrorTracking]', error, context);
    return;
  }

  // TODO: Send to your error tracking service
  // Example with Sentry:
  // Sentry.captureException(error, {
  //   tags: {
  //     screen: context?.screen,
  //     action: context?.action,
  //   },
  //   user: context?.userId ? { id: context.userId } : undefined,
  //   extra: context?.extra,
  // });
};

// Capture a message (for non-error events)
export const captureMessage = (
  message: string,
  level: 'info' | 'warning' | 'error' = 'info',
  context?: ErrorContext
): void => {
  if (!config.enabled) {
    console.log(`[ErrorTracking] ${level}: ${message}`, context);
    return;
  }

  // TODO: Send to your error tracking service
  // Example with Sentry:
  // Sentry.captureMessage(message, {
  //   level: level as Sentry.SeverityLevel,
  //   tags: {
  //     screen: context?.screen,
  //     action: context?.action,
  //   },
  // });
};

// Set user context
export const setUserContext = (userId: string | null): void => {
  if (!config.enabled) return;

  // TODO: Set user in your error tracking service
  // Example with Sentry:
  // if (userId) {
  //   Sentry.setUser({ id: userId });
  // } else {
  //   Sentry.setUser(null);
  // }
};

// Add breadcrumb for debugging
export const addBreadcrumb = (
  category: string,
  message: string,
  data?: Record<string, any>
): void => {
  if (!config.enabled) return;

  // TODO: Add breadcrumb to your error tracking service
  // Example with Sentry:
  // Sentry.addBreadcrumb({
  //   category,
  //   message,
  //   data,
  //   level: 'info',
  // });
};

// Navigation tracking
export const trackScreenView = (screenName: string): void => {
  addBreadcrumb('navigation', `Viewed screen: ${screenName}`);
};

// Performance monitoring
export const startTransaction = (name: string, op: string) => {
  if (!config.enabled) return null;

  // TODO: Start performance transaction
  // Example with Sentry:
  // return Sentry.startTransaction({ name, op });
  return null;
};

// Error boundary helper
export const handleErrorBoundary = (
  error: Error,
  componentStack: string | null
): void => {
  captureException(error, {
    action: 'error_boundary',
    extra: { componentStack },
  });
};

// Wrap async functions with error tracking
export const withErrorTracking = <T extends (...args: any[]) => Promise<any>>(
  fn: T,
  context: ErrorContext
): T => {
  return (async (...args: Parameters<T>) => {
    try {
      return await fn(...args);
    } catch (error) {
      captureException(error, context);
      throw error;
    }
  }) as T;
};

export default {
  init: initErrorTracking,
  captureException,
  captureMessage,
  setUserContext,
  addBreadcrumb,
  trackScreenView,
  startTransaction,
  handleErrorBoundary,
  withErrorTracking,
};
