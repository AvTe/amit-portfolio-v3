import { ImageResponse } from "next/og";
import { DOMAINS } from "@/data/stack";
import { site } from "@/lib/site";

export const alt = site.title;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "#fbfbf9",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", fontSize: 22, letterSpacing: 6, color: "#7c7c77" }}>
            {`${site.role} · ${site.tagline}`.toUpperCase()}
          </div>
          <div style={{ display: "flex", width: 120, height: 4, background: "#ea580c" }} />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 26 }}>
          <div
            style={{
              display: "flex",
              fontSize: 96,
              fontWeight: 600,
              letterSpacing: -4,
              color: "#101010",
              lineHeight: 1,
            }}
          >
            {site.name}
          </div>
          <div style={{ display: "flex", fontSize: 30, color: "#5a5a57", maxWidth: 880, lineHeight: 1.35 }}>
            Full-stack, front to storefront — MERN platforms, Shopify and headless
            commerce, shipped for brands across the US, Canada, and Europe.
          </div>
        </div>

        {/* Flat echo of the massing model. */}
        <div style={{ display: "flex", alignItems: "flex-end", gap: 10 }}>
          {DOMAINS.flatMap((domain, column) =>
            Array.from({ length: 4 }).map((_, row) => (
              <div
                key={`${domain.id}-${row}`}
                style={{
                  display: "flex",
                  width: 34,
                  height: 26 + ((column * 4 + row) % 5) * 17,
                  background: (column * 4 + row) % 7 === 0 ? "#ea580c" : "#e2e2dc",
                }}
              />
            )),
          )}
        </div>
      </div>
    ),
    size,
  );
}
