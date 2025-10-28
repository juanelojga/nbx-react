"use client";

import { useState } from "react";
import { useMutation } from "@apollo/client";
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
import { Loader2, Plus } from "lucide-react";
import {
  CREATE_PACKAGE,
  CreatePackageVariables,
  CreatePackageResponse,
} from "@/graphql/mutations/packages";
import { toast } from "sonner";

interface AddPackageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clientId: string;
  onPackageCreated?: () => void | Promise<void>;
}

interface FormData {
  barcode: string;
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

export function AddPackageDialog({
  open,
  onOpenChange,
  clientId,
  onPackageCreated,
}: AddPackageDialogProps) {
  const [formData, setFormData] = useState<FormData>({
    barcode: "",
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

  const [createPackage, { loading }] = useMutation<
    CreatePackageResponse,
    CreatePackageVariables
  >(CREATE_PACKAGE, {
    onCompleted: async (data) => {
      toast.success("Package created successfully", {
        description: `Package ${data.createPackage.package.barcode} has been created.`,
      });
      handleClose();
      // Trigger refresh
      if (onPackageCreated) {
        await onPackageCreated();
      }
    },
    onError: (error) => {
      toast.error("Failed to create package", {
        description: error.message,
      });
    },
  });

  const handleClose = () => {
    setFormData({
      barcode: "",
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

    // Required: Barcode (min length 3)
    if (!formData.barcode.trim()) {
      errors.barcode = "Barcode is required.";
    } else if (formData.barcode.trim().length < 3) {
      errors.barcode = "Barcode must be at least 3 characters.";
    }

    // Required: Courier
    if (!formData.courier.trim()) {
      errors.courier = "Courier is required.";
    }

    // Optional: Numeric fields must be > 0 if provided
    const numericFields = [
      { key: "length", label: "Length" },
      { key: "width", label: "Width" },
      { key: "height", label: "Height" },
      { key: "weight", label: "Weight" },
      { key: "realPrice", label: "Real price" },
      { key: "servicePrice", label: "Service price" },
    ];

    numericFields.forEach(({ key, label }) => {
      const value = formData[key as keyof FormData].trim();
      if (value) {
        const numValue = parseFloat(value);
        if (isNaN(numValue) || numValue <= 0) {
          errors[key] = "Must be a positive number.";
        }
      }
    });

    // Optional: Purchase link must be valid URL if provided
    if (formData.purchaseLink.trim()) {
      try {
        new URL(formData.purchaseLink.trim());
      } catch {
        errors.purchaseLink = "Must be a valid URL.";
      }
    }

    // Optional: Arrival date must be valid date if provided
    if (formData.arrivalDate.trim()) {
      const dateValue = new Date(formData.arrivalDate.trim());
      if (isNaN(dateValue.getTime())) {
        errors.arrivalDate = "Invalid date format.";
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Prepare variables - only include non-empty optional fields
    const variables: CreatePackageVariables = {
      barcode: formData.barcode.trim(),
      courier: formData.courier.trim(),
      clientId: clientId,
    };

    // Add optional string fields
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

    await createPackage({ variables });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Plus className="h-6 w-6" />
            Create New Package
          </DialogTitle>
          <DialogDescription>
            Fill in the details below to register a new package for this client.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Basic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Barcode */}
              <div className="space-y-2">
                <Label htmlFor="barcode">
                  Barcode <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="barcode"
                  value={formData.barcode}
                  onChange={(e) => handleInputChange("barcode", e.target.value)}
                  disabled={loading}
                  aria-invalid={!!validationErrors.barcode}
                  placeholder="Enter package barcode"
                />
                {validationErrors.barcode && (
                  <p className="text-sm text-destructive font-medium flex items-center gap-1">
                    <span className="text-base">⚠</span>
                    {validationErrors.barcode}
                  </p>
                )}
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  disabled={loading}
                  placeholder="Brief package description"
                />
              </div>
            </div>
          </div>

          {/* Courier Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Courier Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Courier */}
              <div className="space-y-2">
                <Label htmlFor="courier">
                  Courier <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="courier"
                  value={formData.courier}
                  onChange={(e) => handleInputChange("courier", e.target.value)}
                  disabled={loading}
                  aria-invalid={!!validationErrors.courier}
                  placeholder="e.g., FedEx, UPS, DHL"
                />
                {validationErrors.courier && (
                  <p className="text-sm text-destructive font-medium flex items-center gap-1">
                    <span className="text-base">⚠</span>
                    {validationErrors.courier}
                  </p>
                )}
              </div>

              {/* Other Courier */}
              <div className="space-y-2">
                <Label htmlFor="otherCourier">Other Courier</Label>
                <Input
                  id="otherCourier"
                  value={formData.otherCourier}
                  onChange={(e) =>
                    handleInputChange("otherCourier", e.target.value)
                  }
                  disabled={loading}
                  placeholder="Alternative courier name (optional)"
                />
              </div>
            </div>
          </div>

          {/* Dimensions */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Dimensions
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Length */}
              <div className="space-y-2">
                <Label htmlFor="length">Length</Label>
                <Input
                  id="length"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.length}
                  onChange={(e) => handleInputChange("length", e.target.value)}
                  disabled={loading}
                  aria-invalid={!!validationErrors.length}
                  placeholder="0.00"
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
                <Label htmlFor="width">Width</Label>
                <Input
                  id="width"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.width}
                  onChange={(e) => handleInputChange("width", e.target.value)}
                  disabled={loading}
                  aria-invalid={!!validationErrors.width}
                  placeholder="0.00"
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
                <Label htmlFor="height">Height</Label>
                <Input
                  id="height"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.height}
                  onChange={(e) => handleInputChange("height", e.target.value)}
                  disabled={loading}
                  aria-invalid={!!validationErrors.height}
                  placeholder="0.00"
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
                <Label htmlFor="dimensionUnit">Unit</Label>
                <Select
                  value={formData.dimensionUnit}
                  onValueChange={(value) =>
                    handleInputChange("dimensionUnit", value)
                  }
                  disabled={loading}
                >
                  <SelectTrigger id="dimensionUnit" className="w-full">
                    <SelectValue placeholder="Select unit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cm">cm</SelectItem>
                    <SelectItem value="in">in</SelectItem>
                    <SelectItem value="m">m</SelectItem>
                    <SelectItem value="ft">ft</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Weight */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Weight
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Weight Value */}
              <div className="space-y-2">
                <Label htmlFor="weight">Weight</Label>
                <Input
                  id="weight"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.weight}
                  onChange={(e) => handleInputChange("weight", e.target.value)}
                  disabled={loading}
                  aria-invalid={!!validationErrors.weight}
                  placeholder="0.00"
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
                <Label htmlFor="weightUnit">Unit</Label>
                <Select
                  value={formData.weightUnit}
                  onValueChange={(value) =>
                    handleInputChange("weightUnit", value)
                  }
                  disabled={loading}
                >
                  <SelectTrigger id="weightUnit" className="w-full">
                    <SelectValue placeholder="Select unit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="kg">kg</SelectItem>
                    <SelectItem value="lb">lb</SelectItem>
                    <SelectItem value="g">g</SelectItem>
                    <SelectItem value="oz">oz</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Pricing
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Real Price */}
              <div className="space-y-2">
                <Label htmlFor="realPrice">Real Price</Label>
                <Input
                  id="realPrice"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.realPrice}
                  onChange={(e) =>
                    handleInputChange("realPrice", e.target.value)
                  }
                  disabled={loading}
                  aria-invalid={!!validationErrors.realPrice}
                  placeholder="0.00"
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
                <Label htmlFor="servicePrice">Service Price</Label>
                <Input
                  id="servicePrice"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.servicePrice}
                  onChange={(e) =>
                    handleInputChange("servicePrice", e.target.value)
                  }
                  disabled={loading}
                  aria-invalid={!!validationErrors.servicePrice}
                  placeholder="0.00"
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
              Additional Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Purchase Link */}
              <div className="space-y-2">
                <Label htmlFor="purchaseLink">Purchase Link</Label>
                <Input
                  id="purchaseLink"
                  type="url"
                  value={formData.purchaseLink}
                  onChange={(e) =>
                    handleInputChange("purchaseLink", e.target.value)
                  }
                  disabled={loading}
                  aria-invalid={!!validationErrors.purchaseLink}
                  placeholder="https://example.com/order/..."
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
                <Label htmlFor="arrivalDate">Arrival Date</Label>
                <Input
                  id="arrivalDate"
                  type="date"
                  value={formData.arrivalDate}
                  onChange={(e) =>
                    handleInputChange("arrivalDate", e.target.value)
                  }
                  disabled={loading}
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
              <Label htmlFor="comments">Comments</Label>
              <Textarea
                id="comments"
                value={formData.comments}
                onChange={(e) => handleInputChange("comments", e.target.value)}
                disabled={loading}
                placeholder="Add any additional notes or comments"
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Package
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
