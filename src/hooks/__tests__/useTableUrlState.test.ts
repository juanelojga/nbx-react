import { act, renderHook } from "@testing-library/react";

import { useTableUrlState } from "../useTableUrlState";

const mockReplace = jest.fn();
let currentSearch = "";

jest.mock("next/navigation", () => ({
  useSearchParams: () => new URLSearchParams(currentSearch),
}));
jest.mock("@/i18n/navigation", () => ({
  useRouter: () => ({ replace: mockReplace }),
  usePathname: () => "/admin/clients",
}));

const FIELDS = ["full_name", "email", "created_at"] as const;
const options = {
  sortFields: FIELDS,
  defaultSort: { field: "created_at", order: "desc" } as const,
};

describe("useTableUrlState", () => {
  beforeEach(() => {
    mockReplace.mockClear();
    currentSearch = "";
  });

  it("returns defaults for an empty URL", () => {
    const { result } = renderHook(() => useTableUrlState(options));

    expect(result.current.state).toEqual({
      search: "",
      page: 1,
      pageSize: 10,
      sortField: "created_at",
      sortOrder: "desc",
    });
    expect(result.current.orderBy).toBe("-created_at");
  });

  it("parses and sanitizes URL values", () => {
    currentSearch = "search=ana&page=abc&pageSize=999&orderBy=email";
    const { result } = renderHook(() => useTableUrlState(options));

    expect(result.current.state).toMatchObject({
      search: "ana",
      page: 1,
      pageSize: 100,
      sortField: "email",
      sortOrder: "asc",
    });
  });

  it("ignores unknown sort fields", () => {
    currentSearch = "orderBy=-password";
    const { result } = renderHook(() => useTableUrlState(options));

    expect(result.current.state.sortField).toBe("created_at");
  });

  it("omits default values when updating the URL", () => {
    const { result } = renderHook(() => useTableUrlState(options));

    act(() => {
      result.current.updateURL({
        search: "",
        page: 1,
        pageSize: 10,
        sortField: "created_at",
        sortOrder: "desc",
      });
    });

    expect(mockReplace).toHaveBeenCalledWith("/admin/clients", {
      scroll: false,
    });
  });

  it("writes non-default values and preserves other params", () => {
    currentSearch = "foo=bar";
    const { result } = renderHook(() => useTableUrlState(options));

    act(() => {
      result.current.updateURL({
        page: 3,
        sortField: "email",
        sortOrder: "desc",
        search: "x",
      });
    });

    const [url] = mockReplace.mock.calls[0]!;
    const params = new URLSearchParams(String(url).split("?")[1]);
    expect(params.get("foo")).toBe("bar");
    expect(params.get("page")).toBe("3");
    expect(params.get("orderBy")).toBe("-email");
    expect(params.get("search")).toBe("x");
  });

  it("delegates extra params to the codec", () => {
    currentSearch = "status=pending";
    const codec = {
      parse: (params: URLSearchParams) => ({
        status: params.get("status") ?? "all",
      }),
      apply: jest.fn(
        (params: URLSearchParams, patch: Partial<{ status: string }>) => {
          if (patch.status) params.set("status", patch.status);
        }
      ),
    };
    const { result } = renderHook(() =>
      useTableUrlState<(typeof FIELDS)[number], { status: string }>({
        ...options,
        extra: codec,
      })
    );

    expect(result.current.state.status).toBe("pending");
    act(() => {
      result.current.updateURL({ status: "delivered" });
    });
    expect(codec.apply).toHaveBeenCalledWith(
      expect.any(URLSearchParams),
      { status: "delivered" },
      expect.objectContaining({ status: "pending" })
    );
    expect(String(mockReplace.mock.calls[0]![0])).toContain("status=delivered");
  });
});
