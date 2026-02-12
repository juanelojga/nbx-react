import React from "react";
import { render, screen } from "@testing-library/react";
import { StatusBadge } from "../status-badge";

describe("StatusBadge Component", () => {
  describe("Rendering", () => {
    it("renders awaiting_payment status with correct label", () => {
      render(
        <StatusBadge status="awaiting_payment" label="Awaiting Payment" />
      );

      const badge = screen.getByText("Awaiting Payment");
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveAttribute("data-slot", "badge");
    });

    it("renders pending status with correct label", () => {
      render(<StatusBadge status="pending" label="Pending" />);

      const badge = screen.getByText("Pending");
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveAttribute("data-slot", "badge");
    });

    it("renders processing status with correct label", () => {
      render(<StatusBadge status="processing" label="Processing" />);

      const badge = screen.getByText("Processing");
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveAttribute("data-slot", "badge");
    });

    it("renders in_transit status with correct label", () => {
      render(<StatusBadge status="in_transit" label="In Transit" />);

      const badge = screen.getByText("In Transit");
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveAttribute("data-slot", "badge");
    });

    it("renders delivered status with correct label", () => {
      render(<StatusBadge status="delivered" label="Delivered" />);

      const badge = screen.getByText("Delivered");
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveAttribute("data-slot", "badge");
    });

    it("renders cancelled status with correct label", () => {
      render(<StatusBadge status="cancelled" label="Cancelled" />);

      const badge = screen.getByText("Cancelled");
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveAttribute("data-slot", "badge");
    });
  });

  describe("Styling", () => {
    it("applies awaiting_payment status styles", () => {
      render(
        <StatusBadge status="awaiting_payment" label="Awaiting Payment" />
      );

      const badge = screen.getByText("Awaiting Payment");
      expect(badge).toHaveClass("bg-yellow-100");
      expect(badge).toHaveClass("text-yellow-800");
      expect(badge).toHaveClass("border-yellow-300");
    });

    it("applies pending status styles", () => {
      render(<StatusBadge status="pending" label="Pending" />);

      const badge = screen.getByText("Pending");
      expect(badge).toHaveClass("bg-blue-100");
      expect(badge).toHaveClass("text-blue-800");
      expect(badge).toHaveClass("border-blue-300");
    });

    it("applies processing status styles", () => {
      render(<StatusBadge status="processing" label="Processing" />);

      const badge = screen.getByText("Processing");
      expect(badge).toHaveClass("bg-purple-100");
      expect(badge).toHaveClass("text-purple-800");
      expect(badge).toHaveClass("border-purple-300");
    });

    it("applies in_transit status styles", () => {
      render(<StatusBadge status="in_transit" label="In Transit" />);

      const badge = screen.getByText("In Transit");
      expect(badge).toHaveClass("bg-orange-100");
      expect(badge).toHaveClass("text-orange-800");
      expect(badge).toHaveClass("border-orange-300");
    });

    it("applies delivered status styles", () => {
      render(<StatusBadge status="delivered" label="Delivered" />);

      const badge = screen.getByText("Delivered");
      expect(badge).toHaveClass("bg-green-100");
      expect(badge).toHaveClass("text-green-800");
      expect(badge).toHaveClass("border-green-300");
    });

    it("applies cancelled status styles", () => {
      render(<StatusBadge status="cancelled" label="Cancelled" />);

      const badge = screen.getByText("Cancelled");
      expect(badge).toHaveClass("bg-red-100");
      expect(badge).toHaveClass("text-red-800");
      expect(badge).toHaveClass("border-red-300");
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

    it("renders icon for unknown status", () => {
      // @ts-expect-error Testing fallback for invalid status
      render(<StatusBadge status="invalid" label="Invalid" />);

      const badge = screen.getByText("Invalid");
      const svg = badge.querySelector("svg");
      expect(svg).toBeInTheDocument();
    });
  });
});
