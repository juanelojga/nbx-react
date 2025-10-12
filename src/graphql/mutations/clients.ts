import { gql } from "@apollo/client";

/**
 * Create client mutation
 */
export const CREATE_CLIENT = gql`
  mutation CreateClient(
    $buildingNumber: String
    $city: String
    $email: String!
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
 * Delete user mutation
 * This mutation is restricted to superusers
 */
export const DELETE_USER = gql`
  mutation DeleteUser($id: ID!) {
    deleteUser(id: $id) {
      ok
    }
  }
`;

/**
 * TypeScript types for delete user mutation
 */
export interface DeleteUserVariables {
  id: string;
}

export interface DeleteUserResponse {
  deleteUser: {
    ok: boolean;
  };
}
