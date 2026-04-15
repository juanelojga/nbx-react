import { gql } from "@apollo/client";

/**
 * Create client mutation
 */
export const CREATE_CLIENT = gql`
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
        id
        fullName
        email
        extraEmail1
        extraEmail2
        identificationNumber
        state
        city
        mainStreet
        secondaryStreet
        buildingNumber
        mobilePhoneNumber
        phoneNumber
        createdAt
        updatedAt
      }
    }
  }
`;

/**
 * TypeScript types for mutation variables and response
 */
export interface CreateClientVariables {
  buildingNumber?: string;
  city?: string;
  email: string;
  extraEmail1?: string;
  extraEmail2?: string;
  firstName: string;
  identificationNumber?: string;
  lastName: string;
  mainStreet?: string;
  mobilePhoneNumber?: string;
  phoneNumber?: string;
  secondaryStreet?: string;
  state?: string;
}

export interface CreateClientResponse {
  createClient: {
    client: {
      id: string;
      fullName: string;
      email: string;
      extraEmail1: string | null;
      extraEmail2: string | null;
      identificationNumber: string | null;
      state: string | null;
      city: string | null;
      mainStreet: string | null;
      secondaryStreet: string | null;
      buildingNumber: string | null;
      mobilePhoneNumber: string | null;
      phoneNumber: string | null;
      createdAt: string;
      updatedAt: string;
    };
  };
}

/**
 * Update client mutation
 * This mutation is restricted to superusers
 */
export const UPDATE_CLIENT = gql`
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
        id
        fullName
        email
        extraEmail1
        extraEmail2
        city
        state
        mobilePhoneNumber
        phoneNumber
        identificationNumber
        mainStreet
        secondaryStreet
        buildingNumber
        updatedAt
      }
    }
  }
`;

/**
 * TypeScript types for update client mutation
 */
export interface UpdateClientVariables {
  id: string;
  firstName?: string;
  lastName?: string;
  extraEmail1?: string;
  extraEmail2?: string;
  identificationNumber?: string;
  state?: string;
  city?: string;
  mainStreet?: string;
  secondaryStreet?: string;
  buildingNumber?: string;
  mobilePhoneNumber?: string;
  phoneNumber?: string;
}

export interface UpdateClientResponse {
  updateClient: {
    client: {
      id: string;
      fullName: string;
      email: string;
      extraEmail1: string | null;
      extraEmail2: string | null;
      city: string | null;
      state: string | null;
      mobilePhoneNumber: string | null;
      phoneNumber: string | null;
      identificationNumber: string | null;
      mainStreet: string | null;
      secondaryStreet: string | null;
      buildingNumber: string | null;
      updatedAt: string;
    };
  };
}

/**
 * Delete client mutation
 * This mutation is restricted to superusers
 */
export const DELETE_CLIENT = gql`
  mutation DeleteClient($id: ID!, $deleteUser: Boolean) {
    deleteClient(id: $id, deleteUser: $deleteUser) {
      ok
      message
    }
  }
`;

/**
 * TypeScript types for delete client mutation
 */
export interface DeleteClientVariables {
  id: string;
  deleteUser?: boolean;
}

export interface DeleteClientResponse {
  deleteClient: {
    ok: boolean;
    message: string | null;
  };
}
