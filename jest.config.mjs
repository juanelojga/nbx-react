import nextJest from "next/jest.js";

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: "./",
});

// Add any custom config to be passed to Jest
const customJestConfig = {
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  testEnvironment: "jest-environment-jsdom",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  testMatch: [
    "<rootDir>/src/**/__tests__/**/*.test.{ts,tsx}",
    "<rootDir>/src/**/*.test.{ts,tsx}",
  ],
  testPathIgnorePatterns: ["<rootDir>/e2e/", "<rootDir>/node_modules/"],
  collectCoverageFrom: [
    "src/**/*.{js,jsx,ts,tsx}",
    "!src/**/*.d.ts",
    "!src/**/__tests__/**",
    "!src/**/*.stories.{js,jsx,ts,tsx}",
    "!src/graphql/generated/**",
    "!src/test/**",
    "!src/types/**",
    "!src/**/*.types.ts",
    // Module-level Apollo wiring; exercised by the Playwright suite.
    "!src/lib/apollo/client.ts",
  ],
  coverageReporters: ["lcov", "text", "html"],
  coverageDirectory: "coverage",
  coverageProvider: "v8",
  // Floors are ratcheted upward as coverage grows; never lower them.
  coverageThreshold: {
    global: { statements: 60, branches: 70, functions: 65, lines: 60 },
    "./src/lib/auth/": {
      statements: 85,
      branches: 75,
      functions: 85,
      lines: 85,
    },
    "./src/lib/validation/": {
      statements: 90,
      branches: 80,
      functions: 90,
      lines: 90,
    },
    "./src/lib/table/": {
      statements: 90,
      branches: 80,
      functions: 90,
      lines: 90,
    },
    "./src/hooks/": { statements: 80, branches: 65, functions: 80, lines: 80 },
    "./src/lib/apollo/": {
      statements: 70,
      branches: 60,
      functions: 70,
      lines: 70,
    },
    "./src/contexts/": {
      statements: 80,
      branches: 65,
      functions: 80,
      lines: 80,
    },
  },
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
export default createJestConfig(customJestConfig);
