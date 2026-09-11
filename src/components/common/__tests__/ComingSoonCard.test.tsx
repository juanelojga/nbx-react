import { render, screen } from "@testing-library/react";

import { ComingSoonCard } from "@/components/common/ComingSoonCard";

jest.mock("next-intl", () => jest.requireActual("@/test/mockNextIntl"));

describe("ComingSoonCard", () => {
  it("renders the intro and one list item per feature", () => {
    render(<ComingSoonCard intro="Soon" features={["a", "b", "c"]} />);

    expect(screen.getByText("comingSoon")).toBeInTheDocument();
    expect(screen.getByText("Soon")).toBeInTheDocument();
    expect(screen.getAllByRole("listitem")).toHaveLength(3);
  });
});
