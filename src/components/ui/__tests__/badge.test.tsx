import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Badge } from "../badge";

describe("Badge Component", () => {
  describe("Badge", () => {
    it("renders with default variant", () => {
      render(<Badge>Default badge</Badge>);

      const badge = screen.getByText("Default badge");
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveAttribute("data-slot", "badge");
      expect(badge.tagName.toLowerCase()).toBe("span");
    });

    it("renders with secondary variant", () => {
      render(<Badge variant="secondary">Secondary badge</Badge>);

      const badge = screen.getByText("Secondary badge");
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveAttribute("data-slot", "badge");
    });

    it("renders with destructive variant", () => {
      render(<Badge variant="destructive">Destructive badge</Badge>);

      const badge = screen.getByText("Destructive badge");
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveAttribute("data-slot", "badge");
    });

    it("renders with outline variant", () => {
      render(<Badge variant="outline">Outline badge</Badge>);

      const badge = screen.getByText("Outline badge");
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveAttribute("data-slot", "badge");
    });

    it("applies custom className", () => {
      render(<Badge className="custom-class">Custom badge</Badge>);

      const badge = screen.getByText("Custom badge");
      expect(badge).toHaveClass("custom-class");
    });

    it("forwards additional props", () => {
      render(
        <Badge id="test-id" data-testid="test-badge">
          Badge with props
        </Badge>
      );

      const badge = screen.getByText("Badge with props");
      expect(badge).toHaveAttribute("id", "test-id");
      expect(badge).toHaveAttribute("data-testid", "test-badge");
    });

    it("renders with asChild prop using Slot", () => {
      render(
        <Badge asChild>
          <button>Button badge</button>
        </Badge>
      );

      const badge = screen.getByText("Button badge");
      expect(badge).toBeInTheDocument();
      expect(badge.tagName.toLowerCase()).toBe("button");
      expect(badge).toHaveAttribute("data-slot", "badge");
    });

    it("renders with SVG icon", () => {
      render(
        <Badge>
          <svg data-testid="badge-icon" />
          Badge with icon
        </Badge>
      );

      expect(screen.getByTestId("badge-icon")).toBeInTheDocument();
      expect(screen.getByText("Badge with icon")).toBeInTheDocument();
    });

    it("renders with multiple SVG icons", () => {
      render(
        <Badge>
          <svg data-testid="icon-1" />
          <svg data-testid="icon-2" />
          Multiple icons
        </Badge>
      );

      expect(screen.getByTestId("icon-1")).toBeInTheDocument();
      expect(screen.getByTestId("icon-2")).toBeInTheDocument();
      expect(screen.getByText("Multiple icons")).toBeInTheDocument();
    });

    it("handles empty content gracefully", () => {
      render(<Badge data-testid="empty-badge" />);

      const badge = screen.getByTestId("empty-badge");
      expect(badge).toBeInTheDocument();
      expect(badge).toBeEmptyDOMElement();
    });

    it("renders with numeric content", () => {
      render(<Badge>42</Badge>);

      const badge = screen.getByText("42");
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveAttribute("data-slot", "badge");
    });

    it("renders with special characters", () => {
      render(<Badge>!@#$%^&*()</Badge>);

      const badge = screen.getByText("!@#$%^&*()");
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveAttribute("data-slot", "badge");
    });

    it("renders with long text content", () => {
      const longText =
        "This is a very long badge text that should still render correctly";
      render(<Badge>{longText}</Badge>);

      const badge = screen.getByText(longText);
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveAttribute("data-slot", "badge");
    });

    it("renders with nested elements", () => {
      render(
        <Badge>
          <strong>Bold text</strong> and <em>italic text</em>
        </Badge>
      );

      expect(screen.getByText("Bold text")).toBeInTheDocument();
      expect(screen.getByText("italic text")).toBeInTheDocument();
      expect(screen.getByText("and")).toBeInTheDocument();
    });
  });

  describe("User Interactions", () => {
    it("handles click events when rendered as button", async () => {
      const user = userEvent.setup();
      const handleClick = jest.fn();

      render(
        <Badge asChild>
          <button onClick={handleClick}>Clickable badge</button>
        </Badge>
      );

      const badge = screen.getByText("Clickable badge");
      await user.click(badge);

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("handles keyboard navigation when rendered as button", async () => {
      const user = userEvent.setup();
      const handleClick = jest.fn();

      render(
        <Badge asChild>
          <button onClick={handleClick}>Keyboard badge</button>
        </Badge>
      );

      const badge = screen.getByText("Keyboard badge");
      badge.focus();
      await user.keyboard("{Enter}");

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("handles hover states when rendered as link", async () => {
      const user = userEvent.setup();

      render(
        <Badge asChild>
          <a href="https://example.com">Link badge</a>
        </Badge>
      );

      const badge = screen.getByText("Link badge");
      await user.hover(badge);

      expect(badge).toBeInTheDocument();
    });

    it("handles focus states", () => {
      render(
        <Badge asChild>
          <button>Focusable badge</button>
        </Badge>
      );

      const badge = screen.getByText("Focusable badge");
      badge.focus();

      expect(document.activeElement).toBe(badge);
    });
  });

  describe("Accessibility", () => {
    it("has proper semantic HTML structure", () => {
      render(<Badge>Accessible badge</Badge>);

      const badge = screen.getByText("Accessible badge");
      expect(badge).toBeInTheDocument();
      expect(badge.tagName.toLowerCase()).toBe("span");
    });

    it("maintains accessibility when rendered as button", () => {
      render(
        <Badge asChild>
          <button aria-label="Status badge">Button badge</button>
        </Badge>
      );

      const badge = screen.getByLabelText("Status badge");
      expect(badge).toBeInTheDocument();
      expect(badge.tagName.toLowerCase()).toBe("button");
    });

    it("maintains accessibility when rendered as link", () => {
      render(
        <Badge asChild>
          <a href="https://example.com" aria-label="Navigation badge">
            Link badge
          </a>
        </Badge>
      );

      const badge = screen.getByLabelText("Navigation badge");
      expect(badge).toBeInTheDocument();
      expect(badge.tagName.toLowerCase()).toBe("a");
      expect(badge).toHaveAttribute("href", "https://example.com");
    });

    it("supports ARIA attributes", () => {
      render(
        <Badge role="status" aria-live="polite" aria-atomic="true">
          Status badge
        </Badge>
      );

      const badge = screen.getByRole("status");
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveAttribute("aria-live", "polite");
      expect(badge).toHaveAttribute("aria-atomic", "true");
    });

    it("supports aria-label for screen readers", () => {
      render(<Badge aria-label="Notification count">5</Badge>);

      const badge = screen.getByLabelText("Notification count");
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveTextContent("5");
    });

    it("supports aria-describedby for additional context", () => {
      render(
        <>
          <span id="description">New messages</span>
          <Badge aria-describedby="description">3</Badge>
        </>
      );

      const badge = screen.getByText("3");
      expect(badge).toHaveAttribute("aria-describedby", "description");
    });
  });

  describe("Variant Classes", () => {
    it("applies default variant classes", () => {
      render(<Badge>Default variant</Badge>);

      const badge = screen.getByText("Default variant");
      expect(badge).toHaveClass("inline-flex");
      expect(badge).toHaveClass("items-center");
      expect(badge).toHaveClass("justify-center");
      expect(badge).toHaveClass("rounded-full");
      expect(badge).toHaveClass("border");
      expect(badge).toHaveClass("px-3");
      expect(badge).toHaveClass("py-1");
      expect(badge).toHaveClass("text-xs");
      expect(badge).toHaveClass("font-semibold");
      expect(badge).toHaveClass("w-fit");
      expect(badge).toHaveClass("whitespace-nowrap");
      expect(badge).toHaveClass("shrink-0");
      expect(badge).toHaveClass("transition-all");
      expect(badge).toHaveClass("duration-200");
      expect(badge).toHaveClass("overflow-hidden");
      expect(badge).toHaveClass("shadow-sm");
    });

    it("applies secondary variant classes", () => {
      render(<Badge variant="secondary">Secondary variant</Badge>);

      const badge = screen.getByText("Secondary variant");
      expect(badge).toHaveClass("border-transparent");
      expect(badge).toHaveClass("bg-secondary");
      expect(badge).toHaveClass("text-secondary-foreground");
    });

    it("applies destructive variant classes", () => {
      render(<Badge variant="destructive">Destructive variant</Badge>);

      const badge = screen.getByText("Destructive variant");
      expect(badge).toHaveClass("border-transparent");
      expect(badge).toHaveClass("bg-destructive");
      expect(badge).toHaveClass("text-destructive-foreground");
    });

    it("applies outline variant classes", () => {
      render(<Badge variant="outline">Outline variant</Badge>);

      const badge = screen.getByText("Outline variant");
      expect(badge).toHaveClass("text-foreground");
      expect(badge).toHaveClass("border-2");
    });
  });

  describe("Integration Tests", () => {
    it("renders complete badge with all features", () => {
      render(
        <Badge variant="destructive" className="custom-badge" id="test-badge">
          <svg data-testid="error-icon" />
          Error Badge
        </Badge>
      );

      const badge = screen.getByText("Error Badge");
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveAttribute("id", "test-badge");
      expect(badge).toHaveClass("custom-badge");
      expect(screen.getByTestId("error-icon")).toBeInTheDocument();
    });

    it("renders multiple badges with different variants", () => {
      render(
        <>
          <Badge variant="default">Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="destructive">Destructive</Badge>
          <Badge variant="outline">Outline</Badge>
        </>
      );

      expect(screen.getByText("Default")).toBeInTheDocument();
      expect(screen.getByText("Secondary")).toBeInTheDocument();
      expect(screen.getByText("Destructive")).toBeInTheDocument();
      expect(screen.getByText("Outline")).toBeInTheDocument();
    });

    it("handles dynamic content updates", async () => {
      const { rerender } = render(<Badge>Initial content</Badge>);

      expect(screen.getByText("Initial content")).toBeInTheDocument();

      rerender(<Badge>Updated content</Badge>);

      expect(screen.getByText("Updated content")).toBeInTheDocument();
      expect(screen.queryByText("Initial content")).not.toBeInTheDocument();
    });

    it("handles variant prop changes", async () => {
      const { rerender } = render(
        <Badge variant="default">Dynamic badge</Badge>
      );

      const badge = screen.getByText("Dynamic badge");
      expect(badge).toBeInTheDocument();

      rerender(<Badge variant="destructive">Dynamic badge</Badge>);

      expect(screen.getByText("Dynamic badge")).toBeInTheDocument();
    });

    it("renders with complex nested structure", () => {
      render(
        <Badge variant="secondary">
          <span>
            <strong>Complex</strong> <em>nested</em> content
          </span>
          <svg data-testid="nested-icon" />
        </Badge>
      );

      expect(screen.getByText("Complex")).toBeInTheDocument();
      expect(screen.getByText("nested")).toBeInTheDocument();
      expect(screen.getByText("content")).toBeInTheDocument();
      expect(screen.getByTestId("nested-icon")).toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    it("handles null children gracefully", () => {
      render(<Badge data-testid="badge">{null}</Badge>);

      const badge = screen.getByTestId("badge");
      expect(badge).toBeInTheDocument();
    });

    it("handles undefined children gracefully", () => {
      render(<Badge data-testid="badge">{undefined}</Badge>);

      const badge = screen.getByTestId("badge");
      expect(badge).toBeInTheDocument();
    });

    it("handles boolean children gracefully", () => {
      render(<Badge data-testid="badge">{true}</Badge>);

      const badge = screen.getByTestId("badge");
      expect(badge).toBeInTheDocument();
    });

    it("handles zero as children", () => {
      render(<Badge>{0}</Badge>);

      const badge = screen.getByText("0");
      expect(badge).toBeInTheDocument();
    });

    it("handles whitespace content", () => {
      render(<Badge data-testid="badge"> </Badge>);

      const badge = screen.getByTestId("badge");
      expect(badge).toBeInTheDocument();
    });

    it("handles very long single word", () => {
      const longWord = "supercalifragilisticexpialidocious";
      render(<Badge>{longWord}</Badge>);

      const badge = screen.getByText(longWord);
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveClass("whitespace-nowrap");
    });
  });
});
