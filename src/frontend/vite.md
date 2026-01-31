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

1. 创建项目：`yarn create vite@latest`
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
export default () => { 
    // 做的最主要的事情就是拦截http请求
    // 当我们使用fetch或者axios去请求的
    // axios baseUrl //请求地址
    // 当打给本地的开发服务器的时候 viteserver服务器接管
    return { 
        configureServer(server) { 
            // 服务器相关配置
            server.middlewares.use(async (req, res, next) => { 
                
            })
        }
    }
}

```