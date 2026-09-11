import { render, screen } from "@testing-library/react";

import { FormFieldWrapper } from "@/components/common/FormFieldWrapper";

describe("FormFieldWrapper", () => {
  it("wires label, hint and error to the control", () => {
    render(
      <FormFieldWrapper
        id="email"
        label="Email"
        required
        hint="We never share it"
        error="Required"
      >
        {(field) => <input {...field} />}
      </FormFieldWrapper>
    );

    const input = screen.getByLabelText(/Email/);
    expect(input).toHaveAttribute("id", "email");
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAccessibleDescription("Required We never share it");
    expect(screen.getByText("*")).toBeInTheDocument();
  });

  it("omits aria-describedby when there is nothing to describe", () => {
    render(
      <FormFieldWrapper id="name" label="Name">
        {(field) => <input {...field} />}
      </FormFieldWrapper>
    );

    expect(screen.getByLabelText("Name")).not.toHaveAttribute(
      "aria-describedby"
    );
    expect(screen.getByLabelText("Name")).toHaveAttribute(
      "aria-invalid",
      "false"
    );
  });
});
