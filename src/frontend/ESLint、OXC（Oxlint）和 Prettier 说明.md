# ESLint、OXC（Oxlint）和 Prettier 说明

这份文档基于当前项目的实际配置来解释三件事：

1. 它们分别是干什么的
2. 它们的规则一般写在哪里
3. 当前仓库是怎么把它们串起来的

## 先说结论

这三个工具解决的不是同一类问题：

| 工具         | 主要职责       | 处理内容                                            |
| ------------ | -------------- | --------------------------------------------------- |
| ESLint       | 代码质量检查   | 变量未使用、Vue 组件写法、TypeScript 规则、潜在 bug |
| OXC / Oxlint | 更快的静态检查 | 常见错误、可疑写法、部分风格和语义问题              |
| Prettier     | 代码格式化     | 分号、引号、换行、缩进、尾随逗号等                  |

可以把它们理解成：

- `ESLint` 负责“这段代码写得对不对、合不合理”
- `Oxlint` 负责“先快速扫一遍常见问题”
- `Prettier` 负责“把代码排版成统一样式”

## 当前项目的执行方式

当前项目在 [package.json](../package.json) 里配置了这些脚本：

```json
{
  "lint": "oxlint . && eslint . --cache && vue-tsc --build",
  "lint:fix": "oxlint . --fix && eslint . --fix --cache",
  "lint:oxlint": "oxlint .",
  "lint:eslint": "eslint . --cache",
  "format": "prettier --write . --ignore-unknown",
  "format:check": "prettier --check . --ignore-unknown"
}
```

它的意思是：

1. 先跑 `oxlint`
2. 再跑 `eslint`
3. 最后跑 `vue-tsc` 做类型检查
4. `prettier` 单独负责格式化，不混在 `lint` 里

这是比较常见的组合方式，因为三者关注点不同。

## 1. ESLint 有什么用

`ESLint` 是最灵活的代码检查工具。它的核心能力是：

- 按规则检查 JS / TS / Vue 代码
- 可以接入框架插件，比如 Vue、TypeScript
- 可以自定义规则级别：`off` / `warn` / `error`
- 可以针对不同文件类型使用不同规则

在 Vue 项目里，`ESLint` 通常是“主 lint 工具”。

### 当前项目的 ESLint 配置文件

当前仓库使用的是 Flat Config，新配置文件在：

- `eslint.config.ts`

这和旧的 `.eslintrc.js` / `.eslintrc.json` 不同。Flat Config 的特点是：配置本质上是一个数组，按顺序合并。

### 当前项目 ESLint 配置做了什么

当前 `eslint.config.ts` 主要做了几件事：

1. 指定要检查的文件类型
2. 忽略 `dist`、`coverage` 等目录
3. 启用 Vue 官方推荐规则
4. 启用 Vue + TypeScript 推荐规则
5. 读取 `.oxlintrc.json`，把一部分 Oxlint 规则接进 ESLint 配置链
6. 写了当前项目自己的自定义规则
7. 最后接入 `eslint-config-prettier`，关闭和 Prettier 冲突的格式类规则

核心结构大致是这样：

```ts
export default defineConfigWithVueTs(
  {
    files: ["**/*.{vue,js,mjs,cjs,ts,mts,cts,tsx}"],
  },
  globalIgnores(["**/dist/**", "**/dist-ssr/**", "**/coverage/**"]),
  ...pluginVue.configs["flat/essential"],
  vueTsConfigs.recommended,
  ...pluginOxlint.buildFromOxlintConfigFile(".oxlintrc.json"),
  {
    rules: {
      "@typescript-eslint/no-unused-vars": "warn",
      "vue/block-order": "error",
    },
  },
  skipFormatting,
);
```

### ESLint 规则怎么设置

ESLint 的规则一般写在 `rules` 字段里：

```ts
{
  rules: {
    'no-console': 'warn',
    'no-debugger': 'error',
    '@typescript-eslint/no-unused-vars': 'warn',
  },
}
```

规则值常见有三种写法：

```ts
'no-console': 'off'
'no-console': 'warn'
'no-console': 'error'
```

如果规则需要额外参数，就写成数组：

```ts
'@typescript-eslint/no-unused-vars': [
  'warn',
  {
    argsIgnorePattern: '^_',
    varsIgnorePattern: '^_',
  },
]
```

当前项目里这个规则的意思是：

- 未使用变量只报 `warn`
- 如果变量名以下划线 `_` 开头，就认为是“有意不使用”，不报错

### ESLint 适合管什么

更适合交给 ESLint 的通常是：

- Vue 组件结构规则
- TypeScript 语义规则
- 未使用变量
- 组件命名方式
- 空 block、危险写法、框架约束

例如当前项目就配了：

- `vue/block-order`
- `vue/component-name-in-template-casing`
- `vue/no-empty-component-block`
- `@typescript-eslint/no-unused-vars`

## 2. OXC / Oxlint 有什么用

严格来说，`OXC` 是一整套 Rust 实现的前端工具链，当前项目实际用到的是它的 lint 工具 `oxlint`。

你可以把它理解成：

- `OXC` 是项目名
- `oxlint` 是其中的 lint 工具

### Oxlint 的特点

`oxlint` 的优势主要是快，适合先做一轮高性能扫描。它通常用来抓：

- 明显的错误
- 可疑代码
- 一些常见最佳实践问题

在大项目里，很多团队会把它放在 `eslint` 前面跑。

### 当前项目的 Oxlint 配置文件

当前仓库的配置文件是：

- `.oxlintrc.json`

当前内容大致分成几块：

```json
{
  "plugins": ["eslint", "typescript", "unicorn", "oxc", "vue"],
  "env": {
    "browser": true
  },
  "ignorePatterns": ["dist", "dist-ssr", "coverage", "node_modules"],
  "categories": {
    "correctness": "error",
    "suspicious": "warn"
  },
  "rules": {
    "eqeqeq": "error",
    "no-console": "warn",
    "no-debugger": "error",
    "prefer-const": "error"
  }
}
```

### Oxlint 规则怎么设置

Oxlint 的规则主要写在这几个地方：

- `plugins`
- `categories`
- `rules`
- `ignorePatterns`
- `options`

#### 1. `plugins`

决定启用哪些规则来源，例如：

- `eslint`
- `typescript`
- `vue`
- `unicorn`
- `oxc`

#### 2. `categories`

按类别统一设定严重级别，例如：

```json
"categories": {
  "correctness": "error",
  "suspicious": "warn"
}
```

意思是：

- 和正确性强相关的问题，默认按 `error`
- 可疑问题，默认按 `warn`

这是一种“先给大类定基调”的方式。

#### 3. `rules`

对具体规则单独覆盖：

```json
"rules": {
  "eqeqeq": "error",
  "no-console": "warn",
  "no-debugger": "error",
  "prefer-const": "error"
}
```

这和 ESLint 的思路很像，也是通过 `off` / `warn` / `error` 控制。

#### 4. `ignorePatterns`

指定哪些目录不检查：

```json
"ignorePatterns": ["dist", "dist-ssr", "coverage", "node_modules"]
```

#### 5. `options`

一些全局行为开关，例如当前项目：

```json
"options": {
  "reportUnusedDisableDirectives": "error"
}
```

它的意思是：如果你写了禁用 lint 的注释，但实际没用上，也要报错。

### Oxlint 更适合管什么

更适合交给 Oxlint 的通常是：

- 通用的 JS / TS 常见错误
- 快速扫描
- 能自动修复的一些简单问题
- CI 里先跑一轮高性能 lint

当前项目里就把下面这些放在了 Oxlint：

- `eqeqeq`
- `no-console`
- `no-debugger`
- `prefer-const`

## 3. Prettier 有什么用

`Prettier` 不关心业务逻辑，也不主要关心“代码有没有 bug”。它只做一件事：统一格式。

比如它会管：

- 用不用分号
- 用单引号还是双引号
- 一行最多多长
- 缩进几个空格
- 尾随逗号要不要保留
- HTML / Vue 模板换行怎么排

所以 Prettier 本质上不是“代码质量规则工具”，而是“格式规则工具”。

### 当前项目的 Prettier 配置文件

当前仓库使用：

- `.prettierrc.json`
- `.prettierignore`

配置如下：

```json
{
  "semi": false,
  "singleQuote": true,
  "printWidth": 100,
  "bracketSpacing": true,
  "htmlWhitespaceSensitivity": "ignore",
  "endOfLine": "lf",
  "trailingComma": "all",
  "tabWidth": 2
}
```

### Prettier “规则”怎么设置

严格说，Prettier 这里更准确的叫法不是“lint 规则”，而是“格式化选项”。

常见写法就是直接在 `.prettierrc.json` 里配置：

```json
{
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2
}
```

当前项目这几个选项的含义是：

- `semi: false` 不加分号
- `singleQuote: true` 字符串优先单引号
- `printWidth: 100` 一行建议不超过 100 个字符
- `trailingComma: all` 尽量保留尾随逗号
- `tabWidth: 2` 使用 2 空格缩进
- `endOfLine: lf` 统一换行符为 `LF`

### `.prettierignore` 是做什么的

这个文件决定哪些文件不要被格式化。当前项目忽略了：

- `node_modules`
- `dist`
- `dist-ssr`
- `coverage`
- `.eslintcache`
- 各种 lock 文件

这类文件通常没必要格式化。

## 4. 它们之间怎么配合

当前项目的配合方式可以概括为：

- `Oxlint` 负责先做一轮快速扫描
- `ESLint` 负责更细的 Vue / TS 规则和项目定制规则
- `Prettier` 负责统一格式

### 为什么 ESLint 里还要加 `eslint-config-prettier`

当前 `eslint.config.ts` 最后有一项：

```ts
import skipFormatting from "eslint-config-prettier/flat";

export default defineConfigWithVueTs(
  // ...
  skipFormatting,
);
```

它的作用是：

- 关闭 ESLint 里那些会和 Prettier 冲突的“格式类规则”
- 避免出现“ESLint 要这样排版，Prettier 又要那样排版”的冲突

这基本是 ESLint + Prettier 组合里的标准做法。

## 5. 什么时候该改谁的配置

可以按下面的思路判断：

### 想控制代码风格

比如：

- 单引号还是双引号
- 要不要分号
- 一行长度
- 缩进宽度

这些改 `Prettier`。

### 想控制代码质量或框架约束

比如：

- 禁止未使用变量
- Vue 组件 block 顺序
- 模板里的组件命名方式
- 禁止空组件块

这些改 `ESLint`。

### 想加一层更快的通用扫描

比如：

- 禁止 `==`
- 禁止 `debugger`
- 更倾向 `const`

这些适合改 `Oxlint`。

## 6. 当前项目里“规则写在哪”的速查表

| 需求                     | 应该改哪里                                   |
| ------------------------ | -------------------------------------------- |
| Vue / TS lint 规则       | `eslint.config.ts`                           |
| Oxlint 规则              | `.oxlintrc.json`                             |
| 代码格式                 | `.prettierrc.json`                           |
| 不想被格式化的文件       | `.prettierignore`                            |
| 不想被 Oxlint 扫描的目录 | `.oxlintrc.json` 的 `ignorePatterns`         |
| 不想被 ESLint 扫描的目录 | `eslint.config.ts` 里的 `globalIgnores(...)` |

## 7. 实际修改示例

### 例 1：想禁止 `console`

如果你希望它是质量规则，可以放在 Oxlint：

```json
"rules": {
  "no-console": "error"
}
```

也可以放在 ESLint：

```ts
rules: {
  'no-console': 'error',
}
```

如果两边都配了，就要注意不要重复制造噪音。一般建议明确主次。

### 例 2：想允许以下划线开头的未使用参数

这类更适合 ESLint + TypeScript 规则：

```ts
'@typescript-eslint/no-unused-vars': [
  'warn',
  {
    argsIgnorePattern: '^_',
    varsIgnorePattern: '^_',
  },
]
```

### 例 3：想统一成双引号和保留分号

这类改 Prettier：

```json
{
  "semi": true,
  "singleQuote": false
}
```

## 8. 一句话区分三者

如果只记一句话，可以记这个版本：

- `ESLint` 管“代码质量和规则约束”
- `Oxlint` 管“更快的通用 lint 扫描”
- `Prettier` 管“代码长什么样”

## 9. 当前项目的推荐使用方式

平时开发建议这样用：

```bash
pnpm lint
pnpm format
```

如果要自动修复：

```bash
pnpm lint:fix
pnpm format
```

顺序上通常先修 lint，再做格式化会更清晰。
