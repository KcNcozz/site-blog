---
title: 单文件 HTML 嵌入数据套路
description: 把大型数据集（词典、字库、配置）压缩后内嵌进单个 HTML 文件，浏览器端解压并缓存到 IndexedDB 的完整方案
tags:
  - 前端
  - 性能
  - 离线
  - 压缩
  - IndexedDB
category: 工程实践
---

# 单文件 HTML 嵌入数据套路

> **一句话定义**：把大数据集压缩并编码后塞进单个 HTML 文件，浏览器打开时原地解压并缓存到 IndexedDB，实现"双击 HTML 就能离线使用完整数据集"。

---

## 这是什么

我从一个真实的 19MB 的雅思词典 HTML 里抽出这个套路——它收录了 **49,213 个雅思词汇**，整个数据集压缩编码后**全部内嵌在一个 HTML 文件**里，没有任何外部资源请求。

打开就是这样的：

```
✓ 零网络请求
✓ 离线可用
✓ 双击 HTML 即开即用
✓ 第二次打开秒级响应（IndexedDB 缓存命中）
✓ 浏览器原生 API，零依赖（用 DecompressionStream 替代几百 KB 的 brotli.js bundle）
```

---

## 解决了什么问题

| 传统方案 | 痛点 | 本套路 |
|---|---|---|
| 词典数据放后端 API | 必须联网、需要服务器 | 数据在 HTML 里，离线可用 |
| 词典数据放单独 .json 文件 | 必须配服务器或处理 CORS | 单文件分发 |
| 词典数据随 HTML 一起 fetch | 大文件首屏慢 | 一次性内嵌 + IndexedDB 缓存 |
| 用 brotli.js / pako 压缩 | 几百 KB 的解压库 | 浏览器原生 `DecompressionStream` |

**适用场景**：词典、字库、成语库、元素周期表、SQL 速查、离线工具、教学附录——任何"用户拿到 HTML 就能离线使用"的场景。

---

## 架构总览

整个系统分两段：**构建期**（你电脑上跑 Node 脚本）+ **运行期**（浏览器里解码）。

```
═══════════════════════════════════ 构建期（你的电脑）═══════════════════════════════════

   src/data.json                   ← 你手写的原始数据
       │
       │ ① JSON.stringify
       ▼
   jsonString                      ← 纯文本字符串
       │
       │ ② Brotli 压缩（zlib.brotliCompressSync）
       ▼
   compressedBuffer                ← 二进制，体积通常缩到 30~50%
       │
       │ ③ base-85 编码
       ▼
   encodedString                   ← 纯 ASCII 文本，绝对不含 < > " '
       │
       │ ④ 按 4000 字符换行
       ▼
   wrappedString
       │
       │ ⑤ 替换 src/template.html 里的 {{ASP_DATA}} 占位符
       ▼
   dist/词典.html                  ← 单文件产物，双击就能用
```

```
═══════════════════════════ 运行期（用户浏览器里）═══════════════════════════════════

   页面打开
       │
       ▼
   ┌─────────────────────────────┐
   │ ① 查 IndexedDB 缓存         │   db = 'demo_dict', key = 'cache_v1'
   │    idbGet()                  │
   └─────────────┬───────────────┘
                 │
           ┌─────┴─────┐
           │           │
         命中         未命中
           │           │
           ▼           ▼
       返回缓存   ┌──────────────────────────────────┐
                   │ ② 读 <script id="asp-data"> 文本 │
                   └──────────────┬──────────────────┘
                                  │
                                  ▼
                   ┌──────────────────────────────────┐
                   │ ③ 按 "\n" 切分成多行             │
                   └──────────────┬──────────────────┘
                                  │
                                  ▼
                   ┌──────────────────────────────────┐
                   │ ④ 逐行：base-85 解码             │
                   │    fromBase85(line)              │
                   └──────────────┬──────────────────┘
                                  │
                                  ▼
                   ┌──────────────────────────────────┐
                   │ ⑤ Brotli 解压                   │
                   │    DecompressionStream('br')     │
                   └──────────────┬──────────────────┘
                                  │
                                  ▼
                   ┌──────────────────────────────────┐
                   │ ⑥ 拼接所有行 → JSON.parse        │
                   └──────────────┬──────────────────┘
                                  │
                                  ▼
                   ┌──────────────────────────────────┐
                   │ ⑦ 写回 IndexedDB（下次走捷径）   │
                   └──────────────┬──────────────────┘
                                  │
                                  ▼
                              拿到 data
                                  │
                                  ▼
                          渲染到 UI（搜索/列表）
```

---

## 构建期详解

### 步骤 ① JSON.stringify

把 JS 对象序列化成纯文本字符串。

```js
const jsonText = JSON.stringify(data);
```

**关键**：序列化后的文本里有大量重复模式（字段名、相同前缀），是后续压缩算法最喜欢的素材。

### 步骤 ② Brotli 压缩

```js
const compressed = zlib.brotliCompressSync(Buffer.from(jsonText), {
  params: { [zlib.constants.BROTLI_PARAM_QUALITY]: 11 }
});
```

**为什么选 Brotli 而不是 gzip？**

| 算法 | 文本压缩率 | 浏览器原生支持 |
|---|---|---|
| gzip | 基准 | ✅ DecompressionStream('gzip') |
| **Brotli** | **比 gzip 高 15~25%** | ✅ DecompressionStream('br') |

词典里大量重复的字段名（`word`、`phonetic`、`translation`...）和常用短语，Brotli 的字典压缩能干掉一大半体积。

### 步骤 ③ base-85 编码（核心步骤）

把二进制压缩结果转成纯 ASCII 文本——因为接下来要塞进 `<script>` 标签。

```js
const ALPHABET = (() => {
  let s = '';
  for (let c = 33; c <= 126 && s.length < 85; c++) {
    if (c === 34 || c === 39 || c === 60) continue;   // 跳过 " ' <
    s += String.fromCharCode(c);
  }
  return s;   // 长度恰好 85
})();

function toBase85(buf) {
  let out = '';
  for (let i = 0; i < buf.length; i += 5) {
    const mm = Math.min(5, buf.length - i);   // 实际剩余字节数
    let val = 0;
    for (let j = 0; j < mm; j++) val = val * 85 + buf[i + j];
    for (let j = 0; j < 5 - mm; j++) val = val * 85 + 84;   // 不足 5 字节按规则补码
    let s = '';
    for (let j = 0; j < 5; j++) {
      const idx = Math.floor(val / Math.pow(85, 4 - j)) % 85;
      s += ALPHABET[idx];
    }
    out += s;
  }
  return out;
}
```

#### 为什么字符表要"挑挑拣拣"？

可选范围是 ASCII 33（`!`）到 126（`~`），共 94 个字符。但要避开 **3 个 HTML 危险字符**：

| 跳过 | 字符 | 原因 |
|---|---|---|
| 34 | `"` | 会撞上 `<script>` 的属性引号边界 |
| 39 | `'` | 同上 |
| 60 | `<` | 让浏览器以为 `<script>` 提前关闭了 |

> **疑问**：`>` (62) 不也要跳过吗？
>
> **答**：不用。`>` 只在匹配 `</script>` 时才危险，但 `<` 一出现浏览器就认为标签开始解析了，防 `<` 就够。

94 - 3 = 91 个可用字符，截取前 **85 个** 凑成真正的 base-85（5 字符 = 4 字节，刚好打满）。

#### 为什么不是 base-64？

| 编码 | 每 5 字符承载字节 | 字符利用率 |
|---|---|---|
| base-64 | 3 字节 | 4/5 = 80% |
| **base-85** | **4 字节** | **5/5 = 100%** |

base-85 字符密度更高，编码后体积更小。

### 步骤 ④ 按 4000 字符换行

```js
const wrapped = encoded.match(/.{1,4000}/g).join('\n');
```

**好处**：
- 生成的 HTML 可读、可 diff
- 超出编辑器单行长度限制时不会卡
- 解码端按行切分时天然支持流式处理（大数据时可用 `Promise.all` 并行解压每行）

### 步骤 ⑤ 替换模板占位符

```js
const tpl = fs.readFileSync('src/template.html', 'utf8');
const finalHtml = tpl.replace('{{ASP_DATA}}', wrapped);
fs.writeFileSync('dist/词典.html', finalHtml);
```

模板里只需要一行占位符：

```html
<script id="asp-data" type="text/plain">{{ASP_DATA}}</script>
```

**为什么用 `<script type="text/plain">` 而不是注释或 textarea？**

- 浏览器**不会把内容当 JS 执行**（type 不是 module/js）
- 但 `textContent` 还能读到 —— 这是 web 上常用的"在 HTML 里塞大数据块"的标准技巧
- 比 `<textarea>` 干净，比 `<!-- -->` 易读

---

## 运行期详解

### IndexedDB 缓存封装

```js
const DB_NAME = 'demo_dict';
const STORE   = 'kv';
const KEY     = 'cache_v1';

function idbGet() {
  return new Promise((resolve) => {
    let req;
    try { req = indexedDB.open(DB_NAME, 1); }
    catch (e) { return resolve(null); }
    req.onupgradeneeded = () => {
      try { req.result.createObjectStore(STORE); } catch (e) {}
    };
    req.onsuccess = () => {
      const db = req.result;
      try {
        const tx = db.transaction(STORE, 'readonly');
        const get = tx.objectStore(STORE).get(KEY);
        get.onsuccess = () => { try { db.close(); } catch (e) {} resolve(get.result); };
        get.onerror   = () => { try { db.close(); } catch (e) {} resolve(null); };
      } catch (e) { try { db.close(); } catch (e) {} resolve(null); }
    };
    req.onerror = () => resolve(null);
  });
}

function idbPut(value) {
  return new Promise((resolve) => {
    // 同上结构，区别只在 transaction 用 'readwrite'
  });
}
```

**为什么 IndexedDB 而不是 localStorage？**

| 特性 | localStorage | IndexedDB |
|---|---|---|
| 容量 | 5~10MB | **几百 MB~几 GB** |
| 同步/异步 | 同步阻塞 | 异步不阻塞 |
| 数据类型 | 仅字符串 | 任意 JS 对象 |
| 性能 | 大数据慢 | 大数据快 |

localStorage 存 4 万词的词典会直接爆，**必须用 IndexedDB**。

### 主加载流程

```js
async function loadData() {
  const t0 = performance.now();

  // ① 查缓存
  const cached = await idbGet();
  if (cached) {
    return { data: cached, stats: { hit: true, ms: performance.now() - t0 } };
  }

  // ② 没缓存：从 <script id="asp-data"> 解码
  const encoded = document.getElementById('asp-data').textContent.trim();
  const lines = encoded.split('\n');

  // ③ 每行：base-85 解码 → Brotli 解压
  const parts = [];
  for (const line of lines) {
    const compressed = fromBase85(line);
    const stream = new Response(compressed).body.pipeThrough(
      new DecompressionStream('br')   // 浏览器原生 API，零依赖
    );
    const buf = await new Response(stream).arrayBuffer();
    parts.push(new Uint8Array(buf));
  }

  // ④ 拼接
  const total = parts.reduce((s, p) => s + p.length, 0);
  const merged = new Uint8Array(total);
  let off = 0;
  for (const p of parts) { merged.set(p, off); off += p.length; }

  // ⑤ JSON.parse + 写缓存
  const data = JSON.parse(new TextDecoder().decode(merged));
  await idbPut(data);

  return { data, stats: { hit: false, ms: performance.now() - t0 } };
}
```

**关键：用 `DecompressionStream('br')` 替代几百 KB 的 brotli.js bundle**——现代浏览器（Chrome 80+、Firefox 113+、Safari 16.4+）都支持，零依赖。

### base-85 解码（与构建端严格对称）

```js
const IX = new Uint8Array(128);
ALPHABET.split('').forEach((c, i) => IX[c.charCodeAt(0)] = i);

function fromBase85(s) {
  const out = [];
  for (let i = 0; i < s.length; i += 5) {
    const mm = Math.min(5, s.length - i);
    let val = 0;
    for (let j = 0; j < mm; j++) val = val * 85 + IX[s.charCodeAt(i + j)];
    for (let j = 0; j < 5 - mm; j++) val = val * 85 + 84;
    const n = Math.floor(mm * 4 / 5);
    for (let j = 0; j < n; j++) {
      out.push(Math.floor(val / Math.pow(256, 3 - j)) % 256);
    }
  }
  return new Uint8Array(out);
}
```

> ⚠️ **ALPHABET 在构建端和解码端必须一字不差**。这就是这套方案的"密钥"——改一下字符表，加密性就变了。

---

## 完整代码模板

### `build.js`（构建端）

```js
const fs   = require('fs');
const path = require('path');
const zlib = require('zlib');

const ALPHABET = (() => {
  let s = '';
  for (let c = 33; c <= 126 && s.length < 85; c++) {
    if (c === 34 || c === 39 || c === 60) continue;
    s += String.fromCharCode(c);
  }
  return s;
})();

function toBase85(buf) {
  let out = '';
  for (let i = 0; i < buf.length; i += 5) {
    const mm = Math.min(5, buf.length - i);
    let val = 0;
    for (let j = 0; j < mm; j++) val = val * 85 + buf[i + j];
    for (let j = 0; j < 5 - mm; j++) val = val * 85 + 84;
    let s = '';
    for (let j = 0; j < 5; j++) {
      const idx = Math.floor(val / Math.pow(85, 4 - j)) % 85;
      s += ALPHABET[idx];
    }
    out += s;
  }
  return out;
}

function main() {
  const data = JSON.parse(fs.readFileSync('src/data.json'));
  const jsonText = JSON.stringify(data);

  const compressed = zlib.brotliCompressSync(Buffer.from(jsonText), {
    params: { [zlib.constants.BROTLI_PARAM_QUALITY]: 11 }
  });
  const encoded = toBase85(compressed);
  const wrapped = encoded.match(/.{1,4000}/g).join('\n');

  const tpl = fs.readFileSync('src/template.html', 'utf8');
  const finalHtml = tpl.replace('{{ASP_DATA}}', wrapped);
  fs.writeFileSync('dist/output.html', finalHtml);

  console.log(`压缩: ${jsonText.length} → ${compressed.length} bytes (${(compressed.length/jsonText.length*100).toFixed(1)}%)`);
}

main();
```

### `template.html`（运行端）

```html
<!DOCTYPE html>
<html>
<head>
  <title>离线词典</title>
</head>
<body>
  <input id="q" placeholder="搜索…">
  <ul id="list"></ul>

  <script id="asp-data" type="text/plain">{{ASP_DATA}}</script>

  <script>
    // === 字符表（与 build.js 完全一致）===
    const ALPHABET = (() => {
      let s = '';
      for (let c = 33; c <= 126 && s.length < 85; c++) {
        if (c === 34 || c === 39 || c === 60) continue;
        s += String.fromCharCode(c);
      }
      return s;
    })();
    const IX = new Uint8Array(128);
    ALPHABET.split('').forEach((c, i) => IX[c.charCodeAt(0)] = i);

    // === base-85 解码 ===
    function fromBase85(s) {
      const out = [];
      for (let i = 0; i < s.length; i += 5) {
        const mm = Math.min(5, s.length - i);
        let val = 0;
        for (let j = 0; j < mm; j++) val = val * 85 + IX[s.charCodeAt(i + j)];
        for (let j = 0; j < 5 - mm; j++) val = val * 85 + 84;
        const n = Math.floor(mm * 4 / 5);
        for (let j = 0; j < n; j++) {
          out.push(Math.floor(val / Math.pow(256, 3 - j)) % 256);
        }
      }
      return new Uint8Array(out);
    }

    // === IndexedDB 封装 ===
    const idbGet = () => new Promise(r => {
      const req = indexedDB.open('my_dict', 1);
      req.onupgradeneeded = () => req.result.createObjectStore('kv');
      req.onsuccess = () => {
        const tx = req.result.transaction('kv', 'readonly');
        const get = tx.objectStore('kv').get('cache_v1');
        get.onsuccess = () => { req.result.close(); r(get.result); };
      };
    });
    const idbPut = v => new Promise(r => {
      const req = indexedDB.open('my_dict', 1);
      req.onupgradeneeded = () => req.result.createObjectStore('kv');
      req.onsuccess = () => {
        const tx = req.result.transaction('kv', 'readwrite');
        tx.objectStore('kv').put(v, 'cache_v1');
        tx.oncomplete = () => { req.result.close(); r(); };
      };
    });

    // === 主流程 ===
    async function loadData() {
      const cached = await idbGet();
      if (cached) return cached;

      const lines = document.getElementById('asp-data').textContent.trim().split('\n');
      const parts = await Promise.all(lines.map(async line => {
        const compressed = fromBase85(line);
        const stream = new Response(compressed).body.pipeThrough(
          new DecompressionStream('br')
        );
        return new Uint8Array(await new Response(stream).arrayBuffer());
      }));
      const merged = new Uint8Array(parts.reduce((s, p) => s + p.length, 0));
      parts.reduce((off, p) => { merged.set(p, off); return off + p.length; }, 0);

      const data = JSON.parse(new TextDecoder().decode(merged));
      await idbPut(data);
      return data;
    }

    // === UI ===
    (async () => {
      const data = await loadData();
      document.getElementById('list').innerHTML = data.items
        .map(x => `<li>${x.name}</li>`).join('');
    })();
  </script>
</body>
</html>
```

---

## 应用场景清单

| 场景 | 数据规模 | 替换字段名 |
|---|---|---|
| 雅思词典 | 4-5 万词 | `words` |
| CJK 汉字库 | 10 万字 | `chars` |
| 常用成语 / 歇后语 | 几千条 | `idioms` |
| 元素周期表 + 详细属性 | 118 元素 | `elements` |
| 古诗 / 古文全文 | 几千首 | `poems` |
| SQL 语法速查 | 几百条 | `snippets` |
| 离线翻译对照 | 1-2 万条 | `pairs` |
| 乐谱 / 棋谱 / 食谱 | 不定 | 各自命名 |
| 数学公式速查 | 几百条 | `formulas` |
| 行政区划 / 邮编 | 几千条 | `regions` |

### 判断标准（决策树）

```
能用本套路？
│
├─ 数据 < 10MB？ ─否→ ❌ 单文件过大，首屏太慢
│
├─ 用户能离线用？ ─否→ ❌ 多此一举，直接 fetch CDN
│
├─ 想单文件分发？ ─否→ ❌ 拆成 data.json.gz 更合理
│
└─ ✅ 满足 → 用本套路
```

---

## 不适合的场景

| 场景 | 原因 |
|---|---|
| 数据 > 10MB | 单 HTML 加载过慢；该拆成外部 `.json.gz` |
| 需要服务端鉴权 / 版权保护 | 内嵌 HTML 别人右键就能扒走 |
| 数据频繁更新 | 改一字都要重新出整个 HTML，CDN 更省事 |
| 多人协作维护 | 不利于版本控制 diff |
| 移动端 WebApp | 移动端 IndexedDB 容量限制更严 |

---

## 进阶改造

### 1. 加一层 XOR 混淆（轻度加密）

```js
// 构建端
function xorEncrypt(buf, key) {
  const out = Buffer.alloc(buf.length);
  for (let i = 0; i < buf.length; i++) out[i] = buf[i] ^ key.charCodeAt(i % key.length);
  return out;
}

// 解码端
function xorDecrypt(buf, key) {
  const out = new Uint8Array(buf.length);
  for (let i = 0; i < buf.length; i++) out[i] = buf[i] ^ key.charCodeAt(i % key.length);
  return out;
}
```

⚠️ **这不是真加密**——只是防右键复制。真正的加密请用 Web Crypto API。

### 2. 改用 gzip（更简单）

如果嫌 Brotli 浏览器兼容还不够广，可以回退 gzip：

```js
// 构建端
const compressed = zlib.gzipSync(Buffer.from(jsonText), { level: 9 });

// 解码端
new DecompressionStream('gzip')   // 兼容性比 'br' 更好
```

### 3. 字符表改造成"密钥"

字符表本身就是密钥，定制字符表 = 轻度加密：

```js
// 构建端 + 解码端都改成同一个
const ALPHABET = '你的自定义85字符...';
```

只有持有同样字符表的人才能解码。

### 4. 大数据用 SQL 索引

如果数据 > 1MB 且需要模糊搜索，把 JSON 换成 SQLite WASM（`sql.js`）：

```js
import initSqlJs from 'sql.js';
const SQL = await initSqlJs({ locateFile: f => `https://sql.js/dist/${f}` });
const db = new SQL.Database(uint8array);  // 数据可以同样 base-85 + Brotli 编码
const stmt = db.prepare("SELECT * FROM words WHERE w LIKE ?");
stmt.bind(['%' + q + '%']);
while (stmt.step()) console.log(stmt.getAsObject());
```

### 5. 多文件拆分（数据太大时）

```js
// 构建端按字母拆分
const sections = { a: [], b: [], /* ... */ };
data.forEach(w => sections[w.w[0]].push(w));

// 每个 section 单独编码成独立 <script id="asp-a"> <script id="asp-b"> ...
// 解码端按需加载
```

---

## 常见坑

### 坑 1：忘了 trim()

`textContent` 末尾可能有空白字符，导致 base-85 解码失败。

```js
const text = document.getElementById('asp-data').textContent.trim();   // ✅
const text = document.getElementById('asp-data').textContent;           // ❌
```

### 坑 2：字符表忘了同步

构建端改了字符表但忘了改解码端，会全部解码成乱码。**字符表就是密钥，必须两端一致。**

### 坑 3：IndexedDB 升级 schema 失败

如果 schema 变更，缓存还在用旧 key。**版本号写进 key 里**：

```js
const KEY = 'cache_v2';   // 每次升级数据格式时手动 bump
```

### 坑 4：DecompressionStream 兼容性

| API | 支持情况 |
|---|---|
| `DecompressionStream('gzip')` | Chrome 80+, Firefox 113+, Safari 16.4+（2023） |
| `DecompressionStream('deflate')` | 同上 |
| `DecompressionStream('br')` | 同上 |

**低于这些版本需要 fallback**：引入 `brotli-wasm` 或 `pako` 作为 polyfill。

### 坑 5：大数据 JSON.parse 卡顿

如果数据 > 5MB，`JSON.parse` 可能阻塞主线程 100ms+。考虑：

```js
// 流式解析：JSONStream / oboe.js
// 或者：把数据拆成多个独立 JSON，分批解析
```

---

## 实战案例

本套路来自对一个真实项目 `index.html`（19MB 雅思词典）的反向工程：

- **数据规模**：49,213 个雅思词汇，含英/美音标、英美发音音频、中文释义、双语例句、词根词缀、助记、英英释义、派生词、剑桥雅思/机经真题统计
- **压缩效果**：原始 JSON 约 19MB → Brotli 后约 5MB → base-85 后约 5MB
- **首次打开**：约 200~500ms 完成解压（取决于设备）
- **二次打开**：< 50ms（IndexedDB 缓存命中）

完整代码可见同目录 `demo/` 下的 `build.js` + `template.html` + `data.json`。

---

## 一句话总结

> **HTML 特殊字符 ──避──▶ base-85 ──压──▶ Brotli ──缓──▶ IndexedDB**
>
> 四个环节各司其职，缺一个都不行。掌握这个组合拳，下次做词典/字库/离线工具直接套。

---

## 参考资料

- [Brotli 压缩算法](https://github.com/google/brotli)
- [DecompressionStream - MDN](https://developer.mozilla.org/en-US/docs/Web/API/DecompressionStream)
- [IndexedDB - MDN](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)
- [Ascii85 编码](https://en.wikipedia.org/wiki/Ascii85)
- base-85 自定义字符表的常见变体：[Z85](https://rfc.zeromq.org/spec/32/)、[RFC 1924](https://datatracker.ietf.org/doc/html/rfc1924)