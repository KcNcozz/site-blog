# 随便写

## SPA

SSR：服务器渲染（HTML CSS JS data都在服务器渲染好了再发送到浏览器） 第一次渲染的时候 SSR是快于SPA 但是当用户量足够多时，CPU负载太大

SPA ：单页面应用 客户端渲染（CSR） （HTML CSS JS和data分别在两个不同的服务器上 发到浏览器在组装）虽然速度慢 但是解放服务器压力 也可以解耦（前后端分离）

## pnpm

### 依赖安装

| npm                            | pnpm                             |
| ------------------------------ | -------------------------------- |
| `npm install`                  | `pnpm install`                   |
| `npm install pkg`              | `pnpm add pkg`                   |
| `npm install -D pkg`           | `pnpm add -D pkg`                |
| `npm install -g pkg`           | `pnpm add -g pkg`                |
| `npm install --save-exact pkg` | `pnpm add --save-exact pkg`      |
| `npm install pkg@1.0.0`        | `pnpm add pkg@1.0.0`             |
| `npm ci`                       | `pnpm install --frozen-lockfile` |

---

### 依赖卸载

| npm                    | pnpm                 |
| ---------------------- | -------------------- |
| `npm uninstall pkg`    | `pnpm remove pkg`    |
| `npm uninstall -g pkg` | `pnpm remove -g pkg` |

---

### 依赖更新

| npm                 | pnpm                 |
| ------------------- | -------------------- |
| `npm update`        | `pnpm update`        |
| `npm update pkg`    | `pnpm update pkg`    |
| `npm update -g pkg` | `pnpm update -g pkg` |
| `npm outdated`      | `pnpm outdated`      |

---

### 脚本执行

| npm             | pnpm                             |
| --------------- | -------------------------------- |
| `npm run dev`   | `pnpm dev` 或 `pnpm run dev`     |
| `npm run build` | `pnpm build` 或 `pnpm run build` |
| `npm run test`  | `pnpm test` 或 `pnpm run test`   |
| `npm start`     | `pnpm start`                     |

> pnpm 可以省略 `run`，直接写脚本名

---

### 远程执行

| npm              | pnpm              |
| ---------------- | ----------------- |
| `npx pkg`        | `pnpm dlx pkg`    |
| `npm create xxx` | `pnpm create xxx` |
| `npx create-xxx` | `pnpm create xxx` |

---

### 项目初始化

| npm           | pnpm                      |
| ------------- | ------------------------- |
| `npm init`    | `pnpm init`               |
| `npm init -y` | `pnpm init` （默认即yes） |

---

### 查看信息

| npm                  | pnpm                  |
| -------------------- | --------------------- |
| `npm list`           | `pnpm list`           |
| `npm list --depth=0` | `pnpm list --depth=0` |
| `npm list -g`        | `pnpm list -g`        |
| `npm info pkg`       | `pnpm info pkg`       |
| `npm view pkg`       | `pnpm view pkg`       |

---

### 缓存管理

| npm                       | pnpm                               |
| ------------------------- | ---------------------------------- |
| `npm cache clean --force` | `pnpm store prune`                 |
| `npm cache verify`        | `pnpm store status`                |
| ——                        | `pnpm store path`（查看store路径） |

---

### 版本管理

| npm                 | pnpm                 |
| ------------------- | -------------------- |
| `npm version patch` | `pnpm version patch` |
| `npm version minor` | `pnpm version minor` |
| `npm version major` | `pnpm version major` |
| `npm -v`            | `pnpm -v`            |

---

### 发布相关

| npm           | pnpm           |
| ------------- | -------------- |
| `npm publish` | `pnpm publish` |
| `npm login`   | `pnpm login`   |
| `npm logout`  | `pnpm logout`  |
| `npm whoami`  | `pnpm whoami`  |

---

### Monorepo / Workspace

| npm                           | pnpm                                  |
| ----------------------------- | ------------------------------------- |
| `npm install -w packages/foo` | `pnpm add pkg --filter foo`           |
| `npm run dev -w packages/foo` | `pnpm --filter foo dev`               |
| ——                            | `pnpm -r run build`（递归执行所有包） |

> pnpm 的 workspace 支持更强大，是 monorepo 首选

---

### 总结

> 90% 的命令只需把 `npm` 换成 `pnpm`，主要区别是：
>
> - `npm install pkg` → `pnpm add pkg`
> - `npx` → `pnpm dlx`
> - `npm cache clean` → `pnpm store prune`

## Express
