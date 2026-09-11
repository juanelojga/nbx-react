"use client";

import { useEffect } from "react";

import { logger } from "@/lib/logger";

/**
 * Last-resort error boundary for the root layout. It renders outside the
 * locale layout, so no i18n context is available: copy is bilingual and static.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    logger.error("Unhandled application error", error);
  }, [error]);

  return (
    <html lang="es">
      <body
        style={{
          fontFamily: "system-ui, sans-serif",
          display: "flex",
          minHeight: "100vh",
          alignItems: "center",
          justifyContent: "center",
          padding: "1rem",
          textAlign: "center",
        }}
      >
        <div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 800 }}>
            Algo salió mal / Something went wrong
          </h1>
          <p style={{ color: "#555", margin: "0.75rem 0 1.5rem" }}>
            Ocurrió un error inesperado. / An unexpected error occurred.
          </p>
          <button
            type="button"
            onClick={reset}
            style={{
              padding: "0.6rem 1.25rem",
              borderRadius: "0.5rem",
              border: "1px solid #ccc",
              background: "#fff",
              cursor: "pointer",
            }}
          >
            Reintentar / Try again
          </button>
        </div>
      </body>
    </html>
  );
}
