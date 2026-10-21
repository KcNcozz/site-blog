<script setup lang="ts">
import DefaultTheme from "vitepress/theme";
import { useData } from "vitepress";
import KnowledgeHome from "./components/KnowledgeHome.vue";
import HomeAccentToggle from "./components/HomeAccentToggle.vue";
import DocReadingTools from "./components/DocReadingTools.vue";

const { frontmatter } = useData();
</script>

<template>
  <DefaultTheme.Layout>
    <template #nav-bar-content-after><HomeAccentToggle /></template>
    <template #home-hero-before><KnowledgeHome v-if="frontmatter.knowledgeHome" /></template>
    <template #doc-before><DocReadingTools /></template>
  </DefaultTheme.Layout>
</template>
