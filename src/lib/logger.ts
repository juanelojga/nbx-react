/**
 * Centralized logger. Errors are always emitted (this is where an error
 * tracking SDK such as Sentry would be wired in); other levels are dev-only.
 */
const isDevelopment = process.env.NODE_ENV === "development";

interface Logger {
  error: (message: string, ...args: unknown[]) => void;
  warn: (message: string, ...args: unknown[]) => void;
  info: (message: string, ...args: unknown[]) => void;
  debug: (message: string, ...args: unknown[]) => void;
}

export const logger: Logger = {
  error: (message, ...args) => {
    console.error(message, ...args);
  },
  warn: (message, ...args) => {
    if (isDevelopment) console.warn(message, ...args);
  },
  info: (message, ...args) => {
    if (isDevelopment) console.info(message, ...args);
  },
  debug: (message, ...args) => {
    if (isDevelopment) console.debug(message, ...args);
  },
};
