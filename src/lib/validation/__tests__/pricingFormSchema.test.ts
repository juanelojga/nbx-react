import { createPricingFormSchema } from "../pricingFormSchema";

const t = (key: string) => key;
const schema = createPricingFormSchema(t);

describe("createPricingFormSchema", () => {
  it("accepts a non-negative rate and a fraction between 0 and 1", () => {
    expect(
      schema.safeParse({
        transportationRatePerLb: "2.75",
        serviceFeePercentage: "0.10",
      }).success
    ).toBe(true);
    expect(
      schema.safeParse({
        transportationRatePerLb: "0",
        serviceFeePercentage: "1",
      }).success
    ).toBe(true);
  });

  it("rejects negatives, out-of-range fees and blanks", () => {
    expect(
      schema.safeParse({
        transportationRatePerLb: "-1",
        serviceFeePercentage: "0.1",
      }).error?.issues[0]?.message
    ).toBe("transportationRateInvalid");
    expect(
      schema.safeParse({
        transportationRatePerLb: "1",
        serviceFeePercentage: "101",
      }).error?.issues[0]?.message
    ).toBe("serviceFeePercentageInvalid");
    expect(
      schema.safeParse({
        transportationRatePerLb: "",
        serviceFeePercentage: "",
      }).success
    ).toBe(false);
  });
});
