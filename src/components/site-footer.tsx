import Link from "next/link";
import { EDITIONS, SITE } from "@/content/editions";

export function SiteFooter() {
  return (
    <footer className="bg-ink text-on-ink">
      <div className="wrap grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <p className="font-display text-3xl font-bold tracking-tight">P2S1</p>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-on-ink-muted">
            Pekan Prestasi Sutomo 1 — the annual competition week of SMA Sutomo 1 Medan, organised by the student council (OSIS).
          </p>
        </div>
        <div>
          <p className="eyebrow text-gold">Editions</p>
          <ul className="mt-4 space-y-2 text-sm">
            {EDITIONS.map((e) => (
              <li key={e.slug}>
                <Link href={`/${e.slug}`} className="text-on-ink-muted hover:text-on-ink">
                  P2S1 {e.roman} · {e.year}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="eyebrow text-gold">Results</p>
          <ul className="mt-4 space-y-2 text-sm">
            {EDITIONS.map((e) => (
              <li key={e.slug}>
                <Link href={`/${e.slug}#results`} className="text-on-ink-muted hover:text-on-ink">
                  Find a participant · {e.year}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="wrap flex flex-col gap-2 py-6 text-xs text-on-ink-muted sm:flex-row sm:items-center sm:justify-between">
          <p>Photos © {SITE.organiser}. Shared for the school community — please ask before reusing.</p>
          <a href={SITE.repo} className="hover:text-on-ink" rel="noopener noreferrer" target="_blank">
            Source on GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}
