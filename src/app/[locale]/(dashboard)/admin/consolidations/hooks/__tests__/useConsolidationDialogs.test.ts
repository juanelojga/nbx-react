import { renderHook, act } from "@testing-library/react";
import { useConsolidationDialogs } from "../useConsolidationDialogs";
import type { ConsolidateType } from "@/graphql/queries/consolidations";

const mockConsolidation: ConsolidateType = {
  id: "cons-1",
  description: "Test consolidation",
  status: "pending",
  deliveryDate: "2024-06-15",
  comment: null,
  extraAttributes: null,
  client: {
    id: "client-1",
    fullName: "John Doe",
    email: "john@example.com",
  },
  packages: [
    { id: "pkg-1", barcode: "BC001", description: "Package 1" },
    { id: "pkg-2", barcode: "BC002", description: "Package 2" },
  ],
  createdAt: "2024-01-01",
  updatedAt: "2024-01-01",
};

describe("useConsolidationDialogs", () => {
  it("all dialogs start closed with null data", () => {
    const { result } = renderHook(() => useConsolidationDialogs());

    expect(result.current.isViewDialogOpen).toBe(false);
    expect(result.current.isEditDialogOpen).toBe(false);
    expect(result.current.isDeleteDialogOpen).toBe(false);
    expect(result.current.consolidationIdToView).toBeNull();
    expect(result.current.consolidationToEdit).toBeNull();
    expect(result.current.consolidationToDelete).toBeNull();
  });

  it("handleViewConsolidation sets id and opens view dialog", () => {
    const { result } = renderHook(() => useConsolidationDialogs());

    act(() => {
      result.current.handleViewConsolidation("cons-1");
    });

    expect(result.current.consolidationIdToView).toBe("cons-1");
    expect(result.current.isViewDialogOpen).toBe(true);
  });

  it("handleEditConsolidation stores consolidation and opens edit dialog", () => {
    const { result } = renderHook(() => useConsolidationDialogs());

    act(() => {
      result.current.handleEditConsolidation(mockConsolidation);
    });

    expect(result.current.isEditDialogOpen).toBe(true);
    expect(result.current.consolidationToEdit).toBe(mockConsolidation);
  });

  it("handleDeleteConsolidation extracts fields and opens delete dialog", () => {
    const { result } = renderHook(() => useConsolidationDialogs());

    act(() => {
      result.current.handleDeleteConsolidation(mockConsolidation);
    });

    expect(result.current.isDeleteDialogOpen).toBe(true);
    expect(result.current.consolidationToDelete).toEqual({
      id: "cons-1",
      description: "Test consolidation",
      client: {
        id: "client-1",
        fullName: "John Doe",
        email: "john@example.com",
      },
      packagesCount: 2,
    });
  });

  it("setters toggle dialog open state", () => {
    const { result } = renderHook(() => useConsolidationDialogs());

    act(() => {
      result.current.setIsViewDialogOpen(true);
    });
    expect(result.current.isViewDialogOpen).toBe(true);

    act(() => {
      result.current.setIsViewDialogOpen(false);
    });
    expect(result.current.isViewDialogOpen).toBe(false);

    act(() => {
      result.current.setIsEditDialogOpen(true);
    });
    expect(result.current.isEditDialogOpen).toBe(true);

    act(() => {
      result.current.setIsDeleteDialogOpen(true);
    });
    expect(result.current.isDeleteDialogOpen).toBe(true);
  });
});
