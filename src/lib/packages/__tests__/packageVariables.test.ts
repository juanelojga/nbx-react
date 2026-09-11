import type { PackageDetailType } from "@/graphql/queries/packages";
import { EMPTY_PACKAGE_FORM } from "@/lib/validation/packageFormSchema";

import { toCreatePackageVariables } from "../toCreatePackageVariables";
import { toPackageFormValues } from "../toPackageFormValues";
import { toUpdatePackageVariables } from "../toUpdatePackageVariables";

const values = {
  ...EMPTY_PACKAGE_FORM,
  barcode: "ABC123",
  courier: "FedEx",
  weight: "5",
};

describe("package variable mappers", () => {
  it("builds create variables with defaults and parsed numbers", () => {
    expect(
      toCreatePackageVariables(
        { ...values, length: "10.5", realPrice: "" },
        "client-1"
      )
    ).toEqual({
      barcode: "ABC123",
      courier: "FedEx",
      clientId: "client-1",
      weight: 5,
      purchasedByNarbox: false,
      dimensionUnit: "cm",
      weightUnit: "lb",
      length: 10.5,
    });
  });

  it("uses the flat document-holder weight", () => {
    expect(
      toCreatePackageVariables(
        { ...values, weight: "", isDocumentHolder: true },
        "c"
      )
    ).toMatchObject({
      weight: 0.5,
      weightUnit: "lb",
    });
  });

  it("only includes the client on update when allowed", () => {
    const base = toUpdatePackageVariables(
      "42",
      { ...values, clientId: "c9" },
      { includeClient: false }
    );
    expect(base).toEqual({
      id: "42",
      courier: "FedEx",
      dimensionUnit: "cm",
      weightUnit: "lb",
      weight: 5,
      purchasedByNarbox: false,
    });
    expect(
      toUpdatePackageVariables(
        "42",
        { ...values, clientId: "c9" },
        { includeClient: true }
      ).clientId
    ).toBe("c9");
  });

  it("seeds form values from a fetched package", () => {
    const pkg = {
      id: "42",
      barcode: "PKG-1",
      courier: "DHL",
      otherCourier: null,
      length: 30,
      width: null,
      height: null,
      dimensionUnit: null,
      weight: 0.5,
      weightUnit: "lb",
      description: null,
      purchaseLink: null,
      purchasedByNarbox: true,
      realPrice: 100,
      servicePrice: null,
      transportationCost: null,
      serviceFee: null,
      arrivalDate: "2024-06-15T00:00:00Z",
      comments: null,
      client: { id: "c1", fullName: "Ana", email: "a@b.co" },
      createdAt: "",
      updatedAt: "",
    } satisfies PackageDetailType;

    expect(toPackageFormValues(pkg)).toMatchObject({
      clientId: "c1",
      barcode: "PKG-1",
      length: "30",
      width: "",
      dimensionUnit: "cm",
      isDocumentHolder: true,
      realPrice: "100",
      arrivalDate: "2024-06-15",
    });
  });
});
