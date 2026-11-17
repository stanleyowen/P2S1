import type { MetadataRoute } from "next";
import { EDITIONS, SITE } from "@/content/editions";
import { LOCALES, href, languageAlternates } from "@/i18n/config";

export const dynamic = "force-static";

const abs = (path: string) => `${SITE.url}${path === "/" ? "" : path}`;

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ["/", ...EDITIONS.map((e) => `/${e.slug}`)];
  return paths.flatMap((path) => {
    const languages = Object.fromEntries(Object.entries(languageAlternates(path)).map(([l, p]) => [l, abs(p)]));
    return LOCALES.map((l) => ({ url: abs(href(l, path)), alternates: { languages } }));
  });
}
