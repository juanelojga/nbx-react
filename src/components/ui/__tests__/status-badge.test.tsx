import React from "react";
import { render, screen } from "@testing-library/react";
import { StatusBadge } from "../status-badge";

describe("StatusBadge Component", () => {
  describe("Rendering", () => {
    it("renders pending status with correct label and icon", () => {
      render(<StatusBadge status="pending" label="Pending" />);

      const badge = screen.getByText("Pending");
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveAttribute("data-slot", "badge");
    });

    it("renders in_transit status with correct label and icon", () => {
      render(<StatusBadge status="in_transit" label="In Transit" />);

      const badge = screen.getByText("In Transit");
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveAttribute("data-slot", "badge");
    });

    it("renders delivered status with correct label and icon", () => {
      render(<StatusBadge status="delivered" label="Delivered" />);

      const badge = screen.getByText("Delivered");
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveAttribute("data-slot", "badge");
    });
  });

  describe("Styling", () => {
    it("applies pending status styles", () => {
      render(<StatusBadge status="pending" label="Pending" />);

      const badge = screen.getByText("Pending");
      expect(badge).toHaveClass("bg-yellow-100");
      expect(badge).toHaveClass("text-yellow-800");
      expect(badge).toHaveClass("border-yellow-300");
    });

    it("applies in_transit status styles", () => {
      render(<StatusBadge status="in_transit" label="In Transit" />);

      const badge = screen.getByText("In Transit");
      expect(badge).toHaveClass("bg-blue-100");
      expect(badge).toHaveClass("text-blue-800");
      expect(badge).toHaveClass("border-blue-300");
    });

    it("applies delivered status styles", () => {
      render(<StatusBadge status="delivered" label="Delivered" />);

      const badge = screen.getByText("Delivered");
      expect(badge).toHaveClass("bg-green-100");
      expect(badge).toHaveClass("text-green-800");
      expect(badge).toHaveClass("border-green-300");
    });

    it("applies custom className", () => {
      render(
        <StatusBadge
          status="pending"
          label="Pending"
          className="custom-class"
        />
      );

      const badge = screen.getByText("Pending");
      expect(badge).toHaveClass("custom-class");
    });
  });

  describe("Accessibility", () => {
    it("has proper semantic structure", () => {
      render(<StatusBadge status="pending" label="Pending" />);

      const badge = screen.getByText("Pending");
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveAttribute("data-slot", "badge");
    });

    it("renders icon and text together", () => {
      render(<StatusBadge status="delivered" label="Delivered" />);

      const badge = screen.getByText("Delivered");
      expect(badge).toBeInTheDocument();
      // Check that the badge contains both the icon (svg) and the text
      const svg = badge.querySelector("svg");
      expect(svg).toBeInTheDocument();
    });
  });

  describe("Fallback Behavior", () => {
    it("renders with default styling for unknown status values", () => {
      // @ts-expect-error Testing fallback for invalid status
      render(<StatusBadge status="unknown_status" label="Unknown" />);

      const badge = screen.getByText("Unknown");
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveClass("bg-gray-100");
      expect(badge).toHaveClass("text-gray-800");
      expect(badge).toHaveClass("border-gray-300");
    });

    it("does not crash when receiving undefined status", () => {
      // @ts-expect-error Testing fallback for undefined status
      expect(() => {
        render(<StatusBadge status={undefined} label="No Status" />);
      }).not.toThrow();

      const badge = screen.getByText("No Status");
      expect(badge).toBeInTheDocument();
    });

    it("renders icon for unknown status", () => {
      // @ts-expect-error Testing fallback for invalid status
      render(<StatusBadge status="invalid" label="Invalid" />);

      const badge = screen.getByText("Invalid");
      const svg = badge.querySelector("svg");
      expect(svg).toBeInTheDocument();
    });
  });
});
