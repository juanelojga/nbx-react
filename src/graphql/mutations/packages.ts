import { gql } from "@apollo/client";

/**
 * Delete package mutation
 */
export const DELETE_PACKAGE = gql`
  mutation DeletePackage($id: ID!) {
    deletePackage(id: $id) {
      success
    }
  }
`;

/**
 * TypeScript types for delete package mutation
 */
export interface DeletePackageVariables {
  id: string;
}

export interface DeletePackageResponse {
  deletePackage: {
    success: boolean;
  };
}
