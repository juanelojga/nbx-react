"use client";

import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache,
} from "@apollo/client";
import { SetContextLink } from "@apollo/client/link/context";

import { createErrorLink } from "@/lib/apollo/createErrorLink";
import { GRAPHQL_ENDPOINT } from "@/lib/apollo/endpoint";
import { authEvents, SESSION_EXPIRED_EVENT } from "@/lib/auth/authEvents";
import { refreshAccessToken } from "@/lib/auth/refreshAccessToken";
import {
  clearTokens,
  getAccessToken,
  getRefreshToken,
  isTokenExpired,
} from "@/lib/auth/tokens";

const httpLink = new HttpLink({
  uri: GRAPHQL_ENDPOINT,
  credentials: "include",
  headers: { "X-Requested-With": "XMLHttpRequest" },
});

/** Attaches the JWT, refreshing it first when it is about to expire. */
const authLink = new SetContextLink(async ({ headers }) => {
  const previous = (headers ?? {}) as Record<string, string>;
  let token = getAccessToken();
  if (token && isTokenExpired(token)) {
    token = await refreshAccessToken();
  }
  return {
    headers: { ...previous, authorization: token ? `JWT ${token}` : "" },
  };
});

const errorLink = createErrorLink({
  refresh: refreshAccessToken,
  hasRefreshToken: () => getRefreshToken() !== null,
  onSessionExpired: () => {
    clearTokens();
    authEvents.dispatchEvent(new Event(SESSION_EXPIRED_EVENT));
  },
});

function createApolloClient(): ApolloClient {
  return new ApolloClient({
    ssrMode: typeof window === "undefined",
    link: ApolloLink.from([errorLink, authLink, httpLink]),
    // Graphene types (ClientType, PackageType, ...) all expose `id`, which is
    // Apollo's default cache key, so no custom typePolicies are needed.
    cache: new InMemoryCache(),
    defaultOptions: {
      watchQuery: {
        fetchPolicy: "cache-first",
        nextFetchPolicy: "cache-and-network",
      },
      query: { fetchPolicy: "cache-first" },
    },
    devtools: { enabled: process.env.NODE_ENV === "development" },
  });
}

let browserClient: ApolloClient | null = null;

/** Per-request client on the server; a singleton in the browser. */
export function getApolloClient(): ApolloClient {
  if (typeof window === "undefined") return createApolloClient();
  browserClient ??= createApolloClient();
  return browserClient;
}
