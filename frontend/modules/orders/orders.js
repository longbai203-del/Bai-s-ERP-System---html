/**
 * Orders Module - 订单管理
 */

(function() {
    'use strict';

    window.initOrders = function() {
        console.log('📋 Orders 模块加载完成');
        
        loadOrders();
        bindEvents();
    };

    // 加载订单列表
    async function loadOrders() {
        try {
            const orders = await window.OrderService.getAll({
                branch_id: window._currentBranch
            });
            
            renderOrders(orders);
        } catch (error) {
            console.error('加载订单失败:', error);
        }
    }

    // 渲染订单列表
    function renderOrders(orders) {
        const container = document.querySelector('.orders-list');
        if (!container) return;
        
        container.innerHTML = orders.map(order => `
            <tr>
                <td>${order.order_number}</td>
                <td>${order.customers?.name || '散客'}</td>
                <td>${order.total} SAR</td>
                <td><span class="status-${order.status}">${order.status}</span></td>
                <td>${new Date(order.created_at).toLocaleString()}</td>
                <td>
                    <button onclick="window.viewOrder('${order.id}')">查看</button>
                    <button onclick="window.cancelOrder('${order.id}')">取消</button>
                </td>
            </tr>
        `).join('');
    }

    // 查看订单详情
    window.viewOrder = async function(id) {
        try {
            const order = await window.OrderService.getById(id);
            if (order) {
                // 显示详情模态框
                window.Modal.open({
                    title: `订单 ${order.order_number}`,
                    content: `
                        <p>客户: ${order.customers?.name || '散客'}</p>
                        <p>金额: ${order.total} SAR</p>
                        <p>状态: ${order.status}</p>
                        <h4>商品明细</h4>
                        ${order.order_items?.map(item => `
                            <p>${item.products?.name} x ${item.quantity} = ${item.total_price}</p>
                        `).join('')}
                    `
                });
            }
        } catch (error) {
            console.error('查看订单失败:', error);
        }
    };

    // 取消订单
    window.cancelOrder = async function(id) {
        const confirmed = await window.Modal.confirm('确定要取消此订单吗？');
        if (confirmed) {
            try {
                await window.OrderService.cancel(id, '用户取消');
                loadOrders();
                window.Notifications.success('订单已取消');
            } catch (error) {
                window.Notifications.error('取消订单失败: ' + error.message);
            }
        }
    };

    // 绑定事件
    function bindEvents() {
        // 筛选
        document.querySelector('.filter-status')?.addEventListener('change', loadOrders);
        document.querySelector('.filter-date')?.addEventListener('change', loadOrders);
        
        // 刷新
        document.querySelector('.btn-refresh')?.addEventListener('click', loadOrders);
    }

    // 模块加载时初始化
    if (document.querySelector('[data-module="orders"]')) {
        window.initOrders();
    }

})();