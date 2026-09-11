import type { ResultOf, VariablesOf } from "@graphql-typed-document-node/core";

import { graphql } from "@/graphql/generated";

export const CREATE_CONSOLIDATE = graphql(/* GraphQL */ `
  mutation CreateConsolidate(
    $description: String!
    $status: String!
    $packageIds: [ID]!
    $deliveryDate: Date
    $comment: String
    $sendEmail: Boolean
    $extraAttributes: JSONString
  ) {
    createConsolidate(
      description: $description
      status: $status
      packageIds: $packageIds
      deliveryDate: $deliveryDate
      comment: $comment
      sendEmail: $sendEmail
      extraAttributes: $extraAttributes
    ) {
      consolidate {
        ...ConsolidationListItem
      }
    }
  }
`);

export const UPDATE_CONSOLIDATE = graphql(/* GraphQL */ `
  mutation UpdateConsolidate(
    $id: ID!
    $description: String
    $status: String
    $deliveryDate: Date
    $comment: String
    $packageIds: [ID]
  ) {
    updateConsolidate(
      id: $id
      description: $description
      status: $status
      deliveryDate: $deliveryDate
      comment: $comment
      packageIds: $packageIds
    ) {
      consolidate {
        ...ConsolidationListItem
      }
    }
  }
`);

export const DELETE_CONSOLIDATE = graphql(/* GraphQL */ `
  mutation DeleteConsolidate($id: ID!) {
    deleteConsolidate(id: $id) {
      success
    }
  }
`);

export type CreateConsolidateResponse = ResultOf<typeof CREATE_CONSOLIDATE>;
export type CreateConsolidateVariables = VariablesOf<typeof CREATE_CONSOLIDATE>;
export type UpdateConsolidateResponse = ResultOf<typeof UPDATE_CONSOLIDATE>;
export type UpdateConsolidateVariables = VariablesOf<typeof UPDATE_CONSOLIDATE>;
export type DeleteConsolidateResponse = ResultOf<typeof DELETE_CONSOLIDATE>;
export type DeleteConsolidateVariables = VariablesOf<typeof DELETE_CONSOLIDATE>;
