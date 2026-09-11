import { graphql } from "@/graphql/generated";

/** Full package shape returned by fetch/create/update. */
export const PACKAGE_DETAIL = graphql(/* GraphQL */ `
  fragment PackageDetail on PackageType {
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
      ...ClientSummary
    }
    createdAt
    updatedAt
  }
`);
