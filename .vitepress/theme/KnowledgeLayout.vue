<script setup lang="ts">
import DefaultTheme from "vitepress/theme";
import { nextTick, onMounted, watch } from "vue";
import { useData } from "vitepress";
import KnowledgeHome from "./components/KnowledgeHome.vue";
import ThemeSettings from "./components/ThemeSettings.vue";
import DocReadingTools from "./components/DocReadingTools.vue";
import ReadingProgress from "./components/ReadingProgress.vue";
import RelatedArticles from "./components/RelatedArticles.vue";
import WorkspaceLayout from "./WorkspaceLayout.vue";
import { useThemePreferences } from "./preferences";

const { frontmatter } = useData();
const { preferences } = useThemePreferences();
let mounted = false;
let switchSequence = 0;
onMounted(() => { mounted = true; });
watch(() => preferences.visualStyle, async () => {
  if (!mounted) return;
  const sequence = ++switchSequence;
  const oldContent = document.querySelector<HTMLElement>(".VPDoc .vp-doc");
  const headings = Array.from(oldContent?.querySelectorAll<HTMLElement>("h1[id],h2[id],h3[id]") ?? []);
  const anchor = headings.filter(element => element.getBoundingClientRect().top <= 112).at(-1);
  const previousPosition = window.scrollY;
  const saved = anchor ? { id: anchor.id, top: anchor.getBoundingClientRect().top } : undefined;
  await nextTick();
  await new Promise<void>(resolve => requestAnimationFrame(() => resolve()));
  if (sequence !== switchSequence) return;
  const target = saved ? document.getElementById(saved.id) : null;
  const top = target && saved ? target.getBoundingClientRect().top + window.scrollY - saved.top : previousPosition;
  window.scrollTo({ top: Math.max(0, top), behavior: "instant" });
  document.querySelector<HTMLButtonElement>(".kb-settings-trigger")?.focus({ preventScroll: true });
}, { flush: "sync" });
</script>

<template>
  <WorkspaceLayout v-if="preferences.visualStyle === 'workspace'" />
  <div v-else class="kb-classic-layout"><DefaultTheme.Layout>
    <template #nav-bar-content-after><ThemeSettings /></template>
    <template #home-hero-before><KnowledgeHome v-if="frontmatter.knowledgeHome" /></template>
    <template #doc-before><DocReadingTools /><ReadingProgress /></template>
    <template #doc-footer-before><RelatedArticles /></template>
  </DefaultTheme.Layout></div>
</template>
