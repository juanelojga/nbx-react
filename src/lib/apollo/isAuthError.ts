import type { GraphQLFormattedError } from "graphql";

/**
 * Messages raised by django-graphql-jwt when the access token is missing,
 * malformed or expired. Matched exactly so unrelated errors that merely
 * mention "token" never trigger a logout.
 */
const AUTH_ERROR_MESSAGES = new Set([
  "Signature has expired",
  "Error decoding signature",
  "Invalid payload",
  "Invalid token",
  "Invalid refresh token",
  "Refresh token is expired",
]);

export function isAuthError(error: GraphQLFormattedError): boolean {
  return (
    error.extensions?.code === "UNAUTHENTICATED" ||
    AUTH_ERROR_MESSAGES.has(error.message)
  );
}
