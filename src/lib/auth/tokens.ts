import { jwtDecode } from "jwt-decode";
import { logger } from "@/lib/logger";

const ACCESS_TOKEN_KEY = "narbox_access_token";
const REFRESH_TOKEN_KEY = "narbox_refresh_token";
const REFRESH_TOKEN_EXPIRES_AT_KEY = "narbox_refresh_token_expires_at";
const STORAGE_VERSION_KEY = "narbox_storage_version";

/**
 * Current localStorage schema version
 * Increment this when making breaking changes to localStorage structure
 */
const CURRENT_STORAGE_VERSION = 1;

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
 * In-memory cache for localStorage values to reduce read operations
 * This cache is cleared on token updates to ensure consistency
 */
interface TokenCache {
  accessToken: string | null;
  refreshToken: string | null;
  refreshTokenExpiresAt: string | null;
  lastUpdated: number;
}

let tokenCache: TokenCache | null = null;
const CACHE_TTL_MS = 5000; // Cache valid for 5 seconds (in milliseconds)

/**
 * Check if the cache is still valid
 */
function isCacheValid(): boolean {
  if (!tokenCache) return false;
  return Date.now() - tokenCache.lastUpdated < CACHE_TTL_MS;
}

/**
 * Invalidate the token cache
 */
function invalidateCache(): void {
  tokenCache = null;
}

/**
 * Update the cache with current localStorage values
 */
function updateCache(): void {
  if (!isBrowser) return;

  try {
    tokenCache = {
      accessToken: localStorage.getItem(ACCESS_TOKEN_KEY),
      refreshToken: localStorage.getItem(REFRESH_TOKEN_KEY),
      refreshTokenExpiresAt: localStorage.getItem(REFRESH_TOKEN_EXPIRES_AT_KEY),
      lastUpdated: Date.now(),
    };
  } catch (error) {
    logger.error("Failed to update token cache:", error);
    tokenCache = null;
  }
}

/**
 * Initialize localStorage versioning and handle migrations
 */
function initializeStorage(): void {
  if (!isBrowser) return;

  try {
    const storedVersion = localStorage.getItem(STORAGE_VERSION_KEY);
    const version = storedVersion ? parseInt(storedVersion, 10) : 0;

    if (version < CURRENT_STORAGE_VERSION) {
      // Perform migrations if needed
      migrateStorage(version, CURRENT_STORAGE_VERSION);
      localStorage.setItem(
        STORAGE_VERSION_KEY,
        String(CURRENT_STORAGE_VERSION)
      );
    }
  } catch (error) {
    logger.error("Failed to initialize storage:", error);
  }
}

/**
 * Migrate localStorage data between versions
 */
function migrateStorage(fromVersion: number, toVersion: number): void {
  logger.info(
    `Migrating localStorage from version ${fromVersion} to ${toVersion}`
  );

  // Add migration logic here when schema changes are needed
  // For now, version 1 is the initial version with no migrations needed

  if (fromVersion === 0 && toVersion >= 1) {
    // Version 1 introduces versioning - no data migration needed
    logger.info("Initialized storage versioning (v1)");
  }
}

// Initialize storage on module load (only in browser)
if (isBrowser) {
  initializeStorage();
}

/**
 * Save authentication tokens to localStorage
 * @param accessToken - JWT access token
 * @param refreshToken - Opaque refresh token (not a JWT)
 * @param refreshExpiresIn - Optional: seconds until refresh token expires
 */
export function saveTokens(
  accessToken: string,
  refreshToken: string,
  refreshExpiresIn?: number
): void {
  if (!isBrowser) return;

  try {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);

    // Save refresh token expiration timestamp if provided
    if (refreshExpiresIn) {
      const expiresAt = Date.now() + refreshExpiresIn * 1000;
      localStorage.setItem(REFRESH_TOKEN_EXPIRES_AT_KEY, expiresAt.toString());
    }

    // Invalidate and immediately update cache when tokens are updated
    invalidateCache();
    updateCache();
  } catch (error) {
    logger.error("Failed to save tokens:", error);
  }
}

/**
 * Get access token from localStorage (with caching)
 */
export function getAccessToken(): string | null {
  if (!isBrowser) return null;

  try {
    // Use cache if valid
    if (isCacheValid() && tokenCache) {
      return tokenCache.accessToken;
    }

    // Update cache and return value
    updateCache();
    return tokenCache?.accessToken || null;
  } catch (error) {
    logger.error("Failed to get access token:", error);
    return null;
  }
}

/**
 * Get refresh token from localStorage (with caching)
 */
export function getRefreshToken(): string | null {
  if (!isBrowser) return null;

  try {
    // Use cache if valid
    if (isCacheValid() && tokenCache) {
      return tokenCache.refreshToken;
    }

    // Update cache and return value
    updateCache();
    return tokenCache?.refreshToken || null;
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
    localStorage.removeItem(REFRESH_TOKEN_EXPIRES_AT_KEY);

    // Invalidate cache when tokens are cleared
    invalidateCache();
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
 * Note: Refresh token is an opaque token (not a JWT), so we check stored expiration timestamp
 */
export function isRefreshTokenExpired(): boolean {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return true;

  if (!isBrowser) return true;

  try {
    // Use cache if valid
    let expiresAtStr: string | null;
    if (isCacheValid() && tokenCache) {
      expiresAtStr = tokenCache.refreshTokenExpiresAt;
    } else {
      updateCache();
      expiresAtStr = tokenCache?.refreshTokenExpiresAt || null;
    }

    // Check if we have a stored expiration timestamp
    if (expiresAtStr) {
      const expiresAt = parseInt(expiresAtStr, 10);
      const currentTime = Date.now();
      return expiresAt < currentTime;
    }

    // If no expiration timestamp stored, assume token is valid
    // This handles tokens saved before this fix was implemented
    return false;
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
