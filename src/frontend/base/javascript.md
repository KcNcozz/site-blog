# JavaScript


## 快速入门
### 1. 引入

- 内部标签使用
```html
<script>
    .....
</script>
```
- 外部引入使用 **一定使用双标签，不要使用单标签（可能出问题）**
```javascript
<script src="https://cdn.bootcss.com/jquery/3.2.1/jquery.min.js"></script>
```

### 2. 变量与数据类型
用Java的语法去写保证没问题，JavaScript严格区分大小写。
- number JavaScript不区分小数和整数。 `123` `123.2` 浮点数会有精度损失。 
- string `'abc'` `"abc"`
- boolean `true` `false`
- 与或非 `&&` `||` `!`
- 赋值： `=` 等于（类型不一样，值一样也会判断为true）：`==` 绝对等于（类型一样，值一样会判断为true）：`===`
- NaN `NaN` 只能通过 `isNaN()` 判断
- null `null` 空
- undefined `undefined` 未定义
- 数组 `[1, 2, 3, 'hello', true, null, undefined]` 索引从0开始, 索引越界会返回undefined
- 对象 `{name: 'hello', age: 18}`

```javascript
var person = {name: 'hello', 
              age: 18
              target: [1, 2, 3]
              }
```

### 3. 严格检查模式
`'use strict';` 严格检查模式，放在第一行。

## 数据类型

1. 字符串

```javascript
模板字符串：
var name = 'hello';
var age = 18;
var info = `my name is ${name}, age is ${age}`;

字符串长度：
var name = 'hello';
var length = name.length;

大小写转换：
var name = 'hello';
var upperName = name.toUpperCase();
var lowerName = name.toLowerCase();

获取索引：
var name = 'hello';
var index = name.indexOf('l');

获取子串：
var name = 'hello';
var subName = name.substring(1, 3); // [1, 3)
```

2. 数组 
Array可以存放任意数据类型。

```javascript
示例：
var arr = [1, 2, 3, 'hello', true, null, undefined];

获取数组长度：
var arr = [1, 2, 3, 'hello', true, null, undefined];
var length = arr.length;

如果给 arr.length赋值，数组长度会改变。如果赋值过小，数组会丢失，如果赋值过大，数组会扩展。

获取数组元素：
var arr = [1, 2, 3, 'hello', true, null, undefined];
var element = arr[0];
var element = arr[arr.length - 1];

获取下标索引：
var arr = [1, 2, 3, 'hello', true, null, undefined];
var index = arr.indexOf(3);

添加元素：
var arr = [1, 2, 3, 'hello', true, null, undefined];
arr.push(4); // 添加元素到尾部
arr.pop(); // 删除末尾的一个元素
arr.unshift('a', 'b'); // 添加元素到头部
arr.shift(); // 删除头部一个元素

截取数组（返回一个新的数组 类似于String中的substring）：
var arr = [1, 2, 3, 'hello', true, null, undefined];
var newArr = arr.slice(1, 3);
var newArr = arr.slice(1);

数组排序：
var arr = ['A', 'B', 'C'];
arr.sort();

元素翻转：
var arr = ['A', 'B', 'C'];
arr.reverse();

删除数组元素：
var arr = [1, 2, 3, 'hello', true, null, undefined];
arr.splice(1, 2);
arr.splice(1, 0, 'a', 'b');

拼接数组（会返回一个新的数组 不改变原数组）：
var arr = [1, 2, 3];
var newArr = arr.concat([4, 5, 6]);

连接符（使用特定的字符串符接数组元素）：
var arr = [1, 2, 3];
var str = arr.join('-');

多维数组：
var arr = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
]

获取多维数组元素：
var element = arr[1][1]; // 5

遍历数组：
for (var i = 0; i < arr.length; i++) {
    console.log(arr[i]);
}

遍历多维数组：
for (var i = 0; i < arr.length; i++) {
    for (var j = 0; j < arr[i].length; j++) {
        console.log(arr[i][j]);
    }
}
```

3. 对象

**JavaScript中键都是字符串，值可以是任意类型**

```javascript
示例：
var person = {name: 'hello',
              age: 18
              };

获取对象属性：
person.name // hello
person['name'] // hello
person.haha // undefined 使用键值访问属性时，如果键值不存在，会返回undefined

添加对象属性：
person.haha = 'haha';
person['haha'] = 'haha';

删除对象属性：
delete person.name; 
delete person['name'];

遍历对象：
for (var key in person) {
    console.log(key, person[key]);
}

判断属性是否存在：
if ('name' in person) {
    console.log('存在');
}

判断这个属性是否是对象自身拥有的属性：
if (person.hasOwnProperty('name')) {
    console.log('是');
}
```

4. Map和Set

Map和Set都是ES6新增的集合类型。Map和对象最大的区别是：对象键只能是字符串，Map键可以是任意类型。Set集合中不能有重复的元素，Map集合中可以有重复的元素。
```javascript
1. Map // 键值对
var map = new Map();
map.set('name', 'hello');
map.set(1, 'world');
map.set(true, 'haha');
map.set(null, 'null');
map.set(undefined, 'undefined');

通过key获取value：
map.set('hello'); // hello

设置键值对：
map.set("name", "Tom"); 

2. Set // 无序不重复集合
var set = new Set(); // set可以去重

添加元素：
set.add('hello');
set.add(1);

删除元素：
set.delete('hello');
set.delete(1);

是否包含某个元素：
if (set.has('hello')) {
    console.log('包含');
}
```

## 流程控制

直接上例子：
```javascript
var age = 18;
if (age >= 18) {
    console.log('可以投票');
} else if (age < 30) {
    console.log('可以投2票');
} else {
    console.log('不可以投票');
}

while (age < 100) {
    age++;
    console.log(age); // while循环会先判断条件再执行代码
}

do {
    age++;
    console.log(age);
} while (age < 100); // do while循环至少会执行一次  


for (var i = 0; i < 10; i++) {
    console.log(i);
}

foreach循环：
var arr = [1, 2, 3, 4, 5];
arr.forEach(function (element, index) {
    /**
     * element 当前元素
     * index 当前索引
     */
    console.log(element, index);
})

for-in循环：
var person = {
    name: 'hello',
    age: 18
        };
for (var key in person) { 
    // for-in是下标 for-of是值 迭代尽量都用for-of
        console.log(key, person[key]);
        // key为索引，person[key]为值
    }


switch (age) {
    case 18:
        console.log('可以投票');
        break;
    case 30:
        console.log('可以投2票');
        break;
    default:
        console.log('不可以投票');
        break;
}
```

### Iterator和 Generator

```javascript
1. Iterator // 迭代器
var arr = [1, 2, 3];
var iterator = arr[Symbol.iterator]();
```


## 函数
JavaScript可以传任意个参数，也可以忽略参数。`arguments`对象可以获取函数传递进来的参数。

```javascript
1. 定义函数
第一种方式（函数声明）：
sayHello(); // 可以在这里调用！因为函数声明会被"提升"到顶部。

function sayHello() {
    console.log("你好！");
}

最重要的特性是"提升"。可以在函数定义之前就调用它，因为它在代码运行前就被加载到内存中了。

第二种方式（函数表达式）：
// sayHi(); // 报错！因为这时候代码还没执行到赋值的那一行。

const sayHi = function() {
    console.log("嗨！");
};

本质上是把一个匿名函数赋值给了一个变量。它没有被提升，必须先定义后使用。现代开发更推荐这种写法，因为它能强制开发者按顺序写代码，减少逻辑混乱。

2. 箭头函数 (ES6 现代写法)
这是 ES6 (2015年) 引入的革命性语法，也是你现在最应该掌握的写法。它让代码变得极其简洁。

基本写法:
const add = (a, b) => {
    return a + b;
};

简写规则 (非常常用):
如果只有一行代码，可以省略大括号 {} 和 return:
const add = (a, b) => a + b; // 自动返回 a + b
如果只有一个参数，可以省略小括号 ():
const double = n => n * 2;
注意: 箭头函数不仅仅是语法糖，它在处理 this 指向问题时和普通函数完全不同（如果只是普通计算或处理数据，优先用箭头函数）
```

### 变量的作用域
JavaScript中变量的作用域是函数作用域。函数内部定义的变量，只在函数内部有效。函数外部定义的变量，可以在函数内部访问。函数内部定义的变量，会覆盖函数外部定义的变量。尽量用`let`， 避免使用`var`。常量：`const`，不能被修改。

- 全局作用域: 在函数外部声明的变量。在代码的任何地方都能访问到。
- 函数作用域 (局部): 在函数内部声明的变量。只能在函数内部访问，外面看不见。

```javascript
const globalVar = "我是全局的"; // 外部变量
function myFunction() {
    const localVar = "我是局部的"; // 内部变量
    console.log(globalVar); // 可以访问外部的
    console.log(localVar);  // 可以访问内部的
}
myFunction();
console.log(localVar); // 报错！外面访问不到内部的变量
```

### 闭包
```javascript
function outer() {
    let i = 1
    function fn() {
        console.log(i)
    }
return fn
}
const fun = outer()
fun() // 1
// 外层函数使用内部函数的变量

简写形式：
function outer() {
    let i = 1
    return function () {
        console.log(i)
    }
}

const fun = outer()
fun() // 调用
// 函数内部使用外部的变量
```

### 变量和函数提升

函数声明和变量声明（var）都会被提升到函数作用域的顶部。变量声明会被提升为 undefined，函数声明会被提升为函数。

总结：
1. 变量在未声明即被访问时会报语法错误
2. 变量在声明之前即被访问，变量的值为 `undefined`
3. `let` 声明的变量不存在变量提升，推荐使用 `let`
4. 变量提升出现在相同作用域当中
5. 实际开发中推荐先声明再访问变量

> 注：关于变量提升的原理分析会涉及较为复杂的词法分析等知识，而开发中使用 `let` 可以轻松规避变量的提升，因此在此不做过多的探讨，有兴趣可[查阅资料](https://segmentfault.com/a/1190000013915935)。


```javascript
// 调用函数
foo()
// 声明函数
function foo() {
    console.log('声明之前即被调用...')
  }

  // 不存在提升现象
bar()  // 错误
var bar = function () {
    console.log('函数表达式不存在提升现象...')
  }
```
总结：

1. 函数提升能够使函数的声明调用更灵活
2. 函数表达式不存在提升的现象
3. 函数提升出现在相同作用域当中

### 可变参数

```javascript
  // 求生函数，计算所有参数的和
  function sum() {
    // console.log(arguments)
    let s = 0
    for(let i = 0; i < arguments.length; i++) {
      s += arguments[i]
    }
    console.log(s)
  }
  // 调用求和函数
  sum(5, 10)// 两个参数
  sum(1, 2, 4) // 两个参数
```
得到一个伪数组

### 剩余参数
```javascript
  function config(baseURL, ...other) {
    console.log(baseURL) // 得到 'http://baidu.com'
    console.log(other)  // other  得到 ['get', 'json']
  }
  // 调用函数
  config('http://baidu.com', 'get', 'json');
```

1. `...` 是语法符号，置于最末函数形参之前，用于获取多余的实参
2. 借助 `...` 获取的剩余实参，是个真数组

### Date

```javascript
var date = new Date();
data.getFullYear(); // 获取年份
data.getMonth(); // 获取月份
data.getDate(); // 获取日期
data.getDay(); // 获取星期几
data.getHours(); // 获取小时
data.getTime(); // 获取时间戳
```

### JSON
在JavaScript中一切都是对象，任何JavaScript支持的类型都可以转为JSON。`JSON.stringify()`可以将对象转为JSON字符串。`JSON.parse()`可以将JSON字符串转为对象。


### 解构赋值

解构赋值是一种快速为变量赋值的简洁语法，本质上仍然是为变量赋值，分为数组解构、对象解构两大类型。

#### 数组解构

数组解构是将数组的单元值快速批量赋值给一系列变量的简洁语法，如下代码所示：

```javascript
  // 普通的数组
  let arr = [1, 2, 3]
  // 批量声明变量 a b c 
  // 同时将数组单元值 1 2 3 依次赋值给变量 a b c
  let [a, b, c] = arr
  console.log(a); // 1
  console.log(b); // 2
  console.log(c); // 3
```

总结：

1. 赋值运算符 `=` 左侧的 `[]` 用于批量声明变量，右侧数组的单元值将被赋值给左侧的变量
2. 变量的顺序对应数组单元值的位置依次进行赋值操作
3. 变量的数量大于单元值数量时，多余的变量将被赋值为  `undefined`
4. 变量的数量小于单元值数量时，可以通过 `...` 获取剩余单元值，但只能置于最末位
5. 允许初始化变量的默认值，且只有单元值为 `undefined` 时默认值才会生效

注：支持多维解构赋值，比较复杂后续有应用需求时再进一步分析

#### 对象解构

对象解构是将对象属性和方法快速批量赋值给一系列变量的简洁语法，如下代码所示：

```javascript
  // 普通对象
  const user = {
    name: '小明',
    age: 18
  };
  // 批量声明变量 name age
  // 同时将数组单元值 小明  18 依次赋值给变量 name  age
  const {name, age} = user

  console.log(name) // 小明
  console.log(age) // 18
```
例2：
```html
<body>
  <script>
    // 1. 这是后台传递过来的数据
    const msg = {
      "code": 200,
      "msg": "获取新闻列表成功",
      "data": [
        {
          "id": 1,
          "title": "5G商用自己，三大运用商收入下降",
          "count": 58
        },
        {
          "id": 2,
          "title": "国际媒体头条速览",
          "count": 56
        },
        {
          "id": 3,
          "title": "乌克兰和俄罗斯持续冲突",
          "count": 1669
        },

      ]
    }

    // 需求1： 请将以上msg对象  采用对象解构的方式 只选出 data 方面后面使用渲染页面
    const { data } = msg
    console.log(data)
    // 需求2： 上面msg是后台传递过来的数据，我们需要把data选出当做参数传递给 函数
    const { data } = msg
    // msg 虽然很多属性，但是我们利用解构只要 data值
    function render({ data }) {
      const { data } = arr
      // 我们只要 data 数据
      // 内部处理
      console.log(data)
    }
    render(msg)

    // 需求3， 为了防止msg里面的data名字混淆，要求渲染函数里面的数据名改为 myData
    function render({ data: myData }) {
      // 要求将 获取过来的 data数据 更名为 myData
      // 内部处理
      console.log(myData)
    }
    render(msg)
  </script>
```
总结：

1. 赋值运算符 `=` 左侧的 `{}` 用于批量声明变量，右侧对象的属性值将被赋值给左侧的变量
2. 对象属性的值将被赋值给与属性名相同的变量
3. 对象中找不到与变量名一致的属性时变量值为 `undefined`
4. 允许初始化变量的默认值，属性不存在或单元值为 `undefined` 时默认值才会生效

注：支持多维解构赋值

## 面向对象编程

- 面向对象原型模式：创建对象实例时，会先创建一个原型对象，然后基于原型对象创建对象实例。
- 面向对象class模式：创建对象实例时，会先创建一个类，然后基于类创建对象实例。（ES6开始支持）

```javascript
// 类
class Person {
    constructor(name, age) {
        this.name = name;
        this.age = age;
    }
 
    sayHello() {
        console.log('hello');
    }
}

var person = new Person('hello', 18);

// 继承
class Student extends Person {
    constructor(name, age, grade) {
        super(name, age);
        this.grade = grade;
    }
    study() {
        console.log('study');
    }
}
```
```javascript
示例：
const user = {
    // 属性
    name: "张三",
    age: 25,
    // 方法 (对象里的函数)
    sayHi: function() {
        console.log("大家好，我是" + this.name);
    },
    // ES6 简写方法 (推荐)
    introduce() {
        console.log(`我今年${this.age}岁`);
    }
};

console.log(user.name); // 访问属性：张三
user.sayHi();           // 调用方法：大家好，我是张三

对象的操作：
增/改：user.gender = "男";
删：delete user.age;
查：user.age 或者 user["age"] (注意后者是字符串索引，很灵活)。
```

> 原型链：对象实例会创建一个__proto__属性，这个属性指向对象实例的构造函数的原型对象。
![原型链](./../../../assert/原型链.png)

### this
一句话定义：`this` 指向“当前调用这个函数的那个对象”。它不取决于函数在哪里定义，而取决于谁在调用它。

1. 在对象方法中 (最常见)：
`this` 指向对象本身。

```javascript
const person = {
    name: "李四",
    eat: function() {
        console.log(this.name + " 在吃饭"); // 这里的 this 指向 person
    }
};
person.eat(); // 输出：李四 在吃饭
```
2. 在普通函数中：
如果不是对象的方法，而是普通调用，`this` 在严格模式下是 `undefined`，非严格模式下指向**全局对象 (window)**。

```javascript
function test() {
    console.log(this); 
} 
test(); // 也就是 window.test()，所以 this 指向 window
```
3. 在箭头函数中 (关键区别)：
箭头函数没有自己的 `this` 它会捕获外层作用域的 `this`。

```javascript
const obj = {
    name: "王五",
    regularFunc: function() { setTimeout(function() { console.log(this.name) }, 100) }, // undefined (丢失了 this)
    arrowFunc: function() { setTimeout(() => { console.log(this.name) }, 100) } // 王五 (继承了外层的 this)
};
// 这一点非常关键，在定时器和事件回调中极常遇到
```

::: warning `this`关键字的用法(第1点)
可以把它当做Java中的this使用 `this`指向的是当前对象(使用它的人)。在JavaScript中可以改变`this`指向。 
:::
![this](/assert/this.png)


### 改变this指向

以上归纳了普通函数和箭头函数中关于 `this` 默认值的情形，不仅如此 JavaScript 中还允许指定函数中 `this` 的指向，有 3 个方法可以动态指定普通函数中 `this` 的指向：

#### call

使用 `call` 方法调用函数，同时指定函数中 `this` 的值，使用方法如下代码所示：

```html
<script>
  // 普通函数
  function sayHi() {
    console.log(this);
  }

  let user = {
    name: '小明',
    age: 18
  }

  let student = {
    name: '小红',
    age: 16
  }

  // 调用函数并指定 this 的值
  sayHi.call(user); // this 值为 user
  sayHi.call(student); // this 值为 student

  // 求和函数
  function counter(x, y) {
    return x + y;
  }

  // 调用 counter 函数，并传入参数
  let result = counter.call(null, 5, 10);
  console.log(result);
</script>
```

总结：

1. `call` 方法能够在调用函数的同时指定 `this` 的值
2. 使用 `call` 方法调用函数时，第1个参数为 `this` 指定的值
3. `call` 方法的其余参数会依次自动传入函数做为函数的参数

#### apply

使用 `call` 方法**调用函数**，同时指定函数中 `this` 的值，使用方法如下代码所示：

```html
<script>
  // 普通函数
  function sayHi() {
    console.log(this)
  }

  let user = {
    name: '小明',
    age: 18
  }

  let student = {
    name: '小红',
    age: 16
  }

  // 调用函数并指定 this 的值
  sayHi.apply(user) // this 值为 user
  sayHi.apply(student) // this 值为 student

  // 求和函数
  function counter(x, y) {
    return x + y
  }
  // 调用 counter 函数，并传入参数
  let result = counter.apply(null, [5, 10])
  console.log(result)
</script>
```

总结：

1. `apply` 方法能够在调用函数的同时指定 `this` 的值
2. 使用 `apply` 方法调用函数时，第1个参数为 `this` 指定的值
3. `apply` 方法第2个参数为数组，数组的单元值依次自动传入函数做为函数的参数

#### bind

`bind` 方法并**不会调用函数**，而是创建一个指定了 `this` 值的新函数，使用方法如下代码所示：

```html
<script>
  // 普通函数
  function sayHi() {
    console.log(this)
  }
  let user = {
    name: '小明',
    age: 18
  }
  // 调用 bind 指定 this 的值
  let sayHello = sayHi.bind(user);
  // 调用使用 bind 创建的新函数
  sayHello()
</script>
```

注：`bind` 方法创建新的函数，与原函数的唯一的变化是改变了 `this` 的值。


## 异步编程

JavaScript 是**单线程**的，意味着它同一时间只能做一件事。如果它去下载一张图片（耗时5秒），如果不处理异步，网页就会卡死5秒钟，用户什么都点不了。

为了解决这个问题，JS 采用了**“事件循环”** 机制，把任务分为：**同步任务**（主线程，马上做）和 **异步任务**（挂起，做完再做）。

#### 1. 定时器
最简单的异步体验。

```javascript
console.log("1. 开始");

setTimeout(() => {
    console.log("2. 这里是异步代码，2秒后才执行");
}, 2000);

console.log("3. 结束");

// 输出顺序：1 -> 3 -> 2
// 解释：JS 不会傻傻等 2 秒，而是先把 setTimeout 放一边（宏任务），继续执行下面的代码，等时间到了再回来执行。
```

#### 2. Promise（重要）
以前为了处理异步，我们会把函数套在函数里（回调函数）。如果步骤一多，代码就会变成金字塔形状（回调地狱），难以维护。Promise 就是为了解决这个问题诞生的。

- **三种状态**：
    *   `Pending` (进行中)
    *   `Resolved` (已成功)
    *   `Rejected` (已失败)

- **基本用法**：
    Promise 是一个承诺：我可能会成功，也可能会失败，稍后告诉你结果。

    ```javascript
    const mockRequest = () => {
        return new Promise((resolve, reject) => {
            // 模拟网络请求...
            const isSuccess = true;
            
            setTimeout(() => {
                if (isSuccess) {
                    resolve("请求成功！数据是..."); // 成功时调用 resolve
                } else {
                    reject("请求失败！网络错误");   // 失败时调用 reject
                }
            }, 1000);
        });
    };
    
    // 使用 Promise
    mockRequest()
        .then(data => {
            console.log(data); // 如果成功，执行这里
        })
        .catch(err => {
            console.log(err); // 如果失败，执行这里
        });
    ```

- **链式调用**：
这是 Promise 最强大的地方。如果你有两个任务，必须按顺序做完（比如：先拿到用户ID，再去拿用户详情），就需要链式调用。

**规则**：`.then()` 里面返回一个新的 Promise，下一个 `.then()` 就会等待这个新 Promise 完成后再执行。

```javascript
模拟登录：
function step1() {
    return new Promise((resolve) => {
        setTimeout(() => resolve("用户ID: 888"), 1000);
    });
}

function step2(userId) {
    return new Promise((resolve) => {
        setTimeout(() => resolve(`拿到 ${userId} 的详细资料`), 1000);
    });
}

// 开始链式调用
step1()
    .then((id) => {
        console.log("第一步结果：" + id);
        // 关键点：返回一个 Promise，把结果传给下一个 then
        return step2(id); 
    })
    .then((details) => {
        console.log("第二步结果：" + details); 
        // 只有 step2 完成了，这里才会运行
    })
    .catch((err) => {
        // 上面任何一步出错，都会直接跳到这里，中间的 .then 不会执行
        console.log("出错了：" + err);
    });
```


#### 3. Async / Await（ES7）
这是 Promise 的语法糖。它的出现让异步代码写得**像同步代码一样直观**。这是目前最主流的写法。

*   **规则**：
    1.  `async` 写在函数定义前面，表示这是个异步函数。
    2.  `await` 只能在 `async` 函数内部使用，表示“**等待**”这个 Promise 返回结果。
    3.  等待期间，JS 引擎可以去处理别的事情（不阻塞）。

```javascript
async function handleData() {
    console.log("开始获取数据...");

    try {
        // await 会暂停函数执行，直到 Promise 返回结果
        // 这看起来像同步代码，但其实它是非阻塞的
        const data = await mockRequest(); 
        console.log("拿到了数据 -> " + data);
        
        // 可以继续 await 下一个请求
        const data2 = await mockRequest(); 
        
    } catch (error) {
        console.log("出错了：" + error);
    }
}

handleData();
```

## JavaScript DOM

### 1. 查找节点

获取页面元素是操作 DOM 的第一步。

#### 1.1 标准选择器 (推荐)
现代浏览器主要使用 `querySelector` 和 `querySelectorAll`，语法类似于 CSS 选择器。

*   **`document.querySelector(selector)`**: 返回匹配到的**第一个**元素。如果没有匹配则返回 `null`。
*   **`document.querySelectorAll(selector)`**: 返回所有匹配元素的 **NodeList**（类数组对象）。如果没有匹配则返回空的 `NodeList`。

```javascript
// 获取 ID 为 btn 的元素
const btn = document.querySelector('#btn');

// 获取所有 class 为 item 的元素
const items = document.querySelectorAll('.item');

// 获取第一个 p 标签
const firstP = document.querySelector('p');
```

#### 1.2 传统 getElement 系列 (效率稍高，但功能单一)
*   **`document.getElementById(id)`**: 通过 ID 获取元素。
*   **`document.getElementsByClassName(className)`**: 通过类名获取（返回 HTMLCollection，**实时更新**）。
*   **`document.getElementsByTagName(tagName)`**: 通过标签名获取（返回 HTMLCollection，**实时更新**）。

> **注意：** `querySelectorAll` 返回的是静态 `NodeList`（获取后 DOM 变化不影响结果），而 `getElementsBy...` 返回的是动态 `HTMLCollection`（DOM 变化会自动反映在集合中）。

---

### 2. 修改内容与属性

获取元素后，可以对其进行修改。

#### 2.1 修改文本内容
*   **`element.textContent`**: 设置或获取元素及其后代的**纯文本**内容（不解析 HTML 标签）。
*   **`element.innerText`**: 类似于 `textContent`，但会触发重排，且受 CSS 样式（如 `display: none`）影响。**推荐使用 `textContent`**。
*   **`element.innerHTML`**: 设置或获取元素的 **HTML 内容**（解析标签）。**注意：存在 XSS 安全风险，不要插入不可信的用户输入。**

```javascript
const div = document.querySelector('div');

div.textContent = '<strong>Hello</strong>'; // 显示为纯文本：<strong>Hello</strong>
div.innerHTML = '<strong>Hello</strong>';   // 显示为粗体：Hello
```

#### 2.2 修改样式
*   **`element.style.property`**: 修改**行内样式**（优先级高）。属性名使用驼峰命名法（如 `backgroundColor` 而不是 `background-color`）。
*   **`element.className`**: 替换整个 class 字符串。
*   **`element.classList`**: 专门用于操作类名的 API，非常强大。

```javascript
div.style.color = 'red';
div.style.fontSize = '16px';

// classList 操作
div.classList.add('active');      // 添加类
div.classList.remove('hidden');   // 移除类
div.classList.toggle('open');     // 有则删，无则加
div.classList.contains('open');   // 检查是否存在
```

#### 2.3 修改属性
*   **`element.getAttribute(attr)`**: 获取属性值。
*   **`element.setAttribute(attr, value)`**: 设置属性值。
*   **`element.removeAttribute(attr)`**: 移除属性。

```javascript
const link = document.querySelector('a');
link.setAttribute('href', 'https://www.example.com');
link.getAttribute('target'); // 返回 "_blank"
```

---

### 3. 节点增删改 (DOM 结构操作)

动态改变页面结构是 DOM 操作最强大的地方。

#### 3.1 创建节点
*   **`document.createElement(tagName)`**: 创建元素节点。
*   **`document.createTextNode(text)`**: 创建文本节点（较少用）。
*   **`document.createDocumentFragment()`**: 创建文档片段（用于性能优化，见下文）。

```javascript
const newLi = document.createElement('li');
newLi.textContent = '我是新列表项';
```

#### 3.2 插入节点
*   **`parentNode.appendChild(child)`**: 将子节点添加到父节点的**末尾**。
*   **`parentNode.insertBefore(newNode, referenceNode)`**: 将新节点插入到参考节点之前。
*   **`element.prepend()`**: 插入到父节点的**开头**。
*   **`element.after()` / `element.before()`**: 插入到元素的后面/前面。

```javascript
const ul = document.querySelector('ul');
ul.appendChild(newLi); // 添加到列表末尾

// 插入到第一个元素之前
const firstItem = ul.querySelector('li');
ul.insertBefore(newLi, firstItem); 
```

#### 3.3 删除节点
*   **`parentNode.removeChild(child)`**: 传统方法。
*   **`element.remove()`**: 现代方法，直接删除自身。

```javascript
ul.removeChild(newLi);
// 或者
newLi.remove();
```

#### 3.4 替换与克隆
*   **`parentNode.replaceChild(newChild, oldChild)`**: 替换节点。
*   **`element.cloneNode(true)`**: 克隆节点。参数为 `true` 时深拷贝（克隆后代节点），`false` 时浅拷贝。

---

### 4. DOM 遍历 (节点关系)

通过相对位置查找节点。

*   **`parentNode`**: 父节点。
*   **`children`**: 所有子元素（不包括文本节点和注释）。
*   **`firstElementChild` / `lastElementChild`**: 第一个/最后一个子元素。
*   **`previousElementSibling` / `nextElementSibling`**: 上一个/下一个兄弟元素。
*   **`closest(selector)`**: 从当前元素开始，沿 DOM 树向上查找匹配选择器的**最近祖先**（包括自身）。

> 注意：避免使用 `firstChild` 或 `nextSibling`，因为它们可能获取到空白文本节点。请使用带有 `Element` 关键字的属性。

```javascript
const item = document.querySelector('.item');
const parentUl = item.closest('ul'); // 找到最近的 ul 祖先
```

---

### 5. 事件处理

让页面对用户操作做出反应。

#### 5.1 添加事件监听
*   **`addEventListener(event, handler, options)`**: 最推荐的方式。
    *   **event**: 事件名（如 `'click'`, 不加 `on`）。
    *   **handler**: 回调函数。
    *   **options**: 可选配置，如 `{ once: true }` (只触发一次) 或 `{ passive: true }` (优化滚动性能)。

```javascript
btn.addEventListener('click', function(event) {
    console.log('按钮被点击了');
    // event.target 触发事件的元素
});
```

#### 5.2 事件冒泡与捕获
*   **冒泡**: 事件从目标元素向上传递到 window。
*   **捕获**: 事件从 window 向下传递到目标元素（`addEventListener` 第三个参数设为 `true` 开启）。

#### 5.3 事件委托
**非常重要**。利用事件冒泡机制，将事件监听器加在父元素上，而不是每个子元素上。这大大提高了性能，特别是对于动态添加的元素。

```javascript
// 场景：给 ul 里的 10000 个 li 绑定点击事件
// ❌ 错误做法：循环给每个 li 绑定，性能极差
// li.forEach(item => item.addEventListener(...))

// ✅ 正确做法：只给 ul 绑定
ul.addEventListener('click', (e) => {
    if (e.target.tagName === 'LI') { // 判断点击的是否是 li
        console.log('你点击了:', e.target.textContent);
    }
});
```

---

### 6. 性能优化

DOM 操作是昂贵的（因为它会导致浏览器重排 Reflow 和重绘 Repaint），以下技巧至关重要：

1.  **减少 DOM 操作次数**: 尽量合并多次修改。
    *   **批量修改样式**: 不要频繁修改 `style.color`，而是修改 `className` 或直接操作 `style.cssText`。
2.  **使用 DocumentFragment (文档片段)**:
    如果要在循环中插入大量节点，先将它们插入到内存中的 `DocumentFragment`，最后一次性插入到 DOM。
    ```javascript
    const fragment = document.createDocumentFragment();
    for (let i = 0; i < 1000; i++) {
        const li = document.createElement('li');
        li.textContent = `Item ${i}`;
        fragment.appendChild(li); // 此时还在内存中，不触发重排
    }
    ul.appendChild(fragment); // 只触发一次重排
    ```
3.  **避免 `layout thrashing` (布局抖动)**:
    不要交替读写 DOM。
    *   *Bad*: 读 offsetHeight -> 写 style.height -> 读 offsetHeight...
    *   *Good*: 读 offsetHeight -> 读 offsetWidth -> 写 style.height...

### 操作表单

```javascript
// 1. 对于单选框 多选框 复选框等等xxx.value只能获取固定的值
var element = document.getElementById('name');
element.value; // 获取值
element.checked; // 获取复选框是否选中(返回值为true/false)

// 2. 提交表单（加密）
```


## 模块化

**模块化** 简单来说，就是**把一个大型的 JavaScript 文件拆分成很多个小的、独立的文件，然后再把它们组合起来**。

这就好比搭乐高积木：
- **没有模块化**：你把所有积木熔化成一大坨塑料（所有代码写在一个几万行的 `main.js` 里），想找一个功能的代码都要翻半天，而且变量名极容易冲突。
- **有模块化**：你有车轮模块、底盘模块、引擎模块。它们各司其职，需要用到轮子的时候，直接“引入”轮子模块即可。

目前前端最常用的是 **ES6 Modules** 标准。

---

### 1. 核心概念：导出 与 导入

想象一下：
- 文件 A 是一家**面包店**，它负责生产面包（提供功能）。
- 文件 B 是**顾客**，它需要吃面包（使用功能）。

#### 场景一：我只想导出一个东西
如果一个文件只提供一个核心功能（比如一个工具函数，或者一个类），使用**默认导出**。

**文件：`utils.js` (面包店)**
```javascript
const calculateTax = (amount) => {
    return amount * 0.1;
};

// 默认导出：一个文件只能有一个 default
export default calculateTax; 
```

**文件：`main.js` (顾客)**
```javascript
// 导入的时候，名字可以随便起，因为它知道你导入的是那个唯一的 default
import myTaxFunction from './utils.js';

console.log(myTaxFunction(100)); // 10
```

#### 场景二：我想导出很多个东西
如果一个文件提供了很多工具函数，使用**命名导出**。

**文件：`mathUtils.js`**
```javascript
// 直接在变量声明前加 export
export const add = (a, b) => a + b;
export const subtract = (a, b) => a - b;

// 或者也可以集中导出：
// const multiply = (a, b) => a * b;
// export { multiply };
```

**文件：`main.js`**
```javascript
// 导入时，名字必须和导出时的一模一样！用大括号包裹
import { add, subtract } from './mathUtils.js';

console.log(add(1, 2));
```

#### 场景三：混合导入 (最常见)
如果你觉得每次写 `{ add, subtract }` 很烦，你可以给所有导出的东西起一个别名。

```javascript
// * 代表所有，as allMath 是别名
import * as allMath from './mathUtils.js'; 

console.log(allMath.add(1, 2));
console.log(allMath.subtract(5, 3));
```

---

### 2. 为什么要模块化？

1.  **作用域隔离**：
    - 每个模块都有自己独立的作用域。
    - 模块 A 里的 `let name = "张三"` 不会影响模块 B 里的 `let name = "李四"`。不用担心全局变量污染了！

2.  **代码复用**：
    - 写好一个通用的 `formatDate.js`，你的博客项目可以用，你的商城项目也可以用。直接 `import` 进来就行。

3.  **依赖管理**：
    - 代码之间的关系变得清晰。看文件头部的 `import` 你就知道这个文件依赖谁，维护起来极其方便。

---

### 3. 历史

在 ES6 (`import/export`) 统一江湖之前，JavaScript 还有两套古老的模块化方案，你在维护**老项目**（比如 2015 年前的代码）或者学习 Node.js 时可能会遇到：

*   **CommonJS** (Node.js 环境):
    *   使用 `require()` 导入。
    *   使用 `module.exports` 导出。
    *   *注：Node.js 现在也在慢慢转向支持 ES6 模块。*
*   **AMD / CMD** (RequireJS 时代):
    *   这是更古老的前端浏览器方案，现在基本很少见了。

---

### 4. 注意事项

1.  **必须在 HTML 中声明 `type="module"`**
    如果你在浏览器直接引入 JS 文件，必须这样写：
    ```html
    <script type="module" src="main.js"></script>
    ```
    - 如果不加 `type="module"`，浏览器会报错，说 `import` 语句不存在。
    - 加了之后，这个 JS 文件就会自动变成**严格模式**，且支持延迟加载（`defer`）。

2.  **浏览器兼容性**
    现代浏览器都支持 ES6 模块，但如果你需要兼容非常老的浏览器（如 IE11），你需要配合打包工具（如 Webpack）把模块化代码编译成浏览器能懂的旧代码。


## 防抖与节流

1. 防抖（debounce）  
所谓防抖，就是指触发事件后在 n 秒内函数只能执行一次，如果在 n 秒内又触发了事件，则会重新计算函数执行时间  
- lodash库中有 `debounce` 函数来实现防抖功能
```javascript
box.addEventListener('mousemove', __debounce(mousemove, 500))
```
2. 节流（throttle）  
所谓节流，就是指连续触发事件但是在 n 秒中只执行一次函数
- lodash库中有 `throttle` 函数来实现节流功能
` 函数来实现防抖功能
```javascript
box.addEventListener('mousemove', __throttle(mousemove, 500))
```

## ES6总结

### 1. 变量声明：`let` 和 `const`
ES6 之前只有 `var`，它只有**函数作用域**（容易导致变量污染）。ES6 引入了**块级作用域**。

*   **`const`**: 常量。声明后不能重新赋值（推荐优先使用）。
*   **`let`**: 变量。可以被重新赋值。

```javascript
// 旧写法
var name = "XiaoMing";

// 新写法
let age = 18;
const birthYear = 2005;

age = 19; // 正确
// birthYear = 2006; // 报错！无法给常量重新赋值
```

### 2. 箭头函数（lambda表达式）
提供了更简洁的函数写法，并且**不绑定自己的 `this`**（它会捕获其所在上下文的 `this` 值，解决了 `this` 指向混乱的问题）。

```javascript
// 传统函数
function add(a, b) {
  return a + b;
}

// 箭头函数
const add = (a, b) => a + b;

// 如果只有一个参数，括号可以省略
const double = n => n * 2;

// 箭头函数可以直接返回一个对象
const fn = (uname) => ({ uname: uname })
console.log(fn('刘德华'))

this指向问题：
// 以前this的指向：  谁调用的这个函数，this 就指向谁
console.log(this)  // window

// 普通函数
function fn() {
    console.log(this)  // window
}
window.fn()

// 对象方法里面的this
const obj = {
    name: 'andy',
    sayHi: function () {
    console.log(this)  // obj
    }
}
    obj.sayHi()

// 箭头函数的this  是上一层作用域的this 指向
const fn = () => {
    console.log(this)  // window
}
fn()
// 对象方法箭头函数 this
    const obj = {
      uname: 'pink老师',
      sayHi: () => {
        console.log(this)  // this 指向谁？ window
      }
    }
    obj.sayHi()

const obj = {
    uname: 'pink老师',
    sayHi: function () {
    console.log(this)  // obj
    let i = 10
    const count = () => {
        console.log(this)  // obj 
    }
    count()
    }
}
obj.sayHi()
```

### 3. 模板字符串
使用反引号 `` ` `` 代替引号。可以直接换行，并使用 `${}` 插入变量或表达式。告别繁琐的 `+` 号拼接。

```javascript
const user = "李华";
const greeting = `你好，${user}！`; // 插入变量

const result = `1 + 1 等于 ${1 + 1}`; // 插入表达式
```

### 4. 解构赋值
一种快速从数组或对象中提取值并赋给变量的语法。

**对象解构：**
```javascript
const person = { name: "Bob", age: 20, city: "Beijing" };

// 只提取 name 和 age
const { name, age } = person;

console.log(name); // "Bob"
```

**数组解构：**
```javascript
const numbers = [1, 2, 3];

const [first, second] = numbers;

console.log(second); // 2
```

### 5. 展开运算符与剩余参数 (`...`)
`...` 这个语法非常强大，根据上下文不同有两种用法。

**展开:** 将数组或对象“展开”成单个元素。
```javascript
const arr1 = [1, 2];
const arr2 = [...arr1, 3, 4]; // 结果: [1, 2, 3, 4]

// 合并对象
const obj = { a: 1 };
const newObj = { ...obj, b: 2 }; // { a: 1, b: 2 }
```

**剩余:** 将多个元素收集到一个数组中。
```javascript
function sumAll(...numbers) {
  return numbers.reduce((total, num) => total + num, 0);
}

sumAll(1, 2, 3, 4); // 这里 numbers 变成了 [1, 2, 3, 4]
```

### 6. 数组的高阶方法
虽然这些方法在 ES6 之前就存在，但在 ES6 时代配合箭头函数使用最为广泛。

*   **`map`**: 映射，把数组里的每一项经过处理生成一个新数组。
*   **`filter`**: 过滤，筛选出符合条件的项。
*   **`reduce`**: 汇总，将数组计算为一个值。

```javascript
const nums = [1, 2, 3, 4, 5];

// 所有数字乘以 2
const doubled = nums.map(n => n * 2); // [2, 4, 6, 8, 10]

// 筛选出偶数
const evens = nums.filter(n => n % 2 === 0); // [2, 4]
```

### 7. 默认参数
在函数定义时直接给参数设置默认值，不再需要 `a = a || 1` 这种hack写法。

```javascript
function multiply(a, b = 1) {
  return a * b;
}

multiply(5);    // 返回 5 (使用了默认的 b=1)
multiply(5, 2); // 返回 10
```

### 8. 模块化
这是现代前端开发的基础。允许将代码拆分成多个文件。

**导出:**
```javascript
// utils.js
export const PI = 3.14;
export function add(a, b) { return a + b; }
```

**导入:**
```javascript
// main.js
import { PI, add } from './utils.js';
```

### 9. 类
ES6 引入了 `class` 关键字，让面向对象编程的写法更像 Java 或 C++（虽然底层依然是基于原型的）。

```javascript
class Animal {
  constructor(name) {
    this.name = name;
  }

  speak() {
    console.log(`${this.name} 发出了叫声`);
  }
}

const dog = new Animal("旺财");
dog.speak(); // "旺财 发出了叫声"
```

### 10. Promise
Promise 是异步编程的一种解决方案，比传统的回调函数更合理、更强大。它解决了“回调地狱”的问题。

```javascript
const fetchData = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve("数据获取成功！");
    }, 1000);
  });
};

fetchData().then(data => {
  console.log(data); // 1秒后打印 "数据获取成功！"
});
```

### 补充：对象属性简写
如果你的对象属性名和变量名一样，你可以简写：

```javascript
const a = 1;
const b = 2;

// 旧写法: { a: a, b: b }
// 新写法:
const obj = { a, b }; // { a: 1, b: 2 }
```

