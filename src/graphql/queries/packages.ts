import { gql } from "@apollo/client";

/**
 * Resolve all packages query with pagination and sorting
 */
export const RESOLVE_ALL_PACKAGES = gql`
  query ResolveAllPackages(
    $client_id: ID
    $page: Int
    $page_size: Int
    $order_by: String
    $search: String
    $notInConsolidate: Boolean
  ) {
    allPackages(
      clientId: $client_id
      page: $page
      pageSize: $page_size
      orderBy: $order_by
      search: $search
      notInConsolidate: $notInConsolidate
    ) {
      results {
        id
        barcode
        description
        purchasedByNarbox
        realPrice
        servicePrice
        transportationCost
        serviceFee
        weight
        weightUnit
        createdAt
        client {
          id
          fullName
          email
        }
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
 * Get single package by ID with full details
 */
export const GET_PACKAGE = gql`
  query GetPackage($id: ID!) {
    package(id: $id) {
      id
      barcode
      courier
      otherCourier
      length
      width
      height
      dimensionUnit
      weight
      weightUnit
      description
      purchaseLink
      purchasedByNarbox
      realPrice
      servicePrice
      transportationCost
      serviceFee
      arrivalDate
      comments
      client {
        id
        fullName
        email
      }
      createdAt
      updatedAt
    }
  }
`;

/**
 * TypeScript types for query responses
 */
export interface PackageType {
  id: string;
  barcode: string;
  description: string | null;
  purchasedByNarbox: boolean;
  realPrice: number | null;
  servicePrice: number | null;
  transportationCost: number | null;
  serviceFee: number | null;
  weight: number | null;
  weightUnit: string | null;
  createdAt: string;
  client: {
    id: string;
    fullName: string;
    email: string;
  } | null;
}

export interface PackageDetailType {
  id: string;
  barcode: string;
  courier: string | null;
  otherCourier: string | null;
  length: number | null;
  width: number | null;
  height: number | null;
  dimensionUnit: string | null;
  weight: number | null;
  weightUnit: string | null;
  description: string | null;
  purchaseLink: string | null;
  purchasedByNarbox: boolean;
  realPrice: number | null;
  servicePrice: number | null;
  transportationCost: number | null;
  serviceFee: number | null;
  arrivalDate: string | null;
  comments: string | null;
  client: {
    id: string;
    fullName: string;
    email: string;
  } | null;
  createdAt: string;
  updatedAt: string;
}

export interface PackageConnection {
  results: PackageType[];
  totalCount: number;
  page: number;
  pageSize: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface ResolveAllPackagesResponse {
  allPackages: PackageConnection;
}

export interface ResolveAllPackagesVariables {
  client_id?: number | null;
  page?: number;
  page_size?: number;
  order_by?: string;
  search?: string;
  notInConsolidate?: boolean;
}

export interface GetPackageResponse {
  package: PackageDetailType;
}

export interface GetPackageVariables {
  id: number;
}
