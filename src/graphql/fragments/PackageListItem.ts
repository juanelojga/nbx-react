import { graphql } from "@/graphql/generated";

/** Columns shown in package tables and dashboard lists. */
export const PACKAGE_LIST_ITEM = graphql(/* GraphQL */ `
  fragment PackageListItem on PackageType {
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
      ...ClientSummary
    }
  }
`);
