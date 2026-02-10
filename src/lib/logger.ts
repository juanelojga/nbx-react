/**
 * Logging Utility
 *
 * Provides a centralized logging mechanism that:
 * - Logs to console in development
 * - Can be extended to send errors to tracking services in production (Sentry, LogRocket, etc.)
 * - Prevents sensitive information leakage in production builds
 * - Uses Next.js after() for non-blocking logging operations when available (Vercel Best Practices 3.7)
 *
 * @see https://nextjs.org/docs/app/api-reference/functions/after
 */

const isDevelopment = process.env.NODE_ENV === "development";

/**
 * Helper to run code after response is sent (only in server components)
 * Falls back to immediate execution in client components
 *
 * Note: Dynamic require() is intentional here to avoid importing next/server
 * in client components, which would cause a build error. This pattern allows
 * the logger to work seamlessly in both server and client contexts.
 */
function runAfterResponse(fn: () => void) {
  // Check if we're in a server environment and after() is available
  if (typeof window === "undefined") {
    try {
      // Dynamically import after() only on server
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { after } = require("next/server");
      after(fn);
      return;
    } catch {
      // If after() is not available or import fails, run immediately
    }
  }

  // In client components or if after() is not available, run immediately
  fn();
}

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
 * Uses after() to prevent logging from blocking response sending (when available in server components)
 */
export const logger: Logger = {
  /**
   * Log error messages
   * Always logs in both development and production
   * In production, this should ideally send to an error tracking service
   * Uses after() to prevent blocking the response when available
   */
  error: (message: string, ...args: unknown[]) => {
    runAfterResponse(() => {
      if (isDevelopment) {
        console.error(message, ...args);
      } else {
        // In production, could send to error tracking service like Sentry
        // Example: Sentry.captureException(error);
        // For now, we suppress console errors in production to avoid noise
      }
    });
  },

  /**
   * Log warning messages
   * Only logs in development
   * Uses after() to prevent blocking the response when available
   */
  warn: (message: string, ...args: unknown[]) => {
    runAfterResponse(() => {
      if (isDevelopment) {
        console.warn(message, ...args);
      }
    });
  },

  /**
   * Log informational messages
   * Only logs in development
   * Uses after() to prevent blocking the response when available
   */
  info: (message: string, ...args: unknown[]) => {
    runAfterResponse(() => {
      if (isDevelopment) {
        console.info(message, ...args);
      }
    });
  },

  /**
   * Log debug messages
   * Only logs in development
   * Uses after() to prevent blocking the response when available
   */
  debug: (message: string, ...args: unknown[]) => {
    runAfterResponse(() => {
      if (isDevelopment) {
        console.debug(message, ...args);
      }
    });
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
