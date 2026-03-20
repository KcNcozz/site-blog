# Vue3复习

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

   ```vue3
   const xxx = ref<string>("aaa")

   const xxx:Ref<string> = ref("aaa")
   ```

2. `isRef`判断是否为Ref对象

3. `shallowRef`浅层响应式 只到`.value` **Ref和shallRef不能一起写，否则会影响shallRef，造成视图更新**

4. `triggerRef`

5. `customRef`自定义Ref 写防抖

   ```vue3
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

## 18. 异步组件 代码分包 suspense

## 19. Teleport
