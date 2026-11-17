import type { MetadataRoute } from "next";
import { EDITIONS, SITE } from "@/content/editions";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: SITE.url }, ...EDITIONS.map((e) => ({ url: `${SITE.url}/${e.slug}` }))];
}
