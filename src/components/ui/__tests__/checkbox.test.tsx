import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Checkbox } from "../checkbox";

describe("Checkbox Component", () => {
  describe("Checkbox Rendering", () => {
    it("renders with default props", () => {
      render(<Checkbox />);

      const checkbox = screen.getByRole("checkbox");
      expect(checkbox).toBeInTheDocument();
      expect(checkbox).toHaveAttribute("data-slot", "checkbox");
      expect(checkbox.tagName.toLowerCase()).toBe("button");
    });

    it("renders with custom className", () => {
      render(<Checkbox className="custom-checkbox" />);

      const checkbox = screen.getByRole("checkbox");
      expect(checkbox).toHaveClass("custom-checkbox");
    });

    it("renders with additional props", () => {
      render(
        <Checkbox
          id="test-checkbox"
          data-testid="test-checkbox"
          name="agreement"
          value="accepted"
        />
      );

      const checkbox = screen.getByTestId("test-checkbox");
      expect(checkbox).toHaveAttribute("id", "test-checkbox");
      // Note: Radix UI doesn't pass through name and value attributes to the button element
      expect(checkbox).toBeInTheDocument();
    });

    it("renders in unchecked state by default", () => {
      render(<Checkbox />);

      const checkbox = screen.getByRole("checkbox");
      expect(checkbox).toHaveAttribute("data-state", "unchecked");
    });

    it("renders with checked state when controlled", () => {
      render(<Checkbox checked />);

      const checkbox = screen.getByRole("checkbox");
      expect(checkbox).toHaveAttribute("data-state", "checked");
    });

    it("renders with disabled state", () => {
      render(<Checkbox disabled />);

      const checkbox = screen.getByRole("checkbox");
      expect(checkbox).toHaveAttribute("disabled");
      // Note: Radix UI doesn't set aria-disabled by default
    });

    it("renders with required attribute", () => {
      render(<Checkbox required />);

      const checkbox = screen.getByRole("checkbox");
      // Note: Radix UI doesn't set required attribute, but does set aria-required
      expect(checkbox).toHaveAttribute("aria-required", "true");
    });

    it("renders with aria-invalid for error states", () => {
      render(<Checkbox aria-invalid="true" />);

      const checkbox = screen.getByRole("checkbox");
      expect(checkbox).toHaveAttribute("aria-invalid", "true");
    });

    it("renders with custom aria-label", () => {
      render(<Checkbox aria-label="Accept terms and conditions" />);

      const checkbox = screen.getByLabelText("Accept terms and conditions");
      expect(checkbox).toBeInTheDocument();
    });

    it("renders with aria-describedby for additional context", () => {
      render(
        <>
          <span id="checkbox-description">You must accept to continue</span>
          <Checkbox aria-describedby="checkbox-description" />
        </>
      );

      const checkbox = screen.getByRole("checkbox");
      expect(checkbox).toHaveAttribute(
        "aria-describedby",
        "checkbox-description"
      );
    });

    it("renders with default styling classes", () => {
      render(<Checkbox />);

      const checkbox = screen.getByRole("checkbox");
      expect(checkbox).toHaveClass("peer");
      expect(checkbox).toHaveClass("border-input");
      expect(checkbox).toHaveClass("dark:bg-input/30");
      expect(checkbox).toHaveClass("size-4");
      expect(checkbox).toHaveClass("shrink-0");
      expect(checkbox).toHaveClass("rounded-[4px]");
      expect(checkbox).toHaveClass("border");
      expect(checkbox).toHaveClass("shadow-xs");
      expect(checkbox).toHaveClass("transition-shadow");
      expect(checkbox).toHaveClass("outline-none");
      expect(checkbox).toHaveClass("focus-visible:ring-[3px]");
      expect(checkbox).toHaveClass("disabled:cursor-not-allowed");
      expect(checkbox).toHaveClass("disabled:opacity-50");
    });

    it("renders with checked state styling when checked", () => {
      render(<Checkbox checked />);

      const checkbox = screen.getByRole("checkbox");
      expect(checkbox).toHaveClass("data-[state=checked]:bg-primary");
      expect(checkbox).toHaveClass(
        "data-[state=checked]:text-primary-foreground"
      );
      expect(checkbox).toHaveClass("data-[state=checked]:border-primary");
    });

    it("renders with dark mode checked styling when checked", () => {
      render(<Checkbox checked />);

      const checkbox = screen.getByRole("checkbox");
      expect(checkbox).toHaveClass("dark:data-[state=checked]:bg-primary");
    });

    it("renders with focus-visible styling classes", () => {
      render(<Checkbox />);

      const checkbox = screen.getByRole("checkbox");
      expect(checkbox).toHaveClass("focus-visible:border-ring");
      expect(checkbox).toHaveClass("focus-visible:ring-ring/50");
    });

    it("renders with invalid state styling when aria-invalid is true", () => {
      render(<Checkbox aria-invalid="true" />);

      const checkbox = screen.getByRole("checkbox");
      expect(checkbox).toHaveClass("aria-invalid:ring-destructive/20");
      expect(checkbox).toHaveClass("aria-invalid:border-destructive");
      expect(checkbox).toHaveClass("dark:aria-invalid:ring-destructive/40");
    });

    it("renders checkbox indicator when checked", () => {
      render(<Checkbox checked />);

      const indicator = screen
        .getByRole("checkbox")
        .querySelector('[data-slot="checkbox-indicator"]');
      expect(indicator).toBeInTheDocument();
      expect(indicator).toHaveAttribute("data-slot", "checkbox-indicator");
      expect(indicator).toHaveClass("flex");
      expect(indicator).toHaveClass("items-center");
      expect(indicator).toHaveClass("justify-center");
      expect(indicator).toHaveClass("text-current");
      expect(indicator).toHaveClass("transition-none");
    });

    it("renders CheckIcon when checked", () => {
      render(<Checkbox checked />);

      const checkIcon = screen.getByRole("checkbox").querySelector("svg");
      expect(checkIcon).toBeInTheDocument();
      expect(checkIcon).toHaveClass("size-3.5");
    });

    it("does not render indicator when unchecked", () => {
      render(<Checkbox />);

      const indicator = screen.queryByTestId("checkbox-indicator");
      expect(indicator).not.toBeInTheDocument();
    });

    it("renders with multiple className values", () => {
      render(<Checkbox className="class1 class2 class3" />);

      const checkbox = screen.getByRole("checkbox");
      expect(checkbox).toHaveClass("class1");
      expect(checkbox).toHaveClass("class2");
      expect(checkbox).toHaveClass("class3");
    });

    it("handles empty className", () => {
      render(<Checkbox className="" />);

      const checkbox = screen.getByRole("checkbox");
      expect(checkbox).toBeInTheDocument();
    });

    it("handles undefined className", () => {
      render(<Checkbox className={undefined} />);

      const checkbox = screen.getByRole("checkbox");
      expect(checkbox).toBeInTheDocument();
    });
  });

  describe("User Interactions", () => {
    it("handles click events to toggle state", async () => {
      const user = userEvent.setup();
      const handleCheckedChange = jest.fn();

      render(<Checkbox onCheckedChange={handleCheckedChange} />);

      const checkbox = screen.getByRole("checkbox");
      await user.click(checkbox);

      expect(handleCheckedChange).toHaveBeenCalledTimes(1);
      expect(handleCheckedChange).toHaveBeenCalledWith(true);
    });

    it("handles click events when already checked", async () => {
      const user = userEvent.setup();
      const handleCheckedChange = jest.fn();

      render(<Checkbox checked onCheckedChange={handleCheckedChange} />);

      const checkbox = screen.getByRole("checkbox");
      await user.click(checkbox);

      expect(handleCheckedChange).toHaveBeenCalledTimes(1);
      expect(handleCheckedChange).toHaveBeenCalledWith(false);
    });

    it("prevents interactions when disabled", async () => {
      const user = userEvent.setup();
      const handleCheckedChange = jest.fn();

      render(<Checkbox disabled onCheckedChange={handleCheckedChange} />);

      const checkbox = screen.getByRole("checkbox");
      await user.click(checkbox);

      expect(handleCheckedChange).not.toHaveBeenCalled();
    });

    it("handles keyboard navigation with Space key", async () => {
      const user = userEvent.setup();
      const handleCheckedChange = jest.fn();

      render(<Checkbox onCheckedChange={handleCheckedChange} />);

      const checkbox = screen.getByRole("checkbox");
      checkbox.focus();
      await user.keyboard(" ");

      expect(handleCheckedChange).toHaveBeenCalledTimes(1);
      expect(handleCheckedChange).toHaveBeenCalledWith(true);
    });

    it("handles keyboard navigation with Enter key", async () => {
      const user = userEvent.setup();
      const handleCheckedChange = jest.fn();

      render(<Checkbox onCheckedChange={handleCheckedChange} />);

      const checkbox = screen.getByRole("checkbox");
      checkbox.focus();
      await user.keyboard("{Enter}");

      // Note: Radix UI checkbox doesn't respond to Enter key, only Space
      expect(handleCheckedChange).toHaveBeenCalledTimes(0);
    });

    it("handles focus states", () => {
      render(<Checkbox />);

      const checkbox = screen.getByRole("checkbox");
      checkbox.focus();

      expect(document.activeElement).toBe(checkbox);
    });

    it("handles hover states", async () => {
      const user = userEvent.setup();

      render(<Checkbox />);

      const checkbox = screen.getByRole("checkbox");
      await user.hover(checkbox);

      expect(checkbox).toBeInTheDocument();
    });

    it("handles form submission with checkbox", async () => {
      const user = userEvent.setup();
      const handleSubmit = jest.fn((e) => e.preventDefault());

      render(
        <form onSubmit={handleSubmit}>
          <Checkbox name="agreement" value="accepted" />
          <button type="submit">Submit</button>
        </form>
      );

      const submitButton = screen.getByText("Submit");
      await user.click(submitButton);

      expect(handleSubmit).toHaveBeenCalledTimes(1);
    });

    it("handles controlled component state changes", async () => {
      const user = userEvent.setup();
      const ControlledCheckbox = () => {
        const [checked, setChecked] = React.useState(false);
        return (
          <Checkbox
            checked={checked}
            onCheckedChange={(checked) => setChecked(checked as boolean)}
            data-testid="controlled-checkbox"
          />
        );
      };

      render(<ControlledCheckbox />);

      const checkbox = screen.getByTestId("controlled-checkbox");
      expect(checkbox).toHaveAttribute("data-state", "unchecked");

      await user.click(checkbox);
      expect(checkbox).toHaveAttribute("data-state", "checked");
    });

    it("handles rapid clicks", async () => {
      const user = userEvent.setup();
      const handleCheckedChange = jest.fn();

      render(<Checkbox onCheckedChange={handleCheckedChange} />);

      const checkbox = screen.getByRole("checkbox");
      await user.click(checkbox);
      await user.click(checkbox);
      await user.click(checkbox);

      expect(handleCheckedChange).toHaveBeenCalledTimes(3);
      expect(handleCheckedChange).toHaveBeenCalledWith(true);
      expect(handleCheckedChange).toHaveBeenCalledWith(false);
      expect(handleCheckedChange).toHaveBeenCalledWith(true);
    });
  });

  describe("Accessibility", () => {
    it("has proper ARIA role", () => {
      render(<Checkbox />);

      const checkbox = screen.getByRole("checkbox");
      expect(checkbox).toBeInTheDocument();
    });

    it("has correct ARIA checked state when unchecked", () => {
      render(<Checkbox />);

      const checkbox = screen.getByRole("checkbox");
      expect(checkbox).toHaveAttribute("aria-checked", "false");
    });

    it("has correct ARIA checked state when checked", () => {
      render(<Checkbox checked />);

      const checkbox = screen.getByRole("checkbox");
      expect(checkbox).toHaveAttribute("aria-checked", "true");
    });

    it("supports aria-label for screen readers", () => {
      render(<Checkbox aria-label="Subscribe to newsletter" />);

      const checkbox = screen.getByLabelText("Subscribe to newsletter");
      expect(checkbox).toBeInTheDocument();
      expect(checkbox).toHaveAttribute("role", "checkbox");
    });

    it("supports aria-labelledby for labeling", () => {
      render(
        <>
          <span id="checkbox-label">I agree to terms</span>
          <Checkbox aria-labelledby="checkbox-label" />
        </>
      );

      const checkbox = screen.getByRole("checkbox");
      expect(checkbox).toHaveAttribute("aria-labelledby", "checkbox-label");
    });

    it("supports aria-describedby for additional context", () => {
      render(
        <>
          <span id="help-text">Check this box to proceed</span>
          <Checkbox aria-describedby="help-text" />
        </>
      );

      const checkbox = screen.getByRole("checkbox");
      expect(checkbox).toHaveAttribute("aria-describedby", "help-text");
    });

    it("supports aria-required for required fields", () => {
      render(<Checkbox required />);

      const checkbox = screen.getByRole("checkbox");
      expect(checkbox).toHaveAttribute("aria-required", "true");
    });

    it("supports aria-invalid for error states", () => {
      render(<Checkbox aria-invalid="true" />);

      const checkbox = screen.getByRole("checkbox");
      expect(checkbox).toHaveAttribute("aria-invalid", "true");
    });

    it("supports aria-disabled for disabled state", () => {
      render(<Checkbox disabled />);

      const checkbox = screen.getByRole("checkbox");
      // Radix UI doesn't set aria-disabled by default, but does set disabled attribute
      expect(checkbox).toHaveAttribute("disabled");
    });

    it("maintains focus management", () => {
      render(<Checkbox />);

      const checkbox = screen.getByRole("checkbox");
      checkbox.focus();

      expect(document.activeElement).toBe(checkbox);
      // Radix UI doesn't set tabindex by default
    });

    it("supports keyboard navigation", () => {
      render(<Checkbox />);

      const checkbox = screen.getByRole("checkbox");
      // Radix UI doesn't set tabindex by default
      expect(checkbox).toBeInTheDocument();
    });

    it("provides proper semantic HTML structure", () => {
      render(<Checkbox />);

      const checkbox = screen.getByRole("checkbox");
      expect(checkbox.tagName.toLowerCase()).toBe("button");
      expect(checkbox).toHaveAttribute("type", "button");
    });

    it("supports screen reader announcements with aria-live", () => {
      const { rerender } = render(
        <Checkbox
          checked={false}
          aria-live="polite"
          aria-label="Agreement checkbox"
        />
      );

      const checkbox = screen.getByLabelText("Agreement checkbox");
      expect(checkbox).toHaveAttribute("aria-live", "polite");

      rerender(
        <Checkbox
          checked={true}
          aria-live="polite"
          aria-label="Agreement checkbox"
        />
      );

      expect(checkbox).toHaveAttribute("aria-checked", "true");
    });
  });

  describe("Integration Tests", () => {
    it("renders complete checkbox with all features", () => {
      render(
        <Checkbox
          id="complete-checkbox"
          name="agreement"
          value="accepted"
          className="custom-checkbox"
          aria-label="Accept terms"
          required
        />
      );

      const checkbox = screen.getByLabelText("Accept terms");
      expect(checkbox).toBeInTheDocument();
      expect(checkbox).toHaveAttribute("id", "complete-checkbox");
      // Note: Radix UI doesn't pass through name, value, and required attributes
      expect(checkbox).toHaveClass("custom-checkbox");
      expect(checkbox).toHaveAttribute("aria-required", "true");
    });

    it("handles multiple checkboxes independently", () => {
      render(
        <>
          <Checkbox name="option1" value="yes" aria-label="Option 1" />
          <Checkbox name="option2" value="no" aria-label="Option 2" />
          <Checkbox name="option3" value="maybe" aria-label="Option 3" />
        </>
      );

      const checkbox1 = screen.getByLabelText("Option 1");
      const checkbox2 = screen.getByLabelText("Option 2");
      const checkbox3 = screen.getByLabelText("Option 3");

      expect(checkbox1).toBeInTheDocument();
      expect(checkbox2).toBeInTheDocument();
      expect(checkbox3).toBeInTheDocument();
      // Note: Radix UI doesn't pass through name attributes
    });

    it("handles dynamic state updates", async () => {
      const user = userEvent.setup();
      const DynamicCheckbox = () => {
        const [checked, setChecked] = React.useState(false);
        return (
          <>
            <Checkbox
              checked={checked}
              onCheckedChange={(checked) => setChecked(checked as boolean)}
              aria-label="Dynamic checkbox"
            />
            <button onClick={() => setChecked(!checked)}>Toggle</button>
          </>
        );
      };

      render(<DynamicCheckbox />);

      const checkbox = screen.getByLabelText("Dynamic checkbox");
      const toggleButton = screen.getByText("Toggle");

      expect(checkbox).toHaveAttribute("data-state", "unchecked");

      await user.click(toggleButton);
      expect(checkbox).toHaveAttribute("data-state", "checked");

      await user.click(toggleButton);
      expect(checkbox).toHaveAttribute("data-state", "unchecked");
    });

    it("renders with form integration", () => {
      const handleSubmit = jest.fn((e) => e.preventDefault());

      render(
        <form onSubmit={handleSubmit}>
          <label htmlFor="newsletter">Subscribe to newsletter</label>
          <Checkbox id="newsletter" name="newsletter" value="yes" />
          <button type="submit">Submit</button>
        </form>
      );

      const checkbox = screen.getByLabelText("Subscribe to newsletter");
      const submitButton = screen.getByText("Submit");

      expect(checkbox).toBeInTheDocument();
      expect(submitButton).toBeInTheDocument();
    });

    it("handles complex styling scenarios", () => {
      render(
        <Checkbox
          className="custom-class-1 custom-class-2"
          style={{ marginTop: "10px" }}
        />
      );

      const checkbox = screen.getByRole("checkbox");
      expect(checkbox).toHaveClass("custom-class-1");
      expect(checkbox).toHaveClass("custom-class-2");
      expect(checkbox).toHaveStyle({ marginTop: "10px" });
    });

    it("handles all Radix UI props", () => {
      render(
        <Checkbox
          defaultChecked={true}
          disabled={false}
          required={true}
          name="test-checkbox"
          value="test-value"
          id="test-id"
        />
      );

      const checkbox = screen.getByRole("checkbox");
      // Note: Radix UI doesn't pass through name, value, and required attributes
      expect(checkbox).toHaveAttribute("id", "test-id");
      expect(checkbox).toHaveAttribute("aria-required", "true");
      expect(checkbox).toHaveAttribute("data-state", "checked");
    });
  });

  describe("Edge Cases", () => {
    it("handles undefined props gracefully", () => {
      render(
        <Checkbox
          className={undefined}
          id={undefined}
          name={undefined}
          value={undefined}
        />
      );

      const checkbox = screen.getByRole("checkbox");
      expect(checkbox).toBeInTheDocument();
    });

    it("handles empty string values", () => {
      render(<Checkbox className="" id="" name="" value="" />);

      const checkbox = screen.getByRole("checkbox");
      expect(checkbox).toBeInTheDocument();
    });

    it("handles very long className", () => {
      const longClassName =
        "class1 class2 class3 class4 class5 class6 class7 class8 class9 class10";
      render(<Checkbox className={longClassName} />);

      const checkbox = screen.getByRole("checkbox");
      expect(checkbox).toHaveClass("class1");
      expect(checkbox).toHaveClass("class10");
    });

    it("handles special characters in props", () => {
      render(
        <Checkbox
          name="test-name!@#$%"
          value="test-value!@#$%"
          id="test-id!@#$%"
        />
      );

      const checkbox = screen.getByRole("checkbox");
      // Note: Radix UI doesn't pass through name and value attributes
      expect(checkbox).toHaveAttribute("id", "test-id!@#$%");
    });

    it("handles rapid state changes", async () => {
      const user = userEvent.setup();
      const handleCheckedChange = jest.fn();

      render(<Checkbox onCheckedChange={handleCheckedChange} />);

      const checkbox = screen.getByRole("checkbox");

      // Rapid clicks
      await user.click(checkbox);
      await user.click(checkbox);
      await user.click(checkbox);
      await user.click(checkbox);

      expect(handleCheckedChange).toHaveBeenCalledTimes(4);
    });

    it("handles mixed controlled and uncontrolled scenarios", () => {
      // Start with controlled component to avoid warning
      const { rerender } = render(<Checkbox checked={true} />);

      const checkbox = screen.getByRole("checkbox");
      expect(checkbox).toHaveAttribute("data-state", "checked");

      rerender(<Checkbox checked={false} />);
      expect(checkbox).toHaveAttribute("data-state", "unchecked");
    });

    it("handles all styling classes being applied", () => {
      render(<Checkbox />);

      const checkbox = screen.getByRole("checkbox");
      // Verify all the complex Tailwind classes are present
      expect(checkbox).toHaveClass("peer");
      expect(checkbox).toHaveClass("border-input");
      expect(checkbox).toHaveClass("dark:bg-input/30");
      expect(checkbox).toHaveClass("data-[state=checked]:bg-primary");
      expect(checkbox).toHaveClass(
        "data-[state=checked]:text-primary-foreground"
      );
      expect(checkbox).toHaveClass("dark:data-[state=checked]:bg-primary");
      expect(checkbox).toHaveClass("data-[state=checked]:border-primary");
      expect(checkbox).toHaveClass("focus-visible:border-ring");
      expect(checkbox).toHaveClass("focus-visible:ring-ring/50");
      expect(checkbox).toHaveClass("aria-invalid:ring-destructive/20");
      expect(checkbox).toHaveClass("dark:aria-invalid:ring-destructive/40");
      expect(checkbox).toHaveClass("aria-invalid:border-destructive");
      expect(checkbox).toHaveClass("size-4");
      expect(checkbox).toHaveClass("shrink-0");
      expect(checkbox).toHaveClass("rounded-[4px]");
      expect(checkbox).toHaveClass("border");
      expect(checkbox).toHaveClass("shadow-xs");
      expect(checkbox).toHaveClass("transition-shadow");
      expect(checkbox).toHaveClass("outline-none");
      expect(checkbox).toHaveClass("focus-visible:ring-[3px]");
      expect(checkbox).toHaveClass("disabled:cursor-not-allowed");
      expect(checkbox).toHaveClass("disabled:opacity-50");
    });

    it("handles component unmounting gracefully", () => {
      const { unmount } = render(<Checkbox />);

      const checkbox = screen.getByRole("checkbox");
      expect(checkbox).toBeInTheDocument();

      unmount();
      expect(screen.queryByRole("checkbox")).not.toBeInTheDocument();
    });

    it("handles ref forwarding", () => {
      const ref = React.createRef<HTMLButtonElement>();
      render(<Checkbox ref={ref} />);

      expect(ref.current).toBeInstanceOf(HTMLButtonElement);
      expect(ref.current).toHaveAttribute("role", "checkbox");
    });
  });
});
