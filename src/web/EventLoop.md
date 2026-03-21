# EventLoop

输出结果是什么?

```vue
<script setup lang="ts">
async function Prom() {
  console.log("Y");
  await Promise.resolve();
  console.log("X");
}
setTimeout(() => {
  console.log(1);
  Promise.resolve().then(() => {
    console.log(2);
  });
}, 0);
setTimeout(() => {
  console.log(3);
  Promise.resolve().then(() => {
    console.log(4);
  });
}, 0);
Promise.resolve().then(() => {
  console.log(5);
});
Promise.resolve().then(() => {
  console.log(6);
});
Promise.resolve().then(() => {
  console.log(7);
});
Promise.resolve().then(() => {
  console.log(8);
});
Prom();
console.log(0);
</script>
<style scoped></style>
```

## 详细解析

```vue
<!-- 注意：script代码段本身算是一个宏任务 -->
<!-- 注意：script代码段本身算是一个宏任务 -->
<!-- 注意：script代码段本身算是一个宏任务 -->
<script setup lang="ts">
// 声明函数但是不执行
async function Prom() {
  console.log("Y");
  await Promise.resolve();
  console.log("X");
}
// 这几个是宏任务
setTimeout(() => {
  console.log(1);
  Promise.resolve().then(() => {
    console.log(2);
  });
}, 0);
setTimeout(() => {
  console.log(3);
  Promise.resolve().then(() => {
    console.log(4);
  });
}, 0);

// 这几个是微任务
Promise.resolve().then(() => {
  console.log(5);
});
Promise.resolve().then(() => {
  console.log(6);
});
Promise.resolve().then(() => {
  console.log(7);
});
Promise.resolve().then(() => {
  console.log(8);
});
Prom();
console.log(0);
// 输出结果 Y 0 5 6 7 8 X 1 2 3 4
</script>
<style scoped></style>
```

> **核心规则：每执行完一个宏任务，立即清空所有微任务，再执行下一个宏任务。**

---

### 逐步执行过程

#### 第一步：同步代码阶段（主线程）

```js
// 1. setTimeout 注册两个宏任务，放入宏任务队列，不执行
setTimeout(...) // 宏任务1
setTimeout(...) // 宏任务2

// 四个 Promise.then 放入微任务队列
Promise.resolve().then(() => console.log(5)) // 微任务1
Promise.resolve().then(() => console.log(6)) // 微任务2
Promise.resolve().then(() => console.log(7)) // 微任务3
Promise.resolve().then(() => console.log(8)) // 微任务4

// 调用 Prom()
Prom()
// → 执行到 console.log("Y")  → 输出 Y
// → 遇到 await Promise.resolve()，暂停，
//   await 后面的 console.log("X") 被放入微任务队列  → 微任务5

// 继续同步代码
console.log(0) // 输出 0
```

**此时已输出：`Y` `0`**

---

#### 第二步：清空微任务队列

主线程同步代码跑完，开始清空微任务：

```
微任务1 → 输出 5
微任务2 → 输出 6
微任务3 → 输出 7
微任务4 → 输出 8
微任务5 → 输出 X  (Prom 中 await 后续代码)
```

**此时已输出：`Y` `0` `5` `6` `7` `8` `X`**

---

#### 第三步：执行宏任务1（第一个 setTimeout）

```js
console.log(1); // 输出 1
Promise.resolve().then(() => console.log(2)); // 新微任务入队
```

宏任务1执行完毕，**立即清空微任务**：

```
→ 输出 2
```

**此时已输出：`Y` `0` `5` `6` `7` `8` `X` `1` `2`**

---

#### 第四步：执行宏任务2（第二个 setTimeout）

```js
console.log(3); // 输出 3
Promise.resolve().then(() => console.log(4)); // 新微任务入队
```

宏任务2执行完毕，**立即清空微任务**：

```
→ 输出 4
```

---

### 最终输出

```
Y 0 5 6 7 8 X 1 2 3 4
```

---

### 关键点说明

**为什么 `Y` 在 `0` 前面？**
`Prom()` 被调用时，函数体同步执行直到第一个 `await`，所以 `console.log("Y")` 先于 `console.log(0)` 执行。

**为什么 `X` 在 `5678` 后面？**
`await Promise.resolve()` 本质上等价于 `Promise.resolve().then(...)`, 所以 `console.log("X")` 被作为微任务5排在微任务队列末尾，在 `5、6、7、8` 之后执行。

**为什么 `2` 紧跟在 `1` 后面？**
每个宏任务执行完后会立刻清空微任务队列，所以宏任务1产生的微任务（输出2）会在宏任务2（输出3）之前执行。

```ts
Promise.resolve().then(() => {
  console.log(100);
});
Promise.resolve().then(() => {
  console.log(11);
});
Promise.resolve().then(() => {
  console.log(12);
});
Promise.resolve().then(() => {
  console.log(13);
});
Promise.resolve().then(() => {
  console.log(14);
});
//第二个宏任务了
setTimeout(() => {
  console.log(2);

  //第三个宏任务了
  Promise.resolve().then(() => {
    console.log(3);
    //第四个宏任务
    setTimeout(() => {
      console.log(4);
    }, 0);
  });
}, 0);
//宏任务第三个宏任务了
setTimeout(() => {
  console.log(5);
}, 0);
const a = new Promise((resolve, reject) => {
  console.log(1651616516); //属于同步代码
  resolve(1);
});
console.log(6);
```

**同步代码一定是执行的 执行完才执行异步** 异步代码中才有微任务宏任务说法

- 同步：同步代码普通代码
- 异步：ajax 定时器 promise async await 事件 MutationObserver Microtask
  - 宏任务：setTimeout setInterval requestAnimationFrame ajax 事件 **script代码段**
  - 微任务：Promise.resolve() then cache async await MutationObserver

1. 宏任务先执行
2. 清空当前宏任务内部的所有微任务
3. 清空完成之后开始下一个任务
