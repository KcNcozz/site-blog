# AJAX
ajax特点：在网页不刷新的情况下，向客户端发送HTTP请求，得到HTTP响应。（比如：百度搜索框输入内容后的关键字提醒）

核心：异步 局部刷新

::: info  ajax fetch axios这三个是什么关系 有什么区别
AJAX 是一种“技术概念”（想法），Fetch 和 Axios 是实现这种概念的“具体工具”（做法）。**一句话**: 概念懂 AJAX，原理看 Fetch，干活用 Axios。

Fetch 是**浏览器内置**的一个 API（不需要你下载安装任何东西，直接就能用）。它是 `XMLHttpRequest`（老旧的 AJAX 技术）的现代替代者。基于` Promise` ：解决了老式 AJAX 写法极其繁琐（回调地狱）的问题。**优点**：不用引入外部文件，自带。**缺点**：1. 写起来稍微有点啰嗦（比如手动处理 JSON 转换）。 2. 它对于 HTTP 错误状态码（如 404, 500）不会自动报错，需要你自己写代码判断。

Axios 是一个**第三方库**，你需要下载安装。它是基于 `Promise` 的，是对 `Fetch/XHR` 的封装,所以它比 `Fetch` 更加易用。
**优点**：
1. 写起来更简单。 
2. 它会自动处理 JSON 转换。 
3. 它会自动处理 HTTP 错误状态码（如 404, 500）。
:::



## 原生 AJAX —— XMLHttpRequest (XHR)

```javascript
// 1. 创建 XMLHttpRequest 对象
const xhr = new XMLHttpRequest();

// 2. 初始化请求 (设置请求方法和 URL)
// 这里的 URL 使用公共测试 API：https://jsonplaceholder.typicode.com/users
xhr.open('GET', 'https://jsonplaceholder.typicode.com/users');

// 3. 发送请求
xhr.send();

// 4. 监听状态变化 (处理响应)
xhr.onreadystatechange = function() {
    // readyState === 4 表示请求完成
    // status === 200 表示响应成功
    if (xhr.readyState === 4 && xhr.status === 200) {
        // 获取响应数据 (通常是 JSON 字符串)
        const data = xhr.responseText;
        console.log(data);
        const users = JSON.parse(data); // 解析为对象
        console.log(users);
    }
};
```

### 关键点解析
*   **`readyState`**：请求的状态（0到4）。
    *   0: 请求未初始化
    *   1: 服务器连接已建立
    *   2: 请求已接收
    *   3: 请求处理中
    *   4: 请求已完成，且响应已就绪
*   **`status`**：HTTP 状态码（200 成功，404 未找到，500 服务器错误）。
*   **JSON.parse()**：服务器传回来的是字符串，必须转换成 JS 对象才能使用。

## 现代标准 —— Fetch API

原生 XHR 写法比较繁琐，且容易陷入回调地狱。现代开发推荐使用浏览器原生的 **Fetch API**。它基于 Promise，语法更简洁。

### 1. GET 请求

```javascript
fetch('https://jsonplaceholder.typicode.com/users')
    .then(response => {
        // response 对象包含了很多信息，我们需要调用 .json() 来解析
        return response.json();
    })
    .then(data => {
        // 这里拿到的是解析后的 JS 对象
        console.log(data);
    })
    .catch(error => {
        console.error('请求失败:', error);
    });
```

### 2. async/await 写法（推荐）
这是目前最主流、最优雅的写法。

```javascript
async function getUsers() {
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/users');
        
        // 检查响应是否成功 (Fetch 不会自动把 404/500 当作错误抛出，需要手动检查)
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log(data);
    } catch (error) {
        console.error('出错了:', error);
    }
}

getUsers();
```

### 3. POST 请求（发送数据）
前端不仅要“读”数据，还要“写”数据（比如提交表单）。

```javascript
async function createUser() {
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/users', {
            method: 'POST', // 指定方法
            headers: {
                'Content-Type': 'application/json' // 告诉服务器发的是 JSON
            },
            body: JSON.stringify({
                name: '张三',
                username: 'zhangsan'
            })
        });

        const data = await response.json();
        console.log('服务器返回:', data);
    } catch (error) {
        console.error(error);
    }
}
```

---

## 示例：把数据放到页面上

**场景**：点击按钮，获取用户列表并显示在 `ul` 中。

**HTML**:
```html
<button id="btn">获取用户列表</button>
<ul id="list"></ul>
```

**JavaScript**:
```javascript
const btn = document.getElementById('btn');
const list = document.getElementById('list');

btn.addEventListener('click', async () => {
    // 1. 改变按钮文字，提示正在加载
    btn.textContent = '加载中...';
    btn.disabled = true; 

    try {
        // 2. 发送请求
        const response = await fetch('https://jsonplaceholder.typicode.com/users');
        const users = await response.json();

        // 3. 清空列表
        list.innerHTML = '';

        // 4. 遍历数据，创建 DOM 节点
        users.forEach(user => {
            const li = document.createElement('li');
            li.textContent = user.name; // 假设只展示名字
            list.appendChild(li);
        });

    } catch (error) {
        list.innerHTML = '<li style="color:red">数据加载失败</li>';
    } finally {
        // 5. 恢复按钮状态
        btn.textContent = '获取用户列表';
        btn.disabled = false;
    }
});
```

## 进阶与常见坑

掌握了基本的读写后，你需要了解以下几个现实开发中必须面对的问题。

### 1. JSON 格式
*   **传输格式**：网络传输中，数据通常是文本字符串（JSON 格式）。
*   **操作流程**：
    *   发送：JS 对象 -> `JSON.stringify()` -> 字符串 -> 发给服务器。
    *   接收：收到字符串 -> `response.json()` / `JSON.parse()` -> JS 对象。

### 2. 跨域问题
你在本地写代码 (`file://` 或 `http://localhost`) 去请求 `http://baidu.com`，浏览器会报错并拦截数据。这就是同源策略。

*   **解决方案**：
    1.  **后端解决**：后端设置 CORS 头（最常见）。
    2.  **前端开发环境**：使用代理（如 Webpack/Vite 的 proxy 配置）。

### 3. 交互优化
*   **加载状态**：请求时显示 Loading 图标/文字，请求结束隐藏。
*   **错误处理**：网断了怎么办？服务器崩了怎么办？不要只写 `console.log`，要在页面上给用户提示（比如使用 Toast 或 Modal）。
*   **防抖**：比如做一个“搜索框输入联想”功能。用户每输入一个字母就发一次请求，服务器会炸掉。需要用**防抖**技术：等用户停下来不输入了（比如 500ms），再发请求。

## Axios

虽然 Fetch 很好用，但在企业级开发中，大家通常使用 **Axios** 库。

*   **原因：**
    *   对旧浏览器兼容性更好。
    *   自动转换 JSON 数据（不需要手动写 `response.json()`）。
    *   请求和响应拦截器（统一处理 Token、错误码）。
    *   **自动取消请求**。
    *   并发请求处理。

**Axios 示例**：
```javascript
// get请求：
axios({
    url: 'http://hmajax.itheima.net/api/city',
    params: {     // 查询参数
    pname: '辽宁省' 
    }
}).then(result => {
    console.log(result.data.list)
    document.querySelector('p').innerHTML = result.data.list.join('<br>')
})
// post请求
document.querySelector('.btn').addEventListener('click', () => {
    axios({
      url: 'http://hmajax.itheima.net/api/register', // 接口地址
      method: 'post', // 请求方式
      data: { // 请求携带的数据
        username: 'admin',
        password: '123456'
      }
    }).then(result => {
      // 成功
      console.log(result)
    }).catch(error => {      // 失败
      // 处理错误信息
      console.log(error)
    })
})
```
**异步实现：**
```javascript
/**
 * 目标：封装_简易axios函数_获取省份列表
 *  1. 定义myAxios函数，接收配置对象，返回Promise对象
 *  2. 发起XHR请求，默认请求方法为GET
 *  3. 调用成功/失败的处理程序
 *  4. 使用myAxios函数，获取省份列表展示
*/
// 1. 定义myAxios函数，接收配置对象，返回Promise对象
function myAxios(config) {
  return new Promise((resolve, reject) => {
    // 2. 发起XHR请求，默认请求方法为GET
    const xhr = new XMLHttpRequest()
    xhr.open(config.method || 'GET', config.url)
    xhr.addEventListener('loadend', () => {
      // 3. 调用成功/失败的处理程序
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(JSON.parse(xhr.response))
      } else {
        reject(new Error(xhr.response))
      }
    })
    xhr.send()
  })
}

// 4. 使用myAxios函数，获取省份列表展示
myAxios({
  url: 'http://hmajax.itheima.net/api/province'
}).then(result => {
  console.log(result)
  document.querySelector('.my-p').innerHTML = result.list.join('<br>')
}).catch(error => {
  console.log(error)
  document.querySelector('.my-p').innerHTML = error.message
})
```
