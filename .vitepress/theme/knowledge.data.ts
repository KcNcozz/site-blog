import { createContentLoader } from "vitepress";
import { knowledgeConfig, type TopicId } from "./knowledge.config";

export type { TopicId } from "./knowledge.config";

export interface KnowledgeArticle {
  title: string;
  /** VitePress page URL, without the deployment base. */
  url: string;
  category: TopicId;
  categoryLabel: string;
  /** Stable within the original directory tree, e.g. frontend/base or web/_root. */
  groupId: string;
  groupLabel: string;
  summary: string;
  wordCount: number;
  readingMinutes: number;
  date?: string;
  lastUpdated?: string;
}

export interface KnowledgeGroup {
  id: string;
  label: string;
  count: number;
}

export interface KnowledgeTopic {
  id: TopicId;
  label: string;
  description: string;
  icon: string;
  code: string;
  groups: KnowledgeGroup[];
  /** First article in this topic; no generated directory route is assumed. */
  url: string;
  count: number;
  wordCount: number;
}

export interface KnowledgeData {
  articles: KnowledgeArticle[];
  topics: KnowledgeTopic[];
  totalArticles: number;
  totalWords: number;
}

export declare const data: KnowledgeData;

const topicDefinitions = knowledgeConfig.topics;

const htmlEntities: Record<string, string> = {
  "&nbsp;": " ", "&amp;": "&", "&lt;": "<", "&gt;": ">", "&quot;": '"', "&apos;": "'",
};

function withoutCodeAndFrontmatter(source: string): string {
  const body = source
    .replace(/^\uFEFF/, "")
    .replace(/^---\s*\r?\n[\s\S]*?\r?\n(?:---|\.\.\.)\s*(?:\r?\n|$)/, "")
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<(script|style|template)\b[^>]*>[\s\S]*?<\/\1\s*>/gi, "");

  // A line walk also handles unclosed fences without leaking code into excerpts.
  let fence: { marker: string; length: number } | undefined;
  return body.split(/\r?\n/).filter((line) => {
    const match = line.match(/^\s{0,3}(`{3,}|~{3,})/);
    if (fence) {
      if (match && match[1][0] === fence.marker && match[1].length >= fence.length
        && !line.slice(match[0].length).trim()) fence = undefined;
      return false;
    }
    if (match) {
      fence = { marker: match[1][0], length: match[1].length };
      return false;
    }
    return !/^(?: {4}|\t)/.test(line) || /^\s*(?:[-+*]|\d+[.)])\s/.test(line);
  }).join("\n");
}

function plainText(markdown: string): string {
  // Keep technical names (including `<tag>` and underscores) inside inline code.
  // Placeholders protect them while the surrounding Markdown and HTML are cleaned.
  const inlineCode: string[] = [];
  return markdown
    .replace(/(`+)([\s\S]*?)\1/g, (_match, _ticks, content: string) => {
      inlineCode.push(content.replace(/\s+/g, " ").trim());
      return `\u0000code${inlineCode.length - 1}\u0000`;
    })
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/!\[[^\]]*\]\[[^\]]*\]/g, "")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/\[([^\]]+)\]\[[^\]]*\]/g, "$1")
    .replace(/^\s*\[[^\]]+\]:.*$/gm, "")
    .replace(/<[^>]*>/g, "")
    .replace(/\{\{[\s\S]*?\}\}/g, "")
    .replace(/^\s*:::[^\n]*$/gm, "")
    .replace(/^[ \t]*\|?[ \t]*:?-{3,}:?[ \t]*(?:\|[ \t]*:?-{3,}:?[ \t]*)*\|?[ \t]*$/gm, "")
    .replace(/^\s*(?:#{1,6}\s+|>\s*|[-+*]\s+|\d+[.)]\s+)/gm, "")
    .replace(/\{#[^}]+\}/g, "")
    .replace(/^\s*[-|:]{3,}\s*$/gm, "")
    .replace(/[*_~|]/g, " ")
    .replace(/\\([\\`*{}\[\]()#+.!_-])/g, "$1")
    .replace(/&(?:nbsp|amp|lt|gt|quot|apos);/g, (entity) => htmlEntities[entity] ?? " ")
    .replace(/\u0000code(\d+)\u0000/g, (_match, index: string) => inlineCode[Number(index)] ?? "")
    .replace(/https?:\/\/[^\s<>"'`\])}，。；！？、）】]+/gi, "")
    .replace(/\s+/g, " ")
    .trim();
}

function readablePath(url: string): string {
  try {
    return decodeURIComponent(url);
  } catch {
    return url;
  }
}

function shorten(text: string, limit = 108): string {
  const characters = Array.from(text);
  return characters.length > limit ? `${characters.slice(0, limit).join("").trimEnd()}…` : text;
}

function realDate(value: unknown): string | undefined {
  // Config booleans (e.g. lastUpdated: true) and file mtimes are not article dates.
  if (value instanceof Date && !Number.isNaN(value.getTime())) return value.toISOString();
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}(?:$|[T\s])/.test(value)) return;
  return Number.isNaN(Date.parse(value)) ? undefined : value;
}

export default createContentLoader<KnowledgeData>("src/**/*.md", {
  includeSrc: true,
  transform(pages): KnowledgeData {
    const articles: KnowledgeArticle[] = pages.map((page) => {
      const body = withoutCodeAndFrontmatter(page.src ?? "");
      const text = plainText(body);
      const path = readablePath(page.url);
      const category = topicDefinitions.find((topic) => path.startsWith(`/src/${topic.id}/`))
        ?? topicDefinitions.find((topic) => topic.id === "other")!;
      const pathParts = path.split("/").filter(Boolean);
      const groupDirectory = pathParts.length > 3 ? pathParts[2] : "";
      const groupId = `${category.id}/${groupDirectory || "_root"}`;
      const groupLabel = groupDirectory
        ? category.groupLabels[groupDirectory] ?? groupDirectory : category.rootGroupLabel;
      const firstHeading = body.match(/^#\s+(.+?)\s*#*\s*$/m)?.[1];
      const filename = path.split("/").filter(Boolean).pop()?.replace(/\.(?:html|md)$/, "") ?? "未命名笔记";
      const title = plainText(typeof page.frontmatter.title === "string" ? page.frontmatter.title : "")
        || plainText(firstHeading ?? "") || filename;
      const prose = plainText(body.replace(/^#{1,6}\s+.*$/gm, ""));
      const description = typeof page.frontmatter.description === "string"
        ? plainText(page.frontmatter.description) : "";
      const cjkCount = (text.match(/[\u3400-\u9fff\uf900-\ufaff]/g) ?? []).length;
      const otherWords = (text.replace(/[\u3400-\u9fff\uf900-\ufaff]/g, " ")
        .match(/[\p{L}\p{N}]+(?:['’-][\p{L}\p{N}]+)*/gu) ?? []).length;
      const date = realDate(page.frontmatter.date);
      const lastUpdated = realDate(page.frontmatter.lastUpdated);

      return {
        title,
        url: page.url,
        category: category.id,
        categoryLabel: category.label,
        groupId,
        groupLabel,
        summary: shorten(description || prose) || "这篇笔记还在整理中，打开查看完整内容。",
        wordCount: cjkCount + otherWords,
        readingMinutes: Math.max(1, Math.ceil(cjkCount / 400 + otherWords / 200)),
        ...(date ? { date } : {}),
        ...(lastUpdated ? { lastUpdated } : {}),
      };
    }).sort((a, b) => {
      const topicOrder = topicDefinitions.findIndex((topic) => topic.id === a.category)
        - topicDefinitions.findIndex((topic) => topic.id === b.category);
      return topicOrder || a.title.localeCompare(b.title, "zh-CN") || a.url.localeCompare(b.url);
    });

    const topics = topicDefinitions.map((topic) => {
      const entries = articles.filter((article) => article.category === topic.id);
      const groupMap = new Map<string, KnowledgeGroup>();
      for (const article of entries) {
        const group = groupMap.get(article.groupId);
        if (group) group.count++;
        else groupMap.set(article.groupId, { id: article.groupId, label: article.groupLabel, count: 1 });
      }
      const groupOrder = ["_root", ...Object.keys(topic.groupLabels)].map((directory) => `${topic.id}/${directory}`);
      const rank = (id: string) => {
        const index = groupOrder.indexOf(id);
        return index < 0 ? groupOrder.length : index;
      };
      return {
        id: topic.id,
        label: topic.label,
        description: topic.description,
        icon: topic.icon,
        code: topic.code,
        groups: [...groupMap.values()].sort((a, b) => rank(a.id) - rank(b.id) || a.label.localeCompare(b.label, "zh-CN")),
        url: entries[0]?.url ?? "",
        count: entries.length,
        wordCount: entries.reduce((total, article) => total + article.wordCount, 0),
      };
    }).filter((topic) => topic.count > 0);

    // Only this compact object is serialized. Raw Markdown stays in the build process.
    return {
      articles,
      topics,
      totalArticles: articles.length,
      totalWords: articles.reduce((total, article) => total + article.wordCount, 0),
    };
  },
});
