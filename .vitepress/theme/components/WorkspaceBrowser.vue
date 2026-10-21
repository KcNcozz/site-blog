<script setup lang="ts">
import { withBase } from "vitepress";
import { useWorkspace } from "../workspace";
import KnowledgeIcon from "./KnowledgeIcon.vue";

const {
  topics, totalArticles, currentTopic, groups, selectedGroup, query, visibleCount,
  filteredArticles, visibleArticles, setQuery, selectGroup, resetFilters, loadMore,
} = useWorkspace();
</script>

<template>
  <section id="notes" class="ws-browser" aria-labelledby="ws-browser-title">
    <header class="ws-browser-heading">
      <h1 id="ws-browser-title" tabindex="-1">知识工作台</h1>
      <p class="ws-browser-description">在 {{ topics.length }} 个专题、{{ totalArticles }} 篇笔记中查找知识，继续学习。</p>
    </header>
    <label class="ws-browser-search"><KnowledgeIcon name="search" /><input :value="query" type="search" maxlength="200" placeholder="搜索笔记标题、摘要或目录…" aria-label="筛选知识库笔记" @input="setQuery(($event.target as HTMLInputElement).value)"><button v-if="query" class="ws-search-clear" type="button" aria-label="清除搜索关键词" @click="setQuery('')">×</button></label>
    <div class="ws-browser-context"><h2>{{ currentTopic?.label ?? '全部笔记' }}</h2><p>{{ currentTopic?.description ?? '沿着左侧专题浏览，也可以直接搜索你需要的内容。' }}</p></div>
    <div v-if="groups.length" class="ws-group-chips" role="group" :aria-label="`${currentTopic?.label}子目录`">
      <button type="button" :class="{ 'is-active': selectedGroup === 'all' }" :aria-pressed="selectedGroup === 'all'" @click="selectGroup('all')">全部目录</button>
      <button v-for="group in groups" :key="group.id" type="button" :class="{ 'is-active': selectedGroup === group.id }" :aria-pressed="selectedGroup === group.id" @click="selectGroup(group.id)">{{ group.label }} <span>{{ group.count }}</span></button>
    </div>
    <div class="ws-browser-toolbar"><span class="ws-results-status" role="status" aria-live="polite">{{ filteredArticles.length }} 篇笔记<span v-if="query"> · 搜索“{{ query }}”</span></span><span>按专题与标题排列</span></div>
    <ul v-if="visibleArticles.length" class="ws-article-list">
      <li v-for="article in visibleArticles" :key="article.url">
        <a class="ws-article-row" :href="withBase(article.url)">
          <span class="ws-article-icon"><KnowledgeIcon name="note" /></span>
          <div class="ws-article-content"><h3>{{ article.title }}</h3><p v-if="article.summary" class="ws-article-summary">{{ article.summary }}</p><div class="ws-article-meta"><span>{{ article.categoryLabel }}</span><span>{{ article.groupLabel }}</span><span>约 {{ article.readingMinutes }} 分钟</span></div></div>
          <KnowledgeIcon name="arrow" />
        </a>
      </li>
    </ul>
    <div v-else class="ws-empty"><KnowledgeIcon name="search" /><p>没有找到匹配的笔记，试试其他关键词或目录。</p><button type="button" @click="resetFilters">查看全部笔记</button></div>
    <div v-if="visibleCount < filteredArticles.length" class="ws-browser-pagination"><button class="ws-load-more" type="button" @click="loadMore">继续浏览 · 还有 {{ filteredArticles.length - visibleCount }} 篇</button></div>
  </section>
</template>
