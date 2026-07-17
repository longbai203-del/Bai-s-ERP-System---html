// config/modules.config.js
// 15个主模块完整配置

export const MODULES = {
    '01-dashboard': {
        id: '01-dashboard',
        name: '仪表盘',
        icon: '📊',
        path: '/modules/01-dashboard',
        default: 'dashboard',
        children: [
            { id: 'dashboard', name: '总览', path: 'dashboard' },
            { id: 'employee', name: '员工看板', path: 'employee' },
            { id: 'executive', name: '高管驾驶舱', path: 'executive' },
            { id: 'vehicle-monitor', name: '车辆监控', path: 'vehicle-monitor' }
        ]
    },
    '02-pos': {
        id: '02-pos',
        name: 'POS收银',
        icon: '🛒',
        path: '/modules/02-pos',
        default: 'index',
        children: [
            { id: 'cash-register', name: '收银台', path: 'cash-register' },
            { id: 'cashier', name: '收银员', path: 'cashier' },
            { id: 'customer-display', name: '顾客显示屏', path: 'customer-display' },
            { id: 'exchange', name: '换货管理', path: 'exchange' },
            { id: 'kitchen-display', name: '厨房显示', path: 'kitchen-display' },
            { id: 'offline-pos', name: '离线POS', path: 'offline-pos' },
            { id: 'quick-sale', name: '快速销售', path: 'quick-sale' },
            { id: 'receipt', name: '小票管理', path: 'receipt' },
            { id: 'touch-pos', name: '触屏POS', path: 'touch-pos' }
        ]
    },
    '03-orders': {
        id: '03-orders',
        name: '订单管理',
        icon: '📋',
        path: '/modules/03-orders',
        default: 'list',
        children: [
            { id: 'list', name: '订单列表', path: 'list' },
            { id: 'detail', name: '订单详情', path: 'detail' },
            { id: 'refunds', name: '退款管理', path: 'refunds' },
            { id: 'returns', name: '退货管理', path: 'returns' },
            { id: 'submodules', name: '子模块', path: 'submodules' }
        ]
    },
    '04-products': {
        id: '04-products',
        name: '商品管理',
        icon: '📦',
        path: '/modules/04-products',
        default: 'products',
        children: [
            { id: 'products', name: '商品列表', path: 'products' },
            { id: 'variants', name: '商品变体', path: 'variants' },
            { id: 'categories', name: '分类管理', path: 'categories' },
            { id: 'brands', name: '品牌管理', path: 'brands' },
            { id: 'barcodes', name: '条码管理', path: 'barcodes' },
            { id: 'price-lists', name: '价格表', path: 'price-lists' },
            { id: 'combos', name: '组合商品', path: 'combos' },
            { id: 'modifiers', name: '附加选项', path: 'modifiers' }
        ]
    },
    '05-customers': {
        id: '05-customers',
        name: '客户管理',
        icon: '👥',
        path: '/modules/05-customers',
        default: 'customers',
        children: [
            { id: 'customers', name: '客户列表', path: 'customers' },
            { id: 'membership', name: '会员管理', path: 'membership' },
            { id: 'wallet', name: '钱包管理', path: 'wallet' },
            { id: 'gift-cards', name: '礼品卡', path: 'gift-cards' },
            { id: 'vehicles', name: '车辆管理', path: 'vehicles' },
            { id: 'feedback', name: '客户反馈', path: 'feedback' },
            { id: 'coupons', name: '优惠券', path: 'coupons' }
        ]
    },
    '06-marketing': {
        id: '06-marketing',
        name: '营销中心',
        icon: '📣',
        path: '/modules/06-marketing',
        default: 'index',
        children: [
            { id: 'campaigns', name: '营销活动', path: 'campaigns' },
            { id: 'loyalty', name: '忠诚度计划', path: 'loyalty' },
            { id: 'promotions', name: '促销管理', path: 'promotions' },
            { id: 'referrals', name: '推荐管理', path: 'referrals' }
        ]
    },
    '07-inventory': {
        id: '07-inventory',
        name: '库存管理',
        icon: '🏪',
        path: '/modules/07-inventory',
        default: 'inventory',
        children: [
            { id: 'inventory', name: '库存总览', path: 'inventory' },
            { id: 'stock', name: '库存查询', path: 'stock' },
            { id: 'warehouses', name: '仓库管理', path: 'warehouses' },
            { id: 'adjustments', name: '库存调整', path: 'adjustments' },
            { id: 'transfers', name: '库存转移', path: 'transfers' },
            { id: 'cycle-counts', name: '盘点管理', path: 'cycle-counts' },
            { id: 'serial-numbers', name: '序列号', path: 'serial-numbers' },
            { id: 'expiry', name: '过期管理', path: 'expiry' },
            { id: 'history', name: '库存历史', path: 'history' },
            { id: 'low-stock', name: '低库存预警', path: 'low-stock' },
            { id: 'batches', name: '批次管理', path: 'batches' }
        ]
    },
    '08-purchase': {
        id: '08-purchase',
        name: '采购管理',
        icon: '📥',
        path: '/modules/08-purchase',
        default: 'index',
        children: [
            { id: 'suppliers', name: '供应商管理', path: 'suppliers' },
            { id: 'quotations', name: '询价管理', path: 'quotations' },
            { id: 'receiving', name: '收货管理', path: 'receiving' },
            { id: 'supplier-payments', name: '供应商付款', path: 'supplier-payments' },
            { id: 'import', name: '导入采购', path: 'import' }
        ]
    },
    '09-finance': {
        id: '09-finance',
        name: '财务管理',
        icon: '💰',
        path: '/modules/09-finance',
        default: 'finance',
        children: [
            { id: 'finance', name: '财务总览', path: 'finance' },
            { id: 'profit-loss', name: '损益表', path: 'profit-loss' },
            { id: 'balance-sheet', name: '资产负债表', path: 'balance-sheet' },
            { id: 'cash-flow', name: '现金流量表', path: 'cash-flow' },
            { id: 'journal', name: '日记账', path: 'journal' },
            { id: 'expenses', name: '费用管理', path: 'expenses' },
            { id: 'income', name: '收入管理', path: 'income' },
            { id: 'payments', name: '收款管理', path: 'payments' },
            { id: 'bank', name: '银行对账', path: 'bank' },
            { id: 'invoices', name: '发票管理', path: 'invoices' },
            { id: 'taxes', name: '税务管理', path: 'taxes' },
            { id: 'vat', name: '增值税', path: 'vat' },
            { id: 'trial-balance', name: '试算平衡', path: 'trial-balance' },
            { id: 'settlements', name: '结算管理', path: 'settlements' },
            { id: 'refunds', name: '退款管理', path: 'refunds' }
        ]
    },
    '10-hr': {
        id: '10-hr',
        name: '人力资源管理',
        icon: '👔',
        path: '/modules/10-hr',
        default: 'hr',
        children: [
            { id: 'hr', name: 'HR总览', path: 'hr' },
            { id: 'employees', name: '员工管理', path: 'employees' },
            { id: 'attendance', name: '考勤管理', path: 'attendance' },
            { id: 'payroll', name: '薪资管理', path: 'payroll' },
            { id: 'performance', name: '绩效管理', path: 'performance' },
            { id: 'commissions', name: '佣金管理', path: 'commissions' },
            { id: 'bonuses', name: '奖金管理', path: 'bonuses' },
            { id: 'penalties', name: '罚款管理', path: 'penalties' },
            { id: 'leaves', name: '休假管理', path: 'leaves' },
            { id: 'schedules', name: '排班管理', path: 'schedules' },
            { id: 'shifts', name: '轮班管理', path: 'shifts' },
            { id: 'tasks', name: '任务管理', path: 'tasks' },
            { id: 'permissions', name: '权限管理', path: 'permissions' }
        ]
    },
    '11-saas': {
        id: '11-saas',
        name: 'SaaS管理',
        icon: '☁️',
        path: '/modules/11-saas',
        default: 'index',
        children: [
            { id: 'plans', name: '套餐管理', path: 'plans' },
            { id: 'packages', name: '产品包', path: 'packages' },
            { id: 'subscriptions', name: '订阅管理', path: 'subscriptions' },
            { id: 'billing', name: '计费管理', path: 'billing' },
            { id: 'tenants', name: '租户管理', path: 'tenants' },
            { id: 'usage', name: '使用统计', path: 'usage' },
            { id: 'feature-limits', name: '功能限制', path: 'feature-limits' },
            { id: 'storage', name: '存储管理', path: 'storage' }
        ]
    },
    '12-system': {
        id: '12-system',
        name: '系统管理',
        icon: '⚙️',
        path: '/modules/12-system',
        default: 'index',
        children: [
            { id: 'roles', name: '角色管理', path: 'roles' },
            { id: 'permissions', name: '权限管理', path: 'permissions' },
            { id: 'backup', name: '数据备份', path: 'backup' },
            { id: 'restore', name: '数据恢复', path: 'restore' },
            { id: 'notifications', name: '通知管理', path: 'notifications' },
            { id: 'audit-logs', name: '审计日志', path: 'audit-logs' },
            { id: 'integrations', name: '集成管理', path: 'integrations' },
            { id: 'settings', name: '系统设置', path: 'settings' },
            { id: 'system-logs', name: '系统日志', path: 'system-logs' },
            { id: 'api-keys', name: 'API密钥', path: 'api-keys' },
            { id: 'webhooks', name: 'Webhooks', path: 'webhooks' },
            { id: 'marketplace', name: '应用市场', path: 'marketplace' }
        ]
    },
    '13-analytics': {
        id: '13-analytics',
        name: '数据分析',
        icon: '📈',
        path: '/modules/13-analytics',
        default: 'index',
        children: [
            { id: 'reports', name: '报表中心', path: 'reports' },
            { id: 'forecast', name: '预测分析', path: 'forecast' },
            { id: 'business-health', name: '业务健康', path: 'business-health' },
            { id: 'recommendations', name: '智能推荐', path: 'recommendations' },
            { id: 'visualizations', name: '数据可视化', path: 'visualizations' },
            { id: 'custom-reports', name: '自定义报表', path: 'custom-reports' }
        ]
    },
    '14-settings': {
        id: '14-settings',
        name: '个人设置',
        icon: '🔧',
        path: '/modules/14-settings',
        default: 'index',
        children: [
            { id: 'company', name: '公司信息', path: 'company' },
            { id: 'branches', name: '分支机构', path: 'branches' },
            { id: 'profile', name: '个人资料', path: 'profile' },
            { id: 'general', name: '通用设置', path: 'general' },
            { id: 'preferences', name: '偏好设置', path: 'preferences' }
        ]
    },
    '15-ai': {
        id: '15-ai',
        name: 'AI智能中心',
        icon: '🤖',
        path: '/modules/15-ai',
        default: 'index',
        children: [
            { id: 'ai', name: 'AI助手', path: 'ai' },
            { id: 'crm', name: '智能CRM', path: 'crm' }
        ]
    }
};

// 获取所有模块列表
export function getModules() {
    return Object.values(MODULES);
}

// 根据ID获取模块
export function getModule(id) {
    return MODULES[id];
}

// 获取模块的子模块
export function getModuleChildren(moduleId) {
    const module = MODULES[moduleId];
    return module ? module.children : [];
}

// 获取默认页面
export function getDefaultPage(moduleId) {
    const module = MODULES[moduleId];
    return module ? ${module.path}//.html : null;
}
