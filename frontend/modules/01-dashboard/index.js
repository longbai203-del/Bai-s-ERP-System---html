/**
 * @file dashboard/index.js
 * @description 仪表盘模块
 * @module modules/dashboard
 */

import { dashboardService } from '@services/dashboard.service.js';
import { formatCurrency, formatDate } from '@utils/helpers.js';
import { navbar } from '@components/navbar.js';

/**
 * 模块元信息
 */
export const meta = {
    name: '仪表盘',
    path: '/dashboard',
    icon: 'fa-chart-line',
    permission: 'dashboard:view',
    enabled: true,
    order: 0
};

/**
 * 模块状态
 */
let state = {
    stats: null,
    chartData: null,
    activities: null,
    loading: true
};

/**
 * 渲染仪表盘
 * @param {HTMLElement} container - 容器元素
 * @param {Object} params - 渲染参数
 */
export async function render(container, params = {}) {
    state.loading = true;
    
    // 更新导航栏
    navbar.updateBreadcrumb('仪表盘');

    // 显示加载状态
    container.innerHTML = `
        <div class="dashboard-container">
            <div class="page-header">
                <h1>📊 仪表盘</h1>
                <div class="page-actions">
                    <button class="btn btn-outline btn-sm" id="refreshDashboard">
                        <i class="fas fa-sync"></i> 刷新
                    </button>
                    <button class="btn btn-outline btn-sm" id="exportDashboard">
                        <i class="fas fa-download"></i> 导出
                    </button>
                </div>
            </div>

            <!-- 统计卡片 -->
            <div class="stats-grid" id="statsGrid">
                ${[1, 2, 3, 4, 5, 6].map(() => `
                    <div class="stat-card stat-loading">
                        <div class="stat-icon" style="background:#E5E7EB;"></div>
                        <div class="stat-value" style="height:32px;background:#E5E7EB;border-radius:4px;margin-top:8px;"></div>
                        <div class="stat-label" style="height:16px;background:#E5E7EB;border-radius:4px;margin-top:4px;width:60%;"></div>
                    </div>
                `).join('')}
            </div>

            <!-- 图表 -->
            <div class="chart-container">
                <div class="card">
                    <div class="card-header">
                        <span class="card-title">📈 销售趋势</span>
                        <select id="chartPeriod" class="form-control" style="width:120px;padding:4px 8px;">
                            <option value="week">本周</option>
                            <option value="month" selected>本月</option>
                            <option value="quarter">本季度</option>
                            <option value="year">本年</option>
                        </select>
                    </div>
                    <div class="card-body" id="chartContainer">
                        <div style="text-align:center;padding:40px;color:#9CA3AF;">
                            <div class="spinner" style="margin:0 auto;"></div>
                            <p style="margin-top:12px;">加载图表数据...</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 最近活动 -->
            <div class="activities-container" style="margin-top:24px;">
                <div class="card">
                    <div class="card-header">
                        <span class="card-title">🕐 最近活动</span>
                    </div>
                    <div class="card-body" id="activitiesList">
                        <div style="text-align:center;padding:20px;color:#9CA3AF;">
                            <div class="spinner" style="margin:0 auto;"></div>
                            <p style="margin-top:12px;">加载活动...</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    // 加载数据
    await loadData();

    // 绑定事件
    bindEvents(container);

    state.loading = false;
}

/**
 * 加载数据
 */
async function loadData() {
    try {
        // 加载统计数据
        const statsResult = await dashboardService.getStats();
        if (statsResult.success) {
            state.stats = statsResult.data;
            renderStats();
        }

        // 加载图表数据
        const chartResult = await dashboardService.getChartData({ type: 'revenue', period: 'month' });
        if (chartResult.success) {
            state.chartData = chartResult.data;
            renderChart();
        }

        // 加载最近活动
        const activitiesResult = await dashboardService.getRecentActivities(10);
        if (activitiesResult.success) {
            state.activities = activitiesResult.data;
            renderActivities();
        }

    } catch (error) {
        console.error('[Dashboard] 加载数据失败:', error);
    }
}

/**
 * 渲染统计卡片
 */
function renderStats() {
    const container = document.getElementById('statsGrid');
    if (!container || !state.stats) return;

    const stats = state.stats;
    const items = [
        { label: '今日收入', value: `¥${formatCurrency(stats.todayRevenue)}`, icon: 'fa-yen-sign', color: '#10B981' },
        { label: '今日订单', value: stats.todayOrders || 0, icon: 'fa-shopping-cart', color: '#3B82F6' },
        { label: '活跃客户', value: stats.activeCustomers || 0, icon: 'fa-users', color: '#8B5CF6' },
        { label: '商品总数', value: stats.totalProducts || 0, icon: 'fa-box', color: '#F59E0B' },
        { label: '低库存预警', value: stats.lowStockProducts || 0, icon: 'fa-exclamation-triangle', color: '#EF4444' },
        { label: '转化率', value: `${stats.conversionRate || 0}%`, icon: 'fa-percent', color: '#06B6D4' }
    ];

    container.innerHTML = items.map(item => `
        <div class="stat-card">
            <div class="stat-icon" style="background:${item.color}20;color:${item.color};">
                <i class="fas ${item.icon}"></i>
            </div>
            <div class="stat-value">${item.value}</div>
            <div class="stat-label">${item.label}</div>
        </div>
    `).join('');
}

/**
 * 渲染图表（简化版）
 */
function renderChart() {
    const container = document.getElementById('chartContainer');
    if (!container || !state.chartData) return;

    const { labels, data } = state.chartData;
    const maxValue = Math.max(...data) * 1.2 || 100;

    container.innerHTML = `
        <div style="padding:10px 0;">
            <div style="display:flex;gap:12px;align-items:flex-end;height:200px;padding-bottom:24px;border-bottom:2px solid #E5E7EB;">
                ${data.map((value, index) => {
                    const height = (value / maxValue) * 180;
                    const color = value > 5000 ? '#4F46E5' : value > 3000 ? '#818CF8' : '#C7D2FE';
                    return `
                        <div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:4px;">
                            <div style="font-size:12px;color:#6B7280;">${formatCurrency(value)}</div>
                            <div style="width:100%;height:${Math.max(height, 4)}px;background:${color};border-radius:4px 4px 0 0;transition:height 0.5s ease;min-height:4px;"></div>
                            <div style="font-size:11px;color:#9CA3AF;">${labels[index] || ''}</div>
                        </div>
                    `;
                }).join('')}
            </div>
        </div>
    `;
}

/**
 * 渲染最近活动
 */
function renderActivities() {
    const container = document.getElementById('activitiesList');
    if (!container) return;

    if (!state.activities || state.activities.length === 0) {
        container.innerHTML = `
            <div style="text-align:center;padding:20px;color:#9CA3AF;">
                <i class="fas fa-inbox" style="font-size:24px;"></i>
                <p style="margin-top:8px;">暂无活动</p>
            </div>
        `;
        return;
    }

    container.innerHTML = `
        <div style="display:flex;flex-direction:column;gap:8px;">
            ${state.activities.map(activity => `
                <div style="display:flex;align-items:center;gap:12px;padding:8px 12px;border-radius:8px;background:#F9FAFB;border-left:3px solid ${activity.type === 'order' ? '#3B82F6' : activity.type === 'customer' ? '#10B981' : '#F59E0B'};">
                    <div style="flex:1;">
                        <div style="font-size:14px;color:#1F2937;">${activity.message}</div>
                        <div style="font-size:12px;color:#9CA3AF;">${activity.time || '刚刚'}</div>
                    </div>
                    ${activity.type === 'order' ? '<span style="font-size:12px;color:#3B82F6;font-weight:500;">订单</span>' : ''}
                    ${activity.type === 'customer' ? '<span style="font-size:12px;color:#10B981;font-weight:500;">客户</span>' : ''}
                    ${activity.type === 'product' ? '<span style="font-size:12px;color:#F59E0B;font-weight:500;">商品</span>' : ''}
                </div>
            `).join('')}
        </div>
    `;
}

/**
 * 绑定事件
 */
function bindEvents(container) {
    // 刷新按钮
    const refreshBtn = container.querySelector('#refreshDashboard');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', async () => {
            await loadData();
        });
    }

    // 导出按钮
    const exportBtn = container.querySelector('#exportDashboard');
    if (exportBtn) {
        exportBtn.addEventListener('click', () => {
            alert('导出功能开发中...');
        });
    }

    // 图表周期切换
    const periodSelect = container.querySelector('#chartPeriod');
    if (periodSelect) {
        periodSelect.addEventListener('change', async () => {
            const period = periodSelect.value;
            const result = await dashboardService.getChartData({ type: 'revenue', period });
            if (result.success) {
                state.chartData = result.data;
                renderChart();
            }
        });
    }
}

/**
 * 模块初始化钩子
 */
export async function init() {
    console.log('✅ [Dashboard] 模块已初始化');
}

export default { meta, render, init };