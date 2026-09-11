import type { ResultOf, VariablesOf } from "@graphql-typed-document-node/core";

import { graphql } from "@/graphql/generated";

export const UPDATE_PRICING_CONFIG = graphql(/* GraphQL */ `
  mutation UpdatePricingConfig(
    $serviceFeePercentage: Float
    $transportationRatePerLb: Float
  ) {
    updatePricingConfig(
      serviceFeePercentage: $serviceFeePercentage
      transportationRatePerLb: $transportationRatePerLb
    ) {
      pricingConfig {
        serviceFeePercentage
        transportationRatePerLb
        updatedAt
      }
    }
  }
`);

export type UpdatePricingConfigResponse = ResultOf<
  typeof UPDATE_PRICING_CONFIG
>;
export type UpdatePricingConfigVariables = VariablesOf<
  typeof UPDATE_PRICING_CONFIG
>;
