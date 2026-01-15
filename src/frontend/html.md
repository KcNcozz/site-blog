# HTML
这里只记录一些常用的HTML标签和属性。具体用法请参考MDN文档。

::: tip MDN文档地址
https://developer.mozilla.org/zh-CN/docs/Web/HTML
:::
## 常用标签

::: danger 小知识
块级元素会排斥其他元素 自动让后面的元素另起一行
:::

### 1. 图片 <Badge type="tip" text="单标签 行内块元素" />
图片的属性：
```html
<img src="" alt="" title="" loading="lazy" width="200" height="200" />
```
**懒加载**: loading属性可以实现图片的延迟加载，即当页面滚动到图片所在位置时才加载图片。

::: details 补充知识（相对路径和绝对路径）
- **相对路径**：不在路径的最前面加 `/` ，路径将会从当前文件的位置开始计算
- **绝对路径**：在路径的最前面加`/`，路径将会从当前项目的根目录开始计算
:::

### 2. 链接 <Badge type="tip" text="行内元素" />

文本超链接和图片超链接

```html
<a href="https://www.jetbrains.com/webstorm/" target="_blank" rel="noopener noreferrer">WebStorm</a>

<a href="https://www.jetbrains.com/webstorm/">
	<img src="../../assert/网页修复.svg" alt="这是一个图片链接">
</a>
```
1. target="_blank"
这个属性的作用是让点击这个链接后，在新的浏览器标签页（或窗口）中打开链接内容。也就是说，用户点击后不会离开当前页面，而是在新标签页打开目标网页。

2. rel="noopener noreferrer" 这是两个安全相关的属性，合在一起用以增强安全性和隐私保护

    noopener：防止新打开的页面通过 JavaScript 获取到原页面的控制权，避免潜在的安全风险，比如恶意网站控制你的页面。

    noreferrer：不让新页面知道是从哪个页面跳转过来的（不传递“引用”信息），这能保护用户隐私。

这是一个超链接 <a href="https://www.jetbrains.com/webstorm/" target="_blank" rel="noopener noreferrer">WebStorm</a> 结束


这是一个超链接<a href="https://www.jetbrains.com/webstorm/">
	<img src="../../assert/网页修复.svg" alt="这是一个图片链接" width="100" height="100"/>
</a>
结束

::: info 注意
可以设置href属性为#，这样可以实现页面的滚动。
:::

### 3. 视频和音频

```html
<video width="320" height="240" controls>
    <source src="movie.mp4" type="video/mp4">
</video>

<video src="movie.mp4" controls width="320" height="240">
	<p>Your browser does not support the video element.</p>
</video>

<audio controls>
    <source src="audio.mp3" type="audio/mpeg">
</audio>
```
- controls：这是一个布尔属性，表示在视频播放器上显示播放控件（如播放、暂停、音量等）。
- autoplay：布尔属性，表示视频自动播放。
- loop：布尔属性，表示视频循环播放。
- muted：布尔属性，表示视频静音播放。
- poster：视频封面的 URL。
- track：字幕文件 URL。

### 4. 列表 <Badge type="danger" text="使用频率低" />
```html
<ol type="a">
  <li>第一项</li>
  <li>第二项</li>
</ol>


<ul>
  <li>第1项</li>
  <li>第2项</li>
</ul>

<dl>
  <dt>Java</dt>
  <dd>Java 是一门面向对象编程语言，是静态编译型语言，具有平台独立性，支持多线程、动态绑定、反射、注解、异常处理、数据库访问、JMX 等特性。</dd>
  <dt>Go</dt>
  <dd>Go 语言是 Google 开发的一种静态强类型、编译型、并发型的编程语言。</dd>
  <dt>Python</dt>
  <dd>Python 简洁、易学、功能强大，适合数据分析、Web 开发、机器学习等领域。</dd>
  <dd>Python 还有很多优秀的第三方库，可以帮助你快速开发应用。</dd>
</dl>
```
**实现效果：**

<ol type="a">
  <li>第一项</li>
  <li>第二项</li>
</ol>

<ul>
  <li>第1项</li>
  <li>第2项</li>
</ul>

<dl>
  <dt>Java</dt>
  <dd>Java 是一门面向对象编程语言，是静态编译型语言，具有平台独立性，支持多线程、动态绑定、反射、注解、异常处理、数据库访问、JMX 等特性。</dd>
  <dt>Go</dt>
  <dd>Go 语言是 Google 开发的一种静态强类型、编译型、并发型的编程语言。</dd>
  <dt>Python</dt>
  <dd>Python 简洁、易学、功能强大，适合数据分析、Web 开发、机器学习等领域。</dd>
  <dd>Python 还有很多优秀的第三方库，可以帮助你快速开发应用。</dd>
</dl>

- 有序列表（ol）：type属性可以设置列表的类型，如1、A、a等。
- 无序列表（ul）：无序列表的标记是无序列表符号（如圆点、加号、减号等）。
- 定义列表（dl）：dl 元素用于描述一个术语的定义。

### 5. 表格 <Badge type="danger" text="使用频率低" />
**table属性用CSS写**
```html
<table>
  <thead>
    <tr>
      <th>姓名</th>
      <th>年龄</th>
      <th>性别</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>张三</td>
      <td>20</td>
      <td>男</td>
    </tr>
    <tr>
      <td>25</td>
      <td>女</td>
    </tr>
  </tbody>
</table>

<table>
  <caption>2025年装机清单</caption>
  <tr>
    <th>配件名称</th>
    <th>型号</th>
  </tr>
  <tr>
    <td>CPU</td>
    <td>Ultra9 285K</td>
  </tr>
  <tr>
    <td>显卡</td>
    <td>RTX4090</td>
  </tr>
</table>
```
**实现效果：**

<table>
  <thead>
    <tr>
      <th>姓名</th>
      <th>年龄</th>
      <th>性别</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>张三</td>
      <td>20</td>
      <td>男</td>
    </tr>
    <tr>
      <td>李四</td>
      <td>25</td>
      <td>女</td>
    </tr>
  </tbody>
</table>

<hr>

<table>
  <caption>2021年装机清单</caption>
  <tr>
    <th>名称</th>
    <th>型号</th>
  </tr>
  <tr>
    <td>CPU</td>
    <td>Ultra7 265K</td>
  </tr>
  <tr>
    <td>显卡</td>
    <td>RTX5090</td>
  </tr>
</table>

- 表格（table）：用于呈现数据。
- 表头（thead）：包含表格的标题。
- 表格行（tr）：包含表格的行。
- 表头单元格（th）：包含表头的单元格。
- 数据单元格（td）：包含数据单元格。
- caption：用于对表格的标题进行描述。
- colgroup：用于对表格的列进行分组。
- rowgroup：用于对表格的行进行分组。

### 6. 框架和嵌入代码
```html
<div>我是内容</div>
<iframe src="https://www.bilibili.com" width="300" height="300"></iframe>
```
**实现效果：**
<div>我是内容</div>
<iframe width="1000" height="500" src="//player.bilibili.com/player.html?isOutside=true&aid=115841794442308&bvid=BV1z2i4BYEPL&cid=35206138484&p=1" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true"></iframe>

- 内嵌框架（iframe）：用于在当前页面中嵌入另一个页面。
- scrolling="no"：用于禁止iframe内容的滚动。
- frameborder="no"：用于隐藏iframe的边框。
- border="0"：用于隐藏iframe的边框。
- framespacing="0"：用于隐藏iframe的边框。
- allowfullscreen="true"：用于允许iframe全屏显示。

::: info
可以设引入自己的页面
:::

### 其他标签
- header：用于定义文档的**头部**区域。
- nav：用于定义**导航链接**。
- article：用于定义文档的独立内容块。
- main：用于定义文档的**主体**区域。
- section：用于定义文档中的节（section）。
- aside：用于定义页面的侧边栏。
- footer：用于定义文档的尾部区域。


## 表单

```html
<form>
  <label for="name">Name:</label>
  <input type="text" id="name" name="name" required>
  <label for="email">Email:</label>
  <input type="email" id="email" name="email" required>
  <label for="message">Message:</label>
  <textarea id="message" name="message" required></textarea>
  <input type="submit" value="Submit">
</form>

<form action="/login" method="post">
    <label>电子邮件：<input name="username" type="email" required></label>
    <label>密码：<input name="password" type="password" required></label>
    <button type="submit">提交</button>
    <reset type="reset">重置</reset>
</form>
```

- form：用于创建表单。
- input：用于创建输入框。
  - value：用于设置输入框的默认值。
  - maxlength：用于设置输入框的最大长度。
  - **placeholder**：用于设置输入框的提示文字。
  - disabled：用于禁用输入框。
  - required：用于设置输入框为必填项。
  - **type**：用于设置输入框的类型。


### 1.日期选择 <Badge type="tip" text="了解即可" />

```html
<form>
    <input type="date">
</form>
```

### 2.数字 <Badge type="tip" text="了解即可" />

```html
<form>
    <input type="number" min="1" max="10" step="2">
</form>
```

### 3.单选框和多选框

```html
<form>
    <div>选择性别：</div>
    <input type="radio" name="gender" value="male" checked> 男
    <input type="radio" name="gender" value="female"> 女
    <input type="submit">
</form>

<form>
    <div>选择兴趣：</div>
    <input type="checkbox" name="interest" value="reading"> 阅读
    <input type="checkbox" name="interest" value="swimming"> 游泳
    <input type="checkbox" name="interest" value="hiking"> 滑雪
    <input type="submit">
</form>
```

- name 用于设置单选框或多选框的名称和分组
- checked 用于设置默认值
- value 用于设置值

### 4.下拉列表

```html
<form>
    <label for="cars">选择汽车：</label>
    <select id="cars" name="cars">
        <option value="volvo">Volvo</option>
        <option value="saab">Saab</option>
        <option value="mercedes">Mercedes</option>
        <option value="audi">Audi</option>
    </select>
    <input type="submit">
</form>
```

- select：用于创建下拉列表。
- option：用于创建下拉列表的选项。
- selected：用于设置默认值。
- multiple：用于设置多选。
- size：用于设置下拉列表展示几个内容
- selected：用于设置默认值。


### 5.文本域

```html
<form>
    <label for="comment">评论：</label>
    <textarea id="comment" name="comment" rows="5" cols="30"></textarea>
    <input type="submit">
</form>
```

- textarea：用于创建多行文本输入框。
- rows：用于设置文本域的行数。
- cols：用于设置文本域的列数。
- placeholder maxlength min max 等属性与 input 标签相同。


## HTML矢量图

### 1.SVG

```html
<svg width="100" height="100">
  <rect width="30" height="30" fill="red" stroke="black" stroke-width="2" />
</svg>
```

效果如下：

<svg width="150" height="150">
  <rect width="30" height="30" fill="red" stroke="black" stroke-width="2" rx="5" ry="5" />
  <circle cx="50" cy="50" r="20" fill="blue" stroke="black" stroke-width="2" />
  <ellipse cx="50" cy="50" rx="20" ry="10" fill="green" stroke="black" stroke-width="2" />
  <line x1="10" y1="10" x2="90" y2="90" stroke="black" stroke-width="2" />
  <polyline points="10 10 90 10 90 90" stroke="yellow" stroke-width="2" />
  <polygon points="50 10 70 10 70 90 50 90" fill="purple" stroke="black" stroke-width="2" opacity="0.5" />
</svg>

- svg：用于创建SVG图形。
- rect：用于创建矩形。
- fill：用于设置矩形的填充色。
- stroke：用于设置矩形的边框颜色。
- stroke-width：用于设置矩形的边框宽度。
- x y：用于设置矩形的左上角坐标。
- rx ry：用于设置矩形的圆角半径。
- circle：用于创建圆形。
- cx cy：用于设置圆心坐标。
- r：用于设置圆的半径。
- opacity：用于设置图形的透明度。

### 2.map

```html
<img src="map.png" usemap="#map" alt="Map of the world">

<map name="map">
  <area shape="rect" coords="10,10,50,50" href="https://www.google.com">
  <area shape="circle" coords="100,100,50" href="https://www.bing.com">
</map>
```

- img：用于显示图片。
- usemap：用于引用map。
- map：用于创建地图。
- area：用于创建地图区域。
- shape：用于设置区域的形状。
- coords：用于设置区域的坐标。
- href：用于设置区域的链接。

### 3.无障碍 WAI-ARIA

尽量使用语义化标签和属性，并添加 aria-* 属性来提供额外的上下文信息。
```html
<button aria-label="Close">X</button>
<div role="button" aria-label="Close">X</div>
```

- role：用于提供元素的角色。
- aria-label：用于提供按钮的文字描述。
- aria-haspopup：用于提供下拉菜单或弹出窗口的角色。
- aria-expanded：用于提供下拉菜单或弹出窗口的展开状态。