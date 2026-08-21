/**
 * Employee Module - 员工管理
 */

(function() {
    'use strict';

    let employees = [];

    window.initEmployee = async function() {
        console.log('👔 Employee 模块加载完成');
        await loadEmployees();
        bindEvents();
    };

    async function loadEmployees() {
        try {
            var container = document.getElementById('employeeTableWrapper');
            if (!container) return;

            container.innerHTML = '<div class="loading-placeholder"><div class="spinner"></div><p>加载员工中...</p></div>';

            var client = window.Supabase.getClient();
            var result = await client
                .from('employees')
                .select('*')
                .order('created_at', { ascending: false });

            if (result.error) throw result.error;

            employees = result.data || [];
            renderEmployees(container);

        } catch (error) {
            console.error('加载员工失败:', error);
            var container = document.getElementById('employeeTableWrapper');
            if (container) {
                container.innerHTML = '<div style="text-align:center;padding:40px;color:#c33;"><p>加载失败: ' + error.message + '</p><button onclick="window.initEmployee()" style="margin-top:12px;padding:8px 20px;background:#667eea;color:#fff;border:none;border-radius:4px;cursor:pointer;">重试</button></div>';
            }
        }
    }

    function renderEmployees(container) {
        if (!employees || employees.length === 0) {
            container.innerHTML = '<div style="text-align:center;padding:60px 20px;color:#999;"><div style="font-size:48px;margin-bottom:16px;">👔</div><h3>暂无员工</h3><p style="margin-top:8px;">点击「新建员工」创建第一个员工</p></div>';
            return;
        }

        var html = '<div style="margin-bottom:16px;color:#666;font-size:14px;">共 ' + employees.length + ' 个员工</div>';
        html += '<table style="width:100%;border-collapse:collapse;background:#fff;border-radius:8px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.06);"><thead><tr style="background:#f8f9fa;"><th style="padding:12px 16px;text-align:left;">姓名</th><th style="padding:12px 16px;text-align:left;">工号</th><th style="padding:12px 16px;text-align:left;">职位</th><th style="padding:12px 16px;text-align:left;">电话</th><th style="padding:12px 16px;text-align:left;">状态</th><th style="padding:12px 16px;text-align:center;">操作</th></tr></thead><tbody>';

        for (var i = 0; i < employees.length; i++) {
            var e = employees[i];
            html += '<tr style="border-bottom:1px solid #f0f0f0;"><td style="padding:12px 16px;font-weight:500;">' + (e.full_name || '-') + '</td><td style="padding:12px 16px;color:#666;">' + (e.employee_code || '-') + '</td><td style="padding:12px 16px;color:#666;">' + (e.position || '-') + '</td><td style="padding:12px 16px;color:#666;">' + (e.phone || '-') + '</td><td style="padding:12px 16px;"><span class="' + getStatusClass(e.status) + '">' + (e.status || 'active') + '</span></td><td style="padding:12px 16px;text-align:center;"><button class="btn-edit" onclick="window.editEmployee(\'' + e.id + '\')" style="padding:4px 12px;border:none;border-radius:4px;background:#e3f2fd;color:#1976d2;cursor:pointer;">编辑</button><button class="btn-delete" onclick="window.deleteEmployee(\'' + e.id + '\')" style="padding:4px 12px;border:none;border-radius:4px;background:#fce4ec;color:#c62828;cursor:pointer;margin-left:4px;">删除</button></td></tr>';
        }

        html += '</tbody></table>';
        container.innerHTML = html;
    }

    window.showCreateEmployee = async function() {
        var formHtml = '<form id="employeeForm" style="display:flex;flex-direction:column;gap:16px;"><div><label style="display:block;margin-bottom:4px;font-weight:500;">姓名 *</label><input type="text" name="full_name" placeholder="请输入姓名" required style="width:100%;padding:10px 12px;border:1px solid #ddd;border-radius:6px;font-size:14px;"></div><div><label style="display:block;margin-bottom:4px;font-weight:500;">工号</label><input type="text" name="employee_code" placeholder="请输入工号" style="width:100%;padding:10px 12px;border:1px solid #ddd;border-radius:6px;font-size:14px;"></div><div><label style="display:block;margin-bottom:4px;font-weight:500;">职位</label><input type="text" name="position" placeholder="请输入职位" style="width:100%;padding:10px 12px;border:1px solid #ddd;border-radius:6px;font-size:14px;"></div><div><label style="display:block;margin-bottom:4px;font-weight:500;">电话</label><input type="text" name="phone" placeholder="请输入电话" style="width:100%;padding:10px 12px;border:1px solid #ddd;border-radius:6px;font-size:14px;"></div></form>';

        var result = await window.Modal.form(formHtml, '👔 新建员工', '创建', '取消');
        if (result) {
            try {
                var client = window.Supabase.getClient();
                var insertResult = await client
                    .from('employees')
                    .insert([{
                        full_name: result.full_name,
                        employee_code: result.employee_code || 'EMP' + Date.now().toString().slice(-4),
                        position: result.position || null,
                        phone: result.phone || null,
                        status: 'active'
                    }]);

                if (insertResult.error) throw insertResult.error;

                window.Notifications.success('员工创建成功');
                await loadEmployees();

            } catch (error) {
                window.Notifications.error('创建失败: ' + error.message);
            }
        }
    };

    function bindEvents() {}

    if (document.querySelector('[data-module="employee"]')) {
        window.initEmployee();
    }

})();
