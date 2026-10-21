<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { useData, withBase } from "vitepress";
import { data } from "../knowledge.data";

type ReadingStyle = "card" | "plain";
type ReadingWidth = "normal" | "wide";

const { page } = useData();
const readingStyle = ref<ReadingStyle>("card");
const readingWidth = ref<ReadingWidth>("normal");
const styleStorageKey = "knowledge-reading-style";
const widthStorageKey = "knowledge-reading-width";

const categories: Record<string, string> = {
  frontend: "前端",
  backend: "后端",
  AI: "AI",
  demo: "项目",
  web: "工具",
  other: "随记",
  story: "随记",
};

function normalizedPath(value: string) {
  let path = value.split(/[?#]/, 1)[0].replace(/\\/g, "/");
  try {
    path = decodeURIComponent(path);
  } catch {
    // A literal percent sign in a filename should not break navigation.
  }
  return `/${path.replace(/^\/+/, "")}`
    .replace(/\.(?:md|html)$/i, "")
    .replace(/\/index$/, "/");
}

const currentArticle = computed(() => {
  const currentPath = normalizedPath(page.value.relativePath);
  return data.articles.find((article) => normalizedPath(article.url) === currentPath);
});

const categoryId = computed(() => {
  if (currentArticle.value) return currentArticle.value.category;
  const path = page.value.relativePath.replace(/\\/g, "/");
  const section = path.startsWith("src/") ? path.split("/")[1] : "story";
  return Object.hasOwn(categories, section) ? section : "story";
});
const categoryLabel = computed(() => categories[categoryId.value] || "随记");
const articleTitle = computed(() => currentArticle.value?.title || page.value.title || "学习笔记");
const wordCountLabel = computed(() =>
  String(currentArticle.value?.wordCount || 0).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
);

function applySettings() {
  document.documentElement.dataset.readingStyle = readingStyle.value;
  document.documentElement.dataset.readingWidth = readingWidth.value;
}

function selectStyle(value: ReadingStyle) {
  readingStyle.value = value;
  applySettings();
  try {
    localStorage.setItem(styleStorageKey, value);
  } catch {
    // Reading controls remain usable when storage is unavailable.
  }
}

function selectWidth(value: ReadingWidth) {
  readingWidth.value = value;
  applySettings();
  try {
    localStorage.setItem(widthStorageKey, value);
  } catch {
    // Reading controls remain usable when storage is unavailable.
  }
}

function syncStoredSettings(event: StorageEvent) {
  if (event.key === styleStorageKey || event.key === null) {
    readingStyle.value = event.newValue === "plain" ? "plain" : "card";
  }
  if (event.key === widthStorageKey || event.key === null) {
    readingWidth.value = event.newValue === "wide" ? "wide" : "normal";
  }
  applySettings();
}

onMounted(() => {
  // The head script may already have restored these attributes before paint.
  const root = document.documentElement;
  readingStyle.value = root.dataset.readingStyle === "plain" ? "plain" : "card";
  readingWidth.value = root.dataset.readingWidth === "wide" ? "wide" : "normal";
  try {
    const storedStyle = localStorage.getItem(styleStorageKey);
    const storedWidth = localStorage.getItem(widthStorageKey);
    if (storedStyle === "card" || storedStyle === "plain") readingStyle.value = storedStyle;
    if (storedWidth === "normal" || storedWidth === "wide") readingWidth.value = storedWidth;
  } catch {
    // Keep the in-memory defaults if the browser blocks local storage.
  }
  applySettings();
  window.addEventListener("storage", syncStoredSettings);
});

onBeforeUnmount(() => {
  window.removeEventListener("storage", syncStoredSettings);
});
</script>

<template>
  <div class="kb-reading-tools">
    <nav class="kb-breadcrumb" aria-label="面包屑">
      <ol>
        <li><a :href="withBase('/')">知识库</a></li>
        <li v-if="currentArticle">
          <span class="kb-breadcrumb-divider" aria-hidden="true">/</span>
          <a :href="withBase(`/#topic-${categoryId}`)">{{ categoryLabel }}</a>
        </li>
        <li class="kb-breadcrumb-current">
          <span class="kb-breadcrumb-divider" aria-hidden="true">/</span>
          <span :title="articleTitle" aria-current="page">{{ articleTitle }}</span>
        </li>
      </ol>
    </nav>

    <div class="kb-reading-toolbar">
      <div class="kb-reading-meta">
        <template v-if="currentArticle">
          <span>{{ wordCountLabel }} 字</span>
          <span class="kb-reading-meta-dot" aria-hidden="true">·</span>
          <span>约 {{ currentArticle.readingMinutes }} 分钟</span>
        </template>
        <span v-else>学习笔记</span>
      </div>

      <div class="kb-reading-options" role="group" aria-label="阅读偏好">
        <div class="kb-reading-segment" role="group" aria-label="文章外观">
          <button type="button" :aria-pressed="readingStyle === 'card'" @click="selectStyle('card')">卡片</button>
          <button type="button" :aria-pressed="readingStyle === 'plain'" @click="selectStyle('plain')">简约</button>
        </div>
        <div class="kb-reading-segment kb-reading-width" role="group" aria-label="文章宽度">
          <button type="button" :aria-pressed="readingWidth === 'normal'" @click="selectWidth('normal')">标准</button>
          <button type="button" title="展开正文，收起右侧目录" :aria-pressed="readingWidth === 'wide'" @click="selectWidth('wide')">舒展</button>
        </div>
      </div>
    </div>
  </div>
</template>
