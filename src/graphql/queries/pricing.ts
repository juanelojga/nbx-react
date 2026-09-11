import type { ResultOf } from "@graphql-typed-document-node/core";

import { graphql } from "@/graphql/generated";

export const GET_PRICING_CONFIG = graphql(/* GraphQL */ `
  query GetPricingConfig {
    pricingConfig {
      serviceFeePercentage
      transportationRatePerLb
      updatedAt
    }
  }
`);

export type GetPricingConfigResponse = ResultOf<typeof GET_PRICING_CONFIG>;
export type PricingConfigType = NonNullable<
  GetPricingConfigResponse["pricingConfig"]
>;
