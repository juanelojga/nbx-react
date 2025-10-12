"use client";

import { ApolloProvider } from "@apollo/client/react";
import { getApolloClient } from "@/lib/apollo/client";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "@/components/ui/sonner";

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  const client = getApolloClient();

  return (
    <ApolloProvider client={client}>
      <AuthProvider>
        {children}
        <Toaster />
      </AuthProvider>
    </ApolloProvider>
  );
}
