import type { ResultOf, VariablesOf } from "@graphql-typed-document-node/core";

import { graphql } from "@/graphql/generated";

export const CREATE_PACKAGE = graphql(/* GraphQL */ `
  mutation CreatePackage(
    $barcode: String!
    $clientId: ID!
    $courier: String!
    $otherCourier: String
    $length: Float
    $width: Float
    $height: Float
    $dimensionUnit: String
    $weight: Float!
    $weightUnit: String
    $description: String
    $purchaseLink: String
    $realPrice: Float
    $purchasedByNarbox: Boolean
    $arrivalDate: Date
    $comments: String
  ) {
    createPackage(
      barcode: $barcode
      clientId: $clientId
      courier: $courier
      otherCourier: $otherCourier
      length: $length
      width: $width
      height: $height
      dimensionUnit: $dimensionUnit
      weight: $weight
      weightUnit: $weightUnit
      description: $description
      purchaseLink: $purchaseLink
      realPrice: $realPrice
      purchasedByNarbox: $purchasedByNarbox
      arrivalDate: $arrivalDate
      comments: $comments
    ) {
      package {
        ...PackageDetail
      }
    }
  }
`);

export const UPDATE_PACKAGE = graphql(/* GraphQL */ `
  mutation UpdatePackage(
    $id: ID!
    $courier: String
    $otherCourier: String
    $length: Float
    $width: Float
    $height: Float
    $dimensionUnit: String
    $weight: Float
    $weightUnit: String
    $description: String
    $purchaseLink: String
    $realPrice: Float
    $purchasedByNarbox: Boolean
    $arrivalDate: Date
    $comments: String
    $clientId: ID
  ) {
    updatePackage(
      id: $id
      courier: $courier
      otherCourier: $otherCourier
      length: $length
      width: $width
      height: $height
      dimensionUnit: $dimensionUnit
      weight: $weight
      weightUnit: $weightUnit
      description: $description
      purchaseLink: $purchaseLink
      realPrice: $realPrice
      purchasedByNarbox: $purchasedByNarbox
      arrivalDate: $arrivalDate
      comments: $comments
      clientId: $clientId
    ) {
      package {
        ...PackageDetail
      }
    }
  }
`);

export const DELETE_PACKAGE = graphql(/* GraphQL */ `
  mutation DeletePackage($id: ID!) {
    deletePackage(id: $id) {
      success
    }
  }
`);

export type CreatePackageResponse = ResultOf<typeof CREATE_PACKAGE>;
export type CreatePackageVariables = VariablesOf<typeof CREATE_PACKAGE>;
export type UpdatePackageResponse = ResultOf<typeof UPDATE_PACKAGE>;
export type UpdatePackageVariables = VariablesOf<typeof UPDATE_PACKAGE>;
export type DeletePackageResponse = ResultOf<typeof DELETE_PACKAGE>;
export type DeletePackageVariables = VariablesOf<typeof DELETE_PACKAGE>;
