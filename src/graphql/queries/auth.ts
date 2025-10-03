import { gql } from "@apollo/client";

/**
 * Get current authenticated user query
 * Note: Verify the query name with backend (me, currentUser, viewer, etc.)
 */
export const GET_CURRENT_USER = gql`
  query GetCurrentUser {
    me {
      id
      email
      firstName
      lastName
      role
    }
  }
`;

/**
 * TypeScript types for query responses
 */
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "admin" | "client";
}

export interface GetCurrentUserResponse {
  me: User;
}
