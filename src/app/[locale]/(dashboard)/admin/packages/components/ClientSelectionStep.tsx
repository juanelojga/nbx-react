"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { ArrowRight, Package, CheckCircle2 } from "lucide-react";
import { ClientSelect } from "./ClientSelect";
import { ClientType } from "@/graphql/queries/clients";

interface ClientSelectionStepProps {
  selectedClient: ClientType | null;
  onClientSelect: (client: ClientType | null) => void;
  onContinue: () => void;
}

export function ClientSelectionStep({
  selectedClient,
  onClientSelect,
  onContinue,
}: ClientSelectionStepProps) {
  const t = useTranslations("adminPackages.page");

  return (
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
              onClientSelect={onClientSelect}
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
                            : selectedClient.city || selectedClient.state}
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
              onClick={onContinue}
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
  );
}
