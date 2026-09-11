/**
 * Tiny pub/sub bridge between the Apollo link chain (which has no React
 * context) and `AuthProvider`. Dispatched when a refresh fails so the provider
 * can clear its state and navigate to the locale-aware login route.
 */
export const SESSION_EXPIRED_EVENT = "session-expired";

export const authEvents = new EventTarget();
