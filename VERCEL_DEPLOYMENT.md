# Vercel 部署指南

## 概述

本项目已配置为支持 Vue Router history 模式在 Vercel 平台上的部署。

## 配置说明

### 1. vercel.json 配置

项目根目录的 `vercel.json` 文件包含以下配置：

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/static/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    },
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ]
}
```

### 2. 环境变量配置

确保以下环境变量在 Vercel 中正确配置：

- `VITE_PUBLIC_PATH=/` - 应用根路径
- `VITE_APP_ENV=production` - 生产环境标识
- `VITE_API_BASE_URL` - API 基础地址

### 3. 路由配置

项目使用 Vue Router history 模式：

```typescript
const router = createRouter({
  history: createWebHistory(import.meta.env.VITE_PUBLIC_PATH),
  routes: initialRoutes,
})
```

## 部署步骤

### 1. 连接 GitHub 仓库

1. 登录 [Vercel](https://vercel.com)
2. 点击 "New Project"
3. 选择你的 GitHub 仓库
4. 配置项目设置

### 2. 构建配置

在 Vercel 项目设置中配置：

- **Framework Preset**: Vite
- **Build Command**: `pnpm build`
- **Output Directory**: `dist`
- **Install Command**: `pnpm install`

### 3. 环境变量设置

在 Vercel 项目设置中添加以下环境变量：

```
VITE_PUBLIC_PATH=/
VITE_APP_ENV=production
VITE_API_BASE_URL=https://your-api-domain.com/
VITE_APP_TITLE=CC-Admin
VITE_MOCK_ENABLE=false
VITE_CONSOLE_LOG=false
VITE_DEBUG=false
```

### 4. 部署

1. 提交代码到 GitHub
2. Vercel 会自动触发部署
3. 等待构建完成

## 常见问题

### 1. 404 错误

如果遇到 404 错误，确保：

- `vercel.json` 文件存在且配置正确
- 所有路由都正确回退到 `index.html`

### 2. 路由不工作

检查：

- 环境变量 `VITE_PUBLIC_PATH` 是否正确设置
- 路由配置是否正确

### 3. API 请求失败

确保：

- `VITE_API_BASE_URL` 配置正确
- API 服务器允许跨域请求

## 验证部署

部署完成后，测试以下功能：

1. 直接访问应用根路径
2. 刷新任意页面（不应该出现 404）
3. 测试路由跳转
4. 验证 API 请求

## 注意事项

1. 确保使用 `pnpm` 作为包管理器
2. 生产环境建议关闭 Mock 数据
3. 确保 API 服务器支持 HTTPS
4. 定期检查部署日志

## 更新部署

每次推送代码到 GitHub 主分支时，Vercel 会自动重新部署。你也可以在 Vercel 控制台手动触发重新部署。
