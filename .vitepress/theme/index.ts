import DefaultTheme from "vitepress/theme";
import { h } from "vue";
import HomeAccentToggle from "./components/HomeAccentToggle.vue";
import "./custom.css";

export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      "nav-bar-content-after": () => h(HomeAccentToggle),
    });
  },
};
