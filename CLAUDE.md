# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

NBX React is a Next.js 16 frontend for NarBox, a package handling/courier company. It connects to a Django backend via GraphQL (Graphene) and provides separate interfaces for admin and client users (JWT auth, role-based access).

## Commands

```bash
# Development
pnpm run dev                # Start dev server with Turbopack (http://localhost:3000)
pnpm run build              # Production build
pnpm start                  # Start production server

# Code Quality
pnpm run lint               # ESLint check
ppnpm run lint:fix           # ESLint auto-fix
pnpm run format             # Prettier format all files
pnpm run type-check         # TypeScript type checking (tsc --noEmit)

# Testing
pnpm test                   # Run all unit tests (Jest)
pnpm run test:watch         # Watch mode
pnpm run test:coverage      # With coverage report
pnpm exec jest path/to/file.test.tsx          # Single unit test
pnpm run test:e2e           # Playwright E2E tests
pnpm exec playwright test e2e/file.spec.ts    # Single E2E test

# shadcn/ui
pnpm dlx shadcn add <component-name>         # Add shadcn component to src/components/ui/

# Docker
pnpm run docker:up          # Start container
pnpm run docker:down        # Stop container
```

## Architecture

**Tech stack:** Next.js 16 (App Router) | React 19 | TypeScript (strict) | Tailwind CSS v4 | shadcn/ui (New York style) | Apollo Client + GraphQL | next-intl (es/en) | React Hook Form + Zod | Lucide React icons

**Route structure** uses `[locale]` dynamic segment with route groups:

- `src/app/[locale]/(auth)/` - Authentication pages (login)
- `src/app/[locale]/(dashboard)/admin/` - Admin-only pages
- `src/app/[locale]/(dashboard)/client/` - Client-only pages

**Key directories:**

- `src/graphql/queries/` and `src/graphql/mutations/` - GraphQL operations grouped by domain (auth, clients, packages), each exporting gql documents + TypeScript interfaces
- `src/lib/apollo/` - Apollo Client config with JWT auth link, error link (auto token refresh on 401), SSR singleton
- `src/lib/auth/` - Token handling (localStorage keys: `narbox_access_token`, `narbox_refresh_token`)
- `src/contexts/AuthContext.tsx` - Provides `user`, `loading`, `isAuthenticated`, `login()`, `logout()`; maps superusers to ADMIN role, regular users to CLIENT
- `src/components/ui/` - shadcn/ui components (do not edit manually, use `pnpm dlx shadcn add`)
- `src/components/admin/` - Admin-specific components
- `src/components/common/` - Shared components
- `src/components/layout/` - Header, Sidebar, MainLayout
- `messages/en.json`, `messages/es.json` - i18n translation files (Spanish is default)

**Internationalization:** next-intl with middleware in `middleware.ts`. Locale routing config in `src/lib/i18n/`. Use `useTranslations()` in client components, `getTranslations()` in server components. Locale stored in `NEXT_LOCALE` cookie. Timezone: `America/Guayaquil`.

**Path alias:** `@/*` maps to `./src/*`

## Code Conventions

- **Server Components by default;** add `"use client"` only when needed
- **Imports:** prefer `@/` path alias; relative imports only for closely related files
- **Code style (Prettier-enforced):** double quotes, semicolons, 2-space indent, 80-char width, ES5 trailing commas
- **Pre-commit hooks** (Husky + lint-staged): auto-runs ESLint fix + Prettier on staged files
- **One function per file:** If a component or file requires multiple exported functions/components, each must be defined in its own separate file. Keep files focused and single-purpose.

### Typography

Two-font system: **Work Sans** for headings/titles (bold/extrabold), **Inter** for body/data. Compact scale: h1=`text-2xl font-extrabold`, h2=`text-lg font-bold`, h3=`text-base font-bold`, h4=`text-sm font-bold`. Do not use `text-3xl` or larger for headings. Full spec: `documents/TYPOGRAPHY_GUIDELINES.md`.

Font loading pattern for new pages/layouts:

```typescript
import { Work_Sans, Inter } from "next/font/google";
const workSansFont = Work_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-work-sans",
  display: "swap",
});
const interFont = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});
// Apply: <div className={`${workSansFont.variable} ${interFont.variable}`}>
```

### Table Design

All data tables **must** use `src/components/ui/base-table.tsx` (`BaseTable` component) as the foundation. Do not build tables from scratch or directly use low-level table primitives — always compose on top of `BaseTable`, which provides selection, sorting, pagination, skeleton loading, and empty states out of the box. Define column configurations via the `ColumnDef<T>` type and pass data, handlers, and options as props. Visual style must follow `docs/TABLE_DESIGN_SPEC.md`: `rounded-2xl` containers with `backdrop-blur-sm`, gradient headers, left-bordered rows with hover effects, color-coded action buttons (blue/amber/red gradients). Reference implementation: `src/app/(dashboard)/admin/packages/components/PackagesTable.tsx`.

### GraphQL Pattern

```typescript
// src/graphql/queries/domain.ts
export const GET_ITEMS = gql`query GetItems { ... }`;
export interface GetItemsResponse {
  items: Item[];
}
// Usage: const { data } = useQuery<GetItemsResponse>(GET_ITEMS);
```

## Environment Variables

Create `.env.local`:

```
NEXT_PUBLIC_GRAPHQL_ENDPOINT=http://localhost:8000/graphql
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## Deployment

Netlify via `@netlify/plugin-nextjs`. CI/CD: GitHub Actions runs lint, type-check, tests with coverage (uploaded to Codecov).
