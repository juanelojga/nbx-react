import { defineConfig, globalIgnores } from "eslint/config";
import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";
import prettier from "eslint-config-prettier/flat";

export default defineConfig([
  globalIgnores([
    "node_modules/",
    ".next/",
    "out/",
    "coverage/",
    "playwright-report/",
    "test-results/",
    "next-env.d.ts",
    "src/graphql/generated/",
  ]),
  ...nextCoreWebVitals,
  ...nextTypescript,
  // Must stay last so it can disable formatting rules from the presets above.
  prettier,
]);
