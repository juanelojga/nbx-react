import type { ResultOf, VariablesOf } from "@graphql-typed-document-node/core";

import { graphql } from "@/graphql/generated";

/** Password login; the backend rotates refresh tokens on every refresh. */
export const LOGIN_MUTATION = graphql(/* GraphQL */ `
  mutation Login($email: String!, $password: String!) {
    emailAuth(email: $email, password: $password) {
      token
      refreshToken
      refreshExpiresIn
    }
  }
`);

export const REFRESH_TOKEN_MUTATION = graphql(/* GraphQL */ `
  mutation RefreshToken($refreshToken: String!) {
    refreshWithToken(refreshToken: $refreshToken) {
      token
      refreshToken
      refreshExpiresIn
    }
  }
`);

export type LoginResponse = ResultOf<typeof LOGIN_MUTATION>;
export type LoginVariables = VariablesOf<typeof LOGIN_MUTATION>;
export type RefreshTokenResponse = ResultOf<typeof REFRESH_TOKEN_MUTATION>;
