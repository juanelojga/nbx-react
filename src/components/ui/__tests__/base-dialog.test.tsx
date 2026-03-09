import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BaseDialog } from "@/components/ui/base-dialog";

const MockIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg data-testid="mock-icon" {...props} />
);

describe("BaseDialog Component", () => {
  const defaultProps = {
    open: true,
    onOpenChange: jest.fn(),
    title: "Test Dialog",
    children: <div>Dialog content</div>,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Rendering", () => {
    it("renders title and children when open", () => {
      render(<BaseDialog {...defaultProps} />);

      expect(screen.getByText("Test Dialog")).toBeInTheDocument();
      expect(screen.getByText("Dialog content")).toBeInTheDocument();
    });

    it("does not render content when closed", () => {
      render(<BaseDialog {...defaultProps} open={false} />);

      expect(screen.queryByText("Test Dialog")).not.toBeInTheDocument();
      expect(screen.queryByText("Dialog content")).not.toBeInTheDocument();
    });

    it("renders optional description", () => {
      render(
        <BaseDialog {...defaultProps} description="A helpful description" />
      );

      expect(screen.getByText("A helpful description")).toBeInTheDocument();
    });

    it("does not render description when omitted", () => {
      render(<BaseDialog {...defaultProps} />);

      const dialog = screen.getByRole("dialog");
      expect(dialog).toBeInTheDocument();
      expect(
        screen.queryByText("A helpful description")
      ).not.toBeInTheDocument();
    });

    it("renders optional footer", () => {
      render(<BaseDialog {...defaultProps} footer={<button>Save</button>} />);

      expect(screen.getByText("Save")).toBeInTheDocument();
    });

    it("does not render footer when omitted", () => {
      render(<BaseDialog {...defaultProps} />);

      expect(screen.queryByText("Save")).not.toBeInTheDocument();
    });

    it("renders icon when provided", () => {
      render(<BaseDialog {...defaultProps} icon={MockIcon} />);

      expect(screen.getByTestId("mock-icon")).toBeInTheDocument();
    });

    it("does not render icon when omitted", () => {
      render(<BaseDialog {...defaultProps} />);

      expect(screen.queryByTestId("mock-icon")).not.toBeInTheDocument();
    });
  });

  describe("Size Variants", () => {
    it("applies sm:max-w-xl for sm size", () => {
      render(<BaseDialog {...defaultProps} size="sm" />);

      const dialog = screen.getByRole("dialog");
      expect(dialog).toHaveClass("sm:max-w-xl");
    });

    it("applies sm:max-w-2xl for md size (default)", () => {
      render(<BaseDialog {...defaultProps} />);

      const dialog = screen.getByRole("dialog");
      expect(dialog).toHaveClass("sm:max-w-2xl");
    });

    it("applies sm:max-w-4xl for lg size", () => {
      render(<BaseDialog {...defaultProps} size="lg" />);

      const dialog = screen.getByRole("dialog");
      expect(dialog).toHaveClass("sm:max-w-4xl");
    });

    it("applies sm:max-w-6xl for xl size", () => {
      render(<BaseDialog {...defaultProps} size="xl" />);

      const dialog = screen.getByRole("dialog");
      expect(dialog).toHaveClass("sm:max-w-6xl");
    });
  });

  describe("Destructive Variant", () => {
    it("renders icon in destructive container when iconVariant is destructive", () => {
      render(
        <BaseDialog
          {...defaultProps}
          icon={MockIcon}
          iconVariant="destructive"
        />
      );

      const icon = screen.getByTestId("mock-icon");
      expect(icon).toBeInTheDocument();
      expect(icon).toHaveClass("text-destructive");

      const iconContainer = icon.parentElement;
      expect(iconContainer).toHaveClass("bg-destructive/10");
      expect(iconContainer).toHaveClass("rounded-full");
      expect(iconContainer).toHaveClass("p-3");
    });

    it("renders description with left alignment in destructive variant", () => {
      render(
        <BaseDialog
          {...defaultProps}
          icon={MockIcon}
          iconVariant="destructive"
          description="Destructive description"
        />
      );

      const description = screen.getByText("Destructive description");
      expect(description).toHaveClass("text-left");
    });

    it("renders title with left alignment in destructive variant", () => {
      render(
        <BaseDialog
          {...defaultProps}
          icon={MockIcon}
          iconVariant="destructive"
        />
      );

      const title = screen.getByText("Test Dialog");
      expect(title).toHaveClass("text-left");
    });

    it("renders icon inline for default variant", () => {
      render(<BaseDialog {...defaultProps} icon={MockIcon} />);

      const icon = screen.getByTestId("mock-icon");
      expect(icon).not.toHaveClass("text-destructive");

      const iconContainer = icon.parentElement;
      expect(iconContainer).not.toHaveClass("bg-destructive/10");
    });

    it("does not use destructive layout when icon is omitted even with destructive variant", () => {
      render(<BaseDialog {...defaultProps} iconVariant="destructive" />);

      const title = screen.getByText("Test Dialog");
      expect(title).toHaveClass("text-2xl");
      expect(title).not.toHaveClass("text-left");
    });
  });

  describe("Props", () => {
    it("passes className to dialog content", () => {
      render(<BaseDialog {...defaultProps} className="custom-class" />);

      const dialog = screen.getByRole("dialog");
      expect(dialog).toHaveClass("custom-class");
    });

    it("passes multiple classNames", () => {
      render(<BaseDialog {...defaultProps} className="class-a class-b" />);

      const dialog = screen.getByRole("dialog");
      expect(dialog).toHaveClass("class-a");
      expect(dialog).toHaveClass("class-b");
    });

    it("renders close button by default", () => {
      render(<BaseDialog {...defaultProps} />);

      const dialog = screen.getByRole("dialog");
      const closeButton = dialog.querySelector(
        "button[data-slot='dialog-close']"
      );
      expect(closeButton).toBeInTheDocument();
    });

    it("hides close button when showCloseButton is false", () => {
      render(<BaseDialog {...defaultProps} showCloseButton={false} />);

      const dialog = screen.getByRole("dialog");
      const closeButton = dialog.querySelector(
        "button[data-slot='dialog-close']"
      );
      expect(closeButton).not.toBeInTheDocument();
    });

    it("calls onOpenChange when dialog is closed via Escape", async () => {
      const onOpenChange = jest.fn();
      const user = userEvent.setup();

      render(<BaseDialog {...defaultProps} onOpenChange={onOpenChange} />);

      await user.keyboard("{Escape}");

      await waitFor(() => {
        expect(onOpenChange).toHaveBeenCalledWith(false);
      });
    });

    it("calls onOpenChange when close button is clicked", async () => {
      const onOpenChange = jest.fn();
      const user = userEvent.setup();

      render(<BaseDialog {...defaultProps} onOpenChange={onOpenChange} />);

      const dialog = screen.getByRole("dialog");
      const closeButton = dialog.querySelector(
        "button[data-slot='dialog-close']"
      ) as HTMLElement;
      await user.click(closeButton);

      await waitFor(() => {
        expect(onOpenChange).toHaveBeenCalledWith(false);
      });
    });
  });
});
