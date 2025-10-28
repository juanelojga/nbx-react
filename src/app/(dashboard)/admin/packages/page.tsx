"use client";

import { useState } from "react";
import { useQuery } from "@apollo/client";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, ArrowRight, Plus } from "lucide-react";
import { StepHeader } from "./components/StepHeader";
import { ClientSelect } from "./components/ClientSelect";
import { PackagesTable } from "./components/PackagesTable";
import { CurrentConsolidatePanel } from "./components/CurrentConsolidatePanel";
import { AddPackageDialog } from "./components/AddPackageDialog";
import { ClientType } from "@/graphql/queries/clients";
import {
  RESOLVE_ALL_PACKAGES,
  ResolveAllPackagesResponse,
  ResolveAllPackagesVariables,
} from "@/graphql/queries/packages";

const CONSOLIDATION_STEPS = [
  { number: 1, label: "Select Client" },
  { number: 2, label: "Group Packages" },
  { number: 3, label: "Review & Finalize" },
];

export default function AdminPackages() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedClient, setSelectedClient] = useState<ClientType | null>(null);

  // Step 2 state
  const [selectedPackages, setSelectedPackages] = useState<string[]>([]);
  const [isAddPackageDialogOpen, setIsAddPackageDialogOpen] = useState(false);

  // GraphQL query for packages - only execute when on step 2 and client is selected
  const { data, loading, error, refetch } = useQuery<
    ResolveAllPackagesResponse,
    ResolveAllPackagesVariables
  >(RESOLVE_ALL_PACKAGES, {
    variables: {
      client_id: selectedClient ? parseInt(selectedClient.id) : 0,
      page: 1,
      page_size: 20,
      order_by: "-created_at",
      search: "",
    },
    skip: currentStep !== 2 || !selectedClient,
    fetchPolicy: "network-only",
  });

  const packages = data?.allPackages.results || [];
  const hasError = !!error;

  const handleClientSelect = (client: ClientType | null) => {
    setSelectedClient(client);
  };

  const handleContinueToStep2 = () => {
    if (selectedClient) {
      setCurrentStep(2);
    }
  };

  const handleBackToStep1 = () => {
    setCurrentStep(1);
    setSelectedPackages([]);
  };

  const handleSelectionChange = (packageIds: string[]) => {
    setSelectedPackages(packageIds);
  };

  const handleRemovePackage = (packageId: string) => {
    setSelectedPackages(selectedPackages.filter((id) => id !== packageId));
  };

  const handleClearAll = () => {
    setSelectedPackages([]);
  };

  const handleRetryLoad = () => {
    if (refetch) {
      refetch();
    }
  };

  const handleRefetchPackages = async () => {
    await refetch();
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Package Consolidation"
        description="Consolidate packages for clients through a guided workflow"
      />

      {/* Step Progress Indicator */}
      <Card>
        <StepHeader currentStep={currentStep} steps={CONSOLIDATION_STEPS} />
      </Card>

      {/* Step 1: Client Selection */}
      {currentStep === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Select a Client</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Choose a client to consolidate their packages. You can search by
              name or email address.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="max-w-2xl">
              <label
                htmlFor="client-select"
                className="block text-sm font-medium mb-2"
              >
                Client
              </label>
              <ClientSelect
                selectedClient={selectedClient}
                onClientSelect={handleClientSelect}
              />
              {selectedClient && (
                <div className="mt-4 p-4 border rounded-lg bg-muted/50">
                  <h4 className="text-sm font-semibold mb-2">
                    Selected Client
                  </h4>
                  <div className="space-y-1 text-sm">
                    <p>
                      <span className="font-medium">Name:</span>{" "}
                      {selectedClient.fullName}
                    </p>
                    <p>
                      <span className="font-medium">Email:</span>{" "}
                      {selectedClient.email}
                    </p>
                    {selectedClient.identificationNumber && (
                      <p>
                        <span className="font-medium">ID:</span>{" "}
                        {selectedClient.identificationNumber}
                      </p>
                    )}
                    {(selectedClient.city || selectedClient.state) && (
                      <p>
                        <span className="font-medium">Location:</span>{" "}
                        {selectedClient.city && selectedClient.state
                          ? `${selectedClient.city}, ${selectedClient.state}`
                          : selectedClient.city || selectedClient.state}
                      </p>
                    )}
                    {(selectedClient.mobilePhoneNumber ||
                      selectedClient.phoneNumber) && (
                      <p>
                        <span className="font-medium">Phone:</span>{" "}
                        {selectedClient.mobilePhoneNumber ||
                          selectedClient.phoneNumber}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Navigation */}
            <div className="flex justify-end pt-4">
              <Button
                onClick={handleContinueToStep2}
                disabled={!selectedClient}
                className="gap-2"
              >
                Continue to Group Packages
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Group Packages */}
      {currentStep === 2 && (
        <div className="space-y-4">
          {/* Client Info Bar */}
          {selectedClient && (
            <Alert>
              <AlertDescription>
                Grouping packages for:{" "}
                <span className="font-semibold">{selectedClient.fullName}</span>{" "}
                ({selectedClient.email})
              </AlertDescription>
            </Alert>
          )}

          {/* Error State */}
          {hasError && (
            <Alert variant="destructive">
              <AlertDescription className="flex items-center justify-between">
                <span>Unable to load packages. Please try again.</span>
                <Button variant="outline" size="sm" onClick={handleRetryLoad}>
                  Retry
                </Button>
              </AlertDescription>
            </Alert>
          )}

          {/* Two-column layout */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-6">
            {/* Left: Packages Table */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Available Packages</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      Select packages to add to the consolidation group.
                    </p>
                  </div>
                  <Button
                    onClick={() => setIsAddPackageDialogOpen(true)}
                    className="gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Add Package
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <PackagesTable
                  packages={packages}
                  selectedPackages={selectedPackages}
                  onSelectionChange={handleSelectionChange}
                  isLoading={loading}
                  onRefetch={handleRefetchPackages}
                />
              </CardContent>
            </Card>

            {/* Right: Current Consolidate Panel */}
            <div>
              <CurrentConsolidatePanel
                selectedPackages={selectedPackages}
                packages={packages}
                onRemovePackage={handleRemovePackage}
                onClearAll={handleClearAll}
              />
            </div>
          </div>

          {/* Navigation */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <Button
                  variant="outline"
                  onClick={handleBackToStep1}
                  className="gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Client Selection
                </Button>
                <Button
                  onClick={() => setCurrentStep(3)}
                  disabled={selectedPackages.length === 0}
                  className="gap-2"
                >
                  Continue to Review
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Step 3: Review & Finalize */}
      {currentStep === 3 && (
        <Card>
          <CardHeader>
            <CardTitle>Review & Finalize</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Step 3 implementation coming soon...
            </p>
            <div className="mt-4">
              <Button
                variant="outline"
                onClick={() => setCurrentStep(2)}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Group Packages
              </Button>
            </div>
          </CardContent>
        </Card>
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
  );
}
