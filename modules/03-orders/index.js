/**
 * @file orders/index.js
 * @description 订单管理模块
 * @module modules/orders
 */

import { orderService } from '@services/order.service.js';
import { customerService } from '@services/customer.service.js';
import { productService } from '@services/product.service.js';
import { formatCurrency, formatDate, getStatusLabel } from '@utils/helpers.js';
import { datatable } from '@components/datatable.js';
import { modal } from '@components/modal.js';


/**
 * 模块元信息
 */
export const meta = {
    name: '订单管理',
    path: '/orders',
    icon: 'fa-clipboard-list',
    permission: 'orders:view',
    enabled: true,
    order: 10
};

/**
 * 模块状态
 */
let state = {
    list: [],
    total: 0,
    page: 1,
    pageSize: 20,
    status: 'all',
    keyword: '',
    loading: false
};

/**
 * 渲染订单管理
 */
export async function render(container, params = {}) {
    

    // 构建页面
    container.innerHTML = `
        <div class="orders-container">
            <div class="page-header">
                <h1>📋 订单管理</h1>
                <div class="page-actions">
                    <button class="btn btn-primary" id="createOrder">
                        <i class="fas fa-plus"></i> 新建订单
                    </button>
                </div>
            </div>

            <!-- 筛选栏 -->
            <div class="card" style="margin-bottom:20px;">
                <div class="card-body">
                    <div style="display:flex;flex-wrap:wrap;gap:12px;align-items:center;">
                        <div style="flex:1;min-width:200px;">
                            <input type="text" class="form-control" id="orderSearch" placeholder="搜索订单号/客户..." style="width:100%;">
                        </div>
                        <div style="width:150px;">
                            <select class="form-control" id="orderStatusFilter">
                                <option value="all">全部状态</option>
                                <option value="pending">待处理</option>
                                <option value="confirmed">已确认</option>
                                <option value="processing">处理中</option>
                                <option value="completed">已完成</option>
                                <option value="cancelled">已取消</option>
                            </select>
                        </div>
                        <button class="btn btn-primary" id="searchOrders">
                            <i class="fas fa-search"></i> 搜索
                        </button>
                        <button class="btn btn-outline" id="resetOrders">
                            <i class="fas fa-undo"></i> 重置
                        </button>
                    </div>
                </div>
            </div>

            <!-- 表格 -->
            <div class="card">
                <div class="card-header">
                    <span class="card-title">订单列表</span>
                    <span style="font-size:14px;color:#6B7280;">共 <strong id="orderTotal">0</strong> 条</span>
                </div>
                <div class="card-body" id="ordersTableContainer">
                    <div style="text-align:center;padding:40px;">
                        <div class="spinner" style="margin:0 auto;"></div>
                        <p style="margin-top:12px;color:#6B7280;">加载中...</p>
                    </div>
                </div>
                <div class="card-footer" style="padding:12px 20px;border-top:1px solid #E5E7EB;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;">
                    <div style="font-size:14px;color:#6B7280;">
                        显示第 <span id="pageStart">0</span>-<span id="pageEnd">0</span> 条，共 <span id="pageTotal">0</span> 条
                    </div>
                    <div style="display:flex;gap:4px;" id="paginationContainer">
                    </div>
                </div>
            </div>
        </div>
    `;

    // 加载数据
    await loadOrders();

    // 绑定事件
    bindEvents(container);
}

/**
 * 加载订单列表
 */
async function loadOrders() {
    state.loading = true;

    const params = {
        page: state.page,
        pageSize: state.pageSize,
        status: state.status !== 'all' ? state.status : undefined,
        keyword: state.keyword || undefined
    };

    const result = await orderService.getList(params);
    
    if (result.success) {
        state.list = result.data.list || [];
        state.total = result.data.total || 0;
        renderTable();
        renderPagination();
    } else {
        console.error('[Orders] 加载失败:', result.error);
        modal.alert('加载失败', result.error || '获取订单列表失败');
    }

    state.loading = false;
}

/**
 * 渲染表格
 */
function renderTable() {
    const container = document.getElementById('ordersTableContainer');
    if (!container) return;

    const columns = [
        { key: 'orderNumber', label: '订单号', type: 'text' },
        { key: 'customerName', label: '客户', type: 'text' },
        { key: 'totalAmount', label: '金额', type: 'currency' },
        { key: 'status', label: '状态', type: 'status' },
        { key: 'createdAt', label: '创建时间', type: 'datetime' }
    ];

    const actions = [
        {
            key: 'view',
            label: '查看',
            className: 'btn btn-sm btn-outline',
            icon: 'fa-eye',
            onClick: (data) => viewOrder(data)
        },
        {
            key: 'edit',
            label: '编辑',
            className: 'btn btn-sm btn-primary',
            icon: 'fa-edit',
            onClick: (data) => editOrder(data)
        },
        {
            key: 'delete',
            label: '删除',
            className: 'btn btn-sm btn-danger',
            icon: 'fa-trash',
            visible: (row) => row.status !== 'completed' && row.status !== 'cancelled',
            onClick: (data) => deleteOrder(data)
        }
    ];

    datatable.render(container, {
        columns,
        data: state.list,
        rowKey: 'id',
        actions,
        loading: state.loading,
        emptyText: '暂无订单'
    });

    // 更新总数
    document.getElementById('orderTotal').textContent = state.total;
}

/**
 * 渲染分页
 */
function renderPagination() {
    const container = document.getElementById('paginationContainer');
    if (!container) return;

    const totalPages = Math.ceil(state.total / state.pageSize);
    const start = (state.page - 1) * state.pageSize + 1;
    const end = Math.min(state.page * state.pageSize, state.total);

    document.getElementById('pageStart').textContent = state.total > 0 ? start : 0;
    document.getElementById('pageEnd').textContent = end;
    document.getElementById('pageTotal').textContent = state.total;

    let html = '';
    
    // 上一页
    html += `<button class="btn btn-sm btn-outline" ${state.page <= 1 ? 'disabled' : ''} data-page="${state.page - 1}">
        <i class="fas fa-chevron-left"></i>
    </button>`;

    // 页码
    const maxVisible = 7;
    let startPage = Math.max(1, state.page - Math.floor(maxVisible / 2));
    let endPage = Math.min(totalPages, startPage + maxVisible - 1);
    if (endPage - startPage < maxVisible - 1) {
        startPage = Math.max(1, endPage - maxVisible + 1);
    }

    if (startPage > 1) {
        html += `<button class="btn btn-sm btn-outline" data-page="1">1</button>`;
        if (startPage > 2) html += `<span style="padding:0 8px;color:#9CA3AF;">...</span>`;
    }

    for (let i = startPage; i <= endPage; i++) {
        html += `<button class="btn btn-sm ${i === state.page ? 'btn-primary' : 'btn-outline'}" data-page="${i}">${i}</button>`;
    }

    if (endPage < totalPages) {
        if (endPage < totalPages - 1) html += `<span style="padding:0 8px;color:#9CA3AF;">...</span>`;
        html += `<button class="btn btn-sm btn-outline" data-page="${totalPages}">${totalPages}</button>`;
    }

    // 下一页
    html += `<button class="btn btn-sm btn-outline" ${state.page >= totalPages ? 'disabled' : ''} data-page="${state.page + 1}">
        <i class="fas fa-chevron-right"></i>
    </button>`;

    container.innerHTML = html;

    // 分页点击事件
    container.querySelectorAll('[data-page]').forEach(btn => {
        btn.addEventListener('click', () => {
            const page = parseInt(btn.dataset.page);
            if (page && page !== state.page) {
                state.page = page;
                loadOrders();
            }
        });
    });
}

/**
 * 查看订单
 */
function viewOrder(data) {
    modal.open({
        title: `订单详情 - ${data.orderNumber || data.id}`,
        content: `
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:16px;">
                <div><strong>订单号：</strong>${data.orderNumber || data.id}</div>
                <div><strong>客户：</strong>${data.customerName || '-'}</div>
                <div><strong>电话：</strong>${data.customerPhone || '-'}</div>
                <div><strong>状态：</strong><span class="status-badge status-${data.status}">${getStatusLabel(data.status)}</span></div>
                <div><strong>金额：</strong>${formatCurrency(data.totalAmount)}</div>
                <div><strong>创建时间：</strong>${formatDate(data.createdAt, 'long')}</div>
            </div>
            ${data.items ? `
                <div style="border-top:1px solid #E5E7EB;padding-top:12px;">
                    <strong>商品明细</strong>
                    <div style="margin-top:8px;font-size:14px;">
                        ${data.items.map(item => `
                            <div style="display:flex;justify-content:space-between;padding:4px 0;border-bottom:1px solid #F3F4F6;">
                                <span>${item.name} × ${item.quantity}</span>
                                <span>${formatCurrency(item.price * item.quantity)}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            ` : ''}
            ${data.note ? `<div style="border-top:1px solid #E5E7EB;padding-top:12px;color:#6B7280;"><strong>备注：</strong>${data.note}</div>` : ''}
        `,
        size: 'lg',
        buttons: [
            { label: '关闭', type: 'secondary' }
        ]
    });
}

/**
 * 编辑订单
 */
function editOrder(data) {
    modal.alert('编辑订单', `编辑功能开发中...`, '知道了');
}

/**
 * 删除订单
 */
async function deleteOrder(data) {
    const confirmed = await modal.confirmDelete(data.orderNumber || data.id);
    if (!confirmed) return;

    const result = await orderService.delete(data.id);
    if (result.success) {
        await loadOrders();
        modal.alert('删除成功', '订单已删除');
    } else {
        modal.alert('删除失败', result.error || '删除订单失败', '知道了', 'danger');
    }
}

/**
 * 绑定事件
 */
function bindEvents(container) {
    // 新建订单
    const createBtn = container.querySelector('#createOrder');
    if (createBtn) {
        createBtn.addEventListener('click', () => {
            modal.open({
                title: '新建订单',
                content: `
                    <div style="padding:10px 0;">
                        <div class="form-group">
                            <label class="form-label">客户名称</label>
                            <input type="text" class="form-control" id="orderCustomer" placeholder="请输入客户名称">
                        </div>
                        <div class="form-group">
                            <label class="form-label">客户电话</label>
                            <input type="text" class="form-control" id="orderPhone" placeholder="请输入客户电话">
                        </div>
                        <div class="form-group">
                            <label class="form-label">订单金额</label>
                            <input type="number" class="form-control" id="orderAmount" placeholder="0.00">
                        </div>
                        <div class="form-group">
                            <label class="form-label">备注</label>
                            <textarea class="form-control" id="orderNote" rows="3" placeholder="备注信息"></textarea>
                        </div>
                    </div>
                `,
                buttons: [
                    { label: '取消', type: 'secondary' },
                    { 
                        label: '创建', 
                        type: 'primary',
                        onClick: async () => {
                            const name = document.getElementById('orderCustomer').value.trim();
                            const phone = document.getElementById('orderPhone').value.trim();
                            const amount = parseFloat(document.getElementById('orderAmount').value);
                            const note = document.getElementById('orderNote').value.trim();

                            if (!name) {
                                modal.alert('提示', '请输入客户名称', '知道了', 'warning');
                                return;
                            }

                            if (!amount || amount <= 0) {
                                modal.alert('提示', '请输入有效的订单金额', '知道了', 'warning');
                                return;
                            }

                            const result = await orderService.create({
                                customerName: name,
                                customerPhone: phone || '-',
                                totalAmount: amount,
                                note: note || '',
                                items: []
                            });

                            if (result.success) {
                                await loadOrders();
                                modal.alert('创建成功', '订单已创建');
                            } else {
                                modal.alert('创建失败', result.error || '创建订单失败', '知道了', 'danger');
                            }
                        }
                    }
                ]
            });
        });
    }

    // 搜索
    const searchBtn = container.querySelector('#searchOrders');
    const searchInput = container.querySelector('#orderSearch');
    const statusFilter = container.querySelector('#orderStatusFilter');

    if (searchBtn) {
        searchBtn.addEventListener('click', () => {
            state.keyword = searchInput?.value || '';
            state.status = statusFilter?.value || 'all';
            state.page = 1;
            loadOrders();
        });
    }

    if (searchInput) {
        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                state.keyword = searchInput.value;
                state.page = 1;
                loadOrders();
            }
        });
    }

    // 重置
    const resetBtn = container.querySelector('#resetOrders');
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            if (searchInput) searchInput.value = '';
            if (statusFilter) statusFilter.value = 'all';
            state.keyword = '';
            state.status = 'all';
            state.page = 1;
            loadOrders();
        });
    }
}

/**
 * 模块初始化钩子
 */
export async function init() {
    console.log('✅ [Orders] 模块已初始化');
}

export default { meta, render, init };