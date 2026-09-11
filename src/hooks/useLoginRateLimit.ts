"use client";

import { useRateLimit, type UseRateLimitReturn } from "@/hooks/useRateLimit";

const LOGIN_MAX_ATTEMPTS = 5;
const LOGIN_WINDOW_MS = 15 * 60 * 1000;
const LOGIN_STORAGE_KEY = "narbox_login_rate_limit";

/** Login form limiter: 5 attempts per 15 minutes, persisted across reloads. */
export function useLoginRateLimit(): UseRateLimitReturn {
  return useRateLimit(LOGIN_MAX_ATTEMPTS, LOGIN_WINDOW_MS, LOGIN_STORAGE_KEY);
}
