import React from "react";
import { render, screen } from "@testing-library/react";
import { Separator } from "../separator";

describe("Separator Component", () => {
  describe("Separator Rendering", () => {
    it("renders with default horizontal orientation", () => {
      render(<Separator data-testid="default-separator" />);

      const separator = screen.getByTestId("default-separator");
      expect(separator).toBeInTheDocument();
      expect(separator).toHaveAttribute("data-slot", "separator");
      expect(separator).toHaveAttribute("data-orientation", "horizontal");
      expect(separator.tagName.toLowerCase()).toBe("div");
    });

    it("renders with vertical orientation", () => {
      render(
        <Separator orientation="vertical" data-testid="vertical-separator" />
      );

      const separator = screen.getByTestId("vertical-separator");
      expect(separator).toBeInTheDocument();
      expect(separator).toHaveAttribute("data-orientation", "vertical");
    });

    it("renders with decorative prop set to true by default", () => {
      render(<Separator data-testid="decorative-separator" />);

      const separator = screen.getByTestId("decorative-separator");
      expect(separator).toHaveAttribute("role", "none");
      expect(separator).not.toHaveAttribute("aria-orientation");
    });

    it("renders with decorative prop set to false", () => {
      render(<Separator decorative={false} />);

      const separator = screen.getByRole("separator");
      expect(separator).toBeInTheDocument();
      // When decorative=false, the separator has role="separator" but may not have aria-orientation by default
    });

    it("applies custom className", () => {
      render(
        <Separator
          className="custom-separator"
          data-testid="custom-separator"
        />
      );

      const separator = screen.getByTestId("custom-separator");
      expect(separator).toHaveClass("custom-separator");
    });

    it("forwards additional props", () => {
      render(<Separator id="test-id" data-testid="test-separator" />);

      const separator = screen.getByTestId("test-separator");
      expect(separator).toHaveAttribute("id", "test-id");
    });

    it("applies horizontal orientation classes", () => {
      render(
        <Separator
          orientation="horizontal"
          data-testid="horizontal-separator"
        />
      );

      const separator = screen.getByTestId("horizontal-separator");
      expect(separator).toHaveClass("bg-border/60");
      expect(separator).toHaveClass("shrink-0");
      // The h-px and w-full classes are applied via data attributes, not directly
      expect(separator).toHaveAttribute("data-orientation", "horizontal");
    });

    it("applies vertical orientation classes", () => {
      render(
        <Separator orientation="vertical" data-testid="vertical-orientation" />
      );

      const separator = screen.getByTestId("vertical-orientation");
      expect(separator).toHaveClass("bg-border/60");
      expect(separator).toHaveClass("shrink-0");
      // The h-full and w-px classes are applied via data attributes, not directly
      expect(separator).toHaveAttribute("data-orientation", "vertical");
    });

    it("renders with both orientations in different containers", () => {
      render(
        <div>
          <div data-testid="horizontal-container">
            <Separator
              orientation="horizontal"
              data-testid="horizontal-separator"
            />
          </div>
          <div data-testid="vertical-container">
            <Separator
              orientation="vertical"
              data-testid="vertical-separator"
            />
          </div>
        </div>
      );

      const horizontalSeparator = screen.getByTestId("horizontal-separator");
      const verticalSeparator = screen.getByTestId("vertical-separator");

      expect(horizontalSeparator).toHaveAttribute(
        "data-orientation",
        "horizontal"
      );
      expect(verticalSeparator).toHaveAttribute("data-orientation", "vertical");
    });
  });

  describe("Accessibility", () => {
    it("has proper ARIA attributes for horizontal separator when decorative=false", () => {
      render(<Separator orientation="horizontal" decorative={false} />);

      const separator = screen.getByRole("separator");
      expect(separator).toBeInTheDocument();
      expect(separator).toHaveAttribute("data-orientation", "horizontal");
      // aria-orientation may not be explicitly set by Radix UI separator
    });

    it("has proper ARIA attributes for vertical separator when decorative=false", () => {
      render(<Separator orientation="vertical" decorative={false} />);

      const separator = screen.getByRole("separator");
      expect(separator).toHaveAttribute("aria-orientation", "vertical");
    });

    it("supports aria-label for screen readers", () => {
      render(<Separator aria-label="Content separator" />);

      const separator = screen.getByLabelText("Content separator");
      expect(separator).toBeInTheDocument();
    });

    it("supports aria-describedby for additional context", () => {
      render(
        <>
          <span id="description">Section divider</span>
          <Separator
            aria-describedby="description"
            data-testid="described-separator"
          />
        </>
      );

      const separator = screen.getByTestId("described-separator");
      expect(separator).toHaveAttribute("aria-describedby", "description");
    });

    it("supports aria-labelledby for labeled separators", () => {
      render(
        <>
          <h2 id="section-title">Section Title</h2>
          <Separator
            aria-labelledby="section-title"
            data-testid="labelled-separator"
          />
        </>
      );

      const separator = screen.getByTestId("labelled-separator");
      expect(separator).toHaveAttribute("aria-labelledby", "section-title");
    });
  });

  describe("Integration Tests", () => {
    it("renders multiple separators with different orientations", () => {
      render(
        <>
          <div>Content 1</div>
          <Separator orientation="horizontal" data-testid="separator-1" />
          <div>Content 2</div>
          <Separator orientation="vertical" data-testid="separator-2" />
          <div>Content 3</div>
        </>
      );

      const separator1 = screen.getByTestId("separator-1");
      const separator2 = screen.getByTestId("separator-2");

      expect(separator1).toHaveAttribute("data-orientation", "horizontal");
      expect(separator2).toHaveAttribute("data-orientation", "vertical");

      expect(screen.getByText("Content 1")).toBeInTheDocument();
      expect(screen.getByText("Content 2")).toBeInTheDocument();
      expect(screen.getByText("Content 3")).toBeInTheDocument();
    });

    it("renders with complex nested structure", () => {
      render(
        <div className="flex items-center">
          <span>Left content</span>
          <Separator
            orientation="vertical"
            className="mx-4"
            data-testid="vertical-separator"
          />
          <span>Right content</span>
        </div>
      );

      expect(screen.getByText("Left content")).toBeInTheDocument();
      expect(screen.getByText("Right content")).toBeInTheDocument();

      const separator = screen.getByTestId("vertical-separator");
      expect(separator).toHaveAttribute("data-orientation", "vertical");
      expect(separator).toHaveClass("mx-4");
    });

    it("handles dynamic orientation changes", async () => {
      const { rerender } = render(
        <Separator orientation="horizontal" data-testid="dynamic-separator" />
      );

      let separator = screen.getByTestId("dynamic-separator");
      expect(separator).toHaveAttribute("data-orientation", "horizontal");

      rerender(
        <Separator orientation="vertical" data-testid="dynamic-separator" />
      );

      separator = screen.getByTestId("dynamic-separator");
      expect(separator).toHaveAttribute("data-orientation", "vertical");
    });

    it("renders with custom styles and classes", () => {
      render(
        <Separator
          orientation="horizontal"
          className="my-8 border-t-2 border-dashed"
          data-testid="styled-separator"
        />
      );

      const separator = screen.getByTestId("styled-separator");
      expect(separator).toHaveClass("my-8");
      expect(separator).toHaveClass("border-t-2");
      expect(separator).toHaveClass("border-dashed");
      expect(separator).toHaveClass("bg-border/60");
    });

    it("works in a realistic layout scenario", () => {
      render(
        <div className="w-full max-w-md mx-auto">
          <div className="p-4">
            <h2 className="text-lg font-semibold">Section Title</h2>
            <p className="text-sm text-gray-600">Section description</p>
          </div>
          <Separator orientation="horizontal" data-testid="layout-separator" />
          <div className="p-4">
            <ul className="space-y-2">
              <li>Item 1</li>
              <li>Item 2</li>
              <li>Item 3</li>
            </ul>
          </div>
        </div>
      );

      expect(screen.getByText("Section Title")).toBeInTheDocument();
      expect(screen.getByText("Section description")).toBeInTheDocument();
      expect(screen.getByTestId("layout-separator")).toBeInTheDocument();
      expect(screen.getByText("Item 1")).toBeInTheDocument();
      expect(screen.getByText("Item 2")).toBeInTheDocument();
      expect(screen.getByText("Item 3")).toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    it("handles undefined orientation gracefully", () => {
      render(
        <Separator
          orientation={undefined}
          data-testid="undefined-orientation"
        />
      );

      const separator = screen.getByTestId("undefined-orientation");
      expect(separator).toBeInTheDocument();
      expect(separator).toHaveAttribute("data-orientation", "horizontal");
    });

    it("handles undefined decorative prop gracefully", () => {
      render(
        <Separator decorative={undefined} data-testid="undefined-decorative" />
      );

      const separator = screen.getByTestId("undefined-decorative");
      expect(separator).toBeInTheDocument();
      expect(separator).toHaveAttribute("role", "none");
    });

    it("handles empty string className", () => {
      render(<Separator className="" data-testid="empty-classname" />);

      const separator = screen.getByTestId("empty-classname");
      expect(separator).toBeInTheDocument();
    });

    it("handles undefined className", () => {
      render(
        <Separator className={undefined} data-testid="undefined-classname" />
      );

      const separator = screen.getByTestId("undefined-classname");
      expect(separator).toBeInTheDocument();
    });

    it("handles all props being undefined", () => {
      render(
        <Separator
          orientation={undefined}
          decorative={undefined}
          className={undefined}
          data-testid="all-undefined"
        />
      );

      const separator = screen.getByTestId("all-undefined");
      expect(separator).toBeInTheDocument();
      expect(separator).toHaveAttribute("data-orientation", "horizontal");
    });

    it("renders with invalid orientation (falls back to horizontal)", () => {
      render(
        <Separator
          orientation={"invalid" as "horizontal" | "vertical"}
          data-testid="invalid-orientation"
        />
      );

      const separator = screen.getByTestId("invalid-orientation");
      expect(separator).toBeInTheDocument();
      expect(separator).toHaveAttribute("data-orientation", "horizontal");
    });

    it("handles multiple className props", () => {
      render(
        <Separator
          className="class1 class2 class3"
          data-testid="multiple-classes"
        />
      );

      const separator = screen.getByTestId("multiple-classes");
      expect(separator).toHaveClass("class1");
      expect(separator).toHaveClass("class2");
      expect(separator).toHaveClass("class3");
    });

    it("renders with very long custom className", () => {
      const longClassName =
        "custom-separator-class-with-many-properties-and-modifiers";
      render(
        <Separator className={longClassName} data-testid="long-classname" />
      );

      const separator = screen.getByTestId("long-classname");
      expect(separator).toHaveClass(longClassName);
    });
  });
});
