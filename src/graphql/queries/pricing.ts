import { gql } from "@apollo/client";

/**
 * Get pricing configuration (superuser-only)
 */
export const GET_PRICING_CONFIG = gql`
  query GetPricingConfig {
    pricingConfig {
      serviceFeePercentage
      transportationRatePerLb
      updatedAt
    }
  }
`;

/**
 * TypeScript types for pricing config query
 */
export interface PricingConfigType {
  serviceFeePercentage: number;
  transportationRatePerLb: number;
  updatedAt: string;
}

export interface GetPricingConfigResponse {
  pricingConfig: PricingConfigType;
}
