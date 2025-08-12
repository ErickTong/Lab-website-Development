# GitHub 上传指南

## 📋 项目状态
✅ **已完成**：所有代码已提交到本地Git仓库  
✅ **已完成**：.gitignore文件已配置，排除敏感文件  
✅ **已完成**：项目结构完整，包含所有必要文件  

## 🚀 上传步骤

### 方法一：使用GitHub网页界面（推荐）

#### 1. 创建GitHub仓库
1. 访问 [github.com](https://github.com)
2. 登录你的GitHub账户
3. 点击右上角的 "+" 按钮，选择 "New repository"
4. 填写仓库信息：
   - **Repository name**: `fruit-tree-lab-website` (或你喜欢的名称)
   - **Description**: `西北旱区果树发育生物学实验室网站`
   - 设置为 **Public** (公开) 或 **Private** (私有)
   - **不要** 勾选 "Add a README file" (我们已经有了)
   - **不要** 勾选 "Add .gitignore" (我们已经配置了)
   - **不要** 勾选 "Add a license" (如果需要可以后续添加)

#### 2. 获取仓库地址
创建仓库后，复制仓库的HTTPS地址，格式如下：
```
https://github.com/你的用户名/fruit-tree-lab-website.git
```

#### 3. 添加远程仓库并推送
在项目根目录执行以下命令：

```bash
# 添加远程仓库
git remote add origin https://github.com/你的用户名/fruit-tree-lab-website.git

# 推送到GitHub
git push -u origin master
```

### 方法二：使用GitHub CLI（如果已安装）

如果你已安装GitHub CLI并已登录，可以使用以下命令：

```bash
# 创建GitHub仓库并推送
gh repo create fruit-tree-lab-website --public --source=. --remote=origin --push
```

## 🔐 认证说明

### HTTPS认证
如果使用HTTPS地址，推送时会要求输入GitHub用户名和密码：
- **用户名**：你的GitHub用户名
- **密码**：使用 **Personal Access Token (PAT)**，不是你的GitHub密码

#### 创建Personal Access Token
1. 访问 GitHub → Settings → Developer settings → Personal access tokens
2. 点击 "Generate new token"
3. 设置token名称，选择有效期
4. 勾选以下权限：
   - `repo` (完整仓库访问权限)
   - `workflow` (如果需要GitHub Actions)
5. 点击 "Generate token"
6. **复制生成的token**（只显示一次，请妥善保存）

### SSH认证（推荐）
如果你已配置SSH密钥，可以使用SSH地址：

```bash
git remote add origin git@github.com:你的用户名/fruit-tree-lab-website.git
git push -u origin master
```

## 📁 项目结构说明

上传到GitHub的项目包含以下主要内容：

### 📂 核心文件
- `src/app/` - Next.js应用页面和API路由
- `src/components/` - React组件（包含完整的shadcn/ui组件库）
- `src/lib/` - 工具库和数据库配置
- `prisma/` - 数据库模式和种子数据
- `public/` - 静态资源文件

### 📂 配置文件
- `package.json` - 项目依赖和脚本
- `tailwind.config.ts` - Tailwind CSS配置
- `next.config.ts` - Next.js配置
- `tsconfig.json` - TypeScript配置
- `components.json` - shadcn/ui配置

### 📂 部署文件
- `Dockerfile` - Docker镜像构建配置
- `docker-compose.yml` - 容器编排配置
- `deploy.sh` - Linux/macOS部署脚本
- `deploy-windows.ps1` - Windows部署脚本

### 📂 文档文件
- `README.md` - 项目说明文档
- `DOCKER_DEPLOYMENT.md` - 容器化部署指南
- `DEPLOYMENT_COMPLETE.md` - 部署完成总结
- `TESTING_GUIDE.md` - 测试指南

## 🚀 推送后的操作

### 1. 验证仓库内容
推送完成后，访问GitHub仓库页面，检查：
- 所有文件都已上传
- 文件结构正确
- README.md显示正常

### 2. 设置仓库属性
在GitHub仓库设置中：
- 添加仓库描述
- 设置主题
- 添加标签（如：nextjs, typescript, docker, prisma）
- 启用GitHub Pages（如果需要）

### 3. 配置GitHub Actions（可选）
如果需要自动化测试和部署，可以创建`.github/workflows/`目录并添加工作流文件。

## 📋 快速命令参考

```bash
# 查看当前状态
git status

# 查看远程仓库
git remote -v

# 添加远程仓库
git remote add origin https://github.com/你的用户名/fruit-tree-lab-website.git

# 首次推送
git push -u origin master

# 后续推送
git push

# 拉取远程更改
git pull origin master
```

## 🎯 成功标志

当你看到以下输出时，表示上传成功：

```
Enumerating objects: 123, done.
Counting objects: 100% (123/123), done.
Delta compression using up to 8 threads
Compressing objects: 100% (89/89), done.
Writing objects: 100% (123/123), 456.78 KiB | 2.45 MiB/s, done.
Total 123 (delta 45), reused 0 (delta 0), pack-reused 0
remote: Resolving deltas: 100% (45/45), done.
To https://github.com/你的用户名/fruit-tree-lab-website.git
 * [new branch]      master -> master
Branch 'master' set up to track remote branch 'master' from 'origin'.
```

## 🔍 故障排除

### 常见问题
1. **认证失败**：检查用户名和Personal Access Token
2. **权限不足**：确保token有`repo`权限
3. **网络问题**：检查网络连接和代理设置
4. **仓库已存在**：确保仓库名称唯一

### 获取帮助
- GitHub文档：https://docs.github.com
- Git文档：https://git-scm.com/doc

---

**🎉 恭喜！你的西北旱区果树发育生物学实验室网站项目已经准备好上传到GitHub了！**