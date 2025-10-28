/**
 * Package interface matching backend GraphQL response
 */
export interface Package {
  id: string;
  barcode: string;
  description: string | null;
  createdAt: string;
}
