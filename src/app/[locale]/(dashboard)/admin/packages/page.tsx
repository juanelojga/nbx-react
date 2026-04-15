"use client";

import dynamic from "next/dynamic";
import { Work_Sans, Inter } from "next/font/google";
import { useTranslations } from "next-intl";
import { StepHeader } from "./components/StepHeader";
import { ClientSelectionStep } from "./components/ClientSelectionStep";
import { PackageSelectionStep } from "./components/PackageSelectionStep";
import { ConsolidationForm } from "./components/ConsolidationForm";
import { ConsolidationSuccess } from "./components/ConsolidationSuccess";
import { useConsolidationWizard } from "./hooks/useConsolidationWizard";
import { useAddPackageDialog } from "./hooks/useAddPackageDialog";

const workSansFont = Work_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-work-sans",
  display: "swap",
});

const interFont = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

// Dynamically import dialog component for better bundle splitting
const AddPackageDialog = dynamic(
  () =>
    import("./components/AddPackageDialog").then((mod) => ({
      default: mod.AddPackageDialog,
    })),
  { ssr: false }
);

export default function AdminPackages() {
  const t = useTranslations("adminPackages.page");
  const wizard = useConsolidationWizard();
  const dialog = useAddPackageDialog();

  return (
    <div
      className={`${workSansFont.variable} ${interFont.variable} min-h-screen`}
    >
      {/* Background Pattern */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.02] z-0">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `
              linear-gradient(to right, #333 1px, transparent 1px),
              linear-gradient(to bottom, #333 1px, transparent 1px)
            `,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="relative z-10 space-y-8 pb-12">
        {/* Enhanced Page Header */}
        <div className="relative">
          <div className="absolute -left-4 top-0 w-1 h-full bg-gradient-to-b from-primary via-secondary to-warning opacity-80 rounded-full" />
          <div>
            <h1 className="font-[family-name:var(--font-work-sans)] text-2xl font-extrabold tracking-tight mb-3 text-foreground">
              {t("title")}
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl">
              {t("description")}
            </p>
          </div>
        </div>

        {/* Step Progress Indicator */}
        <div className="relative overflow-hidden rounded-2xl border-2 border-border bg-card shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5" />
          <div className="relative">
            <StepHeader
              currentStep={wizard.currentStep}
              steps={wizard.consolidationSteps}
            />
          </div>
        </div>

        {/* Step 1: Client Selection */}
        {wizard.currentStep === 1 && (
          <div className="animate-in fade-in slide-in-from-right-8 duration-500">
            <ClientSelectionStep
              selectedClient={wizard.selectedClient}
              onClientSelect={wizard.handleClientSelect}
              onContinue={wizard.handleContinueToStep2}
            />
          </div>
        )}

        {/* Step 2: Group Packages */}
        {wizard.currentStep === 2 && wizard.selectedClient && (
          <PackageSelectionStep
            selectedClient={wizard.selectedClient}
            packages={wizard.packages}
            selectedPackages={wizard.selectedPackages}
            loading={wizard.loading}
            hasError={wizard.hasError}
            onSelectionChange={wizard.handleSelectionChange}
            onRemovePackage={wizard.handleRemovePackage}
            onClearAll={wizard.handleClearAll}
            onRetryLoad={wizard.handleRetryLoad}
            onRefetchPackages={wizard.handleRefetchPackages}
            onOpenAddPackageDialog={dialog.handleOpenAddPackageDialog}
            onBack={wizard.handleBackToStep1}
            onContinue={wizard.handleContinueToStep3}
          />
        )}

        {/* Step 3: Review & Finalize */}
        {wizard.currentStep === 3 && wizard.selectedClient && (
          <div className="animate-in fade-in slide-in-from-right-8 duration-500">
            <ConsolidationForm
              selectedClient={wizard.selectedClient}
              selectedPackages={wizard.selectedPackages}
              packages={wizard.packages}
              onBack={wizard.handleBackToStep2}
              onSuccess={wizard.handleConsolidationCreated}
            />
          </div>
        )}

        {/* Step 4: Success Confirmation */}
        {wizard.currentStep === 4 && wizard.createdConsolidation && (
          <div className="animate-in fade-in slide-in-from-right-8 duration-500">
            <ConsolidationSuccess
              consolidation={wizard.createdConsolidation}
              packages={wizard.packages}
              onCreateAnother={wizard.handleCreateAnother}
              onGoToConsolidations={wizard.handleGoToConsolidations}
            />
          </div>
        )}

        {/* Add Package Dialog */}
        {wizard.selectedClient && (
          <AddPackageDialog
            open={dialog.isAddPackageDialogOpen}
            onOpenChange={dialog.setIsAddPackageDialogOpen}
            clientId={wizard.selectedClient.id}
            onPackageCreated={wizard.handleRefetchPackages}
          />
        )}
      </div>
    </div>
  );
}
