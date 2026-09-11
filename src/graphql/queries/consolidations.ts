import type { ResultOf, VariablesOf } from "@graphql-typed-document-node/core";

import { graphql } from "@/graphql/generated";
import type { ConsolidationListItemFragment } from "@/graphql/generated/graphql";

/** Paginated consolidations with status and creation-date filters. */
export const GET_ALL_CONSOLIDATES = graphql(/* GraphQL */ `
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
        ...ConsolidationListItem
      }
      totalCount
      page
      pageSize
      hasNext
      hasPrevious
    }
  }
`);

export const GET_CONSOLIDATE_BY_ID = graphql(/* GraphQL */ `
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
        ...ClientSummary
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
`);

export type GetAllConsolidatesResponse = ResultOf<typeof GET_ALL_CONSOLIDATES>;
export type GetAllConsolidatesVariables = VariablesOf<
  typeof GET_ALL_CONSOLIDATES
>;
export type GetConsolidateByIdResponse = ResultOf<typeof GET_CONSOLIDATE_BY_ID>;
export type GetConsolidateByIdVariables = VariablesOf<
  typeof GET_CONSOLIDATE_BY_ID
>;

export type ConsolidateType = ConsolidationListItemFragment;
export type ConsolidateDetailType = NonNullable<
  GetConsolidateByIdResponse["consolidateById"]
>;
export type ConsolidatePackageType = ConsolidateDetailType["packages"][number];
