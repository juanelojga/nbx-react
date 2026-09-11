"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface RateLimitState {
  attempts: number;
  /** Epoch ms when the lock lifts; null when not locked. */
  lockExpiry: number | null;
}

export interface UseRateLimitReturn {
  /** Register an attempt. Returns false when the action is currently locked. */
  attempt: () => boolean;
  reset: () => void;
  isLocked: boolean;
  lockExpiry: number | null;
  remaining: number;
  attempts: number;
}

const EMPTY: RateLimitState = { attempts: 0, lockExpiry: null };

function isLockedState(state: RateLimitState, now: number): boolean {
  return state.lockExpiry !== null && state.lockExpiry > now;
}

function readStored(key: string): RateLimitState {
  try {
    const raw = sessionStorage.getItem(key);
    if (!raw) return EMPTY;
    const parsed = JSON.parse(raw) as Partial<RateLimitState>;
    const state: RateLimitState = {
      attempts: Number(parsed.attempts) || 0,
      lockExpiry:
        typeof parsed.lockExpiry === "number" ? parsed.lockExpiry : null,
    };
    // A lock that already lapsed resets the window.
    if (state.lockExpiry !== null && state.lockExpiry <= Date.now())
      return EMPTY;
    return state;
  } catch {
    return EMPTY;
  }
}

function writeStored(key: string, state: RateLimitState): void {
  try {
    if (state.attempts === 0 && state.lockExpiry === null) {
      sessionStorage.removeItem(key);
    } else {
      sessionStorage.setItem(key, JSON.stringify(state));
    }
  } catch {
    // Storage unavailable (private mode, quota): the limiter degrades to in-memory.
  }
}

/**
 * Client-side rate limiting for a user action: `maxAttempts` within a window,
 * then locked for `windowMs`. The verdict is computed synchronously from a ref
 * so back-to-back calls in one tick cannot both pass. With `storageKey`, the
 * state survives page reloads via sessionStorage.
 *
 * This is UX friction only; the backend must enforce real limits.
 */
export function useRateLimit(
  maxAttempts: number,
  windowMs: number,
  storageKey?: string
): UseRateLimitReturn {
  // Lazily hydrate from storage. Nothing renders this state during SSR, so
  // the server/client difference cannot produce a hydration mismatch.
  const [state, setState] = useState<RateLimitState>(() =>
    storageKey && typeof window !== "undefined" ? readStored(storageKey) : EMPTY
  );
  const stateRef = useRef<RateLimitState>(state);

  const commit = useCallback(
    (next: RateLimitState) => {
      stateRef.current = next;
      setState(next);
      if (storageKey) writeStored(storageKey, next);
    },
    [storageKey]
  );

  // Lift the lock when its expiry is reached.
  useEffect(() => {
    if (state.lockExpiry === null) return;
    const delay = Math.max(0, state.lockExpiry - Date.now());
    const timeoutId = setTimeout(() => commit(EMPTY), delay);
    return () => clearTimeout(timeoutId);
  }, [state.lockExpiry, commit]);

  const attempt = useCallback((): boolean => {
    const now = Date.now();
    const current = stateRef.current;
    if (isLockedState(current, now)) return false;

    const attempts = current.attempts + 1;
    commit({
      attempts,
      lockExpiry: attempts >= maxAttempts ? now + windowMs : null,
    });
    return true;
  }, [commit, maxAttempts, windowMs]);

  const reset = useCallback(() => commit(EMPTY), [commit]);

  // Derived from state only (render must stay pure); the effect above clears
  // the lock when it lapses.
  const isLocked = state.lockExpiry !== null;

  return {
    attempt,
    reset,
    isLocked,
    lockExpiry: isLocked ? state.lockExpiry : null,
    remaining: Math.max(0, maxAttempts - state.attempts),
    attempts: state.attempts,
  };
}
