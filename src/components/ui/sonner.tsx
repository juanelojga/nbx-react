"use client";

import { Toaster as Sonner, type ToasterProps } from "sonner";

// The app has no theme switcher (no ThemeProvider), so the toaster follows
// the OS preference via Sonner's built-in "system" theme.
const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="system"
      className="toaster group"
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };
