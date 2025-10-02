"use client";

import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  from,
  NormalizedCacheObject,
} from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { setContext } from "@apollo/client/link/context";

// Get the GraphQL API URL from environment variables
const GRAPHQL_API_URL =
  process.env.NEXT_PUBLIC_GRAPHQL_API_URL || "http://localhost:8000/graphql";

// HTTP Link - connects to the GraphQL endpoint
const httpLink = new HttpLink({
  uri: GRAPHQL_API_URL,
  credentials: "include", // Include cookies for authentication
});

// Auth Link - adds JWT token to headers if available
const authLink = setContext((_, { headers }) => {
  // Get token from localStorage (only available on client side)
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  return {
    headers: {
      ...headers,
      authorization: token ? `JWT ${token}` : "",
    },
  };
});

// Error Link - global error handling
const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach((error) => {
      console.error(
        `[GraphQL error]: Message: ${error.message}, Location: ${JSON.stringify(error.locations)}, Path: ${error.path}`
      );

      // Handle authentication errors
      if (
        error.extensions?.code === "UNAUTHENTICATED" ||
        error.message.includes("Authentication")
      ) {
        // Clear token and redirect to login
        if (typeof window !== "undefined") {
          localStorage.removeItem("token");
          window.location.href = "/login";
        }
      }
    });
  }

  if (networkError) {
    console.error(`[Network error]: ${networkError}`);
  }
});

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

// Export for direct use
export const client = getApolloClient();
