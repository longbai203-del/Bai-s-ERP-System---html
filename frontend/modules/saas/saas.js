/**
 * SaaS Module - 多租户管理
 */

(function() {
    'use strict';

    let tenants = [];
    let filteredTenants = [];
    let subscriptions = [];

    // 模块初始化
    window.initSaaS = async function() {
        console.log('☁️ SaaS 模块加载完成');
        await loadData();
        bindEvents();
    };

    // 加载数据
    async function loadData() {
        try {
            const container = document.getElementById('tenantTableWrapper');
            if (container) {
                container.innerHTML = '<div class="loading-placeholder"><div class="spinner"></div><p>加载租户中...</p></div>';
            }

            const client = window.Supabase.getClient();

            // 加载所有租户（组织）
            const { data: orgData, error: orgError } = await client
                .from('organizations')
                .select('*')
                .order('created_at', { ascending: false });

            if (orgError) throw orgError;

            tenants = orgData || [];
            filteredTenants = [...tenants];

            // 加载订阅信息
            const { data: subData, error: subError } = await client
                .from('subscriptions')
                .select('*');

            if (subError) throw subError;
            subscriptions = subData || [];

            renderStats();
            renderTenants();

        } catch (error) {
            console.error('加载 SaaS 数据失败:', error);
            const container = document.getElementById('tenantTableWrapper');
            if (container) {
                container.innerHTML = `
                    <div style="text-align:center;padding:40px;color:#c33;">
                        <div style="font-size:32px;margin-bottom:12px;">⚠️</div>
                        <p>加载失败: ${error.message}</p>
                        <button onclick="window.initSaaS()" style="margin-top:12px;padding:8px 20px;background:#667eea;color:#fff;border:none;border-radius:4px;cursor:pointer;">重试</button>
                    </div>
                `;
            }
        }
    };

    // 渲染统计
    function renderStats() {
        const total = tenants.length;
        const active = tenants.filter(t => t.status === 'active').length;
        const inactive = tenants.filter(t => t.status === 'inactive' || t.status === 'suspended').length;

        // 计算即将到期的租户（7天内到期）
        const now = new Date();
        const expiring = subscriptions.filter(s => {
            if (!s.end_date) return false;
            const endDate = new Date(s.end_date);
            const diffDays = Math.ceil((endDate - now) / (1000 * 60 * 60 * 24));
            return diffDays > 0 && diffDays <= 7 && s.is_active;
        }).length;

        document.getElementById('totalTenants').textContent = total;
        document.getElementById('activeTenants').textContent = active;
        document.getElementById('inactiveTenants').textContent = inactive;
        document.getElementById('expiringSoon').textContent = expiring;
    }

    // 渲染租户列表
    function renderTenants() {
        const container = document.getElementById('tenantTableWrapper');
        if (!container) return;

        const searchVal = document.getElementById('tenantSearch')?.value?.toLowerCase() || '';
        const filterVal = document.getElementById('tenantFilter')?.value || 'all';

        // 过滤
        filteredTenants = tenants.filter(t => {
            const matchSearch = t.name.toLowerCase().includes(searchVal) ||
                               (t.code || '').toLowerCase().includes(searchVal) ||
                               (t.email || '').toLowerCase().includes(searchVal);
            const matchFilter = filterVal === 'all' || t.status === filterVal;
            return matchSearch && matchFilter;
        });

        document.getElementById('tenantCount').textContent = `共 ${filteredTenants.length} 个租户`;

        if (filteredTenants.length === 0) {
            container.innerHTML = `
                <div class="no-tenants">
                    <div class="icon">🏢</div>
                    <h3>暂无租户</h3>
                    <p>点击「新建租户」创建第一个租户</p>
                </div>
            `;
            return;
        }

        let html = '';
        for (const tenant of filteredTenants) {
            const statusMap = {
                active: '<span class="tenant-status active">● 活跃</span>',
                inactive: '<span class="tenant-status inactive">○ 停用</span>',
                suspended: '<span class="tenant-status suspended">◐ 暂停</span>',
                trial: '<span class="tenant-status trial">◉ 试用</span>'
            };

            // 查找订阅信息
            const sub = subscriptions.find(s => s.organization_id === tenant.id);

            html += `
                <div class="tenant-card" data-id="${tenant.id}">
                    <div class="tenant-info">
                        <div class="tenant-name">${tenant.name}</div>
                        <div class="tenant-details">
                            <span>📋 ${tenant.code || '未设置编码'}</span>
                            ${tenant.email ? `<span>📧 ${tenant.email}</span>` : ''}
                            ${tenant.phone ? `<span>📞 ${tenant.phone}</span>` : ''}
                            ${sub ? `<span>📅 到期: ${new Date(sub.end_date).toLocaleDateString()}</span>` : '<span>📅 无订阅</span>'}
                            <span>📅 创建: ${new Date(tenant.created_at).toLocaleDateString()}</span>
                        </div>
                    </div>
                    <div style="display:flex;align-items:center;gap:8px;">
                        ${statusMap[tenant.status] || statusMap.active}
                        <div class="tenant-actions">
                            <button class="btn-edit" onclick="window.editTenant('${tenant.id}')">✏️ 编辑</button>
                            <button class="btn-subscription" onclick="window.manageSubscription('${tenant.id}')">📋 订阅</button>
                            <button class="btn-delete" onclick="window.deleteTenant('${tenant.id}')">🗑️ 删除</button>
                        </div>
                    </div>
                </div>
            `;
        }

        container.innerHTML = html;
    }

    // 新建租户
    window.showCreateTenant = async function() {
        const formHtml = `
            <form id="tenantForm" style="display:flex;flex-direction:column;gap:16px;">
                <div>
                    <label style="display:block;margin-bottom:4px;font-weight:500;">租户名称 *</label>
                    <input type="text" name="name" placeholder="请输入租户名称" required style="width:100%;padding:10px 12px;border:1px solid #ddd;border-radius:6px;font-size:14px;">
                </div>
                <div>
                    <label style="display:block;margin-bottom:4px;font-weight:500;">租户编码</label>
                    <input type="text" name="code" placeholder="请输入租户编码" style="width:100%;padding:10px 12px;border:1px solid #ddd;border-radius:6px;font-size:14px;">
                </div>
                <div>
                    <label style="display:block;margin-bottom:4px;font-weight:500;">管理员邮箱 *</label>
                    <input type="email" name="admin_email" placeholder="请输入管理员邮箱" required style="width:100%;padding:10px 12px;border:1px solid #ddd;border-radius:6px;font-size:14px;">
                </div>
                <div>
                    <label style="display:block;margin-bottom:4px;font-weight:500;">管理员密码 *</label>
                    <input type="password" name="admin_password" placeholder="请设置管理员密码" required minlength="6" style="width:100%;padding:10px 12px;border:1px solid #ddd;border-radius:6px;font-size:14px;">
                </div>
                <div>
                    <label style="display:block;margin-bottom:4px;font-weight:500;">电话</label>
                    <input type="text" name="phone" placeholder="请输入电话" style="width:100%;padding:10px 12px;border:1px solid #ddd;border-radius:6px;font-size:14px;">
                </div>
                <div>
                    <label style="display:block;margin-bottom:4px;font-weight:500;">订阅计划</label>
                    <select name="plan" style="width:100%;padding:10px 12px;border:1px solid #ddd;border-radius:6px;font-size:14px;">
                        <option value="free">免费版</option>
                        <option value="basic">基础版</option>
                        <option value="pro">专业版</option>
                        <option value="enterprise">企业版</option>
                    </select>
                </div>
            </form>
        `;

        const result = await window.Modal.form(formHtml, '☁️ 新建租户', '创建', '取消');
        if (result) {
            try {
                const client = window.Supabase.getClient();

                // 1. 创建租户（组织）
                const { data: orgData, error: orgError } = await client
                    .from('organizations')
                    .insert([{
                        name: result.name,
                        code: result.code || 'TENANT' + Date.now().toString().slice(-6),
                        phone: result.phone || null,
                        email: result.admin_email,
                        status: 'active',
                        created_at: new Date().toISOString()
                    }])
                    .select()
                    .single();

                if (orgError) throw orgError;

                // 2. 创建订阅
                const endDate = new Date();
                endDate.setDate(endDate.getDate() + 30); // 默认30天试用

                const { error: subError } = await client
                    .from('subscriptions')
                    .insert([{
                        organization_id: orgData.id,
                        plan_name: result.plan || 'free',
                        start_date: new Date().toISOString(),
                        end_date: endDate.toISOString(),
                        is_active: true
                    }]);

                if (subError) throw subError;

                // 3. 创建管理员用户
                const { data: authData, error: authError } = await client.auth.signUp({
                    email: result.admin_email,
                    password: result.admin_password,
                    options: {
                        data: {
                            full_name: result.name + ' 管理员',
                            organization_id: orgData.id
                        }
                    }
                });

                if (authError) throw authError;

                // 4. 创建管理员资料
                if (authData.user) {
                    const { error: profileError } = await client
                        .from('profiles')
                        .insert([{
                            id: authData.user.id,
                            organization_id: orgData.id,
                            full_name: result.name + ' 管理员',
                            role: 'admin',
                            status: 'active'
                        }]);

                    if (profileError) throw profileError;
                }

                window.Notifications.success('租户创建成功！');
                await loadData();

            } catch (error) {
                window.Notifications.error('创建失败: ' + error.message);
            }
        }
    };

    // 编辑租户
    window.editTenant = async function(id) {
        const tenant = tenants.find(t => t.id === id);
        if (!tenant) return;

        const formHtml = `
            <form id="tenantForm" style="display:flex;flex-direction:column;gap:16px;">
                <div>
                    <label style="display:block;margin-bottom:4px;font-weight:500;">租户名称 *</label>
                    <input type="text" name="name" value="${tenant.name}" required style="width:100%;padding:10px 12px;border:1px solid #ddd;border-radius:6px;font-size:14px;">
                </div>
                <div>
                    <label style="display:block;margin-bottom:4px;font-weight:500;">租户编码</label>
                    <input type="text" name="code" value="${tenant.code || ''}" style="width:100%;padding:10px 12px;border:1px solid #ddd;border-radius:6px;font-size:14px;">
                </div>
                <div>
                    <label style="display:block;margin-bottom:4px;font-weight:500;">电话</label>
                    <input type="text" name="phone" value="${tenant.phone || ''}" style="width:100%;padding:10px 12px;border:1px solid #ddd;border-radius:6px;font-size:14px;">
                </div>
                <div>
                    <label style="display:block;margin-bottom:4px;font-weight:500;">邮箱</label>
                    <input type="email" name="email" value="${tenant.email || ''}" style="width:100%;padding:10px 12px;border:1px solid #ddd;border-radius:6px;font-size:14px;">
                </div>
                <div>
                    <label style="display:block;margin-bottom:4px;font-weight:500;">状态</label>
                    <select name="status" style="width:100%;padding:10px 12px;border:1px solid #ddd;border-radius:6px;font-size:14px;">
                        <option value="active" ${tenant.status === 'active' ? 'selected' : ''}>活跃</option>
                        <option value="inactive" ${tenant.status === 'inactive' ? 'selected' : ''}>停用</option>
                        <option value="suspended" ${tenant.status === 'suspended' ? 'selected' : ''}>暂停</option>
                        <option value="trial" ${tenant.status === 'trial' ? 'selected' : ''}>试用</option>
                    </select>
                </div>
            </form>
        `;

        const result = await window.Modal.form(formHtml, '✏️ 编辑租户', '保存', '取消');
        if (result) {
            try {
                const client = window.Supabase.getClient();
                const { error } = await client
                    .from('organizations')
                    .update({
                        name: result.name,
                        code: result.code,
                        phone: result.phone,
                        email: result.email,
                        status: result.status,
                        updated_at: new Date().toISOString()
                    })
                    .eq('id', id);

                if (error) throw error;

                window.Notifications.success('租户更新成功');
                await loadData();

            } catch (error) {
                window.Notifications.error('更新失败: ' + error.message);
            }
        }
    };

    // 管理订阅
    window.manageSubscription = async function(id) {
        const sub = subscriptions.find(s => s.organization_id === id);
        const tenant = tenants.find(t => t.id === id);

        const formHtml = `
            <form id="subForm" style="display:flex;flex-direction:column;gap:16px;">
                <div style="background:#f8f9fa;padding:12px;border-radius:6px;">
                    <strong>租户:</strong> ${tenant?.name || '未知'}
                </div>
                <div>
                    <label style="display:block;margin-bottom:4px;font-weight:500;">订阅计划</label>
                    <select name="plan" style="width:100%;padding:10px 12px;border:1px solid #ddd;border-radius:6px;font-size:14px;">
                        <option value="free" ${sub?.plan_name === 'free' ? 'selected' : ''}>免费版</option>
                        <option value="basic" ${sub?.plan_name === 'basic' ? 'selected' : ''}>基础版</option>
                        <option value="pro" ${sub?.plan_name === 'pro' ? 'selected' : ''}>专业版</option>
                        <option value="enterprise" ${sub?.plan_name === 'enterprise' ? 'selected' : ''}>企业版</option>
                    </select>
                </div>
                <div>
                    <label style="display:block;margin-bottom:4px;font-weight:500;">到期日期</label>
                    <input type="date" name="end_date" value="${sub?.end_date ? sub.end_date.split('T')[0] : ''}" style="width:100%;padding:10px 12px;border:1px solid #ddd;border-radius:6px;font-size:14px;">
                </div>
                <div>
                    <label style="display:block;margin-bottom:4px;font-weight:500;">状态</label>
                    <select name="is_active" style="width:100%;padding:10px 12px;border:1px solid #ddd;border-radius:6px;font-size:14px;">
                        <option value="true" ${sub?.is_active ? 'selected' : ''}>激活</option>
                        <option value="false" ${!sub?.is_active ? 'selected' : ''}>停用</option>
                    </select>
                </div>
            </form>
        `;

        const result = await window.Modal.form(formHtml, '📋 管理订阅', '保存', '取消');
        if (result) {
            try {
                const client = window.Supabase.getClient();

                if (sub) {
                    // 更新订阅
                    const { error } = await client
                        .from('subscriptions')
                        .update({
                            plan_name: result.plan,
                            end_date: result.end_date || sub.end_date,
                            is_active: result.is_active === 'true',
                            updated_at: new Date().toISOString()
                        })
                        .eq('organization_id', id);

                    if (error) throw error;
                } else {
                    // 创建订阅
                    const startDate = new Date();
                    const endDate = result.end_date ? new Date(result.end_date) : new Date(startDate.setDate(startDate.getDate() + 30));

                    const { error } = await client
                        .from('subscriptions')
                        .insert([{
                            organization_id: id,
                            plan_name: result.plan || 'free',
                            start_date: new Date().toISOString(),
                            end_date: endDate.toISOString(),
                            is_active: result.is_active === 'true'
                        }]);

                    if (error) throw error;
                }

                window.Notifications.success('订阅更新成功');
                await loadData();

            } catch (error) {
                window.Notifications.error('订阅更新失败: ' + error.message);
            }
        }
    };

    // 删除租户
    window.deleteTenant = async function(id) {
        const confirmed = await window.Modal.confirm(
            '确定要删除此租户吗？这将同时删除该租户的所有数据！',
            '⚠️ 确认删除'
        );

        if (confirmed) {
            try {
                const client = window.Supabase.getClient();

                // 删除订阅
                await client.from('subscriptions').delete().eq('organization_id', id);

                // 删除租户
                const { error } = await client
                    .from('organizations')
                    .delete()
                    .eq('id', id);

                if (error) throw error;

                window.Notifications.success('租户已删除');
                await loadData();

            } catch (error) {
                window.Notifications.error('删除失败: ' + error.message);
            }
        }
    };

    // 绑定事件
    function bindEvents() {
        const searchInput = document.getElementById('tenantSearch');
        if (searchInput) {
            searchInput.addEventListener('input', renderTenants);
        }

        const filterSelect = document.getElementById('tenantFilter');
        if (filterSelect) {
            filterSelect.addEventListener('change', renderTenants);
        }
    }

    // 自动初始化
    if (document.querySelector('[data-module="saas"]')) {
        window.initSaaS();
    }

})();
