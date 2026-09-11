import {
  ApolloClient,
  ApolloLink,
  gql,
  InMemoryCache,
  Observable,
} from "@apollo/client";

import { createErrorLink } from "../createErrorLink";

jest.mock("@/lib/logger", () => ({
  logger: {
    error: jest.fn(),
    warn: jest.fn(),
    info: jest.fn(),
    debug: jest.fn(),
  },
}));

const QUERY = gql`
  query Ping {
    ping
  }
`;

const AUTH_ERROR = { message: "Signature has expired" };

function run(link: ApolloLink, operationName = "Ping") {
  const client = new ApolloClient({ link, cache: new InMemoryCache() });
  const query =
    operationName === "Ping" ? QUERY : gql`mutation ${operationName} { ping }`;
  return new Promise<{ results: unknown[]; error?: unknown }>((resolve) => {
    const results: unknown[] = [];
    ApolloLink.execute(link, { query }, { client }).subscribe({
      next: (result) => results.push(result),
      error: (error) => resolve({ results, error }),
      complete: () => resolve({ results }),
    });
  });
}

/** Terminal link that fails with an auth error `failures` times, then succeeds. */
function flakyTerminal(failures: number) {
  const seenHeaders: Record<string, string>[] = [];
  let calls = 0;
  const link = new ApolloLink((operation) => {
    seenHeaders.push(operation.getContext().headers ?? {});
    calls += 1;
    return new Observable((observer) => {
      if (calls <= failures) {
        observer.next({ errors: [AUTH_ERROR] });
      } else {
        observer.next({ data: { ping: "pong" } });
      }
      observer.complete();
    });
  });
  return {
    link,
    seenHeaders,
    get calls() {
      return calls;
    },
  };
}

describe("createErrorLink", () => {
  it("refreshes once and replays the operation with the new token", async () => {
    const terminal = flakyTerminal(1);
    const refresh = jest.fn().mockResolvedValue("fresh-token");
    const onSessionExpired = jest.fn();
    const link = ApolloLink.from([
      createErrorLink({
        refresh,
        hasRefreshToken: () => true,
        onSessionExpired,
      }),
      terminal.link,
    ]);

    const { results, error } = await run(link);

    expect(error).toBeUndefined();
    expect(results).toEqual([{ data: { ping: "pong" } }]);
    expect(refresh).toHaveBeenCalledTimes(1);
    expect(terminal.seenHeaders[1]?.authorization).toBe("JWT fresh-token");
    expect(onSessionExpired).not.toHaveBeenCalled();
  });

  it("gives up after a single retry", async () => {
    const terminal = flakyTerminal(5);
    const refresh = jest.fn().mockResolvedValue("fresh-token");
    const onSessionExpired = jest.fn();
    const link = ApolloLink.from([
      createErrorLink({
        refresh,
        hasRefreshToken: () => true,
        onSessionExpired,
      }),
      terminal.link,
    ]);

    await run(link);

    expect(refresh).toHaveBeenCalledTimes(1);
    expect(terminal.calls).toBe(2);
    expect(onSessionExpired).toHaveBeenCalledTimes(1);
  });

  it("expires the session when the refresh fails", async () => {
    const terminal = flakyTerminal(1);
    const onSessionExpired = jest.fn();
    const link = ApolloLink.from([
      createErrorLink({
        refresh: jest.fn().mockResolvedValue(null),
        hasRefreshToken: () => true,
        onSessionExpired,
      }),
      terminal.link,
    ]);

    const { error } = await run(link);

    expect(error).toBeDefined();
    expect(onSessionExpired).toHaveBeenCalledTimes(1);
    expect(terminal.calls).toBe(1);
  });

  it("expires the session immediately without a refresh token", async () => {
    const terminal = flakyTerminal(1);
    const refresh = jest.fn();
    const onSessionExpired = jest.fn();
    const link = ApolloLink.from([
      createErrorLink({
        refresh,
        hasRefreshToken: () => false,
        onSessionExpired,
      }),
      terminal.link,
    ]);

    await run(link);

    expect(refresh).not.toHaveBeenCalled();
    expect(onSessionExpired).toHaveBeenCalledTimes(1);
  });

  it("never retries the refresh operation itself", async () => {
    const terminal = flakyTerminal(1);
    const refresh = jest.fn();
    const onSessionExpired = jest.fn();
    const link = ApolloLink.from([
      createErrorLink({
        refresh,
        hasRefreshToken: () => true,
        onSessionExpired,
      }),
      terminal.link,
    ]);

    await run(link, "RefreshToken");

    expect(refresh).not.toHaveBeenCalled();
    expect(onSessionExpired).toHaveBeenCalledTimes(1);
  });

  it("ignores non-auth GraphQL errors", async () => {
    const refresh = jest.fn();
    const onSessionExpired = jest.fn();
    const terminal = new ApolloLink(
      () =>
        new Observable((observer) => {
          observer.next({ errors: [{ message: "Client not found" }] });
          observer.complete();
        })
    );
    const link = ApolloLink.from([
      createErrorLink({
        refresh,
        hasRefreshToken: () => true,
        onSessionExpired,
      }),
      terminal,
    ]);

    const { results } = await run(link);

    expect(results).toHaveLength(1);
    expect(refresh).not.toHaveBeenCalled();
    expect(onSessionExpired).not.toHaveBeenCalled();
  });

  it("tears down the pending retry when unsubscribed", async () => {
    let resolveRefresh!: (token: string) => void;
    const refresh = jest.fn(
      () =>
        new Promise<string>((resolve) => {
          resolveRefresh = resolve;
        })
    );
    const terminal = flakyTerminal(1);
    const link = ApolloLink.from([
      createErrorLink({
        refresh,
        hasRefreshToken: () => true,
        onSessionExpired: jest.fn(),
      }),
      terminal.link,
    ]);
    const client = new ApolloClient({ link, cache: new InMemoryCache() });
    const next = jest.fn();

    const subscription = ApolloLink.execute(
      link,
      { query: QUERY },
      { client }
    ).subscribe({ next });
    await Promise.resolve();
    subscription.unsubscribe();
    resolveRefresh("late-token");
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(next).not.toHaveBeenCalled();
    expect(terminal.calls).toBe(1);
  });
});
