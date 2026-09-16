# MCP 说明文档

> 面向已有 TypeScript 全栈基础的开发者。本文使用当前 TypeScript MCP SDK 的推荐思路：`@modelcontextprotocol/server`、`registerTool`、`z.object()` 与 `serveStdio`。

## 1. 一句话理解 MCP

**MCP（Model Context Protocol）不是某一个工具，而是一套让 AI 应用发现、调用外部能力的标准协议。**

可以先把它理解为：

```text
我写一个 MCP Server，就是在给 Codex、Claude Desktop、Cursor 等 AI 应用增加一组可调用工具。
```

MCP 的价值不在于让工具本身更强，而在于让工具可以按照同一套标准被不同 AI 客户端连接和调用。

## 2. MCP 中的角色

```text
用户
  ↓
Host（Codex / Claude Desktop / Cursor 等）
  ↓
MCP Client
  ↓  协议通信：tools/list、tools/call 等
MCP Server
  ↓
Tool / Resource / Prompt
  ↓
外部 API、数据库、文件、Git、业务系统
```

| 名称 | 职责 | 示例 |
| --- | --- | --- |
| Host | 提供聊天界面、模型和 MCP 管理能力 | Codex、Claude Desktop、Cursor |
| MCP Client | 连接 Server、发现工具、调用工具、接收结果 | Host 内部的 MCP 客户端 |
| MCP Server | 暴露工具并处理业务逻辑 | 自己写的 MCP 服务 |
| Tool | 一个可被模型调用的具体能力 | `search_tv_shows`、`get_show_detail` |
| Resource | 可供模型读取的上下文内容 | 文档、只读配置、知识库内容 |
| Prompt | 可复用的提示词模板 | “根据节目数据生成推荐” |

注意：通常不是 LLM 自己直接联网调用 Server。模型产生“想调用哪个工具、传什么参数”的意图，Host 内的 MCP Client 再负责真正的协议通信。

## 3. 一次工具调用发生了什么

以 `add` 工具为例：

```text
用户：帮我计算 3 + 5
  ↓
模型决定需要使用 add 工具
  ↓
MCP Client 调用 add({ a: 3, b: 5 })
  ↓
MCP Server 用 Zod 校验参数
  ↓
工具处理函数执行 a + b
  ↓
Server 返回结果
  ↓
Client 将结果交回模型
  ↓
模型回复：3 + 5 = 8
```

## 4. 当前 TypeScript 推荐写法

新项目推荐安装：

```bash
npm install @modelcontextprotocol/server zod@^4.2.0
npm install -D tsx
```

`package.json` 需要是 ESM：

```json
{
  "type": "module"
}
```

一个最小但完整的 stdio MCP Server：

```ts
import { McpServer } from "@modelcontextprotocol/server";
import { serveStdio } from "@modelcontextprotocol/server/stdio";
import * as z from "zod/v4";

function createServer(): McpServer {
  const server = new McpServer({
    name: "demo-server",
    version: "1.0.0",
  });

  server.registerTool(
    "add",
    {
      title: "两数相加",
      description: "将两个数字相加并返回结果。",
      inputSchema: z.object({
        a: z.number().describe("第一个数字"),
        b: z.number().describe("第二个数字"),
      }),
      outputSchema: z.object({
        result: z.number().describe("两个数字相加后的结果"),
      }),
    },
    async ({ a, b }) => {
      const output = { result: a + b };

      return {
        content: [
          {
            type: "text",
            text: `${a} + ${b} = ${output.result}`,
          },
        ],
        structuredContent: output,
      };
    },
  );

  return server;
}

void serveStdio(createServer);
console.error("demo MCP server running on stdio");
```

运行：

```bash
npx tsx src/index.ts
```

## 5. 旧写法与新写法

| 旧写法 | 当前推荐写法 | 原因 |
| --- | --- | --- |
| `@modelcontextprotocol/sdk` | `@modelcontextprotocol/server` | 新项目使用拆分后的 v2 包 |
| `server.tool(...)` | `server.registerTool(...)` | 旧的可变参数 API 已弃用 |
| `{ a: z.number() }` | `z.object({ a: z.number() })` | 完整 Schema 是当前推荐形式 |
| 手动创建 stdio transport | `serveStdio(createServer)` | 新项目的简洁 stdio 启动方式 |

旧版示例：

```ts
server.tool(
  "add",
  "将两个数字相加",
  { a: z.number(), b: z.number() },
  handler,
);
```

新版示例：

```ts
server.registerTool(
  "add",
  {
    description: "将两个数字相加",
    inputSchema: z.object({
      a: z.number(),
      b: z.number(),
    }),
  },
  handler,
);
```

## 6. 为什么要使用 Zod

在 MCP 中，Zod 不只是 TypeScript 类型声明。一个 `inputSchema` 同时承担三件事：

1. 告诉模型工具需要哪些参数。
2. 在工具真正运行前校验输入。
3. 让 TypeScript 自动推导处理函数参数类型。

例如：

```ts
inputSchema: z.object({
  city: z.string().min(1).describe("城市名称"),
  days: z.number().int().min(1).max(7).describe("预测天数"),
})
```

如果模型传入不符合规则的参数，SDK 会在进入处理函数前拒绝该调用。

## 7. `content` 与 `structuredContent`

工具可以同时返回两种结果：

```ts
return {
  content: [
    { type: "text", text: "搜索到 3 个节目" },
  ],
  structuredContent: {
    total: 3,
    shows: [],
  },
};
```

| 字段 | 给谁使用 | 用途 |
| --- | --- | --- |
| `content` | 模型 | 可阅读的文本、图片、资源链接等内容 |
| `structuredContent` | 支持结构化结果的客户端或后续程序 | 稳定、可编程地读取数据 |

简单工具只返回 `content` 也可以。数据型工具推荐同时提供 `outputSchema` 和 `structuredContent`。

## 8. stdio 与 HTTP 的区别

| 传输方式 | 适合什么场景 | 特点 |
| --- | --- | --- |
| stdio | 本地开发、本地桌面客户端 | Host 启动你的 Node.js 进程，通过标准输入输出通信 |
| Streamable HTTP | 远程部署、多人使用、云服务 | MCP Server 以 HTTP 服务形式运行，客户端通过网络连接 |

学习顺序建议：先完成 stdio，再学习 HTTP。

stdio 的重要规则：

```text
stdout 是 MCP 的 JSON-RPC 协议通道。
```

因此不要使用：

```ts
console.log("server started");
```

应使用：

```ts
console.error("server started");
```

否则普通日志会污染协议输出，导致 Client 无法正确解析消息。

## 9. MCP 与 LangChain Tool 的关系

二者都会让模型调用工具，因此在“能力调用”这一层很像。

```text
LangChain Tool ≈ MCP Server 中的一个 Tool
```

但它们位于不同层级：

| 对比点 | LangChain Tool | MCP Tool |
| --- | --- | --- |
| 位置 | 通常是 LangChain 程序内的函数或对象 | 独立 MCP Server 对外暴露的能力 |
| 调用范围 | 主要供当前 LangChain 应用使用 | 所有兼容 MCP 的客户端均可连接 |
| 通信方式 | 常见情况是同进程函数调用 | stdio 或 HTTP 协议通信 |
| 框架依赖 | 依赖 LangChain | 不依赖 LangChain |
| 工具发现 | 由应用代码注册给 Agent | Client 可通过协议自动发现工具 |

可以使用这个类比：

```text
LangChain Tool = 当前代码库中的业务函数
MCP Tool       = 对 AI 客户端公开的标准化接口
MCP Server     = 承载这些接口的独立服务
```

它们不是互斥关系。LangChain 可以作为 MCP Client 去连接 MCP Server。

```text
LangChain Agent
  ↓
MCP Client
  ↓
自建 MCP Server
  ↓
外部 API 或业务系统
```

## 10. 什么时候选 LangChain Tool，什么时候选 MCP

| 场景 | 建议 |
| --- | --- |
| 工具只服务一个 LangChain Agent | 使用 LangChain Tool 即可 |
| 工具只在当前 Node.js 进程中运行 | 使用 LangChain Tool 更直接 |
| 想让 Codex、Claude Desktop、Cursor 都能使用 | 使用 MCP |
| 想把能力做成独立插件或服务 | 使用 MCP |
| 想让多个 AI 应用共用同一套能力 | 使用 MCP |
| 已有 LangChain Agent，但要接入外部标准化工具 | LangChain + MCP |

## 11. MCP Tool 设计原则

模型能否正确调用工具，很大程度取决于工具的名称、描述和参数设计。

一个好工具应当：

- 名称清晰，例如 `search_tv_shows`，不要叫 `doThing`。
- 描述清楚“做什么、什么时候用、返回什么”。
- 参数尽量少且明确。
- 使用 Zod 限制输入范围。
- 处理超时、第三方 API 失败和空结果。
- 明确是否有副作用，例如“删除”“发送”“写入”。
- 返回模型易读的摘要，同时返回可选的结构化数据。

不要把一个工具设计成无限权限的入口，例如：

```text
run_any_command(command)
read_any_file(path)
fetch_any_url(url)
```

更安全的方式是把范围收窄：

```text
read_project_doc(fileName)
get_order_by_id(orderId)
search_tv_shows(keyword)
```

## 12. MCP 安全基础

MCP Server 是 AI 到外部系统之间的边界，因此需要特别注意：

- 所有外部输入都必须校验，不只相信模型生成的参数。
- 不把 API Key、数据库密码写进源码或返回给模型。
- 密钥放到 `.env`，并确保 `.env` 不提交到 Git。
- 文件工具要限制根目录，防止路径穿越。
- 数据库工具应限制可执行的操作和可访问的数据范围。
- 有副作用的动作，如删除、付款、发消息，应要求明确确认或采用更严格的权限设计。
- 工具返回的第三方内容也应被当作不可信内容，避免让其影响系统指令或诱导执行危险操作。

## 13. 已有 TypeScript 全栈基础时，需要补什么

如果已经会 TypeScript、Node.js、React、数据库和普通 REST API，不需要从头学全栈。优先学习这些 MCP 专属内容：

1. MCP 的 Client、Server、Host、Tool、Resource、Prompt 概念。
2. `registerTool`、`inputSchema`、`outputSchema`、`content`、`structuredContent`。
3. stdio 与 Streamable HTTP 两种传输方式。
4. 工具发现、参数校验、异常返回和日志。
5. 工具权限边界、密钥管理和安全设计。
6. MCP Inspector 调试工具。
7. 远程 HTTP Server 的鉴权、部署、HTTPS 和可观测性。

不需要一开始学习的内容：

- 复杂多 Agent 编排。
- 自定义 MCP Client。
- OAuth 的完整细节。
- 数据库、队列、向量库等复杂基础设施。

这些都应当在本地 MCP Server 写稳定之后再补。

## 14. 推荐练习路线

### 第一阶段：理解协议

1. `add(a, b)`：确认 Server 能被 Client 调用。
2. `get_current_time()`：练习无参数工具。
3. `format_text(text, style)`：练习输入校验与结构化返回。

### 第二阶段：调用外部 API

1. `get_weather(city)`：练习查询参数、响应转换和空结果处理。
2. `get_exchange_rate(base, target)`：练习多个参数与数值结果。
3. `search_documents(keyword)`：练习列表型结果与分页。
4. `get_record_by_id(recordId)`：练习路径参数、404 与结构化错误。

工具名称应体现明确业务意图，例如：

```text
get_weather(city)
get_exchange_rate(base, target)
search_documents(keyword)
get_record_by_id(recordId)
```

### 第三阶段：工程化

1. 使用 `.env` 管理配置。
2. 给外部请求加超时和错误处理。
3. 使用 MCP Inspector 调试每个工具。
4. 为关键工具写测试。
5. 将 stdio Server 改造成远程 HTTP Server。
6. 再考虑收藏、登录、数据库或用户权限。

## 15. 最终总结

```text
Tool：具体能力，例如搜索节目
MCP Server：提供一组 Tool 的服务
MCP Client：连接并调用 Server 的一方
MCP：让 Client 与 Server 互通的标准协议
LangChain Tool：LangChain 框架内的工具抽象
```

最实用的理解是：

> MCP Server 是为 AI 客户端准备的后端适配层；它可以把现有 API、数据库、文件和业务能力，以安全、标准化、可发现的 Tool 形式提供给 AI 使用。

## 16. 官方资料

- [MCP TypeScript SDK：第一个 Server](https://github.com/modelcontextprotocol/typescript-sdk/blob/main/docs/get-started/first-server.md)
- [MCP TypeScript SDK：v2 升级说明](https://github.com/modelcontextprotocol/typescript-sdk/blob/main/docs/migration/upgrade-to-v2.md)
- [Model Context Protocol 官网](https://modelcontextprotocol.io/)
