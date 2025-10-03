"use client";

import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  from,
  NormalizedCacheObject,
  ApolloLink,
  Observable,
} from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { setContext } from "@apollo/client/link/context";
import {
  getAccessToken,
  getRefreshToken,
  saveTokens,
  clearTokens,
  isTokenExpired,
} from "@/lib/auth/tokens";
import { REFRESH_TOKEN_MUTATION } from "@/graphql/mutations/auth";

// Get the GraphQL API URL from environment variables
const GRAPHQL_API_URL =
  process.env.NEXT_PUBLIC_GRAPHQL_API_URL || "http://localhost:8000/graphql";

// HTTP Link - connects to the GraphQL endpoint
const httpLink = new HttpLink({
  uri: GRAPHQL_API_URL,
  credentials: "include", // Include cookies for authentication
});

// Auth Link - adds JWT token to headers if available
const authLink = setContext(async (_, { headers }) => {
  let token = getAccessToken();

  // Check if token is expired and refresh if needed
  if (token && isTokenExpired(token)) {
    const refreshToken = getRefreshToken();
    if (refreshToken) {
      try {
        const response = await fetch(GRAPHQL_API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: REFRESH_TOKEN_MUTATION.loc?.source.body,
            variables: { refreshToken },
          }),
        });

        const result = await response.json();
        if (result.data?.refreshToken) {
          const newToken = result.data.refreshToken.token;
          const newRefreshToken = result.data.refreshToken.refreshToken;
          saveTokens(newToken, newRefreshToken);
          token = newToken;
        }
      } catch (error) {
        console.error("Token refresh failed:", error);
        clearTokens();
        token = null;
      }
    }
  }

  return {
    headers: {
      ...headers,
      authorization: token ? `JWT ${token}` : "",
    },
  };
});

// Error Link - global error handling with retry logic
const errorLink = onError(
  ({ graphQLErrors, networkError, operation, forward }) => {
    if (graphQLErrors) {
      for (const error of graphQLErrors) {
        console.error(
          `[GraphQL error]: Message: ${error.message}, Location: ${JSON.stringify(error.locations)}, Path: ${error.path}`
        );

        // Handle authentication errors (401, token expired)
        if (
          error.extensions?.code === "UNAUTHENTICATED" ||
          error.message.includes("Authentication") ||
          error.message.includes("Signature has expired")
        ) {
          // Try to refresh the token
          const refreshToken = getRefreshToken();
          if (
            refreshToken &&
            !operation.operationName?.includes("RefreshToken")
          ) {
            return new Observable((observer) => {
              fetch(GRAPHQL_API_URL, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  query: REFRESH_TOKEN_MUTATION.loc?.source.body,
                  variables: { refreshToken },
                }),
              })
                .then((response) => response.json())
                .then((result) => {
                  if (result.data?.refreshToken) {
                    const newToken = result.data.refreshToken.token;
                    const newRefreshToken =
                      result.data.refreshToken.refreshToken;
                    saveTokens(newToken, newRefreshToken);

                    // Retry the failed request with new token
                    const subscriber = {
                      next: observer.next.bind(observer),
                      error: observer.error.bind(observer),
                      complete: observer.complete.bind(observer),
                    };

                    forward(operation).subscribe(subscriber);
                  } else {
                    throw new Error("Refresh failed");
                  }
                })
                .catch(() => {
                  clearTokens();
                  if (typeof window !== "undefined") {
                    window.location.href = "/login";
                  }
                  observer.error(error);
                });
            });
          } else {
            // No refresh token available or already trying to refresh
            clearTokens();
            if (typeof window !== "undefined") {
              window.location.href = "/login";
            }
          }
        }
      }
    }

    if (networkError) {
      console.error(`[Network error]: ${networkError}`);
    }
  }
);

// Create Apollo Client instance
let apolloClient: ApolloClient<NormalizedCacheObject> | null = null;

function createApolloClient(): ApolloClient<NormalizedCacheObject> {
  return new ApolloClient({
    ssrMode: typeof window === "undefined", // Enable SSR mode on server
    link: from([errorLink, authLink, httpLink]),
    cache: new InMemoryCache({
      typePolicies: {
        Query: {
          fields: {
            // Add any custom cache policies here
          },
        },
      },
    }),
    defaultOptions: {
      watchQuery: {
        fetchPolicy: "cache-and-network",
        errorPolicy: "all",
      },
      query: {
        fetchPolicy: "network-only",
        errorPolicy: "all",
      },
      mutate: {
        errorPolicy: "all",
      },
    },
  });
}

// Initialize Apollo Client (singleton pattern for client-side)
export function getApolloClient(): ApolloClient<NormalizedCacheObject> {
  if (typeof window === "undefined") {
    // Always create a new client on the server
    return createApolloClient();
  }

  // Create the Apollo Client once on the client
  if (!apolloClient) {
    apolloClient = createApolloClient();
  }

  return apolloClient;
}

// Export the client instance for use in AuthContext
export { apolloClient };
