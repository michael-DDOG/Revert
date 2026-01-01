// Network Retry Utility
// Provides exponential backoff retry logic for network requests

export interface RetryOptions {
  maxRetries?: number;
  initialDelay?: number;
  maxDelay?: number;
  backoffFactor?: number;
  retryableStatusCodes?: number[];
  onRetry?: (attempt: number, error: Error, delay: number) => void;
}

const DEFAULT_OPTIONS: Required<Omit<RetryOptions, 'onRetry'>> = {
  maxRetries: 3,
  initialDelay: 1000, // 1 second
  maxDelay: 30000, // 30 seconds
  backoffFactor: 2,
  retryableStatusCodes: [408, 429, 500, 502, 503, 504],
};

/**
 * Calculate delay for exponential backoff with jitter
 */
const calculateDelay = (
  attempt: number,
  initialDelay: number,
  maxDelay: number,
  backoffFactor: number
): number => {
  // Exponential delay: initialDelay * (backoffFactor ^ attempt)
  const exponentialDelay = initialDelay * Math.pow(backoffFactor, attempt);

  // Add jitter (random factor between 0.5 and 1.5)
  const jitter = 0.5 + Math.random();
  const delayWithJitter = exponentialDelay * jitter;

  // Cap at maxDelay
  return Math.min(delayWithJitter, maxDelay);
};

/**
 * Sleep for a specified duration
 */
const sleep = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

/**
 * Check if an error is retryable
 */
const isRetryableError = (error: any, retryableStatusCodes: number[]): boolean => {
  // Network errors (no response)
  if (!error.response && error.message) {
    const networkErrorMessages = [
      'network request failed',
      'network error',
      'timeout',
      'econnreset',
      'econnrefused',
      'enotfound',
      'socket hang up',
    ];
    return networkErrorMessages.some((msg) =>
      error.message.toLowerCase().includes(msg)
    );
  }

  // HTTP status code errors
  if (error.response?.status) {
    return retryableStatusCodes.includes(error.response.status);
  }

  return false;
};

/**
 * Retry a function with exponential backoff
 * @param fn - The async function to retry
 * @param options - Retry configuration options
 * @returns The result of the function
 * @throws The last error if all retries fail
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const {
    maxRetries = DEFAULT_OPTIONS.maxRetries,
    initialDelay = DEFAULT_OPTIONS.initialDelay,
    maxDelay = DEFAULT_OPTIONS.maxDelay,
    backoffFactor = DEFAULT_OPTIONS.backoffFactor,
    retryableStatusCodes = DEFAULT_OPTIONS.retryableStatusCodes,
    onRetry,
  } = options;

  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error: any) {
      lastError = error;

      // Check if we should retry
      if (attempt >= maxRetries) {
        break;
      }

      if (!isRetryableError(error, retryableStatusCodes)) {
        throw error;
      }

      // Calculate delay
      const delay = calculateDelay(attempt, initialDelay, maxDelay, backoffFactor);

      // Call onRetry callback if provided
      if (onRetry) {
        onRetry(attempt + 1, error, delay);
      }

      // Wait before retrying
      await sleep(delay);
    }
  }

  throw lastError;
}

/**
 * Wrapper for fetch with retry logic
 */
export async function fetchWithRetry(
  url: string,
  fetchOptions?: RequestInit,
  retryOptions?: RetryOptions
): Promise<Response> {
  return retryWithBackoff(async () => {
    const response = await fetch(url, fetchOptions);

    // Throw for non-2xx responses so they can be retried
    if (!response.ok) {
      const error: any = new Error(`HTTP error! status: ${response.status}`);
      error.response = { status: response.status };
      throw error;
    }

    return response;
  }, retryOptions);
}

/**
 * Wrapper for fetch that parses JSON with retry logic
 */
export async function fetchJsonWithRetry<T>(
  url: string,
  fetchOptions?: RequestInit,
  retryOptions?: RetryOptions
): Promise<T> {
  const response = await fetchWithRetry(url, fetchOptions, retryOptions);
  return response.json();
}

/**
 * Create a retry-enabled version of any async function
 */
export function withRetry<T, Args extends any[]>(
  fn: (...args: Args) => Promise<T>,
  options?: RetryOptions
): (...args: Args) => Promise<T> {
  return (...args: Args) => retryWithBackoff(() => fn(...args), options);
}

/**
 * Retry configuration presets
 */
export const RetryPresets = {
  // For quick operations that should fail fast
  fast: {
    maxRetries: 2,
    initialDelay: 500,
    maxDelay: 5000,
    backoffFactor: 2,
  } as RetryOptions,

  // Standard retry for most API calls
  standard: {
    maxRetries: 3,
    initialDelay: 1000,
    maxDelay: 15000,
    backoffFactor: 2,
  } as RetryOptions,

  // For critical operations that should try harder
  persistent: {
    maxRetries: 5,
    initialDelay: 1000,
    maxDelay: 60000,
    backoffFactor: 2,
  } as RetryOptions,

  // For background operations that can wait
  patient: {
    maxRetries: 10,
    initialDelay: 2000,
    maxDelay: 120000,
    backoffFactor: 1.5,
  } as RetryOptions,
};

export default {
  retryWithBackoff,
  fetchWithRetry,
  fetchJsonWithRetry,
  withRetry,
  RetryPresets,
};
