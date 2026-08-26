import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/**
 * iOS home-screen icon.
 *
 * Full-bleed, with no corner radius of its own: iOS applies its own mask, and
 * a pre-rounded icon ends up with the corners clipped twice and a dark fringe
 * where the transparent corners meet the mask.
 *
 * Fixed light-theme blue — unlike the SVG favicon there is no media query
 * available here, and the icon sits on the user's wallpaper rather than on a
 * browser chrome.
 */
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "#2c35c6",
        }}
      />
    ),
    size,
  );
}
