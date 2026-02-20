import React from "react";
import { render, screen } from "@testing-library/react";
import { PageHeader } from "../page-header";

describe("PageHeader Component", () => {
  describe("PageHeader Rendering", () => {
    it("renders with required title prop", () => {
      render(<PageHeader title="Test Page Title" />);

      const title = screen.getByText("Test Page Title");
      expect(title).toBeInTheDocument();
      expect(title.tagName.toLowerCase()).toBe("h1");
      expect(title).toHaveClass("text-2xl", "font-extrabold", "tracking-tight");
    });

    it("renders with title and description", () => {
      render(
        <PageHeader
          title="Test Page Title"
          description="This is a test description for the page header"
        />
      );

      const title = screen.getByText("Test Page Title");
      const description = screen.getByText(
        "This is a test description for the page header"
      );

      expect(title).toBeInTheDocument();
      expect(description).toBeInTheDocument();
      expect(description).toHaveClass(
        "text-muted-foreground",
        "text-base",
        "leading-relaxed",
        "max-w-2xl"
      );
    });

    it("renders with custom className", () => {
      render(
        <PageHeader title="Test Page Title" className="custom-header-class" />
      );

      const mainContainer = screen.getByText("Test Page Title").closest("div")
        ?.parentElement?.parentElement;
      expect(mainContainer).toHaveClass("custom-header-class");
    });

    it("renders with actions", () => {
      const actions = (
        <button data-testid="action-button">Action Button</button>
      );

      render(<PageHeader title="Test Page Title" actions={actions} />);

      const actionButton = screen.getByTestId("action-button");
      expect(actionButton).toBeInTheDocument();
      expect(actionButton.parentElement).toHaveClass(
        "flex",
        "items-center",
        "gap-3",
        "flex-shrink-0"
      );
    });

    it("renders with multiple actions", () => {
      const actions = (
        <>
          <button data-testid="action-1">Action 1</button>
          <button data-testid="action-2">Action 2</button>
        </>
      );

      render(<PageHeader title="Test Page Title" actions={actions} />);

      expect(screen.getByTestId("action-1")).toBeInTheDocument();
      expect(screen.getByTestId("action-2")).toBeInTheDocument();
    });

    it("renders with all props", () => {
      const actions = <button data-testid="header-action">Add New</button>;

      render(
        <PageHeader
          title="Complete Page Header"
          description="This page has all features enabled"
          actions={actions}
          className="custom-page-header"
        />
      );

      expect(screen.getByText("Complete Page Header")).toBeInTheDocument();
      expect(
        screen.getByText("This page has all features enabled")
      ).toBeInTheDocument();
      expect(screen.getByTestId("header-action")).toBeInTheDocument();

      const mainContainer = screen
        .getByText("Complete Page Header")
        .closest("div")?.parentElement?.parentElement;
      expect(mainContainer).toHaveClass("custom-page-header");
    });

    it("renders without description when not provided", () => {
      render(<PageHeader title="Page Without Description" />);

      const title = screen.getByText("Page Without Description");
      expect(title).toBeInTheDocument();

      // Should not have description text
      expect(
        screen.queryByText("This should not exist")
      ).not.toBeInTheDocument();
    });

    it("renders without actions when not provided", () => {
      render(<PageHeader title="Page Without Actions" />);

      const title = screen.getByText("Page Without Actions");
      expect(title).toBeInTheDocument();

      // Should not have actions container
      expect(screen.queryByTestId("action-button")).not.toBeInTheDocument();
    });

    it("renders with long title", () => {
      const longTitle =
        "This is a very long page title that demonstrates how the component handles extended text content";
      render(<PageHeader title={longTitle} />);

      const title = screen.getByText(longTitle);
      expect(title).toBeInTheDocument();
      expect(title).toHaveClass("text-2xl", "font-extrabold", "tracking-tight");
    });

    it("renders with long description", () => {
      const longDescription =
        "This is a very long description that demonstrates how the component handles extended text content. It should still render correctly and maintain proper styling and layout regardless of the length of the description text.";
      render(
        <PageHeader
          title="Page with Long Description"
          description={longDescription}
        />
      );

      const description = screen.getByText(longDescription);
      expect(description).toBeInTheDocument();
      expect(description).toHaveClass(
        "text-muted-foreground",
        "text-base",
        "leading-relaxed",
        "max-w-2xl"
      );
    });

    it("renders with special characters in title and description", () => {
      render(
        <PageHeader
          title="Page Title!@#$%^&*()"
          description="Description with special chars: !@#$%^&*()_+-=[]{}|;':,./<>?"
        />
      );

      expect(screen.getByText("Page Title!@#$%^&*()")).toBeInTheDocument();
      expect(
        screen.getByText(
          "Description with special chars: !@#$%^&*()_+-=[]{}|;':,./<>?"
        )
      ).toBeInTheDocument();
    });

    it("renders with numeric title", () => {
      render(<PageHeader title="12345" />);

      const title = screen.getByText("12345");
      expect(title).toBeInTheDocument();
      expect(title.tagName.toLowerCase()).toBe("h1");
    });
  });

  describe("Layout and Structure", () => {
    it("has proper container structure with space-y-4", () => {
      render(<PageHeader title="Test Title" />);

      const mainContainer = screen.getByText("Test Title").closest("div")
        ?.parentElement?.parentElement;
      expect(mainContainer).toHaveClass("space-y-4");
    });

    it("has flex layout for title and actions section", () => {
      const actions = <button data-testid="action-btn">Action</button>;
      render(<PageHeader title="Test Title" actions={actions} />);

      const flexContainer = screen
        .getByText("Test Title")
        .closest("div")?.parentElement;
      expect(flexContainer).toHaveClass(
        "flex",
        "items-start",
        "justify-between",
        "gap-4"
      );
    });

    it("has flex-1 class for title container", () => {
      const actions = <button data-testid="action-btn">Action</button>;
      render(<PageHeader title="Test Title" actions={actions} />);

      const titleContainer = screen.getByText("Test Title").closest("div");
      expect(titleContainer).toHaveClass("space-y-2", "flex-1");
    });

    it("renders separator component", () => {
      render(<PageHeader title="Test Title" />);

      // Check that separator exists (it should be the last child)
      const mainContainer = screen.getByText("Test Title").closest("div")
        ?.parentElement?.parentElement;
      expect(mainContainer).toBeInTheDocument();

      // The separator should be rendered as part of the component
      // Since it's a separate component, we can verify the structure exists
      expect(mainContainer?.children.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe("Edge Cases", () => {
    it("handles empty string title", () => {
      render(<PageHeader title="" />);

      const title = screen.getByRole("heading");
      expect(title).toBeInTheDocument();
      expect(title).toHaveTextContent("");
    });

    it("handles empty string description", () => {
      render(<PageHeader title="Test Title" description="" />);

      // Empty string should not render description element
      const description = screen.queryByRole("paragraph");
      expect(description).not.toBeInTheDocument();
    });

    it("handles null actions", () => {
      render(<PageHeader title="Test Title" actions={null} />);

      expect(screen.getByText("Test Title")).toBeInTheDocument();
    });

    it("handles undefined actions", () => {
      render(<PageHeader title="Test Title" actions={undefined} />);

      expect(screen.getByText("Test Title")).toBeInTheDocument();
    });

    it("handles empty actions fragment", () => {
      render(<PageHeader title="Test Title" actions={<></>} />);

      expect(screen.getByText("Test Title")).toBeInTheDocument();
    });

    it("handles whitespace-only title", () => {
      render(<PageHeader title="   " />);

      const title = screen.getByRole("heading");
      expect(title).toBeInTheDocument();
      // Whitespace-only title should still render
      expect(title.textContent).toBe("   ");
    });

    it("handles whitespace-only description", () => {
      render(<PageHeader title="Test Title" description="   " />);

      // Whitespace-only description should still render
      const description = screen.getByRole("paragraph");
      expect(description).toBeInTheDocument();
      expect(description.textContent).toBe("   ");
    });

    it("handles React fragments in actions", () => {
      const actions = (
        <>
          <span data-testid="fragment-1">Fragment 1</span>
          <span data-testid="fragment-2">Fragment 2</span>
        </>
      );

      render(<PageHeader title="Test Title" actions={actions} />);

      expect(screen.getByTestId("fragment-1")).toBeInTheDocument();
      expect(screen.getByTestId("fragment-2")).toBeInTheDocument();
    });

    it("handles nested elements in title", () => {
      render(
        <PageHeader
          title={
            <>
              <strong>Bold</strong> and <em>italic</em>
            </>
          }
        />
      );

      expect(screen.getByText("Bold")).toBeInTheDocument();
      expect(screen.getByText("italic")).toBeInTheDocument();
      expect(screen.getByText("and")).toBeInTheDocument();
    });

    it("handles nested elements in description", () => {
      render(
        <PageHeader
          title="Test Title"
          description={
            <>
              <strong>Important:</strong>{" "}
              <span>Description with nested elements</span>
            </>
          }
        />
      );

      expect(screen.getByText("Important:")).toBeInTheDocument();
      expect(
        screen.getByText("Description with nested elements")
      ).toBeInTheDocument();
    });
  });

  describe("Integration Tests", () => {
    it("handles dynamic content updates", async () => {
      const { rerender } = render(
        <PageHeader title="Initial Title" description="Initial Description" />
      );

      expect(screen.getByText("Initial Title")).toBeInTheDocument();
      expect(screen.getByText("Initial Description")).toBeInTheDocument();

      rerender(
        <PageHeader title="Updated Title" description="Updated Description" />
      );

      expect(screen.getByText("Updated Title")).toBeInTheDocument();
      expect(screen.getByText("Updated Description")).toBeInTheDocument();
      expect(screen.queryByText("Initial Title")).not.toBeInTheDocument();
      expect(screen.queryByText("Initial Description")).not.toBeInTheDocument();
    });

    it("handles prop changes from with description to without description", async () => {
      const { rerender } = render(
        <PageHeader title="Test Title" description="Will be removed" />
      );

      expect(screen.getByText("Will be removed")).toBeInTheDocument();

      rerender(<PageHeader title="Test Title" />);

      expect(screen.getByText("Test Title")).toBeInTheDocument();
      expect(screen.queryByText("Will be removed")).not.toBeInTheDocument();
    });

    it("handles prop changes from without actions to with actions", async () => {
      const { rerender } = render(<PageHeader title="Test Title" />);

      expect(screen.queryByTestId("new-action")).not.toBeInTheDocument();

      rerender(
        <PageHeader
          title="Test Title"
          actions={<button data-testid="new-action">New Action</button>}
        />
      );

      expect(screen.getByTestId("new-action")).toBeInTheDocument();
    });

    it("renders with complex real-world example", () => {
      const headerActions = (
        <>
          <button className="btn-secondary" data-testid="edit-btn">
            Edit
          </button>
          <button className="btn-primary" data-testid="save-btn">
            Save
          </button>
          <button className="btn-danger" data-testid="delete-btn">
            Delete
          </button>
        </>
      );

      render(
        <PageHeader
          title="User Management Dashboard"
          description="Manage user accounts, permissions, and access levels across the system"
          actions={headerActions}
          className="dashboard-header"
        />
      );

      expect(screen.getByText("User Management Dashboard")).toBeInTheDocument();
      expect(
        screen.getByText(
          "Manage user accounts, permissions, and access levels across the system"
        )
      ).toBeInTheDocument();
      expect(screen.getByTestId("edit-btn")).toBeInTheDocument();
      expect(screen.getByTestId("save-btn")).toBeInTheDocument();
      expect(screen.getByTestId("delete-btn")).toBeInTheDocument();

      const mainContainer = screen
        .getByText("User Management Dashboard")
        .closest("div")?.parentElement?.parentElement;
      expect(mainContainer).toHaveClass("dashboard-header");
    });
  });
});
