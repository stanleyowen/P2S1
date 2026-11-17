import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Plus_Jakarta_Sans } from "next/font/google";
import { ArchiveBanner } from "@/components/archive-banner";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { EDITIONS, SITE } from "@/content/editions";
import { getImage } from "@/lib/images";
import "./globals.css";

// Self-hosted at build time by next/font — no requests to Google from visitors' browsers.
const display = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-bricolage", display: "swap" });
const sans = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-jakarta", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: `${SITE.name} (P2S1)`, template: `%s · P2S1` },
  description: SITE.description,
  applicationName: "P2S1",
  openGraph: { type: "website", siteName: SITE.name, locale: "en_US", images: [{ url: "/og/og-home.jpg", width: 1200, height: 630 }] },
  twitter: { card: "summary_large_image" },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-32x32.png", type: "image/png", sizes: "32x32" },
      { url: "/favicon-16x16.png", type: "image/png", sizes: "16x16" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7f4ed" },
    { media: "(prefers-color-scheme: dark)", color: "#0d0c0a" },
  ],
};

const NAV = [
  { href: "/", label: "Home" },
  ...EDITIONS.map((e) => ({ href: `/${e.slug}`, label: `${e.year} · ${e.roman}`, match: `/${e.slug}` })),
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`}>
      <body className="min-h-dvh">
        <a href="#main" className="sr-only z-50 rounded-full bg-fg px-4 py-2 text-bg focus:not-sr-only focus:fixed focus:left-4 focus:top-3">
          Skip to content
        </a>
        <ArchiveBanner />
        <SiteHeader logo={getImage("logos/2024")} nav={NAV} />
        <main id="main">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
