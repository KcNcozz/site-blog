# 知识库主题维护

这是基于 VitePress 默认主题扩展的本地主题：数据索引、Vue 组件和样式分别维护。文章仍使用原来的 Markdown、目录和 URL。

## 文件分层

- `index.ts`：主题入口，继承默认主题并组合首页、配色与文章工具。
- `KnowledgeLayout.vue`：通过默认主题插槽接入首页、导航配色和文章工具；首页由根目录 `index.md` 的 `knowledgeHome: true` 启用。
- `knowledge.data.ts`：构建时扫描 `src/**/*.md`，生成文章摘要、分类、字数与阅读时间；正文不会打包进首页索引。
- `components/KnowledgeHome.vue`：知识地图、专题卡片、笔记筛选、分页和推荐阅读。
- `components/KnowledgeIcon.vue`：本地图标，按专题名称选择。
- `components/HomeAccentToggle.vue`：五组主题色选择，兼容原有的 `vitepress-theme-accent` 本地存储。
- `components/DocReadingTools.vue`：文章面包屑、阅读统计和阅读偏好。
- `custom.css`：主题色、首页布局、基础样式与公共控件。
- `styles/reading.css`：文章卡片、排版、侧栏、移动端与打印样式。

## 新增和整理内容

把 Markdown 放入 `src/frontend`、`src/backend`、`src/AI`、`src/demo`、`src/web`、`src/other` 等目录，首页索引会自动更新。标题依次取 `frontmatter.title`、第一个一级标题、文件名；摘要优先使用 `frontmatter.description`。

文章可选添加元数据：

```yaml
---
title: 笔记标题
description: 一两句话介绍这篇笔记。
date: 2026-10-21
---
```

日期只使用文章明确填写的信息，不把本地文件修改时间当作发布日期。阅读时间是根据正文估算的，排除代码块。

新增一级专题时，更新 `knowledge.data.ts` 的 `TopicId` 和 `topicDefinitions`，同步首页的专题展示配置、`DocReadingTools.vue` 的分类名称，以及 `.vitepress/config.mts` 中需要的导航和侧边栏。链接交给 VitePress 的 `withBase` 处理，不在组件里硬编码 `/site-blog/`。

## 阅读偏好

根元素上的属性控制文章外观：

- `data-reading-style="card|plain"`：卡片或简约，默认卡片。
- `data-reading-width="normal|wide"`：标准或舒展，默认标准；移动端保留单列。
- `data-accent="sky|teal|amber|rose|purple"`：主题色，默认鸢尾蓝。

阅读与配色偏好保存在浏览器本地；存储被禁用时，当前页面仍可切换。深浅色模式继续使用 VitePress 自带开关。

## 本地运行与验证

```sh
pnpm install
pnpm dev
```

按终端地址打开 `/site-blog/`。检查首页、专题筛选、搜索、文章链接，以及长代码、宽表格、移动端、深浅色与键盘操作。

日常验证可单独输出，避免改动 GitHub Pages 的 `docs/` 发布文件：

```sh
pnpm exec vitepress build --outDir .vitepress/cache/theme-preview
```

此命令仅验证构建，交互预览继续使用 `pnpm dev`。VitePress 1.x 的 `preview` 不采用命令行 `outDir`，会预览配置中的 `docs/`，因此不用于这个临时目录。

正式生成发布内容使用 `pnpm build`，仍输出到 `docs/`。项目的 `deploy` 脚本还会提交并推送 Git，因此不用于普通预览验证。
