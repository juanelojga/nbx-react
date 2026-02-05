# AGENTS.md - Project Guide for AI Coding Agents

This file provides comprehensive guidance for AI coding agents working with the NBX React codebase.

## Project Overview

**NBX React** is a frontend application for a package handling/courier company (NarBox). It connects to an existing Django backend using GraphQL (Graphene) and provides interfaces for both administrative users and clients to manage package operations.

### User Types

1. **Admin Users**: Full system access for managing packages, users, and system operations
2. **Client Users**: Limited access to view and manage their own packages

## Technology Stack

| Category             | Technology                    |
| -------------------- | ----------------------------- |
| Framework            | Next.js 15.5.4 (App Router)   |
| Language             | TypeScript 5.x (Strict Mode)  |
| React                | 19.1.0                        |
| Styling              | Tailwind CSS v4               |
| UI Components        | shadcn/ui (New York style)    |
| State Management     | React Context + Apollo Client |
| API                  | GraphQL via Apollo Client     |
| Backend              | Django + Graphene (external)  |
| Authentication       | JWT (JSON Web Tokens)         |
| Forms                | React Hook Form + Zod         |
| Internationalization | next-intl (Spanish/English)   |
| Icons                | Lucide React                  |
| Font                 | Geist (Google Fonts)          |

## Project Structure

```
/
├── .github/workflows/      # CI/CD configuration
├── .husky/                 # Git hooks
├── documents/              # Project documentation
├── e2e/                    # Playwright E2E tests (if any)
├── messages/               # i18n translation files (en.json, es.json)
├── public/                 # Static assets
├── scripts/                # Build/documentation scripts
└── src/
    ├── app/                # Next.js App Router
    │   ├── (auth)/         # Auth route group (login)
    │   ├── (dashboard)/    # Dashboard route group
    │   │   ├── admin/      # Admin pages
    │   │   └── client/     # Client pages
    │   ├── layout.tsx      # Root layout
    │   ├── page.tsx        # Homepage
    │   ├── globals.css     # Global styles
    │   └── providers.tsx   # App providers wrapper
    ├── components/
    │   ├── admin/          # Admin-specific components
    │   ├── common/         # Shared common components
    │   ├── layout/         # Layout components (Header, Sidebar, etc.)
    │   └── ui/             # shadcn/ui components
    ├── contexts/
    │   └── AuthContext.tsx # Authentication context
    ├── graphql/
    │   ├── mutations/      # GraphQL mutations
    │   └── queries/        # GraphQL queries
    ├── hooks/              # Custom React hooks
    ├── lib/
    │   ├── apollo/         # Apollo Client configuration
    │   ├── auth/           # Authentication utilities
    │   └── utils.ts        # Utility functions (cn, etc.)
    └── types/
        └── user.ts         # TypeScript type definitions
```

## Build and Development Commands

```bash
# Development server (uses Turbopack)
npm run dev

# Production build
npm run build

# Start production server
npm start

# Type checking
npm run type-check
```

## Code Quality Commands

```bash
# Linting
npm run lint
npm run lint:fix      # Auto-fix ESLint issues

# Formatting
npm run format        # Format with Prettier
npm run format:check  # Check formatting without changes

# Pre-commit hooks automatically run lint-staged
```

## Testing Commands

```bash
# Unit tests (Jest + React Testing Library)
npm test
npm run test:watch        # Watch mode
npm run test:coverage     # With coverage report
npm run test:ci           # CI mode (no watch, with coverage)

# E2E tests (Playwright)
npm run test:e2e          # Run all E2E tests
npm run test:e2e:ui       # UI mode for debugging
npm run test:e2e:report   # Show HTML report
```

## Code Style Guidelines

### Prettier Configuration

- **Semi**: Enabled
- **Quotes**: Double quotes
- **Trailing commas**: ES5
- **Print width**: 80 characters
- **Tab width**: 2 spaces
- **End of line**: LF

### TypeScript Standards

- Strict mode is enabled
- Target: ES2017
- Module resolution: bundler
- Path alias: `@/*` maps to `src/*`

### Naming Conventions

- Components: PascalCase (e.g., `ClientTable.tsx`)
- Hooks: camelCase with `use` prefix (e.g., `useClientTableState.ts`)
- Utilities: camelCase (e.g., `tokens.ts`)
- GraphQL files: Descriptive names (e.g., `auth.ts`, `clients.ts`)

### Import Patterns

```typescript
// Path alias (preferred)
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

// Relative imports (for closely related files)
import { ClientSelect } from "./ClientSelect";
```

### Component Patterns

- Use Server Components by default
- Add `"use client"` directive only when necessary (hooks, browser APIs, etc.)
- Props interface should be defined inline or with descriptive name

Example:

```typescript
interface ClientCardProps {
  client: Client;
  onEdit: (client: Client) => void;
}

export function ClientCard({ client, onEdit }: ClientCardProps) {
  // Implementation
}
```

## Testing Guidelines

### Unit Tests

- Located in `src/components/ui/__tests__/` or alongside components as `*.test.tsx`
- Use React Testing Library with Jest
- Mock external dependencies (Apollo, browser APIs)

### E2E Tests

- Located in `e2e/` directory (if exists)
- Configured for Chromium, Firefox, and WebKit
- Base URL: `http://localhost:3000`

### Test Setup

- Jest setup file: `jest.setup.js`
- Mocks for Radix UI components and browser APIs included
- Custom matchers available (e.g., `toBeEmptyDOMElement`)

## Authentication & Security

### JWT Token Handling

- Access token stored in `localStorage` (key: `narbox_access_token`)
- Token expiration checked with 30-second buffer
- Automatic token refresh on 401 errors
- Redirect to `/login` on authentication failure

### Role-Based Access

```typescript
enum UserRole {
  ADMIN = "ADMIN",
  CLIENT = "CLIENT",
}
```

- Superusers are mapped to `ADMIN` role
- Regular users are mapped to `CLIENT` role

### Protected Routes

- Authentication context wraps the application
- Route protection handled by `ProtectedRoute` component
- Server-side redirects configured for auth flows

## Internationalization (i18n)

- Supported locales: Spanish (`es`) and English (`en`)
- Default locale: Spanish (`es`)
- Locale stored in cookie: `NEXT_LOCALE`
- Translation files in `messages/` directory

### Usage

```typescript
import { useTranslations } from "next-intl";

export function Component() {
  const t = useTranslations("namespace");
  return <h1>{t("title")}</h1>;
}
```

## GraphQL Patterns

### Client Configuration

- Apollo Client configured in `src/lib/apollo/client.ts`
- Automatic token refresh on auth errors
- Error link for global error handling
- SSR support with singleton pattern

### Query/Mutation Structure

```typescript
// queries/clients.ts
import { gql } from "@apollo/client";

export const GET_CLIENTS = gql`
  query GetClients {
    clients {
      id
      firstName
      lastName
      email
    }
  }
`;

export interface GetClientsResponse {
  clients: Client[];
}
```

## Environment Variables

| Variable                       | Description             | Required |
| ------------------------------ | ----------------------- | -------- |
| `NEXT_PUBLIC_GRAPHQL_ENDPOINT` | GraphQL API URL         | Yes      |
| `NEXT_PUBLIC_SITE_URL`         | Site URL for production | Optional |

Create `.env.local` for local development:

```
NEXT_PUBLIC_GRAPHQL_ENDPOINT=http://localhost:8000/graphql
```

## Deployment

### Platform

- **Primary**: Netlify (via `@netlify/plugin-nextjs`)
- **Node version**: 22
- **NPM version**: 10

### CI/CD Pipeline

GitHub Actions workflow (`.github/workflows/deploy.yml`):

1. Lint and type checking
2. Run tests with coverage
3. Upload coverage to Codecov

### Manual Deployment

```bash
# Production
npm run deploy:netlify

# Preview
npm run deploy:preview
```

## Common Tasks

### Adding a New Page

1. Create file in appropriate route group (`(dashboard)/admin/` or `(dashboard)/client/`)
2. Add route to sidebar navigation if needed
3. Add translations to `messages/en.json` and `messages/es.json`
4. Add tests if applicable

### Adding a GraphQL Query/Mutation

1. Create/update file in `src/graphql/queries/` or `src/graphql/mutations/`
2. Export the GraphQL document and TypeScript interfaces
3. Use in components via `useQuery` or `useMutation`

### Adding a UI Component

1. Check if shadcn/ui has the component: `npx shadcn add <component>`
2. If custom, create in `src/components/ui/`
3. Add tests in `src/components/ui/__tests__/`
4. Export from component file

## Security Considerations

- Never commit sensitive data to the repository
- Use GitHub Secrets for CI/CD variables
- JWT tokens are client-side only; no httpOnly cookie currently
- CORS must be configured on the backend
- XSS protection via React's escaping and security headers (configured in `netlify.toml`)

## Troubleshooting

### Common Issues

1. **Build failures**: Check Node.js version (22+) and `npm ci` for clean install
2. **GraphQL errors**: Verify endpoint is accessible and CORS is configured
3. **Auth issues**: Check token expiration and refresh token logic
4. **Test failures**: Ensure mocks are set up correctly in `jest.setup.js`

### Debugging

- Use `console.error` for GraphQL/network errors (already configured)
- Apollo Client devtools available for query inspection
- React DevTools for component debugging

## Useful Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS v4](https://tailwindcss.com/docs)
- [shadcn/ui Components](https://ui.shadcn.com)
- [Apollo Client](https://www.apollographql.com/docs/react/)
- [next-intl](https://next-intl-docs.vercel.app/)
