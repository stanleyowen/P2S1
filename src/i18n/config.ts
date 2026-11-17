// The site is published in English (default, no prefix: /, /2023) and Indonesian (/id, /id/2023).
// Each language has its own root layout (src/app/(en) and src/app/id) so <html lang> is correct.

export const LOCALES = ["en", "id"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "en";

/** A value written once per language. */
export type Localized<T = string> = Record<Locale, T>;

export const LOCALE_META: Record<Locale, { name: string; short: string; og: string; intl: string }> = {
  en: { name: "English", short: "EN", og: "en_US", intl: "en-US" },
  id: { name: "Bahasa Indonesia", short: "ID", og: "id_ID", intl: "id-ID" },
};

/** Site path for a language: href("id", "/2023") → "/id/2023", href("en", "/") → "/". */
export function href(locale: Locale, path = "/"): string {
  if (locale === DEFAULT_LOCALE) return path;
  return path === "/" ? `/${locale}` : `/${locale}${path.startsWith("/") ? "" : "/"}${path}`;
}

/** Strips any language prefix: "/id/2023" → "/2023", "/id" → "/". */
export function stripLocale(pathname: string): string {
  for (const l of LOCALES) {
    if (l === DEFAULT_LOCALE) continue;
    if (pathname === `/${l}`) return "/";
    if (pathname.startsWith(`/${l}/`)) return pathname.slice(l.length + 1);
  }
  return pathname;
}

/** hreflang alternates for a language-neutral path, for `metadata.alternates.languages`. */
export const languageAlternates = (path: string) => ({
  ...Object.fromEntries(LOCALES.map((l) => [l, href(l, path)])),
  "x-default": href(DEFAULT_LOCALE, path),
});
