/**
 * @file pos/submodules/cashier.js
 * @description 收银员管理子模块
 */

import { apiClient } from '@services/api-client.js';
import { datatable } from '@components/datatable.js';
import { modal } from '@components/modal.js';

export const meta = {
    name: '收银员管理',
    path: '/pos/cashier',
    icon: 'fa-user',
    permission: 'pos:cashier'
};

export async function render(container) {
    container.innerHTML = `
        <div class="cashier-container">
            <div class="page-header">
                <h1>👤 收银员管理</h1>
                <div class="page-actions">
                    <button class="btn btn-primary" id="addCashier"><i class="fas fa-plus"></i> 添加收银员</button>
                </div>
            </div>
            <div class="card">
                <div class="card-body" id="cashierTable">
                    <div style="text-align:center;padding:20px;"><div class="spinner" style="margin:0 auto;"></div></div>
                </div>
            </div>
        </div>
    `;
    
    const result = await apiClient.get('/users', { params: { role: 'cashier' } });
    const data = result.success ? result.data || [] : [];
    
    const columns = [
        { key: 'name', label: '姓名' },
        { key: 'username', label: '用户名' },
        { key: 'phone', label: '电话' },
        { key: 'status', label: '状态', type: 'status' },
        { key: 'createdAt', label: '入职时间', type: 'datetime' }
    ];
    
    const tableContainer = document.getElementById('cashierTable');
    datatable.render(tableContainer, { columns, data, rowKey: 'id', emptyText: '暂无收银员' });
    
    document.getElementById('addCashier')?.addEventListener('click', () => {
        modal.open({
            title: '添加收银员',
            content: `
                <div class="form-group"><label class="form-label">姓名</label><input type="text" class="form-control" id="cashierName"></div>
                <div class="form-group"><label class="form-label">用户名</label><input type="text" class="form-control" id="cashierUsername"></div>
                <div class="form-group"><label class="form-label">密码</label><input type="password" class="form-control" id="cashierPassword"></div>
                <div class="form-group"><label class="form-label">电话</label><input type="text" class="form-control" id="cashierPhone"></div>
            `,
            buttons: [
                { label: '取消', type: 'secondary' },
                { label: '创建', type: 'primary', onClick: async () => {
                    const name = document.getElementById('cashierName').value.trim();
                    const username = document.getElementById('cashierUsername').value.trim();
                    const password = document.getElementById('cashierPassword').value;
                    const phone = document.getElementById('cashierPhone').value.trim();
                    if (!name || !username || !password) {
                        modal.alert('提示', '请填写完整信息', '知道了', 'warning');
                        return;
                    }
                    await apiClient.post('/users', { name, username, password, phone, role: 'cashier', status: 'active' });
                    modal.alert('成功', '收银员已添加 ✅', '知道了', 'success');
                    render(container);
                }}
            ]
        });
    });
}

export async function init() { console.log('✅ [Cashier] 已初始化'); }
export default { meta, render, init };

