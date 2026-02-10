import { gql } from "@apollo/client";

/**
 * Get all consolidations query
 * Returns a list of all consolidations (no pagination in backend schema)
 */
export const GET_ALL_CONSOLIDATES = gql`
  query GetAllConsolidates {
    allConsolidates {
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
`;

/**
 * Get single consolidation by ID with full details
 */
export const GET_CONSOLIDATE_BY_ID = gql`
  query GetConsolidateById($id: ID!) {
    consolidateById(id: $id) {
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
        mobilePhoneNumber
      }
      packages {
        id
        barcode
        description
        weight
        weightUnit
        courier
        otherCourier
        length
        width
        height
        dimensionUnit
        realPrice
        servicePrice
        arrivalDate
      }
      createdAt
      updatedAt
    }
  }
`;

/**
 * TypeScript types for consolidation queries
 */
export interface ConsolidateClientType {
  id: string;
  fullName: string;
  email: string;
  mobilePhoneNumber?: string | null;
}

export interface ConsolidatePackageType {
  id: string;
  barcode: string;
  description: string | null;
  weight?: number | null;
  weightUnit?: string | null;
  courier?: string | null;
  otherCourier?: string | null;
  length?: number | null;
  width?: number | null;
  height?: number | null;
  dimensionUnit?: string | null;
  realPrice?: number | null;
  servicePrice?: number | null;
  arrivalDate?: string | null;
}

export interface ConsolidateType {
  id: string;
  description: string;
  status: string;
  deliveryDate: string | null;
  comment: string | null;
  extraAttributes: string | null;
  client: ConsolidateClientType;
  packages: ConsolidatePackageType[];
  createdAt: string;
  updatedAt: string;
}

export interface GetAllConsolidatesResponse {
  allConsolidates: ConsolidateType[];
}

export interface GetConsolidateByIdVariables {
  id: string;
}

export interface GetConsolidateByIdResponse {
  consolidateById: ConsolidateType | null;
}
