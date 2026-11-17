import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Fully static site: Netlify serves `out/`, security headers come from netlify.toml + out/_headers.
  output: "export",
  reactStrictMode: true,
  poweredByHeader: false,
  // Images are pre-built by scripts/build-images.mjs (AVIF/WebP, content-hashed), not next/image.
  images: { unoptimized: true },
  // English and Indonesian each have their own root layout, so the 404 page is app/global-not-found.tsx.
  experimental: { globalNotFound: true },
};

export default nextConfig;
