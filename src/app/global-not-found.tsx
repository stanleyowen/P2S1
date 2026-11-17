// The site has one root layout per language, so the 404 page is a standalone document.
// Netlify serves it (out/404.html) for every unknown path, so it speaks both languages.
import type { Metadata } from "next";
import { display, sans } from "@/components/site-shell";
import { href } from "@/i18n/config";
import "./globals.css";

export const metadata: Metadata = { title: "Page not found · Halaman tidak ditemukan · P2S1" };

export default function GlobalNotFound() {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`}>
      <body className="min-h-dvh">
        <main className="wrap flex min-h-svh flex-col items-start justify-center gap-14 py-24">
          <section>
            <p className="eyebrow text-gold-ink">404</p>
            <h1 className="mt-4 font-display text-5xl font-extrabold sm:text-7xl">No podium here.</h1>
            <p className="mt-5 max-w-lg text-lg text-muted">The page you&rsquo;re looking for doesn&rsquo;t exist or has moved.</p>
            <a href={href("en", "/")} className="mt-8 inline-flex h-12 items-center rounded-full bg-fg px-6 font-bold text-bg">
              Back to home
            </a>
          </section>
          <section lang="id" className="border-t border-line pt-10">
            <p className="font-display text-3xl font-bold sm:text-4xl">Tidak ada podium di sini.</p>
            <p className="mt-3 max-w-lg text-lg text-muted">Halaman yang kamu cari tidak ada atau sudah dipindahkan.</p>
            <a href={href("id", "/")} className="mt-6 inline-flex h-12 items-center rounded-full border border-line px-6 font-bold">
              Kembali ke beranda
            </a>
          </section>
        </main>
      </body>
    </html>
  );
}
