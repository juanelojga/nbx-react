"use client";

import { useQuery } from "@apollo/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertCircle, Package as PackageIcon, Loader2 } from "lucide-react";
import {
  GET_PACKAGE,
  GetPackageResponse,
  GetPackageVariables,
} from "@/graphql/queries/packages";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface PackageDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  packageId: string | null;
}

export function PackageDetailsModal({
  open,
  onOpenChange,
  packageId,
}: PackageDetailsModalProps) {
  const { data, loading, error } = useQuery<
    GetPackageResponse,
    GetPackageVariables
  >(GET_PACKAGE, {
    variables: { id: parseInt(packageId || "0") },
    skip: !packageId || !open, // Skip query if no packageId or dialog is closed
  });

  const pkg = data?.package;

  const handleClose = () => {
    onOpenChange(false);
  };

  const InfoRow = ({
    label,
    value,
  }: {
    label: string;
    value: string | number | null | undefined;
  }) => (
    <div className="flex flex-col space-y-1">
      <span className="text-sm font-medium text-muted-foreground">{label}</span>
      <span className="text-sm text-foreground">
        {value !== null && value !== undefined && String(value).trim() !== ""
          ? value
          : "—"}
      </span>
    </div>
  );

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "—";
    try {
      return new Date(dateString).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return "—";
    }
  };

  const formatDateTime = (dateString: string | null | undefined) => {
    if (!dateString) return "—";
    try {
      return new Date(dateString).toLocaleString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "—";
    }
  };

  const formatCurrency = (amount: number | null | undefined) => {
    if (amount === null || amount === undefined) return "—";
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <PackageIcon className="h-6 w-6" />
            Package Details
          </DialogTitle>
          <DialogDescription>
            View complete information about this package
          </DialogDescription>
        </DialogHeader>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">
                Loading package details...
              </p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Failed to load package details. {error.message}
            </AlertDescription>
          </Alert>
        )}

        {/* Data Display */}
        {pkg && !loading && !error && (
          <div className="space-y-6 py-4">
            {/* Header: Barcode */}
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide border-b pb-2">
                Package Identification
              </h3>
              <div className="grid grid-cols-1 gap-4">
                <InfoRow label="Barcode" value={pkg.barcode} />
              </div>
            </div>

            {/* Section 1: Courier Information */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide border-b pb-2">
                Courier Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoRow label="Courier" value={pkg.courier} />
                <InfoRow label="Other Courier" value={pkg.otherCourier} />
              </div>
            </div>

            {/* Section 2: Dimensions */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide border-b pb-2">
                Dimensions & Weight
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoRow
                  label="Length"
                  value={
                    pkg.length && pkg.dimensionUnit
                      ? `${pkg.length} ${pkg.dimensionUnit}`
                      : pkg.length
                  }
                />
                <InfoRow
                  label="Width"
                  value={
                    pkg.width && pkg.dimensionUnit
                      ? `${pkg.width} ${pkg.dimensionUnit}`
                      : pkg.width
                  }
                />
                <InfoRow
                  label="Height"
                  value={
                    pkg.height && pkg.dimensionUnit
                      ? `${pkg.height} ${pkg.dimensionUnit}`
                      : pkg.height
                  }
                />
                <InfoRow
                  label="Weight"
                  value={
                    pkg.weight && pkg.weightUnit
                      ? `${pkg.weight} ${pkg.weightUnit}`
                      : pkg.weight
                  }
                />
              </div>
            </div>

            {/* Section 3: Pricing */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide border-b pb-2">
                Pricing
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoRow
                  label="Real Price"
                  value={formatCurrency(pkg.realPrice)}
                />
                <InfoRow
                  label="Service Price"
                  value={formatCurrency(pkg.servicePrice)}
                />
              </div>
            </div>

            {/* Section 4: Additional Information */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide border-b pb-2">
                Additional Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoRow
                  label="Arrival Date"
                  value={formatDate(pkg.arrivalDate)}
                />
                <InfoRow
                  label="Created At"
                  value={formatDateTime(pkg.createdAt)}
                />
                <InfoRow
                  label="Last Updated"
                  value={formatDateTime(pkg.updatedAt)}
                />
                {pkg.client && (
                  <InfoRow
                    label="Client"
                    value={`${pkg.client.fullName} (${pkg.client.email})`}
                  />
                )}
              </div>
              {pkg.description && (
                <div className="col-span-full">
                  <InfoRow label="Description" value={pkg.description} />
                </div>
              )}
              {pkg.purchaseLink && (
                <div className="col-span-full">
                  <div className="flex flex-col space-y-1">
                    <span className="text-sm font-medium text-muted-foreground">
                      Purchase Link
                    </span>
                    <a
                      href={pkg.purchaseLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:text-blue-700 hover:underline break-all"
                    >
                      {pkg.purchaseLink}
                    </a>
                  </div>
                </div>
              )}
              {pkg.comments && (
                <div className="col-span-full">
                  <InfoRow label="Comments" value={pkg.comments} />
                </div>
              )}
            </div>
          </div>
        )}

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={loading}
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
