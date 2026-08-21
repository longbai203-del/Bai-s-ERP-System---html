/**
 * Branches Module - 分支/门店管理
 */

(function() {
    'use strict';

    let branches = [];
    let organizations = [];

    window.initBranches = async function() {
        console.log('🏪 Branches 模块加载完成');
        await loadBranches();
        bindEvents();
    };

    async function loadBranches() {
        try {
            const container = document.getElementById('branchTableWrapper');
            if (!container) return;

            container.innerHTML = '<div class="loading-placeholder"><div class="spinner"></div><p>加载分支中...</p></div>';

            const client = window.Supabase.getClient();

            // 加载组织列表（用于显示组织名称）
            const { data: orgData, error: orgError } = await client
                .from('organizations')
                .select('id, name');

            if (orgError) throw orgError;
            organizations = orgData || [];

            // 加载分支列表
            const { data, error } = await client
                .from('branches')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;

            branches = data || [];
            renderBranches(container);

        } catch (error) {
            console.error('加载分支失败:', error);
            const container = document.getElementById('branchTableWrapper');
            if (container) {
                container.innerHTML = `
                    <div style="text-align:center;padding:40px;color:#c33;">
                        <p>加载失败: ${error.message}</p>
                        <button onclick="window.initBranches()" style="margin-top:12px;padding:8px 20px;background:#667eea;color:#fff;border:none;border-radius:4px;cursor:pointer;">重试</button>
                    </div>
                `;
            }
        }
    }

    function renderBranches(container) {
        if (!branches || branches.length === 0) {
            container.innerHTML = `
                <div style="text-align:center;padding:60px 20px;color:#999;">
                    <div style="font-size:48px;margin-bottom:16px;">🏪</div>
                    <h3>暂无分支</h3>
                    <p style="margin-top:8px;">点击「新建分支」创建第一个分支</p>
                </div>
            `;
            return;
        }

        // 创建组织名称映射
        const orgMap = {};
        organizations.forEach(o => orgMap[o.id] = o.name);

        let html = `
            <div style="margin-bottom:16px;color:#666;font-size:14px;">
                共 ${branches.length} 个分支
            </div>
            <table style="width:100%;border-collapse:collapse;background:#fff;border-radius:8px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.06);">
                <thead>
                    <tr style="background:#f8f9fa;">
                        <th style="padding:12px 16px;text-align:left;font-weight:600;color:#555;">分支名称</th>
                        <th style="padding:12px 16px;text-align:left;font-weight:600;color:#555;">编码</th>
                        <th style="padding:12px 16px;text-align:left;font-weight:600;color:#555;">所属组织</th>
                        <th style="padding:12px 16px;text-align:left;font-weight:600;color:#555;">电话</th>
                        <th style="padding:12px 16px;text-align:left;font-weight:600;color:#555;">状态</th>
                        <th style="padding:12px 16px;text-align:center;font-weight:600;color:#555;">操作</th>
                    </tr>
                </thead>
                <tbody>
        `;

        for (const branch of branches) {
            const statusMap = {
                active: '<span class="org-status active">● 启用</span>',
                inactive: '<span class="org-status inactive">○ 停用</span>'
            };

            html += `
                <tr style="border-bottom:1px solid #f0f0f0;">
                    <td style="padding:12px 16px;font-weight:500;">${branch.name}</td>
                    <td style="padding:12px 16px;color:#666;">${branch.code || '-'}</td>
                    <td style="padding:12px 16px;color:#666;">${orgMap[branch.organization_id] || '未分配'}</td>
                    <td style="padding:12px 16px;color:#666;">${branch.phone || '-'}</td>
                    <td style="padding:12px 16px;">${statusMap[branch.status] || statusMap.active}</td>
                    <td style="padding:12px 16px;text-align:center;">
                        <button class="btn-edit" onclick="window.editBranch('${branch.id}')" style="padding:4px 12px;border:none;border-radius:4px;background:#e3f2fd;color:#1976d2;cursor:pointer;">编辑</button>
                        <button class="btn-delete" onclick="window.deleteBranch('${branch.id}')" style="padding:4px 12px;border:none;border-radius:4px;background:#fce4ec;color:#c62828;cursor:pointer;margin-left:4px;">删除</button>
                    </td>
                </tr>
            `;
        }

        html += '</tbody></table>';
        container.innerHTML = html;
    }

    // 创建分支
    window.showCreateBranch = async function() {
        // 获取组织列表
        const client = window.Supabase.getClient();
        const { data: orgs, error } = await client
            .from('organizations')
            .select('id, name')
            .eq('status', 'active');

        if (error) {
            window.Notifications.error('加载组织列表失败');
            return;
        }

        const orgOptions = orgs.map(o => `<option value="${o.id}">${o.name}</option>`).join('');

        const formHtml = `
            <form id="branchForm" style="display:flex;flex-direction:column;gap:16px;">
                <div>
                    <label style="display:block;margin-bottom:4px;font-weight:500;">所属组织 *</label>
                    <select name="organization_id" required style="width:100%;padding:10px 12px;border:1px solid #ddd;border-radius:6px;font-size:14px;">
                        <option value="">请选择组织</option>
                        ${orgOptions}
                    </select>
                </div>
                <div>
                    <label style="display:block;margin-bottom:4px;font-weight:500;">分支名称 *</label>
                    <input type="text" name="name" placeholder="请输入分支名称" required style="width:100%;padding:10px 12px;border:1px solid #ddd;border-radius:6px;font-size:14px;">
                </div>
                <div>
                    <label style="display:block;margin-bottom:4px;font-weight:500;">分支编码</label>
                    <input type="text" name="code" placeholder="请输入分支编码" style="width:100%;padding:10px 12px;border:1px solid #ddd;border-radius:6px;font-size:14px;">
                </div>
                <div>
                    <label style="display:block;margin-bottom:4px;font-weight:500;">电话</label>
                    <input type="text" name="phone" placeholder="请输入电话" style="width:100%;padding:10px 12px;border:1px solid #ddd;border-radius:6px;font-size:14px;">
                </div>
                <div>
                    <label style="display:block;margin-bottom:4px;font-weight:500;">地址</label>
                    <input type="text" name="address" placeholder="请输入地址" style="width:100%;padding:10px 12px;border:1px solid #ddd;border-radius:6px;font-size:14px;">
                </div>
                <div>
                    <label style="display:block;margin-bottom:4px;font-weight:500;">状态</label>
                    <select name="status" style="width:100%;padding:10px 12px;border:1px solid #ddd;border-radius:6px;font-size:14px;">
                        <option value="active">启用</option>
                        <option value="inactive">停用</option>
                    </select>
                </div>
            </form>
        `;

        const result = await window.Modal.form(formHtml, '🏪 新建分支', '创建', '取消');
        if (result) {
            try {
                const { data, error } = await client
                    .from('branches')
                    .insert([{
                        organization_id: result.organization_id,
                        name: result.name,
                        code: result.code || 'BR' + Date.now().toString().slice(-6),
                        phone: result.phone || null,
                        address: result.address || null,
                        status: result.status || 'active',
                        created_at: new Date().toISOString()
                    }])
                    .select()
                    .single();

                if (error) throw error;

                window.Notifications.success('分支创建成功');
                await loadBranches();

            } catch (error) {
                window.Notifications.error('创建失败: ' + error.message);
            }
        }
    };

    // 编辑分支
    window.editBranch = async function(id) {
        const branch = branches.find(b => b.id === id);
        if (!branch) return;

        const client = window.Supabase.getClient();
        const { data: orgs } = await client
            .from('organizations')
            .select('id, name')
            .eq('status', 'active');

        const orgOptions = (orgs || []).map(o =>
            `<option value="${o.id}" ${o.id === branch.organization_id ? 'selected' : ''}>${o.name}</option>`
        ).join('');

        const formHtml = `
            <form id="branchForm" style="display:flex;flex-direction:column;gap:16px;">
                <div>
                    <label style="display:block;margin-bottom:4px;font-weight:500;">所属组织 *</label>
                    <select name="organization_id" required style="width:100%;padding:10px 12px;border:1px solid #ddd;border-radius:6px;font-size:14px;">
                        ${orgOptions}
                    </select>
                </div>
                <div>
                    <label style="display:block;margin-bottom:4px;font-weight:500;">分支名称 *</label>
                    <input type="text" name="name" value="${branch.name}" required style="width:100%;padding:10px 12px;border:1px solid #ddd;border-radius:6px;font-size:14px;">
                </div>
                <div>
                    <label style="display:block;margin-bottom:4px;font-weight:500;">分支编码</label>
                    <input type="text" name="code" value="${branch.code || ''}" style="width:100%;padding:10px 12px;border:1px solid #ddd;border-radius:6px;font-size:14px;">
                </div>
                <div>
                    <label style="display:block;margin-bottom:4px;font-weight:500;">电话</label>
                    <input type="text" name="phone" value="${branch.phone || ''}" style="width:100%;padding:10px 12px;border:1px solid #ddd;border-radius:6px;font-size:14px;">
                </div>
                <div>
                    <label style="display:block;margin-bottom:4px;font-weight:500;">地址</label>
                    <input type="text" name="address" value="${branch.address || ''}" style="width:100%;padding:10px 12px;border:1px solid #ddd;border-radius:6px;font-size:14px;">
                </div>
                <div>
                    <label style="display:block;margin-bottom:4px;font-weight:500;">状态</label>
                    <select name="status" style="width:100%;padding:10px 12px;border:1px solid #ddd;border-radius:6px;font-size:14px;">
                        <option value="active" ${branch.status === 'active' ? 'selected' : ''}>启用</option>
                        <option value="inactive" ${branch.status === 'inactive' ? 'selected' : ''}>停用</option>
                    </select>
                </div>
            </form>
        `;

        const result = await window.Modal.form(formHtml, '✏️ 编辑分支', '保存', '取消');
        if (result) {
            try {
                const { data, error } = await client
                    .from('branches')
                    .update({
                        organization_id: result.organization_id,
                        name: result.name,
                        code: result.code,
                        phone: result.phone,
                        address: result.address,
                        status: result.status,
                        updated_at: new Date().toISOString()
                    })
                    .eq('id', id)
                    .select()
                    .single();

                if (error) throw error;

                window.Notifications.success('分支更新成功');
                await loadBranches();

            } catch (error) {
                window.Notifications.error('更新失败: ' + error.message);
            }
        }
    };

    // 删除分支
    window.deleteBranch = async function(id) {
        const confirmed = await window.Modal.confirm('确定要删除此分支吗？');
        if (confirmed) {
            try {
                const client = window.Supabase.getClient();
                const { error } = await client
                    .from('branches')
                    .delete()
                    .eq('id', id);

                if (error) throw error;

                window.Notifications.success('分支已删除');
                await loadBranches();

            } catch (error) {
                window.Notifications.error('删除失败: ' + error.message);
            }
        }
    };

    function bindEvents() {}

    if (document.querySelector('[data-module="branches"]')) {
        window.initBranches();
    }

})();
