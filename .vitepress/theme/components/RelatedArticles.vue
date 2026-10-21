<script setup lang="ts">
import { computed } from "vue";
import { useData, withBase } from "vitepress";
import { data, type KnowledgeArticle } from "../knowledge.data";
import { knowledgeConfig } from "../knowledge.config";
import { normalizeArticlePath } from "../reading-history";
import "../styles/reading-extras.css";

type GroupedArticle = KnowledgeArticle & { groupId?: string; groupLabel?: string };
const { page } = useData();
const currentArticle = computed(() => data.articles.find((article) =>
  normalizeArticlePath(article.url) === normalizeArticlePath(page.value.relativePath),
) as GroupedArticle | undefined);

function groupId(article: GroupedArticle) {
  if (article.groupId) return article.groupId;
  const directory = normalizeArticlePath(article.url).split("/").slice(3, -1).join("/");
  return `${article.category}/${directory || "_root"}`;
}

const recommendations = computed(() => {
  const current = currentArticle.value;
  if (!current || knowledgeConfig.modules.relatedArticles === false) return [];
  return data.articles.filter((article) => article.category === current.category
    && normalizeArticlePath(article.url) !== normalizeArticlePath(current.url))
    .map((article, index) => ({ article, index, score: groupId(article) === groupId(current) ? 1 : 0 }))
    .sort((a, b) => b.score - a.score || a.index - b.index).slice(0, 3).map((item) => item.article);
});

const series = computed(() => {
  const current = currentArticle.value;
  if (!current || knowledgeConfig.modules.series === false || groupId(current).endsWith("/_root")) return [];
  const siblings = data.articles.filter((article) => groupId(article) === groupId(current));
  return siblings.length > 1 ? siblings : [];
});
const seriesLabel = computed(() => currentArticle.value?.groupLabel
  || normalizeArticlePath(currentArticle.value?.url || "").split("/").slice(-2, -1)[0]);
</script>

<template>
  <div v-if="currentArticle && (recommendations.length || series.length)" class="kb-reading-next">
    <section v-if="recommendations.length" aria-labelledby="kb-related-title" class="kb-related-section">
      <div class="kb-reading-next-heading"><h2 id="kb-related-title">继续探索</h2><span>连接更多知识</span></div>
      <div class="kb-related-grid">
        <a v-for="article in recommendations" :key="article.url" :href="withBase(article.url)" class="kb-related-card">
          <span class="kb-related-topic">{{ article.categoryLabel }}</span><h3>{{ article.title }}</h3>
          <p>{{ article.summary }}</p><span class="kb-related-foot">约 {{ article.readingMinutes }} 分钟阅读 <span aria-hidden="true">↗</span></span>
        </a>
      </div>
    </section>
    <details v-if="series.length" class="kb-series">
      <summary><span>同系列 · {{ seriesLabel }}</span><span>{{ series.length }} 篇笔记</span></summary>
      <ol>
        <li v-for="article in series" :key="article.url"><a :href="withBase(article.url)" :aria-current="normalizeArticlePath(article.url) === normalizeArticlePath(currentArticle.url) ? 'page' : undefined">{{ article.title }}<span v-if="normalizeArticlePath(article.url) === normalizeArticlePath(currentArticle.url)">当前阅读</span></a></li>
      </ol>
    </details>
  </div>
</template>
