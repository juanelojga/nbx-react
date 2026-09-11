"use client";

import { useTranslations } from "next-intl";
import type { ReactNode } from "react";
import { Controller, type UseFormReturn } from "react-hook-form";

import { FormFieldWrapper } from "@/components/common/FormFieldWrapper";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { PackageFormValues } from "@/lib/validation/packageFormSchema";

const DIMENSION_UNITS = ["cm", "in", "m", "ft"] as const;
const WEIGHT_UNITS = ["kg", "lb", "g", "oz"] as const;

interface PackageFormFieldsProps {
  form: UseFormReturn<PackageFormValues>;
  namespace: "adminPackages.addDialog" | "adminPackages.editDialog";
  mode: "create" | "update";
  disabled?: boolean;
  /** Rendered above the fields (client autocomplete + its error). */
  clientSelector?: ReactNode;
  /** Server-computed amounts shown read-only in update mode. */
  computed?: {
    servicePrice: number | null;
    transportationCost: number | null;
    serviceFee: number | null;
  };
}

const money = (value: number | null) =>
  value != null ? `$${value.toFixed(2)}` : "—";

/** The shared package fields used by the create and update dialogs. */
export function PackageFormFields({
  form,
  namespace,
  mode,
  disabled = false,
  clientSelector,
  computed,
}: PackageFormFieldsProps) {
  const t = useTranslations(namespace);
  const {
    register,
    control,
    watch,
    setValue,
    formState: { errors },
  } = form;
  const isDocumentHolder = watch("isDocumentHolder");
  const purchasedByNarbox = watch("purchasedByNarbox");
  const barcode = watch("barcode");

  const sectionTitle = (text: string) => (
    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
      {text}
    </h3>
  );

  const decimalInput = (
    name: "length" | "width" | "height" | "weight" | "realPrice",
    placeholder: string,
    field: { id: string }
  ) => (
    <Input
      {...field}
      {...register(name)}
      type="number"
      step="0.01"
      min="0"
      disabled={disabled}
      placeholder={placeholder}
    />
  );

  return (
    <>
      {clientSelector}

      {mode === "update" && (
        <div className="space-y-4">
          {sectionTitle(t("identificationTitle"))}
          <FormFieldWrapper
            id="barcode-readonly"
            label={t("barcodeLabel")}
            hint={t("barcodeHelper")}
          >
            {(field) => (
              <Input
                {...field}
                value={barcode}
                disabled
                readOnly
                className="bg-muted cursor-not-allowed"
              />
            )}
          </FormFieldWrapper>
        </div>
      )}

      <div className="space-y-4">
        {sectionTitle(t("basicInfoTitle"))}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mode === "create" && (
            <FormFieldWrapper
              id="barcode"
              label={t("barcodeLabel")}
              required
              error={errors.barcode?.message}
            >
              {(field) => (
                <Input
                  {...field}
                  {...register("barcode")}
                  disabled={disabled}
                  placeholder={t("barcodePlaceholder")}
                />
              )}
            </FormFieldWrapper>
          )}
          <FormFieldWrapper
            id="description"
            label={t("descriptionLabel")}
            error={errors.description?.message}
          >
            {(field) => (
              <Input
                {...field}
                {...register("description")}
                disabled={disabled}
                placeholder={t("descriptionPlaceholder")}
              />
            )}
          </FormFieldWrapper>
        </div>
      </div>

      <div className="space-y-4">
        {sectionTitle(t("courierInfoTitle"))}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormFieldWrapper
            id="courier"
            label={t("courierLabel")}
            required={mode === "create"}
            error={errors.courier?.message}
          >
            {(field) => (
              <Input
                {...field}
                {...register("courier")}
                disabled={disabled}
                placeholder={t("courierPlaceholder")}
              />
            )}
          </FormFieldWrapper>
          <FormFieldWrapper
            id="otherCourier"
            label={t("otherCourierLabel")}
            error={errors.otherCourier?.message}
          >
            {(field) => (
              <Input
                {...field}
                {...register("otherCourier")}
                disabled={disabled}
                placeholder={t("otherCourierPlaceholder")}
              />
            )}
          </FormFieldWrapper>
        </div>
      </div>

      <div className="space-y-4">
        {sectionTitle(t("dimensionsTitle"))}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {(["length", "width", "height"] as const).map((name) => (
            <FormFieldWrapper
              key={name}
              id={name}
              label={t(`${name}Label`)}
              error={errors[name]?.message}
            >
              {(field) => decimalInput(name, t("dimensionPlaceholder"), field)}
            </FormFieldWrapper>
          ))}
          <div className="space-y-2">
            <Label htmlFor="dimensionUnit">{t("unitLabel")}</Label>
            <Controller
              control={control}
              name="dimensionUnit"
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={disabled}
                >
                  <SelectTrigger id="dimensionUnit" className="w-full">
                    <SelectValue placeholder={t("unitPlaceholder")} />
                  </SelectTrigger>
                  <SelectContent>
                    {DIMENSION_UNITS.map((unit) => (
                      <SelectItem key={unit} value={unit}>
                        {t(
                          `unit${unit.charAt(0).toUpperCase()}${unit.slice(1)}`
                        )}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {sectionTitle(t("weightTitle"))}
        <div className="flex items-start space-x-3">
          <Controller
            control={control}
            name="isDocumentHolder"
            render={({ field }) => (
              <Checkbox
                id="isDocumentHolder"
                checked={field.value}
                onCheckedChange={(checked) => {
                  const next = checked === true;
                  field.onChange(next);
                  if (next) {
                    setValue("weight", "", { shouldValidate: true });
                    setValue("weightUnit", "lb");
                  }
                }}
                disabled={disabled}
              />
            )}
          />
          <div className="grid gap-1 leading-none">
            <Label htmlFor="isDocumentHolder" className="cursor-pointer">
              {t("documentHolderLabel")}
            </Label>
            <p className="text-xs text-muted-foreground">
              {t("documentHolderDescription")}
            </p>
          </div>
        </div>

        {!isDocumentHolder && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormFieldWrapper
              id="weight"
              label={t("weightLabel")}
              required
              error={errors.weight?.message}
            >
              {(field) => decimalInput("weight", t("weightPlaceholder"), field)}
            </FormFieldWrapper>
            <div className="space-y-2">
              <Label htmlFor="weightUnit">{t("unitLabel")}</Label>
              <Controller
                control={control}
                name="weightUnit"
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={disabled}
                  >
                    <SelectTrigger id="weightUnit" className="w-full">
                      <SelectValue placeholder={t("unitPlaceholder")} />
                    </SelectTrigger>
                    <SelectContent>
                      {WEIGHT_UNITS.map((unit) => (
                        <SelectItem key={unit} value={unit}>
                          {t(
                            `unit${unit.charAt(0).toUpperCase()}${unit.slice(1)}`
                          )}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>
        )}
      </div>

      <div className="space-y-4">
        {sectionTitle(t("pricingTitle"))}
        <div className="flex items-start space-x-3">
          <Controller
            control={control}
            name="purchasedByNarbox"
            render={({ field }) => (
              <Checkbox
                id="purchasedByNarbox"
                checked={field.value}
                onCheckedChange={(checked) => field.onChange(checked === true)}
                disabled={disabled}
              />
            )}
          />
          <div className="grid gap-1 leading-none">
            <Label htmlFor="purchasedByNarbox" className="cursor-pointer">
              {t("purchasedByNarboxLabel")}
            </Label>
            <p className="text-xs text-muted-foreground">
              {t("purchasedByNarboxDescription")}
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormFieldWrapper
            id="realPrice"
            label={t("realPriceLabel")}
            required={mode === "create" && purchasedByNarbox}
            error={errors.realPrice?.message}
          >
            {(field) =>
              decimalInput("realPrice", t("dimensionPlaceholder"), field)
            }
          </FormFieldWrapper>
          {computed && (
            <>
              <FormFieldWrapper
                id="servicePrice-readonly"
                label={t("servicePriceLabel")}
              >
                {(field) => (
                  <Input
                    {...field}
                    value={money(computed.servicePrice)}
                    disabled
                    readOnly
                    className="bg-muted cursor-not-allowed"
                  />
                )}
              </FormFieldWrapper>
              <FormFieldWrapper
                id="transportationCost-readonly"
                label={t("transportationCostLabel")}
              >
                {(field) => (
                  <Input
                    {...field}
                    value={money(computed.transportationCost)}
                    disabled
                    readOnly
                    className="bg-muted cursor-not-allowed"
                  />
                )}
              </FormFieldWrapper>
              <FormFieldWrapper
                id="serviceFee-readonly"
                label={t("serviceFeeLabel")}
              >
                {(field) => (
                  <Input
                    {...field}
                    value={money(computed.serviceFee)}
                    disabled
                    readOnly
                    className="bg-muted cursor-not-allowed"
                  />
                )}
              </FormFieldWrapper>
            </>
          )}
        </div>
        {computed && (
          <p className="text-xs text-muted-foreground">
            {t("computedFieldsNote")}
          </p>
        )}
      </div>

      <div className="space-y-4">
        {sectionTitle(t("additionalDetailsTitle"))}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormFieldWrapper
            id="purchaseLink"
            label={t("purchaseLinkLabel")}
            error={errors.purchaseLink?.message}
          >
            {(field) => (
              <Input
                {...field}
                {...register("purchaseLink")}
                type="url"
                disabled={disabled}
                placeholder={t("purchaseLinkPlaceholder")}
              />
            )}
          </FormFieldWrapper>
          <FormFieldWrapper
            id="arrivalDate"
            label={t("arrivalDateLabel")}
            error={errors.arrivalDate?.message}
          >
            {(field) => (
              <Input
                {...field}
                {...register("arrivalDate")}
                type="date"
                disabled={disabled}
              />
            )}
          </FormFieldWrapper>
        </div>
        <FormFieldWrapper
          id="comments"
          label={t("commentsLabel")}
          error={errors.comments?.message}
        >
          {(field) => (
            <Textarea
              {...field}
              {...register("comments")}
              disabled={disabled}
              placeholder={t("commentsPlaceholder")}
              rows={3}
            />
          )}
        </FormFieldWrapper>
      </div>
    </>
  );
}
