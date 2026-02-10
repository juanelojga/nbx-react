"use client";

import { useCallback } from "react";
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
import { Loader2, ArrowLeft, Send, Package as PackageIcon } from "lucide-react";
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
  onSuccess: (
    consolidation: CreateConsolidateResponse["createConsolidate"]["consolidate"]
  ) => void;
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
  onSuccess,
}: ConsolidationFormProps) {
  const t = useTranslations("adminPackages.consolidationForm");

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

  // eslint-disable-next-line react-hooks/incompatible-library -- React Hook Form's watch() is required for form state tracking
  const sendEmail = watch("sendEmail");

  const [createConsolidate, { loading, error }] = useMutation<
    CreateConsolidateResponse,
    CreateConsolidateVariables
  >(CREATE_CONSOLIDATE, {
    onCompleted: (data) => {
      toast.success(t("successTitle"), {
        description: t("successDescription", {
          fullName: selectedClient.fullName,
        }),
      });
      // Call success callback with consolidation data
      onSuccess(data.createConsolidate.consolidate);
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
      <style jsx global>{`
        @keyframes slideUpFade {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }

        .consolidation-form-container {
          animation: slideUpFade 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .consolidation-alert {
          animation: slideUpFade 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.1s
            backwards;
        }

        .consolidation-card-left {
          animation: slideUpFade 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.2s
            backwards;
        }

        .consolidation-card-right {
          animation: slideInRight 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.3s
            backwards;
        }

        .form-field-stagger-1 {
          animation: slideUpFade 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.4s
            backwards;
        }

        .form-field-stagger-2 {
          animation: slideUpFade 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.5s
            backwards;
        }

        .form-field-stagger-3 {
          animation: slideUpFade 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.6s
            backwards;
        }

        .form-field-stagger-4 {
          animation: slideUpFade 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.7s
            backwards;
        }

        .form-field-stagger-5 {
          animation: slideUpFade 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.8s
            backwards;
        }

        .package-card {
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .package-card:hover {
          transform: translateX(-4px);
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
        }

        .barcode-text {
          font-family: "JetBrains Mono", "Monaco", "Courier New", monospace;
          letter-spacing: 0.05em;
        }

        .consolidation-gradient {
          background: linear-gradient(
            135deg,
            hsl(var(--card)) 0%,
            hsl(var(--muted)) 100%
          );
        }

        .status-badge {
          position: relative;
          overflow: hidden;
        }

        .status-badge::before {
          content: "";
          position: absolute;
          top: 0;
          left: -200%;
          width: 200%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.1),
            transparent
          );
          animation: shimmer 3s infinite;
        }

        .accent-border {
          border-left: 3px solid hsl(var(--primary));
        }

        .elevated-shadow {
          box-shadow:
            0 4px 6px -1px rgba(0, 0, 0, 0.1),
            0 2px 4px -1px rgba(0, 0, 0, 0.06),
            0 0 0 1px rgba(0, 0, 0, 0.05);
        }

        .shipping-label-border {
          border: 2px dashed hsl(var(--border));
          border-radius: 8px;
          position: relative;
        }

        .shipping-label-border::before {
          content: "";
          position: absolute;
          top: -6px;
          left: 12px;
          width: 10px;
          height: 10px;
          background: hsl(var(--background));
          border: 2px solid hsl(var(--border));
          border-radius: 50%;
        }

        .shipping-label-border::after {
          content: "";
          position: absolute;
          top: -6px;
          right: 12px;
          width: 10px;
          height: 10px;
          background: hsl(var(--background));
          border: 2px solid hsl(var(--border));
          border-radius: 50%;
        }
      `}</style>

      <div className="consolidation-form-container">
        {/* Client Info with enhanced styling */}
        <Alert className="consolidation-alert accent-border elevated-shadow bg-gradient-to-r from-primary/5 to-primary/10">
          <PackageIcon className="h-5 w-5 text-primary" />
          <AlertDescription className="ml-2">
            {t("creatingFor")}{" "}
            <span className="font-bold text-primary">
              {selectedClient.fullName}
            </span>
            <span className="text-muted-foreground ml-1">
              ({selectedClient.email})
            </span>
          </AlertDescription>
        </Alert>

        {/* Two-column layout with enhanced spacing */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-8 mt-6">
          {/* Left: Form */}
          <Card className="consolidation-card-left elevated-shadow border-2">
            <CardHeader className="consolidation-gradient border-b-2">
              <CardTitle className="text-2xl tracking-tight">
                {t("detailsTitle")}
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-2">
                {t("detailsDescription")}
              </p>
            </CardHeader>
            <CardContent className="pt-8">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-7">
                {/* Description */}
                <div className="space-y-3 form-field-stagger-1">
                  <Label
                    htmlFor="description"
                    className="text-sm font-semibold uppercase tracking-wide text-foreground/80"
                  >
                    {t("descriptionLabel")}{" "}
                    <span className="text-primary">*</span>
                  </Label>
                  <Input
                    id="description"
                    placeholder={t("descriptionPlaceholder")}
                    {...register("description")}
                    disabled={loading}
                    className="h-11 text-base transition-all focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                  {errors.description && (
                    <p className="text-sm text-destructive font-medium animate-in slide-in-from-top-1">
                      {errors.description.message}
                    </p>
                  )}
                </div>

                {/* Status */}
                <div className="space-y-3 form-field-stagger-2">
                  <Label
                    htmlFor="status"
                    className="text-sm font-semibold uppercase tracking-wide text-foreground/80"
                  >
                    {t("statusLabel")} <span className="text-primary">*</span>
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
                    <SelectTrigger
                      id="status"
                      className="h-11 text-base transition-all focus:ring-2 focus:ring-primary/20"
                    >
                      <SelectValue placeholder={t("statusPlaceholder")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending" className="status-badge">
                        <span className="inline-flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                          {t("statusPending")}
                        </span>
                      </SelectItem>
                      <SelectItem value="in_transit" className="status-badge">
                        <span className="inline-flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                          {t("statusInTransit")}
                        </span>
                      </SelectItem>
                      <SelectItem value="delivered" className="status-badge">
                        <span className="inline-flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-green-500"></span>
                          {t("statusDelivered")}
                        </span>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.status && (
                    <p className="text-sm text-destructive font-medium animate-in slide-in-from-top-1">
                      {errors.status.message}
                    </p>
                  )}
                </div>

                {/* Delivery Date */}
                <div className="space-y-3 form-field-stagger-3">
                  <Label
                    htmlFor="deliveryDate"
                    className="text-sm font-semibold uppercase tracking-wide text-foreground/80"
                  >
                    {t("deliveryDateLabel")}
                  </Label>
                  <Input
                    id="deliveryDate"
                    type="date"
                    {...register("deliveryDate")}
                    disabled={loading}
                    className="h-11 text-base transition-all focus:ring-2 focus:ring-primary/20 focus:border-primary barcode-text"
                  />
                  {errors.deliveryDate && (
                    <p className="text-sm text-destructive font-medium animate-in slide-in-from-top-1">
                      {errors.deliveryDate.message}
                    </p>
                  )}
                </div>

                {/* Comment */}
                <div className="space-y-3 form-field-stagger-4">
                  <Label
                    htmlFor="comment"
                    className="text-sm font-semibold uppercase tracking-wide text-foreground/80"
                  >
                    {t("commentLabel")}
                  </Label>
                  <Textarea
                    id="comment"
                    placeholder={t("commentPlaceholder")}
                    rows={4}
                    {...register("comment")}
                    disabled={loading}
                    className="text-base resize-none transition-all focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                  {errors.comment && (
                    <p className="text-sm text-destructive font-medium animate-in slide-in-from-top-1">
                      {errors.comment.message}
                    </p>
                  )}
                </div>

                {/* Send Email Notification */}
                <div className="flex items-center space-x-3 p-4 rounded-lg border-2 border-dashed border-border bg-muted/30 form-field-stagger-5 transition-all hover:bg-muted/50 hover:border-primary/50">
                  <Checkbox
                    id="sendEmail"
                    checked={sendEmail}
                    onCheckedChange={(checked) =>
                      setValue("sendEmail", checked as boolean)
                    }
                    disabled={loading}
                    className="h-5 w-5"
                  />
                  <Label
                    htmlFor="sendEmail"
                    className="text-sm font-medium cursor-pointer flex-1"
                  >
                    {t("sendEmailLabel")}
                  </Label>
                </div>

                {/* Error Alert */}
                {error && (
                  <Alert
                    variant="destructive"
                    className="animate-in slide-in-from-top-2 border-2"
                  >
                    <AlertDescription className="font-medium">
                      {error.message || t("errorMessage")}
                    </AlertDescription>
                  </Alert>
                )}

                {/* Form Actions */}
                <div className="flex items-center justify-between pt-6 mt-6 border-t-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onBack}
                    disabled={loading}
                    className="gap-2 h-11 px-6 border-2 transition-all hover:bg-muted hover:translate-x-[-4px]"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    {t("backToPackages")}
                  </Button>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="gap-2 h-11 px-8 text-base font-semibold shadow-lg transition-all hover:shadow-xl hover:scale-105"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        {t("creating")}
                      </>
                    ) : (
                      <>
                        <Send className="h-5 w-5" />
                        {t("createButton")}
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Right: Package Summary */}
          <Card className="h-fit sticky top-4 consolidation-card-right elevated-shadow border-2 overflow-hidden">
            <CardHeader className="bg-gradient-to-br from-primary/10 via-primary/5 to-background border-b-2">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-primary/10 border-2 border-primary/20 flex items-center justify-center">
                  <PackageIcon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-xl">
                    {t("selectedPackagesTitle")}
                  </CardTitle>
                  <p className="text-xs text-muted-foreground mt-1 font-medium uppercase tracking-wider">
                    {t("packagesCount", {
                      count: selectedPackages.size,
                      plural: selectedPackages.size !== 1 ? "s" : "",
                    })}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-3">
                {selectedPackageDetails.map((pkg, index) => (
                  <div
                    key={pkg.id}
                    className="package-card shipping-label-border p-4 bg-gradient-to-br from-muted/50 to-muted/30"
                    style={{
                      animationDelay: `${0.4 + index * 0.1}s`,
                      animation:
                        "slideUpFade 0.5s cubic-bezier(0.16, 1, 0.3, 1) backwards",
                    }}
                  >
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                        <p className="font-bold text-sm barcode-text tracking-wider text-primary">
                          {pkg.barcode}
                        </p>
                      </div>
                      {pkg.description && (
                        <p className="text-xs text-muted-foreground line-clamp-2 pl-4">
                          {pkg.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Summary footer */}
              <div className="mt-6 pt-4 border-t-2 border-dashed">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold uppercase tracking-wide text-muted-foreground">
                    Total
                  </span>
                  <span className="text-2xl font-bold text-primary barcode-text">
                    {selectedPackages.size}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
