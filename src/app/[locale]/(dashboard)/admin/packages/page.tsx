"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter } from "@/lib/navigation";
import { useQuery } from "@apollo/client";
import { useTranslations } from "next-intl";
import dynamic from "next/dynamic";
import { Work_Sans, Inter } from "next/font/google";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import {
  ArrowLeft,
  ArrowRight,
  Plus,
  Package,
  CheckCircle2,
} from "lucide-react";
import { ClientSelect } from "./components/ClientSelect";
import { PackagesTable } from "./components/PackagesTable";
import { CurrentConsolidatePanel } from "./components/CurrentConsolidatePanel";
import { ConsolidationForm } from "./components/ConsolidationForm";
import { ConsolidationSuccess } from "./components/ConsolidationSuccess";
import { ClientType } from "@/graphql/queries/clients";
import {
  RESOLVE_ALL_PACKAGES,
  ResolveAllPackagesResponse,
  ResolveAllPackagesVariables,
} from "@/graphql/queries/packages";
import { ConsolidateType } from "@/graphql/queries/consolidations";

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
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedClient, setSelectedClient] = useState<ClientType | null>(null);

  // Step 2 state - Rule 7.11: Use Set for O(1) lookups instead of Array
  const [selectedPackages, setSelectedPackages] = useState<Set<string>>(
    new Set()
  );
  const [isAddPackageDialogOpen, setIsAddPackageDialogOpen] = useState(false);

  // Step 4 state - Store created consolidation data
  const [createdConsolidation, setCreatedConsolidation] =
    useState<ConsolidateType | null>(null);

  // Rule 5.4: Extract default non-primitive values to constants
  const consolidationSteps = useMemo(
    () => [
      { number: 1, label: t("step1Title") },
      { number: 2, label: t("step2Title") },
      { number: 3, label: t("step3Title") },
      { number: 4, label: t("step4Title") },
    ],
    [t]
  );

  // Rule 5.8: Subscribe to derived state with useMemo for GraphQL variables
  const queryVariables = useMemo(
    () => ({
      client_id: selectedClient ? parseInt(selectedClient.id) : 0,
      page: 1,
      page_size: 20,
      order_by: "-created_at",
      search: "",
    }),
    [selectedClient]
  );

  // GraphQL query for packages - only execute when on step 2 and client is selected
  const { data, loading, error, refetch } = useQuery<
    ResolveAllPackagesResponse,
    ResolveAllPackagesVariables
  >(RESOLVE_ALL_PACKAGES, {
    variables: queryVariables,
    skip: currentStep !== 2 || !selectedClient,
    fetchPolicy: "network-only",
  });

  // Rule 5.1: Calculate derived state during rendering
  const packages = data?.allPackages.results || [];
  const hasError = !!error;

  // Rule 5.7: Put interaction logic in event handlers with useCallback
  const handleClientSelect = useCallback((client: ClientType | null) => {
    setSelectedClient(client);
  }, []);

  const handleContinueToStep2 = useCallback(() => {
    if (selectedClient) {
      setCurrentStep(2);
    }
  }, [selectedClient]);

  const handleBackToStep1 = useCallback(() => {
    setCurrentStep(1);
    setSelectedPackages(new Set());
  }, []);

  const handleSelectionChange = useCallback((packageIds: Set<string>) => {
    setSelectedPackages(packageIds);
  }, []);

  const handleRemovePackage = useCallback((packageId: string) => {
    // Rule 5.9: Use functional setState updates with Set
    setSelectedPackages((prev) => {
      const next = new Set(prev);
      next.delete(packageId);
      return next;
    });
  }, []);

  const handleClearAll = useCallback(() => {
    setSelectedPackages(new Set());
  }, []);

  const handleRetryLoad = useCallback(() => {
    if (refetch) {
      refetch();
    }
  }, [refetch]);

  const handleRefetchPackages = useCallback(async () => {
    await refetch();
  }, [refetch]);

  const handleBackToStep2 = useCallback(() => {
    setCurrentStep(2);
  }, []);

  const handleConsolidationCreated = useCallback(
    (consolidation: ConsolidateType) => {
      setCreatedConsolidation(consolidation);
      setCurrentStep(4);
    },
    []
  );

  const handleCreateAnother = useCallback(() => {
    setCurrentStep(1);
    setSelectedClient(null);
    setSelectedPackages(new Set());
    setCreatedConsolidation(null);
  }, []);

  const handleViewDetails = useCallback(() => {
    // TODO: Navigate to consolidation details page when it exists
    // For now, show a toast notification
    toast.info("Consolidation details view coming soon");
  }, []);

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

        {/* Step Progress Indicator - Redesigned */}
        <div className="relative overflow-hidden rounded-2xl border-2 border-border bg-card shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5" />
          <div className="relative p-6">
            <div className="flex items-center justify-between gap-4">
              {consolidationSteps.map((step, index) => (
                <div key={step.number} className="flex items-center flex-1">
                  <div className="flex items-center gap-4 flex-1">
                    {/* Step Circle */}
                    <div className="relative">
                      <div
                        className={`
                          w-16 h-16 rounded-full flex items-center justify-center 
                          font-[family-name:var(--font-work-sans)] text-base font-bold
                          transition-all duration-500 transform
                          ${
                            currentStep === step.number
                              ? "bg-primary text-primary-foreground scale-110 shadow-xl shadow-primary/30 animate-in zoom-in duration-300"
                              : currentStep > step.number
                                ? "bg-success text-success-foreground shadow-lg"
                                : "bg-muted text-muted-foreground"
                          }
                        `}
                      >
                        {currentStep > step.number ? (
                          <CheckCircle2 className="w-8 h-8 animate-in zoom-in duration-300" />
                        ) : (
                          step.number
                        )}
                      </div>
                      {/* Pulse effect on active step */}
                      {currentStep === step.number && (
                        <div className="absolute inset-0 rounded-full bg-primary animate-ping opacity-20" />
                      )}
                    </div>

                    {/* Step Label */}
                    <div className="flex-1">
                      <div
                        className={`
                        font-[family-name:var(--font-work-sans)] text-xs font-bold
                        transition-colors duration-300
                        ${
                          currentStep === step.number
                            ? "text-foreground"
                            : "text-muted-foreground"
                        }
                      `}
                      >
                        {step.label}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {currentStep === step.number && "In Progress"}
                        {currentStep > step.number && "Completed"}
                        {currentStep < step.number && "Pending"}
                      </div>
                    </div>
                  </div>

                  {/* Connector */}
                  {index < consolidationSteps.length - 1 && (
                    <div className="flex-1 h-1 mx-4 bg-border rounded-full overflow-hidden">
                      <div
                        className={`
                          h-full bg-gradient-to-r from-primary to-secondary
                          transition-all duration-700 ease-out
                          ${currentStep > step.number ? "w-full" : "w-0"}
                        `}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Step 1: Client Selection */}
        {currentStep === 1 && (
          <div className="animate-in fade-in slide-in-from-right-8 duration-500">
            <div className="relative overflow-hidden rounded-2xl border-2 border-border bg-card shadow-xl">
              {/* Decorative corner accent */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

              <div className="relative">
                <div className="border-b border-border bg-gradient-to-r from-card to-muted/20 px-8 py-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Package className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h2 className="font-[family-name:var(--font-work-sans)] text-lg font-bold text-foreground">
                        {t("step1Title")}
                      </h2>
                      <p className="text-muted-foreground mt-1">
                        {t("step1Description")}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="px-8 py-8 space-y-6">
                  <div className="max-w-2xl">
                    <label
                      htmlFor="client-select"
                      className="block text-xs font-bold uppercase tracking-wider mb-3 text-foreground"
                    >
                      {t("clientLabel")}
                    </label>
                    <ClientSelect
                      selectedClient={selectedClient}
                      onClientSelect={handleClientSelect}
                    />

                    {selectedClient && (
                      <div className="mt-6 p-6 border-2 border-primary/20 rounded-xl bg-gradient-to-br from-primary/5 to-transparent shadow-lg animate-in fade-in zoom-in duration-300">
                        <div className="flex items-center gap-3 mb-4">
                          <CheckCircle2 className="w-5 h-5 text-success" />
                          <h4 className="font-[family-name:var(--font-work-sans)] text-sm font-bold text-foreground">
                            {t("selectedClientTitle")}
                          </h4>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-3 text-sm">
                            <div>
                              <div className="text-xs uppercase tracking-wider text-muted-foreground font-medium mb-1">
                                {t("nameLabel")}
                              </div>
                              <div className="font-[family-name:var(--font-inter)] text-base font-medium text-foreground">
                                {selectedClient.fullName}
                              </div>
                            </div>
                            <div>
                              <div className="text-xs uppercase tracking-wider text-muted-foreground font-medium mb-1">
                                {t("emailLabel")}
                              </div>
                              <div className="font-[family-name:var(--font-inter)] text-base text-foreground">
                                {selectedClient.email}
                              </div>
                            </div>
                          </div>
                          <div className="space-y-3 text-sm">
                            {selectedClient.identificationNumber && (
                              <div>
                                <div className="text-xs uppercase tracking-wider text-muted-foreground font-medium mb-1">
                                  {t("idLabel")}
                                </div>
                                <div className="font-[family-name:var(--font-inter)] text-base font-medium text-foreground">
                                  {selectedClient.identificationNumber}
                                </div>
                              </div>
                            )}
                            {(selectedClient.city || selectedClient.state) && (
                              <div>
                                <div className="text-xs uppercase tracking-wider text-muted-foreground font-medium mb-1">
                                  {t("locationLabel")}
                                </div>
                                <div className="font-[family-name:var(--font-inter)] text-base text-foreground">
                                  {selectedClient.city && selectedClient.state
                                    ? `${selectedClient.city}, ${selectedClient.state}`
                                    : selectedClient.city ||
                                      selectedClient.state}
                                </div>
                              </div>
                            )}
                            {(selectedClient.mobilePhoneNumber ||
                              selectedClient.phoneNumber) && (
                              <div>
                                <div className="text-xs uppercase tracking-wider text-muted-foreground font-medium mb-1">
                                  {t("phoneLabel")}
                                </div>
                                <div className="font-[family-name:var(--font-inter)] text-base text-foreground">
                                  {selectedClient.mobilePhoneNumber ||
                                    selectedClient.phoneNumber}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Navigation */}
                  <div className="flex justify-end pt-4">
                    <Button
                      onClick={handleContinueToStep2}
                      disabled={!selectedClient}
                      size="lg"
                      className="gap-3 px-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:scale-100 font-semibold text-base"
                    >
                      {t("continueToPackages")}
                      <ArrowRight className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Group Packages */}
        {currentStep === 2 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500">
            {/* Client Info Bar */}
            {selectedClient && (
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
            )}

            {/* Error State */}
            {hasError && (
              <Alert
                variant="destructive"
                className="border-2 shadow-lg animate-in fade-in zoom-in duration-300"
              >
                <AlertDescription className="flex items-center justify-between">
                  <span className="font-medium">
                    {t("unableToLoadPackages")}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRetryLoad}
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
                      onClick={() => setIsAddPackageDialogOpen(true)}
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
                    onSelectionChange={handleSelectionChange}
                    isLoading={loading}
                    onRefetch={handleRefetchPackages}
                  />
                </div>
              </div>

              {/* Right: Current Consolidate Panel - Sticky */}
              <div className="lg:sticky lg:top-6 h-fit">
                <CurrentConsolidatePanel
                  selectedPackages={selectedPackages}
                  packages={packages}
                  onRemovePackage={handleRemovePackage}
                  onClearAll={handleClearAll}
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
                      onClick={handleBackToStep1}
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
                        onClick={() => setCurrentStep(3)}
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
        )}

        {/* Step 3: Review & Finalize */}
        {currentStep === 3 && selectedClient && (
          <div className="animate-in fade-in slide-in-from-right-8 duration-500">
            <ConsolidationForm
              selectedClient={selectedClient}
              selectedPackages={selectedPackages}
              packages={packages}
              onBack={handleBackToStep2}
              onSuccess={handleConsolidationCreated}
            />
          </div>
        )}

        {/* Step 4: Success Confirmation */}
        {currentStep === 4 && createdConsolidation && (
          <div className="animate-in fade-in slide-in-from-right-8 duration-500">
            <ConsolidationSuccess
              consolidation={createdConsolidation}
              packages={packages}
              onViewDetails={handleViewDetails}
              onCreateAnother={handleCreateAnother}
              onBackToPackages={() => router.push("/admin/packages")}
            />
          </div>
        )}

        {/* Add Package Dialog */}
        {selectedClient && (
          <AddPackageDialog
            open={isAddPackageDialogOpen}
            onOpenChange={setIsAddPackageDialogOpen}
            clientId={selectedClient.id}
            onPackageCreated={handleRefetchPackages}
          />
        )}
      </div>
    </div>
  );
}
