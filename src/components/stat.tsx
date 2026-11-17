import type { Locale } from "@/i18n/config";
import { formatNumber } from "@/i18n/dictionaries";

/** A term/value pair for use inside a <dl>. Label is first in the DOM, number first visually. */
export function Stat({ value, label, locale, size = "lg" }: { value: number; label: string; locale: Locale; size?: "lg" | "md" }) {
  return (
    <div className={`flex flex-col-reverse ${size === "lg" ? "border-t border-line pt-4" : ""}`}>
      <dt className="mt-1 text-sm font-medium text-muted">{label}</dt>
      <dd className={`font-display font-bold tabular-nums tracking-tight text-fg ${size === "lg" ? "text-4xl sm:text-5xl" : "text-3xl"}`}>{formatNumber(locale, value)}</dd>
    </div>
  );
}
