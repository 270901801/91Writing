# API配置指南

## 配置说明

为了正确使用外部API服务（如NVIDIA API），请按照以下说明进行配置。

## 开发环境配置

在开发环境中，我们使用Vite代理来解决跨域问题。API请求将按以下规则代理：

- `/v1/*` → `https://integrate.api.nvidia.com/v1/*`
- `/chat/completions` → `https://integrate.api.nvidia.com/chat/completions`
- `/models` → `https://integrate.api.nvidia.com/models`

## API配置设置

在应用的API配置界面中，设置如下参数：

- **Base URL**: 设置为 `/v1` （注意：不是完整的外部URL）
- **API Key**: 您的NVIDIA API密钥
- **模型**: 如 `nvidia/nemotron-4-340b-instruct`

## 工作原理

1. 当您在配置中输入 `/v1` 作为Base URL时
2. API请求会构建为 `/v1/chat/completions` 这样的路径
3. Vite代理会将此路径代理到 `https://integrate.api.nvidia.com/v1/chat/completions`
4. 请求通过代理发送到外部API，绕过浏览器CORS限制

## 示例

如果您的API配置如下：
- Base URL: `/v1`
- Endpoint: `/chat/completions`

最终的请求路径将是：
- 浏览器请求: `http://localhost:7520/v1/chat/completions`（Vite开发服务器）
- 代理转发到: `https://integrate.api.nvidia.com/v1/chat/completions`（外部API）

这样就解决了跨域问题，而无需在前端创建不存在的代理端点。