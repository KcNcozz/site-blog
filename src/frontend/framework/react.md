# React

## React 19 最常用的 Hook

### 基础 Hook

| Hook              | 用途                           | 使用频率   |
| ----------------- | ------------------------------ | ---------- |
| `useState`        | 状态管理                       | ⭐⭐⭐⭐⭐ |
| `useEffect`       | 副作用处理（数据获取、订阅等） | ⭐⭐⭐⭐⭐ |
| `useCallback`     | 缓存函数，避免重复创建         | ⭐⭐⭐⭐   |
| `useMemo`         | 缓存计算结果，避免重复计算     | ⭐⭐⭐⭐   |
| `useRef`          | 引用 DOM / 存储不变的值        | ⭐⭐⭐⭐   |
| `useContext`      | 跨组件传递数据                 | ⭐⭐⭐⭐   |
| `useReducer`      | 复杂状态逻辑管理               | ⭐⭐⭐     |
| `useLayoutEffect` | 布局相关的同步副作用           | ⭐⭐⭐     |

### React 19 新增 Hook

| Hook             | 用途                                         | 使用频率   |
| ---------------- | -------------------------------------------- | ---------- |
| `useActionState` | 管理表单 action 状态（替代 useState + form） | ⭐⭐⭐⭐⭐ |
| `useFormStatus`  | 获取表单提交状态                             | ⭐⭐⭐⭐   |
| `useOptimistic`  | 乐观更新（立即更新 UI，后台同步）            | ⭐⭐⭐⭐   |

---

### 最常用的 5 个

```
1. useState → 状态管理
2. useEffect → 副作用
3. useCallback → 优化性能
4. useMemo → 优化性能
5. useRef → DOM 引用 / 持久化值

```

## 基础知识

### 插值语句

```tsx
1. 插值语句 `{ }`
2. 插值语句如何支持对象 需要序列化
3. 事件 驼峰 `<div onClick={fn}>aaa</div>` 如果需要传参可以使用高阶函数 不需要则直接写函数体 `<div onClick={() => fn("aaaa")}>aaa</div>` 泛型函数 `const fn = <T,>(params: T) => {console.log(params);};`
4. 如何绑定属性 `<div id={id}>111</div>` 如何绑定class `<div className={cls}>111</div>` 如何绑定多个class `<div className={`${cls} aa bb cc`}>111</div>`
5. 绑定style `<div style={{color: "red"}}>111</div>`
6. 添加html代码片段 `<div dangerouslySetInnerHTML={{__html: "<h1>111</h1>"}}>`111`</div>` 注意`111`处不能放内容
7. 如何遍历数组 类似`v-for` `{arr.map((item, index) => return <div key={index}>{item}</div>)}`
```

## babel

1. 语法转换
2. Polyfill
3. JSX
4. 插件

## SWC

1. avaScript/TypeScript 转换
2. 模块打包
3. SWC 支持代码压缩和优化
4. SWC 原生支持 TypeScript
5. SWC 原生支持 TypeScript

## 原理

## Hooks

react中所有的Hook都需要在组件的最顶层调用

### useState 状态 (vue响应式变量)

对于基本类型的使用:

```tsx
import "./App.css";
import { useState } from "react";
function App() {
  let [str, setStr] = useState("test1");
  const handlerClick = () => {
    setArr([...arr, 4]); //末尾新增 扩展运算符
    //setArr([0,...arr]) 头部新增 扩展运算符
    setArr(arr.filter((item) => item !== 1)); //删除指定元素
    setArr(
      // 使用map筛选出需要替换的元素，然后替换为新的元素，其他元素保持不变
      arr.map((item) => {
        return item == 2 ? 666 : item;
      }),
    );
  };
  return (
    <>
      <h1>{str}</h1>
      <button onClick={handlerClick}>111</button>
    </>
  );
}
export default App;
```

对于复杂类型的使用:

- 添加元素 --> concat, [...arr]
- 删除元素 --> filter, slice
- 替换元素 --> map
- 排序 --> 先将数组复制一份

useState 的set函数是异步的，目的是性能优化 如果需要同步更新，可以使用 useReducer

### useReducer 集中式 状态 (高级Hook)

`const [state, dispatch] = useReducer(reducer, initialArg, init?)`

- `reducer`: 处理函数 默认不触发 调用dispatch时才会触发
- `initialArg`: 默认值
- `init`: 初始化函数(可选) 只会触发一次 如果有初始化函数，则initialArg会被忽略(使用初始化函数`return`的值作为初始值 例如赋值 处理逻辑)

![useReducer](/assert/react-image/useReducer.png)

示例:

```tsx
import { useReducer } from "react";

const initData = [
  { name: "小满(只)", price: 100, count: 1, id: 1, isEdit: false },
  { name: "中满(只)", price: 200, count: 1, id: 2, isEdit: false },
  { name: "大满(只)", price: 300, count: 1, id: 3, isEdit: false },
];

type Data = typeof initData;

// 处理函数
const reducer = (
  state: Data,
  action: {
    type: "add" | "sub" | "del" | "edit" | "update_name" | "blur";
    id: number;
    newName?: string;
  },
) => {
  const item = state.find((item) => item.id === action.id);
  // console.log(item);
  switch (action.type) {
    case "add":
      item.count++;
      return [...state];
    case "sub":
      item.count--;
      return [...state];
    case "del":
      return state.filter((item) => item.id !== action.id);
    case "edit":
      item.isEdit = !item.isEdit;
      return [...state];
    case "update_name":
      item.name = action.newName;
      return [...state];
    case "blur":
      item.isEdit = !item.isEdit;
      return [...state];
    default:
      return state;
  }
};

function App() {
  const [data, dispatch] = useReducer(reducer, initData);
  return (
    <>
      <h1>购物车</h1>
      <table width={800} border={1} cellPadding={0} cellSpacing={0}>
        <thead>
          <tr>
            <th>名称</th>
            <th>单价</th>
            <th>数量</th>
            <th>总价</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => {
            return (
              <tr key={item.id}>
                <td align="center">
                  {item.isEdit ? (
                    <input
                      onBlur={() => {
                        dispatch({
                          type: "blur",
                          id: item.id,
                        });
                      }}
                      onChange={(e) => {
                        dispatch({
                          type: "update_name",
                          id: item.id,
                          newName: e.target.value,
                        });
                      }}
                      type="text"
                      value={item.name}
                    />
                  ) : (
                    item.name
                  )}
                </td>
                <td align="center">{item.price}</td>
                <td align="center">
                  <button
                    onClick={() => dispatch({ type: "add", id: item.id })}
                  >
                    +
                  </button>
                  {item.count}
                  <button
                    onClick={() => dispatch({ type: "sub", id: item.id })}
                  >
                    -
                  </button>
                </td>
                <td align="center">{item.price * item.count}</td>
                <td align="center">
                  <button
                    onClick={() => dispatch({ type: "edit", id: item.id })}
                  >
                    修改
                  </button>
                  <button
                    onClick={() => dispatch({ type: "del", id: item.id })}
                  >
                    删除
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={4}></td>
            <td align="right">
              总价:
              {data.reduce((a, b) => a + b.price * b.count, 0)}
            </td>
          </tr>
        </tfoot>
      </table>
    </>
  );
}

export default App;
```

### useImmer (第三方hook)

安装: `pnpm add immer use-immer`

```tsx
// useImmer
import { useImmer } from "use-immer";

// ...
const updateTheme = () => {
  setUser((draft) => {
    draft.profile.preferences.theme = "dark";
  });
};

// useImmerReducer
import { useImmerReducer } from "use-immer";

// ...
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
```

### useSyncExternalStore

useSyncExternalStore 用于从外部存储（例如状态管理库、浏览器 API 等）获取状态并在组件中同步显示。这对于需要跟踪外部状态的应用非常有用。

使用场景:

1. 订阅外部 store 例如(redux,Zustand德语)
2. 订阅浏览器API 例如(online,storage,location)等
3. 抽离逻辑，编写自定义hooks
4. 服务端渲染支持

用法:

```ts
const res = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot?)
```

- subscribe：用来订阅数据源的变化，接收一个回调函数，在数据源更新时调用该回调函数。
- getSnapshot：获取当前数据源的快照（当前状态）。
- getServerSnapshot?：在服务器端渲染时用来获取数据源的快照。

案例一:

```tsx
// App.tsx
import { useStorage } from "./hooks/useStorage";

const App = () => {
  const [count, setCount] = useStorage("key", 1);
  return (
    <>
      <h1>{count}</h1>
      <button onClick={() => setCount(count + 1)}>+</button>
      <button onClick={() => setCount(count - 1)}>-</button>
    </>
  );
};

export default App;
```

```ts
// useStorage.ts
import { useSyncExternalStore } from "react";

export const useStorage = (key: string, initialValue: any) => {
  // 订阅者
  // 2. React 调用 subscribe(内部callback)，建立监听
  const subscribe = (callback: () => void) => {
    // 订阅浏览器API
    // 3. 当 storage 变化时，浏览器触发事件
    // 4. 事件触发后，内部callback 被调用
    window.addEventListener("storage", callback);
    return () => {
      // 返回取消订阅
      window.removeEventListener("storage", callback);
    };
  };

  // 快照
  // 1. React 调用 getSnapshot()，先拿当前值
  const getSnapshot = () => {
    return localStorage.getItem(key)
      ? JSON.parse(localStorage.getItem(key))
      : initialValue;
  };

  const res = useSyncExternalStore(subscribe, getSnapshot);

  const update = (value: any) => {
    localStorage.setItem(key, JSON.stringify(value));
    // 手动触发storage事件
    window.dispatchEvent(new StorageEvent("storage"));
  };
  return [res, update];
};

// const [count, setCount] = useStorage("count", 1);
```

案例二:

```tsx
// App.tsx
import { useHistory } from "./hooks/useHistory";
const App = () => {
  const [url, push, replace] = useHistory();
  return (
    <>
      <h1>{url}</h1>
      <button onClick={() => push("/a")}>跳转</button>
      <button onClick={() => replace("/b")}>跳转</button>
    </>
  );
};

export default App;
```

```ts
// useHistory.ts
import { useSyncExternalStore } from "react";

// histoty api去实现 跳转页面 监听history 变化

export const useHistory = () => {
  const subscribe = (callback: () => void) => {
    // 订阅浏览器api监听history 变化
    // vue里面的路由 三种模式 一种ssr用的 两种web history hash
    //history 底层popstate
    //hash 底层hashchange
    window.addEventListener("popstate", callback);
    window.addEventListener("hashchange", callback);
    return () => {
      // 返回取消订阅
      window.removeEventListener("popstate", callback);
      window.removeEventListener("hashchange", callback);
    };
    // popstate 只能监听浏览器前进后退按钮无法监听 pushstate replacestate
  };

  const getSnapshot = () => {
    return window.location.href;
  };

  const url = useSyncExternalStore(subscribe, getSnapshot);

  const push = (url: string) => {
    window.history.pushState({}, "", url);
    window.dispatchEvent(new PopStateEvent("popstate"));
  };

  const replace = (rul: string) => {
    window.history.replaceState({}, "", rul);
    window.dispatchEvent(new PopStateEvent("popstate"));
  };

  return [url, push, replace] as const;
};

/**
 * url 当前页面路径
 */
// const [url, push, replace] = useHistory();
```

### useTransition 过渡函数 用来做优化 (实际应用较少)

```ts
const [isPending, startTransition] = useTransition();
```

- 参数: `useTransition` 不需要任何参数

- 返回值: `useTransition` 返回一个数组,包含两个元素

1. `isPending(boolean)`，告诉你是否存在待处理的 transition。
2. `startTransition(function)` 函数，你可以使用此方法将状态更新标记为 transition。

> 注意: `startTransition` 必须是同步的

### useDeferredValue 用于延迟某些状态的更新 用来做优化

:::info `useTransition` 和 `useDeferredValue` 的区别

`useTransition` 和 `useDeferredValue` 都涉及延迟更新，但它们关注的重点和用途略有不同：

- useTransition主要关注点是`状态的过渡`。它允许开发者控制某个更新的延迟更新，还提供了过渡标识，让开发者能够添加过渡反馈。
- useDeferredValue主要关注点是`单个值`的延迟更新。它允许你把特定状态的更新标记为低优先级。
  :::

```ts
// value: 延迟更新的值(支持任意类型)
const deferredValue = useDeferredValue(value);
```

### \*useEffect

`useEffect` 是 React 中用于处理副作用的钩子。并且 `useEffect` 还在这里充当生命周期函数

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
let obj = { name: "小满" };
const changeObj = (obj) => {
  obj.name = "大满";
  return obj;
};
//小满
changeObj(obj); //修改了外部变量属于副作用函数
//大满
//------------修改成纯函数--------------
//也就是不会改变外部传入的变量
let obj = { name: "alice" };
const changeObj = (obj) => {
  // 1. JSON.parse(JSON.stringify(obj))
  // 2. lodash.cloneDeep(obj)
  // 3. 手写deep函数
  // 4. window.structuredClone(obj) 浏览器自带的深拷贝函数
  const newObj = window.structuredClone(obj); //深拷贝
  newObj.name = "Jack";
  return newObj;
};
console.log(obj, "before");
let newobj = changeObj(obj);
console.log(obj, "after", newobj);
```

#### 基本用法

```ts
useEffect(setup, dependencies?)
```

参数:

- `setup`：Effect处理函数, 可以返回一个清理函数。组件挂载时执行setup, 依赖项更新时先执行cleanup再执行setup, 组件卸载时执行cleanup。
- `dependencies`：setup中使用到的响应式值列表(props、state等)。必须以数组形式编写如[dep1, dep2]。不传则每次重渲染都执行Effect。

示例:

```tsx
// 操作DOM
import { useEffect } from "react";

function App() {
  const dom = document.getElementById("data");
  console.log(dom); //null
  useEffect(() => {
    const data = document.getElementById("data");
    console.log(data); //<div id='data'>zs</div>
  }, []);
  return <div id="data">zs</div>;
}
```

执行时机:

1. 组件渲染完成会立马执行
2. 组件更新时执行
3. 依赖项发生变化时执行 空数组的情况只走一次(初始化, 详情页数据)
4. 组件卸载时执行 清理函数 组件更新之前也会执行

### useLayoutEffect

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

| 区别         | useLayoutEffect                        | useEffect                              |
| ------------ | -------------------------------------- | -------------------------------------- |
| **执行时机** | 浏览器完成布局和绘制**之前**执行副作用 | 浏览器完成布局和绘制**之后**执行副作用 |
| **执行方式** | 同步执行                               | 异步执行                               |
| **DOM渲染**  | 阻塞DOM渲染                            | 不阻塞DOM渲染                          |

:::

应用场景:

- 需要同步读取或更改DOM：例如，你需要读取元素的大小或位置并在渲染前进行调整。
- 防止闪烁：在某些情况下，异步的`useEffect`可能会导致可见的布局跳动或闪烁。例如，动画的启动或某些可见的快速DOM更改。
- 模拟生命周期方法：如果你正在将旧的类组件迁移到功能组件，并需要模拟 `componentDidMount`、`componentDidUpdate`和`componentWillUnmount`的同步行为。

### useRef

- 通过Ref操作DOM元素
- 数据存储

```ts
import { useRef } from "react";
const refValue = useRef(initialValue); // 返回一个对象
// 访问ref的值 类似于vue的ref,Vue的ref是.value，其次就是vue的ref是响应式的，而react的ref不是响应式的
refValue.current;
```

#### 注意事项

1. 组件在重新渲染的时候，useRef的值不会被重新初始化。
2. 改变 ref.current 属性时，React 不会重新渲染组件。React 不知道它何时会发生改变，因为 ref 是一个普通的 JavaScript 对象。(不是响应式的)
3. useRef的值不能作为useEffect等其他hooks的依赖项，因为它并不是一个响应式状态。
4. useRef不能直接获取子组件的实例，需要使用forwardRef。

### useImperativeHandle 父组件使用子组件的实例 方法

```ts
/**
 * ref: 父组件传递的ref对象
   createHandle: 返回值，返回一个对象，对象的属性就是子组件暴露给父组件的方法或属性
   deps?:[可选] 依赖项，当依赖项发生变化时，会重新调用createHandle函数，类似于useEffect的依赖项
 */
useImperativeHandle(ref, () => {
  return {
    // 暴露给父组件的方法或属性
  };
}, [deps]);
```

#### 执行时机

1. 如果不传入第三个参数，那么 `useImperativeHandle` 会在组件挂载时执行一次，然后状态更新时，都会执行一次
2. 如果传入第三个参数，并且是一个空数组，那么 `useImperativeHandle` 会在组件挂载时执行一次，然后状态更新时，不会执行
3. 如果传入第三个参数，并且有值，那么 `useImperativeHandle` 会在组件挂载时执行一次，然后会根据依赖项的变化，决定是否重新执行

### useContext

`useContext` 提供了一个无需为每层组件手动添加 props，就能在组件树间进行数据传递的方法。设计的目的就是解决组件树间数据传递的问题。

:::info 面试题
使用 `useContext` 避免了层层传递props, 并且实现了跨组件之间的共享状态, 使组件之间的通讯变得更加简单. 换而言之, `useContext` 实现了祖孙级别的通讯.
:::

#### 基本用法

```tsx
// React 18
const MyThemeContext = React.createContext({ theme: "light" }); // 创建一个上下文 填充默认值
function App() {
  return (
    // React 19 去掉了Provider
    // <MyThemeContext value={{ theme: "light" }}>
    <MyThemeContext.Provider value={{ theme: "light" }}>
      <MyComponent />
    </MyThemeContext.Provider>
    // </MyThemeContext>
  );
}
function MyComponent() {
  const themeContext = useContext(MyThemeContext); // 使用上下文
  return <div>{themeContext.theme}</div>;
}
```

#### 注意事项

- 使用 `ThemeContext` 时，传递的key必须为 `value`
- 可以使用多个 `Context`
- 同一个 `Context`, 下层的值会覆盖上层的值

### useMemo 性能优化

`useMemo` 是 React 提供的一个性能优化 Hook。它的主要功能是避免在每次渲染时执行复杂的计算和对象重建。通过记忆上一次的计算结果，仅当依赖项变化时才会重新计算，提高了性能，有点类似于Vue的 `computed`。

#### React.memo

`React.memo` 是一个 React API，用于优化性能。它通过记忆上一次的渲染结果，仅当 props 发生变化时才会重新渲染, 避免重新渲染。

#### 用法

使用 `React.memo` 包裹组件[一般用于子组件]，可以避免组件重新渲染。

```tsx
// React.memo
import React, { memo } from "react";
const MyComponent = React.memo(({ prop1, prop2 }) => {
  // 组件逻辑
});
const App = () => {
  return <MyComponent prop1="value1" prop2="value2" />;
};

// useMemo
import React, { useMemo, useState } from "react";
const App = () => {
  const [count, setCount] = useState(0);
  const memoizedValue = useMemo(() => count, [count]);
  return <div>{memoizedValue}</div>;
};
```

::: warning React的渲染条件是什么?

1. 组件的 `props` 发生变化
2. 组件的 `state` 发生变化
3. `useContext` 发生变化
   :::

### useCallback 性能优化

`useCallback` 用于优化性能，返回一个记忆化的回调函数，可以减少不必要的重新渲染，也就是说它是用于缓存组件内的函数，避免函数的重复创建。

在React中，函数组件的重新渲染会导致组件内的函数被重新创建，这可能会导致性能问题。`useCallback` 通过缓存函数，可以减少不必要的重新渲染，提高性能。

#### 用法

```ts
const memoizedCallback = useCallback(() => {
  doSomething(a, b);
}, [a, b]);
```

:::info `useCallback` 和 `useMemo` 的区别  
111
:::

### useDebugValue

`useDebugValue` 是一个专为开发者调试自定义 Hook 而设计的 React Hook。它允许你在 React 开发者工具中为自定义 Hook 添加自定义的调试值。

#### 用法

```ts
const debugValue = useDebugValue(value);
```

### useId

`useId` 是 React 18 新增的一个 Hook，用于生成稳定的唯一标识符，主要用于解决 SSR 场景下的 ID 不一致问题，或者需要为组件生成唯一 ID 的场景。

用法:

```ts
const id = useId();
// 返回值: :r0: 多次调用值递增
```

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
2. 泛型:
   - 可以选择给 interface安装给props 添加类型.
   - 可以使用`React.FC` (Function Component)
3. 默认值:
   - 解构
   - 声明一个默认对象
4. props.children 特殊的prpos, 类似于vue中的slot
5. props支持所有的数据类型
6. 子传父(类似Vue中的 emit) 在父组件中把函数体传给子组件, 在子组件中调用这个函数, 同时把数据传递给这个函数

#### 兄弟组件通信

- 原理就是 `发布订阅` 设计模式
- 也可以先传给上层组件, 然后再通过 `context` 传给下层组件
- 也可以使用 `mitt`

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

`Suspense` 是一种异步渲染机制，其核心理念是在组件加载或数据获取过程中，先展示一个占位符（loading state），从而实现更自然流畅的用户界面更新体验。

#### 应用场景

- `异步组件加载`：通过代码分包实现组件的按需加载，有效减少首屏加载时的资源体积，提升应用性能。

- `异步数据加载`：在数据请求过程中展示优雅的过渡状态（如 loading 动画、骨架屏等），为用户提供更流畅的交互体验。

- `异步图片资源加载`：智能管理图片资源的加载状态，在图片完全加载前显示占位内容，确保页面布局稳定，提升用户体验。

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

`use` API 用于获取组件内部的Promise,或者Context的内容，该案例使用了use获取Promise返回的数据并且故意延迟2秒返回，模拟网络请求。

### HOC 高阶组件 (面试)

什么是高阶组件？

高阶组件就是一个组件，它接受另一个组件作为参数，并返回一个新的组件，（如果你学过Vue的话，跟Vue中的二次封装组件有点类似）新的组件可以复用旧组件的逻辑，并可以添加新的功能。常用于类组件中，虽然目前都是hooks写法会缩小HOC的使用场景，但还是有部分场景会用到。

## API

作用：将一个组件渲染到DOM的任意位置，跟Vue的Teleport组件类似。

#### 用法

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

#### 案例

如果外层有`position: relative` 的样式，那么弹框会相对于外层进行定位，如果外层没有`position: relative` 的样式，那么弹框会相对于`body`进行定位,故此这个Modal不稳定，所以需要使用`createPortal`来将Modal挂载到body上，或者直接将定位改成`position: fixed` , 两种方案。

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
在Vite中css Modules 是开箱即用的，只需要把文件名设置为`xxx.module.[css|less|sass|stylus]`，就可以使用css modules了。
:::

#### 修改css modules 规则

Vite基于`postcss-modules`实现的

```ts
// vite.config.ts
export default defineConfig({
  css: {
    modules: {
      localsConvention: "dashes", // 修改css modules的类名规则 可以改成驼峰命名 或者 xxx-xxx命名等
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

// 例子
export default defineConfig({
  css: {
    modules: {
        generateScopedName: '[local]_[hash:base64:5]' // 只保留类名和哈希值
        // 或者
        generateScopedName: '[hash:base64:8]' // 只使用哈希值
        // 或者
        generateScopedName: '[name]_[local]' // 只使用文件名和类名，没有哈希
        // 或者
        generateScopedName: '[local]--[hash:base64:4]' // 自定义分隔符
    },
  },
});
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

- css-in-js 是基于运行时，所以会损耗一些性能(电脑性能高可以忽略)
- 调试困难，CSS-in-JS 的样式难以调试，因为它们是动态生成的，而不是在 CSS 文件中定义的。

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
  },
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
import styled, { createGlobalStyle, keyframes } from "styled-components";

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
    return result + str + (args[i] || "");
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

路由有三种模式:

- 数据模式(推荐) 类似于`vue-router`
- 声明模式
- 框架模式(用的较少)

### 安装

```sh
pnpm add react-router #V7不在需要 react-router-dom
```

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

> 如何初始化? (类似于去Vue3配置`use`)

在App.tsx 中初始化 (只是做初始化 没有类似于`router-view`的功能)

```tsx
// App.tsx
import React from "react";
import { RouterProvider } from "react-router"; // 初始化方法
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

使用`NavLink`进行跳转:

```tsx
// Home.tsx
import { NavLink } from "react-router";
const Home: React.FC = () => {
  return (
    <div>
      <NavLink to="/about">About</NavLink>
    </div>
  );
};

export default Home;
```

```tsx
// About.tsx
import { NavLink } from "react-router";
const About: React.FC = () => {
  return (
    <div>
      <NavLink to="/">Home</NavLink>
    </div>
  );
};

export default About;
```

### 路由模式

#### createBrowserRouter (推荐)

**核心特点**：

- 使用HTML5的history API (`pushState`, `replaceState` , `popState`)
- 浏览器URL比较纯净 (/search, /about, /user/123)
- 需要`服务器端支持`(nginx, apache,等)否则会刷新404

#### createHashRouter

**核心特点**：

- 使用URL的hash部分(`#/search`, `#/about`, `#/user`)
- 不需要服务器端支持
- 刷新页面不会丢失

**使用场景**：

- 静态站点托管例如(github pages, netlify, vercel)
- 不需要服务器端支持

#### createMemoryRouter

**核心特点**：

- 使用`内存`中的路由表
- 刷新页面会丢失状态
- 切换页面路由不显示URL

**使用场景**：

- 非浏览器环境例如(React Native, Electron)
- 单元测试或者组件测试(Jest, Vitest)

#### createStaticRouter

**核心特点**：

- 专为`服务端渲染`（SSR）设计
- 在服务器端匹配请求路径，生成静态 HTML
- 需与客户端路由器（如 createBrowserRouter）配合使用

**使用场景**：

- 服务端渲染应用（如 Next.js 的兼容方案）
- 需要SEO优化的页面

#### 如何解决刷新404问题

1. 在使用`createBrowserRouter`创建路由
2. Nginx中修改`/conf/nginx.conf` , 在`location`中添加如下代码`try_files $uri $uri/ /index.html;`

### 路由

#### Layout布局

layout布局中菜单跳转无法使用`NavLink`进行跳转, 因此需要使用编程式导航. `useNavigate`

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

#### 嵌套路由

嵌套路由就是父路由中嵌套子路由 `children` ，子路由可以继承父路由的布局，也可以有自己的布局。

**注意事项**:

- 如果父路由的 path 是 `index`开始，所以访问子路由的时候需要加上父路由的path例如 `/index/home` `/index/about`
- 子路由不需要增加`/`了直接写子路由的`path`即可
- 子路由默认是不显示的，需要父路由通过 `Outlet` 组件来显示子路由 `Outlet` 就是类似于Vue的`<router-view>`展示子路由的一个容器
- 子路由的层级可以无限嵌套，但是要注意的是，一般实际工作中就是2-3层

#### 布局路由

布局路由是一种特殊的嵌套路由，父路由可以省略 `path`，这样不会向 URL 添加额外的路径段：

```ts
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

```ts
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

```ts
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
  let params = useParams(); // { id: '123' }
  console.log(params.id);
}
```

### 路由传参

#### 1. Query参数

```sh
#多个参数用 `&` 连接
/about?name=xxx&age=18
```

传递后在地址栏就会有`name=xxx&age=18`, 如何接收?

```ts
import { useSearchParams } from "react-router"; // 获取路由参数
const [searchParams, setSearchParams] = useSearchParams(); // 获取路由参数 更改路由参数
```

跳转方式:

```tsx
<NavLink  to="/about?id=123">About</NavLink> //1. NavLink 跳转
<Link to="/about?id=123">About</Link> //2. Link 跳转
import { useNavigate } from 'react-router'
const navigate = useNavigate()
navigate('/about?id=123') //3. useNavigate 跳转
```

获取参数:

```tsx
//1. 获取参数
import { useSearchParams } from "react-router";
const [searchParams, setSearchParams] = useSearchParams();
console.log(searchParams.get("id")); //获取id参数
// 也可以用set进行修改
setSearchParams({ id: "456" });
//2. 获取参数
import { useLocation } from "react-router";
const { search } = useLocation();
console.log(search); //获取search参数 ?id=123
```

#### 2. Params参数(动态参数)

```sh
/user/:city
```

跳转方式:

```tsx
// 遵循RestFul风格
<NavLink to="/user/123">User</NavLink> //1. NavLink 跳转
<Link to="/user/123">User</Link> //2. Link 跳转
import { useNavigate } from 'react-router'
const navigate = useNavigate()
navigate('/user/123') //3. useNavigate 跳转
```

获取参数:

```tsx
import { useParams } from "react-router"; // 获取路由参数
const { id } = useParams();
console.log(id); //获取id参数
```

::: warning 注意
只可以传普通类型, 不可以传递对象
:::

#### State参数

`state`在URL中`不显示`，但是可以传递参数:

```sh
/user
```

跳转方式:

```tsx
<Link to="/user" state={{ name: 'xxx', age: 18 }}>User</Link> //1. Link 跳转
<NavLink to="/user" state={{ name: 'xxx', age: 18 }}>User</NavLink> //2. NavLink 跳转
import { useNavigate } from 'react-router'
const navigate = useNavigate()
navigate('/user', { state: { name: 'xxx', age: 18 } }) //3. useNavigate 跳转
```

获取参数:

```tsx
import { useLocation } from "react-router";
const { state } = useLocation();
console.log(state); //获取state参数
console.log(state.name); //获取name参数
console.log(state.age); //获取age参数
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
   - 适用于：传递复杂数据结构
   - 特点：支持任意类型数据，参数不显示在URL
   - 限制：刷新可能丢失，不利于分享

选择建议：必要参数用 Params(查详情)，筛选条件用 Query(搜索 分页)，临时数据用 State(复杂数据)。

### 路由懒加载

> 什么是懒加载?

懒加载是一种优化技术，用于延迟加载组件，直到需要时才加载。这样可以减少初始加载时间，提高页面性能。

```ts
// 通过在路由对象中使用 lazy 属性来实现懒加载。
import { createBrowserRouter } from 'react-router';
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms)); // 模拟异步请求
const router = createBrowserRouter([
    {
        Component: Layout,
            {
                path: 'about',
                lazy: async () => {
                    await sleep(2000); // 模拟异步请求
                    // 使用动态引入的方式 默认会进行代码分包
                    const Component = await import('../pages/About'); // 异步导入组件
                    console.log(Component);
                    return {
                        Component: Component.default,
                    }
                }
            },
         }
      ],
)
```

当切换到 `about` 路由时，才会进行加载

::: tip
如果配置了 `loader` 则每次都会进入`loading`状态，如果没有配置 `loader` 则只执行一次。
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

### \*路由高级操作

路由的操作是由两个部分组成的:

- `loader`
- `action`

在平时工作中大部分都是在做`增刪查改(CRUD)`的操作，所以一个界面的接口过多之后就会使逻辑臃肿复杂，难以维护，所以需要使用路由的高级操作来`优化代码`。

#### loader

::: tip
只有GET请求才会触发loader，所以适合用来获取数据
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
      const data = await response.json();
      const response = await getUser(data);
      // 获取数据 可以是调用后端接口获取数据
      return {
        // 一定要return出去
        data: response.list,
        message: "success", // 自定义的属性
      };
    },
  },
]);
```

使用useLoaderData接收数据:

```tsx
//App.tsx
import { useLoaderData } from "react-router"; // 使用useLoaderData接收数据
const App = () => {
  const { data, message } = useLoaderData();
  // 获取数据;
  return <div>{data}</div>;
};
```

#### action

一般用于表单提交，删除，修改等操作。

[useSubmit](https://message163.github.io/react-docs/react/router/hooks/useSubmit.html)

[useActionData](https://message163.github.io/react-docs/react/router/hooks/useActionData.html)

::: tip
只有POST DELETE PATCH PUT等请求才会触发action，所以适合用来提交表单
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
          await createUser(formData);
          // 创建用户;
          return {
            data: table,
            success: true,
          };
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
const submit = useSubmit();
const navigation = useNavigation();

return (
  <div>
    {navigation.state === "loading" && <div>loading...</div>}
    <button disabled={navigation.state === "submitting"}>提交</button>
  </div>
);
```

### 导航

#### link

`Link`组件是一个用于导航到其他页面的组件，他会被渲染成一个特殊的`<a>`标签，跟传统a标签不同的是，他`不会刷新页面`，而是会通过router管理路由。

示例:

```tsx
import { Link } from "react-router";

export default function App() {
  return <Link to="/index/user">user</Link>;
}
```

参数:

- `to`：要导航到的路径
- `replace`：是否保留跳转的历史记录 保留则不写`replace`
- `state`：要传递给目标页面的状态(携带参数) <span v-pre>`<Link to="/index/user" state={{id:1}}>`</span>
- `relative`：相对于当前路径的导航方式 默认是 `route` 绝对路径 还有 `path` 相对路径 在数据模式下自动支持 是否加 `relative='path'` 都可以
- `reloadDocument`：跳转页面时是否重新加载页面
- `preventScrollReset`：跳转后是否阻止滚动位置重置
- `viewTransition`：是否启用视图过渡

#### navlink

和`link`参数一模一样

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
  animate: pulse 1s infinite;
}

a.transitioning {
  /* css transition is running */
}
```

也可以直接用style属性来设置:

```tsx
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

1. `viewTransition` 需要谷歌111版本才能使用，注意兼容性
2. `pending`只有数据模式，和框架模式才能使用，声明式路由不能使用
   :::

#### useNavigate 编程式导航

`useNavigate` 是一个 `React-router` 的钩子，用于编程式导航的路由跳转。

> eg: 例如倒计时结束后，自动返回跳转等, 因为这种操作属于逻辑性操作，这时候组件方式的跳转就不合适了，这时候就需要使用编程式跳转。

```ts
import { useNavigate } from "react-router";

const navigate = useNavigate();
setTimeout(() => {
  navigate("/home", { replace: true });
}, 1000);
```

参数:

1. 第一个参数: `to` 跳转的路由 navigate(to)

```tsx
import { useNavigate } from "react-router"; // 导入useNavigate
const navigate = useNavigate(); // 获取navigate函数
navigate("/home"); // 跳转路由
```

2. 第二个参数: `options` 配置对象 navigate(to, options)
   - `replace`: 跳转页面的时候，是否替换当前路由
   - `state`: 传递数据，在跳转的页面中使用通过`useLocation`的state属性获取 `navigate('/home',{state:{name:'张三'}});`
   - `relative`: 跳转的方式，默认是绝对路径，如果想要使用相对路径，需要设置为`relative:'path'`
   - `preventScrollReset`: 跳转页面的时候，是否阻止滚动重置
   - `viewTransition`: 跳转页面的时候，是否使用过渡动画 `navigate('/home',{viewTransition:true});`

#### redirect

`redirect` 是用于重定向，通常用于`loader`中，当`loader`返回`redirect`的时候，会自动重定向到`redirect`指定的路由。

```tsx
import { redirect } from "react-router";
{
  path: "/home",
  loader: async ({request}) => {
    const isLogin = await checkLogin();
    if(!isLogin) return redirect('/login');
    return {
        data: 'home'
    }
  }
}
```

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

`ErrorBoundary`是用于捕获路由`loader`或`action`的错误，并进行处理。如果`loader`或`action`抛出错误，会调用`ErrorBoundary`组件。

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
          //throw new Response('Not Found', { status: 404, statusText: 'Not Found' }); 可以返回Response对象
          //也可以返回json等等
          throw {
            message: "Not Found",
            status: 404,
            statusText: "Not Found",
            data: "132131",
          };
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
import { useRouteError } from "react-router"; // 获取错误信息

export default function Error() {
  const error = useRouteError();
  return <div>{error.message}</div>;
}
```

## Zustand 状态管理

1. `轻量级` Zustand 的体积非常小，只有 1kb 左右。
2. `简单易用` Zustand 不需要像Redux，去通过`Provider`包裹组件，Zustand提供了简洁的API，能够快速上手。
3. `易于集成` Zustand 可以轻松的与React 和 Vue 等框架集成。(Zustand也有Vue版本)
4. `拓展性` Zustand 提供了中间件的概念，可以通过插件的方式扩展功能，例如(持久化, 异步操作, 日志记录)等。
5. `无副作用` Zustand 推荐使用 `immer`库处理不可变性， 避免不必要的副作用。

### 安装

```sh
pnpm add zustand
```

### 使用

1. 创建一个store目录, 一个store.ts文件
2. 初始化仓库 `import { create } from 'zustand'` `create`函数 返回一个回调函数 必须返回一个对象 回调函数接收两个参数`set` `get`
3. set是一个函数 接收一个参数 参数是一个函数 函数接收一个参数 参数是state
4. get 接收一个参数 参数是一个state

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
        // ...state.gourd,  // 需要手动合并状态
        oneChild: "大娃-超进化",
      },
    })),
}));

export default useUserStore;
```

::: warning
注意：与`useState`类似, 如果不进行状态合并，其他状态会丢失。每次更新都需要手动合并状态，这在实际开发中会变得很繁琐。
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

`immer.js` 通过 `Proxy` 代理对象的`所有操作`，实现不可变数据的更新。当对数据进行修改时，`immer` 会创建一个被修改对象的`副本`，并在副本上进行修改，最后返回修改后的`新对象`，而原始对象保持不变。这种机制确保了数据的不可变性，同时提供了直观的修改方式。

`immer` 的核心原理基于以下两个概念：

1. `写时复制` (Copy-on-Write)
   - 无修改时：直接返回原对象
   - 有修改时：创建新对象

2. `惰性代理` (Lazy Proxy)
   - 按需创建代理
   - 通过 Proxy 拦截操作
   - 延迟代理创建

改动第几层对象, 就拷贝到第几层:

```ts
// 简单实现

/**
 * 主要步骤:
 * 1. 拦截读写操作，把所有的变更存在副本中 创建produce函数
 * 2. 读取(handler)的时候判断是否存在副本中，存在则返回副本中的值，否则返回原值
 * 3. 读取的时候如果是对象，则递归创建代理
 * 4. 返回proxy并且变成原始对象
 */
type Draft<T> = {
  -readonly [P in keyof T]: T[P];
};

function produce<T>(base: T, recipe: (draft: Draft<T>) => void): T {
  // 用于存储修改过的对象
  const modified: Record<string, any> = {};

  const handler = {
    get(target: any, prop: string) {
      // 如果这个对象已经被修改过，返回修改后的对象
      if (prop in modified) {
        return modified[prop];
      }

      // 如果访问的是对象，则递归创建代理
      if (typeof target[prop] === "object" && target[prop] !== null) {
        return new Proxy(target[prop], handler);
      }
      return target[prop];
    },
    set(target: any, prop: string, value: any) {
      // 记录修改
      modified[prop] = value;
      return true;
    },
  };

  // 创建代理对象
  const proxy = new Proxy(base, handler);

  // 执行修改函数
  recipe(proxy);

  // 如果没有修改，直接返回原对象
  if (Object.keys(modified).length === 0) {
    return base;
  }

  // 创建新对象，只复制修改过的属性
  return JSON.parse(JSON.stringify(proxy));
}

// 使用示例
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
```

### 状态简化

在使用zustand时, 通过解构的方式引入状态，但是这样引入会引发一个问题，例如A组件用到了 `hobby.basketball` 状态，而B组件 没有用到 `hobby.basketball` 状态，但是更新 `hobby.basketball` 这个状态的时候，A组件和B组件都会`重新渲染`，这样就导致了不必要的重渲染，因为B组件并没有用到hobby.basketball这个状态。

#### 状态选择器

我们可以使用状态选择器来规避这个问题. 状态选择器可以让我们只选择我们需要的部分状态，这样就不会引发不必要的重渲染。

```ts
// 本来的写法
const { hobby, name } = useUserStore();
// 新写法
const name = useUserStore((state) => state.name);
const age = useUserStore((state) => state.age);
const rap = useUserStore((state) => state.hobby.rap);
const basketball = useUserStore((state) => state.hobby.basketball);
```

但是这样会出现一个新的问题: 每用到一个属性, 都要重新定义一个变量, 过于麻烦.

#### useShallow

::: tip
`useShallow` 只检查顶层对象的引用是否变化，如果顶层对象的引用没有变化（即使其内部属性或子对象发生了变化，但这些变化不影响顶层对象的引用），使用 `useShallow` 的组件将不会重新渲染
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

- 类型：函数 (set, get, api) => StoreApi
- 作用：原始创建 store 的配置函数，由用户传入。中间件需要包装这个函数。

2. set (内层函数参数)

- 类型：函数 (partialState) => void
- 作用：原始的状态更新函数，用于修改 store 的状态。

3. get (内层函数参数)

- 类型：函数 () => State
- 作用：获取当前 store 的状态值。

4. api (内层函数参数)

- 类型：对象 StoreApi
- 作用：包含 store 的完整 API（如 setState, getState, subscribe, destroy 等方法）。

#### devtools

devtools 是 zustand 提供的一个用于调试的工具，它可以帮助我们更好地管理状态。

```ts
import { devtools } from "zustand/middleware"; // 引入 devtools 中间件 内置
const useUserStore = create<User>()(
  immer(
    devtools(
      (set) => ({
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
      }),
      {
        enabled: true, // 是否开启devtools
        name: "用户信息", // 仓库名称 (唯一)
      },
    ),
  ),
);
```

#### persist

persist 是 zustand 提供的一个用于`持久化`状态的工具，它可以帮助我们更好地管理状态，默认是存储在 localStorage 中，可以指定存储方式

```ts
import { persist } from "zustand/middleware";
const useUserStore = create<User>()(
  immer(
    persist(
      (set) => ({
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
      }),
      {
        name: "user", // 仓库名称(唯一)
        storage: createJSONStorage(() => localStorage), // 存储方式 可选 localStorage sessionStorage IndexedDB 默认localStorage
        partialize: (state) => ({
          // 按需存储
          name: state.name,
          age: state.age,
          hobby: state.hobby,
        }), // 部分状态持久化
      },
    ),
  ),
);
```

清空缓存Api, 在页面中添加一个按钮，点击按钮清空缓存,在增加persist中间件之后会自动增加一个clearStorage方法,用于清空缓存。

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

#### 订阅一个状态

只要store 的 `state` 发生变化，就会触发回调函数，另外就是这个订阅可以在`组件内部订阅`，也可以在`组件外部订阅`, 如果在组件内部订阅需要放到useEffect中, 防止重复订阅。

```tsx
const store = create((set) => ({
  count: 0,
}));
// 外部订阅
store.subscribe((state) => {
  console.log(state.count);
});
// 组件内部订阅
useEffect(() => {
  store.subscribe((state) => {
    console.log(state.count);
  });
}, []); // 空数组代表组件渲染完成后执行, 且只执行一次
```

#### 案例

比如我们需要观察年龄的变化，大于等于26 就提示可以结婚了，小于26 就提示还不能结婚，如果使用选择器的写法，age每次更新都会重新渲染组件，这样就会导致组件的频繁渲染。

```tsx
const store = create((set) => ({
  age: 0,
}));
//组件里面 age 每次更新都会重新渲染组件
const { age } = useStore(
  useShallow((state) => ({
    age: state.age,
  })),
);
```

性能优化，采用订阅的模式，age 变化的时候，会调用回调函数，但是不会重新渲染组件。

```tsx
const store = create((set) => ({
  age: 0,
}));

const [status, setStatus] = useState("单身");
//只会更新一次组件
useStore.subscribe((state) => {
  if (state.age >= 26) {
    setStatus("结婚");
  } else {
    setStatus("单身");
  }
});
return <div>{status}</div>;
```

持续优化，目前的订阅只要是store内部任意的state发生变化，都会触发回调函数，我们希望只订阅age的变化，可以使用中间件 `subscribeWithSelector` 订阅单个状态。

```tsx
import { subscribeWithSelector } from "zustand/middleware";
const store = create(
  subscribeWithSelector((set) => ({
    age: 0,
    name: "张三",
  })),
);
const [status, setStatus] = useState("单身");
//订阅age的变化 并且组件渲染一次
useStore.subscribe(
  (state) => state.age,
  (age, prevAge) => {
    if (age >= 26) {
      setStatus("结婚");
    } else {
      setStatus("单身");
    }
  },
);
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
    equalityFn: (a, b) => a === b, // 默认是浅比较，如果需要深比较，可以传入一个比较函数
    fireImmediately: true, // 默认是false，如果需要立即触发，可以传入true
  },
);
```
