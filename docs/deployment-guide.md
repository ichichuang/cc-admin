# 部署指南

## 概述

CC-Admin 支持多种部署方式，包括传统服务器部署、容器化部署、云平台部署等。

## 🏗️ 环境准备

### 系统要求

- Node.js >= 18
- pnpm >= 8
- Git >= 2.20

### 环境变量配置

```bash
# .env.production
VITE_APP_TITLE=CC-Admin
VITE_APP_ENV=production
VITE_API_BASE_URL=https://api.example.com
VITE_API_TIMEOUT=10000
```

## 📦 构建部署

### 生产构建

```bash
# 标准构建
pnpm build

# 构建并分析包大小
pnpm build:analyze
```

### 构建优化

- 代码分割和懒加载
- 资源压缩和优化
- 缓存策略配置
- CDN 加速部署

## 🐳 Docker 部署

### Dockerfile

```dockerfile
# 构建阶段
FROM node:18-alpine AS builder
WORKDIR /app
RUN npm install -g pnpm
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm build

# 生产阶段
FROM nginx:alpine AS production
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Docker Compose

```yaml
version: '3.8'
services:
  frontend:
    build: .
    ports:
      - '80:80'
    restart: unless-stopped
```

## ☁️ 云平台部署

### Vercel 部署

```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

### Netlify 部署

```toml
[build]
  publish = "dist"
  command = "pnpm build"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

## 🚀 CI/CD 流程

### GitHub Actions

```yaml
name: Deploy
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 18
          cache: 'pnpm'
      - run: pnpm install
      - run: pnpm build
      - run: pnpm test
```

## 📊 监控和健康检查

### 健康检查

```typescript
// 健康检查接口
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.VITE_APP_VERSION,
  })
})
```

### 错误监控

- 集成 Sentry 错误监控
- 性能监控和分析
- 用户行为追踪

## 📋 部署清单

### 部署前检查

- ✅ 代码质量检查通过
- ✅ 测试用例全部通过
- ✅ 环境变量配置正确
- ✅ 构建产物验证

### 部署后验证

- ✅ 健康检查通过
- ✅ 关键功能测试
- ✅ 性能指标正常
- ✅ 错误监控配置

## 🔧 故障排除

### 常见问题

1. **构建失败** - 检查依赖版本和配置
2. **部署失败** - 验证环境变量和权限
3. **性能问题** - 优化构建配置和资源

### 调试技巧

- 查看构建日志和错误信息
- 使用浏览器开发者工具分析
- 检查网络请求和响应

通过这套部署体系，CC-Admin 能够实现安全、可靠、高效的生产环境部署。
