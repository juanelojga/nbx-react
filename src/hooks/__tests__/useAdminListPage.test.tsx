import { gql } from "@apollo/client";
import { act, renderHook, waitFor } from "@testing-library/react";
import React from "react";

import { MockedProvider } from "@/test/MockedProvider";

import { useAdminListPage } from "../useAdminListPage";

const mockReplace = jest.fn();
jest.mock("next/navigation", () => ({
  useSearchParams: () => new URLSearchParams("page=2&orderBy=name"),
}));
jest.mock("@/i18n/navigation", () => ({
  useRouter: () => ({ replace: mockReplace }),
  usePathname: () => "/admin/things",
}));

const QUERY = gql`
  query Things($page: Int, $pageSize: Int, $orderBy: String, $search: String) {
    things(
      page: $page
      pageSize: $pageSize
      orderBy: $orderBy
      search: $search
    ) {
      results {
        id
        name
      }
      totalCount
      hasNext
      hasPrevious
    }
  }
`;

interface Thing {
  id: string;
  name: string;
}
interface Data {
  things: {
    results: Thing[];
    totalCount: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
}
interface Vars {
  page: number;
  pageSize: number;
  orderBy: string;
  search?: string;
}

const FIELDS = ["name", "created_at"] as const;

function setup() {
  const mocks = [
    {
      request: {
        query: QUERY,
        variables: { page: 2, pageSize: 10, orderBy: "name" },
      },
      result: {
        data: {
          things: {
            results: [{ id: "1", name: "One", __typename: "Thing" }],
            totalCount: 11,
            hasNext: false,
            hasPrevious: true,
            __typename: "ThingConnection",
          },
        },
      },
    },
  ];
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <MockedProvider mocks={mocks}>{children}</MockedProvider>
  );
  return renderHook(
    () =>
      useAdminListPage<Data, Vars, Thing, (typeof FIELDS)[number]>({
        query: QUERY,
        sortFields: FIELDS,
        defaultSort: { field: "created_at", order: "desc" },
        buildVariables: (state) => ({
          page: state.page,
          pageSize: state.pageSize,
          orderBy: state.orderBy,
          ...(state.search ? { search: state.search } : {}),
        }),
        selectConnection: (data) => data?.things,
      }),
    { wrapper }
  );
}

describe("useAdminListPage", () => {
  beforeEach(() => mockReplace.mockClear());

  it("builds variables from the URL and exposes items and pagination", async () => {
    const { result } = setup();

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.items).toEqual([
      { id: "1", name: "One", __typename: "Thing" },
    ]);
    expect(result.current.table.pagination).toMatchObject({
      page: 2,
      totalCount: 11,
      hasPrevious: true,
    });
    expect(result.current.table.sort).toEqual({ field: "name", order: "asc" });
    expect(result.current.errorMessage).toBeNull();
  });

  it("toggles sort order on the active field and resets to asc on a new field", async () => {
    const { result } = setup();
    await waitFor(() => expect(result.current.loading).toBe(false));

    act(() => result.current.table.onSortChange("name"));
    expect(String(mockReplace.mock.calls[0]![0])).toContain("orderBy=-name");

    act(() => result.current.table.onSortChange("created_at"));
    expect(String(mockReplace.mock.calls[1]![0])).toContain(
      "orderBy=created_at"
    );
  });

  it("resets to the first page when the page size changes", async () => {
    const { result } = setup();
    await waitFor(() => expect(result.current.loading).toBe(false));

    act(() => result.current.table.onPageSizeChange(25));

    const params = new URLSearchParams(
      String(mockReplace.mock.calls[0]![0]).split("?")[1]
    );
    expect(params.get("pageSize")).toBe("25");
    expect(params.has("page")).toBe(false);
  });
});
