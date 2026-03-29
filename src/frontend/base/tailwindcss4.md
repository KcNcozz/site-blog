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

1. 改变浏览器默认的重音颜色 `class="accent-pink-500"`
2. Fluid Texts `class="text-5xl sm:text-7xl"` --> `class="text-[min(10vw, 70px)]"`
3. file
4. highlight
5. less javascript
