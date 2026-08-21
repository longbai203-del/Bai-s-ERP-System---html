/**
 * Dashboard Module
 */

(function() {
    'use strict';

    window.initDashboard = async function() {
        console.log('📊 Dashboard 模块加载完成');
        
        // 加载仪表板数据
        await loadDashboardData();
        
        // 绑定事件
        bindEvents();
    };

    // 加载仪表板数据
    async function loadDashboardData() {
        try {
            const data = await window.ReportService.getDashboardData();
            if (data) {
                updateStats(data);
                updateCharts(data);
            }
        } catch (error) {
            console.error('加载仪表板数据失败:', error);
        }
    }

    // 更新统计卡片
    function updateStats(data) {
        const el = document.querySelector($2); if (el) { el.textContent = formatCurrency(data.sales.revenue); }
        const el = document.querySelector($2); if (el) { el.textContent = data.sales.orders; }
        const el = document.querySelector($2); if (el) { el.textContent = data.customers.total; }
        const el = document.querySelector($2); if (el) { el.textContent = formatCurrency(data.finance.profit); }
    }

    // 更新图表
    function updateCharts(data) {
        // 这里集成Chart.js等图表库
        console.log('更新图表:', data);
    }

    // 格式化货币
    function formatCurrency(amount) {
        const locale = window.I18n?.getLocale() || 'zh-CN';
        return new Intl.NumberFormat(locale, {
            style: 'currency',
            currency: 'SAR'
        }).format(amount);
    }

    // 绑定事件
    function bindEvents() {
        // 刷新按钮
        document.querySelector('.btn-refresh')?.addEventListener('click', loadDashboardData);
        
        // 日期筛选
        document.querySelector('.date-filter')?.addEventListener('change', loadDashboardData);
    }

    // 如果页面加载时模块已存在，立即初始化
    if (document.querySelector('[data-module="dashboard"]')) {
        window.initDashboard();
    }

})();


