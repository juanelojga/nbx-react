import { print } from "graphql";

import { REFRESH_TOKEN_MUTATION } from "@/graphql/mutations/auth";
import { GRAPHQL_ENDPOINT } from "@/lib/apollo/endpoint";
import { clearTokens, getRefreshToken, saveTokens } from "@/lib/auth/tokens";
import { logger } from "@/lib/logger";

const REFRESH_TIMEOUT_MS = 10_000;

let inflight: Promise<string | null> | null = null;

/**
 * Exchange the stored refresh token for a new access token.
 *
 * Concurrent callers share a single in-flight request: the backend rotates
 * refresh tokens, so two parallel refreshes would race and the loser would
 * persist a revoked token. Resolves with the new access token, or `null` when
 * the session can no longer be recovered (tokens are cleared in that case).
 */
export function refreshAccessToken(): Promise<string | null> {
  if (inflight) return inflight;

  const request = performRefresh().finally(() => {
    // Only the owner clears the lock, so a stale settle cannot drop a newer one.
    if (inflight === request) inflight = null;
  });
  inflight = request;
  return request;
}

async function performRefresh(): Promise<string | null> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return null;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REFRESH_TIMEOUT_MS);

  try {
    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "X-Requested-With": "XMLHttpRequest",
      },
      body: JSON.stringify({
        operationName: "RefreshToken",
        query: print(REFRESH_TOKEN_MUTATION),
        variables: { refreshToken },
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`Token refresh failed with HTTP ${response.status}`);
    }

    const json = (await response.json()) as {
      data?: {
        refreshWithToken?: {
          token?: string;
          refreshToken?: string;
          refreshExpiresIn?: number;
        } | null;
      };
      errors?: { message?: string }[];
    };

    const payload = json.data?.refreshWithToken;
    if (!payload?.token || !payload.refreshToken) {
      throw new Error(
        json.errors?.[0]?.message ?? "Token refresh returned no tokens"
      );
    }

    saveTokens(payload.token, payload.refreshToken, payload.refreshExpiresIn);
    return payload.token;
  } catch (error) {
    logger.error("Token refresh failed", error);
    clearTokens();
    return null;
  } finally {
    clearTimeout(timer);
  }
}
