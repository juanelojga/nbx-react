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
import { AlertCircle, Eye, Loader2 } from "lucide-react";
import {
  GET_CLIENT,
  GetClientResponse,
  GetClientVariables,
} from "@/graphql/queries/clients";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ViewClientDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clientId: string | null;
}

export function ViewClientDialog({
  open,
  onOpenChange,
  clientId,
}: ViewClientDialogProps) {
  const { data, loading, error } = useQuery<
    GetClientResponse,
    GetClientVariables
  >(GET_CLIENT, {
    variables: { id: parseInt(clientId || "0") },
    skip: !clientId || !open, // Skip query if no clientId or dialog is closed
  });

  const client = data?.client;

  const handleClose = () => {
    onOpenChange(false);
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateString;
    }
  };

  const InfoRow = ({
    label,
    value,
  }: {
    label: string;
    value: string | null | undefined;
  }) => (
    <div className="flex flex-col space-y-1">
      <span className="text-sm font-medium text-muted-foreground">{label}</span>
      <span className="text-sm text-foreground">
        {value && value.trim() !== "" ? value : "-"}
      </span>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Eye className="h-6 w-6" />
            View Client Details
          </DialogTitle>
          <DialogDescription>
            Detailed information about the selected client.
          </DialogDescription>
        </DialogHeader>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">
                Loading client details...
              </p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Failed to load client details: {error.message}
            </AlertDescription>
          </Alert>
        )}

        {/* Data Display */}
        {client && !loading && !error && (
          <div className="space-y-6 py-4">
            {/* Personal Information Section */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide border-b pb-2">
                Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoRow label="Full Name" value={client.fullName} />
                <InfoRow label="Email" value={client.email} />
                <InfoRow
                  label="Identification Number"
                  value={client.identificationNumber}
                />
              </div>
            </div>

            {/* Contact Information Section */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide border-b pb-2">
                Contact Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoRow
                  label="Mobile Phone"
                  value={client.mobilePhoneNumber}
                />
                <InfoRow label="Phone Number" value={client.phoneNumber} />
              </div>
            </div>

            {/* Address Information Section */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide border-b pb-2">
                Address Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoRow label="State" value={client.state} />
                <InfoRow label="City" value={client.city} />
                <InfoRow label="Main Street" value={client.mainStreet} />
                <InfoRow
                  label="Secondary Street"
                  value={client.secondaryStreet}
                />
                <InfoRow
                  label="Building Number"
                  value={client.buildingNumber}
                />
              </div>
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
