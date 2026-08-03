/**
 * ERP 侧边栏引擎 + 3 套主题无限切换系统
 * 不改动任何原有的菜单结构和渲染逻辑
 */
(function() {
    'use strict';

    // ==========================
    // 1. 主题切换核心逻辑
    // ==========================
    const THEMES = {
        dark: 'theme-dark',   // 默认深色赛博
        azure: 'theme-azure', // 天蓝色
        light: 'theme-light'  // 银白色
    };

    // 初始化时读取 localStorage 中的主题，如果没有则默认深色
    let currentTheme = localStorage.getItem('erp_theme') || 'dark';
    applyTheme(currentTheme);

    function applyTheme(themeKey) {
        const body = document.body;
        // 移除所有已有的主题 class
        body.classList.remove('theme-dark', 'theme-azure', 'theme-light');
        // 添加新的主题 class
        body.classList.add(THEMES[themeKey]);
        // 保存到 localStorage 供下次访问继续生效
        localStorage.setItem('erp_theme', themeKey);
        currentTheme = themeKey;
        console.log('✅ 主题已切换为:', themeKey);
    }

    // 暴露到全局，让侧边栏底部的按钮能调用
    window.switchTheme = function(themeKey) {
        applyTheme(themeKey);
    };

    // ==========================
    // 2. 侧边栏渲染引擎 (原封不动保留你之前正确逻辑)
    // ==========================
    const MENU_CONFIG = [
        { id: 'dashboard', icon: '📈', name: '智能决策中心', children: [] },
        { id: 'orders', icon: '📦', name: '订单管理', children: [] },
        { id: 'pos', icon: '🧾', name: 'POS 收银', children: [] },
        { id: 'customers', icon: '👥', name: '客户管理', children: [] },
        { id: 'products', icon: '📦', name: '产品中心', children: [] },
        { id: 'inventory', icon: '🏷️', name: '库存管理', children: [] },
        { id: 'purchase', icon: '🛒', name: '采购管理', children: [] },
        { id: 'finance', icon: '💰', name: '财务管理', children: [] },
        { id: 'hr', icon: '🧑‍💼', name: '人力资源', children: [] },
        { id: 'employee', icon: '👨‍💻', name: '员工管理', children: [] },
        { id: 'fleet', icon: '🚚', name: '车队管理', children: [] },
        { id: 'marketing', icon: '📣', name: '营销管理', children: [] },
        { id: 'analytics', icon: '📊', name: '数据分析', children: [] },
        { id: 'ai', icon: '🤖', name: 'AI 智能中枢', children: [] },
        { id: 'saas', icon: '☁️', name: 'SaaS 服务', children: [] },
        { id: 'settings', icon: '⚙️', name: '系统设置', children: [] },
        { id: 'system', icon: '🔒', name: '系统管理', children: [] }
    ];

    window.renderDynamicSidebar = () => {
        const container = document.getElementById('sidebar-container');
        if (!container) return;

        // 在侧边栏底部添加了三个独立主题切换图标，完全不影响原来的菜单渲染
        container.innerHTML = `
        <div class="sidebar">
            <div class="sidebar-header"><div class="logo"><span>📊</span> Enterprise ERP</div></div>
            <div class="sidebar-search"><input type="text" placeholder="搜索菜单..." class="search-input" id="menuSearch"></div>
            <nav class="sidebar-nav" id="sidebarNav"><ul class="nav-list"></ul></nav>
            <div class="sidebar-footer">
                <div style="display:flex;align-items:center;gap:8px;">
                    <span style="font-size:13px;color:var(--text-sub);">👤 管理员</span>
                    <div style="display:flex;gap:4px;margin-left:4px;background:rgba(255,255,255,0.03);padding:2px;border-radius:6px;">
                        <button onclick="switchTheme('dark')" style="background:none;border:none;cursor:pointer;padding:4px 8px;border-radius:4px;font-size:14px;color:var(--text-sub);" title="深色主题">🌙</button>
                        <button onclick="switchTheme('azure')" style="background:none;border:none;cursor:pointer;padding:4px 8px;border-radius:4px;font-size:14px;color:var(--text-sub);" title="天蓝主题">💠</button>
                        <button onclick="switchTheme('light')" style="background:none;border:none;cursor:pointer;padding:4px 8px;border-radius:4px;font-size:14px;color:var(--text-sub);" title="银白主题">☀️</button>
                    </div>
                </div>
                <div>
                    <button onclick="alert('注销模拟')" style="background:none;border:none;color:var(--text-sub);cursor:pointer;font-size:14px;">🚪</button>
                </div>
            </div>
        </div>`;

        const navList = document.querySelector('#sidebarNav .nav-list');
        MENU_CONFIG.forEach(mod => {
            const li = document.createElement('li');
            li.className = 'nav-item';
            const fullPath = '/modules/' + mod.id + '/' + mod.id + '.html';
            li.innerHTML = `
                <a href="${fullPath}" class="nav-link">
                    <span class="nav-icon">${mod.icon}</span>
                    <span class="nav-text">${mod.name}</span>
                </a>`;
            navList.appendChild(li);
        });

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

    document.addEventListener('DOMContentLoaded', () => {
        window.renderDynamicSidebar();
    });
})();