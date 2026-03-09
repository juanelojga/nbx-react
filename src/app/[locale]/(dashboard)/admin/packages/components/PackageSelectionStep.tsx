"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, ArrowRight, Plus, Package } from "lucide-react";
import { PackagesTable } from "./PackagesTable";
import { CurrentConsolidatePanel } from "./CurrentConsolidatePanel";
import { ClientType } from "@/graphql/queries/clients";
import type { Package as PackageType } from "../types";

interface PackageSelectionStepProps {
  selectedClient: ClientType;
  packages: PackageType[];
  selectedPackages: Set<string>;
  loading: boolean;
  hasError: boolean;
  onSelectionChange: (packageIds: Set<string>) => void;
  onRemovePackage: (packageId: string) => void;
  onClearAll: () => void;
  onRetryLoad: () => void;
  onRefetchPackages: () => Promise<void>;
  onOpenAddPackageDialog: () => void;
  onBack: () => void;
  onContinue: () => void;
}

export function PackageSelectionStep({
  selectedClient,
  packages,
  selectedPackages,
  loading,
  hasError,
  onSelectionChange,
  onRemovePackage,
  onClearAll,
  onRetryLoad,
  onRefetchPackages,
  onOpenAddPackageDialog,
  onBack,
  onContinue,
}: PackageSelectionStepProps) {
  const t = useTranslations("adminPackages.page");

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500">
      {/* Client Info Bar */}
      <div className="relative overflow-hidden rounded-xl border-2 border-secondary/30 bg-gradient-to-r from-secondary/10 via-secondary/5 to-transparent shadow-lg">
        <div className="absolute inset-y-0 left-0 w-1 bg-secondary" />
        <div className="px-6 py-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-secondary/20 flex items-center justify-center flex-shrink-0">
            <Package className="w-5 h-5 text-secondary" />
          </div>
          <div className="flex-1">
            <div className="text-sm text-muted-foreground font-medium uppercase tracking-wider">
              {t("groupingFor")}
            </div>
            <div className="font-[family-name:var(--font-work-sans)] text-xs font-bold text-foreground">
              {selectedClient.fullName}
              <span className="font-[family-name:var(--font-inter)] text-sm font-normal text-muted-foreground ml-3">
                {selectedClient.email}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Error State */}
      {hasError && (
        <Alert
          variant="destructive"
          className="border-2 shadow-lg animate-in fade-in zoom-in duration-300"
        >
          <AlertDescription className="flex items-center justify-between">
            <span className="font-medium">{t("unableToLoadPackages")}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={onRetryLoad}
              className="shadow-md hover:shadow-lg transition-shadow"
            >
              {t("retry")}
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Two-column layout with enhanced styling */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-6">
        {/* Left: Packages Table */}
        <div className="relative overflow-hidden rounded-2xl border-2 border-border bg-card shadow-xl">
          {/* Subtle gradient overlay */}
          <div className="absolute top-0 left-0 right-0 h-48 bg-gradient-to-b from-warning/5 to-transparent pointer-events-none" />

          <div className="relative border-b-2 border-border bg-gradient-to-r from-card to-muted/20 px-6 py-5">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4 flex-1">
                <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center flex-shrink-0">
                  <Package className="w-6 h-6 text-warning" />
                </div>
                <div>
                  <h2 className="font-[family-name:var(--font-work-sans)] text-base font-bold text-foreground">
                    {t("availablePackages")}
                  </h2>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {t("selectPackagesDescription")}
                  </p>
                </div>
              </div>
              <Button
                onClick={onOpenAddPackageDialog}
                size="lg"
                className="gap-2 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 font-semibold"
              >
                <Plus className="h-5 w-5" />
                {t("addPackage")}
              </Button>
            </div>
          </div>

          <div className="relative p-6">
            <PackagesTable
              packages={packages}
              selectedPackages={selectedPackages}
              onSelectionChange={onSelectionChange}
              isLoading={loading}
              onRefetch={onRefetchPackages}
            />
          </div>
        </div>

        {/* Right: Current Consolidate Panel - Sticky */}
        <div className="lg:sticky lg:top-6 h-fit">
          <CurrentConsolidatePanel
            selectedPackages={selectedPackages}
            packages={packages}
            onRemovePackage={onRemovePackage}
            onClearAll={onClearAll}
          />
        </div>
      </div>

      {/* Navigation - Floating Bar */}
      <div className="sticky bottom-6 z-20">
        <div className="relative overflow-hidden rounded-2xl border-2 border-border bg-card/95 backdrop-blur-md shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5" />
          <div className="relative px-8 py-5">
            <div className="flex items-center justify-between gap-4">
              <Button
                variant="outline"
                size="lg"
                onClick={onBack}
                className="gap-3 shadow-md hover:shadow-lg transition-all duration-300 font-semibold border-2"
              >
                <ArrowLeft className="h-5 w-5" />
                {t("backToClientSelection")}
              </Button>

              <div className="flex items-center gap-4">
                {selectedPackages.size > 0 && (
                  <div className="px-4 py-2 rounded-lg bg-primary/10 border border-primary/20 animate-in fade-in zoom-in duration-300">
                    <span className="font-[family-name:var(--font-inter)] text-sm font-medium text-primary">
                      {t("packagesSelected", {
                        count: selectedPackages.size,
                        plural: selectedPackages.size !== 1 ? "s" : "",
                      })}
                    </span>
                  </div>
                )}
                <Button
                  size="lg"
                  onClick={onContinue}
                  disabled={selectedPackages.size === 0}
                  className="gap-3 px-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:scale-100 font-semibold text-base"
                >
                  {t("continueToReview")}
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
