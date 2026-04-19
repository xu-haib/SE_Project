# 算法竞赛题库管理与在线考试系统 - Online Judge System

算法竞赛题库管理与在线考试系统是一个在线评测系统（Online Judge），支持题目管理、代码提交、自动评测等功能。系统采用前后端分离架构，后端使用 Go 语言，前端使用 Vue.js。

## 项目结构

```
算法竞赛题库管理与在线考试系统项目运行流程.tex
back_end/          # Go 后端
    cmd/server/    # 服务器入口
    internal/      # 内部模块
        controller/ # 请求控制器
        service/    # 业务逻辑
        model/      # 数据模型
        repository/ # 数据访问层
front_end/         # Vue 前端
    src/           # 源代码
        api/       # API 接口
        stores/    # 状态管理
        views/     # 页面组件
```

## 运行 Demo

### 前置要求

- **Go 1.20+**：用于运行后端服务
- **Node.js 16+**：用于运行前端服务
- **MySQL 5.7+**：数据库
- **Git**：版本控制

### 1. 克隆项目

```bash
git clone https://github.com/xu-haib/SE_Project.git
cd SE_Project
```

### 2. 配置数据库

创建 MySQL 数据库：

```sql
CREATE DATABASE algo_contest CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

更新后端数据库连接字符串（在 `back_end/cmd/server/main.go` 中）：

```go
dsn := "root:your_password@tcp(127.0.0.1:3306)/algo_contest?charset=utf8mb4&parseTime=True&loc=Local"
```

### 3. 运行后端服务

```bash
cd back_end/back_end

# 安装依赖（如果需要）
go mod tidy

# 运行服务器
go run ./cmd/server
```

后端服务将在默认端口（通常是 8080 或配置文件中指定）启动。

### 4. 运行前端服务

在新终端窗口中：

```bash
cd front_end/front_end

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

前端服务将在 `http://localhost:5173`（或类似端口）启动。

### 5. 访问应用

打开浏览器，访问前端服务地址（如 `http://localhost:5173`），即可开始使用 算法竞赛题库管理与在线考试系统 系统。

## 功能特性

- 用户注册/登录
- 题目浏览和管理
- 代码提交和自动评测
- 比赛系统
- 管理员后台

## 开发说明

- 后端 API 文档：查看 `internal/controller` 下的控制器代码
- 前端组件：查看 `front_end/src/components` 目录
- 数据库模型：查看 `internal/model` 目录

## 许可证

本项目仅用于学习和演示目的。