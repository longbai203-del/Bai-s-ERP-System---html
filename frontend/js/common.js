/**
 * Common - 公共配置和工具
 * 从 modules.json 读取唯一配置
 */

(function() {
    'use strict';

    let modulesConfig = null;
    let menuConfig = null;

    // 加载模块配置
    async function loadModulesConfig() {
        if (modulesConfig) return modulesConfig;

        try {
            const response = await fetch('/modules.json');
            if (!response.ok) throw new Error('加载 modules.json 失败');
            modulesConfig = await response.json();
            return modulesConfig;
        } catch (error) {
            console.warn('加载 modules.json 失败，使用默认配置:', error);
            return getDefaultConfig();
        }
    }

    function getDefaultConfig() {
        return {
            modules: {
                dashboard: { title: '仪表板', icon: '📊', enabled: true },
                pos: { title: '销售点', icon: '🛒', enabled: true },
                orders: { title: '订单管理', icon: '📋', enabled: true },
                customers: { title: '客户管理', icon: '👤', enabled: true },
                members: { title: '会员管理', icon: '💎', enabled: true },
                products: { title: '产品管理', icon: '📦', enabled: true },
                inventory: { title: '库存管理', icon: '📈', enabled: true },
                purchase: { title: '采购管理', icon: '📥', enabled: true },
                suppliers: { title: '供应商', icon: '🏭', enabled: true },
                finance: { title: '财务管理', icon: '💰', enabled: true },
                crm: { title: 'CRM', icon: '🤝', enabled: true },
                hr: { title: '人力资源', icon: '👔', enabled: true },
                reports: { title: '报表中心', icon: '📊', enabled: true },
                analytics: { title: '数据分析', icon: '📈', enabled: true },
                fleet: { title: '车队管理', icon: '🚗', enabled: true },
                ai: { title: 'AI助手', icon: '🤖', enabled: true },
                settings: { title: '系统设置', icon: '⚙️', enabled: true }
            },
            sections: {
                main: ['dashboard', 'pos', 'orders'],
                business: ['customers', 'members', 'products', 'inventory', 'purchase', 'suppliers'],
                finance: ['finance', 'reports', 'analytics'],
                management: ['crm', 'hr', 'fleet', 'ai'],
                system: ['settings']
            }
        };
    }

    // 获取菜单配置
    async function getMenuConfig() {
        if (menuConfig) return menuConfig;

        const config = await loadModulesConfig();
        const modules = config.modules || {};
        const sections = config.sections || {};

        const menuItems = [];

        for (const [sectionKey, moduleIds] of Object.entries(sections)) {
            const sectionNames = {
                main: '主要',
                business: '业务',
                finance: '财务',
                management: '管理',
                system: '系统'
            };

            const items = [];
            for (const id of moduleIds) {
                if (modules[id] && modules[id].enabled !== false) {
                    items.push({
                        id: id,
                        label: modules[id].title || id,
                        icon: modules[id].icon || '📄'
                    });
                }
            }

            if (items.length > 0) {
                menuItems.push({
                    section: sectionNames[sectionKey] || sectionKey,
                    items: items
                });
            }
        }

        menuConfig = menuItems;
        return menuConfig;
    }

    // 获取模块信息
    async function getModuleInfo(moduleId) {
        const config = await loadModulesConfig();
        return config.modules[moduleId] || null;
    }

    // 工具函数
    window.formatCurrency = function(amount) {
        if (amount === undefined || amount === null) return '0 SAR';
        return new Intl.NumberFormat('zh-CN', {
            style: 'currency',
            currency: 'SAR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    };

    window.formatDate = function(date) {
        if (!date) return '-';
        const d = new Date(date);
        return d.toLocaleDateString('zh-CN');
    };

    window.formatDateTime = function(date) {
        if (!date) return '-';
        const d = new Date(date);
        return d.toLocaleString('zh-CN');
    };

    window.getStatusBadge = function(status) {
        const map = {
            active: { label: '启用', class: 'badge-success' },
            inactive: { label: '停用', class: 'badge-danger' },
            pending: { label: '待处理', class: 'badge-warning' },
            completed: { label: '已完成', class: 'badge-success' },
            cancelled: { label: '已取消', class: 'badge-danger' },
            draft: { label: '草稿', class: 'badge-secondary' }
        };
        return map[status] || { label: status || '未知', class: 'badge-secondary' };
    };

    // 暴露配置加载函数
    window.loadModulesConfig = loadModulesConfig;
    window.getMenuConfig = getMenuConfig;
    window.getModuleInfo = getModuleInfo;

    // 预加载配置
    loadModulesConfig().catch(console.warn);

    console.log('📦 Common 模块加载完成');
})();
