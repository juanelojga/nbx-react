/**
 * Input Sanitization Utilities
 *
 * Provides functions to sanitize user inputs before sending to GraphQL
 * to prevent XSS and injection attacks.
 */

/**
 * Basic HTML tag stripper for simple use cases
 * For more robust sanitization, consider using DOMPurify
 */
export function stripHtml(input: string): string {
  return input.replace(/<[^>]*>/g, "");
}

/**
 * Sanitize a string input by:
 * - Trimming whitespace
 * - Removing HTML tags
 * - Normalizing unicode characters
 *
 * @param input - Raw user input string
 * @returns Sanitized string
 */
export function sanitizeInput(input: string): string {
  if (!input) return "";

  return (
    input
      // Trim whitespace
      .trim()
      // Remove HTML tags
      .replace(/<[^>]*>/g, "")
      // Normalize unicode (NFKC normalization)
      .normalize("NFKC")
  );
}

/**
 * Sanitize email input
 * @param email - Raw email input
 * @returns Sanitized email (lowercase, trimmed)
 */
export function sanitizeEmail(email: string): string {
  if (!email) return "";
  return sanitizeInput(email).toLowerCase();
}

/**
 * Sanitize a search query
 * @param query - Raw search query
 * @returns Sanitized search query
 */
export function sanitizeSearchQuery(query: string): string {
  if (!query) return "";

  return (
    sanitizeInput(query)
      // Remove special GraphQL characters that could cause issues
      .replace(/[{}\[\]()]/g, "")
      // Limit length to prevent abuse
      .slice(0, 100)
  );
}

/**
 * Validate and sanitize a number input
 * @param value - Raw input value
 * @param defaultValue - Default value if invalid
 * @param min - Minimum allowed value
 * @param max - Maximum allowed value
 * @returns Sanitized number
 */
export function sanitizeNumber(
  value: unknown,
  defaultValue: number,
  min?: number,
  max?: number
): number {
  let num: number;

  if (typeof value === "number") {
    num = value;
  } else if (typeof value === "string") {
    num = parseFloat(value);
  } else {
    return defaultValue;
  }

  if (isNaN(num) || !isFinite(num)) {
    return defaultValue;
  }

  if (min !== undefined) {
    num = Math.max(min, num);
  }

  if (max !== undefined) {
    num = Math.min(max, num);
  }

  return num;
}

/**
 * Sanitize object values recursively
 * @param obj - Object to sanitize
 * @returns Sanitized object
 */
export function sanitizeObject<T extends Record<string, unknown>>(obj: T): T {
  const result = {} as T;

  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === "string") {
      (result as Record<string, unknown>)[key] = sanitizeInput(value);
    } else if (
      typeof value === "object" &&
      value !== null &&
      !Array.isArray(value)
    ) {
      (result as Record<string, unknown>)[key] = sanitizeObject(
        value as Record<string, unknown>
      );
    } else {
      (result as Record<string, unknown>)[key] = value;
    }
  }

  return result;
}
