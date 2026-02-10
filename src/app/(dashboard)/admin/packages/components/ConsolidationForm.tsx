"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@apollo/client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, ArrowLeft, Send } from "lucide-react";
import { toast } from "sonner";
import {
  CREATE_CONSOLIDATE,
  CreateConsolidateVariables,
  CreateConsolidateResponse,
} from "@/graphql/mutations/consolidations";
import { ClientType } from "@/graphql/queries/clients";
import { Package } from "../types";

interface ConsolidationFormProps {
  selectedClient: ClientType;
  selectedPackages: Set<string>;
  packages: Package[];
  onBack: () => void;
}

// Zod validation schema - needs to use translation values
const getConsolidationSchema = (t: (key: string) => string) =>
  z.object({
    description: z.string().min(1, t("descriptionRequired")),
    status: z.enum(["pending", "in_transit", "delivered"], {
      errorMap: () => ({ message: t("statusValidationError") }),
    }),
    deliveryDate: z.string().optional(),
    comment: z.string().optional(),
    sendEmail: z.boolean().optional().default(false),
  });

type ConsolidationFormData = {
  description: string;
  status: "pending" | "in_transit" | "delivered";
  deliveryDate?: string;
  comment?: string;
  sendEmail?: boolean;
};

export function ConsolidationForm({
  selectedClient,
  selectedPackages,
  packages,
  onBack,
}: ConsolidationFormProps) {
  const t = useTranslations("adminPackages.consolidationForm");
  const router = useRouter();

  // React Hook Form with Zod validation
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ConsolidationFormData>({
    resolver: zodResolver(getConsolidationSchema(t)),
    defaultValues: {
      description: "",
      status: "pending",
      deliveryDate: "",
      comment: "",
      sendEmail: false,
    },
  });

  const sendEmail = watch("sendEmail");

  const [createConsolidate, { loading, error }] = useMutation<
    CreateConsolidateResponse,
    CreateConsolidateVariables
  >(CREATE_CONSOLIDATE, {
    onCompleted: () => {
      toast.success(t("successTitle"), {
        description: t("successDescription", {
          fullName: selectedClient.fullName,
        }),
      });
      // Redirect to packages page (until consolidations list exists)
      router.push("/admin/packages");
    },
    onError: (error) => {
      toast.error(t("errorTitle"), {
        description: error.message || t("errorDescription"),
      });
    },
  });

  // Get selected package details
  const selectedPackageDetails = packages.filter((pkg) =>
    selectedPackages.has(pkg.id)
  );

  // Form submission handler
  const onSubmit = useCallback(
    async (data: ConsolidationFormData) => {
      try {
        await createConsolidate({
          variables: {
            description: data.description,
            status: data.status,
            packageIds: Array.from(selectedPackages),
            deliveryDate: data.deliveryDate || undefined,
            comment: data.comment || undefined,
            sendEmail: data.sendEmail,
          },
        });
      } catch (err) {
        // Error handled by onError callback
        console.error("Consolidation creation error:", err);
      }
    },
    [createConsolidate, selectedPackages]
  );

  return (
    <div className="space-y-6">
      {/* Client Info */}
      <Alert>
        <AlertDescription>
          {t("creatingFor")}{" "}
          <span className="font-semibold">{selectedClient.fullName}</span> (
          {selectedClient.email})
        </AlertDescription>
      </Alert>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-6">
        {/* Left: Form */}
        <Card>
          <CardHeader>
            <CardTitle>{t("detailsTitle")}</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {t("detailsDescription")}
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">
                  {t("descriptionLabel")}{" "}
                  <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="description"
                  placeholder={t("descriptionPlaceholder")}
                  {...register("description")}
                  disabled={loading}
                />
                {errors.description && (
                  <p className="text-sm text-destructive">
                    {errors.description.message}
                  </p>
                )}
              </div>

              {/* Status */}
              <div className="space-y-2">
                <Label htmlFor="status">
                  {t("statusLabel")} <span className="text-destructive">*</span>
                </Label>
                <Select
                  defaultValue="pending"
                  onValueChange={(value) =>
                    setValue(
                      "status",
                      value as "pending" | "in_transit" | "delivered"
                    )
                  }
                  disabled={loading}
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder={t("statusPlaceholder")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">
                      {t("statusPending")}
                    </SelectItem>
                    <SelectItem value="in_transit">
                      {t("statusInTransit")}
                    </SelectItem>
                    <SelectItem value="delivered">
                      {t("statusDelivered")}
                    </SelectItem>
                  </SelectContent>
                </Select>
                {errors.status && (
                  <p className="text-sm text-destructive">
                    {errors.status.message}
                  </p>
                )}
              </div>

              {/* Delivery Date */}
              <div className="space-y-2">
                <Label htmlFor="deliveryDate">{t("deliveryDateLabel")}</Label>
                <Input
                  id="deliveryDate"
                  type="date"
                  {...register("deliveryDate")}
                  disabled={loading}
                />
                {errors.deliveryDate && (
                  <p className="text-sm text-destructive">
                    {errors.deliveryDate.message}
                  </p>
                )}
              </div>

              {/* Comment */}
              <div className="space-y-2">
                <Label htmlFor="comment">{t("commentLabel")}</Label>
                <Textarea
                  id="comment"
                  placeholder={t("commentPlaceholder")}
                  rows={4}
                  {...register("comment")}
                  disabled={loading}
                />
                {errors.comment && (
                  <p className="text-sm text-destructive">
                    {errors.comment.message}
                  </p>
                )}
              </div>

              {/* Send Email Notification */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="sendEmail"
                  checked={sendEmail}
                  onCheckedChange={(checked) =>
                    setValue("sendEmail", checked as boolean)
                  }
                  disabled={loading}
                />
                <Label
                  htmlFor="sendEmail"
                  className="text-sm font-normal cursor-pointer"
                >
                  {t("sendEmailLabel")}
                </Label>
              </div>

              {/* Error Alert */}
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>
                    {error.message || t("errorMessage")}
                  </AlertDescription>
                </Alert>
              )}

              {/* Form Actions */}
              <div className="flex items-center justify-between pt-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onBack}
                  disabled={loading}
                  className="gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  {t("backToPackages")}
                </Button>
                <Button type="submit" disabled={loading} className="gap-2">
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      {t("creating")}
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      {t("createButton")}
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Right: Package Summary */}
        <Card className="h-fit sticky top-4">
          <CardHeader>
            <CardTitle>{t("selectedPackagesTitle")}</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {t("packagesCount", {
                count: selectedPackages.size,
                plural: selectedPackages.size !== 1 ? "s" : "",
              })}
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {selectedPackageDetails.map((pkg) => (
                <div
                  key={pkg.id}
                  className="flex items-start justify-between p-3 border rounded-lg bg-muted/50"
                >
                  <div className="space-y-1 flex-1">
                    <p className="font-medium text-sm">{pkg.barcode}</p>
                    {pkg.description && (
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {pkg.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
