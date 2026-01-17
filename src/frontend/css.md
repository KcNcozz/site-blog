# CSS

::: tip MDN文档地址
https://developer.mozilla.org/zh-CN/docs/Web/HTML https://developer.mozilla.org/zh-CN/docs/Web/CSS
:::

导入样式的三种方式：
1. 内联样式：在HTML标签中使用`style`
2. 内部样式: 在HTML文件中的`<head>`标签中使用`<style>`
3. 外部样式表：在CSS文件中定义样式，并使用`<link>`引入HTML文件中


## CSS核心

### 基本选择器    

- 标签选择器 直接写标签名
- 类选择器  `.` 可同时属于几个类
- ID选择器 `#` 页面中唯一
- 通配符选择器 `*`
- 交集选择器 `element.class`
- 并集选择器 `,`

### 高级选择器
- 后代选择器 `element element` 只要是后代都生效
- 子选择器 `element > element` 只有直接子元素才生效
- 相邻兄弟选择器 `element + element` 只有紧邻的下一个兄弟元素才生效
- 通用兄弟选择器 `element ~ element`
- 属性选择器 `[attribute]`
  - 可以精确匹配 `a[href="baidu.com"]`
  - 可以规则匹配 `a[href*="baidu.com"]` 含有baidu.com即可
  - 可以忽略大小写 `a[href*="baidu.com" i]` 忽略大小写

### 选择器的优先级

- 哪个更精确哪个生效 同级则后声明的生效

- 选择器的优先级从高到低：内联（行内）样式 > ID选择器 > 类选择器 属性选择器 伪类的数量 > 标签选择器 > 通配符选择器

- 使用 `!important` 可以强制提升优先级

### 样式的继承

- 样式可以继承父元素的样式，但某些属性如 `font-size`、`color` 等可以被继承，而 `display`、`position` 等属性则不能被继承。
- `initial` 设为默认样式
- `inherit` 设为继承父元素的样式（盒子模型）
- `unset` 能继承就继承 不能继承就用默认颜色
- `revert` 类似于 `initial` 
- `layer` ？？？

## 字体样式 <Badge type="tip" text="自动继承" />

### 文本字体

- `fontfamily`：一般写想要的字体加上**通用字体族**
````css
font-family: Arial, sans-serif, monospace
````
- 自定义字体 手动添加字体
````css
@font-face {
    font-family:'BengHuai'
    src: url("../font/BengHuai.ttf")
}
````

### 字体大小

- `font-size` 默认16px
- `1.5em` 1.5倍
- `rem` 相对根元素大小 

### 字体粗细

- `font-weight` 取值：100-900 默认400
- 100 400 700

### 字体样式

- `font-style` 取值：normal 正常 italic 斜体

### 字体颜色

- `color`字体颜色
- 支持RGB输入，16进制输入 `rgb(255,0,0)`
- 透明度 `rgba(255,0,0,0.5)`

## 文本样式

### 首行缩进

- `text-indent` 一般为2em

### 水平对齐

- `text-align` 取值：left center right justify
- `text-align: justify;` 非最后一行的文本两端对齐
- 影响**块级元素内部**行内元素的水平对齐

### 文本修饰

- `text-decoration` 取值：none underline line-through overline
- `text-decoration: underline red dashed 3px;` 可以控制文本下划线的颜色 样式 宽度

### 文本大小写

- `text-transform` 取值：capitalize 首字母大写 uppercase 大写 lowercase 小写

### 行高控制

- `line-height` 取值：normal 1.5~1.8em

### 文本间距

- `letter-spacing` 取值：normal 数字
- `word-spacing` 取值：normal 数字
- `letter-spacing` 用于中文

### 文本换行

- `word-break` 取值： normal 正常 break-all 强制换行 **用于单词是否砍断**
- `overflow-wrap` 取值：normal 正常 break-word 强制换行 对`word-break`的补充
- `text-wrap` 取值：wrap 正常 nowrap 强制不换行 balance 平衡换行 pretty 美化换行 **控制是否换行**

### 文本空白处理

- `white-space` 取值：nowrap 与`text-wrap:nowrap`效果相同 pre 保留全部空格，并且支持换行 pre-wrap 同`pre` 文字超出宽度会换行 pre-line 同`pre` 不保留空格



### 选择器进阶

#### 伪类选择器

不是选取元素本身，而是选取特定状态的元素。
- `:focus` 获取焦点
- `:link` 未访问的链接
- `:visited` 已访问的链接
- `:hover` 鼠标悬停
- `:active` 激活
**注意**：多个伪类生效时，需要遵循**LVHA**顺序

下面的一些为结构类伪类：
- `:first-child`: 其父元素下第一个子元素
- `:last-child`: 其父元素下最后一个子元素
- `:nth-child(n)`: 其父元素下第n个子元素 n为数字(可以为even odd)
- `first-of-type`: 其父元素下第一个同类元素 
- `only-child`: 其父元素下唯一一个子元素
- `:where`: 匹配元素，但不会继承样式
- `:is`: 匹配元素，但不会继承样式
- `:has`: 判断元素是否存在


#### 伪元素选择器

虚拟元素，直接看例子：
```html
<label>
  <input placeholder="请输入内容">
</label>
```
```css
input {
  border: 1px solid #a200d8;
  border-radius: 20px;
  line-height: 2;
  padding: 0 12px;
  width: 200px;
}
  input::placeholder {
  color: #bc8cd3;
  }
```

- `::before`: 在元素内容之前插入内容
- `::after`: 在元素内容之后插入内容
- `::selection`: 选择元素
- `::first-line`: 第一行
- `::first-letter`: 第一个字符

#### 嵌套选择器

一直在使用的语法

**注意**：对于伪元素或是伪类选择器，使用`&`代表父选择器本身



