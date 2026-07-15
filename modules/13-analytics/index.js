/**
 * @file analytics/index.js
 * @description 数据分析模块
 * @module modules/analytics
 */

import { apiClient } from '@services/api-client.js';
import { formatCurrency } from '@utils/helpers.js';
import { datatable } from '@components/datatable.js';


export const meta = {
    name: '数据分析',
    path: '/analytics',
    icon: 'fa-chart-bar',
    permission: 'analytics:view',
    enabled: true,
    order: 120
};

const subModules = [
    { id: 'reports', label: '报表中心', icon: 'fa-file-alt' },
    { id: 'custom-reports', label: '自定义报表', icon: 'fa-pen' },
    { id: 'visualizations', label: '数据可视化', icon: 'fa-chart-pie' },
    { id: 'forecast', label: '预测分析', icon: 'fa-chart-line' },
    { id: 'recommendations', label: '智能推荐', icon: 'fa-lightbulb' },
    { id: 'business-health', label: '经营健康度', icon: 'fa-heartbeat' }
];

let state = { activeSub: 'reports' };

export async function render(container, params = {}) {
    const sub = params.sub || 'reports';
    state.activeSub = sub;

    

    container.innerHTML = `
        <div class="analytics-container">
            <div class="page-header">
                <h1>📊 数据分析</h1>
                <div class="page-actions">
                    <button class="btn btn-outline" id="analyticsExport">
                        <i class="fas fa-download"></i> 导出报表
                    </button>
                </div>
            </div>

            <div class="sub-module-nav" style="display:flex;gap:4px;margin-bottom:20px;background:white;padding:8px;border-radius:12px;border:1px solid #E5E7EB;flex-wrap:wrap;">
                ${subModules.map(sm => `
                    <button class="sub-module-btn ${sm.id === sub ? 'active' : ''}" 
                            data-sub="${sm.id}"
                            style="padding:6px 12px;border:none;border-radius:8px;cursor:pointer;background:${sm.id === sub ? '#4F46E5' : 'transparent'};color:${sm.id === sub ? 'white' : '#6B7280'};font-weight:${sm.id === sub ? '600' : '400'};font-size:12px;">
                        <i class="fas ${sm.icon}"></i> ${sm.label}
                    </button>
                `).join('')}
            </div>

            <div id="analyticsContent">
                <div style="text-align:center;padding:40px;color:#9CA3AF;">
                    <div class="spinner" style="margin:0 auto;"></div>
                    <p style="margin-top:12px;">加载中...</p>
                </div>
            </div>
        </div>
    `;

    await loadSubModule(sub);
    bindEvents(container);
}

async function loadSubModule(sub) {
    const container = document.getElementById('analyticsContent');
    state.activeSub = sub;

    // 报表中心
    if (sub === 'reports') {
        const result = await apiClient.get('/analytics/reports');
        const stats = result.success ? result.data || {} : {};

        container.innerHTML = `
            <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:20px;">
                <div class="stat-card">
                    <div class="stat-label">总销售额</div>
                    <div class="stat-value" style="font-size:24px;">¥${formatCurrency(stats.totalRevenue || 0)}</div>
                </div>
                <div class="stat-card">
                    <div class="stat-label">总订单数</div>
                    <div class="stat-value" style="font-size:24px;">${stats.totalOrders || 0}</div>
                </div>
                <div class="stat-card">
                    <div class="stat-label">客单价</div>
                    <div class="stat-value" style="font-size:24px;">¥${formatCurrency(stats.averageOrder || 0)}</div>
                </div>
                <div class="stat-card">
                    <div class="stat-label">转化率</div>
                    <div class="stat-value" style="font-size:24px;">${stats.conversionRate || 0}%</div>
                </div>
            </div>
            <div class="card">
                <div class="card-header">
                    <span class="card-title">📋 报表列表</span>
                </div>
                <div class="card-body" id="reportsTable">
                    <div style="text-align:center;padding:20px;"><div class="spinner" style="margin:0 auto;"></div></div>
                </div>
            </div>
        `;

        const reportsResult = await apiClient.get('/analytics/reports/list');
        const reports = reportsResult.success ? reportsResult.data || [] : [];

        const columns = [
            { key: 'name', label: '报表名称' },
            { key: 'type', label: '类型' },
            { key: 'period', label: '周期' },
            { key: 'generatedAt', label: '生成时间', type: 'datetime' }
        ];

        const tableContainer = document.getElementById('reportsTable');
        datatable.render(tableContainer, { columns, data: reports, rowKey: 'id', emptyText: '暂无报表' });
        return;
    }

    // 其他子模块
    if (sub === 'business-health') {
        const result = await apiClient.get('/analytics/business-health');
        const data = result.success ? result.data || {} : {};

        container.innerHTML = `
            <div class="card">
                <div class="card-header">
                    <span class="card-title">❤️ 经营健康度</span>
                    <span style="font-size:24px;font-weight:700;color:${data.score >= 80 ? '#10B981' : data.score >= 60 ? '#F59E0B' : '#EF4444'};">${data.score || 0}分</span>
                </div>
                <div class="card-body">
                    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:16px;">
                        ${[
                            { label: '营收健康', value: data.revenueHealth || 0, color: '#3B82F6' },
                            { label: '客户健康', value: data.customerHealth || 0, color: '#10B981' },
                            { label: '运营健康', value: data.operationHealth || 0, color: '#8B5CF6' }
                        ].map(item => `
                            <div style="text-align:center;padding:20px;background:#F9FAFB;border-radius:8px;">
                                <div style="font-size:32px;font-weight:700;color:${item.color};">${item.value}%</div>
                                <div style="font-size:14px;color:#6B7280;">${item.label}</div>
                            </div>
                        `).join('')}
                    </div>
                    <div style="margin-top:20px;padding-top:16px;border-top:1px solid #E5E7EB;">
                        <div style="font-size:14px;color:#6B7280;">${data.message || '经营状况良好，继续保持！'}</div>
                    </div>
                </div>
            </div>
        `;
        return;
    }

    // 可视化
    if (sub === 'visualizations') {
        container.innerHTML = `
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;">
                ${['销售额趋势', '订单分布', '客户增长', '商品排行'].map(title => `
                    <div class="card">
                        <div class="card-header">
                            <span class="card-title">${title}</span>
                        </div>
                        <div class="card-body" style="height:200px;display:flex;align-items:center;justify-content:center;color:#9CA3AF;">
                            <div style="text-align:center;">
                                <i class="fas fa-chart-bar" style="font-size:32px;opacity:0.3;"></i>
                                <p style="margin-top:8px;">图表区域</p>
                                <p style="font-size:12px;">(集成 ECharts 后展示)</p>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
        return;
    }

    // 其他子模块
    const endpoints = {
        'custom-reports': '/analytics/custom-reports',
        forecast: '/analytics/forecast',
        recommendations: '/analytics/recommendations'
    };

    container.innerHTML = `
        <div class="card">
            <div class="card-header">
                <span class="card-title">${subModules.find(s => s.id === sub)?.label || ''}</span>
            </div>
            <div class="card-body" id="analyticsTable">
                <div style="text-align:center;padding:40px;color:#9CA3AF;">
                    <i class="fas fa-cog" style="font-size:32px;opacity:0.3;"></i>
                    <p style="margin-top:8px;">${subModules.find(s => s.id === sub)?.label || ''} 开发中</p>
                </div>
            </div>
        </div>
    `;
}

function bindEvents(container) {
    container.querySelectorAll('.sub-module-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const sub = btn.dataset.sub;
            if (sub !== state.activeSub) {
                container.querySelectorAll('.sub-module-btn').forEach(b => {
                    b.classList.remove('active');
                    b.style.background = 'transparent';
                    b.style.color = '#6B7280';
                    b.style.fontWeight = '400';
                });
                btn.classList.add('active');
                btn.style.background = '#4F46E5';
                btn.style.color = 'white';
                btn.style.fontWeight = '600';
                
                loadSubModule(sub);
            }
        });
    });

    document.getElementById('analyticsExport')?.addEventListener('click', () => {
        modal.alert('导出', '报表导出功能开发中...', '知道了');
    });
}

export async function init() {
    console.log('✅ [Analytics] 模块已初始化');
}

export default { meta, render, init };