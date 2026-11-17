import { SiteShell, siteMetadata, siteViewport } from "@/components/site-shell";
import "../globals.css";

// Root layout for the Indonesian site. Each language has its own root layout so <html lang> is right.
export const metadata = siteMetadata("id");
export const viewport = siteViewport;

export default function Layout({ children }: { children: React.ReactNode }) {
  return <SiteShell locale="id">{children}</SiteShell>;
}
