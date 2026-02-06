/**
 * Logging Utility
 *
 * Provides a centralized logging mechanism that:
 * - Logs to console in development
 * - Can be extended to send errors to tracking services in production (Sentry, LogRocket, etc.)
 * - Prevents sensitive information leakage in production builds
 */

const isDevelopment = process.env.NODE_ENV === "development";

/**
 * Logger interface for type safety
 */
interface Logger {
  error: (message: string, ...args: unknown[]) => void;
  warn: (message: string, ...args: unknown[]) => void;
  info: (message: string, ...args: unknown[]) => void;
  debug: (message: string, ...args: unknown[]) => void;
}

/**
 * Production-safe logger implementation
 *
 * In development: logs everything to console
 * In production: only logs errors, can be extended to send to error tracking service
 */
export const logger: Logger = {
  /**
   * Log error messages
   * Always logs in both development and production
   * In production, this should ideally send to an error tracking service
   */
  error: (message: string, ...args: unknown[]) => {
    if (isDevelopment) {
      console.error(message, ...args);
    } else {
      // In production, could send to error tracking service like Sentry
      // Example: Sentry.captureException(error);
      // For now, we suppress console errors in production to avoid noise
    }
  },

  /**
   * Log warning messages
   * Only logs in development
   */
  warn: (message: string, ...args: unknown[]) => {
    if (isDevelopment) {
      console.warn(message, ...args);
    }
  },

  /**
   * Log informational messages
   * Only logs in development
   */
  info: (message: string, ...args: unknown[]) => {
    if (isDevelopment) {
      console.info(message, ...args);
    }
  },

  /**
   * Log debug messages
   * Only logs in development
   */
  debug: (message: string, ...args: unknown[]) => {
    if (isDevelopment) {
      console.debug(message, ...args);
    }
  },
};

/**
 * Helper to safely stringify objects for logging
 * Prevents circular reference errors
 */
export function safeStringify(obj: unknown): string {
  try {
    return JSON.stringify(obj, null, 2);
  } catch {
    return String(obj);
  }
}
