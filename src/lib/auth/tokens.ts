import { jwtDecode } from "jwt-decode";
import { logger } from "@/lib/logger";

const ACCESS_TOKEN_KEY = "narbox_access_token";
const REFRESH_TOKEN_KEY = "narbox_refresh_token";

/**
 * Buffer time (in seconds) before token expiration to treat it as expired.
 * This ensures we refresh the token before it actually expires to avoid race conditions.
 */
export const TOKEN_REFRESH_BUFFER_SECONDS = 30;

interface DecodedToken {
  exp: number;
  [key: string]: unknown;
}

/**
 * Check if code is running in browser (SSR safety)
 */
const isBrowser = typeof window !== "undefined";

/**
 * Save authentication tokens to localStorage
 */
export function saveTokens(accessToken: string, refreshToken: string): void {
  if (!isBrowser) return;

  try {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  } catch (error) {
    logger.error("Failed to save tokens:", error);
  }
}

/**
 * Get access token from localStorage
 */
export function getAccessToken(): string | null {
  if (!isBrowser) return null;

  try {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  } catch (error) {
    logger.error("Failed to get access token:", error);
    return null;
  }
}

/**
 * Get refresh token from localStorage
 */
export function getRefreshToken(): string | null {
  if (!isBrowser) return null;

  try {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  } catch (error) {
    logger.error("Failed to get refresh token:", error);
    return null;
  }
}

/**
 * Clear all authentication tokens from localStorage
 */
export function clearTokens(): void {
  if (!isBrowser) return;

  try {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  } catch (error) {
    logger.error("Failed to clear tokens:", error);
  }
}

/**
 * Check if a JWT token is expired
 * @param token - The JWT token to check
 * @param bufferSeconds - Seconds before actual expiration to treat as expired (default: 30)
 */
export function isTokenExpired(
  token: string,
  bufferSeconds = TOKEN_REFRESH_BUFFER_SECONDS
): boolean {
  try {
    const decoded = jwtDecode<DecodedToken>(token);
    const currentTime = Date.now() / 1000;

    return decoded.exp < currentTime + bufferSeconds;
  } catch (error) {
    logger.error("Failed to decode token:", error);
    return true; // Treat invalid tokens as expired
  }
}

/**
 * Check if refresh token is expired
 */
export function isRefreshTokenExpired(): boolean {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return true;

  try {
    const decoded = jwtDecode<DecodedToken>(refreshToken);
    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime;
  } catch {
    return true;
  }
}

/**
 * Check if user has valid authentication
 */
export function hasValidAuth(): boolean {
  const accessToken = getAccessToken();
  const refreshToken = getRefreshToken();

  if (!accessToken || !refreshToken) {
    return false;
  }

  // If access token is expired but refresh token is valid, we can still recover
  if (isTokenExpired(accessToken) && isRefreshTokenExpired()) {
    return false;
  }

  return true;
}
