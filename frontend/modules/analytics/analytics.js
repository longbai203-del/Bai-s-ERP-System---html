/**
 * Analytics Module - 数据分析
 */

(function() {
    'use strict';

    let charts = {};

    window.initAnalytics = function() {
        console.log('📈 Analytics 模块加载完成');
        
        loadAnalytics();
        bindEvents();
    };

    // 加载分析数据
    async function loadAnalytics() {
        try {
            const data = await window.ReportService.getDashboardData({
                organization_id: window._currentOrg?.id
            });
            
            if (data) {
                renderAnalytics(data);
            }
        } catch (error) {
            console.error('加载分析数据失败:', error);
        }
    }

    // 渲染分析
    function renderAnalytics(data) {
        renderKPI(data);
        renderCharts(data);
        renderTrends(data);
    }

    // 渲染KPI
    function renderKPI(data) {
        const container = document.querySelector('.analytics-kpi');
        if (!container) return;
        
        const kpis = [
            { label: '总营收', value: formatCurrency(data.sales.revenue), change: '+12%' },
            { label: '订单数', value: data.sales.orders, change: '+8%' },
            { label: '客户数', value: data.customers.total, change: '+5%' },
            { label: '利润率', value: data.finance.profit > 0 ? (data.finance.profit / data.sales.revenue * 100).toFixed(1) + '%' : '0%', change: '+2%' }
        ];
        
        container.innerHTML = kpis.map(kpi => `
            <div class="kpi-card">
                <div class="kpi-label">${kpi.label}</div>
                <div class="kpi-value">${kpi.value}</div>
                <div class="kpi-change ${kpi.change.startsWith('+') ? 'positive' : 'negative'}">${kpi.change}</div>
            </div>
        `).join('');
    }

    // 渲染图表（使用Canvas）
    function renderCharts(data) {
        // 销售趋势图
        renderSalesChart(data.sales);
        
        // 分类占比图
        renderCategoryChart(data.inventory);
        
        // 财务走势图
        renderFinanceChart(data.finance);
    }

    // 销售图表
    function renderSalesChart(salesData) {
        const canvas = document.getElementById('salesChart');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;
        
        ctx.clearRect(0, 0, width, height);
        
        // 柱状图
        const data = salesData.byDate || {};
        const dates = Object.keys(data).slice(-7);
        const values = dates.map(d => data[d]);
        const maxValue = Math.max(...values, 1);
        
        const padding = 40;
        const chartWidth = width - padding * 2;
        const chartHeight = height - padding * 2;
        const barWidth = chartWidth / dates.length * 0.6;
        const gap = chartWidth / dates.length;
        
        // 绘制网格
        ctx.strokeStyle = '#e0e0e0';
        ctx.lineWidth = 0.5;
        for (let i = 0; i < 4; i++) {
            const y = padding + chartHeight - (i / 3) * chartHeight;
            ctx.beginPath();
            ctx.moveTo(padding, y);
            ctx.lineTo(width - padding, y);
            ctx.stroke();
            ctx.fillStyle = '#999';
            ctx.font = '10px Arial';
            ctx.textAlign = 'right';
            ctx.fillText(Math.round((i / 3) * maxValue), padding - 5, y + 3);
        }
        
        // 绘制柱状图
        dates.forEach((date, i) => {
            const x = padding + i * gap + (gap - barWidth) / 2;
            const height = (values[i] / maxValue) * chartHeight;
            const y = padding + chartHeight - height;
            
            const gradient = ctx.createLinearGradient(x, y, x, padding + chartHeight);
            gradient.addColorStop(0, '#4CAF50');
            gradient.addColorStop(1, '#81C784');
            
            ctx.fillStyle = gradient;
            ctx.fillRect(x, y, barWidth, height);
            
            // 显示值
            ctx.fillStyle = '#333';
            ctx.font = '10px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(values[i], x + barWidth / 2, y - 5);
            
            // 日期标签
            ctx.fillStyle = '#666';
            ctx.font = '9px Arial';
            ctx.fillText(date.slice(5), x + barWidth / 2, padding + chartHeight + 15);
        });
        
        // 标题
        ctx.fillStyle = '#333';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('近7日销售趋势', width / 2, 20);
    }

    // 分类图表（饼图）
    function renderCategoryChart(inventoryData) {
        const canvas = document.getElementById('categoryChart');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;
        const centerX = width / 2;
        const centerY = height / 2;
        const radius = Math.min(width, height) / 2 - 40;
        
        ctx.clearRect(0, 0, width, height);
        
        const data = inventoryData.byCategory || {};
        const categories = Object.keys(data);
        const total = Object.values(data).reduce((a, b) => a + b, 0);
        
        if (total === 0) {
            ctx.fillStyle = '#999';
            ctx.font = '14px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('暂无数据', centerX, centerY);
            return;
        }
        
        const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#C9CBCF'];
        
        let startAngle = -Math.PI / 2;
        categories.forEach((category, i) => {
            const value = data[category];
            const sliceAngle = (value / total) * 2 * Math.PI;
            
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle);
            ctx.closePath();
            ctx.fillStyle = colors[i % colors.length];
            ctx.fill();
            
            // 标签
            const midAngle = startAngle + sliceAngle / 2;
            const labelRadius = radius * 0.7;
            const labelX = centerX + Math.cos(midAngle) * labelRadius;
            const labelY = centerY + Math.sin(midAngle) * labelRadius;
            
            ctx.fillStyle = '#fff';
            ctx.font = '10px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            if (sliceAngle > 0.3) {
                ctx.fillText((value / total * 100).toFixed(1) + '%', labelX, labelY);
            }
            
            startAngle += sliceAngle;
        });
        
        // 图例
        let legendY = 10;
        categories.forEach((category, i) => {
            const legendX = width - 120;
            ctx.fillStyle = colors[i % colors.length];
            ctx.fillRect(legendX, legendY, 12, 12);
            ctx.fillStyle = '#333';
            ctx.font = '10px Arial';
            ctx.textAlign = 'left';
            ctx.fillText(category, legendX + 16, legendY + 10);
            legendY += 20;
        });
        
        // 标题
        ctx.fillStyle = '#333';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('库存分类占比', width / 2, 15);
    }

    // 财务图表
    function renderFinanceChart(financeData) {
        const canvas = document.getElementById('financeChart');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;
        
        ctx.clearRect(0, 0, width, height);
        
        const byMonth = financeData.byMonth || {};
        const months = Object.keys(byMonth).slice(-6);
        
        if (months.length === 0) {
            ctx.fillStyle = '#999';
            ctx.font = '14px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('暂无数据', width / 2, height / 2);
            return;
        }
        
        const padding = 40;
        const chartWidth = width - padding * 2;
        const chartHeight = height - padding * 2;
        const gap = chartWidth / months.length;
        
        // 找最大值
        let maxValue = 0;
        months.forEach(m => {
            const data = byMonth[m];
            maxValue = Math.max(maxValue, data.income || 0, data.expense || 0);
        });
        maxValue = maxValue * 1.2 || 1;
        
        // 绘制网格
        ctx.strokeStyle = '#e0e0e0';
        ctx.lineWidth = 0.5;
        for (let i = 0; i < 4; i++) {
            const y = padding + chartHeight - (i / 3) * chartHeight;
            ctx.beginPath();
            ctx.moveTo(padding, y);
            ctx.lineTo(width - padding, y);
            ctx.stroke();
        }
        
        // 绘制收入线
        ctx.strokeStyle = '#4CAF50';
        ctx.lineWidth = 2;
        ctx.beginPath();
        months.forEach((m, i) => {
            const x = padding + i * gap + gap / 2;
            const value = (byMonth[m].income || 0);
            const y = padding + chartHeight - (value / maxValue) * chartHeight;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        });
        ctx.stroke();
        
        // 绘制支出线
        ctx.strokeStyle = '#FF5722';
        ctx.lineWidth = 2;
        ctx.beginPath();
        months.forEach((m, i) => {
            const x = padding + i * gap + gap / 2;
            const value = (byMonth[m].expense || 0);
            const y = padding + chartHeight - (value / maxValue) * chartHeight;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        });
        ctx.stroke();
        
        // 图例
        ctx.fillStyle = '#4CAF50';
        ctx.fillRect(width - 150, 15, 15, 15);
        ctx.fillStyle = '#333';
        ctx.font = '10px Arial';
        ctx.textAlign = 'left';
        ctx.fillText('收入', width - 130, 27);
        
        ctx.fillStyle = '#FF5722';
        ctx.fillRect(width - 150, 35, 15, 15);
        ctx.fillStyle = '#333';
        ctx.fillText('支出', width - 130, 47);
        
        // 标题
        ctx.fillStyle = '#333';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('财务走势', width / 2, 15);
    }

    // 渲染趋势
    function renderTrends(data) {
        const container = document.querySelector('.analytics-trends');
        if (!container) return;
        
        const trends = [
            { label: '月增长率', value: '+15.3%', description: '环比上月' },
            { label: '客户留存率', value: '78%', description: '同比提升5%' },
            { label: '客单价', value: formatCurrency(data.sales.averageOrder || 0), description: '增长+8%' }
        ];
        
        container.innerHTML = trends.map(trend => `
            <div class="trend-item">
                <div class="trend-label">${trend.label}</div>
                <div class="trend-value">${trend.value}</div>
                <div class="trend-desc">${trend.description}</div>
            </div>
        `).join('');
    }

    // 格式化货币
    function formatCurrency(amount) {
        const locale = window.I18n?.getLocale() || 'zh-CN';
        return new Intl.NumberFormat(locale, {
            style: 'currency',
            currency: 'SAR',
            maximumFractionDigits: 0
        }).format(amount || 0);
    }

    // 绑定事件
    function bindEvents() {
        document.querySelector('.btn-refresh')?.addEventListener('click', loadAnalytics);
        
        // 日期范围切换
        document.querySelectorAll('.time-range').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.time-range').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                loadAnalytics();
            });
        });
    }

    // 模块加载时初始化
    if (document.querySelector('[data-module="analytics"]')) {
        window.initAnalytics();
    }

})();