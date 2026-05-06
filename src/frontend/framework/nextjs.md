# Nestjs

## 创建项目

```bash
pnpm create next-app@latest my-app --yes
cd my-app
pnpm dev
```

## Turbopack

Turbopack 是一个`增量打包器`，用于取代 webpack,它是用Rust语言编写, 并且 Turbopack 转换js/ts使用的是SWC, 他比vite快10倍，比webpack快700倍，速度更快，性能更优。

选择Turbopack的原因

- 采用统一依赖图的关系搞定多环境, 避免拆分和拼接
- 惰性打包
- `增量计算`

## React Compiler

`React Compiler` 是Next.js 用于`自动优化组件渲染`来提高性能的工具，在之前的话，我们需要手动优化`useMemo` / `useCallbac`k /`memo`等，现在Next.js会自动优化，你只需要写代码即可, 减少心智负担。

## App Router 介绍

Next.js 有两套路由系统，一个是旧的`Pages Router`路由系统，一个是新的`App Router`路由系统。

推荐使用`App Router`路由系统。

`App Router`的路由系统是根据约定定义的, 读取数据直接在组件中使用`fetch`调用即可。

## 路由

### App Router 配置

在 Next.js 中，app 目录下的每个文件夹都代表一个路由段（route segment），并直接映射到 URL 路径。无需配置路由表，框架会根据您的文件结构自动处理。

### layout && template

`layout(布局)` 布局是多个页面共享UI，例如导航栏、侧边栏、底部等。

`template(模板)` 基本功能跟布局一样，只是不会保存状态。 同时`template` 中的 `useEffect` 也会去重新执行.

嵌套顺序: `layout` --> `template` --> `page`

### loading(加载)

Next.js的`loading`是借助了`Suspense`实现的，`Suspense`的具体用法请参考React的Suspense组件

### error(错误)

Next.js的`error`是借助了`Error Boundary`实现的。

```tsx
"use client"; //错误组件必须是客户端组件
export default function Error() {
  return (
    <div>
      <h1>Error</h1>
    </div>
  );
}
```

### not-found(404)

Next.js 默认会生成一个404页面，但我们可能自定义404页面，只需要在`app`目录下创建一个`not-found.tsx`文件即可

```tsx
export default function NotFound() {
  return (
    <div>
      <h1>404 Page</h1>
    </div>
  );
}
```

## 路由导航

路由导航是指我们在Next.js中跳转页面的方式，例如原始的`<a>`标签等。

在Next.js中，共有四种方式提供跳转:

- `Link` 组件
- `useRouter Hook` (客户端组件)
- `redirect` 函数 (服务端组件)
- `History API` (浏览器API 本文略过用的不多 了解即可)

### Link 组件

`<Link>` 是一个内置组件，在 `<a>` 的基础上扩展了功能，并且还能用来实现预获取(`prefetch` 预加载 默认开启 生产环境有效)，以及保持滚动位置(`scroll` 保持滚动位置), `replace`等。可以携带参数, 并使用useSearchParams获取参数

```tsx
import Link from "next/link"; //引入Link组件
export default function Home() {
  return (
    <div>
      <Link href="/about">跳转About页面</Link>
      <Link href={{ pathname: "/about", query: { name: "张三" } }}>
        跳转About并且传入参数
      </Link>
      <Link href="/page" prefetch={true}>
        预获取page页面
      </Link>
      <Link href="/xm" scroll={true}>
        保持滚动位置
      </Link>
      <Link href="/daman" replace={true}>
        替换当前页面
      </Link>
    </div>
  );
}
```

```ts
// 接收
"use client";
import { useSearchParams } from "next/navigation";

export default function About() {
  const searchParams = useSearchParams();
  const name = searchParams.get("name");
  const age = searchParams.getAll("age");
  console.log(name); // 张三
  console.log(age); // [1, 18]
}
```

### useRouter Hook (客户端组件)

`useRouter` 可以在代码中根据逻辑跳转页面，例如根据用户权限跳转不同的页面。

使用该hook需要在客户端组件中。需要在顶层编写 `'use client'` 声明这是客户端组件。

```tsx
"use client";
import { useRouter } from "next/navigation";
export default function Page() {
  const router = useRouter();
  return (
    <>
      <button onClick={() => router.push("/page")}>跳转page页面</button>
      <button onClick={() => router.replace("/page")}>替换当前页面</button>
      <button onClick={() => router.back()}>返回上一页</button>
      <button onClick={() => router.forward()}>跳转下一页</button>
      <button onClick={() => router.refresh()}>刷新当前页面</button>
      <button onClick={() => router.prefetch("/about")}>预获取about页面</button>
    </>
  );
}
```

### redirect 函数 (服务端组件)

```tsx
import { redirect, permanentRedirect } from "next/navigation";
export default async function Page() {
  const checkLogin = await checkLogin();
  //如果用户未登录，则跳转到登录页面
  if (!checkLogin) {
    redirect("/login"); // code 307 临时重定向
    permanentRedirect("/login"); // code 308 永久重定向
  }
  return (
    <div>
      <h1>Page</h1>
    </div>
  );
}
```

## 动态路由

动态路由是指在路由中使用方括号`[]`来定义路由参数，例如`/blog/[id]`，其中`[id]`就是动态路由参数，因为在某些需求下，我们需要根据不同的id来显示不同的页面内容，例如商品详情页，文章详情页等。

### 基本用法

使用动态路由只需要在文件夹名加上方括号`[]`即可，例如`[id]`, `[params]`等，名字可以自定义。

```tsx
//app/shop/[id]/page.tsx
"use client";
import { useParams } from "next/navigation";
export default function Page() {
  const { id } = useParams();
  console.log(id);
  return <div>Page</div>;
}
```

如果需要捕获多个路由参数，例如`/shop/123/456`，我们可以使用路由片段来捕获多个路由参数，他的用法就是`[...slug]`，其中slug就是路由片段，这个名字可以自定义，后面的片段有多少就捕获多少。

如果路由参数可能有也可能没有, 我们可以使用可选路由来捕获这个路由参数，他的用法就是`[[...slug]]`

:::info 总结

- [id] 捕获一个参数
- [...id] 捕获多个参数
- [[...id]] 捕获多个参数，参数可能没有

:::

## 平行路由

平行路由指的是在同一布局`layout.tsx`中，可以同时渲染多个页面，例如team，analytics等，这个东西跟vue的 `router-view` 类似。

![alt text](/assert/nextjs_image/eg.png)

### 基本用法

平行路由的使用方法就是通过`@ + 文件夹名来定义`，例如`@team`，`@analytics`等，名字可以自定义。

> 平行路由也不会影响`URL`路径。

定义完成之后，我们就可以在`layout.tsx`中使用`team`和`analytics`来渲染对应的页面，他会自动注入layout的`props`里面。

```tsx
export default function RootLayout({
  children,
  team,
  analytics,
}: {
  children: React.ReactNode;
  team: React.ReactNode;
  analytics: React.ReactNode;
}) {
  return (
    <html>
      <body>
        {team}
        {children}
        {analytics}
      </body>
    </html>
  );
}
```

### 独立路由

同时, 平行路由支持定义单独的`Error`, `Loading`, 以及子导航

> 注意: 子导航使用`Link`组件跳转setting页面时，是没有问题的，但是我们在跳转之后刷新页面，就出现404了

- `软导航` `Link` 组件跳转子页面的时候，这时候@analytics 和 children依然保持活跃，所以他只会替代@team里面的内容。
- 使用`硬导航`浏览器页面刷新,此时@analytics 和 children 已经失活，因为它的底层原理其实是同时匹配@team和@analytics，children 目录下面的setting 页面，但是只有@team 有这个页面，其他两个没有，所以导致404。

解决方案：使用`default.tsx`来进行兜底，确保不会`404`

## 路由组

路由组也是一种基于文件夹的`约定范式`，可以让我们开发者，按类别或者团队组织路由模块，并且不影响 `URL` 路径。

用法：只需要通过`(groupName)`包裹住文件夹名即可，例如(shop)，(user)等，名字可以自定义。

### 定义多个根布局

这种一般是大型项目使用的，例如我们需要把，`后台管理系统`和`前台的门户网站`，放到一个项目就可以使用这种方法实现。

使用方法：

1. 先把`app`目录下的`layout.tsx` 文件删除
2. 在每组的目录下创建`layout.tsx`文件，并且定义html, body标签(必须含有)。

## 路由处理程序

路由处理程序，可以让我们在Next.js中编写API接口，并且支持与客户端组件的交互。

### 文件结构

定义前端路由页面我们使用的`page.tsx`文件，而定义API接口我们使用的`route.ts`文件，并且他两都不受文件夹的限制，可以放在任何地方，只需要文件的名称以`route.ts`结尾即可。

> 注意：`page.tsx`文件和`route.ts`文件不能放在同一个文件夹下，否则会报错，所以最好把前后端代码分开。

我们可以定义一个`api`文件夹，然后在这个文件夹下创建一对应的模块例如`user` `login` `register`等。

### 定义请求

Next.js是遵循`RESTful API`的规范，所以我们可以使用HTTP方法来定义请求。

```ts
export async function GET(request) {}

export async function HEAD(request) {}

export async function POST(request) {}

export async function PUT(request) {}

export async function DELETE(request) {}

export async function PATCH(request) {}

//如果没有定义OPTIONS方法，则Next.js会自动实现OPTIONS方法
export async function OPTIONS(request) {}
```

> 注意: 我们在定义这些请求方法的时候不能修改方法名称而且必须是`大写`，否则无效。

### 定义GET请求

```ts
/**
 * NextRequest 接收前端发过来的参数
 * NextResponse 返回给前端的数据
 */
import { NextRequest, NextResponse } from "next/server";
export async function GET(request: NextRequest) {
  // http://localhost:3000/api/user?id=123
  const query = request.nextUrl.searchParams; //接受url中的参数 返回一个对象
  console.log(query.get("id")); // 终端输出 123
  return NextResponse.json({ message: "Get request successful" }); //返回json数据
}
```

### 定义POST请求

```ts
import { NextRequest, NextResponse } from "next/server";
export async function POST(request: NextRequest) {
  //const body = await request.formData(); //接受formData数据
  //const body = await request.text(); //接受text数据
  //const body = await request.arrayBuffer(); //接受arrayBuffer数据
  //const body = await request.blob(); //接受blob数据
  const body = await request.json(); //接受json数据
  console.log(body); //打印请求体中的数据
  return NextResponse.json(
    { message: "Post request successful", body },
    { status: 201 },
  );
  //返回json数据
}
```

### 动态参数

我们可以在路由中使用方括号`[]`来定义动态参数，例如`/api/user/[id]`，其中`[id]`就是动态参数，这个参数可以在请求中传递，这个跟前端路由的动态路由类似。

接受动态参参数，需要在第二个参数解构`{ params }`,需注意这个参数是`异步`的，所以需要使用`await`来等待参数解析完成。

```ts
import { NextRequest, NextResponse } from "next/server";
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  console.log(id);
  return NextResponse.json({ message: `Hello, ${id}!` });
}
```

### cookie

Next.js也内置了`cookie`的操作可以方便让我们读写，接下来我们用一个登录的例子来演示如何使用`cookie`。

:::tip 推荐前端组件库

- 官网: [Shadcn](https://ui.shadcn.com/)
- 安装:

```sh
npx shadcn@latest init
pnpm dlx shadcn@latest init
```

:::

```ts
import { cookies } from "next/headers"; //引入cookies
import { NextRequest, NextResponse } from "next/server"; //引入NextRequest, NextResponse
//模拟登录成功后设置cookie
export async function POST(request: NextRequest) {
  const body = await request.json();
  if (body.username === "admin" && body.password === "123456") {
    const cookieStore = await cookies(); //获取cookie
    /**
     * key token
     * value 123456
     * options 配置项
     */
    cookieStore.set("token", "123456", {
      httpOnly: true, //只允许在服务器端访问
      maxAge: 60 * 60 * 24 * 30, //30天
    });
    return NextResponse.json({ code: 1 }, { status: 200 });
  } else {
    return NextResponse.json({ code: 0 }, { status: 401 });
  }
}
//检查登录状态
export async function GET(request: NextRequest) {
  const cookieStore = await cookies(); // 读取cookie
  const token = cookieStore.get("token"); // token
  if (token && token.value === "123456") {
    // 有token且token等于123456
    // 有登录态
    return NextResponse.json({ code: 1 }, { status: 200 });
  } else {
    // 无登录态
    return NextResponse.json({ code: 0 }, { status: 401 });
  }
}
```

## AI SDK

### 安装

```sh
npm i ai @ai-sdk/deepseek @ai-sdk/react
pnpm add ai @ai-sdk/deepseek @ai-sdk/react
```

### 编写API接口

```ts
// 目录必须是这样
// src/app/api/chat/route.ts
import { NextRequest } from "next/server";
// streamText 流式输出
import { streamText, convertToModelMessages } from "ai";
import { createDeepSeek } from "@ai-sdk/deepseek"; // 引入deepseek
import { DEEPSEEK_API_KEY } from "./key";
// 初始化DeepSeek
const deepSeek = createDeepSeek({
  apiKey: DEEPSEEK_API_KEY, //设置API密钥
});
export async function POST(req: NextRequest) {
  const { messages } = await req.json(); //获取请求体
  //这里为什么接受messages 因为我们使用前端的useChat 他会自动注入这个参数，所有可以直接读取
  const result = streamText({
    model: deepSeek("deepseek-chat"), //使用deepseek-chat模型
    messages: convertToModelMessages(messages), //转换为模型消息
    //前端传过来的额messages不符合sdk格式所以需要convertToModelMessages转换一下
    //转换之后的格式：
    //[
    //{ role: 'user', content: [ [Object] ] },
    //{ role: 'assistant', content: [ [Object] ] },
    //{ role: 'user', content: [ [Object] ] },
    //{ role: 'assistant', content: [ [Object] ] },
    //{ role: 'user', content: [ [Object] ] },
    //{ role: 'assistant', content: [ [Object] ] },
    //{ role: 'user', content: [ [Object] ] }
    //]
    system: "你是一个高级程序员，请根据用户的问题给出回答", //系统提示词
  });

  return result.toUIMessageStreamResponse(); //返回流式响应
}
```

前端: 我们在前端使用`useChat`组件来实现AI对话，这个组件内部封装了流式响应，默认会向`/api/chat`发送请求。

- `messages`: 消息列表，包含用户和AI的对话内容
- `sendMessage`: 发送消息的函数，参数为消息内容
- `onFinish`: 消息发送完成后回调函数，可以在这里进行一些操作，例如清空输入框

messages数据结构解析:

```json
[
  {
    "parts": [
      {
        "type": "text", //文本类型
        "text": "你知道 api router 吗"
      }
    ],
    "id": "FPHwY1udRrkEoYgR", //消息ID
    "role": "user" //用户角色
  },
  {
    "id": "qno6vcWcwFM4Yc8J", //消息ID
    "role": "assistant", //AI角色
    "parts": [
      {
        "type": "step-start" //步骤开始
      },
      {
        "type": "text", //文本类型
        "text": "是的，我知道 **API Router**。", //文本内容
        "state": "done" //步骤完成
      }
    ]
  }
]
```

前端编写:

```tsx
"use client";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useChat } from "@ai-sdk/react";

export default function HomePage() {
  const [input, setInput] = useState(""); //输入框的值
  const messagesEndRef = useRef<HTMLDivElement>(null); //获取消息结束的ref
  //useChat 内部封装了流式响应 默认会向/api/chat 发送请求
  /**
   * messages: 消息列表 接收后台发过来的数据
   * sendMessage: 给后台发送数据
   */
  const { messages, sendMessage } = useChat({
    onFinish: () => {
      setInput("");
    },
  });

  // 自动滚动到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  //回车发送消息
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (input.trim()) {
        sendMessage({ text: input });
      }
    }
  };

  return (
    <div className="flex flex-col h-screen bg-linear-to-br from-blue-50 via-white to-purple-50">
      {/* 头部标题 */}
      <div className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <h1 className="text-2xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            AI 智能助手
          </h1>
          <p className="text-sm text-gray-500 mt-1">随时为您解答问题</p>
        </div>
      </div>

      {/* 消息区域 */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-20">
              <div className="bg-linear-to-br from-blue-100 to-purple-100 rounded-full p-6 mb-4">
                <svg
                  className="w-12 h-12 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-700 mb-2">
                开始对话
              </h2>
              <p className="text-gray-500">输入您的问题，我会尽力帮助您</p>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom-4 duration-500`}
              >
                <div
                  className={`flex gap-3 max-w-[80%] ${message.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                >
                  {/* 头像 */}
                  <div
                    className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold ${
                      message.role === "user"
                        ? "bg-linear-to-br from-blue-500 to-blue-600"
                        : "bg-linear-to-br from-purple-500 to-purple-600"
                    }`}
                  >
                    {message.role === "user" ? "你" : "AI"}
                  </div>

                  {/* 消息内容 */}
                  <div
                    className={`flex flex-col ${message.role === "user" ? "items-end" : "items-start"}`}
                  >
                    <div
                      className={`rounded-2xl px-4 py-3 shadow-sm ${
                        message.role === "user"
                          ? "bg-linear-to-br from-blue-500 to-blue-600 text-white"
                          : "bg-white border border-gray-200 text-gray-800"
                      }`}
                    >
                      {message.parts.map((part, index) => {
                        switch (part.type) {
                          case "text":
                            return (
                              <div
                                key={message.id + index}
                                className="whitespace-pre-wrap wrap-break-word"
                              >
                                {part.text}
                              </div>
                            );
                        }
                      })}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* 输入区域 */}
      <div className="bg-white/80 backdrop-blur-sm border-t border-gray-200 shadow-lg">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex gap-3 items-end">
            <div className="flex-1 relative">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="请输入你的问题... (按 Enter 发送，Shift + Enter 换行)"
                className="min-h-15 max-h-50 resize-none rounded-xl border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all shadow-sm"
              />
            </div>
            <Button
              onClick={() => {
                if (input.trim()) {
                  sendMessage({ text: input });
                }
              }}
              disabled={!input.trim()}
              className="h-15 px-6 rounded-xl bg-linear-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
```

## Proxy代理

### 基本使用

- 处理跨域请求
- 接口转发例如`/api/user` -> (可能是其他服务器`java/go/python`等) -> `/api/user`
- 限流例如配合第三方服务做限流
- 鉴权/判断是否登录

`Prxoy代理`其实跟`拦截器`类似，它可以在请求完成之前进行拦截，然后进行一些处理，例如：修改请求头、修改请求体、修改响应体等。

```ts
// 定义proxy函数导出即可
import { NextRequest, NextResponse } from "next/server";
export async function proxy(request: NextRequest) {
  console.log(request.url, "url");
}
// 自定义匹配器 配置匹配路径
export const config = {
  matcher: "/api/:path*",
  //matcher: ['/api/:path*','/api/user/:path*'], 支持单个以及多个路径匹配
  //matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'], 同样支持正则表达式匹配
};
```

也可以配合cookie使用:

```ts
import { NextRequest, NextResponse } from "next/server";
export async function proxy(request: NextRequest) {
  const cookie = request.cookies.get("token");
  if (request.nextUrl.pathname.startsWith("/home") && !cookie) {
    console.log("redirect to login");
    return NextResponse.redirect(new URL("/", request.url));
  }
  if (cookie && cookie.value) {
    return NextResponse.next();
  }
  return NextResponse.redirect(new URL("/", request.url));
}

export const config = {
  matcher: ["/api/:path*", "/home/:path*"],
};
```

### 复杂匹配 (高级写法)

- `source`: 表示匹配路径
- `has`: 表示匹配路径中必须(包含)某些条件
- `missing`: 表示匹配路径中(必须不包含)某些条件
- `type` 只能匹配: `header`(请求头), `query`(地址栏参数), `cookie`

```ts
import { NextRequest, NextResponse } from "next/server";
import { ProxyConfig } from "next/server";
export async function proxy(request: NextRequest) {
  console.log("start proxy");
  return NextResponse.next();
}

export const config: ProxyConfig = {
  matcher: [
    {
      source: "/home/:path*",
      //表示匹配路径中必须(包含)Authorization头和userId查询参数
      has: [
        { type: "header", key: "Authorization", value: "Bearer 123456" },
        { type: "query", key: "userId", value: "123" },
      ],
      //表示匹配路径中(必须不包含)cookie和userId查询参数
      missing: [
        { type: "cookie", key: "token", value: "123456" },
        { type: "query", key: "userId", value: "456" },
      ],
    },
  ],
};
```

### 处理跨域

```ts
// 只要是/api下面的接口都可以被任意访问
import { NextRequest, NextResponse } from "next/server";
import { ProxyConfig } from "next/server";
export async function proxy(request: NextRequest) {
  const response = NextResponse.next(); // 获取响应头
  Object.entries(corsHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  return response;
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export const config: ProxyConfig = {
  matcher: "/api/:path*",
};
```

## CSR SSR SSG

### CSR 客户端渲染

CSR是`Client Side Rendering`的缩写，即`客户端渲染`。我们使用的`Vue` `React` `Angular` 等框架，都是CSR。

![alt text](/assert/nextjs_image/CSR.png)

优点:

- 交互流畅，可直接响应
- 前后端分离，前端注重UI，后端注重数据

缺点:

- 首屏加载慢，因为需要下载JS/CSS等文件
- SEO不友好，因为JS动态渲染

适用场景:

- 后台管理系统开发(后台系统不需要SEO，也不需要首屏加载速度)
- 单页面应用开发(SPA)

### SSR 服务器端渲染

SSR是`Server Side Rendering`的缩写，即服务端渲染。像我们使用的`Next.js` `Nuxt.js`等框架，都是SSR。

![alt text](/assert/nextjs_image/SSR.png)

优点：

- 首屏加载快，因为服务器已经渲染了HTML页面
- SEO友好，搜索引擎能爬取到完整内容

缺点：

- 开发成本高，需要懂服务端知识，全栈开发。
- 服务器承担渲染工作，如果用户访问量大，对服务器配置要求高，增大成本

适合场景：

- 电商网站开发
- 博客网站开发
- 官网/首页等

### SSG 静态生成

SSG是`Static Site Generation`的缩写，即静态站点生成。我们使用的`Vitepress` `Astro`等框架，都是SSG。

![alt text](/assert/nextjs_image/SSG.png)

优点：

- 首屏加载极快（CDN 分发静态文件，无需服务器实时渲染）
- 服务器压力小（CDN 直接承载请求，无需服务器执行 JS）
- SEO 最优（静态 HTML 含完整数据，搜索引擎爬取无压力）

缺点：

- 不适用于动态数据（数据更新需要重新构建部署，如实时股价、实时评论）
- 详情页面如果过多(构建时间会长)

适合场景：

- 技术文档
- 静态营销页
- 静态新闻站

## Hydration 水合

简单来说就是HTML他是`静态`的，需要通过JS才能变成动态的，不然HTML是没有任何交互效果的，当JS下载完成在赋予HTML交互效果的阶段称之为`水合`。

## RSC(React Server Components)

RSC(服务器组件)是React19正式引入的一种新的组件类型，它可以在服务器端渲染，也可以在客户端渲染。

传统的SSR他是在服务器提前把页面渲染好，然后返回给浏览器，然后进行`水合`，CSR则是在客户端渲染，而RSC则是吸取两方优势，分为`服务器组件`和`客户端组件`。

## Server Components(服务端组件)

```tsx
// src/app/server/page.tsx
import fs from "node:fs"; //引入fs模块
import mysql, { RowDataPacket } from "mysql2/promise"; //操作数据库 仅供演示 非最佳实践
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "123456",
  database: "catering",
});

export default async function ServerPage() {
  const [rows] = await pool.query<RowDataPacket[]>("SELECT * FROM goods");
  const data = fs.readFileSync("data.json", "utf-8");
  const json = JSON.parse(data);
  return (
    <div>
      <h1>Server Page</h1>
      {json.age}///{json.name}///{json.city}
      <h3>mysql</h3>
      {rows.map((item: any) => (
        <div key={item.id}>
          {item.name}-{item.goodsPrice}
        </div>
      ))}
    </div>
  );
}
```

因为是在服务端渲染的所以日志会出现在控制台，那为什么控制台也会出现，是因为Next.js在本地开发模式方便我们调试进行的输出，后续生产环境就看不到了。

### 服务端组件的优点

- 安全性: 我们在服务端组件中访问一些API秘钥，令牌等其他机密，不会暴露给客户端。
- 体积: 因为服务端组件在服务器渲染，所以不会被打包到客户端，所以体积更小。
- 全栈：可以在服务端组件访问数据库，文件系统等其他API，实现全栈开发。
- FCP(首次内容绘制): 因为服务端组件是流式传输，所以边渲染边返回，提高了FCP(首次内容绘制)性能。

### 服务端组件的缺点

- 交互性: 因为服务端组件在服务器渲染，所以无法访问浏览器API，所以无法进行交互。
- hooks: `useEffect` `useState` 等hooks在服务端组件中无法使用。

JavaScript: 是由三部分组成的(ECMAScript,DOM,BOM)，在服务端组件只能使用`ECMAScript`部分，无法访问`DOM`和`BOM`。

`ECMAScript`: 就是我们常用的对象，数组，es6+等这些东西是通用的在客户端和服务端都能用。

> 如果要使用以下有交互性的功能，我们需要使用客户端组件。

## Client Components(客户端组件)

声明客户端组件需要在文件的顶部编写 `'use client'` 声明这是客户端组件，但是注意客户端组件会在服务端进行一次`预渲染`，所以访问`document` `window` 等API需要在`useEffect`中访问。

```tsx
"use client";
import { useEffect, useState } from "react";
console.log("client");
export default function ServerPage() {
  const [count, setCount] = useState(0);
  console.log("client X");
  useEffect(() => {
    console.log(document, window);
  }, []);
  return (
    <div>
      <h1>Server Page</h1>
      <button onClick={() => setCount(count + 1)}>点击</button>
      <p>{count}</p>
    </div>
  );
}
```

### 组件嵌套

> 服务端组件可以嵌套客户端组件，客户端组件只能嵌套客户端组件, 不能嵌套服务端组件。

因为客户端会把他所有的模块以及子组件认为是客户端组件，那此时如果服务端组件用了`node.js`的API，或者其他服务端操作，那就会报错，因为客户端组件无法访问这些API，故此客户端组件不能嵌套服务端组件。

### server-only

随着Nodejs的发展，很多API已经可以跟浏览器共用了例如`fetch`, `webSocket`, 未来Nodejs25支持 `localStorage` 等API, 所以就会出现这种情况。

使用`server-only`可以解决, server-only需要安装

```sh
npm install server-only

pnpm add server-only
```

```tsx
import "server-only";
export default function useTest(type: 0 | 1) {
  if (type === 0) {
    return fetch("https://api.github.com");
  } else {
    return new WebSocket("wss://api.github.com");
  }
}
```

## Cache Components(缓存组件)

Cache Components 是Next.js(16)版本特有的机制，实现了`静态内容` `动态内容` `缓存内容`的混合编排。保留了静态内容的加载速度，又具备动态渲染的灵活性，解决了`静态内容(加载快但无法实时更新数据)`和`动态内容(加载慢但可以实时更新数据)`权衡的问题。

- 静态内容: 构建(`npm run build`)时进行预渲染，例如 `「本地文件」「模块导入」「纯计算」（无网络请求、无用户相关数据）`, 会被直接编译成HTML瞬间加载、立即响应。

- 动态内容：用户发起请求时才开始渲染的内容，依赖 “实时数据” 或 “用户个性化信息”，每次请求都可能生成不同结果，不会被缓存。例如 `「实时数据源」（如实时接口、数据库实时查询）或「用户请求上下文」（如 Cookie、请求头、URL 参数）`。

- 缓存内容：缓存内容的本质就是缓存动态数据，缓存之后会被纳入`静态外壳(Static Shell)`, 静态外壳就类似于毛坯房，会提前把结构搭建好，后续在通过(流式传输)填充里面的动态内容。

### 启用 Cache Components

Cache Components 为可选功能，需在 Next 配置文件中显式启用：

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true, // 启用缓存组件
};

export default nextConfig;
```

1. 静态内容
   适用场景：仅依赖同步 I/O（如 fs.readFileSync）、模块导入、纯计算的组件

```tsx
import fs from "node:fs";

export default async function Home() {
  const data = fs.readFileSync("data.json", "utf-8"); //本地文件读取
  const json = JSON.parse(data);
  const impData = await import("../../../data.json"); //模块导入
  const names = impData.list.map((item) => item.name).join(","); //纯计算
  console.log(json);
  console.log(impData);
  console.log(names);
  return (
    <div>
      <h1>Home</h1>
      <ul>
        {json.list.map((item: any) => (
          <li key={item.id}>
            {item.name} - {item.age}
          </li>
        ))}
      </ul>
    </div>
  );
}
```

2. 动态内容
   适用场景：fetch请求、cookies、headers等动态数据

> 动态内容必须配合Suspense使用。

```tsx
import { Suspense } from "react";
import { cookies } from "next/headers";

const DynamicContent = async () => {
  const data = await fetch("https://www.mocklib.com/mock/random/name"); //随机生成一个名称
  const json = await data.json();
  console.log(json);
  const cookieStore = await cookies(); //获取cookie
  console.log(cookieStore);
  return (
    <div>
      <h2>动态内容</h2>
      <main>
        <ul>
          <li>名称：{json.name}</li>
        </ul>
      </main>
    </div>
  );
};

export default async function Home() {
  return (
    <div>
      <h1>Home</h1>
      <Suspense fallback={<div>动态内容Loading...</div>}>
        <DynamicContent />
      </Suspense>
    </div>
  );
}
```

### 实现原理

Next.js 会通过`(Partial Prerendering/PPR)`技术,实现静态外壳(Static Shell)渲染，提供占位符，当用户请求时，再通过流式传输(Streaming)填充里面的动态内容，以此提升首屏加载速度和用户体验。

### 非确定操作

例如: `随机数`、`时间戳`等非确定操作，每次请求都可能生成不同结果。

### 缓存内容

缓存组件，可以使用`use cache`声明这是一个缓存组件，然后使用`cacheLife`声明缓存时间。

## 缓存策略

### 未启用缓存组件

首先要确保 `cacheComponents` 配置为 `false` 或者不配置。

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: false, // 缓存组件(关闭或者不配置)
};

export default nextConfig;
```

示例:

```tsx
// src/app/home/page.tsx
export default async function Home() {
  const randomImage = await fetch("https://www.loliapi.com/acg/pc?type=json"); //这个接口随机返回一个二刺猿图片
  const data = await randomImage.json();
  console.log(data);
  return (
    <div>
      <h1>Home</h1>
      <img width={500} height={500} src={data.url} alt="random image" />
    </div>
  );
}
```

在开发环境下没有任何问题, 但是当进行构建之后`npm run build && npm run start`, 会发现每次刷新图片都不会变化，始终是同一个图片。原因是：Next.js会尽可能多的进行缓存，以提高性能降低成本，这意味着路由会被静态渲染，以及数据请求也会被缓存，除非禁用缓存。

### 如何退出缓存机制

1. 使用 `revalidate` 属性，可以设置缓存时间，单位为秒。

```tsx
export const revalidate = 5; // 5秒后重新更新
//export const revalidate = 0 // 设置为0表示不缓存
export default async function Home() {
  const randomImage = await fetch("https://www.loliapi.com/acg/pc?type=json");
  const data = await randomImage.json();
  return (
    <div>
      <h1>Home</h1>
      <img width={500} height={500} src={data.url} alt="random image" />
    </div>
  );
}
```

2. 使用 `dynamic` 属性

```tsx
export const dynamic = "force-dynamic"; // 动态更新 缓存组件不需要使用这个 默认都是动态内容
export default async function Home() {
  const randomImage = await fetch("https://www.loliapi.com/acg/pc?type=json");
  const data = await randomImage.json();
  return (
    <div>
      <h1>Home</h1>
      <img width={500} height={500} src={data.url} alt="random image" />
    </div>
  );
}
```

3. 禁用缓存

使用`cache`属性，并且设置为`no-store`，表示将禁用缓存，每次请求都会重新获取数据。

```tsx
export default async function Home() {
  const randomImage = await fetch("https://www.loliapi.com/acg/pc?type=json", {
    cache: "no-store",
  });
  const data = await randomImage.json();
  return (
    <div>
      <h1>Home</h1>
      <img width={500} height={500} src={data.url} alt="random image" />
    </div>
  );
}
```

4. 任意动态内容API

当你使用以下任意API时，该路由会被视为动态内容，不会被缓存:

- `cookies`
- `headers`
- `connection`
- `searchParams`
- `fetch`和`{ cache: ‘no-store’ }`

## 启用缓存组件

确保`cacheComponents`配置为`true`。

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true, //开启缓存组件
};

export default nextConfig;
```

> 启用缓存组件之后，所有组件默认为`动态内容`(所有动态内容必须通过`suspense`组件包裹)，因此`export const dynamic = 'force-dynamic'`不需要配置。

## image 组件

该组件是Next.js内置的图片组件，是基于原生 `img` 标签进行扩展，并不代表原生 `img` 标签不能使用。

- 尺寸优化：支持使用现代化图片格式，如`webp`，`avif`，`apng`等,并自动根据设备提供正确的尺寸。
- 视觉稳定性：防止图片加载时发生布局偏移，具体参考 [CLS](https://web.dev/articles/cls?hl=zh-cn)
- 懒加载：在图片进入视口才会加载，使用浏览器原生懒加载，并可选择添加模糊显示占位符。
- 灵活性：可按需调整图像大小，即使是存储在远程服务器上的图像也可以调整。

### 图片引入

#### 1. src本地图片引入

Next.js建议我们把图片放在根目录下的`public`文件夹中，然后使用`/`开头访问。

```tsx
import Image from "next/image";
export default function Home() {
  return (
    <div>
      <h1>Home</h1>
      {/* loading="eager" 表示图片立即加载 不需要懒加载 首屏图片 */}
      {/* 确保图片的尺寸正确 */}
      {/* 如果使用src 属性，宽高都是必填的 */}
      <Image src="/1.png" loading="eager" width={192} height={108} alt="1" />
    </div>
  );
}
```

#### 2. import静态引入 动态引入

使用`import`引入图片，是不需要填写宽度和高度，Next.js会自动确定图片的尺寸。

```tsx
// tsconfig.json 配置路径别名
{
    "compilerOptions": {
        "paths": {
            "@/*": ["./src/*"],
            "@/public/*": ["./public/*"] // 新增这一行代码，配置图片路径。
        }
    }
}
```

```tsx
// 静态引入
import Image from "next/image";
import test from "@/public/1.png";
export default function Home() {
  return (
    <div>
      <h1>Home</h1>
      <Image src={test} alt="1" />
    </div>
  );
}

// 动态引入
import Image from "next/image";
export default async function Home() {
  const test = await import("@/public/1.png");
  return (
    <div>
      <h1>Home</h1>
      <Image loading="eager" src={test.default} alt="1111" />
    </div>
  );
}
```

#### 3. 远程图片引入(在线图片)

```tsx
import Image from "next/image";
export default async function Home() {
  const len = 20;
  return (
    <div>
      <h1>Home</h1>
      {Array.from({ length: len }).map((_, index) => (
        <Image
          key={index}
          src={`https://eo-img.521799.xyz/i/pc/img${index + 1}.webp`}
          alt="1"
          width={192}
          height={108}
        />
      ))}
    </div>
  );
}
```

当我们直接使用远程图片引入的时候Next.js会报错，因为Next.js默认只允许加载`本地图片`，如果需要加载远程图片，需要配置`next.config.js`文件。

```js
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https', // 协议
        hostname: 'eo-img.521799.xyz', // 主机名
        pathname: '/i/pc/**', // 路径
        port: '', // 端口
      },
    ],
  },
};
```

#### 4. LCP警告

如果图片是首屏或者LCP图片，需要添加`loading="eager"`属性，否则会触发LCP警告, 因为Image组件默认是`懒加载`的。

- lazy: 懒加载，默认值，在图片进入视口才会加载。
- eager: 立即加载，在图片进入视口就会加载。

第二种解决方案使用`preload`属性加载图片，表示提前预加载图片，不过Next.js还是更加推荐使用`loading="eager"`属性加载图片。

#### 5. 图片格式优化

Next.js 会通过请求`Accept`头自动检测浏览器支持的图像格式，以确定最佳输出格式

`Accept:image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8`

我们可以同时启用 `AVIF` 和 `WebP` 格式。对于支持 `AVIF` 的浏览器，系统将优先使用 `AVIF` 格式，`WebP` 格式作为备选方案。目前`AVIF`格式最优。

> 后端会准备几种不同的格式，并返回最合适的格式(浏览器支持什么格式就返回什么格式 有一个从高到低的优先级)。

```ts
const nextConfig: NextConfig = {
  /* config options here */
  images: {
    // 调整策略
    formats: ["image/avif", "image/webp"], //默认是 ['image/webp']
  },
};
```

#### 6. 设备适配

如果你的老板告诉你要兼容哪些设备，你可以使用`deviceSizes`和`imageSizes`属性来配置。

```ts
const nextConfig: NextConfig = {
  /* config options here */
  images: {
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840], // 设备尺寸
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384], // 图片尺寸
  },
};
```

### Props

#### 必需属性

| 属性  | 类型   | 示例                          | 说明                               |
| ----- | ------ | ----------------------------- | ---------------------------------- |
| `src` | String | `src="/profile.png"`          | 图片源路径，支持本地路径或远程 URL |
| `alt` | String | `alt="Picture of the author"` | 图片替代文本，用于无障碍访问和 SEO |

#### 尺寸相关

| 属性     | 类型         | 示例                               | 说明                             |
| -------- | ------------ | ---------------------------------- | -------------------------------- |
| `width`  | Integer (px) | `width={500}`                      | 图片宽度，静态导入时可选         |
| `height` | Integer (px) | `height={500}`                     | 图片高度，静态导入时可选         |
| `fill`   | Boolean      | `fill={true}`                      | 填充父容器，替代 width 和 height |
| `sizes`  | String       | `sizes="(max-width: 768px) 100vw"` | 响应式图片尺寸                   |

#### 优化相关

| 属性          | 类型            | 示例                   | 说明                    |
| ------------- | --------------- | ---------------------- | ----------------------- |
| `quality`     | Integer (1-100) | `quality={80}`         | 图片压缩质量，默认为 75 |
| `loader`      | Function        | `loader={imageLoader}` | 自定义图片加载器函数    |
| `unoptimized` | Boolean         | `unoptimized={true}`   | 禁用图片优化，使用原图  |

#### 加载相关

| 属性          | 类型    | 示例                               | 说明                          |
| ------------- | ------- | ---------------------------------- | ----------------------------- |
| `loading`     | String  | `loading="lazy"`                   | 加载策略，"lazy" 或 "eager"   |
| `preload`     | Boolean | `preload={true}`                   | 是否预加载，用于 LCP 元素     |
| `placeholder` | String  | `placeholder="blur"`               | 占位符类型，"blur" 或 "empty" |
| `blurDataURL` | String  | `blurDataURL="data:image/jpeg..."` | 模糊占位符的 Data URL         |

#### 事件回调

| 属性      | 类型     | 示例                    | 说明                 |
| --------- | -------- | ----------------------- | -------------------- |
| `onLoad`  | Function | `onLoad={e => done()}`  | 图片加载完成时的回调 |
| `onError` | Function | `onError={e => fail()}` | 图片加载失败时的回调 |

#### 其他属性

| 属性          | 类型   | 示例                               | 说明                            |
| ------------- | ------ | ---------------------------------- | ------------------------------- |
| `style`       | Object | `style={ {objectFit: "contain"} }` | 内联样式对象                    |
| `overrideSrc` | String | `overrideSrc="/seo.png"`           | 覆盖 src，用于 SEO 优化         |
| `decoding`    | String | `decoding="async"`                 | 解码方式，"async"/"sync"/"auto" |

## font 字体

`next/font`模块，内置了字体优化功能，其目的是防止`CLS`布局偏移。font模块主要分为两部分，一部分是内置的`Google Fonts`字体，另一部分是本地字体。

### 基本用法

1. 内置Google Fonts字体
2. 中文字符集支持 --> 寻找支持中文的字体
3. 可变字体 可变字体是一种可以适应不同字重和样式的字体，它可以在不同的设备上自动调整字体大小和样式，以适应不同的屏幕大小和分辨率。 把`weight`变为数组即可配置
4. 本地字体加载

在使用google字体的时候，Google字体和css文件会在构建的时候下载到本地，可以与静态资源一起托管到服务器，所以不会向Google发送请求。

```tsx
// 可以点击进去看声明文件 判断有哪些字体
// 可视化 https://fonts.google.com/
import { BBH_Sans_Hegarty } from "next/font/google"; //引入字体库
// import localFont from "next/font/local"; // 引入本地字体库

// 本地字体
// const myFont = localFont({
//   src: "./fonts/bbh-sans-hegarty.woff2",
//   display: "swap",
// });

const bbhSansHegarty = BBH_Sans_Hegarty({
  weight: "400", //字体粗细
  display: "swap", // 加载策略 字体显示方式
  subsets: ["latin", "latin-ext", "cyrillic"], // 字符集(了解)
  style: ["normal"], // 字体样式，如 ‘normal’ ‘italic（斜体）’ ‘oblique（倾斜）’ 等。
});
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={bbhSansHegarty.className}>
        {" "}
        {/** bbhSansHegarty会返回一个类名，用于加载字体 */}
        {children}
        abcd 你好
      </body>
    </html>
  );
}
```

对于`display`的值，常用的有如下几种：

- `auto`：浏览器默认（通常为 block）
- `block`：空白 3s → 备用字体 → 自定义字体
- `swap`：备用字体 → 自定义字体 (常用)
- `fallback`：空白 100ms → 备用字体，3s 内加载完成则切换
- `optional`：空白 100ms，100ms 内加载完成则使用，否则用备用字体

### API 参考

| 属性                 | Google | 本地 | 类型           | 必填 | 说明                  |
| -------------------- | ------ | ---- | -------------- | ---- | --------------------- |
| `src`                | ✗      | ✓    | String/Array   | 是   | 字体文件路径          |
| `weight`             | ✓      | ✓    | String/Array   | 可选 | 字体粗细，如 '400'    |
| `style`              | ✓      | ✓    | String/Array   | -    | 字体样式，如 'normal' |
| `subsets`            | ✓      | ✗    | Array          | -    | 字符子集              |
| `axes`               | ✓      | ✗    | Array          | -    | 可变字体轴            |
| `display`            | ✓      | ✓    | String         | -    | 显示策略              |
| `preload`            | ✓      | ✓    | Boolean        | -    | 是否预加载            |
| `fallback`           | ✓      | ✓    | Array          | -    | 备用字体              |
| `adjustFontFallback` | ✓      | ✓    | Boolean/String | -    | 调整备用字体          |
| `variable`           | ✓      | ✓    | String         | -    | CSS 变量              |
| `declarations`       | ✗      | ✓    | Array          | -    | 自定义声明            |

## Script 组件

Next.js允许我们使用Script组件去加载js脚本(外部/本地脚本)，并且他还对Script组件进行优化。

### 基本使用

```ts
// src/app/home/page.tsx
import Script from 'next/script' //引入Script组件
export default function HomePage() {
    return (
        <div>
            <Script src="https://unpkg.com/vue@3/dist/vue.global.js" />
        </div>
    )
}
```

在home路由引入一个远程的js脚本，他只会在切换到home路由时才会加载，并且只会加载一次，然后纳入缓存。

他的底层原理会把这个Script组件转换成`<script>`标签，然后插入到`<head>`标签中。

#### 全局引入

全局引入直接在app/layout.tsx中引入，他会自动在所有页面中引入，并且只会加载一次，然后纳入缓存。

```ts
// src/app/layout.tsx
import Script from 'next/script'
export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html>
            <head>
                <Script src="https://unpkg.com/vue@3/dist/vue.global.js" />
            </head>
            <body>
                {children}
            </body>
        </html>
    )
}
```

#### 加载策略

Next.js允许我们通过`strategy`属性来控制Script组件的加载策略。

- `beforeInteractive`: 在代码和页面之前加载会阻塞页面渲染。
- `afterInteractive`(默认值): 在页面渲染到客户端之后加载。
- `lazyOnload`: 在浏览器空闲时稍后加载脚本。
- `worker`(实验性特性): 暂时不建议使用。

```tsx
<Script id="VGUBHJMK1" strategy="beforeInteractive" src="https://unpkg.com/vue@3/dist/vue.global.js" />
<Script id="VGUBHJMK2" strategy="afterInteractive" src="https://unpkg.com/vue@3/dist/vue.global.js" />
<Script id="VGUBHJMK3" strategy="lazyOnload" src="https://unpkg.com/vue@3/dist/vue.global.js" />
<Script id="VGUBHJMK4" strategy="worker" src="https://unpkg.com/vue@3/dist/vue.global.js" />
```

> webWorker模式 尚不稳定，谨慎使用,小提示可以给Script组件添加id，Next.js会追踪优化。

#### 内联脚本

即使不从外部文件载入脚本，Next.js也支持我们通过`{}`直接在Script组件编写代码。

```tsx
import Script from "next/script";
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <Script
          id="VGUBHJMK5"
          strategy="beforeInteractive"
          src="https://unpkg.com/vue@3/dist/vue.global.js"
        ></Script>
      </head>
      <body>
        {children}
        <div id="app"></div>
        <Script id="VGUBHJMK6" strategy="afterInteractive">
          {`
            const {createApp} = Vue
            createApp({
              template: '<h1>{{ message }}</h1>',
              setup() {
                return {
                  message: 'Next.js + Vue.js'
                }
              }
            }).mount('#app')
          `}
        </Script>
      </body>
    </html>
  );
}
```

第二种写法使用 `dangerouslySetInnerHTML` 属性来设置内联脚本。

```tsx
<Script
  dangerouslySetInnerHTML={{
    __html: `
    const {createApp} = Vue
    createApp({
        template: '<h1>{{ message }}</h1>',
        setup() {
        return {
            message: 'Next.js + Vue.js'
        }
        }
    }).mount('#app')
    `,
  }}
  strategy="afterInteractive"
></Script>
```

#### 事件监听 (生命周期)

- `onload`: 脚本加载完成时触发。
- `onReady`: 脚本加载完成后，且组件每次挂载的时候都会触发。
- `onError`: 脚本加载失败时触发。

> Script组件只有在导入客户端的时候才会生效，所以需要使用'use client'声明这是一个客户端组件。

## 静态导出SSG

Next.js 支持静态站点生成（SSG，Static Site Generation），可以在构建时预先生成所有页面的静态 HTML 文件。这种方式特别适合内容相对固定的站点，如`官网`、`博客`、`文档`等，能够提供最佳的性能和 SEO 表现。

### 配置静态导出

需要在`next.config.js`文件中配置`output`为`export`，表示导出静态站点。`distDir`表示导出目录，默认为`out`。

```ts
import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  /* config options here */
  output: "export", // 导出静态站点
  distDir: "dist", // 导出目录
};

export default nextConfig;
```

启动完成之后发现点击`a`标签无法进行跳转，是因为打完包之后的页面叫`about.html`, 而我们的跳转链接是`/about`，所以需要修改配置项。

### 修改配置项

需要在`next.config.js`文件中配置t`railingSlash`为`true`，表示添加尾部斜杠，生成`/about/index.html`而不是`/about.html`。

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "export", // 导出静态站点
  distDir: "dist", // 导出目录
  trailingSlash: true, // 添加尾部斜杠，生成 /about/index.html 而不是 /about.html
};

export default nextConfig;
```

此时重新点击`a`标签就可以进行跳转了。

### 动态路由处理

新建目录: `src/app/posts/[id]/page.tsx`

如果要使用动态路由，则需要使用`generateStaticParams`函数来生成有多少个动态路由，这个函数需要返回一个数组，数组中包含所有动态路由的参数，例如`{ id: '1' }`表示对应`id`为`1`的详情页。

### 图片优化

如果使用`Image`组件优化图片，在开发模式会进行报错

可能的解决方案：

- 移除 `{ output: 'export' }` 并运行 `next start` 以启用包含图片优化 API 的服务器模式。
- 在 `next.config.js` 中配置 `{ images: { unoptimized: true } }` 来禁用图片优化 API。
- 使用自定义loader实现

```tsx
import Image from "next/image";
import test from "@/public/1.png";
export default function About() {
  return (
    <div>
      <h1>About</h1>
      <Image
        loading="eager"
        src={test}
        alt="logo"
        width={250 * 3}
        height={131 * 3}
      />
    </div>
  );
}
```

使用自定义`loader`来实现图片优化, 要求我们通过一个图床托管图片。

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "export", // 导出静态站点
  distDir: "dist", // 导出目录
  trailingSlash: true, // 添加尾部斜杠，生成 /about/index.html 而不是 /about.html
  images: {
    loader: "custom", // 自定义loader
    loaderFile: "./image-loader.ts", // 自定义loader文件
  },
};

export default nextConfig;
```

```ts
// /image-loader.ts
export default function imageLoader({
  src,
  width,
  quality,
}: {
  src: string;
  width: number;
  quality: number;
}) {
  return `https://s41.ax1x.com${src}`;
}
```

```ts
// src/app/about/page.tsx
import Image from "next/image"

export default function About() {
    return (
        <div>
            <h1>About</h1>
            <Image loading="eager" src='/2025/12/29/pZYbW7t.jpg' alt="logo" width={250 * 3} height={131 * 3} />
        </div>
    )
}
```

### 注意事项

以下功能在`SSG`中不支持：

- `Dynamic Routes with dynamicParams: true`
- 动态路由没有使用 `generateStaticParams()`
- 路由处理器依赖于 `Request`
- `Cookies`
- `Rewrites` 重写
- `Redirects` 重定向
- `Headers` 头
- `Proxy` 代理
- `Incremental Static Regeneration` 增量静态再生
- `Image Optimization with the default loader` 默认加载器的图像优化
- `Draft Mode` 草稿模式
- `Server Actions` 服务器操作
- `Intercepting Routes` 拦截路由

## MDX

`MDX`是一种将`Markdown`和`React`组件混合在一起的语法，它可以在`Markdown`中使用`React组件`，从而实现更复杂的页面。另外就是我们在编写技术文档或者博客的时候，配合SSG模式，用Markdown来编写.

- 安装依赖

```bash
npm install @next/mdx @mdx-js/loader @mdx-js/react @types/mdx
pnpm add @next/mdx @mdx-js/loader @mdx-js/react @types/mdx
```

### 启用MDX功能

```ts
//next.config.js  固定配置
import type { NextConfig } from "next";
import createMDX from "@next/mdx";
const withMDX = createMDX({
  //extension: /\.(md|mdx)$/ 默认只支持mdx文件,如果想额外支持md文件编写次行代码。
});
const nextConfig: NextConfig = {
  reactCompiler: true,
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
};
export default withMDX(nextConfig);
```

根目录下面创建mdx-components.tsx文件

```tsx
// mdx-components.tsx
import type { MDXComponents } from "mdx/types";

const components: MDXComponents = {};

export function useMDXComponents(): MDXComponents {
  return components;
}
```

### 代码高亮

安装`MDX`插件

### 基础使用

可以支持(`Markdown`语法 + `React`组件 + `HTML`标签)

### 引入自定义组件

引入自定义组件一定要跟md语法之间空一行，否则会报错

### 全局样式

如果你希望在这个项目中修改所有的MDX文件的样式，你可以使用`mdx-components.tsx`文件来修改。

```tsx
//mdx-components.tsx
import type { MDXComponents } from "mdx/types";

const components: MDXComponents = {
  h1: ({ children }) => (
    <h1 className="text-2xl text-red-400 font-bold">{children}</h1>
  ), //# 代表h1 你可以自定义修改样式
  li: ({ children }) => (
    <li className="list-disc text-blue-500 list-inside">{children}</li>
  ), //- 代表li 你可以自定义修改样式
  //...你可以自定义修改更多的样式
};

export function useMDXComponents(): MDXComponents {
  return components;
}
```

### 远程加载mdx/md文件

如果你的MDX文件存储在远程服务器上，你可以使用`远程mdx`来加载文件。

安装依赖:

```bash
npm install next-mdx-remote-client
pnpm add next-mdx-remote-client
```

```tsx
//src/app/home/page.tsx
import { MDXRemote } from "next-mdx-remote-client/rsc";
export default async function Home() {
  const res = await fetch("https://nextjs-docs-henna-six.vercel.app/xm.mdx"); //链接是彩蛋
  const source = await res.text();
  return <MDXRemote source={source} />;
}
```

## Server Actions(服务器函数)

服务器函数指的是可以是服务器组件处理表单的提交，无需手动编写API接口，并且还支持数据的验证，以及状态管理等。

### 核心原理

是因为React扩展了原生`HTMLform`表单，允许通过`action`属性直接绑定`server action`函数，当表单提交后，函数会自动接受原生的`FormData`数据。

### 基本用法

传统的表单提交方式:

![alt text](/assert/nextjs_image/traditional.png)

服务器函数的用法:

![alt text](/assert/nextjs_image/server-Funciton.png)

示例:

```tsx
export default function Login() {
  async function handleLogin(formData: FormData) {
    "use server";
    const username = formData.get("username"); //接受单个参数
    const password = formData.get("password"); //接受单个数据
    const form = Object.fromEntries(formData); //接受所有数据 {username: '张三', password: '123456'}
    //可以直接操作数据库，这样就无需编写API接口了 哇哦太方便了
  }
  return (
    <div>
      <h1>登录页面</h1>
      <div className="flex flex-col gap-2 w-[300px] mx-auto mt-30">
        <form action={handleLogin} className="flex flex-col gap-2">
          <input
            className="border border-gray-300 rounded-md p-2"
            type="text"
            name="username"
            placeholder="用户名"
          />
          <input
            className="border border-gray-300 rounded-md p-2"
            type="password"
            name="password"
            placeholder="密码"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded-md"
          >
            登录
          </button>
        </form>
      </div>
    </div>
  );
}
```

### 额外参数

目前只能携带固定参数例如 `username` `password`, 无法携带其他参数。

> 那么我想携带`ID`或者其他自定义参数怎么做？

我们需要使用`bind`方法来进行参数扩展，这样在函数内部就可以接收到`ID`参数。

```tsx
export default function Login() {
  //接受id参数
  async function handleLogin(id: number, formData: FormData) {
    "use server";
    const username = formData.get("username");
    const password = formData.get("password");
    const form = Object.fromEntries(formData);
    console.log(username, password, form, id);
  }
  const userFunction = handleLogin.bind(null, 1); //绑定id参数
  return (
    <div>
      <h1>登录页面</h1>
      <div className="flex flex-col gap-2 w-[300px] mx-auto mt-30">
        {/*使用新的函数绑定id参数 userFunction*/}
        <form action={userFunction} className="flex flex-col gap-2">
          <input
            className="border border-gray-300 rounded-md p-2"
            type="text"
            name="username"
            placeholder="用户名"
          />
          <input
            className="border border-gray-300 rounded-md p-2"
            type="password"
            name="password"
            placeholder="密码"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded-md"
          >
            登录
          </button>
        </form>
      </div>
    </div>
  );
}
```

### 参数校验(zod) + 读取状态

zod是一个目前非常流行的`数据验证`库，可以让我们在服务器端进行数据验证，避免用户输入非法数据。

安装:

```bash
npm i zod
```

```ts
// src/app/lib/login/actions.ts
"use server";
import { z } from "zod";
const loginSchema = z.object({
  username: z.string().min(6, "用户名不能少于6位"), //zod基本用法表示这是一个字符串，并且不能少于6位
  password: z.string().min(6, "密码不能少于6位"), //zod基本用法表示这是一个字符串，并且不能少于6位
});

export async function handleLogin(_prevState: any, formData: FormData) {
  const result = loginSchema.safeParse(Object.fromEntries(formData)); //调用zod的safeParse方法进行校验

  if (!result.success) {
    const errorMessage = z.treeifyError(result.error).properties; //调用zod的treeifyError方法将错误信息转换为对象
    let str = "";
    Object.entries(errorMessage!).forEach(([_key, value]) => {
      value.errors.forEach((error: any) => {
        str += error + "\n"; //将错误信息拼接成字符串
      });
    });
    return { message: str }; //返回错误信息
  }
  //校验成功，进行数据库操作逻辑
  return { message: "登录成功" }; //返回成功信息
}
```

在`src/app/login/page.tsx` , 中如果要读取状态需要使用React19的`useActionState` hook，这个hook必须在客户端组件中使用。所以需要增加`'use client'`声明这是一个客户端组件。

`useActionState` hook接受三个参数:

- `fn`: 表单提交时触发的函数，接收上一次的 state（首次为 initialState）作为第一个参数，其余参数为表单参数
- `initialState: state` 的初始值，可以是任何可序列化的值 -` permalink`(可选): 表单提交后跳转的 URL，用于 JavaScript 加载前的渐进式增强

返回值:

- `state`: 当前状态，初始值为 initialState，之后为 action 的返回值
- `formAction`: 新的 action 函数，用于传递给 form 或 button 组件
- `isPending`: 布尔值，表示是否有正在进行的 Transition

## 环境变量

环境变量一般是指程序在运行时，所需要的一些配置信息，例如数据库连接字符串，API密钥，端口号等。其次就是环境变量跟我们的操作系统有关，例如Linux，Windows，Mac等。

### 最佳实践

因为上述方式依旧麻烦，如果有很多的环境变量，我们的命令就会变得非常长，所以我们可以使用.env文件来存储环境变量。

Next.js 环境变量查找规则(官方规定)，如果在其中一个链路中找到了环境变量，那么就不会继续往下找了。

1. `process.env`
2. `.env.$(NODE_ENV).local`
3. `.env.local`（未检查的情况NODE_ENV。test）
4. `.env.$(NODE_ENV)`
5. `.env`

> 提示：NODE_ENV是Next.js自动注入的环境变量，开发模式他会注入`development`，生产模式他会注入`production`。

可以创建两个不同的env文件，一个是开发环境，一个是生产环境。 `.env.development.local`和 `.env.production.local`

## i18n (国际化)

国际化(Internationalization) 是Next.js提供的一种机制，用于支持多语言的网站，例如可以实现中英文切换，包括接口同步翻译，以及不同语言所展示的页面不一样等。

### 实现原理

Next.js建议我们使用http报文头来判断用户使用的语言`Accept-Language`，例如`Accept-Language: zh-CN,zh;q=0.9,en;q=0.8`表示用户使用中文(中国)，如果用户没有设置，则使用默认语言。

#### Accept-Language规则

`zh-CN,zh;q=0.9,en;q=0.8` 表示用户使用中文(中国)，权重为1(最大值1会被省略)，中文(中国)权重为0.9，英语(美国)权重为0.8。

#### 安装第三方库

```bash
npm i negotiator # 用于解析Accept-Language
npm i @formatjs/intl-localematcher # 用于匹配语言
```

## next.config.js配置

### 根据不同环境进行配置

例如我想在开发环境配置 XXX，或者生产环境配置 YYY，那么我们可以使用`next/constants`来判断当前环境。

```ts
//Next.js next/constants内置的常量
export declare const PHASE_EXPORT = "phase-export"; // 导出静态站点
export declare const PHASE_PRODUCTION_BUILD = "phase-production-build"; // 生产环境构建
export declare const PHASE_PRODUCTION_SERVER = "phase-production-server"; // 生产环境服务器
export declare const PHASE_DEVELOPMENT_SERVER = "phase-development-server"; // 开发环境服务器
export declare const PHASE_TEST = "phase-test"; // 测试环境
export declare const PHASE_INFO = "phase-info"; // 信息
```

根据不同环境配置，需要返回一个函数，而不是直接返回一个对象，在函数中会接受一个参数`phase`，这个参数是Next.js的环境，我们可以根据这个参数来判断当前环境。

```ts
//next.config.ts
import { PHASE_DEVELOPMENT_SERVER, PHASE_TYPE } from "next/constants";
import type { NextConfig } from "next";

export default (phase: PHASE_TYPE): NextConfig => {
  const nextConfig: NextConfig = {
    reactCompiler: false,
  };

  if (phase === PHASE_DEVELOPMENT_SERVER) {
    nextConfig.reactCompiler = true; // 开发环境使用reactCompiler
  }

  //if() 其他环境.....

  return nextConfig;
};
```

### Next.js配置端口号

```json
// package.json
  "scripts": {
    "dev": "next dev -p 8888", // 开发环境端口号
    "build": "next build",
    "start": "next start -p 9999 " // 生产环境端口号
  },
```

### Next.js导出静态站点 (SSG章节总结过)

需要在`next.config.js`文件中配置`output`为`export`，表示导出静态站点。`distDir`表示导出目录，默认为`out`。

```ts
import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  /* config options here */
  output: "export", // 导出静态站点
  distDir: "dist", // 导出目录
  trailingSlash: true, // 添加尾部斜杠，生成 /about/index.html 而不是 /about.html
};

export default nextConfig;
```

### Next.js配置图片优化 (图片章节总结过)

Next.js的 `Image`组件默认只允许加载本地图片，如果需要加载远程图片，需要配置`next.config.js`文件。

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https", // 协议
        hostname: "eo-img.521799.xyz", // 主机名
        pathname: "/i/pc/**", // 路径
        port: "", // 端口
      },
    ],
    formats: ["image/avif", "image/webp"], //默认是 ['image/webp']
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840], // 设备尺寸
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384], // 图片尺寸
  },
};
```

### 自定义响应标头

例如配置`CORS`跨域，或者是自定义响应标头等，只要是http支持的响应头都可以配置。

```ts
const nextConfig: NextConfig = {
  headers: () => {
    return [
      {
        source: "/:path*", // 匹配路径 所有路径 也支持精准匹配 例如/api/user 包括支持动态路由等 /api/user/:id
        headers: [
          {
            key: "Access-Control-Allow-Origin", //允许跨域
            value: "*", // 允许所有域名访问
          },
          {
            key: "Access-Control-Allow-Methods", //允许的请求方法
            value: "GET, POST, PUT, DELETE, OPTIONS", // 允许的请求方法
          },
          {
            key: "Access-Control-Allow-Headers", //允许的请求头
            value: "Content-Type, Authorization", // 允许的请求头
          },
        ],
      },
      {
        source: "/home", // 精准匹配 /home 路径
        headers: [
          {
            key: "X-Custom-Header", //自定义响应头
            value: "123456", // 值
          },
        ],
      },
    ];
  },
};
```

[HTTP响应头](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers)

### assetPrefix配置

`assetPrefix`配置用于配置静态资源前缀，例如：部署到CDN后，静态资源路径会发生变化，需要配置这个配置项。

```ts
import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  /* config options here */
  assetPrefix: "https://cdn.example.com", // 静态资源前缀
};

// 配置前 /_next/static/chunks/4b9b41aaa062cbbfeff4add70f256968c51ece5d.4d708494b3aed70c04f0.js
// 配置后 https://cdn.example.com/_next/static/chunks/4b9b41aaa062cbbfeff4add70f256968c51ece5d.4d708494b3aed70c04f0.js

export default nextConfig;
```

### basePath配置

应用前缀：也就是跳转路径中增加前缀，例如前缀是`/docs`，那么跳转`/home`就需要跳转到`/docs/home`。访问根目录也需要增加前缀，例如访问`/`就需要跳转到`/docs`。这儿可以使用重定向来实现。访问`/`自动跳转到`/docs`。

```ts
import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  /* config options here */
  basePath: "/docs", // 基础路径
  redirects() {
    return [
      {
        source: "/", // 源路径
        destination: "/docs", // 目标路径
        basePath: false, // 是否使用basePath 默认情况下 source 和 destination 都会自动加上 basePath 前缀 就变成了/docs/docs 所以这儿不需要增加
        permanent: false, // 是否永久重定向
      },
    ];
  },
};

export default nextConfig;
```

如果使用`link`跳转的话，无需增加`basePath`前缀，因为`Link`组件会自动增加`basePath`前缀。 当他跳转`/home`时，会自动跳转到`/docs/home`。

```tsx
import Link from "next/link";
export default function Page() {
  return (
    <div>
      <h1>11111</h1>
      <Link href="/home">Home</Link>
    </div>
  );
}
```

### compress

compress配置用于`配置压缩`，例如：压缩js/css/html等。默认情况是`开启`的，如果需要关闭，可以配置为false。

```ts
import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  compress: true, // 压缩
};

export default nextConfig;
```

### 日志配置

日志配置用于配置日志，例如：显示完整的URL等。

```ts
import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  logging: {
    fetches: {
      fullUrl: true, // 显示完整的URL
    },
  },
};

export default nextConfig;
```

### 页面扩展 (参考MDX)

默认情况下，Next.js 接受以下扩展名的文件：`.tsx.js`、 `.js`、 `.ts`、`.jsx.md`、`.js.js`。可以修改此设置以允许其他扩展名，例如 markdown（.md.md、.md .mdx）。

### devIndicators

关闭调试指示器，默认情况下是开启的，如果需要关闭，可以配置为`false`。

```ts
import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  devIndicators: false, // 关闭开发指示器
  // devIndicators:{
  //   position:'bottom-right', //也支持放入其他位置 bottom-right bottom-left top-right top-left
  // },
};

export default nextConfig;
```

### generateEtags

Next.js会为静态文件生成`ETag`，用于缓存控制。默认情况下是`开启`的，如果需要关闭，可以配置为`false`。

浏览器会根据`ETag`来判断文件是否发生变化，如果发生变化，则重新下载文件。

```ts
import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  generateEtags: false, // 关闭生成ETag 默认开启
};

export default nextConfig;
```

### turbopack

Next.js已内置`turbopack`进行打包编译等操作，所以允许透传配置项给turbopack。

一般情况下是不需要做太多优化的，因为它都内置了例如`tree-shaking`、`压缩`、`按需编译`、`语法降级`等优化。

具体用法请查看: [turbopack](https://nextjs.org/docs/app/api-reference/config/next-config-js/turbopack)

## Next.js CSS方案

- Tailwind CSS(个人推荐)
- CSS Modules(创建css模块化，类似于Vue的单文件组件)
- Next.js内置Sass(css预处理器)
- 全局Css(全局的css，可以全局使用)
- Style(内联样式)
- css-in-js(类似于React的styled-components，不推荐)

## SEO

### SEO介绍

SEO(Search Engine Optimization)，即`搜索引擎优化`，是一种通过优化网站结构和内容，提高网站在搜索引擎中的排名，从而吸引更多流量和用户的策略。

::: tips
SEO是一个长期优化过程(一般优化1-3个月才能看到效果)，无需急于求成。
:::

#### 黑帽SEO

黑帽SEO是指通过不正当的手段，如关键词堆砌、隐藏文本、欺诈性链接等，来提高网站在搜索引擎中的排名。这种做法虽然可以在短期内获得较好的效果，但长期来看会对网站造成严重的负面影响，甚至可能导致网站被搜索引擎惩罚。

#### 白帽SEO

白帽SEO就是通过正当技术手段，例如优化`TDK`，优化网站结构，优化`robots.txt`，优化`sitemap.xml`，优化`JSON-LD`，优化`Open Graph`，优化`Web Vitals`等，来提高网站在搜索引擎中的排名。

### Google搜索引擎

Google 搜索是一款`全自动搜索引擎`，会使用名为“网页抓取工具”的软件定期探索网络，找出可添加到 Google 索引中的网页。实际上，Google 搜索结果中收录的大多数网页都不是手动提交的，而是网页抓取工具在探索网络时找到并自动添加的。

#### Google搜索引擎原理

Google 搜索的工作流程分为 3 个阶段:

1. `抓取`：Google 会使用名为“抓取工具”的自动程序从互联网上发现各类网页，并下载其中的文本、图片和视频。
2. `索引编制`：Google 会分析网页上的文本、图片和视频文件，并将信息存储在大型数据库 Google 索引中。
3. `呈现搜索结果`：当用户在 Google 中搜索时，Google 会返回与用户查询相关的信息。

抓取 --> 索引编制 --> 呈现搜索结果

### 排名标准

- 相关性
- 权威性
- 用户体验

### robots.txt

robots.txt是搜索引擎爬虫访问网站时遵循的规则，它告诉搜索引擎哪些页面可以抓取，哪些页面不能抓取。一般是存放在网站根目录下。

#### 参数说明

User-agent:
user-agent是搜索引擎爬虫的名称，例如`Googlebot`，`Baiduspider`，`Bingbot`，`YandexBot`，`Sogou spider`，`Yahoo! Slurp`，`BingPreview`等，也可以直接使用`*`表示所有搜索引擎爬虫都可以访问。

Disallow:
disallow是搜索引擎爬虫`不能访问`的页面，例如/admin/，/api/，/login/，/logout/等。

Allow:
allow是搜索引擎爬虫`可以访问`的页面，例如/，/about/，/contact/等。

Crawl-delay:
crawl-delay是搜索引擎爬虫访问网站的`间隔时间`，例如10，表示搜索引擎爬虫访问网站的间隔时间为10秒。

> 注意: Google机器人不支持该参数，其他部分爬虫机器人支持该参数

Sitemap:
sitemap是网站地图的URL

Host:
host是网站的域名

### Next.js中实现robots.txt

Next.js中实现robots.txt非常简单，我们是`AppRouter`，所以直接在`app`目录下创建一个`robots.ts`文件即可。

```ts
import type { MetadataRoute } from "next";
export default function robots(): MetadataRoute.Robots {
  return {
    // 如果是通用规则，可以这样写，就直接是一个对象类似于掘金
    // rules: {
    //    userAgent: '*',
    //    allow: '/',
    //    disallow: '/private/',
    //  },
    //自定义爬虫机器人规则可以用数组形式，就是一个数组类似于哔哩哔哩
    rules: [
      {
        userAgent: "Googlebot", //搜索引擎爬虫的名称
        allow: "/", //允许访问的页面
        disallow: "/api/", //不允许访问的页面
        crawlDelay: 10, //访问间隔时间(Google机器人不支持该参数，其他部分爬虫机器人支持该参数)
      },
      {
        userAgent: "Baiduspider",
        allow: "/",
        disallow: "/api/",
        crawlDelay: 10,
      },
      {
        userAgent: "Bingbot",
        allow: "/",
        disallow: "/api/",
        crawlDelay: 10,
      },
      {
        userAgent: "YandexBot",
        allow: "/",
        disallow: "/api/",
        crawlDelay: 10,
      },
      {
        userAgent: "Sogou spider",
        allow: "/",
        disallow: "/api/",
        crawlDelay: 10,
      },
    ],
    sitemap: "xxxx", //网站地图的URL
    //如果有多个可以写成一个数组
    //sitemaps: ['https://www.xxxxxx.com/sitemap.xml', 'https://www.xxxxxx.com/sitemap2.xml'],
  };
}
```

### sitemap.xml

sitemap.xml 是网站地图，用来向搜索引擎提供一批`希望被发现的页面 URL`（以及可选的更新时间、更新频率、优先级等提示信息），帮助爬虫更系统地遍历站点。哪些路径`不允许抓取`或`不希望被索引`，通常由 `robots.txt`、`noindex` 等机制单独声明，而不是靠 sitemap 来“禁止”。

#### 主要作用

1. 帮助搜索引擎发现页面 如果你是新网站，并且有大量的路由是深层级的，爬虫很难发现你的页面，这时候你可以使用sitemap.xml来告诉搜索引擎你的页面有哪些，方便搜索引擎抓取。
2. 利于被发现与纳入索引的考虑：例如掘金这类内容量很大的站点，会通过 sitemap（常按类型或分页拆成多个 XML）把文章 URL 结构化地提供给搜索引擎，**提高被抓取、被纳入索引的机会**

#### 常用字段与扩展

下面按 [Sitemaps.org 协议](https://www.sitemaps.org/protocol.html) 与常见的 Google 扩展（图片 / 视频）来说明。除 `loc` 外均为可选；扩展需在根节点声明对应` xmlns` 。

**`loc`**（必填）
页面 **绝对地址**（`http` / `https`），需与站点实际可访问 URL 一致，并对 `&`、`<` 等做 XML 转义（例如 `&` 写成 `&amp;`）。

示例：`https://www.example.com/page`、`https://www.example.com/page/1`

`lastmod`（可选）
**最后修改时间**，建议使用 W3C Datetime（与 [协议说明](https://www.sitemaps.org/protocol.html#xmlTagDefinitions) 一致）：

- 仅日期：`2026-04-20`
- 日期 + 时间（可带时区）：`2026-04-20T12:00:00+08:00`

尽量与页面真实变更时间一致；乱写可能被搜索引擎忽略。

`changefreq`（可选）
**相对**本站该 URL 的“预期更新频率”，协议允许取值如下（英文为写入 XML 的值）：

| 取值    | 含义               |
| ------- | ------------------ |
| always  | 每次访问都可能不同 |
| hourly  | 约每小时           |
| daily   | 约每天             |
| weekly  | 约每周             |
| monthly | 约每月             |
| yearly  | 约每年             |
| never   | 归档、基本不变     |

**注意**：这是协议里的提示字段。以 Google 为例，官方文档说明 **不会用 changefreq（以及下面的 priority）来决定抓取频率或排序**；其他爬虫是否参考也不统一。可填作兼容或自研爬虫的提示，但不要指望靠它“控制抓取周期”。

`priority`（可选）
**仅相对同一站点内**其他 URL 的重要程度，浮点数 `0.0–1.0`，默认 `0.5`。不是“全互联网排名优先级”，爬虫机器人会根据这个字段来决定抓取页面的优先级。(数字越大表示权重越高，爬虫机器人就会优先抓取)

图片扩展（可选）
在 **某个` <url>` 条目内** 使用 Google 图片扩展：`<image:image>`，命名空间一般为 `http://www.google.com/schemas/sitemap-image/1.1`。常见子标签：

| 标签          | 说明                 |
| ------------- | -------------------- |
| image:loc     | 图片 URL（核心字段） |
| image:caption | 图片说明（可选）     |
| image:title   | 图片标题（可选）     |

同一页面多张图可写多个 `<image:image>`

视频扩展（可选）
在 **某个 `<url>` 条目内** 使用 `<video:video>`，命名空间一般为 `http://www.google.com/schemas/sitemap-video/1.1`。面向 **Google 视频索引** 时，除标题、描述、封面外，通常还需要在 `video:content_loc`（媒体直链）与 `video:player_loc`（播放器页）**至少填写其一**（以 [Google 视频站点地图说明](https://developers.google.com/search/docs/crawling-indexing/sitemaps/video-sitemaps) 为准）。

**常用子标签一览**（是否必填随搜索引擎与场景略有差异，下表按常见用法归纳）：

| 标签                        | 常见要求                      | 含义                                       |
| --------------------------- | ----------------------------- | ------------------------------------------ |
| video:title                 | 必填                          | 视频标题                                   |
| video:thumbnail_loc         | 必填                          | 封面图 URL                                 |
| video:description           | 必填                          | 视频文字描述                               |
| video:content_loc           | 常与 player_loc 二选一或并存  | 视频文件地址                               |
| video:player_loc            | 常与 content_loc 二选一或并存 | 可嵌入播放器的页面 URL                     |
| video:duration              | 可选                          | 时长（秒）                                 |
| video:expiration_date       | 可选                          | 过期时间（W3C Datetime）                   |
| video:rating                | 可选                          | 评分                                       |
| video:view_count            | 可选                          | 播放次数                                   |
| video:publication_date      | 可选                          | 首次发布时间                               |
| video:family_friendly       | 可选                          | yes / no                                   |
| video:restriction           | 可选                          | 允许 / 禁止的国家或地区代码                |
| video:platform              | 可选                          | 允许 / 禁止的平台（如 web / mobile）       |
| video:requires_subscription | 可选                          | yes / no                                   |
| video:uploader              | 可选                          | 上传者信息（可用属性 info 等，见官方文档） |
| video:live                  | 可选                          | 是否直播：yes / no                         |
| video:tag                   | 可选                          | 标签                                       |

生成的基本结构如下:

在我们编写完`sitemap.ts`文件之后，Next.js会自动生成一个`sitemap.xml`文件。

```xml
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
  xmlns:video="http://www.google.com/schemas/sitemap-video/1.1"
>
  <url>
    <loc>https://example.com</loc>
    <image:image>
      <image:loc>http://localhost:3000/xxxxxxxxxx.jpg</image:loc>
    </image:image>
    <lastmod>2026-04-19T20:21:06.903Z</lastmod>
    <changefreq>yearly</changefreq>
    <priority>1</priority>
  </url>
  <url>
    <loc>https://example.com/about</loc>
    <video:video>
      <video:title>视频标题</video:title>
      <video:thumbnail_loc>http://localhost:3000/xxxxxxxxxx.jpg</video:thumbnail_loc>
      <video:description>视频描述</video:description>
      <video:duration>100</video:duration>
      <video:publication_date>Mon Apr 20 2026 04:21:06 GMT+0800 (中国标准时间)</video:publication_date>
    </video:video>
    <lastmod>2026-04-19T20:21:06.903Z</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://example.com/blog</loc>
    <lastmod>2026-04-19T20:21:06.903Z</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.5</priority>
  </url>
</urlset>
```

#### Next.js中实现sitemap.xml

我们使用的是`AppRouter`，所以直接在app目录下创建一个`sitemap.ts`文件即可。

```ts
import type { MetadataRoute } from "next";
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://example.com",
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 1,
      images: ["http://localhost:3000/xxxxxxxxxx.jpg"],
    },
    {
      url: "https://example.com/about",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
      videos: [
        {
          thumbnail_loc: "http://localhost:3000/xxxxxxxxxx.jpg",
          title: "视频标题",
          description: "视频描述",
          duration: 100,
          publication_date: new Date(),
        },
      ],
    },
    {
      url: "https://example.com/blog",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.5,
    },
  ];
}
```

#### 进阶用法：拆成多个 sitemap（`generateSitemaps`）

单文件 `app/sitemap.ts` 适合 URL 数量较少的情况。页面很多时（例如文章、商品各自成千上万条），更常见的做法是 **拆成多个 sitemap 文件**：既符合 [Sitemap 协议](https://www.sitemaps.org/protocol.html) 的实践，也便于控制单次生成的体积（例如 Google 建议 **每个 sitemap 最多约 5 万条 URL**）。

在 App Router 里可以这样做（摘自 [Next.js 文档：Generating multiple sitemaps](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap#generating-multiple-sitemaps)）：

1. 仍在 `app` 目录下使用 `sitemap.ts` / `sitemap.js`（或与 `sitemap.xml` 二选一，按项目约定）。
2. 额外导出 `generateSitemaps`：返回一组带 `id` 的对象，每个 `id` 对应一份子 sitemap。
3. 默认导出的 `sitemap` **函数**会带上当前这份子图的 `id`，你根据 `id` 去查库或拼不同前缀的路径即可。

**如何访问**

1. 子站点地图地址形如：`/sitemap/{id}.xml`，其中 `{id}` 与 `generateSitemaps()` 里返回的 `id` 一致（例如 `id: '1'` → 浏览器打开 `http://localhost:3000/sitemap/1.xml`）。
2. 若文件放在嵌套路由下（例如 `app/products/sitemap.ts`），则前缀会带上段路径，形如 `/products/sitemap/{id}.xml`（见 [generateSitemaps](https://nextjs.org/docs/app/api-reference/functions/generate-sitemaps) 文档中的 URL 说明）。
3. 启用多份 `sitemap` 后，根路径一般还会提供 `/sitemap.xml` 作为 站点**地图索引（sitemap index）**，里面列出各子 sitemap 的 URL，提交给搜索引擎时通常 **优先提交这份索引**。

### TDK ()
