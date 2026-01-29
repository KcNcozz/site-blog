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

## 1. Vite开箱即用 (out of box)

开箱即用: 你不需要做任何额外的配置就可以使用vite来帮你处理构建工作

1. 创建项目：`yarn create vite@latest`
2. 运行项目：`yarn dev`
3. 构建项目：`yarn build`
> 在默认情况下，我们的esmodule去导入资源的时候，要么是绝对路径，要么是相对路径。既然我们现在的最佳实践就是node_modules，那为什么es官方在我们导入非绝对路径和非相对路径的资源的时候不默认帮我们 搜寻node_nodules呢? ---> 假设加载`loadsh`，`loadsh`依赖更多东西，如果都加载则消耗大量性能。

## 2. Vite预加载

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

## 3. Vite的配置文件

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

## 4. Vite环境变量配置

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
