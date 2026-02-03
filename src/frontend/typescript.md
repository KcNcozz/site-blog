# Typescript

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

 let a:A<boolean> = true;f
```
