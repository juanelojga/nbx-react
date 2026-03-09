import { renderHook, act } from "@testing-library/react";
import { useClientDialogs } from "../useClientDialogs";
import type { ClientType } from "@/graphql/queries/clients";

const mockClient: ClientType = {
  id: "client-1",
  user: {
    id: "user-1",
    isSuperuser: false,
    email: "john@example.com",
    firstName: "John",
    lastName: "Doe",
  },
  email: "john@example.com",
  identificationNumber: "123456",
  state: "Guayas",
  city: "Guayaquil",
  mainStreet: "Av. Principal",
  secondaryStreet: "Calle 2",
  buildingNumber: "101",
  mobilePhoneNumber: "0991234567",
  phoneNumber: "042345678",
  createdAt: "2024-01-01",
  updatedAt: "2024-01-01",
  fullName: "John Doe",
};

describe("useClientDialogs", () => {
  it("all dialogs start closed", () => {
    const { result } = renderHook(() => useClientDialogs());

    expect(result.current.isAddDialogOpen).toBe(false);
    expect(result.current.isDeleteDialogOpen).toBe(false);
    expect(result.current.isEditDialogOpen).toBe(false);
    expect(result.current.isViewDialogOpen).toBe(false);
    expect(result.current.clientToDelete).toBeNull();
    expect(result.current.clientToEdit).toBeNull();
    expect(result.current.clientIdToView).toBeNull();
  });

  it("handleViewClient sets clientIdToView and opens view dialog", () => {
    const { result } = renderHook(() => useClientDialogs());

    act(() => {
      result.current.handleViewClient("client-1");
    });

    expect(result.current.clientIdToView).toBe("client-1");
    expect(result.current.isViewDialogOpen).toBe(true);
  });

  it("handleEditClient maps user fields and opens edit dialog", () => {
    const { result } = renderHook(() => useClientDialogs());

    act(() => {
      result.current.handleEditClient(mockClient);
    });

    expect(result.current.isEditDialogOpen).toBe(true);
    expect(result.current.clientToEdit).toEqual({
      id: "client-1",
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      identificationNumber: "123456",
      mobilePhoneNumber: "0991234567",
      phoneNumber: "042345678",
      state: "Guayas",
      city: "Guayaquil",
      mainStreet: "Av. Principal",
      secondaryStreet: "Calle 2",
      buildingNumber: "101",
    });
  });

  it("handleEditClient handles null user names", () => {
    const { result } = renderHook(() => useClientDialogs());
    const clientWithNullNames = {
      ...mockClient,
      user: { ...mockClient.user, firstName: null, lastName: null },
    };

    act(() => {
      result.current.handleEditClient(clientWithNullNames);
    });

    expect(result.current.clientToEdit?.firstName).toBe("");
    expect(result.current.clientToEdit?.lastName).toBe("");
  });

  it("handleDeleteClient extracts correct fields and opens delete dialog", () => {
    const { result } = renderHook(() => useClientDialogs());

    act(() => {
      result.current.handleDeleteClient(mockClient);
    });

    expect(result.current.isDeleteDialogOpen).toBe(true);
    expect(result.current.clientToDelete).toEqual({
      id: "client-1",
      userId: "user-1",
      fullName: "John Doe",
      email: "john@example.com",
    });
  });
});
