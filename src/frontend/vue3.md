# Vue3

1. MVVM架构(Model-View-ViewModel)
2. Composition API (组合式API)

## 1. 安装
1. 使用vite构建：`npm init vite@latest`
2. 使用vue-cli创建：`npm init vue@latest`

## 2. 模板语法 Vue指令

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

## 3. 虚拟DOM diff算法
## 4. 



## vue-router

### 1. 安装

### 2. 路由模式

### 3. 历史记录

### 4. 路由传参

- `query`：内容展示在url
- `params`：必须使用name不能使用路径 内容在内存

```vue
<!-- query -->
<!-- login.vue -->
<template>
    <div>列表页面</div>
    <table>
        <thead>
            <tr>
                <th>品牌</th>
                <th>价格</th>
                <th>操作</th>
            </tr>
        </thead>
        <tbody>
            <tr :key="item.id" v-for="item in data">
                <th>{{ item.name }}</th>
                <th>{{ item.price }}</th>
                <th>
                    <button @click="toDetail(item)">详情</button>
                </th>
            </tr>
        </tbody>
    </table>
</template>

<script setup lang="ts">

type Item = {
  name: string;
  price: number;
  id: number;
} 

import { data } from "./list.json";
import { useRouter } from "vue-router";

const router = useRouter()

const toDetail = (item:Item) => {
    router.push({
        path: '/reg',
        query:item
    })
}
</script>

<style scoped>
    .login {
        background-color: rebeccapurple;
        height: 400px;
        width: 400px;
        font-size: 20px;
        color: white;
    }
</style>

<!-- reg.vue -->
<template>
    <div>
    <button @click="router.back()">返回</button><h3>详情</h3>
    </div>
    <div>品牌：{{ route.query.name }}</div> // [!code highlight]
    <div>价格：{{ route.query.price }}</div> // [!code highlight]
    <div>ID：{{ route.query.id }}</div> // [!code highlight]
</template>

<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";

const route = useRoute()

const router = useRouter()
</script>

<style scoped>
    .reg {
        background-color: red;
        height: 400px;
        width: 400px;
        font-size: 20px;
        color: white;
    }
</style>
```
