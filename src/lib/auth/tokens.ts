import { jwtDecode } from "jwt-decode";

import { logger } from "@/lib/logger";

const ACCESS_TOKEN_KEY = "narbox_access_token";
const REFRESH_TOKEN_KEY = "narbox_refresh_token";
const REFRESH_TOKEN_EXPIRES_AT_KEY = "narbox_refresh_token_expires_at";

/**
 * Seconds before the real expiry at which an access token is treated as
 * expired, so it is refreshed before a request can fail mid-flight.
 */
export const TOKEN_REFRESH_BUFFER_SECONDS = 30;

interface DecodedToken {
  exp: number;
  [key: string]: unknown;
}

function getStorage(): Storage | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

function read(key: string): string | null {
  try {
    return getStorage()?.getItem(key) ?? null;
  } catch (error) {
    logger.error(`Failed to read ${key} from storage`, error);
    return null;
  }
}

/**
 * Persist the token pair. The refresh token is opaque, so its expiry is
 * stored as an absolute timestamp derived from `refreshExpiresIn` (seconds).
 */
export function saveTokens(
  accessToken: string,
  refreshToken: string,
  refreshExpiresIn?: number
): void {
  const storage = getStorage();
  if (!storage) return;

  try {
    storage.setItem(ACCESS_TOKEN_KEY, accessToken);
    storage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    if (refreshExpiresIn && refreshExpiresIn > 0) {
      storage.setItem(
        REFRESH_TOKEN_EXPIRES_AT_KEY,
        String(Date.now() + refreshExpiresIn * 1000)
      );
    } else {
      storage.removeItem(REFRESH_TOKEN_EXPIRES_AT_KEY);
    }
  } catch (error) {
    logger.error("Failed to save tokens", error);
  }
}

export function getAccessToken(): string | null {
  return read(ACCESS_TOKEN_KEY);
}

export function getRefreshToken(): string | null {
  return read(REFRESH_TOKEN_KEY);
}

export function clearTokens(): void {
  const storage = getStorage();
  if (!storage) return;

  try {
    storage.removeItem(ACCESS_TOKEN_KEY);
    storage.removeItem(REFRESH_TOKEN_KEY);
    storage.removeItem(REFRESH_TOKEN_EXPIRES_AT_KEY);
  } catch (error) {
    logger.error("Failed to clear tokens", error);
  }
}

/**
 * Whether a JWT access token is expired (or will be within `bufferSeconds`).
 * Undecodable tokens are treated as expired.
 */
export function isTokenExpired(
  token: string,
  bufferSeconds = TOKEN_REFRESH_BUFFER_SECONDS
): boolean {
  try {
    const decoded = jwtDecode<DecodedToken>(token);
    return decoded.exp < Date.now() / 1000 + bufferSeconds;
  } catch (error) {
    logger.error("Failed to decode token", error);
    return true;
  }
}

/**
 * Whether the stored refresh token is expired. Fails closed: a refresh token
 * without a stored expiry timestamp is considered expired.
 */
export function isRefreshTokenExpired(): boolean {
  if (!getRefreshToken()) return true;

  const expiresAt = Number.parseInt(
    read(REFRESH_TOKEN_EXPIRES_AT_KEY) ?? "",
    10
  );
  if (Number.isNaN(expiresAt)) return true;

  return expiresAt < Date.now();
}
