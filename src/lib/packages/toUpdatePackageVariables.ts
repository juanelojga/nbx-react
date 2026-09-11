import type { UpdatePackageVariables } from "@/graphql/mutations/packages";
import { DOCUMENT_HOLDER_WEIGHT_LB } from "@/lib/packages/toCreatePackageVariables";
import type { PackageFormValues } from "@/lib/validation/packageFormSchema";

const parse = (value: string) => Number.parseFloat(value.trim());

/** Only non-empty fields are sent; `clientId` is included when the caller allows reassignment. */
export function toUpdatePackageVariables(
  id: string,
  values: PackageFormValues,
  { includeClient }: { includeClient: boolean }
): UpdatePackageVariables {
  const variables: UpdatePackageVariables = { id };

  if (values.courier.trim()) variables.courier = values.courier.trim();
  if (values.otherCourier.trim())
    variables.otherCourier = values.otherCourier.trim();
  if (values.dimensionUnit.trim())
    variables.dimensionUnit = values.dimensionUnit.trim();
  if (values.isDocumentHolder) {
    variables.weightUnit = "lb";
  } else if (values.weightUnit.trim()) {
    variables.weightUnit = values.weightUnit.trim();
  }
  if (values.description.trim())
    variables.description = values.description.trim();
  if (values.purchaseLink.trim())
    variables.purchaseLink = values.purchaseLink.trim();
  if (values.comments.trim()) variables.comments = values.comments.trim();
  if (values.length.trim()) variables.length = parse(values.length);
  if (values.width.trim()) variables.width = parse(values.width);
  if (values.height.trim()) variables.height = parse(values.height);
  if (values.isDocumentHolder) {
    variables.weight = DOCUMENT_HOLDER_WEIGHT_LB;
  } else if (values.weight.trim()) {
    variables.weight = parse(values.weight);
  }
  if (values.realPrice.trim()) variables.realPrice = parse(values.realPrice);
  variables.purchasedByNarbox = values.purchasedByNarbox;
  if (values.arrivalDate.trim())
    variables.arrivalDate = values.arrivalDate.trim();
  if (includeClient && values.clientId) variables.clientId = values.clientId;

  return variables;
}
