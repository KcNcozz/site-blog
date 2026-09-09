# React

## React 19 最常用的 Hook

| Hook              | 用途                           | 使用频率   |
| ----------------- | ------------------------------ | ---------- |
| `useState`        | 状态管理                       | ⭐⭐⭐⭐⭐ |
| `useEffect`       | 副作用处理（数据获取、订阅等） | ⭐⭐⭐⭐⭐ |
| `useCallback`     | 在依赖不变时复用函数引用       | ⭐⭐⭐⭐   |
| `useMemo`         | 缓存计算结果，避免重复计算     | ⭐⭐⭐⭐   |
| `useRef`          | 引用 DOM / 存储不变的值        | ⭐⭐⭐⭐   |
| `useContext`      | 跨组件传递数据                 | ⭐⭐⭐⭐   |
| `useReducer`      | 复杂状态逻辑管理               | ⭐⭐⭐     |
| `useLayoutEffect` | 布局相关的同步副作用           | ⭐⭐⭐     |

### React 19 新增 Hook

| Hook             | 用途                                | 使用频率   |
| ---------------- | ----------------------------------- | ---------- |
| `useActionState` | 管理 Action 的状态和待处理状态      | ⭐⭐⭐⭐⭐ |
| `useFormStatus`  | 从 `react-dom` 获取父表单的提交状态 | ⭐⭐⭐⭐   |
| `useOptimistic`  | 乐观更新（立即更新 UI，后台同步）   | ⭐⭐⭐⭐   |

## React组件重新渲染时机

React 组件重新渲染的主要时机包括：

**状态变化**

- 组件自身的 state 发生变化（通过 `useState` 或 `this.setState`）
- React 会用 `Object.is` 比较新旧 state；设置为相同值通常会跳过提交这次更新。某些情况下 React 仍可能先调用组件再决定退出，因此不应依赖 setter 作为“强制渲染”手段。

**Props 变化**

- 父组件重新渲染时，子组件默认也会被调用；是否因为 props 跳过渲染取决于 `memo`、`PureComponent` 等优化及其比较结果。

**父组件重新渲染**

- 父组件重新渲染时，默认情况下所有子组件都会重新渲染
- 即使子组件的 props 没有变化

**Context 变化**

- 组件使用的 Context 值发生变化
- 当 Provider 的 `value` 按 `Object.is` 比较发生变化时，读取该 Context 的后代会收到更新；`memo` 不能阻止组件获得新的 Context 值。

**强制更新**

- 类组件调用 `forceUpdate()`
- 函数组件没有公开的 `forceUpdate()` API。通常应让界面由真实 state/props 驱动，而不是维护一个无业务意义的随机值来强制刷新。

`useReducer` 的 dispatch 只有在 reducer 返回的新 state 未被 `Object.is` 判定为相同时才需要提交更新；自定义 Hook 内部使用的 state、reducer、context 或外部 store 也遵循对应来源的更新规则。Effect 的依赖变化本身不会发起渲染，而是决定已经渲染后是否重新同步副作用。

**优化渲染的方式：**

- `React.memo` - 浅比较 props，避免不必要的函数组件渲染
- `useMemo` / `useCallback` - 缓存计算结果和函数引用
- `PureComponent` - 类组件的浅比较优化
- `shouldComponentUpdate` - 自定义渲染判断逻辑

需要注意的是，重新渲染不等于 DOM 更新。React 会通过虚拟 DOM diff 算法，只更新实际变化的部分。

## 基础知识

### 插值语句

```tsx
const id = "intro";
const cls = "active";
const items = [
  { id: "a", label: "A" },
  { id: "b", label: "B" },
];
const trustedHtml = "<strong>只放经过可信来源或消毒处理的 HTML</strong>";

export function Example() {
  const handleClick = (value: string) => console.log(value);

  return (
    <section id={id} className={`${cls} panel`} style={{ color: "red" }}>
      <button onClick={() => handleClick("aaaa")}>点击</button>
      <pre>{JSON.stringify({ id, cls }, null, 2)}</pre>
      <div dangerouslySetInnerHTML={{ __html: trustedHtml }} />
      {items.map((item) => (
        <div key={item.id}>{item.label}</div>
      ))}
    </section>
  );
}
```

JSX 中不能直接渲染普通对象，可选择字段或显式序列化。`dangerouslySetInnerHTML` 与 children 不能同时使用，且未经消毒的外部 HTML 会造成 XSS。列表 `key` 应使用稳定业务标识；只有列表确实不会重排、插入或删除时才适合用索引。

::: tip 一些要点

`onClick` 接收事件处理函数，而不是字符串或渲染期间立即执行的函数调用。没有额外参数时可写 `onClick={handleClick}`；需要传参时可写 `onClick={() => setHome(false)}`，这里是用箭头函数延迟调用，并不是“高阶函数”。

条件渲染 循环渲染:

直接在标签内部编写逻辑块, 渲染结果会根据数据变化而变化
:::

## babel

1. 解析并转换较新的 JavaScript 语法
2. 通过 preset/plugin 转换 JSX、TypeScript 语法等
3. 提供可组合的插件与 preset 体系

Babel 负责语法转换，但不会凭空提供运行时 API。需要兼容旧环境时，应根据目标环境配合 `core-js` 等 polyfill 方案；具体是否、如何注入取决于 preset 配置。

## SWC

1. JavaScript、JSX、TypeScript 与 TSX 的解析和转换
2. 按目标环境降级语法
3. 代码压缩
4. 可作为 webpack、Rspack、Next.js 等工具链中的编译器

SWC 核心是编译器，不应直接等同于完整模块打包器。它能移除 TypeScript 类型语法，但默认不执行 TypeScript 类型检查；类型检查仍需 `tsc --noEmit` 或其他工具。

### 原理

Hook 只能在 React 函数组件或自定义 Hook 的顶层调用，不能放在循环、条件分支或普通函数中。

## \*useState 状态

### 基本类型

对于基本类型的使用:

```tsx
import { useState } from "react";

function App() {
  const [message, setMessage] = useState("test1");

  return (
    <>
      <h1>{message}</h1>
      <button onClick={() => setMessage("test2")}>更新文本</button>
    </>
  );
}

export default App;
```

### 数组

对于复杂类型的使用:

- 添加元素 --> concat, [...arr]
- 删除元素 --> filter, slice
- 替换元素 --> map
- 排序 --> 先将数组复制一份

这些操作都应返回新数组，不要直接修改 state 中原有的数组：

```tsx
const [items, setItems] = useState([1, 2, 3]);

setItems((current) => [...current, 4]);
setItems((current) => current.filter((item) => item !== 1));
setItems((current) => current.map((item) => (item === 2 ? 666 : item)));
setItems((current) => [...current].sort((a, b) => a - b));
```

下面是常见数组操作的参考表。当你操作 React state 中的数组时，你需要避免使用左列的方法，而首选右列的方法：

| 操作类型     | 避免使用（会改变原始数组）      | 推荐使用（会返回一个新数组）    | 示例                                                                                          |
| ------------ | ------------------------------- | ------------------------------- | --------------------------------------------------------------------------------------------- |
| **添加元素** | `push`<br>`unshift`             | `concat`<br>`[...arr]` 展开语法 | `const newArr = arr.concat(newItem)`<br>`const newArr = [...arr, newItem]`                    |
| **删除元素** | `pop`<br>`shift`<br>`splice`    | `filter`<br>`slice`             | `const newArr = arr.filter(item => item !== removeItem)`<br>`const newArr = arr.slice(0, -1)` |
| **替换元素** | `splice`<br>`arr[i] = ...` 赋值 | `map`                           | `const newArr = arr.map(item => item.id === targetId ? newItem : item)`                       |
| **排序**     | `reverse`<br>`sort`             | 先将数组复制一份                | `const newArr = [...arr].sort()`<br>`const newArr = [...arr].reverse()`                       |

`useState` 的 `setter` 会为后续渲染排队更新；它不会立即改变当前事件处理函数已经读取到的 `state` 快照。`useReducer` 也遵循相同的渲染与批处理机制，适合把复杂的状态转换集中到 reducer 中，但不能用来获得“同步更新”。

### 对象

`useState` 可以接受一个函数，可以在函数里面编写逻辑，初始化值，注意这个只会执行一次，更新时不会再次执行。

```ts
import { useState } from "react"
function App() {
  let [obj, setObject] = useState(() => {
    const date = new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate()
    return {
      date,
      name: 'John',
      age: 11
    }
  })
  const heandleClick = () => {
    setObject({
      ...obj,
      name: 'Ale'
    })
    //setObject(Object.assign({}, obj, { age: 26 })) 第二种写法
  }
  return (
    <>
      <button onClick={heandleClick}>更改值</button>
      <div>日期：{obj.date}</div>
      <div>姓名：{obj.name}</div>
      <div>年龄：{obj.age}</div>
    </>
  )
}
export default App
```

::: warning 注意

调用 `setter` 后，当前函数中的状态变量仍然是本次渲染的快照；新值会在后续渲染中读取到。(异步操作 为了性能优化)

This is because states behaves like a snapshot. Updating state requests another render with the new state value, but does not affect the count JavaScript variable in your already-running event handler.

如果当前逻辑还需要使用计算后的值，可以先把它保存到变量中，再传给 `setter`：

```ts
const nextCount = count + 1;
setCount(nextCount);

console.log(count); // 0
console.log(nextCount); // 1
```

如果下一状态依赖上一状态，尤其是在同一批处理中连续更新多次，应使用函数式更新：

```ts
setAge(age + 1); // 只基于当前渲染快照计算一次时可以使用
setAge((currentAge) => currentAge + 1); // 依赖上一状态时更稳妥
```

:::

## \*useImmer (第三方hook)

安装: `pnpm add immer use-immer`, 用于简化`useState`和`useReducer`的使用, 让你可以直接修改state对象, 而不需要手动创建新对象.

```tsx
import { useImmer, useImmerReducer } from "use-immer";

type User = {
  profile: { preferences: { theme: "light" | "dark" } };
};

function ThemeButton() {
  const [user, setUser] = useImmer<User>({
    profile: { preferences: { theme: "light" } },
  });

  const updateTheme = () => {
    setUser((draft) => {
      draft.profile.preferences.theme = "dark";
    });
  };

  return (
    <button onClick={updateTheme}>{user.profile.preferences.theme}</button>
  );
}

type State = { count: number; isLoading: boolean; history: number[] };
type Action =
  | { type: "INCREMENT" | "DECREMENT" | "RESET" | "ADD_TO_HISTORY" }
  | { type: "SET_LOADING"; payload: boolean };

function counterReducer(draft: State, action: Action) {
  switch (action.type) {
    case "INCREMENT":
      draft.count += 1;
      break;
    case "DECREMENT":
      draft.count -= 1;
      break;
    case "RESET":
      draft.count = 0;
      break;
    case "SET_LOADING":
      draft.isLoading = action.payload;
      break;
    case "ADD_TO_HISTORY":
      draft.history.push(draft.count);
      break;
  }
}

function Counter() {
  const [state, dispatch] = useImmerReducer(counterReducer, {
    count: 0,
    isLoading: false,
    history: [],
  });

  return (
    <button onClick={() => dispatch({ type: "INCREMENT" })}>
      {state.count}
    </button>
  );
}
```

## \*useEffect

`useEffect` 用于让组件与 React 之外的系统同步，例如网络、浏览器 API、计时器或第三方组件。它的执行过程和类组件的部分生命周期阶段相似，但更准确的理解是“建立同步，并在必要时撤销同步”。

> 什么是副作用函数，什么是纯函数？

- 纯函数:
  1. 输入决定输出：相同的输入永远会得到相同的输出。这意味着函数的行为是`可预测的`。
  2. 无副作用：纯函数`不会修改外部状态`，也`不会依赖外部可变状态`。因此，纯函数内部的操作不会影响外部的变量、文件、数据库等。
- 副作用函数:
  1. 副作用函数指的是那些在执行时`会改变外部状态`或`依赖外部可变状态`的函数。
  2. 可预测性降低但是副作用不一定是坏事有时候副作用带来的效果才是我们所期待的
  3. `高耦合度`函数非常依赖外部的变量状态紧密

:::info 副作用函数的例子

- 操作引用类型
- 操作本地存储例如`localStorage`
- 调用外部API，例如`fetch` `ajax`
- 操作`DOM`
- 计时器
  :::

```ts
//------------副作用函数--------------
const mutableUser = { name: "小满" };
const mutateUser = (user: { name: string }) => {
  user.name = "大满";
  return user;
};
mutateUser(mutableUser); // 修改了传入对象

//------------修改成纯函数--------------
const immutableUser = { name: "Alice" };
const renameUser = (user: { name: string }) => {
  return { ...user, name: "Jack" };
};

const renamedUser = renameUser(immutableUser);
console.log(immutableUser, renamedUser);
```

### 基本用法

```ts
useEffect(setup, dependencies);
```

参数:

- `setup`：Effect 处理函数，可以返回一个清理函数。组件提交到页面后执行 setup；依赖项变化时先使用旧值执行 cleanup，再使用新值执行 setup；卸载时再执行最后一次 cleanup。
- `dependencies`：setup中使用到的响应式值列表(props、state等)。必须以数组形式编写如[dep1, dep2]。不传则每次重渲染都执行Effect。

示例:

```tsx
import { useEffect, useRef } from "react";

function App() {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log(elementRef.current); // 已提交到 DOM 的 div
  }, []);

  return <div ref={elementRef}>zs</div>;
}
```

执行时机:

1. React 提交 DOM 更新后，Effect 的 setup 会按调度时机执行；它不是在渲染函数执行完后“立刻”运行。
2. 不传依赖数组时，每次提交后都会重新执行。
3. 传入依赖数组时，只有某个依赖与上次相比不满足 `Object.is` 相等才会重新执行；空数组表示不因响应式值变化而重跑。
4. 清理函数会在下一次相关 setup 之前以及组件卸载时执行。开发环境启用 Strict Mode 时，React 还会额外执行一次 setup → cleanup → setup，以检查清理逻辑是否完整。

::: warning useEffect的一些注意点

useEffect

1. setup 只能返回清理函数或不返回值，不能直接声明为 `async`，因为异步函数会返回 Promise。需要异步工作时，可在 setup 内定义并调用异步函数。
2. 依赖数组必须包含 setup 中读取的所有响应式值；空数组在生产环境通常只建立一次同步，但开发环境 Strict Mode 会进行额外检查。
3. 清理函数不仅在卸载时执行，也会在依赖变化后、下一次 setup 运行之前执行。
4. 不要用 Effect 处理可以在渲染期间直接计算的数据；Effect 主要用于与外部系统同步。

:::

### Clean up

React calls your setup and cleanup functions whenever it’s necessary, which may happen multiple times:

1. Your setup code runs when your component is added to the page (mounts).
2. After every commit of your component where the dependencies have changed:
   - First, your `cleanup code` runs with the old props and state.
   - Then, your `setup code` runs with the new props and state.
3. Your `cleanup code` runs one final time after your component is `removed` from the page (unmounts).

```tsx
import { useEffect, useState } from "react";

function Clock() {
  const [currentTime, setCurrentTime] = useState(() => new Date());

  useEffect(() => {
    const interval = window.setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => window.clearInterval(interval);
  }, []);

  return <time>{currentTime.toLocaleString()}</time>;
}
```

## \*useRef

- 通过 `Ref` 操作DOM元素
- 数据存储

首先是操作DOM元素:

```tsx
import { useRef } from "react";

function App() {
  const divRef = useRef<HTMLDivElement>(null);

  const handleClick = () => {
    console.log(divRef.current);
    console.dir(divRef.current); // 详细属性
    divRef.current.style.backgroundColor = "yellow"; // 修改背景颜色
  };

  return (
    <div>
      <h1>道德经</h1>
      <div ref={divRef}>道可道，非常道，名可名，非常名</div>
      <button onClick={handleClick}>获取DOM元素</button>
    </div>
  );
}

export default App;
```

其次是数据存储: 比如这段代码

```ts
import { useState } from "react";

function App() {
  console.log("render");
  let num = 0;

  const [count, setCount] = useState(0);
  const handleClick = () => {
    setCount(count + 1); // 重新渲染
    setCount(count + 1); // 没用 会异步渲染
    setCount((count) => count + 1); // 有用 会变为点击一次 +2
    num = count;
  };
  return (
    <div>
      <h1>数据存储</h1>
      <div>
        {/* 左边增加 右边不变 */}
        {count}:{num}
      </div>
      <button onClick={handleClick}>增加</button>
    </div>
  );
}

export default App;
```

第一种解决方案是: 将`let num = 0;`提到外侧, 第二种解决方案就是使用 `useRef`

```ts
import { useRef, useState } from "react";

function App() {
  console.log("render");
  let num = useRef(0);

  const [count, setCount] = useState(0);
  const handleClick = () => {
    setCount(count + 1); // 重新渲染
    num.current = count;
  };
  return (
    <div>
      <h1>数据存储</h1>
      <div>
        {/* 左边增加 右边不变 */}
        {count}:{num.current}
      </div>
      <button onClick={handleClick}>增加</button>
    </div>
  );
}

export default App;
```

::: tip `vue`的`ref`和`react`的`ref`有什么区别

1. `vue`的`ref`是通过`.value`访问值, 而`react`的`ref`是通过`.current`访问值
2. `vue`的`ref`是响应式的, 而`react`的`ref`是非响应式的

:::

### 注意事项

1. 组件在重新渲染的时候，`useRef` 的值不会被重新初始化。
2. 改变 `ref.current` 属性时，React 不会重新渲染组件。React 不知道它何时会发生改变，因为 `ref` 是一个普通的 `JavaScript` 对象。(不是响应式的)
3. `ref` 对象本身的引用通常是稳定的，可以出现在依赖数组中；但修改 `ref.current` 不会触发渲染，因此把 `ref.current` 放入依赖数组也不能让 Effect 自动响应其变化。
4. React 18 中，函数组件要接收父组件传入的 `ref`，通常需要 `forwardRef`。React 19 支持把 `ref` 作为函数组件的 prop 传入，新代码不再必须使用 `forwardRef`；类组件和 DOM 元素仍可直接接收 ref。

### 实际应用场景

```ts
import { useRef, useState } from "react";

function App() {
  let timer = null; // 一直再被重置为null
  const [count, setCount] = useState(0);

  const start = () => {
    timer = setInterval(() => {
      setCount((prev) => prev + 1); // 一直更新这个值 因此一直在渲染
    }, 100);
  };

  // 点击结束没有作用
  const end = () => {
    clearInterval(timer);
  };

  return (
    <div>
      <h1>计时器</h1>
      <div>{count}</div>
      <button onClick={start}>开始</button>
      <button onClick={end}>结束</button>
    </div>
  );
}

export default App;
```

解决方案:

```ts
import { useRef, useState } from "react";

function App() {
  let timer = useRef(null); // 一直再被重置为null
  const [count, setCount] = useState(0);

  const start = () => {
    timer.current = setInterval(() => {
      setCount((prev) => prev + 1); // 一直更新这个值 因此一直在渲染
    }, 100);
  };

  // 点击结束没有作用
  const end = () => {
    if (timer.current) clearInterval(timer.current);
  };

  return (
    <div>
      <h1>计时器</h1>
      <div>{count}</div>
      <button onClick={start}>开始</button>
      <button onClick={end}>结束</button>
    </div>
  );
}

export default App;
```

## React.memo

`React.memo` 是一个 React API，用于在父组件重新渲染、且组件 `props` 与上次相比没有变化时跳过该组件的重新渲染。(目前有一部分已经被`React Compiler`自动接管)

### 用法

使用 `React.memo` 包裹组件可以在 `props` 稳定时跳过一部分不必要的重新渲染，但它只是性能优化，不应无条件用于所有组件。

```tsx
import React, { useState } from "react";

type User = {
  name: string;
  age: number;
  phone: string;
};

// 子组件
// 现在这里React.memo不写也可以 已经被React Compiler自动接管
const UserCard = React.memo(({ user }: { user: User }) => {
  console.log("render child Component");

  const styles = {
    backgroundColor: "lightblue",
    padding: "20px",
    borderRadius: "10px",
    margin: "10px",
    color: "black",
  };

  return (
    <div style={styles}>
      <p>{user.name}</p>
      <p>{user.age}</p>
      <p>{user.phone}</p>
    </div>
  );
});

// 父组件
function App() {
  const [input, setInput] = useState("");
  const [user, setUser] = useState<User>({
    name: "Mike",
    age: 18,
    phone: "123456",
  });

  const changeUser = () => {
    console.log("click");

    setUser({
      ...user,
      name: input,
    });
  };

  return (
    <>
      {/* 此时点击这个 就会再次渲染 */}
      <button onClick={changeUser}>更改User</button>
      <input value={input} onChange={(e) => setInput(e.target.value)} />
      <UserCard user={user}></UserCard>
    </>
  );
}

export default App;
```

::: warning React的渲染条件是什么?

1. 组件自身 state 更新。
2. 组件读取的 Context 值变化。
3. 父组件重新渲染时，默认也会继续渲染其子组件；`memo` 可以在 props 未变化时跳过这一过程。
4. 外部 store 的订阅快照发生变化等其他更新来源。
   :::

## \*useMemo 性能优化

`useMemo` 就像一个"记忆缓存"，它会记住计算结果，只有当依赖项改变时才重新计算。, 类似于Vue的`computed`. (目前部分已经被`React Compiler`自动优化)

```ts
const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);
```

- 第一个参数：一个函数，返回需要缓存的值
- 第二个参数：依赖数组，当依赖变化时才重新计算 (如果传入一个空数组, 这个函数只会在首次渲染时执行一次. 如果传入依赖项, 只有当依赖项发生变化的时候, 这个回调函数才会执行. 如果什么都不传入, 这个函数会在首次渲染时执行一次, 并且里面任何一个值得到更新, 这个函数都会重新调用)
- 返回值：缓存的计算结果

### 经典例子：购物车总价计算

```ts
import { useState, useMemo } from "react";

function App() {
  const [cart, setCart] = useState([
    { id: 1, name: "苹果", price: 5, count: 2 },
    { id: 2, name: "香蕉", price: 3, count: 3 },
    { id: 3, name: "橙子", price: 4, count: 1 },
  ]);

  const [discount, setDiscount] = useState(0); // 折扣

  // // 没有使用 useMemo - 每次渲染都重新计算
  // const total = cart.reduce((sum, item) => {
  //   console.log("正在计算总价..."); // 每次渲染都会执行
  //   return sum + item.price * item.count;
  // }, 0);

  // 使用 useMemo - 只在购物车改变时重新计算
  const total = useMemo(() => {
    console.log("正在计算总价..."); // 只在 cart 改变时执行
    return cart.reduce((sum, item) => {
      return sum + item.price * item.count;
    }, 0);
  }, [cart]); // 依赖项：只有 cart 改变时才重新计算

  return (
    <div>
      <h2>购物车</h2>
      {cart.map((item) => (
        <div key={item.id}>
          {item.name} - ¥{item.price} × {item.count} = ¥
          {item.price * item.count}
        </div>
      ))}

      <h3>总价：¥{total}</h3>

      <button onClick={() => setDiscount(discount + 10)}>
        增加折扣（不影响总价计算）
      </button>
      <p>当前折扣：{discount}%</p>
    </div>
  );
}

export default App;
```

## \*useCallback 性能优化

在react中 `state props useContext`的更新都会导致组件重新渲染, 函数组件的重新渲染会导致组件内的函数被重新创建，这可能会导致性能问题。`useCallback` 通过缓存函数，可以减少不必要的重新渲染，提高性能。

`useCallback` 返回一个在依赖不变时保持引用相同的函数。它常与 `memo`、其他 Hook 的依赖数组或需要稳定回调引用的 API 配合使用。

组件每次渲染时仍会创建传给 `useCallback` 的函数表达式；React 只是决定返回上次缓存的函数引用还是本次的新函数。单独使用它不会阻止组件渲染，也不一定能提高性能。

### 用法

```ts
const memoizedCallback = useCallback(() => {
  doSomething(a, b);
}, [a, b]);
```

> 依赖项和 `useEffect` 相同: 如果传入空数组则只执行一次, 如果传入依赖项则根据依赖项的变化而变化. 如果什么都不传, 那么创建和更新这个函数它都会执行.

:::info `useCallback` 和 `useMemo` 的区别

共同点: 回调函数和依赖项都是一样的

不同点:

1. `useCallback()`返回当前所缓存的函数, `useMemo()` 返回这个函数执行之后的一个结果
2. `useCallback()`适合去缓存一些函数, `useMemo()` 适合去缓存一些有大量计算的一个值
   :::

### 案例1:

```tsx
import React, { useCallback, useState } from "react";

const map = new WeakMap();
let count = 1;

function App() {
  console.log("Render");

  const [input, setInput] = useState("");

  // 如果不使用useCallback 这个函数每次state变化时都会创建
  const changeValue = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  }, []);
  if (!map.has(changeValue)) {
    map.set(changeValue, count++);
  }
  console.log(map.get(changeValue));

  return (
    <>
      <input type="text" value={input} onChange={changeValue} />
    </>
  );
}

export default App;
```

### 案例2

```tsx
import React, { useState } from "react";

interface Props {
  user: {
    name: string;
    age: number;
  };
  callback: () => void;
}

// 给props传递了一个函数
// 此时点击按钮 即使有React.memo 仍然会打印  console.log("Render Child");
const Child = React.memo((props: Props) => {
  console.log("Render Child");

  return (
    <>
      <div>{props.user.name}</div>
      <div>{props.user.age}</div>
      <button onClick={props.callback}>Click</button>
    </>
  );
});

function App() {
  const [input, setInput] = useState("");
  const [user, setUser] = useState({
    name: "Mike",
    age: 18,
  });

  const callback = () => {
    console.log("callback");
  };

  return (
    <>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <Child user={user} callback={callback}></Child>
    </>
  );
}

export default App;
```

可以使用`useCallback` 去解决这个问题:

```tsx
import React, { useCallback, useState } from "react";

interface Props {
  user: {
    name: string;
    age: number;
  };
  callback: () => void;
}

const Child = React.memo((props: Props) => {
  console.log("Render Child");

  return (
    <>
      <div>{props.user.name}</div>
      <div>{props.user.age}</div>
      <button onClick={props.callback}>Click</button>
    </>
  );
});

function App() {
  const [input, setInput] = useState("");
  const [user, setUser] = useState({
    name: "Mike",
    age: 18,
  });

  // 使用useCallback进行优化 不会再次 console.log("Render Child");
  const callback = useCallback(() => {
    console.log("callback");
  }, []);

  return (
    <>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <Child user={user} callback={callback}></Child>
    </>
  );
}

export default App;
```

## \*SWR

`SWR` = `Stale-While-Revalidate`，用于数据获取的 React Hooks 库. 比如想实现一个功能: 当页面首次加载时, 自动发送一次请求, 当点击按钮时, 再次发送一次请求.

可以使用`useEffect` 来实现:

```tsx
import { useCallback, useEffect, useState } from "react";

const adviceURL = "https://api.adviceslip.com/advice";

function App() {
  const [advice, setAdvice] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const getAdvice = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await fetch(adviceURL);
      if (!result.ok) throw new Error(`HTTP ${result.status}`);
      const data = await result.json();
      setAdvice(data.slip.advice);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void getAdvice();
  }, [getAdvice]);

  return (
    <main>
      <h1>Advice App</h1>
      <p>{isLoading ? "Loading..." : advice}</p>
      <button disabled={isLoading} onClick={getAdvice}>
        Get Advice
      </button>
    </main>
  );
}
export default App;
```

使用 SWR 时仍然需要提供请求函数（fetcher），但缓存、重新验证和请求状态由 SWR 管理：

```tsx
import useSWR from "swr";
function App() {
  const adviceURL = "https://api.adviceslip.com/advice";

  const fetcher = (...args) => fetch(...args).then((res) => res.json());
  /**
   * SWR 会在 key 有效时请求数据，并可在重新聚焦、网络恢复等时机重新验证
   * data 是 API 返回的数据
   * isLoading 是一个布尔值，表示数据是否正在加载中
   * error 是 API 返回的错误信息
   * mutate 是一个函数，用于手动触发数据更新
   */
  const {
    data,
    error,
    isLoading,
    mutate: getAdvice,
  } = useSWR(adviceURL, fetcher);

  return (
    <main>
      <h1>Advice App</h1>
      <p>
        {error ? error.message : isLoading ? "Loading..." : data?.slip?.advice}
      </p>
      <button disabled={isLoading} onClick={() => getAdvice()}>
        Get Advice
      </button>
    </main>
  );
}
export default App;
```

SWR也可以不一上来获取数据, 而是在需要的时候获取. 可以使用`useSWRMutation`.

```ts
const { trigger, data, error, isMutating } = useSWRMutation(
  key,
  fetcher,
  options,
);
```

这里各部分含义：

1. API_URL

- 第一个参数 key（请求标识/基础 key）。
- 你这里通常是接口基础地址，比如 https://api.openweathermap.org/data/2.5。

2. fetcher

- 第二个参数，请求函数。(封装一个fetch, 用于请求数据)
- 传入请求函数
- 调用 `trigger(arg)` 时，SWR 会把 `arg` 作为第二个参数对象中的 `arg` 字段传给 fetcher，例如 `async (url, { arg }) => ...`；第一个参数仍是 key。

3. 解构出来的内容

- trigger：手动触发请求的函数（mutation 不会自动请求）。触发的就是传进去的fetcher。
- data：请求成功后的返回数据（即 fetcher 返回的 JSON）。
- isMutating：是否正在请求中（true/false）。
- error：请求失败时的错误对象。

## \*Tanstack Query (v5)

> TanStack Query 是什么

### 1. TanStack Query 是什么

TanStack Query 原名 React Query，是一个用于管理**服务器状态（Server State）**的异步状态管理库。

它主要解决：

- 请求服务器数据
- 管理加载和错误状态
- 缓存服务器响应
- 多个组件共享同一份请求结果
- 判断数据是否过期
- 后台重新请求
- 请求失败自动重试
- 创建、修改和删除服务器数据
- 数据修改后的缓存刷新
- 分页、无限滚动和乐观更新

一句话总结：

> TanStack Query 管理的是“来自服务器的数据”，而不是所有 React 状态。

官方文档：[TanStack Query React 文档](https://tanstack.com/query/latest/docs/framework/react)

---

### 2. 为什么需要 TanStack Query

只使用 React 获取数据时，通常需要自己管理：

```tsx
const [data, setData] = useState<User | null>(null);
const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState<Error | null>(null);

useEffect(() => {
  setIsLoading(true);

  fetch("/api/user")
    .then((response) => response.json())
    .then(setData)
    .catch(setError)
    .finally(() => setIsLoading(false));
}, []);
```

真实项目还需要继续处理：

- 组件卸载后的请求取消
- 多个组件重复请求相同接口
- 请求竞态问题
- 缓存和缓存过期
- 网络断开后重新连接
- 窗口重新聚焦时刷新
- 请求失败重试
- 修改数据后重新获取列表

TanStack Query 把这些通用逻辑封装起来，让组件只关心：

```text
请求什么数据？
数据加载中显示什么？
请求失败显示什么？
请求成功显示什么？
```

---

### 3. 服务器状态与客户端状态

#### 服务器状态

服务器状态来自远程 API：

```ts
const user = await fetch("/api/user");
const articles = await fetch("/api/articles");
const comments = await fetch("/api/comments");
```

它具有这些特点：

- 不完全由前端控制
- 需要异步请求
- 可能被其他用户修改
- 本地数据可能过期
- 需要缓存和重新同步

这类数据适合 TanStack Query。

#### 客户端状态

客户端状态只属于当前应用：

```ts
const isSidebarOpen = true;
const theme = "dark";
const searchInput = "react";
```

这类状态更适合：

- `useState`
- Zustand
- URL

#### 状态管理边界

| 状态                 | 推荐工具                       |
| -------------------- | ------------------------------ |
| 输入框内容           | `useState`                     |
| 弹窗是否打开         | `useState` 或 Zustand          |
| 登录弹窗、主题       | Zustand                        |
| 页码、标签、筛选条件 | React Router URL               |
| 用户资料、文章、评论 | TanStack Query                 |
| 表单提交状态         | React Actions 或 `useMutation` |

TanStack Query不会完全替代 Zustand。它主要减少了把服务器响应存入全局 Store 的需要。[官方说明](https://tanstack.com/query/latest/docs/framework/react/guides/does-this-replace-client-state)

---

### 4. 安装与初始化

#### 安装

```bash
pnpm add @tanstack/react-query
```

可选安装开发工具：

```bash
pnpm add -D @tanstack/react-query-devtools
```

#### 创建 QueryClient

```tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />

      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </StrictMode>,
);
```

`QueryClient` 是整个应用的查询管理器，负责：

- 保存查询缓存
- 更新缓存
- 使缓存失效
- 重新请求数据
- 设置全局默认配置

通常一个前端应用只创建一个 `QueryClient`。

---

### 5. 三个核心概念

TanStack Query 最重要的三个概念是：

```text
Query：查询服务器数据
Mutation：修改服务器数据
Invalidation：让旧缓存失效
```

官方快速入门也是围绕这三个概念展开的：[Quick Start](https://tanstack.com/query/latest/docs/framework/react/quick-start)

---

> 第一部分：Query

---

### 6. 使用 `useQuery` 获取数据

基本结构：

```tsx
const query = useQuery({
  queryKey: ["users"],
  queryFn: getUsers,
});
```

一个 Query 至少需要：

- `queryKey`：缓存标识
- `queryFn`：返回 Promise 的请求函数

---

### 7. 编写 API 请求函数

```tsx
interface GitHubUser {
  login: string;
  name: string | null;
  avatar_url: string;
  bio: string | null;
}

async function getGitHubUser(
  username: string,
  signal?: AbortSignal,
): Promise<GitHubUser> {
  const response = await fetch(`https://api.github.com/users/${username}`, {
    signal,
  });

  if (!response.ok) {
    throw new Error(`请求失败：${response.status}`);
  }

  return response.json();
}
```

注意：`fetch` 遇到 404、500 时不会自动抛出异常，所以必须检查：

```ts
if (!response.ok) {
  throw new Error("请求失败");
}
```

---

### 8. 完整的 `useQuery` 示例

```tsx
import { useQuery } from "@tanstack/react-query";

interface UserPageProps {
  username: string;
}

export function UserPage({ username }: UserPageProps) {
  const {
    data: user,
    error,
    isPending,
    isError,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ["github-user", username],
    queryFn: ({ signal }) => getGitHubUser(username, signal),
    staleTime: 60_000,
  });

  if (isPending) {
    return <p>正在加载用户……</p>;
  }

  if (isError) {
    return (
      <section>
        <p>{error.message}</p>

        <button onClick={() => refetch()}>重新加载</button>
      </section>
    );
  }

  return (
    <section>
      {isFetching && <p>正在后台更新……</p>}

      <img src={user.avatar_url} alt={`${user.login} 的头像`} />

      <h1>{user.name ?? user.login}</h1>
      <p>{user.bio ?? "该用户没有填写简介"}</p>
    </section>
  );
}
```

---

### 9. `useQuery` 的常用返回值

| 返回值       | 说明                            |
| ------------ | ------------------------------- |
| `data`       | 查询成功后的数据                |
| `error`      | 查询失败后的错误                |
| `status`     | `pending`、`error` 或 `success` |
| `isPending`  | 当前还没有可用数据              |
| `isError`    | 查询失败                        |
| `isSuccess`  | 查询成功                        |
| `isFetching` | 当前正在执行请求，包括后台刷新  |
| `refetch()`  | 手动重新请求                    |

推荐的页面判断顺序：

```tsx
if (isPending) {
  return <Loading />;
}

if (isError) {
  return <ErrorMessage error={error} />;
}

return <SuccessContent data={data} />;
```

检查完 `isPending` 和 `isError` 后，TypeScript 能推断 `data` 已经存在。[Queries 官方指南](https://tanstack.com/query/latest/docs/framework/react/guides/queries)

---

### 10. `isPending` 与 `isFetching`

第一次进入页面：

```ts
isPending === true;
isFetching === true;
```

已经有缓存，正在后台更新：

```ts
isPending === false;
isFetching === true;
```

因此：

```tsx
if (isPending) {
  return <FullPageLoading />;
}
```

适合第一次加载。

```tsx
{
  isFetching && <SmallSpinner />;
}
```

适合后台刷新提示。

记忆：

```text
isPending：现在有没有数据？
isFetching：现在有没有请求正在执行？
```

---

### 11. Query Key

`queryKey` 是一份服务器数据的缓存身份证。

```tsx
queryKey: ["github-user", username];
```

不同的 Key 表示不同的数据：

```ts
["github-user", "octocat"][("github-user", "torvalds")][
  ("articles", { page: 1 })
][("articles", { page: 2 })][("articles", { page: 1, tag: "react" })][
  ("articles", { page: 1, tag: "typescript" })
];
```

所有会影响请求结果的变量，都必须放进 `queryKey`：

```tsx
useQuery({
  queryKey: ["articles", page, tag],
  queryFn: () => getArticles(page, tag),
});
```

错误示例：

```tsx
useQuery({
  queryKey: ["articles"],
  queryFn: () => getArticles(page, tag),
});
```

这里 `page` 和 `tag` 变化了，但 Key 没变，缓存可能出现错误。

规则：

- Query Key 必须是数组
- Key 应该可以序列化
- 请求依赖的参数必须进入 Key
- 相同 Key 代表同一份服务器数据

参考：[Query Keys 官方指南](https://tanstack.com/query/latest/docs/framework/react/guides/query-keys)

---

### 12. 条件查询

只有满足条件时才执行请求：

```tsx
const query = useQuery({
  queryKey: ["github-user", username],
  queryFn: ({ signal }) => getGitHubUser(username, signal),
  enabled: username.trim().length > 0,
});
```

当 `enabled` 为 `false` 时，查询不会自动执行。

适用场景：

- 用户名不为空才查询
- 登录后才查询个人数据
- 上一个请求成功后才执行下一个请求
- 弹窗打开后才请求详情

---

### 13. 查询取消

TanStack Query 会把 `AbortSignal` 传给 `queryFn`：

```tsx
useQuery({
  queryKey: ["user", username],
  queryFn: ({ signal }) =>
    fetch(`/api/users/${username}`, { signal }).then(async (response) => {
      if (!response.ok) {
        throw new Error("请求失败");
      }

      return response.json();
    }),
});
```

当查询不再需要或被取消时，`signal` 可以终止对应的 `fetch` 请求。

这能防止：

- 用户快速切换页面时旧请求覆盖新数据
- 组件离开后继续执行无用请求
- 浪费网络资源

参考：[Query Cancellation](https://tanstack.com/query/latest/docs/framework/react/guides/query-cancellation)

---

> 第二部分：缓存

---

### 14. TanStack Query 的缓存流程

假设组件执行：

```tsx
useQuery({
  queryKey: ["users"],
  queryFn: getUsers,
});
```

运行过程：

```text
组件渲染
   ↓
根据 queryKey 查找缓存
   ↓
缓存中没有数据
   ↓
执行 queryFn
   ↓
保存请求结果
   ↓
组件重新渲染
   ↓
其他组件使用相同 queryKey
   ↓
共享同一份缓存
```

如果另一个组件也使用：

```tsx
useQuery({
  queryKey: ["users"],
  queryFn: getUsers,
});
```

TanStack Query能够复用缓存，而不需要把用户数据放进 Zustand。

---

### 15. `staleTime`

`staleTime` 表示数据在多长时间内是“新鲜”的：

```tsx
useQuery({
  queryKey: ["users"],
  queryFn: getUsers,
  staleTime: 60_000,
});
```

表示一分钟内数据是新鲜的。

在新鲜期间，TanStack Query通常可以直接使用缓存，而不进行基于过期状态的重新请求。

```ts
staleTime: 0;
```

数据立即过期，这是默认行为。

```ts
staleTime: 5 * 60_000;
```

五分钟内视为新鲜。

```ts
staleTime: Infinity;
```

永不过期，直到手动使其失效。

---

### 16. `gcTime`

`gcTime` 表示：

> 当没有任何组件使用缓存后，缓存还要保存多长时间。

```tsx
useQuery({
  queryKey: ["users"],
  queryFn: getUsers,
  gcTime: 10 * 60_000,
});
```

表示查询不再被使用后，缓存保留十分钟。

区别：

```text
staleTime：数据什么时候过期
gcTime：无人使用的缓存什么时候被删除
```

不要把它们混为一谈。

---

### 17. 当前重要默认行为

TanStack Query v5 默认：

- 查询数据会立即被认为过期
- 过期数据可能在组件挂载时后台刷新
- 窗口重新获得焦点时可能刷新
- 网络恢复时可能刷新
- 无人使用的缓存默认约 5 分钟后回收
- 查询失败默认重试 3 次

这些默认行为可以修改：

```tsx
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      gcTime: 10 * 60_000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});
```

不要看到开发环境中接口多次请求，就立即认为代码有问题。先检查缓存是否已经 stale，以及是否发生了窗口聚焦、重新挂载或网络恢复。

参考：[Important Defaults](https://tanstack.com/query/latest/docs/framework/react/guides/important-defaults)

---

> 第三部分：Mutation

---

### 18. 使用 `useMutation` 修改数据

`useQuery` 通常用于读取数据：

```text
GET 用户
GET 文章
GET 评论
```

`useMutation` 通常用于产生服务器副作用：

```text
POST 创建
PUT/PATCH 修改
DELETE 删除
登录、注册、收藏、关注
```

定义请求函数：

```tsx
interface CreateTodoInput {
  title: string;
}

interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

async function createTodo(input: CreateTodoInput): Promise<Todo> {
  const response = await fetch("/api/todos", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new Error("创建任务失败");
  }

  return response.json();
}
```

组件中使用：

```tsx
import { useMutation, useQueryClient } from "@tanstack/react-query";

function TodoForm() {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: createTodo,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["todos"],
      });
    },
  });

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const title = String(formData.get("title") ?? "").trim();

    if (!title) return;

    createMutation.mutate({ title });
  }

  return (
    <form onSubmit={handleSubmit}>
      <input name="title" />

      <button disabled={createMutation.isPending}>
        {createMutation.isPending ? "正在创建……" : "创建任务"}
      </button>

      {createMutation.isError && <p>{createMutation.error.message}</p>}
    </form>
  );
}
```

Mutation 的主要状态：

| 状态        | 说明     |
| ----------- | -------- |
| `isIdle`    | 尚未执行 |
| `isPending` | 正在提交 |
| `isError`   | 提交失败 |
| `isSuccess` | 提交成功 |

参考：[Mutations 官方指南](https://tanstack.com/query/latest/docs/framework/react/guides/mutations)

---

### 19. `mutate` 与 `mutateAsync`

普通调用：

```tsx
mutation.mutate(input);
```

使用回调处理结果：

```tsx
mutation.mutate(input, {
  onSuccess: (data) => {
    console.log(data);
  },
});
```

如果需要使用 `await`：

```tsx
try {
  const result = await mutation.mutateAsync(input);
  console.log(result);
} catch (error) {
  console.error(error);
}
```

一般事件处理使用 `mutate` 就够了；需要串行组合异步流程时可以使用 `mutateAsync`。

---

> 第四部分：缓存失效

---

### 20. `invalidateQueries`

创建、修改或删除数据后，之前缓存的列表可能已经不准确。

例如创建任务成功：

```tsx
const mutation = useMutation({
  mutationFn: createTodo,

  onSuccess: () => {
    queryClient.invalidateQueries({
      queryKey: ["todos"],
    });
  },
});
```

`invalidateQueries()` 的作用可以理解为：

```text
告诉 TanStack Query：
这份缓存可能已经过期，请在适当的时候重新获取。
```

它不是简单地直接删除所有缓存。

例如：

```tsx
queryClient.invalidateQueries({
  queryKey: ["todos"],
});
```

可以匹配：

```ts
["todos"][("todos", { page: 1 })][("todos", { page: 2 })];
```

如果只希望精确匹配：

```tsx
queryClient.invalidateQueries({
  queryKey: ["todos"],
  exact:tk true,
});
```

> 注：正确代码应写成 `exact: true`。

参考：[Query Invalidation](https://tanstack.com/query/latest/docs/framework/react/guides/query-invalidation)

---

### 21. 直接更新缓存

如果接口已经返回完整的新数据，可以直接更新缓存：

```tsx
const updateMutation = useMutation({
  mutationFn: updateTodo,

  onSuccess: (updatedTodo) => {
    queryClient.setQueryData<Todo[]>(["todos"], (oldTodos = []) =>
      oldTodos.map((todo) => (todo.id === updatedTodo.id ? updatedTodo : todo)),
    );
  },
});
```

两种常见策略：

```text
invalidateQueries
实现简单，重新请求服务器，可靠性更高

setQueryData
立即更新本地缓存，减少请求，但逻辑更复杂
```

学习初期优先使用：

```tsx
invalidateQueries();
```

---

> 第五部分：与其他工具协作

---

### 22. TanStack Query 与 Zustand

错误做法：

```tsx
const { data } = useQuery(...);

useEffect(() => {
  useUserStore.getState().setUser(data);
}, [data]);
```

这会产生两份服务器数据：

```text
TanStack Query 中一份
Zustand 中又一份
```

之后很难判断哪一份是最新数据。

正确划分：

```text
TanStack Query
用户资料、文章、评论、商品

Zustand
主题、搜索历史、侧边栏、客户端草稿
```

---

### 23. TanStack Query 与 React Router

React Router负责：

- 当前页面
- URL 参数
- 页码
- 标签
- 搜索条件
- 页面导航

TanStack Query负责：

- 根据这些参数请求服务器数据
- 缓存请求结果
- 后台重新同步

例如：

```text
/users/octocat?page=2
```

状态划分：

```ts
// React Router
username = "octocat";
page = 2;

// TanStack Query
user;
repositories;

// Zustand
searchHistory;

// useState
searchInput;
```

一个参数完整的查询：

```tsx
const query = useQuery({
  queryKey: ["repositories", username, page],
  queryFn: ({ signal }) => getRepositories(username, page, signal),
});
```

Router和 TanStack Query 都能参与数据加载。项目中应该明确选择数据策略，避免 loader 和组件对同一个接口重复请求。

---

### 24. 当前 TodoMVC 是否需要 TanStack Query

当前 TodoMVC 的 Todo 数据保存在浏览器本地：

```ts
todos: Todo[];
```

它不是服务器状态，因此不需要 TanStack Query。

当前项目应该使用：

```text
本地 State
   ↓
迁移到 Zustand
   ↓
使用 persist 保存到 localStorage
```

当项目连接 Go 后端之后：

```text
GET /api/todos
POST /api/todos
PATCH /api/todos/:id
DELETE /api/todos/:id
```

这些服务器数据才适合交给 TanStack Query。

---

> 第六部分：常见错误

---

### 25. 直接执行 `queryFn`

错误：

```tsx
useQuery({
  queryKey: ["user", username],
  queryFn: getUser(username),
});
```

这里在渲染时已经调用了函数。

正确：

```tsx
useQuery({
  queryKey: ["user", username],
  queryFn: () => getUser(username),
});
```

---

### 26. Query Key 缺少依赖参数

错误：

```tsx
useQuery({
  queryKey: ["user"],
  queryFn: () => getUser(username),
});
```

正确：

```tsx
useQuery({
  queryKey: ["user", username],
  queryFn: () => getUser(username),
});
```

---

### 27. 不检查 HTTP 状态

错误：

```tsx
const response = await fetch("/api/users");
return response.json();
```

正确：

```tsx
const response = await fetch("/api/users");

if (!response.ok) {
  throw new Error(`请求失败：${response.status}`);
}

return response.json();
```

---

### 28. 把服务器响应复制到 `useState`

通常不需要：

```tsx
const query = useQuery(...);
const [users, setUsers] = useState<User[]>([]);

useEffect(() => {
  if (query.data) {
    setUsers(query.data);
  }
}, [query.data]);
```

直接使用：

```tsx
const { data: users = [] } = useQuery(...);
```

只有当用户需要编辑一份独立草稿时，才考虑复制服务器数据。

---

### 29. 所有数据都设置 `staleTime: Infinity`

```tsx
staleTime: Infinity;
```

表示数据不会因为过期自动刷新。

它适合极少变化的数据，不适合直接作为所有接口的默认配置。否则用户可能长期看到旧数据。

应该根据业务设置：

```ts
// 更新频繁
staleTime: 10_000;

// 普通列表
staleTime: 60_000;

// 很少变化的配置
staleTime: 30 * 60_000;
```

---

> 第七部分：记忆总结

---

### 30. 核心口诀

```text
读取服务器数据：useQuery
修改服务器数据：useMutation
操作查询缓存：useQueryClient
标识一份数据：queryKey
执行具体请求：queryFn
通知缓存过期：invalidateQueries
新鲜时间：staleTime
缓存回收时间：gcTime
```

### 31. 最小使用模板

```tsx
const query = useQuery({
  queryKey: ["resource", id],
  queryFn: ({ signal }) => getResource(id, signal),
});

if (query.isPending) {
  return <Loading />;
}

if (query.isError) {
  return <ErrorMessage error={query.error} />;
}

return <Content data={query.data} />;
```

Mutation 模板：

```tsx
const queryClient = useQueryClient();

const mutation = useMutation({
  mutationFn: createResource,

  onSuccess: () => {
    queryClient.invalidateQueries({
      queryKey: ["resources"],
    });
  },
});
```

---

> 第八部分：复习问题

---

1. TanStack Query主要管理客户端状态还是服务器状态？
2. `queryKey` 有什么作用？
3. 为什么请求参数必须放进 `queryKey`？
4. `queryFn` 必须返回什么？
5. `isPending` 和 `isFetching` 有什么区别？
6. `staleTime` 和 `gcTime` 有什么区别？
7. `useQuery` 与 `useMutation` 分别适合什么操作？
8. 创建数据成功后，为什么需要调用 `invalidateQueries`？
9. 为什么不应该把 Query 数据再复制进 Zustand？
10. React Router、Zustand 和 TanStack Query分别负责什么状态？

如果能不看答案解释这些问题，说明已经掌握了 TanStack Query 的核心思想。

## \*useContext

`useContext` 是 React 提供的一个 Hook,用于跨组件层级共享数据,避免"`props` 逐层传递"(也叫 `prop drilling`)的问题。

:::info 面试题
使用 `useContext` 避免了层层传递props, 并且实现了跨组件之间的共享状态, 使组件之间的通讯变得更加简单. 换而言之, `useContext` 实现了祖孙级别的通讯.
:::

### 基本用法

```tsx
import { createContext, useContext } from "react";

const MyThemeContext = createContext({ theme: "light" }); // 创建一个需要传递的值

function App() {
  return (
    // 创建之后变成一个组件
    <MyThemeContext value={{ theme: "dark" }}>
      <MyComponent />
    </MyThemeContext>
  );
}

function MyComponent() {
  const themeContext = useContext(MyThemeContext);
  return <div>{themeContext.theme}</div>;
}
```

React 19 可以直接把 Context 对象作为 Provider 使用。React 18 应写成 `<MyThemeContext.Provider value={...}>`；React 19 仍兼容 `.Provider`，并不是删除了 Provider。

### 具体案例

```tsx
import React, { useContext, useState } from "react";

const ThemeContext = React.createContext({} as IThemeContext);

interface IThemeContext {
  theme: string;
  setTheme: (theme: string) => void;
}

const Child = () => {
  const theme = useContext(ThemeContext);

  console.log("theme Child", theme);

  const styles = {
    width: "200px",
    height: "200px",
    backgroundColor: theme.theme === "dark" ? "#000" : "#fff",
    color: theme.theme === "dark" ? "#000" : "#fff",
    border: "1px soild #ccc",
  };
  return (
    <>
      <div>
        <button
          onClick={() =>
            theme.setTheme(theme.theme === "light" ? "dark" : "light")
          }
        >
          Swtich
        </button>
        <div style={styles}>child</div>
      </div>
    </>
  );
};

const Parent = () => {
  const theme = useContext(ThemeContext);
  console.log("theme Parent", theme);

  const styles = {
    width: "200px",
    height: "200px",
    backgroundColor: theme.theme === "dark" ? "#000" : "#fff",
    color: theme.theme === "dark" ? "#000" : "#fff",
    border: "1px soild #ccc",
  };

  return (
    <>
      <div>
        <div style={styles}>Parent</div>
      </div>
      <Child />
    </>
  );
};

function App() {
  const [theme, setTheme] = useState("light");
  return (
    <>
      <button onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
        Swtich
      </button>
      {/* ThemeContext.Provider 是react 18的写法 现在可以按照以下那种写法写 */}
      <ThemeContext value={{ theme, setTheme }}>
        <Parent />
      </ThemeContext>
    </>
  );
}

export default App;
```

### 注意事项

- `Provider` 接收使用 `value` (只能使用`value`, 不可以改名)
- 可以使用多个 `Context`
- 组件读取同一个 `Context` 时，下面的值会覆盖上面的值

## useImperativeHandle 父组件使用子组件的实例 方法

```ts
/**
 * ref: 父组件传递的ref对象
   createHandle: 返回值，返回一个对象，对象的属性就是子组件暴露给父组件的方法或属性
   deps?:[可选] 依赖项，当依赖项发生变化时，会重新调用createHandle函数，类似于useEffect的依赖项
 */
useImperativeHandle(
  ref,
  () => {
    return {
      // 暴露给父组件的方法或属性
    };
  },
  dependencies,
);
```

### 执行时机

1. 不传第三个参数时，每次组件重新渲染都会重新执行 `createHandle`。
2. 传入空数组时，在依赖不变的情况下复用同一个句柄。
3. 传入依赖项时，React 使用 `Object.is` 比较依赖；变化后会重新执行 `createHandle`。开发环境 Strict Mode 可能额外调用组件函数以检查纯度，因此不要在 `createHandle` 中放置副作用。

## useDebugValue

`useDebugValue` 是一个专为开发者调试自定义 Hook 而设计的 React Hook。它允许你在 React 开发者工具中为自定义 Hook 添加自定义的调试值。

### 用法

```ts
useDebugValue(value, formatValue);
```

`useDebugValue` 没有返回值，应在自定义 Hook **顶层调用**。可选的格式化函数只在 `React DevTools` 读取调试值时执行，适合格式化成本较高的情况。

## useId

`useId` 是 React 18 新增的一个 Hook，用于生成稳定的唯一标识符，主要用于解决 SSR 场景下的 ID 不一致问题，或者需要为组件生成唯一 ID 的场景。

用法:

```ts
const id = useId();
```

返回值的具体格式属于 React 实现细节，不应解析或依赖；`useId` 主要用于关联 `label` 与表单控件、ARIA 属性等。它不应用来生成列表的 `key`，列表 key 应来自数据本身。

## useLayoutEffect

`useLayoutEffect` 是 React 中的一个 Hook，用于在浏览器重新绘制屏幕之前触发。

用法:

```ts
useLayoutEffect(() => {
  // 副作用代码
  return () => {
    // 清理代码
  };
}, [dependencies]);
```

参数: 和 `useEffect` 类似

:::info useLayoutEffect和useEffect区别

| 区别         | useLayoutEffect                    | useEffect                                                    |
| ------------ | ---------------------------------- | ------------------------------------------------------------ |
| **执行时机** | DOM 已提交、浏览器绘制前执行       | 通常在浏览器绘制后执行；交互触发的 Effect 也可能在绘制前运行 |
| **调度特征** | setup 与其中的更新会阻塞浏览器绘制 | 不应依赖“必定异步”或“必定绘制后”的时序                       |
| **适用范围** | 绘制前测量布局或同步调整视觉结果   | 默认选择，用于大多数外部系统同步                             |

:::

应用场景:

- 需要同步读取或更改DOM：例如，你需要读取元素的大小或位置并在渲染前进行调整。
- 防止闪烁：在某些情况下，异步的`useEffect`可能会导致可见的布局跳动或闪烁。例如，动画的启动或某些可见的快速DOM更改。
- 第三方 DOM 库要求在浏览器绘制前完成测量和同步调整。除此之外应优先使用 `useEffect`，避免不必要地阻塞绘制。

## useReducer：集中管理复杂状态更新

`const [state, dispatch] = useReducer(reducer, initialArg, init?)`

- `reducer`: 纯函数；接收当前 state 和 action，并返回下一 state。初始化和后续渲染期间 React 都可能调用它，开发模式下还可能额外调用以帮助发现副作用
- `initialArg`: 默认值
- `init`: 可选的惰性初始化函数；React 使用 `init(initialArg)` 的返回值作为初始 state

![useReducer](/assert/react-image/useReducer.png)

示例:

```tsx
import { useReducer } from "react";

// 默认值
const initialState = {
  count: -1,
};

type State = typeof initialState;

// 初始化函数 只在初始化时执行一次 修饰默认值
const initFn = (state: State) => {
  console.log("init", state);

  // 取反
  return { count: Math.abs(state.count) };
};

// 处理函数 默认不执行 只有在dispatch时才会执行
// 第二个是action对象 里面有type属性 用于区分不同的操作
const reducer = (state: State, action: { type: "add" | "sub" }) => {
  console.log("reducer", state);

  switch (action.type) {
    case "add":
      return { count: state.count + 1 };
    case "sub":
      return { count: state.count - 1 };
    default:
      return state;
  }
};

function App() {
  // 第一个参数是reducer处理函数
  // 第二个参数是默认值
  // 第三个参数可选 初始化函数 用于修饰默认值
  // 传了第三个参数后，默认值会被传入初始化函数中，返回值会作为最终的默认值 如果没传就是直接使用默认值
  const [state, dispatch] = useReducer(reducer, initialState, initFn);

  return (
    <>
      <div>
        <button onClick={() => dispatch({ type: "add" })}>+1</button>
        <button onClick={() => dispatch({ type: "sub" })}>-1</button>
        <p>{state.count}</p>
      </div>
    </>
  );
}

export default App;
```

## useSyncExternalStore

案例分析:

React 不知道 `localStorage` 的存在。`localStorage` 是浏览器的 API，跟 React 没有半毛钱关系。所以：

```js
// 你手动改了 localStorage
localStorage.setItem("username", "李四");

// React 完全不知道发生了什么
// 组件不会重新渲染！
```

那如果要让 React 知道呢？最笨的办法：

```javascript
// 写个定时器不停地检查 localStorage 有没有变
setInterval(() => {
  setUsername(localStorage.getItem("username"));
}, 100);
```

显然这种方式很蠢。React 18 推出了 useSyncExternalStore 就是为了优雅地解决这个问题

> useSyncExternalStore 是干什么的？

让 React 组件订阅一个"外部数据源"，数据源变化时自动重新渲染。

```typescript
const value = useSyncExternalStore(
  subscribe, // 1. 怎么订阅？（告诉 React 听什么事件）
  getSnapshot, // 2. 数据是什么？（告诉 React 怎么拿到当前值）
  getServerSnapshot, // 3. (可选) 服务端渲染时拿什么值
);
```

`useSyncExternalStore` 用于从外部存储（例如状态管理库、浏览器 API 等）获取状态并在组件中同步显示。这对于需要跟踪外部状态的应用非常有用。

使用场景:

1. 订阅外部 `store`，例如 `Redux Zustand` 等
2. 订阅浏览器API 例如(`online storage location`)等
3. 抽离逻辑，编写自定义`hooks`
4. 服务端渲染支持 (SSR)

用法:

`const snapshot = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot?);`

- subscribe：用来`订阅数据源的变化`，接收一个回调函数，在数据源更新时调用该回调函数.
- getSnapshot：获取当前数据源的快照（当前状态）。在 store 没有变化时，它必须返回与上次 `Object.is` 相等的值；如果快照是可变对象，应缓存不可变快照.
- getServerSnapshot：可选。在服务端渲染以及 `hydration` 时提供初始快照；服务端输出与客户端首次读取的值应保持一致.

```ts
import { useSyncExternalStore } from "react";

// 用法：const [name, setName] = useStorage("username", "游客")
// 类似 useState，但数据存到 localStorage，跨标签页同步
export const useStorage = <T>(
  key: string,
  initValue: T,
): [T, (v: T) => void] => {
  // 1. subscribe：告诉 React 监听什么事件
  //    storage 事件只在【其他标签页】修改 localStorage 时触发
  const subscribe = (callback: () => void) => {
    window.addEventListener("storage", callback);
    // 返回的清理函数，组件卸载时 React 会自动调用
    return () => window.removeEventListener("storage", callback);
  };

  // 2. getSnapshot：告诉 React 当前数据是什么
  //    必须是纯函数，返回不可变的值
  const getSnapshot = (): T => {
    const value = localStorage.getItem(key);
    if (value === null) return initValue;
    try {
      return JSON.parse(value) as T;
    } catch {
      return initValue;
    }
  };

  // 3. 调用 useSyncExternalStore
  //    React 会自动：订阅 → 取值 → 变化时重新渲染 → 卸载时清理
  const res = useSyncExternalStore(subscribe, getSnapshot);

  // 4. 更新函数：写入 localStorage
  //    注意：当前页修改自己不会触发 storage 事件
  //    所以手动 dispatch 一个 storage 事件让 React 重新渲染
  const updateStorage = (newValue: T) => {
    localStorage.setItem(key, JSON.stringify(newValue));
    window.dispatchEvent(new Event("storage"));
  };

  return [res, updateStorage];
};
```

## useTransition (较少使用)

> 用途: 用来告诉 React："这个更新不紧急，可以慢慢来。"

```ts
const [isPending, startTransition] = useTransition();
```

- 参数: `useTransition` 不需要任何参数
- 返回值:

1. `isPending(boolean)`，是否有 `transition` 还在进行中
2. `startTransition(function)` 函数，你可以使用此方法将状态更新标记为 `transition` (包裹那些"不紧急"的更新)

React 19 允许传给 `startTransition` 的 `Action` 是异步函数。不过在当前版本中，`await` 之后发生的状态更新不会自动继承 `Transition` 标记，需要再包一层 `startTransition`。输入框自身的受控更新也不能直接放进 Transition，应立即更新输入值，再延迟渲染代价较高的结果。

假设你有一个 Tab 切换，两个 Tab 的内容渲染成本不同：

```jsx
import { useState, useTransition } from "react";

function TabSwitch() {
  const [tab, setTab] = useState("about");
  const [isPending, startTransition] = useTransition();

  function selectTab(nextTab) {
    // 用 startTransition 包裹切换
    startTransition(() => {
      setTab(nextTab);
    });
  }

  return (
    <>
      <button onClick={() => selectTab("about")}>关于</button>
      <button onClick={() => selectTab("posts")}>文章</button>
      <button onClick={() => selectTab("contact")}>联系</button>
      {isPending && <span>加载中...</span>}
      {tab === "about" && <About />}
      {tab === "posts" && <Posts />}
      {tab === "contact" && <Contact />}
    </>
  );
}

// About 很小，立刻显示
function About() {
  return <p>这是关于页面</p>;
}

// Posts 很大，渲染慢
function Posts() {
  const items = Array.from({ length: 10000 }, (_, i) => (
    <li key={i}>文章 {i}</li>
  ));
  return <ul>{items}</ul>;
}
```

效果：用户点击 Tab 按钮后，按钮响应是即时的，"加载中"提示出现，等 Posts 渲染完才显示。

### 经典场景：搜索过滤

这是最常见的使用场景，输入框 + 大列表过滤：

```jsx
import { useState, useTransition } from "react";

function SearchBox() {
  const [keyword, setKeyword] = useState("");
  const [filteredList, setFilteredList] = useState([]);
  const [isPending, startTransition] = useTransition();

  function handleChange(e) {
    const value = e.target.value;

    // 紧急：输入框必须立即响应
    setKeyword(value);

    // 不紧急：过滤 10000 条数据可以慢慢来
    startTransition(() => {
      const result = bigList.filter((item) =>
        item.name.toLowerCase().includes(value.toLowerCase()),
      );
      setFilteredList(result);
    });
  }

  return (
    <>
      <input value={keyword} onChange={handleChange} />
      {isPending && <p>过滤中...</p>}
      <ul>
        {filteredList.slice(0, 100).map((item) => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
    </>
  );
}
```

## useDeferredValue

> 用途: 延迟某些状态的更新

它接收一个值, 返回这个值的`延迟(lagging)副本`。当 `value` 变化时, React 会先优先处理紧急的交互(比如输入框的打字), 暂缓重新渲染用到 `deferredValue` 的那部分内容, 等浏览器空闲了再更新。

:::info `useTransition` 和 `useDeferredValue` 的区别

`useTransition` 和 `useDeferredValue` 都涉及延迟更新，但它们关注的重点和用途略有不同：

- `useTransition` 用于把自己能够控制的状态更新标记为非紧急更新，并通过 `isPending` 提供待处理状态。
- `useDeferredValue` 返回某个值的延迟版本，适合在无法控制该值的更新来源时，让依赖它的较慢 UI 在后台重新渲染。它不会延迟网络请求，也不会改变原值本身。
  :::

用法:

```ts
// value: 延迟更新的值(支持任意类型)
const deferredValue = useDeferredValue(value, initialValue);
```

第二个 `initialValue` 参数是可选的；提供时，组件首次渲染会使用它作为延迟值，并在后台用真实值重新渲染。

### 经典场景: 搜索列表

```ts
import { useDeferredValue, useState, useMemo } from 'react';

function App() {
  const [query, setQuery] = useState('');
  // 延迟版本 —— 用于大列表过滤(非紧急更新)
  const deferredQuery = useDeferredValue(query);
  // 判断是否正在过渡: 两者不相等说明展示的仍是旧值
  const isStale = query !== deferredQuery;

  const list = useMemo(() => {
    return expensiveFilter(allItems, deferredQuery);
  }, [deferredQuery]);

  return (
    <>
      {/* 原始 query 立即用于 input 的 value(紧急更新) */}
      <input value={query} onChange={e => setQuery(e.target.value)} />
      {isStale ? <div>加载中...</div> : null}
      <SlowList items={list} />
    </>
  );
}
```

效果: 打字时输入框立即响应(不卡顿)，下方的列表过滤慢半拍更新。`useDeferredValue` 不会返回 `isStale`，需手动比对 `query !== deferredQuery` 来判断是否正在过渡。

## 组件

### 组件通信

#### 父子组件通信

React 组件使用 `props` 来互相通信。每个父组件都可以提供 `props` 给它的子组件，从而将一些信息传递给它。`Props` 可能会让你想起 HTML 属性，但你可以通过它们传递任何 JavaScript 值，包括对象、数组和函数 以及 html 元素，这样可以使我们的组件更加灵活。 `props` 是一个 `对象`，对象中的属性是父组件传递给子组件的属性。

在React中，也允许将属性传递给自己编写的`组件`:

```tsx
// 其中title content被称为props
export default function App() {
  return <Card title="标题1" content="内容"></Card>;
}
```

1. props基本用法
2. TypeScript 类型:
   - 可以使用 `interface` 或 `type` 为 props 添加类型。
   - 可以直接标注函数参数，也可以使用 `React.FC`（Function Component）；`React.FC` 不是必需的。
3. 默认值:
   - 解构
   - 声明一个默认对象
4. props.children 特殊的prpos, 类似于vue中的slot
5. props支持所有的数据类型
6. 子传父(类似Vue中的 emit) 在父组件中把函数体传给子组件, 在子组件中调用这个函数, 同时把数据传递给这个函数

#### 兄弟组件通信

- 最常见的方式是把共享状态提升到最近的共同父组件，再通过 props 和回调分别传给两个子组件。
- 跨越较深组件层级时，可以把共享状态和更新函数放入 Context。
- 需要与 React 组件树之外的事件源通信时，也可以使用 `mitt` 等发布订阅工具，但兄弟组件通信本身并不等同于发布订阅模式。

### 受控组件 非受控组件

#### 受控组件

受控组件一般是指`表单`元素，表单的数据由React的 `State` 管理，更新数据时，需要手动调用 `setState()` 方法更新数据, 类似于Vue的`v-model`。 但是React没有实现`v-model`，需要我们自己实现。

```tsx
// 需要绑定onChange事件
import React, { useState } from "react";

const App: React.FC = () => {
  const [value, setValue] = useState("");
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };
  return (
    <>
      <input type="text" value={value} onChange={handleChange} />
      <div>{value}</div>
    </>
  );
};

export default App;
```

#### 非受控组件

非受控组件指的是该表单元素不受React的 `State` 管理，表单的数据由 `DOM` 管理。通过 `useRef()` 来获取表单元素的值。

```tsx
// 操作DOM的方式
import React, { useState, useRef } from "react";
const App: React.FC = () => {
  const value = "xxx";
  const inputRef = useRef<HTMLInputElement>(null);
  const handleChange = () => {
    console.log(inputRef.current?.value);
  };
  return (
    <>
      <input
        type="text"
        onChange={handleChange}
        defaultValue={value}
        ref={inputRef}
      />
    </>
  );
};

export default App;
```

::: tip
受控组件适用于所有表单元素，包括input、textarea、select等。但是除了input type="file" 外，其他表单元素都推荐使用受控组件。
:::

#### 特殊的非受控组件 表单File

```tsx
import React, { useRef } from "react";
const App: React.FC = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const handleChange = () => {
    console.log(inputRef.current?.files);
  };
  return (
    <>
      <input type="file" ref={inputRef} onChange={handleChange} />
    </>
  );
};

export default App;
```

### 异步组件

`Suspense` 是 React 用来协调“渲染期间尚未就绪的内容”的边界。当子树发生挂起时，它会暂时显示 `fallback`，待所需代码或数据就绪后再展示内容。

#### 应用场景

- `异步组件加载`：通过代码分包实现组件的按需加载，有效减少首屏加载时的资源体积，提升应用性能。

- `异步数据加载`：读取 Suspense-enabled 框架提供的数据，或使用 `use` 读取已缓存、可复用的 Promise。普通 `useEffect` 中发起的 fetch 不会自动激活 Suspense。

- `样式、流式服务端渲染等资源协调`：具体能力取决于 React 版本和渲染环境。普通 `<img>` 加载并不会自动触发 Suspense；图片等待目前只在特定 View Transition/Canary 场景中提供。

#### 用法

```tsx
/**
 * fallback: 指定在组件加载或数据获取过程中展示的组件或元素
   children: 指定要异步加载的组件或数据
 */
<Suspense fallback={<div>Loading...</div>}>
  <AsyncComponent />
</Suspense>
```

#### 案例 骨架屏

`use` API 可以在组件中读取 Promise 或 Context。读取未完成的 Promise 时会挂起到最近的 Suspense 边界；这个 Promise 应由框架、服务端组件或组件外部的缓存创建并复用，不要在每次客户端渲染时临时创建新 Promise。

### HOC 高阶组件 (面试)

什么是高阶组件？

高阶组件（HOC）不是某个特殊组件，而是“接收组件并返回新组件的函数”。返回的包装组件可以复用横切逻辑、注入 props 或添加行为。Hooks 减少了部分 HOC 的使用场景，但权限、埋点和第三方库适配等场景仍可能使用它。

### Activity (19.2)

用法:

- 恢复隐藏组件的状态
- 恢复隐藏组件的 DOM
- 预渲染可能即将显示的内容
- 加快页面加载过程中的交互速度

它在视觉隐藏方面类似 Vue 的 `v-show`，但语义并不相同：隐藏时 React 会清理子树的 Effect，把隐藏内容的更新降为较低优先级，同时保留组件 state 和已有 DOM；再次显示时会重新建立 Effect。

When an Activity boundary is `hidden`, React will visually hide its children using the `display: "none"` CSS property. It will also destroy their Effects, cleaning up any active subscriptions.

```tsx
import { Activity } from "react";

<Activity mode={visibility}>
  <Sidebar />
</Activity>;
```

```tsx
<Activity mode={isShowingSidebar ? "visible" : "hidden"}>
  <Sidebar />
</Activity>
```

## createPortal API

作用：把一段 React 子节点渲染到指定的 DOM 节点，效果与 Vue 的 Teleport 类似。Portal 只改变 DOM 的物理位置；Context、状态归属以及事件冒泡仍遵循 React 组件树。

### 用法

```tsx
/**
 * 入参
  children：要渲染的组件
  domNode：要渲染到的DOM位置
  key?：可选，用于唯一标识要渲染的组件
返回值
  返回一个React元素(即jsx)，这个元素可以被React渲染到DOM的任意位置
 */
import { createPortal } from "react-dom";

const App = () => {
  return createPortal(<div>aaa</div>, document.body);
};

export default App;
```

### 案例

绝对定位元素会相对于其包含块定位，祖先元素的定位、变换、裁剪和层叠上下文都可能影响弹框。把 Modal 通过 `createPortal` 挂载到 `document.body`，通常能避开祖先的 `overflow` 和层叠上下文限制；`position: fixed` 也常用于视口级弹框，但某些带 `transform` 等属性的祖先仍可能改变其包含块。

```tsx
import "./index.css";
import { createPortal } from "react-dom";
export const Modal = () => {
  return createPortal(
    <div className="modal">
      <div className="modal-header">
        <div className="modal-title">标题</div>
      </div>
      <div className="modal-content">
        <h1>Modal</h1>
      </div>
      <div className="modal-footer">
        <button className="modal-close-button">关闭</button>
        <button className="modal-confirm-button">确定</button>
      </div>
    </div>,
    document.body,
  );
};
```

## CSS 方案

### CSS modules (Vite)

1. 安装

```sh
npm install less -D # 安装less 任选其一
npm install sass -D # 安装sass 任选其一
npm install stylus -D # 安装stylus 任选其一
```

::: tip
Vite 开箱支持 CSS Modules。把文件命名为 `xxx.module.css`，或使用已安装预处理器对应的扩展名（如 `xxx.module.scss`、`xxx.module.less`），即可按 CSS Module 导入。
:::

#### 修改css modules 规则

Vite基于`postcss-modules`实现的

```ts
// vite.config.ts
import { defineConfig } from "vite";

export default defineConfig({
  css: {
    modules: {
      localsConvention: "dashes", // 控制导出类名时是否保留或转换横杠命名
      /**
       * 有四个属性
       * camelCase 会把非驼峰的命名转为驼峰，并保留之前的类名 (例如写横杠 同时支持横杠和驼峰命名)
       * camelCaseOnly 只会把非驼峰的命名转为驼峰，并删除之前的类名。
       * dashes 带横杠的转化为驼峰 会保留原始的类名
       * dashesOnly  带横杠的转化为驼峰 会删除原始的类名
       */
      generateScopedName: "[name]__[local]___[hash:base64:5]", // 修改css modules的类名规则 name--> 名称 local--> 类名 hash--> 随机数
    },
  },
});

// generateScopedName 也可以改为以下任一种格式：
// "[local]_[hash:base64:5]"
// "[hash:base64:8]"
// "[name]_[local]"
// "[local]--[hash:base64:4]"
```

#### 维持类名

意思是: 在样式文件中的某些样式，不希望被编译成css modules，可以设置为global，例如：

```css
/* .global包裹 */
.app {
  background: red;
  width: 200px;
  height: 200px;
  :global(.button) {
    background: blue;
    width: 100px;
    height: 100px;
  }
}
```

```tsx
//在使用的时候，就可以直接使用原始的类名 button
import styles from "./index.module.scss";
const App: React.FC = () => {
  return (
    <>
      <div className={styles.app}>
        <button className="button">按钮</button>
      </div>
    </>
  );
};
```

### css in js

#### 优缺点

**优点**：

- 可以让 CSS 拥有独立的作用域，阻止 CSS 泄露到组件外部，防止冲突。
- 可以动态的生成 CSS 样式，根据组件的状态来动态的生成 CSS 样式。
- CSS-in-JS 可以方便地实现主题切换功能，只需更改主题变量即可改变整个应用的样式。

**缺点**：

- 以 styled-components 为代表的运行时 CSS-in-JS 需要在运行时生成和注入样式，会带来一定运行时与包体积成本；编译时 CSS-in-JS 方案则有不同的成本模型。
- 动态生成的类名和样式可能增加调试、服务端渲染与缓存配置的复杂度，但主流工具通常提供 source map 和开发者工具支持。

#### 案例

```tsx
import React from "react";
import styled from "styled-components";
const Button = styled.button<{ primary?: boolean }>`
  ${(props) => (props.primary ? "background: #6160F2;" : "background: red;")}
  padding: 10px 20px;
  border-radius: 5px;
  color: white;
  cursor: pointer;
  margin: 10px;
  &:hover {
    color: black;
  }
`;
const App: React.FC = () => {
  return (
    <>
      <Button primary>按钮</Button>
    </>
  );
};

export default App;
```

#### 继承

我们可以实现一个基础的 Button 组件，然后通过继承来实现更多的按钮样式。

比如例子中的 ButtonBase 组件，然后基于基础样式实现了，BlueButton、FailButton、TextButton 组件，利于我们复用基础样式，以及快速封装组件。

```tsx
import React from "react";
import styled from "styled-components";
const ButtonBase = styled.button`
  padding: 10px 20px;
  border-radius: 5px;
  color: white;
  cursor: pointer;
  margin: 10px;
  &:hover {
    color: red;
  }
`;

//圆角蓝色按钮
const BlueButton = styled(ButtonBase)`
  background-color: blue;
  border-radius: 20px;
`;
//失败按钮
const FailButton = styled(ButtonBase)`
  background-color: red;
`;
//文字按钮
const TextButton = styled(ButtonBase)`
  background-color: transparent;
  color: blue;
`;
const App: React.FC = () => {
  return (
    <>
      <BlueButton>普通按钮</BlueButton>
      <FailButton>失败按钮</FailButton>
      <TextButton>文字按钮</TextButton>
    </>
  );
};

export default App;
```

#### 属性

我们可以通过 attrs 来给组件添加属性，比如 defaultValue，然后通过 props 来获取属性值。

```tsx
import React from "react";
import styled from "styled-components";
interface DivComponentProps {
  defaultValue: string;
}
const InputComponent = styled.input.attrs<DivComponentProps>((props) => ({
  type: "text",
  defaultValue: props.defaultValue,
}))`
  border: 1px solid blue;
  margin: 20px;
`;

const App: React.FC = () => {
  const defaultValue = "小满zs";
  return (
    <>
      <InputComponent defaultValue={defaultValue}></InputComponent>
    </>
  );
};

export default App;
```

#### 全局样式

全局样式一般是单独封装到一个文件里面，然后引入到组件里面使用。

```tsx
import React from "react";
import styled, { createGlobalStyle } from "styled-components";
const GlobalStyle = createGlobalStyle`
  body {
    background-color: #f0f0f0;
  }
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  ul,ol{
      list-style: none;
  }
`;
const App: React.FC = () => {
  return (
    <>
      <GlobalStyle />
    </>
  );
};

export default App;
```

#### 动画

我们可以通过 `keyframes` 来创建动画。

```tsx
import React from "react";
import styled, { keyframes } from "styled-components";

const move = keyframes`
  0%{
    transform: translateX(0);
  }
  100%{
    transform: translateX(100px);
  }
`;
const Box = styled.div`
  width: 100px;
  height: 100px;
  background-color: red;
  animation: ${move} 1s linear infinite;
`;
const App: React.FC = () => {
  return (
    <>
      <Box></Box>
    </>
  );
};

export default App;
```

#### 原理剖析

这个技术叫`标签模板`，是 ES6 新增的特性，它可以紧跟在函数后面，该函数将被用来调用这个字符串模板

调用完成之后, 这个函数的第一个参数是模板字符串的静态字符串, 从第二个参数开始, 是模板字符串中变量值, 也就是`${ }`里面的值

```tsx
/**
 * 第一个参数是静态字符串 是一个数组
 * 第二个参数开始是变量值 ${}
 */
const div = function (strArr: TemplateStringsArray, ...args: any[]) {
  // console.log(strArr, args);
  // strArr：['\n color:red;\n width:', 'px;\n height:', 'px;\n', raw: Array(3)]
  // args：[30, 50]
  return strArr.reduce((result, str, i) => {
    return result + str + (args[i] ?? "");
  }, "");
};

//div是一个函数 可以通过()调用 也可以通过call 还可以通过模版字符串调用 如下:
const a = div`
  color:red;
  width:${30}px;
  height:${50}px;
`;
console.log(a);
//  输出结果
//  color:red;
//  width:30px;
//  height:50px;
```

### TailwindCSS

### 组件实战

## React Router

React Router v7 提供三种逐级增强的使用模式：

- 声明模式：使用 `<BrowserRouter>`、`<Routes>` 等 API 完成基础匹配和导航。
- `数据`模式：在声明模式之上增加 loader、action、pending state、fetcher 等数据能力。(主要使用的模式)
- 框架模式：在数据模式之上结合 Vite 插件和路由模块，提供类型安全、智能分包以及 SPA、SSR、静态渲染等能力。

三种模式没有统一的“最佳”选择，应根据应用是否需要数据 API、服务端渲染以及对构建架构的控制程度决定。

::: tip 主要使用的hook函数

```ts
const navigate = useNavigate(); // 用于在组件中进行路由跳转

const location = useLocation(); // 用于获取当前路由的相关信息，包括路径、查询参数、状态等

const loader = useLoaderData(); // 用于在组件中获取路由加载器返回的数据
```

:::

### 安装

```sh
pnpm add react-router
```

v7 的主要 API 已合并到 `react-router`； 在 v7 版本中 `react-router-dom` 仍作为兼容性重导出包发布.

#### 基本使用

```ts
// /router/index.ts
import { createBrowserRouter } from "react-router"; // 其中的一种
import Home from "../pages/Home";
import About from "../pages/About";

const router = createBrowserRouter([
  {
    path: "/",
    Component: Home,
  },
  {
    path: "/about",
    Component: About,
  },
]);

export default router;
```

这种写法叫做平行路由.

因为`<RouterProvider router={router} />`这个是写在`render`中因此他可以直接代替`<App />`直接写为:

```tsx
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
```

也可以保留App.tsx进行初始化.

> 如何初始化? (类似于去Vue3配置`use`)

在 App.tsx 中挂载 `RouterProvider`。它不仅提供路由上下文，也会渲染当前匹配到的路由树；**嵌套路由**的子级位置再由父路由中的 `<Outlet />` 指定。

```tsx
// App.tsx
import React from "react";
import { RouterProvider } from "react-router/dom";
import router from "./router"; // 引入路由
const App: React.FC = () => {
  return (
    <>
      {/* 使用RouterProvider初始化 */}
      <RouterProvider router={router} />
    </>
  );
};

export default App;
```

::: tip 总结

1. `outlet`: 嵌套路由中, 子路由在父路由中应该渲染的位置
2. 跳转路由:
   - `<Link to="/">Home</Link>` 或 `<NavLink to="/">Home</NavLink>` (组件)
   - 使用 `useNavigate` hook (函数式)
3. 获取路由信息: `useLocation` hook

:::

### 路由模式

#### createBrowserRouter (推荐)

**核心特点**：

- 使用 HTML History API（`pushState`、`replaceState` 和 `popstate` 事件）
- 浏览器URL比较纯净 (/search, /about, /user/123)
- 需要`服务器端支持`(nginx, apache,等)否则会刷新404

#### createHashRouter

**核心特点**：

- 使用URL的hash部分(`#/search`, `#/about`, `#/user`)
- hash 后的内容不会作为 HTTP 请求路径发送给服务器，因此深层路由刷新通常不需要服务器配置 SPA fallback
- 浏览器刷新后仍能从 URL hash 恢复当前路由

**使用场景**：

- 无法为任意路径配置 SPA fallback 的静态托管环境，例如未配置重写规则的 GitHub Pages
- 能接受 `#` 路由形式，并希望减少服务器重写配置的应用

#### createMemoryRouter

**核心特点**：

- 使用`内存`中的路由表
- 刷新页面会丢失状态
- 切换页面路由不显示URL

**使用场景**：

- 没有地址栏、又只需要内存导航历史的环境
- 单元测试或者组件测试（Jest、Vitest、Storybook 等）

#### createStaticRouter

**核心特点**：

- 专为数据路由器的服务端渲染设计
- 接收 `createStaticHandler().query(request)` 生成的路由上下文，并与 `StaticRouterProvider` 配合渲染
- 客户端通常再创建浏览器路由器并使用服务端生成的 hydration 数据完成接管

**使用场景**：

- 自行搭建 React Router 数据模式 SSR 的应用；Next.js 使用自己的路由系统，并不以 `createStaticRouter` 作为兼容方案
- 需要SEO优化的页面

#### 如何解决刷新404问题

1. 在使用`createBrowserRouter`创建路由
2. Nginx中修改`/conf/nginx.conf` , 在`location`中添加如下代码`try_files $uri $uri/ /index.html;`

### \*导航

#### Link

`Link` 用于客户端路由导航，最终渲染为 `<a>` 元素。对于由当前路由器处理的地址，它会拦截普通点击并通过路由器更新页面；使用 `reloadDocument`、指向外部地址或浏览器无法接管的点击时，仍会进行文档级导航。

示例:

```tsx
import { Link } from "react-router";

export default function App() {
  return <Link to="/index/user">user</Link>;
}
```

参数:

- `to`：要导航到的路径
- `replace`：为 `true` 时替换当前 history 条目；默认会新增 history 条目
- `state`：要传递给目标页面的状态(携带参数) <span v-pre>`<Link to="/index/user" state={{id:1}}>`</span>
- `relative`：控制相对地址（尤其是 `..`）的解析方式。默认 `route` 按路由层级回退，`path` 按 URL 路径段回退；以 `/` 开头的地址仍是绝对路径
- `reloadDocument`：跳转页面时是否重新加载页面
- `preventScrollReset`：跳转后是否阻止滚动位置重置
- `viewTransition`：是否启用视图过渡

#### NavLink

`NavLink` 继承 `Link` 的导航能力，并增加 `end`、`caseSensitive` 以及基于 active/pending/transitioning 状态生成 `className`、`style` 或 children 的能力。

::: tip link和navlink的区别

Navlink 会经过以下三个状态的转换，而Link不会，所以Navlink就是一个link的增强版。

- `active`：激活状态(当前路由和to属性匹配)
- `pending`：等待状态(loader有数据需要加载)
- `transitioning`：过渡状态(通过viewTransition属性触发)
  :::

Navlink 会根据当前路由和to属性是否匹配，自动激活。react-router会为其自动添加样式:

```css
a.active {
  color: red;
}

a.pending {
  animation: pulse 1s infinite;
}

a.transitioning {
  /* css transition is running */
}
```

也可以直接用style属性来设置:

```tsx
<NavLink
  viewTransition
  style={({ isActive, isPending, isTransitioning }) => {
    return {
      marginRight: "10px",
      color: isActive ? "red" : "blue",
      backgroundColor: isPending ? "yellow" : "transparent",
    };
  }}
  to="/index/about"
>
  About
</NavLink>
```

::: warning 注意

1. `viewTransition` 依赖浏览器 View Transition API，应按目标浏览器范围检查兼容性，并为不支持的环境保留无动画的正常导航体验
2. `pending`只有数据模式，和框架模式才能使用，声明式路由不能使用
   :::

#### useNavigate 编程式导航

`useNavigate` 是一个 `React-router` 的钩子，用于编程式导航的路由跳转。

> eg: 例如倒计时结束后，自动返回跳转等, 因为这种操作属于逻辑性操作，这时候组件方式的跳转就不合适了，这时候就需要使用编程式跳转。

```tsx
import { useEffect } from "react";
import { useNavigate } from "react-router";

function AutoBackHome() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = window.setTimeout(() => {
      navigate("/home", { replace: true });
    }, 1000);
    return () => window.clearTimeout(timer);
  }, [navigate]);

  return <p>即将返回首页…</p>;
}
```

参数:

1. 第一个参数: `to` 跳转的路由 navigate(to)

```tsx
import { useNavigate } from "react-router";

function HomeButton() {
  const navigate = useNavigate();
  return <button onClick={() => navigate("/home")}>首页</button>;
}
```

2. 第二个参数: `options` 配置对象 navigate(to, options)
   - `replace`: 跳转页面的时候，是否替换当前路由
   - `state`: 传递数据，在跳转的页面中使用通过`useLocation`的state属性获取 `navigate('/home',{state:{name:'张三'}});`
   - `relative`: 当 `to` 是相对地址时，控制按路由层级（默认 `route`）还是 URL 路径段（`path`）解析；写成 `/home` 的绝对地址不受此选项影响
   - `preventScrollReset`: 跳转页面的时候，是否阻止滚动重置
   - `viewTransition`: 跳转页面的时候，是否使用过渡动画 `navigate('/home',{viewTransition:true});`

#### redirect

`redirect` 是用于重定向，通常用于`loader`中，当`loader`返回`redirect`的时候，会自动重定向到`redirect`指定的路由。

```tsx
import { redirect } from "react-router";

const homeRoute = {
  path: "/home",
  loader: async () => {
    const isLogin = await checkLogin();
    if (!isLogin) return redirect("/login");
    return { data: "home" };
  },
};
```

### 路由类型

#### 嵌套路由

嵌套路由就是父路由中嵌套子路由 `children` ，子路由可以继承父路由的布局，也可以有自己的布局。

**注意事项**:

- 如果父路由的 `path` 是 `/index`，相对子路由 `home` 会匹配 `/index/home`。这与 `index: true` 的索引路由是两个不同概念。
- 子路由不需要增加`/`了直接写子路由的`path`即可
- 子路由默认是不显示的，需要父路由通过 `Outlet` 组件来显示子路由 `Outlet` 就是类似于Vue的`<router-view>`展示子路由的一个容器
- 子路由的层级可以无限嵌套，但是要注意的是，一般实际工作中就是2-3层

#### Layout布局

布局中的菜单既可以直接使用 `Link`/`NavLink`，也可以在 Ant Design Menu 这类通过回调返回菜单 key 的组件中使用 `useNavigate`。是否使用编程式导航取决于菜单组件的 API，而不是 Layout 本身的限制。

```tsx
// 注意: 这个是写在菜单组件中的
import { Menu as AntdMenu } from "antd";
import { AppstoreOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { useNavigate } from "react-router";
export default function Menu() {
  const navigate = useNavigate(); //编程式导航
  const handleClick: MenuProps["onClick"] = (info) => {
    navigate(info.key); // 点击菜单项时，导航到对应的页面
  };
  const menuItems = [
    {
      key: "/home",
      label: "Home",
      icon: <AppstoreOutlined />,
    },
    {
      key: "/about",
      label: "About",
      icon: <AppstoreOutlined />,
    },
  ];
  return (
    <AntdMenu
      onClick={handleClick}
      style={{ height: "100vh" }}
      items={menuItems}
    />
  );
}
```

> 如何将`Menu` `Header` `Content` 进行串联

#### 布局路由

布局路由是一种特殊的嵌套路由，父路由可以省略 `path`，这样不会向 URL 添加额外的路径段：

```tsx
const router = createBrowserRouter([
  {
    // path: '/index', //省略
    Component: Layout,
    children: [
      {
        path: "home",
        Component: Home,
      },
      {
        path: "about",
        Component: About,
      },
    ],
  },
]);
```

#### 索引路由

索引路由使用 `index: true` 来定义，作为父路由的默认子路由：

```ts
// { index: true, Component: Home }

const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      {
        index: true,
        // path: 'home',
        Component: Home,
      },
      {
        path: "about",
        Component: About,
      },
    ],
  },
]);
```

#### 前缀路由 (用的少)

前缀路由只设置 `path` 而不设置 `Component`，用于给一组路由添加统一的路径前缀：

```tsx
const router = createBrowserRouter([
  {
    path: "/project",
    //Component: Layout, //省略
    children: [
      {
        path: "home",
        Component: Home,
      },
      {
        path: "about",
        Component: About,
      },
    ],
  },
]);
```

#### 动态路由

动态路由通过 `:参数名` 语法来定义动态段：

访问规则如下 `http://localhost:3000/home/123`

```tsx
const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      {
        path: "home/:id", // 这里写什么 useParams 就获取什么
        Component: Home,
      },
      {
        path: "about",
        Component: About,
      },
    ],
  },
]);

// 在组件中使用 useParams 获取参数
import { useParams } from "react-router";

function Card() {
  const params = useParams<{ id: string }>(); // { id: '123' }
  return <p>当前 ID：{params.id}</p>;
}
```

### \*路由传参

#### 1. Query参数

```text
# 多个参数用 & 连接
/about?name=xxx&age=18
```

传递后在地址栏就会有`name=xxx&age=18`, 如何接收?

```ts
import { useSearchParams } from "react-router"; // 获取路由参数
const [searchParams, setSearchParams] = useSearchParams(); // 获取路由参数 更改路由参数
```

跳转方式:

```tsx
import { Link, NavLink, useNavigate } from "react-router";

function QueryLinks() {
  const navigate = useNavigate();
  return (
    <>
      <NavLink to="/about?id=123">About</NavLink>
      <Link to="/about?id=123">About</Link>
      <button onClick={() => navigate("/about?id=123")}>About</button>
    </>
  );
}
```

获取参数:

```tsx
import { useSearchParams } from "react-router";

function About() {
  const [searchParams, setSearchParams] = useSearchParams();
  const id = searchParams.get("id");

  return <button onClick={() => setSearchParams({ id: "456" })}>{id}</button>;
}
```

如果只需要原始查询字符串，也可以通过 `useLocation().search` 获取，例如 `?id=123`。

#### 2. Params参数(动态参数)

```text
/user/:id
```

跳转方式:

```tsx
import { Link, NavLink, useNavigate } from "react-router";

function UserLinks() {
  const navigate = useNavigate();
  return (
    <>
      <NavLink to="/user/123">User</NavLink>
      <Link to="/user/123">User</Link>
      <button onClick={() => navigate("/user/123")}>User</button>
    </>
  );
}
```

获取参数:

```tsx
import { useParams } from "react-router";

function User() {
  const { id } = useParams<{ id: string }>();
  return <p>{id}</p>;
}
```

::: warning 注意
路径参数最终是 URL 字符串。对象需要先序列化并进行 URL 编码，但通常更适合只把稳定 ID 放在路径中，再依据 ID 读取完整数据。
:::

#### State参数

`state`在URL中`不显示`，但是可以传递参数:

```text
/user
```

跳转方式:

```tsx
import { Link, useNavigate } from "react-router";

function UserLinks() {
  const navigate = useNavigate();
  const state = { name: "xxx", age: 18 };
  return (
    <>
      <Link to="/user" state={state}>
        User
      </Link>
      <button onClick={() => navigate("/user", { state })}>User</button>
    </>
  );
}
```

获取参数:

```tsx
import { useLocation } from "react-router";

type UserState = { name: string; age: number };

function User() {
  const { state } = useLocation();
  const user = state as UserState | null;
  return <p>{user?.name ?? "没有导航状态"}</p>;
}
```

#### 总结

React Router 提供了三种参数传递方式，各有特点：

1. Params 方式 (/user/:id)
   - 适用于：传递必要的路径参数（如ID）
   - 特点：符合 RESTful 规范，刷新不丢失
   - 限制：只能传字符串，参数显示在URL中

2. Query 方式 (/user?name=xxx&age=18)
   - 适用于：传递可选的查询参数
   - 特点：灵活多变，支持多参数
   - 限制：URL可能较长，参数公开可见
3. State 方式
   - 适用于：同一次浏览器导航中的临时附加信息
   - 特点：参数不显示在 URL，底层受 History API 的可序列化数据限制，不能传函数、DOM 节点等任意值
   - 限制：复制 URL、新开标签页或服务端直接访问时无法获得该状态，不应把关键数据只放在 state 中

选择建议：必要参数用 Params(查详情)，筛选条件用 Query(搜索 分页)，临时数据用 State(复杂数据)。

### 边界处理

边界处理包含了`错误处理`，`ErrorBoundary`，`404页面` 等错误处理

#### 404页面处理

配置:

- 使用`*`作为通配符，当路由匹配不到时，显示404页面
- 使用`Component: NotFound`作为404页面组件

```ts {17-18}
const router = createBrowserRouter([
  {
    path: "/index",
    Component: Layout,
    children: [
      {
        path: "home",
        Component: Home,
      },
      {
        path: "about",
        Component: About,
      },
    ],
  },
  {
    path: "*", // 通配符，当路由匹配不到时，显示404页面
    Component: NotFound, // 404页面组件
  },
]);
```

```tsx
// src/pages/NotFound.tsx
import { Link } from "react-router";
export default function NotFound() {
  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#f5f5f5",
      }}
    >
      <h1 style={{ fontSize: 96, color: "#1890ff", margin: 0 }}>404</h1>
      <p style={{ fontSize: 24, color: "#888", margin: "16px 0 0 0" }}>
        抱歉，您访问的页面不存在
      </p>
      <Link
        to="/"
        style={{
          marginTop: 32,
          color: "#1890ff",
          fontSize: 18,
          textDecoration: "underline",
        }}
      >
        返回首页
      </Link>
    </div>
  );
}
```

#### ErrorBoundary

路由 `ErrorBoundary` 可以处理路由组件渲染、loader、action 等阶段抛出的错误，并由距离出错路由最近的边界呈现错误 UI。

```ts
import NotFound from "../layout/404"; // 404页面组件
import Error from "../layout/error"; // 错误处理组件
const router = createBrowserRouter([
  {
    path: "/index",
    Component: Layout,
    children: [
      {
        path: "home",
        Component: Home,
        ErrorBoundary: Error, //如果组件抛出错误，会调用ErrorBoundary组件
      },
      {
        path: "about",
        Component: About, // 正常展示About
        loader: async () => {
          throw new Response("Not Found", {
            status: 404,
            statusText: "Not Found",
          });
        },
        ErrorBoundary: Error, // 如果loader或action抛出错误，会调用ErrorBoundary组件
      },
    ],
  },
  {
    path: "*",
    Component: NotFound,
  },
]);
```

返回的错误信息可以通过一个hooks获取到:

```tsx
import { isRouteErrorResponse, useRouteError } from "react-router";

export default function Error() {
  const error = useRouteError();
  if (isRouteErrorResponse(error)) {
    return (
      <div>
        {error.status}：{String(error.data ?? error.statusText)}
      </div>
    );
  }
  if (error instanceof Error) return <div>{error.message}</div>;
  return <div>未知错误</div>;
}
```

### 路由懒加载

> 什么是懒加载?

懒加载是一种优化技术，用于延迟加载组件，直到需要时才加载。这样可以减少初始加载时间，提高页面性能。

```ts
// 通过在路由对象中使用 lazy 属性来实现懒加载。
import { createBrowserRouter } from "react-router";
import Layout from "../pages/Layout";

const sleep = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));

const router = createBrowserRouter([
  {
    Component: Layout,
    children: [
      {
        path: "about",
        lazy: async () => {
          await sleep(2000);
          const module = await import("../pages/About");
          return { Component: module.default };
        },
      },
    ],
  },
]);
```

当切换到 `about` 路由时，才会进行加载

::: tip
路由模块的动态导入通常在首次访问后由模块加载器缓存。`loader` 是否重新执行由导航、提交后的重新验证、`shouldRevalidate` 等因素决定；`useNavigation().state` 会在等待 lazy 路由、loader 或 action 时反映相应的 pending 状态。
:::

#### 体验优化

例如 `about` 是一个懒加载的组件，在切换到 `about` 路由时，展示的还是上一个路由的组件，直到懒加载的组件加载完成，才会展示新的组件，这样用户会感觉页面`卡顿`，用户体验不好。 使用[`useNavigation`](https://message163.github.io/react-docs/react/router/hooks/useNavigation.html)进行状态优化

```tsx
// src/layout/Content/index.tsx
// 实现loading效果
import { Outlet, useNavigation } from "react-router";
import { Alert, Spin } from "antd";
export default function Content() {
  const navigation = useNavigation();
  console.log(navigation.state);
  const isLoading = navigation.state === "loading";
  return (
    <div>
      {isLoading ? (
        <Spin size="large" tip="loading...">
          <Alert description="xxxxxxxxxxxxxxxx" message="加载中" type="info" />
        </Spin>
      ) : (
        <Outlet />
      )}
    </div>
  );
}
```

### \*路由数据 API

数据模式的重要能力包括：

- `loader`
- `action`

在平时工作中大部分都是在做`增刪查改(CRUD)`的操作，所以一个界面的接口过多之后就会使逻辑臃肿复杂，难以维护，所以需要使用路由的高级操作来`优化代码`。

#### \*loader

::: tip
loader 负责读取路由数据，会在匹配导航、GET 表单提交、显式重新验证等场景运行。它不是“收到任意 GET 请求就触发”，而是由 React Router 的数据路由流程调用。
:::

[useLoaderData](https://message163.github.io/react-docs/react/router/hooks/useLoaderData.html)

在没有loader之前是 `RenderComponent`(渲染组件) --> `Fetch`(获取数据)-> `RenderView`(渲染视图)

有了loader之后是 `loader`(通过fetch获取数据) -> `useLoaderData`(获取数据) -> `RenderComponent`(渲染组件)

示例:

```tsx
//router/index.tsx
import { createBrowserRouter } from "react-router";
const router = createBrowserRouter([
  {
    path: "/",
    Component: App,
    loader: async () => {
      const response = await fetch("/api/users");
      if (!response.ok)
        throw new Response("获取用户失败", { status: response.status });
      const data = await response.json();
      return { users: data.list, message: "success" };
    },
  },
]);
```

使用useLoaderData接收数据:

```tsx
//App.tsx
import { useLoaderData } from "react-router"; // 使用useLoaderData接收数据

type LoaderData = {
  users: Array<{ id: number; name: string }>;
  message: string;
};

const App = () => {
  const { users } = useLoaderData() as LoaderData;
  return (
    <ul>
      {users.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
};
```

#### action

一般用于表单提交，删除，修改等操作。

[useSubmit](https://message163.github.io/react-docs/react/router/hooks/useSubmit.html)

[useActionData](https://message163.github.io/react-docs/react/router/hooks/useActionData.html)

::: tip
action 处理发送到路由的非 GET 数据提交，例如 POST、PUT、PATCH、DELETE；GET 表单提交会序列化到 URL 并运行 loader，而不是 action。
:::

示例:

```tsx
//App.tsx
import { useSubmit } from "react-router"; // 用这个hook 使onFinish提交给action
import { Card, Form, Input, Button } from "antd";
export default function About() {
  // onFinish --> action --> api
  const submit = useSubmit();
  return (
    <Card>
      <Form
        onFinish={(values) => {
          /**
            values 需要提交的值
            配置项(对象) 提交方式 编码格式 默认是formData 
           */
          submit(values, { method: "post" }); // 提交表单
        }}
      >
        <Form.Item name="name" label="姓名">
          <Input />
        </Form.Item>
        <Form.Item name="age" label="年龄">
          <Input />
        </Form.Item>
        <Button type="primary" htmlType="submit">
          提交
        </Button>
      </Form>
    </Card>
  );
}

// 接收参数
//router/index.tsx
import { createBrowserRouter } from "react-router";
const router = createBrowserRouter([
  {
    // path: '/index',
    Component: Layout,
    children: [
      {
        path: "about",
        Component: About,
        // 定义action 通过request
        action: async ({ request }) => {
          const formData = await request.formData();
          const createdUser = await createUser(formData);
          return { data: createdUser, success: true };
        },
      },
    ],
  },
]);
```

#### 状态变更

可以配合[`useNavigation`](https://message163.github.io/react-docs/react/router/hooks/useNavigation.html)来管理表单提交的状态

GET提交状态: `idle` --> `loading` --> `idle`

POST提交状态: `idle` --> `submitting` --> `loading` --> `idle`

可以根据这些状态来控制`disabled` `loading` 等行为

```tsx
import { useNavigation, useSubmit } from "react-router";

function SubmitButton() {
  const submit = useSubmit();
  const navigation = useNavigation();
  const isBusy = navigation.state !== "idle";

  return (
    <button
      disabled={isBusy}
      onClick={() => submit({ name: "Alice" }, { method: "post" })}
    >
      {navigation.state === "submitting" ? "提交中..." : "提交"}
    </button>
  );
}
```

## TanStack Router

[Tanstack](https://tanstack.com/)是一个工具集

安装 Tanstack Router :

```sh
pnpx @tanstack/cli create --router-only # 以 CLI 方式创建

# 使用手动配置
pnpm add @tanstack/react-router @tanstack/react-router-devtools
pnpm add -D @tanstack/router-plugin
```

```ts
// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { tanstackRouter } from "@tanstack/router-plugin/vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    // Please make sure that '@tanstack/router-plugin' is passed before '@vitejs/plugin-react'
    tanstackRouter({
      target: "react",
      autoCodeSplitting: true,
    }),
    react(),
    // ...,
  ],
});
```

- TanStack Router 同时支持文件式和代码式路由；文件式路由是官方推荐的大多数项目起点。
- Vite 插件默认读取 `src/routes` 并生成 `src/routeTree.gen.ts`，但 `routesDirectory` 和生成文件位置都可以配置。配置目录的根路由文件必须命名为 `__root.tsx`。
- `__root.tsx` 定义根布局，`src/main.tsx` 仍负责创建并挂载 RouterProvider，并不是把入口文件放进 routes 目录。

```tsx
// routes/__root.tsx
import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

const RootLayout = () => (
  <>
    <div className="p-2 flex gap-2">
      <Link to="/" className="[&.active]:font-bold">
        Home
      </Link>{" "}
      <Link to="/about" className="[&.active]:font-bold">
        About
      </Link>
    </div>
    <hr />
    <Outlet />
    <TanStackRouterDevtools />
  </>
);

export const Route = createRootRoute({ component: RootLayout });
```

```tsx
// routes/index.tsx
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <div className="p-2">
      <h3>Welcome Home!</h3>
    </div>
  );
}
```

```tsx
// routes/about.tsx
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
  component: About,
});

function About() {
  return <div className="p-2">Hello from About!</div>;
}
```

```tsx
// src/main.tsx
import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";

// Import the generated route tree
import { routeTree } from "./routeTree.gen"; // 这个文件是自动生成的

// Create a new router instance
const router = createRouter({ routeTree });

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

// Render the app
const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>,
  );
}
```

## Zustand 状态管理

1. `轻量级` Zustand 的核心 API 和运行时开销较小；实际包体积取决于版本、导入入口、中间件和打包器的 tree-shaking 结果，不应固定表述为某个精确大小。
2. `简单易用` Zustand 不需要像Redux，去通过`Provider`包裹组件，Zustand提供了简洁的API，能够快速上手。
3. `易于集成` `zustand` 包主要面向 React，同时提供 `zustand/vanilla` 的框架无关 store。Vue 适配通常来自独立的社区项目，并不是 Zustand 核心包自带的 Vue API。
4. `扩展性` Zustand 提供中间件机制，可扩展持久化、Redux DevTools、Immer 更新和选择性订阅等能力；异步 action 本身不要求额外中间件。
5. `不可变更新` 默认应以不可变方式更新 state；深层结构可以选择 Immer 中间件减少手动复制代码，但 Zustand 并不会因此自动变成“无副作用”。

### 安装

```sh
pnpm add zustand
```

### 使用

1. 创建一个store目录, 一个store.ts文件
2. `create` 接收 state creator。state creator 通常接收 `set`、`get`、`store` 三个参数，并返回初始 state 与 actions。
3. `set` 可以接收部分 state 对象或 `(state) => partialState` 更新函数；默认只对根层级进行浅合并，第二个参数传 `true` 时才会整体替换 state。
4. `get()` 不接收 state 参数，调用后返回 store 当前状态。

```ts
import { create } from "zustand";
// 定义一个接口，用于描述状态管理器的状态和操作
interface PriceStore {
  price: number;
  incrementPrice: () => void;
  decrementPrice: () => void;
  resetPrice: () => void;
  getPrice: () => number;
}
// 创建一个状态管理器，使用 create 函数，传入一个函数，返回一个对象
/**
 *
 * @param set 用于更新状态 是函数
 * @param get 用于获取状态 是函数
 * @returns 返回一个对象，对象中的方法可以用于更新状态 注意!注意!注意!返回的是一个对象
 */
const usePriceStore = create<PriceStore>((set, get) => ({
  price: 0, // 初始状态
  incrementPrice: () => set((state) => ({ price: state.price + 1 })), // 更新状态
  decrementPrice: () => set((state) => ({ price: state.price - 1 })), // 更新状态
  resetPrice: () => set({ price: 0 }), // 重置状态
  getPrice: () => get().price, // 获取状态
}));

export default usePriceStore;
```

然后再页面中当成一个hook来使用

### 状态处理

#### 深层次状态处理

```ts
import { create } from "zustand";

interface User {
  gourd: {
    oneChild: string;
    twoChild: string;
    threeChild: string;
    fourChild: string;
    fiveChild: string;
    sixChild: string;
    sevenChild: string;
  };
  updateGourd: () => void;
}

// 创建 store
const useUserStore = create<User>((set) => ({
  // 初始化葫芦娃状态
  gourd: {
    oneChild: "大娃",
    twoChild: "二娃",
    threeChild: "三娃",
    fourChild: "四娃",
    fiveChild: "五娃",
    sixChild: "六娃",
    sevenChild: "七娃",
  },
  // 更新方法
  updateGourd: () =>
    set((state) => ({
      gourd: {
        ...state.gourd, // 嵌套对象需要手动合并
        oneChild: "大娃-超进化",
      },
    })),
}));

export default useUserStore;
```

::: warning
注意：Zustand 的 `set` 默认会浅合并根 state，所以未返回的根属性会保留；但被替换的嵌套对象不会自动深合并。更新 `gourd.oneChild` 时，需要复制 `state.gourd`，否则 `gourd` 中其他字段会丢失，而且上面的 TypeScript 类型也不会通过检查。
:::

#### 使用 immer 中间件

- 安装: `pnpm add immer`
- 基础用法:

```ts
import { produce } from "immer";

const data = {
  user: {
    name: "张三",
    age: 18,
  },
};

// 使用 produce 创建新状态
const newData = produce(data, (draft) => {
  draft.user.age = 20; // 直接修改 draft
});

console.log(newData, data);
// 输出:
// { user: { name: '张三', age: 20 } }
// { user: { name: '张三', age: 18 } }
```

在 Zustand 中使用:

```ts
import { create } from "zustand";
import { immer } from "zustand/middleware/immer"; // 引入 immer 中间件

// 注意：使用 immer 中间件时的特殊结构
// 闭包 接收create<User>()返回值
const useUserStore = create<User>()(
  immer((set) => ({
    gourd: {
      oneChild: "大娃",
      twoChild: "二娃",
      threeChild: "三娃",
      fourChild: "四娃",
      fiveChild: "五娃",
      sixChild: "六娃",
      sevenChild: "七娃",
    },
    updateGourd: () =>
      set((state) => {
        // 直接修改状态，无需手动合并
        state.gourd.oneChild = "大娃-超进化";
        state.gourd.twoChild = "二娃-谁来了";
        state.gourd.threeChild = "三娃-我来了";
      }),
  })),
);
```

#### immer 原理剖析

Immer 为 draft 建立 Proxy，在 recipe 中记录对 draft 的读写。当发生修改时，它会复制被修改节点及其祖先路径，并尽量与未修改分支共享引用，最后生成新的不可变结果；原始对象保持不变。Proxy 只是其主要实现机制之一，不能概括为代理 JavaScript 对象的“所有操作”。

`immer` 的核心原理基于以下两个概念：

1. `写时复制` (Copy-on-Write)
   - 无修改时：直接返回原对象
   - 有修改时：创建新对象

2. `惰性代理` (Lazy Proxy)
   - 按需创建代理
   - 通过 Proxy 拦截操作
   - 延迟代理创建

修改深层节点时，从根到该节点路径上的对象都会获得新引用，未修改的兄弟分支通常继续复用原引用：

```ts
import { produce } from "immer";

const state = {
  user: {
    name: "张三",
    age: 25,
  },
};

const newState = produce(state, (draft) => {
  draft.user.name = "李四";
  draft.user.age = 26;
});

console.log(state); // { user: { name: '张三', age: 25 } }
console.log(newState); // { user: { name: '李四', age: 26 } }
console.log(newState === state); // false
console.log(newState.user === state.user); // false
```

一个可用的 Immer 实现还需要为每个嵌套 draft 分别维护修改状态、处理数组与属性描述符、完成终结和结构共享等细节。用单个 `modified` 对象配合 `JSON.parse(JSON.stringify(...))` 无法正确模拟这些语义，还会破坏 `Date`、`Map`、`undefined` 等值，因此不把这种简化代码当作实现示例。

### 状态简化

不传选择器调用 `useUserStore()` 会订阅整个 store。即使组件只从返回对象中解构少数字段，store 中任意根状态变化都可能使该组件重新渲染。

#### 状态选择器

我们可以使用状态选择器来规避这个问题. 状态选择器可以让我们只选择我们需要的部分状态，这样就不会引发不必要的重渲染。

```ts
// 本来的写法
const { hobby, name } = useUserStore();
// 新写法
const selectedName = useUserStore((state) => state.name);
const age = useUserStore((state) => state.age);
const rap = useUserStore((state) => state.hobby.rap);
const basketball = useUserStore((state) => state.hobby.basketball);
```

但是这样会出现一个新的问题: 每用到一个属性, 都要重新定义一个变量, 过于麻烦.

#### useShallow

::: tip
`useShallow` 会记住选择器结果，并对新旧结果做浅比较：对象的顶层属性、数组元素等逐项使用 `Object.is` 比较。它不做深比较；如果某个顶层属性是对象，仍只比较该对象的引用。
:::

```ts
import { useShallow } from "zustand/react/shallow";
const { rap, name } = useUserStore(
  useShallow((state) => ({
    rap: state.hobby.rap,
    name: state.name,
  })),
);
```

### 中间件

zustand 的中间件是用于在状态管理过程中添加额外逻辑的工具。它们可以用于日志记录、性能监控、数据持久化、异步操作等。

#### 自定义编写中间件

我们实现一个简易的日志中间件，了解其中间件的实现原理, zustand的中间件是一个高阶函数

```ts
const logger = (config) => (set, get, api) =>
  config(
    (...args) => {
      console.log(api);
      console.log("before", get());
      set(...args);
      console.log("after", get());
    },
    get,
    api,
  );
```

参数解释：

1. config (外层函数参数)

- 类型：state creator，即 `(set, get, api) => State`
- 作用：原始的 store 配置函数；中间件包装它及其参数，最终仍返回初始 state。

2. set (内层函数参数)

- 类型：函数 (partialState) => void
- 作用：原始的状态更新函数，用于修改 store 的状态。

3. get (内层函数参数)

- 类型：函数 () => State
- 作用：获取当前 store 的状态值。

4. api (内层函数参数)

- 类型：对象 StoreApi
- 作用：包含 store API，例如 `setState`、`getState`、`getInitialState` 和 `subscribe`。

#### devtools

devtools 是 zustand 提供的一个用于调试的工具，它可以帮助我们更好地管理状态。

```ts
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

interface UserStore {
  name: string;
  age: number;
  hobby: { sing: string; dance: string; rap: string; basketball: string };
  setHobbyRap: (rap: string) => void;
  setHobbyBasketball: (basketball: string) => void;
}

const useUserStore = create<UserStore>()(
  devtools(
    immer((set) => ({
      name: "坤坤",
      age: 18,
      hobby: {
        sing: "坤式唱腔",
        dance: "坤式舞步",
        rap: "坤式rap",
        basketball: "坤式篮球",
      },
      setHobbyRap: (rap: string) =>
        set((state) => {
          state.hobby.rap = rap;
        }),
      setHobbyBasketball: (basketball: string) =>
        set((state) => {
          state.hobby.basketball = basketball;
        }),
    })),
    {
      enabled: true,
      name: "用户信息",
    },
  ),
);
```

#### persist

persist 是 zustand 提供的一个用于`持久化`状态的工具，它可以帮助我们更好地管理状态，默认是存储在 localStorage 中，可以指定存储方式

```ts
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

interface UserStore {
  name: string;
  age: number;
  hobby: { sing: string; dance: string; rap: string; basketball: string };
  setHobbyRap: (rap: string) => void;
  setHobbyBasketball: (basketball: string) => void;
}

const useUserStore = create<UserStore>()(
  persist(
    immer((set) => ({
      name: "坤坤",
      age: 18,
      hobby: {
        sing: "坤式唱腔",
        dance: "坤式舞步",
        rap: "坤式rap",
        basketball: "坤式篮球",
      },
      setHobbyRap: (rap: string) =>
        set((state) => {
          state.hobby.rap = rap;
        }),
      setHobbyBasketball: (basketball: string) =>
        set((state) => {
          state.hobby.basketball = basketball;
        }),
    })),
    {
      name: "user",
      // 可省略：默认就是 JSON + localStorage。sessionStorage 可直接替换；
      // IndexedDB 是异步 API，需要先实现符合 StateStorage 的适配器。
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        name: state.name,
        age: state.age,
        hobby: state.hobby,
      }),
    },
  ),
);
```

增加 persist 中间件后，可以通过 `useUserStore.persist.clearStorage()` 删除持久化存储。它只清除 storage 中的数据，不会自动把当前内存 state 重置为初始值；如需同时重置，应另行调用 store 的重置 action。

```tsx
import useUserStore from "../../store/user";
const App = () => {
  const clear = () => {
    useUserStore.persist.clearStorage();
  };
  return <div onClick={clear}>清空缓存</div>;
};
```

### 订阅

zustand 的 subscribe，可以订阅一个状态，当状态变化时，会触发回调函数。(类似Vue3的watch)

#### 订阅整个 store

只要store 的 `state` 发生变化，就会触发回调函数，另外就是这个订阅可以在`组件内部订阅`，也可以在`组件外部订阅`, 如果在组件内部订阅需要放到useEffect中, 防止重复订阅。

```tsx
import { useEffect } from "react";
import { create } from "zustand";

const useCountStore = create(() => ({
  count: 0,
}));
// 外部订阅
const unsubscribeOutside = useCountStore.subscribe((state) => {
  console.log(state.count);
});

// 组件内部订阅
function CountLogger() {
  useEffect(() => {
    return useCountStore.subscribe((state) => {
      console.log(state.count);
    });
  }, []);

  return null;
}

// 模块级订阅不再需要时也应调用：unsubscribeOutside();
```

#### 案例

假设 UI 只关心年龄是否达到某个业务阈值。如果直接选择 `age`，每次年龄变化都会重新渲染组件：

```tsx
import { create } from "zustand";
import { useShallow } from "zustand/react/shallow";

const useAgeStore = create(() => ({
  age: 0,
}));

function Age() {
  const { age } = useAgeStore(useShallow((state) => ({ age: state.age })));
  return <p>{age}</p>;
}
```

如果 UI 只关心“是否达到阈值”，可以让选择器直接返回这个布尔结果。默认的 `Object.is` 比较会使组件只在结果从 `false` 变为 `true`（或反向）时重新渲染，而不是每次年龄变化都重新渲染：

```tsx
import { create } from "zustand";

const useStore = create(() => ({
  age: 0,
}));

function MarriageStatus() {
  const canMarry = useStore((state) => state.age >= 26);
  return <div>{canMarry ? "达到示例阈值" : "未达到示例阈值"}</div>;
}
```

持续优化，目前的订阅只要是store内部任意的state发生变化，都会触发回调函数，我们希望只订阅age的变化，可以使用中间件 `subscribeWithSelector` 订阅单个状态。

```tsx
import { useEffect } from "react";
import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
const useStore = create(
  subscribeWithSelector((set) => ({
    age: 0,
    name: "张三",
  })),
);
function AgeLogger() {
  useEffect(() => {
    return useStore.subscribe(
      (state) => state.age,
      (age, previousAge) => {
        console.log(`age: ${previousAge} -> ${age}`);
      },
    );
  }, []);

  return null;
}
```

#### 补充

1. `subscribe` 会返回一个取消订阅的函数，可以手动取消订阅。

```tsx
const unSubscribe = useStore.subscribe((state) => {
  console.log(state.age);
});
unSubscribe(); //取消订阅
```

2. 当你使用了`subscribeWithSelector`中间件的时候会多出来第三个参数`options`

- `equalityFn` 比较函数
- `fireImmediately` 是否立即触发

```tsx
const unSubscribe = useStore.subscribe(
  (state) => state.age,
  (age, prevAge) => {
    console.log(age, prevAge);
  },
  {
    equalityFn: Object.is, // 默认也是 Object.is；需要其他语义时可传自定义比较函数
    fireImmediately: true, // 默认是false，如果需要立即触发，可以传入true
  },
);
```
