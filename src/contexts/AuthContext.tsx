"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useLazyQuery } from "@apollo/client";
import { User, UserRole } from "@/types/user";
import {
  LOGIN_MUTATION,
  REFRESH_TOKEN_MUTATION,
  LOGOUT_MUTATION,
  type LoginResponse,
  type RefreshTokenResponse,
} from "@/graphql/mutations/auth";
import {
  GET_CURRENT_USER,
  type GetCurrentUserResponse,
} from "@/graphql/queries/auth";
import {
  saveTokens,
  getAccessToken,
  getRefreshToken as getStoredRefreshToken,
  clearTokens,
  isTokenExpired,
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
  const [getCurrentUser] =
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
   * Refresh the access token using the refresh token
   */
  const refreshAccessToken = async (): Promise<string | null> => {
    try {
      const refreshToken = getStoredRefreshToken();
      if (!refreshToken) {
        throw new Error("No refresh token available");
      }

      const { data } = await refreshTokenMutation({
        variables: { refreshToken },
      });

      if (data?.refreshToken) {
        const newAccessToken = data.refreshToken.token;
        const newRefreshToken = data.refreshToken.refreshToken;
        saveTokens(newAccessToken, newRefreshToken);
        return newAccessToken;
      }

      return null;
    } catch (err) {
      console.error("Failed to refresh token:", err);
      clearTokens();
      setUser(null);
      return null;
    }
  };

  /**
   * Load user data from the server
   */
  const loadUser = async (): Promise<void> => {
    try {
      let token = getAccessToken();

      // Check if token exists
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      // Check if token is expired
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

      if (!data?.tokenAuth) {
        throw new Error("Invalid response from server");
      }

      const { token, refreshToken, user: userData } = data.tokenAuth;

      // Save tokens
      saveTokens(token, refreshToken);

      // Set user
      setUser(userData);

      // Redirect based on role
      const redirectPath =
        userData.role === "admin" ? "/admin/dashboard" : "/client/dashboard";

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

    // Clear Apollo cache
    await apolloClient.clearStore();

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
    loading,
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
