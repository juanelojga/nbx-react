"use client";

import {
  ApolloClient,
  from,
  HttpLink,
  InMemoryCache,
  NormalizedCacheObject,
  Observable,
} from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { setContext } from "@apollo/client/link/context";
import {
  clearTokens,
  getAccessToken,
  getRefreshToken,
  isTokenExpired,
  saveTokens,
} from "@/lib/auth/tokens";
import { REFRESH_TOKEN_MUTATION } from "@/graphql/mutations/auth";
import { logger } from "@/lib/logger";

// Get the GraphQL API URL from environment variables
const GRAPHQL_API_URL =
  process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || "http://localhost:8000/graphql";

// HTTP Link - connects to the GraphQL endpoint
const httpLink = new HttpLink({
  uri: GRAPHQL_API_URL,
  credentials: "include", // Include cookies for authentication
  headers: {
    "X-Requested-With": "XMLHttpRequest", // CSRF protection header
  },
});

// Global variable to track ongoing refresh to prevent race conditions
let refreshPromise: Promise<string | null> | null = null;

/**
 * Perform token refresh with deduplication
 * Prevents multiple simultaneous refresh attempts
 */
async function performTokenRefresh(): Promise<string | null> {
  // If a refresh is already in progress, return that promise
  if (refreshPromise) {
    return refreshPromise;
  }

  // Create new refresh promise
  refreshPromise = (async () => {
    try {
      const refreshToken = getRefreshToken();

      if (!refreshToken) {
        throw new Error("No refresh token available");
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

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
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        const result = await response.json();

        if (result.data?.refreshWithToken) {
          const newAccessToken = result.data.refreshWithToken.token;
          const newRefreshToken = result.data.refreshWithToken.refreshToken;
          // Save new access token and new refresh token (token rotation)
          saveTokens(newAccessToken, newRefreshToken);
          return newAccessToken;
        }

        throw new Error("Token refresh failed: Invalid response");
      } catch (error) {
        clearTimeout(timeoutId);
        throw error;
      }
    } catch (error) {
      logger.error("Token refresh failed:", error);
      clearTokens();
      return null;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

// Auth Link - adds JWT token to headers if available
const authLink = setContext(async (_, { headers }) => {
  let token = getAccessToken();

  // Check if token is expired and refresh if needed
  if (token && isTokenExpired(token)) {
    const newToken = await performTokenRefresh();
    if (newToken) {
      token = newToken;
    } else {
      token = null;
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
        logger.error(
          `[GraphQL error]: Message: ${error.message}, Location: ${JSON.stringify(error.locations)}, Path: ${error.path}`
        );

        // Handle authentication errors (401, token expired)
        if (
          error.extensions?.code === "UNAUTHENTICATED" ||
          error.message.includes("Authentication") ||
          error.message.includes("Signature has expired") ||
          error.message.includes("token") ||
          error.message.includes("Token")
        ) {
          // Try to refresh the token
          const refreshToken = getRefreshToken();
          if (
            refreshToken &&
            !operation.operationName?.includes("RefreshToken")
          ) {
            return new Observable((observer) => {
              performTokenRefresh()
                .then((newToken) => {
                  if (newToken) {
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
      logger.error(`[Network error]: ${networkError}`);
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
            // Cache policies for better performance (Vercel Best Practices 3.3)
            allClients: {
              // Cache clients list with merge strategy
              keyArgs: ["search", "orderBy"], // Cache based on search and sort parameters
              merge(_existing, incoming) {
                // For pagination, always replace with incoming data
                // Each page is treated as independent for simplicity
                return incoming;
              },
            },
            allPackages: {
              // Cache packages list
              keyArgs: ["search", "orderBy", "status"],
              merge(_existing, incoming) {
                // For pagination, always replace with incoming data
                return incoming;
              },
            },
          },
        },
        // Cache individual entities by ID for better normalization
        Client: {
          keyFields: ["id"],
        },
        Package: {
          keyFields: ["id"],
        },
        User: {
          keyFields: ["id"],
        },
      },
    }),
    defaultOptions: {
      watchQuery: {
        // Use cache-first for better performance, fallback to network
        fetchPolicy: "cache-first",
        nextFetchPolicy: "cache-and-network", // Refresh in background
        errorPolicy: "all",
      },
      query: {
        // Use cache-first instead of network-only for better performance
        fetchPolicy: "cache-first",
        errorPolicy: "all",
      },
      mutate: {
        errorPolicy: "all",
      },
    },
    devtools: {
      enabled: process.env.NODE_ENV === "development",
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
