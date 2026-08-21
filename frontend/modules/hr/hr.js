/**
 * HR Module - 人力资源管理
 */

(function() {
    'use strict';

    window.initHR = function() {
        console.log('👔 HR 模块加载完成');
        loadEmployees();
        loadAttendance();
        bindEvents();
    };

    async function loadEmployees() {
        try {
            var employees = await window.EmployeeService.getAll({
                organization_id: window._currentOrg?.id
            });
            renderEmployees(employees);
        } catch (error) {
            console.error('加载员工失败:', error);
        }
    }

    function renderEmployees(employees) {
        var container = document.querySelector('.employees-list');
        if (!container) return;
        container.innerHTML = employees.map(function(emp) {
            return '<tr><td>' + (emp.employee_code || '-') + '</td><td>' + (emp.full_name || '-') + '</td><td>' + (emp.role || '-') + '</td><td>' + (emp.phone || '-') + '</td><td><span class="status-' + emp.status + '">' + (emp.status || 'active') + '</span></td><td><button onclick="window.editEmployee(\'' + emp.id + '\')">编辑</button><button onclick="window.deleteEmployee(\'' + emp.id + '\')">删除</button></td></tr>';
        }).join('');
    }

    async function loadAttendance() {
        try {
            var stats = await window.AttendanceService.getStats({
                organization_id: window._currentOrg?.id
            });
            var el = document.querySelector('.attendance-rate');
            if (el) { el.textContent = (stats.attendanceRate || 0).toFixed(1) + '%'; }
            var el2 = document.querySelector('.attendance-present');
            if (el2) { el2.textContent = stats.present || 0; }
            var el3 = document.querySelector('.attendance-late');
            if (el3) { el3.textContent = stats.late || 0; }
            var el4 = document.querySelector('.attendance-absent');
            if (el4) { el4.textContent = stats.absent || 0; }
        } catch (error) {
            console.error('加载考勤失败:', error);
        }
    }

    window.addEmployee = async function() {
        var data = await window.Modal.form('<form id="employeeForm"><input name="full_name" placeholder="姓名" required><input name="email" placeholder="邮箱" type="email" required><input name="phone" placeholder="电话"><input name="role" placeholder="角色"><input name="hire_date" type="date"><select name="status"><option value="active">在职</option><option value="inactive">离职</option></select></form>', '添加员工');
        if (data) {
            try {
                await window.EmployeeService.create({
                    ...data,
                    organization_id: window._currentOrg?.id,
                    branch_id: window._currentBranch
                });
                loadEmployees();
                window.Notifications.success('员工添加成功');
            } catch (error) {
                window.Notifications.error('添加员工失败: ' + error.message);
            }
        }
    };

    function bindEvents() {
        document.querySelector('.btn-add-employee')?.addEventListener('click', window.addEmployee);
        document.querySelector('.btn-refresh')?.addEventListener('click', function() {
            loadEmployees();
            loadAttendance();
        });
    }

    if (document.querySelector('[data-module="hr"]')) {
        window.initHR();
    }

})();
