import type { ResultOf, VariablesOf } from "@graphql-typed-document-node/core";

import { graphql } from "@/graphql/generated";

export const GET_DASHBOARD = graphql(/* GraphQL */ `
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
          ...ClientSummary
        }
      }
      recentConsolidations(limit: $recentConsolidationsLimit) {
        id
        description
        status
        deliveryDate
        createdAt
        client {
          ...ClientSummary
        }
        packages {
          id
          barcode
        }
      }
    }
  }
`);

export type GetDashboardResponse = ResultOf<typeof GET_DASHBOARD>;
export type GetDashboardVariables = VariablesOf<typeof GET_DASHBOARD>;
export type DashboardType = NonNullable<GetDashboardResponse["dashboard"]>;
export type DashboardStatsType = NonNullable<DashboardType["stats"]>;
export type RecentPackageType = NonNullable<
  NonNullable<DashboardType["recentPackages"]>[number]
>;
export type RecentConsolidationType = NonNullable<
  NonNullable<DashboardType["recentConsolidations"]>[number]
>;
