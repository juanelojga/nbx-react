import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Button, buttonVariants } from "../button";

describe("Button Component", () => {
  describe("Button Rendering", () => {
    it("renders with default variant and size", () => {
      render(<Button>Default button</Button>);

      const button = screen.getByText("Default button");
      expect(button).toBeInTheDocument();
      expect(button).toHaveAttribute("data-slot", "button");
      expect(button.tagName.toLowerCase()).toBe("button");
    });

    it("renders with all variant types", () => {
      const variants = [
        "default",
        "destructive",
        "outline",
        "secondary",
        "ghost",
        "link",
      ] as const;

      variants.forEach((variant) => {
        const { unmount } = render(
          <Button variant={variant}>{variant} button</Button>
        );
        const button = screen.getByText(`${variant} button`);
        expect(button).toBeInTheDocument();
        expect(button).toHaveAttribute("data-slot", "button");
        unmount();
      });
    });

    it("renders with all size types", () => {
      const sizes = ["default", "sm", "lg", "icon"] as const;

      sizes.forEach((size) => {
        const { unmount } = render(<Button size={size}>{size} button</Button>);
        const button = screen.getByText(`${size} button`);
        expect(button).toBeInTheDocument();
        expect(button).toHaveAttribute("data-slot", "button");
        unmount();
      });
    });

    it("renders as button element by default", () => {
      render(<Button>Button element</Button>);

      const button = screen.getByText("Button element");
      expect(button.tagName.toLowerCase()).toBe("button");
    });

    it("renders with asChild prop using Slot", () => {
      render(
        <Button asChild>
          <a href="https://example.com">Link button</a>
        </Button>
      );

      const button = screen.getByText("Link button");
      expect(button).toBeInTheDocument();
      expect(button.tagName.toLowerCase()).toBe("a");
      expect(button).toHaveAttribute("href", "https://example.com");
      expect(button).toHaveAttribute("data-slot", "button");
    });

    it("forwards additional props", () => {
      render(
        <Button id="test-id" data-testid="test-button" disabled>
          Button with props
        </Button>
      );

      const button = screen.getByText("Button with props");
      expect(button).toHaveAttribute("id", "test-id");
      expect(button).toHaveAttribute("data-testid", "test-button");
      expect(button).toBeDisabled();
    });

    it("renders with SVG icon", () => {
      render(
        <Button>
          <svg data-testid="button-icon" />
          Button with icon
        </Button>
      );

      expect(screen.getByTestId("button-icon")).toBeInTheDocument();
      expect(screen.getByText("Button with icon")).toBeInTheDocument();
    });

    it("renders with multiple SVG icons", () => {
      render(
        <Button>
          <svg data-testid="icon-1" />
          <svg data-testid="icon-2" />
          Multiple icons
        </Button>
      );

      expect(screen.getByTestId("icon-1")).toBeInTheDocument();
      expect(screen.getByTestId("icon-2")).toBeInTheDocument();
      expect(screen.getByText("Multiple icons")).toBeInTheDocument();
    });

    it("handles empty content gracefully", () => {
      render(<Button data-testid="empty-button" />);

      const button = screen.getByTestId("empty-button");
      expect(button).toBeInTheDocument();
      expect(button).toBeEmptyDOMElement();
    });

    it("renders with numeric content", () => {
      render(<Button>42</Button>);

      const button = screen.getByText("42");
      expect(button).toBeInTheDocument();
      expect(button).toHaveAttribute("data-slot", "button");
    });

    it("renders with special characters", () => {
      render(<Button>!@#$%^&*()</Button>);

      const button = screen.getByText("!@#$%^&*()");
      expect(button).toBeInTheDocument();
      expect(button).toHaveAttribute("data-slot", "button");
    });

    it("renders with long text content", () => {
      const longText =
        "This is a very long button text that should still render correctly";
      render(<Button>{longText}</Button>);

      const button = screen.getByText(longText);
      expect(button).toBeInTheDocument();
      expect(button).toHaveAttribute("data-slot", "button");
    });

    it("renders with nested elements", () => {
      render(
        <Button>
          <strong>Bold text</strong> and <em>italic text</em>
        </Button>
      );

      expect(screen.getByText("Bold text")).toBeInTheDocument();
      expect(screen.getByText("italic text")).toBeInTheDocument();
      expect(screen.getByText("and")).toBeInTheDocument();
    });
  });

  describe("User Interactions", () => {
    it("handles click events", async () => {
      const user = userEvent.setup();
      const handleClick = jest.fn();

      render(<Button onClick={handleClick}>Clickable button</Button>);

      const button = screen.getByText("Clickable button");
      await user.click(button);

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("handles disabled state and prevents clicks", async () => {
      const user = userEvent.setup();
      const handleClick = jest.fn();

      render(
        <Button onClick={handleClick} disabled>
          Disabled button
        </Button>
      );

      const button = screen.getByText("Disabled button");
      await user.click(button);

      expect(handleClick).not.toHaveBeenCalled();
      expect(button).toBeDisabled();
    });

    it("handles keyboard navigation with Enter key", async () => {
      const user = userEvent.setup();
      const handleClick = jest.fn();

      render(<Button onClick={handleClick}>Keyboard button</Button>);

      const button = screen.getByText("Keyboard button");
      button.focus();
      await user.keyboard("{Enter}");

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("handles keyboard navigation with Space key", async () => {
      const user = userEvent.setup();
      const handleClick = jest.fn();

      render(<Button onClick={handleClick}>Space button</Button>);

      const button = screen.getByText("Space button");
      button.focus();
      await user.keyboard(" ");

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("handles hover states", async () => {
      const user = userEvent.setup();

      render(<Button>Hover button</Button>);

      const button = screen.getByText("Hover button");
      await user.hover(button);

      expect(button).toBeInTheDocument();
    });

    it("handles focus states", () => {
      render(<Button>Focusable button</Button>);

      const button = screen.getByText("Focusable button");
      button.focus();

      expect(button).toHaveFocus();
    });

    it("handles focus states when rendered as link", () => {
      render(
        <Button asChild>
          <a href="https://example.com">Focusable link</a>
        </Button>
      );

      const link = screen.getByText("Focusable link");
      link.focus();

      expect(link).toHaveFocus();
    });

    it("handles form submission", async () => {
      const user = userEvent.setup();
      const handleSubmit = jest.fn((e) => e.preventDefault());

      render(
        <form onSubmit={handleSubmit}>
          <Button type="submit">Submit button</Button>
        </form>
      );

      const button = screen.getByText("Submit button");
      await user.click(button);

      expect(handleSubmit).toHaveBeenCalledTimes(1);
    });
  });

  describe("Accessibility", () => {
    it("has proper semantic HTML structure", () => {
      render(<Button>Accessible button</Button>);

      const button = screen.getByText("Accessible button");
      expect(button).toBeInTheDocument();
      expect(button.tagName.toLowerCase()).toBe("button");
    });

    it("maintains accessibility when rendered as link", () => {
      render(
        <Button asChild>
          <a href="https://example.com" aria-label="Navigation button">
            Link button
          </a>
        </Button>
      );

      const link = screen.getByLabelText("Navigation button");
      expect(link).toBeInTheDocument();
      expect(link.tagName.toLowerCase()).toBe("a");
      expect(link).toHaveAttribute("href", "https://example.com");
    });

    it("supports ARIA attributes", () => {
      render(
        <Button role="menuitem" aria-haspopup="true" aria-expanded="false">
          Menu button
        </Button>
      );

      const button = screen.getByRole("menuitem");
      expect(button).toBeInTheDocument();
      expect(button).toHaveAttribute("aria-haspopup", "true");
      expect(button).toHaveAttribute("aria-expanded", "false");
    });

    it("supports aria-label for screen readers", () => {
      render(<Button aria-label="Close dialog">X</Button>);

      const button = screen.getByLabelText("Close dialog");
      expect(button).toBeInTheDocument();
      expect(button).toHaveTextContent("X");
    });

    it("supports aria-describedby for additional context", () => {
      render(
        <>
          <span id="description">Additional information</span>
          <Button aria-describedby="description">
            Button with description
          </Button>
        </>
      );

      const button = screen.getByText("Button with description");
      expect(button).toHaveAttribute("aria-describedby", "description");
    });

    it("supports aria-disabled for semantic disabled state", () => {
      render(
        <Button aria-disabled="true" disabled>
          Semantically disabled
        </Button>
      );

      const button = screen.getByText("Semantically disabled");
      expect(button).toHaveAttribute("aria-disabled", "true");
      expect(button).toBeDisabled();
    });

    it("maintains focus management with asChild", () => {
      render(
        <Button asChild>
          <button aria-label="Custom button">Custom element</button>
        </Button>
      );

      const button = screen.getByLabelText("Custom button");
      expect(button).toBeInTheDocument();
      expect(button.tagName.toLowerCase()).toBe("button");
    });
  });

  describe("Integration Tests", () => {
    it("renders complete button with all features", () => {
      render(
        <Button
          variant="destructive"
          size="lg"
          className="custom-button"
          id="test-button"
          onClick={jest.fn()}
        >
          <svg data-testid="error-icon" />
          Error Button
        </Button>
      );

      const button = screen.getByText("Error Button");
      expect(button).toBeInTheDocument();
      expect(button).toHaveAttribute("id", "test-button");
      expect(screen.getByTestId("error-icon")).toBeInTheDocument();
    });

    it("renders multiple buttons with different variants", () => {
      render(
        <>
          <Button variant="default">Default</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="link">Link</Button>
        </>
      );

      expect(screen.getByText("Default")).toBeInTheDocument();
      expect(screen.getByText("Secondary")).toBeInTheDocument();
      expect(screen.getByText("Destructive")).toBeInTheDocument();
      expect(screen.getByText("Outline")).toBeInTheDocument();
      expect(screen.getByText("Ghost")).toBeInTheDocument();
      expect(screen.getByText("Link")).toBeInTheDocument();
    });

    it("handles dynamic content updates", async () => {
      const { rerender } = render(<Button>Initial content</Button>);

      expect(screen.getByText("Initial content")).toBeInTheDocument();

      rerender(<Button>Updated content</Button>);

      expect(screen.getByText("Updated content")).toBeInTheDocument();
      expect(screen.queryByText("Initial content")).not.toBeInTheDocument();
    });

    it("handles variant prop changes", async () => {
      const { rerender } = render(
        <Button variant="default">Dynamic button</Button>
      );

      const button = screen.getByText("Dynamic button");
      expect(button).toBeInTheDocument();

      rerender(<Button variant="destructive">Dynamic button</Button>);

      expect(screen.getByText("Dynamic button")).toBeInTheDocument();
    });

    it("handles size prop changes", async () => {
      const { rerender } = render(
        <Button size="sm">Size changing button</Button>
      );

      const button = screen.getByText("Size changing button");
      expect(button).toBeInTheDocument();

      rerender(<Button size="lg">Size changing button</Button>);

      expect(screen.getByText("Size changing button")).toBeInTheDocument();
    });

    it("renders with complex nested structure", () => {
      render(
        <Button variant="secondary">
          <span>
            <strong>Complex</strong> <em>nested</em> content
          </span>
          <svg data-testid="nested-icon" />
        </Button>
      );

      expect(screen.getByText("Complex")).toBeInTheDocument();
      expect(screen.getByText("nested")).toBeInTheDocument();
      expect(screen.getByText("content")).toBeInTheDocument();
      expect(screen.getByTestId("nested-icon")).toBeInTheDocument();
    });

    it("handles loading state pattern", () => {
      render(
        <Button disabled>
          <svg data-testid="loading-spinner" className="animate-spin" />
          Loading...
        </Button>
      );

      const button = screen.getByText("Loading...");
      expect(button).toBeInTheDocument();
      expect(button).toBeDisabled();
      expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    it("handles null children gracefully", () => {
      render(<Button data-testid="button">{null}</Button>);

      const button = screen.getByTestId("button");
      expect(button).toBeInTheDocument();
    });

    it("handles undefined children gracefully", () => {
      render(<Button data-testid="button">{undefined}</Button>);

      const button = screen.getByTestId("button");
      expect(button).toBeInTheDocument();
    });

    it("handles boolean children gracefully", () => {
      render(<Button data-testid="button">{true}</Button>);

      const button = screen.getByTestId("button");
      expect(button).toBeInTheDocument();
    });

    it("handles zero as children", () => {
      render(<Button>{0}</Button>);

      const button = screen.getByText("0");
      expect(button).toBeInTheDocument();
    });

    it("handles whitespace content", () => {
      render(<Button data-testid="button"> </Button>);

      const button = screen.getByTestId("button");
      expect(button).toBeInTheDocument();
    });

    it("handles very long single word", () => {
      const longWord = "supercalifragilisticexpialidocious";
      render(<Button>{longWord}</Button>);

      const button = screen.getByText(longWord);
      expect(button).toBeInTheDocument();
    });

    it("handles empty string className", () => {
      render(<Button className="">Empty class</Button>);

      const button = screen.getByText("Empty class");
      expect(button).toBeInTheDocument();
    });

    it("handles undefined className", () => {
      render(<Button className={undefined}>Undefined class</Button>);

      const button = screen.getByText("Undefined class");
      expect(button).toBeInTheDocument();
    });

    it("handles all props being undefined", () => {
      render(
        <Button
          variant={undefined}
          size={undefined}
          className={undefined}
          asChild={undefined}
        >
          All undefined
        </Button>
      );

      const button = screen.getByText("All undefined");
      expect(button).toBeInTheDocument();
      expect(button.tagName.toLowerCase()).toBe("button");
    });
  });

  describe("Button Variants Export", () => {
    it("exports buttonVariants function", () => {
      expect(buttonVariants).toBeDefined();
      expect(typeof buttonVariants).toBe("function");
    });

    it("generates correct classes with buttonVariants", () => {
      const classes = buttonVariants({ variant: "destructive", size: "lg" });
      expect(classes).toContain("bg-destructive");
      expect(classes).toContain("text-destructive-foreground");
      expect(classes).toContain("h-12");
      expect(classes).toContain("px-8");
    });

    it("generates default classes with no props", () => {
      const classes = buttonVariants({});
      expect(classes).toContain("inline-flex");
      expect(classes).toContain("items-center");
      expect(classes).toContain("justify-center");
    });

    it("merges custom classes with buttonVariants", () => {
      const classes = buttonVariants({
        variant: "default",
        size: "default",
        className: "custom-class",
      });
      expect(classes).toContain("custom-class");
      expect(classes).toContain("bg-primary");
    });
  });
});
