// ============================================================
// BAI ERP - 所有模块统一入口文件
// 联动所有主模块和子模块
// 生成时间: 2026-07-16 12:11:51
// ============================================================

// 模块注册表
const MODULE_REGISTRY = {};

// ============================================================
// 1. 注册所有主模块
// ============================================================
// 模块: 01-dashboard (True)
MODULE_REGISTRY['dashboard'] = {
    id: 'dashboard',
    name: 'True',
    path: '/dashboard',
    modulePath: '01-dashboard',
    children: [        { label: 'Dashboard', path: '/dashboard/dashboard', file: 'index.html' },
        { label: 'Employee', path: '/dashboard/employee', file: 'employee.html' },
        { label: 'Executive', path: '/dashboard/executive', file: 'executive.html' },
        { label: 'Vehicle Monitor', path: '/dashboard/vehicle-monitor', file: 'vehicle-monitor.html' }    ]
};
// 模块: 02-pos (True)
MODULE_REGISTRY['pos'] = {
    id: 'pos',
    name: 'True',
    path: '/pos',
    modulePath: '02-pos',
    children: [        { label: 'Cashier', path: '/pos/cashier', file: 'cashier.html' },
        { label: 'Cash Register', path: '/pos/cash-register', file: 'cash-register.html' },
        { label: 'Customer Display', path: '/pos/customer-display', file: 'customer-display.html' },
        { label: 'Exchange', path: '/pos/exchange', file: 'exchange.html' },
        { label: 'Kitchen Display', path: '/pos/kitchen-display', file: 'kitchen-display.html' },
        { label: 'Offline Pos', path: '/pos/offline-pos', file: 'offline-pos.html' },
        { label: 'Quick Sale', path: '/pos/quick-sale', file: 'quick-sale.html' },
        { label: 'Receipt', path: '/pos/receipt', file: 'receipt.html' },
        { label: 'Touch Pos', path: '/pos/touch-pos', file: 'touch-pos.html' }    ]
};
// 模块: 03-orders (True)
MODULE_REGISTRY['orders'] = {
    id: 'orders',
    name: 'True',
    path: '/orders',
    modulePath: '03-orders',
    children: [        { label: 'Detail', path: '/orders/detail', file: 'detail.html' },
        { label: 'List', path: '/orders/list', file: 'list.html' },
        { label: 'Refunds', path: '/orders/refunds', file: 'refunds.html' },
        { label: 'Returns', path: '/orders/returns', file: 'returns.html' },
        { label: 'Submodules', path: '/orders/submodules', file: 'submodules.html' }    ]
};
// 模块: 04-products (True)
MODULE_REGISTRY['products'] = {
    id: 'products',
    name: 'True',
    path: '/products',
    modulePath: '04-products',
    children: [        { label: 'Barcodes', path: '/products/barcodes', file: 'barcodes.html' },
        { label: 'Brands', path: '/products/brands', file: 'brands.html' },
        { label: 'Categories', path: '/products/categories', file: 'categories.html' },
        { label: 'Combos', path: '/products/combos', file: 'combos.html' },
        { label: 'Modifiers', path: '/products/modifiers', file: 'modifiers.html' },
        { label: 'Price Lists', path: '/products/price-lists', file: 'price-lists.html' },
        { label: 'Products', path: '/products/products', file: 'products.html' },
        { label: 'Variants', path: '/products/variants', file: 'variants.html' }    ]
};
// 模块: 05-customers (True)
MODULE_REGISTRY['customers'] = {
    id: 'customers',
    name: 'True',
    path: '/customers',
    modulePath: '05-customers',
    children: [        { label: 'Coupons', path: '/customers/coupons', file: 'coupons.html' },
        { label: 'Customers', path: '/customers/customers', file: 'customers.html' },
        { label: 'Feedback', path: '/customers/feedback', file: 'feedback.html' },
        { label: 'Gift Cards', path: '/customers/gift-cards', file: 'gift-cards.html' },
        { label: 'Membership', path: '/customers/membership', file: 'membership.html' },
        { label: 'Vehicles', path: '/customers/vehicles', file: 'vehicles.html' },
        { label: 'Wallet', path: '/customers/wallet', file: 'wallet.html' }    ]
};
// 模块: 06-marketing (True)
MODULE_REGISTRY['marketing'] = {
    id: 'marketing',
    name: 'True',
    path: '/marketing',
    modulePath: '06-marketing',
    children: [        { label: 'Campaigns', path: '/marketing/campaigns', file: 'campaigns.html' },
        { label: 'Loyalty', path: '/marketing/loyalty', file: 'loyalty.html' },
        { label: 'Promotions', path: '/marketing/promotions', file: 'promotions.html' },
        { label: 'Referrals', path: '/marketing/referrals', file: 'referrals.html' }    ]
};
// 模块: 07-inventory (True)
MODULE_REGISTRY['inventory'] = {
    id: 'inventory',
    name: 'True',
    path: '/inventory',
    modulePath: '07-inventory',
    children: [        { label: 'Adjustments', path: '/inventory/adjustments', file: 'adjustments.html' },
        { label: 'Batches', path: '/inventory/batches', file: 'batches.html' },
        { label: 'Cycle Counts', path: '/inventory/cycle-counts', file: 'cycle-counts.html' },
        { label: 'Expiry', path: '/inventory/expiry', file: 'expiry.html' },
        { label: 'History', path: '/inventory/history', file: 'history.html' },
        { label: 'Low Stock', path: '/inventory/low-stock', file: 'low-stock.html' },
        { label: 'Serial Numbers', path: '/inventory/serial-numbers', file: 'serial-numbers.html' },
        { label: 'Stock', path: '/inventory/stock', file: 'stock.html' },
        { label: 'Transfers', path: '/inventory/transfers', file: 'transfers.html' },
        { label: 'Warehouses', path: '/inventory/warehouses', file: 'warehouses.html' }    ]
};
// 模块: 08-purchase (True)
MODULE_REGISTRY['purchase'] = {
    id: 'purchase',
    name: 'True',
    path: '/purchase',
    modulePath: '08-purchase',
    children: [        { label: 'Import', path: '/purchase/import', file: 'import.html' },
        { label: 'Quotations', path: '/purchase/quotations', file: 'quotations.html' },
        { label: 'Receiving', path: '/purchase/receiving', file: 'receiving.html' },
        { label: 'Supplier Payments', path: '/purchase/supplier-payments', file: 'supplier-payments.html' },
        { label: 'Suppliers', path: '/purchase/suppliers', file: 'suppliers.html' }    ]
};
// 模块: 09-finance (True)
MODULE_REGISTRY['finance'] = {
    id: 'finance',
    name: 'True',
    path: '/finance',
    modulePath: '09-finance',
    children: [        { label: 'Balance Sheet', path: '/finance/balance-sheet', file: 'balance-sheet.html' },
        { label: 'Bank', path: '/finance/bank', file: 'bank.html' },
        { label: 'Cash Flow', path: '/finance/cash-flow', file: 'cash-flow.html' },
        { label: 'Expenses', path: '/finance/expenses', file: 'expenses.html' },
        { label: 'Income', path: '/finance/income', file: 'income.html' },
        { label: 'Invoices', path: '/finance/invoices', file: 'invoices.html' },
        { label: 'Journal', path: '/finance/journal', file: 'journal.html' },
        { label: 'Payments', path: '/finance/payments', file: 'payments.html' },
        { label: 'Profit Loss', path: '/finance/profit-loss', file: 'profit-loss.html' },
        { label: 'Settlements', path: '/finance/settlements', file: 'settlements.html' },
        { label: 'Taxes', path: '/finance/taxes', file: 'taxes.html' },
        { label: 'Trial Balance', path: '/finance/trial-balance', file: 'trial-balance.html' },
        { label: 'Vat', path: '/finance/vat', file: 'vat.html' }    ]
};
// 模块: 10-hr (True)
MODULE_REGISTRY['hr'] = {
    id: 'hr',
    name: 'True',
    path: '/hr',
    modulePath: '10-hr',
    children: [        { label: 'Attendance', path: '/hr/attendance', file: 'attendance.html' },
        { label: 'Bonuses', path: '/hr/bonuses', file: 'bonuses.html' },
        { label: 'Commissions', path: '/hr/commissions', file: 'commissions.html' },
        { label: 'Employees', path: '/hr/employees', file: 'employees.html' },
        { label: 'Leaves', path: '/hr/leaves', file: 'leaves.html' },
        { label: 'Payroll', path: '/hr/payroll', file: 'payroll.html' },
        { label: 'Penalties', path: '/hr/penalties', file: 'penalties.html' },
        { label: 'Performance', path: '/hr/performance', file: 'performance.html' },
        { label: 'Permissions', path: '/hr/permissions', file: 'permissions.html' },
        { label: 'Schedules', path: '/hr/schedules', file: 'schedules.html' },
        { label: 'Shifts', path: '/hr/shifts', file: 'shifts.html' },
        { label: 'Tasks', path: '/hr/tasks', file: 'tasks.html' }    ]
};
// 模块: 11-saas (True)
MODULE_REGISTRY['saas'] = {
    id: 'saas',
    name: 'True',
    path: '/saas',
    modulePath: '11-saas',
    children: [        { label: 'Billing', path: '/saas/billing', file: 'billing.html' },
        { label: 'Feature Limits', path: '/saas/feature-limits', file: 'feature-limits.html' },
        { label: 'Packages', path: '/saas/packages', file: 'packages.html' },
        { label: 'Plans', path: '/saas/plans', file: 'plans.html' },
        { label: 'Storage', path: '/saas/storage', file: 'storage.html' },
        { label: 'Subscriptions', path: '/saas/subscriptions', file: 'subscriptions.html' },
        { label: 'Tenants', path: '/saas/tenants', file: 'tenants.html' },
        { label: 'Usage', path: '/saas/usage', file: 'usage.html' }    ]
};
// 模块: 12-system (True)
MODULE_REGISTRY['system'] = {
    id: 'system',
    name: 'True',
    path: '/system',
    modulePath: '12-system',
    children: [        { label: 'Api Keys', path: '/system/api-keys', file: 'api-keys.html' },
        { label: 'Audit Logs', path: '/system/audit-logs', file: 'audit-logs.html' },
        { label: 'Backup', path: '/system/backup', file: 'backup.html' },
        { label: 'Integrations', path: '/system/integrations', file: 'integrations.html' },
        { label: 'Marketplace', path: '/system/marketplace', file: 'marketplace.html' },
        { label: 'Notifications', path: '/system/notifications', file: 'notifications.html' },
        { label: 'Permissions', path: '/system/permissions', file: 'permission.html' },
        { label: 'Restore', path: '/system/restore', file: 'restore.html' },
        { label: 'Roles', path: '/system/roles', file: 'roles.html' },
        { label: 'Settings', path: '/system/settings', file: 'settings.html' },
        { label: 'System Logs', path: '/system/system-logs', file: 'system-logs.html' },
        { label: 'Webhooks', path: '/system/webhooks', file: 'webhooks.html' }    ]
};
// 模块: 13-analytics (True)
MODULE_REGISTRY['analytics'] = {
    id: 'analytics',
    name: 'True',
    path: '/analytics',
    modulePath: '13-analytics',
    children: [        { label: 'Business Health', path: '/analytics/business-health', file: 'business-health.html' },
        { label: 'Custom Reports', path: '/analytics/custom-reports', file: 'custom-reports.html' },
        { label: 'Forecast', path: '/analytics/forecast', file: 'forecast.html' },
        { label: 'Recommendations', path: '/analytics/recommendations', file: 'recommendations.html' },
        { label: 'Reports', path: '/analytics/reports', file: 'reports.html' },
        { label: 'Visualizations', path: '/analytics/visualizations', file: 'visualizations.html' }    ]
};
// 模块: 14-settings (True)
MODULE_REGISTRY['settings'] = {
    id: 'settings',
    name: 'True',
    path: '/settings',
    modulePath: '14-settings',
    children: [        { label: 'Branches', path: '/settings/branches', file: 'branches.html' },
        { label: 'Company', path: '/settings/company', file: 'company.html' },
        { label: 'General', path: '/settings/general', file: 'general.html' },
        { label: 'Preferences', path: '/settings/preferences', file: 'preferences.html' },
        { label: 'Profile', path: '/settings/profile', file: 'profile.html' }    ]
};
// 模块: 15-ai (True)
MODULE_REGISTRY['ai'] = {
    id: 'ai',
    name: 'True',
    path: '/ai',
    modulePath: '15-ai',
    children: [        { label: 'Ai', path: '/ai/ai', file: 'ai.html' },
        { label: 'Crm', path: '/ai/crm', file: 'crm.html' }    ]
};
// ============================================================
// 2. 导出模块注册表
// ============================================================

export const MODULES = MODULE_REGISTRY;

// 获取所有主模块列表
export function getMainModules() {
    return Object.keys(MODULE_REGISTRY);
}

// 获取指定模块
export function getModule(name) {
    return MODULE_REGISTRY[name] || null;
}

// 获取子模块
export function getSubModules(mainName) {
    const module = getModule(mainName);
    return module ? module.children : [];
}

// 查找菜单项
export function findMenuItemByPath(path) {
    for (const [name, module] of Object.entries(MODULE_REGISTRY)) {
        if (module.path === path) {
            return { ...module, file: null, isMain: true };
        }
        for (const child of (module.children || [])) {
            if (child.path === path) {
                return { ...child, modulePath: module.modulePath, isMain: false };
            }
        }
    }
    return null;
}

// 获取路径对应的标签
export function getLabelByPath(path) {
    const item = findMenuItemByPath(path);
    return item ? item.label : path.replace(/^\/+/, '').replace(/-/g, ' ');
}

// 初始化所有模块
export function initAllModules() {
    console.log('🚀 初始化所有模块...');
    const modules = Object.keys(MODULE_REGISTRY);
    console.log(   📦 共 \ 个主模块);
    for (const name of modules) {
        const module = MODULE_REGISTRY[name];
        console.log(      ✅ \ (\ 个子模块));
    }
}

console.log('📦 模块注册表已初始化，共 ' + Object.keys(MODULE_REGISTRY).length + ' 个主模块');
