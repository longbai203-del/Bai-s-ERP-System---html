/**
 * Suppliers Module - 供应商管理
 */

(function() {
    'use strict';

    window.initSuppliers = function() {
        console.log('📦 Suppliers 模块加载完成');
        
        loadSuppliers();
        bindEvents();
    };

    // 加载供应商
    async function loadSuppliers() {
        try {
            const suppliers = await window.SupplierService.getAll({
                organization_id: window._currentOrg?.id
            });
            
            renderSuppliers(suppliers);
        } catch (error) {
            console.error('加载供应商失败:', error);
        }
    }

    // 渲染供应商
    function renderSuppliers(suppliers) {
        const container = document.querySelector('.suppliers-list');
        if (!container) return;
        
        container.innerHTML = suppliers.map(supplier => `
            <tr>
                <td>${supplier.supplier_code}</td>
                <td>${supplier.name}</td>
                <td>${supplier.contact_person}</td>
                <td>${supplier.phone}</td>
                <td>${supplier.email}</td>
                <td>
                    <button onclick="window.editSupplier('${supplier.id}')">编辑</button>
                    <button onclick="window.deleteSupplier('${supplier.id}')">删除</button>
                </td>
            </tr>
        `).join('');
    }

    // 添加供应商
    window.addSupplier = async function() {
        const data = await window.Modal.form(`
            <form id="supplierForm">
                <input name="name" placeholder="供应商名称" required>
                <input name="contact_person" placeholder="联系人">
                <input name="phone" placeholder="电话">
                <input name="email" placeholder="邮箱" type="email">
                <input name="address" placeholder="地址">
                <select name="status">
                    <option value="active">启用</option>
                    <option value="inactive">停用</option>
                </select>
            </form>
        `, '添加供应商');
        
        if (data) {
            try {
                await window.SupplierService.create({
                    ...data,
                    organization_id: window._currentOrg?.id
                });
                loadSuppliers();
                window.Notifications.success('供应商添加成功');
            } catch (error) {
                window.Notifications.error('添加供应商失败: ' + error.message);
            }
        }
    };

    // 编辑供应商
    window.editSupplier = async function(id) {
        const supplier = await window.SupplierService.getById(id);
        if (!supplier) return;
        
        const data = await window.Modal.form(`
            <form id="supplierForm">
                <input name="name" value="${supplier.name}" placeholder="供应商名称" required>
                <input name="contact_person" value="${supplier.contact_person}" placeholder="联系人">
                <input name="phone" value="${supplier.phone}" placeholder="电话">
                <input name="email" value="${supplier.email}" placeholder="邮箱" type="email">
                <input name="address" value="${supplier.address}" placeholder="地址">
                <select name="status">
                    <option value="active" ${supplier.status === 'active' ? 'selected' : ''}>启用</option>
                    <option value="inactive" ${supplier.status === 'inactive' ? 'selected' : ''}>停用</option>
                </select>
            </form>
        `, '编辑供应商');
        
        if (data) {
            try {
                await window.SupplierService.update(id, data);
                loadSuppliers();
                window.Notifications.success('供应商更新成功');
            } catch (error) {
                window.Notifications.error('更新供应商失败: ' + error.message);
            }
        }
    };

    // 删除供应商
    window.deleteSupplier = async function(id) {
        const confirmed = await window.Modal.confirm('确定要删除此供应商吗？');
        if (confirmed) {
            try {
                await window.SupplierService.delete(id);
                loadSuppliers();
                window.Notifications.success('供应商已删除');
            } catch (error) {
                window.Notifications.error('删除供应商失败: ' + error.message);
            }
        }
    };

    // 绑定事件
    function bindEvents() {
        document.querySelector('.btn-add-supplier')?.addEventListener('click', window.addSupplier);
        document.querySelector('.btn-refresh')?.addEventListener('click', loadSuppliers);
    }

    // 模块加载时初始化
    if (document.querySelector('[data-module="suppliers"]')) {
        window.initSuppliers();
    }

})();