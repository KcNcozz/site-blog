# JavaScript 常用方法参考手册

> 本手册整理了 **字符串 (String)**、**数组 (Array)**、**对象 (Object)** 三大类型的常用方法，供快速查阅。
>
> 标注说明：
>
> - ✅ **不修改原数据**（返回新值）
> - ⚠️ **修改原数据**（原地操作）

## 一、字符串 String

字符串所有方法都 **不会修改原字符串**，都是返回新字符串。

### 1. 查找类

| 方法               | 作用                                    | 示例                                |
| ------------------ | --------------------------------------- | ----------------------------------- |
| `indexOf(str)`     | 查找子串首次出现的位置，找不到返回 `-1` | `'hello'.indexOf('l')` → `2`        |
| `lastIndexOf(str)` | 从后向前查找子串首次出现的位置          | `'hello'.lastIndexOf('l')` → `3`    |
| `includes(str)`    | 是否包含某个子串，返回布尔值            | `'hello'.includes('ell')` → `true`  |
| `startsWith(str)`  | 是否以某子串开头                        | `'hello'.startsWith('he')` → `true` |
| `endsWith(str)`    | 是否以某子串结尾                        | `'hello'.endsWith('lo')` → `true`   |
| `search(regexp)`   | 用正则查找，返回首次匹配的位置          | `'hello'.search(/l/)` → `2`         |
| `match(regexp)`    | 用正则匹配，返回匹配结果数组            | `'a1b2'.match(/\d/g)` → `['1','2']` |
| `matchAll(regexp)` | 返回所有匹配的迭代器（需要 `/g` 标志）  | `[...'a1b2'.matchAll(/\d/g)]`       |

### 2. 截取类

| 方法                    | 作用                                        | 示例                               |
| ----------------------- | ------------------------------------------- | ---------------------------------- |
| `slice(start, end)`     | 截取 [start, end) 的子串，支持负数          | `'hello'.slice(1, 3)` → `'el'`     |
| `substring(start, end)` | 类似 slice，但不支持负数                    | `'hello'.substring(1, 3)` → `'el'` |
| `substr(start, length)` | 从 start 开始截取指定长度（已废弃，不推荐） | `'hello'.substr(1, 3)` → `'ell'`   |
| `charAt(i)`             | 返回指定位置的字符                          | `'hello'.charAt(1)` → `'e'`        |
| `charCodeAt(i)`         | 返回指定位置字符的 ASCII 码                 | `'A'.charCodeAt(0)` → `65`         |
| `at(i)`                 | 返回指定位置字符，支持负索引（新）          | `'hello'.at(-1)` → `'o'`           |

### 3. 转换类

| 方法                         | 作用                 | 示例                             |
| ---------------------------- | -------------------- | -------------------------------- |
| `toUpperCase()`              | 转大写               | `'abc'.toUpperCase()` → `'ABC'`  |
| `toLowerCase()`              | 转小写               | `'ABC'.toLowerCase()` → `'abc'`  |
| `trim()`                     | 去除两端空格         | `' hi '.trim()` → `'hi'`         |
| `trimStart()` / `trimLeft()` | 去除左侧空格         | `' hi '.trimStart()` → `'hi '`   |
| `trimEnd()` / `trimRight()`  | 去除右侧空格         | `' hi '.trimEnd()` → `' hi'`     |
| `padStart(length, str)`      | 左侧补字符到指定长度 | `'5'.padStart(3, '0')` → `'005'` |
| `padEnd(length, str)`        | 右侧补字符到指定长度 | `'5'.padEnd(3, '0')` → `'500'`   |
| `repeat(n)`                  | 重复字符串 n 次      | `'ab'.repeat(3)` → `'ababab'`    |

### 4. 替换与分割

| 方法                   | 作用                         | 示例                                   |
| ---------------------- | ---------------------------- | -------------------------------------- |
| `replace(old, new)`    | 替换第一个匹配项             | `'aaa'.replace('a', 'b')` → `'baa'`    |
| `replaceAll(old, new)` | 替换所有匹配项               | `'aaa'.replaceAll('a', 'b')` → `'bbb'` |
| `split(separator)`     | 按分隔符拆成数组             | `'a,b,c'.split(',')` → `['a','b','c']` |
| `concat(str)`          | 拼接字符串（一般直接用 `+`） | `'a'.concat('b')` → `'ab'`             |

### 5. 模板字符串（反引号）

```js
const name = "张三";
const age = 18;
const str = `我叫${name}，今年${age}岁`; // 支持变量插值和换行
```

---

## 二、数组 Array

### 1. 增删改（⚠️ 改变原数组）

| 方法                                   | 作用                     | 返回值             |
| -------------------------------------- | ------------------------ | ------------------ |
| `push(item)`                           | 向末尾添加元素           | 新长度             |
| `pop()`                                | 删除末尾元素             | 被删的元素         |
| `unshift(item)`                        | 向开头添加元素           | 新长度             |
| `shift()`                              | 删除开头元素             | 被删的元素         |
| `splice(start, deleteCount, ...items)` | 从指定位置删除/插入/替换 | 被删元素组成的数组 |
| `reverse()`                            | 反转数组                 | 反转后的原数组     |
| `sort(compareFn)`                      | 排序                     | 排序后的原数组     |
| `fill(value, start, end)`              | 用固定值填充             | 填充后的原数组     |
| `copyWithin(target, start, end)`       | 内部复制                 | 修改后的原数组     |

**示例：**

```js
const arr = [1, 2, 3];
arr.push(4); // arr → [1,2,3,4]
arr.pop(); // arr → [1,2,3]
arr.splice(1, 1); // 删除索引1处1个元素 → [1,3]
arr
  .splice(1, 0, "x") // 在索引1插入 'x' → [1,'x',3]

  [
    // sort 默认按字符串排序，数字排序需传比较函数
    (10, 2, 30)
  ].sort() // [10, 2, 30]（错误）
  [(10, 2, 30)].sort((a, b) => a - b) // [2, 10, 30]（升序）
  [(10, 2, 30)].sort((a, b) => b - a); // [30, 10, 2]（降序）
```

### 2. 查找类（✅ 不改变原数组）

| 方法                | 作用                           | 示例                                      |
| ------------------- | ------------------------------ | ----------------------------------------- |
| `indexOf(item)`     | 查找元素索引，找不到返回 `-1`  | `[1,2,3].indexOf(2)` → `1`                |
| `lastIndexOf(item)` | 从后向前查找                   | `[1,2,1].lastIndexOf(1)` → `2`            |
| `includes(item)`    | 是否包含某元素                 | `[1,2,3].includes(2)` → `true`            |
| `find(fn)`          | 查找第一个满足条件的元素       | `[1,2,3].find(x => x > 1)` → `2`          |
| `findIndex(fn)`     | 查找第一个满足条件元素的索引   | `[1,2,3].findIndex(x => x > 1)` → `1`     |
| `findLast(fn)`      | 从后向前找第一个满足条件的元素 | `[1,2,3].findLast(x => x > 1)` → `3`      |
| `findLastIndex(fn)` | 从后向前找索引                 | `[1,2,3].findLastIndex(x => x > 1)` → `2` |
| `at(i)`             | 取指定索引元素，支持负数       | `[1,2,3].at(-1)` → `3`                    |

### 3. 遍历与转换（✅ 不改变原数组）

| 方法                    | 作用                               | 返回        |
| ----------------------- | ---------------------------------- | ----------- |
| `forEach(fn)`           | 遍历每一项（无返回值，不能 break） | `undefined` |
| `map(fn)`               | 遍历并返回**新数组**（一对一转换） | 新数组      |
| `filter(fn)`            | 过滤符合条件的元素                 | 新数组      |
| `reduce(fn, init)`      | 累加器，从左到右聚合               | 最终结果    |
| `reduceRight(fn, init)` | 累加器，从右到左聚合               | 最终结果    |
| `flat(depth)`           | 扁平化嵌套数组                     | 新数组      |
| `flatMap(fn)`           | map + flat(1) 的组合               | 新数组      |
| `every(fn)`             | 所有元素都满足条件才返回 `true`    | 布尔        |
| `some(fn)`              | 任一元素满足条件就返回 `true`      | 布尔        |

**重点示例（项目中常用）：**

```js
// map：一对一转换（你的 spuForm.vue 就用到了）
const list = [{ imgName: "a.jpg", imgUrl: "/a" }];
list
  .map((item) => ({ name: item.imgName, url: item.imgUrl }))
  [
    // → [{ name: 'a.jpg', url: '/a' }]

    // filter：过滤
    (1, 2, 3, 4)
  ].filter((n) => n > 2) // [3, 4]

  [
    // reduce：累加
    (1, 2, 3)
  ].reduce((sum, n) => sum + n, 0) // 6

  [
    // flat：扁平化
    (1, [2, [3]])
  ].flat() // [1, 2, [3]]
  [(1, [2, [3]])].flat(2) // [1, 2, 3]
  [(1, [2, [3]])].flat(Infinity) // 无限扁平

  [
    // every / some
    (1, 2, 3)
  ].every((n) => n > 0) // true
  [(1, 2, 3)].some((n) => n > 2); // true
```

### 4. 截取与合并（✅ 不改变原数组）

| 方法                | 作用                                | 示例                             |
| ------------------- | ----------------------------------- | -------------------------------- |
| `slice(start, end)` | 截取 [start, end) 的子数组          | `[1,2,3,4].slice(1,3)` → `[2,3]` |
| `concat(arr)`       | 合并数组（一般用 `...` 展开运算符） | `[1].concat([2,3])` → `[1,2,3]`  |
| `join(separator)`   | 把数组元素用分隔符连成字符串        | `[1,2,3].join('-')` → `'1-2-3'`  |

### 5. 其他常用

| 方法                                | 作用                         | 示例                                  |
| ----------------------------------- | ---------------------------- | ------------------------------------- |
| `Array.isArray(v)`                  | 判断是否为数组               | `Array.isArray([1])` → `true`         |
| `Array.from(iterable)`              | 类数组/可迭代对象转数组      | `Array.from('abc')` → `['a','b','c']` |
| `Array.of(...items)`                | 创建数组                     | `Array.of(1,2,3)` → `[1,2,3]`         |
| `arr.length`                        | 数组长度（可写，能截断数组） | `arr.length = 0` 清空                 |
| `keys()` / `values()` / `entries()` | 返回对应的迭代器             | 常配合 `for...of` 使用                |

---

## 三、对象 Object

### 1. 遍历与转换（✅ 不改变原对象）

| 方法                      | 作用                       | 示例                                      |
| ------------------------- | -------------------------- | ----------------------------------------- |
| `Object.keys(obj)`        | 返回所有 key 组成的数组    | `Object.keys({a:1,b:2})` → `['a','b']`    |
| `Object.values(obj)`      | 返回所有 value 组成的数组  | `Object.values({a:1,b:2})` → `[1,2]`      |
| `Object.entries(obj)`     | 返回 [key, value] 二维数组 | `Object.entries({a:1})` → `[['a',1]]`     |
| `Object.fromEntries(arr)` | `entries` 的逆操作         | `Object.fromEntries([['a',1]])` → `{a:1}` |

```js
const obj = { name: "张三", age: 18 };

Object.keys(obj); // ['name', 'age']
Object.values(obj); // ['张三', 18]
Object.entries(obj); // [['name','张三'], ['age',18]]

// 遍历对象
for (const [key, value] of Object.entries(obj)) {
  console.log(key, value);
}

// 对象 → 数组 → 加工 → 再转回对象
Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, v + "!"]));
```

### 2. 合并与复制

| 方法                                | 作用                                         | 示例 |
| ----------------------------------- | -------------------------------------------- | ---- |
| `Object.assign(target, ...sources)` | 将多个源对象合并到目标对象（⚠️ 改变 target） | 见下 |
| `{ ...obj }`                        | 扩展运算符浅拷贝/合并（✅ 推荐）             | 见下 |

```js
// Object.assign
const a = { x: 1 };
const b = { y: 2 };
Object.assign(a, b); // a → { x:1, y:2 }
const c = Object.assign({}, a, b); // 推荐：合并到新对象

// 扩展运算符（更简洁）
const merged = { ...a, ...b }; // { x:1, y:2 }
const copied = { ...a }; // 浅拷贝
const updated = { ...a, x: 100 }; // 覆盖某字段
```

> **注意**：以上都是**浅拷贝**。深层嵌套对象仍共享引用。
> 深拷贝可用：`JSON.parse(JSON.stringify(obj))`（简单场景）或 `structuredClone(obj)`（现代浏览器）。

### 3. 属性判断与控制

| 方法                      | 作用                           | 示例                      |
| ------------------------- | ------------------------------ | ------------------------- |
| `obj.hasOwnProperty(key)` | 是否有自身属性（不包括原型链） | `obj.hasOwnProperty('a')` |
| `Object.hasOwn(obj, key)` | 同上，更推荐的新写法           | `Object.hasOwn(obj, 'a')` |
| `'key' in obj`            | 是否有该属性（包括原型链）     | `'a' in obj`              |
| `Object.freeze(obj)`      | 冻结对象（不能改、不能增删）   | `Object.freeze(obj)`      |
| `Object.isFrozen(obj)`    | 是否被冻结                     | `Object.isFrozen(obj)`    |
| `Object.seal(obj)`        | 密封对象（不能增删，可改值）   |                           |
| `delete obj.key`          | 删除某个属性                   | `delete obj.a`            |

### 4. 属性定义与获取

| 方法                                          | 作用                                         |
| --------------------------------------------- | -------------------------------------------- |
| `Object.defineProperty(obj, key, descriptor)` | 精确定义一个属性（可控制是否可写、可枚举等） |
| `Object.defineProperties(obj, descriptors)`   | 批量定义                                     |
| `Object.getOwnPropertyDescriptor(obj, key)`   | 获取属性描述符                               |
| `Object.getOwnPropertyNames(obj)`             | 获取所有自身属性名（包括不可枚举的）         |
| `Object.getPrototypeOf(obj)`                  | 获取原型                                     |
| `Object.setPrototypeOf(obj, proto)`           | 设置原型                                     |
| `Object.create(proto)`                        | 以指定原型创建对象                           |

### 5. JSON 相关

| 方法                  | 作用               | 示例                                  |
| --------------------- | ------------------ | ------------------------------------- |
| `JSON.stringify(obj)` | 对象转 JSON 字符串 | `JSON.stringify({a:1})` → `'{"a":1}'` |
| `JSON.parse(str)`     | JSON 字符串转对象  | `JSON.parse('{"a":1}')` → `{a:1}`     |

```js
// 格式化输出
JSON.stringify({ a: 1, b: 2 }, null, 2);
// 简单深拷贝
const deepCopy = JSON.parse(JSON.stringify(obj));
```

---

## 附录：常用组合技巧

### 1. 数组去重

```js
// Set 法（最简洁）
[...new Set([1, 2, 2, 3])]; // [1, 2, 3]

// filter + indexOf
arr.filter((v, i) => arr.indexOf(v) === i);
```

### 2. 数组/对象转换

```js
// 对象数组 → 以 id 为 key 的 map
const list = [
  { id: 1, name: "a" },
  { id: 2, name: "b" },
];
const map = Object.fromEntries(list.map((item) => [item.id, item]));
// { 1: {id:1,name:'a'}, 2: {id:2,name:'b'} }

// 对象 → 查询字符串
const params = { page: 1, size: 10 };
const query = Object.entries(params)
  .map(([k, v]) => `${k}=${v}`)
  .join("&");
// 'page=1&size=10'
```

### 3. 判断空值

```js
// 判断数组为空
arr.length === 0;

// 判断对象为空
Object.keys(obj).length === 0;

// 判断字符串为空
str === "" || str.trim() === "";
```

### 4. 链式调用示例

```js
const result = users
  .filter((u) => u.age >= 18) // 过滤成年人
  .map((u) => u.name) // 提取名字
  .sort() // 排序
  .join(", "); // 拼成字符串
```

---

> 📖 **查阅建议**：当你遇到不确定的方法时，先看"是否改变原数据"这一栏，再看"返回值"，基本就能判断用法了。
