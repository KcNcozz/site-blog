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
