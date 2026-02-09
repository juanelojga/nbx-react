import { gql } from "@apollo/client";

/**
 * Login mutation
 * Uses emailAuth as per backend GraphQL schema
 */
export const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    emailAuth(email: $email, password: $password) {
      token
      refreshToken
      refreshExpiresIn
      payload
    }
  }
`;

/**
 * Refresh token mutation
 * Uses refreshWithToken as per backend GraphQL schema
 */
export const REFRESH_TOKEN_MUTATION = gql`
  mutation RefreshToken($refreshToken: String!) {
    refreshWithToken(refreshToken: $refreshToken) {
      token
      refreshToken
      refreshExpiresIn
      payload
    }
  }
`;

/**
 * Logout mutation (if backend supports session invalidation)
 */
export const LOGOUT_MUTATION = gql`
  mutation Logout {
    revokeToken {
      revoked
    }
  }
`;

/**
 * TypeScript types for mutation responses
 */
export interface LoginResponse {
  emailAuth: {
    token: string;
    refreshToken: string;
    refreshExpiresIn: number;
    payload: {
      email: string;
      exp: number;
      origIat: number;
    };
  };
}

export interface RefreshTokenResponse {
  refreshWithToken: {
    token: string;
    refreshToken: string;
    refreshExpiresIn: number;
    payload: {
      email: string;
      exp: number;
      origIat: number;
    };
  };
}

export interface LogoutResponse {
  revokeToken: {
    revoked: boolean;
  };
}
