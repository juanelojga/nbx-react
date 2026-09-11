import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";

import { ClientAutocomplete } from "@/components/admin/ClientAutocomplete";
import { GET_ALL_CLIENTS } from "@/graphql/queries/clients";
import { MockedProvider, type MockedResponse } from "@/test/MockedProvider";

jest.mock("next-intl", () => jest.requireActual("@/test/mockNextIntl"));

const clientRow = {
  id: "c1",
  email: "ana@example.com",
  extraEmail1: null,
  extraEmail2: null,
  identificationNumber: null,
  state: null,
  city: null,
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
};

const listMock = (search: string): MockedResponse => ({
  request: {
    query: GET_ALL_CLIENTS,
    variables: { page: 1, pageSize: 50, orderBy: "full_name", search },
  },
  result: {
    data: {
      allClients: {
        results: [clientRow],
        totalCount: 1,
        page: 1,
        pageSize: 50,
        hasNext: false,
        hasPrevious: false,
      },
    },
  },
});

function renderAutocomplete(
  props: Partial<React.ComponentProps<typeof ClientAutocomplete>> = {},
  mocks: MockedResponse[] = []
) {
  const onClientSelect = jest.fn();
  render(
    <MockedProvider mocks={mocks}>
      <ClientAutocomplete
        selectedClient={null}
        onClientSelect={onClientSelect}
        {...props}
      />
    </MockedProvider>
  );
  return { onClientSelect };
}

describe("ClientAutocomplete", () => {
  it("shows the placeholder until a client is chosen", () => {
    renderAutocomplete();

    expect(
      screen.getByRole("combobox", { name: "ariaLabel" })
    ).toHaveTextContent("placeholder");
  });

  it("shows the selected client's name and email", () => {
    renderAutocomplete({
      selectedClient: clientRow as unknown as React.ComponentProps<
        typeof ClientAutocomplete
      >["selectedClient"],
    });

    expect(screen.getByText("Ana Ruiz")).toBeInTheDocument();
    expect(screen.getByText("ana@example.com")).toBeInTheDocument();
  });

  it("asks for a minimum number of characters before searching", async () => {
    const user = userEvent.setup();
    renderAutocomplete();

    await user.click(screen.getByRole("combobox"));

    expect(await screen.findByText(/minCharsHint/)).toBeInTheDocument();
  });

  it("queries immediately when minSearchLength is 0", async () => {
    const user = userEvent.setup();
    const { onClientSelect } = renderAutocomplete({ minSearchLength: 0 }, [
      listMock(""),
    ]);

    await user.click(screen.getByRole("combobox"));

    const option = await screen.findByText("Ana Ruiz", undefined, {
      timeout: 3000,
    });
    await user.click(option);

    await waitFor(() =>
      expect(onClientSelect).toHaveBeenCalledWith(
        expect.objectContaining({ id: "c1", fullName: "Ana Ruiz" })
      )
    );
  });

  it("surfaces a query failure", async () => {
    const user = userEvent.setup();
    renderAutocomplete({ minSearchLength: 0 }, [
      {
        request: {
          query: GET_ALL_CLIENTS,
          variables: {
            page: 1,
            pageSize: 50,
            orderBy: "full_name",
            search: "",
          },
        },
        error: new Error("backend down"),
      },
    ]);

    await user.click(screen.getByRole("combobox"));

    expect(
      await screen.findByText(/error/, undefined, { timeout: 3000 })
    ).toBeInTheDocument();
  });
});
