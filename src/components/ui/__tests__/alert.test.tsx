import React from "react";
import { render, screen } from "@testing-library/react";
import { Alert, AlertTitle, AlertDescription } from "../alert";

describe("Alert Component", () => {
  describe("Alert", () => {
    it("renders with default variant", () => {
      render(<Alert>Default alert content</Alert>);

      const alert = screen.getByRole("alert");
      expect(alert).toBeInTheDocument();
      expect(alert).toHaveTextContent("Default alert content");
      expect(alert).toHaveAttribute("data-slot", "alert");
    });

    it("renders with destructive variant", () => {
      render(<Alert variant="destructive">Destructive alert</Alert>);

      const alert = screen.getByRole("alert");
      expect(alert).toBeInTheDocument();
      expect(alert).toHaveTextContent("Destructive alert");
    });

    it("applies custom className", () => {
      render(<Alert className="custom-class">Custom alert</Alert>);

      const alert = screen.getByRole("alert");
      expect(alert).toHaveClass("custom-class");
    });

    it("forwards additional props", () => {
      render(
        <Alert id="test-id" data-testid="test-alert">
          Alert with props
        </Alert>
      );

      const alert = screen.getByRole("alert");
      expect(alert).toHaveAttribute("id", "test-id");
      expect(alert).toHaveAttribute("data-testid", "test-alert");
    });

    it("renders with children components", () => {
      render(
        <Alert>
          <AlertTitle>Title</AlertTitle>
          <AlertDescription>Description</AlertDescription>
        </Alert>
      );

      expect(screen.getByText("Title")).toBeInTheDocument();
      expect(screen.getByText("Description")).toBeInTheDocument();
    });

    it("renders with SVG icon", () => {
      render(
        <Alert>
          <svg data-testid="alert-icon" />
          <AlertTitle>Alert with icon</AlertTitle>
        </Alert>
      );

      expect(screen.getByTestId("alert-icon")).toBeInTheDocument();
      expect(screen.getByText("Alert with icon")).toBeInTheDocument();
    });
  });

  describe("AlertTitle", () => {
    it("renders correctly", () => {
      render(<AlertTitle>Alert Title</AlertTitle>);

      const title = screen.getByText("Alert Title");
      expect(title).toBeInTheDocument();
      expect(title).toHaveAttribute("data-slot", "alert-title");
    });

    it("applies custom className", () => {
      render(<AlertTitle className="custom-title">Title</AlertTitle>);

      const title = screen.getByText("Title");
      expect(title).toHaveClass("custom-title");
    });

    it("forwards additional props", () => {
      render(
        <AlertTitle id="title-id" data-testid="alert-title">
          Title with props
        </AlertTitle>
      );

      const title = screen.getByText("Title with props");
      expect(title).toHaveAttribute("id", "title-id");
      expect(title).toHaveAttribute("data-testid", "alert-title");
    });

    it("handles long text with line clamping", () => {
      const longText =
        "This is a very long title that should be clamped to one line";
      render(<AlertTitle>{longText}</AlertTitle>);

      const title = screen.getByText(longText);
      expect(title).toHaveClass("line-clamp-1");
    });
  });

  describe("AlertDescription", () => {
    it("renders correctly", () => {
      render(<AlertDescription>Alert Description</AlertDescription>);

      const description = screen.getByText("Alert Description");
      expect(description).toBeInTheDocument();
      expect(description).toHaveAttribute("data-slot", "alert-description");
    });

    it("applies custom className", () => {
      render(
        <AlertDescription className="custom-description">
          Description
        </AlertDescription>
      );

      const description = screen.getByText("Description");
      expect(description).toHaveClass("custom-description");
    });

    it("forwards additional props", () => {
      render(
        <AlertDescription id="desc-id" data-testid="alert-description">
          Description with props
        </AlertDescription>
      );

      const description = screen.getByText("Description with props");
      expect(description).toHaveAttribute("id", "desc-id");
      expect(description).toHaveAttribute("data-testid", "alert-description");
    });

    it("renders with paragraph elements", () => {
      render(
        <AlertDescription>
          <p>First paragraph</p>
          <p>Second paragraph</p>
        </AlertDescription>
      );

      expect(screen.getByText("First paragraph")).toBeInTheDocument();
      expect(screen.getByText("Second paragraph")).toBeInTheDocument();
    });
  });

  describe("Integration Tests", () => {
    it("renders complete alert with all components", () => {
      render(
        <Alert variant="destructive">
          <svg data-testid="error-icon" />
          <AlertTitle>Error Alert</AlertTitle>
          <AlertDescription>
            This is an error message with additional details.
          </AlertDescription>
        </Alert>
      );

      expect(screen.getByRole("alert")).toBeInTheDocument();
      expect(screen.getByTestId("error-icon")).toBeInTheDocument();
      expect(screen.getByText("Error Alert")).toBeInTheDocument();
      expect(
        screen.getByText("This is an error message with additional details.")
      ).toBeInTheDocument();
    });

    it("renders alert with custom styling and multiple children", () => {
      render(
        <Alert className="my-custom-alert" data-testid="custom-alert">
          <AlertTitle>Custom Alert Title</AlertTitle>
          <AlertDescription>
            <p>First paragraph of description</p>
            <p>Second paragraph with more details</p>
          </AlertDescription>
        </Alert>
      );

      const alert = screen.getByTestId("custom-alert");
      expect(alert).toHaveClass("my-custom-alert");
      expect(screen.getByText("Custom Alert Title")).toBeInTheDocument();
      expect(
        screen.getByText("First paragraph of description")
      ).toBeInTheDocument();
      expect(
        screen.getByText("Second paragraph with more details")
      ).toBeInTheDocument();
    });

    it("handles empty content gracefully", () => {
      render(<Alert />);

      const alert = screen.getByRole("alert");
      expect(alert).toBeInTheDocument();
      expect(alert).toBeEmptyDOMElement();
    });

    it("handles nested components correctly", () => {
      render(
        <Alert>
          <div>
            <AlertTitle>Nested Title</AlertTitle>
            <AlertDescription>Nested Description</AlertDescription>
          </div>
        </Alert>
      );

      expect(screen.getByText("Nested Title")).toBeInTheDocument();
      expect(screen.getByText("Nested Description")).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("has proper ARIA role", () => {
      render(<Alert>Accessible alert</Alert>);

      const alert = screen.getByRole("alert");
      expect(alert).toBeInTheDocument();
    });

    it("maintains semantic HTML structure", () => {
      render(
        <Alert>
          <AlertTitle>Title</AlertTitle>
          <AlertDescription>Description</AlertDescription>
        </Alert>
      );

      const alert = screen.getByRole("alert");
      const title = screen.getByText("Title");
      const description = screen.getByText("Description");

      expect(alert).toContainElement(title);
      expect(alert).toContainElement(description);
    });
  });
});
