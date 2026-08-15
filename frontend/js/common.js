/**
 * ERP 全局公共驱动引擎 (完整增强版)
 * 功能：侧边栏渲染 + 3套主题 + 全局存储 + VAT计算 + Tab/模态框统一控制
 */
(function() {
    '"'"'use strict'"'"';

    // ==========================
    // 1. 全局数据存储模块
    // ==========================
    window.ERPStorage = {
        get: (key, def) => {
            try { const d = localStorage.getItem('"'"'erp_'"'"' + key); return d ? JSON.parse(d) : def; }
            catch { return def; }
        },
        set: (key, val) => {
            try { localStorage.setItem('"'"'erp_'"'"' + key, JSON.stringify(val)); }
            catch {}
        },
        remove: key => localStorage.removeItem('"'"'erp_'"'"' + key)
    };

    // ==========================
    // 2. VAT 计算 (15%)
    // ==========================
    window.ERPTax = {
        rate: 0.15,
        withVat: (price) => +(price * (1 + 0.15)).toFixed(2),
        withoutVat: (price) => +(price / (1 + 0.15)).toFixed(2),
        vatOnly: (price) => +(price * 0.15).toFixed(2)
    };
    window.calcTax = window.ERPTax;
    window.DB = window.ERPStorage;

    // ==========================
    // 3. Tab 切换引擎
    // ==========================
    window.switchPanel = (panelId, el) => {
        const panelClass = el.closest('"'"'.ord-panel, .pos-panel, .fin-panel, .hr-panel, .pur-panel, .inv-panel, .mkt-panel, .fleet-panel, .cust-panel, .saas-panel, .sys-panel, .set-panel, .ai-grid-2col, .pd-panel'"'"')?.['"'"'className'"'"']?.split('"'"' '"'"')[0];
        if(!panelClass) {
            document.querySelectorAll('"'"'.panel-container'"'"').forEach(p => p.classList.remove('"'"'active'"'"'));
            document.querySelectorAll('"'"'.analytics-tab'"'"').forEach(t => t.classList.remove('"'"'active'"'"'));
            document.getElementById(panelId).classList.add('"'"'active'"'"');
            el.classList.add('"'"'active'"'"');
            return;
        }
        const prefix = panelClass.split('"'"'-'"'"')[0];
        document.querySelectorAll('"'"'.'"'"' + panelClass).forEach(p => p.classList.remove('"'"'active'"'"'));
        document.querySelectorAll('"'"'.'"'"' + prefix + '"'"'-tab'"'"').forEach(t => t.classList.remove('"'"'active'"'"'));
        document.getElementById(panelId).classList.add('"'"'active'"'"');
        el.classList.add('"'"'active'"'"');
    };

    // ==========================
    // 4. 模态框控制
    // ==========================
    window.openModal = (id) => { document.getElementById(id).classList.add('"'"'active'"'"'); };
    window.closeModal = (id) => { document.getElementById(id).classList.remove('"'"'active'"'"'); };
    window.openPaymentModal = () => { document.getElementById('"'"'paymentModal'"'"').classList.add('"'"'active'"'"'); };
    window.closePaymentModal = () => { document.getElementById('"'"'paymentModal'"'"').classList.remove('"'"'active'"'"'); };
    window.openManualModal = () => { document.getElementById('"'"'manualModal'"'"').classList.add('"'"'active'"'"'); };
    window.closeManualModal = () => { document.getElementById('"'"'manualModal'"'"').classList.remove('"'"'active'"'"'); };

    // ==========================
    // 5. 导出功能
    // ==========================
    window.exportCSV = (name) => { alert('"'"'✅ 正在导出 '"'"' + (name || '"'"'当前'"'"') + '"'"' 数据报表 CSV...'"'"'); };

    // ==========================
    // 6. 主题切换
    // ==========================
    const THEMES = {
        dark: '"'"'theme-dark'"'"',
        azure: '"'"'theme-azure'"'"',
        light: '"'"'theme-light'"'"'
    };

    let currentTheme = localStorage.getItem('"'"'erp_theme'"'"') || '"'"'dark'"'"';
    applyTheme(currentTheme);

    function applyTheme(themeKey) {
        const body = document.body;
        body.classList.remove('"'"'theme-dark'"'"', '"'"'theme-azure'"'"', '"'"'theme-light'"'"');
        body.classList.add(THEMES[themeKey]);
        localStorage.setItem('"'"'erp_theme'"'"', themeKey);
        currentTheme = themeKey;
        console.log('"'"'✅ 主题已切换为:'"'"', themeKey);
    }

    window.switchTheme = function(themeKey) {
        applyTheme(themeKey);
    };

    // ==========================
    // 7. 侧边栏渲染引擎
    // ==========================
    const MENU_CONFIG = [
        { id: '"'"'dashboard'"'"', icon: '"'"'📈'"'"', name: '"'"'智能决策中心'"'"' },
        { id: '"'"'orders'"'"', icon: '"'"'📦'"'"', name: '"'"'订单管理'"'"' },
        { id: '"'"'pos'"'"', icon: '"'"'🧾'"'"', name: '"'"'POS 收银'"'"' },
        { id: '"'"'customers'"'"', icon: '"'"'👥'"'"', name: '"'"'客户管理'"'"' },
        { id: '"'"'products'"'"', icon: '"'"'📦'"'"', name: '"'"'产品中心'"'"' },
        { id: '"'"'inventory'"'"', icon: '"'"'🏷️'"'"', name: '"'"'库存管理'"'"' },
        { id: '"'"'purchase'"'"', icon: '"'"'🛒'"'"', name: '"'"'采购管理'"'"' },
        { id: '"'"'finance'"'"', icon: '"'"'💰'"'"', name: '"'"'财务管理'"'"' },
        { id: '"'"'hr'"'"', icon: '"'"'🧑‍💼'"'"', name: '"'"'人力资源'"'"' },
        { id: '"'"'employee'"'"', icon: '"'"'👨‍💻'"'"', name: '"'"'员工管理'"'"' },
        { id: '"'"'fleet'"'"', icon: '"'"'🚚'"'"', name: '"'"'车队管理'"'"' },
        { id: '"'"'marketing'"'"', icon: '"'"'📣'"'"', name: '"'"'营销管理'"'"' },
        { id: '"'"'analytics'"'"', icon: '"'"'📊'"'"', name: '"'"'数据分析'"'"' },
        { id: '"'"'ai'"'"', icon: '"'"'🤖'"'"', name: '"'"'AI 智能中枢'"'"' },
        { id: '"'"'saas'"'"', icon: '"'"'☁️'"'"', name: '"'"'SaaS 服务'"'"' },
        { id: '"'"'settings'"'"', icon: '"'"'⚙️'"'"', name: '"'"'系统设置'"'"' },
        { id: '"'"'system'"'"', icon: '"'"'🔒'"'"', name: '"'"'系统管理'"'"' }
    ];

    window.renderDynamicSidebar = () => {
        const container = document.getElementById('"'"'sidebar-container'"'"');
        if (!container) {
            console.warn('"'"'⚠️ sidebar-container 元素未找到'"'"');
            return;
        }

        container.innerHTML = `
        <div class="sidebar">
            <div class="sidebar-header"><div class="logo"><span>📊</span> Enterprise ERP</div></div>
            <div class="sidebar-search"><input type="text" placeholder="搜索菜单..." class="search-input" id="menuSearch"></div>
            <nav class="sidebar-nav" id="sidebarNav"><ul class="nav-list"></ul></nav>
            <div class="sidebar-footer">
                <div style="display:flex;align-items:center;gap:8px;">
                    <span style="font-size:13px;color:var(--text-sub);">👤 管理员</span>
                    <div style="display:flex;gap:4px;margin-left:4px;background:rgba(255,255,255,0.03);padding:2px;border-radius:6px;">
                        <button onclick="switchTheme('"'"'dark'"'"')" style="background:none;border:none;cursor:pointer;padding:4px 8px;border-radius:4px;font-size:14px;color:var(--text-sub);" title="深色主题">🌙</button>
                        <button onclick="switchTheme('"'"'azure'"'"')" style="background:none;border:none;cursor:pointer;padding:4px 8px;border-radius:4px;font-size:14px;color:var(--text-sub);" title="天蓝主题">💠</button>
                        <button onclick="switchTheme('"'"'light'"'"')" style="background:none;border:none;cursor:pointer;padding:4px 8px;border-radius:4px;font-size:14px;color:var(--text-sub);" title="银白主题">☀️</button>
                    </div>
                </div>
                <div>
                    <button onclick="alert('"'"'注销模拟'"'"')" style="background:none;border:none;color:var(--text-sub);cursor:pointer;font-size:14px;">🚪</button>
                </div>
            </div>
        </div>`;

        const navList = document.querySelector('"'"'#sidebarNav .nav-list'"'"');
        if (!navList) return;
        
        MENU_CONFIG.forEach(mod => {
            const li = document.createElement('"'"'li'"'"');
            li.className = '"'"'nav-item'"'"';
            const fullPath = '"'"'/modules/'"'"' + mod.id + '"'"'/'"'"' + mod.id + '"'"'.html'"'"';
            li.innerHTML = `
                <a href="${fullPath}" class="nav-link">
                    <span class="nav-icon">${mod.icon}</span>
                    <span class="nav-text">${mod.name}</span>
                </a>`;
            navList.appendChild(li);
        });

        const searchInput = document.getElementById('"'"'menuSearch'"'"');
        if (searchInput) {
            searchInput.addEventListener('"'"'input'"'"', function() {
                const keyword = this.value.toLowerCase();
                document.querySelectorAll('"'"'.nav-item'"'"').forEach(item => {
                    const text = item.querySelector('"'"'.nav-text'"'"').textContent.toLowerCase();
                    item.style.display = text.includes(keyword) ? '"'"'block'"'"' : '"'"'none'"'"';
                });
            });
        }
        
        console.log('"'"'✅ 侧边栏渲染完成'"'"');
    };

    // ==========================
    // 8. 页面加载完成后渲染侧边栏
    // ==========================
    document.addEventListener('"'"'DOMContentLoaded'"'"', () => {
        console.log('"'"'✅ DOM 加载完成，开始渲染侧边栏'"'"');
        window.renderDynamicSidebar();
    });

})();
