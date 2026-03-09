type TranslationFn = (key: string) => string;

export function getStatusLabel(t: TranslationFn, status: string): string {
  switch (status.toLowerCase()) {
    case "awaiting_payment":
      return t("statusAwaitingPayment");
    case "pending":
      return t("statusPending");
    case "processing":
      return t("statusProcessing");
    case "in_transit":
      return t("statusInTransit");
    case "delivered":
      return t("statusDelivered");
    case "cancelled":
      return t("statusCancelled");
    default:
      return status;
  }
}
