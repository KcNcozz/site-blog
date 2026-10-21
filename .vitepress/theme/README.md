# 知识库主题维护

主题扩展 VitePress 默认主题，保留原 Markdown、文章 URL、侧边栏和 GitHub Pages 的 `/site-blog/` 部署路径。

## 配置入口

常用调整集中在 `knowledge.config.ts`：

- `site`：站点名称、标题、描述、关于页链接；站点配置和首页元信息直接使用它。
- `topics`：专题名称、描述、图标、英文标识、根目录分组名和子目录中文名称。
- `starters`：推荐阅读起点，使用不带部署 base 的完整文章 URL。
- `home`：首页各模块文案和每次显示的笔记数量。
- `modules`：首页各区块、最近阅读、文章进度、相关推荐、同系列目录开关。

关闭笔记索引后，专题卡片会直接进入该专题首篇文章。导航和文章侧边栏仍在 `.vitepress/config.mts` 维护。

## 文件分工

- `KnowledgeLayout.vue`：根据布局偏好组合现有布局或工作台，切换时保留文章阅读位置。
- `WorkspaceLayout.vue`：工作台的独立应用外壳、全文搜索、导航抽屉、阅读区和专注模式。
- `workspace.ts`：每个工作台实例的筛选状态、路由与 URL 同步。
- `components/WorkspaceSidebar.vue`、`WorkspaceBrowser.vue`、`WorkspaceAside.vue`：专题树、笔记浏览区和上下文辅助栏。
- `knowledge.data.ts`：构建时扫描 `src/**/*.md`，生成标题、摘要、字数、阅读时间与分组；不携带文章正文。
- `components/KnowledgeHome.vue`：专题、子目录、关键词筛选与逐步加载；筛选条件保存在 URL，可刷新和返回恢复。
- `components/ThemeSettings.vue`、`preferences.ts`：统一主题与阅读偏好，兼容原来的三项存储键。
- `components/DocReadingTools.vue`：面包屑、字数和估算阅读时间。
- `reading-history.ts`、`ReadingProgress.vue`、`RecentReading.vue`：记录与恢复进度，以及首页最近阅读。
- `RelatedArticles.vue`：优先推荐同子目录笔记，再补同专题；同系列目录默认收起。
- `custom.css`：配色、首页与基础样式；`styles/reading.css`：正文排版；`styles/reading-extras.css`：阅读附加组件。
- `styles/workspace.css`：工作台的独立布局、暗色、手机与打印样式，均按工作台作用域隔离。

## 内容与分组

文章放入配置中的 `src/<专题>/` 即可进入索引。一级子目录自动形成分组，例如 `src/frontend/base/` 对应 `frontend/base`；直属文章归该专题的根分组。分组名优先使用 `topics[].groupLabels`，未配置时显示目录名，空目录不展示。

新增专题时，在 `knowledge.config.ts` 添加专题及其 `TopicId`，并按需配置导航、侧边栏。图标使用 `KnowledgeIcon.vue` 内置名称，未知名称回退为笔记图标。链接由 `withBase` 添加部署路径。

标题依次取 `frontmatter.title`、第一个一级标题、文件名；摘要优先使用 `frontmatter.description`。可添加：

```yaml
---
title: 笔记标题
description: 一两句话介绍这篇笔记。
date: 2026-10-21
---
```

发布日期只使用明确填写的信息。字数与阅读时间基于正文估算，排除代码块。

## 阅读偏好与记录

导航栏的“设置 → 站点布局”提供两种布局：

- **现有布局**：默认布局，使用介绍型首页、专题卡片和 VitePress 文章导航。
- **知识工作台**：固定专题树、直接搜索与浏览笔记的首页、上下文辅助栏；文章采用统一的分栏阅读布局，可进入专注模式。手机使用带焦点循环的目录抽屉和单栏正文。

根属性 `data-visual-style="current|workspace"` 控制布局，选择保存在原来的 `knowledge-visual-style` 键中。旧的 `minimal/paper` 值会安全回退为现有布局。两种布局可即时切换，共用文章路径和 Markdown；首屏脚本会恢复选择，客户端挂载独立工作台。

布局与五组主题色、卡片或纯净正文、标准或宽幅、16/18/20px 字号和三档行距独立，切换布局不会重置其他阅读选择。宽幅在桌面收起右侧目录；手机保持单列。“恢复默认”会恢复全部主题与阅读选项。

工作台的全文搜索、文章目录和上下篇信息复用当前 VitePress 1.6.4 的默认主题组件，导入路径集中在 `WorkspaceLayout.vue`。升级 VitePress 时，应同时验证这些组件、首屏恢复和两种布局切换。工作台的专题、分组与关键词仍通过首页查询参数表达，适用于 GitHub Pages 静态部署。

偏好由 `preferences.ts` 统一验证，配置中的首屏脚本也由同一份定义生成。旧键 `vitepress-theme-accent`、`knowledge-reading-style`、`knowledge-reading-width` 继续有效；新增字号与行距键。设置仅影响当前浏览器，禁用存储时仍可在当前会话切换。

阅读历史存于 `knowledge-reading-history`，最多保存 5 篇，首页展示最近 3 篇。只有真实读者滚动才更新位置，切页初始化不会清空旧进度；再次打开文章后点击“继续上次阅读”恢复，优先按标题锚点与偏移定位。首页可清除历史。所有状态都在浏览器本地，无需服务端，可用于 GitHub Pages。

## 验证与发布

```sh
pnpm install
pnpm dev
pnpm exec vitepress build --outDir .vitepress/cache/theme-preview
```

开发地址带 `/site-blog/`。检查两种布局切换与刷新恢复、专题与关键词组合筛选及返回、全文搜索、文章锚点与续读、独立正文设置、专注模式、手机抽屉键盘与焦点、浅深色和窄屏宽度。临时构建输出到忽略目录，不改动 `docs/`。

VitePress 1.x 的 `preview` 不采用命令行 `outDir`，会预览配置的 `docs/`；交互验证使用开发服务。正式生成发布内容运行 `pnpm build`，仍输出到 `docs/`。现有 `deploy` 脚本还会提交并推送 Git，不用于普通验证。
