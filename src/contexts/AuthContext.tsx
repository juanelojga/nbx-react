"use client";

import {
  useApolloClient,
  useLazyQuery,
  useMutation,
} from "@apollo/client/react";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { LOGIN_MUTATION, type LoginResponse } from "@/graphql/mutations/auth";
import {
  GET_CURRENT_USER,
  type GetCurrentUserResponse,
} from "@/graphql/queries/auth";
import { useRouter } from "@/i18n/navigation";
import { authEvents, SESSION_EXPIRED_EVENT } from "@/lib/auth/authEvents";
import { getDefaultRoute } from "@/lib/auth/getDefaultRoute";
import { mapBackendUser } from "@/lib/auth/mapBackendUser";
import { refreshAccessToken } from "@/lib/auth/refreshAccessToken";
import {
  clearTokens,
  getAccessToken,
  getRefreshToken,
  isRefreshTokenExpired,
  isTokenExpired,
  saveTokens,
} from "@/lib/auth/tokens";
import { logger } from "@/lib/logger";
import type { User } from "@/types/user";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const router = useRouter();
  const client = useApolloClient();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [loginMutation] = useMutation<LoginResponse>(LOGIN_MUTATION);
  const [getCurrentUser, { loading: userLoading }] =
    useLazyQuery<GetCurrentUserResponse>(GET_CURRENT_USER, {
      fetchPolicy: "network-only",
    });

  /**
   * Restore the session from stored tokens on mount.
   */
  const loadUser = useCallback(async (): Promise<void> => {
    try {
      let token = getAccessToken();
      if (!token || !getRefreshToken() || isRefreshTokenExpired()) {
        clearTokens();
        setUser(null);
        return;
      }

      if (isTokenExpired(token)) {
        token = await refreshAccessToken();
        if (!token) {
          setUser(null);
          return;
        }
      }

      const { data, error: queryError } = await getCurrentUser();
      if (queryError) throw queryError;

      setUser(data?.me ? mapBackendUser(data.me) : null);
      setError(null);
    } catch (err) {
      logger.error("Failed to restore session", err);
      clearTokens();
      setUser(null);
      setError("Failed to load user session");
    } finally {
      setLoading(false);
    }
  }, [getCurrentUser]);

  const login = useCallback(
    async (email: string, password: string): Promise<void> => {
      setLoading(true);
      setError(null);

      try {
        const { data } = await loginMutation({
          variables: { email, password },
        });
        if (!data?.emailAuth) {
          throw new Error("Invalid response from server");
        }

        const { token, refreshToken, refreshExpiresIn } = data.emailAuth;
        saveTokens(token, refreshToken, refreshExpiresIn);

        const { data: currentUserData } = await getCurrentUser();
        if (!currentUserData?.me) {
          throw new Error("Failed to fetch user data");
        }

        const nextUser = mapBackendUser(currentUserData.me);
        setUser(nextUser);
        router.push(getDefaultRoute(nextUser.role));
      } catch (err: unknown) {
        const message =
          err instanceof Error
            ? err.message
            : "Login failed. Please check your credentials.";
        setError(message);
        logger.error("Login error", err);
        throw new Error(message);
      } finally {
        setLoading(false);
      }
    },
    [loginMutation, getCurrentUser, router]
  );

  const logout = useCallback(async (): Promise<void> => {
    // Server-side revocation needs the refresh token in an httpOnly cookie
    // (backend follow-up); until then logout is local only.
    try {
      await client.clearStore();
    } catch (err) {
      logger.error("Failed to clear Apollo store on logout", err);
    }
    clearTokens();
    setUser(null);
    setError(null);
    router.push("/login");
  }, [client, router]);

  useEffect(() => {
    void loadUser();
  }, [loadUser]);

  // The Apollo link chain signals unrecoverable auth failures here so the
  // redirect stays locale-aware instead of using window.location.
  useEffect(() => {
    const handleSessionExpired = () => {
      setUser(null);
      setError(null);
      router.push("/login");
    };
    authEvents.addEventListener(SESSION_EXPIRED_EVENT, handleSessionExpired);
    return () =>
      authEvents.removeEventListener(
        SESSION_EXPIRED_EVENT,
        handleSessionExpired
      );
  }, [router]);

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      loading: loading || userLoading,
      error,
      isAuthenticated: user !== null,
      login,
      logout,
    }),
    [user, loading, userLoading, error, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
