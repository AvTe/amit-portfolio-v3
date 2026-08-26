import type { Metadata, Viewport } from "next";
import { dmSans, mono } from "@/lib/fonts";
import { buildPersonJsonLd, site } from "@/lib/site";
import { SiteMenu } from "@/components/site-menu";
import { SiteFooter } from "@/components/site-footer";
import { Analytics } from "@/components/analytics";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: site.title,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  keywords: site.keywords,
  authors: [{ name: site.name }],
  creator: site.name,
  alternates: { canonical: "/" },
  openGraph: {
    title: site.title,
    description: site.description,
    url: site.url,
    siteName: site.name,
    locale: site.locale,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: site.title,
    description: site.description,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0b0f" },
  ],
  colorScheme: "light dark",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    // The theme script below writes `data-theme` onto this element before
    // React hydrates, so the client attributes deliberately differ from the
    // server's. suppressHydrationWarning applies one level deep only — it
    // silences that attribute, not anything inside.
    <html
      lang="en"
      suppressHydrationWarning
      className={`${dmSans.variable} ${mono.variable}`}
    >
      <body>
        {/* Runs before the rest of the body parses, so a stored preference is
            applied before first paint. A plain inline script rather than
            next/script: beforeInteractive still executes after the initial
            markup streams, which is too late to prevent a flash. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem("theme");if(t==="dark"||t==="light"){document.documentElement.dataset.theme=t}}catch(e){}`,
          }}
        />
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <SiteMenu />
        <main id="main">{children}</main>
        <SiteFooter />
        {/* Production only. A Vercel preview build also runs with NODE_ENV
            "production", so previews would otherwise report as real traffic
            and quietly corrupt the numbers. */}
        {process.env.NODE_ENV === "production" &&
        process.env.VERCEL_ENV !== "preview" ? (
          <Analytics />
        ) : null}

        {/* Plain script so the structured data is present in the server HTML. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(buildPersonJsonLd()) }}
        />
      </body>
    </html>
  );
}
