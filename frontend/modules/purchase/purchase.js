/**
 * Purchase Module - 采购管理
 */

(function() {
    'use strict';

    window.initPurchase = function() {
        console.log('📦 Purchase 模块加载完成');
        
        loadPurchases();
        bindEvents();
    };

    // 加载采购单
    async function loadPurchases() {
        try {
            const purchases = await window.PurchaseService.getAll({
                branch_id: window._currentBranch
            });
            
            renderPurchases(purchases);
        } catch (error) {
            console.error('加载采购单失败:', error);
        }
    }

    // 渲染采购单
    function renderPurchases(purchases) {
        const container = document.querySelector('.purchase-list');
        if (!container) return;
        
        container.innerHTML = purchases.map(purchase => `
            <tr>
                <td>${purchase.purchase_number}</td>
                <td>${purchase.suppliers?.name}</td>
                <td>${purchase.total_amount} SAR</td>
                <td><span class="status-${purchase.status}">${purchase.status}</span></td>
                <td>${new Date(purchase.created_at).toLocaleString()}</td>
                <td>
                    <button onclick="window.receivePurchase('${purchase.id}')">收货</button>
                </td>
            </tr>
        `).join('');
    }

    // 收货
    window.receivePurchase = async function(id) {
        const confirmed = await window.Modal.confirm('确认收货？');
        if (confirmed) {
            try {
                await window.PurchaseService.updateStatus(id, 'received');
                loadPurchases();
                window.Notifications.success('收货成功');
            } catch (error) {
                window.Notifications.error('收货失败: ' + error.message);
            }
        }
    };

    // 添加采购单
    window.addPurchase = async function() {
        // 获取供应商列表
        const suppliers = await window.SupplierService.getAll({
            organization_id: window._currentOrg?.id
        });
        
        const supplierOptions = suppliers.map(s => 
            `<option value="${s.id}">${s.name}</option>`
        ).join('');
        
        // 获取产品列表
        const products = await window.ProductService.getAll({
            organization_id: window._currentOrg?.id
        });
        
        const productOptions = products.map(p => 
            `<option value="${p.id}">${p.name}</option>`
        ).join('');
        
        const data = await window.Modal.form(`
            <form id="purchaseForm">
                <select name="supplier_id" required>
                    <option value="">选择供应商</option>
                    ${supplierOptions}
                </select>
                <div class="purchase-items">
                    <h4>采购商品</h4>
                    <div class="item-row">
                        <select name="items[0][product_id]">${productOptions}</select>
                        <input name="items[0][quantity]" type="number" placeholder="数量">
                        <input name="items[0][unit_price]" type="number" step="0.01" placeholder="单价">
                    </div>
                    <button type="button" onclick="window.addPurchaseRow()">添加商品</button>
                </div>
                <textarea name="notes" placeholder="备注"></textarea>
            </form>
        `, '创建采购单');
        
        if (data) {
            try {
                await window.PurchaseService.create({
                    ...data,
                    organization_id: window._currentOrg?.id,
                    branch_id: window._currentBranch
                });
                loadPurchases();
                window.Notifications.success('采购单创建成功');
            } catch (error) {
                window.Notifications.error('创建采购单失败: ' + error.message);
            }
        }
    };

    // 绑定事件
    function bindEvents() {
        document.querySelector('.btn-add-purchase')?.addEventListener('click', window.addPurchase);
        document.querySelector('.btn-refresh')?.addEventListener('click', loadPurchases);
    }

    // 模块加载时初始化
    if (document.querySelector('[data-module="purchase"]')) {
        window.initPurchase();
    }

})();