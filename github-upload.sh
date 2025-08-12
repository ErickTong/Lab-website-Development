#!/bin/bash

# GitHub仓库上传脚本
# 西北旱区果树发育生物学实验室网站

echo "🚀 GitHub仓库上传脚本"
echo "======================"
echo

# 检查Git状态
echo "📋 检查当前状态..."
git status

echo
echo "📝 请按照以下步骤操作："
echo
echo "1. 在GitHub上创建新仓库："
echo "   - 访问 https://github.com"
echo "   - 点击 '+' -> 'New repository'"
echo "   - 仓库名称建议: fruit-tree-lab-website"
echo "   - 描述: 西北旱区果树发育生物学实验室网站"
echo "   - 设置为Public或Private"
echo "   - 不要勾选任何初始化选项"
echo
echo "2. 复制仓库的HTTPS地址（格式：https://github.com/用户名/仓库名.git）"
echo
echo "3. 在下方输入你的仓库地址："
read -p "GitHub仓库地址: " repo_url

if [ -z "$repo_url" ]; then
    echo "❌ 错误：仓库地址不能为空"
    exit 1
fi

echo
echo "🔗 添加远程仓库..."
git remote add origin "$repo_url"

echo
echo "📤 推送到GitHub..."
echo "注意：如果使用HTTPS，需要输入GitHub用户名和Personal Access Token"
echo

git push -u origin master

if [ $? -eq 0 ]; then
    echo
    echo "🎉 成功！项目已上传到GitHub"
    echo "📍 仓库地址: $repo_url"
    echo
    echo "📋 后续操作："
    echo "   - 访问GitHub仓库页面验证内容"
    echo "   - 可以设置仓库描述、标签等"
    echo "   - 如需要，可以配置GitHub Pages"
else
    echo
    echo "❌ 推送失败，请检查："
    echo "   - 仓库地址是否正确"
    echo "   - 网络连接是否正常"
    echo "   - 认证信息是否正确（使用Personal Access Token）"
    echo "   - 仓库是否已存在"
fi