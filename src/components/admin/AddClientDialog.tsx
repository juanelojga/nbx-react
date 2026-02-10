"use client";

import { useCallback, useState } from "react";
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
import { Loader2, UserPlus } from "lucide-react";
import {
  CREATE_CLIENT,
  CreateClientVariables,
  CreateClientResponse,
} from "@/graphql/mutations/clients";
import { toast } from "sonner";

interface AddClientDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onClientCreated?: () => void | Promise<void>;
}

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
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

// Rule 5.4: Extract default non-primitive values to constants
const INITIAL_FORM_DATA: FormData = {
  firstName: "",
  lastName: "",
  email: "",
  identificationNumber: "",
  mobilePhoneNumber: "",
  phoneNumber: "",
  state: "",
  city: "",
  mainStreet: "",
  secondaryStreet: "",
  buildingNumber: "",
};

export function AddClientDialog({
  open,
  onOpenChange,
  onClientCreated,
}: AddClientDialogProps) {
  const t = useTranslations("adminClients.addDialog");

  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA);

  const [validationErrors, setValidationErrors] = useState<ValidationErrors>(
    {}
  );

  const [createClient, { loading }] = useMutation<
    CreateClientResponse,
    CreateClientVariables
  >(CREATE_CLIENT, {
    onCompleted: async (data) => {
      toast.success(t("successTitle"), {
        description: t("successDescription", {
          fullName: data.createClient.client.fullName,
        }),
      });
      handleClose();
      // Trigger refresh with current filters/sort/pagination
      if (onClientCreated) {
        await onClientCreated();
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
    setFormData(INITIAL_FORM_DATA);
    setValidationErrors({});
    onOpenChange(false);
  }, [onOpenChange]);

  const handleInputChange = useCallback(
    (field: keyof FormData, value: string) => {
      // Rule 5.9: Use functional setState updates
      setFormData((prev) => ({ ...prev, [field]: value }));
      // Clear validation error for this field
      setValidationErrors((prev) => {
        if (prev[field]) {
          return { ...prev, [field]: undefined };
        }
        return prev;
      });
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

  const validateForm = useCallback((): boolean => {
    const errors: ValidationErrors = {};

    // Required fields
    if (!formData.firstName.trim()) {
      errors.firstName = t("firstNameRequired");
    }
    if (!formData.lastName.trim()) {
      errors.lastName = t("lastNameRequired");
    }
    if (!formData.email.trim()) {
      errors.email = t("emailRequired");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = t("emailInvalid");
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
  }, [formData, t]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!validateForm()) {
        return;
      }

      // Prepare variables - only include non-empty optional fields
      const variables: CreateClientVariables = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
      };

      // Add optional fields only if they have values
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

      await createClient({ variables });
    },
    [createClient, formData, validateForm]
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <UserPlus className="h-6 w-6" />
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

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">
                  {t("email")} <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  disabled={loading}
                  aria-invalid={!!validationErrors.email}
                  aria-describedby={
                    validationErrors.email ? "email-error" : undefined
                  }
                  placeholder={t("emailPlaceholder")}
                />
                {validationErrors.email && (
                  <p
                    id="email-error"
                    className="text-sm text-destructive font-medium flex items-center gap-1"
                  >
                    <span className="text-base">⚠</span>
                    {validationErrors.email}
                  </p>
                )}
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
                  {t("creating")}
                </>
              ) : (
                <>
                  <UserPlus className="mr-2 h-4 w-4" />
                  {t("createClient")}
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
