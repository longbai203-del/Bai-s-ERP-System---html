/**
 * @file router.js
 * @description 前端路由管理器
 * @version 2.0.0
 */

import { apiClient } from '../services/api-client.js';
import { store } from './store.js';

/**
 * 路由配置
 */
const routes = {
    '/': { module: 'dashboard', title: '仪表盘' },
    '/dashboard': { module: 'dashboard', title: '仪表盘' },
    '/pos': { module: 'pos', title: '收银台' },
    '/orders': { module: 'orders', title: '订单管理' },
    '/products': { module: 'products', title: '商品管理' },
    '/customers': { module: 'customers', title: '客户管理' },
    '/marketing': { module: 'marketing', title: '营销管理' },
    '/inventory': { module: 'inventory', title: '库存管理' },
    '/purchase': { module: 'purchase', title: '采购管理' },
    '/finance': { module: 'finance', title: '财务管理' },
    '/hr': { module: 'hr', title: '人力资源管理' },
    '/saas': { module: 'saas', title: 'SaaS管理' },
    '/system': { module: 'system', title: '系统管理' },
    '/analytics': { module: 'analytics', title: '数据分析' },
    '/settings': { module: 'settings', title: '设置' },
    '/ai': { module: 'ai', title: 'AI助手' }
};

/**
 * 路由器对象
 */
export const router = {
    currentRoute: '/',
    currentModule: null,
    container: null,

    /**
     * 初始化路由器
     */
    init() {
        this.container = document.getElementById('app-container');
        if (!this.container) {
            console.warn('⚠️ [Router] 找不到 app-container');
            return;
        }

        // 监听 hash 变化
        window.addEventListener('hashchange', () => {
            this.handleRoute();
        });

        // 监听 popstate
        window.addEventListener('popstate', () => {
            this.handleRoute();
        });

        // 初始化路由
        this.handleRoute();

        console.log('✅ [Router] 已初始化');
    },

    /**
     * 处理路由
     */
    async handleRoute() {
        const path = window.location.hash.replace('#', '') || '/';
        const route = this.matchRoute(path);
        
        if (route) {
            await this.loadModule(route);
        } else {
            console.warn(`⚠️ [Router] 未找到路由: ${path}`);
            await this.loadModule(routes['/']);
        }
    },

    /**
     * 匹配路由
     */
    matchRoute(path) {
        // 精确匹配
        if (routes[path]) {
            return { ...routes[path], path };
        }

        // 模糊匹配（支持动态路由）
        for (const [routePath, config] of Object.entries(routes)) {
            if (path.startsWith(routePath)) {
                return { ...config, path: routePath };
            }
        }

        return null;
    },

    /**
     * 加载模块
     */
    async loadModule(route) {
        try {
            const moduleName = route.module;
            this.currentRoute = route.path;
            this.currentModule = moduleName;

            // 更新页面标题
            document.title = `${route.title} - Bai's ERP`;

            // 动态导入模块
            const modulePath = `../modules/${this.getModuleFolder(moduleName)}/${moduleName}.js`;
            const module = await import(modulePath);

            // 调用模块的 init 方法
            if (module.init) {
                await module.init();
            }

            // 更新导航状态
            this.updateNav(moduleName);

            console.log(`✅ [Router] 加载模块: ${moduleName}`);
        } catch (error) {
            console.error(`❌ [Router] 加载模块失败:`, error);
            this.showError('模块加载失败，请刷新页面重试');
        }
    },

    /**
     * 获取模块文件夹
     */
    getModuleFolder(moduleName) {
        const moduleMap = {
            'dashboard': '01-dashboard',
            'pos': '02-pos',
            'orders': '03-orders',
            'products': '04-products',
            'customers': '05-customers',
            'marketing': '06-marketing',
            'inventory': '07-inventory',
            'purchase': '08-purchase',
            'finance': '09-finance',
            'hr': '10-hr',
            'saas': '11-saas',
            'system': '12-system',
            'analytics': '13-analytics',
            'settings': '14-settings',
            'ai': '15-ai'
        };
        return moduleMap[moduleName] || `01-${moduleName}`;
    },

    /**
     * 更新导航
     */
    updateNav(moduleName) {
        // 移除所有活动状态
        document.querySelectorAll('.nav-item').forEach(el => {
            el.classList.remove('active');
        });

        // 添加活动状态
        const activeNav = document.querySelector(`[data-module="${moduleName}"]`);
        if (activeNav) {
            activeNav.classList.add('active');
        }
    },

    /**
     * 显示错误
     */
    showError(message) {
        const container = this.container;
        if (container) {
            container.innerHTML = `
                <div class="error-container">
                    <div class="error-icon">⚠️</div>
                    <h2>加载失败</h2>
                    <p>${message}</p>
                    <button onclick="location.reload()" class="btn-primary">
                        刷新页面
                    </button>
                </div>
            `;
        }
    },

    /**
     * 导航到指定路径
     */
    navigate(path) {
        window.location.hash = path;
    },

    /**
     * 获取当前路由
     */
    getCurrentRoute() {
        return this.currentRoute;
    },

    /**
     * 获取当前模块
     */
    getCurrentModule() {
        return this.currentModule;
    }
};

// 导出默认对象
export default router;

console.log('✅ [Router] 已加载');