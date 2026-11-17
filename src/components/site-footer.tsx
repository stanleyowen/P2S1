import Link from "next/link";
import { EDITIONS, SITE } from "@/content/editions";
import { href, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";

export function SiteFooter({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  return (
    <footer className="bg-ink text-on-ink">
      <div className="wrap grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <p className="font-display text-3xl font-bold tracking-tight">P2S1</p>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-on-ink-muted">Pekan Prestasi Sutomo 1 — {t.site.tagline}</p>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-on-ink-muted">
            <span className="font-semibold text-gold">{t.footer.archived}</span> {t.archive.notice}
          </p>
        </div>
        <div>
          <p className="eyebrow text-gold">{t.footer.editions}</p>
          <ul className="mt-4 space-y-2 text-sm">
            {EDITIONS.map((e) => (
              <li key={e.slug}>
                <Link href={href(locale, `/${e.slug}`)} className="text-on-ink-muted hover:text-on-ink">
                  P2S1 {e.roman} · {e.year}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="eyebrow text-gold">{t.footer.results}</p>
          <ul className="mt-4 space-y-2 text-sm">
            {EDITIONS.filter((e) => e.results).map((e) => (
              <li key={e.slug}>
                <Link href={href(locale, `/${e.slug}#results`)} className="text-on-ink-muted hover:text-on-ink">
                  {t.footer.findParticipant} · {e.year}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="wrap flex flex-col gap-2 py-6 text-xs text-on-ink-muted sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <p>{t.footer.unofficial}</p>
            <p>{t.footer.photos(SITE.organiser)}</p>
          </div>
          <a href={SITE.repo} className="hover:text-on-ink" rel="noopener noreferrer" target="_blank">
            {t.footer.source}
          </a>
        </div>
      </div>
    </footer>
  );
}
