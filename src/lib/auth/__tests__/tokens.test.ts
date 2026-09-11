import {
  clearTokens,
  getAccessToken,
  getRefreshToken,
  isRefreshTokenExpired,
  isTokenExpired,
  saveTokens,
  TOKEN_REFRESH_BUFFER_SECONDS,
} from "../tokens";

jest.mock("jwt-decode", () => ({
  jwtDecode: jest.fn((token: string) => {
    if (token === "valid-token") return { exp: Date.now() / 1000 + 3600 };
    if (token === "expired-token") return { exp: Date.now() / 1000 - 3600 };
    if (token === "soon-expired-token") return { exp: Date.now() / 1000 + 10 };
    throw new Error("Invalid token");
  }),
}));

describe("tokens", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2024-01-01T00:00:00Z"));
    localStorage.clear();
    jest.spyOn(console, "error").mockImplementation(() => undefined);
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  describe("saveTokens", () => {
    it("stores both tokens", () => {
      saveTokens("access-token", "refresh-token");

      expect(localStorage.getItem("narbox_access_token")).toBe("access-token");
      expect(localStorage.getItem("narbox_refresh_token")).toBe(
        "refresh-token"
      );
    });

    it("stores the refresh expiry as an absolute timestamp", () => {
      saveTokens("access-token", "refresh-token", 3600);

      expect(localStorage.getItem("narbox_refresh_token_expires_at")).toBe(
        String(Date.now() + 3600 * 1000)
      );
    });

    it("drops a stale expiry when none is provided", () => {
      saveTokens("a", "r", 3600);
      saveTokens("a2", "r2");

      expect(
        localStorage.getItem("narbox_refresh_token_expires_at")
      ).toBeNull();
    });
  });

  describe("getAccessToken / getRefreshToken", () => {
    it("reads the current storage value every time", () => {
      localStorage.setItem("narbox_access_token", "first");
      expect(getAccessToken()).toBe("first");

      localStorage.setItem("narbox_access_token", "second");
      expect(getAccessToken()).toBe("second");
    });

    it("returns null when missing", () => {
      expect(getAccessToken()).toBeNull();
      expect(getRefreshToken()).toBeNull();
    });
  });

  describe("clearTokens", () => {
    it("removes every auth key", () => {
      saveTokens("a", "r", 3600);

      clearTokens();

      expect(localStorage.getItem("narbox_access_token")).toBeNull();
      expect(localStorage.getItem("narbox_refresh_token")).toBeNull();
      expect(
        localStorage.getItem("narbox_refresh_token_expires_at")
      ).toBeNull();
    });
  });

  describe("isTokenExpired", () => {
    it("returns false for a valid token", () => {
      expect(isTokenExpired("valid-token")).toBe(false);
    });

    it("returns true for an expired token", () => {
      expect(isTokenExpired("expired-token")).toBe(true);
    });

    it("treats tokens inside the refresh buffer as expired", () => {
      expect(isTokenExpired("soon-expired-token")).toBe(true);
      expect(isTokenExpired("soon-expired-token", 0)).toBe(false);
    });

    it("treats undecodable tokens as expired", () => {
      expect(isTokenExpired("garbage")).toBe(true);
    });
  });

  describe("isRefreshTokenExpired", () => {
    it("is expired when there is no refresh token", () => {
      expect(isRefreshTokenExpired()).toBe(true);
    });

    it("fails closed when the expiry timestamp is missing or malformed", () => {
      localStorage.setItem("narbox_refresh_token", "refresh-token");
      expect(isRefreshTokenExpired()).toBe(true);

      localStorage.setItem("narbox_refresh_token_expires_at", "not-a-number");
      expect(isRefreshTokenExpired()).toBe(true);
    });

    it("is valid before the stored expiry and expired after it", () => {
      saveTokens("a", "refresh-token", 60);

      expect(isRefreshTokenExpired()).toBe(false);
      jest.advanceTimersByTime(61 * 1000);
      expect(isRefreshTokenExpired()).toBe(true);
    });
  });

  it("exposes the refresh buffer constant", () => {
    expect(TOKEN_REFRESH_BUFFER_SECONDS).toBe(30);
  });
});
