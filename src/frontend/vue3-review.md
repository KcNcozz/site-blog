# Vue3复习 <Badge type="warning" text="总结于小满zs的vue课程" />

## 1. Nodejs源码

三部分组成：

1. Libuv
2. 第三方库
3. V8

## 2. `npm run dev`流程

## 3. 模板语法 vue指令

1. 模板语法支持**计算**和**三元运算**
2. `v-text`和`v-html`(不支持解析组件)
3. `v-if`（变为注释节点）和`v-show`（变成`display:none` 性能更高）
4. `v-if`在组件上使用会有区别（后面讲）
5. `v-on:click="xxx"`等价于`@click="xxx"` 也支持事件变为动态的 （冒泡事件 `.shop`取消）
6. `v-bind="id"`绑定元素上的一些属性，简写为`:id`。也可以绑定style，class，也可以用表达式去判断
7. `v-model`一般绑定表单元素
8. `v-for`遍历，支持嵌套循环
9. `v-once`仅渲染元素和组件一次，并跳过之后的更新。
10. `v-memo`配合`v-for`使用（面试）

## 4. 虚拟DOM diff算法

### 虚拟DOM

> 虚拟DOM：虚拟DOM就是通过JS来生成一个AST节点树

DOM上属性太多了，直接操作DOM非常浪费性能。解决方案就是可以用JS的计算性能来换取操作Dom所消耗的性能，既然无法逃避操作Dom,我们可以尽可能少的操作DOM，
操作JS是非常快的。

### diff

- 无key：for循环patch，重新渲染元素 --> 删除 --> 新增

- 有key：前序算法（头和头比） --> 尾序算法（尾和尾比） --> 发现多的 新增 --> 发现少的 卸载 --> 无序 （1. 构建索引映射关系 2. 如果有多余的旧节点 删除，如果新节点不包含旧节点 删除，节点出现交叉 说明是移动要去求最长递增子序列 3. 求最长递增子序列升序（最长递增子序列算法 贪心+二分）如果当前遍历的这个节点不在子序列说明要进行移动 如果节点在序列中直接跳过）

## 5. Ref

1. `ref`变为响应式。`ref`返回的是class类，修改值必须加`.value`

   ```vue
   const xxx = ref<string>("aaa")

   const xxx:Ref<string> = ref("aaa")
   ```

2. `isRef`判断是否为Ref对象

3. `shallowRef`浅层响应式 只到`.value` **Ref和shallRef不能一起写，否则会影响shallRef，造成视图更新**

4. `triggerRef`

5. `customRef`自定义Ref 写防抖

   ```vue
   function MyRef<T>(value:T){
       return customRef((track,trigger)=>{
       return {
   		get(){
       		track()
           	return value
      			 },
   		set (newVal) {
   			value = newVal
       		trigger()
       		}
   		}
       })
    }
   ```

6. ref可以用于dom元素

## 6. Reactive

1. ref支持所有数据类型，reactive只支持引用类型
2. reactive不需要`.value`
3. `@click.prevent="xxx"` 阻止默认提交事件
4. `@click.stop="xxx"` 阻止冒泡
5. reactive是proxy代理对象 不能直接赋值 否则会丢失响应式 （解决方案：数组可以使用push加结构，或者添加一个对象，把数组作为一个属性去解决）
6. `readonly` 只读
7. `shallowReactive` 创建一个浅层proxy对象

## 7. toRef toRefs toRaw

1. `toRef` 只能修改响应式对象的值，非响应式视图毫无变化，解构后仍为响应式
2. `toRefs` 实现多个`toRef`
3. `toRaw` 脱离响应式，变为原始数据

## 8. 响应式原理

```ts
// reactive
export const reactive = <T extends object>(target: T) => {
   return new Proxy(target, {
      get(target, key, receiver) {
         let res = Reflect.get(target, key, receiver)
         return res
      },
      set(target, key, value, receiver) {
         let res = Reflect.set(target, key, value, receiver)
         return res
      }
   })
}

// effect
interface Options {
   scheduler?: Function
 }


let activeEffect:Function;
export const = effect(fn:Function, options:Options) => {
   const _effect = function() {
      activeEffect = _effect
      let res = fn()
      return res
   }
   _effect.options = options
   _effect()
   return _effect
}

const targetMap = new WeakMap()
export const track = (target, key) => {
   targetMap.get(target)
   if (!depsMap) {
      depsMap = new Map()
      targetMap.set(target, depsMap)
   }
   let deps = depsMap.get(key)
   if (!deps) {
      deps = new Set()
      depsMap.set(key, deps)
   }
   deps.add(activeEffect)
}

export const trigger = (target, key) => {
   const depsMap = targetMap.get(target)
   if (!depsMap) return
   const deps = depsMap.get(key)

   deps.forEach(effect => {
      if(effect?.options?.scheduler) {
         effect?.options?.scheduler?.()
      } else {
         effect()
      }
   })
```

## 9. computed

- `computed`返回一个对象，对象有`value`属性，属性值就是计算后的结果

```ts
// 1. 选项式写法 支持一个对象传入get函数以及set函数自定义操作
let name = computed<string>({
  get() {
    return firstName.value + " " + lastName.value;
  },
  set(newValue) {
    [firstName.value, lastName.value] = newValue.split("_");
  },
});
// 2. 函数式写法 只能支持一个getter函数不允许修改值的
let name = computed(() => firstName.value + "_" + lastName.value);

// 3. 实战

// 4. 手搓源码 conmputed.ts
export const computed = (getter: Function) => {
  let _value = effect(getter, {
    scheduler: () => {
      _dirty = true;
    },
  }); // effect是之前手写过的
  let catchValue;
  let _dirty = true; // 脏值检查

  class ComputedRefImpl {
    get value() {
      if (_dirty) {
        catchValue = _value();
        _dirty = false;
      }
      return catchValue;
    }
  }

  return new ComputedRefImpl();
};
```

## 10. watch

- watch: 监听响应式数据变化
- reactive 默认深度监听

```ts
/**
 * source 监听源 多个数据源则是数组
 * cb 回调函数
 * options 配置项
 */
watch(
  source,
  (newValue, oldValue) => {
    console.log("监听到数据变化了");
  },
  {
    immediate: true, // 是否立即执行回调
    deep: true, // 是否深度监听
    flush: "pre", // 默认 组件更新之前调用 sync 同步执行  post 组件更新之后执行
  },
);

// 源码
```

## 11. watchEffect

```ts
// 返回一个函数，调用这个函数就可以停止监听
const stop = watchEffect((oninvalidate) => {
  console.log("监听到数据变化了", name.value); // 再打印这个
  oninvalidate(() => {
    console.log("before"); // 先执行这个（清除副作用）
  });
} {
   flush: "pre", // 默认 默认组件更新之前调用 sync 同步执行  post 组件更新之后执行
   onTrigger(effect) { // 调试
      debugger;
   }
});

const stopWatch = stop(); // 停止监听
```

## 12. 组件 生命周期

- `.vue`结尾的文件都可以是组件
- 组件可以复用 循环

```ts
// 组件生命周期
console.log("setup");
onBeforeMount(() => {
  // 这里读不到dom
  console.log("beforeMount");
});
onMounted(() => {
  // 这里可以读到dom
  console.log("mounted");
});
onBeforeUpdate(() => {
  // 这里可以读到更新前的dom
  console.log("beforeUpdate");
});
onUpdated(() => {
  // 这里可以读到更新后的dom
  console.log("updated");
});
onBeforeUnmount(() => {
  console.log("beforeUnmount");
});
onUnmounted(() => {
  console.log("unmounted");
});

// 其他两个生命周期

// 用于调试
onRenderTracked((e) => {
  console.log("onRenderTracked", e);
});

onRenderTriggered((e) => {
  console.log("onRenderTriggered", e);
});

// 源码
```

## 13. BEM架构 Layout布局

- BEM 命名规则 `el-block__element--modifier`
- sass语法

## 14. 父子组件传参

```ts
// 1. 给子组件传值
// v-bind
// ****父组件
let name = "xxx"
<water :title="name"></water>

// ****子组件 接收父组件传过来的值
// 这种只能用在模板中
defineProps({
   title: {
      type: String,
      default: "默认值"
   }
})

// 若要在代码(js)中使用 需要接收一个返回值
const prop = defineProps({
   title: {
      type: String,
      default: "默认值"
   }
})

console.log(prop.title)

// 若要在ts中使用 使用泛型自变量模式
const props = defineProps<{
   title: string
}>()
// 若要在ts中定义默认值 ts特有的
withDefaults(defineProps<{
   title: string
   arr: number[]
}>(), {
   arr: () => [1, 2, 3]
})

// 2. 给父组件传值
// ****子组件
<button @click="send">给父组件传值</button>
// 需要使用emit
const emit = defineEmits(['on-click'])
const send = () => {
   emit('on-click', '需要传递的参数','可以有多个')
}

// 若使用了ts，还可以这样写
<button @click="send">给父组件传值</button>
const emit = defineEmits<{
   // 可以有多个
  (e: 'on-click', name: string): void,
  (e: 'on-click', name: string): void,
}>()
const send = () => {
   emit('on-click', '需要传递的参数','可以有多个')
}
// ****父组件
<water @on-click="getName"></water>

const getName = (name: string) => {
   console.log(name)
}

// 还可以给父组件暴露方法和属性(element-ui使用较多)
// **子组件**
defineExpose({
   name: 'xxx',
   open: () => {
      console.log('打开')
   }
})

// **父组件**
<Water ref="waterFall"></Water>

// waterFall这个名字要和ref后名字一致
const waterFall = ref<InstanceType<typeof Water>>()
waterFall.value?.open()
waterFall.value?.name
```

## 15. 全局组件 局部组件 递归组件

- 全局组件: 高频出现的业务组件
- 局部组件: 页面拆分为多个模块
- 递归组件: Tree 菜单组件

```ts
// 1. 局部组件
<Catch></Catch>
// 2. 全局组件 全局注册 批量注册则可以使用循环（参考element-ui）
// 在main.ts中引入
app.component('Catch', Catch) // 组件名 组件
// 3. 递归组件
// 首先要确定递归组件的名称
// 方法一：vue3中可以直接将文件名作为递归组件的名称（无需引入）
// 方法二：若想自定义名称，则可以再写一个script标签：
<script lang="ts">
export default {
   name:"xxx"
}
</script>
// 方法三：装插件 unplugin-vue-define-options 然后在vite-config.ts中引入 注册
```

## 16. \*\*动态组件

::: info 可选链操作符 `?.`
如果某个属性可能为 `null` 或 `undefined`，则使用可选链操作符 `?.` 来访问它。如果对不到后面的属性，则返回 `undefined`（隐式转换后即为`false`）。
`），而不是报错。

`a.children?.length?.xxx?.aaa ?? []` ---> `??`: 若左边返回`undefined`或者`null`，则返回右边的数组 只能处理`undefined`或者`null`。（`0`则返回`0`，`false`则返回`false`，和`||`有区别）
:::

> 什么是动态组件?

让多个组件使用同一个挂载点，并动态切换，这就是动态组件。

应用场景：Tab标签页（`v-if` 动态组件 路由）

## 17. 插槽

插槽就是**子组件**中，**提供给父组件使用**的一个占位符，用`<slot></slot>`表示，父组件可以在这个占位符中填充任何模板代码，如HTML组件等，填充的内容会替换子组件的`<slot></slot>`标签。

**注意**：要使用`<template></template>`

### 17.1 匿名插槽

```ts
// 在子组件放置一个插槽
<template>
    <div>
       <slot></slot>
    </div>
</template>
// 父组件使用插槽 在父组件给这个插槽填充内容
<Dialog>
   <template v-slot>
      <div>aaaaa</div>
   </template>
</Dialog>
```

### 17.2 具名插槽

具名插槽就是给插槽取个名字。一个子组件可以放多个插槽，而且可以放在不同的地方，而父组件填充内容时，可以根据这个名字把内容填充到对应插槽中

```ts
// 子组件
<div>
   <slot name="header"></slot> // 具名插槽
   <slot></slot> // 匿名插槽
   <slot name="footer"></slot> // 具名插槽
</div>

// 父组件
<Dialog>
   <template v-slot:header>
      <div>1</div>
   </template>
   <template v-slot>
      <div>2</div>
   </template>
   <template v-slot:footer>
      <div>3</div>
      </template>
</Dialog>
```

### 17.3 作用域插槽

在子组件动态绑定参数 派发给父组件的slot去使用。

```ts
// 子组件
<div>
   <slot name="header"></slot>
   <div>
      <div v-for="item in 100">
            <slot :data="item"></slot>
            // 遍历100个数据得到item，把item传递给slot
      </div>
   </div>
   <slot name="footer"></slot>
</div>

// 父组件
<Dialog>
   <template #header>
         <div>1</div>
   </template>
   <template #default="{ data }">
         <div>{{ data }}</div>
   </template>
   <template #footer>
         <div>3</div>
   </template>
</Dialog>
```

### 17.4 动态插槽

动态插槽就是根据父组件传递的参数，动态的生成插槽。

```ts
<Dialog>
   <template #[name]>
         <div>
            23
         </div>
   </template>
</Dialog>

// 插槽会去匹配对应的位置
const name = ref('header') // 'header' 'default' 'footer'
```

## 18. 异步组件 代码分包 suspense组件

在 Vue 3 里，异步组件就是把组件的加载变成“按需加载”，只有真正渲染到的时候才去请求对应的组件代码。常用于：

- 路由页面懒加载
- 大型业务组件延迟加载
- 配合 Suspense 做 loading 状态
- 优化首屏性能
- element-ui 的骨架屏

### 顶层`await`

代码分包。`<script setup>` 中可以使用顶层 `await`。结果代码会被编译成 `async setup()`

```ts
// 在setup语法糖里面 使用方法
<script setup>
const post = await fetch(`/api/post/1`).then(r => r.json())
</script>

// 父组件引用子组件 通过defineAsyncComponent加载异步配合import 函数模式便可以分包
<script setup lang="ts">
import { reactive, ref, markRaw, toRaw, defineAsyncComponent } from 'vue'

// 1. import函数模式
const Dialog = defineAsyncComponent(() => import('../../components/Dialog/index.vue'))


// 2. 完整写法 用的较少
const AsyncComp = defineAsyncComponent({
  // 加载函数
  loader: () => import('./Foo.vue'),

  // 加载异步组件时使用的组件
  loadingComponent: LoadingComponent,
  // 展示加载组件前的延迟时间，默认为 200ms
  delay: 200,

  // 加载失败后展示的组件
  errorComponent: ErrorComponent,
  // 如果提供了一个 timeout 时间限制，并超时了
  // 也会显示这里配置的报错组件，默认值是：Infinity
  timeout: 3000
})
```

### suspense

`<suspense>` 组件有两个插槽。它们都只接收一个直接子节点。`default` 插槽里的节点会尽可能展示出来。如果不能，则展示 `fallback` 插槽里的节点。

```ts
<Suspense>
   <template #default>
         <Dialog>
            <template #default>
               <div>我在哪儿</div>
            </template>
         </Dialog>
   </template>

   <template #fallback>
         <div>loading...</div>
   </template>
</Suspense>
```

## 19. Teleport

Teleport 是一种能够将我们的模板渲染至指定DOM节点，不受父级`style`、`v-show`等属性影响，但`data`、`prop`数据依旧能够共用的技术；

主要解决的问题：Teleport节点挂载在其他指定的DOM节点下，完全不受父级`style`样式影响。

使用方法：通过to 属性 插入指定元素位置 to="body" 便可以将Teleport 内容传送到指定位置

```ts
<Teleport to="body">
    <Loading></Loading>
</Teleport>
```

动态控制`teleport`：使用`disabled`设置为`true`则 to属性不生效`false`则生效

```ts
<teleport :disabled="true" to='body'>
   <A></A>
</teleport>
```

源码：

```ts
// 源码解析
```

## 20. keep-alive

当我们不希望组件被重新渲染影响使用体验，或者出于性能考虑，希望组件可以缓存下来，维持当前的状态，避免多次重复渲染降低性能。这时候就需要用到`keep-alive`组件。

- 直接使用`keep-alive`包裹，就可以实现全部缓存
- `keep-alive`只能有一个子组件

```ts
// 缓存
<keep-alive>
<A></A>
<B></B>
</keep-alive>

// 只缓存A组件
<keep-alive :include="['A']">
<A></A>
<B></B>
</keep-alive>

// 不缓存A组件
<keep-alive :exclude="['A']">
<A></A>
<B></B>
</keep-alive>

// 缓存组件数量
<keep-alive :max="2">
<A></A>
<B></B>
</keep-alive>
```

使用`keep-alive`后，会新增两个生命周期函数`onActivated`和`onDeactivated`。

## 21. transition

`transition` 组件用于过渡效果。自定义`transition`过度效果，你需要对`transition`组件的`name`属性自定义。并在css中写入对应的样式。

- 过渡的类名
- 自定义过渡 class 类名
- transition 生命周期8个
- appear

相关网站

- [animate.css](https://animate.style/)
- [GSAP](https://greensock.com/)

`appear`: 通过这个属性可以设置初始节点过度 就是页面加载完成就开始动画 对应三个状态

## 22. transition-group

`transition-group` 组件用于列表过渡效果。

- 过渡列表
- 列表的移动过渡
- 状态过渡

## 23. 依赖注入 Provide/Inject

当我们需要从父组件向子组件传递数据时，我们使用 props。想象一下这样的结构：有一些深度嵌套的组件，而深层的子组件只需要父组件的部分内容。在这种情况下，如果仍然将 prop 沿着组件链逐级传递下去，可能会很麻烦。

`provide`可以在祖先组件中指定我们想要提供给后代组件的数据或方法，而在任何后代组件中，我们都可以使用`inject`来接收 `provide`提供的数据或方法。

![Provide/Inject](/assert/vue3-review/image.png)

```ts
// 父组件传递数据
<template>
    <div class="App">
        <button>我是App</button>
        <A></A>
    </div>
</template>

<script setup lang='ts'>
import { provide, ref } from 'vue'
import A from './components/A.vue'
let flag = ref<number>(1)
provide('flag', flag)
</script>

<style>
.App {
    background: blue;
    color: #fff;
}
</style>

// 子组件接收数据
<template>
    <div style="background-color: green;">
        我是B
        <button @click="change">change falg</button>
        <div>{{ flag }}</div>
    </div>
</template>

<script setup lang='ts'>
import { inject, Ref, ref } from 'vue'

const flag = inject<Ref<number>>('flag', ref(1))
const change = () => {
    flag.value = 2
}
</script>

<style>
</style>
```

## 24. 兄弟组件传参 Bus Mitt

### 借助父组件传参

A组件派发事件，通过App.vue接受A组件派发的事件，然后在Props传给B组件。

### Event Bus

发布订阅模式

```ts
type BusClass<T> = {
  emit: (name: T) => void;
  on: (name: T, callback: Function) => void;
};
type BusParams = string | number | symbol;
type List = {
  [key: BusParams]: Array<Function>;
};
class Bus<T extends BusParams> implements BusClass<T> {
  list: List;
  constructor() {
    this.list = {};
  }
  emit(name: T, ...args: Array<any>) {
    let eventName: Array<Function> = this.list[name];
    eventName.forEach((ev) => {
      ev.apply(this, args);
    });
  }
  on(name: T, callback: Function) {
    let fn: Array<Function> = this.list[name] || [];
    fn.push(callback);
    this.list[name] = fn;
  }
}

export default new Bus<number>();
```

### \*\*Mitt

就是发布订阅模式的设计

1. 安装: `npm i mitt -S`
2. 使用:

```ts
// main.ts
import mitt from "mitt";

const emitter = mitt();

declare module "vue" {
  export interface ComponentCustomProperties {
    $Bus: typeof emitter;
  }
}

app.config.globalProperties.$Bus = emitter;
```

## 25. tsx

另一种风格

1. 安装插件: `npm i @vitejs/plugin-vue-jsx -D`
2. 配置文件:

```ts
// vite.config.ts
import vueJsx from "@vitejs/plugin-vue-jsx";
export default () => {
  return defineConfig({
    plugins: [vueJsx()],
  });
};
```

3. 使用:

```tsx
// 1. 直接返回一个渲染函数
export default function () {
  return <div>Hello world</div>;
}

// 2. 使用 optionsApi(使用较少)
import { defineComponent } from "vue";
export default defineComponent({
  data() {
    return { name: "hello" };
  },
  render() {
    return <div>{this.name}</div>;
  },
});

// 3. setup函数模式
import { defineComponent } from "vue";
export default defineComponent(
   setup() {
      return () => <div>Hello world</div>;
   }
);

// 示例
// v-show支持
// v-if不支持 js三元表达式代替
// v-for不支持 js数组循环 map
// v-bind 用{}代替
//props emit
// 插槽

// ref在template会自动解包.value 在tsx并不会
import { defineComponent } from "vue";
export default defineComponent(
   setup() {
      const flag = ref(false);
      return () => <div v-show={flag}>Hello world</div>;
   }
);

// props接受值
import { ref } from 'vue'

type Props = {
    title:string
}

const renderDom = (props:Props) => {
    return (
        <>
            <div>{props.title}</div>
            <button onClick={clickTap}>点击</button>
        </>
    )
}

const clickTap = () => {
    console.log('click');
}

export default renderDom

// Emit派发
type Props = {
    title: string
}

const renderDom = (props: Props,content:any) => {
    return (
        <>
            <div>{props.title}</div>
            <button onClick={clickTap.bind(this,content)}>点击</button>
        </>
    )
}

const clickTap = (ctx:any) => {

    ctx.emit('on-click',1)
}
```

### bable

1. 编译
2. 转换
3. 生成

## 26. \*\*v-model深入

- 数据绑定
- 监听更新
- 自动同步值

有两个地方会用到 `v-model`：

- 原生表单 `<input>`、`<checkbox>`、`<select>`、`radio`
- 在组件上使用：父子组件双向通信的语法糖 **v-model 在组件上 = props 向下传值 + emit 向上通知**

| 用法                     | 适用场景                         |
| ------------------------ | -------------------------------- |
| `v-model="val"`          | 单值双向绑定，如输入框封装       |
| `v-model:xxx="val"`      | 多字段双向绑定，如复杂表单       |
| `v-model.modifier="val"` | 需要对值做统一处理时             |
| 多个 `v-model` 组合      | 弹窗、筛选器、表单组件等复杂场景 |

```vue
<template>
  <input v-model="message" />
  <p>{{ message }}</p>
</template>

<script setup>
import { ref } from "vue";

const message = ref("");
</script>
<!-- 等价于 -->
<input :value="message" @input="message = $event.target.value" />
```

- `:value="message"` 负责把数据传给输入框
- `@input="..."` 负责用户输入后更新数据

## 27. 自定义指令

### 生命周期

- `create`
- `beforeMount`
- `mounted`
- `beforeUpdate`
- `updated`
- `beforeUnmount`
- `unmounted`

### 指令简写

```vue
<!-- 按钮鉴权示例 -->
<template>
  <div class="btns">
    <button v-has-show="'shop:create'">创建</button>

    <button v-has-show="'shop:edit'">编辑</button>

    <button v-has-show="'shop:delete'">删除</button>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import type { Directive } from "vue";
//permission
localStorage.setItem("userId", "xiaoman-zs");

//mock后台返回的数据
const permission = [
  "xiaoman-zs:shop:edit",
  "xiaoman-zs:shop:create",
  "xiaoman-zs:shop:delete",
];
const userId = localStorage.getItem("userId") as string;
const vHasShow: Directive<HTMLElement, string> = (el, bingding) => {
  if (!permission.includes(userId + ":" + bingding.value)) {
    el.style.display = "none";
  }
};
</script>

<style scoped lang="less">
.btns {
  button {
    margin: 10px;
  }
}
</style>

<!-- 自定义拖拽指令 -->
<template>
  <div v-move class="box">
    <div class="header"></div>
    <div>内容</div>
  </div>
</template>

<script setup lang="ts">
import { Directive } from "vue";
const vMove: Directive = {
  mounted(el: HTMLElement) {
    let moveEl = el.firstElementChild as HTMLElement;
    const mouseDown = (e: MouseEvent) => {
      //鼠标点击物体那一刻相对于物体左侧边框的距离=点击时的位置相对于浏览器最左边的距离-物体左边框相对于浏览器最左边的距离
      console.log(e.clientX, e.clientY, "-----起始", el.offsetLeft);
      let X = e.clientX - el.offsetLeft;
      let Y = e.clientY - el.offsetTop;
      const move = (e: MouseEvent) => {
        el.style.left = e.clientX - X + "px";
        el.style.top = e.clientY - Y + "px";
        console.log(e.clientX, e.clientY, "---改变");
      };
      document.addEventListener("mousemove", move);
      document.addEventListener("mouseup", () => {
        document.removeEventListener("mousemove", move);
      });
    };
    moveEl.addEventListener("mousedown", mouseDown);
  },
};
</script>

<style lang="less">
.box {
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 200px;
  height: 200px;
  border: 1px solid #ccc;
  .header {
    height: 20px;
    background: black;
    cursor: move;
  }
}
</style>
```

### 图片懒加载

```vue
<template>
  <div>
    <div v-for="item in arr">
      <img height="500" :data-index="item" v-lazy="item" width="360" alt="" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import type { Directive } from "vue";
const images: Record<string, { default: string }> = import.meta.globEager(
  "./assets/images/*.*",
); // vite提供的引用全部图片的方法
// glob 是懒惰加载
// globEager 是静态加载

let arr = Object.values(images).map((v) => v.default);

let vLazy: Directive<HTMLImageElement, string> = async (el, binding) => {
  let url = await import("./assets/vue.svg");
  el.src = url.default;

  // 监听图片是否进入可视区域
  let observer = new IntersectionObserver((entries) => {
    console.log(entries[0], el);
    if (entries[0].intersectionRatio > 0 && entries[0].isIntersecting) {
      setTimeout(() => {
        el.src = binding.value;
        observer.unobserve(el);
      }, 2000);
    }
  });
  observer.observe(el);
};
</script>

<style scoped lang="less"></style>
```

## 28. 自定义Hooks

[Get Started | VueUse](https://vueuse.org/)

主要用来处理复用代码逻辑的一些封装

```ts
// 案例：图片转base64
import { onMounted } from "vue";

type Options = {
  el: string;
};

type Return = {
  Baseurl: string | null;
};
export default function (option: Options): Promise<Return> {
  return new Promise((resolve) => {
    onMounted(() => {
      const file: HTMLImageElement = document.querySelector(
        option.el,
      ) as HTMLImageElement;
      file.onload = (): void => {
        resolve({
          Baseurl: toBase64(file),
        });
      };
    });

    const toBase64 = (el: HTMLImageElement): string => {
      const canvas: HTMLCanvasElement = document.createElement("canvas");
      const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
      canvas.width = el.width;
      canvas.height = el.height;
      ctx.drawImage(el, 0, 0, canvas.width, canvas.height);
      console.log(el.width);

      return canvas.toDataURL("image/png");
    };
  });
}

// 案例：自定义指令 + hooks，实现一个监听元素变化的hook

// 主要会用到一个新的API resizeObserver 兼容性一般 可以做polyfill 但是他可以监听元素的变化 执行回调函数 返回 contentRect 里面有变化之后的宽高。

// 1. 实现这个功能
// 2.用vite打包成库
// 3. 发布npm

import { App, defineComponent, onMounted } from "vue";

function useResize(
  el: HTMLElement,
  callback: (cr: DOMRectReadOnly, resize: ResizeObserver) => void,
) {
  let resize: ResizeObserver;
  resize = new ResizeObserver((entries) => {
    for (let entry of entries) {
      const cr = entry.contentRect;
      callback(cr, resize);
    }
  });
  resize.observe(el);
}

const install = (app: App) => {
  app.directive("resize", {
    mounted(el, binding) {
      useResize(el, binding.value);
    },
  });
};

useResize.install = install;

export default useResize;
```

```ts
// vite.config.ts
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
      entry: "src/index.ts",
      name: "useResize",
    },
    rollupOptions: {
      // 确保外部化处理那些你不想打包进库的依赖
      external: ["vue"],
      output: {
        // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
        globals: {
          useResize: "useResize",
        },
      },
    },
  },
});
```

```ts
// index.d.ts
declare const useResize: {
  (el: HTMLElement, callback: Function): void;
  install: (app: App) => void;
};

export default useResize;
```

## 29. 全局函数和全局变量

```ts
// main.ts
import { createApp } from "vue";
import App from "./App.vue";
export const app = createApp(App);
app.config.globalProperties.$env = "dev"; // 全局变量
// 全局函数
app.config.globalProperties.$filters = {
  format<T>(str: T) {
    return str + "格式化";
  },
};
app.mount("#app");
```

如果要解决报错：

```ts
// main.ts
type Filters = {
  format<T>(str: T): string;
};

declare module "vue" {
  export interface ComponentCustomProperties {
    $filters: Filters;
    $env: string;
  }
}
```

## 30. 编写vue3插件

插件支持两种形式：

1. 函数插件
2. 对象插件

```ts
// Loading.Vue
<template>
    <div v-if="isShow" class="loading">
        <div class="loading-content">Loading...</div>
    </div>
</template>

<script setup lang='ts'>
import { ref } from 'vue';
const isShow = ref(false)//定位loading 的开关

const show = () => {
    isShow.value = true
}
const hide = () => {
    isShow.value = false
}
//对外暴露 当前组件的属性和方法
defineExpose({
    isShow,
    show,
    hide
})
</script>



<style scoped lang="less">
.loading {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    justify-content: center;
    align-items: center;
    &-content {
        font-size: 30px;
        color: #fff;
    }
}
</style>


// Loading.ts
import { createVNode, render, VNode, App } from "vue";
import Loading from "./index.vue";

export default {
  // 规定 需要有个install 方法
  install(app: App) {
    //createVNode vue提供的底层方法 可以给我们组件创建一个虚拟DOM 也就是Vnode
    const vnode: VNode = createVNode(Loading);
    //render 把我们的Vnode 生成真实DOM 并且挂载到指定节点
    render(vnode, document.body);
    // Vue 提供的全局配置 可以自定义
    app.config.globalProperties.$loading = {
      show: () => vnode.component?.exposed?.show(),
      hide: () => vnode.component?.exposed?.hide(),
    };
  },
};


// main.ts
import Loading from './components/loading'


let app = createApp(App)

app.use(Loading)


type Lod = {
    show: () => void,
    hide: () => void
}
//编写ts loading 声明文件放置报错 和 智能提示
declare module '@vue/runtime-core' {
    export interface ComponentCustomProperties {
        $loading: Lod
    }
}

app.mount('#app')
```

## 31. 组件库

1. [一个 Vue 3 UI 框架 | Element Plus](https://element-plus.org/zh-CN/) 首选setup语法糖
2. [Ant Design Vue](https://antdv.com/components/overview-cn) setup函数
3. [View Design](https://iviewui.com/) optionApi模式 JS
4. [Vant](https://vant-ui.github.io/vant/#/zh-CN) 移动端

```ts
// element-plus有volar插件支持
{
  "compilerOptions": {
    // ...
    "types": ["element-plus/global"]
  }
}
```

## 32. 详解scoped 样式穿透

主要是用于修改很多vue常用的组件库(elmnent, vant，Ant Desigin)，虽然配好了样式但是还是需要更改其他的样式
就需要用到样式穿透。

### scoped

1. 给HTML的DOM节点加一个不重复data属性(形如：`data-v-123`)来表示他的唯一性
2. 在每句css选择器的末尾（编译后的生成的css语句）加一个当前组件的data属性选择器（如`[data-v-123]`）来私有化样式
3. 如果组件内部包含有其他组件，只会给其他组件的最外层标签加上当前组件的data属性

### 样式穿透

`:deep()`：它的作用就是用来改变属性选择器的位置

## 33. css style 完整新特性（Vue 3.2）

### 插槽选择器

默认情况下，作用域样式不会影响到`<slot/>`渲染出来的内容，因为它们被认为是父组件所持有并传递进来的。

```css
<style scoped>
 :slotted(.a) {
    color:red
}
</style>
```

### 全局选择器

```css
/* 通常都是新建一个style 标签 不加scoped */
<style>
 div{
     color:red
 }
</style>

<style lang="less" scoped>

</style>

/* 效果等同于上面  */
<style lang="less" scoped>
:global(div){
    color:red
}
</style>
```

### 动态 CSS

```vue
<template>
  <div class="div">aaa</div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
const red = ref<string>("red");
</script>

<style lang="less" scoped>
.div {
  color: v-bind(red);
}
</style>

<!-- 对象形式 -->
<template>
  <div class="div">aaa</div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
const red = ref({
  // 对象
  color: "pink",
});
</script>

<style lang="less" scoped>
.div {
  // 这里写法有区别
  color: v-bind("red.color");
}
</style>
```

### CSS module

```vue
<template>
  <div :class="$style.red">aaaa</div>
</template>

<style module>
.red {
  color: red;
  font-size: 20px;
}
</style>
```

### 34. \*\*vue3集成Tailwindcss

使用方法：

1. 安装VSCode Tailwindcss插件：Tailwind CSS IntelliSense
2. 安装tailwindcss的vite插件: `npm install tailwindcss @tailwindcss/vite`
3. 配置 Vite 插件

```ts
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [tailwindcss()],
});
```

4. 导入 Tailwind CSS：在你的 CSS 文件中添加一个`@import`导入 Tailwind CSS 的语句。`@import "tailwindcss";`

5. 使用 Prettier 进行班级排序

## 35. nextTick EventLoop

### EventLoop

1. 宏任务
   script(整体代码)、setTimeout、setInterval、UI交互事件、postMessage、Ajax
2. 微任务
   Promise.then catch finally、MutaionObserver、process.nextTick(Node.js 环境)
   ![alt text](/assert/vue3-review/rule.png)

```vue
<!-- 输出结果是什么？ -->
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
Prom(); // 执行函数
console.log(0);
// 输出结果 Y 0 5 6 7 8 X 1 2 3 4
</script>
<style scoped></style>
```

### nextTick

vue更新DOM是异步的，而数据更新是同步的。nextTick()方法可以确保回调在DOM更新之后执行。当我们操作DOM的时候发现数据读取的是上次的,就需要使用`nextIick`

nextTIck的原理就是把我们的代码放到一个promise去执行。

```vue
<template>
  <div ref="xiaoman">
    {{ text }}
  </div>
  <button @click="change">change div</button>
</template>

<script setup lang="ts">
import { ref, nextTick } from "vue";

const text = ref("111111");
const xiaoman = ref<HTMLElement>();

const change = async () => {
  text.value = "222222";
  console.log(xiaoman.value?.innerText); // 111111
  await nextTick();
  console.log(xiaoman.value?.innerText); // 222222
};
</script>

<style scoped></style>
```

> 如何理解tick呢？

例如我们显示器是60FPS，那浏览器绘制一帧就是1000 / 60 ≈ 16.6ms。那浏览器这一帧率做了什么？

1. 处理用户的事件，就是event 例如 click input change 等。
2. 执行定时器任务
3. 执行`requestAnimationFrame`
4. 执行dom 的回流与重绘
5. 计算更新图层的绘制指令
6. 绘制指令合并主线程 如果有空余时间会执行`requestidlecallback`

## 36. vue3开发移动端

### Android IOS

[ionic framework](https://ionicframework.com/)

### H5

1. 在开发移动端的时候需要适配各种机型，我们需要一套代码，在不同的分辨率适应各种机型。因此我们需要设置meta标签

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
```

2. 圣杯布局：在CSS中，圣杯布局是指两边盒子宽度固定，中间盒子自适应的三栏布局，其中，中间栏放到文档流前面，保证先行渲染；

- `vw vh`：`vw`和`vh`是视口宽度和视口高度的百分比单位，`vw`表示视口宽度的百分比，`vh`表示视口高度的百分比。相对于视口
- 百分比：相对于父元素宽度的百分比，百分比单位是`%`。
- PostCSS：PostCSS 的主要作用是转换 CSS 代码，就是CSS界的Babel

[Vite的PostCSS](https://cn.vitejs.dev/config/shared-options.html#css-postcss)

```ts
// 编写的px转vw插件
import type { Options } from "./type";
import type { Plugin } from "postcss";
const defaultOptions = {
  viewPortWidth: 375,
  mediaQuery: false,
  unitToConvert: "px",
};
export const pxToViewport = (options: Options = defaultOptions): Plugin => {
  const opt = Object.assign({}, defaultOptions, options);
  return {
    postcssPlugin: "postcss-px-to-viewport",
    //css节点都会经过这个钩子
    Declaration(node) {
      const value = node.value;
      //匹配到px 转换成vw
      if (value.includes(opt.unitToConvert)) {
        const num = parseFloat(value);
        const transformValue = (num / opt.viewPortWidth) * 100;
        node.value = `${transformValue.toFixed(2)}vw`; //转换之后的值
      }
    },
  };
};
```

## 37. unocss原子化

[unocss官网](https://unocss.dev/)

> UnoCSS 和 Tailwind CSS 的主要区别

Tailwind CSS is a PostCSS plugin, while UnoCSS is an isomorphic engine with a collection of first-class integrations with build tools (including a PostCSS plugin). This means UnoCSS can be much more flexible to be used in different places (for example, CDN Runtime, which generates CSS on the fly) and have deep integrations with build tools to provide better HMR, performance, and developer experience (for example, the Inspector).

Technical trade-offs aside, UnoCSS is also designed to be fully extensible and customizable, while Tailwind CSS is more opinionated. Building a custom design system (or design tokens) on top of Tailwind CSS can be hard, and you can't really move away from the Tailwind CSS's conventions. With UnoCSS, you can build pretty much anything you want with full control. For example, we implemented the whole Tailwind CSS compatible utilities within a single preset, and there are a lot of awesome community presets implemented with other interesting philosophies.

> 什么是css原子化？

Atomic CSS is the approach to CSS architecture that favors small, single-purpose classes with names based on visual function.

原子化 CSS 是一种 CSS 的架构方式，它倾向于小巧且用途单一的 class，并且会以视觉效果进行命名。

> CSS原子化的优缺点

1. 减少了css体积，提高了css复用
2. 减少起名的复杂度
3. 增加了记忆成本

使用方法：

1. 安装unocss：`npm install -D unocss`
2. 安装插件：

```ts
// vite.config.ts
import UnoCSS from "unocss/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [UnoCSS()],
});
```

3. 创建`uno.config.ts`文件：

```ts
import { defineConfig } from "unocss";

export default defineConfig({
  // ...UnoCSS options
});
```

4. 添加`virtual:uno.css`到您的主条目：

```ts
// main.ts
import "virtual:uno.css";
```

## 38. 函数式编程 h函数 <Badge type="danger" text="了解" />

vue的编程风格：

1. `template`模板
2. `JSX`编写风格
3. 函数式编程 h函数

h函数源码的主要实现为：`createVNode`，h函数的优势是跳过了模板的编译：parser --> ast --> transform --> js api --> render。缺点就是学习成本高，vue3使用h函数很少。

## 39. vue3 vite Electron 开发桌面程序

- [Electron](https://www.electronjs.org/zh/)
- [electron-vite](https://cn.electron-vite.org/)

## 40. vue3.3 编译宏

1. `defineProps` 父子组件传参

```vue
// 父组件
<template>
  <div>
    <Child name="xiaoman"></Child>
  </div>
</template>
<script lang="ts" setup>
import Child from "./views/child.vue";
</script>
<style></style>

<!-- 子组件使用defineProps接受值 -->
<template>
  <div>
    {{ name }}
  </div>
</template>
<script lang="ts" setup>
defineProps({
  name: String,
});
</script>

<!-- 使用TS字面量模式 -->
<template>
  <div>
    {{ name }}
  </div>
</template>
<script lang="ts" setup>
defineProps<{
  name: string;
}>();
</script>

<!-- Vue3.3 新增 defineProps 可以接受泛型 -->
<Child :name="['xiaoman']"></Child>
<!-- //-------------子组件----------------- -->
<template>
  <div>
    {{ name }}
  </div>
</template>
<script generic="T" lang="ts" setup>
defineProps<{
  name: T[];
}>();
</script>
```

- `defineEmits` 子组件触发事件

```vue
<!-- 父组件 -->
<template>
  <div>
    <Child @send="getName"></Child>
  </div>
</template>
<script lang="ts" setup>
import Child from "./views/child.vue";
const getName = (name: string) => {
  console.log(name);
};
</script>
<style></style>

<!-- 子组件常规方式派发Emit -->
<template>
  <div>
    <button @click="send">派发事件</button>
  </div>
</template>
<script lang="ts" setup>
const emit = defineEmits(["send"]);
const send = () => {
  // 通过派发事件，将数据传递给父组件
  emit("send", "我是子组件的数据");
};
</script>

<!-- 子组件TS字面量模式派发 -->
<template>
  <div>
    <button @click="send">派发事件</button>
  </div>
</template>
<script lang="ts" setup>
const emit = defineEmits<{
  (event: "send", name: string): void;
}>();
const send = () => {
  // 通过派发事件，将数据传递给父组件
  emit("send", "我是子组件的数据");
};
</script>
<!-- Vue3.3 新写法更简短 -->
<template>
  <div>
    <button @click="send">派发事件</button>
  </div>
</template>
<script lang="ts" setup>
const emit = defineEmits<{
  send: [name: string];
}>();
const send = () => {
  // 通过派发事件，将数据传递给父组件
  emit("send", "我是子组件的数据");
};
</script>
```

- `defineOptions` 主要是用来定义 Options API 的选项，常用的就是定义name在seutp语法糖模式发现name不好定义了需要在开启一个script自定义name现在有了defineOptions就可以随意定义name了。 vue3.3内置

```ts
defineOptions({ name: "Child", inheritAttrs: false });
```

- `defineSlots` 子组件 defineSlots只做声明不做实现 同时约束slot类 型

- `defineModel` vue3.5已经正式启用，用法就是v-model直接绑定变量到组件上，不用处理事件和数据了。

## 41. 环境变量

主要作用就是让开发者区分不同的运行环境，来实现兼容开发和生产环境。
Vite 在一个特殊的`import.meta.env`对象上暴露环境变量。这里有一些在所有情况下都可以使用的内建变量。需要注意的一点就是，这个环境变量不能使用动态赋值`import.meta.env[key]`。因为这些环境变量在打包的时候是会被硬编码的通过`JSON.stringify`注入浏览器。

```json
{
"BASE_URL":"/", //部署时的URL前缀
"MODE":"development", //运行模式
"DEV":true,"  //是否在dev环境
PROD":false, //是否是build 环境
"SSR":false //是否是SSR 服务端渲染模式
}
```

> 如何自定义环境变量？

- 在根目录下创建`.env`文件，里面可以定义环境变量

## 42. webpack构建Vue3项目

略

## 43. vue3性能优化

- `FCP (First Contentful Paint)`：首次内容绘制的时间，浏览器第一次绘制DOM相关的内容，也是用户第一次看到页面内容的时间。
- `Speed Index`: 页面各个可见部分的显示平均时间，当我们的页面上存在轮播图或者需要从后端获取内容加载时，这个数据会被影响到。
- `LCP (Largest Contentful Paint)`：最大内容绘制时间，页面最大的元素绘制完成的时间。
- `TTI(Time to Interactive)`：从页面开始渲染到用户可以与页面进行交互的时间，内容必须渲染完毕，交互元素绑定的事件已经注册完成。
- `TBT(Total Blocking Time)`：记录了首次内容绘制到用户可交互之间的时间，这段时间内，主进程被阻塞，会阻碍用户的交互，页面点击无反应。
- `CLS(Cumulative Layout Shift)`：计算布局偏移值得分，会比较两次渲染帧的内容偏移情况，可能导致用户想点击A按钮，但下一帧中，A按钮被挤到旁边，导致用户实际点击了B按钮。

### 代码分析

由于我们使用的是vite vite打包是基于rollup的我们可以使用 rollup的插件。安装：`npm install rollup-plugin-visualizer`

```ts
// vite.config.ts
import { visualizer } from 'rollup-plugin-visualizer';
plugins: [vue(), vueJsx(),visualizer({
      open:true
 })],
```

然后进行`npm run build`打包。

### Vite 配置优化

```ts
// vite.config.ts
build:{
  chunkSizeWarningLimit:2000,
  cssCodeSplit:true, //css 拆分
  sourcemap:false, //不生成sourcemap
  minify:false, //是否禁用最小化混淆，esbuild打包速度最快，terser打包体积最小。
  assetsInlineLimit:5000 //小于该值 图片将打包成Base64
},
```

### PWA离线存储技术

安装：`npm install vite-plugin-pwa -D`

```ts
// vite.config.ts
import { VitePWA } from 'vite-plugin-pwa'
plugins: [vue(),VitePWA(), vueJsx(),visualizer({
      open:true
})],
```

PWA 技术的出现就是让web网页无限接近于Native 应用

1. 可以添加到主屏幕，利用manifest实现
2. 可以实现离线缓存，利用service worker实现
3. 可以发送通知，利用service worker实现

```ts
// 配置示例
VitePWA({
  workbox: {
    cacheId: "aaa", //缓存名称
    runtimeCaching: [
      {
        urlPattern: /.*\.js.*/, //缓存文件
        handler: "StaleWhileRevalidate", //重新验证时失效
        options: {
          cacheName: "aaa-js", //缓存js，名称
          expiration: {
            maxEntries: 30, //缓存文件数量 LRU算法
            maxAgeSeconds: 30 * 24 * 60 * 60, //缓存有效期
          },
        },
      },
    ],
  },
});
```

### 其他性能优化

- 图片懒加载

```vue
import lazyPlugin from 'vue3-lazy'

<img v-lazy="user.avatar" />
```

- 虚拟列表
- 多线程 使用`new Worker`创建。worker脚本与主进程的脚本必须遵守同源限制，所在的路径协议、域名、端口号三者需要相同。
- VueUse 库已经集成了 webWorker
- 防抖节流

## 44. Vue3 Web Components

> 什么是 Web Components

`Web Components`提供了基于原生支持的、对视图层的封装能力，可以让单个组件相关的javaScript、css、html模板运行在以html标签为界限的局部环境中，不会影响到全局，组件间也不会相互影响。再简单来说：就是提供了我们自定义标签的能力，并且提供了标签内完整的生命周期。

```js
class Btn extends HTMLElement {
  constructor() {
    //调用super 来建立正确的原型链继承关系
    super();
    const p = this.h("p");
    p.innerText = "测试";
    p.setAttribute(
      "style",
      "height:200px;width:200px;border:1px solid #ccc;background:yellow",
    );
    //表示 shadow DOM 子树的根节点
    const shaDow = this.attachShadow({ mode: "open" });

    shaDow.appendChild(this.p);
  }

  h(el) {
    return document.createElement(el);
  }

  /**
   * 生命周期
   */
  //当自定义元素第一次被连接到文档 DOM 时被调用。
  connectedCallback() {
    console.log("111");
  }

  //当自定义元素与文档 DOM 断开连接时被调用。
  disconnectedCallback() {
    console.log("222");
  }

  //当自定义元素被移动到新文档时被调用
  adoptedCallback() {
    console.log("333");
  }
  //当自定义元素的一个属性被增加、移除或更改时被调用
  attributeChangedCallback() {
    console.log("444");
  }
}

window.customElements.define("aaa", Btn);
```

template 模式

```js
class Btn extends HTMLElement {
  constructor() {
    //调用super 来建立正确的原型链继承关系
    super();
    const template = this.h("template");
    template.innerHTML = `
        <div>小满</div>
        <style>
            div{
                height:200px;
                width:200px;
                background:blue;
            }
        </style>
        `;
    //表示 shadow DOM 子树的根节点。
    const shaDow = this.attachShadow({ mode: "open" });

    shaDow.appendChild(template.content.cloneNode(true));
  }

  h(el) {
    return document.createElement(el);
  }

  /**
   * 生命周期
   */
  //当自定义元素第一次被连接到文档 DOM 时被调用。
  connectedCallback() {
    console.log("我已经插入了！！！嗷呜");
  }

  //当自定义元素与文档 DOM 断开连接时被调用。
  disconnectedCallback() {
    console.log("我已经断开了！！！嗷呜");
  }

  //当自定义元素被移动到新文档时被调用
  adoptedCallback() {
    console.log("我被移动了！！！嗷呜");
  }
  //当自定义元素的一个属性被增加、移除或更改时被调用
  attributeChangedCallback() {
    console.log("我被改变了！！！嗷呜");
  }
}

window.customElements.define("xiao-man", Btn);
```

使用方式

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>web Component</title>
    <script src="./btn.js"></script>
  </head>
  <body>
    <xiao-man></xiao-man>
  </body>
</html>
```

### 在vue中使用

```ts
/*vite config ts 配置*/
vue({
  template: {
    compilerOptions: {
      isCustomElement: (tag) => tag.includes("xiaoman-"),
    },
  },
});
```

### 45. Proxy跨域

> 如何解决跨域

1. jsonp 这种方式在之前很常见，他实现的基本原理是利用了HTML里script元素标签没有跨域限制动态创建script标签，将src作为服务器地址，服务器返回一个callback接受返回的参数。

```js
function clickButton() {
  let obj, s;
  obj = { table: "products", limit: 10 }; //添加参数
  s = document.createElement("script"); //动态创建script
  s.src = "接口地址xxxxxxxxxxxx" + JSON.stringify(obj);
  document.body.appendChild(s);
}
//与后端定义callback名称
function myFunc(myObj) {
  //接受后端返回的参数
  document.getElementById("demo").innerHTML = myObj;
}
```

2. cors设置CORS允许跨域资源共享 需要后端设置

```json
//可以指定地址
{
  "Access-Control-Allow-Origin": "http://web.xxx.com"
}

//也可以使用通配符 任何地址都能访问 安全性不高
{
  "Access-Control-Allow-Origin": "*"
}
```

3. 使用Vite proxy或者node代理或者webpack proxy，三种方式都是代理。

```ts
// vite.config.ts
export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:9001/", //跨域地址
        changeOrigin: true, //支持跨域
        rewrite: (path) => path.replace(/^\/api/, ""), //重写路径,替换/api
      },
    },
  },
});
```

# Pinia
