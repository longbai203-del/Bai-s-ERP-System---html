/**
 * Dashboard Module
 */

(function() {
    'use strict';

    window.initDashboard = async function() {
        console.log('📊 Dashboard 模块加载完成');
        await loadDashboardData();
        bindEvents();
    };

    async function loadDashboardData() {
        try {
            var data = await window.ReportService.getDashboardData();
            if (data) {
                updateStats(data);
                updateCharts(data);
            }
        } catch (error) {
            console.error('加载仪表板数据失败:', error);
        }
    }

    function updateStats(data) {
        var el = document.querySelector('.stat-revenue');
        if (el) { el.textContent = formatCurrency(data.sales.revenue); }
        
        var el2 = document.querySelector('.stat-orders');
        if (el2) { el2.textContent = data.sales.orders; }
        
        var el3 = document.querySelector('.stat-customers');
        if (el3) { el3.textContent = data.customers.total; }
        
        var el4 = document.querySelector('.stat-profit');
        if (el4) { el4.textContent = formatCurrency(data.finance.profit); }
    }

    function updateCharts(data) {
        console.log('更新图表:', data);
    }

    function formatCurrency(amount) {
        var locale = window.I18n?.getLocale() || 'zh-CN';
        return new Intl.NumberFormat(locale, {
            style: 'currency',
            currency: 'SAR'
        }).format(amount || 0);
    }

    function bindEvents() {
        var refreshBtn = document.querySelector('.btn-refresh');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', loadDashboardData);
        }
        var dateFilter = document.querySelector('.date-filter');
        if (dateFilter) {
            dateFilter.addEventListener('change', loadDashboardData);
        }
    }

    if (document.querySelector('[data-module="dashboard"]')) {
        window.initDashboard();
    }

})();
