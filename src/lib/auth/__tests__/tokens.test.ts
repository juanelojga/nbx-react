import {
  clearTokens,
  getAccessToken,
  getRefreshToken,
  hasValidAuth,
  isRefreshTokenExpired,
  isTokenExpired,
  saveTokens,
  TOKEN_REFRESH_BUFFER_SECONDS,
} from "../tokens";

// Mock jwt-decode
jest.mock("jwt-decode", () => ({
  jwtDecode: jest.fn((token: string) => {
    if (token === "valid-token") {
      return { exp: Date.now() / 1000 + 3600 }; // Expires in 1 hour
    }
    if (token === "expired-token") {
      return { exp: Date.now() / 1000 - 3600 }; // Expired 1 hour ago
    }
    if (token === "soon-expired-token") {
      return { exp: Date.now() / 1000 + 10 }; // Expires in 10 seconds
    }
    throw new Error("Invalid token");
  }),
}));

// Test constants
const CACHE_TTL_MS = 1000; // Must match the implementation
const CACHE_WAIT_MS = CACHE_TTL_MS + 100; // Wait time to ensure cache expires

describe("tokens", () => {
  let mockLocalStorage: { [key: string]: string };

  beforeEach(() => {
    // Reset mock localStorage before each test
    mockLocalStorage = {};

    Object.defineProperty(global, "localStorage", {
      value: {
        getItem: jest.fn((key: string) => mockLocalStorage[key] || null),
        setItem: jest.fn((key: string, value: string) => {
          mockLocalStorage[key] = value;
        }),
        removeItem: jest.fn((key: string) => {
          delete mockLocalStorage[key];
        }),
        clear: jest.fn(() => {
          mockLocalStorage = {};
        }),
      },
      configurable: true,
      writable: true,
    });

    // Clear tokens to reset cache state
    clearTokens();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("saveTokens", () => {
    it("should save tokens to localStorage", () => {
      saveTokens("access-token", "refresh-token");

      expect(localStorage.setItem).toHaveBeenCalledWith(
        "narbox_access_token",
        "access-token"
      );
      expect(localStorage.setItem).toHaveBeenCalledWith(
        "narbox_refresh_token",
        "refresh-token"
      );
    });

    it("should save refresh token expiration if provided", () => {
      const refreshExpiresIn = 3600; // 1 hour
      const beforeTime = Date.now();

      saveTokens("access-token", "refresh-token", refreshExpiresIn);

      const afterTime = Date.now();
      const savedExpiresAt =
        mockLocalStorage["narbox_refresh_token_expires_at"];
      const expiresAt = parseInt(savedExpiresAt, 10);

      expect(expiresAt).toBeGreaterThanOrEqual(
        beforeTime + refreshExpiresIn * 1000
      );
      expect(expiresAt).toBeLessThanOrEqual(
        afterTime + refreshExpiresIn * 1000
      );
    });
  });

  describe("getAccessToken", () => {
    it("should retrieve access token from localStorage", () => {
      mockLocalStorage["narbox_access_token"] = "test-token";

      const token = getAccessToken();

      expect(token).toBe("test-token");
    });

    it("should return null if token does not exist", () => {
      const token = getAccessToken();

      expect(token).toBeNull();
    });

    it("should use cache on repeated calls (within TTL)", async () => {
      mockLocalStorage["narbox_access_token"] = "test-token";

      // First call - should read from localStorage
      const token1 = getAccessToken();
      expect(token1).toBe("test-token");

      // Change localStorage value
      mockLocalStorage["narbox_access_token"] = "new-token";

      // Second call (within cache TTL) - should return cached value
      const token2 = getAccessToken();
      expect(token2).toBe("test-token"); // Still returns old cached value

      // After cache TTL expires, should read new value
      await new Promise((resolve) => setTimeout(resolve, CACHE_WAIT_MS));
      const token3 = getAccessToken();
      expect(token3).toBe("new-token"); // Now returns new value
    });
  });

  describe("getRefreshToken", () => {
    it("should retrieve refresh token from localStorage", () => {
      mockLocalStorage["narbox_refresh_token"] = "test-refresh-token";

      const token = getRefreshToken();

      expect(token).toBe("test-refresh-token");
    });

    it("should return null if token does not exist", () => {
      const token = getRefreshToken();

      expect(token).toBeNull();
    });
  });

  describe("clearTokens", () => {
    it("should remove all tokens from localStorage", () => {
      mockLocalStorage["narbox_access_token"] = "access-token";
      mockLocalStorage["narbox_refresh_token"] = "refresh-token";
      mockLocalStorage["narbox_refresh_token_expires_at"] = "123456789";

      clearTokens();

      expect(localStorage.removeItem).toHaveBeenCalledWith(
        "narbox_access_token"
      );
      expect(localStorage.removeItem).toHaveBeenCalledWith(
        "narbox_refresh_token"
      );
      expect(localStorage.removeItem).toHaveBeenCalledWith(
        "narbox_refresh_token_expires_at"
      );
    });

    it("should invalidate cache", () => {
      mockLocalStorage["narbox_access_token"] = "test-token";

      // Cache the token
      getAccessToken();
      expect(getAccessToken()).toBe("test-token");

      // Clear tokens (should invalidate cache)
      clearTokens();

      // Add a new token
      mockLocalStorage["narbox_access_token"] = "new-token";

      // Should read fresh value from localStorage (cache was invalidated)
      const token = getAccessToken();
      expect(token).toBe("new-token");
    });
  });

  describe("isTokenExpired", () => {
    it("should return false for valid token", () => {
      const expired = isTokenExpired("valid-token");

      expect(expired).toBe(false);
    });

    it("should return true for expired token", () => {
      const expired = isTokenExpired("expired-token");

      expect(expired).toBe(true);
    });

    it("should return true for soon-to-expire token (with buffer)", () => {
      const expired = isTokenExpired("soon-expired-token");

      // Token expires in 10 seconds, but buffer is 30 seconds
      expect(expired).toBe(true);
    });

    it("should respect custom buffer", () => {
      // Token expires in 10 seconds, custom buffer is 5 seconds
      const expired = isTokenExpired("soon-expired-token", 5);

      expect(expired).toBe(false);
    });

    it("should return true for invalid token", () => {
      const expired = isTokenExpired("invalid-token");

      expect(expired).toBe(true);
    });
  });

  describe("isRefreshTokenExpired", () => {
    it("should return true if no refresh token exists", () => {
      const expired = isRefreshTokenExpired();

      expect(expired).toBe(true);
    });

    it("should return false if token exists but no expiration timestamp", () => {
      mockLocalStorage["narbox_refresh_token"] = "refresh-token";

      const expired = isRefreshTokenExpired();

      expect(expired).toBe(false);
    });

    it("should return false for valid refresh token", () => {
      mockLocalStorage["narbox_refresh_token"] = "refresh-token";
      const futureTime = Date.now() + 3600 * 1000; // 1 hour in future
      mockLocalStorage["narbox_refresh_token_expires_at"] = String(futureTime);

      const expired = isRefreshTokenExpired();

      expect(expired).toBe(false);
    });

    it("should return true for expired refresh token", () => {
      mockLocalStorage["narbox_refresh_token"] = "refresh-token";
      const pastTime = Date.now() - 3600 * 1000; // 1 hour in past
      mockLocalStorage["narbox_refresh_token_expires_at"] = String(pastTime);

      const expired = isRefreshTokenExpired();

      expect(expired).toBe(true);
    });

    it("should use cache for expiration timestamp", async () => {
      mockLocalStorage["narbox_refresh_token"] = "refresh-token";
      const futureTime = Date.now() + 3600 * 1000;
      mockLocalStorage["narbox_refresh_token_expires_at"] = String(futureTime);

      // First call - should cache
      expect(isRefreshTokenExpired()).toBe(false);

      // Change the expiration to past (simulating expiration)
      const pastTime = Date.now() - 3600 * 1000;
      mockLocalStorage["narbox_refresh_token_expires_at"] = String(pastTime);

      // Second call (within cache TTL) - should return cached result
      expect(isRefreshTokenExpired()).toBe(false); // Still false due to cache

      // After cache expires, should reflect new value
      await new Promise((resolve) => setTimeout(resolve, CACHE_WAIT_MS));
      expect(isRefreshTokenExpired()).toBe(true); // Now true
    });
  });

  describe("hasValidAuth", () => {
    it("should return false if no tokens exist", () => {
      const valid = hasValidAuth();

      expect(valid).toBe(false);
    });

    it("should return false if only access token exists", () => {
      mockLocalStorage["narbox_access_token"] = "valid-token";

      const valid = hasValidAuth();

      expect(valid).toBe(false);
    });

    it("should return false if only refresh token exists", () => {
      mockLocalStorage["narbox_refresh_token"] = "refresh-token";

      const valid = hasValidAuth();

      expect(valid).toBe(false);
    });

    it("should return true for valid tokens", () => {
      mockLocalStorage["narbox_access_token"] = "valid-token";
      mockLocalStorage["narbox_refresh_token"] = "refresh-token";

      const valid = hasValidAuth();

      expect(valid).toBe(true);
    });

    it("should return true if access token expired but refresh token valid", () => {
      mockLocalStorage["narbox_access_token"] = "expired-token";
      mockLocalStorage["narbox_refresh_token"] = "refresh-token";
      const futureTime = Date.now() + 3600 * 1000;
      mockLocalStorage["narbox_refresh_token_expires_at"] = String(futureTime);

      const valid = hasValidAuth();

      expect(valid).toBe(true);
    });

    it("should return false if both tokens expired", () => {
      mockLocalStorage["narbox_access_token"] = "expired-token";
      mockLocalStorage["narbox_refresh_token"] = "refresh-token";
      const pastTime = Date.now() - 3600 * 1000;
      mockLocalStorage["narbox_refresh_token_expires_at"] = String(pastTime);

      const valid = hasValidAuth();

      expect(valid).toBe(false);
    });
  });

  describe("TOKEN_REFRESH_BUFFER_SECONDS constant", () => {
    it("should be exported and have expected value", () => {
      expect(TOKEN_REFRESH_BUFFER_SECONDS).toBe(30);
    });
  });
});
