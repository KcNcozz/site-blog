import { computed, inject, nextTick, onBeforeUnmount, onMounted, provide, ref, watch, type InjectionKey } from "vue";
import { useData, useRouter, withBase } from "vitepress";
import { data } from "./knowledge.data";
import { knowledgeConfig } from "./knowledge.config";
import { normalizeArticlePath } from "./reading-history";

function createWorkspace() {
  const { page, frontmatter } = useData();
  const router = useRouter();
  const pageSize = Math.max(1, knowledgeConfig.home.notes.pageSize);
  const selectedTopic = ref("all");
  const selectedGroup = ref("all");
  const query = ref("");
  const visibleCount = ref(pageSize);
  const topics = computed(() => data.topics);
  const isHome = computed(() => frontmatter.value.knowledgeHome === true);
  const currentArticle = computed(() => data.articles.find(article =>
    normalizeArticlePath(article.url) === normalizeArticlePath(page.value.relativePath),
  ));
  const activeTopic = computed(() => currentArticle.value?.category ?? selectedTopic.value);
  const activeGroup = computed(() => currentArticle.value?.groupId ?? selectedGroup.value);
  const currentTopic = computed(() => topics.value.find(topic => topic.id === activeTopic.value));
  const groups = computed(() => currentTopic.value?.groups ?? []);
  const currentGroup = computed(() => groups.value.find(group => group.id === activeGroup.value));
  const filteredArticles = computed(() => {
    const term = query.value.trim().toLocaleLowerCase();
    return data.articles.filter(article =>
      (selectedTopic.value === "all" || article.category === selectedTopic.value)
      && (selectedGroup.value === "all" || article.groupId === selectedGroup.value)
      && (!term || [article.title, article.summary, article.categoryLabel, article.groupLabel]
        .join(" ").toLocaleLowerCase().includes(term)),
    );
  });
  const visibleArticles = computed(() => filteredArticles.value.slice(0, visibleCount.value));
  const formattedWords = computed(() => data.totalWords >= 10000
    ? `${(data.totalWords / 10000).toFixed(1)}万` : String(data.totalWords));
  let ready = false;
  let restoring = false;
  let previousAfterRouteChange = router.onAfterRouteChange;
  let previousAfterRouteChanged = router.onAfterRouteChanged;

  function topicHref(id: string = "all", group?: string) {
    const params = new URLSearchParams();
    const topic = topics.value.find(item => item.id === id);
    if (topic) {
      params.set("topic", topic.id);
      if (topic.groups.some(item => item.id === group)) params.set("group", group!);
    }
    return withBase(`/${params.size ? `?${params}` : ""}`);
  }

  function restoreUrl() {
    if (typeof window === "undefined") return;
    restoring = true;
    if (currentArticle.value) {
      selectedTopic.value = currentArticle.value.category;
      selectedGroup.value = currentArticle.value.groupId;
      query.value = "";
      visibleCount.value = pageSize;
    } else if (isHome.value) {
      const params = new URLSearchParams(window.location.search);
      const topic = topics.value.find(item => item.id === params.get("topic"));
      selectedTopic.value = topic?.id ?? "all";
      selectedGroup.value = topic?.groups.find(group => group.id === params.get("group"))?.id ?? "all";
      query.value = (params.get("q") ?? "").slice(0, 200);
      const limit = Number(params.get("limit"));
      visibleCount.value = Number.isSafeInteger(limit) && limit >= pageSize
        ? Math.min(limit, Math.max(pageSize, data.articles.length)) : pageSize;
    } else {
      selectedTopic.value = "all";
      selectedGroup.value = "all";
      query.value = "";
      visibleCount.value = pageSize;
    }
    restoring = false;
  }

  function syncUrl(push = false) {
    if (!ready || restoring || !isHome.value) return;
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
    if (url.href === window.location.href) return;
    if (push) {
      window.history.replaceState({ ...window.history.state, scrollPosition: window.scrollY }, "");
      window.history.pushState({ scrollPosition: 0 }, "", url);
    } else window.history.replaceState(window.history.state, "", url);
  }

  function applyFilters(topic: string, group: string, push = true) {
    restoring = true;
    selectedTopic.value = topic;
    selectedGroup.value = group;
    visibleCount.value = pageSize;
    restoring = false;
    syncUrl(push);
    void nextTick(() => {
      window.scrollTo({ top: 0, behavior: "instant" });
      document.getElementById("ws-browser-title")?.focus({ preventScroll: true });
    });
  }

  function selectTopic(id: string) {
    const topic = topics.value.find(item => item.id === id);
    if (!isHome.value) { void router.go(topicHref(topic?.id)); return; }
    applyFilters(topic?.id ?? "all", "all");
  }

  function selectGroup(id: string) {
    const topic = topics.value.find(item => item.groups.some(group => group.id === id));
    const topicId = topic?.id ?? currentTopic.value?.id ?? "all";
    const groupId = topic ? id : "all";
    if (!isHome.value) { void router.go(topicHref(topicId, groupId)); return; }
    applyFilters(topicId, groupId);
  }

  function setQuery(text: string) {
    query.value = text.slice(0, 200);
    visibleCount.value = pageSize;
    syncUrl();
  }

  function resetFilters() {
    if (!isHome.value) { void router.go(topicHref()); return; }
    query.value = "";
    applyFilters("all", "all");
  }

  function loadMore() {
    visibleCount.value = Math.min(visibleCount.value + pageSize, filteredArticles.value.length);
    syncUrl();
  }

  function articlesForGroup(groupId: string) {
    return data.articles.filter(article => article.groupId === groupId);
  }

  async function afterNavigation(href: string) {
    await (previousAfterRouteChange ?? previousAfterRouteChanged)?.(href);
    if (ready) restoreUrl();
  }

  // The server can highlight an article without reading browser-only URL state.
  watch(currentArticle, article => {
    if (!article) return;
    selectedTopic.value = article.category;
    selectedGroup.value = article.groupId;
  }, { immediate: true });

  onMounted(() => {
    previousAfterRouteChange = router.onAfterRouteChange;
    previousAfterRouteChanged = router.onAfterRouteChanged;
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

  return {
    isHome, currentArticle, selectedTopic, selectedGroup, query, visibleCount,
    topics, activeTopic, activeGroup, currentTopic, currentGroup, groups,
    filteredArticles, visibleArticles, totalArticles: data.totalArticles, formattedWords,
    selectTopic, selectGroup, setQuery, resetFilters, loadMore, topicHref, articlesForGroup,
  };
}

export type WorkspaceContext = ReturnType<typeof createWorkspace>;
const workspaceKey: InjectionKey<WorkspaceContext> = Symbol("knowledge-workspace");

export function provideWorkspace() {
  const workspace = createWorkspace();
  provide(workspaceKey, workspace);
  return workspace;
}

export function useWorkspace() {
  const workspace = inject(workspaceKey);
  if (!workspace) throw new Error("Workspace components require provideWorkspace().");
  return workspace;
}
