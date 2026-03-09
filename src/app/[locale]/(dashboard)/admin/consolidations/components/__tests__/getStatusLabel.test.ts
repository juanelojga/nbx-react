import { getStatusLabel } from "../getStatusLabel";

const mockT = (key: string) => key;

describe("getStatusLabel", () => {
  it("maps awaiting_payment status", () => {
    expect(getStatusLabel(mockT, "awaiting_payment")).toBe(
      "statusAwaitingPayment"
    );
  });

  it("maps pending status", () => {
    expect(getStatusLabel(mockT, "pending")).toBe("statusPending");
  });

  it("maps processing status", () => {
    expect(getStatusLabel(mockT, "processing")).toBe("statusProcessing");
  });

  it("maps in_transit status", () => {
    expect(getStatusLabel(mockT, "in_transit")).toBe("statusInTransit");
  });

  it("maps delivered status", () => {
    expect(getStatusLabel(mockT, "delivered")).toBe("statusDelivered");
  });

  it("maps cancelled status", () => {
    expect(getStatusLabel(mockT, "cancelled")).toBe("statusCancelled");
  });

  it("handles case-insensitive input", () => {
    expect(getStatusLabel(mockT, "PENDING")).toBe("statusPending");
    expect(getStatusLabel(mockT, "In_Transit")).toBe("statusInTransit");
  });

  it("returns raw status for unknown values", () => {
    expect(getStatusLabel(mockT, "unknown_status")).toBe("unknown_status");
  });
});
