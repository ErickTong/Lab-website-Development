#!/bin/bash

# 实验室网站一键部署脚本
# 支持Ubuntu/Debian/CentOS系统

set -e

echo "🚀 实验室网站容器化部署开始..."
echo "================================"

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 打印带颜色的消息
print_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 检查操作系统
check_os() {
    print_info "检查操作系统..."
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        if [ -f /etc/debian_version ]; then
            OS="debian"
            print_info "检测到 Debian/Ubuntu 系统"
        elif [ -f /etc/redhat-release ]; then
            OS="redhat"
            print_info "检测到 RedHat/CentOS 系统"
        else
            print_error "不支持的Linux发行版"
            exit 1
        fi
    else
        print_error "不支持的操作系统: $OSTYPE"
        exit 1
    fi
}

# 检查并安装Docker
install_docker() {
    print_info "检查Docker安装状态..."
    
    if command -v docker &> /dev/null; then
        print_info "Docker已安装: $(docker --version)"
    else
        print_info "正在安装Docker..."
        
        if [ "$OS" == "debian" ]; then
            # Ubuntu/Debian
            sudo apt update
            sudo apt install -y apt-transport-https ca-certificates curl gnupg lsb-release
            curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
            echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
            sudo apt update
            sudo apt install -y docker-ce docker-ce-cli containerd.io
        else
            # CentOS/RHEL
            sudo yum install -y yum-utils
            sudo yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
            sudo yum install -y docker-ce docker-ce-cli containerd.io
        fi
        
        # 启动Docker
        sudo systemctl start docker
        sudo systemctl enable docker
        print_info "Docker安装完成"
    fi
}

# 检查并安装Docker Compose
install_docker_compose() {
    print_info "检查Docker Compose安装状态..."
    
    if command -v docker-compose &> /dev/null; then
        print_info "Docker Compose已安装: $(docker-compose --version)"
    else
        print_info "正在安装Docker Compose..."
        sudo curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
        sudo chmod +x /usr/local/bin/docker-compose
        print_info "Docker Compose安装完成"
    fi
}

# 配置用户权限
setup_user_permissions() {
    print_info "配置用户Docker权限..."
    
    if ! groups $USER | grep -q docker; then
        sudo usermod -aG docker $USER
        print_warning "用户已添加到docker组，请重新登录或运行 'newgrp docker'"
    fi
}

# 创建必要目录
create_directories() {
    print_info "创建必要目录..."
    mkdir -p public/uploads
    mkdir -p db
    mkdir -p prisma
    chmod 755 public/uploads
}

# 配置环境变量
setup_environment() {
    print_info "配置环境变量..."
    
    if [ ! -f .env ]; then
        if [ -f .env.example ]; then
            cp .env.example .env
            print_info "已从.env.example创建.env文件"
            print_warning "请编辑.env文件设置合适的环境变量"
        else
            print_error "未找到.env.example文件"
            exit 1
        fi
    fi
}

# 停止现有容器
stop_existing_containers() {
    print_info "停止现有容器..."
    if [ -f docker-compose.yml ]; then
        docker-compose down --remove-orphans 2>/dev/null || true
    fi
}

# 构建和启动容器
build_and_start() {
    print_info "构建Docker镜像..."
    docker-compose build --no-cache
    
    print_info "启动容器..."
    docker-compose up -d
    
    print_info "等待容器启动..."
    sleep 15
}

# 验证部署
verify_deployment() {
    print_info "验证部署状态..."
    
    # 检查容器状态
    if docker-compose ps | grep -q "Up"; then
        print_info "容器运行正常"
    else
        print_error "容器启动失败"
        docker-compose logs
        exit 1
    fi
    
    # 检查网站访问
    if curl -f http://localhost:3000 > /dev/null 2>&1; then
        print_info "网站访问正常"
    else
        print_warning "网站可能还在启动中，请稍等片刻"
    fi
}

# 显示访问信息
show_access_info() {
    echo ""
    echo "🎉 部署完成！"
    echo "================================"
    echo "📱 访问地址:"
    echo "   网站首页: http://localhost:3000"
    echo "   管理后台: http://localhost:3000/admin"
    echo "   登录页面: http://localhost:3000/auth/login"
    echo ""
    echo "🔐 测试账户:"
    echo "   管理员: admin@lab.com / admin123"
    echo "   编辑:   editor@lab.com / editor123"
    echo ""
    echo "📊 管理命令:"
    echo "   查看状态: docker-compose ps"
    echo "   查看日志: docker-compose logs -f"
    echo "   停止服务: docker-compose down"
    echo "   重启服务: docker-compose restart"
    echo ""
    echo "📁 重要目录:"
    echo "   上传文件: ./public/uploads/"
    echo "   数据库:   ./db/"
    echo "   配置文件: .env"
    echo ""
}

# 主函数
main() {
    check_os
    install_docker
    install_docker_compose
    setup_user_permissions
    create_directories
    setup_environment
    stop_existing_containers
    build_and_start
    verify_deployment
    show_access_info
}

# 运行主函数
main