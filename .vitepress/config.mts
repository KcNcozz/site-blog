import { defineConfig } from 'vitepress'


// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "加菲猫的博客",
  description: "我是一只猫",
  base: "/site-blog/",
  outDir: "docs",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '主页', link: '/' },
      { text: '前端', link: '/src/web/seo.md' }
    ],

    sidebar: [
      {
        text: '前端',
        items: [
          { text: 'SEO', link: '/src/web/seo.md' },

        ]
      },
      {
        text: '后端',
        items: [
          { text: 'SEO', link: '/src/web/seo.md' },

        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ]
  }
})
