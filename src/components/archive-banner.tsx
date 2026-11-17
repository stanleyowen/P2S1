import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { SITE } from "@/content/editions";

/** Site-wide notice that this site is a read-only archive. */
export function ArchiveBanner({ locale }: { locale: Locale }) {
  const d = getDictionary(locale);
  const t = d.archive;
  return (
    <div role="note" aria-label={t.label} className="bg-ink text-on-ink">
      <p className="wrap flex flex-wrap items-center justify-center gap-x-3 gap-y-1 py-2.5 text-center text-sm">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-gold/40 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider text-gold">
          <span aria-hidden className="size-1.5 rounded-full bg-gold" />
          {t.badge}
        </span>
        <span className="text-on-ink-muted">
          {t.notice} {d.footer.contact}{" "}
          <a href={`mailto:${SITE.contact}`} className="underline underline-offset-2 hover:text-on-ink">
            {SITE.contact}
          </a>
        </span>
      </p>
    </div>
  );
}
