import { defineConfig, globalIgnores } from "eslint/config";
import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";
import prettier from "eslint-config-prettier/flat";
import jestDom from "eslint-plugin-jest-dom";
import jsxA11y from "eslint-plugin-jsx-a11y";
import playwright from "eslint-plugin-playwright";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import testingLibrary from "eslint-plugin-testing-library";
import tseslint from "typescript-eslint";

const TEST_FILES = [
  "src/**/__tests__/**",
  "src/**/*.test.{ts,tsx}",
  "src/test/**",
];

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
  // eslint-config-next already registers the jsx-a11y plugin; only the
  // recommended rule set is added here to avoid redefining it.
  { rules: jsxA11y.flatConfigs.recommended.rules },
  {
    plugins: { "simple-import-sort": simpleImportSort },
    rules: {
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",
    },
  },
  // Type-aware rules for application code.
  {
    files: ["src/**/*.{ts,tsx}", "e2e/**/*.ts", "*.ts"],
    extends: [
      tseslint.configs.strictTypeChecked,
      tseslint.configs.stylisticTypeChecked,
    ],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      "@typescript-eslint/no-floating-promises": "error",
      "@typescript-eslint/no-misused-promises": [
        "error",
        { checksVoidReturn: { attributes: false } },
      ],
      "@typescript-eslint/consistent-type-imports": [
        "error",
        { fixStyle: "inline-type-imports" },
      ],
      "@typescript-eslint/restrict-template-expressions": [
        "error",
        { allowNumber: true },
      ],
      // Component libraries and GraphQL results are full of nullable fields;
      // `||` fallbacks for empty strings are intentional throughout.
      "@typescript-eslint/prefer-nullish-coalescing": "off",
      "@typescript-eslint/no-unnecessary-condition": "off",
      "@typescript-eslint/no-confusing-void-expression": "off",
      "@typescript-eslint/no-empty-function": "off",
      // LINT DEBT (warn): next-intl 4.14 deprecates setRequestLocale /
      // requestLocale in favour of next/root-params, and shadcn's command.tsx
      // uses deprecated cmdk props. Ratcheted via --max-warnings in `lint`.
      "@typescript-eslint/no-deprecated": "warn",
    },
  },
  // Unit tests: relax unsafe-* (mocks) and add DOM/Testing Library rules.
  {
    files: TEST_FILES,
    extends: [
      testingLibrary.configs["flat/react"],
      jestDom.configs["flat/recommended"],
    ],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unsafe-assignment": "off",
      "@typescript-eslint/no-unsafe-member-access": "off",
      "@typescript-eslint/no-unsafe-argument": "off",
      "@typescript-eslint/no-unsafe-call": "off",
      "@typescript-eslint/no-unsafe-return": "off",
      "@typescript-eslint/unbound-method": "off",
      "@typescript-eslint/no-non-null-assertion": "off",
      "@typescript-eslint/require-await": "off",
      // Tests intentionally render odd markup to exercise the primitives.
      "jsx-a11y/label-has-associated-control": "off",
      "jsx-a11y/no-access-key": "off",
      "jsx-a11y/aria-role": "off",
      // LINT DEBT (warn): legacy suites query the DOM directly; new tests
      // must use Testing Library queries. Ratcheted via --max-warnings.
      "testing-library/no-node-access": "warn",
      "testing-library/no-container": "warn",
    },
  },
  {
    files: ["e2e/**/*.ts"],
    extends: [playwright.configs["flat/recommended"]],
    rules: {
      // LINT DEBT (warn): specs still rely on networkidle/timeouts for the
      // mocked backend; migrate to web-first assertions over time.
      "playwright/no-networkidle": "warn",
      "playwright/no-wait-for-timeout": "warn",
    },
  },
  // Plain JS config/setup files carry no type information.
  {
    files: ["**/*.{js,mjs,cjs}"],
    extends: [tseslint.configs.disableTypeChecked],
  },
  // Must stay last so it can disable formatting rules from the presets above.
  prettier,
]);
