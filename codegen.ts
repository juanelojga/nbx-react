import type { CodegenConfig } from "@graphql-codegen/cli";

/**
 * Generates typed documents from the committed `schema.graphql`
 * (refresh it with `pnpm codegen:schema` against a running backend).
 * Output is committed; CI runs `pnpm codegen:check` to catch drift.
 */
const config: CodegenConfig = {
  schema: "./schema.graphql",
  documents: ["src/graphql/**/*.ts", "!src/graphql/generated/**"],
  ignoreNoDocuments: true,
  generates: {
    "./src/graphql/generated/": {
      preset: "client",
      presetConfig: { fragmentMasking: false },
      config: {
        useTypeImports: true,
        enumsAsTypes: true,
        // Graphene serializes choice enums by name; the app works with the
        // lowercase DB values, so map the enum to the local union type.
        enumValues: {
          PackagehandlingConsolidateStatusChoices:
            "@/types/consolidation#ConsolidationStatus",
        },
        scalars: {
          Date: "string",
          DateTime: "string",
          Decimal: "string",
          JSONString: "string",
          GenericScalar: "unknown",
        },
      },
    },
  },
  hooks: { afterAllFileWrite: ["prettier --write"] },
};

export default config;
