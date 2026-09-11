import type { ResultOf, VariablesOf } from "@graphql-typed-document-node/core";

import { graphql } from "@/graphql/generated";

export const CREATE_CLIENT = graphql(/* GraphQL */ `
  mutation CreateClient(
    $buildingNumber: String
    $city: String
    $email: String!
    $extraEmail1: String
    $extraEmail2: String
    $firstName: String!
    $identificationNumber: String
    $lastName: String!
    $mainStreet: String
    $mobilePhoneNumber: String
    $phoneNumber: String
    $secondaryStreet: String
    $state: String
  ) {
    createClient(
      buildingNumber: $buildingNumber
      city: $city
      email: $email
      extraEmail1: $extraEmail1
      extraEmail2: $extraEmail2
      firstName: $firstName
      identificationNumber: $identificationNumber
      lastName: $lastName
      mainStreet: $mainStreet
      mobilePhoneNumber: $mobilePhoneNumber
      phoneNumber: $phoneNumber
      secondaryStreet: $secondaryStreet
      state: $state
    ) {
      client {
        ...ClientDetail
      }
    }
  }
`);

export const UPDATE_CLIENT = graphql(/* GraphQL */ `
  mutation UpdateClient(
    $id: ID!
    $firstName: String
    $lastName: String
    $extraEmail1: String
    $extraEmail2: String
    $identificationNumber: String
    $state: String
    $city: String
    $mainStreet: String
    $secondaryStreet: String
    $buildingNumber: String
    $mobilePhoneNumber: String
    $phoneNumber: String
  ) {
    updateClient(
      id: $id
      firstName: $firstName
      lastName: $lastName
      extraEmail1: $extraEmail1
      extraEmail2: $extraEmail2
      identificationNumber: $identificationNumber
      state: $state
      city: $city
      mainStreet: $mainStreet
      secondaryStreet: $secondaryStreet
      buildingNumber: $buildingNumber
      mobilePhoneNumber: $mobilePhoneNumber
      phoneNumber: $phoneNumber
    ) {
      client {
        ...ClientDetail
      }
    }
  }
`);

export const DELETE_CLIENT = graphql(/* GraphQL */ `
  mutation DeleteClient($id: ID!, $deleteUser: Boolean) {
    deleteClient(id: $id, deleteUser: $deleteUser) {
      ok
      message
    }
  }
`);

export type CreateClientResponse = ResultOf<typeof CREATE_CLIENT>;
export type CreateClientVariables = VariablesOf<typeof CREATE_CLIENT>;
export type UpdateClientResponse = ResultOf<typeof UPDATE_CLIENT>;
export type UpdateClientVariables = VariablesOf<typeof UPDATE_CLIENT>;
export type DeleteClientResponse = ResultOf<typeof DELETE_CLIENT>;
export type DeleteClientVariables = VariablesOf<typeof DELETE_CLIENT>;
