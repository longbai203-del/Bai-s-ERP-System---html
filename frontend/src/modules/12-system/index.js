/**
 * @file 12-system/index.js
 * @description 系统管理模块入口
 */

const subModules = [
    { id: 'settings', label: '系统设置', icon: 'fa-cog' },
    { id: 'users', label: '用户管理', icon: 'fa-users' },
    { id: 'roles', label: '角色权限', icon: 'fa-lock' },
    { id: 'audit', label: '审计日志', icon: 'fa-history' },
    { id: 'backup', label: '备份恢复', icon: 'fa-database' },
    { id: 'webhooks', label: 'Webhooks', icon: 'fa-code-branch' }
];

let currentSub = 'settings';

export const render = async (container, params = {}) => {
    const sub = params.sub || currentSub;
    currentSub = sub;

    // 更新面包屑
    const navbar = document.querySelector('.navbar-breadcrumb');
    if (navbar) {
        navbar.innerHTML = '<span class="current">系统管理</span>';
    }

    // 子模块导航
    const subNavHtml = `
        <div style="display:flex;gap:4px;margin-bottom:20px;background:white;padding:8px;border-radius:12px;border:1px solid #E5E7EB;flex-wrap:wrap;">
            ${subModules.map(sm => `
                <button class="sub-module-btn ${sm.id === sub ? 'active' : ''}" data-sub="${sm.id}" style="padding:8px 16px;border:none;border-radius:8px;cursor:pointer;background:${sm.id === sub ? '#4F46E5' : 'transparent'};color:${sm.id === sub ? 'white' : '#374151'};font-size:14px;transition:all 0.2s;">
                    <i class="fas ${sm.icon}"></i> ${sm.label}
                </button>
            `).join('')}
        </div>
    `;

    // 内容
    const contentMap = {
        settings: `
            <div class="card" style="background:white;border-radius:12px;border:1px solid #E5E7EB;">
                <div class="card-header" style="padding:16px 20px;border-bottom:1px solid #E5E7EB;">
                    <span style="font-weight:600;">⚙️ 系统设置</span>
                </div>
                <div class="card-body" style="padding:20px;">
                    <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">
                        <div class="form-group">
                            <label style="display:block;font-weight:500;margin-bottom:4px;">系统名称</label>
                            <input type="text" class="form-control" value="Bai's ERP" style="width:100%;padding:8px 12px;border:1px solid #E5E7EB;border-radius:8px;">
                        </div>
                        <div class="form-group">
                            <label style="display:block;font-weight:500;margin-bottom:4px;">系统版本</label>
                            <input type="text" class="form-control" value="3.0.0" disabled style="width:100%;padding:8px 12px;border:1px solid #E5E7EB;border-radius:8px;background:#F9FAFB;">
                        </div>
                    </div>
                    <div style="margin-top:16px;padding-top:16px;border-top:1px solid #E5E7EB;">
                        <button class="btn btn-primary" style="padding:8px 24px;background:#4F46E5;color:white;border:none;border-radius:8px;cursor:pointer;">
                            <i class="fas fa-save"></i> 保存设置
                        </button>
                    </div>
                </div>
            </div>
        `,
        users: `
            <div class="card" style="background:white;border-radius:12px;border:1px solid #E5E7EB;">
                <div class="card-header" style="padding:16px 20px;border-bottom:1px solid #E5E7EB;display:flex;justify-content:space-between;align-items:center;">
                    <span style="font-weight:600;">👥 用户管理</span>
                    <button class="btn btn-sm btn-primary" style="padding:4px 12px;background:#4F46E5;color:white;border:none;border-radius:6px;cursor:pointer;">
                        <i class="fas fa-plus"></i> 添加用户
                    </button>
                </div>
                <div class="card-body" style="padding:20px;text-align:center;color:#9CA3AF;">
                    <p>用户管理功能开发中</p>
                </div>
            </div>
        `,
        roles: `
            <div class="card" style="background:white;border-radius:12px;border:1px solid #E5E7EB;">
                <div class="card-header" style="padding:16px 20px;border-bottom:1px solid #E5E7EB;">
                    <span style="font-weight:600;">🔐 角色权限</span>
                </div>
                <div class="card-body" style="padding:20px;text-align:center;color:#9CA3AF;">
                    <p>角色权限管理功能开发中</p>
                </div>
            </div>
        `,
        audit: `
            <div class="card" style="background:white;border-radius:12px;border:1px solid #E5E7EB;">
                <div class="card-header" style="padding:16px 20px;border-bottom:1px solid #E5E7EB;">
                    <span style="font-weight:600;">📋 审计日志</span>
                </div>
                <div class="card-body" style="padding:20px;text-align:center;color:#9CA3AF;">
                    <p>审计日志功能开发中</p>
                </div>
            </div>
        `,
        backup: `
            <div class="card" style="background:white;border-radius:12px;border:1px solid #E5E7EB;">
                <div class="card-header" style="padding:16px 20px;border-bottom:1px solid #E5E7EB;">
                    <span style="font-weight:600;">💾 备份恢复</span>
                </div>
                <div class="card-body" style="padding:20px;text-align:center;color:#9CA3AF;">
                    <p>备份恢复功能开发中</p>
                </div>
            </div>
        `,
        webhooks: `
            <div class="card" style="background:white;border-radius:12px;border:1px solid #E5E7EB;">
                <div class="card-header" style="padding:16px 20px;border-bottom:1px solid #E5E7EB;">
                    <span style="font-weight:600;">🔗 Webhooks</span>
                </div>
                <div class="card-body" style="padding:20px;text-align:center;color:#9CA3AF;">
                    <p>Webhooks 功能开发中</p>
                </div>
            </div>
        `
    };

    container.innerHTML = `
        <div class="system-container" style="padding:20px;">
            <div class="page-header" style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;">
                <h1 style="font-size:24px;font-weight:600;">⚙️ 系统管理</h1>
            </div>
            ${subNavHtml}
            <div id="systemContent">
                ${contentMap[sub] || '<div style="text-align:center;padding:40px;color:#9CA3AF;">页面开发中</div>'}
            </div>
        </div>
    `;

    // 绑定切换事件
    container.querySelectorAll('.sub-module-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const subId = btn.dataset.sub;
            render(container, { sub: subId });
        });
    });
};

export default { render };