/**
 * @file inventory/index.js
 * @description 库存管理模块
 * @module modules/inventory
 */

import { apiClient } from '@services/api-client.js';
import { formatCurrency } from '@utils/helpers.js';
import { datatable } from '@components/datatable.js';
import { modal } from '@components/modal.js';


export const meta = {
    name: '库存管理',
    path: '/inventory',
    icon: 'fa-warehouse',
    permission: 'inventory:view',
    enabled: true,
    order: 60
};

const subModules = [
    { id: 'stock', label: '库存查询', icon: 'fa-boxes' },
    { id: 'warehouses', label: '仓库管理', icon: 'fa-warehouse' },
    { id: 'transfers', label: '库存调拨', icon: 'fa-exchange-alt' },
    { id: 'adjustments', label: '库存调整', icon: 'fa-sliders-h' },
    { id: 'low-stock', label: '低库存预警', icon: 'fa-exclamation-triangle' },
    { id: 'batches', label: '批次管理', icon: 'fa-layer-group' },
    { id: 'serial-numbers', label: '序列号管理', icon: 'fa-barcode' }
];

let state = {
    activeSub: 'stock',
    list: [],
    total: 0,
    page: 1,
    pageSize: 20
};

export async function render(container, params = {}) {
    const sub = params.sub || 'stock';
    state.activeSub = sub;

    

    container.innerHTML = `
        <div class="inventory-container">
            <div class="page-header">
                <h1>📦 库存管理</h1>
                <div class="page-actions">
                    <button class="btn btn-primary" id="inventoryAction">
                        <i class="fas fa-plus"></i> ${getActionLabel(sub)}
                    </button>
                </div>
            </div>

            <div class="sub-module-nav" style="display:flex;gap:4px;margin-bottom:20px;background:white;padding:8px;border-radius:12px;border:1px solid #E5E7EB;flex-wrap:wrap;">
                ${subModules.map(sm => `
                    <button class="sub-module-btn ${sm.id === sub ? 'active' : ''}" 
                            data-sub="${sm.id}"
                            style="padding:8px 16px;border:none;border-radius:8px;cursor:pointer;background:${sm.id === sub ? '#4F46E5' : 'transparent'};color:${sm.id === sub ? 'white' : '#6B7280'};font-weight:${sm.id === sub ? '600' : '400'};transition:all 0.2s;">
                        <i class="fas ${sm.icon}"></i> ${sm.label}
                    </button>
                `).join('')}
            </div>

            <div id="inventoryContent">
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

function getActionLabel(sub) {
    const labels = {
        stock: '新增商品',
        warehouses: '新建仓库',
        transfers: '新建调拨',
        adjustments: '新建调整',
        'low-stock': '设置预警',
        batches: '新建批次',
        'serial-numbers': '导入序列号'
    };
    return labels[sub] || '新建';
}

async function loadSubModule(sub) {
    const container = document.getElementById('inventoryContent');
    state.activeSub = sub;

    switch (sub) {
        case 'stock':
            await renderStock(container);
            break;
        case 'warehouses':
            await renderWarehouses(container);
            break;
        case 'transfers':
            await renderTransfers(container);
            break;
        case 'adjustments':
            await renderAdjustments(container);
            break;
        case 'low-stock':
            await renderLowStock(container);
            break;
        case 'batches':
            await renderBatches(container);
            break;
        case 'serial-numbers':
            await renderSerialNumbers(container);
            break;
        default:
            container.innerHTML = '<div style="text-align:center;padding:40px;color:#9CA3AF;">未知子模块</div>';
    }
}

async function renderStock(container) {
    container.innerHTML = `
        <div class="card">
            <div class="card-header">
                <span class="card-title">📊 库存查询</span>
                <div style="display:flex;gap:8px;">
                    <input type="text" class="form-control" id="stockSearch" placeholder="搜索商品..." style="width:200px;padding:4px 12px;">
                    <button class="btn btn-sm btn-primary" id="stockSearchBtn"><i class="fas fa-search"></i></button>
                </div>
            </div>
            <div class="card-body" id="stockTable">
                <div style="text-align:center;padding:20px;"><div class="spinner" style="margin:0 auto;"></div></div>
            </div>
        </div>
    `;

    const result = await apiClient.get('/inventory/stock');
    const data = result.success ? result.data || [] : [];

    const columns = [
        { key: 'name', label: '商品名称' },
        { key: 'sku', label: 'SKU' },
        { key: 'quantity', label: '库存数量' },
        { key: 'warehouse', label: '仓库' },
        { key: 'minStock', label: '安全库存' },
        { key: 'status', label: '状态', render: v => {
            const statuses = { normal: '✅ 正常', low: '⚠️ 低库存', out: '❌ 缺货' };
            return statuses[v] || v;
        }}
    ];

    const tableContainer = document.getElementById('stockTable');
    datatable.render(tableContainer, { columns, data, rowKey: 'id', emptyText: '暂无库存数据' });

    document.getElementById('stockSearchBtn')?.addEventListener('click', () => {
        const keyword = document.getElementById('stockSearch').value.trim();
        if (keyword) {
            const filtered = data.filter(item => 
                item.name?.includes(keyword) || item.sku?.includes(keyword)
            );
            datatable.render(tableContainer, { columns, data: filtered, rowKey: 'id', emptyText: '未找到匹配商品' });
        } else {
            datatable.render(tableContainer, { columns, data, rowKey: 'id', emptyText: '暂无库存数据' });
        }
    });
}

async function renderWarehouses(container) {
    container.innerHTML = `
        <div class="card">
            <div class="card-header">
                <span class="card-title">🏠 仓库管理</span>
            </div>
            <div class="card-body" id="warehousesTable">
                <div style="text-align:center;padding:20px;"><div class="spinner" style="margin:0 auto;"></div></div>
            </div>
        </div>
    `;

    const result = await apiClient.get('/inventory/warehouses');
    const data = result.success ? result.data || [] : [];

    const columns = [
        { key: 'name', label: '仓库名称' },
        { key: 'code', label: '仓库编码' },
        { key: 'address', label: '地址' },
        { key: 'manager', label: '负责人' },
        { key: 'status', label: '状态', type: 'status' }
    ];

    const tableContainer = document.getElementById('warehousesTable');
    datatable.render(tableContainer, { columns, data, rowKey: 'id', emptyText: '暂无仓库' });
}

async function renderTransfers(container) {
    container.innerHTML = `
        <div class="card">
            <div class="card-header">
                <span class="card-title">🔄 库存调拨</span>
            </div>
            <div class="card-body" id="transfersTable">
                <div style="text-align:center;padding:20px;"><div class="spinner" style="margin:0 auto;"></div></div>
            </div>
        </div>
    `;

    const result = await apiClient.get('/inventory/transfers');
    const data = result.success ? result.data || [] : [];

    const columns = [
        { key: 'transferNo', label: '调拨单号' },
        { key: 'productName', label: '商品' },
        { key: 'quantity', label: '数量' },
        { key: 'fromWarehouse', label: '来源仓库' },
        { key: 'toWarehouse', label: '目标仓库' },
        { key: 'status', label: '状态', type: 'status' },
        { key: 'createdAt', label: '创建时间', type: 'datetime' }
    ];

    const tableContainer = document.getElementById('transfersTable');
    datatable.render(tableContainer, { columns, data, rowKey: 'id', emptyText: '暂无调拨记录' });
}

async function renderAdjustments(container) {
    container.innerHTML = `
        <div class="card">
            <div class="card-header">
                <span class="card-title">📐 库存调整</span>
            </div>
            <div class="card-body" id="adjustmentsTable">
                <div style="text-align:center;padding:20px;"><div class="spinner" style="margin:0 auto;"></div></div>
            </div>
        </div>
    `;

    const result = await apiClient.get('/inventory/adjustments');
    const data = result.success ? result.data || [] : [];

    const columns = [
        { key: 'adjustNo', label: '调整单号' },
        { key: 'productName', label: '商品' },
        { key: 'beforeQty', label: '调整前' },
        { key: 'afterQty', label: '调整后' },
        { key: 'reason', label: '原因' },
        { key: 'createdBy', label: '操作人' },
        { key: 'createdAt', label: '时间', type: 'datetime' }
    ];

    const tableContainer = document.getElementById('adjustmentsTable');
    datatable.render(tableContainer, { columns, data, rowKey: 'id', emptyText: '暂无调整记录' });
}

async function renderLowStock(container) {
    container.innerHTML = `
        <div class="card">
            <div class="card-header">
                <span class="card-title">⚠️ 低库存预警</span>
            </div>
            <div class="card-body" id="lowStockTable">
                <div style="text-align:center;padding:20px;"><div class="spinner" style="margin:0 auto;"></div></div>
            </div>
        </div>
    `;

    const result = await apiClient.get('/inventory/low-stock');
    const data = result.success ? result.data || [] : [];

    if (data.length === 0) {
        document.getElementById('lowStockTable').innerHTML = `
            <div style="text-align:center;padding:40px;color:#10B981;">
                <i class="fas fa-check-circle" style="font-size:48px;"></i>
                <p style="margin-top:12px;">所有商品库存正常 ✅</p>
            </div>
        `;
        return;
    }

    const columns = [
        { key: 'name', label: '商品名称' },
        { key: 'sku', label: 'SKU' },
        { key: 'quantity', label: '当前库存' },
        { key: 'minStock', label: '安全库存' },
        { key: 'deficit', label: '缺货量', render: v => Math.abs(v) },
        { key: 'warehouse', label: '仓库' }
    ];

    const tableContainer = document.getElementById('lowStockTable');
    datatable.render(tableContainer, { columns, data, rowKey: 'id', emptyText: '暂无低库存商品' });
}

async function renderBatches(container) {
    container.innerHTML = `
        <div class="card">
            <div class="card-header">
                <span class="card-title">📦 批次管理</span>
            </div>
            <div class="card-body" id="batchesTable">
                <div style="text-align:center;padding:20px;"><div class="spinner" style="margin:0 auto;"></div></div>
            </div>
        </div>
    `;

    const result = await apiClient.get('/inventory/batches');
    const data = result.success ? result.data || [] : [];

    const columns = [
        { key: 'batchNo', label: '批次号' },
        { key: 'productName', label: '商品' },
        { key: 'quantity', label: '数量' },
        { key: 'manufactureDate', label: '生产日期', type: 'date' },
        { key: 'expiryDate', label: '有效期', type: 'date' },
        { key: 'status', label: '状态', type: 'status' }
    ];

    const tableContainer = document.getElementById('batchesTable');
    datatable.render(tableContainer, { columns, data, rowKey: 'id', emptyText: '暂无批次数据' });
}

async function renderSerialNumbers(container) {
    container.innerHTML = `
        <div class="card">
            <div class="card-header">
                <span class="card-title">🔢 序列号管理</span>
            </div>
            <div class="card-body" id="serialNumbersTable">
                <div style="text-align:center;padding:20px;"><div class="spinner" style="margin:0 auto;"></div></div>
            </div>
        </div>
    `;

    const result = await apiClient.get('/inventory/serial-numbers');
    const data = result.success ? result.data || [] : [];

    const columns = [
        { key: 'serialNo', label: '序列号' },
        { key: 'productName', label: '商品' },
        { key: 'status', label: '状态', render: v => {
            const statuses = { available: '✅ 可用', sold: '已售', returned: '已退货' };
            return statuses[v] || v;
        }},
        { key: 'warehouse', label: '仓库' },
        { key: 'createdAt', label: '入库时间', type: 'datetime' }
    ];

    const tableContainer = document.getElementById('serialNumbersTable');
    datatable.render(tableContainer, { columns, data, rowKey: 'id', emptyText: '暂无序列号数据' });
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
                
                // 更新操作按钮
                const actionBtn = document.getElementById('inventoryAction');
                if (actionBtn) {
                    actionBtn.innerHTML = `<i class="fas fa-plus"></i> ${getActionLabel(sub)}`;
                }
                
                loadSubModule(sub);
            }
        });
    });

    document.getElementById('inventoryAction')?.addEventListener('click', () => {
        modal.alert('新建', `正在创建 ${state.activeSub} 功能...`, '知道了');
    });
}

export async function init() {
    console.log('✅ [Inventory] 模块已初始化');
}

export default { meta, render, init };