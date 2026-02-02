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
