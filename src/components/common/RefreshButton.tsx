"use client";

import { RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";

interface RefreshButtonProps {
  onClick: () => void | Promise<void>;
  loading: boolean;
  label: string;
}

export function RefreshButton({ onClick, loading, label }: RefreshButtonProps) {
  return (
    <Button
      variant="outline"
      onClick={() => void onClick()}
      disabled={loading}
      className="sm:w-auto"
    >
      <RefreshCw
        className={loading ? "mr-2 h-4 w-4 animate-spin" : "mr-2 h-4 w-4"}
        aria-hidden="true"
      />
      {label}
    </Button>
  );
}
