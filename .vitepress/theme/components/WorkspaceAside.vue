<script setup lang="ts">
import { computed } from "vue";
import { withBase } from "vitepress";
import { data } from "../knowledge.data";
import { knowledgeConfig } from "../knowledge.config";
import { normalizeArticlePath, useReadingHistory } from "../reading-history";
import { useWorkspace } from "../workspace";

const props = withDefaults(defineProps<{ articleMode?: boolean }>(), { articleMode: false });
const { currentArticle, currentTopic, topicHref } = useWorkspace();
const history = useReadingHistory();
const recent = computed(() => history.value.flatMap(entry => {
  const article = data.articles.find(item => normalizeArticlePath(item.url) === normalizeArticlePath(entry.url));
  return article ? [{ ...article, percent: entry.percent }] : [];
}).slice(0, 3));
const starters = computed(() => knowledgeConfig.starters.flatMap(item => {
  const article = data.articles.find(entry => normalizeArticlePath(entry.url) === normalizeArticlePath(item.url));
  return article ? [{ ...article, label: item.label }] : [];
}).slice(0, 4));
const siblings = computed(() => {
  const current = currentArticle.value;
  return current && knowledgeConfig.modules.relatedArticles ? data.articles.filter(article => article.category === current.category && article.url !== current.url).slice(0, 4) : [];
});
</script>

<template>
  <div class="ws-context-stack">
    <section v-if="!props.articleMode && knowledgeConfig.modules.recentReading" class="ws-context-card">
      <div class="ws-context-label"><span class="ws-status-dot" />继续阅读</div>
      <div v-if="recent.length" class="ws-context-list"><a v-for="article in recent" :key="article.url" :href="withBase(article.url)" class="ws-context-link"><strong>{{ article.title }}</strong><small>{{ article.percent >= 98 ? '已读完' : article.percent > 0 ? `上次读到 ${article.percent}%` : '刚刚打开' }}</small><span class="ws-context-meter" aria-hidden="true"><span :style="{ width: article.percent + '%' }" /></span></a></div>
      <p v-else class="ws-context-description">打开一篇笔记，下次从这里继续。</p>
    </section>
    <section v-if="props.articleMode && siblings.length" class="ws-context-card">
      <div class="ws-context-label">同专题笔记</div>
      <div class="ws-context-list"><a v-for="article in siblings" :key="article.url" :href="withBase(article.url)" class="ws-context-link"><strong>{{ article.title }}</strong><small>约 {{ article.readingMinutes }} 分钟</small></a></div>
      <a v-if="currentTopic" class="ws-context-more" :href="topicHref(currentTopic.id)">浏览 {{ currentTopic.label }} →</a>
    </section>
    <section v-if="!props.articleMode && knowledgeConfig.modules.starters && starters.length" class="ws-context-card">
      <div class="ws-context-label">阅读起点</div>
      <div class="ws-context-list"><a v-for="(article, index) in starters" :key="article.url" :href="withBase(article.url)" class="ws-context-link ws-start-link"><span class="ws-start-index">{{ String(index + 1).padStart(2, '0') }}</span><span><strong>{{ article.label }}</strong><small>{{ article.categoryLabel }}</small></span></a></div>
    </section>
    <section v-if="!props.articleMode && (knowledgeConfig.modules.asideNote || knowledgeConfig.modules.about)" class="ws-context-card ws-context-note"><template v-if="knowledgeConfig.modules.asideNote"><span class="ws-context-label">让知识彼此连接</span><p>从目录找到一个问题，<br>从笔记带走一个答案。</p></template><a v-if="knowledgeConfig.modules.about" :href="withBase(knowledgeConfig.site.aboutUrl)">关于这个知识库 →</a></section>
  </div>
</template>
