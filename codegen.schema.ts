import type { CodegenConfig } from "@graphql-codegen/cli";

/**
 * Refreshes the committed `schema.graphql` from a running backend:
 *   NEXT_PUBLIC_GRAPHQL_ENDPOINT=http://localhost:8000/graphql pnpm codegen:schema
 * The regular `pnpm codegen` never touches the network; it reads schema.graphql.
 */
const endpoint =
  process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT ?? "http://localhost:8000/graphql";

const config: CodegenConfig = {
  schema: endpoint,
  generates: {
    "./schema.graphql": {
      plugins: ["schema-ast"],
      config: { includeDirectives: true, sort: true },
    },
  },
};

export default config;
