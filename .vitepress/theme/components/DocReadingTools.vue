<script setup lang="ts">
import { computed } from "vue";
import { useData, withBase } from "vitepress";
import { data } from "../knowledge.data";
import { normalizeArticlePath } from "../reading-history";
import { knowledgeConfig } from "../knowledge.config";

const { page } = useData();

const currentArticle = computed(() => {
  const currentPath = normalizeArticlePath(page.value.relativePath);
  return data.articles.find((article) => normalizeArticlePath(article.url) === currentPath);
});
const articleTitle = computed(() => currentArticle.value?.title || page.value.title || "学习笔记");
const wordCountLabel = computed(() =>
  String(currentArticle.value?.wordCount || 0).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
);

</script>

<template>
  <div class="kb-reading-tools">
    <nav class="kb-breadcrumb" aria-label="面包屑">
      <ol>
        <li><a :href="withBase('/')">知识库</a></li>
        <li v-if="currentArticle">
          <span class="kb-breadcrumb-divider" aria-hidden="true">/</span>
          <a :href="withBase(knowledgeConfig.modules.notes ? `/?topic=${currentArticle.category}#notes` : knowledgeConfig.modules.topics ? `/#topic-${currentArticle.category}` : '/')">{{ currentArticle.categoryLabel }}</a>
        </li>
        <li v-if="currentArticle && knowledgeConfig.modules.notes && !currentArticle.groupId.endsWith('/_root')">
          <span class="kb-breadcrumb-divider" aria-hidden="true">/</span>
          <a :href="withBase(`/?topic=${currentArticle.category}&group=${encodeURIComponent(currentArticle.groupId)}#notes`)">{{ currentArticle.groupLabel }}</a>
        </li>
        <li class="kb-breadcrumb-current">
          <span class="kb-breadcrumb-divider" aria-hidden="true">/</span>
          <span :title="articleTitle" aria-current="page">{{ articleTitle }}</span>
        </li>
      </ol>
    </nav>

    <div class="kb-reading-toolbar">
      <div class="kb-reading-meta">
        <template v-if="currentArticle">
          <span>{{ wordCountLabel }} 字</span>
          <span class="kb-reading-meta-dot" aria-hidden="true">·</span>
          <span>约 {{ currentArticle.readingMinutes }} 分钟</span>
        </template>
        <span v-else>学习笔记</span>
      </div>
    </div>
  </div>
</template>
