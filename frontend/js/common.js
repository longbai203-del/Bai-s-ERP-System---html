/**
 * ERP 全局公共驱动引擎
 * 功能：侧边栏渲染 + 3套主题 + 全局存储 + VAT计算 + Tab/模态框统一控制
 */
(function() {
    'use strict';

    // ==========================
    // 1. 全局数据存储模块
    // ==========================
    window.ERPStorage = {
        get: function(key, def) {
            try {
                var d = localStorage.getItem('erp_' + key);
                return d ? JSON.parse(d) : def;
            } catch (e) {
                return def;
            }
        },
        set: function(key, val) {
            try {
                localStorage.setItem('erp_' + key, JSON.stringify(val));
            } catch (e) {}
        },
        remove: function(key) {
            localStorage.removeItem('erp_' + key);
        }
    };

    // ==========================
    // 2. VAT 计算 (15% 沙特合规)
    // ==========================
    window.ERPTax = {
        rate: 0.15,
        withVat: function(price) {
            return +(price * (1 + 0.15)).toFixed(2);
        },
        withoutVat: function(price) {
            return +(price / (1 + 0.15)).toFixed(2);
        },
        vatOnly: function(price) {
            return +(price * 0.15).toFixed(2);
        }
    };

    window.calcTax = window.ERPTax;
    window.DB = window.ERPStorage;

    // ==========================
    // 3. Tab 切换引擎（仅用于页面内部 Tab）
    // ==========================
    window.switchPanel = function(panelId, el) {
        var panelClass = el.closest('.ord-panel, .pos-panel, .fin-panel, .hr-panel, .pur-panel, .inv-panel, .mkt-panel, .fleet-panel, .cust-panel, .saas-panel, .sys-panel, .set-panel, .ai-grid-2col, .pd-panel');
        if (panelClass) {
            panelClass = panelClass.className.split(' ')[0];
        }
        
        if (!panelClass) {
            document.querySelectorAll('.panel-container').forEach(function(p) {
                p.classList.remove('active');
            });
            document.querySelectorAll('.analytics-tab').forEach(function(t) {
                t.classList.remove('active');
            });
            document.getElementById(panelId).classList.add('active');
            el.classList.add('active');
            return;
        }
        
        var prefix = panelClass.split('-')[0];
        document.querySelectorAll('.' + panelClass).forEach(function(p) {
            p.classList.remove('active');
        });
        document.querySelectorAll('.' + prefix + '-tab').forEach(function(t) {
            t.classList.remove('active');
        });
        document.getElementById(panelId).classList.add('active');
        el.classList.add('active');
    };

    // ==========================
    // 4. 模态框控制
    // ==========================
    window.openModal = function(id) {
        document.getElementById(id).classList.add('active');
    };
    window.closeModal = function(id) {
        document.getElementById(id).classList.remove('active');
    };

    window.openPaymentModal = function() {
        document.getElementById('paymentModal').classList.add('active');
    };
    window.closePaymentModal = function() {
        document.getElementById('paymentModal').classList.remove('active');
    };
    window.openManualModal = function() {
        document.getElementById('manualModal').classList.add('active');
    };
    window.closeManualModal = function() {
        document.getElementById('manualModal').classList.remove('active');
    };

    // ==========================
    // 5. 导出功能
    // ==========================
    window.exportCSV = function(name) {
        alert('✅ 正在导出 ' + (name || '当前') + ' 数据报表 CSV...');
    };

    // ==========================
    // 6. 主题切换
    // ==========================
    var THEMES = {
        dark: 'theme-dark',
        azure: 'theme-azure',
        light: 'theme-light'
    };

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

    window.switchTheme = function(themeKey) {
        applyTheme(themeKey);
    };

    // ==========================
    // 7. 侧边栏渲染（完整页面跳转）
    // ==========================
    var MENU_CONFIG = [
        { id: 'dashboard', icon: '📈', name: '智能决策中心', path: '/modules/dashboard/dashboard.html' },
        { id: 'orders', icon: '📦', name: '订单管理', path: '/modules/orders/orders.html' },
        { id: 'pos', icon: '🧾', name: 'POS 收银', path: '/modules/pos/pos.html' },
        { id: 'customers', icon: '👥', name: '客户管理', path: '/modules/customers/customers.html' },
        { id: 'products', icon: '📦', name: '产品中心', path: '/modules/products/products.html' },
        { id: 'inventory', icon: '🏷️', name: '库存管理', path: '/modules/inventory/inventory.html' },
        { id: 'purchase', icon: '🛒', name: '采购管理', path: '/modules/purchase/purchase.html' },
        { id: 'finance', icon: '💰', name: '财务管理', path: '/modules/finance/finance.html' },
        { id: 'hr', icon: '🧑‍💼', name: '人力资源', path: '/modules/hr/hr.html' },
        { id: 'employee', icon: '👨‍💻', name: '员工管理', path: '/modules/employee/employee.html' },
        { id: 'fleet', icon: '🚚', name: '车队管理', path: '/modules/fleet/fleet.html' },
        { id: 'marketing', icon: '📣', name: '营销管理', path: '/modules/marketing/marketing.html' },
        { id: 'analytics', icon: '📊', name: '数据分析', path: '/modules/analytics/analytics.html' },
        { id: 'ai', icon: '🤖', name: 'AI 智能中枢', path: '/modules/ai/ai.html' },
        { id: 'saas', icon: '☁️', name: 'SaaS 服务', path: '/modules/saas/saas.html' },
        { id: 'settings', icon: '⚙️', name: '系统设置', path: '/modules/settings/settings.html' },
        { id: 'system', icon: '🔒', name: '系统管理', path: '/modules/system/system.html' }
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
            // 使用绝对路径
            var fullPath = mod.path;
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
    // 8. 登出功能
    // ==========================
    window.handleLogout = function() {
        if (confirm('确认退出登录吗？')) {
            if (typeof authManager !== 'undefined') {
                authManager.logout().then(function() {
                    window.location.href = '/login.html';
                });
            } else {
                window.location.href = '/login.html';
            }
        }
    };

    // ==========================
    // 9. 页面初始化 - 只渲染侧边栏
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

    console.log('✅ 公共模块初始化完成');
})();