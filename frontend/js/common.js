/**
 * ERP 侧边栏真实驱动引擎
 * 功能：仅加载 17 个主模块入口，修复路径叠加错误
 */
(function() {
    'use strict';

    // 完整 17 模块菜单数据映射 (子模块 children 全部清空，只留顶级入口)
    const MENU_CONFIG = [
        { id: 'ai', icon: '🤖', name: 'AI 智能中枢', children: [] },
        { id: 'analytics', icon: '📊', name: '数据分析', children: [] },
        { id: 'customers', icon: '👥', name: '客户管理', children: [] },
        { id: 'dashboard', icon: '📈', name: '全息决策中心', children: [] },
        { id: 'employee', icon: '👨‍💻', name: '员工管理', children: [] },
        { id: 'finance', icon: '💰', name: '财务管理', children: [] },
        { id: 'fleet', icon: '🚚', name: '车队管理', children: [] },
        { id: 'hr', icon: '🧑‍💼', name: '人力资源', children: [] },
        { id: 'inventory', icon: '🏷️', name: '库存管理', children: [] },
        { id: 'marketing', icon: '📣', name: '营销管理', children: [] },
        { id: 'orders', icon: '📦', name: '订单管理', children: [] },
        { id: 'pos', icon: '🧾', name: 'POS 收银', children: [] },
        { id: 'products', icon: '📦', name: '产品中心', children: [] },
        { id: 'purchase', icon: '🛒', name: '采购管理', children: [] },
        { id: 'saas', icon: '☁️', name: 'SaaS 服务', children: [] },
        { id: 'settings', icon: '⚙️', name: '系统设置', children: [] },
        { id: 'system', icon: '🔒', name: '系统管理', children: [] }
    ];

    // 渲染主逻辑
    window.renderDynamicSidebar = () => {
        const container = document.getElementById('sidebar-container');
        if (!container) return;

        // 注入侧边栏 DOM 骨架
        container.innerHTML = `
        <div class="sidebar">
            <div class="sidebar-header"><div class="logo"><span>📊</span> Enterprise ERP</div></div>
            <div class="sidebar-search"><input type="text" placeholder="搜索菜单..." class="search-input" id="menuSearch"></div>
            <nav class="sidebar-nav" id="sidebarNav"><ul class="nav-list"></ul></nav>
            <div class="sidebar-footer"><span>👤 管理员</span><span>🌙 🚪</span></div>
        </div>`;

        const navList = document.querySelector('#sidebarNav .nav-list');

        // 循环生成顶级菜单 
        MENU_CONFIG.forEach(mod => {
            const li = document.createElement('li');
            li.className = 'nav-item';
            // 【绝对核心】直接使用绝对路径，废弃动态拼接
            const fullPath = '/modules/' + mod.id + '/' + mod.id + '.html';
            li.innerHTML = `
                <a href="${fullPath}" class="nav-link">
                    <span class="nav-icon">${mod.icon}</span>
                    <span class="nav-text">${mod.name}</span>
                </a>`;
            navList.appendChild(li);
        });

        // 搜索过滤功能
        const searchInput = document.getElementById('menuSearch');
        if (searchInput) {
            searchInput.addEventListener('input', function() {
                const keyword = this.value.toLowerCase();
                document.querySelectorAll('.nav-item').forEach(item => {
                    const text = item.querySelector('.nav-text').textContent.toLowerCase();
                    item.style.display = text.includes(keyword) ? 'block' : 'none';
                });
            });
        }
    };

    // 页面加载完成后立即渲染
    document.addEventListener('DOMContentLoaded', () => {
        window.renderDynamicSidebar();
    });
})();