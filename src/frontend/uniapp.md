# Uniapp 学习笔记

> 只记录 uniapp 微信小程序开发相关的知识点

## 1. 标签对照表

| HTML       | uniapp          | 说明               |
| ---------- | --------------- | ------------------ |
| `<div>`    | `<view>`        | 块容器             |
| `<span>`   | `<text>`        | 行内文字           |
| `<img>`    | `<image>`       | 图片               |
| `<input>`  | `<input>`       | 输入框（属性不同） |
| `<button>` | `<button>`      | 按钮               |
| `<a>`      | `<navigator>`   | 导航链接           |
| 无         | `<scroll-view>` | 可滚动区域         |

**必须用 `<view>` `<text>` `<image>`**，不能用 div/span/img。

## 2. rpx 单位

- **750rpx = 屏幕宽度**
- 设计稿 750px 宽 → 数值 1:1 写 rpx
- 例：`font-size: 32rpx`（≈ 16px 视觉宽度）

## 3. 关键配置

### 3.1 `manifest.json`

**微信小程序 appid**：

```json
{
  "mp-weixin": {
    "appid": "",
    "setting": { "urlCheck": false },
    "usingComponents": true
  }
}
```

**两个 appid 不要混淆**：

- 顶层 `appid` = uniapp/DCloud 的 appid
- `mp-weixin.appid` = 微信小程序的 appid

### 3.2 `pages.json`

所有页面必须注册。第一项是启动页。

```json
{
  "pages": [
    {
      "path": "pages/index/index",
      "style": {
        "navigationBarTitleText": "首页",
        "enablePullDownRefresh": false
      }
    }
  ],
  "globalStyle": {
    "navigationBarTextStyle": "black",
    "navigationBarTitleText": "默认标题",
    "navigationBarBackgroundColor": "#F8F8F8",
    "backgroundColor": "#F8F8F8"
  }
}
```

**和 Vue Router 差异**：

|          | Vue Router             | uniapp pages.json                       |
| -------- | ---------------------- | --------------------------------------- |
| 路由定义 | `routes` 数组 + 组件   | `pages` 数组 + `.vue` 路径              |
| 跳转     | `router.push('/path')` | `uni.navigateTo({ url: '/pages/...' })` |
| 传参     | `query/params` 对象    | URL query string：`?id=123`             |
| 动态路由 | `/user/:id`            | 不支持，用 query                        |
| 嵌套路由 | children               | 不支持                                  |

### 3.3 `main.ts`

```ts
import { createSSRApp } from "vue"; // 必须是 SSR，不要改 createApp
import App from "./App.vue";

export function createApp() {
  const app = createSSRApp(App);
  return { app };
}
```

## 4. 生命周期

### 4.1 应用级（在 `App.vue`）

```ts
import { onLaunch, onShow, onHide } from "@dcloudio/uni-app";

onLaunch(() => {
  /* 启动触发一次 */
});
onShow(() => {
  /* 切到前台 */
});
onHide(() => {
  /* 切到后台 */
});
```

### 4.2 页面级（在页面 .vue）

```ts
import { onLoad, onShow, onReady, onUnload } from "@dcloudio/uni-app";

onLoad((options) => {
  // options 是 URL query 参数
});

onShow(() => {
  /* 每次页面显示都触发 */
});
onReady(() => {
  /* 页面首次渲染完成 */
});
onUnload(() => {
  /* 页面卸载 */
});
```

### 4.3 下拉刷新 / 触底

**pages.json 需开启**：

```json
{ "path": "pages/xxx/xxx", "style": { "enablePullDownRefresh": true } }
```

**页面代码**：

```ts
onPullDownRefresh(() => {
  // 关键：必须手动关闭动画
  uni.stopPullDownRefresh();
});

onReachBottom(() => {
  /* 上拉触底，自动触发 */
});
```

**触发规则**：`onReachBottom` 在页面滚到距离底部 50px 时触发。**前提：页面必须能滚动**（内容溢出视口）。模拟器窗口过大可能不滚动，需要真机测试或调小模拟器窗口。

## 5. 常用 API

### 5.1 交互反馈

```ts
uni.showToast({ title: "成功", icon: "success" });

uni.showModal({
  title: "提示",
  content: "确定删除？",
  success: (res) => {
    if (res.confirm) {
      /* 用户点了确定 */
    }
  },
});
```

### 5.2 路由跳转

```ts
uni.navigateTo({ url: "/pages/about/about?from=homepage" }); // 普通跳转
uni.redirectTo({ url: "/pages/login/login" }); // 重定向（关闭当前页）
uni.switchTab({ url: "/pages/index/index" }); // 跳 tabBar 页面必须用这个
uni.navigateBack({ delta: 1 }); // 返回上一页
```

### 5.3 网络请求

```ts
uni.request({
  url: "https://api.example.com/users",
  method: "GET",
  data: { id: 1 },
  header: { token: "xxx" },
  success: (res) => {
    // res.data 是真实数据
    // res.statusCode 是 HTTP 状态码
  },
  fail: (err) => {
    /* 网络错误 */
  },
});
```

### 5.4 本地存储

```ts
// 存
uni.setStorageSync("key", value);

// 取（不存在的 key 返回 ''）
uni.getStorageSync("key");

// 删
uni.removeStorageSync("key");

// 清空全部
uni.clearStorageSync();
```

### 5.5 系统信息

```ts
const info = uni.getSystemInfoSync();
console.log(info.screenWidth, info.platform); // 'devtools' / 'ios' / 'android'
```

### 5.6 条件编译

不同代码块在不同平台编译时保留 / 删除。

**JS**：

```ts
// #ifdef MP-WEIXIN
console.log("只在微信小程序里执行");
// #endif
```

**template**：

```vue
<!-- #ifdef MP-WEIXIN -->
<text>微信专属</text>
<!-- #endif -->
```

**style**：

```scss
/* #ifdef MP-WEIXIN */
.weixin-only {
  color: red;
}
/* #endif */
```

**常用关键字**：`MP-WEIXIN` / `MP-ALIPAY` / `H5` / `APP` / `DEV` / `PROD`

### 5.7 API 封装层

**目录结构**：

```
src/utils/
├── request.ts   # 封装 uni.request
├── types.ts     # 类型定义
└── api.ts       # 业务 API（userApi、postApi）
```

**核心：request.ts**：

```ts
export function request<T>(options) {
  return new Promise((resolve, reject) => {
    const token = uni.getStorageSync("token");
    uni.request({
      ...options,
      header: {
        Authorization: token ? `Bearer ${token}` : "",
        ...options.header,
      },
      success: (res) => {
        if (res.statusCode === 401) {
          uni.removeStorageSync("token");
          uni.navigateTo({ url: "/pages/login/login" });
        }
        if (res.statusCode >= 200 && res.statusCode < 300) resolve(res.data);
        else reject(res.data);
      },
      fail: (err) => reject(err),
    });
  });
}

export const get = <T>(url: string, data?: any) =>
  request<T>({ url, method: "GET", data });
export const post = <T>(url: string, data?: any) =>
  request<T>({ url, method: "POST", data });
```

**业务 API（api.ts）**：

```ts
import { get, post } from "./request";

export const userApi = {
  getUser: (id: number) => get<any>(`/users/${id}`),
  login: (data: any) => post<{ token: string }>("/login", data),
};
```

**使用**：`userApi.getUser(1)` —— 调用方不用关心 URL、token、错误处理。

### 5.8 分包加载

**为什么**：微信小程序主包限制 2MB，超过要分包加载。

**目录结构**：

```
src/
├── pages/                    # 主包（启动必须下载）
└── subpackages/
    └── profile/
        └── pages/
            └── profile/profile.vue   # 分包页面
```

**pages.json 配置**：

```json
{
  "subPackages": [
    {
      "root": "subpackages/profile",
      "pages": [{ "path": "pages/profile/profile" }]
    }
  ]
}
```

**跳转路径**：`/subpackages/profile/pages/profile/profile`（分包路径前缀）

**限制**：主包 2MB / 每个分包 2MB / 总和 20MB，tabBar 页面必须在主包。

### 5.9 图片上传

**两步走**：选图（`chooseImage`） + 上传（`uploadFile`）

```ts
// 1. 选图（拿到临时路径）
uni.chooseImage({
  count: 1,
  sourceType: ["album", "camera"], // 相册 + 相机
  success: (res) => {
    const tempPath = res.tempFilePaths[0]; // 临时路径，小程序关闭失效
  },
});

// 2. 上传（走 multipart/form-data）
uni.uploadFile({
  url: "https://your-api.com/upload",
  filePath: tempPath,
  name: "file", // 后端接收的字段名
  formData: { userId: 123 }, // 额外表单字段
  success: (res) => {
    // res.data 是字符串，需要 JSON.parse
  },
});
```

**关键**：临时路径必须上传拿到永久 URL 才能存库。

### 5.10 地图 / 位置

```ts
// 被动获取当前 GPS 位置
uni.getLocation({
  type: "wgs84", // wgs84 国际 / gcj02 国内火星坐标
  success: (res) => {
    // res.longitude, res.latitude, res.accuracy
  },
});

// 主动让用户在地图上选点（弹地图）
uni.chooseLocation({
  success: (res) => {
    // res.name, res.address, res.longitude, res.latitude
  },
});
```

**注意**：第一次调用会弹权限询问框，用户拒绝后无法获取。模拟器默认返回北京天安门坐标。

### 5.11 微信支付

**前端只负责调起支付 UI，所有签名在后端做**。

```ts
// 1. 请求后端拿支付参数（5 个参数必须来自后端）
const res = await uni.request({
  url: "https://your-api.com/order/create",
  method: "POST",
  header: { Authorization: `Bearer ${token}` },
  data: { productId: "xxx", amount: 9900 }, // 单位：分
});
const payParams = res.data.data;

// 2. 调起微信支付
await uni.requestPayment({
  provider: "wxpay",
  timeStamp: payParams.timeStamp,
  nonceStr: payParams.nonceStr,
  package: payParams.package, // 格式：prepay_id=xxx
  signType: payParams.signType, // 'MD5' 或 'HMAC-SHA256'
  paySign: payParams.paySign,
});
```

**完整流程**：前端 → 后端 → 微信统一下单 → 后端签名 → 前端调支付 UI → 用户输密码 → 微信回调后端。

**注意**：模拟器无法调起支付，必须真机测试 + 真实 appid/商户号。

### 5.12 分享

**两种分享**（都是页面级生命周期，不是 API 调用）：

```ts
// 1. 分享给好友
onShareAppMessage((res) => {
  return {
    title: "分享标题", // 必填
    path: "/pages/xxx/xxx", // 别人点进来进的页面
    imageUrl: "/static/share.png", // 可选
  };
});

// 2. 分享到朋友圈
onShareTimeline(() => {
  return {
    title: "分享标题",
    query: "from=timeline", // 朋友圈专用 query
  };
});
```

**两种触发方式**：

- 右上角 ··· → 转发（自动触发 `onShareAppMessage`）
- `<button open-type="share">` → 自定义按钮触发

**注意**：`onShareTimeline` 需要在 manifest.json 配 `"shared": true` 才能用。
