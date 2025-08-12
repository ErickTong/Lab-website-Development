# 🐳 实验室网站容器化部署指南

## 📋 部署前准备

### 系统要求
- **操作系统**: Linux (Ubuntu 18.04+, CentOS 7+), macOS, Windows
- **内存**: 最少 2GB RAM (推荐 4GB+)
- **存储**: 最少 5GB 可用空间
- **网络**: 能访问互联网

### 安装Docker

#### Ubuntu/Debian
```bash
# 更新软件包索引
sudo apt update

# 安装依赖
sudo apt install apt-transport-https ca-certificates curl gnupg lsb-release

# 添加Docker官方GPG密钥
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

# 添加Docker仓库
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# 安装Docker
sudo apt update
sudo apt install docker-ce docker-ce-cli containerd.io

# 安装Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# 添加用户到docker组
sudo usermod -aG docker $USER

# 重新登录或运行
newgrp docker
```

#### CentOS/RHEL
```bash
# 安装依赖
sudo yum install -y yum-utils

# 添加Docker仓库
sudo yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo

# 安装Docker
sudo yum install docker-ce docker-ce-cli containerd.io

# 启动Docker
sudo systemctl start docker
sudo systemctl enable docker

# 安装Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# 添加用户到docker组
sudo usermod -aG docker $USER
```

#### Windows/macOS
- 下载并安装 [Docker Desktop](https://www.docker.com/products/docker-desktop)
- 按照安装向导完成安装

## 🚀 快速部署

### 1. 克隆项目
```bash
git clone <your-repo-url>
cd lab-website
```

### 2. 配置环境变量
```bash
# 复制环境变量模板
cp .env.example .env

# 编辑环境变量
nano .env
```

### 3. 启动容器
```bash
# 给启动脚本执行权限
chmod +x docker-start.sh

# 执行部署
./docker-start.sh
```

### 4. 验证部署
```bash
# 查看容器状态
docker-compose ps

# 查看日志
docker-compose logs -f

# 测试访问
curl http://localhost:3000
```

## 📁 项目文件结构

```
lab-website/
├── Dockerfile                 # Docker镜像构建文件
├── docker-compose.yml         # 容器编排配置
├── docker-start.sh           # 自动化部署脚本
├── .dockerignore             # Docker构建忽略文件
├── package.json              # 项目依赖
├── prisma/                   # 数据库配置
├── public/                   # 静态资源
│   └── uploads/             # 上传文件目录
├── src/                      # 源代码
└── db/                       # 数据库文件
```

## ⚙️ 配置说明

### Dockerfile
```dockerfile
# 使用官方Node.js运行时作为基础镜像
FROM node:18-alpine

# 设置工作目录
WORKDIR /app

# 复制package.json和package-lock.json
COPY package*..json ./

# 安装依赖
RUN npm ci --only=production

# 复制项目文件
COPY . .

# 生成Prisma客户端
RUN npx prisma generate

# 构建Next.js应用
RUN npm run build

# 创建uploads目录
RUN mkdir -p /app/public/uploads

# 设置环境变量
ENV NODE_ENV=production

# 暴露端口
EXPOSE 3000

# 启动应用
CMD ["npm", "start"]
```

### docker-compose.yml
```yaml
version: '3.8'

services:
  web:
    build: 
      context: .
      dockerfile: Dockerfile
    container_name: lab-website
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
      - DATABASE_URL=file:./dev.db
    volumes:
      - ./public/uploads:/app/public/uploads
      - ./prisma:/app/prisma
      - ./db:/app/db
    restart: unless-stopped
    networks:
      - lab-network
    healthcheck:
      test: ["CMD", "wget", "--no-verbose", "--tries=1", "--spider", "http://localhost:3000/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

networks:
  lab-network:
    driver: bridge
```

## 🔧 管理命令

### 容器管理
```bash
# 查看运行状态
docker-compose ps

# 查看实时日志
docker-compose logs -f

# 重启服务
docker-compose restart

# 停止服务
docker-compose down

# 完全停止并删除卷
docker-compose down -v

# 重新构建并启动
docker-compose up -d --build

# 进入容器
docker exec -it lab-website sh
```

### 数据备份
```bash
# 备份数据
tar -czf backup-$(date +%Y%m%d).tar.gz \
  ./public/uploads \
  ./prisma \
  ./db

# 恢复数据
tar -xzf backup-20231201.tar.gz
```

### 更新部署
```bash
# 拉取最新代码
git pull origin main

# 重新构建并启动
docker-compose up -d --build

# 清理旧镜像
docker image prune -f
```

## 🌐 访问地址

### 本地访问
- **网站首页**: http://localhost:3000
- **管理后台**: http://localhost:3000/admin
- **登录页面**: http://localhost:3000/auth/login

### 局域网访问
- **网站首页**: http://your-server-ip:3000
- **管理后台**: http://your-server-ip:3000/admin

### 测试账户
- **管理员**: admin@lab.com / admin123
- **编辑**: editor@lab.com / editor123

## 🔒 安全配置

### 防火墙设置
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

### 反向代理配置 (Nginx)
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

### SSL证书配置
```bash
# 安装Certbot
sudo apt install certbot python3-certbot-nginx

# 获取SSL证书
sudo certbot --nginx -d your-domain.com

# 自动续期
sudo crontab -e
# 添加: 0 12 * * * /usr/bin/certbot renew --quiet
```

## 📊 监控和维护

### 资源监控
```bash
# 查看容器资源使用
docker stats lab-website

# 查看磁盘使用
docker system df

# 清理未使用的资源
docker system prune -a
```

### 日志管理
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

### 自动重启
```bash
# 设置容器开机自启
docker update --restart=unless-stopped lab-website

# 创建systemd服务
sudo tee /etc/systemd/system/docker-lab-website.service > /dev/null <<EOF
[Unit]
Description=Lab Website Container
Requires=docker.service
After=docker.service

[Service]
Restart=always
ExecStart=/usr/local/bin/docker-compose -f /path/to/docker-compose.yml up
ExecStop=/usr/local/bin/docker-compose -f /path/to/docker-compose.yml down

[Install]
WantedBy=multi-user.target
EOF

# 启用服务
sudo systemctl enable docker-lab-website.service
sudo systemctl start docker-lab-website.service
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

### 性能优化

#### 1. 构建优化
```dockerfile
# 多阶段构建
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma
EXPOSE 3000
CMD ["node", "server.js"]
```

#### 2. 缓存优化
```yaml
# 在docker-compose.yml中添加
volumes:
  - node_modules:/app/node_modules
  - .next:/app/.next
```

## 🎯 生产环境建议

### 1. 使用HTTPS
- 配置SSL证书
- 强制HTTPS重定向
- 使用安全的Cookie设置

### 2. 数据备份
- 定期备份数据库文件
- 备份上传的文件
- 设置异地备份

### 3. 监控告警
- 设置健康检查
- 配置日志监控
- 设置资源使用告警

### 4. 安全加固
- 使用非root用户运行容器
- 限制网络访问
- 定期更新依赖包

## 📞 技术支持

如果遇到问题，请检查：
1. Docker是否正确安装
2. 端口3000是否被占用
3. 防火墙设置是否正确
4. 文件权限是否正确

更多帮助请参考：
- [Docker官方文档](https://docs.docker.com/)
- [Docker Compose文档](https://docs.docker.com/compose/)
- [Next.js部署文档](https://nextjs.org/docs/deployment)