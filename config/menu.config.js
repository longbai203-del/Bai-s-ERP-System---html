// ============================================================
// BAI ERP 完整菜单配置
// 生成时间: 2026-07-16 13:17:53
// ============================================================

export const MENU_CONFIG = [
    {
        id: 'dashboard',
        label: '仪表盘',
        icon: '📊',
        path: '/dashboard',
        modulePath: '01-dashboard',
        children: [
            { label: 'Dashboard', path: '/dashboard/dashboard', file: 'dashboard.html', modulePath: '01-dashboard/dashboard' },
            { label: 'Employee', path: '/dashboard/employee', file: 'employee.html', modulePath: '01-dashboard/employee' },
            { label: 'Executive', path: '/dashboard/executive', file: 'executive.html', modulePath: '01-dashboard/executive' },
            { label: 'Vehicle Monitor', path: '/dashboard/vehicle-monitor', file: 'vehicle-monitor.html', modulePath: '01-dashboard/vehicle-monitor' }
        ]
    },
    {
        id: 'pos',
        label: 'POS 收银',
        icon: '🛒',
        path: '/pos',
        modulePath: '02-pos',
        children: [
            { label: 'Cashier', path: '/pos/cashier', file: 'cashier.html', modulePath: '02-pos/cashier' },
            { label: 'Cash Register', path: '/pos/cash-register', file: 'cash-register.html', modulePath: '02-pos/cash-register' },
            { label: 'Customer Display', path: '/pos/customer-display', file: 'customer-display.html', modulePath: '02-pos/customer-display' },
            { label: 'Exchange', path: '/pos/exchange', file: 'exchange.html', modulePath: '02-pos/exchange' },
            { label: 'Kitchen Display', path: '/pos/kitchen-display', file: 'kitchen-display.html', modulePath: '02-pos/kitchen-display' },
            { label: 'Offline Pos', path: '/pos/offline-pos', file: 'offline-pos.html', modulePath: '02-pos/offline-pos' },
            { label: 'Quick Sale', path: '/pos/quick-sale', file: 'quick-sale.html', modulePath: '02-pos/quick-sale' },
            { label: 'Receipt', path: '/pos/receipt', file: 'receipt.html', modulePath: '02-pos/receipt' },
            { label: 'Touch Pos', path: '/pos/touch-pos', file: 'touch-pos.html', modulePath: '02-pos/touch-pos' }
        ]
    },
    {
        id: 'orders',
        label: '订单管理',
        icon: '📋',
        path: '/orders',
        modulePath: '03-orders',
        children: [
            { label: 'Detail', path: '/orders/detail', file: 'detail.html', modulePath: '03-orders/detail' },
            { label: 'List', path: '/orders/list', file: 'list.html', modulePath: '03-orders/list' },
            { label: 'Refunds', path: '/orders/refunds', file: 'refunds.html', modulePath: '03-orders/refunds' },
            { label: 'Returns', path: '/orders/returns', file: 'returns.html', modulePath: '03-orders/returns' },
            { label: 'Submodules', path: '/orders/submodules', file: 'submodules.html', modulePath: '03-orders/submodules' }
        ]
    },
    {
        id: 'products',
        label: '商品管理',
        icon: '📦',
        path: '/products',
        modulePath: '04-products',
        children: [
            { label: 'Barcodes', path: '/products/barcodes', file: 'barcodes.html', modulePath: '04-products/barcodes' },
            { label: 'Brands', path: '/products/brands', file: 'brands.html', modulePath: '04-products/brands' },
            { label: 'Categories', path: '/products/categories', file: 'categories.html', modulePath: '04-products/categories' },
            { label: 'Combos', path: '/products/combos', file: 'combos.html', modulePath: '04-products/combos' },
            { label: 'Modifiers', path: '/products/modifiers', file: 'modifiers.html', modulePath: '04-products/modifiers' },
            { label: 'Price Lists', path: '/products/price-lists', file: 'price-lists.html', modulePath: '04-products/price-lists' },
            { label: 'Products', path: '/products/products', file: 'products.html', modulePath: '04-products/products' },
            { label: 'Variants', path: '/products/variants', file: 'variants.html', modulePath: '04-products/variants' }
        ]
    },
    {
        id: 'customers',
        label: '客户管理',
        icon: '👥',
        path: '/customers',
        modulePath: '05-customers',
        children: [
            { label: 'Coupons', path: '/customers/coupons', file: 'coupons.html', modulePath: '05-customers/coupons' },
            { label: 'Customers', path: '/customers/customers', file: 'customers.html', modulePath: '05-customers/customers' },
            { label: 'Feedback', path: '/customers/feedback', file: 'feedback.html', modulePath: '05-customers/feedback' },
            { label: 'Gift Cards', path: '/customers/gift-cards', file: 'gift-cards.html', modulePath: '05-customers/gift-cards' },
            { label: 'Membership', path: '/customers/membership', file: 'membership.html', modulePath: '05-customers/membership' },
            { label: 'Vehicles', path: '/customers/vehicles', file: 'vehicles.html', modulePath: '05-customers/vehicles' },
            { label: 'Wallet', path: '/customers/wallet', file: 'wallet.html', modulePath: '05-customers/wallet' }
        ]
    },
    {
        id: 'marketing',
        label: '营销中心',
        icon: '📣',
        path: '/marketing',
        modulePath: '06-marketing',
        children: [
            { label: 'Campaigns', path: '/marketing/campaigns', file: 'campaigns.html', modulePath: '06-marketing/campaigns' },
            { label: 'Loyalty', path: '/marketing/loyalty', file: 'loyalty.html', modulePath: '06-marketing/loyalty' },
            { label: 'Promotions', path: '/marketing/promotions', file: 'promotions.html', modulePath: '06-marketing/promotions' },
            { label: 'Referrals', path: '/marketing/referrals', file: 'referrals.html', modulePath: '06-marketing/referrals' }
        ]
    },
    {
        id: 'inventory',
        label: '库存管理',
        icon: '🏪',
        path: '/inventory',
        modulePath: '07-inventory',
        children: [
            { label: 'Adjustments', path: '/inventory/adjustments', file: 'adjustments.html', modulePath: '07-inventory/adjustments' },
            { label: 'Batches', path: '/inventory/batches', file: 'batches.html', modulePath: '07-inventory/batches' },
            { label: 'Cycle Counts', path: '/inventory/cycle-counts', file: 'cycle-counts.html', modulePath: '07-inventory/cycle-counts' },
            { label: 'Expiry', path: '/inventory/expiry', file: 'expiry.html', modulePath: '07-inventory/expiry' },
            { label: 'History', path: '/inventory/history', file: 'history.html', modulePath: '07-inventory/history' },
            { label: 'Low Stock', path: '/inventory/low-stock', file: 'low-stock.html', modulePath: '07-inventory/low-stock' },
            { label: 'Serial Numbers', path: '/inventory/serial-numbers', file: 'serial-numbers.html', modulePath: '07-inventory/serial-numbers' },
            { label: 'Stock', path: '/inventory/stock', file: 'stock.html', modulePath: '07-inventory/stock' },
            { label: 'Transfers', path: '/inventory/transfers', file: 'transfers.html', modulePath: '07-inventory/transfers' },
            { label: 'Warehouses', path: '/inventory/warehouses', file: 'warehouses.html', modulePath: '07-inventory/warehouses' }
        ]
    },
    {
        id: 'purchase',
        label: '采购管理',
        icon: '📥',
        path: '/purchase',
        modulePath: '08-purchase',
        children: [
            { label: 'Import', path: '/purchase/import', file: 'import.html', modulePath: '08-purchase/import' },
            { label: 'Quotations', path: '/purchase/quotations', file: 'quotations.html', modulePath: '08-purchase/quotations' },
            { label: 'Receiving', path: '/purchase/receiving', file: 'receiving.html', modulePath: '08-purchase/receiving' },
            { label: 'Supplier Payments', path: '/purchase/supplier-payments', file: 'supplier-payments.html', modulePath: '08-purchase/supplier-payments' },
            { label: 'Suppliers', path: '/purchase/suppliers', file: 'suppliers.html', modulePath: '08-purchase/suppliers' }
        ]
    },
    {
        id: 'finance',
        label: '财务管理',
        icon: '💰',
        path: '/finance',
        modulePath: '09-finance',
        children: [
            { label: 'Balance Sheet', path: '/finance/balance-sheet', file: 'balance-sheet.html', modulePath: '09-finance/balance-sheet' },
            { label: 'Bank', path: '/finance/bank', file: 'bank.html', modulePath: '09-finance/bank' },
            { label: 'Cash Flow', path: '/finance/cash-flow', file: 'cash-flow.html', modulePath: '09-finance/cash-flow' },
            { label: 'Expenses', path: '/finance/expenses', file: 'expenses.html', modulePath: '09-finance/expenses' },
            { label: 'Income', path: '/finance/income', file: 'income.html', modulePath: '09-finance/income' },
            { label: 'Invoices', path: '/finance/invoices', file: 'invoices.html', modulePath: '09-finance/invoices' },
            { label: 'Journal', path: '/finance/journal', file: 'journal.html', modulePath: '09-finance/journal' },
            { label: 'Payments', path: '/finance/payments', file: 'payments.html', modulePath: '09-finance/payments' },
            { label: 'Profit Loss', path: '/finance/profit-loss', file: 'profit-loss.html', modulePath: '09-finance/profit-loss' },
            { label: 'Settlements', path: '/finance/settlements', file: 'settlements.html', modulePath: '09-finance/settlements' },
            { label: 'Taxes', path: '/finance/taxes', file: 'taxes.html', modulePath: '09-finance/taxes' },
            { label: 'Trial Balance', path: '/finance/trial-balance', file: 'trial-balance.html', modulePath: '09-finance/trial-balance' },
            { label: 'Vat', path: '/finance/vat', file: 'vat.html', modulePath: '09-finance/vat' }
        ]
    },
    {
        id: 'hr',
        label: '人力资源管理',
        icon: '👔',
        path: '/hr',
        modulePath: '10-hr',
        children: [
            { label: 'Attendance', path: '/hr/attendance', file: 'attendance.html', modulePath: '10-hr/attendance' },
            { label: 'Bonuses', path: '/hr/bonuses', file: 'bonuses.html', modulePath: '10-hr/bonuses' },
            { label: 'Commissions', path: '/hr/commissions', file: 'commissions.html', modulePath: '10-hr/commissions' },
            { label: 'Employees', path: '/hr/employees', file: 'employees.html', modulePath: '10-hr/employees' },
            { label: 'Leaves', path: '/hr/leaves', file: 'leaves.html', modulePath: '10-hr/leaves' },
            { label: 'Payroll', path: '/hr/payroll', file: 'payroll.html', modulePath: '10-hr/payroll' },
            { label: 'Penalties', path: '/hr/penalties', file: 'penalties.html', modulePath: '10-hr/penalties' },
            { label: 'Performance', path: '/hr/performance', file: 'performance.html', modulePath: '10-hr/performance' },
            { label: 'Permissions', path: '/hr/permissions', file: 'permissions.html', modulePath: '10-hr/permissions' },
            { label: 'Schedules', path: '/hr/schedules', file: 'schedules.html', modulePath: '10-hr/schedules' },
            { label: 'Shifts', path: '/hr/shifts', file: 'shifts.html', modulePath: '10-hr/shifts' },
            { label: 'Tasks', path: '/hr/tasks', file: 'tasks.html', modulePath: '10-hr/tasks' }
        ]
    },
    {
        id: 'saas',
        label: 'SaaS 管理',
        icon: '☁️',
        path: '/saas',
        modulePath: '11-saas',
        children: [
            { label: 'Billing', path: '/saas/billing', file: 'billing.html', modulePath: '11-saas/billing' },
            { label: 'Feature Limits', path: '/saas/feature-limits', file: 'feature-limits.html', modulePath: '11-saas/feature-limits' },
            { label: 'Packages', path: '/saas/packages', file: 'packages.html', modulePath: '11-saas/packages' },
            { label: 'Plans', path: '/saas/plans', file: 'plans.html', modulePath: '11-saas/plans' },
            { label: 'Storage', path: '/saas/storage', file: 'storage.html', modulePath: '11-saas/storage' },
            { label: 'Subscriptions', path: '/saas/subscriptions', file: 'subscriptions.html', modulePath: '11-saas/subscriptions' },
            { label: 'Tenants', path: '/saas/tenants', file: 'tenants.html', modulePath: '11-saas/tenants' },
            { label: 'Usage', path: '/saas/usage', file: 'usage.html', modulePath: '11-saas/usage' }
        ]
    },
    {
        id: 'system',
        label: '系统管理',
        icon: '⚙️',
        path: '/system',
        modulePath: '12-system',
        children: [
            { label: 'Api Keys', path: '/system/api-keys', file: 'api-keys.html', modulePath: '12-system/api-keys' },
            { label: 'Audit Logs', path: '/system/audit-logs', file: 'audit-logs.html', modulePath: '12-system/audit-logs' },
            { label: 'Backup', path: '/system/backup', file: 'backup.html', modulePath: '12-system/backup' },
            { label: 'Integrations', path: '/system/integrations', file: 'integrations.html', modulePath: '12-system/integrations' },
            { label: 'Marketplace', path: '/system/marketplace', file: 'marketplace.html', modulePath: '12-system/marketplace' },
            { label: 'Notifications', path: '/system/notifications', file: 'notifications.html', modulePath: '12-system/notifications' },
            { label: 'Permissions', path: '/system/permissions', file: 'permission.html', modulePath: '12-system/permissions' },
            { label: 'Restore', path: '/system/restore', file: 'restore.html', modulePath: '12-system/restore' },
            { label: 'Roles', path: '/system/roles', file: 'roles.html', modulePath: '12-system/roles' },
            { label: 'Settings', path: '/system/settings', file: 'settings.html', modulePath: '12-system/settings' },
            { label: 'System Logs', path: '/system/system-logs', file: 'system-logs.html', modulePath: '12-system/system-logs' },
            { label: 'Webhooks', path: '/system/webhooks', file: 'webhooks.html', modulePath: '12-system/webhooks' }
        ]
    },
    {
        id: 'analytics',
        label: '数据分析',
        icon: '📈',
        path: '/analytics',
        modulePath: '13-analytics',
        children: [
            { label: 'Business Health', path: '/analytics/business-health', file: 'business-health.html', modulePath: '13-analytics/business-health' },
            { label: 'Custom Reports', path: '/analytics/custom-reports', file: 'custom-reports.html', modulePath: '13-analytics/custom-reports' },
            { label: 'Forecast', path: '/analytics/forecast', file: 'forecast.html', modulePath: '13-analytics/forecast' },
            { label: 'Recommendations', path: '/analytics/recommendations', file: 'recommendations.html', modulePath: '13-analytics/recommendations' },
            { label: 'Reports', path: '/analytics/reports', file: 'reports.html', modulePath: '13-analytics/reports' },
            { label: 'Visualizations', path: '/analytics/visualizations', file: 'visualizations.html', modulePath: '13-analytics/visualizations' }
        ]
    },
    {
        id: 'settings',
        label: '个人设置',
        icon: '🔧',
        path: '/settings',
        modulePath: '14-settings',
        children: [
            { label: 'Branches', path: '/settings/branches', file: 'branches.html', modulePath: '14-settings/branches' },
            { label: 'Company', path: '/settings/company', file: 'company.html', modulePath: '14-settings/company' },
            { label: 'General', path: '/settings/general', file: 'general.html', modulePath: '14-settings/general' },
            { label: 'Preferences', path: '/settings/preferences', file: 'preferences.html', modulePath: '14-settings/preferences' },
            { label: 'Profile', path: '/settings/profile', file: 'profile.html', modulePath: '14-settings/profile' }
        ]
    },
    {
        id: 'ai',
        label: 'AI 智能中心',
        icon: '🤖',
        path: '/ai',
        modulePath: '15-ai',
        children: [
            { label: 'Ai', path: '/ai/ai', file: 'ai.html', modulePath: '15-ai/ai' },
            { label: 'Crm', path: '/ai/crm', file: 'crm.html', modulePath: '15-ai/crm' }
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
                return { ...child, modulePath: child.modulePath || item.modulePath, isMain: false };
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
