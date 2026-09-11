import path from "node:path";

import { defineConfig, devices } from "@playwright/test";

const isCI = Boolean(process.env.CI);
const storageState = path.join(__dirname, "e2e/.auth/storage-state.json");

/**
 * E2E tests run against the Next.js app with all GraphQL traffic intercepted
 * by e2e/fixtures/mockBackend.ts — no Django backend is required.
 *
 * CI serves the production build (`pnpm build` runs first in the workflow);
 * locally the dev server is reused when it is already running.
 */
export default defineConfig({
  testDir: "./e2e",
  outputDir: "test-results",
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  workers: isCI ? 1 : undefined,
  reporter: isCI
    ? [["github"], ["html", { open: "never" }]]
    : [["list"], ["html", { open: "never" }]],
  expect: { timeout: 10_000 },
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
    screenshot: "off",
  },
  projects: [
    { name: "setup", testMatch: /global-setup\.ts/ },
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"], storageState },
      dependencies: ["setup"],
    },
    // Extra browsers only locally: the in-memory mock store is shared per
    // worker, so CI keeps a single browser for deterministic data.
    ...(isCI
      ? []
      : [
          {
            name: "firefox",
            use: { ...devices["Desktop Firefox"], storageState },
            dependencies: ["setup"],
          },
          {
            name: "webkit",
            use: { ...devices["Desktop Safari"], storageState },
            dependencies: ["setup"],
          },
        ]),
  ],
  webServer: {
    command: isCI ? "pnpm start" : "pnpm dev",
    url: "http://localhost:3000",
    reuseExistingServer: !isCI,
    timeout: 120_000,
    env: {
      NEXT_PUBLIC_GRAPHQL_ENDPOINT: "http://localhost:8000/graphql",
      NEXT_TELEMETRY_DISABLED: "1",
    },
  },
});
