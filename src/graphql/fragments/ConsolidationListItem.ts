import { graphql } from "@/graphql/generated";

/** Consolidation shape shared by the list query and create/update payloads. */
export const CONSOLIDATION_LIST_ITEM = graphql(/* GraphQL */ `
  fragment ConsolidationListItem on ConsolidateType {
    id
    description
    status
    deliveryDate
    comment
    extraAttributes
    totalCost
    client {
      ...ClientSummary
    }
    packages {
      id
      barcode
      description
    }
    createdAt
    updatedAt
  }
`);
