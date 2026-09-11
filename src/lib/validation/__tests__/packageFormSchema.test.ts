import {
  createPackageFormSchema,
  EMPTY_PACKAGE_FORM,
} from "../packageFormSchema";

const t = (key: string) => key;
const messages = (result: { error?: { issues: { message: string }[] } }) =>
  result.error?.issues.map((i) => i.message) ?? [];

describe("createPackageFormSchema", () => {
  const create = createPackageFormSchema(t, {
    mode: "create",
    requireClient: false,
  });
  const valid = {
    ...EMPTY_PACKAGE_FORM,
    barcode: "ABC123",
    courier: "FedEx",
    weight: "5",
  };

  it("requires barcode (min 3), courier and weight on create", () => {
    expect(messages(create.safeParse(EMPTY_PACKAGE_FORM))).toEqual(
      expect.arrayContaining([
        "barcodeRequired",
        "courierRequired",
        "weightRequired",
      ])
    );
    expect(messages(create.safeParse({ ...valid, barcode: "AB" }))).toContain(
      "barcodeMinLength"
    );
    expect(create.safeParse(valid).success).toBe(true);
  });

  it("does not require weight for document holders", () => {
    expect(
      create.safeParse({ ...valid, weight: "", isDocumentHolder: true }).success
    ).toBe(true);
  });

  it("requires a positive real price when purchased by NarBox (create only)", () => {
    expect(
      messages(create.safeParse({ ...valid, purchasedByNarbox: true }))
    ).toContain("realPriceRequired");
    expect(
      messages(
        create.safeParse({ ...valid, purchasedByNarbox: true, realPrice: "-1" })
      )
    ).toContain("positiveNumberError");
    const update = createPackageFormSchema(t, {
      mode: "update",
      requireClient: false,
    });
    expect(
      update.safeParse({ ...valid, purchasedByNarbox: true }).success
    ).toBe(true);
  });

  it("validates optional url, date and dimensions", () => {
    expect(
      messages(create.safeParse({ ...valid, purchaseLink: "not a url" }))
    ).toContain("invalidUrlError");
    expect(
      messages(create.safeParse({ ...valid, arrivalDate: "nope" }))
    ).toContain("invalidDateError");
    expect(messages(create.safeParse({ ...valid, length: "0" }))).toContain(
      "positiveNumberError"
    );
    expect(
      create.safeParse({
        ...valid,
        purchaseLink: "https://x.io",
        arrivalDate: "2024-06-01",
        length: "2.5",
      }).success
    ).toBe(true);
  });

  it("requires a client only when asked to", () => {
    const withClient = createPackageFormSchema(t, {
      mode: "create",
      requireClient: true,
    });
    expect(messages(withClient.safeParse(valid))).toContain("clientRequired");
    expect(withClient.safeParse({ ...valid, clientId: "c1" }).success).toBe(
      true
    );
  });
});
