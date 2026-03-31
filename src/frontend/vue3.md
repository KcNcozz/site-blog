# 1. Vue3 基础概述

官方文档：https://cn.vuejs.org/

1. MVVM架构(Model-View-ViewModel)
2. Composition API (组合式API)

## 1.1 升级点

- 使用`Proxy`代替`defineProperty`实现响应式。
- 重写虚拟`DOM`的实现和`Tree-Shaking`。
- `Vue3`可以更好的支持`TypeScript`。

## 1.2 npm run dev 全过程

找vite文件
node_modules/bin --> npm i -g --> 环境变量 --> 报错

# 2. 创建Vue3工程

## 2.1 基于 vite/vue-cli 创建

1. 使用vite构建：`npm init vite@latest`
2. 使用vue-cli创建：`npm init vue@latest`

```powershell
## 2.具体配置(vite)
## 配置项目名称
√ Project name: vue3_test
## 是否添加TypeScript支持
√ Add TypeScript?  Yes
## 是否添加JSX支持
√ Add JSX Support?  No
## 是否添加路由环境
√ Add Vue Router for Single Page Application development?  No
## 是否添加pinia环境
√ Add Pinia for state management?  No
## 是否添加单元测试
√ Add Vitest for Unit Testing?  No
## 是否添加端到端测试方案
√ Add an End-to-End Testing Solution? » No
## 是否添加ESLint语法检查
√ Add ESLint for code quality?  Yes
## 是否添加Prettiert代码格式化
√ Add Prettier for code formatting?  No
```

自己动手编写一个App组件

```vue
<template>
  <div class="app">
    <h1>你好啊！</h1>
  </div>
</template>

<script lang="ts">
export default {
  name: "App", //组件名
};
</script>

<style>
.app {
  background-color: #ddd;
  box-shadow: 0 0 10px;
  border-radius: 10px;
  padding: 20px;
}
</style>
```

::: danger 总结

- `Vite` 项目中，`index.html` 是项目的入口文件，在项目最外层。
- 加载`index.html`后，`Vite` 解析 `<script type="module" src="xxx">` 指向的`mian.ts`。
- `Vue3`中是通过 `createApp` 函数创建一个应用实例。
  :::

```typescript
import { createApp } from "vue"; // 创建应用

import App from "./App.vue"; // 根组件

createApp(App).mount("#app"); // 把根组件挂载在id为app的容器（容器在index.html）
```

## 2.2 一个简单的效果

vue文件里面的三种标签：

- 模板
- 脚本
- 样式

# 3. Vue3核心语法 模板语法 Vue指令

模板语法：`{{ }}`  
vue指令：`v-`

- `v-text`: 将数据渲染到元素中，和模板语法相同。
- `v-html`: 将数据渲染到元素中，但是数据会被解析成html标签，但是不支持解析组件。
- `v-if`: 条件渲染，如果是true，则渲染元素。如果是false，则不渲染元素。（注释节点）
- `v-else`: 条件渲染，如果前一个条件为false，则渲染元素。
- `v-else-if`: 条件渲染，如果前一个条件为false，则渲染元素。
- `v-show`: 条件渲染，元素会被隐藏，但是元素依然存在。（`display: none;`）
- `v-on`: 监听事件，简写： `@` ，同时支持动态切换事件。 冒泡事件。
- `v-bind`: 将数据绑定到元素中，简写： `:` ，属性名可以省略。`v-bind:class="aaa"` 简写为：`:class="aaa"`
- `v-model`: 双向数据绑定，一般用于绑定表单元素。需要配合`ref`或者`reactive`使用。
- `v-for`: 循环渲染，一般需要`:key`属性。 （写在li上 `v-for="data in list" :key="data .id"`）
- `v-once`: 只渲染一次，并跳过之后的更新
- `v-memo`: 缓存渲染结果，如果数据没有变化，则跳过更新(一般配合`v-for`使用)

## 3.1 OptionsAPI 与 CompositionAPI

- `Options`和`Composition`

<img src="/assert/assets-heima/1696662197101-55d2b251-f6e5-47f4-b3f1-d8531bbf9279.gif" alt="1.gif" style="zoom:70%;border-radius:20px" /><img src="/assert/assets-heima/1696662200734-1bad8249-d7a2-423e-a3c3-ab4c110628be.gif" alt="2.gif" style="zoom:70%;border-radius:20px" />

<img src="/assert/assets-heima/1696662249851-db6403a1-acb5-481a-88e0-e1e34d2ef53a.gif" alt="3.gif" style="height:300px;border-radius:10px"  /> <img src="/assert/assets-heima/1696662256560-7239b9f9-a770-43c1-9386-6cc12ef1e9c0.gif" alt="4.gif" style="height:300px;border-radius:10px"  />

> 说明：以上四张动图原创作者：大帅老猿

## 3.2 setup

### setup 概述

- `setup`函数返回的对象中的内容，可直接在模板中使用。
- `setup`中访问`this`是`undefined`。
- `setup`函数会在`beforeCreate`之前调用，它是“领先”所有钩子执行的。

```vue
<template>
  <div class="person">
    <h2>姓名：{{ name }}</h2>
    <h2>年龄：{{ age }}</h2>
    <button @click="changeName">修改名字</button>
    <button @click="changeAge">年龄+1</button>
    <button @click="showTel">点我查看联系方式</button>
  </div>
</template>

<script lang="ts">
export default {
  name: "Person",
  setup() {
    // 数据，原来写在data中（注意：此时的name、age、tel数据都不是响应式数据）
    let name = "张三";
    let age = 18;
    let tel = "13888888888";

    // 方法，原来写在methods中
    function changeName() {
      name = "zhang-san"; //注意：此时这么修改name页面是不变化的
      console.log(name);
    }
    function changeAge() {
      age += 1; //注意：此时这么修改age页面是不变化的
      console.log(age);
    }
    function showTel() {
      alert(tel);
    }

    // 把数据交出去
    return { name, age, tel, changeName, changeAge, showTel };
  },
};
</script>
```

### setup 的返回值

- 若返回一个**对象**：则对象中的：属性、方法等，在模板中均可以直接使用**（重点关注）。**
- 若返回一个**函数**：则可以自定义渲染内容，代码如下：

```jsx
setup(){
  return ()=> '你好啊！'
}
```

::: info setup 与 Options API 的关系（面试）

- `Vue2` 的配置（`data`、`methos`......）中**可以访问到** `setup`中的属性、方法。
- 但在`setup`中**不能访问到**`Vue2`的配置（`data`、`methos`......）。
- 如果与`Vue2`冲突，则`setup`优先。
  :::

### setup 语法糖

`setup`函数有一个语法糖，这个语法糖，可以让我们把`setup`独立出去，代码如下：

```vue
<template>
  <div class="person">
    <h2>姓名：{{ name }}</h2>
    <h2>年龄：{{ age }}</h2>
    <button @click="changName">修改名字</button>
    <button @click="changAge">年龄+1</button>
    <button @click="showTel">点我查看联系方式</button>
  </div>
</template>

<script lang="ts">
export default {
  name: "Person",
};
</script>

<!-- 下面的写法是setup语法糖 -->
<script setup lang="ts">
console.log(this); //undefined

// 数据（注意：此时的name、age、tel都不是响应式数据）
let name = "张三";
let age = 18;
let tel = "13888888888";

// 方法
function changName() {
  name = "李四"; //注意：此时这么修改name页面是不变化的
}
function changAge() {
  console.log(age);
  age += 1; //注意：此时这么修改age页面是不变化的
}
function showTel() {
  alert(tel);
}
</script>
```

> 这样写如何定义组件名？

vue3.3版本之后自带defineOptions，可以在setup内直接使用defineOptions(){}命名，无需插件

## 3.3 ref 对比 reactive

::: info 宏观方面

> 1. `ref`用来定义：**基本类型数据**、**对象类型数据**（底层仍为`reactive`）；
> 2. `reactive`用来定义：**对象类型数据**。

:::

- 区别：

> 1. `ref`创建的变量必须使用`.value`（可以使用`volar`插件自动添加`.value`）。
>
>    <img src="/assert/assets-heima/自动补充value.png" alt="自动补充value" style="zoom:50%;border-radius:20px" />
>
> 2. `reactive`重新分配一个新对象，会**失去**响应式（可以使用`Object.assign`去整体替换）。

- 使用原则：
  > 1. 若需要一个基本类型的响应式数据，必须使用`ref`。
  > 2. 若需要一个响应式对象，层级不深，`ref`、`reactive`都可以。
  > 3. 若需要一个响应式对象，且层级较深，推荐使用`reactive`。（实际情况都是`ref`）

## 3.4 ref 和 reactive 响应式

::: info ref

- **语法：** `let xxx = ref(初始值)`。
- **返回值：** 一个`RefImpl`的实例对象，简称`ref对象`或`ref`，`ref`对象的`value`**属性是响应式的**。
- **注意点：**
  - `JS`中操作数据需要：`xxx.value`，但模板中不需要`.value`，直接使用即可。
  - 对于`let name = ref('张三')`来说，`name`不是响应式的，`name.value`是响应式的。
- `ref`接收的数据可以是：**基本类型**、**对象类型**。
- 若`ref`接收的是对象类型，内部其实也是调用了`reactive`函数。

:::

```vue
<!-- ref的使用 -->
<template>
  <div class="person">
    <h2>姓名：{{ name }}</h2>
    <h2>年龄：{{ age }}</h2>
    <button @click="changeName">修改名字</button>
    <button @click="changeAge">年龄+1</button>
    <button @click="showTel">点我查看联系方式</button>
  </div>
</template>

<script setup lang="ts" name="Person">
import { ref } from "vue";
// name和age是一个RefImpl的实例对象，简称ref对象，它们的value属性是响应式的。
let name = ref("张三");
let age = ref(18);
// tel就是一个普通的字符串，不是响应式的
let tel = "13888888888";

function changeName() {
  // JS中操作ref对象时候需要.value
  name.value = "李四";
  console.log(name.value);

  // 注意：name不是响应式的，name.value是响应式的，所以如下代码并不会引起页面的更新。
  // name = ref('zhang-san')
}
function changeAge() {
  // JS中操作ref对象时候需要.value
  age.value += 1;
  console.log(age.value);
}
function showTel() {
  alert(tel);
}
</script>
```

```vue
<!-- ref包裹对象 -->
<template>
  <div class="person">
    <h2>汽车信息：一台{{ car.brand }}汽车，价值{{ car.price }}万</h2>
    <h2>游戏列表：</h2>
    <ul>
      <li v-for="g in games" :key="g.id">{{ g.name }}</li>
    </ul>
    <h2>测试：{{ obj.a.b.c.d }}</h2>
    <button @click="changeCarPrice">修改汽车价格</button>
    <button @click="changeFirstGame">修改第一游戏</button>
    <button @click="test">测试</button>
  </div>
</template>

<script lang="ts" setup name="Person">
import { ref } from "vue";

// 数据
let car = ref({ brand: "奔驰", price: 100 });
let games = ref([
  { id: "ahsgdyfa01", name: "英雄联盟" },
  { id: "ahsgdyfa02", name: "王者荣耀" },
  { id: "ahsgdyfa03", name: "原神" },
]);
let obj = ref({
  a: {
    b: {
      c: {
        d: 666,
      },
    },
  },
});

console.log(car);

function changeCarPrice() {
  car.value.price += 10;
}
function changeFirstGame() {
  games.value[0].name = "流星蝴蝶剑";
}
function test() {
  obj.value.a.b.c.d = 999;
}
</script>
```

::: info reactive

- **作用：** 定义一个**响应式对象**（基本类型不要用它，要用`ref`，否则报错）
- **语法：** `let 响应式对象= reactive(源对象)`。
- **返回值：** 一个`Proxy`的实例对象，简称：响应式对象。
- **注意点：** `reactive`定义的响应式数据是“深层次”的。

:::

```vue
<!-- reactive -->
<template>
  <div class="person">
    <h2>汽车信息：一台{{ car.brand }}汽车，价值{{ car.price }}万</h2>
    <h2>游戏列表：</h2>
    <ul>
      <li v-for="g in games" :key="g.id">{{ g.name }}</li>
    </ul>
    <h2>测试：{{ obj.a.b.c.d }}</h2>
    <button @click="changeCarPrice">修改汽车价格</button>
    <button @click="changeFirstGame">修改第一游戏</button>
    <button @click="test">测试</button>
  </div>
</template>

<script lang="ts" setup name="Person">
import { reactive } from "vue";

// 数据
let car = reactive({ brand: "奔驰", price: 100 });
let games = reactive([
  { id: "ahsgdyfa01", name: "英雄联盟" },
  { id: "ahsgdyfa02", name: "王者荣耀" },
  { id: "ahsgdyfa03", name: "原神" },
]);
let obj = reactive({
  a: {
    b: {
      c: {
        d: 666,
      },
    },
  },
});

function changeCarPrice() {
  car.price += 10;
}
function changeFirstGame() {
  games[0].name = "流星蝴蝶剑";
}
function test() {
  obj.a.b.c.d = 999;
}
</script>
```

## 3.5 toRefs 与 toRef

> 结构出来的数据不是响应式的该怎么办？

```vue
<template>
  <div class="person">
    <h2>姓名：{{ person.name }}</h2>
    <h2>年龄：{{ person.age }}</h2>
    <button @click="changeName">修改名字</button>
    <button @click="changeAge">修改年龄</button>
  </div>
</template>

<script lang="ts" setup name="Person">
import { ref, reactive} from "vue";

// 数据
let person = reactive({ name: "张三", age: 18, gender: "男" });

let { name, age } = person; // 此时name gender取出来后不是响应式的了
/*
相当于
let name = person.name;
let age = person.age;
*/

// 方法
function changeName() {
  name.value += "~";
}
function changeAge() {
  age.value += 1;
}
<script lang="ts" setup name="Person">
```

::: info toRef

- 作用：将一个`响应式对象`中的每一个属性，转换为`ref`对象。
- 备注：`toRefs`与`toRef`功能一致，但`toRefs`可以批量转换。

:::

作用示例：

```vue
<template>
  <div class="person">
    <h2>姓名：{{ person.name }}</h2>
    <h2>年龄：{{ person.age }}</h2>
    <h2>性别：{{ person.gender }}</h2>
    <button @click="changeName">修改名字</button>
    <button @click="changeAge">修改年龄</button>
    <button @click="changeGender">修改性别</button>
  </div>
</template>

<script lang="ts" setup name="Person">
import { ref, reactive, toRefs, toRef } from "vue";

// 数据
let person = reactive({ name: "张三", age: 18, gender: "男" });

// 通过toRefs将person对象中的n个属性批量取出，且依然保持响应式的能力
let { name, gender } = toRefs(person);

// 通过toRef将person对象中的gender属性取出，且依然保持响应式的能力
let age = toRef(person, "age");

// 方法
function changeName() {
  name.value += "~";
}
function changeAge() {
  age.value += 1;
}
function changeGender() {
  gender.value = "女";
}
</script>
```

## 3.6 computed 计算属性

::: warning 补充知识

单向绑定(`v-bind`)：只能从数据源到页面，不能从页面到数据源。 `v-model` (双向绑定)

```javascript
// 例1
<h2 a="1+1" :b="1+1" c="x" :d="x">测试</h2>

let x = 9;
console.log(a, b, c, d); // "1+1" 2 "x" 9

// 例2
// 不绑定（没有冒号） 则只是把personList这个字符串赋值给Persons
<Person a="haha" Persons="personList"/> //
//绑定（有冒号） 则是把personList这个列表内容绑定给Persons
<Person a="haha" :Persons="personList"/>

let personList = reactive<Persons>([
  {id: '123123', name: 'zhangsan', age: 18},
  {id: '123345', name: 'lisin', age: 1},
  {id: '123321', name: 'wangwu', age: 20},
])
```

:::

> 需求：给出姓和名，输出全名并且姓和名首字母大写

计算属性作用：根据已有数据计算出新数据（和`Vue2`中的`computed`作用一致）。

<img src="/assert/assets-heima/computed.gif" style="zoom:20%;" />

```vue
<template>
  <div class="person">
    姓：<input type="text" v-model="firstName" /> <br />
    名：<input type="text" v-model="lastName" /> <br />
    <!-- 在此处两者不使用计算属性两者效果一致 -->
    <!-- 全名：<span>{{ firstName }}{{ lastName }}</span> <br /> -->
    全名：<span>{{ fullName }}</span> <br />
    <button @click="changeFullName">全名改为：li-si</button>
  </div>
</template>

<script setup lang="ts" name="App">
import { ref, computed } from "vue";

let firstName = ref("zhang");
let lastName = ref("san");

// 计算属性——只读取，不修改
/* let fullName = computed(()=>{
    return firstName.value + '-' + lastName.value
  }) */

// 计算属性——既读取又修改
let fullName = computed({
  // 读取
  get() {
    return firstName.value + "-" + lastName.value;
  },
  // 修改
  set(val) {
    // 参数为修改的值
    console.log("有人修改了fullName", val);
    firstName.value = val.split("-")[0];
    lastName.value = val.split("-")[1];
  },
});

function changeFullName() {
  fullName.value = "li-si";
}
</script>
```

- 计算属性有缓存
- 方法没有缓存
- 返回值是一个`ComputedRefImpl`

## 3.7 watch 监视

> 需求：当年龄达到一个数值时发出提醒

- 作用：监视数据的变化（和`Vue2`中的`watch`作用一致）
- 特点：`Vue3`中的`watch`只能监视**四种数据**

::: info 四种数据

1. `ref`定义的数据。
2. `reactive`定义的数据。
3. 函数返回一个值（`getter`函数）。
4. 一个包含上述内容的数组。

:::

我们在`Vue3`中使用`watch`的时候，通常会遇到以下几种情况：

### 3.7.1 情况一

监视`ref`定义的**基本类型**数据：直接写数据名即可，监视的是其`value`值的改变。

```vue
<template>
  <div class="person">
    <h1>情况一：监视【ref】定义的【基本类型】数据</h1>
    <h2>当前求和为：{{ sum }}</h2>
    <button @click="changeSum">点我sum+1</button>
  </div>
</template>

<script lang="ts" setup name="Person">
import { ref, watch } from "vue";
// 数据
let sum = ref(0);
// 方法
function changeSum() {
  sum.value += 1;
}
// 监视，情况一：监视【ref】定义的【基本类型】数据
const stopWatch = watch(sum, (newValue, oldValue) => {
  // 不需要.value
  // watch的返回值是一个箭头函数
  console.log("sum变化了", newValue, oldValue);
  if (newValue >= 10) {
    stopWatch();
  }
});
</script>
```

### 3.7.2 情况二

监视`ref`定义的【对象类型】数据：直接写数据名，监视的是对象的【地址值】，若想监视对象内部的数据，要手动开启深度监视。

> 注意：
>
> - 若修改的是`ref`定义的**对象中的属性**，`newValue` 和 `oldValue` 都是新值，因为它们是同一个对象。
> - 若修改**整个**`ref`定义的对象，`newValue` 是新值， `oldValue` 是旧值，因为不是同一个对象了。

其实就是看地址是否发生变化了，地址变化了就不是同一个值

```vue
<template>
  <div class="person">
    <h1>情况二：监视【ref】定义的【对象类型】数据</h1>
    <h2>姓名：{{ person.name }}</h2>
    <h2>年龄：{{ person.age }}</h2>
    <button @click="changeName">修改名字</button>
    <button @click="changeAge">修改年龄</button>
    <button @click="changePerson">修改整个人</button>
  </div>
</template>

<script lang="ts" setup name="Person">
import { ref, watch } from "vue";
// 数据
let person = ref({
  name: "张三",
  age: 18,
});
// 方法
function changeName() {
  person.value.name += "~";
}
function changeAge() {
  person.value.age += 1;
}
function changePerson() {
  person.value = { name: "李四", age: 90 };
}
/* 
    监视，情况一：监视【ref】定义的【对象类型】数据，监视的是对象的地址值，若想监视对象内部属性的变化，需要手动开启深度监视
    watch的第一个参数是：被监视的数据
    watch的第二个参数是：监视的回调
    watch的第三个参数是：配置对象（deep、immediate等等.....） 
  */
watch(
  person,
  (newValue, oldValue) => {
    console.log("person变化了", newValue, oldValue);
  },
  { deep: true },
);
</script>
```

### 3.7.3 情况三

::: danger 注意

Vue3.5+版本，reactive数据的类型，可以精确控制监视层级了，也就是说deep可以是数值类型，默认true，等价于最大嵌套层级数

:::

监视`reactive`定义的【对象类型】数据，且**默认开启了深度监视**。

```vue
<template>
  <div class="person">
    <h1>情况三：监视【reactive】定义的【对象类型】数据</h1>
    <h2>姓名：{{ person.name }}</h2>
    <h2>年龄：{{ person.age }}</h2>
    <button @click="changeName">修改名字</button>
    <button @click="changeAge">修改年龄</button>
    <button @click="changePerson">修改整个人</button>
    <hr />
    <h2>测试：{{ obj.a.b.c }}</h2>
    <button @click="test">修改obj.a.b.c</button>
  </div>
</template>

<script lang="ts" setup name="Person">
import { reactive, watch } from "vue";
// 数据
let person = reactive({
  name: "张三",
  age: 18,
});
let obj = reactive({
  a: {
    b: {
      c: 666,
    },
  },
});
// 方法
function changeName() {
  person.name += "~";
}
function changeAge() {
  person.age += 1;
}
function changePerson() {
  Object.assign(person, { name: "李四", age: 80 });
}
function test() {
  obj.a.b.c = 888;
}

// 监视，情况三：监视【reactive】定义的【对象类型】数据，且默认是开启深度监视的
watch(person, (newValue, oldValue) => {
  console.log("person变化了", newValue, oldValue);
});
watch(obj, (newValue, oldValue) => {
  // 地址没变
  console.log("Obj变化了", newValue, oldValue);
});
</script>
```

### 3.7.4 情况四

监视`ref`或`reactive`定义的【对象类型】数据中的**某个属性**，注意点如下：

1. 若该属性值**不是**【对象类型】，需要写成函数形式。
2. 若该属性值是**依然** 是【对象类型】，可直接编，也可写成函数，建议写成函数。

结论：监视的要是对象里的属性，那么最好写函数式，注意点：若是对象监视的是地址值，需要关注对象内部，需要手动开启深度监视。

```vue{45-47,51,55}
<template>
  <div class="person">
    <h1>情况四：监视【ref】或【reactive】定义的【对象类型】数据中的某个属性</h1>
    <h2>姓名：{{ person.name }}</h2>
    <h2>年龄：{{ person.age }}</h2>
    <h2>汽车：{{ person.car.c1 }}、{{ person.car.c2 }}</h2>
    <button @click="changeName">修改名字</button>
    <button @click="changeAge">修改年龄</button>
    <button @click="changeC1">修改第一台车</button>
    <button @click="changeC2">修改第二台车</button>
    <button @click="changeCar">修改整个车</button>
  </div>
</template>

<script lang="ts" setup name="Person">
import { reactive, watch } from "vue";

// 数据
let person = reactive({
  name: "张三",
  age: 18,
  car: {
    c1: "奔驰",
    c2: "宝马",
  },
});
// 方法
function changeName() {
  person.name += "~";
}
function changeAge() {
  person.age += 1;
}
function changeC1() {
  person.car.c1 = "奥迪";
}
function changeC2() {
  person.car.c2 = "大众";
}
function changeCar() {
  person.car = { c1: "雅迪", c2: "爱玛" };
}

// 监视，情况四：监视响应式对象中的某个属性，且该属性是基本类型的，要写成函数式
watch(()=> person.name,(newValue,oldValue)=>{
  console.log('person.name变化了',newValue,oldValue)
})

// 监视，情况四：监视响应式对象中的某个属性，且该属性是对象类型的，可以直接写，也能写函数，更推荐写函数
watch(
  () => person.car,
  (newValue, oldValue) => {
    console.log("person.car变化了", newValue, oldValue);
  },
  { deep: true },
);
</script>
```

### 3.7.5 情况五

监视上述的多个数据

```vue{46-51}
<template>
  <div class="person">
    <h1>情况五：监视上述的多个数据</h1>
    <h2>姓名：{{ person.name }}</h2>
    <h2>年龄：{{ person.age }}</h2>
    <h2>汽车：{{ person.car.c1 }}、{{ person.car.c2 }}</h2>
    <button @click="changeName">修改名字</button>
    <button @click="changeAge">修改年龄</button>
    <button @click="changeC1">修改第一台车</button>
    <button @click="changeC2">修改第二台车</button>
    <button @click="changeCar">修改整个车</button>
  </div>
</template>

<script lang="ts" setup name="Person">
import { reactive, watch } from "vue";

// 数据
let person = reactive({
  name: "张三",
  age: 18,
  car: {
    c1: "奔驰",
    c2: "宝马",
  },
});
// 方法
function changeName() {
  person.name += "~";
}
function changeAge() {
  person.age += 1;
}
function changeC1() {
  person.car.c1 = "奥迪";
}
function changeC2() {
  person.car.c2 = "大众";
}
function changeCar() {
  person.car = { c1: "雅迪", c2: "爱玛" };
}

// 监视，情况五：监视上述的多个数据
watch(
  [() => person.name, person.car],
  (newValue, oldValue) => {
    console.log("person.car变化了", newValue, oldValue);
  },
  { deep: true },
);
</script>
```

## 3.8 watchEffect 监视

官网：立即运行一个函数，同时响应式地追踪其依赖，并在依赖更改时重新执行该函数。

:::warning `watch`对比`watchEffect`

1. 都能监听响应式数据的变化，不同的是监听数据变化的方式不同
2. `watch`：要**明确指出**监视的数据
3. `watchEffect`：不用明确指出监视的数据（函数中用到哪些属性，那就监视哪些属性）。

:::

示例代码：

```vue{36-47}
<template>
  <div class="person">
    <h1>需求：水温达到50℃，或水位达到20cm，则联系服务器</h1>
    <h2 id="demo">水温：{{ temp }}</h2>
    <h2>水位：{{ height }}</h2>
    <button @click="changePrice">水温+1</button>
    <button @click="changeSum">水位+10</button>
  </div>
</template>

<script lang="ts" setup name="Person">
import { ref, watch, watchEffect } from "vue";
// 数据
let temp = ref(0);
let height = ref(0);

// 方法
function changePrice() {
  temp.value += 10;
}
function changeSum() {
  height.value += 1;
}

// 用watch实现，需要明确的指出要监视：temp、height
watch([temp, height], (value) => {
  // 从value中获取最新的temp值、height值
  const [newTemp, newHeight] = value;
  // 室温达到50℃，或水位达到20cm，立刻联系服务器
  if (newTemp >= 50 || newHeight >= 20) {
    console.log("联系服务器");
  }
});

// 用watchEffect实现，不用
const stopWtach = watchEffect(() => {
  // 室温达到50℃，或水位达到20cm，立刻联系服务器
  if (temp.value >= 50 || height.value >= 20) {
    console.log(document.getElementById("demo")?.innerText);
    console.log("联系服务器");
  }
  // 水温达到100，或水位达到50，取消监视
  if (temp.value === 100 || height.value === 50) {
    console.log("清理了");
    stopWtach();
  }
});
</script>
```

## 3.9 标签的 ref 属性

> 情况：App.vue和Person.vue里面都有一个`id="title"`的标签，当使用id调用的时候（比如JS获取节点），此时会发生冲突。

作用：用于注册模板引用。（给节点打标识）

- 用在普通`DOM`标签上，获取的是`DOM`节点。
- 用在组件标签上，获取的是**组件实例对象**。

用在普通`DOM`标签上：

```vue{3-5,14-16}
<template>
  <div class="person">
    <h1 ref="title1">尚硅谷</h1>
    <h2 ref="title2">前端</h2>
    <h3 ref="title3">Vue</h3>
    <input type="text" ref="inpt" /> <br /><br />
    <button @click="showLog">点我打印内容</button>
  </div>
</template>

<script lang="ts" setup name="Person">
import { ref } from "vue";

let title1 = ref();
let title2 = ref();
let title3 = ref();

function showLog() {
  // 通过id获取元素
  const t1 = document.getElementById("title1");
  // 打印内容
  console.log((t1 as HTMLElement).innerText);
  console.log((<HTMLElement>t1).innerText);
  console.log(t1?.innerText);

  /************************************/

  // 通过ref获取元素
  console.log(title1.value);
  console.log(title2.value);
  console.log(title3.value);
}
</script>
```

用在组件标签上：

```vue{3,11,23,24,27}
<!-- 父组件App.vue -->
<template>
  <Person ref="ren" />
  <button @click="test">测试</button>
</template>

<script lang="ts" setup name="App">
import Person from "./components/Person.vue";
import { ref } from "vue";

let ren = ref();

function test() {
  console.log(ren.value.name);
  console.log(ren.value.age);
}
</script>

<!-- 子组件Person.vue中要使用defineExpose暴露内容 -->
<script lang="ts" setup name="Person">
import { ref, defineExpose } from "vue";
// 数据
let name = ref("张三");
let age = ref(18);

// 使用defineExpose将组件中的数据交给外部
defineExpose({ name, age });
</script>
```

:::info 局部样式

使用scoped关键字，意为只在当前文件生效

```html
<style scoped>
  ....
</style>
```

:::

## 3.10 回顾ts

```typescript{3,12,16}
//index.ts
// 定义一个接口
export interface PersonInter {
  id:string,
  name:string,
  age:number
}

export let a:number = 1

// 自定义类型
export type Persons =Array<PersonInter>

//Person.vue
...
import { a, type PersonInter, type Persons } from '@/types' // 加type表示他是一个约束，而不是一个具体值
let person:PersonInter ={id: '1', name:'aaa', age:18}

// 第一种写法
let person:Array<PersonInter> = [
  {id: '1', name:'aaa', age:18},
  {id: '2', name:'bbb', age:18},
  {id: '3', name:'ccc', age:18}
]

// 第二种写法
let person:PersonInter[] = [
  {id: '1', name:'aaa', age:18},
  {id: '2', name:'bbb', age:18},
  {id: '3', name:'ccc', age:18}
]
// 第三种写法
let person:Persons = [
  {id: '1', name:'aaa', age:18},
  {id: '2', name:'bbb', age:18},
  {id: '3', name:'ccc', age:18}
]
```

## 3.11 props 组件通信

::: danger 再次回顾

单向绑定(`v-bind`)：只能从数据源到页面，不能从页面到数据源，简写为`:`。 `v-model` (双向绑定)

```javascript
// 例1
<h2 a="1+1" :b="1+1" c="x" :d="x">测试</h2>

let x = 9;
console.log(a, b, c, d); // "1+1" 2 "x" 9

// 例2
// 不绑定（没有冒号） 则只是把personList这个字符串赋值给Persons
<Person a="haha" Persons="personList"/> //
//绑定（有冒号） 则是把personList这个列表内容绑定给Persons
<Person a="haha" :Persons="personList"/>

let personList = reactive<Persons>([
  {id: '123123', name: 'zhangsan', age: 18},
  {id: '123345', name: 'lisin', age: 1},
  {id: '123321', name: 'wangwu', age: 20},
])
```

:::

```js
// index.ts
// 定义一个接口，限制每个Person对象的格式
export interface PersonInter {
  id:string,
  name:string,
  age:number
}

// 定义一个自定义类型Persons
export type Persons = Array<PersonInter>
```

在`App.vue`中代码：

```vue
<template>
  <!-- // 绑定persons到list 加`:`表示绑定 不加则视为`"persons"`字符串-->
  <Person :list="persons" />
</template>

<script lang="ts" setup name="App">
import Person from "./components/Person.vue";
import { reactive } from "vue";
import { type Persons } from "./types";

// reactive直接传泛型
let persons = reactive<Persons>([
  { id: "e98219e12", name: "张三", age: 18 },
  { id: "e98219e13", name: "李四", age: 19 },
  { id: "e98219e14", name: "王五", age: 20 },
]);
</script>
```

`Person.vue`中代码：

```Vue{16,19,22-24}
<template>
<div class="person">
<ul>
    <li v-for="item in list" :key="item.id">
       {{item.name}}--{{item.age}}
     </li>
   </ul>
  </div>
  </template>

<script lang="ts" setup name="Person">
import { defineProps } from 'vue'
import {type PersonInter} from '@/types'

// 第一种写法：仅接收
const props = defineProps(['list'])

 // 第二种写法：接收+限制类型
defineProps<{list:Persons}>()

// 第三种写法：接收+限制类型+指定默认值+限制必要性
let props = withDefaults(defineProps<{list?:Persons}>(),{
    list:()=>[{id:'asdasg01',name:'小猪佩奇',age:18}]
 })
// 提示：Vue 3.5已经弃用withDefaults，可以直接解构赋值，看官方文档
// 提示：Vue 3.5已经弃用withDefaults，可以直接解构赋值，看官方文档
// 提示：Vue 3.5已经弃用withDefaults，可以直接解构赋值，看官方文档

// Vue 3.5 第四种写法： 直接解构赋值 接收+限制类型+指定默认值+限制必要性
let { list = [{ id: 'asdasg01', name: '小猪佩奇', age: 18 }] } = defineProps<{list?:Persons}>()

  console.log(props)
</script>
```

:::warning v-for的使用

```html
<div class="person">
  <ul>
    <li v-for="item in list" :key="item.id">
      <!-- list是数据源（也可以是遍历次数） -->
      <!-- item为数据源中每一项（可随意写名称）， -->
      <!-- key唯一标识 -->
      <!-- 后端有唯一值先用唯一值，没有再用index -->
      {{item.name}}--{{item.age}}
    </li>
  </ul>
</div>
```

:::

## 3.12 vue3生命周期

:::info `v-if`和`v-show`的区别

- `v-if`不展示，则删除结构
- `v-show`不展示，隐藏结构`display: none`
  :::

- 概念：`Vue`组件实例在创建时要经历一系列的初始化步骤，在此过程中`Vue`会在合适的时机，调用特定的函数，从而让开发者有机会在特定阶段运行自己的代码，这些特定的函数统称为：**生命周期钩子函数**

- 规律：生命周期整体分为四个阶段，分别是：**创建、挂载、更新、销毁**，每个阶段都有两个钩子，一前一后。

:::info `Vue2`的生命周期：
创建阶段：`beforeCreate`、`created`  
挂载阶段：`beforeMount`、`mounted`  
更新阶段：`beforeUpdate`、`update`  
销毁阶段：`beforeDestroy`、`destroyed`
:::

:::info `Vue3`的生命周期：
创建阶段：`setup`  
挂载阶段：`onBeforeMount`、`onMounted`  
更新阶段：`onBeforeUpdate`、`onUpdated`  
卸载阶段：`onBeforeUnmount`、`onUnmounted`
:::

- 常用的钩子：`onMounted`(挂载完毕)、`onUpdated`(更新完毕)、`onBeforeUnmount`(卸载之前)

- 示例代码：

```vue{30}
<template>
  <div class="person">
    <h2>当前求和为：{{ sum }}</h2>
    <button @click="changeSum">点我sum+1</button>
  </div>
</template>

<!-- vue3写法 -->
<script lang="ts" setup name="Person">
import {
  ref,
  onBeforeMount,
  onMounted,
  onBeforeUpdate,
  onUpdated,
  onBeforeUnmount,
  onUnmounted,
} from "vue";

// 数据
let sum = ref(0);
// 方法
function changeSum() {
  sum.value += 1;
}
// setup
console.log("setup");
// 生命周期钩子
onBeforeMount(() => {
  console.log("挂载之前");
  // 挂载前不是调用onBeforeMount，而是调用onBeforeMount指定的那个函数
});
onMounted(() => {
  console.log("挂载完毕");
});
onBeforeUpdate(() => {
  console.log("更新之前");
});
onUpdated(() => {
  console.log("更新完毕");
});
onBeforeUnmount(() => {
  console.log("卸载之前");
});
onUnmounted(() => {
  console.log("卸载完毕");
});
</script>
```

## 3.13 自定义hooks

> 什么是`hook`？有什么用

本质是一个函数，把`setup`函数中使用的`Composition API`进行了封装，类似于`vue2.x`中的`mixin`。让一个功能的数据和方法放在一起方便维护。

- 自定义`hook`的优势：复用代码, 让`setup`中的逻辑更清楚易懂。

:::warning axios的基本使用

```typescript
// 方法一
async function getDog() {
  try {
    // 发请求
    let { data } = await axios.get(
      "https://dog.ceo/api/breed/pembroke/images/random",
    );
    // 维护数据
    dogList.push(data.message);
  } catch (error) {
    // 处理错误
    const err = <AxiosError>error;
    console.log(err.message);
  }
}

// 方法二
function getDog() {
  // 发请求
  let { data } = axios.get("https://dog.ceo/api/breed/pembroke/images/random").then(
    response => {
      // 维护数据
      dogList.push(data.message);
    }
    error => {
      // 处理错误
    const err = <AxiosError>error;
    console.log(err.message);
    }
   )
}
```

:::

示例代码：

`useSum.ts`中内容如下：

```javascript
import { ref, onMounted } from "vue";

export default function () {
  let sum = ref(0);

  const increment = () => {
    sum.value += 1;
  };
  const decrement = () => {
    sum.value -= 1;
  };
  onMounted(() => {
    increment();
  });

  //向外部暴露数据
  return { sum, increment, decrement };
}
```

`useDog.ts`中内容如下：

```javascript
import {reactive,onMounted} from 'vue'
  import axios,{AxiosError} from 'axios'

  export default function(){
    let dogList = reactive<string[]>([])

    // 方法
    async function getDog(){
      try {
        // 发请求
        let {data} = await axios.get('https://dog.ceo/api/breed/pembroke/images/random')
        // 维护数据
        dogList.push(data.message)
      } catch (error) {
        // 处理错误
        const err = <AxiosError>error
        console.log(err.message)
      }
    }

    // 挂载钩子
    onMounted(()=>{
      getDog()
    })

    //向外部暴露数据
    return {dogList,getDog}
  }
```

组件中具体使用：

```vue
<template>
  <h2>当前求和为：{{ sum }}</h2>
  <button @click="increment">点我+1</button>
  <button @click="decrement">点我-1</button>
  <hr />
  <img v-for="(u, index) in dogList.urlList" :key="index" :src="u as string" />
  <span v-show="dogList.isLoading">加载中......</span><br />
  <button @click="getDog">再来一只狗</button>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "App",
});
</script>

<script setup lang="ts">
import useSum from "./hooks/useSum";
import useDog from "./hooks/useDog";

let { sum, increment, decrement } = useSum();
let { dogList, getDog } = useDog();
</script>
```

# 4. 路由

> 为什么需要路由？

实现SPA（single page web application 单页面应用）

官方文档：https://router.vuejs.org/zh/

## 4.1 安装vue-router

```powershell
npm i vue-router
```

## 4.2 路由基本切换效果

路由配置文件代码如下：

```ts{2,8,20}
// router/index.ts
import { createRouter, createWebHistory } from "vue-router";
import Home from "@/pages/Home.vue";
import News from "@/pages/News.vue";
import About from "@/pages/About.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/home",
      component: Home,
    },
    {
      path: "/about",
      component: About,
    },
  ],
});
export default router;
```

`main.ts`代码如下：

```js
import router from "./router/index";
app.use(router);
app.mount("#app");
```

`App.vue`代码如下：

```vue{6,12}
<template>
  <div class="app">
    <h2 class="title">Vue路由测试</h2>
    <!-- 导航区 -->
    <div class="navigate">
      <RouterLink to="/home" active-class="active">首页</RouterLink>
      <RouterLink to="/news" active-class="active">新闻</RouterLink>
      <RouterLink to="/about" active-class="active">关于</RouterLink>
    </div>
    <!-- 展示区 -->
    <div class="main-content">
      <RouterView></RouterView>
    </div>
  </div>
</template>

<script lang="ts" setup name="App">
import { RouterLink, RouterView } from "vue-router";
</script>
```

1. 路由组件通常存放在`pages` 或 `views`文件夹，一般组件通常存放在`components`文件夹。
2. 通过点击导航，视觉效果上“消失” 了的路由组件，默认是被**卸载**掉的，需要的时候再去**挂载**。

## 4.3 路由器工作模式

1. `history`模式

- 优点：`URL`更加美观，不带有`#`，更接近传统的网站`URL`。
- 缺点：后期项目上线，需要服务端配合处理路径问题，否则刷新会有`404`错误。

```js
const router = createRouter({
  history: createWebHistory(), //history模式   /******/
});
```

2. `hash`模式

- 优点：兼容性更好，因为不需要服务器端处理路径。
- 缺点：`URL`带有`#`不太美观，且在`SEO`优化方面相对较差。

```js
const router = createRouter({
  history: createWebHashHistory(), //hash模式
  /******/
});
```

## 4.4 to的两种写法（重点）

```vue
<!-- 第一种：to的字符串写法 -->
<router-link active-class="active" to="/home">主页</router-link>

<!-- 第二种：to的对象写法 -->
<router-link active-class="active" :to="{ path: '/home' }">Home</router-link>
```

## 4.5 命名路由

> 作用：可以简化路由跳转及传参。

给路由规则命名：

```js
routes: [
  {
    name: "zhuye",
    path: "/home",
    component: Home,
  },
  {
    name: "xinwen",
    path: "/news",
    component: News,
  },
  {
    name: "guanyu",
    path: "/about",
    component: About,
  },
];
```

```vue
<!-- 对于to的写法 -->
<!-- 第一种：to的字符串写法（路径跳转） -->
<router-link active-class="active" to="/home">主页</router-link>

<!-- 第二种：to的对象写法（路径跳转） -->
<router-link active-class="active" :to="{ path: '/home' }">Home</router-link>

<!-- to的对象写法（名字跳转） -->
<router-link active-class="active" :to="{ name: 'zhuye' }">Home</router-link>
```

## 4.6 嵌套路由

1. 编写`News`的子路由：`Detail.vue`

2. 配置路由规则，使用`children`配置项：

```ts
const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      name: "zhuye",
      path: "/home",
      component: Home,
    },
    {
      name: "xinwen",
      path: "/news",
      component: News,
      children: [
        {
          name: "xiang",
          path: "detail", // 不需要写'/'
          component: Detail,
        },
      ],
    },
    {
      name: "guanyu",
      path: "/about",
      component: About,
    },
  ],
});
export default router;
```

3. 跳转路由（记得要加完整路径）：

```vue
<router-link to="/news/detail">xxxx</router-link>
<!-- 或 -->
<router-link :to="{ path: '/news/detail' }">xxxx</router-link>
```

4. 记得去`Home`组件中预留一个`<router-view>`

```vue
<template>
  <div class="news">
    <nav class="news-list">
      <RouterLink
        v-for="news in newsList"
        :key="news.id"
        :to="{ path: '/news/detail' }"
      >
        {{ news.name }}
      </RouterLink>
    </nav>
    <div class="news-detail">
      <RouterView />
    </div>
  </div>
</template>
```

## 4.7 路由传参 query参数（路径后面加?）

:::warning 路由组件传参
这里讲的都是路由组件传参，一般组件可以直接在组件上面传
:::

1.  传递参数

```vue
<!-- 跳转并携带query参数（to的字符串写法） -->
<router-link :to="`/news/detail?id=${news.id}&${news.title}&${news.content}`"> 
    	跳转
    </router-link>
<!-- 传了id title content三个参数 -->

<!-- 跳转并携带query参数（to的对象写法） -->
<RouterLink
  :to="{
    // name:'xiang', // 用name也可以跳转
    path: '/news/detail',
    query: {
      id: news.id,
      title: news.title,
      content: news.content,
    },
  }"
>
      {{news.title}}
    </RouterLink>
```

2.  接收参数：

```js
import { useRoute } from "vue-router";
const route = useRoute();
// 打印query参数
console.log(route.query);
```

## 4.8 路由传参 params参数（需要在路由配置占位）

:::danger 注意点

1. 需要在路由配置占位（占位用什么名字 拿值的时候就写什么名字）
2. 传递`params`参数时，若使用`to`的对象写法，必须使用`name`配置项，不能用`path`。
3. 不能传对象和数组

:::

3. 传递参数

```vue
<!-- 跳转并携带params参数（to的字符串写法） -->
<RouterLink :to="`/news/detail/001/新闻001/内容001`">{{news.title}}</RouterLink>

<!-- 跳转并携带params参数（to的对象写法） -->
<RouterLink
  :to="{
    name: 'xiang', //用name跳转
    params: {
      id: news.id,
      title: news.title,
      content: news.title,
    },
  }"
>
      {{news.title}}
    </RouterLink>
```

2. 接收参数：

```js
import { useRoute } from "vue-router";
const route = useRoute();
// 打印params参数
console.log(route.params);
```

## 4.9 路由规则的props配置

> 在路由规则(index.ts)当中配置

作用：让路由组件**更方便**的收到参数（可以将路由参数作为`props`传给组件）

```js
{
	name:'xiang',
	path:'detail/:id/:title/:content',
	component:Detail,

  // 1. props的布尔值写法
  // 作用：把收到了每一组params参数，作为props传给Detail组件
  props:true

  // 2. props的函数写法
  // 作用：把返回的对象中每一组key-value作为props传给Detail组件
  props(route){
    return route.query
  }

  // 3. props的对象写法 query params都可以使用（用的少）
  // 作用：把对象中的每一组key-value作为props传给Detail组件
  props:{a:1,b:2,c:3}
}
```

## 4.10 replace属性

作用：控制路由跳转时操作浏览器历史记录的模式。

浏览器的历史记录有两种写入方式：分别为`push`和`replace`：

- `push`是追加历史记录（默认）。
- `replace`是替换当前记录。

开启`replace`模式：

```vue
<RouterLink replace .......>News</RouterLink>
```

## 4.11 编程式导航

> 需求：看三秒钟首页，立刻跳转到新的页面

编程式路由导航：脱离routerlink实现跳转

路由组件的两个重要的属性：`$route`和`$router`变成了两个`hooks`

```js{1,3,6}
import { useRouter } from "vue-router";

const router = useRouter();
...
function showNewsDetails() {
  router.push({
  name:'xiang',
  query:{
    id:news.id,
    title:news.title,
    content:news.content
    }
  })
}
```

## 4.12 重定向

作用：将特定的路径，重新定向到已有路由。

```javascript
{
  path:'/',
  redirect:'/about'
}
```

# 5. pinia

> 什么是pinia？

符合直觉的vue状态（数据）管理工具

实现这个效果：

<img src="/assert/assets-heima/pinia_example.gif" alt="pinia_example" style="zoom:30%;border:3px solid" />

## 5.1 搭建 pinia 环境

1. 安装pinia：`npm install pinia`
2. 操作`src/main.ts`

```ts
import { createApp } from "vue";
import App from "./App.vue";

/* 引入createPinia，用于创建pinia */
import { createPinia } from "pinia";

/* 创建pinia */
const pinia = createPinia();
const app = createApp(App);

/* 使用插件 */ {
}
app.use(pinia);
app.mount("#app");
```

## 5.2 存储 + 读取数据

> 要把哪些数据存储到pinia

1. `Store`是一个保存：**状态**、**业务逻辑** 的实体，每个组件都可以**读取**、**写入**它。
2. 它有三个概念：`state`、`getter`、`action`，相当于组件中的： `data`、 `computed` 和 `methods`。
3. 具体编码：`src/store/count.ts`（注意命名和组件相同）

```ts
// 引入defineStore用于创建store
import { defineStore } from "pinia";

// 定义并暴露一个store
export const useCountStore = defineStore("count", {
  // 第一个参数是id值，第二个参数是配置对象

  // 动作
  actions: {},
  // 状态 真正存储数据的地方
  state() {
    return {
      sum: 6,
    };
  },
  // 计算
  getters: {},
});
```

4. 具体编码：`src/store/talk.ts`

```js
// 引入defineStore用于创建store
import { defineStore } from "pinia";

// 定义并暴露一个store
export const useTalkStore = defineStore("talk", {
  // 动作
  actions: {},
  // 状态
  state() {
    return {
      talkList: [
        { id: "yuysada01", content: "你今天有点怪，哪里怪？怪好看的！" },
        { id: "yuysada02", content: "草莓、蓝莓、蔓越莓，你想我了没？" },
        { id: "yuysada03", content: "心里给你留了一块地，我的死心塌地" },
      ],
    };
  },
  // 计算
  getters: {},
});
```

:::warning 注意点
由`reactive`的`ref`直接被拆包，不需要`.value`

```javascript
let obj = reactive({
  a: 1,
  b: 2,
  c: ref(3),
});

console.log(obj.a);
console.log(obj.b);
console.log(obj.c);
```

:::

5. 组件中使用`state`中的数据

```vue
<template>
  <h2>当前求和为：{{ sumStore.sum }}</h2>
</template>

<script setup lang="ts" name="Count">
// 引入对应的useXxxxxStore
import { useSumStore } from "@/store/sum";

// 调用useXxxxxStore得到对应的store
const sumStore = useSumStore();
</script>
```

```vue
<template>
  <ul>
    <li v-for="talk in talkStore.talkList" :key="talk.id">
      {{ talk.content }}
    </li>
  </ul>
</template>

<script setup lang="ts" name="Count">
import axios from "axios";
import { useTalkStore } from "@/store/talk";

const talkStore = useTalkStore();
</script>
```

## 5.3 修改数据(三种方式)

1. 第一种修改方式，直接修改（直接改）

```ts
countStore.sum = 666;
```

2. 第二种修改方式：批量修改

```ts
countStore.$patch({
  sum: 999,
  school: "atguigu",
});
```

3. 第三种修改方式：借助`action`修改（`action`中可以编写一些业务逻辑）

```js{5,10,16}
import { defineStore } from 'pinia'

export const useCountStore = defineStore('count', {
/*************/
  actions: {
    //加
    increment(value:number) {
      if (this.sum < 10) {
         // 1.操作countStore中的sum
         this.sum += value
      }
    },
    //减
    decrement(value:number){
      if(this.sum > 1){
        this.sum -= value
      }
    }
  },
  /*************/
})
```

4. 组件中调用`action`即可

```js{5}
// 使用countStore
const countStore = useCountStore();

// 调用对应action
countStore.increment(n.value);
```

## 5.4 storeToRefs

- 借助`storeToRefs`将`store`中的数据转为`ref`对象，方便在模板中使用。
- 注意：`pinia`提供的`storeToRefs`只会将数据做转换，而`Vue`的`toRefs`会转换`store`中所有数据（包括方法）。

```vue
<template>
  <div class="count">
    <h2>当前求和为：{{ sum }}</h2>
  </div>
</template>

<script setup lang="ts" name="Count">
import { useCountStore } from "@/store/count";
/* 引入storeToRefs */
import { storeToRefs } from "pinia";

/* 得到countStore */
const countStore = useCountStore();
/* 使用storeToRefs转换countStore，随后解构 */
const { sum } = storeToRefs(countStore);
</script>
```

## 5.5 getters

1. 概念：当`state`中的数据，需要经过处理后再使用时，可以使用`getters`配置。
2. 追加`getters`配置。

```js
// 引入defineStore用于创建store
import {defineStore} from 'pinia'

// 定义并暴露一个store
export const useCountStore = defineStore('count',{
  // 动作
  actions:{
    /************/
  },
  // 状态
  state(){
    return {
      sum:1,
      school:'atguigu'
    }
  },
  // 计算
  getters:{
    bigSum:(state):number => state.sum * 10,
    upperSchool():string{
      return this. school.toUpperCase()
    }
  }
})
```

3. 组件中读取数据：

```js
const { increment, decrement } = countStore;
let { sum, school, bigSum, upperSchool } = storeToRefs(countStore);
```

:::info getters和actions的区别

在 Pinia 里可以这样理解：

- **getters**：算结果 “计算属性”（读数据）
- **actions**：做事情 “方法”（改数据 + 异步 + 业务逻辑）

1. getters

**作用**：根据 state 派生出新值，通常用于读取和展示。
**特点**：

- 有缓存（依赖不变就不重复算）
- 不应该做副作用（比如请求接口、改 state）
- 类似 Vue 的 `computed`

```ts
getters: {
  doubleCount: (state) => state.count * 2;
}
```

2. actions

**作用**：执行业务逻辑、修改 state、发请求。
**特点**：

- 可以是同步或异步（`async/await`）
- 可以直接 `this.count++`
- 可以调用其他 action

```ts
actions: {
  increment() {
    this.count++
  },
  async fetchUser() {
    const res = await api.getUser()
    this.user = res.data
  }
}
```

:::

## 5.6 $subscribe 订阅

通过 store 的 `$subscribe()` 方法侦听 `state` 及其变化。（类似于`watch`）

```ts
talkStore.$subscribe((mutate, state) => {
  console.log("LoveTalk", mutate, state);
  localStorage.setItem("talk", JSON.stringify(talkList.value));
});
```

## 5.7 store组合式写法

```ts
import { defineStore } from "pinia";
import axios from "axios";
import { nanoid } from "nanoid";
import { reactive } from "vue";

export const useTalkStore = defineStore("talk", () => {
  // talkList就是state
  const talkList = reactive(
    JSON.parse(localStorage.getItem("talkList") as string) || [],
  );

  // getATalk函数相当于action
  async function getATalk() {
    // 发请求，下面这行的写法是：连续解构赋值+重命名
    let {
      data: { content: title },
    } = await axios.get("https://api.uomg.com/api/rand.qinghua?format=json");
    // 把请求回来的字符串，包装成一个对象
    let obj = { id: nanoid(), title };
    // 放到数组中
    talkList.unshift(obj);
  }
  return { talkList, getATalk };
});
```

# 6. 组件通信

**`Vue3`组件通信和`Vue2`的区别：**

- 移出事件总线，使用`mitt`代替。

* `vuex`换成了`pinia`。
* 把`.sync`优化到了`v-model`里面了。
* 把`$listeners`所有的东西，合并到`$attrs`中了。
* `$children`被砍掉了。

**常见搭配形式：**

<img src="/assert/assets-heima/image-20231119185900990.png" alt="image-20231119185900990" style="zoom:60%;" />

## 6.1 通信方式-props

概述：`props`是使用频率最高的一种通信方式，常用与 ：**父 ↔ 子**。

- 若 **父传子**：属性值是**非函数**。
- 若 **子传父**：属性值是**函数**。 (不建议使用，建议用`emit`)
- 尽量不要出现父传孙

父组件：

```vue{6,14,17-19}
<template>
  <div class="father">
    <h3>父组件，</h3>
    <h4>我的车：{{ car }}</h4>
    <h4>儿子给的玩具：{{ toy }}</h4>
    <Child :car="car" :getToy="getToy" />
  </div>
</template>

<script setup lang="ts" name="Father">
import Child from "./Child.vue";
import { ref } from "vue";
// 数据
const car = ref("奔驰");
const toy = ref();
// 方法
function getToy(value: string) {
  toy.value = value;
}
</script>
```

子组件

```vue{6,12,14}
<template>
  <div class="child">
    <h3>子组件</h3>
    <h4>我的玩具：{{ toy }}</h4>
    <h4>父给我的车：{{ car }}</h4>
    <button @click="getToy(toy)">玩具给父亲</button>
  </div>
</template>

<script setup lang="ts" name="Child">
import { ref } from "vue";
const toy = ref("奥特曼");

defineProps(["car", "getToy"]);
</script>
```

## 6.2 通信方式-自定义事件 emit

:::info 补充
`$event`是是什么？

- 对于原生事件，`$event`就是原生事件对象，包含事件发生时的一些信息（DOM）,可以`.target`获取事件源。
- 对于自定义事件，`$event`就是触发事件时，所传递的数据，不可以`.target`。

:::

1. 概述：自定义事件常用于：**子 => 父**。
2. 注意区分好：原生事件、自定义事件。

- 原生事件：
  - 事件名是特定的（`click`、`mosueenter`等等）
  - 事件对象`$event`: 是包含事件相关信息的对象（`pageX`、`pageY`、`target`、`keyCode`）
- 自定义事件：
  - 事件名是任意名称
  - <strong style="color:skyblue">事件对象`$event`: 是调用`emit`时所提供的数据，可以是任意类型！！！</strong >

3. 示例：

```vue
<!--在父组件中，给子组件绑定自定义事件：-->
<!-- 为子组件绑定的是send-toy -->
<!-- 当事件触发时，会调用saveToy方法 -->
<Child @send-toy="saveToy" />
...
<script>
let toy = ref("");
function saveToy(value:string) {
  console.log("saveToy", value);
  toy.value = value;
}
</script>
```

```vue
<!--子组件-->
<!-- 调用的是 emit('send-toy'),使用 emit('send-toy') 触发send-toy事件 -->
<!-- 这里会把toy作为参数传递绑定的事件 -->
<button @click="emit('send-toy', toy)">测试</button>
<!-- 子组件中，触发事件：  -->
<script>
let toy = ref("奥特曼");
// 声明的是send-toy事件
const emit = defineEmits(["send-toy"]);

// 3.3+：另一种更简洁的语法
// 声明的是send-toy事件
const emit = defineEmits<{
  send-toy:[value: string] // 具名元组语法
   // 事件名: [参数名: 参数类型]
}>()
</script>
```

## 6.3 通信方式-mitt （用得少）

概述：与消息订阅与发布（`pubsub`）功能类似，可以实现任意组件间通信。

1. 安装`mitt`: `npm i mitt`

2. 新建文件：`src\utils\emitter.ts`

```javascript
// 引入mitt
import mitt from "mitt";

// 创建emitter
const emitter = mitt();

/*
  // 绑定事件 on
  emitter.on('abc',(value)=>{
    console.log('abc事件被触发',value)
  })
  emitter.on('xyz',(value)=>{
    console.log('xyz事件被触发',value)
  })

  setInterval(() => {
    // 触发事件 emit
    emitter.emit('abc',666)
    emitter.emit('xyz',777)
  }, 1000);

  // 解绑事件 off

  setTimeout(() => {
    // 清理全部事件
    emitter.all.clear()
  }, 3000);
*/

// 创建并暴露mitt
export default emitter;
```

接收数据的组件中：绑定事件、同时在销毁前解绑事件：

```typescript
import emitter from "@/utils/emitter";
import { onUnmounted } from "vue";

// 绑定事件
emitter.on("send-toy", (value) => {
  console.log("send-toy事件被触发", value);
});

onUnmounted(() => {
  // 在组件卸载时解绑事件
  emitter.off("send-toy");
});
```

提供数据的组件，在合适的时候触发事件

```javascript
import emitter from "@/utils/emitter";

function sendToy() {
  // 触发事件
  emitter.emit("send-toy", toy.value);
}
```

**注意这个重要的内置关系，总线依赖着这个内置关系**

## 6.4 通信方式-v-model （组件库大量使用）

1. 概述：实现 **父↔子** 之间相互通信。
2. 前序知识 —— `v-model`的本质

```vue
<!-- 使用v-model指令 -->
<!-- v-model用在html标签上是双向绑定 -->
<input type="text" v-model="userName" />

<!-- html标签上v-model的本质（底层实现） -->
<!-- <input type="text" :value="username" @input:"username = (<HTMLInputElement>$event.target).value"> -->
```

3. 组件标签上的`v-model`的本质：`:moldeValue` ＋ `update:modelValue`事件。(props + emit的组合)

```vue
<!-- 如何实现在组件标签上使用v-model指令 -->
<AtguiguInput v-model="userName" />

<!-- 组件标签上v-model的本质 -->
<!-- 相当于v-bind:modelValue="userName" 单向绑定 传递modelValue -->
<!-- @update:modelValue="userName = $event" 自定义事件 update:modelValue为事件名 -->
<AtguiguInput :modelValue="userName" @update:modelValue="userName = $event" />
```

`AtguiguInput.vue`中：(vue3.4+改为了`defineModel`)

```vue
<template>
  <div class="box">
    <!--将接收的value值赋给input元素的value属性，目的是：为了呈现数据 -->
    <!--给input元素绑定原生input事件，触发input事件时，进而触发update:model-value事件-->
    <input
      type="text"
      :value="modelValue"
      @input="emit('update:model-value', $event.target.value)"
    />
  </div>
</template>

<script setup lang="ts" name="AtguiguInput">
// 接收props 父传子
defineProps(["modelValue"]);
// 声明事件 子传父
const emit = defineEmits(["update:model-value"]);
</script>
```

4. 也可以更换`value`，例如改成`abc`

```vue
<!-- 也可以更换value，例如改成abc-->
<AtguiguInput v-model:abc="userName" />

<!-- 上面代码的本质如下 -->
<AtguiguInput :abc="userName" @update:abc="userName = $event" />
```

`AtguiguInput`组件中：

```vue
<template>
  <div class="box">
    <input
      type="text"
      :value="abc"
      @input="emit('update:abc', $event.target.value)"
    />
  </div>
</template>

<script setup lang="ts" name="AtguiguInput">
// 接收props
defineProps(["abc"]);
// 声明事件
const emit = defineEmits(["update:abc"]);
</script>
```

5. 如果`value`可以更换，那么就可以在组件标签上多次使用`v-model`

```vue
<AtguiguInput v-model:abc="userName" v-model:xyz="password" />
```

::: warning `$event`到底是什么？什么时候可以`.target`

- 对于原生事件，`$event`就是事件对象。可以`.target`
- 对于自定义事件，`$event`就是触发事件时，所传递的数据。不能`.target`

:::

## 6.5 通信方式-$attrs 祖传孙（用得少）

> 所有父组件传了，但是没有声明接收的数据都在`$attrs`。

1. 概述：`$attrs`用于实现**当前组件的父组件**，向**当前组件的子组件**通信（**祖→孙**）,孙传祖也可。
2. 具体说明：`$attrs`是一个对象，包含所有父组件传入的标签属性。

::: warning 注意
`$attrs`会自动排除`props`中声明的属性(可以认为声明过的 `props` 被子组件自己“消费”了)
:::

父组件：

```vue
<template>
  <div class="father">
    <h3>父组件</h3>
    <Child
      :a="a"
      :b="b"
      :c="c"
      :d="d"
      v-bind="{ x: 100, y: 200 }"
      :updateA="updateA"
    />
  </div>
</template>

<script setup lang="ts" name="Father">
import Child from "./Child.vue";
import { ref } from "vue";
let a = ref(1);
let b = ref(2);
let c = ref(3);
let d = ref(4);

function updateA(value) {
  a.value = value;
}
</script>
```

子组件：

```vue
<template>
  <div class="child">
    <h3>子组件</h3>
    <GrandChild v-bind="$attrs" />
  </div>
</template>

<script setup lang="ts" name="Child">
import GrandChild from "./GrandChild.vue";
</script>
```

孙组件：

```vue
<template>
  <div class="grand-child">
    <h3>孙组件</h3>
    <h4>a：{{ a }}</h4>
    <h4>b：{{ b }}</h4>
    <h4>c：{{ c }}</h4>
    <h4>d：{{ d }}</h4>
    <h4>x：{{ x }}</h4>
    <h4>y：{{ y }}</h4>
    <button @click="updateA(666)">点我更新A</button>
  </div>
</template>

<script setup lang="ts" name="GrandChild">
defineProps(["a", "b", "c", "d", "x", "y", "updateA"]);
</script>
```

## 6.6 通信方式-$refs（父→子）、$parent（子→父） （用得少）

1. 概述：
   - `$refs`用于 ：**父→子。**
   - `$parent`用于：**子→父。**

2. 原理如下：

   | 属性      | 说明                                                     |
   | --------- | -------------------------------------------------------- |
   | `$refs`   | 值为对象，包含所有被`ref`属性标识的`DOM`元素或组件实例。 |
   | `$parent` | 值为对象，当前组件的父组件实例对象。                     |

- `$refs`包含组件所有的子组件
- `$parent`包含当前组件的父组件实例对象
- 如果拿不到数据记得使用宏函数`defineExpose`进行暴露数据

## 6.7 通信方式-provide、inject 祖孙通信 且父不参与 （常用）

1. 概述：实现**祖孙组件**通信（不打扰父组件）
2. 具体使用：
   - 在祖先组件中通过`provide`配置向后代组件提供数据
   - 在后代组件中通过`inject`配置来声明接收数据

3. 具体编码：

```vue
<!-- 1. 父组件中，使用`provide`提供数据 -->
<template>
  <div class="father">
    <h3>父组件</h3>
    <h4>资产：{{ money }}</h4>
    <h4>汽车：{{ car }}</h4>
    <button @click="money += 1">资产+1</button>
    <button @click="car.price += 1">汽车价格+1</button>
    <Child />
  </div>
</template>

<script setup lang="ts" name="Father">
import Child from "./Child.vue";
import { ref, reactive, provide } from "vue";
// 数据
let money = ref(100);
let car = reactive({
  brand: "奔驰",
  price: 100,
});
// 用于更新money的方法
function updateMoney(value: number) {
  money.value += value;
}
// 向后代提供数据（后代均可拿到）
provide("moneyContext", { money, updateMoney });
// 参数一：数据名称 参数二：数据值
provide("car", car);
</script>
```

> 注意：子组件中不用编写任何东西，是不受到任何打扰的

【第二步】孙组件中使用`inject`配置项接受数据。

```vue
<template>
  <div class="grand-child">
    <h3>我是孙组件</h3>
    <h4>资产：{{ money }}</h4>
    <h4>汽车：{{ car }}</h4>
    <button @click="updateMoney(6)">点我</button>
  </div>
</template>

<script setup lang="ts" name="GrandChild">
import { inject } from "vue";
// 注入数据
let { money, updateMoney } = inject("moneyContext", {
  money: 0,
  updateMoney: (x: number) => {},
});
let car = inject("car");
</script>
```

## 6.8 通信方式-pinia

参考之前`pinia`笔记

## 6.9 slot 插槽

### 6.9.1 默认插槽

> 单标签组件和双标签组件有什么区别？

双标签可以在中间写东西。

```vue{2-6，12}
<!-- 父组件中： -->
<Category title="今日热门游戏">
          <ul>
            <li v-for="g in games" :key="g.id">{{ g.name }}</li>
          </ul>
        </Category>
<!-- 子组件中： -->
<template>
  <div class="item">
    <h3>{{ title }}</h3>
    <!-- 默认插槽 -->
    <slot></slot>
  </div>
</template>
```

### 6.9.2 具名插槽

具有名字的插槽。

- 具名插槽`s-slot`可以写在组件上和template上。
- 默认插槽也有名字，默认为`default`。
- `s-slot`的简写形式`#`。

```vue{3,8,16,17}
<!-- 父组件中： -->
<Category title="今日热门游戏">
          <template v-slot:s1>
            <ul>
              <li v-for="g in games" :key="g.id">{{ g.name }}</li>
            </ul>
          </template>
          <template #s2>
            <a href="">更多</a>
          </template>
        </Category>
<!-- 子组件中： -->
<template>
  <div class="item">
    <h3>{{ title }}</h3>
    <slot name="s1"></slot>
    <slot name="s2"></slot>
  </div>
</template>
```

### 6.9.3 作用域插槽

> 需求：我需要使用三个插槽呈现在同一个页面，但是一个用有序列表呈现，一个用无序列表呈现，一个用三级标题呈现。

1. 理解：<span style="color:skyblue">数据在组件的自身，但根据数据生成的结构需要组件的使用者来决定。</span>（新闻数据在`Games`组件中，但使用数据所遍历出来的结构由`Father`组件决定）说白了就是“根据数据生成的结构”在父组件，“需要使用的数据”在子组件，“作用域问题”导致无法实现。（压岁钱在孩子那，但根据压岁钱买的东西，却由父亲决定。）
2. 具体编码：

```vue{2,5-7,14}
<!-- 父组件中： -->
<Game v-slot="params">
<!-- params就是子组件传过来的数据（是一个对象） -->
         <!-- <Game v-slot:default="params"> -->
         <!-- <Game #default="params"> -->
           <ul>
             <li v-for="g in params.games" :key="g.id">{{ g.name }}</li>
           </ul>
         </Game>

<!-- 子组件中： -->
<template>
  <div class="category">
    <h2>今日游戏榜单</h2>
    <slot :games="games" a="哈哈"></slot>
  </div>
</template>

<script setup lang="ts" name="Category">
import { reactive } from "vue";
let games = reactive([
  { id: "asgdytsa01", name: "英雄联盟" },
  { id: "asgdytsa02", name: "王者荣耀" },
  { id: "asgdytsa03", name: "红色警戒" },
  { id: "asgdytsa04", name: "斗罗大陆" },
]);
</script>
```

:::info
作用域卡槽也可以有名字
:::

# 7. 其它常用 API

## 7.1 shallowRef 与 shallowReactive 浅层次

### `shallowRef`

1. 作用：创建一个响应式数据，但只对顶层属性进行响应式处理。

```javascript
function changeSum() {
  sum.value += 1; // 浅层
}

function changeName() {
  person.name.value += 1; // 深层
}
```

2. 用法：

```js
let myVar = shallowRef(initialValue);
```

3. 特点：只跟踪引用值（整体修改）的变化，不关心值内部的属性变化。

### `shallowReactive`

1. 作用：创建一个浅层响应式对象，只会使对象的最顶层属性变成响应式的，对象内部的嵌套属性则不会变成响应式的
2. 用法：

```js
const myObj = shallowReactive({ ... });
```

3. 特点：对象的顶层属性是响应式的，但嵌套对象的属性不是。

### 总结

> 通过使用 [`shallowRef()`](https://cn.vuejs.org/api/reactivity-advanced.html#shallowref) 和 [`shallowReactive()`](https://cn.vuejs.org/api/reactivity-advanced.html#shallowreactive) 来绕开深度响应。浅层式 `API` 创建的状态只在其顶层是响应式的，对所有深层的对象不会做任何处理，避免了对每一个内部属性做响应式所带来的性能成本，这使得属性的访问变得更快，可提升性能。

## 7.2 readonly 与 shallowReadonly 只读和浅层只读

### **`readonly`**

1. 作用：用于创建一个对象的深只读副本。
2. 用法：

```javascript
 const original = reactive({ ... });
 const readOnlyCopy = readonly(original);
```

3. 特点：

- 对象的所有嵌套属性都将变为只读。
- 任何尝试修改这个对象的操作都会被阻止（在开发模式下，还会在控制台中发出警告）。

4. 应用场景：

- 创建不可变的状态快照。
- 保护全局状态或配置不被修改。

### **`shallowReadonly`**

1. 作用：与 `readonly` 类似，但只作用于对象的顶层属性（只有第一层只读）。
2. 用法：

```js
const original = reactive({ ... });
const shallowReadOnlyCopy = shallowReadonly(original);
```

3. 特点：
   - 只将对象的顶层属性设置为只读，对象内部的嵌套属性仍然是可变的。
   - 适用于只需保护对象顶层属性的场景。

## 7.3 toRaw 与 markRaw 更改为原始数据

### `toRaw`

1. 作用：用于获取一个响应式对象的原始对象， `toRaw` 返回的对象不再是响应式的，不会触发视图更新。（将响应式数据改为原始数据）

> 官网描述：这是一个可以用于临时读取而不引起代理访问/跟踪开销，或是写入而不触发更改的特殊方法。不建议保存对原始对象的持久引用，请谨慎使用。

> 何时使用？在需要将响应式对象传递给非 `Vue` 的库或外部系统时，使用 `toRaw` 可以确保它们收到的是普通对象

2. 具体编码：

   ```js
   import { reactive, toRaw, markRaw, isReactive } from "vue";

   /* toRaw */
   // 响应式对象
   let person = reactive({ name: "tony", age: 18 });
   // 原始对象
   let rawPerson = toRaw(person);

   /* markRaw */
   let citysd = markRaw([
     { id: "asdda01", name: "北京" },
     { id: "asdda02", name: "上海" },
     { id: "asdda03", name: "天津" },
     { id: "asdda04", name: "重庆" },
   ]);
   // 根据原始对象citys去创建响应式对象citys2 —— 创建失败，因为citys被markRaw标记了
   let citys2 = reactive(citys);
   console.log(isReactive(person));
   console.log(isReactive(rawPerson));
   console.log(isReactive(citys));
   console.log(isReactive(citys2));
   ```

### `markRaw`

1. 作用：标记一个对象，使其**永远不会**变成响应式的。

> 例如使用`mockjs`（模拟后端接口）时，为了防止误把`mockjs`变为响应式对象，可以使用 `markRaw` 去标记`mockjs`

2. 编码：

```js
/* markRaw */
let citys = markRaw([
  { id: "asdda01", name: "北京" },
  { id: "asdda02", name: "上海" },
  { id: "asdda03", name: "天津" },
  { id: "asdda04", name: "重庆" },
]);
// 根据原始对象citys去创建响应式对象citys2 —— 创建失败，因为citys被markRaw标记了
let citys2 = reactive(citys);
```

## 7.4 customRef 自定义ref

> 需求：双向绑定后，当数据发生变化，等一秒钟页面在发生变化。

作用：创建一个自定义的`ref`，并对其依赖项跟踪和更新触发进行逻辑控制。

实现防抖效果（`useSumRef.ts`）：

```typescript
import { customRef } from "vue";

export default function (initValue: string, delay: number) {
  let msg = customRef((track, trigger) => {
    // track 跟踪 trigger 触发
    let timer: number;
    return {
      get() {
        // msg被读取的时候调用
        track(); // 告诉Vue数据msg很重要，要对msg持续关注，一旦变化就更新
        return initValue;
      },
      set(value) {
        // msg被修改的时候调用
        clearTimeout(timer);
        timer = setTimeout(() => {
          initValue = value;
          trigger(); //通知Vue数据msg变化了
        }, delay);
      },
    };
  });
  return { msg };
}
```

# 8. Vue3新组件

## 8.1 Teleport 传送门

> 需求：某些情况下，我们需要使用css样式（`filter: saturate(0%);`）将页面变为黑白，但是此时`position: fixed;`会出现问题，如何解决？

- 什么是Teleport？—— Teleport 是一种能够将我们的**组件html结构**移动到指定位置的技术。

```vue
<teleport to="body">
<!-- 传到body to可以填选择器 -->
  <div class="modal" v-show="isShow">
    <h2>我是一个弹窗</h2>
    <p>我是弹窗中的一些内容</p>
    <button @click="isShow = false">关闭弹窗</button>
  </div>
</teleport>
```

## 8.2 Suspense 异步组件

- 等待异步组件时渲染一些额外内容，让应用有更好的用户体验
- 使用步骤：
  - 异步引入组件
  - 使用`Suspense`包裹组件，并配置好`default` 与 `fallback`

```tsx
import { defineAsyncComponent, Suspense } from "vue";
const Child = defineAsyncComponent(() => import("./Child.vue"));
```

```vue
<template>
  <div class="app">
    <h3>我是App组件</h3>
    <Suspense>
      <template v-slot:default>
        <Child />
      </template>
      <template v-slot:fallback>
        <h3>加载中.......</h3>
      </template>
    </Suspense>
  </div>
</template>
```

## 8.3 全局API转移到应用对象

- `app.component` 注册全局组件
- `app.config` 全局配置
- `app.directive` 注册全局指令
- `app.mount` 挂载
- `app.unmount` 卸载
- `app.use` 安装插件

## 8.4 其他

- 过渡类名 `v-enter` 修改为 `v-enter-from`、过渡类名 `v-leave` 修改为 `v-leave-from`。

- `keyCode` 作为 `v-on` 修饰符的支持。

- `v-model` 指令在组件上的使用已经被重新设计，替换掉了 `v-bind.sync。`

- `v-if` 和 `v-for` 在同一个元素身上使用时的优先级发生了变化。

- 移除了`$on`、`$off` 和 `$once` 实例方法。

- 移除了过滤器 `filter`。

- 移除了`$children` 实例 `propert`。

  ......
