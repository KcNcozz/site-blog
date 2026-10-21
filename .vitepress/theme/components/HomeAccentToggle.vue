<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, useId } from "vue";

type AccentKey = "sky" | "teal" | "amber" | "rose" | "purple";

const STORAGE_KEY = "vitepress-theme-accent";

const accents: Array<{ key: AccentKey; preview: string; title: string }> = [
  { key: "sky", preview: "#515fbc", title: "鸢尾蓝" },
  { key: "teal", preview: "#177e76", title: "松石绿" },
  { key: "amber", preview: "#a46612", title: "琥珀" },
  { key: "rose", preview: "#ba4565", title: "蔷薇" },
  { key: "purple", preview: "#8550b5", title: "藤紫" },
];

const accent = ref<AccentKey>("sky");
const isOpen = ref(false);
const pickerRef = ref<HTMLElement | null>(null);
const triggerRef = ref<HTMLButtonElement | null>(null);
const panelId = `kb-accent-options-${useId()}`;

const currentAccent = computed(() => accents.find((item) => item.key === accent.value) ?? accents[0]);

function isAccent(value: string | null): value is AccentKey {
  return accents.some((item) => item.key === value);
}

function applyAccent(nextAccent: AccentKey) {
  document.documentElement.setAttribute("data-accent", nextAccent);
}

function readSavedAccent(): AccentKey | null {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return isAccent(saved) ? saved : null;
  } catch {
    return null;
  }
}

function togglePanel() {
  isOpen.value = !isOpen.value;
}

function chooseAccent(nextAccent: AccentKey) {
  accent.value = nextAccent;
  applyAccent(nextAccent);
  try {
    localStorage.setItem(STORAGE_KEY, nextAccent);
  } catch {
    // The selected palette still works when browser storage is unavailable.
  }
  closeAndFocus();
}

function closeAndFocus() {
  isOpen.value = false;
  triggerRef.value?.focus({ preventScroll: true });
}

function onClickOutside(event: PointerEvent) {
  const target = event.target as Node | null;
  if (!target || !pickerRef.value) {
    return;
  }
  if (!pickerRef.value.contains(target)) {
    isOpen.value = false;
  }
}

function onEscape(event: KeyboardEvent) {
  if (event.key !== "Escape" || !isOpen.value) return;
  event.preventDefault();
  closeAndFocus();
}

function onStorage(event: StorageEvent) {
  if (event.key !== STORAGE_KEY && event.key !== null) return;
  accent.value = isAccent(event.newValue) ? event.newValue : "sky";
  applyAccent(accent.value);
}

onMounted(() => {
  const fromAttr = document.documentElement.getAttribute("data-accent");
  accent.value = readSavedAccent() ?? (isAccent(fromAttr) ? fromAttr : "sky");
  applyAccent(accent.value);
  document.addEventListener("pointerdown", onClickOutside);
  document.addEventListener("keydown", onEscape);
  window.addEventListener("storage", onStorage);
});

onBeforeUnmount(() => {
  document.removeEventListener("pointerdown", onClickOutside);
  document.removeEventListener("keydown", onEscape);
  window.removeEventListener("storage", onStorage);
});
</script>

<template>
  <div ref="pickerRef" class="nav-accent-picker">
    <button
      ref="triggerRef"
      type="button"
      class="nav-accent-trigger"
      :aria-label="`切换主题色，当前为${currentAccent.title}`"
      :aria-expanded="isOpen"
      :aria-controls="panelId"
      :title="`主题色：${currentAccent.title}`"
      @click="togglePanel"
    >
      <span class="nav-accent-trigger-dot" :style="{ backgroundColor: currentAccent.preview }" aria-hidden="true" />
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
      <div v-if="isOpen" :id="panelId" class="nav-accent-panel" role="group" aria-label="主题色选项">
        <button
          v-for="item in accents"
          :key="item.key"
          type="button"
          class="nav-accent-option"
          :class="{ active: accent === item.key }"
          :title="item.title"
          :aria-label="item.title"
          :aria-pressed="accent === item.key"
          :style="{ '--accent-preview': item.preview }"
          @click="chooseAccent(item.key)"
        >
          <span class="nav-accent-swatch" aria-hidden="true" />
        </button>
      </div>
    </Transition>
  </div>
</template>
