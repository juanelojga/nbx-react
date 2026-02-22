# NBX React Application

[![codecov](https://codecov.io/gh/juanelojga/nbx-react/branch/main/graph/badge.svg)](https://codecov.io/gh/juanelojga/nbx-react)

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Testing & Coverage

This project includes comprehensive unit tests with coverage reporting via Codecov.

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage report
npm run test:coverage

# Run tests for CI (with coverage)
npm run test:ci
```

### Coverage Reports

Coverage reports are generated in the `coverage/` directory and uploaded to Codecov on every push to main/develop branches.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Running with Docker

The project includes a Docker development setup that lets you run this app (and other projects) in parallel without port conflicts.

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/) and [Docker Compose](https://docs.docker.com/compose/install/) installed.

### First-time setup

1. Copy the Docker environment template:

   ```bash
   cp .env.docker.example .env.docker
   ```

2. Open `.env.docker` and set your values:

   ```env
   # Port exposed on your machine — change per project to avoid collisions
   HOST_PORT=3001

   # Reach the Django backend from inside Docker (not "localhost")
   NEXT_PUBLIC_GRAPHQL_ENDPOINT=http://host.docker.internal:8000/graphql
   ```

3. Build the image and start the container:

   ```bash
   docker compose up --build
   ```

   The app will be available at `http://localhost:3001` (or whichever `HOST_PORT` you set).

### Subsequent runs

```bash
docker compose up    # start
docker compose down  # stop and remove containers
```

### Running multiple projects in parallel

Each project has its own `.env.docker`. To avoid port collisions, assign a unique `HOST_PORT` to each:

| Project   | `HOST_PORT` | URL                   |
| --------- | ----------- | --------------------- |
| nbx-react | `3001`      | http://localhost:3001 |
| other-app | `3002`      | http://localhost:3002 |

Both `docker compose up` commands can run simultaneously in separate terminals.

### How it works

- **Source code** is mounted as a volume into the container — Turbopack hot-reload works exactly as in local dev.
- **`node_modules` and `.next`** live inside the container to prevent conflicts with host-installed packages.
- **`.env.local`** is loaded first (your app variables); **`.env.docker`** is loaded second and overrides Docker-specific values (`HOST_PORT`, `NEXT_PUBLIC_GRAPHQL_ENDPOINT`).
- **`host.docker.internal`** resolves to your host machine inside the container, allowing the Django backend running on `localhost:8000` to be reached from Docker (works on Linux, macOS, and Windows).
