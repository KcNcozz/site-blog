<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useRouter, withBase } from "vitepress";
import { data } from "../knowledge.data";
import { knowledgeConfig as config } from "../knowledge.config";
import KnowledgeIcon from "./KnowledgeIcon.vue";
import RecentReading from "./RecentReading.vue";

const { home, modules } = config;
const router = useRouter();
const previousAfterRouteChange = router.onAfterRouteChange;
const previousAfterRouteChanged = router.onAfterRouteChanged;
const pageSize = Math.max(1, home.notes.pageSize);
const selectedTopic = ref("all");
const selectedGroup = ref("all");
const query = ref("");
const visibleCount = ref(pageSize);
const notesHeading = ref<HTMLElement | null>(null);
let ready = false;
let restoring = false;
const topics = computed(() => data.topics);
const currentTopic = computed(() => topics.value.find(topic => topic.id === selectedTopic.value));
const groups = computed(() => currentTopic.value?.groups ?? []);
const hasAside = modules.about || modules.starters || modules.asideNote;
const filteredArticles = computed(() => {
  const term = query.value.trim().toLocaleLowerCase();
  return data.articles.filter(article =>
    (selectedTopic.value === "all" || article.category === selectedTopic.value) &&
    (selectedGroup.value === "all" || article.groupId === selectedGroup.value) &&
    (!term || [article.title, article.summary, article.categoryLabel, article.groupLabel].join(" ").toLocaleLowerCase().includes(term))
  );
});
const visibleArticles = computed(() => filteredArticles.value.slice(0, visibleCount.value));
const formattedWords = computed(() => data.totalWords >= 10000 ? (data.totalWords / 10000).toFixed(1) + "万" : String(data.totalWords));
const starters = computed(() => config.starters.flatMap(item => {
  const article = data.articles.find(entry => {
    try { return decodeURI(entry.url) === decodeURI(item.url); } catch { return entry.url === item.url; }
  });
  return article ? [{ ...article, label: item.label }] : [];
}));

function syncUrl() {
  if (!ready || restoring) return;
  const url = new URL(window.location.href);
  const values: Record<string, string> = {
    topic: selectedTopic.value === "all" ? "" : selectedTopic.value,
    group: selectedGroup.value === "all" ? "" : selectedGroup.value,
    q: query.value,
    limit: visibleCount.value > pageSize ? String(visibleCount.value) : "",
  };
  for (const [key, value] of Object.entries(values)) {
    if (value) url.searchParams.set(key, value);
    else url.searchParams.delete(key);
  }
  window.history.replaceState(window.history.state, "", url);
}

function restoreUrl() {
  restoring = true;
  const params = new URLSearchParams(window.location.search);
  const topic = topics.value.find(item => item.id === params.get("topic"));
  selectedTopic.value = topic?.id ?? "all";
  selectedGroup.value = topic?.groups.find(group => group.id === params.get("group"))?.id ?? "all";
  query.value = (params.get("q") ?? "").slice(0, 200);
  const limit = Number(params.get("limit"));
  visibleCount.value = Number.isSafeInteger(limit) && limit >= pageSize
    ? Math.min(limit, Math.max(pageSize, data.articles.length)) : pageSize;
  restoring = false;
}

async function afterNavigation(href: string) {
  await (previousAfterRouteChange ?? previousAfterRouteChanged)?.(href);
  if (ready) restoreUrl();
}

watch([selectedTopic, selectedGroup, query], () => {
  if (restoring) return;
  visibleCount.value = pageSize;
  syncUrl();
}, { flush: "sync" });
watch(visibleCount, syncUrl, { flush: "sync" });

onMounted(() => {
  restoreUrl();
  ready = true;
  router.onAfterRouteChange = afterNavigation;
  window.addEventListener("popstate", restoreUrl);
});
onBeforeUnmount(() => {
  ready = false;
  if (router.onAfterRouteChange === afterNavigation) router.onAfterRouteChange = previousAfterRouteChange;
  window.removeEventListener("popstate", restoreUrl);
});

async function selectTopic(id: string, scroll = false) {
  selectedGroup.value = "all";
  selectedTopic.value = id;
  if (scroll) {
    query.value = "";
    await nextTick();
    notesHeading.value?.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth", block: "start" });
    notesHeading.value?.focus({ preventScroll: true });
  }
}
function resetFilters() {
  selectedGroup.value = "all";
  selectedTopic.value = "all";
  query.value = "";
}
</script>

<template>
  <div class="knowledge-home">
    <section v-if="modules.hero" class="kb-hero" :class="{ 'kb-hero-solo': !modules.knowledgeMap }" aria-labelledby="kb-home-title">
      <div>
        <p class="kb-eyebrow">{{ home.hero.eyebrow }}</p>
        <h1 id="kb-home-title"><template v-for="(line, index) in home.hero.titleLines" :key="index">{{ line }}<br v-if="index < home.hero.titleLines.length - 1"></template><span>{{ home.hero.accent }}</span></h1>
        <p class="kb-hero-description">{{ home.hero.description }}</p>
        <div class="kb-hero-actions">
          <a v-if="modules.notes || modules.topics" class="kb-primary-link" :href="modules.notes ? '#notes' : '#knowledge'">{{ home.hero.primaryLabel }} <KnowledgeIcon name="arrow" /></a>
          <a class="kb-text-link" :href="withBase(config.site.aboutUrl)">{{ home.hero.secondaryLabel }} <KnowledgeIcon name="arrow" /></a>
        </div>
      </div>
      <div v-if="modules.knowledgeMap" class="kb-hero-index" aria-label="主要知识板块">
        <div class="kb-index-heading"><span>{{ home.index.title }}</span><span>{{ home.index.eyebrow }}</span></div>
        <component :is="modules.notes ? 'button' : 'a'" v-for="(topic, index) in topics.slice(0, home.index.limit)" :key="topic.id" :type="modules.notes ? 'button' : undefined" :href="modules.notes ? undefined : withBase(topic.url)" class="kb-index-row" @click="modules.notes && selectTopic(topic.id, true)">
          <span class="kb-index-number">{{ String(index + 1).padStart(2, '0') }}</span><KnowledgeIcon :name="topic.icon" />
          <strong>{{ topic.label }}</strong><small>{{ topic.count }} 篇笔记</small><KnowledgeIcon name="arrow" class="kb-arrow" />
        </component>
        <div class="kb-index-foot"><span>{{ home.index.footer }}</span><KnowledgeIcon name="layers" /></div>
      </div>
    </section>

    <div v-if="modules.stats" class="kb-stats" aria-label="知识库统计">
      <div class="kb-stat"><strong>{{ data.totalArticles }}</strong><span>{{ home.stats.articleLabel }}</span></div>
      <div class="kb-stat"><strong>{{ topics.length.toString().padStart(2, '0') }}</strong><span>{{ home.stats.topicLabel }}</span></div>
      <div class="kb-stat"><strong>{{ formattedWords }}</strong><span>{{ home.stats.wordLabel }}</span></div>
      <span class="kb-stats-note"><KnowledgeIcon name="leaf" />{{ home.stats.note }}</span>
    </div>

    <RecentReading v-if="modules.recentReading" />

    <section v-if="modules.topics" id="knowledge" class="kb-topics-section" aria-labelledby="kb-topics-title">
      <div class="kb-section-heading"><div><h2 id="kb-topics-title">{{ home.topics.title }}</h2><p>{{ home.topics.description }}</p></div><span>{{ home.topics.eyebrow }}</span></div>
      <div class="kb-topics">
        <component :is="modules.notes ? 'button' : 'a'" v-for="topic in topics" :id="'topic-' + topic.id" :key="topic.id" :type="modules.notes ? 'button' : undefined" :href="modules.notes ? undefined : withBase(topic.url)" class="kb-topic" :aria-label="'浏览' + topic.label + '的' + topic.count + '篇笔记'" @click="modules.notes && selectTopic(topic.id, true)">
          <div class="kb-topic-top"><span class="kb-topic-symbol"><KnowledgeIcon :name="topic.icon" /></span><span class="kb-topic-code">{{ topic.code }}</span></div>
          <h3>{{ topic.label }}</h3><p>{{ topic.description }}</p>
          <div class="kb-topic-bottom"><span>{{ topic.count }} 篇笔记</span><KnowledgeIcon name="arrow" /></div>
        </component>
      </div>
    </section>

    <section v-if="modules.notes" id="notes" class="kb-notes-section" aria-labelledby="kb-notes-title">
      <div class="kb-section-heading"><div><h2 id="kb-notes-title" ref="notesHeading" tabindex="-1">{{ home.notes.title }}</h2><p>{{ home.notes.description }}</p></div><span>{{ home.notes.eyebrow }}</span></div>
      <div class="kb-notes-layout" :class="{ 'kb-without-aside': !hasAside }">
        <div class="kb-note-browser">
          <div class="kb-browser-toolbar">
            <label class="kb-note-search"><KnowledgeIcon name="search" /><input v-model="query" type="search" maxlength="200" :placeholder="home.notes.searchPlaceholder" :aria-label="home.notes.searchLabel"><button v-if="query" class="kb-search-clear" type="button" aria-label="清除筛选关键词" @click="query = ''">×</button></label>
            <span class="kb-result-count" role="status" aria-live="polite">{{ filteredArticles.length }} 篇笔记</span>
          </div>
          <div class="kb-filters" role="group" aria-label="按知识板块筛选">
            <button type="button" class="kb-filter" :aria-pressed="selectedTopic === 'all'" @click="selectTopic('all')">{{ home.notes.allLabel }}</button>
            <button v-for="topic in topics" :key="topic.id" type="button" class="kb-filter" :aria-pressed="selectedTopic === topic.id" @click="selectTopic(topic.id)">{{ topic.label }}</button>
          </div>
          <div v-if="groups.length > 1" class="kb-group-filters" role="group" :aria-label="currentTopic?.label + '子目录筛选'">
            <span class="kb-group-label">子目录</span>
            <button type="button" :aria-pressed="selectedGroup === 'all'" @click="selectedGroup = 'all'">{{ home.notes.groupAllLabel }}</button>
            <button v-for="group in groups" :key="group.id" type="button" :aria-pressed="selectedGroup === group.id" @click="selectedGroup = group.id">{{ group.label }} <span>{{ group.count }}</span></button>
          </div>
          <div v-if="visibleArticles.length" class="kb-article-list">
            <a v-for="article in visibleArticles" :key="article.url" :href="withBase(article.url)" class="kb-article">
              <span class="kb-article-symbol"><KnowledgeIcon name="note" /></span>
              <div class="kb-article-body"><h3>{{ article.title }}</h3><p v-if="article.summary">{{ article.summary }}</p><div class="kb-article-meta"><span class="kb-category">{{ article.categoryLabel }}</span><span v-if="selectedTopic !== 'all'">{{ article.groupLabel }}</span><span class="kb-meta-dot" /><span>约 {{ article.readingMinutes }} 分钟阅读</span></div></div>
              <KnowledgeIcon name="arrow" />
            </a>
          </div>
          <div v-else class="kb-empty"><KnowledgeIcon name="search" /><p>{{ home.notes.emptyText }}</p><button type="button" @click="resetFilters">{{ home.notes.resetLabel }}</button></div>
          <button v-if="visibleCount < filteredArticles.length" type="button" class="kb-load-more" @click="visibleCount += pageSize">{{ home.notes.loadMoreLabel }} · 还有 {{ filteredArticles.length - visibleCount }} 篇笔记</button>
        </div>
        <aside v-if="hasAside" class="kb-notes-aside" aria-label="知识库阅读建议">
          <div v-if="modules.about" class="kb-side-card"><span class="kb-side-label">{{ home.about.eyebrow }}</span><h3>{{ home.about.title }}</h3><p>{{ home.about.description }}</p><a :href="withBase(config.site.aboutUrl)" class="kb-text-link">{{ home.about.linkLabel }} <KnowledgeIcon name="arrow" /></a></div>
          <div v-if="modules.starters && starters.length" class="kb-side-card"><span class="kb-side-label">{{ home.starters.eyebrow }}</span><h3>{{ home.starters.title }}</h3><a v-for="(article, index) in starters" :key="article.url" :href="withBase(article.url)" class="kb-starter-link"><span>{{ String(index + 1).padStart(2, '0') }}</span>{{ article.label }}</a></div>
          <div v-if="modules.asideNote" class="kb-side-card kb-side-note"><KnowledgeIcon name="leaf" /><p><template v-for="(line, index) in home.note.lines" :key="index">{{ line }}<br v-if="index < home.note.lines.length - 1"></template></p></div>
        </aside>
      </div>
    </section>
    <div v-if="modules.closing" class="kb-closing"><span>{{ home.closing.text }}</span><span>{{ home.closing.signature }}</span></div>
  </div>
</template>
