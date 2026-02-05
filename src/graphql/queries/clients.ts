import { gql } from "@apollo/client";

/**
 * Get all clients query with pagination and sorting
 */
export const GET_ALL_CLIENTS = gql`
  query GetAllClients(
    $search: String
    $page: Int
    $pageSize: Int
    $orderBy: String
  ) {
    allClients(
      search: $search
      page: $page
      pageSize: $pageSize
      orderBy: $orderBy
    ) {
      results {
        id
        user {
          id
          isSuperuser
          email
          firstName
          lastName
        }
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
        fullName
      }
      totalCount
      page
      pageSize
      hasNext
      hasPrevious
    }
  }
`;

/**
 * TypeScript types for query responses
 */
export interface MeType {
  id: string;
  isSuperuser: boolean;
  email: string;
  firstName: string | null;
  lastName: string | null;
}

export interface ClientType {
  id: string;
  user: MeType;
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
  fullName: string;
}

export interface ClientConnection {
  results: ClientType[];
  totalCount: number;
  page: number;
  pageSize: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface GetAllClientsResponse {
  allClients: ClientConnection;
}

export interface GetAllClientsVariables {
  search?: string;
  page?: number;
  pageSize?: number;
  orderBy?: string;
}

/**
 * Get single client query
 * This query is restricted to superusers
 */
export const GET_CLIENT = gql`
  query GetClient($id: Int!) {
    client(id: $id) {
      id
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
      fullName
    }
  }
`;

/**
 * TypeScript types for single client query
 */
export interface ClientDetailType {
  id: string;
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
  fullName: string;
}

export interface GetClientResponse {
  client: ClientDetailType;
}

export interface GetClientVariables {
  id: string;
}
