import React from "react";
import { render, screen } from "@testing-library/react";
import { Toaster } from "../sonner";
import { useTheme } from "next-themes";

// Mock next-themes
jest.mock("next-themes", () => ({
  useTheme: jest.fn(),
}));

// Mock the sonner library
jest.mock("sonner", () => ({
  Toaster: jest.fn(
    ({
      theme,
      className = "",
      style,
      position,
      duration,
      expand,
      richColors,
      closeButton,
      visibleToasts,
      ...props
    }) => (
      <div
        data-testid="mock-toaster"
        data-theme={theme}
        className={`toaster group ${className}`.trim()}
        style={style as React.CSSProperties}
        data-position={position}
        data-duration={duration}
        data-expand={expand}
        data-rich-colors={richColors}
        data-close-button={closeButton}
        data-visible-toasts={visibleToasts}
        {...props}
      >
        Mock Toaster
      </div>
    )
  ),
}));

describe("Toaster Component", () => {
  const mockUseTheme = useTheme as jest.MockedFunction<typeof useTheme>;

  // Helper function to create proper mock return value
  const createThemeMock = (theme: string | undefined | null) => ({
    theme: theme === null ? undefined : theme,
    themes: ["light", "dark", "system"],
    setTheme: jest.fn(),
    systemTheme: undefined,
    forcedTheme: undefined,
    resolvedTheme: theme === "system" ? "light" : theme || "light",
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Toaster Rendering", () => {
    it("renders with default theme when no theme is provided", () => {
      mockUseTheme.mockReturnValue(createThemeMock("system"));

      render(<Toaster />);

      const toaster = screen.getByTestId("mock-toaster");
      expect(toaster).toBeInTheDocument();
      expect(toaster).toHaveAttribute("data-theme", "system");
      expect(toaster).toHaveClass("toaster group");
    });

    it("renders with light theme", () => {
      mockUseTheme.mockReturnValue(createThemeMock("light"));

      render(<Toaster />);

      const toaster = screen.getByTestId("mock-toaster");
      expect(toaster).toHaveAttribute("data-theme", "light");
    });

    it("renders with dark theme", () => {
      mockUseTheme.mockReturnValue(createThemeMock("dark"));

      render(<Toaster />);

      const toaster = screen.getByTestId("mock-toaster");
      expect(toaster).toHaveAttribute("data-theme", "dark");
    });

    it("applies custom CSS variables for styling", () => {
      mockUseTheme.mockReturnValue(createThemeMock("system"));

      render(<Toaster />);

      const toaster = screen.getByTestId("mock-toaster");
      expect(toaster).toHaveAttribute("style");
      const style = toaster.getAttribute("style");
      expect(style).toContain("--normal-bg: var(--popover)");
      expect(style).toContain("--normal-text: var(--popover-foreground)");
      expect(style).toContain("--normal-border: var(--border)");
    });

    it("forwards additional props to the Toaster component", () => {
      mockUseTheme.mockReturnValue(createThemeMock("system"));

      render(
        <Toaster
          position="top-right"
          richColors={true}
          closeButton={true}
          duration={5000}
        />
      );

      const toaster = screen.getByTestId("mock-toaster");
      expect(toaster).toHaveAttribute("data-position", "top-right");
      expect(toaster).toHaveAttribute("data-rich-colors", "true");
      expect(toaster).toHaveAttribute("data-close-button", "true");
      expect(toaster).toHaveAttribute("data-duration", "5000");
    });

    it("applies custom className along with default classes", () => {
      mockUseTheme.mockReturnValue(createThemeMock("system"));

      render(<Toaster className="custom-toaster-class" />);

      const toaster = screen.getByTestId("mock-toaster");
      expect(toaster).toHaveClass("toaster group");
      expect(toaster).toHaveClass("custom-toaster-class");
    });

    it("handles empty theme gracefully", () => {
      mockUseTheme.mockReturnValue(createThemeMock(undefined));

      render(<Toaster />);

      const toaster = screen.getByTestId("mock-toaster");
      expect(toaster).toBeInTheDocument();
      expect(toaster).toHaveAttribute("data-theme", "system");
    });

    it("handles null theme gracefully", () => {
      mockUseTheme.mockReturnValue(createThemeMock(null));

      render(<Toaster />);

      const toaster = screen.getByTestId("mock-toaster");
      expect(toaster).toBeInTheDocument();
      expect(toaster).toHaveAttribute("data-theme", "system");
    });
  });

  describe("Theme Integration", () => {
    it("calls useTheme hook on render", () => {
      mockUseTheme.mockReturnValue(createThemeMock("light"));

      render(<Toaster />);

      expect(mockUseTheme).toHaveBeenCalledTimes(1);
    });

    it("responds to theme changes", () => {
      const { rerender } = render(<Toaster />);

      // Initial render with light theme
      mockUseTheme.mockReturnValue(createThemeMock("light"));
      rerender(<Toaster />);

      let toaster = screen.getByTestId("mock-toaster");
      expect(toaster).toHaveAttribute("data-theme", "light");

      // Change to dark theme
      mockUseTheme.mockReturnValue(createThemeMock("dark"));
      rerender(<Toaster />);

      toaster = screen.getByTestId("mock-toaster");
      expect(toaster).toHaveAttribute("data-theme", "dark");
    });
  });

  describe("Props and Configuration", () => {
    it("accepts and passes through ToasterProps", () => {
      mockUseTheme.mockReturnValue(createThemeMock("system"));

      const toasterProps = {
        position: "bottom-left" as const,
        expand: true,
        duration: 3000,
        visibleToasts: 5,
        closeButton: false,
        richColors: false,
        theme: "dark" as const,
      };

      render(<Toaster {...toasterProps} />);

      const toaster = screen.getByTestId("mock-toaster");
      expect(toaster).toHaveAttribute("data-position", "bottom-left");
      expect(toaster).toHaveAttribute("data-expand", "true");
      expect(toaster).toHaveAttribute("data-duration", "3000");
      expect(toaster).toHaveAttribute("data-visible-toasts", "5");
      expect(toaster).toHaveAttribute("data-close-button", "false");
      expect(toaster).toHaveAttribute("data-rich-colors", "false");
      // Note: theme prop should override the useTheme value
      expect(toaster).toHaveAttribute("data-theme", "dark");
    });

    it("handles style prop override", () => {
      mockUseTheme.mockReturnValue(createThemeMock("system"));

      render(
        <Toaster
          style={
            {
              "--normal-bg": "custom-bg",
              "--normal-text": "custom-text",
              "--normal-border": "custom-border",
              top: "20px",
            } as React.CSSProperties
          }
        />
      );

      const toaster = screen.getByTestId("mock-toaster");
      expect(toaster).toHaveAttribute("style");
      const style = toaster.getAttribute("style");
      expect(style).toContain("--normal-bg: custom-bg");
      expect(style).toContain("--normal-text: custom-text");
      expect(style).toContain("--normal-border: custom-border");
      expect(style).toContain("top: 20px");
    });

    it("merges className props correctly", () => {
      mockUseTheme.mockReturnValue(createThemeMock("system"));

      render(
        <Toaster className="custom-class-1 custom-class-2" id="test-toaster" />
      );

      const toaster = screen.getByTestId("mock-toaster");
      expect(toaster).toHaveClass("toaster group");
      expect(toaster).toHaveClass("custom-class-1");
      expect(toaster).toHaveClass("custom-class-2");
      expect(toaster).toHaveAttribute("id", "test-toaster");
    });
  });

  describe("Edge Cases", () => {
    it("handles missing useTheme gracefully", () => {
      mockUseTheme.mockReturnValue(createThemeMock(undefined));

      render(<Toaster />);

      const toaster = screen.getByTestId("mock-toaster");
      expect(toaster).toBeInTheDocument();
      expect(toaster).toHaveAttribute("data-theme", "system");
    });

    it("handles useTheme returning null", () => {
      mockUseTheme.mockReturnValue(
        null as unknown as ReturnType<typeof useTheme>
      );

      // The component will throw an error when useTheme returns null
      expect(() => render(<Toaster />)).toThrow();
    });

    it("handles useTheme throwing error", () => {
      mockUseTheme.mockImplementation(() => {
        throw new Error("Theme error");
      });

      // The component will throw the error from useTheme
      expect(() => render(<Toaster />)).toThrow("Theme error");
    });

    it("renders with all props undefined", () => {
      mockUseTheme.mockReturnValue(createThemeMock(undefined));

      render(
        <Toaster
          position={undefined}
          duration={undefined}
          className={undefined}
          style={undefined}
        />
      );

      const toaster = screen.getByTestId("mock-toaster");
      expect(toaster).toBeInTheDocument();
      expect(toaster).toHaveAttribute("data-theme", "system");
      expect(toaster).toHaveClass("toaster group");
    });
  });

  describe("Integration Tests", () => {
    it("renders complete toaster with all features", () => {
      mockUseTheme.mockReturnValue(createThemeMock("dark"));

      render(
        <Toaster
          position="top-center"
          richColors={true}
          closeButton={true}
          duration={4000}
          expand={true}
          visibleToasts={3}
          className="integration-test-class"
          id="integration-toaster"
        />
      );

      const toaster = screen.getByTestId("mock-toaster");
      expect(toaster).toBeInTheDocument();
      expect(toaster).toHaveAttribute("data-theme", "dark");
      expect(toaster).toHaveClass("toaster group");
      expect(toaster).toHaveClass("integration-test-class");
      expect(toaster).toHaveAttribute("id", "integration-toaster");
      expect(toaster).toHaveAttribute("style");
      const style = toaster.getAttribute("style");
      expect(style).toContain("--normal-bg: var(--popover)");
      expect(style).toContain("--normal-text: var(--popover-foreground)");
      expect(style).toContain("--normal-border: var(--border)");
    });

    it("handles dynamic prop updates", () => {
      mockUseTheme.mockReturnValue(createThemeMock("light"));

      const { rerender } = render(<Toaster position="top-right" />);

      let toaster = screen.getByTestId("mock-toaster");
      expect(toaster).toHaveAttribute("data-position", "top-right");

      rerender(<Toaster position="bottom-left" />);

      toaster = screen.getByTestId("mock-toaster");
      expect(toaster).toHaveAttribute("data-position", "bottom-left");
    });

    it("maintains theme consistency across re-renders", () => {
      mockUseTheme.mockReturnValue(createThemeMock("dark"));

      const { rerender } = render(<Toaster />);

      let toaster = screen.getByTestId("mock-toaster");
      expect(toaster).toHaveAttribute("data-theme", "dark");

      // Re-render with same theme
      rerender(<Toaster />);
      toaster = screen.getByTestId("mock-toaster");
      expect(toaster).toHaveAttribute("data-theme", "dark");

      // Change theme and re-render
      mockUseTheme.mockReturnValue(createThemeMock("light"));
      rerender(<Toaster />);
      toaster = screen.getByTestId("mock-toaster");
      expect(toaster).toHaveAttribute("data-theme", "light");
    });
  });
});
