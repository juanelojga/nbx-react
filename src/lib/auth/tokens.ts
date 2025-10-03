import { jwtDecode } from "jwt-decode";

const ACCESS_TOKEN_KEY = "narbox_access_token";
const REFRESH_TOKEN_KEY = "narbox_refresh_token";

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
    console.error("Failed to save tokens:", error);
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
    console.error("Failed to get access token:", error);
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
    console.error("Failed to get refresh token:", error);
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
    console.error("Failed to clear tokens:", error);
  }
}

/**
 * Check if a JWT token is expired
 */
export function isTokenExpired(token: string): boolean {
  try {
    const decoded = jwtDecode<DecodedToken>(token);
    const currentTime = Date.now() / 1000;

    // Add 30 second buffer to refresh before actual expiration
    return decoded.exp < currentTime + 30;
  } catch (error) {
    console.error("Failed to decode token:", error);
    return true; // Treat invalid tokens as expired
  }
}

/**
 * Check if user has valid authentication
 */
export function hasValidAuth(): boolean {
  const accessToken = getAccessToken();

  if (!accessToken) {
    return false;
  }

  return !isTokenExpired(accessToken);
}
