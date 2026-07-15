/**
 * @file router.js
 * @description Vue Router 配置 - 增强版
 * @module core/router
 */

import { createRouter, createWebHistory } from 'vue-router';
import { modules } from '../modules.config.js';

// ============================================================
// 路由配置
// ============================================================

const routes = [
    // 根路径重定向
    {
        path: '/',
        redirect: '/dashboard'
    },

    // 登录页（不需要认证）
    {
        path: '/login',
        name: 'Login',
        component: () => import('../views/Login.vue'),
        meta: {
            title: '登录',
            requiresAuth: false,
            layout: 'empty'
        }
    },

    // 仪表盘（单独保留，确保始终可访问）
    {
        path: '/dashboard',
        name: 'Dashboard',
        component: () => import('../views/Dashboard.vue'),
        meta: {
            title: '仪表盘',
            icon: 'fa-chart-line',
            requiresAuth: true,
            moduleId: '01-dashboard'
        }
    },

    // ============================================================
    // 动态生成所有模块路由（从 modules.config.js）
    // ============================================================
    ...modules
        .filter(m => m.id !== '01-dashboard') // 仪表盘已单独定义
        .map(module => ({
            path: module.path,
            name: module.id,
            component: () => import(`../modules/${module.id}/index.js`),
            meta: {
                title: module.title,
                icon: module.icon,
                requiresAuth: true,
                moduleId: module.id
            }
        })),

    // ============================================================
    // 404 捕获 - 重定向到仪表盘
    // ============================================================
    {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        redirect: '/dashboard'
    }
];

// ============================================================
// 创建路由实例
// ============================================================

const router = createRouter({
    history: createWebHistory(),
    routes,
    scrollBehavior(to, from, savedPosition) {
        // 如果有保存的位置，回到该位置
        if (savedPosition) {
            return savedPosition;
        }
        // 否则滚动到顶部
        return { top: 0 };
    }
});

// ============================================================
// 路由守卫 - 认证和权限检查
// ============================================================

router.beforeEach((to, from, next) => {
    // ----- 1. 设置页面标题 -----
    const defaultTitle = 'Bai\'s ERP';
    document.title = to.meta.title ? `${to.meta.title} | ${defaultTitle}` : defaultTitle;

    // ----- 2. 获取认证状态 -----
    const token = localStorage.getItem('accessToken');
    const userStr = localStorage.getItem('user');
    let user = null;
    try {
        user = userStr ? JSON.parse(userStr) : null;
    } catch (e) {
        console.warn('解析用户数据失败');
    }

    const isAuthenticated = !!token && !!user;
    const requiresAuth = to.meta.requiresAuth !== false;

    // ----- 3. 需要认证但未登录 -----
    if (requiresAuth && !isAuthenticated) {
        // 记录目标路径，登录后跳转回来
        return next({
            path: '/login',
            query: { redirect: to.fullPath }
        });
    }

    // ----- 4. 已登录但访问登录页 -----
    if (to.path === '/login' && isAuthenticated) {
        return next('/dashboard');
    }

    // ----- 5. 权限检查（可选） -----
    // 如果路由需要特定权限
    if (to.meta.permissions && user) {
        const userPermissions = user.permissions || [];
        const hasPermission = to.meta.permissions.some(p => userPermissions.includes(p));
        if (!hasPermission && user.role !== 'admin' && user.role !== 'owner') {
            // 无权限，跳转到仪表盘
            console.warn(`[Router] 用户无权限访问: ${to.path}`);
            return next('/dashboard');
        }
    }

    // ----- 6. 正常放行 -----
    next();
});

// ============================================================
// 路由后置钩子
// ============================================================

router.afterEach((to, from) => {
    // 关闭移动端菜单
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.querySelector('.sidebar-overlay');
    if (sidebar && sidebar.classList.contains('mobile-open')) {
        sidebar.classList.remove('mobile-open');
    }
    if (overlay) {
        overlay.classList.remove('active');
    }

    // 滚动到页面顶部（对于新页面）
    const mainContent = document.querySelector('#page-content');
    if (mainContent) {
        mainContent.scrollTop = 0;
    }
});

// ============================================================
// 导出
// ============================================================

export default router;