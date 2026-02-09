"use client";

import { ApolloProvider } from "@apollo/client/react";
import { getApolloClient } from "@/lib/apollo/client";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "@/components/ui/sonner";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import { useMemo } from "react";

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
