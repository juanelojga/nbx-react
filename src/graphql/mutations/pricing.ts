import { gql } from "@apollo/client";

/**
 * Update pricing configuration (superuser-only)
 */
export const UPDATE_PRICING_CONFIG = gql`
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
`;

/**
 * TypeScript types for update pricing config mutation
 */
export interface UpdatePricingConfigVariables {
  serviceFeePercentage?: number;
  transportationRatePerLb?: number;
}

export interface UpdatePricingConfigResponse {
  updatePricingConfig: {
    pricingConfig: {
      serviceFeePercentage: number;
      transportationRatePerLb: number;
      updatedAt: string;
    };
  };
}
