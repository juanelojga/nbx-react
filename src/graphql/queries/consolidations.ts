import { gql } from "@apollo/client";
import { ConsolidationStatus } from "@/lib/validation/status";

/**
 * Get all consolidations query with pagination, filtering, and sorting
 */
export const GET_ALL_CONSOLIDATES = gql`
  query GetAllConsolidates(
    $search: String
    $page: Int
    $pageSize: Int
    $orderBy: String
    $status: String
    $createdAfter: Date
    $createdBefore: Date
  ) {
    allConsolidates(
      search: $search
      page: $page
      pageSize: $pageSize
      orderBy: $orderBy
      status: $status
      createdAfter: $createdAfter
      createdBefore: $createdBefore
    ) {
      results {
        id
        description
        status
        deliveryDate
        comment
        extraAttributes
        totalCost
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
      totalCount
      page
      pageSize
      hasNext
      hasPrevious
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
      totalCost
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
        purchasedByNarbox
        realPrice
        servicePrice
        transportationCost
        serviceFee
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
  purchasedByNarbox?: boolean;
  realPrice?: number | null;
  servicePrice?: number | null;
  transportationCost?: number | null;
  serviceFee?: number | null;
  arrivalDate?: string | null;
}

export interface ConsolidateType {
  id: string;
  description: string;
  status: ConsolidationStatus;
  deliveryDate: string | null;
  comment: string | null;
  extraAttributes: string | null;
  totalCost?: number | null;
  client: ConsolidateClientType;
  packages: ConsolidatePackageType[];
  createdAt: string;
  updatedAt: string;
}

export interface ConsolidateConnection {
  results: ConsolidateType[];
  totalCount: number;
  page: number;
  pageSize: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface GetAllConsolidatesResponse {
  allConsolidates: ConsolidateConnection;
}

export interface GetAllConsolidatesVariables {
  search?: string;
  page?: number;
  pageSize?: number;
  orderBy?: string;
  status?: string;
  createdAfter?: string;
  createdBefore?: string;
}

export interface GetConsolidateByIdVariables {
  id: string;
}

export interface GetConsolidateByIdResponse {
  consolidateById: ConsolidateType | null;
}
