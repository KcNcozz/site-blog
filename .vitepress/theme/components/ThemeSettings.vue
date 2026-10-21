<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, useId, watch } from "vue";
import { useRoute } from "vitepress";
import { themeAccents, useThemePreferences, visualStyles } from "../preferences";

const { preferences, setPreference, resetPreferences } = useThemePreferences();
const route = useRoute();
const isOpen = ref(false);
const trigger = ref<HTMLButtonElement>();
const wrapper = ref<HTMLElement>();
const panel = ref<HTMLElement>();
const panelPosition = ref({ top: "74px", right: "16px", width: "326px", maxHeight: "calc(100dvh - 82px)" });
const id = `kb-theme-settings-${useId()}`;
const currentAccent = computed(() => themeAccents.find((item) => item.key === preferences.accent) ?? themeAccents[0]);
const styleOptions = [{ value: "card", label: "卡片" }, { value: "plain", label: "纯净" }] as const;
const widthOptions = [{ value: "normal", label: "标准" }, { value: "wide", label: "宽幅" }] as const;
const fontOptions = [16, 18, 20] as const;
const lineOptions = [{ value: "compact", label: "紧凑" }, { value: "normal", label: "标准" }, { value: "relaxed", label: "宽松" }] as const;

function updatePosition() {
  if (!trigger.value) return;
  const rect = trigger.value.getBoundingClientRect();
  const viewportWidth = document.documentElement.clientWidth;
  const viewportHeight = window.visualViewport?.height ?? window.innerHeight;
  const viewportTop = window.visualViewport?.offsetTop ?? 0;
  const panelWidth = Math.min(326, viewportWidth - 32);
  const largestRight = Math.max(16, viewportWidth - panelWidth - 16);
  // On short screens, move the panel up to leave room for its scrollable choices.
  const minimumHeight = Math.min(280, viewportHeight - 16);
  const panelTop = Math.max(viewportTop + 8, Math.min(rect.bottom + 10, viewportTop + viewportHeight - minimumHeight - 8));
  panelPosition.value = {
    top: `${panelTop}px`,
    right: `${Math.min(largestRight, Math.max(16, viewportWidth - rect.right))}px`,
    width: `${panelWidth}px`,
    maxHeight: `${Math.max(0, viewportTop + viewportHeight - panelTop - 8)}px`,
  };
}

function closePanel(restoreFocus = false) {
  isOpen.value = false;
  if (restoreFocus) trigger.value?.focus({ preventScroll: true });
}

async function togglePanel() {
  if (isOpen.value) return closePanel();
  updatePosition();
  isOpen.value = true;
  await nextTick();
  panel.value?.querySelector<HTMLInputElement>('input:checked')?.focus({ preventScroll: true });
}

function isWithinSettings(target: EventTarget | null) {
  return target instanceof Node && (wrapper.value?.contains(target) || panel.value?.contains(target));
}

function onPointerDown(event: PointerEvent) {
  if (isOpen.value && !isWithinSettings(event.target)) closePanel();
}

function onFocusIn(event: FocusEvent) {
  if (isOpen.value && !isWithinSettings(event.target)) closePanel();
}

function onKeyDown(event: KeyboardEvent) {
  if (event.key === "Escape" && isOpen.value) {
    event.preventDefault();
    event.stopPropagation();
    closePanel(true);
  }
}

watch(() => route.path, () => closePanel());

onMounted(() => {
  document.addEventListener("pointerdown", onPointerDown);
  document.addEventListener("focusin", onFocusIn);
  document.addEventListener("keydown", onKeyDown);
  window.addEventListener("resize", updatePosition, { passive: true });
  window.visualViewport?.addEventListener("resize", updatePosition, { passive: true });
  window.visualViewport?.addEventListener("scroll", updatePosition, { passive: true });
});

onBeforeUnmount(() => {
  document.removeEventListener("pointerdown", onPointerDown);
  document.removeEventListener("focusin", onFocusIn);
  document.removeEventListener("keydown", onKeyDown);
  window.removeEventListener("resize", updatePosition);
  window.visualViewport?.removeEventListener("resize", updatePosition);
  window.visualViewport?.removeEventListener("scroll", updatePosition);
});
</script>

<template>
  <div ref="wrapper" class="kb-theme-settings">
    <button
      ref="trigger"
      type="button"
      class="kb-settings-trigger"
      aria-label="主题与阅读设置"
      aria-haspopup="dialog"
      :aria-expanded="isOpen"
      :aria-controls="isOpen ? id : undefined"
      title="主题与阅读设置"
      @click="togglePanel"
    >
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 7h16M4 17h16" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" />
        <circle cx="9" cy="7" r="3" :fill="currentAccent.preview" stroke="currentColor" stroke-width="1.4" />
        <circle cx="15" cy="17" r="3" :fill="currentAccent.preview" stroke="currentColor" stroke-width="1.4" />
      </svg>
      <span class="kb-settings-trigger-label">设置</span>
    </button>

    <Teleport to="body">
      <Transition name="kb-settings-pop">
        <section
          v-if="isOpen"
          :id="id"
          ref="panel"
          class="kb-settings-panel"
          role="dialog"
          aria-modal="false"
          :aria-labelledby="`${id}-title`"
          :style="panelPosition"
        >
          <header class="kb-settings-header">
            <div>
              <h2 :id="`${id}-title`">主题与阅读</h2>
              <p>让知识库更合你的阅读习惯</p>
            </div>
            <button type="button" class="kb-settings-close" aria-label="关闭设置" @click="closePanel(true)">
              <svg viewBox="0 0 20 20" aria-hidden="true"><path d="m5 5 10 10M15 5 5 15" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" /></svg>
            </button>
          </header>

          <fieldset class="kb-settings-fieldset kb-settings-visuals">
            <legend>站点布局</legend>
            <div class="kb-settings-visual-grid">
              <label v-for="style in visualStyles" :key="style.key" class="kb-settings-visual" :class="`kb-settings-visual-${style.key}`">
                <input type="radio" :name="`${id}-visual-style`" :value="style.key" :checked="preferences.visualStyle === style.key" @change="setPreference('visualStyle', style.key)" />
                <span class="kb-settings-preview" aria-hidden="true">
                  <template v-if="style.key === 'workspace'">
                    <span class="kb-settings-preview-sidebar"><i /><i /><i /><i /></span>
                    <span class="kb-settings-preview-list"><i /><i /><i /></span>
                    <span class="kb-settings-preview-reader"><i /><i /><i /><i /><i /></span>
                  </template>
                  <template v-else>
                    <span class="kb-settings-preview-nav" /><span class="kb-settings-preview-title" /><span class="kb-settings-preview-line" />
                    <span class="kb-settings-preview-cards"><i /><i /><i /></span>
                  </template>
                  <span v-if="preferences.visualStyle === style.key" class="kb-settings-preview-check"><svg viewBox="0 0 16 16"><path d="m4 8 2.5 2.5L12 5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" /></svg></span>
                </span>
                <strong>{{ style.title }}</strong><span class="kb-settings-visual-description">{{ style.description }}</span>
              </label>
            </div>
          </fieldset>

          <fieldset class="kb-settings-fieldset">
            <legend>主题色</legend>
            <div class="kb-settings-colors">
              <label v-for="accent in themeAccents" :key="accent.key" class="kb-settings-color" :title="accent.title">
                <input type="radio" :name="`${id}-accent`" :value="accent.key" :checked="preferences.accent === accent.key" @change="setPreference('accent', accent.key)" />
                <span class="kb-settings-swatch" :style="{ backgroundColor: accent.preview }" aria-hidden="true">
                  <svg v-if="preferences.accent === accent.key" viewBox="0 0 16 16"><path d="m4 8 2.5 2.5L12 5" fill="none" stroke="white" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" /></svg>
                </span>
                <span>{{ accent.title }}</span>
              </label>
            </div>
          </fieldset>

          <div class="kb-settings-reading-title">正文阅读</div>
          <fieldset class="kb-settings-fieldset kb-settings-row">
            <legend>外观</legend>
            <div class="kb-settings-choices">
              <label v-for="option in styleOptions" :key="option.value" class="kb-settings-choice">
                <input type="radio" :name="`${id}-style`" :checked="preferences.readingStyle === option.value" @change="setPreference('readingStyle', option.value)" />
                <span>{{ option.label }}</span>
              </label>
            </div>
          </fieldset>
          <fieldset class="kb-settings-fieldset kb-settings-row">
            <legend>宽度</legend>
            <div class="kb-settings-choices">
              <label v-for="option in widthOptions" :key="option.value" class="kb-settings-choice">
                <input type="radio" :name="`${id}-width`" :checked="preferences.readingWidth === option.value" @change="setPreference('readingWidth', option.value)" />
                <span>{{ option.label }}</span>
              </label>
            </div>
          </fieldset>
          <p class="kb-settings-width-note">宽幅会收起右侧目录；手机保持单列。</p>
          <fieldset class="kb-settings-fieldset kb-settings-row">
            <legend>字号</legend>
            <div class="kb-settings-choices">
              <label v-for="size in fontOptions" :key="size" class="kb-settings-choice">
                <input type="radio" :name="`${id}-font`" :checked="preferences.fontSize === size" @change="setPreference('fontSize', size)" />
                <span>{{ size }}<small>px</small></span>
              </label>
            </div>
          </fieldset>
          <fieldset class="kb-settings-fieldset kb-settings-row">
            <legend>行距</legend>
            <div class="kb-settings-choices">
              <label v-for="option in lineOptions" :key="option.value" class="kb-settings-choice">
                <input type="radio" :name="`${id}-line`" :checked="preferences.lineHeight === option.value" @change="setPreference('lineHeight', option.value)" />
                <span>{{ option.label }}</span>
              </label>
            </div>
          </fieldset>

          <footer class="kb-settings-footer">
            <span>偏好会自动保存</span>
            <button type="button" @click="resetPreferences">恢复默认</button>
          </footer>
        </section>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.kb-theme-settings { display: inline-flex; flex-shrink: 0; margin-left: 12px; }
.kb-settings-trigger { display: inline-flex; align-items: center; justify-content: center; gap: 7px; min-width: 36px; min-height: 34px; padding: 6px 9px; border: 1px solid var(--vp-c-divider); border-radius: 9px; background: var(--kb-surface, var(--vp-c-bg)); color: var(--vp-c-text-2); font: inherit; font-size: 12px; cursor: pointer; transition: border-color .15s, color .15s; }
.kb-settings-trigger:hover,.kb-settings-trigger[aria-expanded="true"] { border-color: var(--vp-c-brand-1); color: var(--vp-c-brand-1); }
.kb-settings-trigger svg { width: 18px; height: 18px; }
.kb-settings-trigger-label { display: none; }
.kb-settings-panel { box-sizing: border-box; position: fixed; z-index: 1000; width: 326px; max-width: calc(100vw - 32px); max-height: calc(100dvh - var(--vp-nav-height, 64px) - 30px); overflow: auto; overscroll-behavior: contain; padding: 22px; border: 1px solid var(--vp-c-divider); border-radius: 16px; background: var(--kb-surface, var(--vp-c-bg)); color: var(--vp-c-text-1); box-shadow: 0 14px 44px rgb(24 31 56 / 12%); font-family: var(--vp-font-family-base); white-space: normal; scrollbar-width: thin; scroll-padding-block: 100px 16px; }
.kb-settings-header { position: sticky; top: 0; z-index: 2; display: flex; justify-content: space-between; gap: 10px; margin: -22px -22px 18px; padding: 18px 22px 14px; border-bottom: 1px solid var(--vp-c-divider); background: var(--kb-surface, var(--vp-c-bg)); }
.kb-settings-header h2 { margin: 0; font-size: 16px; line-height: 1.6; font-weight: 650; letter-spacing: -.02em; }
.kb-settings-header p { margin: 4px 0 0; color: var(--vp-c-text-2); font-size: 11px; line-height: 1.7; }
.kb-settings-close { display: grid; place-items: center; width: 28px; height: 28px; flex-shrink: 0; border-radius: 6px; color: var(--vp-c-text-2); cursor: pointer; }
.kb-settings-close:hover { color: var(--vp-c-text-1); background: var(--vp-c-bg-soft); }
.kb-settings-close svg { width: 18px; height: 18px; }
.kb-settings-fieldset { min-width: 0; margin: 0; padding: 0; border: 0; }
.kb-settings-fieldset legend { margin-bottom: 11px; padding: 0; color: var(--vp-c-text-2); font-size: 12px; font-weight: 500; line-height: 1.6; }
.kb-settings-visuals { margin-bottom: 20px; }
.kb-settings-visual-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 9px; }
.kb-settings-visual { position: relative; display: flex; min-width: 0; flex-direction: column; gap: 7px; padding: 5px 5px 8px; border: 1px solid var(--vp-c-divider); border-radius: 9px; color: var(--vp-c-text-2); cursor: pointer; }
.kb-settings-visual:hover { border-color: var(--vp-c-brand-2); }
.kb-settings-visual:has(input:checked) { border-color: var(--vp-c-brand-1); box-shadow: 0 0 0 1px var(--vp-c-brand-1); background: var(--vp-c-brand-soft); }
.kb-settings-visual strong { font-size: 12px; line-height: 1.5; font-weight: 600; text-align: center; color: var(--vp-c-text-1); }
.kb-settings-visual-description { font-size: 10px; line-height: 1.55; text-align: center; text-wrap: balance; }
.kb-settings-preview { position: relative; display: block; height: 66px; padding: 8px; overflow: hidden; border: 1px solid #dfe3ef; border-radius: 5px; background: #f4f5fb; }
.kb-settings-preview-nav { display: block; width: 100%; height: 3px; margin-bottom: 8px; border-radius: 2px; background: #c7cde4; }
.kb-settings-preview-title { display: block; width: 60%; height: 5px; margin-bottom: 4px; border-radius: 2px; background: #6976bf; }
.kb-settings-preview-line { display: block; width: 82%; height: 2px; border-radius: 2px; background: #d3d7e7; }
.kb-settings-preview-cards { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 3px; margin-top: 7px; }
.kb-settings-preview-cards i { display: block; height: 16px; border: 1px solid #e1e4ef; border-radius: 3px; background: #fff; box-shadow: 0 1px 2px #252d5610; }
.kb-settings-preview-check { position: absolute; top: 3px; right: 3px; display: grid; width: 16px; height: 16px; place-items: center; border-radius: 50%; background: var(--vp-c-brand-1); color: var(--vp-c-bg); }
.kb-settings-preview-check svg { width: 13px; height: 13px; }
.kb-settings-visual-workspace .kb-settings-preview { display: grid; grid-template-columns: 19% 31% 1fr; padding: 0; background: #fff; }
.kb-settings-preview-sidebar,.kb-settings-preview-list,.kb-settings-preview-reader { display: block; min-width: 0; padding: 9px 4px; }
.kb-settings-preview-sidebar { border-right: 1px solid #e1e4ef; background: #f0f2f8; }
.kb-settings-preview-list { border-right: 1px solid #e1e4ef; background: #fafbfe; }
.kb-settings-preview-sidebar i { display: block; height: 3px; margin: 3px 0 8px; border-radius: 1px; background: #b8bfd9; }
.kb-settings-preview-sidebar i:first-child { background: #6976bf; }
.kb-settings-preview-list i { display: block; height: 10px; margin: 0 0 5px; border: 1px solid #e4e7f0; border-radius: 2px; background: #fff; }
.kb-settings-preview-list i:first-child { border-color: #a8b1dc; background: #e9ecf8; }
.kb-settings-preview-reader { padding: 12px 6px; }
.kb-settings-preview-reader i { display: block; width: 100%; height: 2px; margin: 0 0 5px; border-radius: 1px; background: #d7dbe8; }
.kb-settings-preview-reader i:first-child { width: 68%; height: 4px; margin-bottom: 9px; background: #6872a3; }
.kb-settings-preview-reader i:last-child { width: 68%; }
.kb-settings-colors { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 5px; }
.kb-settings-color { position: relative; display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 9px 1px 7px; border: 1px solid transparent; border-radius: 9px; color: var(--vp-c-text-2); font-size: 10px; line-height: 1.4; cursor: pointer; }
.kb-settings-color:hover { background: var(--vp-c-bg-soft); }
.kb-settings-color:has(input:checked) { border-color: var(--vp-c-brand-1); background: var(--vp-c-brand-soft); color: var(--vp-c-brand-1); }
.kb-settings-panel input[type="radio"] { position: absolute; width: 1px; height: 1px; margin: -1px; opacity: 0; }
.kb-settings-swatch { display: grid; place-items: center; width: 24px; height: 24px; border-radius: 50%; }
.kb-settings-swatch svg { width: 15px; height: 15px; }
.kb-settings-reading-title { margin: 22px 0 17px; padding-top: 19px; border-top: 1px solid var(--vp-c-divider); color: var(--vp-c-text-2); font-size: 11px; font-weight: 600; letter-spacing: .07em; }
.kb-settings-row { display: grid; grid-template-columns: 40px minmax(0, 1fr); align-items: center; gap: 12px; margin-top: 12px; }
.kb-settings-row legend { float: left; margin: 0; }
.kb-settings-choices { display: flex; gap: 3px; min-width: 0; padding: 3px; border: 1px solid var(--vp-c-divider); border-radius: 8px; background: var(--vp-c-bg-soft); }
.kb-settings-choice { position: relative; display: grid; flex: 1; place-items: center; min-width: 0; min-height: 32px; padding: 5px 7px; border: 1px solid transparent; border-radius: 5px; color: var(--vp-c-text-2); font-size: 12px; line-height: 1.6; cursor: pointer; }
.kb-settings-choice:hover { color: var(--vp-c-brand-1); }
.kb-settings-choice:has(input:checked) { border-color: var(--vp-c-divider); background: var(--kb-surface, var(--vp-c-bg)); color: var(--vp-c-brand-1); }
.kb-settings-choice small { margin-left: 2px; font-size: 10px; opacity: .75; }
.kb-settings-width-note { margin: 7px 0 16px 52px; color: var(--vp-c-text-3); font-size: 10px; line-height: 1.6; }
.kb-settings-footer { display: flex; align-items: center; justify-content: space-between; gap: 10px; margin-top: 23px; padding-top: 16px; border-top: 1px solid var(--vp-c-divider); color: var(--vp-c-text-3); font-size: 10px; }
.kb-settings-footer button { padding: 4px 0 4px 8px; color: var(--vp-c-text-2); font: inherit; font-size: 11px; cursor: pointer; }
.kb-settings-footer button:hover { color: var(--vp-c-brand-1); }
.kb-settings-panel :where(button):focus-visible,.kb-settings-trigger:focus-visible,.kb-settings-choice:has(input:focus-visible),.kb-settings-color:has(input:focus-visible),.kb-settings-visual:has(input:focus-visible) { outline: 2px solid var(--vp-c-brand-1); outline-offset: 3px; }
.kb-settings-pop-enter-active,.kb-settings-pop-leave-active { transition: opacity .14s ease, transform .14s ease; }
.kb-settings-pop-enter-from,.kb-settings-pop-leave-to { opacity: 0; transform: translateY(-5px); }
:global(.dark) .kb-settings-panel { box-shadow: 0 14px 44px rgb(0 0 0 / 28%); }
@media (min-width: 1280px) { .kb-settings-trigger-label { display: inline; } }
@media (max-width: 767px) { .kb-theme-settings { margin-left: 0; } .kb-settings-trigger { min-width: 38px; min-height: 38px; } .kb-settings-panel { padding: 20px; } .kb-settings-header { margin: -20px -20px 18px; padding: 16px 20px 13px; } .kb-settings-choice { min-height: 36px; } }
@media (max-height: 480px) { .kb-settings-header { margin-bottom: 12px; padding-top: 12px; padding-bottom: 10px; } .kb-settings-header p { display: none; } .kb-settings-visuals { margin-bottom: 15px; } .kb-settings-reading-title { margin-top: 17px; padding-top: 14px; } }
@media (prefers-reduced-motion: reduce) { .kb-settings-trigger,.kb-settings-pop-enter-active,.kb-settings-pop-leave-active { transition: none; } }
@media print { .kb-theme-settings,.kb-settings-panel { display: none !important; } }
</style>
