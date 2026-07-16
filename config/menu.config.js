// ============================================================
// BAI ERP 完整菜单配置
// 生成时间: 2026-07-16 12:21:07
// ============================================================

export const MENU_CONFIG = [
    {
        id: 'dashboard',
        label: 'True',
        icon: 'True',
        path: '/dashboard',
        modulePath: '01-dashboard',
        children: [
            { label: 'Dashboard', path: '/dashboard/dashboard', file: 'dashboard.html' },
            { label: 'Employee', path: '/dashboard/employee', file: 'employee.html' },
            { label: 'Executive', path: '/dashboard/executive', file: 'executive.html' },
            { label: 'Vehicle Monitor', path: '/dashboard/vehicle-monitor', file: 'vehicle-monitor.html' }
        ]
    },
    {
        id: 'pos',
        label: 'True',
        icon: 'True',
        path: '/pos',
        modulePath: '02-pos',
        children: [
            { label: 'Cashier', path: '/pos/cashier', file: 'cashier.html' },
            { label: 'Cash Register', path: '/pos/cash-register', file: 'cash-register.html' },
            { label: 'Customer Display', path: '/pos/customer-display', file: 'customer-display.html' },
            { label: 'Exchange', path: '/pos/exchange', file: 'exchange.html' },
            { label: 'Kitchen Display', path: '/pos/kitchen-display', file: 'kitchen-display.html' },
            { label: 'Offline Pos', path: '/pos/offline-pos', file: 'offline-pos.html' },
            { label: 'Quick Sale', path: '/pos/quick-sale', file: 'quick-sale.html' },
            { label: 'Receipt', path: '/pos/receipt', file: 'receipt.html' },
            { label: 'Touch Pos', path: '/pos/touch-pos', file: 'touch-pos.html' }
        ]
    },
    {
        id: 'orders',
        label: 'True',
        icon: 'True',
        path: '/orders',
        modulePath: '03-orders',
        children: [
            { label: 'Detail', path: '/orders/detail', file: 'detail.html' },
            { label: 'List', path: '/orders/list', file: 'list.html' },
            { label: 'Refunds', path: '/orders/refunds', file: 'refunds.html' },
            { label: 'Returns', path: '/orders/returns', file: 'returns.html' },
            { label: 'Submodules', path: '/orders/submodules', file: 'submodules.html' }
        ]
    },
    {
        id: 'products',
        label: 'True',
        icon: 'True',
        path: '/products',
        modulePath: '04-products',
        children: [
            { label: 'Barcodes', path: '/products/barcodes', file: 'barcodes.html' },
            { label: 'Brands', path: '/products/brands', file: 'brands.html' },
            { label: 'Categories', path: '/products/categories', file: 'categories.html' },
            { label: 'Combos', path: '/products/combos', file: 'combos.html' },
            { label: 'Modifiers', path: '/products/modifiers', file: 'modifiers.html' },
            { label: 'Price Lists', path: '/products/price-lists', file: 'price-lists.html' },
            { label: 'Products', path: '/products/products', file: 'products.html' },
            { label: 'Variants', path: '/products/variants', file: 'variants.html' }
        ]
    },
    {
        id: 'customers',
        label: 'True',
        icon: 'True',
        path: '/customers',
        modulePath: '05-customers',
        children: [
            { label: 'Coupons', path: '/customers/coupons', file: 'coupons.html' },
            { label: 'Customers', path: '/customers/customers', file: 'customers.html' },
            { label: 'Feedback', path: '/customers/feedback', file: 'feedback.html' },
            { label: 'Gift Cards', path: '/customers/gift-cards', file: 'gift-cards.html' },
            { label: 'Membership', path: '/customers/membership', file: 'membership.html' },
            { label: 'Vehicles', path: '/customers/vehicles', file: 'vehicles.html' },
            { label: 'Wallet', path: '/customers/wallet', file: 'wallet.html' }
        ]
    },
    {
        id: 'marketing',
        label: 'True',
        icon: 'True',
        path: '/marketing',
        modulePath: '06-marketing',
        children: [
            { label: 'Campaigns', path: '/marketing/campaigns', file: 'campaigns.html' },
            { label: 'Loyalty', path: '/marketing/loyalty', file: 'loyalty.html' },
            { label: 'Promotions', path: '/marketing/promotions', file: 'promotions.html' },
            { label: 'Referrals', path: '/marketing/referrals', file: 'referrals.html' }
        ]
    },
    {
        id: 'inventory',
        label: 'True',
        icon: 'True',
        path: '/inventory',
        modulePath: '07-inventory',
        children: [
            { label: 'Adjustments', path: '/inventory/adjustments', file: 'adjustments.html' },
            { label: 'Batches', path: '/inventory/batches', file: 'batches.html' },
            { label: 'Cycle Counts', path: '/inventory/cycle-counts', file: 'cycle-counts.html' },
            { label: 'Expiry', path: '/inventory/expiry', file: 'expiry.html' },
            { label: 'History', path: '/inventory/history', file: 'history.html' },
            { label: 'Low Stock', path: '/inventory/low-stock', file: 'low-stock.html' },
            { label: 'Serial Numbers', path: '/inventory/serial-numbers', file: 'serial-numbers.html' },
            { label: 'Stock', path: '/inventory/stock', file: 'stock.html' },
            { label: 'Transfers', path: '/inventory/transfers', file: 'transfers.html' },
            { label: 'Warehouses', path: '/inventory/warehouses', file: 'warehouses.html' }
        ]
    },
    {
        id: 'purchase',
        label: 'True',
        icon: 'True',
        path: '/purchase',
        modulePath: '08-purchase',
        children: [
            { label: 'Import', path: '/purchase/import', file: 'import.html' },
            { label: 'Quotations', path: '/purchase/quotations', file: 'quotations.html' },
            { label: 'Receiving', path: '/purchase/receiving', file: 'receiving.html' },
            { label: 'Supplier Payments', path: '/purchase/supplier-payments', file: 'supplier-payments.html' },
            { label: 'Suppliers', path: '/purchase/suppliers', file: 'suppliers.html' }
        ]
    },
    {
        id: 'finance',
        label: 'True',
        icon: 'True',
        path: '/finance',
        modulePath: '09-finance',
        children: [
            { label: 'Balance Sheet', path: '/finance/balance-sheet', file: 'balance-sheet.html' },
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
            { label: 'Vat', path: '/finance/vat', file: 'vat.html' }
        ]
    },
    {
        id: 'hr',
        label: 'True',
        icon: 'True',
        path: '/hr',
        modulePath: '10-hr',
        children: [
            { label: 'Attendance', path: '/hr/attendance', file: 'attendance.html' },
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
            { label: 'Tasks', path: '/hr/tasks', file: 'tasks.html' }
        ]
    },
    {
        id: 'saas',
        label: 'True',
        icon: 'True',
        path: '/saas',
        modulePath: '11-saas',
        children: [
            { label: 'Billing', path: '/saas/billing', file: 'billing.html' },
            { label: 'Feature Limits', path: '/saas/feature-limits', file: 'feature-limits.html' },
            { label: 'Packages', path: '/saas/packages', file: 'packages.html' },
            { label: 'Plans', path: '/saas/plans', file: 'plans.html' },
            { label: 'Storage', path: '/saas/storage', file: 'storage.html' },
            { label: 'Subscriptions', path: '/saas/subscriptions', file: 'subscriptions.html' },
            { label: 'Tenants', path: '/saas/tenants', file: 'tenants.html' },
            { label: 'Usage', path: '/saas/usage', file: 'usage.html' }
        ]
    },
    {
        id: 'system',
        label: 'True',
        icon: 'True',
        path: '/system',
        modulePath: '12-system',
        children: [
            { label: 'Api Keys', path: '/system/api-keys', file: 'api-keys.html' },
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
            { label: 'Webhooks', path: '/system/webhooks', file: 'webhooks.html' }
        ]
    },
    {
        id: 'analytics',
        label: 'True',
        icon: 'True',
        path: '/analytics',
        modulePath: '13-analytics',
        children: [
            { label: 'Business Health', path: '/analytics/business-health', file: 'business-health.html' },
            { label: 'Custom Reports', path: '/analytics/custom-reports', file: 'custom-reports.html' },
            { label: 'Forecast', path: '/analytics/forecast', file: 'forecast.html' },
            { label: 'Recommendations', path: '/analytics/recommendations', file: 'recommendations.html' },
            { label: 'Reports', path: '/analytics/reports', file: 'reports.html' },
            { label: 'Visualizations', path: '/analytics/visualizations', file: 'visualizations.html' }
        ]
    },
    {
        id: 'settings',
        label: 'True',
        icon: 'True',
        path: '/settings',
        modulePath: '14-settings',
        children: [
            { label: 'Branches', path: '/settings/branches', file: 'branches.html' },
            { label: 'Company', path: '/settings/company', file: 'company.html' },
            { label: 'General', path: '/settings/general', file: 'general.html' },
            { label: 'Preferences', path: '/settings/preferences', file: 'preferences.html' },
            { label: 'Profile', path: '/settings/profile', file: 'profile.html' }
        ]
    },
    {
        id: 'ai',
        label: 'True',
        icon: 'True',
        path: '/ai',
        modulePath: '15-ai',
        children: [
            { label: 'Ai', path: '/ai/ai', file: 'ai.html' },
            { label: 'Crm', path: '/ai/crm', file: 'crm.html' }
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
