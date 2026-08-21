/**
 * Customers Module - 客户管理
 */

(function() {
    'use strict';

    window.initCustomers = function() {
        console.log('👤 Customers 模块加载完成');
        
        loadCustomers();
        bindEvents();
    };

    // 加载客户列表
    async function loadCustomers() {
        try {
            const customers = await window.CustomerService.getAll({
                organization_id: window._currentOrg?.id
            });
            
            renderCustomers(customers);
        } catch (error) {
            console.error('加载客户失败:', error);
        }
    }

    // 渲染客户列表
    function renderCustomers(customers) {
        const container = document.querySelector('.customers-list');
        if (!container) return;
        
        container.innerHTML = customers.map(customer => `
            <tr>
                <td>${customer.customer_code}</td>
                <td>${customer.name}</td>
                <td>${customer.phone}</td>
                <td>${customer.email}</td>
                <td>${customer.member_type || '普通'}</td>
                <td>
                    <button onclick="window.editCustomer('${customer.id}')">编辑</button>
                    <button onclick="window.deleteCustomer('${customer.id}')">删除</button>
                </td>
            </tr>
        `).join('');
    }

    // 添加客户
    window.addCustomer = async function() {
        const data = await window.Modal.form(`
            <form id="customerForm">
                <input name="name" placeholder="姓名" required>
                <input name="phone" placeholder="电话">
                <input name="email" placeholder="邮箱" type="email">
                <input name="address" placeholder="地址">
            </form>
        `, '添加客户');
        
        if (data) {
            try {
                await window.CustomerService.create({
                    ...data,
                    organization_id: window._currentOrg?.id,
                    branch_id: window._currentBranch
                });
                loadCustomers();
                window.Notifications.success('客户添加成功');
            } catch (error) {
                window.Notifications.error('添加客户失败: ' + error.message);
            }
        }
    };

    // 编辑客户
    window.editCustomer = async function(id) {
        const customer = await window.CustomerService.getById(id);
        if (!customer) return;
        
        const data = await window.Modal.form(`
            <form id="customerForm">
                <input name="name" value="${customer.name}" placeholder="姓名" required>
                <input name="phone" value="${customer.phone}" placeholder="电话">
                <input name="email" value="${customer.email}" placeholder="邮箱" type="email">
                <input name="address" value="${customer.address}" placeholder="地址">
            </form>
        `, '编辑客户');
        
        if (data) {
            try {
                await window.CustomerService.update(id, data);
                loadCustomers();
                window.Notifications.success('客户更新成功');
            } catch (error) {
                window.Notifications.error('更新客户失败: ' + error.message);
            }
        }
    };

    // 删除客户
    window.deleteCustomer = async function(id) {
        const confirmed = await window.Modal.confirm('确定要删除此客户吗？');
        if (confirmed) {
            try {
                await window.CustomerService.delete(id);
                loadCustomers();
                window.Notifications.success('客户已删除');
            } catch (error) {
                window.Notifications.error('删除客户失败: ' + error.message);
            }
        }
    };

    // 绑定事件
    function bindEvents() {
        document.querySelector('.btn-add-customer')?.addEventListener('click', window.addCustomer);
        document.querySelector('.btn-refresh')?.addEventListener('click', loadCustomers);
    }

    // 模块加载时初始化
    if (document.querySelector('[data-module="customers"]')) {
        window.initCustomers();
    }

})();