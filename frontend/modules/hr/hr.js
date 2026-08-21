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

    // 加载员工
    async function loadEmployees() {
        try {
            const employees = await window.EmployeeService.getAll({
                organization_id: window._currentOrg?.id
            });
            
            renderEmployees(employees);
        } catch (error) {
            console.error('加载员工失败:', error);
        }
    }

    // 渲染员工
    function renderEmployees(employees) {
        const container = document.querySelector('.employees-list');
        if (!container) return;
        
        container.innerHTML = employees.map(emp => `
            <tr>
                <td>${emp.employee_code}</td>
                <td>${emp.full_name}</td>
                <td>${emp.role}</td>
                <td>${emp.phone}</td>
                <td><span class="status-${emp.status}">${emp.status}</span></td>
                <td>
                    <button onclick="window.editEmployee('${emp.id}')">编辑</button>
                    <button onclick="window.deleteEmployee('${emp.id}')">删除</button>
                </td>
            </tr>
        `).join('');
    }

    // 加载考勤
        function loadAttendance() {
        try {
            var stats = await window.AttendanceService.getStats({
                organization_id: window._currentOrg?.id
            });
            var el = document.querySelector('.attendance-rate');
            if (el) { el.textContent = stats.attendanceRate?.toFixed(1) + '%'; }
            var el2 = document.querySelector('.attendance-present');
            if (el2) { el2.textContent = stats.present; }
            var el3 = document.querySelector('.attendance-late');
            if (el3) { el3.textContent = stats.late; }
            var el4 = document.querySelector('.attendance-absent');
            if (el4) { el4.textContent = stats.absent; }
        } catch (error) {
            console.error('加载考勤失败:', error);
        }
    });
            
            const el = document.querySelector($2); if (el) { el.textContent = stats.attendanceRate?.toFixed(1) + '%'; }
            const el = document.querySelector($2); if (el) { el.textContent = stats.present; }
            const el = document.querySelector($2); if (el) { el.textContent = stats.late; }
            const el = document.querySelector($2); if (el) { el.textContent = stats.absent; }
        } catch (error) {
            console.error('加载考勤失败:', error);
        }
    }

    // 添加员工
    window.addEmployee = async function() {
        const data = await window.Modal.form(`
            <form id="employeeForm">
                <input name="full_name" placeholder="姓名" required>
                <input name="email" placeholder="邮箱" type="email" required>
                <input name="phone" placeholder="电话">
                <input name="role" placeholder="角色">
                <input name="hire_date" type="date">
                <select name="status">
                    <option value="active">在职</option>
                    <option value="inactive">离职</option>
                </select>
            </form>
        `, '添加员工');
        
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

    // 绑定事件
    function bindEvents() {
        document.querySelector('.btn-add-employee')?.addEventListener('click', window.addEmployee);
        document.querySelector('.btn-refresh')?.addEventListener('click', () => {
            loadEmployees();
            loadAttendance();
        });
    }

    // 模块加载时初始化
    if (document.querySelector('[data-module="hr"]')) {
        window.initHR();
    }

})();





