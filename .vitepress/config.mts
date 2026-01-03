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
        text: '碎碎念',
        items: [
          { text: '2026年的碎碎念', link: '/src/other/2026年的碎碎念.md' },
           { text: '装机注意事项', link: '/src/other/装机注意事项.md' },

        ]
      },
      {
        text: '前端',
        items: [


        ]
      },
      {
        text: '小知识',
        items: [
          { text: 'Git', link: '/src/web/git.md' },
          { text: 'SEO', link: '/src/web/seo.md' },

        ]
      },
      {
        text: '剪辑',
        items: [
          { text: '剪映', link: '/src/jianji/剪映.md' },
          { text: '达芬奇', link: '/src/jianji/达芬奇.md' },

        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/KcNco7' }
    ]
  }
})
