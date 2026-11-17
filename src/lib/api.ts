// Client for the participant API that runs on the private server (see /server).
// Nothing in here — or anywhere in the site bundle — contains participant records.

export const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/+$/, "");

export type Entry = { name: string; class: string; competition: string; result: string };
export type SearchResponse = { query: string; total: number; truncated: boolean; results: Entry[] };
export type Champions = { competition: string; podium: { place: number; entries: { name: string; class: string }[] }[] }[];

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
  }
}

async function get<T>(path: string, signal?: AbortSignal): Promise<T> {
  if (!API_URL) throw new ApiError("Results are not available right now.", 0);
  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, { signal, mode: "cors", credentials: "omit", referrerPolicy: "no-referrer" });
  } catch (e) {
    if ((e as Error).name === "AbortError") throw e;
    throw new ApiError("Couldn't reach the results server. Check your connection and try again.", 0);
  }
  if (res.status === 429) throw new ApiError("Too many searches in a short time — wait a moment and try again.", 429);
  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as { error?: string } | null;
    throw new ApiError(body?.error ?? "Something went wrong. Please try again.", res.status);
  }
  return (await res.json()) as T;
}

export const searchParticipants = (year: number, q: string, signal?: AbortSignal) =>
  get<SearchResponse>(`/v1/editions/${year}/search?q=${encodeURIComponent(q)}`, signal);

export const fetchChampions = (year: number, signal?: AbortSignal) => get<Champions>(`/v1/editions/${year}/champions`, signal);
