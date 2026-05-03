# package.json 与前端工程化工具说明

这份文档基于当前仓库的真实配置，说明下面几件事：

1. `package.json` 里的关键字段和脚本是做什么的
2. `ESLint`、`Prettier`、`Oxlint`、`vue-tsc` 分别负责什么
3. 它们在当前项目里是怎么协同工作的
4. 新建一个 Vue + TypeScript 项目时，应该如何接入这套工具链

## 1. 先看当前项目的配置结构

这个项目和代码质量、格式化直接相关的文件主要有这些：

- `package.json`：定义项目元信息、依赖、脚本命令
- `eslint.config.ts`：ESLint 规则配置
- `.oxlintrc.json`：Oxlint 规则配置
- `prettier.config.mjs`：Prettier 格式化配置
- `.prettierignore`：Prettier 忽略哪些文件
- `.editorconfig`：编辑器基础格式约束
- `tsconfig.json`、`tsconfig.app.json`、`tsconfig.node.json`：TypeScript 编译和类型检查配置

你可以把它们理解成一条流水线：

1. 编辑器根据 `.editorconfig` 提供最基础的缩进、换行、编码规则
2. Prettier 负责把代码排版成统一风格
3. Oxlint 先快速扫描一批常见问题
4. ESLint 再做更细的 Vue、TypeScript、项目规则检查
5. `vue-tsc` 最后做 TypeScript 类型层面的校验

## 2. package.json 里每个关键字段的作用

当前项目的 `package.json` 可以分成几部分看。

### 2.1 项目基础信息

- `name`
  项目名称。发包时会用到，当前项目是私有项目，主要是标识用途。

- `version`
  版本号。当前是 `0.0.0`，说明它不是一个要发布到 npm 的正式包。

- `private`
  设置为 `true` 后，npm/pnpm 不会把它当成可发布包误发出去。前端应用项目通常都建议开这个。

- `type`
  当前是 `module`，表示 Node 环境下优先按 ES Module 方式解析。这会影响配置文件和脚本的写法，所以 Prettier 配置用了 `prettier.config.mjs`。

- `engines`
  约束 Node 版本。当前项目要求 `^20.19.0 || >=22.12.0`，主要是为了避免团队成员用过旧的 Node 导致工具链行为不一致。

### 2.2 scripts 的作用

`scripts` 是整个工程化流程的入口。平时你运行的 `pnpm lint`、`pnpm format` 本质上都是这里定义的命令别名。

当前项目的脚本如下：

```json
{
  "dev": "vite --open",
  "build": "run-p type-check \"build-only {@}\" --",
  "build:test": "vue-tsc && vite build --mode test",
  "build:pro": "vue-tsc && vite build --mode production",
  "preview": "vite preview",
  "build-only": "vite build",
  "type-check": "vue-tsc --build",
  "lint": "oxlint . && eslint . --cache && vue-tsc --build",
  "lint:fix": "oxlint . --fix && eslint . --fix --cache",
  "lint:oxlint": "oxlint .",
  "lint:oxlint:fix": "oxlint . --fix",
  "lint:eslint": "eslint . --cache",
  "lint:eslint:fix": "eslint . --fix --cache",
  "format": "prettier --write . --ignore-unknown",
  "format:check": "prettier --check . --ignore-unknown"
}
```

这些脚本可以按用途分组理解。

#### 开发和构建相关

- `dev`
  启动 Vite 开发服务器，并自动打开浏览器。

- `build-only`
  只做 Vite 构建，不做额外类型校验。

- `build`
  通过 `run-p` 并行执行 `type-check` 和 `build-only`。也就是一边做类型检查，一边打包构建。

- `build:test`
  先运行 `vue-tsc`，再按 `test` 模式打包。

- `build:pro`
  先运行 `vue-tsc`，再按 `production` 模式打包。

- `preview`
  预览构建产物。

#### 类型检查相关

- `type-check`
  执行 `vue-tsc --build`。它会按 TypeScript/Vue 的配置检查类型是否正确，但不负责代码风格。

#### lint 相关

- `lint`
  当前项目最核心的质量检查命令，执行顺序是：
  `oxlint .` -> `eslint . --cache` -> `vue-tsc --build`

- `lint:fix`
  让 `oxlint` 和 `eslint` 尝试自动修复一部分问题。
  注意它没有把 `vue-tsc` 放进去，因为类型错误通常不能靠“自动修复”安全解决。

- `lint:oxlint`
  只跑 Oxlint。

- `lint:oxlint:fix`
  只跑 Oxlint 的自动修复。

- `lint:eslint`
  只跑 ESLint，并开启缓存。

- `lint:eslint:fix`
  只跑 ESLint 自动修复，并开启缓存。

#### 格式化相关

- `format`
  用 Prettier 重写全部可识别文件的格式。

- `format:check`
  检查格式是否符合 Prettier 规则，但不改文件。这个命令很适合放到 CI。

### 2.3 dependencies 和 devDependencies 的区别

- `dependencies`
  运行时依赖。也就是项目真正上线后还需要的包，比如 `vue`、`vue-router`、`pinia`、`element-plus`。

- `devDependencies`
  开发时依赖。只在本地开发、构建、检查、格式化时用到，比如 `eslint`、`prettier`、`oxlint`、`typescript`、`vite`。

这个项目里和本文最相关的开发依赖有：

- `eslint`：主 lint 工具
- `eslint-plugin-vue`：让 ESLint 理解 Vue 单文件组件
- `@vue/eslint-config-typescript`：Vue + TS 的官方 ESLint 规则组合
- `eslint-config-prettier`：关闭和 Prettier 冲突的 ESLint 格式规则
- `oxlint`：高性能 lint 工具
- `eslint-plugin-oxlint`：把部分 Oxlint 规则接入 ESLint 配置体系
- `prettier`：代码格式化工具
- `typescript`：TypeScript 编译器
- `vue-tsc`：Vue 项目的类型检查工具

## 3. ESLint、Prettier、Oxlint、vue-tsc 各自负责什么

这几个工具解决的不是同一类问题。

| 工具     | 核心职责           | 适合处理什么                                    |
| -------- | ------------------ | ----------------------------------------------- |
| ESLint   | 代码质量和规则约束 | 未使用变量、Vue 组件结构、命名方式、潜在错误    |
| Oxlint   | 更快的通用静态检查 | 常见错误、可疑写法、基础最佳实践                |
| Prettier | 代码格式化         | 分号、引号、缩进、换行、尾随逗号                |
| vue-tsc  | 类型检查           | 类型不匹配、接口错误、组件 props/返回值类型问题 |

### 3.1 ESLint 是什么

ESLint 是最灵活的 lint 工具。它的特点是：

- 支持 JavaScript、TypeScript、Vue
- 可以接很多插件
- 可以做项目定制规则
- 可以设置 `off`、`warn`、`error` 三种严重级别

当前项目的 ESLint 配置文件是 `eslint.config.ts`，使用的是 Flat Config 写法。

当前项目里，ESLint 主要做了这些事：

1. 指定要检查哪些文件
2. 忽略构建产物目录
3. 启用 Vue 官方基础规则
4. 启用 Vue + TypeScript 推荐规则
5. 读取 `.oxlintrc.json` 里的部分规则
6. 增加项目自己的自定义规则
7. 关闭和 Prettier 冲突的格式化类规则

当前项目里比较典型的 ESLint 规则有：

- `@typescript-eslint/no-unused-vars`
- `vue/block-order`
- `vue/component-name-in-template-casing`
- `vue/no-empty-component-block`

这些规则比较适合放在 ESLint，因为它们更偏“代码质量”和“框架约束”。

### 3.2 Oxlint 是什么

Oxlint 是 OXC 工具链里的 lint 工具，特点是快。它适合做第一层高速扫描。

当前项目的 Oxlint 配置文件是 `.oxlintrc.json`。它主要配置了：

- `plugins`
  决定启用哪些规则来源，比如 `eslint`、`typescript`、`vue`

- `ignorePatterns`
  决定哪些目录不扫描

- `categories`
  可以对一类问题统一设置级别，比如把 `correctness` 统一设成 `error`

- `rules`
  配置具体规则，比如 `eqeqeq`、`no-console`、`no-debugger`

- `options`
  配置一些全局行为，比如未使用的 `eslint-disable` 注释是否报错

当前项目更适合交给 Oxlint 的规则有：

- `eqeqeq`
- `no-console`
- `no-debugger`
- `prefer-const`

这类规则通常通用、简单、适合高性能扫描。

### 3.3 Prettier 是什么

Prettier 不负责判断业务逻辑对不对，它只负责一件事：统一代码排版。

当前项目的 Prettier 配置文件是 `prettier.config.mjs`，主要选项有：

- `semi: false`
  不加分号

- `singleQuote: true`
  优先使用单引号

- `printWidth: 100`
  建议单行宽度不超过 100

- `bracketSpacing: true`
  对象字面量花括号内保留空格

- `htmlWhitespaceSensitivity: 'ignore'`
  HTML 空白处理尽量宽松

- `endOfLine: 'lf'`
  统一用 LF 换行

- `trailingComma: 'all'`
  多行时尽可能保留尾随逗号

- `tabWidth: 2`
  一个缩进层级按 2 个空格处理

`.prettierignore` 用来声明哪些文件不做格式化，比如构建产物、缓存文件、锁文件等。

### 3.4 vue-tsc 是什么

`vue-tsc` 是给 Vue 单文件组件做类型检查的工具。它在很多 Vue + TypeScript 项目里都非常重要，因为普通的 ESLint 不能完整替代类型系统。

它更擅长发现这类问题：

- 传参类型不对
- 返回值类型不对
- 组件 props 类型不匹配
- 接口字段缺失
- `ref`、`computed`、函数返回值类型错误

所以在这个项目里，`lint` 脚本不是只跑 ESLint，而是把 `vue-tsc` 也接进来了。

## 4. 它们是怎么工作的

### 4.1 当前项目的执行顺序

日常检查时，当前项目推荐执行：

```bash
pnpm lint
pnpm format
```

其中 `pnpm lint` 的真实顺序是：

1. `oxlint .`
2. `eslint . --cache`
3. `vue-tsc --build`

你可以这样理解这个顺序：

1. 先用 Oxlint 做高速扫描，把一批通用问题尽快拦下来
2. 再用 ESLint 做更细的 Vue/TS/项目规则检查
3. 最后用 `vue-tsc` 做类型系统层面的严格校验

然后再执行：

```bash
pnpm format
```

让 Prettier 统一格式。

### 4.2 为什么 Prettier 不直接塞进 lint

因为 Prettier 和 ESLint 解决的问题不同。

- ESLint 关心“代码写得合不合理”
- Prettier 关心“代码排版是否统一”

如果把格式化和质量检查混成一件事，定位问题会更乱。当前项目把它们拆开，是更清晰的做法：

- `lint` 负责质量和类型
- `format` 负责排版

### 4.3 ESLint 和 Prettier 为什么不会打架

原因在 `eslint.config.ts` 最后接入了：

```ts
import skipFormatting from 'eslint-config-prettier/flat'
```

它的作用是关闭那些会和 Prettier 冲突的 ESLint 格式规则。这样职责就非常清楚：

- 格式问题交给 Prettier
- 非格式问题交给 ESLint

这一步很关键。如果没有它，常见情况是：

- ESLint 要求一种格式
- Prettier 又改成另一种格式
- 两边反复打架

### 4.4 为什么项目里同时有 Oxlint 和 ESLint

因为它们不是完全替代关系。

- Oxlint 更快，适合做第一层通用扫描
- ESLint 更灵活，生态更完整，适合做深度规则和框架规则

当前项目的设计思路是：

1. 用 Oxlint 先拦一批高性价比问题
2. 再用 ESLint 补上 Vue、TypeScript 和项目级规则

这是一种很实用的组合，不是为了“堆工具”，而是为了兼顾速度和可定制性。

## 5. 这些配置文件分别由谁读取

这件事最好单独搞清楚，不然很容易写了配置却不知道谁在生效。

| 文件                  | 主要被谁读取               | 作用                               |
| --------------------- | -------------------------- | ---------------------------------- |
| `package.json`        | pnpm / npm / Node / 工具链 | 依赖声明、脚本入口、项目元信息     |
| `eslint.config.ts`    | ESLint                     | 规则、文件范围、忽略目录、插件组合 |
| `.oxlintrc.json`      | Oxlint                     | Oxlint 的规则、分类、忽略目录      |
| `prettier.config.mjs` | Prettier                   | 格式化选项                         |
| `.prettierignore`     | Prettier                   | 忽略格式化的文件                   |
| `.editorconfig`       | 编辑器、部分格式化工具     | 缩进、换行、编码、行尾空格         |
| `tsconfig*.json`      | TypeScript、vue-tsc        | 编译和类型检查配置                 |

## 6. 新建一个项目时，应该如何使用这套工具

下面给你一套比较务实的接入顺序，适合新建 Vue + TypeScript 项目。

### 第一步：先有基础项目

你至少要先有这些基础能力：

- 包管理器，比如 `pnpm`
- 构建工具，比如 `Vite`
- 框架，比如 `Vue`
- TypeScript

如果是 Vue 项目，通常可以先通过 Vite 初始化一个 Vue + TS 项目。

### 第二步：安装工具

最小可用的一组开发依赖通常是：

```bash
pnpm add -D eslint prettier oxlint typescript vue-tsc eslint-config-prettier
```

如果是 Vue + TypeScript 项目，还要再补上：

```bash
pnpm add -D eslint-plugin-vue @vue/eslint-config-typescript
```

### 第三步：创建配置文件

至少建议准备这些文件：

1. `eslint.config.ts`
2. `.oxlintrc.json`
3. `prettier.config.mjs`
4. `.prettierignore`
5. `.editorconfig`
6. `tsconfig.json`

一个最小化示例可以是下面这样。

#### `eslint.config.ts`

```ts
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript'
import pluginVue from 'eslint-plugin-vue'
import skipFormatting from 'eslint-config-prettier/flat'

export default defineConfigWithVueTs(
  {
    files: ['**/*.{vue,ts,tsx,js,jsx}'],
  },
  ...pluginVue.configs['flat/essential'],
  vueTsConfigs.recommended,
  {
    rules: {
      'vue/no-empty-component-block': 'error',
    },
  },
  skipFormatting,
)
```

#### `.oxlintrc.json`

```json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "plugins": ["eslint", "typescript", "vue"],
  "ignorePatterns": ["dist", "node_modules"],
  "rules": {
    "eqeqeq": "error",
    "no-debugger": "error",
    "prefer-const": "error"
  }
}
```

#### `prettier.config.mjs`

```js
export default {
  semi: false,
  singleQuote: true,
  printWidth: 100,
  trailingComma: 'all',
  tabWidth: 2,
  endOfLine: 'lf',
}
```

#### `.editorconfig`

```ini
root = true

[*]
charset = utf-8
indent_style = space
indent_size = 2
insert_final_newline = true
trim_trailing_whitespace = true
end_of_line = lf
```

### 第四步：在 package.json 里定义脚本

推荐先有这几个：

```json
{
  "scripts": {
    "lint": "oxlint . && eslint . && vue-tsc --noEmit",
    "lint:fix": "oxlint . --fix && eslint . --fix",
    "format": "prettier --write . --ignore-unknown",
    "format:check": "prettier --check . --ignore-unknown"
  }
}
```

如果项目规模还小，这套已经够用了。

### 第五步：给编辑器接上自动格式化

推荐做法是：

1. 安装 EditorConfig、ESLint、Prettier 对应的编辑器插件
2. 保存时自动执行 Prettier
3. 平时开发用 `lint:fix` 修一轮
4. 提交前或 CI 里跑 `lint` 和 `format:check`

### 第六步：理解“规则应该写到哪里”

这是新项目里最容易混乱的地方。你可以按下面判断：

- 想统一代码排版
  改 `Prettier`

- 想约束代码质量或 Vue 写法
  改 `ESLint`

- 想先加一层高速通用扫描
  改 `Oxlint`

- 想统一缩进、换行、编码
  改 `.editorconfig`

- 想检查类型
  改 `tsconfig` 或通过 `vue-tsc` 执行

## 7. 一套推荐的日常使用方式

如果你在一个新项目里接入了这套工具，推荐这样使用：

### 本地开发时

```bash
pnpm lint:fix
pnpm format
```

这两个命令适合在你改完一批代码后跑一次。

### 提交前检查时

```bash
pnpm lint
pnpm format:check
```

这适合在提交前或者 CI 里执行。

### 遇到问题时怎么定位

- `format` 报错
  先看是不是纯格式问题，比如引号、缩进、换行

- `eslint` 报错
  看是不是规则约束、Vue 结构、未使用变量

- `oxlint` 报错
  看是不是一些通用的语法或最佳实践问题

- `vue-tsc` 报错
  看是不是类型定义、函数参数、接口结构不匹配

## 8. 当前项目的协同方式总结

当前仓库的这套配置，本质上是在做职责拆分：

- `package.json`
  负责把所有工具通过脚本串起来

- `Oxlint`
  负责第一层高性能扫描

- `ESLint`
  负责 Vue、TypeScript 和项目规则

- `Prettier`
  负责统一格式

- `vue-tsc`
  负责类型正确性

- `.editorconfig`
  负责编辑器层面的基础风格约束

如果只记一句话，可以记这个版本：

`package.json` 负责调度，`Oxlint` 先快扫，`ESLint` 做深查，`Prettier` 统一排版，`vue-tsc` 兜底类型安全。
