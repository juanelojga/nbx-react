"use client";

import React from "react";
import {
  ApolloClient,
  ApolloLink,
  InMemoryCache,
  Observable,
} from "@apollo/client";
import { ApolloProvider } from "@apollo/client/react";
import { print, visit, type DocumentNode } from "graphql";
import type { FormattedExecutionResult } from "graphql";

interface MockedResponse {
  request: {
    query: unknown;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    variables?: Record<string, any>;
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  result?: any;
  error?: Error;
  delay?: number;
}

interface MockedProviderProps {
  mocks?: MockedResponse[];
  addTypename?: boolean;
  children: React.ReactNode;
}

export type { MockedResponse };

class CompatMockLink extends ApolloLink {
  private mocks: MockedResponse[];

  constructor(mocks: MockedResponse[]) {
    super();
    this.mocks = [...mocks];
  }

  request(
    operation: ApolloLink.Operation
  ): Observable<FormattedExecutionResult> {
    const stripTypename = (doc: DocumentNode): DocumentNode =>
      visit(doc, {
        Field: {
          enter(node) {
            if (node.name.value === "__typename") return null;
            return undefined;
          },
        },
      });
    const normalize = (doc: DocumentNode) =>
      print(stripTypename(doc)).replace(/\s+/g, " ").trim();
    const opQuery = normalize(operation.query);
    const mockIndex = this.mocks.findIndex((m) => {
      const mockQuery = normalize(m.request.query as DocumentNode);
      if (mockQuery !== opQuery) return false;
      if (m.request.variables) {
        const mockVars = m.request.variables;
        const opVars = operation.variables || {};
        for (const key of Object.keys(mockVars)) {
          if (JSON.stringify(mockVars[key]) !== JSON.stringify(opVars[key])) {
            return false;
          }
        }
      }
      return true;
    });
    const mock = mockIndex >= 0 ? this.mocks.splice(mockIndex, 1)[0] : null;

    if (!mock) {
      return new Observable((observer) => {
        observer.error(
          new Error(`No mock found for operation "${operation.operationName}"`)
        );
      });
    }

    return new Observable((observer) => {
      const delay = mock.delay ?? 0;
      const timer = setTimeout(() => {
        if (mock.error) {
          observer.error(mock.error);
        } else {
          observer.next(
            typeof mock.result === "function" ? mock.result() : mock.result
          );
          observer.complete();
        }
      }, delay);
      return () => clearTimeout(timer);
    });
  }
}

export function MockedProvider({ mocks = [], children }: MockedProviderProps) {
  const [client] = React.useState(() => {
    const mockLink = new CompatMockLink(mocks);
    return new ApolloClient({
      link: mockLink,
      cache: new InMemoryCache(),
    });
  });

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
