# 项目基础知识汇总

## nestjs 基础

1. 如果不需要每次创建文件都附加单元测试文件

```json
// nest-cli.json
"generateOptions": {
    "spec": false
  }
```

2. 查看相关命令`nest g --help`
3. 数据验证层DTO, 需要安装`@nestjs/class-validator`
4. 使用`REST Client`进行HTTP测试
5. 拦截器: 生成拦截器命令:`nest g itc 拦截器名称` 拦截器包含局部拦截器和全局拦截器两种

## \*业务逻辑

不同的业务有不同的 code和message

1. `interceptor` 管成功结果，负责“包装响应”
   - 统一成功响应结构，包装成 `{ timestamp, data, path, message, code, success }`
   - 递归转换特殊类型，把 `bigint` 转成字符串、把 Date 转成时间戳，避免 JSON 序列化问题
2. `exception-filter` 管失败结果，负责“包装错误”

## Prisma ORM

安装:` npm add @prisma/client prisma`

### prisma命令详解

| 命令               | 用途                                                                                                |
| ------------------ | --------------------------------------------------------------------------------------------------- |
| prisma init        | 初始化项目 - 创建一个新的本地 Prisma Postgres 开发项目，生成 schema.prisma 等基础文件               |
| prisma dev         | 启动开发服务器 - 启动一个本地的 Prisma Postgres 服务器用于开发                                      |
| prisma generate    | 生成 Prisma Client - 根据 schema 生成类型安全的数据库客户端代码，每次修改 schema 后都需要运行       |
| prisma studio      | 可视化数据库 - 打开一个 Web 界面，让你可以浏览和编辑数据库中的数据                                  |
| prisma migrate dev | 开发环境迁移 - 根据 schema 变更创建迁移文件，应用到数据库，并重新生成 Prisma Client（开发时最常用） |
| prisma db pull     | 拉取数据库结构 - 从现有数据库反向生成/更新 schema.prisma（适用于已有数据库的项目）                  |
| prisma db push     | 推送 schema 到数据库 - 直接将 schema 变更同步到数据库，不创建迁移文件（适合原型开发阶段）           |
| prisma validate    | 验证 schema - 检查 schema.prisma 文件的语法和配置是否正确                                           |
| prisma format      | 格式化 schema - 自动格式化 schema.prisma 文件，使其更易读                                           |
| prisma version     | 显示版本 - 查看当前安装的 Prisma 版本信息                                                           |
| prisma debug       | 调试信息 - 显示 Prisma 的调试信息，排查问题时有用                                                   |

还要下载`dotenv`,然后读取`.env`文件: `DATABASE_URL="postgresql://postgres:123456@localhost:5432/test"`

```ts
// 表
model User {
  id       String      @id @default(cuid()) // 主键 创建时默认生成cuid
  email    String   @unique // 唯一值
  password String
  createdAt DateTime @default(now()) // 自动生成创建时间
  updatedAt DateTime @updatedAt // 更新时间
  posts     Post[]
}

model Post {
  id        String      @id @default(cuid())
  title     String
  content   String
  userId    String
  user      User @relation(fields: [userId], references: [id], onDelete: Cascade, onUpdate: Cascade) // 外键关联 级联删除
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

// @db.VarChar(255) 定义原生数据库的一些字段
// @default() 默认值
// @unique() 唯一值
// @ignore() 忽略字段
// @map() 字段名称映射 字段别名
// @relation() 关联字段 比如一个用户有多个文章
// @@map() 表名称映射 表别名
// @@index([email]) 增加索引 比如email频繁查询 写入索引 提高查询效率
```

数据表创建完成之后, 执行`pnpm dlx prisma migrate dev --name init` 迁移数据表, 这个操作会生成SQL语句并且自动执行这个SQL语句. 然后再执行`pnpm dlx prisma generate` 生成数据库客户端代码, 会生成代码提示

::: info Prisma 7.0

需要暗中适配器(不同的数据库拥有不同的适配器)

适用于Postgre的适配器:`pnpm add @prisma/adapter-pg`

:::

```ts
// import { PrismaClient } from '@prisma/client'; 这是旧版本写法
import { PrismaClient } from '../generated/prisma/client'; // 7.0 写法
import { PrismaPg } from '@prisma/adapter-pg';
import 'dotenv/config';

// 获取数据库连接字符串
const connectionString = `${process.env.DATABASE_URL}`;

// 创建适配器
const adapter = new PrismaPg({ connectionString });
// 创建 prisma 客户端
const prisma = new PrismaClient({ adapter });

const main = async () => {
  await prisma.$connect();
  console.log('Prisma connected');

  // 创建用户
  const user = await prisma.user.create({
    data: {
      email: 'test@example.com',
      password: '123456',
    },
  });
  // 也可以增加子表
  const user = await prisma.user.create({
    data: {
      email: 'test@example.com',
      password: '123456',
      posts: {
        create: {
          title: 'Test Post',
          content: 'This is a test post.',
        },
      },
    },
  });
  console.log('Created user:', user);

  // 查询
  const users = await prisma.user.findMany();
  console.log('Users:', users);

  // 查询关联数据
  const users = await prisma.user.findMany(
    include: {
      posts: true,
    }
  );
  console.log('Users:', users);

  // 更新
  const updatedUser = await prisma.user.update({
    where: {
      id: '1',
    },
    data: {
      email: 'test111@example.com',
    }
  })
  console.log('Updated user:', updatedUser);

  // 删除
  const deletedUser = await prisma.user.delete({
    where: {
      id: '1',
    }
  })
  // 注意删除的时候报错 因为有外键 可以在数据表位置设置为级联删除
  console.log('Deleted user:', deletedUser);


  // 查询
  // 查询条件
  const where:UserWhereInput = {
    // email: 'test@example.com', // 精确查询
    // 模糊查询
    email:{
      contains: 'test', // 包含
      startsWith: 'test', // 开头
      endsWith: 'test', // 结尾
      gt: 1, // 大于
      lt: 1, // 小于
      gte: 1, // 大于等于
      lte: 1, // 小于等于
      in: [1,2,3], // 在列表中
      notIn: [1,2,3], // 不在列表中
      between: [1,2], // 在某个范围
      not: { // 不包含
        email: 'test@example.com',
      }
    }
  }
  // 查询方法
  const count = await prisma.user.count({
    where:where,
  })
  const users = await prisma.user.findMany({
    where:where,
  })
  // 排序
  const users = await prisma.user.findMany({
    where:where,
    orderBy:{ // 排序
      id: 'desc', // 升序asc 降序desc
}
  })
  // 多条件排序变为数组
  const users = await prisma.user.findMany({
    where:where,
    orderBy:[
      {id: 'desc'},
      {email: 'asc'},
    ]
  })
  // 分页
  const users = await prisma.user.findMany({
    where:where,
    skip: 10, // 跳过前10条数据
    take: 10, // 取前10条数据
  })

  /**
   * 举例
   * 1 2 3 4 5 6 7 8 9 10
   * page: 1
   * pageSize: 10
   * skip: (page - 1) * pageSize
   * take: pageSize
   */

  // 事务
  prisma.$transaction(async (tx) => {
    // A B 转账 A 减10 B 加10
    // 要么都成功或者都失败 保持原子一致性
   })
   await prisma.$disconnect(); // 断开连接
};

main();
```

如果后续更新了数据表结构, 可以执行`pnpm dlx prisma migrate dev --name update`重新生成迁移文件, 然后执行`pnpm dlx prisma generate`重新生成数据库客户端代码

::: tips 命令作用

- `pnpm dlx prisma migrate dev --name update` 作用是改数据库。它会根据你 schema.prisma 的变更生成一份 migration，名字里带上 update，然后把这次 migration 应用到开发数据库里。还会检查 migration 历史、更新 \_prisma_migrations 表。这是开发环境命令，不该直接用于生产。

- `pnpm dlx prisma generate` 作用是重新生成 Prisma Client 等代码产物。它不会改数据库结构，只会根据当前 schema.prisma 更新你代码里用到的 Prisma 类型和客户端文件。

可以直接这样理解：

- `migrate dev` = “把 schema 变更落到数据库，并生成迁移文件”
- `generate` = “把 schema 变更落到 Prisma 代码客户端”

常见流程是：

1. 改 schema.prisma
2. 运行 pnpm dlx prisma migrate dev --name xxx
3. 再运行 pnpm dlx prisma generate

:::

## ThreeJS

### 基础用法

安装：`pnpm add three @types/three`

```ts
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'; // 控制器

// 创建场景
const scene = new THREE.Scene();

// 创建几何体
// 几何体有很多种
const geometry = new THREE.BoxGeometry(100, 100, 100);

// 创建材质
// 默认材质 MeshBasicMaterial 不受光照影响
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });

// 网格 包含 几何体 和 材质
// 可以有多个网格
const mesh = new THREE.Mesh(geometry, material);

// 添加到场景中
scene.add(mesh);

// 创建环境光
// 环境光 平行光 点光源 聚光灯
const light = new THREE.AmbientLight(0xffffff);
scene.add(light);

// 创建相机
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000,
);
// 设置相机位置
camera.position.set(0, 0, 400);
// 添加到场景中
scene.add(camera);

// 创建渲染器
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 渲染
renderer.render(scene, camera);

// 创建控制器
const controls = new OrbitControls(camera, renderer.domElement);

// 实时控制函数
const animate = () => {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
};
animate();
```

### 加载模型

```ts
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

// 创建场景
const scene = new THREE.Scene();

// 添加环境光
const light = new THREE.AmbientLight(0xffffff);
scene.add(light);

// 初始化加载器
const loader = new GLTFLoader();
loader.load('./models/scene.gltf', (gltf) => {
  scene.add(gltf.scene);
});
```

## SSE魔改

SSE单工通讯, 前端给后端发送一次数据, 后端可以一直给前端发送数据

模拟SSE:

```ts
// 后端
import express from 'express';
import cors from 'cors';
const app = express();
app.use(cors());
app.use(express.json());

// SSE要求接口必须是GET请求
app.get('/chat', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream'); // 返回SSE
  res.setHeader('Cache-Control', 'no-cache'); // 告诉浏览器不要缓存数据
  res.setHeader('Connection', 'keep-alive'); // 保持连接
  setInterval(() => {
    res.write(`data: ${new Date().toISOString()}\n\n`);
  }, 1000);
});

app.listen(3000, () => {
  console.log('Server started on port 3000');
});
```

```html
<!-- 前端 -->
<script>
  const sse = new EventSource('http://localhost:3000/chat');
  sse.onmessage = (event) => {
    console.log(event.data);
  };
</script>
```

上面就是正常的SSE, 但是因为限制只能使用GET请求, 但是一般在实际项目中会使用POST, 所以需要魔改SSE

后端直接把请求方式改为POST, 前端:

```html
<!-- 前端 -->
<script>
  fetch('http://localhost:3000/chat', {
    headers: {
      'Content-Type': 'application/json',
    }
    method: 'POST',
    body: JSON.stringify({ message: 'hello' }),
  })
    .then(async (res) => {
      const reader = res.body.getReader(); // 获取流
      const decoder = new TextDecoder();
      while (true) {
        const { done, value } = await reader.read(); // 读取数据 返回一个迭代器
        // value 是一个ASCII码数组
        if (done) break; // 没有数据了 跳出循环
        const text = decoder.decode(value, { stream: true }); // 转换为字符串
        console.log(text);
      }
    })
</script>
```

## Langchain

安装：`pnpm add langchain @langchain/core @langchain/deepseek` 使用DeepSeek作为演示

```ts
// 后端
import express from 'express';
import cors from 'cors';
import { DeepSeek } from '@langchain/deepseek';
import { createAgent } from '@langchain';

const model = new DeepSeek({
  apiKey: 'YOUR_API_KEY',
  model: 'deepseek-chat',
  temperature: 1.3, // 模型温度 见官网文档
  maxTokens: 1024, // 模型最大输出长度
  topP: 1, // 设置越小 AI说话越死板 越大越自由
  frequencyPenalty: 0, // 模型重复性惩罚 防止重复 -2 --> -2
  presencePenalty: 0, // 换话题时的惩罚 -2 --> -2
});

const app = express();
app.use(cors());
app.use(express.json());

// SSE要求接口必须是GET请求
app.get('/chat', await (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream'); // 返回SSE
  res.setHeader('Cache-Control', 'no-cache'); // 告诉浏览器不要缓存数据
  res.setHeader('Connection', 'keep-alive'); // 保持连接
  const agent = createAgent({
    model: model,
    systemPrompt: 'You are a helpful assistant.', // 系统提示词
  });
  const result = await agent.stream(
    {
      messages: [
        {
          role: 'user',
          content: req.body.message,
        },
      ],
    },
    { streamMode: 'messages' },
  );
  // 迭代器语法糖
  for await (const chunk of result) {
    res.write(`data: ${chunk.content}\n\n`);
  }
  res.end();
});

app.listen(3000, () => {
  console.log('Server started on port 3000');
});
```

## 支付宝SDK

安装：`pnpm add alipay-sdk`

### 注册沙箱账号

1. 支付宝沙箱模拟测试的
2. 上线只需要换成真实网关即可

网址: https://openhome.alipay.com/develop/sandbox/app
秘钥工具下载: https://opendocs.alipay.com/common/02kipk

### 步骤

1. 下载支付宝秘钥工具
2. 进入沙盒控制台: https://openhome.alipay.com/develop/sandbox/app
3. 开发信息 --> 接口加密方式 --> 自定义密钥 --> 公钥模式 --> 使用支付宝秘钥工具生成密钥 --> 将生成的公钥填入 --> 私钥需要进行转换, 使用支付宝秘钥工具的转换工具进行转换(因为非JAVA环境 支付宝的私钥格式和Node.js的私钥格式不一致)
4. 编写代码

```ts
// 普通公钥模式
import { AlipaySdk } from 'alipay-sdk';
import express from 'express';

// 提供一个用于接收支付宝异步通知
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // 解析数据

const alipaySdk = new AlipaySdk({
  appId: '202100011764XXXX', // 沙箱账号 在控制台查看
  gateway: 'https://openapi.alipaydev.com/gateway.do', // 沙箱网关 在控制台查看
  privateKey: 'MIIEpAIBAAKCAQEAyXXXXXXXXXXXXXX', // 私钥 用刚刚转换完成的私钥
  alipayPublicKey:
    'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAyXXXXXXXXXXXXXX', // 开发信息 --> 接口加密方式 --> 自定义密钥 --> 公钥模式 --> 支付宝公钥
});

// 生成订单号
const genGoodNo = () => {
  return Date.now() + Math.random().toString(36).slice(2, 15);
};

const bizContent = {
  out_trade_no: genGoodNo(), // 订单号
  product_code: 'FAST_INSTANT_TRADE_PAY', // 产品码
  subject: 'abc', // 订单标题
  body: '234', // 订单描述
  total_amount: '0.01', // 订单金额
};

// 支付页面接口，返回 HTML 代码片段，内容为 Form 表单
const html = alipaySdk.pageExecute('alipay.trade.page.pay', 'GET', {
  bizContent,
  // returnUrl: 'https://www.taobao.com', // 支付成功后跳转的页面
  // 不使用重定向 使用异步回调
  // 需要使用内网穿透 ngrok(https://ngrok.cc/) 或者 云服务器
  notify_url: 'https://www.taobao.com',
});

console.log(html);

app.all('/alipay/notify', (req, res) => {
  console.log(req.body);
  res.send('success');
});
app.listen(3000, () => {
  console.log('Server started on port 3000');
});
```

内网穿透:

1. 安装ngrok
2. 进入网址 --> 隧道管理 -->创建一个http隧道, 名称域名随便填, 端口填3000, 下面两个不填 --> 生成
3. 在ngrok文件夹cmd中运行刚刚生成的一个命令, 启动成功后会提供一个网址, 这个网址就是内网穿透后的网址
