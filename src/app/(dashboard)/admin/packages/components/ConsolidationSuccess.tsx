"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle2,
  Package as PackageIcon,
  User,
  FileText,
  Calendar,
  Layers,
  ArrowRight,
  RotateCcw,
  Home,
  Weight,
  DollarSign,
} from "lucide-react";
import { ConsolidateType } from "@/graphql/queries/consolidations";
import { Package } from "../types";
import { cn } from "@/lib/utils";

interface ConsolidationSuccessProps {
  consolidation: ConsolidateType;
  packages: Package[];
  onViewDetails: () => void;
  onCreateAnother: () => void;
  onBackToPackages: () => void;
}

export function ConsolidationSuccess({
  consolidation,
  packages,
  onViewDetails,
  onCreateAnother,
  onBackToPackages,
}: ConsolidationSuccessProps) {
  const t = useTranslations("adminPackages.success");

  // Get full package details for the consolidation
  const consolidatedPackages = useMemo(() => {
    const packageIds = new Set(consolidation.packages.map((p) => p.id));
    return packages.filter((pkg) => packageIds.has(pkg.id));
  }, [consolidation.packages, packages]);

  // Calculate statistics
  const statistics = useMemo(() => {
    return consolidatedPackages.reduce(
      (acc, pkg) => {
        if (pkg.realPrice !== null) {
          acc.totalRealPrice += pkg.realPrice;
        }
        if (pkg.servicePrice !== null) {
          acc.totalServicePrice += pkg.servicePrice;
        }
        if (pkg.weight !== null) {
          acc.totalWeight += pkg.weight;
          if (!acc.weightUnit && pkg.weightUnit) {
            acc.weightUnit = pkg.weightUnit;
          }
        }
        return acc;
      },
      {
        totalRealPrice: 0,
        totalServicePrice: 0,
        totalWeight: 0,
        weightUnit: null as string | null,
      }
    );
  }, [consolidatedPackages]);

  // Status badge color mapping
  const statusColors = {
    awaiting_payment: "bg-orange-500",
    pending: "bg-yellow-500",
    processing: "bg-blue-500",
    in_transit: "bg-purple-500",
    delivered: "bg-green-500",
    cancelled: "bg-red-500",
  };

  const statusColor =
    statusColors[consolidation.status as keyof typeof statusColors] ||
    "bg-gray-500";

  return (
    <div className="space-y-6">
      <style jsx global>{`
        @keyframes successPulse {
          0%,
          100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.05);
            opacity: 0.8;
          }
        }

        @keyframes slideUpFadeIn {
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

        @keyframes checkmark {
          0% {
            transform: scale(0) rotate(45deg);
          }
          50% {
            transform: scale(1.2) rotate(45deg);
          }
          100% {
            transform: scale(1) rotate(45deg);
          }
        }

        .success-hero {
          animation: slideUpFadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .success-card-1 {
          animation: slideUpFadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.2s
            backwards;
        }

        .success-card-2 {
          animation: slideInRight 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.3s
            backwards;
        }

        .success-actions {
          animation: slideUpFadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.4s
            backwards;
        }

        .checkmark-icon {
          animation: checkmark 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.2s backwards;
        }

        .consolidation-id {
          font-family: "JetBrains Mono", "Monaco", "Courier New", monospace;
          letter-spacing: 0.05em;
        }

        .package-item {
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .package-item:hover {
          transform: translateX(-4px);
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
        }
      `}</style>

      {/* Hero Section - Success Message */}
      <div className="success-hero relative overflow-hidden rounded-2xl border-2 border-green-500/30 bg-gradient-to-br from-green-500/10 via-emerald-500/5 to-transparent shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-green-500/20 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative p-8 md:p-12">
          <div className="flex flex-col md:flex-row items-center gap-6">
            {/* Success Icon */}
            <div className="relative">
              <div className="absolute inset-0 bg-green-500 rounded-full blur-xl opacity-50 animate-pulse" />
              <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-2xl">
                <CheckCircle2
                  className="w-14 h-14 text-white checkmark-icon"
                  strokeWidth={2.5}
                />
              </div>
            </div>

            {/* Success Text */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl md:text-4xl font-black tracking-tight text-foreground mb-2">
                {t("title")}
              </h1>
              <p className="text-lg text-muted-foreground">
                {t("description")}
              </p>
            </div>

            {/* Consolidation ID Badge */}
            <div className="flex-shrink-0">
              <div className="px-6 py-4 rounded-xl border-2 border-green-500/30 bg-card shadow-lg">
                <div className="text-xs uppercase tracking-wider text-muted-foreground font-bold mb-1">
                  {t("consolidationId")}
                </div>
                <div className="text-2xl font-black text-green-600 consolidation-id">
                  #{consolidation.id}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-6">
        {/* Left: Consolidation Details */}
        <Card className="success-card-1 elevated-shadow border-2">
          <CardHeader className="bg-gradient-to-br from-card via-muted/20 to-card border-b-2">
            <CardTitle className="text-xl tracking-tight">
              {t("detailsTitle")}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            {/* Client Info */}
            <div className="flex items-start gap-4 p-4 rounded-lg border-2 border-primary/20 bg-primary/5">
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                <User className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs uppercase tracking-wider text-muted-foreground font-bold mb-1">
                  {t("clientLabel")}
                </div>
                <p className="font-bold text-foreground">
                  {consolidation.client.fullName}
                </p>
                <p className="text-sm text-muted-foreground">
                  {consolidation.client.email}
                </p>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-muted-foreground" />
                <span className="text-xs uppercase tracking-wider text-muted-foreground font-bold">
                  {t("descriptionLabel")}
                </span>
              </div>
              <p className="text-foreground pl-6">
                {consolidation.description}
              </p>
            </div>

            {/* Status */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-muted-foreground" />
                <span className="text-xs uppercase tracking-wider text-muted-foreground font-bold">
                  {t("statusLabel")}
                </span>
              </div>
              <div className="pl-6">
                <Badge
                  variant="outline"
                  className="gap-2 px-3 py-1 border-2 font-semibold"
                >
                  <span className={cn("w-2 h-2 rounded-full", statusColor)} />
                  {t(`status.${consolidation.status.toLowerCase()}`)}
                </Badge>
              </div>
            </div>

            {/* Delivery Date */}
            {consolidation.deliveryDate && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="text-xs uppercase tracking-wider text-muted-foreground font-bold">
                    {t("deliveryDateLabel")}
                  </span>
                </div>
                <p className="text-foreground pl-6 consolidation-id">
                  {new Date(consolidation.deliveryDate).toLocaleDateString(
                    "en-US",
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }
                  )}
                </p>
              </div>
            )}

            {/* Comment */}
            {consolidation.comment && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-muted-foreground" />
                  <span className="text-xs uppercase tracking-wider text-muted-foreground font-bold">
                    {t("commentLabel")}
                  </span>
                </div>
                <p className="text-muted-foreground pl-6 italic">
                  {consolidation.comment}
                </p>
              </div>
            )}

            {/* Statistics Grid */}
            <div className="pt-4 border-t-2">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {/* Total Packages */}
                <div className="p-4 rounded-lg border-2 border-border bg-muted/30">
                  <div className="flex items-center gap-2 mb-2">
                    <PackageIcon className="w-4 h-4 text-emerald-500" />
                    <span className="text-xs uppercase tracking-wider text-muted-foreground font-bold">
                      {t("packagesLabel")}
                    </span>
                  </div>
                  <p className="text-2xl font-black text-foreground">
                    {consolidation.packages.length}
                  </p>
                </div>

                {/* Total Weight */}
                <div className="p-4 rounded-lg border-2 border-border bg-muted/30">
                  <div className="flex items-center gap-2 mb-2">
                    <Weight className="w-4 h-4 text-cyan-500" />
                    <span className="text-xs uppercase tracking-wider text-muted-foreground font-bold">
                      {t("weightLabel")}
                    </span>
                  </div>
                  <p className="text-2xl font-black text-foreground">
                    {statistics.totalWeight > 0
                      ? statistics.totalWeight.toFixed(2)
                      : "—"}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {statistics.weightUnit || "kg"}
                  </p>
                </div>

                {/* Real Price */}
                <div className="p-4 rounded-lg border-2 border-border bg-muted/30">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="w-4 h-4 text-blue-500" />
                    <span className="text-xs uppercase tracking-wider text-muted-foreground font-bold">
                      {t("realPriceLabel")}
                    </span>
                  </div>
                  <p className="text-2xl font-black text-foreground">
                    {statistics.totalRealPrice > 0
                      ? `$${statistics.totalRealPrice.toFixed(2)}`
                      : "—"}
                  </p>
                </div>

                {/* Service Price */}
                <div className="p-4 rounded-lg border-2 border-border bg-muted/30">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="w-4 h-4 text-violet-500" />
                    <span className="text-xs uppercase tracking-wider text-muted-foreground font-bold">
                      {t("servicePriceLabel")}
                    </span>
                  </div>
                  <p className="text-2xl font-black text-foreground">
                    {statistics.totalServicePrice > 0
                      ? `$${statistics.totalServicePrice.toFixed(2)}`
                      : "—"}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Right: Package List */}
        <Card className="success-card-2 h-fit elevated-shadow border-2">
          <CardHeader className="bg-gradient-to-br from-primary/10 via-primary/5 to-background border-b-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                <PackageIcon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">{t("packagesTitle")}</CardTitle>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mt-1">
                  {consolidation.packages.length}{" "}
                  {consolidation.packages.length === 1
                    ? t("package")
                    : t("packages")}
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-3 max-h-[500px] overflow-y-auto">
              {consolidation.packages.map((pkg, index) => (
                <div
                  key={pkg.id}
                  className="package-item shipping-label-border p-4 bg-gradient-to-br from-muted/50 to-muted/30"
                  style={{
                    animationDelay: `${0.5 + index * 0.1}s`,
                    animation:
                      "slideUpFadeIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) backwards",
                  }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center border border-primary/20">
                      <span className="text-xs font-black text-primary">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <p className="font-bold text-sm consolidation-id tracking-wider text-primary">
                      {pkg.barcode}
                    </p>
                  </div>
                  {pkg.description && (
                    <p className="text-xs text-muted-foreground line-clamp-2 pl-8">
                      {pkg.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <Card className="success-actions elevated-shadow border-2 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5" />
        <CardContent className="relative p-6">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <Button
              onClick={onViewDetails}
              size="lg"
              className="flex-1 gap-2 h-12 text-base font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105"
            >
              <FileText className="w-5 h-5" />
              {t("viewDetailsButton")}
              <ArrowRight className="w-5 h-5" />
            </Button>
            <Button
              onClick={onCreateAnother}
              variant="outline"
              size="lg"
              className="gap-2 h-12 text-base font-semibold border-2 shadow-md hover:shadow-lg transition-all"
            >
              <RotateCcw className="w-5 h-5" />
              {t("createAnotherButton")}
            </Button>
            <Button
              onClick={onBackToPackages}
              variant="ghost"
              size="lg"
              className="gap-2 h-12 text-base font-semibold hover:bg-muted"
            >
              <Home className="w-5 h-5" />
              {t("backToPackagesButton")}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
