/**
 * Reports Module - 报表中心
 */

(function() {
    'use strict';

    window.initReports = function() {
        console.log('📊 Reports 模块加载完成');
        
        loadReportTypes();
        bindEvents();
    };

    // 加载报表类型
    function loadReportTypes() {
        const types = [
            { id: 'sales', name: '销售报表', icon: '📈' },
            { id: 'inventory', name: '库存报表', icon: '📦' },
            { id: 'financial', name: '财务报表', icon: '💰' },
            { id: 'employee', name: '员工报表', icon: '👔' },
            { id: 'customer', name: '客户报表', icon: '👤' }
        ];
        
        const container = document.querySelector('.report-types');
        if (!container) return;
        
        container.innerHTML = types.map(type => `
            <div class="report-type" onclick="window.generateReport('${type.id}')">
                <div class="report-icon">${type.icon}</div>
                <div class="report-name">${type.name}</div>
            </div>
        `).join('');
    }

    // 生成报表
    window.generateReport = async function(type) {
        try {
            const dateFrom = document.querySelector('.report-date-from')?.value;
            const dateTo = document.querySelector('.report-date-to')?.value;
            
            let data;
            switch(type) {
                case 'sales':
                    data = await window.ReportService.getSalesReport({ date_from: dateFrom, date_to: dateTo });
                    break;
                case 'inventory':
                    data = await window.ReportService.getInventoryReport({ branch_id: window._currentBranch });
                    break;
                case 'financial':
                    data = await window.ReportService.getFinancialReport({ date_from: dateFrom, date_to: dateTo });
                    break;
                case 'employee':
                    data = await window.ReportService.getEmployeeReport({ organization_id: window._currentOrg?.id });
                    break;
                case 'customer':
                    data = await window.ReportService.getCustomerReport({ organization_id: window._currentOrg?.id });
                    break;
                default:
                    return;
            }
            
            renderReport(type, data);
        } catch (error) {
            console.error('生成报表失败:', error);
            window.Notifications.error('生成报表失败: ' + error.message);
        }
    };

    // 渲染报表
    function renderReport(type, data) {
        const container = document.querySelector('.report-result');
        if (!container) return;
        
        if (!data) {
            container.innerHTML = '<p>暂无数据</p>';
            return;
        }
        
        let html = '<div class="report-container">';
        
        // 统计卡片
        html += `
            <div class="report-stats">
                ${Object.entries(data).filter(([key]) => 
                    ['totalRevenue', 'totalOrders', 'totalIncome', 'totalExpense', 'netProfit', 'totalItems', 'totalCustomers'].includes(key)
                ).map(([key, value]) => `
                    <div class="stat-card">
                        <div class="stat-label">${key}</div>
                        <div class="stat-value">${typeof value === 'number' ? value.toLocaleString() : value}</div>
                    </div>
                `).join('')}
            </div>
        `;
        
        // 数据表格
        if (data.data && data.data.length > 0) {
            html += `
                <div class="report-table-wrapper">
                    <table class="report-table">
                        <thead>
                            <tr>
                                ${Object.keys(data.data[0]).map(key => `<th>${key}</th>`).join('')}
                            </tr>
                        </thead>
                        <tbody>
                            ${data.data.slice(0, 50).map(row => `
                                <tr>
                                    ${Object.values(row).map(val => `<td>${val || '-'}</td>`).join('')}
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                    ${data.data.length > 50 ? `<p>显示前50条，共${data.data.length}条</p>` : ''}
                </div>
            `;
        }
        
        html += `
            <div class="report-actions">
                <button onclick="window.exportReport()">导出CSV</button>
                <button onclick="window.printReport()">打印</button>
            </div>
        `;
        
        html += '</div>';
        container.innerHTML = html;
        
        // 保存当前报表数据
        window._currentReportData = data;
    }

    // 导出报表
    window.exportReport = function() {
        if (window._currentReportData?.data) {
            window.ReportService.exportToCSV(
                window._currentReportData.data,
                `report_${new Date().toISOString().slice(0, 10)}`
            );
        }
    };

    // 打印报表
    window.printReport = function() {
        const content = document.querySelector('.report-container');
        if (content) {
            const win = window.open('', '_blank');
            win.document.write(`
                <html><head><title>报表</title>
                <style>body { font-family: Arial; padding: 20px; } table { border-collapse: collapse; width: 100%; } th, td { border: 1px solid #ddd; padding: 8px; text-align: left; } th { background: #f5f5f5; }</style>
                </head><body>${content.innerHTML}</body></html>
            `);
            win.document.close();
            win.print();
        }
    };

    // 绑定事件
    function bindEvents() {
        document.querySelector('.btn-generate')?.addEventListener('click', () => {
            const type = document.querySelector('.report-type-select')?.value;
            if (type) window.generateReport(type);
        });
    }

    // 模块加载时初始化
    if (document.querySelector('[data-module="reports"]')) {
        window.initReports();
    }

})();