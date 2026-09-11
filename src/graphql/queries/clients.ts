import type { ResultOf, VariablesOf } from "@graphql-typed-document-node/core";

import { graphql } from "@/graphql/generated";
import type { ClientDetailFragment } from "@/graphql/generated/graphql";

/** Paginated client list (admin only). */
export const GET_ALL_CLIENTS = graphql(/* GraphQL */ `
  query GetAllClients(
    $search: String
    $page: Int
    $pageSize: Int
    $orderBy: String
  ) {
    allClients(
      search: $search
      page: $page
      pageSize: $pageSize
      orderBy: $orderBy
    ) {
      results {
        ...ClientDetail
        user {
          id
          isSuperuser
          email
          firstName
          lastName
        }
      }
      totalCount
      page
      pageSize
      hasNext
      hasPrevious
    }
  }
`);

export const GET_CLIENT = graphql(/* GraphQL */ `
  query GetClient($id: ID!) {
    client(id: $id) {
      ...ClientDetail
    }
  }
`);

export type GetAllClientsResponse = ResultOf<typeof GET_ALL_CLIENTS>;
export type GetAllClientsVariables = VariablesOf<typeof GET_ALL_CLIENTS>;
export type GetClientResponse = ResultOf<typeof GET_CLIENT>;
export type GetClientVariables = VariablesOf<typeof GET_CLIENT>;

/** A client row as returned by the list query. */
export type ClientType = NonNullable<
  NonNullable<
    NonNullable<GetAllClientsResponse["allClients"]>["results"]
  >[number]
>;
export type ClientDetailType = ClientDetailFragment;
