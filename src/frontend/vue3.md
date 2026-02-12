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