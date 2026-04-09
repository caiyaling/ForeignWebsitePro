# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

这是一个 Vue 3 应用程序，用于"网络资源库"。使用 Vite 作为构建工具，Element Plus 作为 UI 组件库，Pinia 进行状态管理，Tailwind CSS v4 处理样式。

## 开发命令

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览生产构建
npm run preview
```

## 架构

### 路径别名
- `@` 映射到 `./src`（在 vite.config.js 中配置）

### 目录结构
- `src/main.js` - 应用入口；注册 Vue、Pinia、Element Plus 和路由
- `src/App.vue` - 根组件，包含 router-view
- `src/router/index.js` - Vue Router 配置，包含路由守卫
- `src/utils/request.js` - Axios 实例，包含认证和错误处理拦截器
- `src/style.css` - 全局样式，使用 Tailwind 指令
- `src/pages/` - 按功能划分的页面组件
  - 每个页面有自己的 `components/` 子目录存放局部组件

### 主要技术栈
- **Vue 3** 使用 `<script setup>` 语法
- **Element Plus** UI 组件库（全局引入）
- **Tailwind CSS v4** 配合 `@tailwindcss/postcss` 插件
- **SCSS** 用于组件作用域样式（`<style lang="scss" scoped>`）
- **Pinia** 状态管理
- **Axios** HTTP 请求

### API 配置
`src/utils/request.js` 中的 Axios 实例使用 `VITE_API_BASE_URL` 环境变量作为 API 基础 URL。会自动从 localStorage 获取 token 并添加到请求头中。

### 当前路由
- `/` 重定向到 `/social`
- `/social` - 社交平台页面（网络资源库主视图）
