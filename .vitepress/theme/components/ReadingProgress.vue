<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useData } from "vitepress";
import { data, type KnowledgeArticle } from "../knowledge.data";
import { knowledgeConfig } from "../knowledge.config";
import {
  getReadingHistory, loadReadingHistory, normalizeArticlePath, saveReadingProgress,
  touchReadingHistory, type ReadingHistoryEntry, type ReadingPosition,
} from "../reading-history";
import "../styles/reading-extras.css";

const { page } = useData();
const percent = ref(0);
const resumeEntry = ref<ReadingHistoryEntry>();
const showProgress = computed(() => knowledgeConfig.modules.readingProgress !== false);
const trackingEnabled = computed(() => showProgress.value || knowledgeConfig.modules.recentReading !== false);
const currentArticle = computed(() => data.articles.find((article) =>
  normalizeArticlePath(article.url) === normalizeArticlePath(page.value.relativePath),
));
const canResume = computed(() => !!resumeEntry.value && resumeEntry.value.scrollY > 160
  && resumeEntry.value.percent < 98);

let mounted = false;
let generation = 0;
let activeArticle: KnowledgeArticle | undefined;
let content: HTMLElement | undefined;
let pendingPosition: ReadingPosition | undefined;
let frame = 0;
let saveTimer: ReturnType<typeof setTimeout> | undefined;
let observer: ResizeObserver | undefined;
let headings: Array<{ id: string; offset: number }> = [];
let lastReaderAction = 0;
let scrollbarDragging = false;

function headerOffset() {
  const padding = Number.parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
  let covered = 0;
  document.querySelectorAll<HTMLElement>(".VPNav, .VPLocalNav, .ws-header").forEach((element) => {
    const style = getComputedStyle(element);
    const rect = element.getBoundingClientRect();
    if (style.display === "none" || style.visibility === "hidden" || rect.bottom <= 0 || rect.top >= window.innerHeight) return;
    if (style.position === "fixed" && rect.top <= 1) covered = Math.max(covered, rect.bottom);
    if (style.position === "sticky" && style.top !== "auto") {
      // At the top of a page a sticky bar may not have reached its sticking point.
      // Use its pinned edge so the target is still correct after a large jump.
      covered = Math.max(covered, (Number.parseFloat(style.top) || 0) + rect.height);
    }
  });
  return Math.max(covered + 12, padding, 16);
}

function refreshHeadings() {
  if (!content?.isConnected) return;
  const top = content.getBoundingClientRect().top;
  headings = Array.from(content.querySelectorAll<HTMLElement>("h1[id], h2[id], h3[id], h4[id]"))
    .map((heading) => ({ id: heading.id, offset: heading.getBoundingClientRect().top - top }));
  measure(false);
}

function measure(remember: boolean) {
  if (!activeArticle || !content?.isConnected
    || normalizeArticlePath(activeArticle.url) !== normalizeArticlePath(page.value.relativePath)) return;
  const top = content.getBoundingClientRect().top + window.scrollY;
  const offset = headerOffset();
  const range = Math.max(1, content.scrollHeight - window.innerHeight + offset + 24);
  const distance = window.scrollY + offset - top;
  percent.value = Math.round(Math.min(100, Math.max(0, distance / range * 100)));
  if (!remember) return;
  const heading = [...headings].reverse().find((item) => item.offset <= distance);
  pendingPosition = {
    percent: percent.value,
    scrollY: window.scrollY,
    ...(heading ? { anchor: heading.id, anchorOffset: distance - heading.offset } : {}),
  };
  if (!saveTimer) saveTimer = setTimeout(flushPosition, 750);
}

function onScroll() {
  // Route changes can reset scrolling without reader input. Do not let those
  // events replace an earlier saved position with the new page's initial zero.
  if (frame) return;
  frame = requestAnimationFrame(() => {
    frame = 0;
    const remember = scrollbarDragging || Date.now() - lastReaderAction < 2500;
    measure(remember);
  });
}

function eventElement(event: Event): Element | undefined {
  return event.composedPath?.().find((target): target is Element => target instanceof Element)
    ?? (event.target instanceof Element ? event.target : undefined);
}

function isArticleAnchor(target: Element): boolean {
  const href = target.closest("a[href]")?.getAttribute("href");
  if (!href || !content) return false;
  try {
    const url = new URL(href, window.location.href);
    if (url.origin !== window.location.origin || url.pathname !== window.location.pathname || !url.hash) return false;
    const destination = document.getElementById(decodeURIComponent(url.hash.slice(1)));
    return !!destination && content.contains(destination);
  } catch { return false; }
}

function isScrollbarPointer(event: Event, target: Element): boolean {
  if (event.type !== "pointerdown" || ![document.documentElement, document.body].includes(target as HTMLElement)) return false;
  const root = document.documentElement;
  const pointer = event as PointerEvent;
  const gutter = Math.max(0, window.innerWidth - root.clientWidth);
  if (pointer.pointerType === "touch" || pointer.button !== 0 || root.scrollHeight <= root.clientHeight) return false;
  if (gutter > 0) return pointer.clientX >= root.clientWidth;
  // Overlay scrollbars have no layout gutter and report the root as their target.
  return pointer.clientX >= window.innerWidth - 16;
}

function hasNestedScroll(target: Element): boolean {
  for (let element: Element | null = target; element && element !== document.body && element !== document.documentElement; element = element.parentElement) {
    if (element.scrollHeight > element.clientHeight + 1 && /auto|scroll/.test(getComputedStyle(element).overflowY)) return true;
  }
  return false;
}

function onReaderAction(event: Event) {
  const target = eventElement(event);
  let allowed = false;
  let scrollbar = false;
  if (target && content) {
    const excluded = target.closest(".kb-theme-settings, .kb-settings-panel, .kb-reading-tools, .kb-reading-progress, .kb-reading-next, .VPDocFooter, .VPFooter, .VPLocalSearchBox, [role='dialog'], [role='menu'], [role='listbox']");
    const anchor = !excluded && (event.type === "pointerdown" || event.type === "keydown") && isArticleAnchor(target);
    const navigation = target.closest(".VPNav, .VPLocalNav, .VPSidebar, .VPDocAside, .VPDoc .aside, .ws-sidebar, .ws-header, .ws-home-aside, .ws-article-aside, .ws-reader-toolbar");
    const control = target.closest("button, input, select, textarea, [contenteditable]:not([contenteditable='false']), [role='textbox'], [role='slider'], [role='combobox']");
    scrollbar = !excluded && isScrollbarPointer(event, target);
    if (anchor) allowed = true; // Desktop and mobile outlines are valid reading jumps.
    else if (!excluded && !navigation && !control) {
      if (event.type === "pointerdown") allowed = content.contains(target) || scrollbar;
      else if (event.type === "keydown") allowed = content.contains(target) || target === document.body || target === document.documentElement;
      else allowed = (content.contains(target) || !!target.closest(".VPDoc") || target === document.body || target === document.documentElement) && !hasNestedScroll(target);
    }
  }
  // A settings click or panel scroll must also disarm an earlier reading gesture.
  lastReaderAction = allowed ? Date.now() : 0;
  if (event.type === "pointerdown") scrollbarDragging = scrollbar;
}

function onReaderKey(event: KeyboardEvent) {
  if (event.altKey || event.ctrlKey || event.metaKey || event.defaultPrevented) return;
  if (["ArrowDown", "ArrowUp", "PageDown", "PageUp", "Home", "End", " ", "Enter"].includes(event.key)) onReaderAction(event);
}

function onPointerUp() { scrollbarDragging = false; }

function flushPosition() {
  if (saveTimer) clearTimeout(saveTimer);
  saveTimer = undefined;
  // The snapshot is captured while the old article is still active. Never read the
  // next route's scroll position when flushing an outgoing page.
  if (activeArticle && pendingPosition) saveReadingProgress(activeArticle, pendingPosition);
  pendingPosition = undefined;
}

function onPageHide() {
  // Flush the last approved reading snapshot, not a layout/viewport adjustment.
  flushPosition();
}
function onVisibility() { if (document.visibilityState === "hidden") onPageHide(); }

function stopTracking() {
  flushPosition();
  if (frame) cancelAnimationFrame(frame);
  frame = 0;
  observer?.disconnect();
  observer = undefined;
  window.removeEventListener("scroll", onScroll);
  window.removeEventListener("wheel", onReaderAction);
  window.removeEventListener("touchstart", onReaderAction);
  window.removeEventListener("touchmove", onReaderAction);
  window.removeEventListener("pointerdown", onReaderAction);
  window.removeEventListener("pointerup", onPointerUp);
  window.removeEventListener("pointercancel", onPointerUp);
  document.removeEventListener("keydown", onReaderKey);
  window.removeEventListener("resize", refreshHeadings);
  window.removeEventListener("pagehide", onPageHide);
  document.removeEventListener("visibilitychange", onVisibility);
  activeArticle = undefined;
  content = undefined;
  headings = [];
  lastReaderAction = 0;
  scrollbarDragging = false;
}

async function startTracking() {
  const ticket = ++generation;
  stopTracking();
  percent.value = 0;
  resumeEntry.value = undefined;
  if (!trackingEnabled.value || !currentArticle.value) return;
  const article = currentArticle.value;
  loadReadingHistory();
  resumeEntry.value = getReadingHistory(article.url);
  // Keep a previous position until the reader scrolls or explicitly resumes.
  touchReadingHistory(article);
  await nextTick();
  await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
  if (!mounted || ticket !== generation
    || normalizeArticlePath(article.url) !== normalizeArticlePath(page.value.relativePath)) return;
  const articleContent = document.querySelector<HTMLElement>(".VPDoc .vp-doc");
  if (!articleContent) return;
  activeArticle = article;
  content = articleContent;
  refreshHeadings();
  if (typeof ResizeObserver !== "undefined") {
    observer = new ResizeObserver(refreshHeadings);
    observer.observe(articleContent);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("wheel", onReaderAction, { passive: true });
  window.addEventListener("touchstart", onReaderAction, { passive: true });
  window.addEventListener("touchmove", onReaderAction, { passive: true });
  window.addEventListener("pointerdown", onReaderAction, { passive: true });
  window.addEventListener("pointerup", onPointerUp, { passive: true });
  window.addEventListener("pointercancel", onPointerUp, { passive: true });
  document.addEventListener("keydown", onReaderKey);
  window.addEventListener("resize", refreshHeadings);
  window.addEventListener("pagehide", onPageHide);
  document.addEventListener("visibilitychange", onVisibility);
}

async function resumeReading() {
  const saved = resumeEntry.value;
  if (!saved || !content) return;
  resumeEntry.value = undefined;
  await nextTick();
  if (!content || normalizeArticlePath(saved.url) !== normalizeArticlePath(page.value.relativePath)) return;
  // Removing the prompt changes the article's vertical position. Measure the
  // target after that change so resuming does not overshoot the saved heading.
  const anchor = saved.anchor ? document.getElementById(saved.anchor) : null;
  let target = saved.scrollY;
  if (anchor && content.contains(anchor)) {
    target = anchor.getBoundingClientRect().top + window.scrollY + (saved.anchorOffset || 0) - headerOffset();
  }
  const max = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
  window.scrollTo({ top: Math.min(max, Math.max(0, target)), behavior: "instant" });
  const focusTarget = anchor && content.contains(anchor) ? anchor : content.querySelector<HTMLElement>("h1");
  if (focusTarget) {
    focusTarget.setAttribute("tabindex", "-1");
    focusTarget.focus({ preventScroll: true });
  }
  refreshHeadings();
  measure(true);
  flushPosition();
}

async function dismissResume() {
  const path = page.value.relativePath;
  resumeEntry.value = undefined;
  await nextTick();
  if (path !== page.value.relativePath) return;
  const heading = content?.querySelector<HTMLElement>("h1");
  if (heading) {
    heading.setAttribute("tabindex", "-1");
    heading.focus({ preventScroll: true });
  }
}

watch(() => page.value.relativePath, () => { if (mounted) void startTracking(); }, { flush: "sync" });
onMounted(() => { mounted = true; void startTracking(); });
onBeforeUnmount(() => { mounted = false; generation++; stopTracking(); });
</script>

<template>
  <div v-if="currentArticle && showProgress" class="kb-reading-progress">
    <div class="kb-reading-progress-track" aria-hidden="true"><span :style="{ transform: `scaleX(${percent / 100})` }" /></div>
    <div class="kb-progress-summary" role="progressbar" aria-label="文章阅读进度" :aria-valuenow="percent" aria-valuemin="0" aria-valuemax="100">
      <span>阅读进度</span><strong>{{ percent }}%</strong>
    </div>
    <div v-if="canResume" class="kb-resume-reading">
      <p>上次读到 <strong>{{ resumeEntry?.percent }}%</strong>，接着往下读吧。</p>
      <div><button type="button" class="kb-resume-button" @click="resumeReading">继续上次阅读 <span aria-hidden="true">→</span></button><button type="button" class="kb-resume-dismiss" @click="dismissResume">暂不恢复</button></div>
    </div>
  </div>
</template>
