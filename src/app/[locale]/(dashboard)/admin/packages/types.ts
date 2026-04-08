/**
 * Package interface matching backend GraphQL response
 */
export interface Package {
  id: string;
  barcode: string;
  description: string | null;
  purchasedByNarbox: boolean;
  realPrice: number | null;
  servicePrice: number | null;
  transportationCost: number | null;
  serviceFee: number | null;
  weight: number | null;
  weightUnit: string | null;
  createdAt: string;
}
