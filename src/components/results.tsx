"use client";

import { useEffect, useId, useMemo, useRef, useState, type FormEvent } from "react";
import type { Locale } from "@/i18n/config";
import { getDictionary, type Dictionary } from "@/i18n/dictionaries";
import { ApiError, fetchChampions, searchParticipants, type Champions, type SearchResponse } from "@/lib/api";
import { Lock, Search } from "./icons";

const MIN = 3;
// Mirrors the API: a query needs at least one word of MIN+ letters ("a b" is rejected).
const searchable = (q: string) => q.split(/\s+/).some((w) => w.replace(/[.,'’-]/g, "").length >= MIN);
const TEAM_THRESHOLD = 6; // podium places with more names than this (choirs, tug of war) collapse into a team summary

type SearchState =
  | { status: "idle" }
  | { status: "loading"; q: string }
  | { status: "done"; data: SearchResponse }
  | { status: "error"; message: string };

const PLACE: Record<number, string> = {
  1: "bg-gold text-black",
  2: "bg-silver text-black",
  3: "bg-bronze text-white",
};
const isPodium = (n: number): n is 1 | 2 | 3 => n in PLACE;

const errorMessage = (e: unknown, t: Dictionary) => (e instanceof ApiError ? t.errors[e.kind] : t.errors.server);

function ResultBadge({ result, t }: { result: string; t: Dictionary }) {
  const n = Number.parseInt(result, 10);
  if (!isPodium(n)) return <span className="inline-flex rounded-full border border-line px-2.5 py-0.5 text-xs font-semibold text-muted">{result}</span>;
  return <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-bold ${PLACE[n]}`}>{t.results.place(n)}</span>;
}

const titleCase = (s: string) => s.toLowerCase().replace(/(^|[\s'-])(\p{L})/gu, (_, a: string, b: string) => a + b.toUpperCase());

export function ParticipantSearch({ year, locale }: { year: number; locale: Locale }) {
  const t = getDictionary(locale);
  const r = t.results;
  const id = useId();
  const [q, setQ] = useState("");
  const [state, setState] = useState<SearchState>({ status: "idle" });
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const ctrl = useRef<AbortController>(undefined);

  useEffect(() => () => (clearTimeout(timer.current), ctrl.current?.abort()), []);

  const run = (value: string) => {
    clearTimeout(timer.current);
    ctrl.current?.abort();
    const query = value.trim();
    if (!searchable(query)) return setState({ status: "idle" });
    const c = new AbortController();
    ctrl.current = c;
    setState({ status: "loading", q: query });
    searchParticipants(year, query, c.signal)
      .then((data) => setState({ status: "done", data }))
      .catch((e: unknown) => {
        if ((e as Error).name !== "AbortError") setState({ status: "error", message: errorMessage(e, t) });
      });
  };

  const onChange = (value: string) => {
    setQ(value);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => run(value), 350);
  };
  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    run(q);
  };

  const status =
    state.status === "loading"
      ? r.searching
      : state.status === "error"
        ? state.message
        : state.status === "done"
          ? state.data.total === 0
            ? r.noMatch(state.data.query)
            : state.data.truncated
              ? r.truncated(state.data.results.length, state.data.total)
              : r.found(state.data.total)
          : q.trim().length > 0 && !searchable(q.trim())
            ? r.minChars(MIN)
            : "";

  return (
    <div>
      <form role="search" onSubmit={onSubmit} className="relative">
        <label htmlFor={`${id}-q`} className="sr-only">
          {r.searchLabel(year)}
        </label>
        <Search className="pointer-events-none absolute left-5 top-1/2 size-5 -translate-y-1/2 text-muted" />
        <input
          id={`${id}-q`}
          type="search"
          inputMode="search"
          autoComplete="off"
          spellCheck={false}
          maxLength={64}
          value={q}
          onChange={(e) => onChange(e.target.value)}
          placeholder={r.placeholder}
          aria-describedby={`${id}-status`}
          className="h-14 w-full rounded-full border border-line bg-surface pl-13 pr-32 text-base shadow-sm outline-none transition placeholder:text-muted/70 focus:border-accent focus:ring-4 focus:ring-accent/15"
        />
        <button type="submit" className="absolute right-2 top-2 h-10 rounded-full bg-fg px-5 text-sm font-bold text-bg transition hover:opacity-90">
          {r.search}
        </button>
      </form>

      <p id={`${id}-status`} role="status" aria-live="polite" className="mt-3 min-h-6 px-2 text-sm text-muted">
        {status}
      </p>

      {state.status === "done" && state.data.results.length > 0 && (
        <div className="mt-2 overflow-hidden rounded-2xl border border-line bg-surface">
          <table className="w-full text-left text-sm">
            <caption className="sr-only">{r.caption(state.data.query)}</caption>
            <thead className="hidden border-b border-line bg-surface-2/60 text-xs uppercase tracking-wider text-muted sm:table-header-group">
              <tr>
                <th scope="col" className="px-5 py-3 font-semibold">{r.name}</th>
                <th scope="col" className="px-5 py-3 font-semibold">{r.class}</th>
                <th scope="col" className="px-5 py-3 font-semibold">{r.competition}</th>
                <th scope="col" className="px-5 py-3 font-semibold">{r.result}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {state.data.results.map((row, i) => (
                <tr key={`${row.name}-${row.competition}-${i}`} className="grid grid-cols-[1fr_auto] gap-x-3 gap-y-1 px-5 py-4 sm:table-row sm:p-0">
                  <td className="font-semibold sm:px-5 sm:py-3.5">{titleCase(row.name)}</td>
                  <td className="row-start-2 text-muted sm:px-5 sm:py-3.5">{row.class}</td>
                  <td className="col-span-2 row-start-3 sm:px-5 sm:py-3.5">{row.competition}</td>
                  <td className="col-start-2 row-span-2 row-start-1 self-center sm:px-5 sm:py-3.5">
                    <ResultBadge result={row.result} t={t} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <p className="mt-5 flex items-start gap-2 px-2 text-xs leading-relaxed text-muted">
        <Lock className="mt-px size-4 shrink-0" />
        {r.privacy}
      </p>
    </div>
  );
}

export function ChampionsBoard({ year, locale }: { year: number; locale: Locale }) {
  const t = getDictionary(locale);
  const r = t.results;
  const id = useId();
  const [data, setData] = useState<Champions | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState("");
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const c = new AbortController();
    fetchChampions(year, c.signal)
      .then(setData)
      .catch((e: unknown) => {
        if ((e as Error).name !== "AbortError") setError(e instanceof ApiError ? errorMessage(e, t) : t.errors.champions);
      });
    return () => c.abort();
  }, [year, t]);

  const visible = useMemo(() => {
    if (!data) return [];
    const f = filter.trim().toLowerCase();
    const list = f ? data.filter((c) => c.competition.toLowerCase().includes(f)) : data;
    return f || showAll ? list : list.slice(0, 9);
  }, [data, filter, showAll]);

  if (error) return <p className="rounded-2xl border border-dashed border-line p-6 text-sm text-muted">{error}</p>;

  if (!data)
    return (
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3" aria-busy="true" aria-label={r.loadingChampions}>
        {Array.from({ length: 6 }, (_, i) => (
          <li key={i} className="h-44 animate-pulse rounded-2xl bg-surface-2" />
        ))}
      </ul>
    );

  return (
    <div>
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <label htmlFor={`${id}-f`} className="sr-only">
          {r.filterLabel}
        </label>
        <input
          id={`${id}-f`}
          type="search"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder={r.filterPlaceholder}
          className="h-11 w-full rounded-full border border-line bg-surface px-5 text-sm outline-none focus:border-accent focus:ring-4 focus:ring-accent/15 sm:max-w-xs"
        />
        <p className="text-sm text-muted">{r.withPodium(data.length)}</p>
      </div>

      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((c) => (
          <li key={c.competition} className="rounded-2xl border border-line bg-surface p-5">
            <h4 className="font-display text-lg font-bold leading-tight">{c.competition}</h4>
            <ol className="mt-4 space-y-3">
              {c.podium.map((p) => {
                return (
                  <li key={p.place} className="flex gap-3">
                    <span className={`grid size-7 shrink-0 place-items-center rounded-full text-xs font-bold ${PLACE[p.place] ?? ""}`} aria-label={isPodium(p.place) ? r.place(p.place) : String(p.place)}>
                      {p.place}
                    </span>
                    <span className="min-w-0 text-sm leading-snug">
                      {p.entries.length > TEAM_THRESHOLD ? (
                        <details className="group/team">
                          <summary className="cursor-pointer list-none font-semibold marker:hidden">
                            {[...new Set(p.entries.map((e) => e.class))].join(", ")}
                            <span className="font-normal text-muted"> · {r.team(p.entries.length)}</span>
                            <span className="ml-1 text-xs text-accent-ink group-open/team:hidden">{r.showMembers}</span>
                          </summary>
                          <span className="mt-2 block columns-2 gap-3 text-xs text-muted">
                            {p.entries.map((e, i) => (
                              <span key={`${e.name}-${i}`} className="block break-inside-avoid">
                                {titleCase(e.name)}
                              </span>
                            ))}
                          </span>
                        </details>
                      ) : (
                        p.entries.map((e, i) => (
                          <span key={`${e.name}-${i}`} className="block">
                            <span className="font-semibold">{titleCase(e.name)}</span> <span className="text-muted">· {e.class}</span>
                          </span>
                        ))
                      )}
                    </span>
                  </li>
                );
              })}
            </ol>
          </li>
        ))}
      </ul>

      {!filter && data.length > 9 && (
        <div className="mt-6 flex justify-center">
          <button type="button" onClick={() => setShowAll((s) => !s)} className="rounded-full border border-line bg-surface px-6 py-3 text-sm font-bold hover:bg-surface-2" aria-expanded={showAll}>
            {showAll ? r.showFewer : r.showAll(data.length)}
          </button>
        </div>
      )}
    </div>
  );
}
