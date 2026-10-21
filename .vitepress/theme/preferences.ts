import { onBeforeUnmount, onMounted, reactive, readonly } from "vue";

export const themeAccents = [
  { key: "sky", preview: "#515fbc", title: "鸢尾蓝" },
  { key: "teal", preview: "#177e76", title: "松石绿" },
  { key: "amber", preview: "#a46612", title: "琥珀" },
  { key: "rose", preview: "#ba4565", title: "蔷薇" },
  { key: "purple", preview: "#8550b5", title: "藤紫" },
] as const;

export const visualStyles = [
  { key: "current", title: "现有布局", description: "介绍首页与专题卡片" },
  { key: "workspace", title: "知识工作台", description: "左侧目录、笔记浏览、分栏阅读" },
] as const;

export interface ThemePreferences {
  visualStyle: (typeof visualStyles)[number]["key"];
  accent: (typeof themeAccents)[number]["key"];
  readingStyle: "card" | "plain";
  readingWidth: "normal" | "wide";
  fontSize: 16 | 18 | 20;
  lineHeight: "compact" | "normal" | "relaxed";
}

export const themePreferenceDefaults: Readonly<ThemePreferences> = Object.freeze({
  visualStyle: "current",
  accent: "sky",
  readingStyle: "card",
  readingWidth: "normal",
  fontSize: 16,
  lineHeight: "normal",
});

const definitions = {
  visualStyle: { storageKey: "knowledge-visual-style", attribute: "data-visual-style", values: visualStyles.map((item) => item.key) },
  accent: { storageKey: "vitepress-theme-accent", attribute: "data-accent", values: themeAccents.map((item) => item.key) },
  readingStyle: { storageKey: "knowledge-reading-style", attribute: "data-reading-style", values: ["card", "plain"] },
  readingWidth: { storageKey: "knowledge-reading-width", attribute: "data-reading-width", values: ["normal", "wide"] },
  fontSize: { storageKey: "knowledge-reading-font-size", attribute: "data-reading-font-size", values: [16, 18, 20] },
  lineHeight: { storageKey: "knowledge-reading-line-height", attribute: "data-reading-line-height", values: ["compact", "normal", "relaxed"] },
} as const;

type PreferenceKey = keyof ThemePreferences;
const preferenceKeys = Object.keys(definitions) as PreferenceKey[];

// Used by config.mts before first paint; generated from the same validated options.
const restoreOptions = preferenceKeys.map((key) => ({
  ...definitions[key],
  initial: themePreferenceDefaults[key],
}));
export const preferenceRestoreScript = `(function(){var root=document.documentElement,options=${JSON.stringify(restoreOptions)};options.forEach(function(option){var saved;try{saved=localStorage.getItem(option.storageKey)}catch(e){}var value=option.values.find(function(value){return String(value)===saved});root.setAttribute(option.attribute,String(value===undefined?option.initial:value))})})();`;

const preferences = reactive<ThemePreferences>({ ...themePreferenceDefaults });
const publicPreferences = readonly(preferences);
let connectedConsumers = 0;

function validValue<K extends PreferenceKey>(key: K, value: unknown): ThemePreferences[K] {
  const choices: readonly (string | number)[] = definitions[key].values;
  return (choices.find((choice) => String(choice) === String(value))
    ?? themePreferenceDefaults[key]) as ThemePreferences[K];
}

function applyPreferences() {
  if (typeof document === "undefined") return;
  for (const key of preferenceKeys) {
    document.documentElement.setAttribute(definitions[key].attribute, String(preferences[key]));
  }
}

function restorePreferences() {
  if (typeof window === "undefined") return;
  for (const key of preferenceKeys) {
    const definition = definitions[key];
    let value: unknown;
    try {
      value = localStorage.getItem(definition.storageKey);
    } catch {
      // The head script may have restored attributes even if storage is blocked now.
      value = document.documentElement.getAttribute(definition.attribute);
    }
    Object.assign(preferences, { [key]: validValue(key, value) });
  }
  applyPreferences();
}

export function setThemePreference<K extends PreferenceKey>(key: K, value: ThemePreferences[K]) {
  if (typeof window === "undefined") return;
  const nextValue = validValue(key, value);
  Object.assign(preferences, { [key]: nextValue });
  applyPreferences();
  try {
    localStorage.setItem(definitions[key].storageKey, String(nextValue));
  } catch {
    // The current session still works when browser storage is disabled or full.
  }
}

export function resetThemePreferences() {
  if (typeof window === "undefined") return;
  Object.assign(preferences, themePreferenceDefaults);
  applyPreferences();
  for (const key of preferenceKeys) {
    try {
      localStorage.removeItem(definitions[key].storageKey);
    } catch {
      // Resetting the in-memory settings does not depend on persistent storage.
    }
  }
}

function onStorage(event: StorageEvent) {
  if (event.key === null || preferenceKeys.some((key) => definitions[key].storageKey === event.key)) {
    restorePreferences();
  }
}

/** Restore only on the client, with one listener shared by all mounted consumers. */
export function initializeThemePreferences() {
  if (typeof window === "undefined") return () => {};
  if (connectedConsumers++ === 0) {
    restorePreferences();
    window.addEventListener("storage", onStorage);
  }
  let connected = true;
  return () => {
    if (!connected) return;
    connected = false;
    if (--connectedConsumers === 0) window.removeEventListener("storage", onStorage);
  };
}

export function useThemePreferences() {
  let disconnect: (() => void) | undefined;
  onMounted(() => { disconnect = initializeThemePreferences(); });
  onBeforeUnmount(() => { disconnect?.(); });
  return {
    preferences: publicPreferences,
    setPreference: setThemePreference,
    resetPreferences: resetThemePreferences,
  };
}
