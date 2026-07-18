/**
 * @file orders/submodules/detail.js
 * @description 订单详情子模块
 */

import { apiClient } from '@services/api-client.js';
import { formatCurrency, formatDateTime } from '@utils/helpers.js';

export const meta = {
    name: '订单详情',
    path: '/orders/detail/:id',
    icon: 'fa-file-invoice',
    permission: 'orders:detail'
};

export async function render(container, params = {}) {
    const id = params.id;
    if (!id) {
        container.innerHTML = '<div style="text-align:center;padding:40px;color:#EF4444;">缺少订单ID</div>';
        return;
    }
    
    const result = await apiClient.get(`/orders/${id}`);
    const order = result.success ? result.data : null;
    
    if (!order) {
        container.innerHTML = '<div style="text-align:center;padding:40px;color:#EF4444;">订单不存在</div>';
        return;
    }
    
    container.innerHTML = `
        <div class="order-detail-container">
            <div class="page-header">
                <h1>📄 订单详情</h1>
                <div class="page-actions">
                    <button class="btn btn-outline" onclick="window.history.back()"><i class="fas fa-arrow-left"></i> 返回</button>
                    <button class="btn btn-primary" id="printOrder"><i class="fas fa-print"></i> 打印</button>
                </div>
            </div>
            <div class="card">
                <div class="card-body">
                    <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:20px;">
                        <div><strong>订单号：</strong>${order.orderNumber || order.id}</div>
                        <div><strong>状态：</strong><span class="status-badge status-${order.status}">${order.status}</span></div>
                        <div><strong>客户：</strong>${order.customerName || '-'}</div>
                        <div><strong>电话：</strong>${order.customerPhone || '-'}</div>
                        <div><strong>金额：</strong><span style="font-size:18px;font-weight:700;color:#4F46E5;">¥${formatCurrency(order.totalAmount)}</span></div>
                        <div><strong>创建时间：</strong>${formatDateTime(order.createdAt)}</div>
                    </div>
                    <div style="border-top:1px solid #E5E7EB;padding-top:16px;">
                        <h4>商品明细</h4>
                        ${order.items && Array.isArray(order.items) ? order.items.map(item => `
                            <div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #F3F4F6;">
                                <span>${item.name} × ${item.quantity}</span>
                                <span>¥${formatCurrency(item.price * item.quantity)}</span>
                            </div>
                        `).join('') : '<div style="color:#6B7280;">暂无商品明细</div>'}
                    </div>
                    ${order.note ? `<div style="border-top:1px solid #E5E7EB;padding-top:16px;color:#6B7280;"><strong>备注：</strong>${order.note}</div>` : ''}
                </div>
            </div>
        </div>
    `;
}

export async function init() { console.log('✅ [OrderDetail] 已初始化'); }
export default { meta, render, init };
