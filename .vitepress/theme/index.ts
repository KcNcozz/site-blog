import DefaultTheme from "vitepress/theme";
import type { Theme } from "vitepress";
import KnowledgeLayout from "./KnowledgeLayout.vue";
import "./custom.css";
import "./styles/reading.css";
import "./styles/workspace.css";

export default {
  extends: DefaultTheme,
  Layout: KnowledgeLayout,
} satisfies Theme;
