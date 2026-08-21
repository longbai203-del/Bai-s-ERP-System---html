/**
 * System Module - 系统管理
 */

(function() {
    'use strict';

    window.initSystem = function() {
        console.log('🔧 System 模块加载完成');
        
        loadSystemInfo();
        loadAuditLogs();
        bindEvents();
    };

    // 加载系统信息
    function loadSystemInfo() {
        const info = {
            '系统版本': '1.0.0',
            '构建日期': '2026-01-15',
            '数据库版本': 'PostgreSQL 15',
            '运行环境': 'Production',
            '服务状态': '✅ 正常运行'
        };
        
        const container = document.querySelector('.system-info');
        if (!container) return;
        
        container.innerHTML = Object.entries(info).map(([key, value]) => `
            <div class="info-row">
                <span class="info-key">${key}</span>
                <span class="info-value">${value}</span>
            </div>
        `).join('');
    }

    // 加载审计日志
    async function loadAuditLogs() {
        try {
            const logs = await window.AuditService.getLogs({
                limit: 50
            });
            
            renderAuditLogs(logs);
            
            // 加载统计
            const stats = await window.AuditService.getStats();
            updateAuditStats(stats);
        } catch (error) {
            console.error('加载审计日志失败:', error);
        }
    }

    // 渲染审计日志
    function renderAuditLogs(logs) {
        const container = document.querySelector('.audit-list');
        if (!container) return;
        
        container.innerHTML = logs.map(log => `
            <tr>
                <td>${new Date(log.timestamp).toLocaleString()}</td>
                <td>${log.user_email || '系统'}</td>
                <td><span class="action-${log.action}">${log.action}</span></td>
                <td>${log.resource}</td>
                <td>${log.resource_id || '-'}</td>
                <td>${log.user_ip || '-'}</td>
            </tr>
        `).join('');
    }

    // 更新审计统计
    function updateAuditStats(stats) {
        const el = document.querySelector($2); if (el) { el.textContent = stats.total || 0;
        
        // 显示操作类型统计
        const container = document.querySelector('.audit-by-action');
        if (!container) return;
        
        const byAction = stats.byAction || {};
        const actions = Object.keys(byAction).slice(0, 5);
        
        container.innerHTML = actions.map(action => `
            <span class="action-badge">${action}: ${byAction[action]}</span>
        `).join('');
    }

    // 清除缓存
    window.clearCache = function() {
        if ('caches' in window) {
            caches.keys().then(keys => {
                keys.forEach(key => caches.delete(key));
            });
        }
        localStorage.clear();
        sessionStorage.clear();
        window.Notifications.success('缓存已清除');
        setTimeout(() => location.reload(), 1000);
    };

    // 导出数据
    window.exportData = async function() {
        try {
            const tables = ['customers', 'products', 'orders', 'finances', 'profiles'];
            const data = {};
            
            for (const table of tables) {
                const { data: result } = await window.Supabase
                    .from(table)
                    .select('*')
                    .eq('organization_id', window._currentOrg?.id);
                data[table] = result || [];
            }
            
            const blob = new Blob([JSON.stringify(data, null, 2)], { 
                type: 'application/json' 
            });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `backup_${new Date().toISOString().slice(0, 10)}.json`;
            a.click();
            URL.revokeObjectURL(url);
            
            window.Notifications.success('数据导出成功');
        } catch (error) {
            window.Notifications.error('导出失败: ' + error.message);
        }
    };

    // 导入数据
    window.importData = function() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = async (e) => {
            const file = e.target.files[0];
            if (!file) return;
            
            try {
                const text = await file.text();
                const data = JSON.parse(text);
                
                const confirmed = await window.Modal.confirm('导入将覆盖现有数据，确定继续吗？');
                if (!confirmed) return;
                
                // 导入数据
                for (const [table, rows] of Object.entries(data)) {
                    for (const row of rows) {
                        await window.Supabase
                            .from(table)
                            .upsert(row, { onConflict: 'id' });
                    }
                }
                
                window.Notifications.success('数据导入成功');
                loadAuditLogs();
            } catch (error) {
                window.Notifications.error('导入失败: ' + error.message);
            }
        };
        input.click();
    };

    // 绑定事件
    function bindEvents() {
        document.querySelector('.btn-clear-cache')?.addEventListener('click', window.clearCache);
        document.querySelector('.btn-export-data')?.addEventListener('click', window.exportData);
        document.querySelector('.btn-import-data')?.addEventListener('click', window.importData);
        document.querySelector('.btn-refresh-audit')?.addEventListener('click', loadAuditLogs);
    }

    // 模块加载时初始化
    if (document.querySelector('[data-module="system"]')) {
        window.initSystem();
    }

})();
