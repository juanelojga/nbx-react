import React from "react";
import { render, screen } from "@testing-library/react";
import { Logo, LogoText } from "../logo";

// Mock Next.js Image component
jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: React.ComponentProps<"img"> & { priority?: boolean }) => {
    const { priority, ...imgProps } = props;
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...imgProps} data-priority={priority ? "true" : undefined} />;
  },
}));

describe("Logo Component", () => {
  describe("Logo Rendering", () => {
    it("renders with default size (md)", () => {
      render(<Logo />);

      const logo = screen.getByAltText("NarBox Logo");
      expect(logo).toBeInTheDocument();
      expect(logo).toHaveAttribute("src", "/images/narbox-logo.png");
      expect(logo).toHaveAttribute("width", "120");
      expect(logo).toHaveAttribute("height", "48");
      expect(logo).toHaveClass("object-contain");
    });

    it("renders with all size variants", () => {
      const sizes = ["sm", "md", "lg", "xl"] as const;
      const expectedDimensions = {
        sm: { width: "80", height: "32" },
        md: { width: "120", height: "48" },
        lg: { width: "160", height: "64" },
        xl: { width: "200", height: "80" },
      };

      sizes.forEach((size) => {
        const { unmount } = render(<Logo size={size} />);
        const logo = screen.getByAltText("NarBox Logo");
        expect(logo).toBeInTheDocument();
        expect(logo).toHaveAttribute("width", expectedDimensions[size].width);
        expect(logo).toHaveAttribute("height", expectedDimensions[size].height);
        unmount();
      });
    });

    it("renders with custom className", () => {
      render(<Logo className="custom-logo-class" />);

      const logo = screen.getByAltText("NarBox Logo");
      expect(logo).toBeInTheDocument();
      expect(logo.parentElement).toHaveClass("custom-logo-class");
    });

    it("renders with priority loading", () => {
      render(<Logo />);

      const logo = screen.getByAltText("NarBox Logo");
      expect(logo).toHaveAttribute("data-priority", "true");
    });

    it("renders with flex container", () => {
      render(<Logo />);

      const logo = screen.getByAltText("NarBox Logo");
      expect(logo.parentElement).toHaveClass("flex");
      expect(logo.parentElement).toHaveClass("items-center");
    });

    it("renders with multiple props combined", () => {
      render(<Logo size="lg" className="header-logo" />);

      const logo = screen.getByAltText("NarBox Logo");
      expect(logo).toBeInTheDocument();
      expect(logo).toHaveAttribute("width", "160");
      expect(logo).toHaveAttribute("height", "64");
      expect(logo.parentElement).toHaveClass("header-logo");
    });
  });

  describe("LogoText Component", () => {
    it("renders with default size (md)", () => {
      render(<LogoText />);

      const logoText = screen.getByText((content, element) => {
        return (
          element?.textContent === "NarBox" &&
          element.tagName.toLowerCase() === "div" &&
          element.classList.contains("font-bold")
        );
      });
      expect(logoText).toBeInTheDocument();
      expect(logoText).toHaveClass("font-bold");
      expect(logoText).toHaveClass("tracking-tight");
      expect(logoText).toHaveClass("text-2xl");
      expect(logoText).toHaveClass("text-primary");
    });

    it("renders with all size variants", () => {
      const sizes = ["sm", "md", "lg", "xl"] as const;
      const expectedTextSizes = {
        sm: "text-lg",
        md: "text-2xl",
        lg: "text-3xl",
        xl: "text-4xl",
      };

      sizes.forEach((size) => {
        const { unmount } = render(<LogoText size={size} />);
        const logoText = screen.getByText((content, element) => {
          return (
            element?.textContent === "NarBox" &&
            element.tagName.toLowerCase() === "div" &&
            element.classList.contains("font-bold")
          );
        });
        expect(logoText).toBeInTheDocument();
        expect(logoText).toHaveClass(expectedTextSizes[size]);
        unmount();
      });
    });

    it("renders with styled span for 'Box' part", () => {
      render(<LogoText />);

      const narboxText = screen.getByText((content, element) => {
        return (
          element?.textContent === "NarBox" &&
          element.tagName.toLowerCase() === "div" &&
          element.classList.contains("font-bold")
        );
      });
      const spanElement = narboxText.querySelector("span");
      expect(spanElement).toBeInTheDocument();
      expect(spanElement).toHaveTextContent("Box");
      expect(spanElement).toHaveClass("text-secondary");
    });

    it("renders with custom className", () => {
      render(<LogoText className="custom-text-logo" />);

      const container = screen.getByText((content, element) => {
        return (
          element?.textContent === "NarBox" &&
          element.tagName.toLowerCase() === "div" &&
          element.classList.contains("font-bold")
        );
      }).parentElement;
      expect(container).toHaveClass("custom-text-logo");
    });

    it("renders with flex container and gap", () => {
      render(<LogoText />);

      const container = screen.getByText((content, element) => {
        return (
          element?.textContent === "NarBox" &&
          element.tagName.toLowerCase() === "div" &&
          element.classList.contains("font-bold")
        );
      }).parentElement;
      expect(container).toHaveClass("flex");
      expect(container).toHaveClass("items-center");
      expect(container).toHaveClass("gap-2");
    });

    it("renders with multiple props combined", () => {
      render(<LogoText size="lg" className="footer-logo-text" />);

      const logoText = screen.getByText((content, element) => {
        return (
          element?.textContent === "NarBox" &&
          element.tagName.toLowerCase() === "div" &&
          element.classList.contains("font-bold")
        );
      });
      expect(logoText).toBeInTheDocument();
      expect(logoText).toHaveClass("text-3xl");
      const container = logoText.parentElement;
      expect(container).toHaveClass("footer-logo-text");
    });
  });

  describe("Integration Tests", () => {
    it("renders both Logo and LogoText components together", () => {
      render(
        <>
          <Logo size="sm" />
          <LogoText size="lg" />
        </>
      );

      const imageLogo = screen.getByAltText("NarBox Logo");
      const textLogo = screen.getByText((content, element) => {
        return (
          element?.textContent === "NarBox" &&
          element.tagName.toLowerCase() === "div" &&
          element.classList.contains("font-bold")
        );
      });

      expect(imageLogo).toBeInTheDocument();
      expect(textLogo).toBeInTheDocument();
      expect(imageLogo).toHaveAttribute("width", "80");
      expect(textLogo).toHaveClass("text-3xl");
    });

    it("handles dynamic size prop changes", () => {
      const { rerender } = render(<Logo size="sm" />);

      let logo = screen.getByAltText("NarBox Logo");
      expect(logo).toHaveAttribute("width", "80");

      rerender(<Logo size="xl" />);

      logo = screen.getByAltText("NarBox Logo");
      expect(logo).toHaveAttribute("width", "200");
    });

    it("handles dynamic className prop changes", () => {
      const { rerender } = render(<LogoText className="initial-class" />);

      let container = screen.getByText((content, element) => {
        return (
          element?.textContent === "NarBox" &&
          element.tagName.toLowerCase() === "div" &&
          element.classList.contains("font-bold")
        );
      }).parentElement;
      expect(container).toHaveClass("initial-class");

      rerender(<LogoText className="updated-class" />);

      container = screen.getByText((content, element) => {
        return (
          element?.textContent === "NarBox" &&
          element.tagName.toLowerCase() === "div" &&
          element.classList.contains("font-bold")
        );
      }).parentElement;
      expect(container).toHaveClass("updated-class");
      expect(container).not.toHaveClass("initial-class");
    });

    it("renders with empty className", () => {
      render(<Logo className="" />);

      const logo = screen.getByAltText("NarBox Logo");
      expect(logo).toBeInTheDocument();
      expect(logo.parentElement).toHaveClass("flex");
      expect(logo.parentElement).toHaveClass("items-center");
    });

    it("renders with undefined className", () => {
      render(<LogoText className={undefined} />);

      const logoText = screen.getByText((content, element) => {
        return (
          element?.textContent === "NarBox" &&
          element.tagName.toLowerCase() === "div" &&
          element.classList.contains("font-bold")
        );
      });
      expect(logoText).toBeInTheDocument();
      expect(logoText.parentElement).toHaveClass("flex");
      expect(logoText.parentElement).toHaveClass("items-center");
    });
  });

  describe("Edge Cases", () => {
    it("handles all props being undefined for Logo", () => {
      render(<Logo size={undefined} className={undefined} />);

      const logo = screen.getByAltText("NarBox Logo");
      expect(logo).toBeInTheDocument();
      expect(logo).toHaveAttribute("width", "120");
      expect(logo).toHaveAttribute("height", "48");
    });

    it("handles all props being undefined for LogoText", () => {
      render(<LogoText size={undefined} className={undefined} />);

      const logoText = screen.getByText((content, element) => {
        return (
          element?.textContent === "NarBox" &&
          element.tagName.toLowerCase() === "div" &&
          element.classList.contains("font-bold")
        );
      });
      expect(logoText).toBeInTheDocument();
      expect(logoText).toHaveClass("text-2xl");
    });

    it("handles multiple className values", () => {
      render(<Logo className="class1 class2 class3" />);

      const logo = screen.getByAltText("NarBox Logo");
      expect(logo.parentElement).toHaveClass("class1");
      expect(logo.parentElement).toHaveClass("class2");
      expect(logo.parentElement).toHaveClass("class3");
    });

    it("maintains proper HTML structure for Logo", () => {
      render(<Logo />);

      const logo = screen.getByAltText("NarBox Logo");
      expect(logo.tagName.toLowerCase()).toBe("img");
      expect(logo.parentElement?.tagName.toLowerCase()).toBe("div");
    });

    it("maintains proper HTML structure for LogoText", () => {
      render(<LogoText />);

      const logoText = screen.getByText((content, element) => {
        return (
          element?.textContent === "NarBox" &&
          element.tagName.toLowerCase() === "div" &&
          element.classList.contains("font-bold")
        );
      });
      expect(logoText.tagName.toLowerCase()).toBe("div");
      expect(logoText.parentElement?.tagName.toLowerCase()).toBe("div");
    });
  });

  describe("Accessibility", () => {
    it("has proper alt text for logo image", () => {
      render(<Logo />);

      const logo = screen.getByAltText("NarBox Logo");
      expect(logo).toHaveAttribute("alt", "NarBox Logo");
    });

    it("LogoText has proper text content for screen readers", () => {
      render(<LogoText />);

      const logoText = screen.getByText((content, element) => {
        return (
          element?.textContent === "NarBox" &&
          element.tagName.toLowerCase() === "div" &&
          element.classList.contains("font-bold")
        );
      });
      expect(logoText).toBeInTheDocument();
      expect(logoText).toHaveTextContent("NarBox");
    });

    it("LogoText has semantic HTML structure", () => {
      render(<LogoText />);

      const container = screen.getByText((content, element) => {
        return (
          element?.textContent === "NarBox" &&
          element.tagName.toLowerCase() === "div" &&
          element.classList.contains("font-bold")
        );
      }).parentElement;
      expect(container).toHaveClass("flex");
      expect(container).toHaveClass("items-center");
    });
  });
});
