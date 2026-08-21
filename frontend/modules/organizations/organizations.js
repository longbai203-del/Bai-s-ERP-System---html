/**
 * Organizations Module - 组织管理
 */

(function() {
    'use strict';

    let organizations = [];
    let currentPage = 1;
    let pageSize = 20;

    window.initOrganizations = async function() {
        console.log('🏢 Organizations 模块加载完成');
        await loadOrganizations();
        bindEvents();
    };

    async function loadOrganizations() {
        try {
            const container = document.getElementById('orgTableWrapper');
            if (!container) return;

            container.innerHTML = '<div class="loading-placeholder"><div class="spinner"></div><p>加载组织中...</p></div>';

            // 从 Supabase 加载组织
            const client = window.Supabase.getClient();
            const { data, error } = await client
                .from('organizations')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;

            organizations = data || [];
            renderOrganizations(container);

        } catch (error) {
            console.error('加载组织失败:', error);
            const container = document.getElementById('orgTableWrapper');
            if (container) {
                container.innerHTML = `
                    <div style="text-align:center;padding:40px;color:#c33;">
                        <div style="font-size:32px;margin-bottom:12px;">⚠️</div>
                        <p>加载失败: ${error.message}</p>
                        <button onclick="window.initOrganizations()" style="margin-top:12px;padding:8px 20px;background:#667eea;color:#fff;border:none;border-radius:4px;cursor:pointer;">重试</button>
                    </div>
                `;
            }
        }
    }

    function renderOrganizations(container) {
        if (!organizations || organizations.length === 0) {
            container.innerHTML = `
                <div style="text-align:center;padding:60px 20px;color:#999;">
                    <div style="font-size:48px;margin-bottom:16px;">🏢</div>
                    <h3>暂无组织</h3>
                    <p style="margin-top:8px;">点击「新建组织」创建第一个组织</p>
                </div>
            `;
            return;
        }

        let html = `
            <div style="margin-bottom:16px;color:#666;font-size:14px;">
                共 ${organizations.length} 个组织
            </div>
        `;

        for (const org of organizations) {
            const statusMap = {
                active: '<span class="org-status active">● 启用</span>',
                inactive: '<span class="org-status inactive">○ 停用</span>',
                suspended: '<span class="org-status suspended">◐ 暂停</span>'
            };

            html += `
                <div class="org-card" data-id="${org.id}">
                    <div class="org-info">
                        <div class="org-name">${org.name}</div>
                        <div class="org-code">${org.code || '未设置编码'}</div>
                        <div class="org-meta">
                            ${org.phone || ''} ${org.email ? '| ' + org.email : ''}
                            ${org.created_at ? '| 创建于 ' + new Date(org.created_at).toLocaleDateString() : ''}
                        </div>
                    </div>
                    <div style="display:flex;align-items:center;gap:12px;">
                        ${statusMap[org.status] || statusMap.active}
                        <div class="org-actions">
                            <button class="btn-edit" onclick="window.editOrganization('${org.id}')">✏️ 编辑</button>
                            <button class="btn-delete" onclick="window.deleteOrganization('${org.id}')">🗑️ 删除</button>
                        </div>
                    </div>
                </div>
            `;
        }

        container.innerHTML = html;
    }

    // 创建组织
    window.showCreateOrganization = async function() {
        const formHtml = `
            <form id="orgForm" style="display:flex;flex-direction:column;gap:16px;">
                <div>
                    <label style="display:block;margin-bottom:4px;font-weight:500;">组织名称 *</label>
                    <input type="text" name="name" placeholder="请输入组织名称" required style="width:100%;padding:10px 12px;border:1px solid #ddd;border-radius:6px;font-size:14px;">
                </div>
                <div>
                    <label style="display:block;margin-bottom:4px;font-weight:500;">组织编码</label>
                    <input type="text" name="code" placeholder="请输入组织编码" style="width:100%;padding:10px 12px;border:1px solid #ddd;border-radius:6px;font-size:14px;">
                </div>
                <div>
                    <label style="display:block;margin-bottom:4px;font-weight:500;">电话</label>
                    <input type="text" name="phone" placeholder="请输入电话" style="width:100%;padding:10px 12px;border:1px solid #ddd;border-radius:6px;font-size:14px;">
                </div>
                <div>
                    <label style="display:block;margin-bottom:4px;font-weight:500;">邮箱</label>
                    <input type="email" name="email" placeholder="请输入邮箱" style="width:100%;padding:10px 12px;border:1px solid #ddd;border-radius:6px;font-size:14px;">
                </div>
                <div>
                    <label style="display:block;margin-bottom:4px;font-weight:500;">状态</label>
                    <select name="status" style="width:100%;padding:10px 12px;border:1px solid #ddd;border-radius:6px;font-size:14px;">
                        <option value="active">启用</option>
                        <option value="inactive">停用</option>
                        <option value="suspended">暂停</option>
                    </select>
                </div>
            </form>
        `;

        const result = await window.Modal.form(formHtml, '🏢 新建组织', '创建', '取消');
        if (result) {
            try {
                const client = window.Supabase.getClient();
                const { data, error } = await client
                    .from('organizations')
                    .insert([{
                        name: result.name,
                        code: result.code || 'ORG' + Date.now().toString().slice(-6),
                        phone: result.phone || null,
                        email: result.email || null,
                        status: result.status || 'active',
                        created_at: new Date().toISOString()
                    }])
                    .select()
                    .single();

                if (error) throw error;

                window.Notifications.success('组织创建成功');
                await loadOrganizations();

            } catch (error) {
                window.Notifications.error('创建失败: ' + error.message);
            }
        }
    };

    // 编辑组织
    window.editOrganization = async function(id) {
        const org = organizations.find(o => o.id === id);
        if (!org) return;

        const formHtml = `
            <form id="orgForm" style="display:flex;flex-direction:column;gap:16px;">
                <div>
                    <label style="display:block;margin-bottom:4px;font-weight:500;">组织名称 *</label>
                    <input type="text" name="name" value="${org.name || ''}" placeholder="请输入组织名称" required style="width:100%;padding:10px 12px;border:1px solid #ddd;border-radius:6px;font-size:14px;">
                </div>
                <div>
                    <label style="display:block;margin-bottom:4px;font-weight:500;">组织编码</label>
                    <input type="text" name="code" value="${org.code || ''}" placeholder="请输入组织编码" style="width:100%;padding:10px 12px;border:1px solid #ddd;border-radius:6px;font-size:14px;">
                </div>
                <div>
                    <label style="display:block;margin-bottom:4px;font-weight:500;">电话</label>
                    <input type="text" name="phone" value="${org.phone || ''}" placeholder="请输入电话" style="width:100%;padding:10px 12px;border:1px solid #ddd;border-radius:6px;font-size:14px;">
                </div>
                <div>
                    <label style="display:block;margin-bottom:4px;font-weight:500;">邮箱</label>
                    <input type="email" name="email" value="${org.email || ''}" placeholder="请输入邮箱" style="width:100%;padding:10px 12px;border:1px solid #ddd;border-radius:6px;font-size:14px;">
                </div>
                <div>
                    <label style="display:block;margin-bottom:4px;font-weight:500;">状态</label>
                    <select name="status" style="width:100%;padding:10px 12px;border:1px solid #ddd;border-radius:6px;font-size:14px;">
                        <option value="active" ${org.status === 'active' ? 'selected' : ''}>启用</option>
                        <option value="inactive" ${org.status === 'inactive' ? 'selected' : ''}>停用</option>
                        <option value="suspended" ${org.status === 'suspended' ? 'selected' : ''}>暂停</option>
                    </select>
                </div>
            </form>
        `;

        const result = await window.Modal.form(formHtml, '✏️ 编辑组织', '保存', '取消');
        if (result) {
            try {
                const client = window.Supabase.getClient();
                const { data, error } = await client
                    .from('organizations')
                    .update({
                        name: result.name,
                        code: result.code,
                        phone: result.phone,
                        email: result.email,
                        status: result.status,
                        updated_at: new Date().toISOString()
                    })
                    .eq('id', id)
                    .select()
                    .single();

                if (error) throw error;

                window.Notifications.success('组织更新成功');
                await loadOrganizations();

            } catch (error) {
                window.Notifications.error('更新失败: ' + error.message);
            }
        }
    };

    // 删除组织
    window.deleteOrganization = async function(id) {
        const confirmed = await window.Modal.confirm(
            '确定要删除此组织吗？此操作不可撤销！',
            '⚠️ 确认删除'
        );

        if (confirmed) {
            try {
                const client = window.Supabase.getClient();
                const { error } = await client
                    .from('organizations')
                    .delete()
                    .eq('id', id);

                if (error) throw error;

                window.Notifications.success('组织已删除');
                await loadOrganizations();

            } catch (error) {
                window.Notifications.error('删除失败: ' + error.message);
            }
        }
    };

    function bindEvents() {
        // 搜索功能（如果存在搜索框）
        const searchInput = document.querySelector('#orgSearch');
        if (searchInput) {
            searchInput.addEventListener('input', function() {
                const keyword = this.value.toLowerCase();
                const cards = document.querySelectorAll('.org-card');
                cards.forEach(card => {
                    const name = card.querySelector('.org-name')?.textContent?.toLowerCase() || '';
                    card.style.display = name.includes(keyword) ? 'flex' : 'none';
                });
            });
        }
    }

    // 自动初始化
    if (document.querySelector('[data-module="organizations"]')) {
        window.initOrganizations();
    }

})();
