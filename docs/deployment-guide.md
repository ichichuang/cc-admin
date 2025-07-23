# 部署指南

## 概述

CC-Admin 支持多种部署方式，包括传统服务器部署、容器化部署、云平台部署等，满足不同环境和规模的部署需求。

## 🏗️ 环境准备

### 系统要求

```bash
# 最低系统要求
OS: Linux/Windows/macOS
RAM: 2GB+
Storage: 10GB+
Network: 稳定的网络连接

# 软件要求
Node.js: >= 18.0.0
pnpm: >= 8.0.0
Git: >= 2.20.0
```

### 开发环境设置

```bash
# 1. 克隆项目
git clone <repository-url>
cd cc-admin

# 2. 安装依赖
pnpm install

# 3. 环境变量配置
cp .env.example .env
```

### 环境变量配置

```bash
# .env.production
# 应用配置
VITE_APP_TITLE=CC-Admin
VITE_APP_VERSION=1.0.0
VITE_APP_ENV=production

# API配置
VITE_API_BASE_URL=https://api.example.com
VITE_API_TIMEOUT=10000

# 认证配置
VITE_JWT_SECRET=your-jwt-secret-key
VITE_TOKEN_EXPIRE=15m
VITE_REFRESH_TOKEN_EXPIRE=7d

# 存储配置
VITE_STORAGE_PREFIX=cc_admin_
VITE_STORAGE_ENCRYPT=true

# CDN配置
VITE_CDN_URL=https://cdn.example.com
VITE_STATIC_URL=https://static.example.com

# 监控配置
VITE_SENTRY_DSN=your-sentry-dsn
VITE_ANALYTICS_ID=your-analytics-id
```

## 📦 构建部署

### 生产构建

```bash
# 标准构建
pnpm build

# 构建并分析包大小
pnpm build:analyze

# 构建并生成报告
pnpm build:report
```

### 构建优化配置

```typescript
// vite.config.prod.ts
export default defineConfig({
  mode: 'production',

  build: {
    // 输出目录
    outDir: 'dist',

    // 生成 source map
    sourcemap: false,

    // 资源内联限制
    assetsInlineLimit: 4096,

    // 代码分割
    rollupOptions: {
      output: {
        manualChunks: {
          'vue-vendor': ['vue', 'vue-router'],
          'pinia-vendor': ['pinia'],
          'ui-vendor': ['ant-design-vue'],
          'utils-vendor': ['lodash-es', 'dayjs'],
        },
      },
    },

    // 压缩配置
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
  },

  // CDN 配置
  experimental: {
    renderBuiltUrl(filename, { hostType }) {
      if (hostType === 'js') {
        return `https://cdn.example.com/js/${filename}`
      } else if (hostType === 'css') {
        return `https://cdn.example.com/css/${filename}`
      } else {
        return `https://cdn.example.com/assets/${filename}`
      }
    },
  },
})
```

### 静态资源优化

```bash
# 图片压缩脚本
#!/bin/bash
# scripts/optimize-images.sh

echo "优化图片资源..."

# 压缩PNG图片
find public/images -name "*.png" -exec pngquant --force --ext .png {} \;

# 压缩JPEG图片
find public/images -name "*.jpg" -o -name "*.jpeg" | xargs jpegoptim --strip-all

# 生成WebP格式
find public/images -name "*.png" -o -name "*.jpg" -o -name "*.jpeg" | xargs -I {} cwebp {} -o {}.webp

echo "图片优化完成"
```

## 🐳 Docker 容器化

### Dockerfile

```dockerfile
# Dockerfile
# 多阶段构建，减小镜像体积

# 构建阶段
FROM node:18-alpine AS builder

# 设置工作目录
WORKDIR /app

# 安装 pnpm
RUN npm install -g pnpm

# 复制package文件
COPY package.json pnpm-lock.yaml ./

# 安装依赖
RUN pnpm install --frozen-lockfile

# 复制源代码
COPY . .

# 构建应用
RUN pnpm build

# 生产阶段
FROM nginx:alpine AS production

# 复制构建结果
COPY --from=builder /app/dist /usr/share/nginx/html

# 复制Nginx配置
COPY nginx.conf /etc/nginx/nginx.conf

# 暴露端口
EXPOSE 80

# 启动命令
CMD ["nginx", "-g", "daemon off;"]
```

### Nginx 配置

```nginx
# nginx.conf
user nginx;
worker_processes auto;
error_log /var/log/nginx/error.log warn;
pid /var/run/nginx.pid;

events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    # 日志格式
    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for"';

    access_log /var/log/nginx/access.log main;

    # 基础配置
    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    types_hash_max_size 2048;

    # Gzip压缩
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/json
        application/javascript
        application/xml+rss
        application/atom+xml
        image/svg+xml;

    # 服务器配置
    server {
        listen 80;
        server_name localhost;
        root /usr/share/nginx/html;
        index index.html;

        # 安全头
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header X-XSS-Protection "1; mode=block" always;
        add_header Referrer-Policy "strict-origin-when-cross-origin" always;

        # 静态资源缓存
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
            add_header Vary "Accept-Encoding";
        }

        # API代理
        location /api/ {
            proxy_pass http://backend:3000;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # SPA路由处理
        location / {
            try_files $uri $uri/ /index.html;
        }

        # 健康检查
        location /health {
            access_log off;
            return 200 "healthy\n";
            add_header Content-Type text/plain;
        }
    }
}
```

### Docker Compose

```yaml
# docker-compose.yml
version: '3.8'

services:
  frontend:
    build:
      context: .
      dockerfile: Dockerfile
      target: production
    container_name: cc-admin-frontend
    ports:
      - '80:80'
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
    depends_on:
      - backend
    restart: unless-stopped
    healthcheck:
      test: ['CMD', 'curl', '-f', 'http://localhost/health']
      interval: 30s
      timeout: 10s
      retries: 3

  backend:
    image: cc-admin-backend:latest
    container_name: cc-admin-backend
    ports:
      - '3000:3000'
    environment:
      - NODE_ENV=production
      - DB_HOST=database
      - DB_PORT=5432
      - DB_NAME=cc_admin
      - DB_USER=${DB_USER}
      - DB_PASS=${DB_PASS}
    depends_on:
      - database
      - redis
    restart: unless-stopped

  database:
    image: postgres:15-alpine
    container_name: cc-admin-db
    ports:
      - '5432:5432'
    environment:
      - POSTGRES_DB=cc_admin
      - POSTGRES_USER=${DB_USER}
      - POSTGRES_PASSWORD=${DB_PASS}
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    container_name: cc-admin-redis
    ports:
      - '6379:6379'
    volumes:
      - redis_data:/data
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    container_name: cc-admin-proxy
    ports:
      - '443:443'
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
      - ./nginx/ssl:/etc/nginx/ssl:ro
    depends_on:
      - frontend
    restart: unless-stopped

volumes:
  postgres_data:
  redis_data:
```

## ☁️ 云平台部署

### Vercel 部署

```json
// vercel.json
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
      "src": "/api/(.*)",
      "dest": "/api/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ],
  "env": {
    "VITE_API_BASE_URL": "@api-base-url",
    "VITE_APP_ENV": "production"
  },
  "build": {
    "env": {
      "VITE_API_BASE_URL": "@api-base-url"
    }
  }
}
```

### Netlify 部署

```toml
# netlify.toml
[build]
  publish = "dist"
  command = "pnpm build"

[build.environment]
  NODE_VERSION = "18"
  NPM_FLAGS = "--version"

[[redirects]]
  from = "/api/*"
  to = "https://api.example.com/:splat"
  status = 200
  force = true

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "SAMEORIGIN"
    X-Content-Type-Options = "nosniff"
    X-XSS-Protection = "1; mode=block"
```

### AWS S3 + CloudFront 部署

```yaml
# aws-deploy.yml
AWSTemplateFormatVersion: '2010-09-09'
Description: 'CC-Admin CloudFront Distribution'

Parameters:
  DomainName:
    Type: String
    Default: admin.example.com

Resources:
  S3Bucket:
    Type: AWS::S3::Bucket
    Properties:
      BucketName: !Sub '${DomainName}-bucket'
      WebsiteConfiguration:
        IndexDocument: index.html
        ErrorDocument: index.html
      PublicReadPolicy:
        PolicyDocument:
          Statement:
            - Effect: Allow
              Principal: '*'
              Action: 's3:GetObject'
              Resource: !Sub '${S3Bucket}/*'

  CloudFrontDistribution:
    Type: AWS::CloudFront::Distribution
    Properties:
      DistributionConfig:
        Aliases:
          - !Ref DomainName
        DefaultCacheBehavior:
          TargetOriginId: S3Origin
          ViewerProtocolPolicy: redirect-to-https
          CachePolicyId: 658327ea-f89d-4fab-a63d-7e88639e58f6 # Managed-CachingOptimized
        Origins:
          - Id: S3Origin
            DomainName: !GetAtt S3Bucket.DomainName
            S3OriginConfig:
              OriginAccessIdentity: ''
        Enabled: true
        HttpVersion: http2
        DefaultRootObject: index.html
        CustomErrorResponses:
          - ErrorCode: 404
            ResponseCode: 200
            ResponsePagePath: /index.html
```

## 🚀 CI/CD 流程

### GitHub Actions

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]
  workflow_dispatch:

env:
  NODE_VERSION: 18
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Run linting
        run: pnpm lint

      - name: Run tests
        run: pnpm test:run

      - name: Run type checking
        run: pnpm type-check

  build:
    needs: test
    runs-on: ubuntu-latest
    outputs:
      image: ${{ steps.image.outputs.image }}
    steps:
      - uses: actions/checkout@v4

      - name: Setup Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Login to Container Registry
        uses: docker/login-action@v3
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Extract metadata
        id: meta
        uses: docker/metadata-action@v5
        with:
          images: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}
          tags: |
            type=ref,event=branch
            type=ref,event=pr
            type=sha
            type=raw,value=latest,enable={{is_default_branch}}

      - name: Build and push
        uses: docker/build-push-action@v5
        with:
          context: .
          platforms: linux/amd64,linux/arm64
          push: true
          tags: ${{ steps.meta.outputs.tags }}
          labels: ${{ steps.meta.outputs.labels }}
          cache-from: type=gha
          cache-to: type=gha,mode=max

      - name: Output image
        id: image
        run: echo "image=${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:latest" >> $GITHUB_OUTPUT

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment: production
    steps:
      - name: Deploy to production
        uses: appleboy/ssh-action@v1.0.0
        with:
          host: ${{ secrets.DEPLOY_HOST }}
          username: ${{ secrets.DEPLOY_USER }}
          key: ${{ secrets.DEPLOY_KEY }}
          script: |
            cd /opt/cc-admin
            docker pull ${{ needs.build.outputs.image }}
            docker-compose down
            docker-compose up -d
            docker system prune -f

  notify:
    needs: [test, build, deploy]
    runs-on: ubuntu-latest
    if: always()
    steps:
      - name: Notify deployment status
        uses: 8398a7/action-slack@v3
        with:
          status: ${{ job.status }}
          channel: '#deployments'
          webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

### GitLab CI/CD

```yaml
# .gitlab-ci.yml
stages:
  - test
  - build
  - deploy

variables:
  NODE_VERSION: '18'
  DOCKER_DRIVER: overlay2
  DOCKER_TLS_CERTDIR: '/certs'

# 缓存配置
cache:
  paths:
    - node_modules/
    - .pnpm-store/

# 测试阶段
test:
  stage: test
  image: node:${NODE_VERSION}
  before_script:
    - npm install -g pnpm
    - pnpm config set store-dir .pnpm-store
    - pnpm install --frozen-lockfile
  script:
    - pnpm lint
    - pnpm type-check
    - pnpm test:run
  coverage: '/All files[^|]*\|[^|]*\s+([\d\.]+)/'
  artifacts:
    reports:
      coverage_report:
        coverage_format: cobertura
        path: coverage/cobertura-coverage.xml

# 构建阶段
build:
  stage: build
  image: docker:latest
  services:
    - docker:dind
  variables:
    DOCKER_REGISTRY: $CI_REGISTRY
    IMAGE_TAG: $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA
  before_script:
    - echo $CI_REGISTRY_PASSWORD | docker login -u $CI_REGISTRY_USER --password-stdin $CI_REGISTRY
  script:
    - docker build -t $IMAGE_TAG .
    - docker push $IMAGE_TAG
    - docker tag $IMAGE_TAG $CI_REGISTRY_IMAGE:latest
    - docker push $CI_REGISTRY_IMAGE:latest
  only:
    - main

# 部署到生产环境
deploy:production:
  stage: deploy
  image: alpine:latest
  environment:
    name: production
    url: https://admin.example.com
  before_script:
    - apk add --no-cache openssh-client
    - eval $(ssh-agent -s)
    - echo "$SSH_PRIVATE_KEY" | tr -d '\r' | ssh-add -
    - mkdir -p ~/.ssh
    - chmod 700 ~/.ssh
    - ssh-keyscan $DEPLOY_HOST >> ~/.ssh/known_hosts
    - chmod 644 ~/.ssh/known_hosts
  script:
    - ssh $DEPLOY_USER@$DEPLOY_HOST "
      cd /opt/cc-admin &&
      docker pull $CI_REGISTRY_IMAGE:latest &&
      docker-compose down &&
      docker-compose up -d &&
      docker system prune -f
      "
  only:
    - main
  when: manual
```

## 📊 部署监控

### 健康检查

```typescript
// src/utils/health-check.ts
export interface HealthStatus {
  status: 'healthy' | 'unhealthy'
  timestamp: string
  version: string
  uptime: number
  memory: {
    used: number
    total: number
  }
  dependencies: {
    api: 'up' | 'down'
    database: 'up' | 'down'
    redis: 'up' | 'down'
  }
}

export const healthCheck = async (): Promise<HealthStatus> => {
  const startTime = performance.now()

  try {
    // 检查API连接
    const apiStatus = await checkApiHealth()

    // 检查依赖服务
    const dependencies = await checkDependencies()

    return {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: import.meta.env.VITE_APP_VERSION,
      uptime: performance.now() - startTime,
      memory: getMemoryUsage(),
      dependencies,
    }
  } catch (error) {
    return {
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      version: import.meta.env.VITE_APP_VERSION,
      uptime: performance.now() - startTime,
      memory: getMemoryUsage(),
      dependencies: {
        api: 'down',
        database: 'down',
        redis: 'down',
      },
    }
  }
}

const checkApiHealth = async () => {
  const response = await fetch('/api/health', {
    timeout: 5000,
  })

  if (!response.ok) {
    throw new Error('API health check failed')
  }

  return response.json()
}

const getMemoryUsage = () => {
  if ('memory' in performance) {
    const memory = (performance as any).memory
    return {
      used: memory.usedJSHeapSize,
      total: memory.totalJSHeapSize,
    }
  }

  return { used: 0, total: 0 }
}
```

### 错误监控

```typescript
// src/utils/error-tracking.ts
import * as Sentry from '@sentry/vue'

// Sentry 配置
export const initErrorTracking = (app: App) => {
  if (import.meta.env.PROD && import.meta.env.VITE_SENTRY_DSN) {
    Sentry.init({
      app,
      dsn: import.meta.env.VITE_SENTRY_DSN,
      environment: import.meta.env.VITE_APP_ENV,
      release: import.meta.env.VITE_APP_VERSION,

      // 采样率配置
      tracesSampleRate: 0.1,
      replaysSessionSampleRate: 0.1,
      replaysOnErrorSampleRate: 1.0,

      // 集成配置
      integrations: [
        new Sentry.BrowserTracing({
          routingInstrumentation: Sentry.vueRouterInstrumentation(router),
        }),
        new Sentry.Replay(),
      ],

      // 过滤配置
      beforeSend(event) {
        // 过滤开发环境错误
        if (import.meta.env.DEV) {
          return null
        }

        // 过滤已知错误
        if (event.exception) {
          const error = event.exception.values?.[0]
          if (error?.value?.includes('Network Error')) {
            return null
          }
        }

        return event
      },
    })
  }
}

// 性能监控
export const trackPerformance = () => {
  // 页面加载性能
  window.addEventListener('load', () => {
    setTimeout(() => {
      const navigation = performance.getEntriesByType(
        'navigation'
      )[0] as PerformanceNavigationTiming

      Sentry.addBreadcrumb({
        category: 'performance',
        message: 'Page Load',
        data: {
          loadTime: navigation.loadEventEnd - navigation.loadEventStart,
          domContentLoaded:
            navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
          ttfb: navigation.responseStart - navigation.requestStart,
        },
      })
    }, 0)
  })

  // 路由切换性能
  router.beforeEach((to, from) => {
    if (from.name) {
      Sentry.addBreadcrumb({
        category: 'navigation',
        message: `Route change: ${from.name} -> ${to.name}`,
        data: {
          from: from.path,
          to: to.path,
        },
      })
    }
  })
}
```

## 🔧 部署脚本

### 自动化部署脚本

```bash
#!/bin/bash
# scripts/deploy.sh

set -e

# 配置
DEPLOY_HOST=${1:-"production"}
DEPLOY_USER=${2:-"ubuntu"}
PROJECT_DIR="/opt/cc-admin"
BACKUP_DIR="/opt/backups/cc-admin"

echo "🚀 开始部署到 $DEPLOY_HOST..."

# 1. 代码检查
echo "📋 运行代码检查..."
pnpm lint
pnpm type-check
pnpm test:run

# 2. 构建项目
echo "🔨 构建项目..."
pnpm build

# 3. 创建部署包
echo "📦 创建部署包..."
tar -czf dist.tar.gz dist/

# 4. 上传到服务器
echo "📤 上传部署包..."
scp dist.tar.gz $DEPLOY_USER@$DEPLOY_HOST:$PROJECT_DIR/

# 5. 服务器端部署
echo "🚀 执行服务器端部署..."
ssh $DEPLOY_USER@$DEPLOY_HOST << EOF
  cd $PROJECT_DIR

  # 备份当前版本
  if [ -d "dist" ]; then
    sudo mkdir -p $BACKUP_DIR
    sudo mv dist $BACKUP_DIR/dist-\$(date +%Y%m%d_%H%M%S)
  fi

  # 解压新版本
  tar -xzf dist.tar.gz
  rm dist.tar.gz

  # 重启服务
  sudo systemctl reload nginx

  # 清理旧备份（保留最近5个）
  sudo find $BACKUP_DIR -name "dist-*" -type d | sort -r | tail -n +6 | xargs sudo rm -rf
EOF

# 6. 健康检查
echo "🏥 执行健康检查..."
sleep 5
response=$(curl -s -o /dev/null -w "%{http_code}" https://$DEPLOY_HOST/health)

if [ $response -eq 200 ]; then
  echo "✅ 部署成功！应用运行正常"
else
  echo "❌ 部署可能存在问题，健康检查失败 (HTTP $response)"
  exit 1
fi

# 7. 清理本地文件
rm dist.tar.gz

echo "🎉 部署完成！"
```

### 回滚脚本

```bash
#!/bin/bash
# scripts/rollback.sh

set -e

DEPLOY_HOST=${1:-"production"}
DEPLOY_USER=${2:-"ubuntu"}
PROJECT_DIR="/opt/cc-admin"
BACKUP_DIR="/opt/backups/cc-admin"

echo "🔄 开始回滚操作..."

# 1. 列出可用备份
echo "📋 可用备份版本："
ssh $DEPLOY_USER@$DEPLOY_HOST "sudo ls -la $BACKUP_DIR | grep dist-"

# 2. 选择回滚版本
read -p "请输入要回滚的版本目录名 (例: dist-20231225_143000): " BACKUP_VERSION

# 3. 执行回滚
ssh $DEPLOY_USER@$DEPLOY_HOST << EOF
  cd $PROJECT_DIR

  # 备份当前版本
  if [ -d "dist" ]; then
    sudo mv dist $BACKUP_DIR/dist-rollback-\$(date +%Y%m%d_%H%M%S)
  fi

  # 恢复指定版本
  if [ -d "$BACKUP_DIR/$BACKUP_VERSION" ]; then
    sudo cp -r $BACKUP_DIR/$BACKUP_VERSION dist
    sudo chown -R www-data:www-data dist

    # 重启服务
    sudo systemctl reload nginx

    echo "✅ 回滚到版本 $BACKUP_VERSION 完成"
  else
    echo "❌ 备份版本 $BACKUP_VERSION 不存在"
    exit 1
  fi
EOF

# 4. 健康检查
echo "🏥 执行健康检查..."
sleep 5
response=$(curl -s -o /dev/null -w "%{http_code}" https://$DEPLOY_HOST/health)

if [ $response -eq 200 ]; then
  echo "✅ 回滚成功！应用运行正常"
else
  echo "❌ 回滚可能存在问题，健康检查失败 (HTTP $response)"
  exit 1
fi

echo "🎉 回滚完成！"
```

## 📋 部署清单

### 部署前检查

- ✅ 代码质量检查通过
- ✅ 测试用例全部通过
- ✅ 环境变量配置正确
- ✅ 依赖版本兼容性检查
- ✅ 数据库迁移脚本准备
- ✅ 备份策略确认

### 部署过程

- ✅ 构建资源优化
- ✅ 静态资源CDN上传
- ✅ 容器镜像构建推送
- ✅ 服务滚动更新
- ✅ 数据库结构更新
- ✅ 缓存清理更新

### 部署后验证

- ✅ 健康检查通过
- ✅ 关键功能测试
- ✅ 性能指标正常
- ✅ 错误监控配置
- ✅ 日志收集正常
- ✅ 回滚方案准备

通过这套完整的部署体系，CC-Admin 能够实现安全、可靠、高效的生产环境部署。
