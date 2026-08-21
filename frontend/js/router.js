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
            // 16 个核心模块
            const modules = [
                'dashboard', 'pos', 'orders', 'customers',
                'members', 'products', 'inventory', 'purchase',
                'suppliers', 'finance', 'crm', 'hr',
                'reports', 'analytics', 'settings', 'ai'
            ];

            this.routes = modules.map(m => ({
                path: '/modules/' + m + '/',
                module: m,
                title: this.getModuleTitle(m),
                icon: this.getModuleIcon(m)
            }));

            // 默认路由
            this.routes.unshift({ 
                path: '/', 
                module: 'dashboard', 
                title: '仪表板',
                icon: '📊',
                isDefault: true
            });
        }

        getModuleTitle(module) {
            const titles = {
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
                settings: '系统设置',
                ai: 'AI 智能助手'
            };
            return titles[module] || module;
        }

        getModuleIcon(module) {
            const icons = {
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
                settings: '⚙️',
                ai: '🤖'
            };
            return icons[module] || '📄';
        }

        bindEvents() {
            window.addEventListener('hashchange', () => this.handleRoute());
            window.addEventListener('popstate', () => this.handleRoute());

            // 监听 data-route 点击
            document.addEventListener('click', (e) => {
                const link = e.target.closest('[data-route]');
                if (link) {
                    e.preventDefault();
                    const href = link.getAttribute('href');
                    if (href) {
                        this.navigate(href);
                    }
                }
            });
        }

        navigate(path) {
            if (path === this.currentRoute?.path) return;
            
            // 更新 URL
            if (path.startsWith('/')) {
                history.pushState(null, '', path);
            } else {
                history.pushState(null, '', '/' + path);
            }
            
            this.handleRoute();
            
            // 更新侧边栏高亮
            this.updateActiveMenu(path);
        }

        handleRoute() {
            const path = window.location.pathname;
            const route = this.findRoute(path);
            
            if (!route) {
                this.show404();
                return;
            }

            // 检查权限
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
            // 移除末尾斜杠
            path = path.replace(/\/$/, '') || '/';
            
            // 精确匹配
            let route = this.routes.find(r => r.path === path || r.path === path + '/');
            if (route) return route;

            // 模块路径匹配
            route = this.routes.find(r => path.startsWith(r.path) && r.path !== '/');
            if (route) return route;

            // 根路径
            if (path === '' || path === '/') {
                return this.routes.find(r => r.isDefault) || this.routes[0];
            }

            return null;
        }

        checkPermission(route) {
            // 检查用户是否登录
            if (!window.Auth || !window.Auth.isAuthenticated()) {
                window.location.href = 'login.html';
                return false;
            }
            return true;
        }

        async loadModule(route) {
            const container = document.getElementById('main-content');
            if (!container) return;

            const moduleName = route.module;
            
            // 检查是否已加载
            let moduleEl = container.querySelector('[data-module="' + moduleName + '"]');
            if (moduleEl) {
                this.showModule(moduleEl);
                this.executeModuleScript(moduleName);
                return;
            }

            // 加载模块 HTML
            const htmlPath = route.path + 'index.html';
            
            try {
                const response = await fetch(htmlPath);
                if (!response.ok) {
                    throw new Error('模块加载失败: ' + response.status);
                }
                
                const html = await response.text();
                
                // 创建模块容器
                const div = document.createElement('div');
                div.dataset.module = moduleName;
                div.className = 'module-container active';
                div.innerHTML = html;
                
                // 隐藏所有其他模块
                container.querySelectorAll('.module-container').forEach(el => {
                    el.classList.remove('active');
                });
                
                container.appendChild(div);
                
                // 加载模块 JS
                await this.loadModuleScript(moduleName);
                
                // 执行模块初始化
                this.executeModuleScript(moduleName);
                
            } catch (error) {
                console.error('加载模块失败:', error);
                container.innerHTML = 
                    <div style="text-align:center;padding:60px 20px;color:#c33;">
                        <div style="font-size:48px;margin-bottom:16px;">⚠️</div>
                        <h3>模块加载失败</h3>
                        <p style="color:#999;"></p>
                        <button onclick="location.reload()" style="margin-top:16px;padding:8px 24px;background:#667eea;color:#fff;border:none;border-radius:4px;cursor:pointer;">刷新重试</button>
                    </div>
                ;
            }
        }

        showModule(element) {
            // 隐藏所有模块
            document.querySelectorAll('.module-container').forEach(el => {
                el.classList.remove('active');
            });
            element.classList.add('active');
        }

        async loadModuleScript(moduleName) {
            const scriptId = 'module-script-' + moduleName;
            if (document.getElementById(scriptId)) {
                return;
            }

            return new Promise((resolve, reject) => {
                const script = document.createElement('script');
                script.id = scriptId;
                script.src = '/modules/' + moduleName + '/' + moduleName + '.js';
                script.onload = resolve;
                script.onerror = function() {
                    console.warn('模块脚本加载失败: ' + moduleName);
                    resolve(); // 继续执行，不阻塞
                };
                document.head.appendChild(script);
            });
        }

        executeModuleScript(moduleName) {
            const initFn = window['init' + moduleName.charAt(0).toUpperCase() + moduleName.slice(1)];
            if (typeof initFn === 'function') {
                try {
                    initFn();
                } catch (error) {
                    console.error('执行模块初始化失败:', error);
                }
            }
        }

        updateActiveMenu(path) {
            document.querySelectorAll('.nav-item').forEach(el => {
                el.classList.remove('active');
                const route = el.getAttribute('data-route');
                if (route && (path === route || path.startsWith(route))) {
                    el.classList.add('active');
                }
            });
        }

        updatePageTitle(route) {
            const title = route.title || route.module || 'Bai\'s ERP';
            document.title = title + ' - Bai\'s ERP';
            
            const pageTitle = document.getElementById('pageTitle');
            if (pageTitle) {
                pageTitle.textContent = title;
            }
        }

        show404() {
            const container = document.getElementById('main-content');
            if (container) {
                container.innerHTML = 
                    <div style="text-align:center;padding:80px 20px;">
                        <div style="font-size:64px;margin-bottom:16px;">404</div>
                        <h2>页面未找到</h2>
                        <p style="color:#999;">您访问的页面不存在</p>
                        <a href="/" style="display:inline-block;margin-top:16px;padding:8px 24px;background:#667eea;color:#fff;border-radius:4px;text-decoration:none;">返回首页</a>
                    </div>
                ;
            }
        }

        show403() {
            const container = document.getElementById('main-content');
            if (container) {
                container.innerHTML = 
                    <div style="text-align:center;padding:80px 20px;">
                        <div style="font-size:64px;margin-bottom:16px;">🔒</div>
                        <h2>访问被拒绝</h2>
                        <p style="color:#999;">您没有权限访问此页面</p>
                        <a href="/" style="display:inline-block;margin-top:16px;padding:8px 24px;background:#667eea;color:#fff;border-radius:4px;text-decoration:none;">返回首页</a>
                    </div>
                ;
            }
        }

        getCurrentRoute() {
            return this.currentRoute;
        }

        refresh() {
            this.handleRoute();
        }
    }

    // 暴露全局 Router
    window.Router = new Router();

    console.log('📍 Router 模块加载完成');
})();
