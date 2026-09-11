import type { PackageDetailType } from "@/graphql/queries/packages";
import { DOCUMENT_HOLDER_WEIGHT_LB } from "@/lib/packages/toCreatePackageVariables";
import type { PackageFormValues } from "@/lib/validation/packageFormSchema";

function toDateInputValue(value: string | null): string {
  if (!value) return "";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? ""
    : (date.toISOString().split("T")[0] ?? "");
}

/** Seed the edit form from a fetched package. */
export function toPackageFormValues(pkg: PackageDetailType): PackageFormValues {
  const weightUnit = pkg.weightUnit ?? "lb";
  return {
    clientId: pkg.client?.id ?? "",
    barcode: pkg.barcode,
    courier: pkg.courier ?? "",
    otherCourier: pkg.otherCourier ?? "",
    length: pkg.length?.toString() ?? "",
    width: pkg.width?.toString() ?? "",
    height: pkg.height?.toString() ?? "",
    dimensionUnit: pkg.dimensionUnit ?? "cm",
    weight: pkg.weight?.toString() ?? "",
    weightUnit,
    isDocumentHolder:
      pkg.weight === DOCUMENT_HOLDER_WEIGHT_LB && weightUnit === "lb",
    description: pkg.description ?? "",
    purchaseLink: pkg.purchaseLink ?? "",
    purchasedByNarbox: pkg.purchasedByNarbox ?? false,
    realPrice: pkg.realPrice?.toString() ?? "",
    arrivalDate: toDateInputValue(pkg.arrivalDate),
    comments: pkg.comments ?? "",
  };
}
