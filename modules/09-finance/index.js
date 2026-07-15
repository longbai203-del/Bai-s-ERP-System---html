/**
 * @file finance/index.js
 * @description 财务管理模块
 * @module modules/finance
 */

import { apiClient } from '@services/api-client.js';
import { formatCurrency } from '@utils/helpers.js';
import { datatable } from '@components/datatable.js';
import { modal } from '@components/modal.js';


export const meta = {
    name: '财务管理',
    path: '/finance',
    icon: 'fa-coins',
    permission: 'finance:view',
    enabled: true,
    order: 80
};

const subModules = [
    { id: 'income', label: '收入管理', icon: 'fa-arrow-up' },
    { id: 'expenses', label: '支出管理', icon: 'fa-arrow-down' },
    { id: 'invoices', label: '发票管理', icon: 'fa-file-invoice' },
    { id: 'payments', label: '付款管理', icon: 'fa-credit-card' },
    { id: 'profit-loss', label: '损益分析', icon: 'fa-chart-line' },
    { id: 'balance-sheet', label: '资产负债表', icon: 'fa-balance-scale' },
    { id: 'cash-flow', label: '现金流', icon: 'fa-money-bill-wave' },
    { id: 'taxes', label: '税务管理', icon: 'fa-receipt' },
    { id: 'journal', label: '日记账', icon: 'fa-book' },
    { id: 'settlements', label: '结算管理', icon: 'fa-hand-holding-usd' }
];

let state = { activeSub: 'income' };

export async function render(container, params = {}) {
    const sub = params.sub || 'income';
    state.activeSub = sub;

    

    container.innerHTML = `
        <div class="finance-container">
            <div class="page-header">
                <h1>💰 财务管理</h1>
                <div class="page-actions">
                    <button class="btn btn-primary" id="financeAction">
                        <i class="fas fa-plus"></i> 新建记录
                    </button>
                    <button class="btn btn-outline" id="financeExport">
                        <i class="fas fa-download"></i> 导出报表
                    </button>
                </div>
            </div>

            <!-- 统计概览 -->
            <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:20px;" id="financeStats">
                ${['总收入', '总支出', '净利润', '待处理'].map(label => `
                    <div class="stat-card">
                        <div class="stat-label">${label}</div>
                        <div class="stat-value" style="font-size:20px;">¥0.00</div>
                    </div>
                `).join('')}
            </div>

            <div class="sub-module-nav" style="display:flex;gap:4px;margin-bottom:20px;background:white;padding:8px;border-radius:12px;border:1px solid #E5E7EB;flex-wrap:wrap;">
                ${subModules.map(sm => `
                    <button class="sub-module-btn ${sm.id === sub ? 'active' : ''}" 
                            data-sub="${sm.id}"
                            style="padding:6px 14px;border:none;border-radius:8px;cursor:pointer;background:${sm.id === sub ? '#4F46E5' : 'transparent'};color:${sm.id === sub ? 'white' : '#6B7280'};font-weight:${sm.id === sub ? '600' : '400'};font-size:13px;">
                        <i class="fas ${sm.icon}"></i> ${sm.label}
                    </button>
                `).join('')}
            </div>

            <div id="financeContent">
                <div style="text-align:center;padding:40px;color:#9CA3AF;">
                    <div class="spinner" style="margin:0 auto;"></div>
                    <p style="margin-top:12px;">加载中...</p>
                </div>
            </div>
        </div>
    `;

    await loadStats();
    await loadSubModule(sub);
    bindEvents(container);
}

async function loadStats() {
    const result = await apiClient.get('/finance/stats');
    if (result.success) {
        const stats = result.data || {};
        const containers = document.querySelectorAll('#financeStats .stat-value');
        if (containers.length >= 4) {
            containers[0].textContent = `¥${formatCurrency(stats.totalIncome || 0)}`;
            containers[1].textContent = `¥${formatCurrency(stats.totalExpenses || 0)}`;
            containers[2].textContent = `¥${formatCurrency((stats.totalIncome || 0) - (stats.totalExpenses || 0))}`;
            containers[3].textContent = stats.pendingCount || 0;
        }
    }
}

async function loadSubModule(sub) {
    const container = document.getElementById('financeContent');
    state.activeSub = sub;

    const endpoints = {
        income: '/finance/income',
        expenses: '/finance/expenses',
        invoices: '/finance/invoices',
        payments: '/finance/payments',
        'profit-loss': '/finance/profit-loss',
        'balance-sheet': '/finance/balance-sheet',
        'cash-flow': '/finance/cash-flow',
        taxes: '/finance/taxes',
        journal: '/finance/journal',
        settlements: '/finance/settlements'
    };

    const columnsMap = {
        income: [
            { key: 'date', label: '日期', type: 'date' },
            { key: 'category', label: '收入类别' },
            { key: 'description', label: '说明' },
            { key: 'amount', label: '金额', render: v => `+¥${formatCurrency(v)}` },
            { key: 'status', label: '状态', type: 'status' }
        ],
        expenses: [
            { key: 'date', label: '日期', type: 'date' },
            { key: 'category', label: '支出类别' },
            { key: 'description', label: '说明' },
            { key: 'amount', label: '金额', render: v => `-¥${formatCurrency(v)}` },
            { key: 'status', label: '状态', type: 'status' }
        ],
        invoices: [
            { key: 'invoiceNo', label: '发票号' },
            { key: 'customer', label: '客户' },
            { key: 'amount', label: '金额', render: v => `¥${formatCurrency(v)}` },
            { key: 'status', label: '状态', type: 'status' },
            { key: 'createdAt', label: '创建时间', type: 'datetime' }
        ],
        payments: [
            { key: 'paymentNo', label: '付款号' },
            { key: 'method', label: '付款方式' },
            { key: 'amount', label: '金额', render: v => `¥${formatCurrency(v)}` },
            { key: 'status', label: '状态', type: 'status' },
            { key: 'createdAt', label: '时间', type: 'datetime' }
        ]
    };

    container.innerHTML = `
        <div class="card">
            <div class="card-header">
                <span class="card-title">${subModules.find(s => s.id === sub)?.label || ''}</span>
                <div style="display:flex;gap:8px;">
                    <input type="text" class="form-control" id="financeSearch" placeholder="搜索..." style="width:160px;padding:4px 12px;">
                    <button class="btn btn-sm btn-primary" id="financeSearchBtn"><i class="fas fa-search"></i></button>
                </div>
            </div>
            <div class="card-body" id="financeTable">
                <div style="text-align:center;padding:20px;"><div class="spinner" style="margin:0 auto;"></div></div>
            </div>
        </div>
    `;

    const result = await apiClient.get(endpoints[sub] || `/finance/${sub}`);
    const data = result.success ? result.data || [] : [];

    const tableContainer = document.getElementById('financeTable');
    const columns = columnsMap[sub] || [{ key: 'id', label: 'ID' }];
    
    // 特殊处理：损益分析显示图表
    if (sub === 'profit-loss') {
        const totalIncome = data.reduce((sum, d) => sum + (d.income || 0), 0);
        const totalExpense = data.reduce((sum, d) => sum + (d.expense || 0), 0);
        tableContainer.innerHTML = `
            <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px;margin-bottom:20px;">
                <div style="text-align:center;padding:16px;background:#F0FDF4;border-radius:8px;">
                    <div style="font-size:12px;color:#6B7280;">总收入</div>
                    <div style="font-size:24px;font-weight:700;color:#10B981;">+¥${formatCurrency(totalIncome)}</div>
                </div>
                <div style="text-align:center;padding:16px;background:#FEF2F2;border-radius:8px;">
                    <div style="font-size:12px;color:#6B7280;">总支出</div>
                    <div style="font-size:24px;font-weight:700;color:#EF4444;">-¥${formatCurrency(totalExpense)}</div>
                </div>
                <div style="text-align:center;padding:16px;background:${totalIncome - totalExpense >= 0 ? '#E0F2FE' : '#FEF2F2'};border-radius:8px;">
                    <div style="font-size:12px;color:#6B7280;">净利润</div>
                    <div style="font-size:24px;font-weight:700;color:${totalIncome - totalExpense >= 0 ? '#3B82F6' : '#EF4444'};">¥${formatCurrency(totalIncome - totalExpense)}</div>
                </div>
            </div>
            <div style="border-top:1px solid #E5E7EB;padding-top:16px;">
                <div style="font-weight:500;margin-bottom:8px;">明细数据</div>
                ${data.map(d => `
                    <div style="display:flex;justify-content:space-between;padding:4px 0;border-bottom:1px solid #F3F4F6;font-size:14px;">
                        <span>${d.category || d.date}</span>
                        <span>+¥${formatCurrency(d.income || 0)} / -¥${formatCurrency(d.expense || 0)}</span>
                    </div>
                `).join('')}
            </div>
        `;
        return;
    }

    datatable.render(tableContainer, { columns, data, rowKey: 'id', emptyText: `暂无${subModules.find(s => s.id === sub)?.label || ''}数据` });
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

    document.getElementById('financeAction')?.addEventListener('click', () => {
        modal.alert('新建', `正在创建 ${state.activeSub} 功能...`, '知道了');
    });

    document.getElementById('financeExport')?.addEventListener('click', () => {
        modal.alert('导出', '报表导出功能开发中...', '知道了');
    });

    document.getElementById('financeSearchBtn')?.addEventListener('click', () => {
        const keyword = document.getElementById('financeSearch').value.trim();
        if (keyword) {
            modal.alert('搜索', `搜索关键词: ${keyword}`, '知道了');
        }
    });
}

export async function init() {
    console.log('✅ [Finance] 模块已初始化');
}

export default { meta, render, init };