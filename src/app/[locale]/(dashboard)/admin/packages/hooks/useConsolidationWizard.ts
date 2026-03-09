"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter } from "@/lib/navigation";
import { useQuery } from "@apollo/client";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { ClientType } from "@/graphql/queries/clients";
import {
  RESOLVE_ALL_PACKAGES,
  ResolveAllPackagesResponse,
  ResolveAllPackagesVariables,
} from "@/graphql/queries/packages";
import { ConsolidateType } from "@/graphql/queries/consolidations";
import type { Package } from "../types";

interface Step {
  number: number;
  label: string;
}

export interface UseConsolidationWizardReturn {
  currentStep: number;
  selectedClient: ClientType | null;
  selectedPackages: Set<string>;
  createdConsolidation: ConsolidateType | null;
  consolidationSteps: Step[];
  packages: Package[];
  loading: boolean;
  hasError: boolean;
  handleClientSelect: (client: ClientType | null) => void;
  handleContinueToStep2: () => void;
  handleBackToStep1: () => void;
  handleContinueToStep3: () => void;
  handleBackToStep2: () => void;
  handleConsolidationCreated: (consolidation: ConsolidateType) => void;
  handleCreateAnother: () => void;
  handleViewDetails: () => void;
  handleSelectionChange: (packageIds: Set<string>) => void;
  handleRemovePackage: (packageId: string) => void;
  handleClearAll: () => void;
  handleRetryLoad: () => void;
  handleRefetchPackages: () => Promise<void>;
  handleBackToPackages: () => void;
}

export function useConsolidationWizard(): UseConsolidationWizardReturn {
  const t = useTranslations("adminPackages.page");
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedClient, setSelectedClient] = useState<ClientType | null>(null);
  const [selectedPackages, setSelectedPackages] = useState<Set<string>>(
    new Set()
  );
  const [createdConsolidation, setCreatedConsolidation] =
    useState<ConsolidateType | null>(null);

  const consolidationSteps = useMemo(
    () => [
      { number: 1, label: t("step1Title") },
      { number: 2, label: t("step2Title") },
      { number: 3, label: t("step3Title") },
      { number: 4, label: t("step4Title") },
    ],
    [t]
  );

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

  const { data, loading, error, refetch } = useQuery<
    ResolveAllPackagesResponse,
    ResolveAllPackagesVariables
  >(RESOLVE_ALL_PACKAGES, {
    variables: queryVariables,
    skip: currentStep !== 2 || !selectedClient,
    fetchPolicy: "network-only",
  });

  const packages = data?.allPackages.results || [];
  const hasError = !!error;

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

  const handleContinueToStep3 = useCallback(() => {
    setCurrentStep(3);
  }, []);

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
    toast.info("Consolidation details view coming soon");
  }, []);

  const handleSelectionChange = useCallback((packageIds: Set<string>) => {
    setSelectedPackages(packageIds);
  }, []);

  const handleRemovePackage = useCallback((packageId: string) => {
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

  const handleBackToPackages = useCallback(() => {
    router.push("/admin/packages");
  }, [router]);

  return {
    currentStep,
    selectedClient,
    selectedPackages,
    createdConsolidation,
    consolidationSteps,
    packages,
    loading,
    hasError,
    handleClientSelect,
    handleContinueToStep2,
    handleBackToStep1,
    handleContinueToStep3,
    handleBackToStep2,
    handleConsolidationCreated,
    handleCreateAnother,
    handleViewDetails,
    handleSelectionChange,
    handleRemovePackage,
    handleClearAll,
    handleRetryLoad,
    handleRefetchPackages,
    handleBackToPackages,
  };
}
