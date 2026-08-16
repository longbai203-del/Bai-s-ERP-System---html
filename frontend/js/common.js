/**
 * ERP 全局公共驱动引擎 (纯核心版本)
 * 功能：侧边栏渲染 + 3套主题 + VAT计算 + Tab/模态框控制
 */
(function() {
    'use strict';

    // ==========================
    // 1. VAT 计算 (15% 沙特合规)
    // ==========================
    window.ERPTax = {
        rate: 0.15,
        withVat: (price) => +(price * (1 + 0.15)).toFixed(2),
        withoutVat: (price) => +(price / (1 + 0.15)).toFixed(2),
        vatOnly: (price) => +(price * 0.15).toFixed(2)
    };
    window.calcTax = window.ERPTax;

    // ==========================
    // 2. Tab 切换引擎 (仅用于页面内部 Tab)
    // ==========================
    window.switchPanel = function(panelId, el) {
        var panelClass = el.closest('.ord-panel, .pos-panel, .fin-panel, .hr-panel, .pur-panel, .inv-panel, .mkt-panel, .fleet-panel, .cust-panel, .saas-panel, .sys-panel, .set-panel, .ai-grid-2col, .pd-panel');
        if (panelClass) {
            panelClass = panelClass.className.split(' ')[0];
        }
        
        if (!panelClass) {
            document.querySelectorAll('.panel-container').forEach(function(p) { p.classList.remove('active'); });
            document.querySelectorAll('.analytics-tab').forEach(function(t) { t.classList.remove('active'); });
            document.getElementById(panelId).classList.add('active');
            el.classList.add('active');
            return;
        }
        var prefix = panelClass.split('-')[0];
        document.querySelectorAll('.' + panelClass).forEach(function(p) { p.classList.remove('active'); });
        document.querySelectorAll('.' + prefix + '-tab').forEach(function(t) { t.classList.remove('active'); });
        document.getElementById(panelId).classList.add('active');
        el.classList.add('active');
    };

    // ==========================
    // 3. 模态框控制
    // ==========================
    window.openModal = function(id) { document.getElementById(id).classList.add('active'); };
    window.closeModal = function(id) { document.getElementById(id).classList.remove('active'); };
    window.openPaymentModal = function() { document.getElementById('paymentModal').classList.add('active'); };
    window.closePaymentModal = function() { document.getElementById('paymentModal').classList.remove('active'); };
    window.openManualModal = function() { document.getElementById('manualModal').classList.add('active'); };
    window.closeManualModal = function() { document.getElementById('manualModal').classList.remove('active'); };

    // ==========================
    // 4. 主题切换
    // ==========================
    var THEMES = { dark: 'theme-dark', azure: 'theme-azure', light: 'theme-light' };
    var currentTheme = localStorage.getItem('erp_theme') || 'dark';
    applyTheme(currentTheme);

    function applyTheme(themeKey) {
        var body = document.body;
        body.classList.remove('theme-dark', 'theme-azure', 'theme-light');
        body.classList.add(THEMES[themeKey]);
        localStorage.setItem('erp_theme', themeKey);
        currentTheme = themeKey;
        console.log('✅ 主题已切换为:', themeKey);
    }
    window.switchTheme = function(themeKey) { applyTheme(themeKey); };

    // ==========================
    // 5. 侧边栏渲染 (根据你当前的文件树 01-xx 结构)
    // ==========================
    var MENU_CONFIG = [
        { id: '01-dashboard/dashboard', icon: '📈', name: '智能决策中心' },
        { id: '02-pos/cash-register', icon: '🧾', name: '收银台' },
        { id: '03-orders/list', icon: '📦', name: '订单管理' },
        { id: '04-products/products', icon: '📦', name: '产品中心' },
        { id: '05-customers/customers', icon: '👥', name: '客户管理' },
        { id: '07-inventory', icon: '🏷️', name: '库存管理' },
        { id: '08-purchase/orders', icon: '🛒', name: '采购管理' },
        { id: '09-finance', icon: '💰', name: '财务管理' },
        { id: '10-hr', icon: '🧑‍💼', name: '人力资源' },
        { id: '06-marketing', icon: '📣', name: '营销管理' },
        { id: '13-analytics', icon: '📊', name: '数据分析' },
        { id: '15-ai/ai', icon: '🤖', name: 'AI 智能中枢' },
        { id: '11-saas', icon: '☁️', name: 'SaaS 服务' },
        { id: '14-settings', icon: '⚙️', name: '系统设置' },
        { id: '12-system', icon: '🔒', name: '系统管理' }
    ];

    window.renderDynamicSidebar = function() {
        var container = document.getElementById('sidebar-container');
        if (!container) return;

        container.innerHTML = 
        '<div class="sidebar">' +
            '<div class="sidebar-header"><div class="logo"><span>📊</span> Enterprise ERP</div></div>' +
            '<div class="sidebar-search"><input type="text" placeholder="搜索菜单..." class="search-input" id="menuSearch"></div>' +
            '<nav class="sidebar-nav" id="sidebarNav"><ul class="nav-list"></ul></nav>' +
            '<div class="sidebar-footer">' +
                '<div style="display:flex;align-items:center;gap:8px;">' +
                    '<span style="font-size:13px;color:var(--text-sub);">👤 管理员</span>' +
                    '<div style="display:flex;gap:4px;margin-left:4px;background:rgba(255,255,255,0.03);padding:2px;border-radius:6px;">' +
                        '<button onclick="switchTheme(\'dark\')" style="background:none;border:none;cursor:pointer;padding:4px 8px;border-radius:4px;font-size:14px;color:var(--text-sub);" title="深色主题">🌙</button>' +
                        '<button onclick="switchTheme(\'azure\')" style="background:none;border:none;cursor:pointer;padding:4px 8px;border-radius:4px;font-size:14px;color:var(--text-sub);" title="天蓝主题">💠</button>' +
                        '<button onclick="switchTheme(\'light\')" style="background:none;border:none;cursor:pointer;padding:4px 8px;border-radius:4px;font-size:14px;color:var(--text-sub);" title="银白主题">☀️</button>' +
                    '</div>' +
                '</div>' +
                '<div>' +
                    '<button onclick="handleLogout()" style="background:none;border:none;color:var(--text-sub);cursor:pointer;font-size:14px;">🚪</button>' +
                '</div>' +
            '</div>' +
        '</div>';

        var navList = document.querySelector('#sidebarNav .nav-list');
        MENU_CONFIG.forEach(function(mod) {
            var li = document.createElement('li');
            li.className = 'nav-item';
            var fullPath = '/modules/' + mod.id + '.html';
            li.innerHTML = 
                '<a href="' + fullPath + '" class="nav-link" data-module="' + mod.id + '">' +
                    '<span class="nav-icon">' + mod.icon + '</span>' +
                    '<span class="nav-text">' + mod.name + '</span>' +
                '</a>';
            navList.appendChild(li);
        });

        var searchInput = document.getElementById('menuSearch');
        if (searchInput) {
            searchInput.addEventListener('input', function() {
                var keyword = this.value.toLowerCase();
                document.querySelectorAll('.nav-item').forEach(function(item) {
                    var text = item.querySelector('.nav-text').textContent.toLowerCase();
                    item.style.display = text.includes(keyword) ? 'block' : 'none';
                });
            });
        }
    };

    // ==========================
    // 6. 登出功能
    // ==========================
    window.handleLogout = function() {
        if (confirm('确认退出登录吗？')) {
            if (typeof authManager !== 'undefined') {
                authManager.logout().then(function() { window.location.href = '/login.html'; });
            } else {
                window.location.href = '/login.html';
            }
        }
    };

    // ==========================
    // 7. 页面初始化 - 渲染侧边栏
    // ==========================
    function initPage() {
        if (typeof window.renderDynamicSidebar === 'function') {
            window.renderDynamicSidebar();
        }
    }

    if (document.readyState === 'complete') {
        setTimeout(initPage, 100);
    } else {
        document.addEventListener('DOMContentLoaded', initPage);
    }

    console.log('✅ 公共模块初始化完成 (已移除 localStorage 依赖)');
})();