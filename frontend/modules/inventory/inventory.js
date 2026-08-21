/**
 * Inventory Module - 库存管理
 */

(function() {
    'use strict';

    window.initInventory = function() {
        console.log('📦 Inventory 模块加载完成');
        
        loadInventory();
        bindEvents();
    };

    // 加载库存
    async function loadInventory() {
        try {
            const inventory = await window.InventoryService.getAll({
                branch_id: window._currentBranch
            });
            
            renderInventory(inventory);
        } catch (error) {
            console.error('加载库存失败:', error);
        }
    }

    // 渲染库存
    function renderInventory(inventory) {
        const container = document.querySelector('.inventory-list');
        if (!container) return;
        
        container.innerHTML = inventory.map(item => `
            <tr>
                <td>${item.products?.sku}</td>
                <td>${item.products?.name}</td>
                <td>${item.quantity}</td>
                <td>${item.min_quantity}</td>
                <td>${item.quantity <= item.min_quantity ? '⚠️ 低库存' : '正常'}</td>
                <td>
                    <button onclick="window.adjustInventory('${item.id}')">调整</button>
                </td>
            </tr>
        `).join('');
    }

    // 调整库存
    window.adjustInventory = async function(id) {
        const data = await window.Modal.form(`
            <form id="inventoryForm">
                <input name="quantity" type="number" placeholder="调整数量（正数增加，负数减少）" required>
                <input name="reason" placeholder="调整原因" required>
            </form>
        `, '调整库存');
        
        if (data) {
            try {
                await window.InventoryService.adjust(
                    id,
                    parseInt(data.quantity),
                    data.reason,
                    window._currentUser?.id
                );
                loadInventory();
                window.Notifications.success('库存调整成功');
            } catch (error) {
                window.Notifications.error('调整失败: ' + error.message);
            }
        }
    };

    // 绑定事件
    function bindEvents() {
        document.querySelector('.btn-refresh')?.addEventListener('click', loadInventory);
    }

    // 模块加载时初始化
    if (document.querySelector('[data-module="inventory"]')) {
        window.initInventory();
    }

})();