/**
 * Package interface matching backend GraphQL response
 */
export interface Package {
  id: string;
  barcode: string;
  description: string | null;
  realPrice: number | null;
  servicePrice: number | null;
  weight: number | null;
  weightUnit: string | null;
  createdAt: string;
}
