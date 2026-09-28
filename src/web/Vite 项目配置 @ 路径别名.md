# Vite 项目配置 `@` 路径别名

## 1. 作用

在项目中使用 `@` 代替 `src` 目录，避免出现过长的相对路径：

```ts
// 不推荐
import Button from '../../../components/Button'

// 推荐
import Button from '@/components/Button'
```

这里的 `@` 通常约定指向项目的 `src` 目录。

## 2. Vite 8 推荐配置

Vite 8 已支持直接读取 TypeScript 的 `paths` 配置。推荐只在 `tsconfig` 中声明别名，然后在 Vite 中开启 `tsconfigPaths`。

### `tsconfig.json`

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

如果项目使用 Vite 新版模板，也可能需要配置在 `tsconfig.app.json` 中：

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### `vite.config.ts`

```ts
import { defineConfig } from 'vite'

export default defineConfig({
  resolve: {
    tsconfigPaths: true
  }
})
```

之后可以这样使用：

```ts
import Button from '@/components/Button'
import request from '@/utils/request'
import logo from '@/assets/logo.png'
```

## 3. 是否需要 `baseUrl`

现在通常不需要添加：

```ts
"baseUrl": "."
```

TypeScript 从 4.1 开始支持不依赖 `baseUrl` 的 `paths` 配置。`paths` 没有设置 `baseUrl` 时，会相对于当前 `tsconfig` 文件解析。

因此推荐使用：

```ts
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

而不是：

```ts
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
```

TypeScript 官方目前也不建议仅为了配合 `paths` 而添加 `baseUrl`。[官方说明](https://www.typescriptlang.org/tsconfig/baseUrl.html)

## 4. 旧项目的手动配置方式

如果项目没有启用 Vite 8 的 `resolve.tsconfigPaths`，可以在 `vite.config.ts` 中手动配置：

```ts
import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
```

同时保留 `tsconfig`：

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

这种方式适合：

- 旧版本 Vite；
- 项目没有启用 `resolve.tsconfigPaths`；
- 需要对别名做更复杂的自定义；
- 项目中存在多个特殊别名。

## 5. 常见错误

### 错误一：只配置 `tsconfig`

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

TypeScript 和编辑器可能能识别，但 Vite 没有开启 `tsconfigPaths` 时，运行或构建可能报错。

Vite 8 项目需要：

```json
resolve: {
  tsconfigPaths: true
}
```

### 错误二：只配置 Vite

只在 `vite.config.ts` 中写：

```json
resolve: {
  alias: {
    '@': '/src'
  }
}
```

项目运行可能正常，但 TypeScript、ESLint 或编辑器可能无法识别 `@`。

因此最好同时配置 `tsconfig`。

### 错误三：路径多写了一层 `src`

如果 `@` 已经指向 `src`，就不要再写：

```ts
import Button from '@/src/components/Button'
```

正确写法是：

```ts
import Button from '@/components/Button'
```

### 错误四：修改配置后没有重启

修改 `vite.config.ts` 或 `tsconfig.json` 后，如果编辑器仍然报错，可以：

1. 重启 Vite 开发服务器；
2. 在 VS Code 中执行 `TypeScript: Restart TS Server`；
3. 重新打开项目。

## 6. 多个别名的写法

可以在 `paths` 中配置多个别名：

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"],
      "@components/*": ["./src/components/*"],
      "@utils/*": ["./src/utils/*"],
      "@pages/*": ["./src/pages/*"]
    }
  }
}
```

使用示例：

```ts
import Button from '@components/Button'
import request from '@utils/request'
import Home from '@pages/Home'
```

不过普通项目通常只保留一个 `@` 别名即可，避免别名过多导致路径规则难以维护。

## 7. 最终记忆模板

新建或升级 Vite 8 项目时，直接使用下面这套配置：

`tsconfig.json` 或 `tsconfig.app.json`：

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

`vite.config.ts`：

```ts
import { defineConfig } from 'vite'

export default defineConfig({
  resolve: {
    tsconfigPaths: true
  }
})
```

记忆口诀：

> `tsconfig` 声明路径，Vite 开启读取；`@/*` 指向 `./src/*`，通常不需要 `baseUrl`。

Vite 8 的 `resolve.tsconfigPaths` 官方说明见：[Vite 8 配置文档](https://v8.vite.dev/blog/announcing-vite8)。