"use client";

import { useTranslations } from "next-intl";
import type { UseFormReturn } from "react-hook-form";

import { FormFieldWrapper } from "@/components/common/FormFieldWrapper";
import { Input } from "@/components/ui/input";
import type { ClientFormValues } from "@/lib/validation/clientFormSchema";

interface ClientFormFieldsProps {
  form: UseFormReturn<ClientFormValues>;
  /** Translation namespace holding the field labels (add or edit dialog). */
  namespace: "adminClients.addDialog" | "adminClients.editDialog";
  disabled?: boolean;
  /** Existing clients cannot change their email. */
  emailReadOnly?: boolean;
}

const DIGITS_ONLY = /\D/g;

/** The shared client fields used by both the create and edit dialogs. */
export function ClientFormFields({
  form,
  namespace,
  disabled = false,
  emailReadOnly = false,
}: ClientFormFieldsProps) {
  const t = useTranslations(namespace);
  const {
    register,
    formState: { errors },
  } = form;

  const sectionTitle = (text: string) => (
    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
      {text}
    </h3>
  );

  const numeric = (name: keyof ClientFormValues) =>
    register(name, {
      setValueAs: (value: string) => value.replace(DIGITS_ONLY, ""),
    });

  return (
    <>
      <div className="space-y-4">
        {sectionTitle(t("personalInfo"))}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormFieldWrapper
            id="firstName"
            label={t("firstName")}
            required
            error={errors.firstName?.message}
          >
            {(field) => (
              <Input
                {...field}
                {...register("firstName")}
                disabled={disabled}
                placeholder={t("firstNamePlaceholder")}
              />
            )}
          </FormFieldWrapper>
          <FormFieldWrapper
            id="lastName"
            label={t("lastName")}
            required
            error={errors.lastName?.message}
          >
            {(field) => (
              <Input
                {...field}
                {...register("lastName")}
                disabled={disabled}
                placeholder={t("lastNamePlaceholder")}
              />
            )}
          </FormFieldWrapper>
          <FormFieldWrapper
            id="email"
            label={t("email")}
            required={!emailReadOnly}
            error={errors.email?.message}
            hint={emailReadOnly ? t("emailReadOnly") : undefined}
          >
            {(field) => (
              <Input
                {...field}
                {...register("email")}
                type="email"
                disabled={disabled || emailReadOnly}
                readOnly={emailReadOnly}
                className={emailReadOnly ? "bg-muted cursor-not-allowed" : ""}
                placeholder={t("emailPlaceholder")}
              />
            )}
          </FormFieldWrapper>
          <FormFieldWrapper
            id="identificationNumber"
            label={t("identificationNumber")}
            error={errors.identificationNumber?.message}
          >
            {(field) => (
              <Input
                {...field}
                {...numeric("identificationNumber")}
                inputMode="numeric"
                disabled={disabled}
                placeholder={t("identificationNumberPlaceholder")}
              />
            )}
          </FormFieldWrapper>
        </div>
      </div>

      <div className="space-y-4">
        {sectionTitle(t("extraEmailsSection"))}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(["extraEmail1", "extraEmail2"] as const).map((name) => (
            <FormFieldWrapper
              key={name}
              id={name}
              label={t(name)}
              error={errors[name]?.message}
            >
              {(field) => (
                <Input
                  {...field}
                  {...register(name)}
                  type="email"
                  disabled={disabled}
                  placeholder={t(`${name}Placeholder`)}
                />
              )}
            </FormFieldWrapper>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {sectionTitle(t("contactInfo"))}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormFieldWrapper
            id="mobilePhoneNumber"
            label={t("mobilePhone")}
            error={errors.mobilePhoneNumber?.message}
          >
            {(field) => (
              <Input
                {...field}
                {...numeric("mobilePhoneNumber")}
                type="tel"
                disabled={disabled}
                placeholder={t("mobilePhonePlaceholder")}
              />
            )}
          </FormFieldWrapper>
          <FormFieldWrapper
            id="phoneNumber"
            label={t("phoneNumber")}
            error={errors.phoneNumber?.message}
          >
            {(field) => (
              <Input
                {...field}
                {...numeric("phoneNumber")}
                type="tel"
                disabled={disabled}
                placeholder={t("phoneNumberPlaceholder")}
              />
            )}
          </FormFieldWrapper>
        </div>
      </div>

      <div className="space-y-4">
        {sectionTitle(t("addressInfo"))}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(
            [
              "state",
              "city",
              "mainStreet",
              "secondaryStreet",
              "buildingNumber",
            ] as const
          ).map((name) => (
            <FormFieldWrapper
              key={name}
              id={name}
              label={t(name)}
              error={errors[name]?.message}
            >
              {(field) => (
                <Input
                  {...field}
                  {...register(name)}
                  disabled={disabled}
                  placeholder={t(`${name}Placeholder`)}
                />
              )}
            </FormFieldWrapper>
          ))}
        </div>
      </div>
    </>
  );
}
