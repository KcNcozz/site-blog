<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { onContentUpdated, useData, useRoute, withBase } from "vitepress";
import VPNavBarSearch from "vitepress/dist/client/theme-default/components/VPNavBarSearch.vue";
import VPDocAsideOutline from "vitepress/dist/client/theme-default/components/VPDocAsideOutline.vue";
import VPDocFooter from "vitepress/dist/client/theme-default/components/VPDocFooter.vue";
import { knowledgeConfig } from "./knowledge.config";
import { provideWorkspace } from "./workspace";
import ThemeSettings from "./components/ThemeSettings.vue";
import WorkspaceSidebar from "./components/WorkspaceSidebar.vue";
import WorkspaceBrowser from "./components/WorkspaceBrowser.vue";
import WorkspaceAside from "./components/WorkspaceAside.vue";
import DocReadingTools from "./components/DocReadingTools.vue";
import ReadingProgress from "./components/ReadingProgress.vue";
import RelatedArticles from "./components/RelatedArticles.vue";

const { page, frontmatter, isDark } = useData();
const route = useRoute();
const { isHome, currentArticle, currentTopic } = provideWorkspace();
const drawerOpen = ref(false);
const focusMode = ref(false);
const menuButton = ref<HTMLButtonElement>();
const sidebar = ref<HTMLElement>();
const isMobile = ref(false);
const mobileHeaders = ref<Array<{ id: string; title: string }>>([]);
const pageName = computed(() => route.path.replace(/[./]+/g, "_").replace(/_html$/, ""));
let media: MediaQueryList | undefined;
let bodyOverflow: string | undefined;

function unlockBody() {
  if (bodyOverflow === undefined) return;
  document.body.style.overflow = bodyOverflow;
  bodyOverflow = undefined;
}
function closeDrawer(restoreFocus = true) {
  drawerOpen.value = false;
  if (restoreFocus) void nextTick(() => menuButton.value?.focus({ preventScroll: true }));
}
function onSidebarNavigate() {
  const wasOpen = drawerOpen.value;
  closeDrawer(false);
  if (wasOpen) void nextTick(() => document.getElementById("VPContent")?.focus({ preventScroll: true }));
}
function focusables() {
  return Array.from(sidebar.value?.querySelectorAll<HTMLElement>("a[href],button:not([disabled]),summary,input,[tabindex='0']") ?? [])
    .filter(element => element.getClientRects().length > 0 && !element.closest("[inert]"));
}
function onKeydown(event: KeyboardEvent) {
  if (!drawerOpen.value) return;
  if (event.key === "Escape") { event.preventDefault(); closeDrawer(); }
  if (event.key !== "Tab") return;
  const items = focusables();
  const first = items[0], last = items[items.length - 1];
  if (!first) return;
  if (event.shiftKey && (document.activeElement === first || !sidebar.value?.contains(document.activeElement))) {
    event.preventDefault(); last.focus();
  } else if (!event.shiftKey && (document.activeElement === last || !sidebar.value?.contains(document.activeElement))) {
    event.preventDefault(); first.focus();
  }
}
function updateMedia() {
  isMobile.value = !!media?.matches;
  if (!isMobile.value) closeDrawer(false);
}
function collectHeaders() {
  mobileHeaders.value = Array.from(document.querySelectorAll<HTMLElement>(".ws-document .vp-doc h2[id],.ws-document .vp-doc h3[id]"))
    .map(element => ({ id: element.id, title: element.textContent?.trim() ?? "" }));
}
watch(drawerOpen, async open => {
  if (open) {
    bodyOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    await nextTick(); focusables()[0]?.focus({ preventScroll: true });
  } else unlockBody();
});
watch(() => route.path, async () => {
  closeDrawer(false); focusMode.value = false;
  await nextTick();
  document.getElementById("VPContent")?.focus({ preventScroll: true });
});
onContentUpdated(() => { collectHeaders(); });
onMounted(() => {
  media = matchMedia("(max-width: 959px)");
  updateMedia(); media.addEventListener("change", updateMedia);
  document.addEventListener("keydown", onKeydown);
  collectHeaders();
});
onBeforeUnmount(() => {
  unlockBody(); media?.removeEventListener("change", updateMedia);
  document.removeEventListener("keydown", onKeydown);
});
</script>

<template>
  <Content v-if="frontmatter.layout === false" />
  <div v-else class="workspace-layout" :class="{ 'is-focused': focusMode }">
    <a class="ws-skip-link" href="#VPContent">跳到主要内容</a>
    <header class="ws-header" :inert="drawerOpen">
      <button ref="menuButton" type="button" class="ws-menu-button" aria-label="打开知识库导航" :aria-expanded="drawerOpen" aria-controls="workspace-navigation" @click="drawerOpen = true">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6h16M4 12h16M4 18h16" /></svg>
      </button>
      <a class="ws-brand" :href="withBase('/')" :aria-label="knowledgeConfig.site.name + '知识库首页'">
        <span class="ws-brand-mark"><svg viewBox="0 0 28 28" aria-hidden="true"><path d="m6 10-1-6 7 4h4l7-4-1 6c2 2 3 4 3 7 0 5-4 8-11 8S3 22 3 17c0-3 1-5 3-7Z" /><path d="M9 15h.01M19 15h.01m-7 4 2 1 2-1M5 18H1m22 0h4" /></svg></span>
        <span><strong>{{ knowledgeConfig.site.name }}</strong><small>KNOWLEDGE WORKSPACE</small></span>
      </a>
      <div class="ws-header-context"><span>工作台</span><span aria-hidden="true">/</span><strong>{{ isHome ? currentTopic?.label || '全部笔记' : currentArticle?.categoryLabel || page.title }}</strong></div>
      <div class="ws-header-actions">
        <VPNavBarSearch />
        <button type="button" class="ws-appearance" role="switch" :aria-checked="isDark" :aria-label="isDark ? '切换到浅色模式' : '切换到深色模式'" @click="isDark = !isDark">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path v-if="isDark" d="M12 3v2m0 14v2M3 12h2m14 0h2M5.6 5.6 7 7m10 10 1.4 1.4M5.6 18.4 7 17M17 7l1.4-1.4M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z" /><path v-else d="M20 15.5A8.5 8.5 0 0 1 8.5 4a8.5 8.5 0 1 0 11.5 11.5Z" /></svg>
        </button>
        <ThemeSettings />
      </div>
    </header>

    <button v-if="drawerOpen" type="button" class="ws-backdrop" tabindex="-1" aria-label="关闭知识库导航" @click="closeDrawer()" />
    <aside id="workspace-navigation" ref="sidebar" class="ws-sidebar" :class="{ 'is-open': drawerOpen }" :role="drawerOpen ? 'dialog' : undefined" :aria-modal="drawerOpen || undefined" aria-label="知识库导航" :inert="(isMobile || focusMode) && !drawerOpen">
      <button type="button" class="ws-sidebar-close" aria-label="关闭知识库导航" @click="closeDrawer()">关闭目录 <span aria-hidden="true">×</span></button>
      <WorkspaceSidebar @navigate="onSidebarNavigate" />
    </aside>

    <main id="VPContent" class="ws-main" tabindex="-1" :inert="drawerOpen">
      <section v-if="page.isNotFound" class="ws-not-found"><span>404</span><h1>没有找到这篇笔记</h1><p>从知识库目录里重新找找吧。</p><a :href="withBase('/')">返回知识工作台 →</a></section>
      <div v-else-if="isHome" class="ws-home-grid">
        <WorkspaceBrowser />
        <aside class="ws-home-aside" aria-label="阅读与推荐"><WorkspaceAside /></aside>
      </div>
      <template v-else>
        <div class="ws-reader-toolbar">
          <a :href="withBase(currentArticle ? `/?topic=${currentArticle.category}` : '/')">← {{ currentArticle?.categoryLabel || '全部笔记' }}</a>
          <button type="button" class="ws-focus-button" :aria-pressed="focusMode" @click="focusMode = !focusMode">{{ focusMode ? '退出专注' : '专注阅读' }}</button>
        </div>
        <div class="ws-article-grid">
          <div class="VPDoc ws-document">
            <div class="container"><div class="content"><div class="content-container">
              <DocReadingTools /><ReadingProgress />
              <details v-if="mobileHeaders.length" class="ws-mobile-outline"><summary>本页目录 <span>{{ mobileHeaders.length }} 个章节</span></summary><ul><li v-for="heading in mobileHeaders" :key="heading.id"><a :href="'#' + encodeURIComponent(heading.id)">{{ heading.title }}</a></li></ul></details>
              <Content class="vp-doc" :class="pageName" />
              <RelatedArticles /><VPDocFooter />
            </div></div></div>
          </div>
          <aside class="ws-article-aside" aria-label="文章目录与同专题笔记"><VPDocAsideOutline /><WorkspaceAside :article-mode="true" /></aside>
        </div>
      </template>
      <footer class="ws-footer">{{ knowledgeConfig.site.title }}<span>记录 · 连接 · 查阅</span></footer>
    </main>
  </div>
</template>
