<script setup lang="ts">
import { computed, nextTick, ref, watch } from "vue";
import { withBase } from "vitepress";
import { data } from "../knowledge.data";
import KnowledgeIcon from "./KnowledgeIcon.vue";

const selectedTopic = ref("all");
const query = ref("");
const visibleCount = ref(6);
const notesHeading = ref<HTMLElement | null>(null);
const topics = computed(() => data.topics);
const filteredArticles = computed(() => {
  const term = query.value.trim().toLocaleLowerCase();
  return data.articles.filter(article =>
    (selectedTopic.value === "all" || article.category === selectedTopic.value) &&
    (!term || [article.title, article.summary, article.categoryLabel].join(" ").toLocaleLowerCase().includes(term))
  );
});
const visibleArticles = computed(() => filteredArticles.value.slice(0, visibleCount.value));
const formattedWords = computed(() => data.totalWords >= 10000 ? (data.totalWords / 10000).toFixed(1) + "万" : String(data.totalWords));
const topicCodes: Record<string, string> = { frontend: "FRONTEND", backend: "BACKEND", AI: "AI & LLM", demo: "PROJECTS", web: "HANDBOOK", other: "LIFE & NOTES", story: "THOUGHTS" };
const starters = computed(() => [
  { needle: "/frontend/base/html.html", label: "从 HTML 开始" },
  { needle: "/backend/Go/go基础.html", label: "Go 语言基础" },
  { needle: "/AI/Langchain/RAG.html", label: "认识 RAG" },
  { needle: "/web/git.html", label: "Git 常用操作" },
].flatMap(item => {
  const article = data.articles.find(entry => decodeURI(entry.url).endsWith(item.needle));
  return article ? [{ ...article, label: item.label }] : [];
}));

watch([selectedTopic, query], () => { visibleCount.value = 6; });

async function selectTopic(id: string, scroll = false) {
  selectedTopic.value = id;
  if (scroll) {
    query.value = "";
    await nextTick();
    notesHeading.value?.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth", block: "start" });
    notesHeading.value?.focus({ preventScroll: true });
  }
}

function resetFilters() { selectedTopic.value = "all"; query.value = ""; }
</script>

<template>
  <div class="knowledge-home">
    <section class="kb-hero" aria-labelledby="kb-home-title">
      <div>
        <p class="kb-eyebrow">加菲猫的知识库 · LEARN, BUILD, KEEP</p>
        <h1 id="kb-home-title">学过的，<br>慢慢成为<span>自己的。</span></h1>
        <p class="kb-hero-description">记录前端、后端与 AI 的学习过程，<br>把零散的笔记，整理成可以反复查阅的知识。</p>
        <div class="kb-hero-actions">
          <a class="kb-primary-link" href="#knowledge">探索知识库 <KnowledgeIcon name="arrow" /></a>
          <a class="kb-text-link" :href="withBase('/简介.html')">关于本站 <KnowledgeIcon name="arrow" /></a>
        </div>
      </div>
      <div class="kb-hero-index" aria-label="主要知识板块">
        <div class="kb-index-heading"><span>知识地图</span><span>THE KNOWLEDGE INDEX</span></div>
        <button v-for="(topic, index) in topics.slice(0, 3)" :key="topic.id" type="button" class="kb-index-row" @click="selectTopic(topic.id, true)">
          <span class="kb-index-number">0{{ index + 1 }}</span><KnowledgeIcon :name="topic.id" />
          <strong>{{ topic.label }}</strong><small>{{ topic.count }} 篇笔记</small><KnowledgeIcon name="arrow" class="kb-arrow" />
        </button>
        <div class="kb-index-foot"><span>在记录中积累，在实践中连接。</span><KnowledgeIcon name="layers" /></div>
      </div>
    </section>

    <div class="kb-stats" aria-label="知识库统计">
      <div class="kb-stat"><strong>{{ data.totalArticles }}</strong><span>篇学习笔记</span></div>
      <div class="kb-stat"><strong>{{ topics.length.toString().padStart(2, '0') }}</strong><span>个知识板块</span></div>
      <div class="kb-stat"><strong>{{ formattedWords }}</strong><span>字笔记内容</span></div>
      <span class="kb-stats-note"><KnowledgeIcon name="leaf" />持续学习，逐步完善</span>
    </div>

    <section id="knowledge" class="kb-topics-section" aria-labelledby="kb-topics-title">
      <div class="kb-section-heading"><div><h2 id="kb-topics-title">按主题探索</h2><p>从基础概念到项目实践，找到你想了解的部分。</p></div><span>EXPLORE BY TOPIC</span></div>
      <div class="kb-topics">
        <button v-for="topic in topics" :id="'topic-' + topic.id" :key="topic.id" type="button" class="kb-topic" :aria-label="'浏览' + topic.label + '的' + topic.count + '篇笔记'" @click="selectTopic(topic.id, true)">
          <div class="kb-topic-top"><span class="kb-topic-symbol"><KnowledgeIcon :name="topic.id" /></span><span class="kb-topic-code">{{ topicCodes[topic.id] }}</span></div>
          <h3>{{ topic.label }}</h3><p>{{ topic.description }}</p>
          <div class="kb-topic-bottom"><span>{{ topic.count }} 篇笔记</span><KnowledgeIcon name="arrow" /></div>
        </button>
      </div>
    </section>

    <section id="notes" class="kb-notes-section" aria-labelledby="kb-notes-title">
      <div class="kb-section-heading"><div><h2 id="kb-notes-title" ref="notesHeading" tabindex="-1">笔记索引</h2><p>按主题浏览，或用关键词找一篇笔记。</p></div><span>THE NOTEBOOK</span></div>
      <div class="kb-notes-layout">
        <div class="kb-note-browser">
          <div class="kb-browser-toolbar">
            <label class="kb-note-search"><KnowledgeIcon name="search" /><input v-model="query" type="search" placeholder="筛选笔记标题与摘要…" aria-label="筛选笔记标题与摘要"><button v-if="query" class="kb-search-clear" type="button" aria-label="清除筛选关键词" @click="query = ''">×</button></label>
            <span class="kb-result-count" role="status" aria-live="polite">{{ filteredArticles.length }} 篇笔记</span>
          </div>
          <div class="kb-filters" role="group" aria-label="按知识板块筛选">
            <button type="button" class="kb-filter" :aria-pressed="selectedTopic === 'all'" @click="selectTopic('all')">全部笔记</button>
            <button v-for="topic in topics" :key="topic.id" type="button" class="kb-filter" :aria-pressed="selectedTopic === topic.id" @click="selectTopic(topic.id)">{{ topic.label }}</button>
          </div>
          <div v-if="visibleArticles.length" class="kb-article-list">
            <a v-for="article in visibleArticles" :key="article.url" :href="withBase(article.url)" class="kb-article">
              <span class="kb-article-symbol"><KnowledgeIcon name="note" /></span>
              <div class="kb-article-body"><h3>{{ article.title }}</h3><p v-if="article.summary">{{ article.summary }}</p><div class="kb-article-meta"><span class="kb-category">{{ article.categoryLabel }}</span><span class="kb-meta-dot" /><span>约 {{ article.readingMinutes }} 分钟阅读</span></div></div>
              <KnowledgeIcon name="arrow" />
            </a>
          </div>
          <div v-else class="kb-empty"><KnowledgeIcon name="search" /><p>还没有找到匹配的笔记，换个关键词试试。</p><button type="button" @click="resetFilters">查看全部笔记</button></div>
          <button v-if="visibleCount < filteredArticles.length" type="button" class="kb-load-more" @click="visibleCount += 6">继续浏览 · 还有 {{ filteredArticles.length - visibleCount }} 篇笔记</button>
        </div>
        <aside class="kb-notes-aside" aria-label="知识库阅读建议">
          <div class="kb-side-card"><span class="kb-side-label">ABOUT THIS SPACE</span><h3>学习，创作，记录。</h3><p>这里收藏学习新技术的过程、开发中遇到的问题，以及值得留下的日常。笔记会随着理解不断完善。</p><a :href="withBase('/简介.html')" class="kb-text-link">认识这个小站 <KnowledgeIcon name="arrow" /></a></div>
          <div v-if="starters.length" class="kb-side-card"><span class="kb-side-label">A PLACE TO START</span><h3>不妨从这里开始</h3><a v-for="(article, index) in starters" :key="article.url" :href="withBase(article.url)" class="kb-starter-link"><span>0{{ index + 1 }}</span>{{ article.label }}</a></div>
          <div class="kb-side-card kb-side-note"><KnowledgeIcon name="leaf" /><p>不急于一次掌握所有知识。<br>留下一篇笔记，向前走一步。</p></div>
        </aside>
      </div>
    </section>
    <div class="kb-closing"><span>把学到的留下来，让下一次查阅更轻松。</span><span>BUILT ONE NOTE AT A TIME.</span></div>
  </div>
</template>
