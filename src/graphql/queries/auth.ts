import type { ResultOf } from "@graphql-typed-document-node/core";

import { graphql } from "@/graphql/generated";

export const GET_CURRENT_USER = graphql(/* GraphQL */ `
  query GetCurrentUser {
    me {
      id
      email
      firstName
      lastName
      isSuperuser
    }
  }
`);

export type GetCurrentUserResponse = ResultOf<typeof GET_CURRENT_USER>;
export type BackendUser = NonNullable<GetCurrentUserResponse["me"]>;
