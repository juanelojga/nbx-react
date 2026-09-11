/** GraphQL endpoint shared by the Apollo link chain and the raw refresh call. */
export const GRAPHQL_ENDPOINT =
  process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT ?? "http://localhost:8000/graphql";
