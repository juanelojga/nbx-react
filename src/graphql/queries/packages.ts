import type { ResultOf, VariablesOf } from "@graphql-typed-document-node/core";

import { graphql } from "@/graphql/generated";
import type {
  PackageDetailFragment,
  PackageListItemFragment,
} from "@/graphql/generated/graphql";

/** Paginated packages, optionally scoped to a client / not yet consolidated. */
export const GET_ALL_PACKAGES = graphql(/* GraphQL */ `
  query GetAllPackages(
    $clientId: ID
    $page: Int
    $pageSize: Int
    $orderBy: String
    $search: String
    $notInConsolidate: Boolean
  ) {
    allPackages(
      clientId: $clientId
      page: $page
      pageSize: $pageSize
      orderBy: $orderBy
      search: $search
      notInConsolidate: $notInConsolidate
    ) {
      results {
        ...PackageListItem
      }
      totalCount
      page
      pageSize
      hasNext
      hasPrevious
    }
  }
`);

export const GET_PACKAGE = graphql(/* GraphQL */ `
  query GetPackage($id: ID!) {
    package(id: $id) {
      ...PackageDetail
    }
  }
`);

export type GetAllPackagesResponse = ResultOf<typeof GET_ALL_PACKAGES>;
export type GetAllPackagesVariables = VariablesOf<typeof GET_ALL_PACKAGES>;
export type GetPackageResponse = ResultOf<typeof GET_PACKAGE>;
export type GetPackageVariables = VariablesOf<typeof GET_PACKAGE>;

export type PackageType = PackageListItemFragment;
export type PackageDetailType = PackageDetailFragment;
