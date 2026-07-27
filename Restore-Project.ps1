# 保存为 Restore-Project.ps1
# 在项目根目录执行

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  恢复项目到修改之前的状态" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

Write-Host "⚠️  警告: 此操作将删除所有新创建的文件和目录" -ForegroundColor Red
Write-Host "⚠️  包括: index.html, login.html, 404.html, manifest.json," -ForegroundColor Red
Write-Host "⚠️  service-worker.js, assets/, layouts/, modules/, locales/" -ForegroundColor Red
Write-Host "⚠️  data/, backups/, exports/, imports/" -ForegroundColor Red
Write-Host ""

$confirm = Read-Host "确认要继续吗？(输入 YES 确认)"
if ($confirm -ne "YES") {
    Write-Host "操作已取消" -ForegroundColor Yellow
    exit
}

Write-Host "`n[1] 删除新创建的核心文件..." -ForegroundColor Green

# 删除新创建的 HTML 文件
$filesToDelete = @(
    "index.html",
    "login.html", 
    "404.html",
    "manifest.json",
    "service-worker.js",
    "favicon.ico",
    "vitest.config.js",
    ".eslintrc.json",
    ".prettierrc",
    "README.md",
    ".env.example"
)

foreach ($file in $filesToDelete) {
    if (Test-Path $file) {
        Remove-Item -Path $file -Force
        Write-Host "  ✓ 已删除: $file" -ForegroundColor Gray
    }
}

Write-Host "`n[2] 删除新创建的目录..." -ForegroundColor Green

$dirsToDelete = @(
    "assets",
    "layouts", 
    "modules",
    "locales",
    "data",
    "backups",
    "exports",
    "imports",
    ".github"
)

foreach ($dir in $dirsToDelete) {
    if (Test-Path $dir) {
        Remove-Item -Path $dir -Recurse -Force
        Write-Host "  ✓ 已删除目录: $dir" -ForegroundColor Gray
    }
}

Write-Host "`n[3] 恢复 package.json..." -ForegroundColor Green

# 检查是否在 frontend 目录
if (Test-Path "frontend/package.json") {
    Set-Location frontend
    
    # 恢复 package.json 原始脚本
    $pkg = Get-Content "package.json" -Raw | ConvertFrom-Json
    
    # 移除新增的 scripts
    $scriptsToRemove = @("test", "test:coverage", "lint", "format")
    foreach ($script in $scriptsToRemove) {
        if ($pkg.scripts.PSObject.Properties.Name -contains $script) {
            $pkg.scripts.PSObject.Properties.Remove($script)
            Write-Host "  ✓ 已移除 script: $script" -ForegroundColor Gray
        }
    }
    
    $pkg | ConvertTo-Json -Depth 10 | Out-File -FilePath "package.json" -Encoding UTF8
    Write-Host "  ✓ package.json 已恢复" -ForegroundColor Green
    
    # 删除新安装的依赖
    Write-Host "`n[4] 删除新安装的开发依赖..." -ForegroundColor Green
    
    $devDepsToRemove = @(
        "vitest",
        "@vue/test-utils",
        "jsdom",
        "eslint",
        "prettier",
        "eslint-plugin-vue",
        "@vue/eslint-config-prettier"
    )
    
    foreach ($dep in $devDepsToRemove) {
        if (Test-Path "node_modules/$dep") {
            Remove-Item -Path "node_modules/$dep" -Recurse -Force -ErrorAction SilentlyContinue
            Write-Host "  ✓ 已删除: $dep" -ForegroundColor Gray
        }
    }
    
    # 删除测试目录
    if (Test-Path "src/__tests__") {
        Remove-Item -Path "src/__tests__" -Recurse -Force
        Write-Host "  ✓ 已删除测试目录" -ForegroundColor Gray
    }
    
    Set-Location ..
}

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "✅ 项目已恢复到修改之前的状态！" -ForegroundColor Green
Write-Host "========================================`n" -ForegroundColor Cyan

Write-Host "📁 当前项目结构:" -ForegroundColor Yellow
Write-Host "  • frontend/ - 原始前端项目" -ForegroundColor White
Write-Host "  • 原有的 index.html (frontend 目录内)" -ForegroundColor White
Write-Host "  • 原有的 package.json (frontend 目录内)" -ForegroundColor White
Write-Host "  • 原有的 src/ 目录" -ForegroundColor White

Write-Host "`n💡 提示:" -ForegroundColor Cyan
Write-Host "  1. 原始的 index.html 在 frontend 目录中" -ForegroundColor White
Write-Host "  2. 如需启动开发服务器: cd frontend && npm run dev" -ForegroundColor White
Write-Host "  3. 如需构建: cd frontend && npm run build" -ForegroundColor White
Write-Host "========================================`n" -ForegroundColor Cyan