/**
 * @file purchase/index.js
 * @description 采购管理模块
 * @module modules/purchase
 */

import { apiClient } from '@services/api-client.js';
import { formatCurrency, formatDate } from '@utils/helpers.js';
import { datatable } from '@components/datatable.js';
import { modal } from '@components/modal.js';


export const meta = {
    name: '采购管理',
    path: '/purchase',
    icon: 'fa-truck',
    permission: 'purchase:view',
    enabled: true,
    order: 70
};

const subModules = [
    { id: 'orders', label: '采购订单', icon: 'fa-file-invoice' },
    { id: 'suppliers', label: '供应商管理', icon: 'fa-handshake' },
    { id: 'receiving', label: '采购入库', icon: 'fa-arrow-down' },
    { id: 'returns', label: '采购退货', icon: 'fa-undo' },
    { id: 'quotations', label: '询价管理', icon: 'fa-file-alt' },
    { id: 'payments', label: '采购付款', icon: 'fa-credit-card' }
];

let state = { activeSub: 'orders' };

export async function render(container, params = {}) {
    const sub = params.sub || 'orders';
    state.activeSub = sub;

    

    container.innerHTML = `
        <div class="purchase-container">
            <div class="page-header">
                <h1>🚚 采购管理</h1>
                <div class="page-actions">
                    <button class="btn btn-primary" id="purchaseAction">
                        <i class="fas fa-plus"></i> 新建采购订单
                    </button>
                </div>
            </div>

            <div class="sub-module-nav" style="display:flex;gap:4px;margin-bottom:20px;background:white;padding:8px;border-radius:12px;border:1px solid #E5E7EB;flex-wrap:wrap;">
                ${subModules.map(sm => `
                    <button class="sub-module-btn ${sm.id === sub ? 'active' : ''}" 
                            data-sub="${sm.id}"
                            style="padding:8px 16px;border:none;border-radius:8px;cursor:pointer;background:${sm.id === sub ? '#4F46E5' : 'transparent'};color:${sm.id === sub ? 'white' : '#6B7280'};font-weight:${sm.id === sub ? '600' : '400'};">
                        <i class="fas ${sm.icon}"></i> ${sm.label}
                    </button>
                `).join('')}
            </div>

            <div id="purchaseContent">
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
    const container = document.getElementById('purchaseContent');
    state.activeSub = sub;

    const endpoints = {
        orders: '/purchase/orders',
        suppliers: '/purchase/suppliers',
        receiving: '/purchase/receiving',
        returns: '/purchase/returns',
        quotations: '/purchase/quotations',
        payments: '/purchase/payments'
    };

    const columnsMap = {
        orders: [
            { key: 'orderNo', label: '订单号' },
            { key: 'supplier', label: '供应商' },
            { key: 'totalAmount', label: '总金额', render: v => `¥${formatCurrency(v)}` },
            { key: 'status', label: '状态', type: 'status' },
            { key: 'createdAt', label: '创建时间', type: 'datetime' }
        ],
        suppliers: [
            { key: 'name', label: '供应商名称' },
            { key: 'contact', label: '联系人' },
            { key: 'phone', label: '电话' },
            { key: 'email', label: '邮箱' },
            { key: 'status', label: '状态', type: 'status' }
        ],
        receiving: [
            { key: 'receiptNo', label: '入库单号' },
            { key: 'orderNo', label: '关联订单' },
            { key: 'productName', label: '商品' },
            { key: 'quantity', label: '数量' },
            { key: 'status', label: '状态', type: 'status' },
            { key: 'createdAt', label: '时间', type: 'datetime' }
        ],
        returns: [
            { key: 'returnNo', label: '退货单号' },
            { key: 'orderNo', label: '关联订单' },
            { key: 'productName', label: '商品' },
            { key: 'quantity', label: '数量' },
            { key: 'reason', label: '原因' },
            { key: 'status', label: '状态', type: 'status' },
            { key: 'createdAt', label: '时间', type: 'datetime' }
        ],
        quotations: [
            { key: 'quoteNo', label: '询价编号' },
            { key: 'supplier', label: '供应商' },
            { key: 'productName', label: '商品' },
            { key: 'price', label: '报价', render: v => `¥${formatCurrency(v)}` },
            { key: 'status', label: '状态', type: 'status' },
            { key: 'createdAt', label: '时间', type: 'datetime' }
        ],
        payments: [
            { key: 'paymentNo', label: '付款单号' },
            { key: 'orderNo', label: '关联订单' },
            { key: 'amount', label: '金额', render: v => `¥${formatCurrency(v)}` },
            { key: 'method', label: '付款方式' },
            { key: 'status', label: '状态', type: 'status' },
            { key: 'createdAt', label: '时间', type: 'datetime' }
        ]
    };

    container.innerHTML = `
        <div class="card">
            <div class="card-header">
                <span class="card-title">${subModules.find(s => s.id === sub)?.label || ''}</span>
            </div>
            <div class="card-body" id="purchaseTable">
                <div style="text-align:center;padding:20px;"><div class="spinner" style="margin:0 auto;"></div></div>
            </div>
        </div>
    `;

    const result = await apiClient.get(endpoints[sub] || `/purchase/${sub}`);
    const data = result.success ? result.data || [] : [];

    const tableContainer = document.getElementById('purchaseTable');
    datatable.render(tableContainer, {
        columns: columnsMap[sub] || [{ key: 'id', label: 'ID' }],
        data,
        rowKey: 'id',
        emptyText: `暂无${subModules.find(s => s.id === sub)?.label || ''}数据`,
        loading: false
    });
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

    document.getElementById('purchaseAction')?.addEventListener('click', () => {
        modal.alert('新建', `正在创建 ${state.activeSub} 功能...`, '知道了');
    });
}

export async function init() {
    console.log('✅ [Purchase] 模块已初始化');
}

export default { meta, render, init };