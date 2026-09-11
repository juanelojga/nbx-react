import { graphql } from "@/graphql/generated";

/** Every editable client field, as used by the clients list and dialogs. */
export const CLIENT_DETAIL = graphql(/* GraphQL */ `
  fragment ClientDetail on ClientType {
    id
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
    fullName
  }
`);
