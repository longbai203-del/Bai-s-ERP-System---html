/**
 * Common - 公共配置和工具
 */

// 菜单配置
// 菜单配置
window.MENU_CONFIG = [
    {
        section: '主要',
        items: [
            { id: 'dashboard', label: '仪表板', icon: '📊' },
            { id: 'pos', label: '销售点', icon: '🛒' },
            { id: 'orders', label: '订单管理', icon: '📋' }
        ]
    },
    {
        section: '租户管理',
        items: [
            { id: 'organizations', label: '组织管理', icon: '🏢' },
            { id: 'branches', label: '分支管理', icon: '🏪' },
            { id: 'profiles', label: '用户管理', icon: '👥' },
            { id: 'roles', label: '角色管理', icon: '🔐' }
        ]
    },
    {
        section: '业务',
        items: [
            { id: 'customers', label: '客户管理', icon: '👤' },
            { id: 'members', label: '会员管理', icon: '💎' },
            { id: 'products', label: '产品管理', icon: '📦' },
            { id: 'inventory', label: '库存管理', icon: '📈' },
            { id: 'purchase', label: '采购管理', icon: '📥' },
            { id: 'suppliers', label: '供应商', icon: '🏭' }
        ]
    },
    {
        section: '财务',
        items: [
            { id: 'finance', label: '财务管理', icon: '💰' },
            { id: 'reports', label: '报表中心', icon: '📊' },
            { id: 'analytics', label: '数据分析', icon: '📈' }
        ]
    },
    {
        section: '管理',
        items: [
            { id: 'hr', label: '人力资源', icon: '👔' },
            { id: 'crm', label: 'CRM', icon: '🤝' },
            { id: 'fleet', label: '车队管理', icon: '🚗' },
            { id: 'ai', label: 'AI助手', icon: '🤖' },
            { id: 'settings', label: '系统设置', icon: '⚙️' }
        ]
    }
];
    },
    {
        section: '业务',
        items: [
            { id: 'customers', label: '客户管理', icon: '👤' },
            { id: 'members', label: '会员管理', icon: '💎' },
            { id: 'products', label: '产品管理', icon: '📦' },
            { id: 'inventory', label: '库存管理', icon: '📈' },
            { id: 'purchase', label: '采购管理', icon: '📥' },
            { id: 'suppliers', label: '供应商', icon: '🏭' }
        ]
    },
    {
        section: '财务',
        items: [
            { id: 'finance', label: '财务管理', icon: '💰' },
            { id: 'reports', label: '报表中心', icon: '📊' },
            { id: 'analytics', label: '数据分析', icon: '📈' }
        ]
    },
    {
        section: '管理',
        items: [
            { id: 'hr', label: '人力资源', icon: '👔' },
            { id: 'crm', label: 'CRM', icon: '🤝' },
            { id: 'fleet', label: '车队管理', icon: '🚗' },
            { id: 'ai', label: 'AI助手', icon: '🤖' },
            { id: 'settings', label: '系统设置', icon: '⚙️' }
        ]
    }
];

// 模块映射
window.MODULE_MAP = {
    dashboard: { title: '仪表板', icon: '📊' },
    pos: { title: '销售点', icon: '🛒' },
    orders: { title: '订单管理', icon: '📋' },
    customers: { title: '客户管理', icon: '👤' },
    members: { title: '会员管理', icon: '💎' },
    products: { title: '产品管理', icon: '📦' },
    inventory: { title: '库存管理', icon: '📈' },
    purchase: { title: '采购管理', icon: '📥' },
    suppliers: { title: '供应商', icon: '🏭' },
    finance: { title: '财务管理', icon: '💰' },
    crm: { title: 'CRM', icon: '🤝' },
    hr: { title: '人力资源', icon: '👔' },
    reports: { title: '报表中心', icon: '📊' },
    analytics: { title: '数据分析', icon: '📈' },
    fleet: { title: '车队管理', icon: '🚗' },
    ai: { title: 'AI助手', icon: '🤖' },
    settings: { title: '系统设置', icon: '⚙️' }
};

// 工具函数
function formatCurrency(amount) {
    const locale = window.I18n?.getLocale() || 'zh-CN';
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: 'SAR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount || 0);
}

function formatDate(date) {
    if (!date) return '-';
    const d = new Date(date);
    return d.toLocaleDateString('zh-CN');
}

function formatDateTime(date) {
    if (!date) return '-';
    const d = new Date(date);
    return d.toLocaleString('zh-CN');
}

function getStatusBadge(status) {
    const map = {
        active: { label: '启用', class: 'badge-success' },
        inactive: { label: '停用', class: 'badge-danger' },
        pending: { label: '待处理', class: 'badge-warning' },
        completed: { label: '已完成', class: 'badge-success' },
        cancelled: { label: '已取消', class: 'badge-danger' },
        draft: { label: '草稿', class: 'badge-secondary' }
    };
    return map[status] || { label: status, class: 'badge-secondary' };
}

console.log('📦 Common 模块加载完成');

