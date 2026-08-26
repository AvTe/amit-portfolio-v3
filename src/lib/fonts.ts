import { DM_Sans, JetBrains_Mono } from "next/font/google";

/** Display and body. */
export const dmSans = DM_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "700"],
});

/**
 * Metadata only: dates, tags, section labels, the hero eyebrow. Pairing a
 * mono against the geometric sans is what makes the page read as built by an
 * engineer rather than assembled from a template.
 */
export const mono = JetBrains_Mono({
  variable: "--font-code",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500"],
});
