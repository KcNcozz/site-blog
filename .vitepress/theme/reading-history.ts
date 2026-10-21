import { onBeforeUnmount, onMounted, readonly, shallowRef } from "vue";

export interface ReadingHistoryEntry {
  /** The content-loader URL, without the site's deployment base. */
  url: string;
  title: string;
  categoryLabel: string;
  percent: number;
  scrollY: number;
  updatedAt: number;
  anchor?: string;
  anchorOffset?: number;
}

export interface ReadingPosition {
  percent: number;
  scrollY: number;
  anchor?: string;
  anchorOffset?: number;
}

interface HistoryArticle {
  url: string;
  title: string;
  categoryLabel: string;
}

export const READING_HISTORY_KEY = "knowledge-reading-history";
const entries = shallowRef<ReadingHistoryEntry[]>([]);
let storageWriteFailed = false;

export function normalizeArticlePath(value: string): string {
  let path = value.split(/[?#]/, 1)[0].replace(/\\/g, "/");
  try { path = decodeURIComponent(path); } catch { /* Keep literal percent signs. */ }
  return `/${path.replace(/^\/+/, "")}`.replace(/\.(?:md|html)$/i, "").replace(/\/index$/, "/");
}

function validEntry(value: unknown): value is ReadingHistoryEntry {
  if (!value || typeof value !== "object") return false;
  const entry = value as Partial<ReadingHistoryEntry>;
  return typeof entry.url === "string" && entry.url.startsWith("/src/")
    && typeof entry.title === "string" && typeof entry.categoryLabel === "string"
    && Number.isFinite(entry.percent) && Number.isFinite(entry.scrollY)
    && Number.isFinite(entry.updatedAt);
}

function compactHistory(values: ReadingHistoryEntry[]): ReadingHistoryEntry[] {
  const seen = new Set<string>();
  return values.sort((a, b) => b.updatedAt - a.updatedAt).filter((entry) => {
    const key = normalizeArticlePath(entry.url);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  }).slice(0, 5).map((entry) => ({
    url: entry.url,
    title: entry.title,
    categoryLabel: entry.categoryLabel,
    percent: Math.min(100, Math.max(0, Math.round(entry.percent))),
    scrollY: Math.max(0, entry.scrollY),
    updatedAt: entry.updatedAt,
    ...(typeof entry.anchor === "string" ? { anchor: entry.anchor } : {}),
    ...(Number.isFinite(entry.anchorOffset) ? { anchorOffset: entry.anchorOffset } : {}),
  }));
}

export function loadReadingHistory(): ReadingHistoryEntry[] {
  if (typeof window === "undefined") return [];
  if (storageWriteFailed) return entries.value;
  try {
    const stored = window.localStorage.getItem(READING_HISTORY_KEY);
    if (!stored) { entries.value = []; return []; }
    const parsed: unknown = JSON.parse(stored);
    entries.value = Array.isArray(parsed) ? compactHistory(parsed.filter(validEntry)) : [];
  } catch {
    // Keep the in-memory history if storage is blocked or full.
  }
  return entries.value;
}

function persistHistory(next: ReadingHistoryEntry[]) {
  entries.value = compactHistory(next);
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(READING_HISTORY_KEY, JSON.stringify(entries.value));
    storageWriteFailed = false;
  } catch {
    storageWriteFailed = true;
    // Reading progress remains available for the current browser session.
  }
}

export function getReadingHistory(url: string): ReadingHistoryEntry | undefined {
  const entry = entries.value.find((item) => normalizeArticlePath(item.url) === normalizeArticlePath(url));
  return entry ? { ...entry } : undefined;
}

/** Mark an article as opened without overwriting an existing saved position. */
export function touchReadingHistory(article: HistoryArticle) {
  if (typeof window === "undefined" || !article.url.startsWith("/src/")) return;
  loadReadingHistory();
  const previous = getReadingHistory(article.url);
  persistHistory([
    { percent: 0, scrollY: 0, ...previous, ...article, updatedAt: Date.now() },
    ...entries.value.filter((item) => normalizeArticlePath(item.url) !== normalizeArticlePath(article.url)),
  ]);
}

export function saveReadingProgress(article: HistoryArticle, position: ReadingPosition) {
  if (typeof window === "undefined" || !article.url.startsWith("/src/") || !Number.isFinite(position.scrollY) || !Number.isFinite(position.percent)) return;
  // Merge with the latest stored list so another tab's recently opened article
  // is not lost when this tab saves its next progress snapshot.
  loadReadingHistory();
  persistHistory([
    { ...article, ...position, updatedAt: Date.now() },
    ...entries.value.filter((item) => normalizeArticlePath(item.url) !== normalizeArticlePath(article.url)),
  ]);
}

export function clearReadingHistory() { persistHistory([]); }

/** Client-only history loading keeps SSR output and the first hydration consistent. */
export function useReadingHistory() {
  function sync(event: StorageEvent) {
    if (event.key === READING_HISTORY_KEY || event.key === null) loadReadingHistory();
  }
  onMounted(() => {
    loadReadingHistory();
    window.addEventListener("storage", sync);
  });
  onBeforeUnmount(() => {
    if (typeof window !== "undefined") window.removeEventListener("storage", sync);
  });
  return readonly(entries);
}
