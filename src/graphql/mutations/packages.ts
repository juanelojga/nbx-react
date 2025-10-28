import { gql } from "@apollo/client";

/**
 * Create package mutation
 */
export const CREATE_PACKAGE = gql`
  mutation CreatePackage(
    $barcode: String!
    $clientId: ID!
    $courier: String!
    $otherCourier: String
    $length: Float
    $width: Float
    $height: Float
    $dimensionUnit: String
    $weight: Float
    $weightUnit: String
    $description: String
    $purchaseLink: String
    $realPrice: Float
    $servicePrice: Float
    $arrivalDate: Date
    $comments: String
  ) {
    createPackage(
      barcode: $barcode
      clientId: $clientId
      courier: $courier
      otherCourier: $otherCourier
      length: $length
      width: $width
      height: $height
      dimensionUnit: $dimensionUnit
      weight: $weight
      weightUnit: $weightUnit
      description: $description
      purchaseLink: $purchaseLink
      realPrice: $realPrice
      servicePrice: $servicePrice
      arrivalDate: $arrivalDate
      comments: $comments
    ) {
      package {
        id
        barcode
        description
        createdAt
      }
    }
  }
`;

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
 * TypeScript types for create package mutation
 */
export interface CreatePackageVariables {
  barcode: string;
  clientId: string;
  courier: string;
  otherCourier?: string;
  length?: number;
  width?: number;
  height?: number;
  dimensionUnit?: string;
  weight?: number;
  weightUnit?: string;
  description?: string;
  purchaseLink?: string;
  realPrice?: number;
  servicePrice?: number;
  arrivalDate?: string;
  comments?: string;
}

export interface CreatePackageResponse {
  createPackage: {
    package: {
      id: string;
      barcode: string;
      description: string | null;
      createdAt: string;
    };
  };
}

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
