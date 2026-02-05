# Typescript

上手即用：
1. 创建项目：`npm init -y`
2. 创建ts文件：`tsc --init`

## 1. 数据类型

### 基础类型

同javascript一致

### 任意类型

- any 任意类型
- unknown 未知类型

数据类型顺序：
1. any unknown 
2. Object
3. Number String Boolean
4. number string boolean
5. `'123'` `123`
6. never

unknown只能赋值给自身或者any，unknown类型无法去读属性，方法也不可以调用，因此unknown比any更安全。

## 2. Object、object、{}

Object：所有的原始类型和对象类型都指向Object。

object：object类型只能是引用类型，不能是原始类型。
例如：  
123 '123' true ❌️    
{}  []  `() => 123` ✅️ 

{}：同Object，可以理解为new Object()

## 3. 接口(interface)和对象类型

```typescript
inferface Person extends B {
    name: string;
    age?: number; // 可选属性
    readonly id: number; // 只读属性
    readonly test => boolean; // 只读
    [property: string]: any; // 任意属性 索引签名
}

interface B {
    xxx: string;
}

let person: Person = {
    id: 1,
    name: '张三',
    age: 18
    test: () => true
    xxx: 'xxx'
}
```
1. 遇到重名的interface，会进行合并
2. 索引签名：`interface Person { [property: string]: any }`
3. `?`和`readonly`：可选属性和只读
4. 接口继承
5. 用interface定义函数类型
```typescript
interface Function {
    (name:string): number[];
}

const fn: Function = function (name: string) { 
    return [1,2,3]
     }
```

## 4. 数组类型

```typescript
// 定义数组的方式(2种)
let arr: number[] = [1,2,3]
let arr: Array<number> = [1,2,3]

// 定义对象数组
inferface A {
    name: string;
    age?: number;
}

let arr: A[] = [{name: '张三'}, {name: '111'}]

// 定义二维数组(2种)
let arr: number[][] = [[1,2,3], [4,5,6]]
let arr: Array<Array<number>> = [[1,2,3], [4,5,6]]

// 多种类型的数组
let arr: any[] = [1, '2', true, {}]
let arr: [number, string] = [1, '2']
let arr: (string | number)[] = [1, '2', 3]

// 数组在函数中的用法
function fn(...args: number[]) {
    console.log(arguements)
    let a: IArguments = arguments // 定义伪数组
}
fn(1,2,3)
```
1. 定义数组的方式(2种)
2. 定义二维数组(2种)
3. 多种值类型的数组
4. 数组在函数中的用法（定义伪数组）

## 5. 函数类型
```typescript
// 1. 定义函数参数和返回值
function add(a: number, a: number): number {
    return a + b
}
consle.log(add(1,2))

const add = (a: number, b: number): number => a + b
consle.log(add(1,2))

// 2. 函数的默认值和可选参数
function add(a: number = 10, a?: number): number {
    return a + b
}
// 3. 如何定义参数类型是对象的函数
inferface A {
    name: string;
    age: number;
}

function xx(a: A): A {
    return a
}
// 4. this 
interface A {
    user: number[];
    add(this: A, num: number) => void;
}

let a: A = {
    user: [1,2,3],
    add(this: A, num: number) {
        this.user.push(num)
    }
}
A.add(4)

// 5. 函数重载
let user: number[] = [1,2,3]

fuction findNum(add: number[]): number[] // 如果传入的是number数组 就是添加
fuction findNum(id: number): number[] // 如果传入了id就是单个查询
fuction findNum(): number[] // 如果没有id就是查询全部
function findNum(ids?: number | number[]): number[] {
    if (typeof ids === 'number') {
        return user.filter(item => item === ids)
    } else if(Array.isArray(ids)) {
        user.push(...ids)
        return user
    } else {
        return user
    }
}
```

1. 定义函数参数和返回值
2. 函数的默认值和可选参数（默认值和可选参数不能同时使用）
3. 如何定义参数类型是对象的函数
4. this ts可以定义this类型，必须是第一个参数定义this的类型
5. 函数重载

## 6. 类型断言 联合类型 交叉类型

```typescript
// 联合类型
let a: number | string = '1' // 联合类型

let fn = function (a: number | boolean):boolean { 
    return 1!!a
}

// 交叉类型
inferface People {
    name: string;
    age: number;
}

inferface Man {
    sex: number;
}


const a = (p: People & Man): void => {
    console.log()
}

a({
    name: '张三', 
    age: 18, 
    sex: 1
    })

// 类型断言
// 1.
let fn = function (a: number | string): void {
    console.log((a as string).length)
} 
fn('1231231231312')

// 2. 
inferface A {
    run: string;
}
inferface B {
    buy: string;
}

let fn = (tpye: A | B): void => {
    console.log((tpye as A).run)
    onsole.log((<A>tpye).run)
}

fn({
    buy: '123123123123'
})
```

## 7. 内置对象

```typescript
// 1.ECMAScript
let a: Number = new Number(1)
let date: Date = new Date()
let reg: RegExp = new RegExp('123')
let error: Error = new Error('123')


// 2. DOM
let div: HTMLDivElement = document.getElementById('div')
let div: NodeList = document.querySelectorAll('footer')
let div: NodeListOf<HTMLDivElement | HTMLElement> = document.querySelectorAll('div footer')

// 3. BOM
let location: Storage = localStorage
let location: Location = location
let promise: Promise<string> = new Promise((resolve, reject) => {'resolve'})
let cookie: string  = document.cookie
```
代码雨：

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <style>
        * {
            margin: 0;
            padding: 0;
            overflow: hidden; 
        }
    </style>
    <script src="./main.ts" type="module"></script>
    <canvas id="canvas"></canvas>
</body>
</html>
```

```typescript
let canvas: HTMLCanvasElement = document.querySelector('canvas') as HTMLCanvasElement;
let ctx: CanvasRenderingContext2D = canvas.getContext('2d') as CanvasRenderingContext2D;
canvas.width = screen.availWidth;
canvas.height = screen.availHeight;

let str: string[] = 'Hello World'.split('');
let arr = Array( Math.ceil(canvas.width / 10)).fill(0)
console.log(arr);

const rain = () => { 
    ctx.fillStyle = 'rgba(0,0,0,0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#0f0';
    arr.forEach((item, index) => {
        ctx.fillText(str[Math.floor(Math.random() * str.length)] as string, index * 10, item + 10 );
        arr[index] = item > canvas.height || item > 10000 * Math.random() ? 0 : item + 10;
    });
}

setInterval(rain, 50);
```

## 8. 类

```typescript
// 1. class基本用法 继承 约束类型
inferface Options { 
    el: string | HTMLElement;
}    

inferface VueCls { 
    options: Options;
    init(): void;
}

class Vue extends Dom implements VueCls { // 对类进行约束
    options: Options;
    constructor(options: Options) {
        super(); // 父类的prototype.constructor.call()
        this.options = options;
        this.init();
    }
    init(): void {
        // 虚拟dom: 通过js渲染真实的dom
        let data: Vnode = { 
            tag: 'div',
            children: [
                {
                    tag: 'section',
                    text: '子节点1'
                },
                {
                    tag: 'section',
                    text: '子节点1'
                }
            ]
        },
        this.render(data);
        let app = typeof this.options.el == 'string' ?  document.querySelector() : this.options.el;
        app.appendChild(this.rander(data));
    }
}

const vue = new Vue({
    el: '#app',
})

// 实现虚拟dom
inferface Vnode { 
    tag: string; // 标签名
    text?: string; // 文本
    children?: Vnode[];
}

class Dom {
    // 创建节点方法
    createElement(el: string): HTMLElement { 
        return document.createElement(el);
    }
    // 创建文本方法
    setText(el: string, text: string | null) { 
        el.textContent = text;
    }
    // 渲染
    render(data: Vnode) { 
        let root = this.createElement(data.tag);
        if(data.children && Array.isArray(data.children)) {
            data.children.forEach(item => { 
                let child = this.render(item);
                root.appendChild(child);
            })
        } else {
            this.setText(root, data.text);
        }

        return root;
    }

}
// 2. class修饰符 readonly private protected public （Java）
// 3. 静态方法
static xxx() { 

}

static vis { 
    this.xxx
    return '1111'
}
// 4. super()原理 父类的prototype.constructor.call()
// 5. get set

class Ref {
    _value: any;
    constructor(value: any) { 
        this._value = value;
    }

    get value() { 
        return this._value + '111'; 
    }

    set value(newValue: any) { 
        this._value = newValue + '112';
    }
}

const ref = new Ref('123'); 
console.log(ref.value); // '123111'

```

1. class基本用法 继承 约束类型
2. class修饰符 readonly private protected public （Java）
    - readonly 只读属性
    - private 私有属性 自己内部使用
    - protected 保护属性 自己内部可以使用 子类继承的可以使用
    - public 公有属性 默认
3. super()原理
4. 静态方法
5. get set

## 9. 抽象类 基类

```typescript
// 定义抽象类
// 抽象类不允许被实例化
abstract class Animal { 
    name: string;
    constructor(name?: string) { 
        this.name = name;
    }

    getName: string() { // 没加abstract 可以实现
        return this.name;
     }

    abstract init(name: string): void; // 只能描述
}

class Dog extends Animal {
    constructor() { 
        super();
    }
    init(name: string) {

    }
    setName(name: string) { 
        this.name = name;
    }
 }

const dog = new Dog();
dog.setName('Dog');
```
抽象类：
    - 抽象类不允许被实例化
    - 可以使用派生类去继承抽象类
    - 派生类可以被实例化

## 10. 元组

```typescript
let arr: [string, number] = ['123', 123];

let readonly arr1: [string, number] = ['123', 123];

let readonly arr2: [x:string, y?:boolean] = ['123'];
 
type first = typeof arr2[0];
type length = typeof arr2['length'];
```

## 11. 枚举

```typescript
// 1. 数字枚举
enum Color {
    red, // 默认从0开始
    blue,
    yellow
}

enum Color {
    red = 1, 
    blue, // 2
    yellow // 3
}
// 2. 字符串枚举
enum Color {
    red = 'red',
    blue = 'blue',
    yellow = 'yellow'
}

// 3. 接口枚举
enum Color {
    red = 1, 
    blue, // 2
    yellow // 3
}

interface A {
    red: Color.red,
}

let obj:A = {
    red: Color.red
}

// 4. const 枚举
 const enum Color {
    red = 1, 
    blue = 2;
 }

 // 5. 反向映射(value -> key)
enum Types {
    success
}
let success: number = Types.success;
console.log(success); // 0
let key = Types[success];
console.log(key); // success
```
- 数字枚举
- 字符串枚举
- 接口枚举
- const 枚举
- 反向映射(value -> key) 字符串不支持

## 12. 类型推断和类型别名

ts天然支持类型推断。

```typescript
type s = string | number;
let name: s = '123';


// 和interface的区别：
type a = number[] | string;
interface B {

}
inferface A extends B {
    name: string | number;
}

// extends 是包含
// 左边的值会作为右边类型的子类型
type num = 1 extend number ? 1 : 0;
```
类型从上到下：![ts类型](/assert/ts.png)


## 13. never

never类型表示的是那些永不存在的值的类型。

```typescript
// 无法存在的类型
type a = string & number;

// 抛出异常
function aaa(): never { 
    throw new Error('111');
}

// 无限循环
function bbb(): never { 
    while(true) { 
        console.log('111');
    }
}

// 兜底逻辑
type A = '唱' | '跳' | 'rap' | '篮球';
function kun(value: A) {
    switch(value) { 
        case '唱':
            console.log('111');
            break;
        case '跳':
            console.log('222');
            break;
        case 'rap':
            console.log('333');
            break;
        case '篮球':
            console.log('444');
            break;
        default:
            // 兜底逻辑
            const error: never = value;
    }
 }
```

## 14. symbol类型

```typescript
// 基本使用
let a1: symbol = Symbol(1); // 唯一的
let a2: symbol = Symbol(1);
conmsole.log(a1, a2); // Symbol(1) Symbol(1)
console.log(a1 === a2); // false
console.log(a1 == a2); // false

// for会在全局symbol找是否注册过这个key 如果有就直接拿来用 不会创建新的
console.log(Symbol().for('1111') === Symbol().for('1111') ); // true

// 具体使用场景
let obj = { 
    name: 1,
    // 索引签名（Index Signature）允许你定义对象可以使用任意键来访问属性的类型。(当你不知道对象的所有属性名，但知道属性值的类型时)
    // 索引签名允许你定义对象可以使用动态属性名访问的类型。它用于描述那些属性名不确定，但值类型确定的对象。
    [a1]: 2,
    [a2]: 3
}

// for in 不能读到symbol
for(let key in obj) { 
    console.log(key);
}

// keys 不能读到symbol
console.log(Object.keys(obj));

// getOwnPropertyNames 不能读到symbol
console.log(Object.getOwnPropertyNames(obj));

// getOwnPropertySymbols 可以读到symbol
console.log(Object.getOwnPropertySymbols(obj));

// 同时读到symbol和name
console.log(Reflect.ownKeys(obj)); // [ 'name', Symbol(1), Symbol(2) ]
```
1. 基本使用
2. 索引签名
3. 读symbol

## 15. 迭代器 生成器

```typescript
// 1. 生成器（和迭代器用法一样）
function* gen() {  // 定义生成器
    yield Promise.resolve(1); // 同步 异步
    yield '111'
    yield '222'
    yield '333'
}

const gen = gen(); // 返回generator对象
console.log(gen.next()); // 必须调用next方法 才会执行yield后面的代码 { value: 1, done: false }
console.log(gen.next()); // { value: '111', done: false }
console.log(gen.next()); // { value: '222', done: false }
console.log(gen.next()); // { value: '333', done: false }
console.log(gen.next()); // { value: undefined, done: true }

// 2. 迭代器(支持遍历所有数据类型 包括伪数组)
const each = (value: any) => {
    let Iterator: any = value[Symbol.iterator]();
    let next:any = {done: false}
    while(!next.done) { 
        next = Iterator.next();
        if(!next.done) { 
            console.log(next.value);
        }
    }
 }

// 3. set 和 map
let set:Set<number> = new Set([1, 2, 3, 4, 5]); // 集合（和数组的区别：天然去重）

let map:Map<any, any> = new Map(); // 字典的属性名可以是任意类型 包括数组
let arr = [1, 2, 3, 4, 5];
map.set(arr, '111');

function args() { 
    console.log(arguments); // 伪数组
}

let list = document.querySelectorAll('div'); // 伪数组

// 4. 迭代器语法糖 for...of
for (let value of set) {
    console.log(value);
}

// 5.解构的底层原理也是迭代器
let [a, b, c] = [1, 2, 3];
console.log(a, b, c);

let a = [4, 5, 6]
let copy = [...a];
console.log(copy); // [4, 5, 6]

// 6. for...of 如何支持对象
let obj = { 
    max: 10,
    current: 0,
    [symbol.iterator]() { 
        return { 
        max: this.max;
        current: this.current;
            next() { 
                return { 
                    if(this,current == max) {
                        return { 
                            value: undefined,
                            done: true
                        }
                    } else {
                        return { 
                            value: this.current++,
                            done: false
                        }
                     }
                }
            }
        }
    }
}
for (let value of obj) { 

}

```

1. 生成器
2. 迭代器
3. set 和 map
    - set：集合（和数组的区别：天然去重）
    - map：字典（和对象区别：对象属性名只能是字符串，字典的属性名可以是任意类型） 
4. arguements
5. 迭代器语法糖 for...of
6. for...of 对象不可使用
7. 数组解构：数组解构的底层原理也是迭代器
8. for...of 如何支持对象

## 16. 泛型

```typescript
// 动态类型
function fn(a:number, b:number):Array<number> {
    retrurn [a, b];
 }
function fn(a:string, b:string):Array<string> {
    retrurn [a, b];
 }
// 使用泛型优化 T 表示任意类型可以随意起
function fn<T>(a:T, b:T):Array<T> {
    retrurn [a, b];
 }
fn<number>(1, 2);
fn<string>('1', '2');
 
// interface和type都可以定义泛型
type A<T> = string | number | T;

let a:A<boolean> = true;

interface B<T> { 
   msg: T;
}

let b:B<string> = { 
   msg: "success"
}

// 高级用法
function fn<T = number, V = number>(a:T, b:V):Array<T | V> {
    return [a, b];
}

add(1, false)

// 使用场景
const axios = {
    get<T>(url: string): Promise<T> {
        return new Promise<T>((resolve, reject) => {
            let xhr: XMLHttpRequest = new XMLHttpRequest();
            xhr.open('get', url);
            xhr.onreadystatechange = () => {
                if(xhr.readyState === 4 && xhr.status === 200) {
                    resolve(JSON.parse(xhr.responseText)); // xhr.responseText返回的是一个字符串 使用JSON.parse()转为对象
                 }
            }
            xhr.send(null);
         })
    }
}

interface Data {
    message: string;
    code: number;
}

axios.get<Data>('https://api.github.com/users/github').then(res => {
    console.log(res.message);
    console.log(res.code);
})
```

## 17. 泛型约束
泛型约束：使用extends关键字 extends 后添加约束条件
```typescript
// 1. 泛型约束
function add<T extends number> (a:T, b:T) { 
    return a + b;
}
add(1, 2);

// 2. 泛型约束类型范围
interface Len { 
    length: number;
}
function fn<T extends Len>(a:T) { 
    a.length
}
fn('1');
fn([1, 2, 3]);

// 3. 泛型约束对象
let obj = {
    name: 'aaaaa',
    sex: 'male',
}
// keyof 获取对象属性名

function ob<T extends object, K extends keyof T>(obj:T, key:K) {
   return obj[key];
}

ob(obj, 'name');


interface Data {
   name: string;
   age: number;
   sex: string;
   }

// for in   for(let key in obj)
type Options<T extends object> = {
    [key in keyof T]?: T[key];
    // readonly [key in keyof T]: T[key];
  }

type B = Options<Data>
```
## 18. tsconfig.json

通过`tsc --init`命令生成`tsconfig.json`文件

```json
"compilerOptions": {
  "incremental": true, // TS编译器在第一次编译之后会生成一个存储编译信息的文件，第二次编译会在第一次的基础上进行增量编译，可以提高编译的速度
  "tsBuildInfoFile": "./buildFile", // 增量编译文件的存储位置
  "diagnostics": true, // 打印诊断信息 
  "target": "ES5", // 目标语言的版本
  "module": "CommonJS", // 生成代码的模板标准
  "outFile": "./app.js", // 将多个相互依赖的文件生成一个文件，可以用在AMD模块中，即开启时应设置"module": "AMD",
  "lib": ["DOM", "ES2015", "ScriptHost", "ES2019.Array"], // TS需要引用的库，即声明文件，es5 默认引用dom、es5、scripthost,如需要使用es的高级版本特性，通常都需要配置，如es8的数组新特性需要引入"ES2019.Array",
  "allowJS": true, // 允许编译器编译JS，JSX文件
  "checkJs": true, // 允许在JS文件中报错，通常与allowJS一起使用
  "outDir": "./dist", // 指定输出目录
  "rootDir": "./", // 指定输出文件目录(用于输出)，用于控制输出目录结构
  "declaration": true, // 生成声明文件，开启后会自动生成声明文件 index.d.ts
  "declarationDir": "./file", // 指定生成声明文件存放目录
  "emitDeclarationOnly": true, // 只生成声明文件，而不会生成js文件
  "sourceMap": true, // 生成目标文件的sourceMap文件 
  // 文件会生成一个sourceMap文件，sourceMap文件会与目标文件对应，sourceMap文件中会记录目标文件的源代码，方便调试
  "inlineSourceMap": true, // 生成目标文件的inline SourceMap，inline SourceMap会包含在生成的js文件中
  "declarationMap": true, // 为声明文件生成sourceMap
  "typeRoots": [], // 声明文件目录，默认时node_modules/@types
  "types": [], // 加载的声明文件包
  "removeComments":true, // 删除注释 
  "noEmit": true, // 不输出文件,即编译后不会生成任何js文件
  "noEmitOnError": true, // 发送错误时不输出任何文件
  "noEmitHelpers": true, // 不生成helper函数，减小体积，需要额外安装，常配合importHelpers一起使用
  "importHelpers": true, // 通过tslib引入helper函数，文件必须是模块
  "downlevelIteration": true, // 降级遍历器实现，如果目标源是es3/5，那么遍历器会有降级的实现
  "strict": true, // 开启所有严格的类型检查
  "alwaysStrict": true, // 在代码中注入'use strict'
  "noImplicitAny": true, // 不允许隐式的any类型
  "strictNullChecks": true, // 不允许把null、undefined赋值给其他类型的变量
  "strictFunctionTypes": true, // 不允许函数参数双向协变
  "strictPropertyInitialization": true, // 类的实例属性必须初始化
  "strictBindCallApply": true, // 严格的bind/call/apply检查
  "noImplicitThis": true, // 不允许this有隐式的any类型
  "noUnusedLocals": true, // 检查只声明、未使用的局部变量(只提示不报错)
  "noUnusedParameters": true, // 检查未使用的函数参数(只提示不报错)
  "noFallthroughCasesInSwitch": true, // 防止switch语句贯穿(即如果没有break语句后面不会执行)
  "noImplicitReturns": true, //每个分支都会有返回值
  "esModuleInterop": true, // 允许export=导出，由import from 导入
  "allowUmdGlobalAccess": true, // 允许在模块中全局变量的方式访问umd模块
  "moduleResolution": "node", // 模块解析策略，ts默认用node的解析策略，即相对的方式导入
  "baseUrl": "./", // 解析非相对模块的基地址，默认是当前目录
  "paths": { // 路径映射，相对于baseUrl
    // 如使用jq时不想使用默认版本，而需要手动指定版本，可进行如下配置
    "jquery": ["node_modules/jquery/dist/jquery.min.js"]
  },
  "rootDirs": ["src","out"], // 将多个目录放在一个虚拟目录下，用于运行时，即编译后引入文件的位置可能发生变化，这也设置可以虚拟src和out在同一个目录下，不用再去改变路径也不会报错
  "listEmittedFiles": true, // 打印输出文件
  "listFiles": true// 打印编译的文件(包括引用的声明文件)
},
 
// 指定一个匹配列表（属于自动指定该路径下的所有ts相关文件）
"include": [
   "src/**/*"
],
// 指定一个排除列表（include的反向操作）
 "exclude": [
   "demo.ts"
],
// 指定哪些文件使用该配置（属于手动一个个指定文件）
 "files": [
   "demo.ts"
]
```

## 19. namespace命名空间

TypeScript提供了namespace避免全局变量造成的污染
```typescript
// 1. 命名空间的用法嵌套抽离 导出 简化 

// namespace 所有的变量和方法必须导出才能访问
namespace Test {
    export let a = 1;
    export const add = (a: number, b: number) => a + b;
    export namespace Test2 { // 嵌套命名空间
        export let b = 2;
    }
}

namespace Test { // 命名空间合并
     export let c = 3;
} 

// 导出
export { Test };
// 导入
import { Test } from "./test";

// 简化
import a = Test.Test2; // 命名空间合并
console.log(a.b);

// 2. 合并命名空间的案例
// 跨端的项目 h5、Android 、iOS 、小程序...

namespace ios {
    export const pushNotification = (message: string, type: number) => {
        console.log("pushNotification")
    };
}

namespace android {
    export const pushNotification = (message: string) => {

    }
    export const callPhone = (phone: string) => {
        console.log("callPhone")
    }   
}
```

1. 命名空间的用法嵌套抽离 导出 简化 
2. 合并命名空间的案例

## 20. 模块解析

1. Commonjs - > Nodejs
```javascript
// 导入
require("xxx");
require("../xxx.js");
// 导出
exports.xxxxxx= function() {};
module.exports = xxxxx;
```
2. AMD - > requirejs
```javascript
// 定义
define("module", ["dep1", "dep2"], function(d1, d2) {...});
// 加载模块
require(["module", "../app"], function(module, app) {...});
```
3. CMD ->  seaJs
```javascript
define(function(require, exports, module) {
  var a = require('./a');
  a.doSomething();
  
  var b = require('./b');
  b.doSomething();
});
```
4. UMD ->  UMD是AMD和CommonJS的糅合
```javascript
(function (window, factory) {
    // 检测是不是 Nodejs 环境
	if (typeof module === 'object' && typeof module.exports === "objects") {
        module.exports = factory();
    } 
	// 检测是不是 AMD 规范
	else if (typeof define === 'function' && define.amd) {
        define(factory);
    } 
	// 使用浏览器环境
	else {
        window.eventUtil = factory();
    }
})(this, function () {
    //module ...
});
```
nodejs现在支持ESM规范。

```typescript
// 1. 默认导出 可以导出任意类型 一个模块只能有一个默认导出
// test.ts
export default 1; //  1 {} [] function

// 导入 如果是默认导出 名字随便起
import xxx from "./test";
console.log(xxx); // 1

// 2. 分别导出
// test.ts
export default {
    a: 1
};
export let x = 2;
export function add(a: number, b: number) { 
    return a + b;
}
export let arr = [1, 2, 3];

// 导入
import xxx,{add, arr} from "./test";
console.log(xxx); // {a: 1}
console.log(add(1, 2)); // 3
console.log(arr); // [1, 2, 3]

// 3. 解构导出
// test.ts
let x = 2;
let add = (a: number, b: number) { 
    return a + b;
}
let arr = [1, 2, 3];
export { 
    x,
    add,
    arr
}
// 导入
import {x, add as add2, arr} from "./test"; // as 支持别名
console.log(x); // 2
console.log(add2(1, 2)); // 3
console.log(arr); // [1, 2, 3]

// 4. 当不知道导出的变量名时
import * as test from "./test";
console.log(test); // 查看所有导出的内容 {default: {a: 1}, x: 2, add: function, arr: [1, 2, 3]}

// 5. 动态引入
// import只能在最上层使用
if (true) {
    import("./test").then(res => {
        console.log(res);
    }) // 此时import是一个函数 返回一个promise对象
}
```
1. 默认导出 可以导出任意类型 一个模块只能有一个默认导出
2. 分别导出
3. 解构导出

## 21. 声明文件 (declare)

当使用第三方库时，我们需要引用它的声明文件，才能获得对应的代码补全、接口提示等功能。声明文件是ts用来描述js文件的，ts会自动去查找声明文件，如果找不到会报错。解决方法（以express为例）：

- 使用`npm i @types/express -D`
- 自己编写声明文件 在typings文件夹下创建一个express.d.ts文件
    ```typescript
    // index.ts
    const app = express();
    const router = express.Router();

    app.use('/api', router);
    router.get('/ap', (req: any, res: any) => {
        // req 读取参数
        // // res 返回数据
        res.json({
            code: 200,
            data: 'hello world'
        })
    })

    app.listen(3000, () => {
        console.log('server is running at http://localhost:3000');
    })

    // express.d.ts
    declare module 'express' {

        interface Router {
            get(path:string, handler:(req:any, res:any)=>void): void;
        } 
        interface App {
            use(path:string, router:any): void;
            listen(port:number, callback?:()=>void);
        }
        interface Express {
            (): App;
            Router(): Router;
        }
        const express: Express;

        // 可以扩充变量、函数、类
        export default aaab;

        export class aaab1 {

        }
    }

    declare var a: any;
    ```

## 22. Mixins混入

1. 对象混入 合并 A对象 B对象 合并到一起
2. 类的混入 A类 B类 合并到一起

```typescript
// 1. 对象混入 合并 A对象 B对象 合并到一起
interface A {
    age: number;
}

interface B {
    name: string;
}

let a: A = { 
    age: 18
};

let b: B = {
    name: '张三'
}

// (1) 扩展运算符 浅拷贝 返回一个新的类型
let c = {...a, ...b};
console.log(c); // {age: 18, name: '张三'}
// (2) Object.assign 浅拷贝 返回交叉类型
let c2 = Object.assign({}, a, b); 
console.log(c2); // {age: 18, name: '张三'} 

// 2. 类的混入 A类 B类 
// 插件类型的混入

class Logger {
    log(message: string) {
        console.log(message);
    }
 }
 class Html {
    render() {
        console.log('render');
    }
  }
class App {
    run() {
        console.log('app run');
    }
}

type Custructor<T> = new (...args: any[]) => T;
function mixin<T extends Custructor<App>>(Base:T) {
    return class extends Base {
        private logger = new Logger();
        private html = new Html();
        constructor(...args: any[]) {
            super(...args);
            this.logger = new Logger();
            this.html = new Html();
        }
        run() {
            this.logger.log('app run');
        }
        render() {
            this.logger.log('app render');
            this.html.render();
        }
    }
}
const mixinapp = mixin(App);
const app = new mixinapp();

app.run();
```

## 23. 装饰器 (decorator)

需要在配置tsconfig.json文件设置`"experimentalDecorators": true`和`"emitDecoratorMetadata": true`

1. 类装饰器
2. 属性装饰器
3. 参数装饰器
4. 方法装饰器
5. 装饰器工厂
6. import 'reflect-metadata' 反射
7. axios

```typescript
// 1. 类装饰器
const Base: ClassDecorator = (target) => {
    // target ******返回的是构造函数******
    console.log(target); // class Http 
    target.prototype.run = '1111' // 可以在不破坏原本类结构的基础上添加属性
    target.prototype.fn = function() { // 添加方法
        console.log('aaaa');
    }
 }

@Base
class Http {
    // .....
}

const http = new Http() as any;
http.fn(); // aaaa
console.log(http.run); // 1111  

// 2. 装饰器工厂
const Base = (name: string) => { // 函数柯里化
        const fn: ClassDecorator = (target) => {
        console.log(target); 
        target.prototype.run = name;
        target.prototype.fn = function() { 
        console.log('aaaa');
        }
    }
    return fn;
}

@Base('xxxxxx')
class Http {
    // .....
}

const http = new Http() as any;
console.log(http.run); // xxxxxx

// 3. 方法装饰器

const Get = (url: string) => {
    const fn: MethodDecorator = (target, key, descriptor) => {
        console.log(target); // {} 原型对象
        console.log(key); // getList 方法名
        console.log(descriptor); // {value: ƒ, writable: true, enumerable: false, configurable: true} 描述符
        axios.get(url).then(res => {
            descriptor.value = res.data;
        })
    }
    return fn;

}
class Http {
    @Get('www.baidu.com')
    getList(data: any) {
        console.log(data.result.list);
    }

    @Post()
    create() {

    }
}

// 4. 参数装饰器
const Get = (url: string) => {
    const fn: MethodDecorator = (target:any, _:any, descriptor) => {
        console.log(target); // {} 原型对象
        console.log(key); // getList 方法名
        console.log(descriptor); // {value: ƒ, writable: true, enumerable: false, configurable: true} 描述符
        const key = Reflect.getMetadata('key', target);
        axios.get(url).then(res => {
            descriptor.value(key ? res.data[key] :res.data);
        })
    }
    return fn;

}

const Result = () => {
    const fn: ParameterDecorator = (target, key, index) => {
        Reflect.defineMetadata('key', 'result', target);
        console.log(target); // {} 原型对象 
        console.log(key); // getList 方法名
        console.log(index); // 0 参数索引
    }
    return fn;
}

class Http {
    @Get('www.baidu.com')
    getList( @Result() data: any) {
        console.log(data);
    }

    @Post()
    create() {

    }
}

// 5. 属性装饰器
const Name: PropertyDecorator = (target, key) => {
    console.log(target); // {} 原型对象
    console.log(key); // abc 属性名
}

class Http {
    @Name() // 属性装饰器
    abc: string;
    constructor() {
        this.abc = '123';
    }
    @Get('www.baidu.com')
    getList( @Result() data: any) {
        console.log(data);
    }

    @Post()
    create() {

    }
}
```

## 24. webpack构建ts+vue3项目

项目结构：
```javascript
root
|- index.html
|- tsconfig.json
|- webpack.config.js
|- src
|   |- App.vue
|   |- main.ts
|   |- shim.d.ts
```

1. 配置tsconfig.json文件：

```json
{
    "compilerOptions": {....},
    "include": [
        "src/**/*"
    ]
}
```

2. 安装依赖
    - `npm i webpack webpack-cli -D`
    - `npm i webpack-dev-server -D`

3. 配置package.json文件：
```json
"scripts": {
    "dev": "webpack-dev-server",
    "build": "webpack"
}
```

4. 配置webpack.config.js文件：
- 安装`npm i ts-loader -D`
- 安装`npm i typescript -D`
```javascript
const { Configuration } = require('webpack');
const path = require('node:path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { VueLoderPlugin } = require('vue-loader');

/** 
 * @type {Configuration} 
 */
const config = {
    stats: 'errors-only', // 只显示错误
    mode: 'development', // 开发模式
    entry: './src/main.ts', // 入口文件
    output: { // 输出文件
        path: path.resolve(__dirname, 'dist'), // 生成目录
        filename: 'bundle.js' // 打包之后的文件名
    },
    plugins: [ // 插件 webpack插件都是class 都需要new
        new HtmlWebpackPlugin({
            template: './index.html'
        })
    ]
    module: { 
        rules: [
            {
                test: /\.ts$/, // 匹配文件
                use: {
                    loader: 'ts-loader', // 使用ts-loader
                    options: { // ts-loader配置项
                        appendTsSuffixTo: [/\.vue$/]
                    }
                }
            }，
            {
                test: /\.vue$/,
                use: "vue-loader"
            },c  
            {
                test: /\.css$/,
                use: ['css-loader', 'style-loader']  // 从右向左解析
            }
        ]
    }
};
module.exports = config;
```

5. 安装vue3依赖：`npm i vue`

6. 安装：`npm i html-webpack-plugin -D`

7. 安装：`npm i vue-loader -D`

```typescript
// main.ts
import { createApp } from 'vue';
import App from './App.vue';

createApp(App).mount('#app');

// index.html
<div id="app">
</div>
```

```typescript
// shim.d.ts
declare module '*.vue' {
    import { DefineComponent } from 'vue'
    const component: DefineComponent<{}, {}, any>
    export default component
}
```

8. 支持css：`npm i css-loader -D` `npm i style-loader -D`


## 25. 发布订阅模式

> 什么是发布订阅模式？

发布订阅模式是设计模式的一种，也叫观察者模式，是一种一对多的关系，一个对象A发布信息，对象B、C、D都订阅这个信息，当对象A发布信息时，对象B、C、D都会收到这个信息。发布订阅模式广泛被使用，面试经常问这个，并且需要手写发布订阅模式。

有很多功能使用发布订阅模式：vue2中的事件监听，electron中的ipcRenderer，dom2中的addEventListener事件监听。

```typescript
document.addEventListener('click', () => {
    console.log('点击了');
})

// 1. 创建自定义事件

// 监听器
document.addEventListener('aaa', () => { 
    console.log('点击了');
}, {
    once: true // 只执行一次
})

// 创建自定义事件
const event = new CustomEvent('aaa'); // 订阅中心

document.dispatchEvent(event); // 派发器
// document.dispatchEvent(event); // 可以触发多次

// 2. 支持函数

const cb = () => { 
    console.log('点击了');
}

document.addEventListener('aaa', cb, {
    once: true // 只执行一次
})

document.removeEventListener('aaa', cb); // 支持删除监听器函数

// 创建自定义事件
const event = new CustomEvent('aaa'); // 订阅中心

document.dispatchEvent(event); // 派发器

// 3. 实现发布订阅模式
// 需要 once on emit off 订阅中心Map<事件的名称, [function]订阅的集合>

interface I {
    event: Map<string, Function[]>; // 订阅中心
    once:(event: string, callback: Function) => void; // 只执行一次
    on:(event: string, callback: Function) => void; // 订阅 
    emit:(event: string, ...args: any[]) => void; // 派发
    off:(event: string, callback: Function) => void; // 删除监听器
 }
class Emitter implements I { 
    event: Map<string, Function[]> = new Map(); // 初始化
    constructor() {
        this.event = new Map();
     }
     once(eventName: string, fn: Function) { 
        // 1. 创建一个自定义函数通过on触发 触发完之后通过off回收
        const callback = (...args: any[]) => { 
            fn(...args);
            this.off(eventName, callback);
        }
        this.on(eventName, callback);
     }
     on(event: string, callback: Function) { 
        if (this.event.has(event)) { // 判断事件是否存在 true 存过了
            const callbackList = this.event.get(event);
            callbackList && callbackList.push(callback);
        } else { // 第一次存
            this.event.set(event, [callback]);
        }
     }
     emit(event: string, ...args: any[]) { 
        const callbackList = this.event.get(event);
        console.log(callbackList); // 订阅的集合
        if (callbackList) { // 存在
            callbackList.forEach(fn => {
                fn(...args);
             })
        }
     }
     off(event: string, callback: Function) { 
        const callbackList = this.event.get(event);
        // console.log(callbackList);
        if (callbackList) { 
            callbackList.splice(callbackList.indexOf(callback), 1);
        }
     }
}

const bus = new Emitter();

const fn = (b:boolean, n:number) => {
    console.log(1, b, n);
 }
bus.on('message', fn)
bus.off('message', fn)
bus.once('message', fn)
bus.emit('message'); // 派发
bus.emit('message');
bus.emit('message');
bus.emit('message');
```

## 26. weakMap weakSet map set

```typescript
// 1. set
let set:Set<number> = new Set([1,2,3,3,4,5,6]); // 集合 天然去重 引用类型除外
console.log(set); // Set(6) {1, 2, 3, 4, 5, 6}
set.add(7);
console.log(set); // Set(7) {1, 2, 3, 4, 5, 6, 7}
console.log(set.has(1)); // true
set.delete(1);
console.log(set); // Set(6) {2, 3, 4, 5, 6, 7}
set.clear();
console.log(set); // Set(0) {}
// 支持for...of forEach entries keys 

// 2. map
let obj = {name: '张三'}
let map:Map<object, any> = new Map(); // map的key可以是任意类型（引用类型）
// get set delete clear has forEach entries keys for...of

// 3. weakMap weakSet 弱引用: 不会被计入垃圾回收机制

// weakMap map 区别: weakMap的key只能是引用类型
let obj = {name: 'lison'} // 引用次数1
let aap = obj   // 引用次数2
let weakMap:WeakMap<object, any> = new WeakMap();
weakMap.set(obj, 'aaaa'); // key--->obj value--->'aaaa' 引用次数2
obj = null;
console.log(weakMap); // WeakMap(1) {[object Object] => 'aaaa'} 引用次数-1
aap = null;
console.log(weakMap); // WeakMap(0) {} 引用次数-1 被释放

let weakset:WeakSet<object> = new WeakSet([obj]);
```

## 27. proxy Reflect

proxy: 代理 拦截器
Reflect: 反射 反射对象

```typescript
let person = {name: '张三', age: 18 }
person.name; // 取值
person.age = 19; // 赋值
// proxy 支持 对象 数组 函数 set map
let proxy = new Proxy(person, {
    // 拦截取值
    get() { 

    }
    // 拦截赋值
    set(target, key, value, receiver) { 
        /**
         * target: person 代理对象
         * key: name 操作对象
         * value: 赋值
         * receiver: 保证上下文正确
         */
        return true;
    },
    // 拦截函数调用
    apply() { 

    },
     // 拦截in操作符
    has() { 

    },
     // 拦截for...in操作符
    ownKeys() {

    },
    // 拦截new操作符
    construct() {

    },
    // 拦截delete操作符
    deleteProperty() {

     },

 })

// 示例
let person = {name: '张三', age: 18 }
let personproxy = new Proxy(person, {
    get(target, key, receiver) { 
        if (target.age >= 18) {
            return Reflect.get(target, key, receiver); // receiver: 保证上下文正确
        } else {
            return '18岁以下禁止访问';
         }
    }
})
console.log(personproxy.age); // 18

// mobx observer 观察者模式
const list:Set<Function> = new Set();
const autorun = (cb:Function) => {
    if(list.has(cb)) {
        list.add(cb);
    } 
 }

const observable = <T extends object>(params:T) => {
    return new Proxy(params, {
        set(target, key, value, receiver) {
            const result = Reflect.set(target, key, value, receiver);
            list.forEach(fn => fn())
            return result
        }
    })
}

const personProxy = observable({name: '张三', attr: 'dasdasvdvw'});

autorun(() => {
    console.log('changed');
})
personProxy.attr = 'dasdasvdvw1111';
personProxy.name = '张三1';
```

## 28. 类型守卫

在TypeScript中，类型守卫(`Type Guards`)是一种用于在运行时检查类型的机制。它允许在代码中执行特定的检查，以确定变量的类型，并在需要时执行相应的操作。

```typescript
// 1. 类型收缩 | 类型收窄
// typeof 是有缺陷的 对象 函数 数组 null 他都返回object
const isString = (str: any): str => typeof str === 'string'; // 类型收缩

const isArr = (arr: any) => arr instanceof Array;

// 2. 类型谓词 | 自定义守卫
// 实现一个函数，该函数可以传入任何类型, 但是如果是object，就检查里面的属性。
// 如果里面的属性是number就取两位小数，如果是string就去除左右空格，如果是函数就执行。

// 有问题：
/**
 * 1. 没有代码提示 原因是any类型
 * 自定义守卫 他只能接受boolean
 * 语法规则：参数 is 类型
 * 这个函数如果返回true，那么这个参数就是你想要的类型
 * 2. properties of undefined (reading 'a')
 * nodejs环境this成了undefined
 * 浏览器环境this成了window
 * js基础知识：如果函数独立调用，this指向window
 */

// object.prototype === ({})
const isObject = (arg: any) => ({}).toString.call(arg) === '[object Object]';
const isNumber = (num: any):num is number => typeof num === 'number'; // 如果条件返回true，那么num就是number类型
const isString = (str: any):str is string => typeof str === 'string';
const isFunction = (fn: any):fu is Function => typeof fn === 'function';

const fn = (data: any) => {
    if (isObject(data)) {
        let val;
        // 遍历属性 不能用for in ，因为for in 会遍历原型链上的属性
        Object.keys(data).forEach(key => {
            val = data[key];
            if (isNumber(val)) {
                data[key] = val.toFixed(2);
            }
            if (isString(val)) {
                data[key] = val.trim();
            }
            if (isFunction(val)) {
                // val(); // 独立调用
                data[key]()
            }
        })
    }
 }

let obj = {
    a: 100.1111,
    b: ' 张三  ',
    c: () => { console.log('hello world') }
}
```

## 29. 协变 逆变 双向协变

鸭子类型

```typescript
// 1. 协变
// 主类型 
interface A {
    name: string;
    age: number;
}
// 子类型
interface B {
    name: string;
    age: number;
    sex: string;
}

let a: A = {name: '张三', age: 18}
let a: B = {name: 'lisi', age: 20, sex: '男'}

// 协变
a = b; // B是A的子类型

// 2. 逆变
let fna = (data: A) => {

}
let fnb = (data: B) => {

}
// 逆变
fnb = fna; // B是A的父类型

// 3. 双向协变
// 允许fna = fnb 不安全
```

## 30. 泛型工具

1. Partial 所有属性 可选的意思 接收一个泛型
2. Required 所有属性 必选的意思
3. Pick 提取部分属性
4. Exclude 排除部分属性
5. Omit 排除部分属性 并且返回新的类型
6. Record 约束对象key和value
7. ReturnType 获取函数返回值类型

```typescript
interface User {
    address: string;
    name: string;
    age: number;
}

// 1. Partial
type PartialUser = Partial<User> // 所有属性变为可选
// {address?: string; name?: string; age?: number;}

// 实现原理
type CoustomPartial<T> = {
    [P in keyof T]?: T[P]
}

// 2. Required
type RequiredUser = Required<User>
// {address: string; name: string; age: number;}

// 实现原理
type CoustomRequired<T> = {
    [P in keyof T]-?: T[P]
}

// 3. Pick
type PickUser = Pick<User, 'address' | 'name'>
// {address: string; name: string;}
// 实现原理
type CoustomPick<T, K extends keyof T> = {
    [P in K]: T[P]
}

// 4. Exclude
type ExcludeUser = Exclude<'address' | 'name' | 'age', 'address' | 'name'> // 只剩age
// 实现原理
type CoustomExclude<T, K> = T extends K ? never : T;
// 为什么是never 
// never在联合类型中会被排除

// 5. Omit
type OmitUser = Omit<User, 'address' | 'name'> // 删除address name
// 实现原理
// 使用Pick和Exclude
// Exclude 去排除不需要的属性
// Pick 获取剩下的属性、
type CoustomOmit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>

// 6. Record 约束对象key和value 接收两个泛型
type key = 'a' | 'b' | 'c'  // key不能少
type Value = 'sing' | 'jump' | 'dance' // value随意
let obj:Record<key, Value> = {
    a: 'sing',
    b: 'jump',
    c: 'dance'
}
// 实现原理
// 对象的key只能是string number symbol
type Objkey = keyof any; // string | number | symbol
type CoustomRecord<K extends Objkey, T> = {
    [P in K]: T
}
// 7. ReturnType 获取函数返回值类型

const fn = () => [1,2,3, '111', false]
type FnReturnType = ReturnType<typeof fn> // (number | string | boolean)[]
// 实现原理
type CoustomReturnType<F extends Function> = F extends (...args: any[]) => infer Res ? Res : never;=
```

## 31. infer

infer就是推导泛型参数。infer声明只能出现在extends子语句中（extends的右边）。infer后面跟一个变量名
1. 获取promise返回的参数
2. infer协变
3. infer逆变

```typescript
// 1. 获取promise返回的参数
interface User {
    name: string;
    age: number;
}
type PromiseType = Promise<User>

type GetPromiseType<T> = T extends Promise<infer Res> ? Res : T;

// 2. infer协变 产生协变会返回联合类型
type Bar<T> = T extends { name: infer N, age: infer A } ? [N,A] : T;

// 3. infer逆变 出现在函数参数中 逆变返回交叉类型
type Foo<T> = T extends {
    a:(x:infer U) => void,
    b:(x:infer U) => void
} ? U : never;
```

## 32. infer类型提取

1. 提取头部元素
2. 提取尾部元素
3. 剔除第一个元素 Shift
4. 剔除最后一个元素 Pop

```typescript
// 1. 提取头部元素
type Arr = ['a', 'b', 'c']

type First<T extends any[]> = T extends [infer F, ...any[]] ? F : [];
// 2. 提取尾部元素
type Last<T extends any[]> = T extends [...any[], infer Last] ? Last : [];
// 3. 剔除第一个元素 Shift
type Pop<T extends any[]> = T extends [unknow, ...infer Rest] ? Rest : [];
// 4. 剔除最后一个元素 Pop
type Pop<T extends any[]> = T extends [...infer Rest, unknow] ? Rest : [];
```

## 33. infer递归
```typescript
type Arr = [1, 2, 3, 4] // 翻转为[4, 3, 2, 1]

tpye ReverArr<T extends any[]> = T extends [infer Fisrt, ...infer Rest] ? [...ReverArr<Rest>, Fisrt] : T;
```

## 34. 插件编写


