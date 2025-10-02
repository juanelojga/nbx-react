"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from "@/types/user";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
  getCurrentUser: () => Promise<User | null>;
  setUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Token storage utilities
const TOKEN_KEY = "token";
const REFRESH_TOKEN_KEY = "refreshToken";

export const getToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
};

export const setToken = (token: string): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem(TOKEN_KEY, token);
};

export const getRefreshToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(REFRESH_TOKEN_KEY);
};

export const setRefreshToken = (token: string): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem(REFRESH_TOKEN_KEY, token);
};

export const clearTokens = (): void => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const isAuthenticated = !!user;

  // Check for existing session on mount
  useEffect(() => {
    const initAuth = async () => {
      const token = getToken();
      if (token) {
        await getCurrentUser();
      } else {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // Login function - stub implementation
  const login = async (email: string, password: string): Promise<void> => {
    setLoading(true);
    try {
      // TODO: Implement GraphQL mutation for login
      console.log("Login called with:", { email, password });

      // Stub implementation - replace with actual GraphQL call
      // Example response structure:
      // const response = await loginMutation({ variables: { email, password } });
      // const { token, refreshToken, user } = response.data.login;

      // For now, just throw an error to indicate not implemented
      throw new Error("Login not implemented yet");

      // When implemented, should:
      // setToken(token);
      // setRefreshToken(refreshToken);
      // setUser(user);
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = (): void => {
    clearTokens();
    setUser(null);
    // Redirect to login page
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
  };

  // Refresh token function - stub implementation
  const refreshToken = async (): Promise<void> => {
    try {
      const refresh = getRefreshToken();
      if (!refresh) {
        throw new Error("No refresh token available");
      }

      // TODO: Implement GraphQL mutation for token refresh
      console.log("Refresh token called");

      // Stub implementation - replace with actual GraphQL call
      // const response = await refreshTokenMutation({ variables: { refreshToken: refresh } });
      // const { token } = response.data.refreshToken;
      // setToken(token);

      throw new Error("Refresh token not implemented yet");
    } catch (error) {
      console.error("Refresh token error:", error);
      logout();
      throw error;
    }
  };

  // Get current user function - stub implementation
  const getCurrentUser = async (): Promise<User | null> => {
    setLoading(true);
    try {
      const token = getToken();
      if (!token) {
        setUser(null);
        return null;
      }

      // TODO: Implement GraphQL query to fetch current user
      console.log("Get current user called");

      // Stub implementation - replace with actual GraphQL call
      // const response = await meQuery();
      // const currentUser = response.data.me;
      // setUser(currentUser);
      // return currentUser;

      throw new Error("Get current user not implemented yet");
    } catch (error) {
      console.error("Get current user error:", error);
      clearTokens();
      setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    isAuthenticated,
    login,
    logout,
    refreshToken,
    getCurrentUser,
    setUser,
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
