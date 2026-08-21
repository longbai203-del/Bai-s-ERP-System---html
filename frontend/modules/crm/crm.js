/**
 * CRM Module - 客户关系管理
 */

(function() {
    'use strict';

    window.initCRM = function() {
        console.log('🤝 CRM 模块加载完成');
        
        loadActivities();
        loadStats();
        bindEvents();
    };

    // 加载CRM活动
    async function loadActivities() {
        try {
            const activities = await window.CRMService.getAll({
                organization_id: window._currentOrg?.id
            });
            
            renderActivities(activities);
        } catch (error) {
            console.error('加载CRM活动失败:', error);
        }
    }

    // 渲染CRM活动
    function renderActivities(activities) {
        const container = document.querySelector('.crm-list');
        if (!container) return;
        
        container.innerHTML = activities.map(activity => `
            <tr>
                <td>${activity.customers?.name || '-'}</td>
                <td>${activity.type}</td>
                <td>${activity.subject}</td>
                <td><span class="status-${activity.status}">${activity.status}</span></td>
                <td>${activity.assigned_to ? activity.profiles?.full_name : '-'}</td>
                <td>${new Date(activity.activity_date).toLocaleDateString()}</td>
                <td>
                    <button onclick="window.editActivity('${activity.id}')">编辑</button>
                    <button onclick="window.deleteActivity('${activity.id}')">删除</button>
                </td>
            </tr>
        `).join('');
    }

    // 加载统计
    async function loadStats() {
        try {
            const stats = await window.CRMService.getStats({
                organization_id: window._currentOrg?.id
            });
            
            const el = document.querySelector($2); if (el) { el.textContent = stats.total; }
            const el = document.querySelector($2); if (el) { el.textContent = stats.completed; }
            const el = document.querySelector($2); if (el) { el.textContent = stats.pending; }
            const el = document.querySelector($2); if (el) { el.textContent = stats.completionRate?.toFixed(1) + '%'; }
        } catch (error) {
            console.error('加载CRM统计失败:', error);
        }
    }

    // 添加CRM活动
    window.addActivity = async function() {
        // 获取客户列表
        const customers = await window.CustomerService.getAll({
            organization_id: window._currentOrg?.id
        });
        
        const customerOptions = customers.map(c => 
            `<option value="${c.id}">${c.name}</option>`
        ).join('');
        
        const data = await window.Modal.form(`
            <form id="crmForm">
                <select name="customer_id" required>
                    <option value="">选择客户</option>
                    ${customerOptions}
                </select>
                <select name="type" required>
                    <option value="call">电话</option>
                    <option value="meeting">会议</option>
                    <option value="email">邮件</option>
                    <option value="visit">拜访</option>
                    <option value="other">其他</option>
                </select>
                <input name="subject" placeholder="主题" required>
                <textarea name="description" placeholder="描述"></textarea>
                <input name="activity_date" type="date">
                <select name="status">
                    <option value="pending">待处理</option>
                    <option value="completed">已完成</option>
                    <option value="cancelled">已取消</option>
                </select>
            </form>
        `, '添加CRM活动');
        
        if (data) {
            try {
                await window.CRMService.create({
                    ...data,
                    organization_id: window._currentOrg?.id,
                    assigned_to: window._currentUser?.id
                });
                loadActivities();
                loadStats();
                window.Notifications.success('CRM活动添加成功');
            } catch (error) {
                window.Notifications.error('添加失败: ' + error.message);
            }
        }
    };

    // 绑定事件
    function bindEvents() {
        document.querySelector('.btn-add-crm')?.addEventListener('click', window.addActivity);
        document.querySelector('.btn-refresh')?.addEventListener('click', () => {
            loadActivities();
            loadStats();
        });
    }

    // 模块加载时初始化
    if (document.querySelector('[data-module="crm"]')) {
        window.initCRM();
    }

})();

