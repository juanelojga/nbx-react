import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { toast } from "sonner";

import { UPDATE_PRICING_CONFIG } from "@/graphql/mutations/pricing";
import { GET_PRICING_CONFIG } from "@/graphql/queries/pricing";
import { MockedProvider, type MockedResponse } from "@/test/MockedProvider";

import { PricingConfigForm } from "../PricingConfigForm";

jest.mock("next-intl", () => jest.requireActual("@/test/mockNextIntl"));
jest.mock("sonner", () => ({
  toast: { success: jest.fn(), error: jest.fn() },
}));

const configMock: MockedResponse = {
  request: { query: GET_PRICING_CONFIG },
  result: {
    data: {
      pricingConfig: {
        transportationRatePerLb: "2.75",
        serviceFeePercentage: "0.1",
        updatedAt: "2024-06-01T00:00:00Z",
      },
    },
  },
};

function renderForm(mocks: MockedResponse[]) {
  return render(
    <MockedProvider mocks={mocks}>
      <PricingConfigForm />
    </MockedProvider>
  );
}

describe("PricingConfigForm", () => {
  beforeEach(() => jest.clearAllMocks());

  it("prefills the form from the stored configuration", async () => {
    renderForm([configMock]);

    await waitFor(() =>
      expect(screen.getByLabelText("transportationRateLabel")).toHaveValue(2.75)
    );
    expect(screen.getByLabelText("serviceFeePercentageLabel")).toHaveValue(0.1);
  });

  it("shows an error alert when the configuration cannot be loaded", async () => {
    renderForm([
      { request: { query: GET_PRICING_CONFIG }, error: new Error("nope") },
    ]);

    expect(await screen.findByText("loadingError")).toBeInTheDocument();
  });

  it("rejects a negative rate and a fee outside 0-1", async () => {
    const user = userEvent.setup();
    renderForm([configMock]);
    await waitFor(() =>
      expect(screen.getByLabelText("transportationRateLabel")).toHaveValue(2.75)
    );

    const rate = screen.getByLabelText("transportationRateLabel");
    const fee = screen.getByLabelText("serviceFeePercentageLabel");
    await user.clear(rate);
    await user.type(rate, "-1");
    await user.clear(fee);
    await user.type(fee, "101");
    await user.click(screen.getByRole("button", { name: /saveButton/ }));

    expect(
      await screen.findByText("transportationRateInvalid")
    ).toBeInTheDocument();
    expect(screen.getByText("serviceFeePercentageInvalid")).toBeInTheDocument();
    expect(toast.success).not.toHaveBeenCalled();
  });

  it("submits parsed numbers and confirms with a toast", async () => {
    const user = userEvent.setup();
    renderForm([
      configMock,
      {
        request: {
          query: UPDATE_PRICING_CONFIG,
          variables: {
            transportationRatePerLb: 3.5,
            serviceFeePercentage: 0.1,
          },
        },
        result: {
          data: {
            updatePricingConfig: {
              pricingConfig: {
                transportationRatePerLb: "3.5",
                serviceFeePercentage: "0.1",
                updatedAt: "2024-06-02T00:00:00Z",
              },
            },
          },
        },
      },
      configMock,
    ]);
    await waitFor(() =>
      expect(screen.getByLabelText("transportationRateLabel")).toHaveValue(2.75)
    );

    const rate = screen.getByLabelText("transportationRateLabel");
    await user.clear(rate);
    await user.type(rate, "3.5");
    await user.click(screen.getByRole("button", { name: /saveButton/ }));

    await waitFor(() =>
      expect(toast.success).toHaveBeenCalledWith("successTitle", {
        description: "successDescription",
      })
    );
  });
});
