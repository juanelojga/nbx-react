"use client";

import { useState, useCallback, useEffect } from "react";

interface RateLimitState {
  attempts: number;
  isLocked: boolean;
  lockExpiry: number | null;
}

interface UseRateLimitReturn {
  /** Attempt an action, returns false if rate limited */
  attempt: () => boolean;
  /** Reset the rate limit counter */
  reset: () => void;
  /** Whether the rate limit is currently active */
  isLocked: boolean;
  /** Timestamp when the lock expires (null if not locked) */
  lockExpiry: number | null;
  /** Number of remaining attempts before lock */
  remaining: number;
  /** Total attempts made in current window */
  attempts: number;
}

/**
 * Hook for implementing rate limiting on actions
 *
 * @param maxAttempts - Maximum number of attempts allowed
 * @param windowMs - Time window in milliseconds before reset
 * @returns Rate limit control object
 *
 * @example
 * ```tsx
 * const { attempt, isLocked, remaining, lockExpiry } = useRateLimit(5, 60000);
 *
 * const handleSubmit = () => {
 *   if (!attempt()) {
 *     toast.error(`Too many attempts. Try again in ${Math.ceil((lockExpiry! - Date.now()) / 1000)}s`);
 *     return;
 *   }
 *   // Proceed with action
 * };
 * ```
 */
export function useRateLimit(
  maxAttempts: number,
  windowMs: number
): UseRateLimitReturn {
  const [state, setState] = useState<RateLimitState>({
    attempts: 0,
    isLocked: false,
    lockExpiry: null,
  });

  // Clear lock when expiry time is reached
  useEffect(() => {
    if (state.lockExpiry && state.lockExpiry > Date.now()) {
      const timeoutId = setTimeout(() => {
        setState({
          attempts: 0,
          isLocked: false,
          lockExpiry: null,
        });
      }, state.lockExpiry - Date.now());

      return () => clearTimeout(timeoutId);
    }
  }, [state.lockExpiry]);

  const attempt = useCallback((): boolean => {
    setState((prev) => {
      // If already locked, stay locked
      if (prev.isLocked) {
        return prev;
      }

      // Check if we should lock
      if (prev.attempts >= maxAttempts - 1) {
        const expiry = Date.now() + windowMs;
        return {
          attempts: prev.attempts + 1,
          isLocked: true,
          lockExpiry: expiry,
        };
      }

      // Increment attempts
      return {
        ...prev,
        attempts: prev.attempts + 1,
      };
    });

    // Return the state before this attempt to know if this attempt was allowed
    return !state.isLocked && state.attempts < maxAttempts;
  }, [maxAttempts, windowMs, state.isLocked, state.attempts]);

  const reset = useCallback((): void => {
    setState({
      attempts: 0,
      isLocked: false,
      lockExpiry: null,
    });
  }, []);

  return {
    attempt,
    reset,
    isLocked: state.isLocked,
    lockExpiry: state.lockExpiry,
    remaining: Math.max(0, maxAttempts - state.attempts),
    attempts: state.attempts,
  };
}

/**
 * Hook specifically for login rate limiting
 * Defaults: 5 attempts per 15 minutes
 */
export function useLoginRateLimit(): UseRateLimitReturn {
  return useRateLimit(5, 15 * 60 * 1000); // 5 attempts per 15 minutes
}
