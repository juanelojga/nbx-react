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

> **MANDATORY:** Before marking any implementation as complete, always check for TypeScript errors using the `get_errors` tool on every file that was created or modified. Fix all reported errors before finishing.

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

### Typography Standards (MANDATORY)

**CRITICAL REQUIREMENT:** All components MUST follow the typography guidelines defined in `documents/TYPOGRAPHY_GUIDELINES.md`.

#### Font System

The application uses a two-font system:

- **Work Sans**: Titles, headings, labels (bold/extrabold weights)
- **Inter**: Body text, data fields, UI elements

#### Enforcement Rules

When creating or refactoring ANY component, you MUST:

1. **Import fonts at page/layout level**
2. **Apply CSS variables to root element**
3. **Use Work Sans for ALL headings** (h1-h4) with appropriate bold weight
4. **Use Inter for ALL data fields and body text**
5. **Follow the compact typography scale**

#### Typography Scale (Required)

```typescript
// Main page title (h1)
<h1 className="font-[family-name:var(--font-work-sans)] text-2xl font-extrabold tracking-tight">

// Section heading (h2)
<h2 className="font-[family-name:var(--font-work-sans)] text-lg font-bold">

// Subsection heading (h3)
<h3 className="font-[family-name:var(--font-work-sans)] text-base font-bold">

// Minor heading (h4)
<h4 className="font-[family-name:var(--font-work-sans)] text-sm font-bold">

// Label (uppercase)
<label className="text-xs font-bold uppercase tracking-wider">

// Data field
<div className="font-[family-name:var(--font-inter)] text-base font-medium">

// Body text
<p className="text-base">  {/* Inter implicit for body */}
```

#### Prohibited Patterns

**DO NOT USE:**

- ❌ `text-3xl`, `text-4xl`, `text-5xl`, `text-6xl` for headings
- ❌ `text-xl` (reserved, not in use)
- ❌ Headings without Work Sans font family
- ❌ Headings without bold (700) or extrabold (800) weight
- ❌ Main title without `font-extrabold` (800)

#### Pre-Component Checklist

Before writing component code:

- [ ] Fonts imported: `Work_Sans` and `Inter` from `next/font/google`
- [ ] Variables applied: `className={workSansFont.variable} ${interFont.variable}`
- [ ] All headings: Work Sans + appropriate size + bold weight
- [ ] All data/body: Inter (explicit for data, implicit for body)
- [ ] Sizes correct: h1=2xl, h2=lg, h3=base, h4=sm, labels=xs
- [ ] No prohibited large sizes used

**Full Reference:** `documents/TYPOGRAPHY_GUIDELINES.md` - Read this before creating any component

## React/Next.js Best Practices

### Mandatory Skill Usage

**IMPORTANT:** When creating new React/Next.js components or features, you **MUST** invoke the `vercel-react-best-practices` skill at the start of your work. This ensures all new code follows Vercel's performance optimization guidelines and best practices.

### When to Invoke the Skill

The `vercel-react-best-practices` skill must be used for:

- **New page creation** - Any new route/page in `app/` directory
- **New component development** - Creating new components in `components/` directory
- **Major feature additions** - Significant new functionality (e.g., new dashboard section, new form flows)
- **Component refactoring** - Restructuring existing components with architectural changes

### When NOT to Invoke the Skill

The skill is not required for:

- Bug fixes and patches
- Minor style/CSS updates
- Copy/text changes
- Documentation updates
- Configuration changes
- Dependency updates
- Test file modifications (unless adding new component tests)

### How to Invoke

When starting work on a qualifying task, invoke the skill using:

```
Use the vercel-react-best-practices skill to review/guide this implementation
```

The skill should be invoked **before or during** implementation, not after completion.

### Examples

**Requires skill:**

- "Create a new PackageStatusCard component"
- "Add a new admin/reports page"
- "Build a search filter feature for the packages table"
- "Refactor ClientTable to use server components"

**Does NOT require skill:**

- "Fix typo in button label"
- "Update primary color in Tailwind config"
- "Fix bug where date picker doesn't clear"
- "Add translations for error messages"

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

## Table Design Standards

**MANDATORY:** All data tables in the application MUST follow the standardized design patterns defined in `/docs/TABLE_DESIGN_SPEC.md`.

### Core Requirements

When creating or modifying any table component:

1. **Visual Consistency**: Use the exact styling patterns from PackagesTable.tsx
2. **Reference Implementation**: `/src/app/(dashboard)/admin/packages/components/PackagesTable.tsx`
3. **Full Specification**: `/docs/TABLE_DESIGN_SPEC.md`

### Quick Checklist

Before committing any table changes, verify:

- [ ] Container: `rounded-2xl` border with `backdrop-blur-sm` glassmorphism
- [ ] Header: Gradient background (`from-muted/40 to-muted/20`) with uppercase labels
- [ ] Rows: Left border (`border-l-4`) and hover gradient effect
- [ ] Action Buttons: Color-coded gradients (blue/amber/red) with ring borders
- [ ] Animations: Row entrance with 50ms stagger, pulse for selected rows
- [ ] Loading State: 5 skeleton rows with shimmer effect
- [ ] Empty State: Decorative blurs with hover effects
- [ ] Typography: Mono font for IDs/barcodes, proper weights and sizes
- [ ] Accessibility: All ARIA labels present and correct
- [ ] Performance: Memoized components, useCallback handlers, useMemo for derived state

### Action Button Pattern (Required)

All table action buttons MUST use this exact pattern:

```tsx
// View (Blue)
<Button className="h-9 w-9 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100/50 text-blue-600 shadow-sm ring-1 ring-blue-200/50 transition-all duration-300 hover:scale-110 hover:from-blue-100 hover:to-blue-200/50 hover:text-blue-700 hover:shadow-md hover:ring-blue-300/50 active:scale-95 dark:from-blue-950/30 dark:to-blue-900/20 dark:ring-blue-800/30">
  <Eye className="h-4 w-4" />
</Button>

// Edit (Amber)
<Button className="h-9 w-9 rounded-lg bg-gradient-to-br from-amber-50 to-amber-100/50 text-amber-600 shadow-sm ring-1 ring-amber-200/50 transition-all duration-300 hover:scale-110 hover:from-amber-100 hover:to-amber-200/50 hover:text-amber-700 hover:shadow-md hover:ring-amber-300/50 active:scale-95 dark:from-amber-950/30 dark:to-amber-900/20 dark:ring-amber-800/30">
  <Pencil className="h-4 w-4" />
</Button>

// Delete (Red)
<Button className="h-9 w-9 rounded-lg bg-gradient-to-br from-red-50 to-red-100/50 text-red-600 shadow-sm ring-1 ring-red-200/50 transition-all duration-300 hover:scale-110 hover:from-red-100 hover:to-red-200/50 hover:text-red-700 hover:shadow-md hover:ring-red-300/50 active:scale-95 dark:from-red-950/30 dark:to-red-900/20 dark:ring-red-800/30">
  <Trash2 className="h-4 w-4" />
</Button>
```

### Common Mistakes to Avoid

❌ **DO NOT:**

- Use custom fonts or color schemes different from the standard
- Skip animations or use different timing functions
- Implement custom loading/empty states that don't match the standard
- Use different button styles for actions
- Skip glassmorphism effects (backdrop-blur)
- Use sharp corners instead of `rounded-2xl`
- Forget left border on rows
- Skip animation staggering

✅ **DO:**

- Copy exact class names from PackagesTable.tsx
- Preserve all animation keyframes and timing
- Use standard color palette (primary, muted, border)
- Follow the exact action button gradient pattern
- Include all accessibility features
- Test all interactive states (hover, selected, loading, empty)

### When to Consult the Spec

- Creating a new table from scratch
- Updating/refactoring an existing table
- Debugging visual inconsistencies
- Adding new table features (sorting, filtering, etc.)
- Questions about styling or interaction patterns

**Remember:** Consistency across all tables is critical for a professional, polished application. Always reference the spec document when in doubt.
