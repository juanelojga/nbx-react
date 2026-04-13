import { test as base, type BrowserContext } from "@playwright/test";
import { resolvers } from "./mockStore";

interface GraphQLRequest {
  operationName?: string;
  query?: string;
  variables?: Record<string, unknown>;
}

const unknownOps = new Set<string>();

async function attachMockBackend(context: BrowserContext) {
  await context.route("**/graphql", async (route) => {
    const request = route.request();
    if (request.method() !== "POST") {
      await route.continue();
      return;
    }
    let body: GraphQLRequest | GraphQLRequest[];
    try {
      body = request.postDataJSON();
    } catch {
      await route.fulfill({
        status: 400,
        contentType: "application/json",
        body: JSON.stringify({ errors: [{ message: "Invalid JSON" }] }),
      });
      return;
    }
    const requests = Array.isArray(body) ? body : [body];
    const responses = requests.map((req) => {
      let op = req.operationName ?? "";
      if (!op && req.query) {
        // Apollo's raw-fetch refresh path doesn't send operationName.
        // Parse it out of the query body: `mutation Foo(...)` or `query Foo(...)`.
        const m = req.query.match(
          /^\s*(?:query|mutation|subscription)\s+(\w+)/
        );
        if (m) op = m[1];
      }
      const resolver = resolvers[op];
      if (!resolver) {
        if (!unknownOps.has(op)) {
          unknownOps.add(op);

          console.warn(`[mockBackend] unknown GraphQL operation: "${op}"`);
        }
        return { data: null, errors: [{ message: `Unknown op: ${op}` }] };
      }
      try {
        const data = resolver(req.variables ?? {});
        return { data };
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Mock resolver error";
        return { data: null, errors: [{ message }] };
      }
    });
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(Array.isArray(body) ? responses : responses[0]),
    });
  });
}

export const test = base.extend<object>({
  context: async ({ context }, use) => {
    await attachMockBackend(context);
    // eslint-disable-next-line react-hooks/rules-of-hooks
    await use(context);
  },
});

export { expect } from "@playwright/test";
