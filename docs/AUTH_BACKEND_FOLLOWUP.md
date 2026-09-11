# Auth: backend follow-ups

The frontend now enforces role-based access on the client and refreshes JWTs
through a single in-flight lock, but three items need changes in the Django
backend (`nbx-django`) before authentication is fully hardened:

1. **Refresh token in an httpOnly cookie.** Tokens currently live in
   `localStorage` (`narbox_access_token`, `narbox_refresh_token`), which any
   XSS payload can read. `revokeToken` on the backend already reads the refresh
   token from a cookie, which is why logout cannot revoke a session today
   (`src/contexts/AuthContext.tsx`). Once the backend sets the refresh token as
   an `httpOnly; SameSite=Lax` cookie on `emailAuth` / `refreshWithToken`, the
   frontend should stop persisting it, call `revokeToken` on logout, and add a
   `Content-Security-Policy` header in `next.config.ts`.
2. **Server-side role enforcement.** Admin vs client routing is guarded in
   `src/app/[locale]/(dashboard)/admin/layout.tsx` and `client/layout.tsx`
   (client side). With the cookie above, `proxy.ts` can verify the session and
   redirect before any admin markup is served.
3. **Structured auth errors.** `src/lib/apollo/isAuthError.ts` matches
   django-graphql-jwt messages by exact text. Returning
   `extensions.code = "UNAUTHENTICATED"` from the backend would make the
   detection independent of message wording.
