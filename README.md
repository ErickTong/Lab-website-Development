# 🧪 实验室网站开发部署

一个现代化的课题组展示网站，具有完整的内容管理系统和团队展示功能。

## 🌟 项目特色

- **🏛️ 实验室展示** - 专业的实验室介绍和研究成果展示
- **👥 团队管理** - 完整的团队成员信息管理系统
- **📝 内容管理** - 文章发布、编辑、分类管理
- **📁 文件管理** - 支持多种文件格式的上传和管理
- **🔐 用户认证** - 基于JWT的安全认证系统
- **🎨 响应式设计** - 适配桌面端和移动端设备
- **🐳 容器化部署** - 支持Docker容器化部署

## 🚀 快速开始

### 开发环境运行

```bash
# 安装依赖
npm install

# 初始化数据库
npm run db:push

# 启动开发服务器
npm run dev
```

访问 [http://localhost:3000](http://******:3000) 查看网站。

### 容器化部署

#### 自动部署（推荐）

```bash
# Linux/macOS
chmod +x deploy.sh
./deploy.sh

# Windows
.\deploy-windows.ps1
```

#### 手动部署

```bash
# 1. 构建镜像
docker-compose build

# 2. 启动容器
docker-compose up -d

# 3. 查看状态
docker-compose ps
```

## 🔐 默认账户

| 角色 | 邮箱 | 密码 | 权限 |
|------|------|------|------|
| 管理员 | admin@lab.com | ****** | 完整权限 |
| 编辑 | editor@lab.com | ****** | 内容管理 |

## 📱 访问地址

| 功能 | 地址 |
|------|------|
| 网站首页 | http://******:3000 |
| 管理后台 | http://******:3000/admin |
| 登录页面 | http://******:3000/auth/login |
| 研究成果 | http://******:3000/research |
| 团队展示 | http://******:3000/team |

## 🛠️ 技术栈

### 前端技术
- **⚡ Next.js 15** - React框架，支持App Router
- **📘 TypeScript 5** - 类型安全的JavaScript
- **🎨 Tailwind CSS 4** - 实用优先的CSS框架
- **🧩 shadcn/ui** - 高质量的UI组件库
- **🎯 Lucide React** - 美观的图标库

### 后端技术
- **🗄️ Prisma** - 现代化的数据库ORM
- **🔐 JWT** - JSON Web Token认证
- **📁 Multer** - 文件上传处理
- **🌐 Socket.io** - 实时通信支持

### 数据库
- **💾 SQLite** - 轻量级关系型数据库

### 部署技术
- **🐳 Docker** - 容器化部署
- **📋 Docker Compose** - 多容器编排

## 📁 项目结构

```
lab-website/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API路由
│   │   ├── auth/              # 认证页面
│   │   ├── admin/             # 管理后台
│   │   └── page.tsx           # 首页
│   ├── components/            # React组件
│   │   └── ui/               # shadcn/ui组件
│   └── lib/                  # 工具函数
├── prisma/                   # 数据库配置
├── public/                   # 静态资源
│   └── uploads/             # 上传文件
├── db/                       # 数据库文件
├── Dockerfile                # Docker镜像配置
├── docker-compose.yml        # 容器编排配置
├── deploy.sh                 # Linux/macOS部署脚本
├── deploy-windows.ps1        # Windows部署脚本
└── DOCKER_DEPLOYMENT.md      # 容器化部署文档
```

## 🎯 核心功能

### 1. 内容管理系统
- ✅ 文章创建、编辑、删除
- ✅ 文章分类管理
- ✅ 发布状态控制
- ✅ 富文本编辑器支持
- ✅ 封面图片上传

### 2. 文件管理系统
- ✅ 多文件格式支持
- ✅ 文件大小限制
- ✅ 文件预览和下载
- ✅ 批量上传功能
- ✅ 文件分类管理

### 3. 团队管理系统
- ✅ 团队成员信息管理
- ✅ 成员头像上传
- ✅ 职位和联系方式
- ✅ 研究方向展示
- ✅ 教育背景管理

### 4. 用户认证系统
- ✅ JWT令牌认证
- ✅ 角色权限管理
- ✅ 安全密码加密
- ✅ 会话管理
- ✅ 权限控制

### 5. 响应式设计
- ✅ 移动端适配
- ✅ 桌面端优化
- ✅ 暗色主题支持
- ✅ 无障碍访问
- ✅ 流畅动画效果

## 🐳 容器化部署

### 系统要求
- **操作系统**: Linux, macOS, Windows
- **内存**: 最少 2GB RAM
- **存储**: 最少 5GB 可用空间
- **网络**: 能访问互联网

### 安装Docker

#### Ubuntu/Debian
```bash
# 安装Docker
sudo apt update
sudo apt install docker.io docker-compose
sudo systemctl start docker
sudo systemctl enable docker

# 添加用户到docker组
sudo usermod -aG docker $USER
```

#### CentOS/RHEL
```bash
# 安装Docker
sudo yum install docker docker-compose
sudo systemctl start docker
sudo systemctl enable docker

# 添加用户到docker组
sudo usermod -aG docker $USER
```

#### Windows/macOS
- 下载并安装 [Docker Desktop](https://www.docker.com/products/docker-desktop)

### 部署步骤

1. **克隆项目**
```bash
git clone <repository-url>
cd lab-website
```

2. **配置环境**
```bash
# 复制环境变量模板
cp .env.example .env

# 编辑环境变量（可选）
nano .env
```

3. **一键部署**
```bash
# Linux/macOS
chmod +x deploy.sh
./deploy.sh

# Windows
.\deploy-windows.ps1
```

4. **验证部署**
```bash
# 查看容器状态
docker-compose ps

# 查看日志
docker-compose logs -f

# 测试访问
curl http://localhost:3000
```

### 管理命令

```bash
# 查看容器状态
docker-compose ps

# 查看日志
docker-compose logs -f

# 重启服务
docker-compose restart

# 停止服务
docker-compose down

# 更新部署
docker-compose up -d --build

# 进入容器
docker exec -it lab-website sh
```

## 🔧 开发指南

### 本地开发

```bash
# 安装依赖
npm install

# 初始化数据库
npm run db:push

# 启动开发服务器
npm run dev

# 代码检查
npm run lint

# 构建生产版本
npm run build
```

### 数据库操作

```bash
# 推送数据库结构
npm run db:push

# 生成Prisma客户端
npm run db:generate

# 数据库迁移
npm run db:migrate

# 重置数据库
npm run db:reset
```

### 添加新功能

1. **创建页面**
```bash
# 在src/app目录下创建新页面
src/app/new-page/page.tsx
```

2. **创建组件**
```bash
# 在src/components目录下创建组件
src/components/new-component.tsx
```

3. **创建API路由**
```bash
# 在src/app/api目录下创建路由
src/app/api/new-feature/route.ts
```

## 📊 生产环境部署

### 服务器配置

#### 最低配置
- **CPU**: 1核心
- **内存**: 2GB
- **存储**: 20GB SSD
- **网络**: 1Mbps

#### 推荐配置
- **CPU**: 2核心
- **内存**: 4GB
- **存储**: 50GB SSD
- **网络**: 10Mbps

### 安全配置

#### 防火墙设置
```bash
# Ubuntu/Debian
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw enable

# CentOS/RHEL
sudo firewall-cmd --permanent --add-port=22/tcp
sudo firewall-cmd --permanent --add-port=80/tcp
sudo firewall-cmd --permanent --add-port=443/tcp
sudo firewall-cmd --reload
```

#### 反向代理配置（Nginx）
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 监控和维护

#### 资源监控
```bash
# 查看容器资源使用
docker stats lab-website

# 查看磁盘使用
docker system df

# 清理未使用资源
docker system prune -a
```

#### 日志管理
```bash
# 查看日志
docker-compose logs -f

# 导出日志
docker-compose logs > app.log

# 限制日志大小
# 在docker-compose.yml中添加:
logging:
  driver: "json-file"
  options:
    max-size: "10m"
    max-file: "3"
```

#### 数据备份
```bash
# 备份数据
tar -czf backup-$(date +%Y%m%d).tar.gz \
  ./public/uploads \
  ./prisma \
  ./db

# 恢复数据
tar -xzf backup-20231201.tar.gz
```

## 🚨 故障排除

### 常见问题

#### 1. 容器启动失败
```bash
# 查看错误日志
docker-compose logs

# 检查端口占用
netstat -tulpn | grep :3000

# 检查Docker服务
sudo systemctl status docker
```

#### 2. 数据库连接失败
```bash
# 检查数据库文件
ls -la db/

# 检查权限
sudo chown -R $USER:$USER db/
sudo chown -R $USER:$USER prisma/
```

#### 3. 文件上传失败
```bash
# 检查uploads目录权限
sudo chown -R $USER:$USER public/uploads/
sudo chmod -R 755 public/uploads/
```

#### 4. 内存不足
```bash
# 限制容器内存使用
# 在docker-compose.yml中添加:
deploy:
  resources:
    limits:
      memory: 512M
```

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 📞 支持

如果您在使用过程中遇到问题，请：

1. 查看 [故障排除](#故障排除) 部分
2. 检查 [部署文档](DOCKER_DEPLOYMENT.md)
3. 提交 Issue 到项目仓库

## 🎉 致谢

感谢所有为这个项目做出贡献的开发者和设计师。

---

**西北旱区果树发育生物学实验室** - 让科研更简单，让成果更精彩 🌱
