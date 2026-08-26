"use client";

/**
 * Last resort: a throw in the root layout itself, which replaces the entire
 * document rather than rendering inside it.
 *
 * Styles are inline on purpose. This boundary exists for the case where the
 * layout failed, and the stylesheet is part of what the layout brings — relying
 * on a class here risks an unstyled page at exactly the moment the visitor most
 * needs a way out. It also carries its own `html` and `body`, which Next
 * requires for this file.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "grid",
          placeContent: "center",
          gap: "1rem",
          padding: "2rem",
          background: "#ffffff",
          color: "#101114",
          fontFamily: "ui-sans-serif, system-ui, sans-serif",
          textAlign: "center",
        }}
      >
        <h1 style={{ margin: 0, fontSize: "1.5rem", letterSpacing: "-0.02em" }}>
          This page failed to load
        </h1>
        <p style={{ margin: 0, color: "#55575e", maxWidth: "38ch" }}>
          Something went wrong before the page could start. Reloading usually
          clears it.
        </p>
        <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center" }}>
          <button
            type="button"
            onClick={reset}
            style={{
              font: "inherit",
              padding: "0.6rem 1.1rem",
              borderRadius: "999px",
              border: 0,
              background: "#2c35c6",
              color: "#ffffff",
              cursor: "pointer",
            }}
          >
            Reload
          </button>
          {/* A plain anchor, not next/link, on purpose: this boundary fires when
              the root layout failed, so a client-side navigation would depend on
              the router that just broke. A full document load is the recovery. */}
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a
            href="/"
            style={{
              font: "inherit",
              padding: "0.6rem 1.1rem",
              borderRadius: "999px",
              border: "1px solid #cdcfd6",
              color: "#101114",
              textDecoration: "none",
            }}
          >
            Back to start
          </a>
        </div>
        {error.digest ? (
          <p style={{ margin: 0, fontSize: "0.75rem", color: "#6e7178" }}>
            Reference {error.digest}
          </p>
        ) : null}
      </body>
    </html>
  );
}
