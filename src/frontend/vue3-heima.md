## 自定义hooks

> Hooks的目的？

Hooks是将同一个功能的数据和方法在一起（模块化）。本质是一个函数，把`setup`函数中使用的`Composition API`进行了封装

::: code-group

```ts [useSum.ts]
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

```ts [useDog.js]
import { reactive, onMounted } from "vue";
import axios, { AxiosError } from "axios";

export default function () {
  let dogList = reactive<string[]>([]);

  // 方法
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

  // 挂载钩子
  onMounted(() => {
    getDog();
  });

  //向外部暴露数据
  return { dogList, getDog };
}
```

:::

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

## router (路由)

## pinia (状态管理)

## 组件通信

## 插槽

##
