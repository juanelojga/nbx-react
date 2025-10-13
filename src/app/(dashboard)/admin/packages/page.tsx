"use client";

import { useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StepHeader } from "./components/StepHeader";
import { ClientSelect } from "./components/ClientSelect";
import { ClientType } from "@/graphql/queries/clients";

const CONSOLIDATION_STEPS = [
  { number: 1, label: "Select Client" },
  { number: 2, label: "Group Packages" },
  { number: 3, label: "Review & Finalize" },
];

export default function AdminPackages() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedClient, setSelectedClient] = useState<ClientType | null>(null);

  const handleClientSelect = (client: ClientType | null) => {
    setSelectedClient(client);
    // Future: When a client is selected, we'll move to step 2
    // setCurrentStep(2);
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
          </CardContent>
        </Card>
      )}

      {/* Future steps will be added here */}
      {currentStep === 2 && (
        <Card>
          <CardHeader>
            <CardTitle>Group Packages</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Step 2 implementation coming soon...
            </p>
          </CardContent>
        </Card>
      )}

      {currentStep === 3 && (
        <Card>
          <CardHeader>
            <CardTitle>Review & Finalize</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Step 3 implementation coming soon...
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
