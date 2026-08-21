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

    async function loadVehicles() {
        try {
            var vehicles = await window.VehicleService.getAll({
                organization_id: window._currentOrg?.id
            });
            renderVehicles(vehicles);
        } catch (error) {
            console.error('加载车辆失败:', error);
        }
    }

    function renderVehicles(vehicles) {
        var container = document.querySelector('.fleet-list');
        if (!container) return;
        container.innerHTML = vehicles.map(function(v) {
            return '<tr><td>' + (v.vehicle_code || '-') + '</td><td>' + (v.plate_number || '-') + '</td><td>' + (v.brand || '') + ' ' + (v.model || '') + '</td><td>' + (v.year || '-') + '</td><td><span class="status-' + v.status + '">' + (v.status || 'active') + '</span></td><td><button onclick="window.editVehicle(\'' + v.id + '\')">编辑</button><button onclick="window.deleteVehicle(\'' + v.id + '\')">删除</button></td></tr>';
        }).join('');
    }

    async function loadStats() {
        try {
            var stats = await window.VehicleService.getStats(window._currentOrg?.id);
            var el = document.querySelector('.fleet-total');
            if (el) { el.textContent = stats.total || 0; }
            var el2 = document.querySelector('.fleet-active');
            if (el2) { el2.textContent = stats.active || 0; }
            var el3 = document.querySelector('.fleet-maintenance');
            if (el3) { el3.textContent = stats.maintenance || 0; }
        } catch (error) {
            console.error('加载车辆统计失败:', error);
        }
    }

    window.addVehicle = async function() {
        var customers = await window.CustomerService.getAll({
            organization_id: window._currentOrg?.id
        });
        var customerOptions = customers.map(function(c) {
            return '<option value="' + c.id + '">' + c.name + '</option>';
        }).join('');
        var data = await window.Modal.form('<form id="vehicleForm"><input name="plate_number" placeholder="车牌号" required><input name="brand" placeholder="品牌" required><input name="model" placeholder="型号" required><input name="year" type="number" placeholder="年份"><input name="color" placeholder="颜色"><select name="customer_id"><option value="">选择客户（可选）</option>' + customerOptions + '</select><select name="status"><option value="active">运营中</option><option value="maintenance">维修中</option><option value="inactive">已停用</option></select></form>', '添加车辆');
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

    window.editVehicle = async function(id) {
        var vehicle = await window.VehicleService.getById(id);
        if (!vehicle) return;
        var customers = await window.CustomerService.getAll({
            organization_id: window._currentOrg?.id
        });
        var customerOptions = customers.map(function(c) {
            return '<option value="' + c.id + '" ' + (c.id === vehicle.customer_id ? 'selected' : '') + '>' + c.name + '</option>';
        }).join('');
        var data = await window.Modal.form('<form id="vehicleForm"><input name="plate_number" value="' + (vehicle.plate_number || '') + '" placeholder="车牌号" required><input name="brand" value="' + (vehicle.brand || '') + '" placeholder="品牌" required><input name="model" value="' + (vehicle.model || '') + '" placeholder="型号" required><input name="year" type="number" value="' + (vehicle.year || '') + '" placeholder="年份"><input name="color" value="' + (vehicle.color || '') + '" placeholder="颜色"><select name="customer_id"><option value="">选择客户（可选）</option>' + customerOptions + '</select><select name="status"><option value="active" ' + (vehicle.status === 'active' ? 'selected' : '') + '>运营中</option><option value="maintenance" ' + (vehicle.status === 'maintenance' ? 'selected' : '') + '>维修中</option><option value="inactive" ' + (vehicle.status === 'inactive' ? 'selected' : '') + '>已停用</option></select></form>', '编辑车辆');
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

    window.deleteVehicle = async function(id) {
        var confirmed = await window.Modal.confirm('确定要删除此车辆吗？');
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

    function bindEvents() {
        document.querySelector('.btn-add-fleet')?.addEventListener('click', window.addVehicle);
        document.querySelector('.btn-refresh')?.addEventListener('click', function() {
            loadVehicles();
            loadStats();
        });
    }

    if (document.querySelector('[data-module="fleet"]')) {
        window.initFleet();
    }

})();
