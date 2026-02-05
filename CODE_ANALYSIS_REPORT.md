# 🔍 Code Analysis Report - NBX React

**Generated:** 2026-02-05  
**Updated:** 2026-02-05  
**Project:** NBX React - Package Management Frontend  
**Framework:** Next.js 15.5.4 + React 19.1.0 + TypeScript 5.x

---

## 📋 Executive Summary

This report provides a comprehensive analysis of the NBX React codebase, identifying critical bugs, security vulnerabilities, code quality issues, and proposed improvements. The analysis covers authentication, state management, API integration, testing, and overall code architecture.

### ✅ Critical Issues Resolved

All 7 critical issues have been fixed as of 2026-02-05. See the [Critical Fixes Applied](#-critical-fixes-applied) section for details.

### 🚨 Original Critical Discovery: Backend API Mismatch

Analysis of `documents/USER_WORKFLOWS.md` revealed **critical mismatches** between the frontend implementation and backend GraphQL schema:

1. ~~**Wrong Authentication Mutation**: Frontend uses `tokenAuth`, backend expects `emailAuth`~~ ✅ FIXED
2. ~~**Missing Refresh Token Storage**: Backend returns `refreshToken`, frontend only stores `token`~~ ✅ FIXED
3. **Missing Status Validation**: Backend doesn't validate consolidation status transitions (Medium priority - pending)
4. **Permission Gaps**: Backend `allConsolidates` returns all data, no client filtering (Medium priority - pending)

### Issue Summary by Severity

| Severity       | Count | Status                   |
| -------------- | ----- | ------------------------ |
| 🚨 Critical    | 7     | **✅ All Fixed**         |
| ⚠️ Medium      | 10    | Address in next sprint   |
| 🔧 Low         | 6     | Fix when convenient      |
| ✅ Improvement | 12    | Recommended enhancements |

### Critical Issues Overview

| ID       | Issue                    | File                | Status   | Impact                        |
| -------- | ------------------------ | ------------------- | -------- | ----------------------------- |
| CR-001   | Token refresh bug        | `apollo/client.ts`  | ✅ Fixed | Users logged out unexpectedly |
| CR-002   | Wrong mutation name      | `mutations/auth.ts` | ✅ Fixed | Authentication will fail      |
| CR-003   | Unused `rememberMe`      | `login/page.tsx`    | ✅ Fixed | Confusing UX                  |
| CR-004   | Hardcoded HTML lang      | `layout.tsx`        | ✅ Fixed | Accessibility issue           |
| CR-005   | Duplicate token logic    | Multiple files      | ✅ Fixed | Race conditions               |
| AUTH-001 | Backend API mismatch     | GraphQL schema      | ✅ Fixed | Auth incompatibility          |
| AUTH-002 | No refresh token storage | `tokens.ts`         | ✅ Fixed | Broken token refresh          |

---

## 📦 Package Version Analysis

### Current Dependencies Status

| Package          | Current | Latest   | Status  | Recommendation                                   |
| ---------------- | ------- | -------- | ------- | ------------------------------------------------ |
| `next`           | 15.5.4  | 15.5.4   | ✅ Good | Keep current                                     |
| `react`          | 19.1.0  | 19.1.0   | ✅ Good | Keep current                                     |
| `react-dom`      | 19.1.0  | 19.1.0   | ✅ Good | Keep current                                     |
| `@apollo/client` | 3.14.0  | 3.14.0   | ✅ Good | Keep current                                     |
| `typescript`     | ^5      | 5.7.x    | ✅ Good | Keep current                                     |
| `tailwindcss`    | ^4      | 4.x      | ✅ Good | Keep current                                     |
| `next-intl`      | 4.3.9   | 4.3.x    | ✅ Good | Keep current                                     |
| `eslint`         | ^9      | 9.x      | ✅ Good | Keep current                                     |
| `next-themes`    | 0.4.6   | 0.4.x    | ✅ Good | Keep current                                     |
| `lucide-react`   | 0.544.0 | 0.474.0+ | ⚠️ Old  | Update to latest                                 |
| `@types/node`    | ^20     | 22.x     | ⚠️ Old  | Update to 22.x                                   |
| `jest`           | 30.2.0  | 29.7.0   | ⚠️ RC   | Jest 30 is Release Candidate - monitor stability |

### Unused Dependencies

| Package | Purpose      | Recommendation                                                        |
| ------- | ------------ | --------------------------------------------------------------------- |
| `jose`  | JWT handling | ⚠️ Unused - either use it or remove it (currently using `jwt-decode`) |

---

## 🚨 Critical Issues

> **Note:** All critical issues listed below have been **fixed** as of 2026-02-05. See the [Critical Fixes Applied](#-critical-fixes-applied) section for details.

### CR-001: JWT Token Refresh Logic Bug ✅ FIXED

**Location:** `src/lib/apollo/client.ts` (lines 36-60)

**Status:** ✅ Fixed - Now uses `getRefreshToken()` and implements deduplication

**Description:**  
The token refresh mutation incorrectly passes the **expired access token** as the refresh token. The mutation expects a separate refresh token, but the code uses the access token variable.

**Current Code:**

```typescript
if (token && isTokenExpired(token)) {
  try {
    const response = await fetch(GRAPHQL_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: REFRESH_TOKEN_MUTATION.loc?.source.body,
        variables: { token }, // ❌ Using access token as refresh token
      }),
    });
    // ...
  }
}
```

**Impact:**

- Token refresh will fail, causing users to be logged out unexpectedly
- Poor user experience with frequent re-authentication
- Potential security vulnerability if backend accepts access tokens as refresh tokens

**Recommendation:**  
Implement a proper dual-token system with separate storage for access and refresh tokens:

```typescript
const REFRESH_TOKEN_KEY = "narbox_refresh_token";

// Get the correct refresh token
const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);

// Use it in the mutation
variables: {
  token: refreshToken;
}
```

**Priority:** 🔴 **CRITICAL - Fix Immediately**  
**Status:** ✅ Fixed - See [Critical Fixes Applied](#-critical-fixes-applied)

---

### CR-002: Wrong Authentication Mutation Name ✅ FIXED

**Location:** `src/graphql/mutations/auth.ts` (line 8-16)

**Description:**  
The frontend uses `tokenAuth` mutation, but according to the backend workflow documentation, the actual mutation name is `emailAuth`. Additionally, the backend returns **two tokens** (`token` and `refreshToken`), but the frontend only stores one.

**Current Code (Frontend):**

```typescript
export const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    tokenAuth(email: $email, password: $password) {  // ❌ Wrong: should be emailAuth
      token
      refreshExpiresIn
      payload
    }
  }
`;
```

**Backend Schema (from USER_WORKFLOWS.md):**

```graphql
mutation {
  emailAuth(email: "admin@example.com", password: "adminpass") {
    token # JWT access token (short-lived)
    refreshToken # Refresh token (long-lived)
    payload
    refreshExpiresIn
  }
}
```

**Impact:**

- Authentication will fail completely (mutation not found)
- No refresh token storage = users logged out when access token expires
- Cannot implement proper token refresh workflow

**Recommendation:**  
Update the mutation to match backend schema:

```typescript
export const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    emailAuth(email: $email, password: $password) {
      token
      refreshToken
      payload
      refreshExpiresIn
    }
  }
`;

export interface LoginResponse {
  emailAuth: {
    token: string;
    refreshToken: string;
    payload: unknown;
    refreshExpiresIn: number;
  };
}
```

**Priority:** 🔴 **CRITICAL - Fix Immediately**  
**Status:** ✅ Fixed - See [Critical Fixes Applied](#-critical-fixes-applied)

---

### CR-003: Unused `rememberMe` State Creates Confusing UX ✅ FIXED

**Location:** `src/app/(auth)/login/page.tsx` (line 28)

**Description:**  
The login page captures `rememberMe` checkbox state but never uses or persists it. Users expect their preference to be honored, but the application ignores it.

**Current Code:**

```typescript
const [rememberMe, setRememberMe] = useState(false); // ❌ Never used
```

**Impact:**

- Confusing user experience
- False sense of security/persistence
- Broken feature promise

**Recommendation:**  
Either implement the feature properly or remove the UI element:

```typescript
// Option 1: Implement properly
const STORAGE = rememberMe ? localStorage : sessionStorage;
STORAGE.setItem(ACCESS_TOKEN_KEY, token);

// Option 2: Remove the checkbox if not needed
```

**Priority:** 🔴 **CRITICAL - Fix Immediately**  
**Status:** ✅ Fixed - See [Critical Fixes Applied](#-critical-fixes-applied)

---

### CR-004: Hardcoded HTML Lang Attribute ✅ FIXED

**Location:** `src/app/layout.tsx` (line 35)

**Description:**  
The HTML `lang` attribute is hardcoded to `"es"` regardless of the actual locale selected by the user. This affects accessibility (screen readers) and SEO.

**Current Code:**

```tsx
<html lang="es"> {/* ❌ Hardcoded Spanish */}
```

**Impact:**

- Accessibility issues for screen readers
- SEO problems for non-Spanish content
- Violates i18n best practices

**Recommendation:**  
Use dynamic locale from next-intl:

```typescript
import { getLocale } from "next-intl/server";

export default async function RootLayout({ children }) {
  const locale = await getLocale();
  return (
    <html lang={locale}> {/* ✅ Dynamic locale */}
      {/* ... */}
    </html>
  );
}
```

**Priority:** 🔴 **CRITICAL - Fix Immediately**  
**Status:** ✅ Fixed - See [Critical Fixes Applied](#-critical-fixes-applied)

---

### CR-005: Duplicate Token Refresh Logic Causing Race Conditions ✅ FIXED

**Locations:**

- `src/lib/apollo/client.ts` (authLink: lines 32-68, errorLink: lines 85-137)
- `src/contexts/AuthContext.tsx` (lines 76-100)

**Description:**  
Token refresh logic is implemented in three different places with slight variations. This creates:

- Race conditions when multiple requests fail simultaneously
- Code duplication and maintenance burden
- Inconsistent error handling

**Impact:**

- Multiple simultaneous refresh attempts
- Potential token state corruption
- Inconsistent user experience
- Harder to debug authentication issues

**Recommendation:**  
Consolidate into a single TokenManager class:

```typescript
// src/lib/auth/tokenManager.ts
class TokenManager {
  private refreshPromise: Promise<string | null> | null = null;

  async refreshToken(): Promise<string | null> {
    // Return existing promise if refresh is in progress
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    this.refreshPromise = this.performRefresh();
    const result = await this.refreshPromise;
    this.refreshPromise = null;
    return result;
  }

  private async performRefresh(): Promise<string | null> {
    // Single implementation
  }
}

export const tokenManager = new TokenManager();
```

**Priority:** 🔴 **CRITICAL - Fix Immediately**

---

## ✅ Critical Fixes Applied

**Date:** 2026-02-05  
**Status:** All 7 critical issues have been resolved

### Summary of Changes

| Issue             | File                            | Fix Description                                                                                                                                                                                 |
| ----------------- | ------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| CR-001 / AUTH-002 | `src/lib/apollo/client.ts`      | Fixed token refresh to use `getRefreshToken()` instead of `getAccessToken()`. Added deduplication with `refreshPromise` to prevent race conditions. Added `AbortController` with 10s timeout.   |
| CR-002 / AUTH-001 | `src/graphql/mutations/auth.ts` | Changed `tokenAuth` → `emailAuth`. Added `refreshToken` to mutation response. Updated TypeScript interfaces.                                                                                    |
| CR-003            | `src/app/(auth)/login/page.tsx` | Removed unused `rememberMe` state and checkbox UI.                                                                                                                                              |
| CR-004            | `src/app/layout.tsx`            | Added dynamic locale using `getLocale()` from `next-intl/server`. Changed `<html lang="es">` → `<html lang={locale}>`.                                                                          |
| CR-005            | `src/contexts/AuthContext.tsx`  | Added deduplication pattern (`refreshPromise`). Updated to use `emailAuth` response with `refreshToken`. Added `getRefreshToken()` usage. Fixed `loadUser()` to check refresh token expiration. |
| AUTH-002          | `src/lib/auth/tokens.ts`        | Added `REFRESH_TOKEN_KEY`. Updated `saveTokens()` to accept both tokens. Added `getRefreshToken()` and `isRefreshTokenExpired()` functions.                                                     |

### Key Improvements

1. **Dual-Token System**: The application now properly stores and uses both access tokens and refresh tokens
2. **Race Condition Prevention**: Token refresh deduplication prevents multiple simultaneous refresh attempts
3. **Proper Backend Compatibility**: Authentication mutation now matches the backend GraphQL schema (`emailAuth`)
4. **i18n Accessibility**: HTML lang attribute is now dynamic based on user locale
5. **Cleaner UX**: Removed confusing unused "Remember Me" checkbox

### Verification

- ✅ TypeScript type-check: Passed
- ✅ ESLint: Passed (5 pre-existing warnings)
- ✅ Unit tests: 15/15 Passed

---

## 🔌 Backend API Compatibility Issues

Based on analysis of `documents/USER_WORKFLOWS.md`, the following GraphQL schema mismatches have been identified:

### AUTH-001: Authentication Mutation Mismatch ✅ FIXED

| Aspect       | Before (Incorrect)                     | After (Correct)                                        | Status   |
| ------------ | -------------------------------------- | ------------------------------------------------------ | -------- |
| **Mutation** | `tokenAuth`                            | `emailAuth`                                            | ✅ Fixed |
| **Returns**  | `token`, `refreshExpiresIn`, `payload` | `token`, `refreshToken`, `payload`, `refreshExpiresIn` | ✅ Fixed |

### AUTH-002: Token Storage Gap ✅ FIXED

| Token Type    | Frontend Storage          | Required | Status     |
| ------------- | ------------------------- | -------- | ---------- |
| Access Token  | ✅ `narbox_access_token`  | ✅ Yes   | ✅ Working |
| Refresh Token | ✅ `narbox_refresh_token` | ✅ Yes   | ✅ Fixed   |

### QUERY-001: Missing Client Restrictions

According to the permission matrix:

| Query             | Backend Restriction   | Frontend Filter Needed     |
| ----------------- | --------------------- | -------------------------- |
| `allConsolidates` | ⚠️ None (returns all) | ✅ Should filter by client |
| `consolidateById` | ⚠️ None               | ✅ Should verify ownership |

### MUT-001: Consolidation Status Transitions

The backend does not validate status transitions. Frontend must enforce:

```
┌──────────────────┐     ┌───────────┐     ┌────────────┐     ┌─────────────┐     ┌───────────┐
│awaiting_payment  │────→│  pending  │────→│ processing │────→│  in_transit │────→│ delivered │
└──────────────────┘     └───────────┘     └────────────┘     └─────────────┘     └───────────┘
        │                      │                  │                   │
        └──────────────────────┴──────────────────┴───────────────────┘
                                   ↓
                             ┌───────────┐
                             │ cancelled │
                             └───────────┘
```

### ROLE-001: Permission Matrix Summary

| Operation           | Admin    | Client   | Frontend Check         |
| ------------------- | -------- | -------- | ---------------------- |
| **Queries**         |          |          |                        |
| `me`                | ✅       | ✅       | ✅ Implemented         |
| `dashboard`         | All data | Own only | ⚠️ Partial             |
| `allClients`        | All      | ❌       | ❌ Not checked         |
| `allPackages`       | All      | Own only | ⚠️ Partial             |
| `allConsolidates`   | All      | All\*    | ❌ Missing             |
| **Mutations**       |          |          |                        |
| `createClient`      | ✅       | ❌       | ✅ Checked             |
| `updateClient`      | Any      | Own      | ⚠️ Partial             |
| `createPackage`     | ✅       | ❌       | ✅ Checked             |
| `createConsolidate` | ✅       | ❌       | ✅ Checked             |
| `updateConsolidate` | ✅       | ❌       | ⚠️ Should check status |

\*Backend currently returns all consolidations regardless of client

---

## ⚠️ Medium Issues

### MED-001: Missing Consolidation Status Validation

**Location:** `src/app/(dashboard)/admin/packages/components/`

**Description:**  
According to USER_WORKFLOWS.md, consolidation status has specific valid transitions:

```
awaiting_payment → pending → processing → in_transit → delivered
        ↓              ↓           ↓            ↓
    cancelled      cancelled   cancelled    cancelled
```

**Valid Transitions:**
| Current Status | Allowed Next Statuses |
|----------------|----------------------|
| `awaiting_payment` | `pending`, `cancelled` |
| `pending` | `processing`, `cancelled` |
| `processing` | `in_transit`, `cancelled` |
| `in_transit` | `delivered`, `cancelled` |
| `delivered` | (none - final state) |
| `cancelled` | (none - final state) |

The frontend currently has no validation to prevent invalid status transitions.

**Impact:**

- Users can set invalid status combinations
- Business logic violations
- Data inconsistency

**Recommendation:**  
Implement status transition validation:

```typescript
// src/lib/validation/status.ts
export type ConsolidationStatus =
  | "awaiting_payment"
  | "pending"
  | "processing"
  | "in_transit"
  | "delivered"
  | "cancelled";

const VALID_TRANSITIONS: Record<ConsolidationStatus, ConsolidationStatus[]> = {
  awaiting_payment: ["pending", "cancelled"],
  pending: ["processing", "cancelled"],
  processing: ["in_transit", "cancelled"],
  in_transit: ["delivered", "cancelled"],
  delivered: [],
  cancelled: [],
};

export function isValidStatusTransition(
  current: ConsolidationStatus,
  next: ConsolidationStatus
): boolean {
  if (current === next) return true;
  return VALID_TRANSITIONS[current]?.includes(next) ?? false;
}

export function getAllowedNextStatuses(
  current: ConsolidationStatus
): ConsolidationStatus[] {
  return VALID_TRANSITIONS[current] ?? [];
}
```

**Priority:** 🟡 **MEDIUM - Address in Next Sprint**

---

### MED-002: Missing Permission Checks for Client Operations

**Location:** `src/components/admin/`, `src/app/(dashboard)/client/`

**Description:**  
According to the permission matrix in USER_WORKFLOWS.md:

| Operation               | Admin | Client                     |
| ----------------------- | ----- | -------------------------- |
| `allConsolidates` query | All   | ✅ (Note: No restrictions) |
| `consolidateById` query | Any   | ✅ (Note: No restrictions) |

The backend currently allows clients to view ALL consolidations, not just their own. The frontend should implement client-side filtering to only show the user's own data until backend restrictions are added.

**Impact:**

- Potential data privacy issues
- Clients may see other clients' consolidations

**Recommendation:**  
Add client-side filtering and display warnings:

```typescript
// In client consolidation list component
const { data } = useQuery(GET_ALL_CONSOLIDATIONS);
const { user } = useAuth();

// Filter to only show user's consolidations
const myConsolidations = useMemo(() => {
  if (!data?.allConsolidates) return [];
  if (user?.role === UserRole.ADMIN) return data.allConsolidates;

  // TODO: Remove once backend adds proper restrictions
  console.warn(
    "Backend does not filter consolidations by client - applying client-side filter"
  );
  return data.allConsolidates.filter((c) => c.client.email === user?.email);
}, [data, user]);
```

**Priority:** 🟡 **MEDIUM - Address in Next Sprint**

---

### MED-003: Unused `jose` Library

**Location:** `package.json`

**Description:**  
The `jose` library (v6.1.0) is installed but never used. The codebase uses `jwt-decode` instead.

**Impact:**

- Unnecessary bundle size increase
- Dependency confusion

**Recommendation:**  
Choose one library:

- **Keep `jose`:** More secure, standards-compliant, better for production
- **Keep `jwt-decode`:** Lighter weight, simpler API

```typescript
// If using jose (recommended for production)
import { jwtVerify, decodeJwt } from "jose";

export async function verifyToken(token: string, secret: string) {
  const { payload } = await jwtVerify(token, new TextEncoder().encode(secret));
  return payload;
}
```

**Priority:** 🟡 **MEDIUM - Address in Next Sprint**

---

### MED-004: No Rate Limiting on Login Attempts

**Location:** `src/contexts/AuthContext.tsx` (login function)

**Description:**  
The login form has no protection against brute force attacks. An attacker can make unlimited login attempts.

**Impact:**

- Security vulnerability to brute force attacks
- Potential account lockout bypass

**Recommendation:**  
Implement client-side rate limiting:

```typescript
// src/hooks/useRateLimit.ts
export function useRateLimit(maxAttempts: number, windowMs: number) {
  const [attempts, setAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockExpiry, setLockExpiry] = useState<number | null>(null);

  const attempt = useCallback(() => {
    if (isLocked) return false;

    if (attempts >= maxAttempts - 1) {
      setIsLocked(true);
      const expiry = Date.now() + windowMs;
      setLockExpiry(expiry);
      setTimeout(() => {
        setIsLocked(false);
        setAttempts(0);
        setLockExpiry(null);
      }, windowMs);
      return false;
    }

    setAttempts((a) => a + 1);
    return true;
  }, [attempts, isLocked, maxAttempts, windowMs]);

  return { attempt, isLocked, lockExpiry, remaining: maxAttempts - attempts };
}
```

**Priority:** 🟡 **MEDIUM - Address in Next Sprint**

---

### MED-005: Missing CSRF Protection

**Location:** `src/lib/apollo/client.ts`

**Description:**  
GraphQL mutations lack CSRF token protection. While JWT tokens provide some protection, CSRF tokens add an additional security layer.

**Impact:**

- Potential CSRF attacks if JWT is compromised
- Security best practice violation

**Recommendation:**  
If using cookie-based auth, implement CSRF tokens. For JWT in headers, ensure proper CORS configuration on backend.

**Priority:** 🟡 **MEDIUM - Address in Next Sprint**

---

### MED-006: No Input Sanitization

**Location:** Multiple form components

**Description:**  
User inputs are sent directly to GraphQL without sanitization, potentially allowing XSS or injection attacks.

**Impact:**

- XSS vulnerabilities
- GraphQL injection risks

**Recommendation:**  
Implement input sanitization:

```typescript
// src/lib/utils/sanitize.ts
import DOMPurify from "isomorphic-dompurify";

export function sanitizeInput(input: string): string {
  return DOMPurify.sanitize(input.trim(), { ALLOWED_TAGS: [] });
}

// Use in forms
const sanitizedEmail = sanitizeInput(email);
```

**Priority:** 🟡 **MEDIUM - Address in Next Sprint**

---

### MED-007: Inconsistent Client ID Type

**Location:** `src/graphql/queries/clients.ts`

**Description:**

- `ClientType.id` is typed as `string` (line 61)
- `GetClientVariables.id` is typed as `number` (line 146)

This inconsistency can cause runtime errors when the actual GraphQL schema uses one type consistently.

**Recommendation:**  
Align types with backend schema:

```typescript
// If GraphQL uses ID (string) type:
export interface GetClientVariables {
  id: string; // Change from number to string
}
```

**Priority:** 🟡 **MEDIUM - Address in Next Sprint**

---

### MED-008: No Pagination Limits on `pageSize`

**Location:** `src/hooks/useClientTableState.ts` (lines 57-60)

**Description:**  
The page size parameter has no upper limit, allowing requests for excessive data.

**Current Code:**

```typescript
const pageSize = pageSizeParam
  ? Math.max(1, parseInt(pageSizeParam, 10)) // ❌ No upper limit
  : defaultPageSize;
```

**Impact:**

- Performance degradation with large page sizes
- Potential DoS vector
- Memory issues on client

**Recommendation:**  
Add maximum limit:

```typescript
const MAX_PAGE_SIZE = 100;

const pageSize = pageSizeParam
  ? Math.min(MAX_PAGE_SIZE, Math.max(1, parseInt(pageSizeParam, 10)))
  : defaultPageSize;
```

**Priority:** 🟡 **MEDIUM - Address in Next Sprint**

---

### MED-009: Middleware Does Nothing Useful

**Location:** `middleware.ts`

**Description:**  
The Next.js middleware simply passes through all requests without adding value.

**Current Code:**

```typescript
export function middleware() {
  // Just pass through - locale detection handled by cookies/headers in client
  return NextResponse.next();
}
```

**Impact:**

- Unnecessary processing overhead
- Missed opportunity for auth checks, redirects, or headers

**Recommendation:**  
Either:

1. Implement useful middleware (auth checks, redirects)
2. Remove the file if not needed

```typescript
// Example: Protected route middleware
export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const isAuthPage = request.nextUrl.pathname.startsWith("/login");

  if (!token && !isAuthPage) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}
```

**Priority:** 🟡 **MEDIUM - Address in Next Sprint**

---

### MED-010: Missing Loading State for Lazy Query

**Location:** `src/contexts/AuthContext.tsx` (lines 51-53)

**Description:**  
`useLazyQuery` for `getCurrentUser` doesn't expose loading state, causing potential UI inconsistencies.

**Recommendation:**  
Track loading state manually or switch to `useQuery` with `skip` option:

```typescript
const [getCurrentUser, { loading: userLoading }] =
  useLazyQuery<GetCurrentUserResponse>(GET_CURRENT_USER);

// Combine with existing loading state
const isLoading = loading || userLoading;
```

**Priority:** 🟡 **MEDIUM - Address in Next Sprint**

---

## 🔧 Low Issues

### LOW-001: Missing React Error Boundary

**Location:** App-wide

**Description:**  
No global error boundary exists to catch runtime errors gracefully.

**Recommendation:**  
Create an error boundary component:

```typescript
// src/components/common/ErrorBoundary.tsx
"use client";

import React, { Component, ReactNode } from "react";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("ErrorBoundary caught:", error, info);
    // TODO: Send to error tracking service (Sentry, etc.)
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="min-h-screen flex items-center justify-center p-4">
            <div className="text-center space-y-4">
              <AlertCircle className="h-12 w-12 text-destructive mx-auto" />
              <h1 className="text-2xl font-bold">Something went wrong</h1>
              <p className="text-muted-foreground">
                {this.state.error?.message || "An unexpected error occurred"}
              </p>
              <Button onClick={this.handleRetry}>Try Again</Button>
            </div>
          </div>
        )
      );
    }
    return this.props.children;
  }
}
```

**Priority:** 🟢 **LOW - Fix When Convenient**

---

### LOW-002: Test Coverage Threshold is 0%

**Location:** `jest.config.js` (lines 27-34)

**Description:**  
All coverage thresholds are set to 0%, effectively disabling coverage enforcement.

**Current Code:**

```javascript
coverageThreshold: {
  global: {
    branches: 0,
    functions: 0,
    lines: 0,
    statements: 0,
  },
}
```

**Recommendation:**  
Set reasonable thresholds and gradually increase:

```javascript
coverageThreshold: {
  global: {
    branches: 50,
    functions: 60,
    lines: 70,
    statements: 70,
  },
}
```

**Priority:** 🟢 **LOW - Fix When Convenient**

---

### LOW-003: Simplistic Email Validation Regex

**Location:** Multiple files (login page, AddClientDialog, etc.)

**Description:**  
The email validation regex is overly simplistic and misses many edge cases.

**Current Code:**

```typescript
/^[^\s@]+@[^\s@]+\.[^\s@]+$/; // ❌ Misses edge cases
```

**Recommendation:**  
Use Zod for validation:

```typescript
import { z } from "zod";

const emailSchema = z.string().email("Please enter a valid email address");

// Or use a more comprehensive regex
const EMAIL_REGEX =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
```

**Priority:** 🟢 **LOW - Fix When Convenient**

---

### LOW-004: Magic Numbers in Token Expiration

**Location:** `src/lib/auth/tokens.ts` (line 65)

**Description:**  
The token expiration buffer uses a magic number without explanation.

**Current Code:**

```typescript
return decoded.exp < currentTime + 30; // ❌ What is 30?
```

**Recommendation:**  
Use named constants:

```typescript
const TOKEN_REFRESH_BUFFER_SECONDS = 30; // Refresh 30s before expiry

return decoded.exp < currentTime + TOKEN_REFRESH_BUFFER_SECONDS;
```

**Priority:** 🟢 **LOW - Fix When Convenient**

---

### LOW-005: Missing AbortController for Fetch Requests

**Location:** `src/lib/apollo/client.ts`

**Description:**  
Manual fetch requests for token refresh don't use AbortController, potentially causing memory leaks.

**Recommendation:**  
Add timeout and cleanup:

```typescript
const controller = new AbortController();
const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

try {
  const response = await fetch(GRAPHQL_API_URL, {
    method: "POST",
    signal: controller.signal,
    // ...
  });
} finally {
  clearTimeout(timeoutId);
}
```

**Priority:** 🟢 **LOW - Fix When Convenient**

---

### LOW-006: Console Errors in Production

**Location:** Multiple files

**Description:**  
Console.error statements are not stripped in production builds.

**Recommendation:**  
Use a proper logging utility:

```typescript
// src/lib/logger.ts
const isDevelopment = process.env.NODE_ENV === "development";

export const logger = {
  error: (message: string, ...args: unknown[]) => {
    if (isDevelopment) {
      console.error(message, ...args);
    }
    // Send to error tracking service in production
  },
  warn: (message: string, ...args: unknown[]) => {
    if (isDevelopment) {
      console.warn(message, ...args);
    }
  },
  info: (message: string, ...args: unknown[]) => {
    if (isDevelopment) {
      console.info(message, ...args);
    }
  },
};
```

**Priority:** 🟢 **LOW - Fix When Convenient**

---

## ✅ Proposed Improvements

### IMP-001: Consolidate Token Management

**Create a unified token manager:**

```typescript
// src/lib/auth/tokenManager.ts
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  exp: number;
  sub: string;
  [key: string]: unknown;
}

const ACCESS_TOKEN_KEY = "narbox_access_token";
const REFRESH_TOKEN_KEY = "narbox_refresh_token";
const TOKEN_REFRESH_BUFFER = 30; // seconds

class TokenManager {
  private refreshPromise: Promise<string | null> | null = null;

  getAccessToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  }

  getRefreshToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  }

  setTokens(accessToken: string, refreshToken: string): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  }

  clearTokens(): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  }

  isAccessTokenExpired(): boolean {
    const token = this.getAccessToken();
    if (!token) return true;

    try {
      const decoded = jwtDecode<DecodedToken>(token);
      const currentTime = Date.now() / 1000;
      return decoded.exp < currentTime + TOKEN_REFRESH_BUFFER;
    } catch {
      return true;
    }
  }

  async refreshAccessToken(): Promise<string | null> {
    // Prevent multiple simultaneous refresh attempts
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    this.refreshPromise = this.performRefresh();
    const result = await this.refreshPromise;
    this.refreshPromise = null;
    return result;
  }

  private async performRefresh(): Promise<string | null> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) return null;

    try {
      // Implementation here
      return null; // Placeholder
    } catch {
      this.clearTokens();
      return null;
    }
  }
}

export const tokenManager = new TokenManager();
```

---

### IMP-002: Add Security Headers

**Update `next.config.ts`:**

```typescript
import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n.ts");

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: https:",
              "font-src 'self'",
              "connect-src 'self' https://nbx-django-production.up.railway.app",
            ].join("; "),
          },
        ],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
```

---

### IMP-003: Implement Form Validation with Zod

**Create validation schemas:**

```typescript
// src/lib/validation/auth.ts
import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  rememberMe: z.boolean().default(false),
});

export type LoginInput = z.infer<typeof loginSchema>;

// src/lib/validation/client.ts
export const createClientSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  identificationNumber: z.string().optional(),
  mobilePhoneNumber: z
    .string()
    .regex(/^\d*$/, "Only numbers allowed")
    .optional(),
  phoneNumber: z.string().regex(/^\d*$/, "Only numbers allowed").optional(),
  state: z.string().optional(),
  city: z.string().optional(),
  mainStreet: z.string().optional(),
  secondaryStreet: z.string().optional(),
  buildingNumber: z.string().optional(),
});

export type CreateClientInput = z.infer<typeof createClientSchema>;
```

---

### IMP-004: Add API Response Caching

**Implement cache control for Apollo:**

```typescript
// src/lib/apollo/cache.ts
import { InMemoryCache, TypePolicy } from "@apollo/client";

const typePolicies: Record<string, TypePolicy> = {
  Query: {
    fields: {
      allClients: {
        keyArgs: ["search", "orderBy"],
        merge(existing, incoming) {
          if (!existing) return incoming;
          return {
            ...incoming,
            results: [...existing.results, ...incoming.results],
          };
        },
      },
    },
  },
  Client: {
    keyFields: ["id"],
  },
};

export function createCache() {
  return new InMemoryCache({
    typePolicies,
  });
}
```

---

### IMP-005: Add React Query DevTools (for Apollo)

**Install Apollo DevTools for better debugging:**

```typescript
// src/lib/apollo/client.ts
export function createApolloClient(): ApolloClient<NormalizedCacheObject> {
  const client = new ApolloClient({
    // ... existing config
    connectToDevTools: process.env.NODE_ENV === "development",
  });

  // Enable Apollo DevTools in development
  if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
    (
      window as unknown as { __APOLLO_CLIENT__: typeof client }
    ).__APOLLO_CLIENT__ = client;
  }

  return client;
}
```

---

### IMP-006: Add Health Check Endpoint

**Create a simple health check:**

```typescript
// src/app/api/health/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || "0.1.0",
  });
}
```

---

### IMP-007: Implement Loading States

**Create skeleton loading components:**

```typescript
// src/components/ui/skeleton.tsx
import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-muted",
        className
      )}
    />
  );
}

// src/components/common/TableSkeleton.tsx
export function TableSkeleton({ rows = 5, columns = 4 }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-2">
          {Array.from({ length: columns }).map((_, j) => (
            <Skeleton key={j} className="h-10 flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
}
```

---

### IMP-008: Add E2E Test Coverage

**Create essential E2E tests:**

```typescript
// e2e/auth.spec.ts
import { test, expect } from "@playwright/test";

test.describe("Authentication", () => {
  test("successful login redirects to dashboard", async ({ page }) => {
    await page.goto("/login");
    await page.fill('[name="email"]', "admin@example.com");
    await page.fill('[name="password"]', "password123");
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL(/\/admin\/dashboard/);
  });

  test("invalid credentials show error", async ({ page }) => {
    await page.goto("/login");
    await page.fill('[name="email"]', "wrong@example.com");
    await page.fill('[name="password"]', "wrongpass");
    await page.click('button[type="submit"]');

    await expect(page.locator('[role="alert"]')).toBeVisible();
  });

  test("unauthenticated users are redirected to login", async ({ page }) => {
    await page.goto("/admin/dashboard");
    await expect(page).toHaveURL("/login");
  });
});
```

---

### IMP-009: Add Performance Monitoring

**Implement Core Web Vitals tracking:**

```typescript
// src/lib/analytics/vitals.ts
import { onCLS, onFID, onFCP, onLCP, onTTFB } from "web-vitals";

export function reportWebVitals() {
  if (process.env.NODE_ENV !== "production") return;

  const sendToAnalytics = (metric: {
    name: string;
    value: number;
    id: string;
  }) => {
    // Send to your analytics service
    console.log("Web Vital:", metric);
  };

  onCLS(sendToAnalytics);
  onFID(sendToAnalytics);
  onFCP(sendToAnalytics);
  onLCP(sendToAnalytics);
  onTTFB(sendToAnalytics);
}
```

---

### IMP-010: Add Documentation Comments

---

### IMP-011: Implement Correct Authentication Flow

**Based on USER_WORKFLOWS.md, implement the proper authentication system:**

```typescript
// src/graphql/mutations/auth.ts - CORRECTED
import { gql } from "@apollo/client";

export const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    emailAuth(email: $email, password: $password) {
      token
      refreshToken
      payload
      refreshExpiresIn
    }
  }
`;

export const REFRESH_TOKEN_MUTATION = gql`
  mutation RefreshToken($token: String!) {
    refreshToken(token: $token) {
      token
      payload
      refreshExpiresIn
    }
  }
`;

export const LOGOUT_MUTATION = gql`
  mutation Logout {
    revokeToken {
      revoked
    }
  }
`;

export interface LoginResponse {
  emailAuth: {
    token: string;
    refreshToken: string;
    payload: {
      email: string;
      exp: number;
      origIat: number;
    };
    refreshExpiresIn: number;
  };
}

export interface RefreshTokenResponse {
  refreshToken: {
    token: string;
    payload: {
      email: string;
      exp: number;
      origIat: number;
    };
    refreshExpiresIn: number;
  };
}
```

```typescript
// src/lib/auth/tokens.ts - CORRECTED
const ACCESS_TOKEN_KEY = "narbox_access_token";
const REFRESH_TOKEN_KEY = "narbox_refresh_token";

interface DecodedToken {
  exp: number;
  email: string;
  origIat: number;
}

/**
 * Save both access and refresh tokens
 */
export function saveTokens(accessToken: string, refreshToken: string): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  } catch (error) {
    console.error("Failed to save tokens:", error);
  }
}

/**
 * Get refresh token for token refresh
 */
export function getRefreshToken(): string | null {
  if (typeof window === "undefined") return null;

  try {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  } catch (error) {
    console.error("Failed to get refresh token:", error);
    return null;
  }
}

/**
 * Get access token for API calls
 */
export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;

  try {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  } catch (error) {
    console.error("Failed to get access token:", error);
    return null;
  }
}

/**
 * Clear all tokens on logout
 */
export function clearTokens(): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  } catch (error) {
    console.error("Failed to clear tokens:", error);
  }
}

/**
 * Check if access token is expired
 */
export function isTokenExpired(token: string): boolean {
  try {
    const decoded = jwtDecode<DecodedToken>(token);
    const currentTime = Date.now() / 1000;
    const BUFFER_SECONDS = 30;

    return decoded.exp < currentTime + BUFFER_SECONDS;
  } catch (error) {
    console.error("Failed to decode token:", error);
    return true;
  }
}

/**
 * Check if refresh token is expired
 */
export function isRefreshTokenExpired(): boolean {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return true;

  try {
    const decoded = jwtDecode<DecodedToken>(refreshToken);
    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime;
  } catch {
    return true;
  }
}
```

### IMP-012: Implement Consolidation Status Workflow

**Based on USER_WORKFLOWS.md status transitions:**

```typescript
// src/lib/workflow/consolidation.ts
export type ConsolidationStatus =
  | "awaiting_payment"
  | "pending"
  | "processing"
  | "in_transit"
  | "delivered"
  | "cancelled";

export const STATUS_LABELS: Record<ConsolidationStatus, string> = {
  awaiting_payment: "Awaiting Payment",
  pending: "Pending",
  processing: "Processing",
  in_transit: "In Transit",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export const STATUS_COLORS: Record<ConsolidationStatus, string> = {
  awaiting_payment: "bg-yellow-500",
  pending: "bg-blue-500",
  processing: "bg-purple-500",
  in_transit: "bg-orange-500",
  delivered: "bg-green-500",
  cancelled: "bg-red-500",
};

const VALID_TRANSITIONS: Record<ConsolidationStatus, ConsolidationStatus[]> = {
  awaiting_payment: ["pending", "cancelled"],
  pending: ["processing", "cancelled"],
  processing: ["in_transit", "cancelled"],
  in_transit: ["delivered", "cancelled"],
  delivered: [],
  cancelled: [],
};

export function isValidStatusTransition(
  current: ConsolidationStatus,
  next: ConsolidationStatus
): boolean {
  if (current === next) return true;
  return VALID_TRANSITIONS[current]?.includes(next) ?? false;
}

export function getAllowedNextStatuses(
  current: ConsolidationStatus
): ConsolidationStatus[] {
  return VALID_TRANSITIONS[current] ?? [];
}

export function isFinalStatus(status: ConsolidationStatus): boolean {
  return status === "delivered" || status === "cancelled";
}

// React Hook for status management
export function useConsolidationStatus(currentStatus: ConsolidationStatus) {
  const allowedStatuses = getAllowedNextStatuses(currentStatus);
  const isFinal = isFinalStatus(currentStatus);

  const canTransitionTo = (nextStatus: ConsolidationStatus): boolean => {
    return isValidStatusTransition(currentStatus, nextStatus);
  };

  return {
    allowedStatuses,
    isFinal,
    canTransitionTo,
  };
}
```

**Improve JSDoc coverage:**

````typescript
/**
 * Custom hook for managing client table state with URL synchronization.
 *
 * @param options - Configuration options
 * @param options.defaultPageSize - Initial page size (default: 10)
 * @param options.defaultSortField - Default sort field (default: "created_at")
 * @param options.defaultSortOrder - Default sort order (default: "desc")
 *
 * @returns Object containing current state, update function, and orderBy getter
 *
 * @example
 * ```tsx
 * const { state, updateURL, getOrderBy } = useClientTableState({
 *   defaultPageSize: 25,
 *   defaultSortField: "full_name",
 * });
 *
 * // Update search
 * updateURL({ search: "john" });
 *
 * // Get GraphQL orderBy string
 * const orderBy = getOrderBy(); // "-created_at"
 * ```
 */
export function useClientTableState(
  options: UseClientTableStateOptions = {}
): UseClientTableStateReturn {
  // Implementation
}
````

---

## 📋 Workflow Implementation Gaps

Based on `documents/USER_WORKFLOWS.md`, the following workflow features are missing or incomplete:

### Missing Features

| Feature                                | Status                                                     | Priority    |
| -------------------------------------- | ---------------------------------------------------------- | ----------- |
| **Dual Token Storage**                 | ✅ Implemented - stores both access and refresh tokens     | 🔴 Critical |
| **Email Auth Mutation**                | ✅ Fixed - now using correct `emailAuth` mutation          | 🔴 Critical |
| **Status Transition Validation**       | No client-side validation                                  | 🟡 Medium   |
| **Consolidation Permission Filtering** | Backend returns all, no client filter                      | 🟡 Medium   |
| **Auto-generated Password Flow**       | New clients get auto-generated passwords (not implemented) | 🟢 Low      |
| **Client Activation Flow**             | New accounts created as `isActive: false`                  | 🟢 Low      |
| **Email Notifications**                | `sendEmail` parameter not used in consolidations           | 🟢 Low      |

### Workflow Steps Implementation Status

| Step                    | Admin Workflow               | Client Workflow          | Status                       |
| ----------------------- | ---------------------------- | ------------------------ | ---------------------------- |
| 1. Authentication       | ✅ Login mutation exists     | ✅ Login mutation exists | ✅ Fixed - using `emailAuth` |
| 2. Create Client        | ✅ `AddClientDialog` exists  | N/A                      | ⚠️ Missing password handling |
| 3. Create Packages      | ✅ `AddPackageDialog` exists | N/A                      | ✅ Implemented               |
| 4. Create Consolidation | ⚠️ Basic implementation      | N/A                      | ⚠️ Missing status validation |
| 5. Update Status        | ⚠️ No transition validation  | N/A                      | ❌ Not implemented           |
| 6. Dashboard            | ✅ Admin dashboard           | ⚠️ Client dashboard      | ⚠️ Partial                   |
| 7. Query Clients        | ✅ Client table              | ❌ N/A                   | ✅ Implemented               |

---

## 📈 Action Plan

### Phase 1: Critical Fixes (Week 1) ✅ COMPLETED

- [x] Fix authentication mutation name (`tokenAuth` → `emailAuth`) (CR-002)
- [x] Implement dual token storage (access + refresh) (CR-001)
- [x] Fix token refresh logic to use refresh token (CR-001)
- [x] Fix or remove `rememberMe` (CR-003)
- [x] Fix HTML lang attribute (CR-004)
- [x] Consolidate token refresh logic (CR-005)

### Phase 2: Security & Stability (Week 2-3)

- [ ] Add rate limiting on login (MED-004)
- [ ] Add input sanitization (MED-006)
- [ ] Fix pagination limits (MED-008)
- [ ] Update or remove unused `jose` library (MED-003)
- [ ] Add consolidation status transition validation (MED-001)
- [ ] Add client-side consolidation filtering (MED-002)

### Phase 3: Code Quality (Week 4)

- [ ] Add Error Boundary (LOW-001)
- [ ] Set test coverage thresholds (LOW-002)
- [ ] Replace magic numbers with constants (LOW-004)
- [ ] Add proper logging utility (LOW-006)
- [ ] Implement client activation workflow
- [ ] Add auto-generated password display/handling

### Phase 4: Enhancements (Ongoing)

- [ ] Implement Zod validation schemas (IMP-003)
- [ ] Add security headers (IMP-002)
- [ ] Create skeleton loading states (IMP-007)
- [ ] Add E2E test coverage (IMP-008)

---

## 🛠️ Quick Fixes

Run these commands to address immediate issues:

```bash
# Update outdated packages
npm update lucide-react @types/node

# Check for security vulnerabilities
npm audit
npm audit fix

# Run tests to ensure stability
npm test

# Run linting
npm run lint

# Run type checking
npm run type-check
```

---

## 📞 Questions & Support

For questions about this report:

1. Review the relevant code sections
2. Check the AGENTS.md file for project conventions
3. Consult the Next.js and Apollo Client documentation

---

**Report generated by:** AI Code Analysis  
**Last updated:** 2026-02-05

### Additional Changes

- ✅ Added `tsconfig.tsbuildinfo` to `.gitignore` to prevent committing TypeScript build info files
