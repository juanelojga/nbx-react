import { gql } from "@apollo/client";

/**
 * Login mutation
 * Note: Field names should be verified with the Django/Graphene backend schema
 * Common patterns: tokenAuth, login, or signIn
 */
export const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    tokenAuth(email: $email, password: $password) {
      token
      refreshExpiresIn
      payload
    }
  }
`;

/**
 * Refresh token mutation
 * Note: Verify the mutation name with backend (refreshToken, refreshJwtToken, etc.)
 */
export const REFRESH_TOKEN_MUTATION = gql`
  mutation RefreshToken($token: String!) {
    refreshToken(token: $token) {
      token
      refreshExpiresIn
      payload
    }
  }
`;

/**
 * Logout mutation (if backend supports session invalidation)
 * Note: Some backends handle logout client-side only
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
  tokenAuth: {
    token: string;
    refreshExpiresIn: number;
    user: {
      email: string;
      exp: number;
      origIat: number;
    };
  };
}

export interface RefreshTokenResponse {
  refreshToken: {
    token: string;
    refreshExpiresIn: number;
    user: {
      email: string;
      exp: number;
      origIat: number;
    };
  };
}

export interface LogoutResponse {
  revokeToken: {
    success: boolean;
  };
}
