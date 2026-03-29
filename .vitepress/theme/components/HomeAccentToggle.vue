<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";

type AccentKey = "sky" | "teal" | "amber" | "rose" | "purple";

const STORAGE_KEY = "vitepress-theme-accent";

const accents: Array<{ key: AccentKey; preview: string; title: string }> = [
  { key: "sky", preview: "#38bdf8", title: "Sky" },
  { key: "teal", preview: "#14b8a6", title: "Teal" },
  { key: "amber", preview: "#f59e0b", title: "Amber" },
  { key: "rose", preview: "#f43f5e", title: "Rose" },
  { key: "purple", preview: "#8b5cf6", title: "Purple" },
];

const accent = ref<AccentKey>("sky");
const isOpen = ref(false);
const pickerRef = ref<HTMLElement | null>(null);

const currentPreview = computed(() => {
  const match = accents.find((item) => item.key === accent.value);
  return match?.preview ?? "#38bdf8";
});

function applyAccent(nextAccent: AccentKey) {
  document.documentElement.setAttribute("data-accent", nextAccent);
}

function readSavedAccent(): AccentKey | null {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved && accents.some((item) => item.key === saved)) {
    return saved as AccentKey;
  }
  return null;
}

function togglePanel() {
  isOpen.value = !isOpen.value;
}

function chooseAccent(nextAccent: AccentKey) {
  accent.value = nextAccent;
  isOpen.value = false;
}

function onClickOutside(event: MouseEvent) {
  const target = event.target as Node | null;
  if (!target || !pickerRef.value) {
    return;
  }
  if (!pickerRef.value.contains(target)) {
    isOpen.value = false;
  }
}

onMounted(() => {
  const fromAttr = document.documentElement.getAttribute("data-accent") as AccentKey | null;
  accent.value = readSavedAccent() ?? fromAttr ?? "sky";
  applyAccent(accent.value);
  document.addEventListener("click", onClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", onClickOutside);
});

watch(accent, (value) => {
  applyAccent(value);
  localStorage.setItem(STORAGE_KEY, value);
});
</script>

<template>
  <div ref="pickerRef" class="nav-accent-picker">
    <button
      type="button"
      class="nav-accent-trigger"
      aria-label="切换主题色"
      title="切换主题色"
      @click="togglePanel"
    >
      <span class="nav-accent-trigger-dot" :style="{ backgroundColor: currentPreview }" />
      <svg class="nav-accent-trigger-icon" viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M12 3a9 9 0 1 0 9 9 3 3 0 0 1-3 3h-1a2 2 0 0 0-2 2v1a3 3 0 0 1-3 3A9 9 0 0 0 12 3Z"
          fill="none"
          stroke="currentColor"
          stroke-width="1.8"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <circle cx="7.8" cy="10.2" r="1.1" fill="currentColor" />
        <circle cx="10.8" cy="7.6" r="1.1" fill="currentColor" />
        <circle cx="15" cy="7.9" r="1.1" fill="currentColor" />
      </svg>
    </button>

    <Transition name="accent-pop">
      <div v-if="isOpen" class="nav-accent-panel" role="menu" aria-label="主题色选项">
        <button
          v-for="item in accents"
          :key="item.key"
          type="button"
          class="nav-accent-option"
          :class="{ active: accent === item.key }"
          :title="item.title"
          :aria-label="item.title"
          :style="{ '--accent-preview': item.preview }"
          @click="chooseAccent(item.key)"
        >
          <span class="nav-accent-swatch" />
        </button>
      </div>
    </Transition>
  </div>
</template>
