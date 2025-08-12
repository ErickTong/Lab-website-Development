# 实验室网站Windows部署脚本
Write-Host "🚀 实验室网站容器化部署开始..." -ForegroundColor Green
Write-Host "================================"

# 检查Docker Desktop是否安装
if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Docker未安装，请先安装Docker Desktop for Windows" -ForegroundColor Red
    Write-Host "下载地址: https://www.docker.com/products/docker-desktop" -ForegroundColor Yellow
    exit 1
}

# 检查Docker Compose是否安装
if (-not (Get-Command docker-compose -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Docker Compose未安装" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Docker环境检查通过" -ForegroundColor Green

# 创建必要目录
Write-Host "📁 创建必要目录..." -ForegroundColor Yellow
if (-not (Test-Path "public\uploads")) {
    New-Item -ItemType Directory -Path "public\uploads" -Force
}
if (-not (Test-Path "db")) {
    New-Item -ItemType Directory -Path "db" -Force
}
if (-not (Test-Path "prisma")) {
    New-Item -ItemType Directory -Path "prisma" -Force
}

# 检查环境变量文件
if (-not (Test-Path ".env")) {
    if (Test-Path ".env.example") {
        Copy-Item ".env.example" ".env"
        Write-Host "📝 已从.env.example创建.env文件" -ForegroundColor Green
        Write-Host "⚠️ 请编辑.env文件设置合适的环境变量" -ForegroundColor Yellow
    } else {
        Write-Host "❌ 未找到.env.example文件" -ForegroundColor Red
        exit 1
    }
}

# 停止现有容器
Write-Host "🛑 停止现有容器..." -ForegroundColor Yellow
if (Test-Path "docker-compose.yml") {
    docker-compose down --remove-orphans 2>$null
}

# 清理旧镜像
Write-Host "🧹 清理旧镜像..." -ForegroundColor Yellow
docker image prune -f

# 构建新镜像
Write-Host "🏗️ 构建Docker镜像..." -ForegroundColor Yellow
docker-compose build --no-cache

# 启动容器
Write-Host "🔄 启动容器..." -ForegroundColor Yellow
docker-compose up -d

# 等待容器启动
Write-Host "⏳ 等待容器启动..." -ForegroundColor Yellow
Start-Sleep -Seconds 15

# 检查容器状态
Write-Host "✅ 检查容器状态..." -ForegroundColor Green
docker-compose ps

# 测试网站访问
Write-Host "🌐 测试网站访问..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000" -TimeoutSec 10 -ErrorAction Stop
    if ($response.StatusCode -eq 200) {
        Write-Host "🎉 网站部署成功！" -ForegroundColor Green
    } else {
        Write-Host "⚠️ 网站可能还在启动中，请稍等片刻" -ForegroundColor Yellow
    }
} catch {
    Write-Host "⚠️ 网站可能还在启动中，请稍等片刻" -ForegroundColor Yellow
}

# 显示访问信息
Write-Host ""
Write-Host "🎉 部署完成！" -ForegroundColor Green
Write-Host "================================"
Write-Host "📱 访问地址:" -ForegroundColor Cyan
Write-Host "   网站首页: http://localhost:3000"
Write-Host "   管理后台: http://localhost:3000/admin"
Write-Host "   登录页面: http://localhost:3000/auth/login"
Write-Host ""
Write-Host "🔐 测试账户:" -ForegroundColor Cyan
Write-Host "   管理员: admin@lab.com / admin123"
Write-Host "   编辑:   editor@lab.com / editor123"
Write-Host ""
Write-Host "📊 管理命令:" -ForegroundColor Cyan
Write-Host "   查看状态: docker-compose ps"
Write-Host "   查看日志: docker-compose logs -f"
Write-Host "   停止服务: docker-compose down"
Write-Host "   重启服务: docker-compose restart"
Write-Host ""
Write-Host "📁 重要目录:" -ForegroundColor Cyan
Write-Host "   上传文件: .\public\uploads\"
Write-Host "   数据库:   .\db\"
Write-Host "   配置文件: .env"
Write-Host ""