import { z } from "zod";

import { optionalPositiveDecimal } from "@/lib/validation/primitives/optionalPositiveDecimal";

type TranslationFn = (key: string) => string;

export interface PackageFormValues {
  clientId: string;
  barcode: string;
  courier: string;
  otherCourier: string;
  length: string;
  width: string;
  height: string;
  dimensionUnit: string;
  weight: string;
  weightUnit: string;
  isDocumentHolder: boolean;
  description: string;
  purchaseLink: string;
  purchasedByNarbox: boolean;
  realPrice: string;
  arrivalDate: string;
  comments: string;
}

export const EMPTY_PACKAGE_FORM: PackageFormValues = {
  clientId: "",
  barcode: "",
  courier: "",
  otherCourier: "",
  length: "",
  width: "",
  height: "",
  dimensionUnit: "cm",
  weight: "",
  weightUnit: "lb",
  isDocumentHolder: false,
  description: "",
  purchaseLink: "",
  purchasedByNarbox: false,
  realPrice: "",
  arrivalDate: "",
  comments: "",
};

export interface PackageFormSchemaOptions {
  /** "create" requires barcode/courier (and real price when purchased by NarBox). */
  mode: "create" | "update";
  /** Whether a client must be chosen in the form itself. */
  requireClient: boolean;
}

function isValidUrl(value: string): boolean {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

/** Package create/update form; numeric fields stay as text until mapped to variables. */
export function createPackageFormSchema(
  t: TranslationFn,
  { mode, requireClient }: PackageFormSchemaOptions
) {
  const positive = optionalPositiveDecimal(t("positiveNumberError"));

  return z
    .object({
      clientId: requireClient
        ? z.string().min(1, t("clientRequired"))
        : z.string(),
      barcode:
        mode === "create"
          ? z
              .string()
              .trim()
              .min(1, t("barcodeRequired"))
              .min(3, t("barcodeMinLength"))
          : z.string(),
      courier:
        mode === "create"
          ? z.string().trim().min(1, t("courierRequired"))
          : z.string(),
      otherCourier: z.string(),
      length: positive,
      width: positive,
      height: positive,
      dimensionUnit: z.string(),
      weight: z.string(),
      weightUnit: z.string(),
      isDocumentHolder: z.boolean(),
      description: z.string(),
      purchaseLink: z
        .string()
        .trim()
        .refine(
          (value) => value === "" || isValidUrl(value),
          t("invalidUrlError")
        ),
      purchasedByNarbox: z.boolean(),
      realPrice: positive,
      arrivalDate: z
        .string()
        .trim()
        .refine(
          (value) => value === "" || !Number.isNaN(new Date(value).getTime()),
          t("invalidDateError")
        ),
      comments: z.string(),
    })
    .superRefine((values, ctx) => {
      if (!values.isDocumentHolder) {
        const weight = values.weight.trim();
        if (!weight) {
          ctx.addIssue({
            code: "custom",
            path: ["weight"],
            message: t("weightRequired"),
          });
        } else {
          const parsed = Number.parseFloat(weight);
          if (!Number.isFinite(parsed) || parsed <= 0) {
            ctx.addIssue({
              code: "custom",
              path: ["weight"],
              message: t("positiveNumberError"),
            });
          }
        }
      }
      if (
        mode === "create" &&
        values.purchasedByNarbox &&
        !values.realPrice.trim()
      ) {
        ctx.addIssue({
          code: "custom",
          path: ["realPrice"],
          message: t("realPriceRequired"),
        });
      }
    }) satisfies z.ZodType<PackageFormValues, PackageFormValues>;
}
