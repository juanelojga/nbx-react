/**
 * Smoke tests for the three admin list pages. They are thin shells over
 * `useAdminListPage`, so these tests verify the wiring the hook's own unit
 * tests cannot: the right query, the right column config, and rows reaching
 * the table.
 */
import { render, screen } from "@testing-library/react";
import React from "react";

import { GET_ALL_CLIENTS } from "@/graphql/queries/clients";
import { GET_ALL_CONSOLIDATES } from "@/graphql/queries/consolidations";
import { GET_ALL_PACKAGES } from "@/graphql/queries/packages";
import { MockedProvider, type MockedResponse } from "@/test/MockedProvider";

import { AdminClientsPage } from "../clients/AdminClientsPage";
import { AdminConsolidationsPage } from "../consolidations/AdminConsolidationsPage";
import { AdminPackagesManagementPage } from "../packages-management/AdminPackagesManagementPage";

jest.mock("next-intl", () => jest.requireActual("@/test/mockNextIntl"));
jest.mock("next/navigation", () => ({
  useSearchParams: () => new URLSearchParams(""),
}));
jest.mock("@/i18n/navigation", () => ({
  useRouter: () => ({ replace: jest.fn(), push: jest.fn() }),
  usePathname: () => "/admin",
  Link: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));
jest.mock("next/dynamic", () => () => {
  const Stub = () => null;
  Stub.displayName = "DynamicStub";
  return Stub;
});
jest.mock("@/lib/date/todayISO", () => ({
  todayISO: () => "2024-05-10",
  isValidISODate: (v: string) => /^\d{4}-\d{2}-\d{2}$/.test(v),
}));

const connection = <T,>(results: T[]) => ({
  results,
  totalCount: results.length,
  page: 1,
  pageSize: 10,
  hasNext: false,
  hasPrevious: false,
});

const renderPage = (ui: React.ReactElement, mocks: MockedResponse[]) =>
  render(<MockedProvider mocks={mocks}>{ui}</MockedProvider>);

describe("AdminClientsPage", () => {
  const mock: MockedResponse = {
    request: {
      query: GET_ALL_CLIENTS,
      variables: { page: 1, pageSize: 10, orderBy: "-created_at" },
    },
    result: {
      data: {
        allClients: connection([
          {
            id: "c1",
            email: "ana@example.com",
            extraEmail1: null,
            extraEmail2: null,
            identificationNumber: null,
            state: "Pichincha",
            city: "Quito",
            mainStreet: null,
            secondaryStreet: null,
            buildingNumber: null,
            mobilePhoneNumber: null,
            phoneNumber: null,
            createdAt: "2024-01-01",
            updatedAt: "2024-01-01",
            fullName: "Ana Ruiz",
            user: {
              id: "u1",
              isSuperuser: false,
              email: "ana@example.com",
              firstName: "Ana",
              lastName: "Ruiz",
            },
          },
        ]),
      },
    },
  };

  it("renders the header and a client row from the query", async () => {
    renderPage(<AdminClientsPage />, [mock]);

    expect(screen.getByRole("heading", { name: "title" })).toBeInTheDocument();
    expect(await screen.findByText("Ana Ruiz")).toBeInTheDocument();
    expect(screen.getByText("Quito, Pichincha")).toBeInTheDocument();
  });

  it("surfaces a query failure in an alert", async () => {
    renderPage(<AdminClientsPage />, [
      { request: mock.request, error: new Error("backend down") },
    ]);

    expect(await screen.findByRole("alert")).toHaveTextContent("loadingError");
  });
});

describe("AdminPackagesManagementPage", () => {
  const mock: MockedResponse = {
    request: {
      query: GET_ALL_PACKAGES,
      variables: {
        page: 1,
        pageSize: 10,
        orderBy: "-created_at",
        notInConsolidate: true,
      },
    },
    result: {
      data: {
        allPackages: connection([
          {
            id: "p1",
            barcode: "BC-123",
            description: "Shoes",
            purchasedByNarbox: false,
            realPrice: null,
            servicePrice: null,
            transportationCost: null,
            serviceFee: null,
            weight: 2.5,
            weightUnit: "lb",
            createdAt: "2024-03-01T00:00:00Z",
            client: {
              id: "c1",
              fullName: "Ana Ruiz",
              email: "ana@example.com",
            },
          },
        ]),
      },
    },
  };

  it("renders a package row with its client", async () => {
    renderPage(<AdminPackagesManagementPage />, [mock]);

    expect(await screen.findByText("BC-123")).toBeInTheDocument();
    expect(screen.getByText("Shoes")).toBeInTheDocument();
    expect(screen.getByText("Ana Ruiz")).toBeInTheDocument();
  });
});

describe("AdminConsolidationsPage", () => {
  const mock: MockedResponse = {
    request: {
      query: GET_ALL_CONSOLIDATES,
      variables: {
        page: 1,
        pageSize: 10,
        orderBy: "-created_at",
        createdAfter: "2024-05-10",
        createdBefore: "2024-05-10",
      },
    },
    result: {
      data: {
        allConsolidates: connection([
          {
            id: "k1",
            description: "Box for Ana",
            status: "pending",
            deliveryDate: "2024-06-15",
            comment: null,
            extraAttributes: "{}",
            totalCost: 75.5,
            client: {
              id: "c1",
              fullName: "Ana Ruiz",
              email: "ana@example.com",
            },
            packages: [{ id: "p1", barcode: "BC-1", description: null }],
            createdAt: "2024-05-10T00:00:00Z",
            updatedAt: "2024-05-10T00:00:00Z",
          },
        ]),
      },
    },
  };

  it("defaults the date filter to today and renders a consolidation row", async () => {
    renderPage(<AdminConsolidationsPage />, [mock]);

    expect(await screen.findByText("Box for Ana")).toBeInTheDocument();
    expect(screen.getByText("Ana Ruiz")).toBeInTheDocument();
    expect(screen.getByText("$75.50")).toBeInTheDocument();
  });
});
