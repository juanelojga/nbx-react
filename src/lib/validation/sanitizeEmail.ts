/**
 * Normalize an email typed by a user before validation/submission:
 * trims whitespace, applies NFKC unicode normalization and lowercases.
 */
export function sanitizeEmail(email: string): string {
  if (!email) return "";
  return email.trim().normalize("NFKC").toLowerCase();
}
