#!/bin/bash

# 实验室网站容器化部署启动脚本
echo "🚀 开始部署实验室网站容器..."

# 检查Docker是否安装
if ! command -v docker &> /dev/null; then
    echo "❌ Docker未安装，请先安装Docker"
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose未安装，请先安装Docker Compose"
    exit 1
fi

# 停止现有容器
echo "🛑 停止现有容器..."
docker-compose down --remove-orphans

# 清理旧镜像
echo "🧹 清理旧镜像..."
docker image prune -f

# 构建新镜像
echo "🏗️ 构建Docker镜像..."
docker-compose build --no-cache

# 启动容器
echo "🔄 启动容器..."
docker-compose up -d

# 等待容器启动
echo "⏳ 等待容器启动..."
sleep 10

# 检查容器状态
echo "✅ 检查容器状态..."
docker-compose ps

# 检查网站是否可访问
echo "🌐 测试网站访问..."
if curl -f http://localhost:3000 > /dev/null 2>&1; then
    echo "🎉 网站部署成功！"
    echo "📱 访问地址: http://localhost:3000"
    echo "🔐 管理后台: http://localhost:3000/admin"
    echo "📧 管理员账户: admin@lab.com / admin123"
else
    echo "⚠️ 网站可能还在启动中，请稍等片刻后访问"
    echo "📋 查看日志: docker-compose logs -f"
fi

echo "📊 容器管理命令:"
echo "  查看状态: docker-compose ps"
echo "  查看日志: docker-compose logs -f"
echo "  停止服务: docker-compose down"
echo "  重启服务: docker-compose restart"