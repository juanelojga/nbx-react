import React from "react";
import { render, screen } from "@testing-library/react";
import { Avatar, AvatarFallback, AvatarImage } from "../avatar";

describe("Avatar Component", () => {
  describe("Avatar", () => {
    it("renders with default props", () => {
      render(<Avatar data-testid="avatar-root" />);
      const avatar = screen.getByTestId("avatar-root");
      expect(avatar).toBeInTheDocument();
      expect(avatar).toHaveAttribute("data-slot", "avatar");
    });

    it("applies custom className", () => {
      render(<Avatar className="custom-avatar" data-testid="avatar-root" />);
      const avatar = screen.getByTestId("avatar-root");
      expect(avatar).toHaveClass("custom-avatar");
    });

    it("forwards additional props", () => {
      render(
        <Avatar id="test-avatar" data-testid="avatar-root">
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
      );
      const avatar = screen.getByTestId("avatar-root");
      expect(avatar).toHaveAttribute("id", "test-avatar");
    });

    it("renders with children components", () => {
      render(
        <Avatar data-testid="avatar-root">
          <AvatarImage src="/test-image.jpg" alt="Test User" />
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
      );
      // Radix UI only renders the fallback initially, image loads asynchronously
      expect(screen.getByText("JD")).toBeInTheDocument();
    });

    it("has correct default styling classes", () => {
      render(<Avatar data-testid="avatar-root" />);
      const avatar = screen.getByTestId("avatar-root");
      expect(avatar).toHaveClass(
        "relative",
        "flex",
        "size-8",
        "shrink-0",
        "overflow-hidden",
        "rounded-full"
      );
    });

    it("handles custom size classes", () => {
      render(<Avatar className="size-16" data-testid="avatar-root" />);
      const avatar = screen.getByTestId("avatar-root");
      expect(avatar).toHaveClass("size-16");
    });
  });

  describe("AvatarFallback", () => {
    it("renders fallback content", () => {
      render(
        <Avatar>
          <AvatarFallback>AB</AvatarFallback>
        </Avatar>
      );

      const fallback = screen.getByText("AB");
      expect(fallback).toBeInTheDocument();
      expect(fallback).toHaveAttribute("data-slot", "avatar-fallback");
    });

    it("applies custom className", () => {
      render(
        <Avatar>
          <AvatarFallback className="custom-fallback">CD</AvatarFallback>
        </Avatar>
      );

      const fallback = screen.getByText("CD");
      expect(fallback).toHaveClass("custom-fallback");
    });

    it("has correct default styling classes", () => {
      render(
        <Avatar>
          <AvatarFallback>EF</AvatarFallback>
        </Avatar>
      );

      const fallback = screen.getByText("EF");
      expect(fallback).toHaveClass(
        "bg-muted",
        "flex",
        "size-full",
        "items-center",
        "justify-center",
        "rounded-full"
      );
    });

    it("forwards additional props", () => {
      render(
        <Avatar>
          <AvatarFallback id="fallback-id" data-testid="avatar-fallback">
            GH
          </AvatarFallback>
        </Avatar>
      );

      const fallback = screen.getByTestId("avatar-fallback");
      expect(fallback).toHaveAttribute("id", "fallback-id");
    });

    it("renders with different content types", () => {
      render(
        <Avatar>
          <AvatarFallback>
            <span>Icon</span>
          </AvatarFallback>
        </Avatar>
      );

      expect(screen.getByText("Icon")).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("avatar has proper ARIA role", () => {
      render(<Avatar role="img" data-testid="avatar-root" />);

      const avatar = screen.getByRole("img");
      expect(avatar).toBeInTheDocument();
    });

    it("fallback is accessible within avatar context", () => {
      render(
        <Avatar>
          <AvatarFallback aria-label="User Initials">AB</AvatarFallback>
        </Avatar>
      );

      const fallback = screen.getByText("AB");
      expect(fallback).toHaveAttribute("aria-label", "User Initials");
    });
  });

  describe("Edge Cases", () => {
    it("handles empty avatar", () => {
      render(<Avatar data-testid="avatar-root" />);

      const avatar = screen.getByTestId("avatar-root");
      expect(avatar).toBeInTheDocument();
      expect(avatar).toBeEmptyDOMElement();
    });

    it("handles empty fallback", () => {
      render(
        <Avatar data-testid="avatar-root">
          <AvatarFallback></AvatarFallback>
        </Avatar>
      );

      const fallback = screen
        .getByTestId("avatar-root")
        .querySelector('[data-slot="avatar-fallback"]');
      expect(fallback).toBeInTheDocument();
      expect(fallback).toBeEmptyDOMElement();
    });

    it("handles special characters in fallback", () => {
      render(
        <Avatar>
          <AvatarFallback>🎨</AvatarFallback>
        </Avatar>
      );

      expect(screen.getByText("🎨")).toBeInTheDocument();
    });

    it("handles long fallback text", () => {
      render(
        <Avatar>
          <AvatarFallback>VERYLONG</AvatarFallback>
        </Avatar>
      );

      expect(screen.getByText("VERYLONG")).toBeInTheDocument();
    });
  });
});
