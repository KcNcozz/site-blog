# Tailwind CSS 4

## 一些小案例

- 卡片

```vue
<template>
  <div class="justify-center items-center flex h-screen bg-skyblue-100">
    <div>
      <div class="bg-gray-100 rounded-lg shadow-lg p-8">
        <img
          src="https://i.pravatar.cc/100"
          class="w-24 h-24 rounded-full mx-auto mb-4"
          alt="头像"
        />
        <h2 class="text-center text-xl font-bold">张三</h2>
        <p class="mb-2 text-center text-gray-400">前端开放工程师</p>
        <div class="flex justify-center gap-2 mb-4">
          <span class="bg-blue-100 text-blue-600 text-xs px-3 py-1 rounded-full"
            >React</span
          >
          <span
            class="bg-green-100 text-green-600 text-xs px-3 py-1 rounded-full"
            >Tailwind</span
          >
          <span
            class="bg-purple-100 text-purple-600 text-xs px-3 py-1 rounded-full"
            >Node.js</span
          >
        </div>
        <button
          class="bg-blue-500 text-white px-4 py-2 hover:bg-blue-600 rounded-lg w-full"
        >
          Follow
        </button>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup></script>
<style scoped></style>
```

- 表单

```vue
<template>
  <div class="flex justify-center items-center bg-gray-100 min-h-screen">
    <div
      class="w-full max-w-md flex bg-gray-100 rounded-2xl shadow-lg p-10 flex-col"
    >
      <div>
        <h2 class="text-2xl font-bold text-gray-800 mb-2">欢迎回来</h2>
        <p class="text-gray-400 text-sm mb-8">请登录您的账户</p>
      </div>
      <div>
        <div>
          <div class="mb-4">
            <label
              class="block mr-2 text-sm font-medium text-gray-700 mb-1"
              for="email"
              >邮箱</label
            >
            <input
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="email"
              id="email"
              placeholder="your@email.com"
            />
          </div>
          <div class="mb-6">
            <label
              class="block mr-2 text-sm font-medium text-gray-700 mb-1"
              for="password"
              >密码</label
            >
            <input
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="password"
              id="password"
              placeholder="******"
            />
          </div>
          <button
            type="submit"
            class="bg-blue-500 text-white px-4 py-2 hover:bg-blue-600 rounded-lg w-full"
          >
            登录
          </button>
          <p class="text-center text-sm text-gray-400 mt-6">
            没有账号？
            <a href="#" class="text-blue-500 hover:underline">立即注册</a>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref, reactive } from "vue";
</script>
<style scoped></style>
```

- 响应式页面

```vue
<template>
  <div class="flex justify-between items-center px-6 py-3 bg-gray-50 shadow-md">
    <div class="text-xl font-bold text-blue-600">MyBrand</div>
    <ul class="gap-8 text-gray-700 hidden md:flex text-sm">
      <li class="hover:text-blue-500"><a href="#">首页</a></li>
      <li class="hover:text-blue-500"><a href="#">关于</a></li>
      <li class="hover:text-blue-500"><a href="#">服务</a></li>
      <li class="hover:text-blue-500"><a href="#">联系</a></li>
    </ul>
    <div>
      <button
        class="text-white bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg transition hidden md:block"
      >
        开始使用
      </button>
      <!-- 移动端菜单图标 -->
      <button class="md:hidden text-gray-600 text-2xl">☰</button>
    </div>
  </div>
  <div class="flex justify-center items-center h-screen text-gray-400">
    页面内容区域
  </div>
</template>
<script lang="ts" setup></script>
<style scoped></style>
```

## 响应式

### 核心概念：移动优先

Tailwind 采用 **Mobile First（移动优先）** 策略：

- **不加前缀** = 所有屏幕都生效（从手机开始）
- **加前缀** = 该断点以上才生效

```html
<!-- 手机小字，md以上变大字 -->
<p class="text-sm md:text-xl">你好</p>
```

---

### 断点对照表

| 前缀   | 最小宽度 | 对应设备      |
| ------ | -------- | ------------- |
| 无前缀 | 0px      | 手机          |
| `sm:`  | 640px    | 大手机 / 横屏 |
| `md:`  | 768px    | 平板          |
| `lg:`  | 1024px   | 小笔记本      |
| `xl:`  | 1280px   | 桌面          |
| `2xl:` | 1536px   | 大屏显示器    |

---

### 常见响应式用法

1. 文字大小

```html
<h1 class="text-base sm:text-lg md:text-2xl lg:text-4xl font-bold">
  响应式标题
</h1>
```

2. 显示 / 隐藏

```html
<!-- 手机隐藏，md以上显示 -->
<div class="hidden md:block">电脑端才显示</div>

<!-- 手机显示，md以上隐藏 -->
<div class="block md:hidden">手机端才显示</div>
```

3. 列数变化（最常用）

```html
<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
  <div class="bg-blue-200 p-4 rounded">卡片 1</div>
  <div class="bg-blue-200 p-4 rounded">卡片 2</div>
  <div class="bg-blue-200 p-4 rounded">卡片 3</div>
  <div class="bg-blue-200 p-4 rounded">卡片 4</div>
</div>
```

```
手机：1列
sm：  2列
lg：  4列
```

4. 排列方向变化

```html
<!-- 手机竖排，md以上横排 -->
<div class="flex flex-col md:flex-row gap-4">
  <div class="bg-red-200 p-4 flex-1">左边</div>
  <div class="bg-blue-200 p-4 flex-1">右边</div>
</div>
```

5. 间距响应式

```html
<div class="p-4 md:p-8 lg:p-16">内容区域</div>
```

---

### 完整实战案例：响应式卡片页面

```html
<!DOCTYPE html>
<html lang="zh">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <script src="https://cdn.tailwindcss.com"></script>
  </head>
  <body class="bg-gray-100 p-4 md:p-8">
    <!-- 标题 -->
    <h1 class="text-xl md:text-3xl font-bold text-center text-gray-800 mb-6">
      我的作品集
    </h1>

    <!-- 卡片网格：手机1列 → 平板2列 → 电脑3列 -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <!-- 卡片 -->
      <div class="bg-white rounded-xl shadow p-6">
        <div class="bg-blue-100 h-36 rounded-lg mb-4"></div>
        <h2 class="text-lg font-semibold text-gray-800">项目一</h2>
        <p class="text-sm text-gray-500 mt-1">
          这是项目描述，简单介绍一下内容。
        </p>
        <button
          class="mt-4 bg-blue-500 hover:bg-blue-600 text-white text-sm px-4 py-2 rounded-lg w-full transition"
        >
          查看详情
        </button>
      </div>

      <div class="bg-white rounded-xl shadow p-6">
        <div class="bg-green-100 h-36 rounded-lg mb-4"></div>
        <h2 class="text-lg font-semibold text-gray-800">项目二</h2>
        <p class="text-sm text-gray-500 mt-1">
          这是项目描述，简单介绍一下内容。
        </p>
        <button
          class="mt-4 bg-green-500 hover:bg-green-600 text-white text-sm px-4 py-2 rounded-lg w-full transition"
        >
          查看详情
        </button>
      </div>

      <div class="bg-white rounded-xl shadow p-6">
        <div class="bg-purple-100 h-36 rounded-lg mb-4"></div>
        <h2 class="text-lg font-semibold text-gray-800">项目三</h2>
        <p class="text-sm text-gray-500 mt-1">
          这是项目描述，简单介绍一下内容。
        </p>
        <button
          class="mt-4 bg-purple-500 hover:bg-purple-600 text-white text-sm px-4 py-2 rounded-lg w-full transition"
        >
          查看详情
        </button>
      </div>
    </div>
  </body>
</html>
```

### 记忆口诀

```
无前缀  → 手机
sm:     → 大手机
md:     → 平板
lg:     → 电脑
xl:     → 大屏
```

> 写响应式时，**先写手机样式，再逐步加大屏样式**，这是最正确的顺序。

---

## 其他比CSS优势的地方

### Hover / Focus / Active

```html
<button
  class="
  bg-blue-500 
  hover:bg-blue-700 
  focus:ring-4 
  active:scale-95 
  transition duration-200
"
>
  点击我
</button>
```

---

### 表单状态

```html
<input
  class="
  border border-gray-300
  focus:border-blue-500
  focus:ring-2
  disabled:bg-gray-100
  disabled:cursor-not-allowed
  invalid:border-red-500
"
/>
```

---

### Group Hover（父元素悬停影响子元素）

```html
<div class="group bg-white hover:bg-blue-500 p-6 rounded-xl cursor-pointer">
  <h2 class="text-gray-800 group-hover:text-white font-bold">标题</h2>
  <p class="text-gray-400 group-hover:text-blue-100 text-sm">描述文字</p>
</div>
```

---

### 暗黑模式（Dark Mode）

```html
<!-- tailwind.config.js 设置 darkMode: 'class' -->

<div class="bg-white dark:bg-gray-900 text-gray-800 dark:text-white p-6">
  <h1 class="text-xl font-bold">自动适配暗黑模式</h1>
  <p class="text-gray-500 dark:text-gray-400">描述内容</p>
</div>
```

```
亮色：白底黑字
暗色：深色背景白字
只需在 html 标签加 class="dark" 即可切换
```

---

### 过渡动画

```html
<button
  class="bg-blue-500 hover:bg-blue-700 hover:scale-105 transition duration-300 ease-in-out"
>
  平滑过渡
</button>
```

---

### 内置动画

```html
<!-- 旋转加载 -->
<div
  class="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"
></div>

<!-- 闪烁骨架屏 -->
<div class="animate-pulse bg-gray-200 h-6 w-48 rounded"></div>

<!-- 弹跳 -->
<div class="animate-bounce text-2xl">👇</div>

<!-- 淡入淡出 -->
<div class="animate-ping w-4 h-4 bg-red-500 rounded-full"></div>
```

| 动画类           | 效果               |
| ---------------- | ------------------ |
| `animate-spin`   | 旋转（加载圈）     |
| `animate-pulse`  | 脉冲（骨架屏）     |
| `animate-bounce` | 弹跳               |
| `animate-ping`   | 扩散（消息提示点） |

---

### 自定义配置（tailwind.config.js）

可以扩展或覆盖默认配置：

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      // 自定义颜色
      colors: {
        brand: "#FF6B35",
        dark: "#1a1a2e",
      },
      // 自定义字体
      fontFamily: {
        sans: ["PingFang SC", "Microsoft YaHei", "sans-serif"],
      },
      // 自定义间距
      spacing: {
        128: "32rem",
      },
      // 自定义断点
      screens: {
        xs: "475px",
      },
    },
  },
};
```

```html
<!-- 使用自定义颜色 -->
<div class="bg-brand text-white">自定义颜色</div>
```

---

### 任意值（Arbitrary Values）

当默认值不够用时，可以直接写任意值：

```html
<!-- 任意颜色 -->
<div class="bg-[#ff6b35] text-[#1a1a2e]">自定义颜色</div>

<!-- 任意尺寸 -->
<div class="w-[350px] h-[200px] mt-[30px]">自定义尺寸</div>

<!-- 任意网格 -->
<div class="grid grid-cols-[1fr_2fr_1fr]">不均等三列</div>

<!-- 任意字体大小 -->
<p class="text-[13px] leading-[1.8]">精确控制</p>
```

> 方括号 `[]` 内写任何 CSS 值，非常灵活！

---

### @apply 复用样式

在 CSS 文件中复用 Tailwind 类，避免重复：

```css
/* styles.css */
.btn-primary {
  @apply bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition;
}

.card {
  @apply bg-white rounded-xl shadow-lg p-6;
}

.input-base {
  @apply w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:outline-none;
}
```

```html
<!-- HTML 中直接用 -->
<button class="btn-primary">提交</button>
<div class="card">卡片内容</div>
```

---

### Flexbox & Grid 工具

Tailwind 把 CSS Flexbox 和 Grid 完全封装：

```html
<!-- 水平垂直居中 -->
<div class="flex items-center justify-center h-screen">
  <p>完美居中</p>
</div>

<!-- 自动换行卡片布局 -->
<div class="flex flex-wrap gap-4">
  <div class="flex-1 min-w-[200px] bg-blue-100 p-4 rounded">卡片</div>
  <div class="flex-1 min-w-[200px] bg-green-100 p-4 rounded">卡片</div>
  <div class="flex-1 min-w-[200px] bg-red-100 p-4 rounded">卡片</div>
</div>

<!-- 复杂 Grid 布局 -->
<div class="grid grid-cols-12 gap-4">
  <div class="col-span-8 bg-blue-100 p-4">主内容</div>
  <div class="col-span-4 bg-gray-100 p-4">侧边栏</div>
</div>
```

---

### JIT 模式（即时编译）

Tailwind v3 默认开启 **Just-In-Time** 模式：

```
传统方式：提前生成所有 CSS → 文件巨大（MB级别）
JIT模式：用到哪个类才生成 → 文件极小（KB级别）
```

好处：

- 构建速度极快
- 支持任意值 `w-[350px]`
- 生产环境 CSS 文件很小

## 小技巧

1. 改变浏览器默认的重音颜色 `class="accent-pink-500"`
2. Fluid Texts `class="text-5xl sm:text-7xl"` --> `class="text-[min(10vw, 70px)]"`
3. file
4. highlight
5. less javascript
