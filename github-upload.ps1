# GitHub仓库上传脚本 (Windows)
# 西北旱区果树发育生物学实验室网站

Write-Host "🚀 GitHub仓库上传脚本" -ForegroundColor Green
Write-Host "======================" -ForegroundColor Green
Write-Host ""

# 检查Git状态
Write-Host "📋 检查当前状态..." -ForegroundColor Yellow
git status

Write-Host ""
Write-Host "📝 请按照以下步骤操作：" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. 在GitHub上创建新仓库：" -ForegroundColor White
Write-Host "   - 访问 https://github.com" -ForegroundColor White
Write-Host "   - 点击 '+' -> 'New repository'" -ForegroundColor White
Write-Host "   - 仓库名称建议: fruit-tree-lab-website" -ForegroundColor White
Write-Host "   - 描述: 西北旱区果树发育生物学实验室网站" -ForegroundColor White
Write-Host "   - 设置为Public或Private" -ForegroundColor White
Write-Host "   - 不要勾选任何初始化选项" -ForegroundColor White
Write-Host ""
Write-Host "2. 复制仓库的HTTPS地址（格式：https://github.com/用户名/仓库名.git）" -ForegroundColor White
Write-Host ""

# 读取用户输入
$repoUrl = Read-Host "3. 输入GitHub仓库地址"

if ([string]::IsNullOrEmpty($repoUrl)) {
    Write-Host "❌ 错误：仓库地址不能为空" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "🔗 添加远程仓库..." -ForegroundColor Yellow
git remote add origin $repoUrl

Write-Host ""
Write-Host "📤 推送到GitHub..." -ForegroundColor Yellow
Write-Host "注意：如果使用HTTPS，需要输入GitHub用户名和Personal Access Token" -ForegroundColor Yellow
Write-Host ""

git push -u origin master

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "🎉 成功！项目已上传到GitHub" -ForegroundColor Green
    Write-Host "📍 仓库地址: $repoUrl" -ForegroundColor Green
    Write-Host ""
    Write-Host "📋 后续操作：" -ForegroundColor Cyan
    Write-Host "   - 访问GitHub仓库页面验证内容" -ForegroundColor White
    Write-Host "   - 可以设置仓库描述、标签等" -ForegroundColor White
    Write-Host "   - 如需要，可以配置GitHub Pages" -ForegroundColor White
} else {
    Write-Host ""
    Write-Host "❌ 推送失败，请检查：" -ForegroundColor Red
    Write-Host "   - 仓库地址是否正确" -ForegroundColor White
    Write-Host "   - 网络连接是否正常" -ForegroundColor White
    Write-Host "   - 认证信息是否正确（使用Personal Access Token）" -ForegroundColor White
    Write-Host "   - 仓库是否已存在" -ForegroundColor White
}

Write-Host ""
Write-Host "按任意键退出..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")