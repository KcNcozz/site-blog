# 黑马vue3

## Setup语法糖

```typescript
// 不使用setup语法糖
export default {
    setup() {
        let name = 'zhangsan',
        age = 18
        return {
            name, age
        }
    }
}
// 使用setup语法糖
let name = 'zhangsan',
age = 18
```

## ref (响应式)

ref可以创建基本数据的响应式数据，也可以创建对象类型的响应式数据。

### ref创建基本类型的响应式数据

- ref()：创建一个响应式数据
- 模板里面不用`.value`，但是在js/ts中操作`ref()`包裹的值，需要`.value`
- 是一个RefImpl对象

```typescript
<script setup lang="ts">
    import { ref } from 'vue'
    let name = ref('zhangsan'),
    age = ref(18)

    function changeAge() {
        age += 1
    }
</script>
```

### ref创建对象类型的响应式数据

```typescript
<script setup lang="ts">
    import { ref } from 'vue'
    let car = ref({
        name: 'car',
        price: 1000
    })

    function changePrice() {
        car.value.price += 1000 // 这里和reactive不同 这里需要.value
    }
</script>
```

## reactive (响应式)


- reactive()：创建一个对象类型的响应式数据
- 是一个Proxy代理对象（响应式对象）
- 可以是对象，数组，函数....

```typescript
    import { reactive } from 'vue'
    let car = reactive({
        name: 'car',
        price: 1000
    })

    function changePrice() {
        car.price += 1000
    }
```
```typescript
    import { reactive } from 'vue'
    let games = reactive([
        {name: 'Dota2', price: 0.01, id: 1},
        {name: 'LOL', price: 0.02, id: 2},
        {name: 'CSGO', price: 0.03, id: 3},
        {name: 'Valorant', price: 0.04, id: 4},
        {name: 'Apex', price: 0.05, id: 5},
    ])
    
    function changeFirstGameName(){
           if (games[0]){
            games[0].name = 'Dota2-new'
        }
    } 

```

## ref和reactive的区别

- `ref`创建的变量必须使用`.value`（可以使用`volar`插件自动添加`.value`）。
- `reactive`重新分配一个新对象，会**失去**响应式（可以使用`Object.assign`去整体替换）。

```typescript
// 解决办法
    import { reactive } from 'vue'
    let car = reactive({
        name: 'car',
        price: 1000
    })

    function changeCar() {
        // car = { name: 'binz', price: 2000 } 不会更新页面
        // car = reactive({ name: 'binz', price: 2000 }) 不会更新页面
        Object.assign(car, { name: 'binz', price: 2000 }) // 页面更新
    }
```

1. 若需要一个基本类型的响应式数据，必须使用`ref`。
2. 若需要一个响应式对象，层级不深，`ref`、`reactive`都可以。
3. 若需要一个响应式对象，且层级较深，推荐使用`reactive`。


## toRefs、toRef

- 将一个响应式对象中的每一个属性，转换为`ref`对象。（例如解构后的属性，仍具有响应式）
- `toRefs`与`toRef`功能一致，但`toRefs`可以批量转换。

```typescript
  import {ref,reactive,toRefs,toRef} from 'vue'

  // 数据
  let person = reactive({name:'张三', age:18, gender:'男'})
	
  // 通过toRefs将person对象中的n个属性批量取出，且依然保持响应式的能力
  let {name,gender} =  toRefs(person)
	
  // 通过toRef将person对象中的gender属性取出，且依然保持响应式的能力
  let age = toRef(person,'age')

  // 方法
  function changeName(){
    name.value += '~'
  }
  function changeAge(){
    age.value += 1
  }
  function changeGender(){
    gender.value = '女'
  }
```

## computed (计算属性)

> 单向绑定(`v-bind`)：只能从数据源到页面，不能从页面到数据源。 `v-model` (双向绑定)

- 根据已有数据计算出新数据
- 计算属性有缓存功能，计算属性的值，会基于依赖的数据进行缓存。

```typescript
  import {ref,computed} from 'vue'

  let firstName = ref('zhang')
  let lastName = ref('san')

  // 计算属性——只读取，不修改
  /* let fullName = computed(()=>{
    return firstName.value + '-' + lastName.value
  }) */


  // 计算属性——既读取又修改
  let fullName = computed({
    // 读取
    get(){
      return firstName.value + '-' + lastName.value
    },
    // 修改
    set(val){
      console.log('有人修改了fullName',val)
      firstName.value = val.split('-')[0]
      lastName.value = val.split('-')[1]
    }
  })

  function changeFullName(){
    fullName.value = 'li-si'
  } 
```

## watch (监听)

watch只能监视以下四种数据：
1. `ref`定义的数据。
2. `reactive`定义的数据。
3. 函数返回一个值（`getter`函数）。
4. 一个包含上述内容的数组。