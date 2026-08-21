/**
 * Fleet Module - 车队管理
 */

(function() {
    'use strict';

    window.initFleet = function() {
        console.log('🚗 Fleet 模块加载完成');
        
        loadVehicles();
        loadStats();
        bindEvents();
    };

    // 加载车辆
    async function loadVehicles() {
        try {
            const vehicles = await window.VehicleService.getAll({
                organization_id: window._currentOrg?.id
            });
            
            renderVehicles(vehicles);
        } catch (error) {
            console.error('加载车辆失败:', error);
        }
    }

    // 渲染车辆
    function renderVehicles(vehicles) {
        const container = document.querySelector('.fleet-list');
        if (!container) return;
        
        container.innerHTML = vehicles.map(vehicle => `
            <tr>
                <td>${vehicle.vehicle_code}</td>
                <td>${vehicle.plate_number}</td>
                <td>${vehicle.brand} ${vehicle.model}</td>
                <td>${vehicle.year}</td>
                <td><span class="status-${vehicle.status}">${vehicle.status}</span></td>
                <td>
                    <button onclick="window.editVehicle('${vehicle.id}')">编辑</button>
                    <button onclick="window.deleteVehicle('${vehicle.id}')">删除</button>
                </td>
            </tr>
        `).join('');
    }

    // 加载统计
    async function loadStats() {
        try {
            const stats = await window.VehicleService.getStats(window._currentOrg?.id);
            
            const el = document.querySelector($2); if (el) { el.textContent = stats.total; }
            const el = document.querySelector($2); if (el) { el.textContent = stats.active; }
            const el = document.querySelector($2); if (el) { el.textContent = stats.maintenance; }
        } catch (error) {
            console.error('加载车辆统计失败:', error);
        }
    }

    // 添加车辆
    window.addVehicle = async function() {
        // 获取客户列表（用于关联）
        const customers = await window.CustomerService.getAll({
            organization_id: window._currentOrg?.id
        });
        
        const customerOptions = customers.map(c => 
            `<option value="${c.id}">${c.name}</option>`
        ).join('');
        
        const data = await window.Modal.form(`
            <form id="vehicleForm">
                <input name="plate_number" placeholder="车牌号" required>
                <input name="brand" placeholder="品牌" required>
                <input name="model" placeholder="型号" required>
                <input name="year" type="number" placeholder="年份">
                <input name="color" placeholder="颜色">
                <select name="customer_id">
                    <option value="">选择客户（可选）</option>
                    ${customerOptions}
                </select>
                <select name="status">
                    <option value="active">运营中</option>
                    <option value="maintenance">维修中</option>
                    <option value="inactive">已停用</option>
                </select>
            </form>
        `, '添加车辆');
        
        if (data) {
            try {
                await window.VehicleService.create({
                    ...data,
                    organization_id: window._currentOrg?.id,
                    branch_id: window._currentBranch
                });
                loadVehicles();
                loadStats();
                window.Notifications.success('车辆添加成功');
            } catch (error) {
                window.Notifications.error('添加车辆失败: ' + error.message);
            }
        }
    };

    // 编辑车辆
    window.editVehicle = async function(id) {
        const vehicle = await window.VehicleService.getById(id);
        if (!vehicle) return;
        
        const customers = await window.CustomerService.getAll({
            organization_id: window._currentOrg?.id
        });
        
        const customerOptions = customers.map(c => 
            `<option value="${c.id}" ${c.id === vehicle.customer_id ? 'selected' : ''}>${c.name}</option>`
        ).join('');
        
        const data = await window.Modal.form(`
            <form id="vehicleForm">
                <input name="plate_number" value="${vehicle.plate_number}" placeholder="车牌号" required>
                <input name="brand" value="${vehicle.brand}" placeholder="品牌" required>
                <input name="model" value="${vehicle.model}" placeholder="型号" required>
                <input name="year" type="number" value="${vehicle.year}" placeholder="年份">
                <input name="color" value="${vehicle.color}" placeholder="颜色">
                <select name="customer_id">
                    <option value="">选择客户（可选）</option>
                    ${customerOptions}
                </select>
                <select name="status">
                    <option value="active" ${vehicle.status === 'active' ? 'selected' : ''}>运营中</option>
                    <option value="maintenance" ${vehicle.status === 'maintenance' ? 'selected' : ''}>维修中</option>
                    <option value="inactive" ${vehicle.status === 'inactive' ? 'selected' : ''}>已停用</option>
                </select>
            </form>
        `, '编辑车辆');
        
        if (data) {
            try {
                await window.VehicleService.update(id, data);
                loadVehicles();
                loadStats();
                window.Notifications.success('车辆更新成功');
            } catch (error) {
                window.Notifications.error('更新车辆失败: ' + error.message);
            }
        }
    };

    // 删除车辆
    window.deleteVehicle = async function(id) {
        const confirmed = await window.Modal.confirm('确定要删除此车辆吗？');
        if (confirmed) {
            try {
                await window.VehicleService.delete(id);
                loadVehicles();
                loadStats();
                window.Notifications.success('车辆已删除');
            } catch (error) {
                window.Notifications.error('删除车辆失败: ' + error.message);
            }
        }
    };

    // 绑定事件
    function bindEvents() {
        document.querySelector('.btn-add-fleet')?.addEventListener('click', window.addVehicle);
        document.querySelector('.btn-refresh')?.addEventListener('click', () => {
            loadVehicles();
            loadStats();
        });
    }

    // 模块加载时初始化
    if (document.querySelector('[data-module="fleet"]')) {
        window.initFleet();
    }

})();


