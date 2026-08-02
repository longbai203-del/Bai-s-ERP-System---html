/**
 * ERP 侧边栏真实驱动引擎
 * 功能：动态加载 17 模块菜单，无缝响应点击跳转
 */
(function() {
    'use strict';

    // 完整 17 模块菜单数据映射 (与你本地 modules 文件夹结构 1:1 对齐)
    const MENU_CONFIG = [
        { id: 'ai', icon: '🤖', name: 'AI 智能中枢', children: ['ai', 'auto-tasks', 'chat', 'crm', 'report-gen'] },
        { id: 'analytics', icon: '📊', name: '数据分析', children: ['analytics', 'business-health', 'custom-reports', 'forecast', 'recommendations', 'reports', 'visualizations'] },
        { id: 'customers', icon: '👥', name: '客户管理', children: ['coupons', 'customers', 'feedback', 'gift-cards', 'membership', 'vehicles', 'wallet'] },
        { id: 'dashboard', icon: '📈', name: '全息决策中心', children: ['analytics', 'dashboard', 'notifications', 'quick-actions', 'reports', 'tasks', 'timeline'] },
        { id: 'employee', icon: '👨‍💻', name: '员工管理', children: ['approvals', 'employee', 'queue', 'records', 'stats'] },
        { id: 'finance', icon: '💰', name: '财务管理', children: ['bank', 'cash-flow', 'expenses', 'finance', 'income', 'invoices', 'journal', 'payments', 'profit-loss', 'settlements', 'taxes', 'trial-balance', 'vat'] },
        { id: 'fleet', icon: '🚚', name: '车队管理', children: ['alerts', 'fleet', 'history', 'maintenance', 'tracking'] },
        { id: 'hr', icon: '🧑‍💼', name: '人力资源', children: ['attendance', 'bonuses', 'commissions', 'employees', 'hr', 'leaves', 'payroll', 'penalties', 'performance', 'permissions', 'schedules', 'shifts', 'tasks'] },
        { id: 'inventory', icon: '🏷️', name: '库存管理', children: ['adjustments', 'batches', 'cycle-counts', 'expiry', 'history', 'inventory', 'low-stock', 'serial-numbers', 'stock', 'transfers', 'warehouses'] },
        { id: 'marketing', icon: '📣', name: '营销管理', children: ['campaigns', 'loyalty', 'marketing', 'promotions', 'referrals'] },
        { id: 'orders', icon: '📦', name: '订单管理', children: ['detail', 'list', 'orders', 'refunds', 'returns', 'submodules'] },
        { id: 'pos', icon: '🧾', name: 'POS 收银', children: ['cash-register', 'cashier', 'customer-display', 'discounts', 'exchange', 'kitchen-display', 'offline-pos', 'pos', 'quick-sale', 'receipt', 'statistics', 'touch-pos'] },
        { id: 'products', icon: '📦', name: '产品中心', children: ['barcodes', 'brands', 'categories', 'combos', 'modifiers', 'price-lists', 'products', 'variants'] },
        { id: 'purchase', icon: '🛒', name: '采购管理', children: ['import', 'purchase', 'quotations', 'receiving', 'supplier-payments', 'suppliers'] },
        { id: 'saas', icon: '☁️', name: 'SaaS 服务', children: ['billing', 'feature-limits', 'packages', 'plans', 'saas', 'storage', 'subscriptions', 'tenants', 'usage'] },
        { id: 'settings', icon: '⚙️', name: '系统设置', children: ['branches', 'company', 'general', 'preferences', 'profile', 'settings'] },
        { id: 'system', icon: '🔒', name: '系统管理', children: ['api-keys', 'audit-logs', 'audit', 'backup', 'import-export', 'integrations', 'marketplace', 'notifications', 'permission', 'restore', 'roles', 'settings', 'system-logs', 'system', 'webhooks'] }
    ];

    // 渲染主逻辑
    window.renderDynamicSidebar = () => {
        const container = document.getElementById('sidebar-container');
        if (!container) return;

        // 自动计算相对路径，完美适配根目录及模块子目录
        let basePath = './';
        const path = window.location.pathname;
        if (path.includes('/modules/') || path.includes('/services/')) basePath = '../';

        // 注入侧边栏 DOM 骨架
        container.innerHTML = `
        <div class="sidebar">
            <div class="sidebar-header"><div class="logo"><span>📊</span> Enterprise ERP</div></div>
            <div class="sidebar-search"><input type="text" placeholder="搜索菜单..." class="search-input" id="menuSearch"></div>
            <nav class="sidebar-nav" id="sidebarNav"><ul class="nav-list"></ul></nav>
            <div class="sidebar-footer"><span>👤 管理员</span><span>🌙 🚪</span></div>
        </div>`;

        const navList = document.querySelector('#sidebarNav .nav-list');

        // 循环生成菜单
        MENU_CONFIG.forEach(mod => {
            const li = document.createElement('li');
            li.className = 'nav-item has-children';
            li.innerHTML = `
                <div class="nav-link parent-link">
                    <span class="nav-icon">${mod.icon}</span>
                    <span class="nav-text">${mod.name}</span>
                    <span class="arrow">▾</span>
                </div>`;

            // 生成真实可跳转的子菜单
            if (mod.children && mod.children.length > 0) {
                const subUl = document.createElement('ul');
                subUl.className = 'sub-nav-list';
                subUl.style.display = 'none';
                
                mod.children.forEach(file => {
                    const subLi = document.createElement('li');
                    subLi.className = 'sub-nav-item';
                    const fullPath = basePath + 'modules/' + mod.id + '/' + file + '.html';
                    const displayName = file.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                    subLi.innerHTML = `<a href="${fullPath}" class="sub-nav-link">${displayName}</a>`;
                    subUl.appendChild(subLi);
                });
                li.appendChild(subUl);
            }
            navList.appendChild(li);
        });

        // 侧边栏折叠/展开交互监听
        document.querySelectorAll('.parent-link').forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const subUl = this.parentElement.querySelector('.sub-nav-list');
                if (subUl) {
                    const isHidden = subUl.style.display === 'none';
                    subUl.style.display = isHidden ? 'block' : 'none';
                    this.querySelector('.arrow').textContent = isHidden ? '▴' : '▾';
                }
            });
        });

        // 菜单实时搜索过滤功能
        const searchInput = document.getElementById('menuSearch');
        if (searchInput) {
            searchInput.addEventListener('input', function() {
                const keyword = this.value.toLowerCase();
                document.querySelectorAll('.has-children').forEach(parent => {
                    const text = parent.querySelector('.nav-text').textContent.toLowerCase();
                    const subLinks = parent.querySelectorAll('.sub-nav-link');
                    let match = text.includes(keyword);
                    subLinks.forEach(link => {
                        if (link.textContent.toLowerCase().includes(keyword)) match = true;
                    });
                    parent.style.display = match ? 'block' : 'none';
                    if (match && keyword.length > 0) {
                        const subUl = parent.querySelector('.sub-nav-list');
                        if (subUl) subUl.style.display = 'block';
                    }
                });
            });
        }
    };

    // 页面加载完成后立即渲染
    document.addEventListener('DOMContentLoaded', () => {
        window.renderDynamicSidebar();
    });
})();