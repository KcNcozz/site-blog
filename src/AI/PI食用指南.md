# PI食用指南

## 基本使用

- `/model `或者`Ctrl+L` 切换模型
- `Shift+Tab `切换思考强度
- `Shift+Enter `输入换行 `Ctrl+J `记事本输入
- `!pnpm dev`在当前窗口执行命令 `!!pnpm dev` 在当前窗口执行命令且不让AI知道命令过程和结果
- 允许截图输入
- `@` 选择文件
- 可以直接在对话中补充提示词默认为`steering(引导)` 模式 
- `Follow-up(排队)` 使用`Alt+Enter` (默认和CMD的命令冲突) 在指令排队中也可以使用`Alt+上箭头`重新编辑还没有进行的指令
- `pi -p "指令"` 一次性的非交互模式

## 会话管理

`Pi Agent `会话管理的单元是`Session` , 每个`Session` 并非是纯线性的结构, 也可以是树状结构 

- `pi -c` 从最近session进入会话
- `pi -r` 选择session进入会话
- `/tree` 可以看到树状`Session` 可以选择并回退对话, 但是不能回退已经更改过的代码(需要使用Git)
  使用该命令有三个选项
  1. `No summary` 不总结
  2. `Summarize` 总结
  3. `Summarize with custom prompt` 自定义提示词总结
- `/clone` 克隆当前`Session` 变成一个新的`Session` 
- `/fork` 基于节点复制`Session` fork出来的节点只会带节点有之前的`Session`
- `/compact` 手动触发上下文压缩
- `/new`新开一个`Session` 

## 插件扩展 

- 默认只有 `Read Write Edit Bash`
- 插件列表: `https://pi.dev/packages`
- 几个比较好用的: 

````sh
pi install npm:pi-subagents # subagent
pi install npm:pi-web-access # 联网搜索
pi install npm:pi-mcp-adapter # MCP
pi install npm:pi-mcp-adapter -l # 项目级别安装
pi install npm:@narumitw/pi-btw # By the way 旁路对话
pi install npm:@plannotator/pi-extension # Plan
pi install npm:@narumitw/pi-goal # Goal
pi install npm:@quintinshaw/pi-dynamic-workflows # Dynamic-Workflows
pi install npm:pi-wechat-assistant # WeChat
````

## Skill

注意项目目录和全局目录

- `playwrigth-cli` 让AI获得浏览器自动化能力的Skill
- SkillHub

## PI Web

Web UI: https://github.com/agegr/pi-web

## 记忆

跨Session, 通用方法就是: 在项目的根目录创建个`AGENTS.md`文件, 可以让AI编写这个文件.

````sh
# 通读当前文件夹，把它学到的关于项目的知识保存到AGENTS.md 文件里面。
````

也可以使用`APPEND_SYSTEM.md` 追加系统提示词 (这里提示词优先级更高 效果更强)

## 安全机制

- 使用容器 虚拟机 沙箱 运行
- 安装插件

````sh
pi install npm:@gotgenes/pi-permission-system
````

## 开放API

- 可以自己DIY插件
- 允许PI自己给自己写插件 UI
- 可以查看源码学习

