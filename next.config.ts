import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Fully static site: Netlify serves `out/`, security headers come from netlify.toml + out/_headers.
  output: "export",
  reactStrictMode: true,
  poweredByHeader: false,
  // Images are pre-built by scripts/build-images.mjs (AVIF/WebP, content-hashed), not next/image.
  images: { unoptimized: true },
};

export default nextConfig;
