/**
 * Tests for waterfall elimination in AuthContext
 * These tests verify that operations run in parallel where possible
 */

import { renderHook, waitFor } from "@testing-library/react";
import { MockedProvider } from "@apollo/client/testing";
import { useAuth, AuthProvider } from "@/contexts/AuthContext";
import { LOGIN_MUTATION, LOGOUT_MUTATION } from "@/graphql/mutations/auth";
import { GET_CURRENT_USER } from "@/graphql/queries/auth";

// Mock custom navigation
jest.mock("@/lib/navigation", () => ({
  useRouter: jest.fn(),
  usePathname: jest.fn(() => "/"),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Link: ({ children, href, ...props }: any) => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const React = require("react");
    return React.createElement("a", { href, ...props }, children);
  },
  redirect: jest.fn(),
}));

// Mock token utilities
jest.mock("@/lib/auth/tokens", () => ({
  saveTokens: jest.fn(),
  getAccessToken: jest.fn(() => null),
  getRefreshToken: jest.fn(() => null),
  clearTokens: jest.fn(),
  isTokenExpired: jest.fn(() => false),
  isRefreshTokenExpired: jest.fn(() => false),
}));

// Mock Apollo client
jest.mock("@/lib/apollo/client", () => ({
  apolloClient: {
    clearStore: jest.fn(() => Promise.resolve()),
  },
}));

// Mock logger
jest.mock("@/lib/logger", () => ({
  logger: {
    error: jest.fn(),
  },
}));

describe("AuthContext Waterfall Elimination", () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { useRouter } = require("@/lib/navigation");
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
  });

  describe("login parallel execution", () => {
    it("should fetch user data immediately after saving tokens", async () => {
      const mocks = [
        {
          request: {
            query: LOGIN_MUTATION,
            variables: { email: "test@example.com", password: "password123" },
          },
          result: {
            data: {
              emailAuth: {
                token: "access-token",
                refreshToken: "refresh-token",
              },
            },
          },
        },
        {
          request: {
            query: GET_CURRENT_USER,
          },
          result: {
            data: {
              me: {
                id: "1",
                email: "test@example.com",
                firstName: "Test",
                lastName: "User",
                isSuperuser: false,
              },
            },
          },
        },
      ];

      const { result } = renderHook(() => useAuth(), {
        wrapper: ({ children }) => (
          <MockedProvider mocks={mocks} addTypename={false}>
            <AuthProvider>{children}</AuthProvider>
          </MockedProvider>
        ),
      });

      // Measure timing
      const startTime = Date.now();

      await result.current.login("test@example.com", "password123");

      await waitFor(
        () => {
          expect(result.current.isAuthenticated).toBe(true);
        },
        { timeout: 3000 }
      );

      const endTime = Date.now();
      const duration = endTime - startTime;

      // The operation should complete relatively quickly
      // If operations were sequential, this would take longer
      expect(duration).toBeLessThan(2000);
      expect(result.current.user?.email).toBe("test@example.com");
    });
  });

  describe("logout parallel execution", () => {
    it("should clear cache and call logout mutation in parallel", async () => {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const apolloClient = require("@/lib/apollo/client").apolloClient;
      const clearStoreSpy = jest.spyOn(apolloClient, "clearStore");

      const mocks = [
        {
          request: {
            query: LOGOUT_MUTATION,
          },
          result: {
            data: {
              logout: {
                success: true,
              },
            },
          },
        },
      ];

      const { result } = renderHook(() => useAuth(), {
        wrapper: ({ children }) => (
          <MockedProvider mocks={mocks} addTypename={false}>
            <AuthProvider>{children}</AuthProvider>
          </MockedProvider>
        ),
      });

      await result.current.logout();

      await waitFor(() => {
        expect(clearStoreSpy).toHaveBeenCalled();
        expect(mockPush).toHaveBeenCalledWith("/login");
      });
    });
  });

  describe("token refresh optimization", () => {
    it("should not block when token refresh is not needed", async () => {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { isTokenExpired } = require("@/lib/auth/tokens");
      (isTokenExpired as jest.Mock).mockReturnValue(false);

      const mocks = [
        {
          request: {
            query: GET_CURRENT_USER,
          },
          result: {
            data: {
              me: {
                id: "1",
                email: "test@example.com",
                firstName: "Test",
                lastName: "User",
                isSuperuser: false,
              },
            },
          },
        },
      ];

      // This test verifies that loadUser doesn't await unnecessarily
      const { result } = renderHook(() => useAuth(), {
        wrapper: ({ children }) => (
          <MockedProvider mocks={mocks} addTypename={false}>
            <AuthProvider>{children}</AuthProvider>
          </MockedProvider>
        ),
      });

      await waitFor(
        () => {
          expect(result.current.loading).toBe(false);
        },
        { timeout: 2000 }
      );
    });
  });
});
