# Vue项目跨域问题解决方案

## 解决方案概述

本项目采用多种策略解决跨域问题，包括开发环境代理配置和智能代理检测机制。

## 配置详情

### 1. Vite开发服务器代理配置

在 [vite.config.js](file://) 中配置了多个代理规则：

- `/api` → 目标API服务器
- `/v1` → OpenAI API服务器
- `/chat/completions` → 聊天完成接口
- `/models` → 模型列表接口

### 2. 智能代理检测机制

实现了智能代理检测器，位于 [src/utils/apiProxy.js](file://)，具有以下特性：

- 自动检测是否需要代理
- 开发环境默认启用代理
- 生产环境根据配置决定是否启用
- 支持外部URL检测
- 安全的请求头处理

### 3. API服务集成

- [src/services/api.js](file://) 和 [api.js](file://) 已集成代理检测机制
- 所有API请求通过代理检测器处理
- 自动处理请求URL转换

## 配置说明

### 开发环境

- 代理在开发环境自动启用
- 所有外部API请求通过Vite代理转发
- 使用 `.env.development` 文件配置代理参数

### 生产环境

- 可通过环境变量 `VITE_PROXY_ENABLED` 控制代理启用
- 建议在生产环境中使用Nginx或后端服务配置代理

## 环境变量

- `VITE_PROXY_ENABLED`: 是否启用代理
- `VITE_PROXY_URL`: 代理URL路径

## 使用方式

项目启动后，所有API请求将自动经过代理检测机制，无需额外配置。

## 部署建议

对于生产环境部署，建议在Web服务器（如Nginx）中配置API代理，示例如下：

```nginx
location ^~/api/ {
    rewrite ^/api/(.*)$ /$1 break;
    proxy_pass http://your-api-server.com;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_cache_bypass $http_upgrade;
}
```