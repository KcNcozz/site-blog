/** Site content and feature switches. Keep this configuration JSON-serializable. */
export type TopicId = "frontend" | "backend" | "AI" | "demo" | "web" | "other" | "story";

export interface KnowledgeTopicDefinition {
  id: TopicId;
  label: string;
  description: string;
  icon: string;
  code: string;
  rootGroupLabel: string;
  /** Keys are the original directory names directly below src/<topic>/. */
  groupLabels: Record<string, string>;
}

const topics: KnowledgeTopicDefinition[] = [
  {
    id: "frontend", label: "前端开发", description: "从页面基础到框架与工程实践",
    icon: "frontend", code: "FRONTEND", rootGroupLabel: "综合笔记",
    groupLabels: { base: "基础知识", framework: "框架实践" },
  },
  {
    id: "backend", label: "后端开发", description: "服务端语言、数据库与部署运维",
    icon: "backend", code: "BACKEND", rootGroupLabel: "综合笔记",
    groupLabels: {
      Go: "Go", Java: "Java", Python: "Python", TS后端: "TypeScript 后端",
      中间件: "中间件", 面试资料: "面试资料",
    },
  },
  {
    id: "AI", label: "AI 探索", description: "大模型、RAG 与 Agent 学习笔记",
    icon: "AI", code: "AI & LLM", rootGroupLabel: "工具与方法",
    groupLabels: { Langchain: "LangChain" },
  },
  {
    id: "demo", label: "项目实践", description: "把知识串联起来的项目记录",
    icon: "demo", code: "PROJECTS", rootGroupLabel: "项目总结", groupLabels: {},
  },
  {
    id: "web", label: "知识手册", description: "开发中常用的方法与问题整理",
    icon: "web", code: "HANDBOOK", rootGroupLabel: "开发手册", groupLabels: {},
  },
  {
    id: "other", label: "生活记录", description: "学习日志、工具使用与日常积累",
    icon: "other", code: "LIFE & NOTES", rootGroupLabel: "日常记录",
    groupLabels: { jianji: "剪辑技巧" },
  },
  {
    id: "story", label: "随笔故事", description: "技术之外的阅读与思考",
    icon: "story", code: "THOUGHTS", rootGroupLabel: "随笔", groupLabels: {},
  },
];

export const knowledgeConfig = {
  site: {
    name: "加菲猫",
    title: "加菲猫的知识库",
    description: "前端、后端与 AI 学习笔记，开发实践与日常记录。",
    aboutUrl: "/简介.html",
  },
  modules: {
    hero: true,
    knowledgeMap: true,
    stats: true,
    topics: true,
    notes: true,
    about: true,
    starters: true,
    asideNote: true,
    closing: true,
    recentReading: true,
    readingProgress: true,
    relatedArticles: true,
    series: true,
  },
  topics,
  starters: [
    { url: "/src/frontend/base/html.html", label: "从 HTML 开始" },
    { url: "/src/backend/Go/go基础.html", label: "Go 语言基础" },
    { url: "/src/AI/Langchain/RAG.html", label: "认识 RAG" },
    { url: "/src/web/git.html", label: "Git 常用操作" },
  ],
  home: {
    hero: {
      eyebrow: "加菲猫的知识库 · LEARN, BUILD, KEEP",
      titleLines: ["学过的，", "慢慢成为"],
      accent: "自己的。",
      description: "记录前端、后端与 AI 的学习过程，\n把零散的笔记，整理成可以反复查阅的知识。",
      primaryLabel: "探索知识库",
      secondaryLabel: "关于本站",
    },
    index: {
      title: "知识地图",
      eyebrow: "THE KNOWLEDGE INDEX",
      footer: "在记录中积累，在实践中连接。",
      limit: 3,
    },
    stats: {
      articleLabel: "篇学习笔记", topicLabel: "个知识板块", wordLabel: "字笔记内容",
      note: "持续学习，逐步完善",
    },
    topics: {
      title: "按主题探索", description: "从基础概念到项目实践，找到你想了解的部分。",
      eyebrow: "EXPLORE BY TOPIC",
    },
    notes: {
      title: "笔记索引", description: "按主题浏览，或用关键词找一篇笔记。",
      eyebrow: "THE NOTEBOOK", searchPlaceholder: "筛选笔记标题与摘要…",
      searchLabel: "筛选笔记标题与摘要", allLabel: "全部笔记", groupAllLabel: "全部分组",
      emptyText: "还没有找到匹配的笔记，换个关键词试试。",
      resetLabel: "查看全部笔记", loadMoreLabel: "继续浏览", pageSize: 6,
    },
    about: {
      eyebrow: "ABOUT THIS SPACE", title: "学习，创作，记录。",
      description: "这里收藏学习新技术的过程、开发中遇到的问题，以及值得留下的日常。笔记会随着理解不断完善。",
      linkLabel: "认识这个小站",
    },
    starters: { eyebrow: "A PLACE TO START", title: "不妨从这里开始" },
    recent: {
      eyebrow: "PICK UP WHERE YOU LEFT OFF", title: "继续阅读",
      emptyText: "读过的笔记会留在这里，方便下次接着看。", clearLabel: "清除记录",
    },
    note: { lines: ["不急于一次掌握所有知识。", "留下一篇笔记，向前走一步。"] },
    closing: {
      text: "把学到的留下来，让下一次查阅更轻松。", signature: "BUILT ONE NOTE AT A TIME.",
    },
  },
};

export type KnowledgeConfig = typeof knowledgeConfig;
export default knowledgeConfig;
