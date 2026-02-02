# Vite构建工具

有一个东西能够帮你把tsc，react-compiler，less，babel，uglifyjs全部集成到一起，我们只需要关心我们写的代码就好了，这个东西就叫做**构建工具**。

> ES Modules (ESM) 和 CommonJS (CJS) 是 JavaScript 中两种最主要的模块化标准。CommonJS 是 Node.js 默认的传统模块系统（主要用于服务端），而 ES Modules 是 JavaScript 官方的现代化标准（现已广泛用于浏览器和 Node.js）。

::: details 构建工具
构建工具它让我们可以不用每次都关心我们的代码在浏览器如何运行，我们只需要首次给构建工具提供一个配置文件(这个配置文件也不是必须的，如果你不给他他会有默认的帮你去处理)，有了这个集成的配置文件以后，我们就可以在下次需要更新的时候调用一次对应的命令就好了。如果我们再结合热更新，我们就更加不需要管任何东西，这就是构建工具去做的事情，**他让我们不用关心生产的代码也不用关心代码如何在浏览器运行，只需要关心我们的开发怎么写的爽怎么写就好了**
:::

**构建工具的作用**：
1. 模块化开发支持：支持直接从node_modules中引入代码 + 多种模块化支持
2. 处理代码兼容性：比如babel语法降级，less, ts 语法转换（**不是构建工具做的，构建工具将这些语法对应的处理工具集成进来自动化处理**）
3. 提高项目性能：压缩文件，**代码分割**
4. 优化开发体验：
    - 构建工具会帮你自动监听文件的变化，当文件变化以后自动帮你调用对应的集成工具进行重新打包，然后再浏览器重新运行（整个过程叫做**热更新** HMR-Hot Module Replacement）
    - 开发服务器：跨域的问题，用react-clicreate-react-element vue-cli 解决跨域的问题。

> 打包：将我们写的浏览器不认识的代码，交给构建工具进行编译处理的过程就叫做打包，打包完成以后会给我们一个浏览器可以认识的文件。

::: warning vite脚手架和vite的区别
当我们使用`yarn create vite@latest`时：
1. 帮我们全局安装一个东西：create-vite (vite脚手架)
2. 直接运行create-vite bin目录下的一个执行配置

create-vite和vite的关系是什么呢？ create-vite内置了vite
- webpack vite: 毛坯房
- vue-cli create-vite: 精装房
:::

## 1. vite开箱即用 (out of box)

开箱即用: 你不需要做任何额外的配置就可以使用vite来帮你处理构建工作

创建vite: `npm init -y`

1. 创建vite脚手架：`yarn create vite@latest`
2. 运行项目：`yarn dev`
3. 构建项目：`yarn build`
> 在默认情况下，我们的esmodule去导入资源的时候，要么是绝对路径，要么是相对路径。既然我们现在的最佳实践就是node_modules，那为什么es官方在我们导入非绝对路径和非相对路径的资源的时候不默认帮我们 搜寻node_nodules呢? ---> 假设加载`loadsh`，`loadsh`依赖更多东西，如果都加载则消耗大量性能。

## 2. vite预加载

在处理的过程中如果说看到了有非绝对路径或者相对路径的引用，他则会尝试开启路径补全。找寻依赖的过程是自当前目录依次向上查找的过程，直到搜寻到根目录或者搜寻到对应依赖为止 /user/node_modules/lodash，../

```javascript
import _ from '/node_modules/loadsh'; // loadsh也可能imprort其他资源

import __vite__cjsImport0_lodash from "/node_modules/.vite/deps/lodash.js?v=ebe57916";
```

::: tip 生产和开发
yarn dev ---> 开发(每次依赖预构建所重新构建的相对路径都是正确的)

生产 ---> vite会全权交给一个叫做`rollup`的库去完成生产环境的打包

缓存 ---> 实际上vite在考虑另外一个问题的时候就顺便把这个问题解决了
:::


**依赖预构建**:首先vite会找到对应的依赖，然后调用esbuild(对js语法进行处理的一个库)，将其他规范的代码转换成esmodule规范，然后放到当前目录下的node_modules/.vite/deps，同时对esmodule规范的各个模块进行统一集成。

它解决了3个问题:
1. 不同的第三方包会有不同的导出格式(这个是vite没法约束人家的事情)
2. 对路径的处理上可以直接使用.vite/deps，方便路径重写
3. **网络多包传输的性能问题**，(也是原生esmodule规范不敢支持node_modules的原因之一)。有了依赖预构建以后无论他有多少的额外`export`和`import`，
vite都会尽可能的将他们进行集成，最后只生成一个或者几个模块。

```javascript
示例：
// a.js
export default function a() {}

// index.js
export { default as a } from './a.js';
// 具体意义如下：在加载index.js的时候，会顺带加载a.js
import a from './index.js';
export const a = a;

// vite重写以后（只剩index一个模块）：
function a() {} 
// 把其他包导出的东西提取出来，用一个函数包裹，放一个包里面，调用的时候才会执行
```

## 3. vite的配置文件

1. Vite的配置文件：`vite.config.js`
2. 配置文件的语法提示：
    - 如果你使用的是webstorm，那你可以得到很好的语法补全
    - 如果你使用是VSCode或者其他的编辑器，则需要做一些特殊处理

```javascript
方法一：
import { defineConfig } from 'vite'; // 引入defineConfig
 
// defineConfig是个函数 TS写法会返回一个UserConfigExport对象
export default defineConfig({
    optimizeDeps: {
        exclude: []
    }
})

方法二：
/** @type import('vite').UserConfig */
const viteConfig = {
        optimizeDeps: {
        exclude: []
    }
} 

export default viteConfig;
```
3. 关于环境的处理 定义四个文件
- `vite.config.js`
- `vite.base.config.js`
- `vite.prod.config.js`
- `vite.dev.config.js`

```javascript
// vite.config.js
import { defindeConfig } from 'vite';
import viteBaseConfig from './vite.base.config';
import viteDevConfig from './vite.dev.config';
import viteProdConfig from './vite.prod.config';

// 策略模式
const envResolver = {
    "bulid": () => {
        console.log("生产环境");
        return ({...viteBaseConfig, ...viteProdConfig})
    },
    "serve": () => {
        console.log("开发环境");
        return Object.assign({}, viteBaseConfig, viteDevConfig); // 新配置里是可能会被配置envDir
    }
    // 两个返回配置合并的写法都可以
}

export default defindeConfig(({command, mode}) => {
    // 是build还是serve主要取决于我们执行的命令是开启生产环境还是开发环境
    console.log("command:", command);
    // 当前env文件所在的目录
    // 第二个参数不是必须要用process.cwd(), 自己配置目录也可
    const env = loadEnv(mode, process.cwd(), ".env"); // .env为默认值可以不传
    console.log("env:", env);
    return envResolver[command]();
});


// vite.base.config.js
import { defineConfig  } from 'vite';

export default defineConfig({
  optimizeDeps: {
    exclude: [], // 将某些包排除在预构建之外
  },
});


// vite.dev.config.js
import { defineConfig  } from 'vite';

export default defineConfig({});


// vite.prod.config.js
import { defineConfig  } from 'vite';

export default defineConfig({});
```

## 4. vite环境变量配置

环境变量：会根据当前的代码环境产生值的变化的变量就叫做环境变量

> 补充：为什么vite.confg.js可以书写成esmdule的形式：这是因为vite他在读取这个vite.config.js的时候会率先node去解析文件语法，如果发现你是esmodule规范，会直接将你的esmodule规范进行替换变成commonjs规范。

代码环境：
- 开发环境
- 测试环境
- 预发布环境
- 灰度环境
- 生产环境

::: details 例子
API_KEY: 测试环境和生产环境不一样
- 测试环境：111
- 生产环境：222
:::

对于服务端：在Vite中，环境变量处理：使用第三方库`dotenv`（Vite内置）,读取`.env`文件，并把里面的内容解析成对应的环境变量，并将其注入到`process`(nodejs内置管理进程的)对象中。但是Vite考虑到和其他配置的一些冲突问题，它不会直接注入到`process`对象中。

::: warning 涉及到vite.config.js中的一些配置冲突问题
- root
- envDir: 用来配置当前环境变量的文件地址（默认读取当前目录下的.env文件）

我们可以调用vite的`loadEnv`来手动确认env文件

process.cwd()方法: 返回当前node进程的工作目录（current working directory）
:::

- `.env`: 所有环境都需要用到的环境变量

- `.env.development`: 开发环境需要用到的环境变量（默认情况下Vite将我们的开发环境取名为development）

- `.env.production`: 生产环境需要用到的环境变量（默认情况下Vite将我们的生产环境取名为production）

当我们使用`npm run dev`时，vite会自动帮我们补全为`npm run dev --mode development`，会直接将mode设置为`development`传递进来。当我们调用`loadEnv`的时候，会做以下操作：
1. 直接找到.env文件，并解析其中的环境变量，并放进一个对象里。
2. 会将传递进来的mode这个变量的值进行拼接：`.env.${mode}`,并根据我们提供的目录(`process.cwd()`)去取对应的配置文件并解析，将其放进一个对象中。
```javascript
const baseEnvConfig = 读取.env的配置
const modeEnvConfig = 读取env相关配置
const lastEnvConfig = {...baseEnvConfig,...modeEnvConfig}
```

对于客户端：Vite会自动将环境变量注入到`import.meta.env`对象中，这样我们就可以在代码中直接使用`import.meta.env.API_KEY`来获取对应的值。为了防止我们将隐私性的变量直接送进`import.meta.env`中，vite做了一层拦截。如果你的环境变量是以`VITE_`开头的，那么vite才会将这个环境变量注入到`import.meta.env`对象中。如果我们不想使用`VITE_`前缀，我们可以使用envPrefix配置项来改变这个前缀。


## [原理篇] vite是怎么让浏览器可以识别.vue文件的 （听不懂node 先不总结）

```javascript
// 安装create-vite脚手架 使用脚手架的命令构建项目
npm create vite@latest my-vue-app -- --template vue
```

用通俗的话讲：如果是Vue文件，会做一个字符串替换：`mainVueContent.toString().find("<template>")`，如果匹配到了就全部进行字符串替换。

AST语法分析 ---> Vue.createElement() ---> 构建原生dom

vue的编译器会把vue文件转为模板AST，再转为JS AST，最后转为VNode（本质就是JS对象），便于渲染器去挂载/更新节点，渲染器去挂载也是JS实现的

总结：通过node后端将vue解析成js格式，并返回ContentType告诉浏览器按照js解析

## 5. 在vite中处理css

**vite天生就支持对css文件的直接处理**

1. vite在读取到main.js中引用到了index.css
2. 直接去使用fs模块去读取index.css中文件内容
3. 直接创建一个style标签，将index.css中文件内容直接copy进style标签里
4. 将style标签插入到index.html的head中
5. 将该css文件中的内容直接替换为js脚本(方便热更新或者css模块化)，同时设置Content-Type为js，从而让浏览器以JS脚本的形式来执行该css
后缀的文件

> 场景:
>- 一个组件最外层的元素类名一般取名: wrapper
>- 一个组件最底层的元素类名一般取名: .footer   
> 你取了footer这个名字，别人因为没有看过你这个组件的源代码，也可能去取名footer这个类名最终可能会导致样式被覆盖(因为类名重复)，这就是我们在协同开发的时候很容易出现的问题

cssmodule就是来解决这个问题的

::: tip 原理 全部都是基于node
1. module.css(module是一种约定，表示需要开启css模块化)
2. 它会将你的所有类名进行一定规则的替换(将`footer`替换成`_footer_i22st_1`)
3. 同时创建一个映射对象{ footer: "_footer_i22st_1" }
4. 将替换过后的内容塞进style标签里然后放入到head标签中 (能够读到index.html的文件内容)
5. 将componentA.module.css内容进行全部抹除，替换成JS脚本
6. 将创建的映射对象在脚本中进行默认导出

less: 一个css预处理器
:::

## 6. vite.config.js中css配置（module篇）

> 之前对vite怎么处理css文件的原理已经很清楚了，如何通过配置更改或者覆盖vite默认的处理方式呢？

在vite.config.js中我们通过css属性去控制（很多属性不太用 但是面试的时候会问）

- `localConvention`: 修改生成的配置对象的key的展示形式(驼峰还是中划线形式)
- `scopeBehaviour`: 配置当前的模块化行为是模块化还是全局化(有hash就是开启了模块化的一个标志，因为他可以保证产生不同的hash值来控制我们的样式类名不被覆盖)
- `generateScopedName`: 生成的类名的规则(可以配置为函数，也可以配置成字符串规则: https://github.com/webpack/loader-utils#interpolatename)
- `hashPrefix`: 生成hash会根据你的类名 + 一些其他的字符串(文件名 + 他内部随机生成一个字符事)去进行生成，如果你想要你生成hash更加的独特一点，你可以配置hashPrefix，你配置的这个字符串会参与到最终的hash生成，(hash:只要你的字符串有一个字不一样，那么生成的hash就完全不一样，但是只要你的字符串完全一样，生成的hash就会一样)
- `globalModulePaths`: 代表你不想参与css module化的文件路径(一般用于第三方css) 文件不加.module也可

## 7. vite.config.js中css配置（preprocessorOptions篇） 

主要是用来配置css预处理的一些全局参数

> 假设没有使用构建工具，我们又想去编译less文件的话，我们需要安装less `yarn add less` 。
> 只要你安装了node，你就可以使用node index.js。   
> 只要你安装了less，你就可以使用lessc去编译less文件。

- `less`
- `scss`
- `devSourcemap`: 开启css的sourceMap（文件索引）

::: tip sourceMap
文件之间的索引：

假设我们的代码被压缩或者被编译过了，这个时候假设程序出错，他将不会产生正确的错误位置信息。如果设置了sourceMap，他就会有一个索引文件map

原理：sourceMap在文件后面加了一行代码，其中有一个base64，这个base64将源代码copy过来
:::

## 8. vite.config.js中css配置（postcss篇）

预处理器不能解决一下问题：
1. 对未来css属性的一些使用降级问题
2. 前缀补全：Google Chrome 浏览器会自动添加前缀 `--webkit`


vite天生对postcss有良好的支持，所以业内也把postcss称为后处理器（在less和sass处理完之后再处理）
### postcss的前世今生

> 假设有一个全屋净水系统，水龙头里来的水是自来水。  
>自来水从管道里：先到这个全屋净水系统 --> 给全屋净水系统做一些插槽 --> 去除砂砾 --> 净化细菌微生物 --> ... --> 输送到水龙头 --> 我们可以喝的纯净水 (为了保证到我们嘴里喝的水是万无一失) 

postcss：他的工作基本和全屋净水系统一致，保证css在执行起来是万无一失的。  

我们写的css代码 --> postcss --> 将语法进行编译(嵌套语法，函数，变量)成原生css **[less sass等预处理器都可以做]** --> 再次对未来的高级css语法进行降级 --> 前缀补全 --> 浏览器客户端

(类比)babel：保证js在执行起来是万无一失的。

我们写的js代码 --> babel --> 将最新的ts语法进行转换js语法 --> 做一次语法降级 --> 浏览器客户端去执行

::: danger 对postcss的误区
postcss和less，sass是差不多级别的[❌️]  
postcss可以涵盖less
:::

### postcss的使用

1. 安装依赖
```bash
npm add postcss-cli postcss -D
```
2. 书写描述文件
不写的话会使用默认配置（什么都不做）

```javascript
postcss.config.js
// 需要自己加插槽
// 预设环境(postcssPresetEnv)里会包含很多插件
// 语法降级 
// 编译插件
// ...
const postcssPresetEnv = require('postcss-preset-env');

// 预设一次性安装了这些必要的插件
// 做语法的编译 less sass （语法嵌套 函数 变量）
module.exports = {
    Plugins: [postcssPresetEnv(/* pluginOptions */)]
}
```

### 在vite中使用postcss

可以像上面一样单独写一个postcss.config.js文件，也可以在vite.config.js中配置postcss（在vite.config.js中配置优先级高于postcss.config.js）

### 为什么postcss没有编译全局css变量

::: danger
新版本好像没有这个？？？
:::

## [原理篇] 为什么在服务端处理路径的时候一定要用path

```javascript
/***
 * 一定会去读文件
 * 我们如果写的是相对路径 那么他会尝试去拼接成绝对路径
 * commonjs 规范 注入几个变量 __dirname
 * 
 */

const fs = require("fs"); // 处理文件的模块(读文件，修改文件等一系列操作)
const path = require("path");// path本质上就是一个字符串处理模块，它里面有非常多的路径字符串处理方法

// /Users/iamsavage/Desktop/b站课程/vite教学/test-path
// const result = fs.readFilesync(dirname + "/variable.css"); // 我们希望基于main.js去进行一个绝对路径的生成
const result = fs.readFilesync(path.resolve(__dirname, "./variable.css"));
// path.resolve在拼接字符串

console.log("result", result.tostring(), process.cwd(), dirname);
// node端去读取文件或者操作文件的时候，如果发现你用的是相对路径，则会去使用process.cwd()来进行对应的拼接
//process.cwd:获取当前的node执行目录

// __dirname: 始终返回当前文件所在的目录
```

## 9. vite加载静态资源及别名

> 什么是静态资源？在服务端，除了动态API以外，99%资源都被视为静态资源

vite这里所说的静态资源一般指的是图片、视频、图标等存放在assert目录下的资源。vite对静态资源基本上是开箱即用的，除了一些特殊情况

- 如果不是使用vite，在其他的一些构建工具里json文件的导入会作为一个JS0N字符串形式存在
- tree shaking: 摇树优化：打包工具会自动帮你移除掉那些你没有用到的变量或者方法

### vite对svg的处理
vite对svg(scalable vector graphics 可伸缩矢量图)依旧是开箱即用的。我们在前端领域里更多的是用svg去做图标。  
优点：
1. svg不会失真
2. 尺寸小

缺点：没法很好的表示层次丰富的图片信息

vite处理svg的方式：
```javascript
import svgIcon from"./assets/svgs/fullScreen.svg?url"
// svgIcon是一个绝对路径地址
console.log("svgIcon", svgIcon) ;

// 第一种使用svg的方式
const img = document.createElement("img");
img.src = svgIcon;
document.body.appendChild(img);

// 第二种使用svg的方式
import svgRaw from"./assets/svgs/fullScreen.svg?raw"
// svgRaw是一个字符串
document.body.innerHTML = svgRaw;
const svgElement = document.getElementByTagName("svg")[0];
svgElement.onmouseover = function() {
    // 不是去改background-color也不是color，而是fill属性
    this.style.fill = "red";
}
```

## [原理篇] resolve.alias原理

::: danger 
听不懂 先pass
:::

别名的大体实现流程:
```javascript
module.exports = function(aliasConf, JSContent) {
    const entires = Object.entries(aliasConf);
    console.log("entires", entires, JSContent);
    let lastContent = JSContent;
    entires.forEach(entire => {
        const [alia, path] = entire; 
        // 会做path的相对路径处理
        // 如果我用官方的方式去找相对路径的话
        const srcIndex = path.index0f("/src");
        // alias别名最终做的事情就是一个字符串替换
        const realPath = path.slice(srcIndex, path.length);
        lastContent = JSContent.replace(alia, realPath);
})}
    console.log("lastContent.......")
    return lastContent;
```

## 10. vite在生产环境中对静态资源的处理

> 当我们将工程进行打包完成以后，会发现找不到原来的资源

::: tip webpack为什么要配置baseUrl
配置baseUrl之后，会改变index.html中的的引用路径
```javascript
baseUrl: "/"
配置前：<script src="src/main.js"></script>
配置后：<script src="/src/main.js"></script>
在相对路径会变成绝对路径
```
:::

- 打包后的静态资源为什么要有hash？浏览器有缓存的机制，如果静态资源没有改变，浏览器会直接从缓存中获取，不会重新请求。所有当我们重新打包时，要避免名字一致。（hash算法：将一串字符串经过运算得到一个新的乱码字符串） 利用hash算法，可以避免浏览器缓存
- 可以在vite.config.js中配置rollup的构建策略

## 11. vite插件

> 插件是什么？回顾之前的净水系统：假设有一个全屋净水系统，水龙头里来的水是自来水。自来水从管道里：先到这个全屋净水系统 --> 给全屋净水系统做一些插槽 --> 去除砂砾 --> 净化细菌微生物 --> ... --> 输送到水龙头 --> 我们可以喝的纯净水。 这当中的每一步都相当于是一个插件

定义：vite会在**生命周期**的不同阶段中去调用不同的插件以达到不同的目的。**(插件 中间件的标准话术)**

::: details 生命周期
生命周期：其实就和我们人一样，vite从开始执行到执行结束，那么着整个过程就是vite的生命周期。
:::


## 12. vite常用插件——vite-aliases （支持Vite6.x）

> nvm: node版本管理工具

- 插件地址: https://github.com/subwaytime/vite-aliases
- vite-aliases可以帮助我们自动生成别名：检测你当前目录下包括src在内的所有文件夹，并帮助我们去生成别名
- 配置：
    1. 安装：`npm i vite-aliases -D`
    2. 配置：在vite.config.js中配置
```javascript
// vite.config.js
import { ViteAliases } from 'vite-aliases'

export default {
  plugins: [
    ViteAliases()
  ]
};
```

## [原理篇] 手搓vite-aliases插件

如果想手写一个插件，那么需要了解vite的插件机制。插件API：https://cn.vitejs.dev/guide/api-plugin 想要手写Vite-aliases其实就是在vite执行配置文件之前去改写配置文件，而vite独有钩子中的`config`钩子（在解析 Vite 配置前调用），即可实现。

通过vite.config.js返回出去的配置对象以及我们在插件的config生命周期中返回的对象都不是最终的一个配置对象，vite会把这几个配置对象进行一个merge合并。

```javascript
// vite的插件必须返回给vite一个对象

const { dir } = require("console");
const fs = require("fs");
const path = require("path");

function diffDirAndFile(dirFilsArr = [], basePath = "") { 
    const result =  {
        dirs: [],
        files: [],
    };
    dirFilsArr.forEach(name => { 
        const currentFileStat = fs.statSync(path.resolve(__dirname, basePath,"/", name));
        console.log("currentFileStat", currentFileStat);
        const isDir = currentFileStat.isDirectory();

        if (isDir) { 
            result.dirs.push(name);
        } else {
            result.files.push(name);
        }
    });
    return result;
}

function getTotalSrcDir(keyName) {
    // 读目录
    const result = fs.readdirSync(path.resolve(__dirname, "../"));
    const diffResult = diffDirAndFile(result, "../src");
    console.log("diffResult:", diffResult);
    const resolveAliasesObj = {}; // 放的就是一个一个别名配置 @assets: xxx
    diffResult.dirs.forEach(dirName => { 
        const key = `${keyName}${dirName}`;
        const abspath = path.resolve(__dirname, "../src" + "/" + dirName);
        resolveAliasesObj[key] = abspath
    })
    return resolveAliasesObj;
}

module.exports = ({
    keyName = "@"
} = {}) => {
    return {
        config(config, env) {
            /**
             * 会将vite.config.js中的配置传递过来 但是不执行
             * config函数可以返回一个对象，这个对象是部分的viteConfig配置(其实就是你想改的那一部分)
             * config: 当前vite的配置对象
             * env: 当前的环境变量 {command: 'build' | 'serve', mode: string}  (mode: string, command: string)
             * 配置别名
             */
            const resolveAliasesObj = getTotalSrcDir(keyName);
            return {
                // 在这我们要返回一个resolve出去，将src目录下的所有文件夹进行别名控制
                resolve: {
                    alias: resolveAliasesObj
                }
            }
        }
    }
}
```

## 13. vite常用插件——vite-plugin-html

动态变化html中的内容
1. 安装：`npm add vite-plugin-html -D`
2. 配置：在vite.config.js中配置

```javascript
// vite.config.js
import { createHtmlPlugin } from 'vite-plugin-html'

export default {
  plugins: [
    createHtmlPlugin({
      inject: { // 配置注入的html文件
        data: {
          title: 'Vite Demo',
        },
      },
    }),
  ]
};
```

## [原理篇] 手搓vite-plugin-html插件

```javascript
export default function createHtmlPlugin() {
    return {
        // 转换html文件
        // 将我们插件的一个执行时机提前
        transformIndexHtml: {
            enforce: 'pre', // 优先级
            transform: (html, ctx) => {
            /**
             * ctx: 表示当前整个请求的一个执行期上下文:api /index.html ...
             */
            return html.replace(/<%= title %>/g, options.inject.data.title);
        }
            }
    }
}
```

## 14. vite常用插件——vite-plugin-mock

::: danger mock.js
mock.js已经没有人维护了，插件还是可以用的，现在建议用faker.js
:::

mock.js: 模拟数据， vite-plugin-mock的依赖项就是mock.js

1. 安装：`npm i vite-plugin-mock mockjs -D`
2. 配置：在vite.config.js中配置
```javascript
 plugins: [ 
    // 配置插件
    viteMockServe() // 配置mock服务
  ],
```
3. 开箱即用：默认去找根目录下的mock文件夹下的所有文件，并自动生成mock数据
```javascript
import mockJS from 'mockjs'

const userList = mockJS.mock({
    'data|100': [{
        name: '@cname', // 随机生成不同的中文名称
        'id|+1': 1, // id自增
    }]
})


module.exports = [
    {
        method: 'post',
        url: '/api/user',
        response: ({body}) => { 
            // body: 请求体
            return {
                code: 200,
                msg: 'success',
                data: userList
            };
        }
    }
]
```

## [原理篇] 手搓vite-plugin-mock插件

```javascript
import fs from 'fs';
import path from 'path';

export default () => { 
    // 做的最主要的事情就是拦截http请求
    // 当我们使用fetch或者axios去请求的
    // axios baseUrl //请求地址
    // 当打给本地的开发服务器的时候 viteserver服务器接管
    return { 
        configureServer(server) { 
            const mockStat = fs.statSync('mock');
            let mockResult = [];
            if (mockStat.isDirectory()) { 
                const mockResult = requore(path.resolve(process.cwd(), 'mock/index.js'))
                consle.log("mockResult", mockResult);   
            }
            // 服务器相关配置
                server.middlewares.use(async (req, res, next) => {
                    /**
                     * req: 请求对象 请求头 请求体 url cookie
                     * res: 响应对象 响应头 ...
                     * next: 是否继续执行下一个中间件，调用next方法会将处理结果交给下一个中间件
                     */
                    // 看我们请求的地址在mock里面有没有
                    const mockItem = mockResult.find(item => item.url === req.url);
                    console.log("mockItem", mockItem);
                    if (mockItem) {
                        const responseData = responseData.response(req);
                        console.log("responseData", responseData);
                        // 强制设置请求头格式为json
                        res.setHeader('Content-Type', 'application/json');
                        res.end(JSON.stringify(responseData)); // 响应数据
                     } else { 
                        next(); // 继续执行下一个中间件
                     }
            })
        }
    }
}
```

## [总结篇] vite-plugin

**目前已经学习：**
- config: 配置vite.config.js文件
- configureServer: 配置服务端处理
- transformIndexHtml: 配置html文件
- ......

plugin的实现过程：......

## 15. vite与ts结合

> ts是js的类型检查工具，能够检查我们代码中可能会存在的一些隐形问题，同时给到我们一些语法提示。

在企业级应用里面ts是怎么去配置的，我们怎么让ts的错误直接输出到控制台，在vite中需要借助一个插件：vite-plugin-checker

1. 安装：`npm i vite-plugin-checker -D`
2. 在vite.config.js中配置
```javascript
import { defineConfig } from 'vite'
import checker from 'vite-plugin-checker'

export default defineConfig({
  plugins: [
    checker({
      typescript: true
    }),
  ]
})
```
3. 在tsconfig.json中配置ts的检查手段和检查规则
```json
// 配置ts的检查手段
{
    "compilerOptions": {
        "skipLibCheck": true, // 是否跳过node_modules目录的检查
    }
}
```
### 环境变量问题

```json
// 配置ts的检查手段
{
    "compilerOptions": {
        "skipLibCheck": true, // 是否跳过node_modules目录的检查
        "module": "esnext", 
    }
}
```

```javascript
// .env
VITE_PROXY_TARGE = http://www.baidu.com
```
```typescript
// vite-env.d.ts
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_PROXY_TARGET: string;
}
```

## 16. vite性能优化

> 我们平时说的性能优化是在说什么？

1. 开发时态的构建速度优化： `yarn dev` / `yarn start` 敲下的一瞬间到呈现结果要占用多少时长。
    - webpack在这方面下的功夫是很重: cache-loader cache loader结果(如果两次构建源代码没有产生变化，则直接使用缓存不调用loader)，thread-loader，开启多线程去构建 ...
    - vite是按需加载，所以我们不需要太care这方面。

2. 页面性能指标： 和我们怎么去写代码有关
    - 首屏渲染时：fcp(first content paint),(first content paint --> 页面中第一个元素的渲染时长)
      - **懒加载**：要我们去写代码实现的   
      - **http优化**：协商缓存 和强缓存
        - **强缓存**：服务端给响应头追加一些字段(expires)，客户端会记住这些字段，在expires(截止失效时间)没有到达之前，无论你怎么刷新页面，浏览器都不会重新请求页面，而是从缓存里取。
        - **协商缓存**：是否使用缓存要跟后端商量一下，当服务端给我们打上协商缓存的标记以后，客户端在下次刷新页面需要重新请求资源时会发送一个协商请求给到服务端，服务端如果说需要变化 则会响应具体的内容，如果服务端觉得没变化则会响应304。
    - 页面中最大元素的一个时长:lcp(largest content paint)
    - ...

3. js逻辑:
    - 我们要注意副作用的清除。组件是会频繁的挂载和卸载：如果我们在某一个组件中有计时器(setTimeout)，如果我们在卸载的时候不去清除这个计时器，下次再次挂载的时候计时器等于开了两个线程。
    ```javascript
    const [timer, setTimer] = useState(null);
    useEffect(() => {
    setTimer(setTimeout (() => {}));
    return () => clearTimeout(timer);
    })
    ```
    - 我们在写法上一个注意事项：requestAnimationFrame, requestIdleCallback （卡浏览器帧率）对浏览器渲染原理要有一定的认识，然后再这方面做优化。
      - 浏览器的帧率:16.6ms去更新一次 (执行js逻辑 以及 重排重绘...)
      - requestIdleCallback: 传一个函数进去，如果在16.6ms中执行完js逻辑 以及 重排重绘... 会去执行这个函数。
      - concurrency: 可中断渲染 (react)

    - 防抖 节流：使用lodash库中的方法
    ```javascript
    const arr = [] // 几千条数据
    arr.forEach(item => {}) // 不要使用arr.forEach，使用lodash.forEach    
    ```
    - 对作用域的控制
     ```javascript
    const arr = [1, 2, 3];
    for (let i = 0; i < arr.length; i++) { 
        // 每次循环都会去windows中取（访问父级）
    }
        for (let i = 0; len = arr.length; i < len; i++) { 
        // 只会在首次访问
    }
    ```
    - ...

4. css：
    - 关注继承属性：能继承的旧不要重复写
    - 尽量避免太过于深的css嵌套

5. 构建优化:vite(rollup) webpack  
优化体积：压缩，treeshaking，图片资源压缩，cdn加载，分包

6. ...

## 17. [性能优化篇] 分包策略

> 为什么测试的有些时候没有生效，要去清缓存？  
> 本身浏览器缓存策略：静态资源 --> 名字没有变化，就不会重新去拿 xxx.js。

```typescript
import { forEach } from 'lodash'

const mainArr = [];

forEach(mainArr, (item) => {
    console.log(item);
});
```
打包后的文件lodash有5000多行，但是主要业务代码只有很少几行。vite在打包的时候，会加上hash值，所以每次打包的hash值都会变化，就会重新去拿 xxx.js。我们的业务代码是会经常变化，但是lodash不会经常变化。在打包的时候，每次都会重新请求整个文件并打包。这时候就会出现浏览器性能损耗。

**分包**：分包就是把一些不会常规更新的文件 进行单独打包处理

```typescript
// tsconfig.json
{
    "compilerOptions": {
        "moduleResolution": "node", // 模块解析方案
        "skipLibCheck": true, // 是否跳过node_modules目录的检查
        "module": "esnext", // 模块化方案
        "lib": ["ES2017", "DOM"], // 指定编译时要包含的库文件
        "allowSyntheticDefaultImports": true,
    }
}
```

```javascript
// vite.config.ts
import { defineConfig } from 'vite'
import checker from 'vite-plugin-checker'
import path from 'path'

export default defineConfig({
  "build": {
    "minify": false, // 关闭代码压缩
    "rollupOptions": { // 配置rollup的构建策略
      "input": { // 多入口配置
        main: path.resolve(__dirname, './index.html'),
        product: path.resolve(__dirname, './product.html')
      },
      "output": { // 分包配置 配置静态资源的输出格式
        "manualChunks": (id: string) => {
          console.log("id:", id);
          if (id.includes("node_modules")) {
            return "vendor"; // 将所有来自node_modules的代码打包到vendor.js中
          }
        }
      }
    }
  },
  plugins: [
    checker({
      typescript: true
    }),
  ]
})
```

::: danger 注意
commonjs 模块无法进行摇树优化
:::

## 18. [性能优化篇] gzip压缩 （旧）

有时候我们的文件资源实在是太大了，http传输压力很大，这时我们可以将所有的静态文件进行压缩，已达到减少体积的目的。

服务端 --> 压缩文件 --> 浏览器 --> 解压文件

::: tip chunk
chunk: 块 从入口文件到他的一系列依赖最终打包成的js文件叫做块，**块最终会映射成js文件，但是块不是js文件**。
:::

参考地址：https://github.com/vbenjs/vite-plugin-compression

插件4年没更新了，现在使用 vite-plugin-compression2：  
npm地址：https://www.npmjs.com/package/vite-plugin-compression2  
github地址：https://github.com/nonzzz/vite-plugin-compression

压缩完成后给后端或者给运维

服务端读取gzip文件(`.gz`后缀)会设置一个响应头 content-encoding --> gzip (代表告诉浏览器该文件是使用gzip压缩过的) 浏览器收到响应结果 发现响应头里有gzip对应字段，就会执行解压，得到原来原原本本的js文件。(浏览器是要承担一定的解压时间的) 如果体积不是很大的话，不要用gzip压缩。

## 19. [性能优化篇] 动态导入

> webpack和vite的区别：vite是按需加载。动态导入是ES6的新特性，和按需加载异曲同工。

动态导入一般会用在路由中。（路由：根据不同的地址，展现不同的组件）

```javascript
// 原写法
import "./src/svgLoader";
// 新写法
import("./src/imageLoader").then(data => {
    console.log("data",data)
    });
```

异步加载，会造成代码分割情况 （webpack里的原理）


## 20. [性能优化篇] CDN加速

> 服务器在深圳，想在纽约访问这个网站，会卡顿

CDN(content delivery network): 内容分发网络

将我们依赖的第三方模块全部写成cdn的形式，然后保证我们自己代码的一个小体积。(体积小服务器和客户端的传输压力就没那么大) 例如：lodash，通过：https://www.jsdelivr.com/package/npm/lodash 引入，由于lodash是通过cdn加载的，自身的体积就小了。

使用vite-plugin-cdn-import插件：
1. 安装：`npm i vite-plugin-cdn-import -D`
2. 配置：
```javascript
// vite.config.js
import viteCDNPlugin from 'vite-plugin-cdn-import';

export default {
    plugins: [
        viteCDNPlugin({
            modules: [
                {
                name: 'lodash', // 模块名
                var: '_', // 模块变量名
                path: 'https://cdn.bootcdn.net/ajax/libs/lodash.js/4.17.21/lodash.min.js' // CDN 地址
        }
            ]
        })
    ]
}
```

## 21. [拓展篇] 跨域

> 同源策略（浏览器规则，仅在浏览器发生）：http交互默认情况下只能在同协议同域名同端口的两台终端进行。

跨域（仅发生在浏览器）：当A源浏览器的网页向B源的服务器地址 (不满足同源策略，满足同源限制) 请求对应信息，就会产生跨域，跨域请求默认情况下会被浏览器拦截，除非对应的请求服务器出具标记允许。

- 开发时态：一般就利用构建工具或者脚手架或者第三方库的proxy代理配置，或者我们自己搭一个开发服务器来解决这个问题。
- 生产时态：一般交给后端处理（后端或者运维）
    - nginx：代理服务（本质原理和本地开发vite服务器做跨域是一样）
    - 配置身份标记：`Access-Control-Allow-Origin`: 允许的源
```javascript
// vite.config.js
import { defineConfig } from 'vite'

export default defineConfig({
    server: { // 开发服务器中的配置
        proxy: { // 配置跨域解决方案
            "/api": { // key: 描述对象 以后在遇到/api开头的请求时 都将其代理到 target属性对应的域中去
                target: "http://www.baidu.com", 
                changeOrigin: true, 
                rewrite: (path) => path.replace(/^\/api/, "") // 重写api路径(正则)
            }
        }
    }
})
```

浏览器发请求 --> 自己的服务器 --> 目标服务器 --> 返回响应数据 --> 浏览器（因为跨域发生在浏览器，服务器之间传输不影响）
```javascript
if (ctx.request.url.includes("/api")) {
const target = proxy.target;
const rewrite = str => str

const result = await request(target + rewrite("/api"));

ctx.response.bodyresult;
}
```

## 22. [总结] 一些文件配置示例

```javascript
// vite.config.js
import { defineConfig, loadEnv } from 'vite';
import viteBaseConfig from './vite.base.config';
import viteDevConfig from './vite.dev.config';
import viteProdConfig from './vite.prod.config';

// 策略模式
const envResolver = {
    "build": () => {
        console.log("生产环境");
        return ({...viteBaseConfig, ...viteProdConfig})
    },
    "serve": () => {
        console.log("开发环境");
        return Object.assign({}, viteBaseConfig, viteDevConfig); // 新配置里是可能会被配置envDir
    }
    // 两个返回配置合并的写法都可以
}

export default defineConfig(({command, mode}) => {
    // 是build还是serve主要取决于我们执行的命令是开启生产环境还是开发环境
    // console.log("command:", command);
    // 当前env文件所在的目录
    // 第二个参数不是必须要用process.cwd(), 自己配置目录也可
    const env = loadEnv(mode, process.cwd(), ".env"); // .env为默认值可以不传
    // console.log("env:", env);
    return envResolver[command]();
});
```

```javascript
// vite.example.config.js
import { defineConfig } from 'vite';
import viteBaseConfig from './vite.base.config';

const postcssPresetEnv = require('postcss-preset-env');

export default defineConfig({
  optimizeDeps: {
    exclude: [], // 将某些包排除在预构建之外
  },
  envPrefix: 'ENV_', // 配置vite注入到客户端源码中的环境变量校验前缀
  css: {  // 对css的相关配置
    // modules配置最终是会丢给postcss modules
    modules: {  // 对css模块化的默认行为进行覆盖
      localsConvention: 'camelCase', // 配置css module转换类名的格式
      scopeBehaviour: 'local', // 配置css module的作用域行为是局部作用域还是全局作用域
      generateScopedName: '[name]_[local]_[hash:5]', // 配置css module生成的类名格式
      // generateScopedName: (name, filename, css) => { 
      //   // name: css文件中的类名
      //   // filename: css文件的绝对路径
      //   // css: css文件的样式
      //   console.log("name:", name, "filename:", filename, "css:", css);
      //   return `${name}_${Math.random().toString(16).substring(2, 8)}`;
      // }, // 自定义生成css module类名的函数
      hashPrefix: 'hello', // 生成hash会根据你的类名 + 一些其他的字符串(文件名 + 他内部随机生成一个字符事)去进  行生成，如果你想要你生成hash更加的独特一点，你可以配置hashPrefix，你配置的这个字符串会参与到最终的hash生成，(hash:只要你的字符串有一个字不一样，那么生成的hash就完全不一样，但是只要你的字符串完全一样，生成的hash就会一样)
      globalModulePaths: [] // 代表你不想参与css module化的文件路径
    },
    preprocessorOptions: {  // 配置css预处理器
      less: { // 配置less
        math: "always", // 
        globalVars: { // 配置全局变量
          mainColor: 'red',
        },
      },
      sass: { // 配置sass
      },
    },
    devSourcemap: true, // 开启css的sourceMap（文件索引）
    postcss: {
      plugins: [postcssPresetEnv()] // 配置postcss的插件
    },
  }, 
  resolve: {  // 配置路径别名
    alias: {
      '@': path.resolve(__dirname, './src'), // 设置别名，以后我们在其他组件中可以使用@来代替src这个目录
      '@assets': path.resolve(__dirname, './src/assets'),
    },
  },
  build: {  // 构建生产包时的一些配置策略
    rollupOptions: { // 配置rollup的构建策略
      output: { // 控制输出
        // 在rollup中，hash代表将你的文件名和文件内容组合计算得来的结果
        assetFileNames: '[hash].[name].[ext]', // 配置静态资源的输出格式
      }
    },
    outDir: 'dist', // 配置构建输出目录（默认为dist）
    assetsDir: 'assets', // 配置静态资源目录 例如改为static 则最终输出目录为dist/static
    assetsInlineLimit: 4096000, // 默认是4096（4kb）配置静态资源打包的阈值，小于这个阈值的静态资源会被打包成base64格式
    emptyOutDir: true, // 构建之前是否清空输出目录
  },
  plugins: [ 
   {
     // 配置插件
    viteAliases() {
      // 配置路径别名插件
    },
    createHtmlPlugin({
      inject: { // 配置注入的html文件
        data: {
        }
      }
    }) { 

    },
    viteMockServe() {
      // 配置mock服务
    }, 
    configResolved(options) { 
      // 整个vite配置解析完成后会执行这个钩子
      // vite在内部有一个默认的配置文件
      console.log("options:", options);
    },
    configurePreviewServer() { // 配置预览服务

    },
    options(rollupOptions) {
      console.log(rollupOptions);
    }, // 配置其他插件
    buildStart() { // 构建开始时执行
    },
   }
  ],
});
```