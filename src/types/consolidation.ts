/**
 * Consolidation lifecycle as defined by the backend.
 * awaiting_payment → pending → processing → in_transit → delivered
 * Any non-final status may transition to cancelled.
 */
export type ConsolidationStatus =
  | "awaiting_payment"
  | "pending"
  | "processing"
  | "in_transit"
  | "delivered"
  | "cancelled";
