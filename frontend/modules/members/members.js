/**
 * Members Module - 会员管理
 */

(function() {
    'use strict';

    window.initMembers = function() {
        console.log('💎 Members 模块加载完成');
        
        loadMembers();
        bindEvents();
    };

    // 加载会员列表
    async function loadMembers() {
        try {
            const members = await window.MemberService.getAll({
                organization_id: window._currentOrg?.id
            });
            
            renderMembers(members);
        } catch (error) {
            console.error('加载会员失败:', error);
        }
    }

    // 渲染会员列表
    function renderMembers(members) {
        const container = document.querySelector('.members-list');
        if (!container) return;
        
        container.innerHTML = members.map(member => `
            <tr>
                <td>${member.membership_number}</td>
                <td>${member.customers?.name}</td>
                <td>${member.member_type}</td>
                <td>${new Date(member.start_date).toLocaleDateString()}</td>
                <td>${new Date(member.end_date).toLocaleDateString()}</td>
                <td><span class="status-${member.status}">${member.status}</span></td>
                <td>
                    <button onclick="window.editMember('${member.id}')">编辑</button>
                    <button onclick="window.renewMember('${member.id}')">续费</button>
                </td>
            </tr>
        `).join('');
    }

    // 添加会员
    window.addMember = async function() {
        // 获取客户列表
        const customers = await window.CustomerService.getAll({
            organization_id: window._currentOrg?.id
        });
        
        const customerOptions = customers.map(c => 
            `<option value="${c.id}">${c.name} (${c.phone})</option>`
        ).join('');
        
        const data = await window.Modal.form(`
            <form id="memberForm">
                <select name="customer_id" required>
                    <option value="">选择客户</option>
                    ${customerOptions}
                </select>
                <select name="member_type">
                    <option value="gold">黄金会员</option>
                    <option value="silver">白银会员</option>
                    <option value="bronze">青铜会员</option>
                </select>
                <input name="duration_months" type="number" value="12" placeholder="会员月数">
                <input name="start_date" type="date">
            </form>
        `, '添加会员');
        
        if (data) {
            try {
                await window.MemberService.create({
                    ...data,
                    organization_id: window._currentOrg?.id,
                    branch_id: window._currentBranch
                });
                loadMembers();
                window.Notifications.success('会员添加成功');
            } catch (error) {
                window.Notifications.error('添加会员失败: ' + error.message);
            }
        }
    };

    // 续费会员
    window.renewMember = async function(id) {
        const data = await window.Modal.form(`
            <form id="renewForm">
                <input name="months" type="number" value="12" placeholder="续费月数" required>
            </form>
        `, '会员续费');
        
        if (data) {
            try {
                await window.MemberService.renew(id, parseInt(data.months));
                loadMembers();
                window.Notifications.success('会员续费成功');
            } catch (error) {
                window.Notifications.error('续费失败: ' + error.message);
            }
        }
    };

    // 绑定事件
    function bindEvents() {
        document.querySelector('.btn-add-member')?.addEventListener('click', window.addMember);
        document.querySelector('.btn-refresh')?.addEventListener('click', loadMembers);
    }

    // 模块加载时初始化
    if (document.querySelector('[data-module="members"]')) {
        window.initMembers();
    }

})();