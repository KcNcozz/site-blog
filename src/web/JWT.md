# JWT(JSON Web Tokens)

它主要用来做两件事：

1. **签发 JWT**
2. **验证 JWT**

---

## 1. 安装

```bash
npm i jsonwebtoken
npm i -D @types/jsonwebtoken

pnpm add jsonwebtoken
pnpm add @types/jsonwebtoken -D

npm i express
npm i -D @types/express
```

---

## 2. 最基础用法

### 签发 token

```js
import jwt from "jsonwebtoken";

const secret = "your-secret-key";

const token = jwt.sign(
  { userId: 123, username: "tom" }, // payload
  secret, // 密钥
  { expiresIn: "2h" }, // 2小时过期
);

console.log(token);
```

---

### 验证 token

```js
const jwt = require("jsonwebtoken");

const secret = "your-secret-key";
const token = "上面生成的token";

try {
  const decoded = jwt.verify(token, secret);
  console.log("验证通过:", decoded);
} catch (err) {
  console.log("验证失败:", err.message);
}
```

验证成功后，`decoded` 会包含你签发时放进去的 payload，以及自动生成的时间字段，比如：

- `iat`: 签发时间
- `exp`: 过期时间

---

## 3. 常用 API

---

### `jwt.sign(payload, secretOrPrivateKey, options)`

用于生成 JWT。

```js
const token = jwt.sign({ userId: 1 }, "my-secret", {
  expiresIn: "1d",
  issuer: "my-app",
  audience: "my-users",
});
```

常用参数：

- `expiresIn`: 过期时间，如：
  - `60`
  - `'10m'`
  - `'2h'`
  - `'7d'`
- `issuer`: 签发者
- `audience`: 接收方
- `subject`: 主题
- `algorithm`: 签名算法，默认通常是 `HS256`

---

### `jwt.verify(token, secretOrPublicKey, options)`

用于验证 JWT 是否有效。

```js
try {
  const decoded = jwt.verify(token, "my-secret", {
    issuer: "my-app",
    audience: "my-users",
  });
  console.log(decoded);
} catch (err) {
  console.error(err.name, err.message);
}
```

常见错误：

- `TokenExpiredError`: token 过期
- `JsonWebTokenError`: token 非法
- `NotBeforeError`: token 还没到生效时间

---

### `jwt.decode(token)`

只做**解析**，**不验证签名**。

```js
const decoded = jwt.decode(token);
console.log(decoded);
```

这个方法只能用来“看内容”，**不能拿来做身份认证**。

---

## 4. 一个完整登录示例

---

### 登录时签发 token

```js
const express = require("express");
const jwt = require("jsonwebtoken");

const app = express();
app.use(express.json());

const SECRET = "my-secret";

app.post("/login", (req, res) => {
  const { username, password } = req.body;

  // 这里只是演示，实际要查数据库
  if (username !== "admin" || password !== "123456") {
    return res.status(401).json({ message: "用户名或密码错误" });
  }

  const token = jwt.sign({ userId: 1, username: "admin" }, SECRET, {
    expiresIn: "1h",
  });

  res.json({ token });
});
```

---

### 访问受保护接口时验证 token

```js
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "缺少 Authorization" });
  }

  const token = authHeader.startsWith("Bearer ")
    ? authHeader.slice(7)
    : authHeader;

  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "token 无效或已过期" });
  }
}

app.get("/profile", authMiddleware, (req, res) => {
  res.json({
    message: "这是受保护的数据",
    user: req.user,
  });
});

app.listen(3000, () => {
  console.log("server running at http://localhost:3000");
});
```

---

## 5. 前端怎么传 token

一般放在请求头里：

```http
Authorization: Bearer <token>
```

例如：

```js
fetch("/profile", {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});
```

---

## 6. 推荐做法

### 1）不要把敏感信息放进 payload

JWT 的 payload 只是 **Base64 编码**，不是加密。
别人拿到 token 后可以解码看到内容。

**不要放：**

- 明文密码
- 银行卡号
- 身份证号
- 很敏感的业务数据

---

### 2）密钥放环境变量

不要把 secret 写死在代码里。

```js
const SECRET = process.env.JWT_SECRET;
```

`.env` 示例：

```env
JWT_SECRET=super-long-random-string
```

---

### 3）设置过期时间

不要发永久 token。

```js
{
  expiresIn: "1h";
}
```

常见做法：

- access token：15 分钟 ~ 2 小时
- refresh token：更长时间

---

### 4）验证时限制算法

如果你明确知道使用什么算法，最好指定：

```js
jwt.verify(token, SECRET, {
  algorithms: ["HS256"],
});
```

---

## 7. HS256 和 RS256 的区别

### HS256

- 最简单
- 一个密钥既能签发也能验证

```js
const token = jwt.sign({ userId: 1 }, SECRET, { algorithm: "HS256" });
const decoded = jwt.verify(token, SECRET, { algorithms: ["HS256"] });
```

适合单体应用、内部服务。

---

### RS256

- 用**私钥签发**
- 用**公钥验证**
- 更适合多服务、第三方验证场景

```js
const fs = require("fs");
const jwt = require("jsonwebtoken");

const privateKey = fs.readFileSync("./private.key");
const publicKey = fs.readFileSync("./public.key");

const token = jwt.sign({ userId: 1 }, privateKey, {
  algorithm: "RS256",
  expiresIn: "1h",
});

const decoded = jwt.verify(token, publicKey, {
  algorithms: ["RS256"],
});

console.log(decoded);
```

---

## 8. 异步写法

### sign 异步

```js
jwt.sign({ userId: 1 }, SECRET, { expiresIn: "1h" }, (err, token) => {
  if (err) {
    return console.error(err);
  }
  console.log(token);
});
```

### verify 异步

```js
jwt.verify(token, SECRET, (err, decoded) => {
  if (err) {
    return console.error("验证失败", err.message);
  }
  console.log("验证成功", decoded);
});
```

---

## 9. 常见坑

### 坑 1：`decode` 不是 `verify`

```js
jwt.decode(token);
```

只是解析，不安全。
真正校验身份一定要用：

```js
jwt.verify(token, secret);
```

---

### 坑 2：secret 不一致

签发和验证必须用同一个 secret（或同一对私钥/公钥）。

---

### 坑 3：Authorization 里有 `Bearer `

很多人直接拿整个 header 去 verify，会报错。
要把前缀去掉：

```js
const token = authHeader.replace(/^Bearer\s+/, "");
```

---

### 坑 4：token 过期

如果你设置了：

```js
expiresIn: "1h";
```

1小时后验证会抛 `TokenExpiredError`。

---

## 10. 一个最小可运行示例

```js
const jwt = require("jsonwebtoken");

const SECRET = "demo-secret";

// 生成 token
const token = jwt.sign({ userId: 1001, role: "admin" }, SECRET, {
  expiresIn: "1h",
});

console.log("token =", token);

// 验证 token
try {
  const result = jwt.verify(token, SECRET);
  console.log("decoded =", result);
} catch (err) {
  console.error(err.message);
}
```

## TS中使用

如果你的 `tsconfig.json` 开了：

```json
{
  "compilerOptions": {
    "esModuleInterop": true
  }
}
```

可以这样写：

```ts
import jwt, { JwtPayload, SignOptions, Secret } from "jsonwebtoken";
```

如果没开 `esModuleInterop`，用这个：

```ts
import * as jwt from "jsonwebtoken";
```

下面我默认使用第一种写法。

## 签发 token

```ts
import jwt from "jsonwebtoken";

const SECRET = "your-secret-key";

const token = jwt.sign({ userId: 123, username: "tom" }, SECRET, {
  expiresIn: "2h",
});

console.log(token);
```

---

## 验证 token

```ts
import jwt, { JwtPayload } from "jsonwebtoken";

const SECRET = "your-secret-key";
const token = "你的 token";

try {
  const decoded = jwt.verify(token, SECRET);

  // verify 的返回类型是 string | JwtPayload
  if (typeof decoded === "string") {
    console.log("payload 是字符串:", decoded);
  } else {
    console.log("验证通过:", decoded.userId, decoded.username);
  }
} catch (err) {
  console.error("验证失败:", (err as Error).message);
}
```

---

## 推荐：给 payload 定义类型

在 TS 里，最好自己定义一个 payload 接口。

```ts
import { JwtPayload } from "jsonwebtoken";

export interface MyJwtPayload extends JwtPayload {
  userId: number;
  username: string;
  role: "admin" | "user";
}
```

这里继承 `JwtPayload` 的好处是，`exp`、`iat` 这些 JWT 标准字段也能兼容。

---

## 封装成工具函数

这是最常见的写法。

## `jwt.ts`

```ts
import jwt from "jsonwebtoken";
import type { JwtPayload, Secret, SignOptions } from "jsonwebtoken";

const SECRET: Secret = process.env.JWT_SECRET || "dev-secret";

export interface AccessTokenPayload extends JwtPayload {
  userId: number;
  username: string;
  role: "admin" | "user";
}

// 签发 token
export function signAccessToken(
  payload: Omit<AccessTokenPayload, keyof JwtPayload>,
  options?: SignOptions,
): string {
  return jwt.sign(payload, SECRET, {
    expiresIn: "1h",
    ...options,
  });
}

// 验证 token
export function verifyAccessToken(token: string): AccessTokenPayload {
  const decoded = jwt.verify(token, SECRET);

  if (typeof decoded === "string") {
    throw new Error("Invalid token payload");
  }

  return decoded as AccessTokenPayload;
}
```

---

## 使用

```ts
import { signAccessToken, verifyAccessToken } from "./jwt";

const token = signAccessToken({
  userId: 1,
  username: "admin",
  role: "admin",
});

console.log("token:", token);

const payload = verifyAccessToken(token);
console.log(payload.userId);
console.log(payload.username);
console.log(payload.role);
```

---

## Express + TypeScript 写法

这个是最实用的场景。

---

## 登录接口签发 token

```ts
import express, { Request, Response } from "express";
import { signAccessToken } from "./jwt";

const app = express();
app.use(express.json());

app.post("/login", (req: Request, res: Response) => {
  const { username, password } = req.body;

  // 这里只是演示
  if (username !== "admin" || password !== "123456") {
    return res.status(401).json({ message: "用户名或密码错误" });
  }

  const token = signAccessToken({
    userId: 1,
    username: "admin",
    role: "admin",
  });

  return res.json({ token });
});
```

---

## 给 `Request` 扩展 `user`

TS 里很多人会遇到这个问题：

```ts
req.user = ...
```

会报错，因为默认 `Express.Request` 没有 `user` 字段。

你可以新建一个类型声明文件，例如：

`src/types/express/index.d.ts`

```ts
import type { AccessTokenPayload } from "../../jwt";

declare global {
  namespace Express {
    interface Request {
      user?: AccessTokenPayload;
    }
  }
}
```

然后确保 `tsconfig.json` 能包含这个目录，比如：

```json
{
  "compilerOptions": {
    "typeRoots": ["./node_modules/@types", "./src/types"]
  }
}
```

如果你项目里默认就能扫到 `.d.ts`，也可以不用配。

---

## 鉴权中间件

```ts
import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "./jwt";

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "缺少 Authorization" });
  }

  const token = authHeader.startsWith("Bearer ")
    ? authHeader.slice(7)
    : authHeader;

  try {
    const decoded = verifyAccessToken(token);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({
      message: "token 无效或已过期",
    });
  }
}
```

---

## 受保护接口

```ts
import express, { Request, Response } from "express";
import { authMiddleware } from "./authMiddleware";

const app = express();

app.get("/profile", authMiddleware, (req: Request, res: Response) => {
  return res.json({
    message: "这是受保护的数据",
    user: req.user,
  });
});

app.listen(3000, () => {
  console.log("server running at http://localhost:3000");
});
```

---

## 区分错误类型

`jsonwebtoken` 有几种常见错误：

- `TokenExpiredError`
- `JsonWebTokenError`
- `NotBeforeError`

你可以这样判断：

```ts
import jwt from "jsonwebtoken";

try {
  const decoded = jwt.verify(token, SECRET);
} catch (err) {
  if (err instanceof jwt.TokenExpiredError) {
    console.log("token 已过期");
  } else if (err instanceof jwt.JsonWebTokenError) {
    console.log("token 非法");
  } else if (err instanceof jwt.NotBeforeError) {
    console.log("token 尚未生效");
  } else {
    console.log("未知错误");
  }
}
```

---

## `decode` 的 TypeScript 写法

```ts
import jwt from "jsonwebtoken";

const decoded = jwt.decode(token);

if (!decoded) {
  console.log("token 无法解析");
} else if (typeof decoded === "string") {
  console.log(decoded);
} else {
  console.log(decoded.userId);
}
```

但是要记住：

`decode()` 只解析，不验签

所以：

- 看内容可以用 `decode`
- 做登录鉴权必须用 `verify`

---

## RS256 的 TypeScript 写法

如果你不是用 `SECRET`，而是用公私钥：

```ts
import fs from "fs";
import jwt from "jsonwebtoken";

const privateKey = fs.readFileSync("./private.key");
const publicKey = fs.readFileSync("./public.key");

interface MyJwtPayload {
  userId: number;
  username: string;
}

const token = jwt.sign({ userId: 1, username: "admin" }, privateKey, {
  algorithm: "RS256",
  expiresIn: "1h",
});

const decoded = jwt.verify(token, publicKey, {
  algorithms: ["RS256"],
});

if (typeof decoded !== "string") {
  console.log(decoded.userId);
}
```

---

## Promise 风格封装

`jsonwebtoken` 原生是回调风格，你如果想在 TS 里配合 `async/await`，可以自己封一下。

---

## 异步签发

```ts
import jwt from "jsonwebtoken";
import type { Secret, SignOptions } from "jsonwebtoken";

const SECRET: Secret = process.env.JWT_SECRET || "dev-secret";

export function signJwtAsync(
  payload: object,
  options?: SignOptions,
): Promise<string> {
  return new Promise((resolve, reject) => {
    jwt.sign(payload, SECRET, { expiresIn: "1h", ...options }, (err, token) => {
      if (err || !token) {
        return reject(err || new Error("Failed to sign token"));
      }
      resolve(token);
    });
  });
}
```

---

## 异步验证

```ts
import jwt from "jsonwebtoken";
import type { JwtPayload, Secret } from "jsonwebtoken";

const SECRET: Secret = process.env.JWT_SECRET || "dev-secret";

export function verifyJwtAsync<T extends JwtPayload = JwtPayload>(
  token: string,
): Promise<T> {
  return new Promise((resolve, reject) => {
    jwt.verify(token, SECRET, (err, decoded) => {
      if (err) {
        return reject(err);
      }
      if (!decoded || typeof decoded === "string") {
        return reject(new Error("Invalid token payload"));
      }
      resolve(decoded as T);
    });
  });
}
```

---

## 使用

```ts
interface AccessTokenPayload extends jwt.JwtPayload {
  userId: number;
  username: string;
}

async function main() {
  const token = await signJwtAsync({
    userId: 1,
    username: "admin",
  });

  const decoded = await verifyJwtAsync<AccessTokenPayload>(token);
  console.log(decoded.userId);
}

main();
```

---

## 一个完整的 TS 最小示例

```ts
import express, { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload, Secret } from "jsonwebtoken";

const app = express();
app.use(express.json());

const SECRET: Secret = process.env.JWT_SECRET || "dev-secret";

interface AccessTokenPayload extends JwtPayload {
  userId: number;
  username: string;
  role: "admin" | "user";
}

declare global {
  namespace Express {
    interface Request {
      user?: AccessTokenPayload;
    }
  }
}

function signAccessToken(payload: Omit<AccessTokenPayload, keyof JwtPayload>) {
  return jwt.sign(payload, SECRET, {
    expiresIn: "1h",
    algorithm: "HS256",
  });
}

function verifyAccessToken(token: string): AccessTokenPayload {
  const decoded = jwt.verify(token, SECRET, {
    algorithms: ["HS256"],
  });

  if (typeof decoded === "string") {
    throw new Error("Invalid token payload");
  }

  return decoded as AccessTokenPayload;
}

function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "缺少 Authorization" });
  }

  const token = authHeader.startsWith("Bearer ")
    ? authHeader.slice(7)
    : authHeader;

  try {
    req.user = verifyAccessToken(token);
    next();
  } catch (err) {
    return res.status(401).json({ message: "token 无效或已过期" });
  }
}

app.post("/login", (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (username !== "admin" || password !== "123456") {
    return res.status(401).json({ message: "用户名或密码错误" });
  }

  const token = signAccessToken({
    userId: 1,
    username: "admin",
    role: "admin",
  });

  return res.json({ token });
});

app.get("/profile", authMiddleware, (req: Request, res: Response) => {
  return res.json({
    user: req.user,
  });
});

app.listen(3000, () => {
  console.log("server running at http://localhost:3000");
});
```

---

## TS 里最常见的坑

---

### `verify` 返回的不是你的自定义类型

`jwt.verify()` 的返回类型一般是：

```ts
string | JwtPayload;
```

所以你不能直接：

```ts
const decoded = jwt.verify(token, SECRET);
console.log(decoded.userId); // 可能报错
```

要先判断：

```ts
if (typeof decoded !== "string") {
  console.log(decoded.userId);
}
```

或者封装成自己的 `verifyAccessToken()`。

---

### `req.user` 报错

因为 Express 默认没有 `user` 属性。
要用 `.d.ts` 扩展 `Express.Request`。

---

### `expiresIn` 类型报错

通常这样没问题：

```ts
expiresIn: "1h";
```

如果你把它写成普通 `string` 变量，有时 TS 会报类型不兼容。
可以写成字面量或 `as const`：

```ts
const EXPIRES_IN = "1h" as const;
```

---

### 不要把 payload 当加密内容

JWT payload 只是编码，不是加密。
所以别放：

- 密码
- 手机号敏感信息
- 银行卡信息
- 太详细的隐私数据

---

## 推荐项目结构

你可以这样组织：

```bash
src/
  jwt/
    index.ts
  middleware/
    auth.ts
  types/
    express/
      index.d.ts
  app.ts
```
