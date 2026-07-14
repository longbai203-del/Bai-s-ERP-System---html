# scripts/cleanup/deduplicate-modules.ps1
$modulesPath = "frontend/modules"

# 获取所有模块目录
$moduleDirs = Get-ChildItem -Path $modulesPath -Directory | Where-Object { $_.Name -match "^\d{2}-" }

foreach ($moduleDir in $moduleDirs) {
    $modulePath = $moduleDir.FullName
    Write-Host "检查模块: $($moduleDir.Name)" -ForegroundColor Cyan
    
    # 获取所有子目录
    $subDirs = Get-ChildItem -Path $modulePath -Directory
    
    foreach ($subDir in $subDirs) {
        $subPath = $subDir.FullName
        
        # 检查子目录中的文件
        $subFiles = Get-ChildItem -Path $subPath -File
        
        foreach ($subFile in $subFiles) {
            $rootFile = Join-Path $modulePath $subFile.Name
            
            if (Test-Path $rootFile) {
                # 比较文件修改时间
                $rootTime = (Get-Item $rootFile).LastWriteTime
                $subTime = (Get-Item $subFile.FullName).LastWriteTime
                
                if ($subTime -ge $rootTime) {
                    Write-Host "  保留子目录版本，删除根目录: $($subFile.Name)" -ForegroundColor Yellow
                    Remove-Item -Force $rootFile
                } else {
                    Write-Host "  保留根目录版本，删除子目录: $($subFile.Name)" -ForegroundColor Gray
                    Remove-Item -Force $subFile.FullName
                }
            }
        }
    }
}

Write-Host "清理完成！" -ForegroundColor Green