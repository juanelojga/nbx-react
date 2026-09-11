import { z } from "zod";

/**
 * Authentication Validation Schemas
 *
 * Uses Zod for type-safe, comprehensive validation
 * @see https://zod.dev/
 */

/**
 * Email validation schema
 * Uses Zod's built-in email validation for comprehensive RFC-compliant checks
 */
export const emailSchema = z
  .string()
  .min(1, "Email is required")
  .email("Please enter a valid email address");

/**
 * Password validation schema
 * Enforces minimum security requirements
 */
export const passwordSchema = z
  .string()
  .min(1, "Password is required")
  .min(6, "Password must be at least 6 characters");

/**
 * Validate email address
 * @param email - Email string to validate
 * @returns Object with success status and optional error message
 *
 * @example
 * ```ts
 * const result = validateEmail("user@example.com");
 * if (!result.success) {
 *   console.error(result.error);
 * }
 * ```
 */
export function validateEmail(
  email: string
): { success: true } | { success: false; error: string } {
  const result = emailSchema.safeParse(email);

  if (result.success) {
    return { success: true };
  }

  return {
    success: false,
    error: result.error.issues[0]?.message || "Invalid email address",
  };
}

/**
 * Validate password
 * @param password - Password string to validate
 * @returns Object with success status and optional error message
 */
export function validatePassword(
  password: string
): { success: true } | { success: false; error: string } {
  const result = passwordSchema.safeParse(password);

  if (result.success) {
    return { success: true };
  }

  return {
    success: false,
    error: result.error.issues[0]?.message || "Invalid password",
  };
}

