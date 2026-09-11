import { createConsolidationFormSchema } from "../consolidationFormSchema";

const schema = createConsolidationFormSchema((key) => key);

describe("createConsolidationFormSchema", () => {
  it("requires a description and applies defaults", () => {
    expect(
      schema.safeParse({ description: "" }).error?.issues[0]?.message
    ).toBe("descriptionRequired");

    const result = schema.parse({ description: "Box 1" });
    expect(result.extraAttributes).toEqual([]);
    expect(result.sendEmail).toBe(true);
  });

  it("caps extra attributes at five entries", () => {
    const entries = Array.from({ length: 6 }, (_, i) => ({
      key: `k${i}`,
      value: "1",
    }));
    expect(
      schema.safeParse({ description: "Box", extraAttributes: entries }).success
    ).toBe(false);
  });
});
