import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ActionButton } from "../ActionButton";
import { TableAction } from "../table-action-buttons.types";

jest.mock("@/components/ui/tooltip", () => ({
  Tooltip: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="tooltip">{children}</div>
  ),
  TooltipTrigger: ({
    children,
    asChild: _,
    ...props
  }: {
    children: React.ReactNode;
    asChild?: boolean;
  }) => (
    <div data-testid="tooltip-trigger" {...props}>
      {children}
    </div>
  ),
  TooltipContent: ({
    children,
    className,
    ...props
  }: {
    children: React.ReactNode;
    className?: string;
    side?: string;
  }) => (
    <div data-testid="tooltip-content" className={className} {...props}>
      {children}
    </div>
  ),
}));

jest.mock("@/components/ui/enhanced-table", () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const ReactMock = require("react");
  const Mock = ReactMock.forwardRef(function MockButton(
    {
      actionVariant,
      icon: Icon,
      onClick,
      ...props
    }: {
      actionVariant: string;
      icon: React.ElementType;
      onClick?: () => void;
      "aria-label"?: string;
    },
    ref: React.Ref<HTMLButtonElement>
  ) {
    return (
      <button
        ref={ref}
        data-testid={`action-button-${actionVariant}`}
        onClick={onClick}
        {...props}
      >
        <Icon data-testid={`icon-${actionVariant}`} />
      </button>
    );
  });
  Mock.displayName = "EnhancedTableActionButton";
  return { EnhancedTableActionButton: Mock };
});

const createAction = (overrides?: Partial<TableAction>): TableAction => ({
  onClick: jest.fn(),
  ariaLabel: "Test action",
  tooltip: "Test tooltip",
  ...overrides,
});

describe("ActionButton", () => {
  describe("Rendering", () => {
    it("renders view variant with correct icon", () => {
      render(<ActionButton variant="view" action={createAction()} />);

      expect(screen.getByTestId("action-button-view")).toBeInTheDocument();
      expect(screen.getByTestId("icon-view")).toBeInTheDocument();
    });

    it("renders edit variant with correct icon", () => {
      render(<ActionButton variant="edit" action={createAction()} />);

      expect(screen.getByTestId("action-button-edit")).toBeInTheDocument();
      expect(screen.getByTestId("icon-edit")).toBeInTheDocument();
    });

    it("renders delete variant with correct icon", () => {
      render(<ActionButton variant="delete" action={createAction()} />);

      expect(screen.getByTestId("action-button-delete")).toBeInTheDocument();
      expect(screen.getByTestId("icon-delete")).toBeInTheDocument();
    });

    it("renders tooltip text", () => {
      render(
        <ActionButton
          variant="view"
          action={createAction({ tooltip: "View details" })}
        />
      );

      expect(screen.getByText("View details")).toBeInTheDocument();
    });
  });

  describe("Interactions", () => {
    it("calls onClick when button is clicked", async () => {
      const user = userEvent.setup();
      const handleClick = jest.fn();

      render(
        <ActionButton
          variant="view"
          action={createAction({ onClick: handleClick })}
        />
      );

      await user.click(screen.getByTestId("action-button-view"));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });

  describe("Accessibility", () => {
    it("applies aria-label from action", () => {
      render(
        <ActionButton
          variant="view"
          action={createAction({ ariaLabel: "View package details" })}
        />
      );

      expect(screen.getByTestId("action-button-view")).toHaveAttribute(
        "aria-label",
        "View package details"
      );
    });
  });

  describe("Tooltip Styles", () => {
    it("applies blue styles for view variant", () => {
      render(<ActionButton variant="view" action={createAction()} />);

      const content = screen.getByTestId("tooltip-content");
      expect(content).toHaveClass("bg-blue-950");
      expect(content).toHaveClass("text-blue-50");
    });

    it("applies amber styles for edit variant", () => {
      render(<ActionButton variant="edit" action={createAction()} />);

      const content = screen.getByTestId("tooltip-content");
      expect(content).toHaveClass("bg-amber-950");
      expect(content).toHaveClass("text-amber-50");
    });

    it("applies red styles for delete variant", () => {
      render(<ActionButton variant="delete" action={createAction()} />);

      const content = screen.getByTestId("tooltip-content");
      expect(content).toHaveClass("bg-red-950");
      expect(content).toHaveClass("text-red-50");
    });
  });

  describe("Edge Cases", () => {
    it("handles empty tooltip string", () => {
      const action = createAction({ tooltip: "" });
      render(<ActionButton variant="view" action={action} />);

      expect(screen.getByTestId("tooltip-content")).toBeInTheDocument();
    });

    it("handles empty ariaLabel string", () => {
      const action = createAction({ ariaLabel: "" });
      render(<ActionButton variant="view" action={action} />);

      expect(screen.getByTestId("action-button-view")).toHaveAttribute(
        "aria-label",
        ""
      );
    });
  });
});
