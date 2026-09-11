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

/** One extra charge line on a consolidation (name → amount as entered). */
export interface ExtraAttributeEntry {
  key: string;
  value: string;
}
