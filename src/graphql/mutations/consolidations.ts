import { gql } from "@apollo/client";

/**
 * Create consolidation mutation
 * Creates a new consolidation grouping multiple packages
 * Access: Superuser only
 */
export const CREATE_CONSOLIDATE = gql`
  mutation CreateConsolidate(
    $description: String!
    $status: String!
    $packageIds: [ID]!
    $deliveryDate: Date
    $comment: String
    $sendEmail: Boolean
  ) {
    createConsolidate(
      description: $description
      status: $status
      packageIds: $packageIds
      deliveryDate: $deliveryDate
      comment: $comment
      sendEmail: $sendEmail
    ) {
      consolidate {
        id
        description
        status
        deliveryDate
        comment
        extraAttributes
        client {
          id
          fullName
          email
        }
        packages {
          id
          barcode
          description
        }
        createdAt
        updatedAt
      }
    }
  }
`;

/**
 * Update consolidation mutation
 * Updates an existing consolidation
 * Access: Superuser only
 */
export const UPDATE_CONSOLIDATE = gql`
  mutation UpdateConsolidate(
    $id: ID!
    $description: String
    $status: String
    $deliveryDate: Date
    $comment: String
    $packageIds: [ID]
  ) {
    updateConsolidate(
      id: $id
      description: $description
      status: $status
      deliveryDate: $deliveryDate
      comment: $comment
      packageIds: $packageIds
    ) {
      consolidate {
        id
        description
        status
        deliveryDate
        comment
        extraAttributes
        client {
          id
          fullName
          email
        }
        packages {
          id
          barcode
          description
        }
        createdAt
        updatedAt
      }
    }
  }
`;

/**
 * Delete consolidation mutation
 * Deletes a consolidation (packages remain)
 * Access: Superuser only
 */
export const DELETE_CONSOLIDATE = gql`
  mutation DeleteConsolidate($id: ID!) {
    deleteConsolidate(id: $id) {
      success
    }
  }
`;

/**
 * TypeScript types for create consolidation mutation
 */
export interface CreateConsolidateVariables {
  description: string;
  status: string;
  packageIds: string[];
  deliveryDate?: string;
  comment?: string;
  sendEmail?: boolean;
}

export interface CreateConsolidateResponse {
  createConsolidate: {
    consolidate: {
      id: string;
      description: string;
      status: string;
      deliveryDate: string | null;
      comment: string | null;
      extraAttributes: string | null;
      client: {
        id: string;
        fullName: string;
        email: string;
      };
      packages: {
        id: string;
        barcode: string;
        description: string | null;
      }[];
      createdAt: string;
      updatedAt: string;
    };
  };
}

/**
 * TypeScript types for update consolidation mutation
 */
export interface UpdateConsolidateVariables {
  id: string;
  description?: string;
  status?: string;
  deliveryDate?: string;
  comment?: string;
  packageIds?: string[];
}

export interface UpdateConsolidateResponse {
  updateConsolidate: {
    consolidate: {
      id: string;
      description: string;
      status: string;
      deliveryDate: string | null;
      comment: string | null;
      extraAttributes: string | null;
      client: {
        id: string;
        fullName: string;
        email: string;
      };
      packages: {
        id: string;
        barcode: string;
        description: string | null;
      }[];
      createdAt: string;
      updatedAt: string;
    };
  };
}

/**
 * TypeScript types for delete consolidation mutation
 */
export interface DeleteConsolidateVariables {
  id: string;
}

export interface DeleteConsolidateResponse {
  deleteConsolidate: {
    success: boolean;
  };
}
