import { act, renderHook, waitFor } from "@testing-library/react";
import React from "react";

import type { ClientType } from "@/graphql/queries/clients";
import type { ConsolidateType } from "@/graphql/queries/consolidations";
import { GET_ALL_PACKAGES } from "@/graphql/queries/packages";
import { MockedProvider, type MockedResponse } from "@/test/MockedProvider";

import { useConsolidationWizard } from "../useConsolidationWizard";

const mockPush = jest.fn();
jest.mock("next-intl", () => jest.requireActual("@/test/mockNextIntl"));
jest.mock("@/i18n/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));

const client = {
  id: "c1",
  fullName: "Ana Ruiz",
  email: "ana@example.com",
} as ClientType;

const packagesMock: MockedResponse = {
  request: {
    query: GET_ALL_PACKAGES,
    variables: {
      clientId: "c1",
      page: 1,
      pageSize: 20,
      orderBy: "-created_at",
      search: "",
      notInConsolidate: true,
    },
  },
  result: {
    data: {
      allPackages: {
        results: [
          {
            id: "p1",
            barcode: "BC-1",
            description: null,
            purchasedByNarbox: false,
            realPrice: null,
            servicePrice: null,
            transportationCost: null,
            serviceFee: null,
            weight: 1,
            weightUnit: "lb",
            createdAt: "2024-01-01",
            client: {
              id: "c1",
              fullName: "Ana Ruiz",
              email: "ana@example.com",
            },
          },
          null,
        ],
        totalCount: 1,
        page: 1,
        pageSize: 20,
        hasNext: false,
        hasPrevious: false,
      },
    },
  },
};

function setup(mocks: MockedResponse[] = []) {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <MockedProvider mocks={mocks}>{children}</MockedProvider>
  );
  return renderHook(() => useConsolidationWizard(), { wrapper });
}

describe("useConsolidationWizard", () => {
  beforeEach(() => mockPush.mockClear());

  it("starts on step 1 with nothing selected", () => {
    const { result } = setup();

    expect(result.current.currentStep).toBe(1);
    expect(result.current.selectedClient).toBeNull();
    expect(result.current.selectedPackages.size).toBe(0);
    expect(result.current.consolidationSteps).toHaveLength(4);
  });

  it("does not advance to step 2 without a client", () => {
    const { result } = setup();

    act(() => result.current.handleContinueToStep2());

    expect(result.current.currentStep).toBe(1);
  });

  it("loads the client's packages once step 2 is reached", async () => {
    const { result } = setup([packagesMock]);

    act(() => result.current.handleClientSelect(client));
    act(() => result.current.handleContinueToStep2());

    expect(result.current.currentStep).toBe(2);
    await waitFor(() => expect(result.current.packages).toHaveLength(1));
    expect(result.current.packages[0]?.barcode).toBe("BC-1");
    expect(result.current.hasError).toBe(false);
  });

  it("clears the package selection when stepping back to step 1", () => {
    const { result } = setup();

    act(() => result.current.handleClientSelect(client));
    act(() => result.current.handleContinueToStep2());
    act(() => result.current.handleSelectionChange(new Set(["p1", "p2"])));
    expect(result.current.selectedPackages.size).toBe(2);

    act(() => result.current.handleBackToStep1());

    expect(result.current.currentStep).toBe(1);
    expect(result.current.selectedPackages.size).toBe(0);
  });

  it("removes a single package and clears all", () => {
    const { result } = setup();

    act(() => result.current.handleSelectionChange(new Set(["p1", "p2"])));
    act(() => result.current.handleRemovePackage("p1"));
    expect([...result.current.selectedPackages]).toEqual(["p2"]);

    act(() => result.current.handleClearAll());
    expect(result.current.selectedPackages.size).toBe(0);
  });

  it("moves between steps 2 and 3 without losing the selection", () => {
    const { result } = setup();

    act(() => result.current.handleSelectionChange(new Set(["p1"])));
    act(() => result.current.handleContinueToStep3());
    expect(result.current.currentStep).toBe(3);

    act(() => result.current.handleBackToStep2());
    expect(result.current.currentStep).toBe(2);
    expect(result.current.selectedPackages.size).toBe(1);
  });

  it("jumps to the success step when a consolidation is created", () => {
    const { result } = setup();
    const consolidation = { id: "k1", description: "Box" } as ConsolidateType;

    act(() => result.current.handleConsolidationCreated(consolidation));

    expect(result.current.currentStep).toBe(4);
    expect(result.current.createdConsolidation).toBe(consolidation);
  });

  it("resets everything when starting another consolidation", () => {
    const { result } = setup();

    act(() => result.current.handleClientSelect(client));
    act(() => result.current.handleSelectionChange(new Set(["p1"])));
    act(() =>
      result.current.handleConsolidationCreated({ id: "k1" } as ConsolidateType)
    );

    act(() => result.current.handleCreateAnother());

    expect(result.current.currentStep).toBe(1);
    expect(result.current.selectedClient).toBeNull();
    expect(result.current.selectedPackages.size).toBe(0);
    expect(result.current.createdConsolidation).toBeNull();
  });

  it("navigates to the consolidations list", () => {
    const { result } = setup();

    act(() => result.current.handleGoToConsolidations());

    expect(mockPush).toHaveBeenCalledWith("/admin/consolidations");
  });

  it("reports a load failure", async () => {
    const { result } = setup([
      {
        request: {
          query: GET_ALL_PACKAGES,
          variables: packagesMock.request.variables,
        },
        error: new Error("backend down"),
      },
    ]);

    act(() => result.current.handleClientSelect(client));
    act(() => result.current.handleContinueToStep2());

    await waitFor(() => expect(result.current.hasError).toBe(true));
    expect(result.current.packages).toEqual([]);
  });
});
