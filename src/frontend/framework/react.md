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

:::tip
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

:::tip
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

- 数据模式(推荐)
- 声明模式
- 框架模式(用的较少)

### 安装

```sh
pnpm add react-router #V7不在需要 react-router-dom
```

```ts
// /router/index.ts
import { createBrowserRouter } from "react-router";
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

```tsx
// App.tsx
import React from "react";
import { RouterProvider } from "react-router";
import router from "./router";
const App: React.FC = () => {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
};

export default App;
```

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

#### createBrowserRouter 推荐

**核心特点**：

- 使用HTML5的history API (pushState, replaceState, popState)
- 浏览器URL比较纯净 (/search, /about, /user/123)
- 需要服务器端支持(nginx, apache,等)否则会刷新404

**使用场景**：

- 大多数现代浏览器环境
- 需要服务器端支持
- 需要URL美观

#### createHashRouter

**核心特点**：

- 使用URL的hash部分(#/search, #/about, #/user/123)
- 不需要服务器端支持
- 刷新页面不会丢失

**使用场景**：

- 静态站点托管例如(github pages, netlify, vercel)
- 不需要服务器端支持

#### createMemoryRouter

**核心特点**：

- 使用内存中的路由表
- 刷新页面会丢失状态
- 切换页面路由不显示URL

**使用场景**：

- 非浏览器环境例如(React Native, Electron)
- 单元测试或者组件测试(Jest, Vitest)

#### createStaticRouter

**核心特点**：

- 专为服务端渲染（SSR）设计
- 在服务器端匹配请求路径，生成静态 HTML
- 需与客户端路由器（如 createBrowserRouter）配合使用

**使用场景**：

- 服务端渲染应用（如 Next.js 的兼容方案）
- 需要SEO优化的页面

#### 如何解决刷新404问题

### 路由

#### Layout布局

#### 嵌套路由

嵌套路由就是父路由中嵌套子路由 `children` ，子路由可以继承父路由的布局，也可以有自己的布局。

**注意事项**:

- 如果父路由的 path 是 `index`开始，所以访问子路由的时候需要加上父路由的path例如 `/index/home` `/index/about`
- 子路由不需要增加/了直接写子路由的path即可
- 子路由默认是不显示的，需要父路由通过 `Outlet` 组件来显示子路由 `outlet` 就是类似于Vue的`<router-view>`展示子路由的一个容器
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

#### 前缀路由

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
        path: "home/:id",
        Component: Home,
      },
      {
        path: "about",
        Component: About,
      },
    ],
  },
]);

//在组件中获取参数
import { useParams } from "react-router";

function Card() {
  let params = useParams();
  console.log(params.id);
}
```

### 路由传参

#### Query参数

#### State参数

#### Params参数(动态参数)

### 路由懒加载

### 路由操作

路由的操作是由两个部分组成的:

- `loader`
- `action`

在平时工作中大部分都是在做`增刪查改(CRUD)`的操作，所以一个界面的接口过多之后就会使逻辑臃肿复杂，难以维护，所以需要使用路由的高级操作来优化代码。

### 导航

### 边界处理

## Zustand 状态管理
