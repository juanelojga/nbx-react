import { validateDateRange } from "../consolidationFilters";

jest.mock("@/lib/date/todayISO", () => ({
  todayISO: () => "2024-05-10",
  isValidISODate: (value: string) => /^\d{4}-\d{2}-\d{2}$/.test(value),
}));

describe("validateDateRange", () => {
  it("accepts empty and ordered past ranges", () => {
    expect(validateDateRange("", "")).toBeNull();
    expect(validateDateRange("2024-05-01", "2024-05-09")).toBeNull();
    expect(validateDateRange("2024-05-10", "")).toBeNull();
  });

  it("flags malformed, future and inverted ranges", () => {
    expect(validateDateRange("nope", "")).toBe("invalidDate");
    expect(validateDateRange("", "2024-13-40x")).toBe("invalidDate");
    expect(validateDateRange("2024-05-11", "")).toBe("futureDate");
    expect(validateDateRange("2024-05-09", "2024-05-01")).toBe(
      "invalidDateRange"
    );
  });
});
