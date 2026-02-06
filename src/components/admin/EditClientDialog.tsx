"use client";

import { useState, useEffect, useRef } from "react";
import { useMutation } from "@apollo/client";
import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
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

  const handleClose = () => {
    setValidationErrors({});
    onOpenChange(false);
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear validation error for this field
    if (validationErrors[field]) {
      setValidationErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handlePhoneInputChange = (field: keyof FormData, value: string) => {
    // Allow only numeric values
    const numericValue = value.replace(/\D/g, "");
    handleInputChange(field, numericValue);
  };

  const validateForm = (): boolean => {
    const errors: ValidationErrors = {};

    // Required fields
    if (!formData.firstName.trim()) {
      errors.firstName = t("firstNameRequired");
    }
    if (!formData.lastName.trim()) {
      errors.lastName = t("lastNameRequired");
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

    await updateClient({ variables });
  };

  if (!client) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Pencil className="h-6 w-6" />
            {t("title")}
          </DialogTitle>
          <DialogDescription>{t("description")}</DialogDescription>
        </DialogHeader>

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
                  onChange={(e) =>
                    handleInputChange("firstName", e.target.value)
                  }
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
                  onChange={(e) =>
                    handleInputChange("lastName", e.target.value)
                  }
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
                  value={formData.identificationNumber}
                  onChange={(e) =>
                    handleInputChange("identificationNumber", e.target.value)
                  }
                  disabled={loading}
                  placeholder={t("identificationNumberPlaceholder")}
                />
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
                    validationErrors.phoneNumber
                      ? "phoneNumber-error"
                      : undefined
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
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
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
      </DialogContent>
    </Dialog>
  );
}
