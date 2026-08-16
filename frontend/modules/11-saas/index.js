/**
 * @file 11-saas/index.js
 * @description SaaS 模块入口
 */

import { modules } from '../../modules.config.js';

const subModules = [
    { id: 'dashboard', label: '仪表盘', icon: 'fa-chart-line' },
    { id: 'billing', label: '账单', icon: 'fa-file-invoice' },
    { id: 'subscriptions', label: '订阅', icon: 'fa-repeat' },
    { id: 'plans', label: '套餐', icon: 'fa-tags' },
    { id: 'tenants', label: '租户', icon: 'fa-building' },
    { id: 'users', label: '用户', icon: 'fa-users' }
];

let currentSub = 'dashboard';

export const render = async (container, params = {}) => {
    const sub = params.sub || currentSub;
    currentSub = sub;

    // 更新面包屑
    const navbar = document.querySelector('.navbar-breadcrumb');
    if (navbar) {
        navbar.innerHTML = '<span class="current">SaaS</span>';
    }

    // 渲染子模块导航
    const subNavHtml = `
        <div style="display:flex;gap:4px;margin-bottom:20px;background:white;padding:8px;border-radius:12px;border:1px solid #E5E7EB;flex-wrap:wrap;">
            ${subModules.map(sm => `
                <button class="sub-module-btn ${sm.id === sub ? 'active' : ''}" data-sub="${sm.id}" style="padding:8px 16px;border:none;border-radius:8px;cursor:pointer;background:${sm.id === sub ? '#4F46E5' : 'transparent'};color:${sm.id === sub ? 'white' : '#374151'};font-size:14px;transition:all 0.2s;">
                    <i class="fas ${sm.icon}"></i> ${sm.label}
                </button>
            `).join('')}
        </div>
    `;

    // 内容区域
    const contentMap = {
        dashboard: `
            <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:20px;">
                <div class="stat-card" style="background:white;padding:20px;border-radius:12px;border:1px solid #E5E7EB;">
                    <div style="font-size:14px;color:#6B7280;">总租户</div>
                    <div style="font-size:24px;font-weight:700;margin-top:4px;">0</div>
                </div>
                <div class="stat-card" style="background:white;padding:20px;border-radius:12px;border:1px solid #E5E7EB;">
                    <div style="font-size:14px;color:#6B7280;">活跃订阅</div>
                    <div style="font-size:24px;font-weight:700;margin-top:4px;">0</div>
                </div>
                <div class="stat-card" style="background:white;padding:20px;border-radius:12px;border:1px solid #E5E7EB;">
                    <div style="font-size:14px;color:#6B7280;">月收入</div>
                    <div style="font-size:24px;font-weight:700;margin-top:4px;">¥0</div>
                </div>
                <div class="stat-card" style="background:white;padding:20px;border-radius:12px;border:1px solid #E5E7EB;">
                    <div style="font-size:14px;color:#6B7280;">总用户</div>
                    <div style="font-size:24px;font-weight:700;margin-top:4px;">0</div>
                </div>
            </div>
            <div class="card" style="background:white;border-radius:12px;border:1px solid #E5E7EB;">
                <div class="card-header" style="padding:16px 20px;border-bottom:1px solid #E5E7EB;">
                    <span style="font-weight:600;">📊 概览</span>
                </div>
                <div class="card-body" style="padding:20px;text-align:center;color:#9CA3AF;">
                    <p>SaaS 管理仪表盘</p>
                </div>
            </div>
        `,
        billing: `
            <div class="card" style="background:white;border-radius:12px;border:1px solid #E5E7EB;">
                <div class="card-header" style="padding:16px 20px;border-bottom:1px solid #E5E7EB;">
                    <span style="font-weight:600;">账单管理</span>
                </div>
                <div class="card-body" style="padding:20px;text-align:center;color:#9CA3AF;">
                    <p>账单管理功能开发中</p>
                </div>
            </div>
        `,
        subscriptions: `
            <div class="card" style="background:white;border-radius:12px;border:1px solid #E5E7EB;">
                <div class="card-header" style="padding:16px 20px;border-bottom:1px solid #E5E7EB;">
                    <span style="font-weight:600;">订阅管理</span>
                </div>
                <div class="card-body" style="padding:20px;text-align:center;color:#9CA3AF;">
                    <p>订阅管理功能开发中</p>
                </div>
            </div>
        `,
        plans: `
            <div class="card" style="background:white;border-radius:12px;border:1px solid #E5E7EB;">
                <div class="card-header" style="padding:16px 20px;border-bottom:1px solid #E5E7EB;">
                    <span style="font-weight:600;">套餐管理</span>
                </div>
                <div class="card-body" style="padding:20px;text-align:center;color:#9CA3AF;">
                    <p>套餐管理功能开发中</p>
                </div>
            </div>
        `,
        tenants: `
            <div class="card" style="background:white;border-radius:12px;border:1px solid #E5E7EB;">
                <div class="card-header" style="padding:16px 20px;border-bottom:1px solid #E5E7EB;">
                    <span style="font-weight:600;">租户管理</span>
                </div>
                <div class="card-body" style="padding:20px;text-align:center;color:#9CA3AF;">
                    <p>租户管理功能开发中</p>
                </div>
            </div>
        `,
        users: `
            <div class="card" style="background:white;border-radius:12px;border:1px solid #E5E7EB;">
                <div class="card-header" style="padding:16px 20px;border-bottom:1px solid #E5E7EB;">
                    <span style="font-weight:600;">用户管理</span>
                </div>
                <div class="card-body" style="padding:20px;text-align:center;color:#9CA3AF;">
                    <p>用户管理功能开发中</p>
                </div>
            </div>
        `
    };

    container.innerHTML = `
        <div class="saas-container" style="padding:20px;">
            <div class="page-header" style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;">
                <h1 style="font-size:24px;font-weight:600;">☁️ SaaS管理</h1>
            </div>
            ${subNavHtml}
            <div id="saasContent">
                ${contentMap[sub] || '<div style="text-align:center;padding:40px;color:#9CA3AF;">页面开发中</div>'}
            </div>
        </div>
    `;

    // 绑定子模块切换事件
    container.querySelectorAll('.sub-module-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const subId = btn.dataset.sub;
            render(container, { sub: subId });
        });
    });
};

export default { render };