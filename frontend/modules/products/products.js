/**
 * Products Module - 产品管理
 */

(function() {
    'use strict';

    window.initProducts = function() {
        console.log('📦 Products 模块加载完成');
        
        loadProducts();
        bindEvents();
    };

    // 加载产品列表
    async function loadProducts() {
        try {
            const products = await window.ProductService.getAll({
                organization_id: window._currentOrg?.id
            });
            
            renderProducts(products);
        } catch (error) {
            console.error('加载产品失败:', error);
        }
    }

    // 渲染产品列表
    function renderProducts(products) {
        const container = document.querySelector('.products-list');
        if (!container) return;
        
        container.innerHTML = products.map(product => `
            <tr>
                <td>${product.sku}</td>
                <td>${product.name}</td>
                <td>${product.category || '-'}</td>
                <td>${product.price} SAR</td>
                <td><span class="status-${product.status}">${product.status}</span></td>
                <td>
                    <button onclick="window.editProduct('${product.id}')">编辑</button>
                    <button onclick="window.deleteProduct('${product.id}')">删除</button>
                </td>
            </tr>
        `).join('');
    }

    // 添加产品
    window.addProduct = async function() {
        const data = await window.Modal.form(`
            <form id="productForm">
                <input name="name" placeholder="产品名称" required>
                <input name="category" placeholder="分类">
                <input name="price" type="number" step="0.01" placeholder="价格" required>
                <input name="unit" placeholder="单位">
                <textarea name="description" placeholder="描述"></textarea>
                <select name="status">
                    <option value="active">启用</option>
                    <option value="inactive">停用</option>
                </select>
            </form>
        `, '添加产品');
        
        if (data) {
            try {
                await window.ProductService.create({
                    ...data,
                    organization_id: window._currentOrg?.id,
                    branch_id: window._currentBranch
                });
                loadProducts();
                window.Notifications.success('产品添加成功');
            } catch (error) {
                window.Notifications.error('添加产品失败: ' + error.message);
            }
        }
    };

    // 编辑产品
    window.editProduct = async function(id) {
        const product = await window.ProductService.getById(id);
        if (!product) return;
        
        const data = await window.Modal.form(`
            <form id="productForm">
                <input name="name" value="${product.name}" placeholder="产品名称" required>
                <input name="category" value="${product.category}" placeholder="分类">
                <input name="price" type="number" step="0.01" value="${product.price}" placeholder="价格" required>
                <input name="unit" value="${product.unit}" placeholder="单位">
                <textarea name="description" placeholder="描述">${product.description || ''}</textarea>
                <select name="status">
                    <option value="active" ${product.status === 'active' ? 'selected' : ''}>启用</option>
                    <option value="inactive" ${product.status === 'inactive' ? 'selected' : ''}>停用</option>
                </select>
            </form>
        `, '编辑产品');
        
        if (data) {
            try {
                await window.ProductService.update(id, data);
                loadProducts();
                window.Notifications.success('产品更新成功');
            } catch (error) {
                window.Notifications.error('更新产品失败: ' + error.message);
            }
        }
    };

    // 删除产品
    window.deleteProduct = async function(id) {
        const confirmed = await window.Modal.confirm('确定要删除此产品吗？');
        if (confirmed) {
            try {
                await window.ProductService.delete(id);
                loadProducts();
                window.Notifications.success('产品已删除');
            } catch (error) {
                window.Notifications.error('删除产品失败: ' + error.message);
            }
        }
    };

    // 绑定事件
    function bindEvents() {
        document.querySelector('.btn-add-product')?.addEventListener('click', window.addProduct);
        document.querySelector('.btn-refresh')?.addEventListener('click', loadProducts);
    }

    // 模块加载时初始化
    if (document.querySelector('[data-module="products"]')) {
        window.initProducts();
    }

})();