"use client";

import { ApolloProvider } from "@apollo/client/react";
import { useMemo } from "react";

import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/contexts/AuthContext";
import { getApolloClient } from "@/lib/apollo/client";

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  // Memoize Apollo Client to ensure singleton pattern
  const client = useMemo(() => getApolloClient(), []);

  return (
    <ErrorBoundary>
      <ApolloProvider client={client}>
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </ApolloProvider>
    </ErrorBoundary>
  );
}
