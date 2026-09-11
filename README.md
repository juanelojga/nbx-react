# NBX React

Frontend for **NarBox Courier**, a package handling and consolidation service.
Next.js 16 (App Router) + React 19 + TypeScript, talking to the
[`nbx-django`](../nbx-django) GraphQL backend via Apollo Client.

[![codecov](https://codecov.io/gh/juanelojga/nbx-react/branch/main/graph/badge.svg)](https://codecov.io/gh/juanelojga/nbx-react)

## Stack

- Next.js 16 with Turbopack, React 19, TypeScript (strict)
- Apollo Client 4 with GraphQL Code Generator (`schema.graphql` is committed)
- next-intl (`es` default, `en`), Tailwind CSS v4, shadcn/ui, React Hook Form + Zod
- Jest + Testing Library for unit tests, Playwright for E2E (mocked backend)

## Getting started

```bash
corepack enable          # pnpm 10 is pinned in package.json
pnpm install
cp .env.example .env.local   # point NEXT_PUBLIC_GRAPHQL_ENDPOINT at the backend
pnpm dev                 # http://localhost:3000
```

Or with Docker: `pnpm docker:up` (see `docker-compose.yml`; run
`docker compose down -v` after changing dependencies).

## Scripts

| Command               | What it does                                       |
| --------------------- | -------------------------------------------------- |
| `pnpm dev` / `build`  | Dev server / production build                      |
| `pnpm lint`           | ESLint (type-aware); `pnpm format` runs Prettier   |
| `pnpm type-check`     | `next typegen` + `tsc --noEmit`                    |
| `pnpm test`           | Unit tests (`test:coverage`, `test:watch`)         |
| `pnpm test:e2e`       | Playwright against the mocked GraphQL backend      |
| `pnpm codegen`        | Regenerate `src/graphql/generated` from the schema |
| `pnpm codegen:schema` | Refresh `schema.graphql` from a running backend    |

## Project layout

See [`CLAUDE.md`](CLAUDE.md) for the architecture, conventions and the
design guidelines it links to (`docs/TABLE_DESIGN_SPEC.md`,
`docs/TYPOGRAPHY_GUIDELINES.md`). Backend follow-ups for authentication are
tracked in `docs/AUTH_BACKEND_FOLLOWUP.md`.

## Deployment

Netlify builds `main` with `@netlify/plugin-nextjs` (`netlify.toml`).
Public build-time variables live in `netlify.toml` / the Netlify dashboard.
GitHub Actions (`.github/workflows/ci.yml`) runs codegen drift check, lint,
format check, type check, unit tests with coverage, a production build and
the Playwright suite on every push and pull request.
