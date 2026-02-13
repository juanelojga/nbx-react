"use client";

import { useState, useEffect, useRef } from "react";
import { useMutation, useQuery } from "@apollo/client";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Pencil, AlertCircle } from "lucide-react";
import {
  UPDATE_PACKAGE,
  UpdatePackageVariables,
  UpdatePackageResponse,
} from "@/graphql/mutations/packages";
import {
  GET_PACKAGE,
  GetPackageResponse,
  GetPackageVariables,
} from "@/graphql/queries/packages";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface UpdatePackageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  packageId: string | null;
  onPackageUpdated?: () => void | Promise<void>;
}

interface FormData {
  courier: string;
  otherCourier: string;
  length: string;
  width: string;
  height: string;
  dimensionUnit: string;
  weight: string;
  weightUnit: string;
  description: string;
  purchaseLink: string;
  realPrice: string;
  servicePrice: string;
  arrivalDate: string;
  comments: string;
}

interface ValidationErrors {
  [key: string]: string | undefined;
}

export function UpdatePackageDialog({
  open,
  onOpenChange,
  packageId,
  onPackageUpdated,
}: UpdatePackageDialogProps) {
  const t = useTranslations("adminPackages.editDialog");
  const [formData, setFormData] = useState<FormData>({
    courier: "",
    otherCourier: "",
    length: "",
    width: "",
    height: "",
    dimensionUnit: "cm",
    weight: "",
    weightUnit: "kg",
    description: "",
    purchaseLink: "",
    realPrice: "",
    servicePrice: "",
    arrivalDate: "",
    comments: "",
  });

  const [validationErrors, setValidationErrors] = useState<ValidationErrors>(
    {}
  );

  // Query to fetch package details
  const {
    data,
    loading: queryLoading,
    error: queryError,
  } = useQuery<GetPackageResponse, GetPackageVariables>(GET_PACKAGE, {
    variables: { id: parseInt(packageId || "0") },
    skip: !packageId || !open,
  });

  // Mutation to update package
  const [updatePackage, { loading: mutationLoading }] = useMutation<
    UpdatePackageResponse,
    UpdatePackageVariables
  >(UPDATE_PACKAGE, {
    onCompleted: async (data) => {
      toast.success(t("successTitle"), {
        description: t("successDescription", {
          barcode: data.updatePackage.package.barcode,
        }),
      });
      handleClose();
      // Trigger refresh
      if (onPackageUpdated) {
        await onPackageUpdated();
      }
    },
    onError: (error) => {
      toast.error(t("errorTitle"), {
        description: error.message,
      });
    },
  });

  // Track the last processed package to avoid unnecessary re-renders
  const lastPackageIdRef = useRef<string | null>(null);

  // Populate form with existing package data when data is loaded
  // Using queueMicrotask to defer state update and avoid cascading renders
  useEffect(() => {
    if (data?.package) {
      const pkg = data.package;
      // Only update form if the package data has actually changed
      if (lastPackageIdRef.current !== pkg.id) {
        lastPackageIdRef.current = pkg.id;

        // Helper to format date for input[type="date"]
        const formatDateForInput = (dateString: string | null) => {
          if (!dateString) return "";
          try {
            const date = new Date(dateString);
            return date.toISOString().split("T")[0];
          } catch {
            return "";
          }
        };

        // Defer state update to avoid synchronous setState in effect
        queueMicrotask(() => {
          setFormData({
            courier: pkg.courier || "",
            otherCourier: pkg.otherCourier || "",
            length: pkg.length?.toString() || "",
            width: pkg.width?.toString() || "",
            height: pkg.height?.toString() || "",
            dimensionUnit: pkg.dimensionUnit || "cm",
            weight: pkg.weight?.toString() || "",
            weightUnit: pkg.weightUnit || "kg",
            description: pkg.description || "",
            purchaseLink: pkg.purchaseLink || "",
            realPrice: pkg.realPrice?.toString() || "",
            servicePrice: pkg.servicePrice?.toString() || "",
            arrivalDate: formatDateForInput(pkg.arrivalDate),
            comments: pkg.comments || "",
          });
        });
      }
    }
  }, [data]);

  const handleClose = () => {
    setFormData({
      courier: "",
      otherCourier: "",
      length: "",
      width: "",
      height: "",
      dimensionUnit: "cm",
      weight: "",
      weightUnit: "kg",
      description: "",
      purchaseLink: "",
      realPrice: "",
      servicePrice: "",
      arrivalDate: "",
      comments: "",
    });
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

  const validateForm = (): boolean => {
    const errors: ValidationErrors = {};

    // Optional: Numeric fields must be > 0 if provided
    const numericFields = [
      { key: "length", label: "Length" },
      { key: "width", label: "Width" },
      { key: "height", label: "Height" },
      { key: "weight", label: "Weight" },
      { key: "realPrice", label: "Real price" },
      { key: "servicePrice", label: "Service price" },
    ];

    numericFields.forEach(({ key }) => {
      const value = formData[key as keyof FormData].trim();
      if (value) {
        const numValue = parseFloat(value);
        if (isNaN(numValue) || numValue <= 0) {
          errors[key] = t("positiveNumberError");
        }
      }
    });

    // Optional: Purchase link must be valid URL if provided
    if (formData.purchaseLink.trim()) {
      try {
        new URL(formData.purchaseLink.trim());
      } catch {
        errors.purchaseLink = t("invalidUrlError");
      }
    }

    // Optional: Arrival date must be valid date if provided
    if (formData.arrivalDate.trim()) {
      const dateValue = new Date(formData.arrivalDate.trim());
      if (isNaN(dateValue.getTime())) {
        errors.arrivalDate = t("invalidDateError");
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm() || !packageId) {
      return;
    }

    // Prepare variables - only include non-empty optional fields
    const variables: UpdatePackageVariables = {
      id: packageId,
    };

    // Add optional string fields
    if (formData.courier.trim()) {
      variables.courier = formData.courier.trim();
    }
    if (formData.otherCourier.trim()) {
      variables.otherCourier = formData.otherCourier.trim();
    }
    if (formData.dimensionUnit.trim()) {
      variables.dimensionUnit = formData.dimensionUnit.trim();
    }
    if (formData.weightUnit.trim()) {
      variables.weightUnit = formData.weightUnit.trim();
    }
    if (formData.description.trim()) {
      variables.description = formData.description.trim();
    }
    if (formData.purchaseLink.trim()) {
      variables.purchaseLink = formData.purchaseLink.trim();
    }
    if (formData.comments.trim()) {
      variables.comments = formData.comments.trim();
    }

    // Add optional numeric fields
    if (formData.length.trim()) {
      variables.length = parseFloat(formData.length.trim());
    }
    if (formData.width.trim()) {
      variables.width = parseFloat(formData.width.trim());
    }
    if (formData.height.trim()) {
      variables.height = parseFloat(formData.height.trim());
    }
    if (formData.weight.trim()) {
      variables.weight = parseFloat(formData.weight.trim());
    }
    if (formData.realPrice.trim()) {
      variables.realPrice = parseFloat(formData.realPrice.trim());
    }
    if (formData.servicePrice.trim()) {
      variables.servicePrice = parseFloat(formData.servicePrice.trim());
    }

    // Add arrival date if provided
    if (formData.arrivalDate.trim()) {
      variables.arrivalDate = formData.arrivalDate.trim();
    }

    await updatePackage({ variables });
  };

  const isLoading = queryLoading || mutationLoading;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Pencil className="h-6 w-6" />
            {t("title")}
          </DialogTitle>
          <DialogDescription>{t("description")}</DialogDescription>
        </DialogHeader>

        {/* Loading State */}
        {queryLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">{t("loading")}</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {queryError && !queryLoading && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{t("loadError")}</AlertDescription>
          </Alert>
        )}

        {/* Form */}
        {data?.package && !queryLoading && (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Barcode (Read-only) */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                {t("identificationTitle")}
              </h3>
              <div className="space-y-2">
                <Label htmlFor="barcode-readonly">{t("barcodeLabel")}</Label>
                <Input
                  id="barcode-readonly"
                  value={data.package.barcode}
                  disabled
                  className="bg-muted cursor-not-allowed"
                />
                <p className="text-xs text-muted-foreground">
                  {t("barcodeHelper")}
                </p>
              </div>
            </div>

            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                {t("basicInfoTitle")}
              </h3>
              <div className="space-y-2">
                <Label htmlFor="description">{t("descriptionLabel")}</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  disabled={isLoading}
                  placeholder={t("descriptionPlaceholder")}
                />
              </div>
            </div>

            {/* Courier Information */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                {t("courierInfoTitle")}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Courier */}
                <div className="space-y-2">
                  <Label htmlFor="courier">{t("courierLabel")}</Label>
                  <Input
                    id="courier"
                    value={formData.courier}
                    onChange={(e) =>
                      handleInputChange("courier", e.target.value)
                    }
                    disabled={isLoading}
                    placeholder={t("courierPlaceholder")}
                  />
                </div>

                {/* Other Courier */}
                <div className="space-y-2">
                  <Label htmlFor="otherCourier">{t("otherCourierLabel")}</Label>
                  <Input
                    id="otherCourier"
                    value={formData.otherCourier}
                    onChange={(e) =>
                      handleInputChange("otherCourier", e.target.value)
                    }
                    disabled={isLoading}
                    placeholder={t("otherCourierPlaceholder")}
                  />
                </div>
              </div>
            </div>

            {/* Dimensions */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                {t("dimensionsTitle")}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Length */}
                <div className="space-y-2">
                  <Label htmlFor="length">{t("lengthLabel")}</Label>
                  <Input
                    id="length"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.length}
                    onChange={(e) =>
                      handleInputChange("length", e.target.value)
                    }
                    disabled={isLoading}
                    aria-invalid={!!validationErrors.length}
                    placeholder={t("dimensionPlaceholder")}
                  />
                  {validationErrors.length && (
                    <p className="text-sm text-destructive font-medium flex items-center gap-1">
                      <span className="text-base">⚠</span>
                      {validationErrors.length}
                    </p>
                  )}
                </div>

                {/* Width */}
                <div className="space-y-2">
                  <Label htmlFor="width">{t("widthLabel")}</Label>
                  <Input
                    id="width"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.width}
                    onChange={(e) => handleInputChange("width", e.target.value)}
                    disabled={isLoading}
                    aria-invalid={!!validationErrors.width}
                    placeholder={t("dimensionPlaceholder")}
                  />
                  {validationErrors.width && (
                    <p className="text-sm text-destructive font-medium flex items-center gap-1">
                      <span className="text-base">⚠</span>
                      {validationErrors.width}
                    </p>
                  )}
                </div>

                {/* Height */}
                <div className="space-y-2">
                  <Label htmlFor="height">{t("heightLabel")}</Label>
                  <Input
                    id="height"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.height}
                    onChange={(e) =>
                      handleInputChange("height", e.target.value)
                    }
                    disabled={isLoading}
                    aria-invalid={!!validationErrors.height}
                    placeholder={t("dimensionPlaceholder")}
                  />
                  {validationErrors.height && (
                    <p className="text-sm text-destructive font-medium flex items-center gap-1">
                      <span className="text-base">⚠</span>
                      {validationErrors.height}
                    </p>
                  )}
                </div>

                {/* Dimension Unit */}
                <div className="space-y-2">
                  <Label htmlFor="dimensionUnit">{t("unitLabel")}</Label>
                  <Select
                    value={formData.dimensionUnit}
                    onValueChange={(value) =>
                      handleInputChange("dimensionUnit", value)
                    }
                    disabled={isLoading}
                  >
                    <SelectTrigger id="dimensionUnit" className="w-full">
                      <SelectValue placeholder={t("unitPlaceholder")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cm">{t("unitCm")}</SelectItem>
                      <SelectItem value="in">{t("unitIn")}</SelectItem>
                      <SelectItem value="m">{t("unitM")}</SelectItem>
                      <SelectItem value="ft">{t("unitFt")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Weight */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                {t("weightTitle")}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Weight Value */}
                <div className="space-y-2">
                  <Label htmlFor="weight">{t("weightLabel")}</Label>
                  <Input
                    id="weight"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.weight}
                    onChange={(e) =>
                      handleInputChange("weight", e.target.value)
                    }
                    disabled={isLoading}
                    aria-invalid={!!validationErrors.weight}
                    placeholder={t("weightPlaceholder")}
                  />
                  {validationErrors.weight && (
                    <p className="text-sm text-destructive font-medium flex items-center gap-1">
                      <span className="text-base">⚠</span>
                      {validationErrors.weight}
                    </p>
                  )}
                </div>

                {/* Weight Unit */}
                <div className="space-y-2">
                  <Label htmlFor="weightUnit">{t("unitLabel")}</Label>
                  <Select
                    value={formData.weightUnit}
                    onValueChange={(value) =>
                      handleInputChange("weightUnit", value)
                    }
                    disabled={isLoading}
                  >
                    <SelectTrigger id="weightUnit" className="w-full">
                      <SelectValue placeholder={t("unitPlaceholder")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="kg">{t("unitKg")}</SelectItem>
                      <SelectItem value="lb">{t("unitLb")}</SelectItem>
                      <SelectItem value="g">{t("unitG")}</SelectItem>
                      <SelectItem value="oz">{t("unitOz")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                {t("pricingTitle")}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Real Price */}
                <div className="space-y-2">
                  <Label htmlFor="realPrice">{t("realPriceLabel")}</Label>
                  <Input
                    id="realPrice"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.realPrice}
                    onChange={(e) =>
                      handleInputChange("realPrice", e.target.value)
                    }
                    disabled={isLoading}
                    aria-invalid={!!validationErrors.realPrice}
                    placeholder={t("dimensionPlaceholder")}
                  />
                  {validationErrors.realPrice && (
                    <p className="text-sm text-destructive font-medium flex items-center gap-1">
                      <span className="text-base">⚠</span>
                      {validationErrors.realPrice}
                    </p>
                  )}
                </div>

                {/* Service Price */}
                <div className="space-y-2">
                  <Label htmlFor="servicePrice">{t("servicePriceLabel")}</Label>
                  <Input
                    id="servicePrice"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.servicePrice}
                    onChange={(e) =>
                      handleInputChange("servicePrice", e.target.value)
                    }
                    disabled={isLoading}
                    aria-invalid={!!validationErrors.servicePrice}
                    placeholder={t("dimensionPlaceholder")}
                  />
                  {validationErrors.servicePrice && (
                    <p className="text-sm text-destructive font-medium flex items-center gap-1">
                      <span className="text-base">⚠</span>
                      {validationErrors.servicePrice}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Additional Details */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                {t("additionalDetailsTitle")}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Purchase Link */}
                <div className="space-y-2">
                  <Label htmlFor="purchaseLink">{t("purchaseLinkLabel")}</Label>
                  <Input
                    id="purchaseLink"
                    type="url"
                    value={formData.purchaseLink}
                    onChange={(e) =>
                      handleInputChange("purchaseLink", e.target.value)
                    }
                    disabled={isLoading}
                    aria-invalid={!!validationErrors.purchaseLink}
                    placeholder={t("purchaseLinkPlaceholder")}
                  />
                  {validationErrors.purchaseLink && (
                    <p className="text-sm text-destructive font-medium flex items-center gap-1">
                      <span className="text-base">⚠</span>
                      {validationErrors.purchaseLink}
                    </p>
                  )}
                </div>

                {/* Arrival Date */}
                <div className="space-y-2">
                  <Label htmlFor="arrivalDate">{t("arrivalDateLabel")}</Label>
                  <Input
                    id="arrivalDate"
                    type="date"
                    value={formData.arrivalDate}
                    onChange={(e) =>
                      handleInputChange("arrivalDate", e.target.value)
                    }
                    disabled={isLoading}
                    aria-invalid={!!validationErrors.arrivalDate}
                  />
                  {validationErrors.arrivalDate && (
                    <p className="text-sm text-destructive font-medium flex items-center gap-1">
                      <span className="text-base">⚠</span>
                      {validationErrors.arrivalDate}
                    </p>
                  )}
                </div>
              </div>

              {/* Comments */}
              <div className="space-y-2">
                <Label htmlFor="comments">{t("commentsLabel")}</Label>
                <Textarea
                  id="comments"
                  value={formData.comments}
                  onChange={(e) =>
                    handleInputChange("comments", e.target.value)
                  }
                  disabled={isLoading}
                  placeholder={t("commentsPlaceholder")}
                  rows={3}
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={mutationLoading}
              >
                {t("cancel")}
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t("updating")}
                  </>
                ) : (
                  <>
                    <Pencil className="mr-2 h-4 w-4" />
                    {t("updateButton")}
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
