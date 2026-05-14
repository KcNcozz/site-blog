# nestjs

## 常用命令

查看帮助

```sh
nest --help
```

## Restful 风格设计

### 风格

### 版本控制

开启版本控制:

```ts
// main.ts
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { VersioningType } from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableVersioning({
    type: VersioningType.URI, // 启用版本控制
  });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
```

然后在`@Controller()`装饰器中添加版本号

```ts
import { Controller, Get } from "@nestjs/common";
import { AppService } from "./app.service";

@Controller({
  version: "1", // 添加版本控制
})
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
```

### code码

```sh
200 # OK
304 Not Modified # 协商缓存
400 Bad  Request # 参数错误
401 Unauthorized token # 错误
403 Forbidden # 验证失败
404 NotFound # 接口不存在
500 Internal Server Error # 服务端错误
502 BadGateway # 上游接口有问题或者服务器问题
```

## 控制器

### Get

获取参数：

```ts
  @Get()
  findAll(@Request() req) {
    console.log(req.query);
    return {
      code: 200,
      message: req.query.name,
    };
  }
```

也可以使用`@Query()`装饰器:

```ts
  @Get()
  findAll(@Query() req: any) {
    // @Query('name')表明直接获取query.name
    console.log(req);
    return {
      code: 200,
      message: req.name,
    };
  }
```

### Post

```ts
  @Post()
  create(@Request() req: any) {
    console.log(req);
    return {
      code: 200,
      messsage: req.body,
    };
  }
```

也可以使用`@body()`装饰器:

```ts
  @Post()
  create(@Body('age') body: any) {
    // @Body('age')表明直接获取body.age
    console.log(body);
    return {
      code: 200,
      messsage: body,
    };
  }
```

### 动态参数

```ts
// 动态参数
  @Get(':id')
  findOne(@Request() id) {
    console.log(id.params);
    return {
      code: 200,
      message: id.params,
    };
  }

// 动态参数
  @Get(':id')
  findOne(@Param('id') id) {
    console.log(id);
    return {
      code: 200,
    };
  }

    @Get(':xxx')
  @HttpCode(201) // 状态码
  findOne(@Param('xxx') id, @Headers() headers) {
    // @Headers() 获取请求头
    console.log(id);
    return {
      code: 200,
      message: { id },
    };
  }
```

## Session

安装：

```sh
pnpm add express-session # session
pnpm add @types/express-session -D # session类型
```

配置session：

```ts
// main.ts
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { VersioningType } from "@nestjs/common"; // 版本控制
import session from "express-session"; // session

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableVersioning({
    type: VersioningType.URI, // 启用版本控制
  });
  app.use(
    // session
    session({
      secret: "keyboard cat", // 签名
      rolling: true, // 每次请求都重置过期时间
      name: "xxx.sid", // sessionId
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7, // 过期时间 7天
      },
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
```

### 验证码模块

```sh
pnpm add svg-captcha
```

## Providers

- `@Injectable()`
- 自定义名称
- 自定义值
- 工厂模式

## module

1. 共享模块

```ts
@Module({
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService], // 添加导出
})
```

2. 全局模块: 使用`@Global()`注解添加全局模块
3. 动态模块

## 中间件

```sh
nest g mi logger # 生成中间件
```

编写日志:

```ts
import { Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log("Request..."); // 输出日志
    next();
  }
}
```

在需要添加的模块中使用中间件:

```ts
// app.module.ts 这里是全部要使用的中间件
import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { UsersModule } from "./users/users.module";
import { LoggerMiddleware } from "./logger/logger.middleware";

@Module({
  imports: [UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  // 添加中间件
  configure(consumer: MiddlewareConsumer) {
    // forRoutes('*') 表示所有路由
    consumer.apply(LoggerMiddleware).forRoutes("*");
  }
}
```

全局中间件:

```ts
// main.ts
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { VersioningType } from "@nestjs/common";
import session from "express-session";
import { Request, Response, NextFunction } from "express"; // express类型

// 全局中间件
function MiddlewareAll(req: Request, res: Response, next: NextFunction) {
  console.log(req.originalUrl);
  next();
}

const whiteList = ["/users"];

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableVersioning({
    type: VersioningType.URI, // 启用版本控制
  });
  app.use(
    session({
      secret: "keyboard cat", // 签名
      rolling: true, // 每次请求都重置过期时间
      name: "xxx.sid", // sessionId
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7, // 过期时间 7天
      },
    }),
  );
  app.use(MiddlewareAll); // 全局中间件
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
```

貌似在app.module.ts中添加中间件放行所有路由也可以实现, 使用场景：

```ts
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { VersioningType } from "@nestjs/common";
import session from "express-session";
import { Request, Response, NextFunction } from "express";

function MiddlewareAll(req: Request, res: Response, next: NextFunction) {
  if (whiteList.includes(req.originalUrl)) next();
  else {
    res.send("无权访问");
    console.log(req.originalUrl);
  }
}

const whiteList = ["/users"];
// 如果要是'/users/:id'的话 不能直接在这里添加 要么使用正则表达式 要么在判断处使用startWith
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableVersioning({
    type: VersioningType.URI, // 启用版本控制
  });
  app.use(
    session({
      secret: "keyboard cat", // 签名
      rolling: true, // 每次请求都重置过期时间
      name: "xxx.sid", // sessionId
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7, // 过期时间 7天
      },
    }),
  );
  app.use(MiddlewareAll); // 全局中间件
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
```

允许跨域, 需要安装第三方中间件:

```sh
pnpm add cors
pnpm add @types/cors -D
```

```ts
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { VersioningType } from "@nestjs/common";
import session from "express-session";
import { Request, Response, NextFunction } from "express";
import cors from "cors"; // 跨域

function MiddlewareAll(req: Request, res: Response, next: NextFunction) {
  if (whiteList.includes(req.originalUrl)) next();
  else {
    res.send("无权访问");
    console.log(req.originalUrl);
  }
}

const whiteList = ["/users"];

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cors()); // 允许跨域
  app.enableVersioning({
    type: VersioningType.URI, // 启用版本控制
  });
  app.use(
    session({
      secret: "keyboard cat", // 签名
      rolling: true, // 每次请求都重置过期时间
      name: "xxx.sid", // sessionId
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7, // 过期时间 7天
      },
    }),
  );
  app.use(MiddlewareAll); // 全局中间件
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
```

## 上传文件 静态目录

安装:

```sh
pnpm add multer
pnpm add @types/multer -D
```

使用`nest g re`生成一个`uploads`:

```ts
// uploads.module.ts
import { Module } from "@nestjs/common";
import { UploadsService } from "./uploads.service";
import { UploadsController } from "./uploads.controller";
import { MulterModule } from "@nestjs/platform-express"; // 引入 multer 模块
import { diskStorage } from "multer"; //  引入 diskStorage
import { extname, join } from "path";

@Module({
  imports: [
    MulterModule.register({
      storage: diskStorage({
        destination: join(__dirname, "../images"),
        // 重命名文件
        filename(_, file, callback) {
          const filename = `${new Date().getTime() + extname(file.originalname)}`;
          return callback(null, filename);
        },
      }),
    }),
  ],
  controllers: [UploadsController],
  providers: [UploadsService],
})
export class UploadsModule {}
```

配置完成后在contreoller中使用:

```ts
import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { UploadsService } from "./uploads.service";
// 单个文件 多个文件
import { FileInterceptor, FilesInterceptor } from "@nestjs/platform-express";

@Controller("uploads")
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @Post("album")
  @UseInterceptors(FileInterceptor("file")) // 需要导入 UseInterceptors 用于处理文件
  upload(@UploadedFile() file) {
    console.log(file, "file");
    return "success1111";
  }
}
```

文件会被保存到`images`目录下, 如何访问: 配置静态资源访问目录

```ts
// main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { VersioningType } from '@nestjs/common';
import session from 'express-session';
import { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { NestExpressApplication } from '@nestjs/platform-express'; // 引入 NestExpressApplication
import { join } from 'path';

function MiddlewareAll(req: Request, res: Response, next: NextFunction) {
  if (whiteList.includes(req.originalUrl)) next();
  else {
    res.send('无权访问');
    console.log(req.originalUrl);
  }
}

const whiteList = ['/users'];

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.use(cors()); // 允许跨域
  app.useStaticAssets(join(__dirname, 'images'){
    prefix: '/images', // 路径前缀
  }); // 静态资源
  app.enableVersioning({
    type: VersioningType.URI, // 启用版本控制
  });
  app.use(
    session({
      secret: 'keyboard cat', // 签名
      rolling: true, // 每次请求都重置过期时间
      name: 'xxx.sid', // sessionId
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7, // 过期时间 7天
      },
    }),
  );
  app.use(MiddlewareAll); // 全局中间件
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
```

## 下载文件 文件流

```ts
import {
  Controller,
  Get,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { zip } from "compressing";
import { UploadsService } from "./uploads.service";
import type { Response } from "express"; // 引入 express 的 response 对象
// 单个文件 多个文件
import { FileInterceptor } from "@nestjs/platform-express";
import { join } from "path";

@Controller("uploads")
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @Post("album")
  @UseInterceptors(FileInterceptor("file")) // 需要导入 UseInterceptors 用于处理文件
  upload(@UploadedFile() file: any) {
    console.log(file, "file");
    return "success1111";
  }

  @Get("export")
  download(@Res() res: Response) {
    const url = join(__dirname, "../images/1.png");
    res.download(url);
  }

  // 流的方式需要安装一个模块 compressing
  @Get("stream")
  down(@Res() res: Response) {
    const url = join(__dirname, "../images/1.png");
    const tarStream = new zip.Stream();
    tarStream.addEntry(url);
    res.setHeader("Content-Type", "application/octet-stream");
    res.setHeader("Content-Disposition", "attachment; filename=xxx.zip");
    tarStream.pipe(res);
  }
}
```

## RxJs

RxJs使用的是观察者模式，用来编写异步队列和事件处理。 RxJS 可以理解为“把异步数据流当数组一样处理”的工具库。

1. Observable 可观察对象
   - 是一个“数据流生产者”，可以持续发出值（一次或多次）。
   - 比如：点击事件流、HTTP 请求结果流、定时器流、WebSocket 消息流。

2. Subscription 订阅
   - 你订阅 Observable 后，才会真正开始接收数据。
   - 还能 unsubscribe() 取消监听，避免内存泄漏。

3. Operators 操作符 如`mapfilter` `concat` `reduce`等
   - 是一组纯函数，用在 pipe(...) 里，负责“变换、过滤、组合、控制时序”。
   - 常见：
     - map：映射数据
     - filter：过滤数据
     - concatMap/switchMap：处理异步嵌套流
     - debounceTime：防抖
     - reduce：聚合结果

### 典型应用场景

1. 前端输入搜索防抖

- 用户连续输入时，延迟请求并取消旧请求（debounceTime + switchMap）。

2. 多接口编排

- 串行/并行调用多个 API，再合并结果（concatMap、mergeMap、forkJoin）。

3. 实时流处理

- WebSocket、SSE、消息队列数据清洗和分发。

4. NestJS 里

- Controller 可以直接返回 Observable。
- HttpService（axios 封装）返回的也是 Observable，可直接 pipe(map(...)) 处理响应。

RxJS 用来优雅处理“持续变化的异步数据流”，比 Promise 更适合事件流、取消、组合、重试和复杂时序控制。

## 响应拦截器

```ts
import {
  NestInterceptor,
  CallHandler,
  ExecutionContext,
  Injectable,
} from "@nestjs/common";
import { map, Observable } from "rxjs";

interface Data<T> {
  data: T;
}

@Injectable()
export class Response<T> implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<Data<T>> {
    // next.handle() 拿到 Controller 的返回流（Observable）
    return next.handle().pipe(
      // 用 RxJS map 包装返回数据
      map((data) => {
        // 原本的 data 转成统一结构
        // 不改业务逻辑，只改响应外壳
        return {
          data,
          status: 0,
          message: "success",
          success: true,
        };
      }),
    );
  }
}
```

然后再main.ts中引入:

```ts
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { VersioningType } from "@nestjs/common";
import session from "express-session";
import { Request, Response, NextFunction } from "express";
import cors from "cors";
import { NestExpressApplication } from "@nestjs/platform-express"; // 引入 NestExpressApplication
import { join } from "path";
import { Response as ResponseData } from "./common/response";

function MiddlewareAll(req: Request, res: Response, next: NextFunction) {
  if (whiteList.includes(req.originalUrl)) next();
  else {
    res.send("无权访问");
    console.log(req.originalUrl);
  }
}

const whiteList = ["/users"];

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.use(cors()); // 允许跨域
  app.useStaticAssets(join(__dirname, "images")); // 静态资源
  app.enableVersioning({
    type: VersioningType.URI, // 启用版本控制
  });
  app.use(
    session({
      secret: "keyboard cat", // 签名
      rolling: true, // 每次请求都重置过期时间
      name: "xxx.sid", // sessionId
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7, // 过期时间 7天
      },
    }),
  );
  app.use(MiddlewareAll); // 全局中间件
  app.useGlobalInterceptors(new ResponseData()); // 全局拦截器
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
```

## 异常拦截器

```ts
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from "@nestjs/common";
import { time } from "console";

import type { Request, Response } from "express";

@Catch(HttpException)
export class HttpFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    response.status(status).json({
      success: false,
      time: Date.now(),
      data: exception.message,
      status,
      path: request.url,
    });
  }
}
```

```ts
// main.ts
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { VersioningType } from "@nestjs/common";
import session from "express-session";
import { Request, Response, NextFunction } from "express";
import cors from "cors";
import { NestExpressApplication } from "@nestjs/platform-express"; // 引入 NestExpressApplication
import { join } from "path";
import { Response as ResponseData } from "./common/response";
import { HttpFilter } from "./common/filter";

function MiddlewareAll(req: Request, res: Response, next: NextFunction) {
  if (whiteList.includes(req.originalUrl)) next();
  else {
    res.send("无权访问");
    console.log(req.originalUrl);
  }
}

const whiteList = ["/users"];

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.use(cors()); // 允许跨域
  app.useStaticAssets(join(__dirname, "images")); // 静态资源
  app.enableVersioning({
    type: VersioningType.URI, // 启用版本控制
  });
  app.use(
    session({
      secret: "keyboard cat", // 签名
      rolling: true, // 每次请求都重置过期时间
      name: "xxx.sid", // sessionId
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7, // 过期时间 7天
      },
    }),
  );
  app.useGlobalFilters(new HttpFilter()); // 全局过滤器
  app.use(MiddlewareAll); // 全局中间件
  app.useGlobalInterceptors(new ResponseData()); // 全局拦截器
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
```

## pipe-transform

1. 转换，可以将前端传入的数据转成成我们需要的数据
2. 验证类似于前端的rules配置验证规则

```ts
  findOne(@Param('id', ParseIntPipe) id: number) {
    return `This action returns a #${id} user`;
  }
```

安装uuid:

```sh
pnpm add uuid
pnpm add @types/uuid
```

## pipe-验证DTO

1. 生成目录:`nest g res login`

```ts
import { LoginPipe } from './login/login.pipe';
// ....
  @Post()
  // 直接把参数传入@Body(LoginPipe)
  create(@Body(LoginPipe) createLoginDto: CreateLoginDto) {
    return this.loginService.create(createLoginDto);
  }
```

然后就可以生效了.

```sh
pnpm add class-validator class-transformer # 类似于Java的注解 用在实体类上
```

在实体类上添加这些验证规则:

```ts
import { IsNotEmpty, IsNumber, IsString, Length } from "class-validator";

export class CreateLoginDto {
  @IsNotEmpty()
  @IsString()
  @Length(5, 10, { message: "长度在5-10之间" })
  name: string;
  @IsNumber()
  age: number;
}
```

然后再配置中去实现验证:

```ts
import {
  ArgumentMetadata,
  HttpException,
  HttpStatus,
  Injectable,
  PipeTransform,
} from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";

@Injectable()
export class LoginPipe implements PipeTransform {
  async transform(value: unknown, metadata: ArgumentMetadata) {
    const { metatype } = metadata;

    if (!metatype || this.isPrimitive(metatype)) {
      return value;
    }

    const dto = plainToInstance(metatype, value);
    const errors = await validate(dto as object);

    if (errors.length > 0) {
      throw new HttpException(errors, HttpStatus.BAD_REQUEST);
    }

    return dto;
  }

  private isPrimitive(metatype: Function) {
    return (
      metatype === String ||
      metatype === Boolean ||
      metatype === Number ||
      metatype === Array ||
      metatype === Object
    );
  }
}
```

全局配置(可以代替上述手写的pipe):

```ts
// main.ts
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { VersioningType } from "@nestjs/common";
import session from "express-session";
import { Request, Response, NextFunction } from "express";
import cors from "cors";
import { NestExpressApplication } from "@nestjs/platform-express"; // 引入 NestExpressApplication
import { join } from "path";
import { Response as ResponseData } from "./common/response";
import { HttpFilter } from "./common/filter";
import { ValidationPipe } from "@nestjs/common"; // 引入 ValidationPipe

function MiddlewareAll(req: Request, res: Response, next: NextFunction) {
  if (whiteList.includes(req.originalUrl)) next();
  else {
    res.send("无权访问");
    console.log(req.originalUrl);
  }
}

const whiteList = ["/users"];

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.use(cors()); // 允许跨域
  app.useStaticAssets(join(__dirname, "images")); // 静态资源
  app.enableVersioning({
    type: VersioningType.URI, // 启用版本控制
  });
  app.use(
    session({
      secret: "keyboard cat", // 签名
      rolling: true, // 每次请求都重置过期时间
      name: "xxx.sid", // sessionId
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7, // 过期时间 7天
      },
    }),
  );
  app.useGlobalFilters(new HttpFilter()); // 全局过滤器
  app.use(MiddlewareAll); // 全局中间件
  app.useGlobalInterceptors(new ResponseData()); // 全局拦截器
  app.useGlobalPipes(new ValidationPipe()); // 全局验证管道
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
```

## 爬虫

## 守卫 guard

使用`nest g guard`命令生成守卫, 比如要给`guard.controller.ts`添加权限验证, 可以在`guard.controller.ts`中添加守卫:

```ts
// guard.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards, // 引入权限守卫
} from "@nestjs/common";
import { GuardService } from "./guard.service";
import { CreateGuardDto } from "./dto/create-guard.dto";
import { UpdateGuardDto } from "./dto/update-guard.dto";
import { RoleGuard } from "../guard/role/role.guard"; // 引入权限守卫

@Controller("guard") // 添加权限守卫
@UseGuards(RoleGuard)
export class GuardController {
  constructor(private readonly guardService: GuardService) {}

  @Post()
  create(@Body() createGuardDto: CreateGuardDto) {
    return this.guardService.create(createGuardDto);
  }

  @Get()
  findAll() {
    return this.guardService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.guardService.findOne(+id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateGuardDto: UpdateGuardDto) {
    return this.guardService.update(+id, updateGuardDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.guardService.remove(+id);
  }
}
```

### 全局守卫

如果要全局生效:

```ts
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { VersioningType } from "@nestjs/common";
import session from "express-session";
import { Request, Response, NextFunction } from "express";
import cors from "cors";
import { NestExpressApplication } from "@nestjs/platform-express"; // 引入 NestExpressApplication
import { join } from "path";
import { Response as ResponseData } from "./common/response";
import { HttpFilter } from "./common/filter";
import { ValidationPipe } from "@nestjs/common"; // 引入 ValidationPipe
import { RoleGuard } from "./guard/role/role.guard";

function MiddlewareAll(req: Request, res: Response, next: NextFunction) {
  if (whiteList.includes(req.originalUrl)) next();
  else {
    res.send("无权访问");
    console.log(req.originalUrl);
  }
}

const whiteList = ["/users", "/guard"];

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.use(cors()); // 允许跨域
  app.useStaticAssets(join(__dirname, "images")); // 静态资源
  app.enableVersioning({
    type: VersioningType.URI, // 启用版本控制
  });
  app.use(
    session({
      secret: "keyboard cat", // 签名
      rolling: true, // 每次请求都重置过期时间
      name: "xxx.sid", // sessionId
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7, // 过期时间 7天
      },
    }),
  );
  app.useGlobalFilters(new HttpFilter()); // 全局过滤器
  app.use(MiddlewareAll); // 全局中间件
  app.useGlobalInterceptors(new ResponseData()); // 全局拦截器
  app.useGlobalPipes(new ValidationPipe()); // 全局验证管道
  // app.useGlobalGuards(new RoleGuard()); // 全局守卫
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
```

### 智能守卫

```ts
// guard.controller.ts
// ...
  @Get()
  @SetMetadata('role', ['admin']) // 添加权限
  findAll() {
    return this.guardService.findAll();
  }
```

### 配置守卫

如何使用:

```ts
import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";

import { Reflector } from "@nestjs/core"; // 引入反射
import type { Request } from "express";

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const admin = this.reflector.get<string[]>("role", context.getHandler());
    const req = context.switchToHttp().getRequest<Request>();
    if (admin.includes(req.query.role as string)) {
      return true;
    } else {
      return false;
    }
    console.log("RoleGuard", admin);
  }
}
```

## 自定义装饰器

使用`nest g d role`生成一个自定义装饰器:

```ts
// role.decorator.ts 默认是这样的
import { SetMetadata } from "@nestjs/common";

export const Role = (...args: string[]) => SetMetadata("role", args);
```

在`controller.ts`中添加:

```ts
// guard.controller.ts
// ...
import { Role } from '../guard/role/role.decorator';
// ...
  @Get()
  @Role('admin')
  findAll() {
    return this.guardService.findAll();
  }
```

自定义参数装饰器:

```ts
import {
  createParamDecorator,
  ExecutionContext,
  SetMetadata,
  applyDecorators,
} from "@nestjs/common";
import { ExecException } from "child_process";
import type { Request } from "express";

export const Role = (...args: string[]) => SetMetadata("role", args);

// 自定义参数装饰器
export const ReqUrl = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();
    console.log("ReqUrl", data);
    // return request.url;
    return applyDecorators(Role); // 聚合装饰器 将所有装饰器聚合起来 统一返回
  },
);
```

## swagger

1. 安装: ` pnpm add @nestjs/swagger swagger-ui-express`

```ts
// main.ts
// ...
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger"; // 引入 SwaggerModule 和 DocumentBuilder

const options = new DocumentBuilder()
  .addBearerAuth()
  .setTitle("测试文档")
  .setDescription("测试文档")
  .setVersion("1.0")
  .build();
const document = SwaggerModule.createDocument(app, options);
SwaggerModule.setup("/api-docs", app, document);
```

具体的一些装饰器的用法示例:

```ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  SetMetadata, // 引入权限守卫
} from "@nestjs/common";
import { GuardService } from "./guard.service";
import { CreateGuardDto } from "./dto/create-guard.dto";
import { UpdateGuardDto } from "./dto/update-guard.dto";
import { RoleGuard } from "../guard/role/role.guard";
import { Role, ReqUrl } from "../guard/role/role.decorator";
import { ApiOperation, ApiParam, ApiQuery, ApiTags } from "@nestjs/swagger";

@Controller("guard") // 添加权限守卫
@UseGuards(RoleGuard)
@ApiTags("守卫接口")
@ApiBearerAuth() // 添加bearer 比如token
export class GuardController {
  constructor(private readonly guardService: GuardService) {}

  @Post()
  create(@Body() createGuardDto: CreateGuardDto) {
    return this.guardService.create(createGuardDto);
  }

  @Get()
  @Role("admin")
  @ApiOperation({
    summary: "get",
    description: "获取所有用户列表",
  })
  @ApiQuery({
    name: "name",
    description: "用户名",
  })
  findAll(@ReqUrl("123") url: string) {
    return this.guardService.findAll();
  }

  @Get(":id")
  @ApiParam({
    name: "id",
    description: "用户id",
    required: true,
    type: Number,
  })
  findOne(@Param("id") id: string) {
    return this.guardService.findOne(+id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateGuardDto: UpdateGuardDto) {
    return this.guardService.update(+id, updateGuardDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.guardService.remove(+id);
  }
}
```

## Prisma ORM
