/**
 * Consolidation Status Validation
 *
 * Validates status transitions for consolidations according to the business workflow:
 * awaiting_payment → pending → processing → in_transit → delivered
 *         ↓              ↓           ↓            ↓
 *     cancelled      cancelled   cancelled    cancelled
 */

export type ConsolidationStatus =
  | "awaiting_payment"
  | "pending"
  | "processing"
  | "in_transit"
  | "delivered"
  | "cancelled";

export const STATUS_LABELS: Record<ConsolidationStatus, string> = {
  awaiting_payment: "Awaiting Payment",
  pending: "Pending",
  processing: "Processing",
  in_transit: "In Transit",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export const STATUS_COLORS: Record<ConsolidationStatus, string> = {
  awaiting_payment: "bg-yellow-500",
  pending: "bg-blue-500",
  processing: "bg-purple-500",
  in_transit: "bg-orange-500",
  delivered: "bg-green-500",
  cancelled: "bg-red-500",
};

/**
 * Valid status transitions according to business rules
 */
const VALID_TRANSITIONS: Record<ConsolidationStatus, ConsolidationStatus[]> = {
  awaiting_payment: ["pending", "cancelled"],
  pending: ["processing", "cancelled"],
  processing: ["in_transit", "cancelled"],
  in_transit: ["delivered", "cancelled"],
  delivered: [],
  cancelled: [],
};

/**
 * Check if a status transition is valid
 * @param current - Current status
 * @param next - Desired next status
 * @returns boolean indicating if the transition is allowed
 */
export function isValidStatusTransition(
  current: ConsolidationStatus,
  next: ConsolidationStatus
): boolean {
  if (current === next) return true;
  return VALID_TRANSITIONS[current]?.includes(next) ?? false;
}

/**
 * Get list of allowed next statuses from current status
 * @param current - Current status
 * @returns Array of valid next statuses
 */
export function getAllowedNextStatuses(
  current: ConsolidationStatus
): ConsolidationStatus[] {
  return VALID_TRANSITIONS[current] ?? [];
}

/**
 * Check if status is a final state (no further transitions allowed)
 * @param status - Status to check
 * @returns boolean indicating if status is final
 */
export function isFinalStatus(status: ConsolidationStatus): boolean {
  return status === "delivered" || status === "cancelled";
}

/**
 * Get validation error message for invalid transition
 * @param current - Current status
 * @param attempted - Attempted next status
 * @returns Error message string
 */
export function getStatusTransitionError(
  current: ConsolidationStatus,
  attempted: ConsolidationStatus
): string {
  if (isFinalStatus(current)) {
    return `Cannot change status from "${STATUS_LABELS[current]}" as it is a final state`;
  }

  const allowed = getAllowedNextStatuses(current);
  const allowedLabels = allowed.map((s) => STATUS_LABELS[s]).join(", ");

  return `Invalid status transition from "${STATUS_LABELS[current]}" to "${STATUS_LABELS[attempted]}". Allowed transitions: ${allowedLabels || "none"}`;
}
