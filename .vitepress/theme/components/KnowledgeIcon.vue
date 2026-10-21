<script setup lang="ts">
withDefaults(defineProps<{ name?: string }>(), { name: "note" });
const paths: Record<string, string> = {
  frontend: "m8 7-5 5 5 5m8-10 5 5-5 5m-3-14-2 18",
  backend: "M4 3h16v7H4zM4 14h16v7H4zM7 6.5h.01M7 17.5h.01M11 6.5h6M11 17.5h6",
  AI: "m12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5L12 3zM20 2v4m-2-2h4",
  demo: "m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3zm0 9 8-4.5M12 12 4 7.5M12 12v9",
  web: "M4 4h6a3 3 0 0 1 3 3v14a4 4 0 0 0-4-3H4V4zm16 0h-4a3 3 0 0 0-3 3m7-3v14h-3a4 4 0 0 0-4 3",
  other: "M5 4h14v17H5zM8 2v4m8-4v4M8 10h8m-8 4h6",
  story: "M4 4h6a3 3 0 0 1 2 1 3 3 0 0 1 2-1h6v15h-6a3 3 0 0 0-2 1 3 3 0 0 0-2-1H4zM12 5v15",
  arrow: "M5 12h14m-6-6 6 6-6 6",
  search: "M20 20l-5-5m2-6a7 7 0 1 1-14 0 7 7 0 0 1 14 0",
  note: "M6 3h8l4 4v14H6V3zm8 0v5h4M9 12h6m-6 4h6",
  leaf: "M20 3c-9 0-15 3-15 9a6 6 0 0 0 6 6c6 0 9-6 9-15zM4 21l11-11",
  layers: "m12 3 10 5-10 5L2 8l10-5zm-9 10 9 5 9-5M3 18l9 5 9-5",
};
</script>

<template>
  <svg class="kb-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path :d="paths[name] || paths.note" />
  </svg>
</template>
