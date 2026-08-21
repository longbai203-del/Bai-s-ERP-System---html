/**
 * Router - 前端路由管理器
 * 负责 SPA 页面切换和权限控制
 */

(function() {
    'use strict';

    class Router {
        constructor() {
            this.routes = [];
            this.currentRoute = null;
            this.basePath = '/';
        }

        // 初始化
        init() {
            this.loadRoutes();
            this.bindEvents();
            this.handleRoute();
            console.log('📍 Router initialized with', this.routes.length, 'routes');
        }

        // 加载路由配置
        loadRoutes() {
            // 从 modules.json 或内置配置加载
            if (window.MODULES) {
                this.routes = window.MODULES.map(m => ({
                    path: `/modules/${m.id}/`,
                    module: m.id,
                    title: m.name,
                    icon: m.icon,
                    roles: m.roles || ['admin', 'manager']
                }));
            }

            // 添加默认路由
            this.routes.push({ path: '/', module: 'dashboard', title: '仪表板', roles: ['admin', 'manager', 'user'] });
            this.routes.push({ path: '/dashboard', module: 'dashboard', title: '仪表板', roles: ['admin', 'manager', 'user'] });
        }

        // 绑定事件
        bindEvents() {
            // 监听 hash 变化
            window.addEventListener('hashchange', () => this.handleRoute());
            
            // 监听 popstate
            window.addEventListener('popstate', () => this.handleRoute());

            // 监听所有侧边栏链接点击
            document.addEventListener('click', (e) => {
                const link = e.target.closest('a[data-route]');
                if (link) {
                    e.preventDefault();
                    this.navigate(link.getAttribute('href'));
                }
            });
        }

        // 导航到指定路径
        navigate(path) {
            if (path === this.currentRoute?.path) return;
            
            // 更新 URL
            if (path.startsWith('/')) {
                history.pushState(null, '', path);
            } else {
                history.pushState(null, '', '/' + path);
            }
            
            this.handleRoute();
        }

        // 处理当前路由
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
            this.updateActiveMenu(route);
            this.updatePageTitle(route);
        }

        // 查找路由
        findRoute(path) {
            // 移除末尾斜杠
            path = path.replace(/\/$/, '');
            
            // 精确匹配
            let route = this.routes.find(r => r.path === path);
            if (route) return route;

            // 模块路径匹配
            route = this.routes.find(r => path.startsWith(r.path) && r.path !== '/');
            if (route) return route;

            // 根路径
            if (path === '' || path === '/') {
                return this.routes.find(r => r.path === '/');
            }

            return null;
        }

        // 检查权限
        checkPermission(route) {
            // 如果不需要登录的页面
            const publicPages = ['/login', '/register', '/404'];
            if (publicPages.includes(window.location.pathname)) return true;

            // 检查用户角色
            if (!window._currentUser) {
                window.location.href = 'login.html';
                return false;
            }

            const userRole = window._currentUser.profile?.role || 'user';
            
            // 管理员可以访问所有页面
            if (userRole === 'admin') return true;

            // 检查角色权限
            if (route.roles && !route.roles.includes(userRole)) {
                return false;
            }

            // 检查自定义权限
            if (window.Permissions) {
                const required = route.permissions || [];
                for (const perm of required) {
                    if (!window.Permissions.has(perm)) {
                        return false;
                    }
                }
            }

            return true;
        }

        // 加载模块
        loadModule(route) {
            if (!route.module) return;

            const container = document.getElementById('main-content');
            if (!container) return;

            // 如果模块已加载，直接显示
            const moduleEl = document.querySelector(`[data-module="${route.module}"]`);
            if (moduleEl) {
                this.showModule(moduleEl);
                this.executeModuleScript(route.module);
                return;
            }

            // 加载模块 HTML
            const htmlPath = `${route.path}index.html`;
            fetch(htmlPath)
                .then(response => {
                    if (!response.ok) throw new Error('Module not found');
                    return response.text();
                })
                .then(html => {
                    // 创建模块容器
                    const div = document.createElement('div');
                    div.dataset.module = route.module;
                    div.className = 'module-container';
                    div.style.display = 'none';
                    div.innerHTML = html;
                    container.appendChild(div);
                    
                    this.showModule(div);
                    // 加载模块 JS
                    this.loadModuleScript(route.module);
                })
                .catch(error => {
                    console.error('加载模块失败:', error);
                    this.showError('模块加载失败');
                });
        }

        // 显示模块
        showModule(element) {
            // 隐藏所有模块
            document.querySelectorAll('.module-container').forEach(el => {
                el.style.display = 'none';
            });
            element.style.display = 'block';
        }

        // 加载模块脚本
        loadModuleScript(moduleName) {
            const existing = document.querySelector(`script[data-module="${moduleName}"]`);
            if (existing) {
                this.executeModuleScript(moduleName);
                return;
            }

            const script = document.createElement('script');
            script.dataset.module = moduleName;
            script.src = `/modules/${moduleName}/${moduleName}.js`;
            script.onload = () => {
                this.executeModuleScript(moduleName);
            };
            script.onerror = () => {
                console.warn(`模块 ${moduleName} 脚本加载失败`);
            };
            document.head.appendChild(script);
        }

        // 执行模块脚本
        executeModuleScript(moduleName) {
            const fn = window[`init${capitalize(moduleName)}`];
            if (typeof fn === 'function') {
                fn();
            }
        }

        // 更新活动菜单
        updateActiveMenu(route) {
            document.querySelectorAll('.nav-link').forEach(el => {
                el.classList.remove('active');
                if (el.getAttribute('href') === route.path) {
                    el.classList.add('active');
                }
            });
        }

        // 更新页面标题
        updatePageTitle(route) {
            if (route.title) {
                document.title = `${route.title} - Bai's ERP`;
            }
        }

        // 显示 404
        show404() {
            window.location.href = '/404.html';
        }

        // 显示 403
        show403() {
            if (window.Notifications) {
                window.Notifications.error('您没有权限访问此页面');
            }
            history.back();
        }

        // 显示错误
        showError(message) {
            if (window.Notifications) {
                window.Notifications.error(message);
            }
        }

        // 获取当前路由
        getCurrentRoute() {
            return this.currentRoute;
        }

        // 跳转
        go(path) {
            this.navigate(path);
        }

        // 刷新
        refresh() {
            this.handleRoute();
        }
    }

    function capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    // 导出
    window.Router = new Router();

})();