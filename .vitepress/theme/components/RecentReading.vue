<script setup lang="ts">
import { computed } from "vue";
import { withBase } from "vitepress";
import { data } from "../knowledge.data";
import { knowledgeConfig } from "../knowledge.config";
import { clearReadingHistory, normalizeArticlePath, useReadingHistory } from "../reading-history";
import "../styles/reading-extras.css";

const history = useReadingHistory();
const recentArticles = computed(() => {
  if (knowledgeConfig.modules.recentReading === false) return [];
  return history.value.flatMap((entry) => {
    const article = data.articles.find((item) => normalizeArticlePath(item.url) === normalizeArticlePath(entry.url));
    return article ? [{ ...entry, title: article.title, categoryLabel: article.categoryLabel, url: article.url }] : [];
  }).slice(0, 3);
});

function progressLabel(percent: number) {
  return percent >= 98 ? "已读完" : percent > 0 ? `上次读到 ${percent}%` : "刚刚打开";
}
</script>

<template>
  <section v-if="knowledgeConfig.modules.recentReading !== false" class="kb-recent-reading" aria-labelledby="kb-recent-reading-title">
    <div class="kb-reading-next-heading"><h2 id="kb-recent-reading-title">{{ knowledgeConfig.home.recent.title }}</h2><button v-if="recentArticles.length" type="button" class="kb-recent-clear" @click="clearReadingHistory">{{ knowledgeConfig.home.recent.clearLabel }}</button><span v-else>{{ knowledgeConfig.home.recent.eyebrow }}</span></div>
    <div v-if="recentArticles.length" class="kb-recent-grid">
      <a v-for="article in recentArticles" :key="article.url" :href="withBase(article.url)" class="kb-recent-card">
        <div><span>{{ article.categoryLabel }}</span><span>{{ progressLabel(article.percent) }}</span></div>
        <h3>{{ article.title }}</h3>
        <div class="kb-recent-meter" aria-hidden="true"><span :style="{ width: `${article.percent}%` }" /></div>
      </a>
    </div>
    <p v-else class="kb-recent-empty">{{ knowledgeConfig.home.recent.emptyText }}</p>
  </section>
</template>
