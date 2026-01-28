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
arr.forEach(function (element, index, arr) {
    console.log(element, index, arr);
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


## 函数 没讲清楚有点问题 下来再找点知识看看
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
待补充

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
![原型链](../../assert/原型链.png)

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
![this](../../assert/this.png)


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
DOM是Document Object Model的缩写，即文档对象模型。DOM是HTML和XML文档的编程接口。DOM允许JavaScript创建、修改和删除HTML元素。

### 操作DOM
- `window`: 代表浏览器窗口
- `Navigator`: 封装了浏览器信息（大多数时候不建议使用）
- `location`: 当前页面的URL信息
- `document`: 当前页面内容
- `history`: 浏览器历史记录（不建议使用 现在使用Ajax）

### 获取DOM
归结到底就是：增删改查

- `getElementById()`: 根据id获取元素
- `getElementsByClassName()`: 根据类名获取元素
- `getElementsByTagName()`: 根据标签名获取元素
- `querySelector()`: 根据选择器获取元素
- `querySelectorAll()`: 根据选择器获取元素
- `document.body`: 获取body元素

```javascript
获取元素：
var element = document.getElementById('name'); 
var elements = document.getElementsByClassName('name'); 
var elements = document.getElementsByTagName('div');

element.innerHTML; // 获取元素内容
var childrens = element.children; // 获取父元素下所有子元素
var parent = element.parentNode;  // 获取父元素
var next = element.nextSibling; // 获取下一个兄弟元素

修改元素：
element.innerText = 'hello'; // 修改元素内容
element.innerHTML = '<h1>hello</h1>'; // 修改元素内容(可以解析HTML标签)
element.style.color = 'red'; // 修改元素样式
element.className = 'name'; // 修改元素类名
element.setAttribute('id', 'name'); // 添加属性

删除元素(步骤：先获取父元素，然后通过父元素删除自己)：
// 删除多个节点的时候，childrens是在时刻变化的
element.removeChild(); // 删除

添加元素：
// 如果我们获得的DOM元素是空的，那么通过innerHTML就会添加一个元素，如果这个DOM已经存在元素，那么通过innerHTML就会替换（覆盖）这个元素。
element.appendChild(xxx); // 追加元素
element.insertBefore(newNode, targetNode); // 添加元素
document.createElement('div'); // 创建一个新的div元素

示例：
var element = document.createElement('div'); // 创建一个div元素
element.innerHTML = 'hello'; // 添加内容
element.id = 'name'; // 添加id属性

// 创建一个标签元素:
var script = document.createElement('script');
script.setAttribute('src', 'https://cdn.bootcdn.net/ajax/libs/jquery/3.5.1/jquery.min.js');
```

### 操作表单

```javascript
// 1. 对于单选框 多选框 复选框等等xxx.value只能获取固定的值
var element = document.getElementById('name');
element.value; // 获取值
element.checked; // 获取复选框是否选中(返回值为true/false)

// 2. 提交表单（加密）
```

## DOM快速总结

JavaScript DOM（文档对象模型）操作是前端开发的核心技能。简单来说，DOM 就是让 JavaScript 能够**操作 HTML 页面**的接口。

要精通 DOM 操作，你需要系统地学习以下 **7 个核心板块** 的知识：

---

### 1. DOM 树与基本结构
在写代码之前，你需要理解浏览器的内部视图。
*   **节点树：** 理解 HTML 文档是如何被浏览器解析成树状结构的。
*   **节点类型：**
    *   `Element` (元素节点，如 `<div>`)
    *   `Text` (文本节点)
    *   `Comment` (注释节点)
    *   `Document` (文档节点)
*   **核心对象：** `window` (全局对象) 和 `document` (DOM 的入口)。

### 2. 元素的选择与查找
这是第一步，你要先“找到”元素才能操作它。
*   **现代标准方法 (必须掌握)：**
    *   `querySelector(selector)`: 选择匹配的第一个元素。
    *   `querySelectorAll(selector)`: 选择匹配的所有元素 (返回 NodeList)。
*   **传统方法 (了解原理，依然有用)：**
    *   `getElementById(id)`
    *   `getElementsByTagName(tagName)`
    *   `getElementsByClassName(className)`
*   **关系遍历：**
    *   父子节点：`parentNode`, `children`, `firstElementChild`, `lastElementChild`。
    *   兄弟节点：`previousElementSibling`, `nextElementSibling`。
    *   *注意：尽量避免使用 `childNodes` (包含空文本等) 和 `nextSibling`，通常使用带 Element 的版本。*

### 3. 元素内容的修改
获取到元素后，如何改变里面的文字或 HTML？
*   **文本操作：**
    *   `innerText` / `textContent`: 设置或获取纯文本（会自动转义 HTML 标签）。
    *   `innerHTML`: 设置或获取 HTML 代码（可解析标签，但有 XSS 安全风险）。
*   **元素属性操作：**
    *   `id`, `className`, `title`, `value` (表单元素) 等直接属性访问。
    *   `href`, `src` 等特殊属性的相对/绝对路径处理。
*   **样式操作：**
    *   内联样式：`element.style.color = 'red'` (驼峰命名法)。
    *   获取计算样式：`window.getComputedStyle(element)` (只读)。

### 4. 属性操作
区分“标准属性”和“自定义属性”。
*   **标准属性 (HTML 自带的)：**
    *   直接操作：`div.id`, `input.disabled = true`。
*   **通用方法 (任意属性)：**
    *   `getAttribute(name)`: 获取属性值。
    *   `setAttribute(name, value)`: 设置属性值。
    *   `removeAttribute(name)`: 移除属性。
    *   `hasAttribute(name)`: 检查是否存在。
*   **自定义数据属性：**
    *   `data-*` 属性。
    *   JS 中通过 `dataset` 对象访问 (如 `div.dataset.userId`)。

### 5. 类名 操作
现代开发主要靠 CSS 类来控制样式，而不是直接操作 `style`。
*   **属性方式：** `className` (字符串，替换所有类)。
*   **现代 API (推荐)：** `classList`
    *   `add(class1, class2)`: 添加类。
    *   `remove(class1)`: 移除类。
    *   `toggle(class)`: 有则删，无则加 (常用作开关)。
    *   `contains(class)`: 检查是否包含类。
    *   `replace(oldClass, newClass)`: 替换类。

### 6. 节点的增删改
动态改变页面结构。
*   **创建节点：**
    *   `document.createElement(tagName)`
    *   `document.createTextNode(text)`
*   **插入节点：**
    *   `appendChild(child)`: 在父节点末尾添加。
    *   `insertBefore(newNode, referenceNode)`: 在指定节点前插入。
    *   **现代 API：** `append()`, `prepend()`, `after()`, `before()` (支持多节点和字符串)。
*   **删除节点：**
    *   `removeChild(child)`: 传统方式。
    *   `remove()`: 现代方式，直接自杀 `element.remove()`。
*   **替换与克隆：**
    *   `replaceChild(newNode, oldNode)`
    *   `cloneNode(true/false)`: 克隆节点（参数为 true 时深度克隆子节点）。

### 7. DOM 事件
让页面“活”起来的关键。
*   **事件绑定：**
    *   HTML 属性 (不推荐)。
    *   `element.onclick = function` (只能绑定一个，不推荐)。
    *   **addEventListener** (标准，推荐)。
    *   `removeEventListener` (解绑)。
*   **事件对象：**
    *   `event.target`: 触发事件的源头元素。
    *   `event.currentTarget`: 绑定事件的元素。
    *   阻止默认行为：`event.preventDefault()` (如阻止链接跳转)。
    *   阻止冒泡：`event.stopPropagation()`。
*   **事件流：**
    *   **冒泡:** 从里向外。
    *   **捕获:** 从外向里。
    *   **事件委托:** 利用冒泡原理，将事件绑定在父元素上处理子元素事件（性能优化核心技巧）。
*   **常见事件类型：**
    *   鼠标：`click`, `dblclick`, `mouseenter/mouseleave` (不冒泡), `mouseover/mouseout` (冒泡), `mousemove`。
    *   键盘：`keydown`, `keyup`, `keypress`。
    *   表单：`submit`, `input`, `change`, `focus`, `blur`。
    *   文档/窗口：`DOMContentLoaded` (HTML 加载解析完成), `load` (资源全部加载完成), `scroll`, `resize`。

---

### 8. 进阶与性能
*   **DOM 重排与重绘：**
    *   理解修改 DOM 尺寸、位置会触发“重排”，消耗性能。
    *   优化技巧：批量读写、使用 `documentFragment` (文档片段) 进行批量插入。
*   **DOM 与 HTMLCollection / NodeList 的区别：**
    *   `HTMLCollection` 是实时的（页面变了，它自动变，如 `getElementsByTagName`）。
    *   `NodeList` 通常是静态的（如 `querySelectorAll`）。


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


