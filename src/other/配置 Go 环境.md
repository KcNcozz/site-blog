# 设置 Go 环境变量

## 环境变量设置

### 1. PowerShell（以管理员身份运行）

```shell
# 设置 Go 环境变量
go env -w GO111MODULE=on
go env -w GOPATH=D:\Go\mod
go env -w GOMODCACHE=D:\Go\mod\libs
go env -w GOBIN=D:\Go\mod\bin
go env -w GOCACHE=D:\Go\cache
go env -w GOTMPDIR=D:\Go\temp
go env -w GOENV=D:\Go\env
```

### 2. 在 **Path** 变量中最前面添加：

```shell
D:\Go\root\go1.26.1\bin
D:\Go\mod\bin
```

你的 PATH 应该包含（按顺序）：

| 顺序 | 路径                      | 用途                |
| ---- | ------------------------- | ------------------- |
| 1    | `D:\Go\root\go1.26.1\bin` | Go 编译器           |
| 2    | `D:\Go\mod\bin`           | 第三方工具（GOBIN） |

---

## 验证设置

**重启 PowerShell** 后运行：

```powershell
go version
go env GOPATH GOMODCACHE GOCACHE
```

---

## 目录对应关系

```
D:\Go\
├── root\go1.26.1\bin\go.exe    ← Go 编译器 (添加到 PATH)
├── mod\                        ← GOPATH
│   ├── bin\                    ← GOBIN (go install 安装的二进制)
│   └── libs\                   ← GOMODCACHE (第三方依赖)
├── cache\                      ← GOCACHE (编译缓存)
├── temp\                       ← GOTMPDIR (临时文件)
└── env\                        ← GOENV (配置文件)
```

---

释义如下

- `go/root`目录用于存放各个版本 go 语言源文件
- `go/mod`对应`GOAPTH`
- `go/mod/libs`对应`GOMODCACHE`，也就是下载的第三方依赖存放地址
- `go/mod/bin`对应`GOBIN`，第三方依赖二进制文件存放地址
- `go/cache`，对应`GOCACHE`，存放缓存文件
- `go/temp`，对应`GOTMPDIR`，存放临时文件
- `go/env`，对应`GOENV`，全局环境变量配置文件
