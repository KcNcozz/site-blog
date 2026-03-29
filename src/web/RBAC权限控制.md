# Vue3+TS实现RBAC权限控制示例

## 核心结构

### 1. 类型定义 `types/rbac.ts`

```ts
export type Permission = string; // e.g. 'user:read', 'order:delete'

export interface Role {
  name: string;
  permissions: Permission[];
}

export interface UserInfo {
  id: number;
  roles: string[];
}
```

---

### 2. 权限 Store `stores/auth.ts`（Pinia）

```ts
import { defineStore } from "pinia";
import type { Permission, Role, UserInfo } from "@/types/rbac";

const roleMap: Record<string, Role> = {
  admin: {
    name: "admin",
    permissions: ["user:read", "user:write", "order:delete"],
  },
  editor: { name: "editor", permissions: ["user:read", "order:read"] },
  guest: { name: "guest", permissions: ["order:read"] },
};

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null as UserInfo | null,
  }),
  getters: {
    permissions(): Permission[] {
      if (!this.user) return [];
      return this.user.roles.flatMap((r) => roleMap[r]?.permissions ?? []);
    },
    hasPermission:
      (state) =>
      (perm: Permission): boolean => {
        const store = useAuthStore();
        return store.permissions.includes(perm);
      },
    hasRole:
      (state) =>
      (role: string): boolean =>
        state.user?.roles.includes(role) ?? false,
  },
  actions: {
    setUser(user: UserInfo) {
      this.user = user;
    },
    logout() {
      this.user = null;
    },
  },
});
```

---

### 3. 路由守卫 `router/index.ts`

```ts
import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/stores/auth";

const routes = [
  { path: "/", component: Home },
  { path: "/admin", component: Admin, meta: { roles: ["admin"] } },
  { path: "/orders", component: Orders, meta: { permissions: ["order:read"] } },
  { path: "/403", component: Forbidden },
];

const router = createRouter({ history: createWebHistory(), routes });

router.beforeEach((to) => {
  const auth = useAuthStore();

  const requiredRoles = to.meta.roles as string[] | undefined;
  if (requiredRoles?.length && !requiredRoles.some((r) => auth.hasRole(r))) {
    return "/403";
  }

  const requiredPerms = to.meta.permissions as string[] | undefined;
  if (
    requiredPerms?.length &&
    !requiredPerms.every((p) => auth.hasPermission(p))
  ) {
    return "/403";
  }
});

export default router;
```

---

### 4. 自定义指令 `directives/permission.ts`

```ts
import type { Directive } from "vue";
import { useAuthStore } from "@/stores/auth";

// 用法: v-permission="'user:write'"
export const vPermission: Directive<HTMLElement, string> = {
  mounted(el, binding) {
    const auth = useAuthStore();
    if (!auth.hasPermission(binding.value)) {
      el.remove(); // 或 el.style.display = 'none'
    }
  },
};
```

注册到 `main.ts`：

```ts
app.directive("permission", vPermission);
```

---

### 5. 组合式函数 `composables/usePermission.ts`

```ts
import { computed } from "vue";
import { useAuthStore } from "@/stores/auth";

export function usePermission() {
  const auth = useAuthStore();
  const can = (perm: string) => computed(() => auth.hasPermission(perm));
  const is = (role: string) => computed(() => auth.hasRole(role));
  return { can, is };
}
```

---

### 6. 组件中使用

```vue
<script setup lang="ts">
import { usePermission } from "@/composables/usePermission";
const { can } = usePermission();
</script>

<template>
  <!-- 指令方式 -->
  <button v-permission="'user:write'">新建用户</button>

  <!-- 响应式方式 -->
  <button v-if="can('order:delete').value">删除订单</button>
</template>
```

## 详细解析

逐步详细解释每一个部分的含义和作用。

### 第一步：类型定义 `types/rbac.ts`

```ts
export type Permission = string; // e.g. 'user:read', 'order:delete'

export interface Role {
  name: string;
  permissions: Permission[];
}

export interface UserInfo {
  id: number;
  roles: string[];
}
```

**这一步在做什么？**

这是整个 RBAC 系统的"数据蓝图"，用 TypeScript 定义了三个数据结构：

- `Permission`：就是一个字符串，表示某个操作权限，比如 `'user:read'` 表示"可以读取用户"，`'order:delete'` 表示"可以删除订单"
- `Role`：角色，有名字，并且拥有一组权限列表
- `UserInfo`：登录用户的信息，有 id，并且属于哪些角色（一个用户可以同时有多个角色）

**为什么要单独定义类型？**

TypeScript 的核心价值就是类型安全。定义好这些类型后，后续所有地方用到权限、角色、用户的地方，IDE 都会自动提示和校验，不会写错。

---

### 第二步：权限 Store `stores/auth.ts`

```ts
const roleMap: Record<string, Role> = {
  admin: {
    name: "admin",
    permissions: ["user:read", "user:write", "order:delete"],
  },
  editor: { name: "editor", permissions: ["user:read", "order:read"] },
  guest: { name: "guest", permissions: ["order:read"] },
};
```

**这是角色权限映射表**，相当于一张配置表：

| 角色   | 拥有的权限             |
| ------ | ---------------------- |
| admin  | 读用户、写用户、删订单 |
| editor | 读用户、读订单         |
| guest  | 只能读订单             |

实际项目中这张表通常从后端接口获取，不是硬编码在前端。

---

```ts
state: () => ({
  user: null as UserInfo | null,
}),
```

**Store 的状态**，就是存当前登录用户的信息。初始为 `null`，登录后才有值。

---

```ts
getters: {
  permissions(): Permission[] {
    if (!this.user) return []
    return this.user.roles.flatMap(r => roleMap[r]?.permissions ?? [])
  },
```

**计算当前用户拥有的所有权限**，逻辑是：

1. 用户没登录 → 返回空数组
2. 用户登录了 → 遍历他的所有角色，把每个角色的权限合并成一个大数组

举例：用户同时是 `admin` 和 `editor`，则权限合并为：

```
['user:read', 'user:write', 'order:delete', 'user:read', 'order:read']
```

---

```ts
  hasPermission: (state) => (perm: Permission): boolean => {
    const store = useAuthStore()
    return store.permissions.includes(perm)
  },
  hasRole: (state) => (role: string): boolean =>
    state.user?.roles.includes(role) ?? false,
```

- `hasPermission`：检查用户是否有某个权限，返回 `true/false`
- `hasRole`：检查用户是否属于某个角色，返回 `true/false`

这两个方法是后续路由守卫、指令、组件判断的核心依据。

---

```ts
actions: {
  setUser(user: UserInfo) { this.user = user },
  logout()               { this.user = null  },
},
```

- `setUser`：登录成功后调用，把用户信息存进 store
- `logout`：退出登录，清空用户信息

---

### 第三步：路由守卫 `router/index.ts`

```ts
const routes = [
  { path: "/", component: Home },
  { path: "/admin", component: Admin, meta: { roles: ["admin"] } },
  { path: "/orders", component: Orders, meta: { permissions: ["order:read"] } },
  { path: "/403", component: Forbidden },
];
```

**路由配置**，重点是 `meta` 字段：

- `/admin` 页面要求用户必须是 `admin` 角色才能访问
- `/orders` 页面要求用户必须有 `order:read` 权限才能访问
- `/403` 是没有权限时跳转的提示页面

`meta` 就是给路由附加自定义信息，路由守卫里会读取它。

---

```ts
router.beforeEach((to) => {
  const auth = useAuthStore();

  const requiredRoles = to.meta.roles as string[] | undefined;
  if (requiredRoles?.length && !requiredRoles.some((r) => auth.hasRole(r))) {
    return "/403";
  }

  const requiredPerms = to.meta.permissions as string[] | undefined;
  if (
    requiredPerms?.length &&
    !requiredPerms.every((p) => auth.hasPermission(p))
  ) {
    return "/403";
  }
});
```

**路由守卫**，每次跳转页面前都会执行这段代码，逻辑是：

1. 读取目标页面要求的角色 `requiredRoles`
   - 如果有要求，且用户一个都不满足 → 跳转 `/403`
2. 读取目标页面要求的权限 `requiredPerms`
   - 如果有要求，且用户不能全部满足 → 跳转 `/403`

注意：`some` 是"满足其中一个就行"，`every` 是"必须全部满足"，两种策略可以根据业务选择。

---

### 第四步：自定义指令 `directives/permission.ts`

```ts
export const vPermission: Directive<HTMLElement, string> = {
  mounted(el, binding) {
    const auth = useAuthStore();
    if (!auth.hasPermission(binding.value)) {
      el.remove();
    }
  },
};
```

**这是控制 DOM 元素显隐的指令**，用法是：

```html
<button v-permission="'user:write'">新建用户</button>
```

工作原理：

- 元素挂载到页面时（`mounted`）触发
- 读取指令的值，也就是权限字符串 `'user:write'`
- 检查当前用户有没有这个权限
- 没有权限 → 直接把这个 DOM 元素从页面上删掉

**和路由守卫的区别**：

- 路由守卫 → 控制整个页面能不能进入（页面级）
- 指令 → 控制页面内某个按钮/元素能不能看到（元素级）

---

### 第五步：组合式函数 `composables/usePermission.ts`

```ts
export function usePermission() {
  const auth = useAuthStore();
  const can = (perm: string) => computed(() => auth.hasPermission(perm));
  const is = (role: string) => computed(() => auth.hasRole(role));
  return { can, is };
}
```

**这是对 Store 的再封装**，让组件用起来更简洁。

返回两个方法：

- `can('order:delete')`：当前用户能不能做这个操作，返回响应式的布尔值
- `is('admin')`：当前用户是不是这个角色，返回响应式的布尔值

用 `computed` 包裹是因为：用户信息可能变化（比如刷新权限），`computed` 能自动追踪变化并更新视图。

---

### 第六步：组件中使用

```vue
<script setup lang="ts">
import { usePermission } from "@/composables/usePermission";
const { can } = usePermission();
</script>

<template>
  <!-- 指令方式 -->
  <button v-permission="'user:write'">新建用户</button>

  <!-- 响应式方式 -->
  <button v-if="can('order:delete').value">删除订单</button>
</template>
```

两种方式对比：

| 方式                 | 适合场景                         |
| -------------------- | -------------------------------- |
| `v-permission` 指令  | 简单的显隐控制，代码更简洁       |
| `can().value` 组合式 | 需要在 JS 逻辑中判断权限，更灵活 |

## 整体流程串联

```
用户登录
  ↓
调用 setUser() 存入 Store
  ↓
用户点击菜单跳转页面
  ↓
路由守卫检查角色/权限 → 无权限跳 /403
  ↓
进入页面，v-permission 指令检查每个按钮 → 无权限删除 DOM
  ↓
JS 逻辑中用 can() 动态判断是否执行某操作
```

这四层防护（Store → 路由 → 指令 → 组合式函数）覆盖了从页面到按钮的全部权限控制场景。

## 路由守卫 + 动态路由

### 路由守卫 (Navigation Guards)

**用途：控制路由导航的行为**，在路由跳转前/后执行逻辑。

1. 全局守卫

```js
const router = createRouter({ ... })

// 全局前置守卫（最常用）
router.beforeEach((to, from, next) => {
  const isLoggedIn = localStorage.getItem('token')

  if (to.meta.requiresAuth && !isLoggedIn) {
    next('/login')  // 未登录则重定向
  } else {
    next()          // 放行
  }
})

// 全局后置守卫
router.afterEach((to, from) => {
  document.title = to.meta.title || '默认标题'
})
```

2. 路由独享守卫

```js
const routes = [
  {
    path: "/admin",
    component: Admin,
    beforeEnter: (to, from, next) => {
      if (!isAdmin()) next("/403");
      else next();
    },
  },
];
```

3. 组件内守卫

```js
// 在 .vue 组件内
export default {
  beforeRouteEnter(to, from, next) {
    // 组件实例还未创建
    next((vm) => {
      /* 通过 vm 访问实例 */
    });
  },
  beforeRouteUpdate(to, from) {
    // 当前路由改变但组件被复用时
    this.fetchData(to.params.id);
  },
  beforeRouteLeave(to, from) {
    // 离开当前路由前
    if (this.hasUnsavedChanges) return false;
  },
};
```

---

### 动态路由 (Dynamic Routes)

**用途：在运行时动态添加/删除路由**，常用于权限系统按需加载路由。

### 动态路由参数（路径参数）

```js
// :id 是动态参数
const routes = [
  { path: "/user/:id", component: UserDetail },
  { path: "/article/:category/:id", component: Article },
];

// 组件中获取参数
import { useRoute } from "vue-router";
const route = useRoute();
console.log(route.params.id);
```

- 动态添加路由（addRoute）

```js
// 登录后根据权限动态添加路由
async function setupRoutesByRole(role) {
  if (role === "admin") {
    router.addRoute({
      path: "/admin",
      component: () => import("./views/Admin.vue"),
    });
    router.addRoute({
      path: "/stats",
      component: () => import("./views/Stats.vue"),
    });
  }
}

// 删除路由
router.removeRoute("routeName");
```

---

### 两者结合使用（典型权限方案）

```js
// 1. 路由守卫拦截所有导航
router.beforeEach(async (to, from, next) => {
  const token = localStorage.getItem("token");
  if (!token && to.path !== "/login") {
    return next("/login");
  }

  // 2. 动态路由：已登录但路由未初始化
  if (token && !store.state.routesLoaded) {
    const userRole = await fetchUserRole();

    // 根据角色动态添加路由
    const accessRoutes = generateRoutesByRole(userRole);
    accessRoutes.forEach((route) => router.addRoute(route));

    store.state.routesLoaded = true;

    // 重新导航，确保新路由生效
    return next({ ...to, replace: true });
  }

  next();
});
```

---

## 核心区别总结

| 维度         | 路由守卫                     | 动态路由                   |
| ------------ | ---------------------------- | -------------------------- |
| **本质**     | 导航拦截器/钩子函数          | 路由表的动态增删           |
| **解决问题** | 控制"能不能跳转"             | 控制"有没有这条路由"       |
| **执行时机** | 每次路由跳转时触发           | 程序运行中按需调用         |
| **典型场景** | 登录验证、权限检查、页面标题 | 按角色加载菜单、懒加载路由 |
| **核心 API** | `beforeEach` / `afterEach`   | `addRoute` / `removeRoute` |

## 实例

### 核心思路

```
用户登录 → 获取角色/权限 → 动态路由生成可访问菜单 → 路由守卫拦截非法访问
```

### 完整实现方案

1. 定义路由表（按权限分类）

```js
// router/routes.js

// 所有人都能访问的基础路由
export const constantRoutes = [
  { path: "/login", component: () => import("@/views/Login.vue") },
  { path: "/403", component: () => import("@/views/403.vue") },
  { path: "/", component: () => import("@/views/Home.vue") },
];

// 需要权限才能访问的路由（带 meta.roles 标识）
export const asyncRoutes = [
  {
    path: "/admin",
    component: () => import("@/views/Admin.vue"),
    meta: { roles: ["admin"] },
  },
  {
    path: "/editor",
    component: () => import("@/views/Editor.vue"),
    meta: { roles: ["admin", "editor"] },
  },
  {
    path: "/user",
    component: () => import("@/views/User.vue"),
    meta: { roles: ["admin", "editor", "viewer"] },
  },
];
```

---

2. 权限过滤工具函数

```js
// utils/permission.js

/**
 * 根据用户角色过滤路由
 * @param {Array} routes - 待过滤的路由
 * @param {String} role  - 用户角色
 */
export function filterRoutesByRole(routes, role) {
  return routes.filter((route) => {
    // 没有配置 roles，所有人可访问
    if (!route.meta?.roles) return true;

    // 检查用户角色是否在允许列表中
    return route.meta.roles.includes(role);
  });
}
```

---

3. Pinia 权限 Store

```js
// stores/permission.js
import { defineStore } from "pinia";
import { asyncRoutes, constantRoutes } from "@/router/routes";
import { filterRoutesByRole } from "@/utils/permission";
import router from "@/router";

export const usePermissionStore = defineStore("permission", {
  state: () => ({
    accessRoutes: [], // 当前用户可访问的路由
    isRoutesLoaded: false,
  }),

  actions: {
    async generateRoutes(role) {
      // 1. 根据角色过滤路由
      const accessRoutes = filterRoutesByRole(asyncRoutes, role);

      // 2. 动态添加到路由器
      accessRoutes.forEach((route) => router.addRoute(route));

      // 3. 保存到 store（用于生成侧边栏菜单）
      this.accessRoutes = [...constantRoutes, ...accessRoutes];
      this.isRoutesLoaded = true;
    },

    resetRoutes() {
      // 退出登录时清除动态路由
      this.accessRoutes = [];
      this.isRoutesLoaded = false;
    },
  },
});
```

---

4. 路由守卫（整个 RBAC 的入口）

```js
// router/guard.js
import router from "@/router";
import { usePermissionStore } from "@/stores/permission";
import { useUserStore } from "@/stores/user";

const WHITE_LIST = ["/login", "/403"];

router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore();
  const permissionStore = usePermissionStore();
  const token = userStore.token;

  // ① 未登录
  if (!token) {
    return WHITE_LIST.includes(to.path) ? next() : next("/login");
  }

  // ② 已登录，访问登录页 → 直接去首页
  if (to.path === "/login") {
    return next("/");
  }

  // ③ 已登录，路由已加载 → 正常放行
  if (permissionStore.isRoutesLoaded) {
    return next();
  }

  // ④ 已登录，首次进入，动态加载路由
  try {
    // 获取用户信息（包含角色）
    await userStore.fetchUserInfo();

    // 根据角色生成并注册动态路由
    await permissionStore.generateRoutes(userStore.role);

    // 重新导航（确保动态路由生效）
    next({ ...to, replace: true });
  } catch (error) {
    // token 失效等异常，清空登录状态
    userStore.logout();
    next("/login");
  }
});
```

---

5. 侧边栏菜单（动态路由驱动）

```vue
<!-- components/Sidebar.vue -->
<template>
  <nav>
    <router-link v-for="route in menuRoutes" :key="route.path" :to="route.path">
      {{ route.meta.title }}
    </router-link>
  </nav>
</template>

<script setup>
import { computed } from "vue";
import { usePermissionStore } from "@/stores/permission";

const permissionStore = usePermissionStore();

// 过滤掉不需要展示在菜单中的路由
const menuRoutes = computed(() =>
  permissionStore.accessRoutes.filter((r) => !r.meta?.hidden),
);
</script>
```

---

## 整体流程图

```
用户登录
   ↓
路由守卫 beforeEach 拦截
   ↓
有 Token？
  ├── 否 → 跳转 /login
  └── 是 ↓
      路由已加载？
        ├── 是 → 直接 next()
        └── 否 ↓
            fetchUserInfo() 获取角色
               ↓
            filterRoutesByRole() 过滤路由
               ↓
            addRoute() 注册动态路由
               ↓
            next({ ...to, replace: true }) 重新导航
               ↓
            侧边栏根据 accessRoutes 渲染菜单
```

---

### 总结

| 职责                  | 使用技术                   |
| --------------------- | -------------------------- |
| 拦截未登录/未授权访问 | 路由守卫 `beforeEach`      |
| 按角色分配可访问页面  | 动态路由 `addRoute`        |
| 动态生成侧边栏菜单    | 动态路由 + Pinia store     |
| 退出时清除权限        | `removeRoute` + store 重置 |
