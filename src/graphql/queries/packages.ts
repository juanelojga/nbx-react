import { gql } from "@apollo/client";

/**
 * Resolve all packages query with pagination and sorting
 */
export const RESOLVE_ALL_PACKAGES = gql`
  query ResolveAllPackages(
    $client_id: Int!
    $page: Int
    $page_size: Int
    $order_by: String
    $search: String
  ) {
    allPackages(
      clientId: $client_id
      page: $page
      pageSize: $page_size
      orderBy: $order_by
      search: $search
    ) {
      results {
        id
        barcode
        description
        createdAt
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
 * TypeScript types for query responses
 */
export interface PackageType {
  id: string;
  barcode: string;
  description: string | null;
  createdAt: string;
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
  client_id: number;
  page?: number;
  page_size?: number;
  order_by?: string;
  search?: string;
}
