"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useMutation } from "@apollo/client/react";
import { useTranslations } from "next-intl";
import { BaseDialog, DialogFooter } from "@/components/ui/base-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Pencil } from "lucide-react";
import {
  UPDATE_CLIENT,
  UpdateClientVariables,
  UpdateClientResponse,
} from "@/graphql/mutations/clients";
import { toast } from "sonner";

interface EditClientDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  client: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    extraEmail1: string | null;
    extraEmail2: string | null;
    identificationNumber: string | null;
    mobilePhoneNumber: string | null;
    phoneNumber: string | null;
    state: string | null;
    city: string | null;
    mainStreet: string | null;
    secondaryStreet: string | null;
    buildingNumber: string | null;
  } | null;
  onClientUpdated?: () => void | Promise<void>;
}

interface FormData {
  firstName: string;
  lastName: string;
  extraEmail1: string;
  extraEmail2: string;
  identificationNumber: string;
  mobilePhoneNumber: string;
  phoneNumber: string;
  state: string;
  city: string;
  mainStreet: string;
  secondaryStreet: string;
  buildingNumber: string;
}

interface ValidationErrors {
  [key: string]: string | undefined;
}

export function EditClientDialog({
  open,
  onOpenChange,
  client,
  onClientUpdated,
}: EditClientDialogProps) {
  const t = useTranslations("adminClients.editDialog");
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    extraEmail1: "",
    extraEmail2: "",
    identificationNumber: "",
    mobilePhoneNumber: "",
    phoneNumber: "",
    state: "",
    city: "",
    mainStreet: "",
    secondaryStreet: "",
    buildingNumber: "",
  });

  const [validationErrors, setValidationErrors] = useState<ValidationErrors>(
    {}
  );

  // Track the last processed client to avoid unnecessary re-renders
  const lastClientIdRef = useRef<string | null>(null);

  // Prefill form data when client changes
  // Using queueMicrotask to defer state update and avoid cascading renders
  useEffect(() => {
    if (client) {
      // Only update form if the client data has actually changed
      if (lastClientIdRef.current !== client.id) {
        lastClientIdRef.current = client.id;
        // Defer state update to avoid synchronous setState in effect
        queueMicrotask(() => {
          setFormData({
            firstName: client.firstName || "",
            lastName: client.lastName || "",
            extraEmail1: client.extraEmail1 || "",
            extraEmail2: client.extraEmail2 || "",
            identificationNumber: client.identificationNumber || "",
            mobilePhoneNumber: client.mobilePhoneNumber || "",
            phoneNumber: client.phoneNumber || "",
            state: client.state || "",
            city: client.city || "",
            mainStreet: client.mainStreet || "",
            secondaryStreet: client.secondaryStreet || "",
            buildingNumber: client.buildingNumber || "",
          });
          setValidationErrors({});
        });
      }
    }
  }, [client]);

  const [updateClient, { loading }] = useMutation<
    UpdateClientResponse,
    UpdateClientVariables
  >(UPDATE_CLIENT, {
    onCompleted: async (data) => {
      toast.success(t("successTitle"), {
        description: t("successDescription", {
          fullName: data.updateClient.client.fullName,
        }),
      });
      handleClose();
      // Trigger refresh with current filters/sort/pagination
      if (onClientUpdated) {
        await onClientUpdated();
      }
    },
    onError: (error) => {
      toast.error(t("errorTitle"), {
        description: t("errorDescription", { error: error.message }),
      });
    },
  });

  // Rule 5.7: Put interaction logic in event handlers with useCallback
  const handleClose = useCallback(() => {
    setValidationErrors({});
    onOpenChange(false);
  }, [onOpenChange]);

  const handleInputChange = useCallback(
    (field: keyof FormData, value: string) => {
      // Rule 5.9: Use functional setState updates
      setFormData((prev) => ({ ...prev, [field]: value }));
      // Clear validation error for this field
      setValidationErrors((prev) => ({ ...prev, [field]: undefined }));
    },
    []
  );

  const handlePhoneInputChange = useCallback(
    (field: keyof FormData, value: string) => {
      // Allow only numeric values
      const numericValue = value.replace(/\D/g, "");
      handleInputChange(field, numericValue);
    },
    [handleInputChange]
  );

  const validateForm = (): boolean => {
    const errors: ValidationErrors = {};

    // Required fields
    if (!formData.firstName.trim()) {
      errors.firstName = t("firstNameRequired");
    }
    if (!formData.lastName.trim()) {
      errors.lastName = t("lastNameRequired");
    }

    // Extra email validation (only if provided)
    if (
      formData.extraEmail1.trim() &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.extraEmail1.trim())
    ) {
      errors.extraEmail1 = t("extraEmail1Invalid");
    }
    if (
      formData.extraEmail2.trim() &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.extraEmail2.trim())
    ) {
      errors.extraEmail2 = t("extraEmail2Invalid");
    }

    // Phone number validation (numeric only if provided)
    if (
      formData.mobilePhoneNumber &&
      !/^\d+$/.test(formData.mobilePhoneNumber)
    ) {
      errors.mobilePhoneNumber = t("mobilePhoneInvalid");
    }
    if (formData.phoneNumber && !/^\d+$/.test(formData.phoneNumber)) {
      errors.phoneNumber = t("phoneNumberInvalid");
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!client || !validateForm()) {
      return;
    }

    // Prepare variables - only include fields that have values
    const variables: UpdateClientVariables = {
      id: client.id,
    };

    // Add fields only if they have values (trim strings)
    if (formData.firstName.trim()) {
      variables.firstName = formData.firstName.trim();
    }
    if (formData.lastName.trim()) {
      variables.lastName = formData.lastName.trim();
    }
    // Extra emails: always send (empty string clears the field per API)
    variables.extraEmail1 = formData.extraEmail1.trim();
    variables.extraEmail2 = formData.extraEmail2.trim();
    if (formData.identificationNumber.trim()) {
      variables.identificationNumber = formData.identificationNumber.trim();
    }
    if (formData.mobilePhoneNumber.trim()) {
      variables.mobilePhoneNumber = formData.mobilePhoneNumber.trim();
    }
    if (formData.phoneNumber.trim()) {
      variables.phoneNumber = formData.phoneNumber.trim();
    }
    if (formData.state.trim()) {
      variables.state = formData.state.trim();
    }
    if (formData.city.trim()) {
      variables.city = formData.city.trim();
    }
    if (formData.mainStreet.trim()) {
      variables.mainStreet = formData.mainStreet.trim();
    }
    if (formData.secondaryStreet.trim()) {
      variables.secondaryStreet = formData.secondaryStreet.trim();
    }
    if (formData.buildingNumber.trim()) {
      variables.buildingNumber = formData.buildingNumber.trim();
    }

    await updateClient({ variables }).catch(() => {});
  };

  if (!client) return null;

  return (
    <BaseDialog
      open={open}
      onOpenChange={onOpenChange}
      size="xl"
      title={t("title")}
      description={t("description")}
      icon={Pencil}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Information Section */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            {t("personalInfo")}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* First Name */}
            <div className="space-y-2">
              <Label htmlFor="firstName">
                {t("firstName")} <span className="text-destructive">*</span>
              </Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
                disabled={loading}
                aria-invalid={!!validationErrors.firstName}
                aria-describedby={
                  validationErrors.firstName ? "firstName-error" : undefined
                }
                placeholder={t("firstNamePlaceholder")}
              />
              {validationErrors.firstName && (
                <p
                  id="firstName-error"
                  className="text-sm text-destructive font-medium flex items-center gap-1"
                >
                  <span className="text-base">⚠</span>
                  {validationErrors.firstName}
                </p>
              )}
            </div>

            {/* Last Name */}
            <div className="space-y-2">
              <Label htmlFor="lastName">
                {t("lastName")} <span className="text-destructive">*</span>
              </Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
                disabled={loading}
                aria-invalid={!!validationErrors.lastName}
                aria-describedby={
                  validationErrors.lastName ? "lastName-error" : undefined
                }
                placeholder={t("lastNamePlaceholder")}
              />
              {validationErrors.lastName && (
                <p
                  id="lastName-error"
                  className="text-sm text-destructive font-medium flex items-center gap-1"
                >
                  <span className="text-base">⚠</span>
                  {validationErrors.lastName}
                </p>
              )}
            </div>

            {/* Email (Read-only) */}
            <div className="space-y-2">
              <Label htmlFor="email">{t("email")}</Label>
              <Input
                id="email"
                type="email"
                value={client.email}
                disabled
                readOnly
                className="bg-muted cursor-not-allowed"
                placeholder={t("emailPlaceholder")}
              />
              <p className="text-xs text-muted-foreground">
                {t("emailReadOnly")}
              </p>
            </div>

            {/* Identification Number */}
            <div className="space-y-2">
              <Label htmlFor="identificationNumber">
                {t("identificationNumber")}
              </Label>
              <Input
                id="identificationNumber"
                inputMode="numeric"
                value={formData.identificationNumber}
                onChange={(e) =>
                  handlePhoneInputChange("identificationNumber", e.target.value)
                }
                disabled={loading}
                placeholder={t("identificationNumberPlaceholder")}
              />
            </div>
          </div>
        </div>

        {/* Extra Emails Section */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            {t("extraEmailsSection")}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="extraEmail1">{t("extraEmail1")}</Label>
              <Input
                id="extraEmail1"
                type="email"
                value={formData.extraEmail1}
                onChange={(e) =>
                  handleInputChange("extraEmail1", e.target.value)
                }
                disabled={loading}
                aria-invalid={!!validationErrors.extraEmail1}
                aria-describedby={
                  validationErrors.extraEmail1 ? "extraEmail1-error" : undefined
                }
                placeholder={t("extraEmail1Placeholder")}
              />
              {validationErrors.extraEmail1 && (
                <p
                  id="extraEmail1-error"
                  className="text-sm text-destructive font-medium flex items-center gap-1"
                >
                  <span className="text-base">⚠</span>
                  {validationErrors.extraEmail1}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="extraEmail2">{t("extraEmail2")}</Label>
              <Input
                id="extraEmail2"
                type="email"
                value={formData.extraEmail2}
                onChange={(e) =>
                  handleInputChange("extraEmail2", e.target.value)
                }
                disabled={loading}
                aria-invalid={!!validationErrors.extraEmail2}
                aria-describedby={
                  validationErrors.extraEmail2 ? "extraEmail2-error" : undefined
                }
                placeholder={t("extraEmail2Placeholder")}
              />
              {validationErrors.extraEmail2 && (
                <p
                  id="extraEmail2-error"
                  className="text-sm text-destructive font-medium flex items-center gap-1"
                >
                  <span className="text-base">⚠</span>
                  {validationErrors.extraEmail2}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Contact Information Section */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            {t("contactInfo")}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Mobile Phone */}
            <div className="space-y-2">
              <Label htmlFor="mobilePhoneNumber">{t("mobilePhone")}</Label>
              <Input
                id="mobilePhoneNumber"
                type="tel"
                value={formData.mobilePhoneNumber}
                onChange={(e) =>
                  handlePhoneInputChange("mobilePhoneNumber", e.target.value)
                }
                disabled={loading}
                aria-invalid={!!validationErrors.mobilePhoneNumber}
                aria-describedby={
                  validationErrors.mobilePhoneNumber
                    ? "mobilePhoneNumber-error"
                    : undefined
                }
                placeholder={t("mobilePhonePlaceholder")}
              />
              {validationErrors.mobilePhoneNumber && (
                <p
                  id="mobilePhoneNumber-error"
                  className="text-sm text-destructive font-medium flex items-center gap-1"
                >
                  <span className="text-base">⚠</span>
                  {validationErrors.mobilePhoneNumber}
                </p>
              )}
            </div>

            {/* Phone Number */}
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">{t("phoneNumber")}</Label>
              <Input
                id="phoneNumber"
                type="tel"
                value={formData.phoneNumber}
                onChange={(e) =>
                  handlePhoneInputChange("phoneNumber", e.target.value)
                }
                disabled={loading}
                aria-invalid={!!validationErrors.phoneNumber}
                aria-describedby={
                  validationErrors.phoneNumber ? "phoneNumber-error" : undefined
                }
                placeholder={t("phoneNumberPlaceholder")}
              />
              {validationErrors.phoneNumber && (
                <p
                  id="phoneNumber-error"
                  className="text-sm text-destructive font-medium flex items-center gap-1"
                >
                  <span className="text-base">⚠</span>
                  {validationErrors.phoneNumber}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Address Information Section */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            {t("addressInfo")}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* State */}
            <div className="space-y-2">
              <Label htmlFor="state">{t("state")}</Label>
              <Input
                id="state"
                value={formData.state}
                onChange={(e) => handleInputChange("state", e.target.value)}
                disabled={loading}
                placeholder={t("statePlaceholder")}
              />
            </div>

            {/* City */}
            <div className="space-y-2">
              <Label htmlFor="city">{t("city")}</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => handleInputChange("city", e.target.value)}
                disabled={loading}
                placeholder={t("cityPlaceholder")}
              />
            </div>

            {/* Main Street */}
            <div className="space-y-2">
              <Label htmlFor="mainStreet">{t("mainStreet")}</Label>
              <Input
                id="mainStreet"
                value={formData.mainStreet}
                onChange={(e) =>
                  handleInputChange("mainStreet", e.target.value)
                }
                disabled={loading}
                placeholder={t("mainStreetPlaceholder")}
              />
            </div>

            {/* Secondary Street */}
            <div className="space-y-2">
              <Label htmlFor="secondaryStreet">{t("secondaryStreet")}</Label>
              <Input
                id="secondaryStreet"
                value={formData.secondaryStreet}
                onChange={(e) =>
                  handleInputChange("secondaryStreet", e.target.value)
                }
                disabled={loading}
                placeholder={t("secondaryStreetPlaceholder")}
              />
            </div>

            {/* Building Number */}
            <div className="space-y-2">
              <Label htmlFor="buildingNumber">{t("buildingNumber")}</Label>
              <Input
                id="buildingNumber"
                value={formData.buildingNumber}
                onChange={(e) =>
                  handleInputChange("buildingNumber", e.target.value)
                }
                disabled={loading}
                placeholder={t("buildingNumberPlaceholder")}
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={loading}
          >
            {t("cancel")}
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? (
              <>
                {/* Rule 6.1: Animate wrapper instead of icon */}
                <span className="mr-2 animate-spin">
                  <Loader2 className="h-4 w-4" />
                </span>
                {t("updating")}
              </>
            ) : (
              <>
                <Pencil className="mr-2 h-4 w-4" />
                {t("updateClient")}
              </>
            )}
          </Button>
        </DialogFooter>
      </form>
    </BaseDialog>
  );
}
