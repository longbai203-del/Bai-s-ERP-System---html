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

    async function loadActivities() {
        try {
            var activities = await window.CRMService.getAll({
                organization_id: window._currentOrg?.id
            });
            renderActivities(activities);
        } catch (error) {
            console.error('加载CRM活动失败:', error);
        }
    }

    function renderActivities(activities) {
        var container = document.querySelector('.crm-list');
        if (!container) return;
        
        if (!activities || activities.length === 0) {
            container.innerHTML = '<div style="text-align:center;padding:40px;color:#999;">暂无CRM活动</div>';
            return;
        }
        
        var html = '';
        for (var i = 0; i < activities.length; i++) {
            var activity = activities[i];
            html += '<tr><td>' + (activity.customers?.name || '-') + '</td><td>' + (activity.type || '-') + '</td><td>' + (activity.subject || '-') + '</td><td><span class="status-' + activity.status + '">' + (activity.status || 'pending') + '</span></td><td>' + (activity.assigned_to ? activity.profiles?.full_name : '-') + '</td><td>' + new Date(activity.activity_date).toLocaleDateString() + '</td><td><button onclick="window.editActivity(\'' + activity.id + '\')">编辑</button><button onclick="window.deleteActivity(\'' + activity.id + '\')">删除</button></td></tr>';
        }
        container.innerHTML = '<table><thead><tr><th>客户</th><th>类型</th><th>主题</th><th>状态</th><th>负责人</th><th>日期</th><th>操作</th></tr></thead><tbody>' + html + '</tbody></table>';
    }

    async function loadStats() {
        try {
            var stats = await window.CRMService.getStats({
                organization_id: window._currentOrg?.id
            });
            var el = document.querySelector('.crm-total');
            if (el) { el.textContent = stats.total || 0; }
            var el2 = document.querySelector('.crm-completed');
            if (el2) { el2.textContent = stats.completed || 0; }
            var el3 = document.querySelector('.crm-pending');
            if (el3) { el3.textContent = stats.pending || 0; }
            var el4 = document.querySelector('.crm-rate');
            if (el4) { el4.textContent = (stats.completionRate || 0).toFixed(1) + '%'; }
        } catch (error) {
            console.error('加载CRM统计失败:', error);
        }
    }

    window.addActivity = async function() {
        var customers = await window.CustomerService.getAll({
            organization_id: window._currentOrg?.id
        });
        var customerOptions = '';
        for (var i = 0; i < customers.length; i++) {
            customerOptions += '<option value="' + customers[i].id + '">' + customers[i].name + '</option>';
        }
        var data = await window.Modal.form('<form id="crmForm"><select name="customer_id" required><option value="">选择客户</option>' + customerOptions + '</select><select name="type" required><option value="call">电话</option><option value="meeting">会议</option><option value="email">邮件</option><option value="visit">拜访</option><option value="other">其他</option></select><input name="subject" placeholder="主题" required><textarea name="description" placeholder="描述"></textarea><input name="activity_date" type="date"><select name="status"><option value="pending">待处理</option><option value="completed">已完成</option><option value="cancelled">已取消</option></select></form>', '添加CRM活动');
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

    function bindEvents() {
        var addBtn = document.querySelector('.btn-add-crm');
        if (addBtn) {
            addBtn.addEventListener('click', window.addActivity);
        }
        var refreshBtn = document.querySelector('.btn-refresh');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', function() {
                loadActivities();
                loadStats();
            });
        }
    }

    if (document.querySelector('[data-module="crm"]')) {
        window.initCRM();
    }

})();
