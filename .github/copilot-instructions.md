# GitHub Copilot Instructions for NBX React

## Project Overview

NBX React is a Next.js 16 frontend application for NarBox, a package handling/courier company. It connects to an existing Django backend via GraphQL (Graphene) and provides separate interfaces for admin and client users.

**User Roles:**

- **Admin**: Full system access for managing packages, users, and operations
- **Client**: Limited access to view and manage their own packages

## Build, Test & Development Commands

### Development

```bash
npm run dev              # Start dev server with Turbopack on http://localhost:3000
npm run build            # Production build
npm start                # Start production server
```

### Code Quality (run after making changes)

```bash
npm run format           # Format with Prettier
npm run lint:fix         # Auto-fix ESLint issues
npm run lint             # Check for remaining lint errors
npm run type-check       # TypeScript type checking
```

### Testing

```bash
# Unit tests (Jest + React Testing Library)
npm test                 # Run all tests
npm run test:watch       # Watch mode
npm run test:coverage    # With coverage report
npm run test:ci          # CI mode (no watch, with coverage)

# E2E tests (Playwright)
npm run test:e2e         # Run all E2E tests
npm run test:e2e:ui      # UI mode for debugging
npm run test:e2e:report  # Show HTML report

# Run a single test file
npx jest path/to/test.test.tsx
npx playwright test e2e/specific-test.spec.ts
```

## Architecture

### Directory Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Auth route group (login)
│   ├── (dashboard)/       # Dashboard route group
│   │   ├── admin/         # Admin-only pages
│   │   └── client/        # Client-only pages
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Homepage
│   ├── providers.tsx      # App providers wrapper
│   └── globals.css        # Global styles
├── components/
│   ├── admin/             # Admin-specific components
│   ├── common/            # Shared components
│   ├── layout/            # Header, Sidebar, MainLayout
│   └── ui/                # shadcn/ui components
├── contexts/
│   └── AuthContext.tsx    # Authentication context
├── graphql/
│   ├── mutations/         # GraphQL mutations (auth.ts, clients.ts, packages.ts)
│   └── queries/           # GraphQL queries (auth.ts, clients.ts, packages.ts)
├── hooks/                 # Custom React hooks
├── lib/
│   ├── apollo/            # Apollo Client config
│   ├── auth/              # Token handling utilities
│   ├── utils/             # Utility functions
│   └── validation/        # Zod schemas
└── types/                 # TypeScript definitions
```

### Key Architectural Patterns

**Route Groups:** The app uses Next.js route groups:

- `(auth)` - Authentication pages (login)
- `(dashboard)` - Protected dashboard area with admin/client subfolders

**Authentication Flow:**

- JWT tokens stored in localStorage (`narbox_access_token`, `narbox_refresh_token`)
- Token expiration checked with 30-second buffer
- Automatic token refresh on 401 errors via Apollo error link
- Global refresh promise prevents race conditions during concurrent requests
- `AuthContext` provides `user`, `loading`, `isAuthenticated`, `login()`, `logout()`

**Role Mapping:**

- Superusers from backend → `ADMIN` role
- Regular users → `CLIENT` role
- Roles defined in `src/types/user.ts` as enum

**GraphQL Organization:**

- Queries and mutations grouped by domain (auth, clients, packages)
- Each file exports GraphQL documents and TypeScript interfaces
- Apollo Client configured with authentication and error handling links
- SSR support with singleton pattern in `src/lib/apollo/client.ts`

**UI Components:**

- shadcn/ui components in `src/components/ui/` (New York style variant)
- Use `cn()` utility from `@/lib/utils` for conditional classes
- Radix UI primitives for accessible components
- Lucide React for icons

**Internationalization:**

- next-intl with Spanish (default) and English
- Translation files: `messages/en.json`, `messages/es.json`
- Locale stored in `NEXT_LOCALE` cookie
- Use `useTranslations()` hook in client components
- Use `getTranslations()` for server components

## Code Conventions

### Component Patterns

```typescript
// Use Server Components by default
export function ServerComponent({ data }: Props) { ... }

// Add "use client" directive only when necessary
"use client";
export function ClientComponent({ onClick }: Props) { ... }

// Props interface defined inline or with descriptive name
interface ClientCardProps {
  client: Client;
  onEdit: (client: Client) => void;
}
```

### Import Patterns

```typescript
// Preferred: Use path alias
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { GET_CLIENTS } from "@/graphql/queries/clients";

// Relative imports only for closely related files
import { ClientSelect } from "./ClientSelect";
```

### GraphQL Patterns

```typescript
// queries/clients.ts
import { gql } from "@apollo/client";

export const GET_CLIENTS = gql`
  query GetClients {
    clients {
      id
      firstName
      lastName
    }
  }
`;

export interface GetClientsResponse {
  clients: Client[];
}

// Usage in component
const { data, loading, error } = useQuery<GetClientsResponse>(GET_CLIENTS);
```

### Naming Conventions

- Components: PascalCase (`ClientTable.tsx`)
- Hooks: camelCase with `use` prefix (`useClientTableState.ts`)
- Utilities: camelCase (`tokens.ts`, `validation.ts`)
- GraphQL files: Descriptive domain names (`auth.ts`, `clients.ts`)

### Code Style (Prettier enforced)

- Double quotes for strings
- Semicolons required
- 2-space indentation
- 80 character line width
- ES5 trailing commas

## Testing

### Unit Tests

- Located in `src/components/ui/__tests__/` or alongside components as `*.test.tsx`
- Jest configured with Next.js config (`jest.config.js`)
- React Testing Library for component testing
- Mock Apollo Client and browser APIs as needed
- Test setup in `jest.setup.js` includes mocks for Radix UI and `matchMedia`

### E2E Tests

- Playwright configured for Chromium, Firefox, WebKit
- Tests in `e2e/` directory (if they exist)
- Base URL: http://localhost:3000
- Automatically starts dev server before tests

## Environment Variables

Create `.env.local` for development:

```
NEXT_PUBLIC_GRAPHQL_ENDPOINT=http://localhost:8000/graphql
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## Git Hooks

Pre-commit hooks (Husky + lint-staged):

- Automatically format staged files with Prettier
- Run ESLint with auto-fix on staged files
- Configured in `.lintstagedrc.json`

## Technology Stack Reference

| Category         | Technology                  |
| ---------------- | --------------------------- |
| Framework        | Next.js 16.1.6 (App Router) |
| React            | 19.2.4                      |
| Language         | TypeScript 5 (Strict)       |
| Styling          | Tailwind CSS v4             |
| UI Components    | shadcn/ui (New York)        |
| State Management | Context + Apollo Client     |
| API              | GraphQL (Apollo Client)     |
| Backend          | Django + Graphene           |
| Authentication   | JWT                         |
| Forms            | React Hook Form + Zod       |
| i18n             | next-intl (es/en)           |
| Icons            | Lucide React                |
| Testing          | Jest + Playwright           |

## Deployment

- **Platform:** Netlify (via `@netlify/plugin-nextjs`)
- **Node version:** 22
- **NPM version:** 10
- **CI/CD:** GitHub Actions (`.github/workflows/deploy.yml`)
  - Runs lint, type-check, tests with coverage
  - Uploads coverage to Codecov

## Common Workflows

### Adding a New Page

1. Create file in appropriate route group (`app/(dashboard)/admin/` or `app/(dashboard)/client/`)
2. Add translations to `messages/en.json` and `messages/es.json`
3. Update sidebar navigation in `src/components/layout/Sidebar.tsx` if needed

### Adding a GraphQL Query/Mutation

1. Add to `src/graphql/queries/` or `src/graphql/mutations/` (grouped by domain)
2. Export GraphQL document and TypeScript interfaces
3. Use via `useQuery` or `useMutation` hooks

### Adding a shadcn/ui Component

```bash
npx shadcn add <component-name>
```

This installs to `src/components/ui/` with proper configuration.
