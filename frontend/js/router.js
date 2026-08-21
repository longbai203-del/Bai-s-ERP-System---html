/**
 * Router - 统一路由管理器
 */

(function() {
    'use strict';

    class Router {
        constructor() {
            this.routes = [];
            this.currentRoute = null;
            this.basePath = '/';
        }

        init() {
            this.loadRoutes();
            this.bindEvents();
            this.handleRoute();
            console.log('📍 Router 初始化完成，共 ' + this.routes.length + ' 条路由');
        }

        loadRoutes() {
            // 从 modules.json 或内置配置加载
            const modules = [
                'dashboard', 'pos', 'orders', 'customers',
                'members', 'products', 'inventory', 'purchase',
                'suppliers', 'finance', 'crm', 'hr',
                'reports', 'analytics', 'fleet', 'ai', 'settings'
            ];

            this.routes = modules.map(function(m) {
                var titles = {
                    dashboard: '仪表板',
                    pos: '销售点',
                    orders: '订单管理',
                    customers: '客户管理',
                    members: '会员管理',
                    products: '产品管理',
                    inventory: '库存管理',
                    purchase: '采购管理',
                    suppliers: '供应商管理',
                    finance: '财务管理',
                    crm: '客户关系管理',
                    hr: '人力资源管理',
                    reports: '报表中心',
                    analytics: '数据分析',
                    fleet: '车队管理',
                    ai: 'AI助手',
                    settings: '系统设置'
                };
                var icons = {
                    dashboard: '📊',
                    pos: '🛒',
                    orders: '📋',
                    customers: '👤',
                    members: '💎',
                    products: '📦',
                    inventory: '📈',
                    purchase: '📥',
                    suppliers: '🏭',
                    finance: '💰',
                    crm: '🤝',
                    hr: '👔',
                    reports: '📊',
                    analytics: '📈',
                    fleet: '🚗',
                    ai: '🤖',
                    settings: '⚙️'
                };
                return {
                    path: '/modules/' + m + '/',
                    module: m,
                    title: titles[m] || m,
                    icon: icons[m] || '📄'
                };
            });

            // 默认路由
            this.routes.unshift({
                path: '/',
                module: 'dashboard',
                title: '仪表板',
                icon: '📊',
                isDefault: true
            });
        }

        bindEvents() {
            var self = this;
            window.addEventListener('hashchange', function() { self.handleRoute(); });
            window.addEventListener('popstate', function() { self.handleRoute(); });

            document.addEventListener('click', function(e) {
                var link = e.target.closest('[data-route]');
                if (link) {
                    e.preventDefault();
                    var href = link.getAttribute('href');
                    if (href) {
                        self.navigate(href);
                    }
                }
            });
        }

        navigate(path) {
            if (path === this.currentRoute?.path) return;
            if (path.startsWith('/')) {
                history.pushState(null, '', path);
            } else {
                history.pushState(null, '', '/' + path);
            }
            this.handleRoute();
            this.updateActiveMenu(path);
        }

        handleRoute() {
            var path = window.location.pathname;
            var route = this.findRoute(path);

            if (!route) {
                this.show404();
                return;
            }

            if (!this.checkPermission(route)) {
                this.show403();
                return;
            }

            this.currentRoute = route;
            this.loadModule(route);
            this.updatePageTitle(route);
            this.updateActiveMenu(route.path);
        }

        findRoute(path) {
            path = path.replace(/\/$/, '') || '/';

            // 精确匹配
            for (var i = 0; i < this.routes.length; i++) {
                var r = this.routes[i];
                if (r.path === path || r.path === path + '/') {
                    return r;
                }
            }

            // 模块路径匹配
            for (var j = 0; j < this.routes.length; j++) {
                var r2 = this.routes[j];
                if (path.startsWith(r2.path) && r2.path !== '/') {
                    return r2;
                }
            }

            // 根路径
            if (path === '' || path === '/') {
                for (var k = 0; k < this.routes.length; k++) {
                    if (this.routes[k].isDefault) {
                        return this.routes[k];
                    }
                }
                return this.routes[0];
            }

            return null;
        }

        checkPermission(route) {
            if (!window.Auth || !window.Auth.isAuthenticated()) {
                window.location.href = 'login.html';
                return false;
            }
            return true;
        }

        loadModule(route) {
            var container = document.getElementById('main-content');
            if (!container) return;

            var moduleName = route.module;

            // 检查是否已加载
            var moduleEl = container.querySelector('[data-module="' + moduleName + '"]');
            if (moduleEl) {
                this.showModule(moduleEl);
                this.executeModuleScript(moduleName);
                return;
            }

            var htmlPath = route.path + 'index.html';
            var self = this;

            fetch(htmlPath)
                .then(function(response) {
                    if (!response.ok) {
                        throw new Error('模块加载失败: ' + response.status);
                    }
                    return response.text();
                })
                .then(function(html) {
                    var div = document.createElement('div');
                    div.dataset.module = moduleName;
                    div.className = 'module-container active';
                    div.innerHTML = html;

                    container.querySelectorAll('.module-container').forEach(function(el) {
                        el.classList.remove('active');
                    });

                    container.appendChild(div);
                    self.loadModuleScript(moduleName);
                    self.executeModuleScript(moduleName);
                })
                .catch(function(error) {
                    console.error('加载模块失败:', error);
                    container.innerHTML = '<div style="text-align:center;padding:60px 20px;color:#c33;"><div style="font-size:48px;margin-bottom:16px;">⚠️</div><h3>模块加载失败</h3><p style="color:#999;">' + error.message + '</p><button onclick="location.reload()" style="margin-top:16px;padding:8px 24px;background:#667eea;color:#fff;border:none;border-radius:4px;cursor:pointer;">刷新重试</button></div>';
                });
        }

        showModule(element) {
            document.querySelectorAll('.module-container').forEach(function(el) {
                el.classList.remove('active');
            });
            element.classList.add('active');
        }

        loadModuleScript(moduleName) {
            var scriptId = 'module-script-' + moduleName;
            if (document.getElementById(scriptId)) {
                return;
            }

            var script = document.createElement('script');
            script.id = scriptId;
            script.src = '/modules/' + moduleName + '/' + moduleName + '.js';
            script.onload = function() {
                console.log('✅ 模块脚本加载完成: ' + moduleName);
            };
            script.onerror = function() {
                console.warn('⚠️ 模块脚本加载失败: ' + moduleName);
            };
            document.head.appendChild(script);
        }

        executeModuleScript(moduleName) {
            var initFn = window['init' + moduleName.charAt(0).toUpperCase() + moduleName.slice(1)];
            if (typeof initFn === 'function') {
                try {
                    initFn();
                } catch (error) {
                    console.error('执行模块初始化失败:', error);
                }
            }
        }

        updateActiveMenu(path) {
            document.querySelectorAll('.nav-item').forEach(function(el) {
                el.classList.remove('active');
                var route = el.getAttribute('data-route');
                if (route && (path === route || path.startsWith(route))) {
                    el.classList.add('active');
                }
            });
        }

        updatePageTitle(route) {
            var title = route.title || route.module || 'Bai\'s ERP';
            document.title = title + ' - Bai\'s ERP';

            var pageTitle = document.getElementById('pageTitle');
            if (pageTitle) {
                pageTitle.textContent = title;
            }
        }

        show404() {
            var container = document.getElementById('main-content');
            if (container) {
                container.innerHTML = '<div style="text-align:center;padding:80px 20px;"><div style="font-size:64px;margin-bottom:16px;">404</div><h2>页面未找到</h2><p style="color:#999;">您访问的页面不存在</p><a href="/" style="display:inline-block;margin-top:16px;padding:8px 24px;background:#667eea;color:#fff;border-radius:4px;text-decoration:none;">返回首页</a></div>';
            }
        }

        show403() {
            var container = document.getElementById('main-content');
            if (container) {
                container.innerHTML = '<div style="text-align:center;padding:80px 20px;"><div style="font-size:64px;margin-bottom:16px;">🔒</div><h2>访问被拒绝</h2><p style="color:#999;">您没有权限访问此页面</p><a href="/" style="display:inline-block;margin-top:16px;padding:8px 24px;background:#667eea;color:#fff;border-radius:4px;text-decoration:none;">返回首页</a></div>';
            }
        }

        getCurrentRoute() {
            return this.currentRoute;
        }

        refresh() {
            this.handleRoute();
        }
    }

    window.Router = new Router();
    console.log('📍 Router 模块加载完成');
})();
