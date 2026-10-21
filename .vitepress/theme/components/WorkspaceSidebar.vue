<script setup lang="ts">
import { withBase } from "vitepress";
import { knowledgeConfig } from "../knowledge.config";
import { useWorkspace } from "../workspace";
import KnowledgeIcon from "./KnowledgeIcon.vue";

const emit = defineEmits<{ navigate: [] }>();
const {
  topics, activeTopic, activeGroup, currentArticle, totalArticles, formattedWords,
  topicHref, selectTopic, selectGroup, articlesForGroup,
} = useWorkspace();

function select(event: MouseEvent, topic: string, group?: string) {
  if (event.button !== 0 || event.metaKey || event.ctrlKey || event.altKey || event.shiftKey) return;
  event.preventDefault();
  if (group) selectGroup(group);
  else selectTopic(topic);
  emit("navigate");
}
</script>

<template>
  <div class="ws-sidebar-content">
    <nav class="ws-tree" aria-label="知识库专题与目录">
      <a class="ws-all-link vp-raw" :class="{ 'is-active': activeTopic === 'all' }" :href="topicHref()" :aria-current="activeTopic === 'all' ? 'page' : undefined" @click="select($event, 'all')">
        <KnowledgeIcon name="layers" /><span>全部笔记</span><span class="ws-topic-count">{{ totalArticles }}</span>
      </a>
      <p class="ws-tree-label">知识专题</p>
      <details v-for="topic in topics" :key="topic.id" class="ws-topic" :class="{ 'is-current': activeTopic === topic.id }" :open="activeTopic === topic.id">
        <summary class="ws-topic-summary"><span class="ws-topic-name"><KnowledgeIcon :name="topic.icon" />{{ topic.label }}</span><span class="ws-topic-count">{{ topic.count }}</span></summary>
        <a class="ws-topic-overview vp-raw" :class="{ 'is-active': activeTopic === topic.id && activeGroup === 'all' }" :href="topicHref(topic.id)" @click="select($event, topic.id)">浏览全部{{ topic.label }}笔记 <KnowledgeIcon name="arrow" /></a>
        <div v-for="group in topic.groups" :key="group.id" class="ws-group">
          <a class="ws-group-link vp-raw" :class="{ 'is-active': activeGroup === group.id }" :href="topicHref(topic.id, group.id)" :aria-current="!currentArticle && activeGroup === group.id ? 'page' : undefined" @click="select($event, topic.id, group.id)"><span>{{ group.label }}</span><small>{{ group.count }}</small></a>
          <ul v-if="currentArticle && activeGroup === group.id" class="ws-note-tree">
            <li v-for="article in articlesForGroup(group.id)" :key="article.url"><a class="ws-note-link" :class="{ 'is-active': currentArticle.url === article.url }" :href="withBase(article.url)" :aria-current="currentArticle.url === article.url ? 'page' : undefined" @click="emit('navigate')">{{ article.title }}</a></li>
          </ul>
        </div>
      </details>
    </nav>
    <footer class="ws-sidebar-footer">
      <p class="ws-library-meta">{{ totalArticles }} 篇笔记 · {{ topics.length }} 个专题<br>共 {{ formattedWords }} 字，持续积累</p>
      <a class="ws-about-link" :href="withBase(knowledgeConfig.site.aboutUrl)" @click="emit('navigate')">关于本站 <KnowledgeIcon name="arrow" /></a>
    </footer>
  </div>
</template>
