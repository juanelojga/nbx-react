import { graphql } from "@/graphql/generated";

/** Minimal client identity shown inside packages and consolidations. */
export const CLIENT_SUMMARY = graphql(/* GraphQL */ `
  fragment ClientSummary on ClientType {
    id
    fullName
    email
  }
`);
