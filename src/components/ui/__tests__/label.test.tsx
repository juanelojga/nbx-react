import React from "react";
import { render, screen } from "@testing-library/react";
import { Label } from "../label";

describe("Label Component", () => {
  describe("Label Rendering", () => {
    it("renders with default props", () => {
      render(<Label>Default label</Label>);

      const label = screen.getByText("Default label");
      expect(label).toBeInTheDocument();
      expect(label).toHaveAttribute("data-slot", "label");
      expect(label.tagName.toLowerCase()).toBe("label");
    });

    it("renders with custom className", () => {
      render(<Label className="custom-class">Custom label</Label>);

      const label = screen.getByText("Custom label");
      expect(label).toHaveClass("custom-class");
    });

    it("forwards additional props", () => {
      render(
        <Label id="test-id" data-testid="test-label" htmlFor="input-field">
          Label with props
        </Label>
      );

      const label = screen.getByText("Label with props");
      expect(label).toHaveAttribute("id", "test-id");
      expect(label).toHaveAttribute("data-testid", "test-label");
      expect(label).toHaveAttribute("for", "input-field");
    });

    it("renders with SVG icon", () => {
      render(
        <Label>
          <svg data-testid="label-icon" />
          Label with icon
        </Label>
      );

      expect(screen.getByTestId("label-icon")).toBeInTheDocument();
      expect(screen.getByText("Label with icon")).toBeInTheDocument();
    });

    it("renders with multiple SVG icons", () => {
      render(
        <Label>
          <svg data-testid="icon-1" />
          <svg data-testid="icon-2" />
          Multiple icons
        </Label>
      );

      expect(screen.getByTestId("icon-1")).toBeInTheDocument();
      expect(screen.getByTestId("icon-2")).toBeInTheDocument();
      expect(screen.getByText("Multiple icons")).toBeInTheDocument();
    });

    it("handles empty content gracefully", () => {
      render(<Label data-testid="empty-label" />);

      const label = screen.getByTestId("empty-label");
      expect(label).toBeInTheDocument();
      expect(label).toBeEmptyDOMElement();
    });

    it("renders with numeric content", () => {
      render(<Label>42</Label>);

      const label = screen.getByText("42");
      expect(label).toBeInTheDocument();
      expect(label).toHaveAttribute("data-slot", "label");
    });

    it("renders with special characters", () => {
      render(<Label>!@#$%^&*()</Label>);

      const label = screen.getByText("!@#$%^&*()");
      expect(label).toBeInTheDocument();
      expect(label).toHaveAttribute("data-slot", "label");
    });

    it("renders with long text content", () => {
      const longText =
        "This is a very long label text that should still render correctly";
      render(<Label>{longText}</Label>);

      const label = screen.getByText(longText);
      expect(label).toBeInTheDocument();
      expect(label).toHaveAttribute("data-slot", "label");
    });

    it("renders with nested elements", () => {
      render(
        <Label>
          <strong>Bold text</strong> and <em>italic text</em>
        </Label>
      );

      expect(screen.getByText("Bold text")).toBeInTheDocument();
      expect(screen.getByText("italic text")).toBeInTheDocument();
      expect(screen.getByText("and")).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("has proper semantic HTML structure", () => {
      render(<Label>Accessible label</Label>);

      const label = screen.getByText("Accessible label");
      expect(label).toBeInTheDocument();
      expect(label.tagName.toLowerCase()).toBe("label");
    });

    it("supports htmlFor attribute for form association", () => {
      render(<Label htmlFor="username">Username label</Label>);

      const label = screen.getByText("Username label");
      expect(label).toHaveAttribute("for", "username");
    });

    it("supports ARIA attributes", () => {
      render(
        <Label role="label" aria-describedby="help-text">
          ARIA label
        </Label>
      );

      const label = screen.getByRole("label");
      expect(label).toBeInTheDocument();
      expect(label).toHaveAttribute("aria-describedby", "help-text");
    });

    it("supports aria-label for screen readers", () => {
      render(<Label aria-label="Required field label">*</Label>);

      const label = screen.getByLabelText("Required field label");
      expect(label).toBeInTheDocument();
      expect(label).toHaveTextContent("*");
    });

    it("supports aria-describedby for additional context", () => {
      render(
        <>
          <span id="description">Additional help text</span>
          <Label aria-describedby="description">Helpful label</Label>
        </>
      );

      const label = screen.getByText("Helpful label");
      expect(label).toHaveAttribute("aria-describedby", "description");
    });
  });

  describe("Variant Classes", () => {
    it("applies default label classes", () => {
      render(<Label>Default label</Label>);

      const label = screen.getByText("Default label");
      expect(label).toHaveClass("flex");
      expect(label).toHaveClass("items-center");
      expect(label).toHaveClass("gap-2");
      expect(label).toHaveClass("text-sm");
      expect(label).toHaveClass("leading-none");
      expect(label).toHaveClass("font-semibold");
      expect(label).toHaveClass("text-foreground");
      expect(label).toHaveClass("select-none");
      expect(label).toHaveClass(
        "group-data-[disabled=true]:pointer-events-none"
      );
      expect(label).toHaveClass("group-data-[disabled=true]:opacity-50");
      expect(label).toHaveClass("peer-disabled:cursor-not-allowed");
      expect(label).toHaveClass("peer-disabled:opacity-50");
    });

    it("merges custom classes with default classes", () => {
      render(<Label className="custom-label-class">Custom label</Label>);

      const label = screen.getByText("Custom label");
      expect(label).toHaveClass("custom-label-class");
      expect(label).toHaveClass("flex");
      expect(label).toHaveClass("items-center");
      expect(label).toHaveClass("text-sm");
    });
  });

  describe("Integration Tests", () => {
    it("renders complete label with all features", () => {
      render(
        <Label className="custom-label" id="test-label" htmlFor="test-input">
          <svg data-testid="label-icon" />
          Complete Label
        </Label>
      );

      const label = screen.getByText("Complete Label");
      expect(label).toBeInTheDocument();
      expect(label).toHaveAttribute("id", "test-label");
      expect(label).toHaveAttribute("for", "test-input");
      expect(label).toHaveClass("custom-label");
      expect(screen.getByTestId("label-icon")).toBeInTheDocument();
    });

    it("handles dynamic content updates", async () => {
      const { rerender } = render(<Label>Initial content</Label>);

      expect(screen.getByText("Initial content")).toBeInTheDocument();

      rerender(<Label>Updated content</Label>);

      expect(screen.getByText("Updated content")).toBeInTheDocument();
      expect(screen.queryByText("Initial content")).not.toBeInTheDocument();
    });

    it("handles className prop changes", async () => {
      const { rerender } = render(
        <Label className="initial-class">Dynamic label</Label>
      );

      const label = screen.getByText("Dynamic label");
      expect(label).toHaveClass("initial-class");

      rerender(<Label className="updated-class">Dynamic label</Label>);

      expect(screen.getByText("Dynamic label")).toHaveClass("updated-class");
    });

    it("renders with complex nested structure", () => {
      render(
        <Label>
          <span>
            <strong>Complex</strong> <em>nested</em> content
          </span>
          <svg data-testid="nested-icon" />
        </Label>
      );

      expect(screen.getByText("Complex")).toBeInTheDocument();
      expect(screen.getByText("nested")).toBeInTheDocument();
      expect(screen.getByText("content")).toBeInTheDocument();
      expect(screen.getByTestId("nested-icon")).toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    it("handles null children gracefully", () => {
      render(<Label data-testid="label">{null}</Label>);

      const label = screen.getByTestId("label");
      expect(label).toBeInTheDocument();
    });

    it("handles undefined children gracefully", () => {
      render(<Label data-testid="label">{undefined}</Label>);

      const label = screen.getByTestId("label");
      expect(label).toBeInTheDocument();
    });

    it("handles boolean children gracefully", () => {
      render(<Label data-testid="label">{true}</Label>);

      const label = screen.getByTestId("label");
      expect(label).toBeInTheDocument();
    });

    it("handles zero as children", () => {
      render(<Label>{0}</Label>);

      const label = screen.getByText("0");
      expect(label).toBeInTheDocument();
    });

    it("handles whitespace content", () => {
      render(<Label data-testid="label"> </Label>);

      const label = screen.getByTestId("label");
      expect(label).toBeInTheDocument();
    });

    it("handles very long single word", () => {
      const longWord = "supercalifragilisticexpialidocious";
      render(<Label>{longWord}</Label>);

      const label = screen.getByText(longWord);
      expect(label).toBeInTheDocument();
      expect(label).toHaveClass("text-sm");
    });

    it("handles multiple className props", () => {
      render(<Label className="class1 class2 class3">Multiple classes</Label>);

      const label = screen.getByText("Multiple classes");
      expect(label).toHaveClass("class1");
      expect(label).toHaveClass("class2");
      expect(label).toHaveClass("class3");
    });

    it("handles empty string className", () => {
      render(<Label className="">Empty class</Label>);

      const label = screen.getByText("Empty class");
      expect(label).toBeInTheDocument();
    });

    it("handles undefined className", () => {
      render(<Label className={undefined}>Undefined class</Label>);

      const label = screen.getByText("Undefined class");
      expect(label).toBeInTheDocument();
    });

    it("handles all props being undefined", () => {
      render(
        <Label className={undefined} htmlFor={undefined}>
          All undefined
        </Label>
      );

      const label = screen.getByText("All undefined");
      expect(label).toBeInTheDocument();
      expect(label.tagName.toLowerCase()).toBe("label");
    });
  });
});
