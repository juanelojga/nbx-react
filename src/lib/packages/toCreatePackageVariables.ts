import type { CreatePackageVariables } from "@/graphql/mutations/packages";
import type { PackageFormValues } from "@/lib/validation/packageFormSchema";

/** Weight used for document holders, which the backend prices at a flat rate. */
export const DOCUMENT_HOLDER_WEIGHT_LB = 0.5;

const parse = (value: string) => Number.parseFloat(value.trim());

/** Trim strings, parse decimals and drop empty optional fields. */
export function toCreatePackageVariables(
  values: PackageFormValues,
  clientId: string
): CreatePackageVariables {
  const variables: CreatePackageVariables = {
    barcode: values.barcode.trim(),
    courier: values.courier.trim(),
    clientId,
    weight: values.isDocumentHolder
      ? DOCUMENT_HOLDER_WEIGHT_LB
      : parse(values.weight),
    purchasedByNarbox: values.purchasedByNarbox,
  };

  if (values.otherCourier.trim())
    variables.otherCourier = values.otherCourier.trim();
  if (values.dimensionUnit.trim())
    variables.dimensionUnit = values.dimensionUnit.trim();
  variables.weightUnit = values.isDocumentHolder
    ? "lb"
    : values.weightUnit.trim() || undefined;
  if (values.description.trim())
    variables.description = values.description.trim();
  if (values.purchaseLink.trim())
    variables.purchaseLink = values.purchaseLink.trim();
  if (values.comments.trim()) variables.comments = values.comments.trim();
  if (values.length.trim()) variables.length = parse(values.length);
  if (values.width.trim()) variables.width = parse(values.width);
  if (values.height.trim()) variables.height = parse(values.height);
  if (values.realPrice.trim()) variables.realPrice = parse(values.realPrice);
  if (values.arrivalDate.trim())
    variables.arrivalDate = values.arrivalDate.trim();

  return variables;
}
