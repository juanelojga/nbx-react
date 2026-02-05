"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useLazyQuery, useMutation } from "@apollo/client";
import { User, UserRole } from "@/types/user";
import {
  LOGIN_MUTATION,
  type LoginResponse,
  LOGOUT_MUTATION,
  REFRESH_TOKEN_MUTATION,
  type RefreshTokenResponse,
} from "@/graphql/mutations/auth";
import {
  GET_CURRENT_USER,
  type GetCurrentUserResponse,
} from "@/graphql/queries/auth";
import {
  clearTokens,
  getAccessToken,
  getRefreshToken,
  isTokenExpired,
  isRefreshTokenExpired,
  saveTokens,
} from "@/lib/auth/tokens";
import { apolloClient } from "@/lib/apollo/client";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

// Global variable to track ongoing refresh to prevent race conditions
let refreshPromise: Promise<string | null> | null = null;

export function AuthProvider({ children }: AuthProviderProps) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [loginMutation] = useMutation<LoginResponse>(LOGIN_MUTATION);
  const [refreshTokenMutation] = useMutation<RefreshTokenResponse>(
    REFRESH_TOKEN_MUTATION
  );
  const [logoutMutation] = useMutation(LOGOUT_MUTATION);
  const [getCurrentUser, { loading: userLoading }] =
    useLazyQuery<GetCurrentUserResponse>(GET_CURRENT_USER);

  const isAuthenticated = !!user;

  /**
   * Map backend user to frontend user type
   */
  const mapBackendUserToUser = (
    backendUser: GetCurrentUserResponse["me"]
  ): User => {
    return {
      id: backendUser.id,
      email: backendUser.email,
      firstName: backendUser.firstName,
      lastName: backendUser.lastName,
      role: backendUser.isSuperuser ? UserRole.ADMIN : UserRole.CLIENT,
      isSuperuser: backendUser.isSuperuser,
    };
  };

  /**
   * Perform token refresh with deduplication
   * Prevents multiple simultaneous refresh attempts
   */
  const performTokenRefresh = async (): Promise<string | null> => {
    // If a refresh is already in progress, return that promise
    if (refreshPromise) {
      return refreshPromise;
    }

    // Create new refresh promise
    refreshPromise = (async () => {
      try {
        const refreshToken = getRefreshToken();
        if (!refreshToken) {
          throw new Error("No refresh token available");
        }

        const { data } = await refreshTokenMutation({
          variables: { token: refreshToken },
        });

        if (data?.refreshToken) {
          const newAccessToken = data.refreshToken.token;
          // Save new access token (keep existing refresh token)
          saveTokens(newAccessToken, refreshToken);
          return newAccessToken;
        }

        throw new Error("Token refresh failed: Invalid response");
      } catch (err) {
        console.error("Failed to refresh token:", err);
        clearTokens();
        setUser(null);
        return null;
      } finally {
        refreshPromise = null;
      }
    })();

    return refreshPromise;
  };

  /**
   * Refresh the access token using the refresh token
   */
  const refreshAccessToken = async (): Promise<string | null> => {
    return performTokenRefresh();
  };

  /**
   * Load user data from the server
   */
  const loadUser = async (): Promise<void> => {
    try {
      let token = getAccessToken();
      const refreshToken = getRefreshToken();

      // Check if tokens exist
      if (!token || !refreshToken) {
        setUser(null);
        setLoading(false);
        return;
      }

      // Check if refresh token is expired
      if (isRefreshTokenExpired()) {
        clearTokens();
        setUser(null);
        setLoading(false);
        return;
      }

      // Check if access token is expired
      if (isTokenExpired(token)) {
        // Try to refresh
        token = await refreshAccessToken();
        if (!token) {
          setUser(null);
          setLoading(false);
          return;
        }
      }

      // Fetch current user
      const { data, error: queryError } = await getCurrentUser();

      if (queryError) {
        throw queryError;
      }

      if (data?.me) {
        const user = mapBackendUserToUser(data.me);
        setUser(user);
        setError(null);
      } else {
        setUser(null);
      }
    } catch (err) {
      console.error("Failed to load user:", err);
      clearTokens();
      setUser(null);
      setError("Failed to load user session");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Login with email and password
   */
  const login = async (email: string, password: string): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const { data } = await loginMutation({
        variables: { email, password },
      });

      if (!data?.emailAuth) {
        throw new Error("Invalid response from server");
      }

      const { token: accessToken, refreshToken } = data.emailAuth;

      // Save both tokens
      saveTokens(accessToken, refreshToken);

      // Fetch current user data
      const { data: currentUserData } = await getCurrentUser();

      if (!currentUserData?.me) {
        throw new Error("Failed to fetch user data");
      }

      const user = mapBackendUserToUser(currentUserData.me);

      // Set user
      setUser(user);

      // Redirect based on isSuperuser
      const redirectPath = currentUserData.me.isSuperuser
        ? "/admin/dashboard"
        : "/client/dashboard";

      router.push(redirectPath);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Login failed. Please check your credentials.";

      setError(errorMessage);
      console.error("Login error:", err);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Logout user
   */
  const logout = async (): Promise<void> => {
    try {
      // Try to revoke token on backend (if supported)
      await logoutMutation();
    } catch (err) {
      console.error("Logout mutation error:", err);
      // Continue with local logout even if backend fails
    }

    // Clear local state
    clearTokens();
    setUser(null);
    setError(null);

    if (apolloClient) {
      // Clear Apollo cache
      await apolloClient.clearStore();
    }

    // Redirect to login
    router.push("/login");
  };

  // Initialize auth on mount
  useEffect(() => {
    loadUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value: AuthContextType = {
    user,
    loading: loading || userLoading,
    error,
    isAuthenticated,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook to use the auth context
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
