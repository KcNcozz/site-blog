import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "加菲猫的博客",
  lastUpdated: true,
  head: [["link", { rel: "icon", href: "favicon.ico" }]], // 修改图标
  markdown: {
    lineNumbers: true,
    image: {
      lazyLoading: true, // 默认禁用；设置为 true 可为所有图片启用懒加载。
    },
  },

  description: "记录自己的学习过程",
  base: "/site-blog/",
  outDir: "docs", // 修改构建输出目录
  themeConfig: {
    logo: "logo.png", // 修改logo
    search: {
      provider: "local",
    },
    siteTitle: "加菲猫",
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: "主页", link: "/" },
      {
        text: "知识库",
        items: [{ text: "前端", link: "/src/frontend/base/html.md" }],
      },
      { text: "随记", link: "/src/other/2026年的碎碎念.md" },
    ],

    sidebar: [
      {
        text: "前端",
        items: [
          {
            text: "前端三件套",
            items: [
              {
                text: "HTML",
                link: "/src/frontend/base/html.md",
              },
              {
                text: "CSS",
                link: "/src/frontend/base/css.md",
              },
              {
                text: "JavaScript",
                link: "/src/frontend/base/javascript.md",
              },
            ],
          },
          {
            text: "AJAX",
            link: "/src/frontend/ajax.md",
          },
          {
            text: "Vite",
            link: "/src/frontend/vite.md",
          },
          {
            text: "TypeScript",
            link: "/src/frontend/typescript.md",
          },
          {
            text: "Vue3",
            link: "/src/frontend/vue3.md",
          },
          {
            text: "Vue3-review",
            link: "/src/frontend/vue3-review.md",
          },
          {
            text: "nodejs",
            link: "/src/frontend/nodejs.md",
          },
        ],
      },
      {
        text: "后端",
        items: [
          // {
          //   text: "Java",
          //   items: [
          //     { text: "JavaSE", link: "/src/backend/Java/JavaSE.md" },
          //     { text: "JavaWeb", link: "/src/backend/Java/JavaWeb.md" },
          //     { text: "SpringSSM", link: "/src/backend/Java/SpringSSM.md" },
          //     { text: "Springboot", link: "/src/backend/Java/Springboot.md" },
          //     { text: "SpringCloud", link: "/src/backend/Java/SpringCloud.md" },
          //   ],
          // },
          {
            text: "中间件",
            items: [{ text: "Docker", link: "/src/backend/中间件/docker.md" }],
          },
        ],
      },
      {
        text: "小知识",
        items: [
          { text: "Git", link: "/src/web/git.md" },
          { text: "EventLoop", link: "/src/web/EventLoop.md" },
          { text: "小知识总结", link: "/src/web/小知识总结.md" },
        ],
      },
      {
        text: "剪辑",
        items: [
          // { text: "剪映", link: "/src/jianji/剪映.md" },
          // { text: "达芬奇", link: "/src/jianji/达芬奇.md" },
          { text: "测试页面", link: "/src/jianji/测试页面.md" },
        ],
      },
      {
        text: "碎碎念",
        items: [
          {
            text: "一些需要记录的东西",
            // link: "/src/other/装机注意事项.md",
            items: [
              { text: "装机注意事项", link: "/src/other/装机注意事项.md" },
              { text: "电影清单", link: "/src/other/电影清单.md" },
            ],
          },
          { text: "2026年的碎碎念", link: "/src/other/2026年的碎碎念.md" },
        ],
      },
    ],
    footer: {
      message: "Released under the MIT License.",
      copyright: "Copyright © 2026-present Xiaoai Student",
    },
    socialLinks: [{ icon: "github", link: "https://github.com/KcNcozz" }],
  },
});
