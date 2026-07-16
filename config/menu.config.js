// ============================================================
// 自动生成的菜单配置（基于实际目录结构）
// 生成时间: 2026-07-16 10:21:42
// ============================================================

export const MENU_CONFIG = [
    {
        id: 'dashboard',
        label: '仪表盘',
        icon: '📊',
        path: '/dashboard',
        modulePath: '01-dashboard',
        children: [
            { label: '总览', path: '/dashboard/dashboard', file: 'dashboard.html' },
            { label: '员工管理', path: '/dashboard/employee', file: 'employee.html' },
            { label: '高管视图', path: '/dashboard/executive', file: 'executive.html' },
            { label: '财务管理', path: '/dashboard/finance', file: 'finance.html' },
            { label: '库存管理', path: '/dashboard/inventory', file: 'inventory.html' },
            { label: '营销管理', path: '/dashboard/marketing', file: 'marketing.html' },
            { label: '车辆监控', path: '/dashboard/vehicle-monitor', file: 'vehicle-monitor.html' }
        ]
    },
    {
        id: 'pos',
        label: 'POS 收银',
        icon: '🛒',
        path: '/pos',
        modulePath: '02-pos',
        children: [
            { label: '收银员', path: '/pos/cashier', file: 'cashier.html' },
            { label: '收银台', path: '/pos/cash-register', file: 'cash-register.html' },
            { label: '客户显示屏', path: '/pos/customer-display', file: 'customer-display.html' },
            { label: '换货', path: '/pos/exchange', file: 'exchange.html' },
            { label: '厨房显示', path: '/pos/kitchen-display', file: 'kitchen-display.html' },
            { label: '离线收银', path: '/pos/offline-pos', file: 'offline-pos.html' },
            { label: '快速销售', path: '/pos/quick-sale', file: 'quick-sale.html' },
            { label: '小票', path: '/pos/receipt', file: 'receipt.html' },
            { label: '退货', path: '/pos/returns', file: 'returns.html' },
            { label: '触屏收银', path: '/pos/touch-pos', file: 'touch-pos.html' }
        ]
    },
    {
        id: 'orders',
        label: '订单管理',
        icon: '📋',
        path: '/orders',
        modulePath: '03-orders',
        children: [
            { label: '订单详情', path: '/orders/detail', file: 'detail.html' },
            { label: '订单列表', path: '/orders/list', file: 'list.html' },
            { label: '退款管理', path: '/orders/refunds', file: 'refunds.html' },
            { label: '退货', path: '/orders/returns', file: 'returns.html' },
            { label: 'submodules', path: '/orders/submodules', file: 'index.html' }
        ]
    },
    {
        id: 'products',
        label: '商品管理',
        icon: '📦',
        path: '/products',
        modulePath: '04-products',
        children: [
            { label: '条码管理', path: '/products/barcodes', file: 'barcodes.html' },
            { label: '品牌管理', path: '/products/brands', file: 'brands.html' },
            { label: '分类管理', path: '/products/categories', file: 'categories.html' },
            { label: '套餐管理', path: '/products/combos', file: 'combos.html' },
            { label: '修饰符管理', path: '/products/modifiers', file: 'modifiers.html' },
            { label: '价格表', path: '/products/price-lists', file: 'price-lists.html' },
            { label: '商品列表', path: '/products/products', file: 'products.html' },
            { label: '变体管理', path: '/products/variants', file: 'variants.html' }
        ]
    },
    {
        id: 'customers',
        label: '客户管理',
        icon: '👥',
        path: '/customers',
        modulePath: '05-customers',
        children: [
            { label: '优惠券', path: '/customers/coupons', file: 'coupons.html' },
            { label: '客户列表', path: '/customers/customers', file: 'customers.html' },
            { label: '反馈管理', path: '/customers/feedback', file: 'feedback.html' },
            { label: '礼品卡', path: '/customers/gift-cards', file: 'gift-cards.html' },
            { label: '会员管理', path: '/customers/membership', file: 'membership.html' },
            { label: '车辆管理', path: '/customers/vehicles', file: 'vehicles.html' },
            { label: '钱包管理', path: '/customers/wallet', file: 'wallet.html' }
        ]
    },
    {
        id: 'marketing',
        label: '营销中心',
        icon: '📣',
        path: '/marketing',
        modulePath: '06-marketing',
        children: [
            { label: '营销活动', path: '/marketing/campaigns', file: 'campaigns.html' },
            { label: '忠诚度计划', path: '/marketing/loyalty', file: 'loyalty.html' },
            { label: '促销活动', path: '/marketing/promotions', file: 'promotions.html' },
            { label: '推荐管理', path: '/marketing/referrals', file: 'referrals.html' }
        ]
    },
    {
        id: 'inventory',
        label: '库存管理',
        icon: '🏪',
        path: '/inventory',
        modulePath: '07-inventory',
        children: [
            { label: '库存调整', path: '/inventory/adjustments', file: 'adjustments.html' },
            { label: '批次管理', path: '/inventory/batches', file: 'batches.html' },
            { label: '盘点管理', path: '/inventory/cycle-counts', file: 'cycle-counts.html' },
            { label: '过期管理', path: '/inventory/expiry', file: 'expiry.html' },
            { label: '库存历史', path: '/inventory/history', file: 'history.html' },
            { label: '低库存预警', path: '/inventory/low-stock', file: 'low-stock.html' },
            { label: '序列号管理', path: '/inventory/serial-numbers', file: 'serial-numbers.html' },
            { label: '库存查询', path: '/inventory/stock', file: 'stock.html' },
            { label: '库存转移', path: '/inventory/transfers', file: 'transfers.html' },
            { label: '仓库管理', path: '/inventory/warehouses', file: 'warehouses.html' }
        ]
    },
    {
        id: 'purchase',
        label: '采购管理',
        icon: '📥',
        path: '/purchase',
        modulePath: '08-purchase',
        children: [
            { label: '批量导入', path: '/purchase/import', file: 'import.html' },
            { label: '采购订单', path: '/purchase/orders', file: 'orders.html' },
            { label: '询价管理', path: '/purchase/quotations', file: 'quotations.html' },
            { label: '采购入库', path: '/purchase/receiving', file: 'receiving.html' },
            { label: '退货', path: '/purchase/returns', file: 'returns.html' },
            { label: '供应商付款', path: '/purchase/supplier-payments', file: 'supplier-payments.html' },
            { label: '供应商管理', path: '/purchase/suppliers', file: 'suppliers.html' }
        ]
    },
    {
        id: 'finance',
        label: '财务管理',
        icon: '💰',
        path: '/finance',
        modulePath: '09-finance',
        children: [
            { label: '资产负债表', path: '/finance/balance-sheet', file: 'balance-sheet.html' },
            { label: '银行管理', path: '/finance/bank', file: 'bank.html' },
            { label: '现金流', path: '/finance/cash-flow', file: 'cash-flow.html' },
            { label: '费用管理', path: '/finance/expenses', file: 'expenses.html' },
            { label: '收入管理', path: '/finance/income', file: 'income.html' },
            { label: '发票管理', path: '/finance/invoices', file: 'invoices.html' },
            { label: '日记账', path: '/finance/journal', file: 'journal.html' },
            { label: '收付款管理', path: '/finance/payments', file: 'payments.html' },
            { label: '损益表', path: '/finance/profit-loss', file: 'profit-loss.html' },
            { label: '退款管理', path: '/finance/refunds', file: 'refunds.html' },
            { label: '结算管理', path: '/finance/settlements', file: 'settlements.html' },
            { label: '税务管理', path: '/finance/taxes', file: 'taxes.html' },
            { label: '试算平衡表', path: '/finance/trial-balance', file: 'trial-balance.html' },
            { label: '增值税管理', path: '/finance/vat', file: 'vat.html' }
        ]
    },
    {
        id: 'hr',
        label: '人力资源管理',
        icon: '👔',
        path: '/hr',
        modulePath: '10-hr',
        children: [
            { label: '考勤管理', path: '/hr/attendance', file: 'attendance.html' },
            { label: '奖金管理', path: '/hr/bonuses', file: 'bonuses.html' },
            { label: '佣金管理', path: '/hr/commissions', file: 'commissions.html' },
            { label: '员工列表', path: '/hr/employees', file: 'employees.html' },
            { label: '休假管理', path: '/hr/leaves', file: 'leaves.html' },
            { label: '薪资管理', path: '/hr/payroll', file: 'payroll.html' },
            { label: '处罚管理', path: '/hr/penalties', file: 'penalties.html' },
            { label: '绩效管理', path: '/hr/performance', file: 'performance.html' },
            { label: '权限管理', path: '/hr/permissions', file: 'permissions.html' },
            { label: '排班管理', path: '/hr/schedules', file: 'schedules.html' },
            { label: '班次管理', path: '/hr/shifts', file: 'shifts.html' },
            { label: '任务管理', path: '/hr/tasks', file: 'tasks.html' }
        ]
    },
    {
        id: 'saas',
        label: 'SaaS 管理',
        icon: '☁️',
        path: '/saas',
        modulePath: '11-saas',
        children: [
            { label: '账单管理', path: '/saas/billing', file: 'billing.html' },
            { label: '功能限制', path: '/saas/feature-limits', file: 'feature-limits.html' },
            { label: '发票管理', path: '/saas/invoices', file: 'invoices.html' },
            { label: '套餐管理', path: '/saas/packages', file: 'packages.html' },
            { label: '价格方案', path: '/saas/plans', file: 'plans.html' },
            { label: '存储管理', path: '/saas/storage', file: 'storage.html' },
            { label: '订阅管理', path: '/saas/subscriptions', file: 'subscriptions.html' },
            { label: '租户管理', path: '/saas/tenants', file: 'tenants.html' },
            { label: '用量统计', path: '/saas/usage', file: 'usage.html' }
        ]
    },
    {
        id: 'system',
        label: '系统管理',
        icon: '⚙️',
        path: '/system',
        modulePath: '12-system',
        children: [
            { label: 'API Keys', path: '/system/api-keys', file: 'api-keys.html' },
            { label: '审计日志', path: '/system/audit-logs', file: 'audit-logs.html' },
            { label: '数据备份', path: '/system/backup', file: 'backup.html' },
            { label: '集成管理', path: '/system/integrations', file: 'integrations.html' },
            { label: '应用市场', path: '/system/marketplace', file: 'marketplace.html' },
            { label: '通知管理', path: '/system/notifications', file: 'notifications.html' },
            { label: '权限管理', path: '/system/permissions', file: 'permissions.html' },
            { label: '数据恢复', path: '/system/restore', file: 'restore.html' },
            { label: '角色管理', path: '/system/roles', file: 'roles.html' },
            { label: '系统设置', path: '/system/settings', file: 'settings.html' },
            { label: '系统日志', path: '/system/system-logs', file: 'system-logs.html' },
            { label: 'Webhooks', path: '/system/webhooks', file: 'webhooks.html' }
        ]
    },
    {
        id: 'analytics',
        label: '数据分析',
        icon: '📈',
        path: '/analytics',
        modulePath: '13-analytics',
        children: [
            { label: '业务健康', path: '/analytics/business-health', file: 'business-health.html' },
            { label: '自定义报表', path: '/analytics/custom-reports', file: 'custom-reports.html' },
            { label: '预测分析', path: '/analytics/forecast', file: 'forecast.html' },
            { label: '智能推荐', path: '/analytics/recommendations', file: 'recommendations.html' },
            { label: '报表中心', path: '/analytics/reports', file: 'reports.html' },
            { label: '可视化', path: '/analytics/visualizations', file: 'visualizations.html' }
        ]
    },
    {
        id: 'settings',
        label: '个人设置',
        icon: '🔧',
        path: '/settings',
        modulePath: '14-settings',
        children: [
            { label: '分店管理', path: '/settings/branches', file: 'branches.html' },
            { label: '公司信息', path: '/settings/company', file: 'company.html' },
            { label: '通用设置', path: '/settings/general', file: 'settings.html' },
            { label: '偏好设置', path: '/settings/preferences', file: 'preferences.html' },
            { label: '个人资料', path: '/settings/profile', file: 'profile.html' }
        ]
    },
    {
        id: 'ai',
        label: 'AI 智能中心',
        icon: '🤖',
        path: '/ai',
        modulePath: '15-ai',
        children: [
            { label: 'AI 助手', path: '/ai/ai', file: 'ai.html' },
            { label: 'CRM 智能', path: '/ai/crm', file: 'crm.html' }
        ]
    }
];

export function findMenuItemByPath(path) {
    for (const item of MENU_CONFIG) {
        if (item.path === path) {
            return { ...item, file: null, isMain: true };
        }
        for (const child of (item.children || [])) {
            if (child.path === path) {
                return { ...child, modulePath: item.modulePath, isMain: false };
            }
        }
    }
    return null;
}

export function getLabelByPath(path) {
    for (const item of MENU_CONFIG) {
        if (item.path === path) return item.label;
        for (const child of (item.children || [])) {
            if (child.path === path) return child.label;
        }
    }
    return path.replace(/^\/+/, '').replace(/-/g, ' ');
}
