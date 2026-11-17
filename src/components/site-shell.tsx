import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Plus_Jakarta_Sans } from "next/font/google";
import { ArchiveBanner } from "@/components/archive-banner";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { EDITIONS, SITE } from "@/content/editions";
import { LOCALES, LOCALE_META, href, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getImage } from "@/lib/images";

// Self-hosted at build time by next/font — no requests to Google from visitors' browsers.
export const display = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-bricolage", display: "swap" });
export const sans = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-jakarta", display: "swap" });

export function siteMetadata(locale: Locale): Metadata {
  return {
    metadataBase: new URL(SITE.url),
    title: { default: `${SITE.name} (P2S1)`, template: `%s · P2S1` },
    description: getDictionary(locale).site.description,
    applicationName: "P2S1",
    openGraph: {
      type: "website",
      siteName: SITE.name,
      locale: LOCALE_META[locale].og,
      alternateLocale: LOCALES.filter((l) => l !== locale).map((l) => LOCALE_META[l].og),
      images: [{ url: "/og/og-home.jpg", width: 1200, height: 630 }],
    },
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
}

export const siteViewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7f4ed" },
    { media: "(prefers-color-scheme: dark)", color: "#0d0c0a" },
  ],
};

/** <html> and <body> for one language. Each language's root layout renders this. */
export function SiteShell({ locale, children }: { locale: Locale; children: React.ReactNode }) {
  const t = getDictionary(locale);
  const nav = [
    { href: href(locale, "/"), label: t.header.home },
    ...EDITIONS.map((e) => ({ href: href(locale, `/${e.slug}`), label: `${e.year} · ${e.roman}`, match: href(locale, `/${e.slug}`) })),
  ];
  return (
    <html lang={locale} className={`${display.variable} ${sans.variable}`}>
      <body className="min-h-dvh">
        <a href="#main" className="sr-only z-50 rounded-full bg-fg px-4 py-2 text-bg focus:not-sr-only focus:fixed focus:left-4 focus:top-3">
          {t.header.skip}
        </a>
        <ArchiveBanner locale={locale} />
        <SiteHeader locale={locale} logo={getImage("logos/2024")} nav={nav} />
        <main id="main">{children}</main>
        <SiteFooter locale={locale} />
      </body>
    </html>
  );
}
