import { gql } from "@apollo/client";

/**
 * Get dashboard statistics and recent items
 * Data is filtered based on user type (admin sees all, clients see only their own)
 */
export const GET_DASHBOARD = gql`
  query GetDashboard(
    $recentPackagesLimit: Int
    $recentConsolidationsLimit: Int
  ) {
    dashboard {
      stats {
        totalPackages
        recentPackages
        packagesPending
        packagesInTransit
        packagesDelivered
        totalConsolidations
        consolidationsPending
        consolidationsProcessing
        consolidationsInTransit
        consolidationsAwaitingPayment
        totalRealPrice
        totalServicePrice
        totalClients
      }
      recentPackages(limit: $recentPackagesLimit) {
        id
        barcode
        description
        realPrice
        servicePrice
        createdAt
        client {
          id
          fullName
          email
        }
      }
      recentConsolidations(limit: $recentConsolidationsLimit) {
        id
        description
        status
        deliveryDate
        createdAt
        client {
          id
          fullName
          email
        }
        packages {
          id
          barcode
        }
      }
    }
  }
`;

/**
 * Dashboard statistics type
 * Contains aggregate data for packages, consolidations, clients, and financial info
 */
export interface DashboardStatsType {
  totalPackages: number;
  recentPackages: number;
  packagesPending: number;
  packagesInTransit: number;
  packagesDelivered: number;
  totalConsolidations: number;
  consolidationsPending: number;
  consolidationsProcessing: number;
  consolidationsInTransit: number;
  consolidationsAwaitingPayment: number;
  totalRealPrice: number;
  totalServicePrice: number;
  totalClients: number;
}

/**
 * Recent package type for dashboard
 * Simplified package info for dashboard display
 */
export interface RecentPackageType {
  id: string;
  barcode: string;
  description: string | null;
  realPrice: number | null;
  servicePrice: number | null;
  createdAt: string;
  client: {
    id: string;
    fullName: string;
    email: string;
  };
}

/**
 * Recent consolidation type for dashboard
 * Simplified consolidation info for dashboard display
 */
export interface RecentConsolidationType {
  id: string;
  description: string;
  status: string;
  deliveryDate: string | null;
  createdAt: string;
  client: {
    id: string;
    fullName: string;
    email: string;
  };
  packages: Array<{
    id: string;
    barcode: string;
  }>;
}

/**
 * Main dashboard data type
 * Contains stats and recent items lists
 */
export interface DashboardType {
  stats: DashboardStatsType;
  recentPackages: RecentPackageType[];
  recentConsolidations: RecentConsolidationType[];
}

/**
 * GraphQL query response type for dashboard
 */
export interface GetDashboardResponse {
  dashboard: DashboardType;
}

/**
 * Variables for dashboard query
 */
export interface GetDashboardVariables {
  recentPackagesLimit?: number;
  recentConsolidationsLimit?: number;
}
