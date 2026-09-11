import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { type DocumentNode, Kind } from "graphql";

import * as authMutations from "@/graphql/mutations/auth";
import * as clientMutations from "@/graphql/mutations/clients";
import * as consolidationMutations from "@/graphql/mutations/consolidations";
import * as packageMutations from "@/graphql/mutations/packages";
import * as pricingMutations from "@/graphql/mutations/pricing";
import * as authQueries from "@/graphql/queries/auth";
import * as clientQueries from "@/graphql/queries/clients";
import * as consolidationQueries from "@/graphql/queries/consolidations";
import * as dashboardQueries from "@/graphql/queries/dashboard";
import * as packageQueries from "@/graphql/queries/packages";
import * as pricingQueries from "@/graphql/queries/pricing";

const modules = [
  authMutations,
  clientMutations,
  consolidationMutations,
  packageMutations,
  pricingMutations,
  authQueries,
  clientQueries,
  consolidationQueries,
  dashboardQueries,
  packageQueries,
  pricingQueries,
];

function isDocument(value: unknown): value is DocumentNode {
  return (
    typeof value === "object" &&
    value !== null &&
    (value as DocumentNode).kind === Kind.DOCUMENT
  );
}

const documents = modules.flatMap((mod) =>
  Object.values(mod).filter(isDocument)
);

const operationNames = documents.flatMap((doc) =>
  doc.definitions
    .filter((def) => def.kind === Kind.OPERATION_DEFINITION)
    .map((def) => def.name?.value)
    .filter((name): name is string => Boolean(name))
);

describe("GraphQL documents", () => {
  it("resolve through the codegen registry", () => {
    expect(documents.length).toBeGreaterThan(15);
    for (const doc of documents) {
      expect(doc.definitions.length).toBeGreaterThan(0);
    }
  });

  it("use unique operation names", () => {
    expect(new Set(operationNames).size).toBe(operationNames.length);
  });

  it("are all handled by the e2e mock backend", () => {
    const mockStore = readFileSync(
      resolve(process.cwd(), "e2e/fixtures/mockStore.ts"),
      "utf8"
    );
    const resolverNames = new Set(
      [...mockStore.matchAll(/^  ([A-Z][A-Za-z]+): \(/gm)].map((m) => m[1])
    );
    const missing = operationNames.filter((name) => !resolverNames.has(name));
    expect(missing).toEqual([]);
  });
});
