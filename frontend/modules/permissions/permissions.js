/**
 * Permissions Module - 权限管理
 */

(function() {
    'use strict';

    let permissions = [];

    window.initPermissions = async function() {
        console.log('🛡️ Permissions 模块加载完成');
        await loadPermissions();
        bindEvents();
    };

    async function loadPermissions() {
        try {
            const container = document.getElementById('permissionTableWrapper');
            if (!container) return;

            container.innerHTML = '<div class="loading-placeholder"><div class="spinner"></div><p>加载权限中...</p></div>';

            const client = window.Supabase.getClient();
            const { data, error } = await client
                .from('permissions')
                .select('*')
                .order('resource', { ascending: true });

            if (error) throw error;

            permissions = data || [];
            renderPermissions(container);

        } catch (error) {
            console.error('加载权限失败:', error);
            const container = document.getElementById('permissionTableWrapper');
            if (container) {
                container.innerHTML = `
                    <div style="text-align:center;padding:40px;color:#c33;">
                        <p>加载失败: ${error.message}</p>
                        <button onclick="window.initPermissions()" style="margin-top:12px;padding:8px 20px;background:#667eea;color:#fff;border:none;border-radius:4px;cursor:pointer;">重试</button>
                    </div>
                `;
            }
        }
    }

    function renderPermissions(container) {
        if (!permissions || permissions.length === 0) {
            container.innerHTML = `
                <div style="text-align:center;padding:60px 20px;color:#999;">
                    <div style="font-size:48px;margin-bottom:16px;">🛡️</div>
                    <h3>暂无权限</h3>
                    <p style="margin-top:8px;">点击「新建权限」创建第一个权限</p>
                </div>
            `;
            return;
        }

        // 按资源分组
        const grouped = {};
        for (const p of permissions) {
            const resource = p.resource || '未分类';
            if (!grouped[resource]) grouped[resource] = [];
            grouped[resource].push(p);
        }

        let html = `
            <div style="margin-bottom:16px;color:#666;font-size:14px;">
                共 ${permissions.length} 个权限
            </div>
        `;

        for (const [resource, items] of Object.entries(grouped)) {
            html += `
                <div style="margin-bottom:16px;">
                    <div style="font-weight:600;color:#333;padding:8px 12px;background:#f8f9fa;border-radius:4px;margin-bottom:8px;">
                        📂 ${resource}
                    </div>
                    <div style="display:flex;flex-wrap:wrap;gap:8px;padding:0 12px;">
            `;

            for (const p of items) {
                html += `
                    <div style="display:flex;align-items:center;gap:8px;background:#f5f5f5;padding:4px 12px 4px 16px;border-radius:16px;">
                        <span style="font-size:13px;">${p.action || 'view'}</span>
                        <button onclick="window.deletePermission('${p.id}')" style="background:none;border:none;color:#c33;cursor:pointer;font-size:14px;">×</button>
                    </div>
                `;
            }

            html += `
                    </div>
                </div>
            `;
        }

        container.innerHTML = html;
    }

    window.showCreatePermission = async function() {
        const formHtml = `
            <form id="permissionForm" style="display:flex;flex-direction:column;gap:16px;">
                <div>
                    <label style="display:block;margin-bottom:4px;font-weight:500;">资源名称 *</label>
                    <input type="text" name="resource" placeholder="例如: users, orders, products" required style="width:100%;padding:10px 12px;border:1px solid #ddd;border-radius:6px;font-size:14px;">
                </div>
                <div>
                    <label style="display:block;margin-bottom:4px;font-weight:500;">操作 *</label>
                    <select name="action" required style="width:100%;padding:10px 12px;border:1px solid #ddd;border-radius:6px;font-size:14px;">
                        <option value="view">查看 (view)</option>
                        <option value="create">创建 (create)</option>
                        <option value="update">更新 (update)</option>
                        <option value="delete">删除 (delete)</option>
                        <option value="manage">管理 (manage)</option>
                    </select>
                </div>
                <div>
                    <label style="display:block;margin-bottom:4px;font-weight:500;">描述</label>
                    <input type="text" name="description" placeholder="权限描述" style="width:100%;padding:10px 12px;border:1px solid #ddd;border-radius:6px;font-size:14px;">
                </div>
            </form>
        `;

        const result = await window.Modal.form(formHtml, '🛡️ 新建权限', '创建', '取消');
        if (result) {
            try {
                const client = window.Supabase.getClient();

                // 检查是否已存在
                const { data: existing } = await client
                    .from('permissions')
                    .select('id')
                    .eq('resource', result.resource)
                    .eq('action', result.action)
                    .maybeSingle();

                if (existing) {
                    window.Notifications.warning('该权限已存在');
                    return;
                }

                const { error } = await client
                    .from('permissions')
                    .insert([{
                        resource: result.resource,
                        action: result.action,
                        description: result.description || null,
                        created_at: new Date().toISOString()
                    }]);

                if (error) throw error;

                window.Notifications.success('权限创建成功');
                await loadPermissions();

            } catch (error) {
                window.Notifications.error('创建失败: ' + error.message);
            }
        }
    };

    window.deletePermission = async function(id) {
        const confirmed = await window.Modal.confirm('确定要删除此权限吗？');
        if (confirmed) {
            try {
                const client = window.Supabase.getClient();

                // 检查是否被角色使用
                const { data: used } = await client
                    .from('role_permissions')
                    .select('role_id')
                    .eq('permission_id', id)
                    .limit(1);

                if (used && used.length > 0) {
                    window.Notifications.warning('该权限已被分配给角色，不能删除');
                    return;
                }

                const { error } = await client
                    .from('permissions')
                    .delete()
                    .eq('id', id);

                if (error) throw error;

                window.Notifications.success('权限已删除');
                await loadPermissions();

            } catch (error) {
                window.Notifications.error('删除失败: ' + error.message);
            }
        }
    };

    function bindEvents() {}

    if (document.querySelector('[data-module="permissions"]')) {
        window.initPermissions();
    }

})();
