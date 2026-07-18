// core/app.js
// ?????

console.log('?? BAI ERP ?????...');

// ============================================================
// 15??????
// ============================================================
const MENU_CONFIG = [
    {
        id: 'dashboard',
        label: '???',
        icon: '??',
        modulePath: '01-dashboard',
        children: [
            { id: 'dashboard', label: 'Dashboard', file: 'dashboard/dashboard.html' },
            { id: 'employee', label: 'Employee', file: 'dashboard/employee.html' },
            { id: 'executive', label: 'Executive', file: 'dashboard/executive.html' },
            { id: 'vehicle-monitor', label: 'Vehicle Monitor', file: 'dashboard/vehicle-monitor.html' }
        ]
    },
    {
        id: 'pos',
        label: 'POS ??',
        icon: '??',
        modulePath: '02-pos',
        children: [
            { id: 'cashier', label: 'Cashier', file: 'pos/cashier.html' },
            { id: 'cash-register', label: 'Cash Register', file: 'pos/cash-register.html' },
            { id: 'customer-display', label: 'Customer Display', file: 'pos/customer-display.html' },
            { id: 'exchange', label: 'Exchange', file: 'pos/exchange.html' },
            { id: 'kitchen-display', label: 'Kitchen Display', file: 'pos/kitchen-display.html' },
            { id: 'offline-pos', label: 'Offline POS', file: 'pos/offline-pos.html' },
            { id: 'quick-sale', label: 'Quick Sale', file: 'pos/quick-sale.html' },
            { id: 'receipt', label: 'Receipt', file: 'pos/receipt.html' },
            { id: 'touch-pos', label: 'Touch POS', file: 'pos/touch-pos.html' }
        ]
    },
    {
        id: 'orders',
        label: '????',
        icon: '??',
        modulePath: '03-orders',
        children: [
            { id: 'detail', label: 'Detail', file: 'orders/detail.html' },
            { id: 'list', label: 'List', file: 'orders/list.html' },
            { id: 'refunds', label: 'Refunds', file: 'orders/refunds.html' },
            { id: 'returns', label: 'Returns', file: 'orders/returns.html' },
            { id: 'submodules', label: 'Submodules', file: 'orders/submodules.html' }
        ]
    },
    {
        id: 'products',
        label: '????',
        icon: '??',
        modulePath: '04-products',
        children: [
            { id: 'barcodes', label: 'Barcodes', file: 'products/barcodes.html' },
            { id: 'brands', label: 'Brands', file: 'products/brands.html' },
            { id: 'categories', label: 'Categories', file: 'products/categories.html' },
            { id: 'combos', label: 'Combos', file: 'products/combos.html' },
            { id: 'modifiers', label: 'Modifiers', file: 'products/modifiers.html' },
            { id: 'price-lists', label: 'Price Lists', file: 'products/price-lists.html' },
            { id: 'products', label: 'Products', file: 'products/products.html' },
            { id: 'variants', label: 'Variants', file: 'products/variants.html' }
        ]
    },
    {
        id: 'customers',
        label: '????',
        icon: '??',
        modulePath: '05-customers',
        children: [
            { id: 'coupons', label: 'Coupons', file: 'customers/coupons.html' },
            { id: 'customers', label: 'Customers', file: 'customers/customers.html' },
            { id: 'feedback', label: 'Feedback', file: 'customers/feedback.html' },
            { id: 'gift-cards', label: 'Gift Cards', file: 'customers/gift-cards.html' },
            { id: 'membership', label: 'Membership', file: 'customers/membership.html' },
            { id: 'vehicles', label: 'Vehicles', file: 'customers/vehicles.html' },
            { id: 'wallet', label: 'Wallet', file: 'customers/wallet.html' }
        ]
    },
    {
        id: 'marketing',
        label: '????',
        icon: '??',
        modulePath: '06-marketing',
        children: [
            { id: 'campaigns', label: 'Campaigns', file: 'marketing/campaigns.html' },
            { id: 'loyalty', label: 'Loyalty', file: 'marketing/loyalty.html' },
            { id: 'promotions', label: 'Promotions', file: 'marketing/promotions.html' },
            { id: 'referrals', label: 'Referrals', file: 'marketing/referrals.html' }
        ]
    },
    {
        id: 'inventory',
        label: '????',
        icon: '??',
        modulePath: '07-inventory',
        children: [
            { id: 'adjustments', label: 'Adjustments', file: 'inventory/adjustments.html' },
            { id: 'batches', label: 'Batches', file: 'inventory/batches.html' },
            { id: 'cycle-counts', label: 'Cycle Counts', file: 'inventory/cycle-counts.html' },
            { id: 'expiry', label: 'Expiry', file: 'inventory/expiry.html' },
            { id: 'history', label: 'History', file: 'inventory/history.html' },
            { id: 'low-stock', label: 'Low Stock', file: 'inventory/low-stock.html' },
            { id: 'serial-numbers', label: 'Serial Numbers', file: 'inventory/serial-numbers.html' },
            { id: 'stock', label: 'Stock', file: 'inventory/stock.html' },
            { id: 'transfers', label: 'Transfers', file: 'inventory/transfers.html' },
            { id: 'warehouses', label: 'Warehouses', file: 'inventory/warehouses.html' }
        ]
    },
    {
        id: 'purchase',
        label: '????',
        icon: '??',
        modulePath: '08-purchase',
        children: [
            { id: 'import', label: 'Import', file: 'purchase/import.html' },
            { id: 'quotations', label: 'Quotations', file: 'purchase/quotations.html' },
            { id: 'receiving', label: 'Receiving', file: 'purchase/receiving.html' },
            { id: 'supplier-payments', label: 'Supplier Payments', file: 'purchase/supplier-payments.html' },
            { id: 'suppliers', label: 'Suppliers', file: 'purchase/suppliers.html' }
        ]
    },
    {
        id: 'finance',
        label: '????',
        icon: '??',
        modulePath: '09-finance',
        children: [
            { id: 'balance-sheet', label: 'Balance Sheet', file: 'finance/balance-sheet.html' },
            { id: 'bank', label: 'Bank', file: 'finance/bank.html' },
            { id: 'cash-flow', label: 'Cash Flow', file: 'finance/cash-flow.html' },
            { id: 'expenses', label: 'Expenses', file: 'finance/expenses.html' },
            { id: 'income', label: 'Income', file: 'finance/income.html' },
            { id: 'invoices', label: 'Invoices', file: 'finance/invoices.html' },
            { id: 'journal', label: 'Journal', file: 'finance/journal.html' },
            { id: 'payments', label: 'Payments', file: 'finance/payments.html' },
            { id: 'profit-loss', label: 'Profit Loss', file: 'finance/profit-loss.html' },
            { id: 'settlements', label: 'Settlements', file: 'finance/settlements.html' },
            { id: 'taxes', label: 'Taxes', file: 'finance/taxes.html' },
            { id: 'trial-balance', label: 'Trial Balance', file: 'finance/trial-balance.html' },
            { id: 'vat', label: 'VAT', file: 'finance/vat.html' }
        ]
    },
    {
        id: 'hr',
        label: '??????',
        icon: '??',
        modulePath: '10-hr',
        children: [
            { id: 'attendance', label: 'Attendance', file: 'hr/attendance.html' },
            { id: 'bonuses', label: 'Bonuses', file: 'hr/bonuses.html' },
            { id: 'commissions', label: 'Commissions', file: 'hr/commissions.html' },
            { id: 'employees', label: 'Employees', file: 'hr/employees.html' },
            { id: 'leaves', label: 'Leaves', file: 'hr/leaves.html' },
            { id: 'payroll', label: 'Payroll', file: 'hr/payroll.html' },
            { id: 'penalties', label: 'Penalties', file: 'hr/penalties.html' },
            { id: 'performance', label: 'Performance', file: 'hr/performance.html' },
            { id: 'permissions', label: 'Permissions', file: 'hr/permissions.html' },
            { id: 'schedules', label: 'Schedules', file: 'hr/schedules.html' },
            { id: 'shifts', label: 'Shifts', file: 'hr/shifts.html' },
            { id: 'tasks', label: 'Tasks', file: 'hr/tasks.html' }
        ]
    },
    {
        id: 'saas',
        label: 'SaaS ??',
        icon: '??',
        modulePath: '11-saas',
        children: [
            { id: 'billing', label: 'Billing', file: 'saas/billing.html' },
            { id: 'feature-limits', label: 'Feature Limits', file: 'saas/feature-limits.html' },
            { id: 'packages', label: 'Packages', file: 'saas/packages.html' },
            { id: 'plans', label: 'Plans', file: 'saas/plans.html' },
            { id: 'storage', label: 'Storage', file: 'saas/storage.html' },
            { id: 'subscriptions', label: 'Subscriptions', file: 'saas/subscriptions.html' },
            { id: 'tenants', label: 'Tenants', file: 'saas/tenants.html' },
            { id: 'usage', label: 'Usage', file: 'saas/usage.html' }
        ]
    },
    {
        id: 'system',
        label: '????',
        icon: '??',
        modulePath: '12-system',
        children: [
            { id: 'api-keys', label: 'API Keys', file: 'system/api-keys.html' },
            { id: 'audit-logs', label: 'Audit Logs', file: 'system/audit-logs.html' },
            { id: 'backup', label: 'Backup', file: 'system/backup.html' },
            { id: 'integrations', label: 'Integrations', file: 'system/integrations.html' },
            { id: 'marketplace', label: 'Marketplace', file: 'system/marketplace.html' },
            { id: 'notifications', label: 'Notifications', file: 'system/notifications.html' },
            { id: 'permissions', label: 'Permissions', file: 'system/permissions.html' },
            { id: 'restore', label: 'Restore', file: 'system/restore.html' },
            { id: 'roles', label: 'Roles', file: 'system/roles.html' },
            { id: 'settings', label: 'Settings', file: 'system/settings.html' },
            { id: 'system-logs', label: 'System Logs', file: 'system/system-logs.html' },
            { id: 'webhooks', label: 'Webhooks', file: 'system/webhooks.html' }
        ]
    },
    {
        id: 'analytics',
        label: '????',
        icon: '??',
        modulePath: '13-analytics',
        children: [
            { id: 'business-health', label: 'Business Health', file: 'analytics/business-health.html' },
            { id: 'custom-reports', label: 'Custom Reports', file: 'analytics/custom-reports.html' },
            { id: 'forecast', label: 'Forecast', file: 'analytics/forecast.html' },
            { id: 'recommendations', label: 'Recommendations', file: 'analytics/recommendations.html' },
            { id: 'reports', label: 'Reports', file: 'analytics/reports.html' },
            { id: 'visualizations', label: 'Visualizations', file: 'analytics/visualizations.html' }
        ]
    },
    {
        id: 'settings',
        label: '????',
        icon: '??',
        modulePath: '14-settings',
        children: [
            { id: 'branches', label: 'Branches', file: 'settings/branches.html' },
            { id: 'company', label: 'Company', file: 'settings/company.html' },
            { id: 'general', label: 'General', file: 'settings/general.html' },
            { id: 'preferences', label: 'Preferences', file: 'settings/preferences.html' },
            { id: 'profile', label: 'Profile', file: 'settings/profile.html' }
        ]
    },
    {
        id: 'ai',
        label: 'AI ????',
        icon: '??',
        modulePath: '15-ai',
        children: [
            { id: 'ai', label: 'AI', file: 'ai/ai.html' },
            { id: 'crm', label: 'CRM', file: 'ai/crm.html' }
        ]
    }
];

// ============================================================
// ?????
// ============================================================
function renderSidebar() {
    const container = document.getElementById('sidebar-container');
    if (!container) {
        console.error('? sidebar-container ???');
        return;
    }

    let html = '';
    MENU_CONFIG.forEach(function(module) {
        const hasChildren = module.children && module.children.length > 0;
        html += '<div class="menu-item">';
        html += '<div class="menu-header" data-module="' + module.id + '">';
        html += '<span>' + module.icon + '</span> ' + module.label;
        if (hasChildren) html += '<span class="arrow">?</span>';
        html += '</div>';
        if (hasChildren) {
            html += '<div class="menu-children">';
            module.children.forEach(function(child) {
                html += '<div class="menu-child" data-module="' + module.id + '" data-child="' + child.id + '" data-path="' + module.modulePath + '/' + child.file + '">';
                html += child.label;
                html += '</div>';
            });
            html += '</div>';
        }
        html += '</div>';
    });
    container.innerHTML = html;

    // ????
    container.querySelectorAll('.menu-header').forEach(function(header) {
        header.addEventListener('click', function() {
            const children = this.nextElementSibling;
            const arrow = this.querySelector('.arrow');
            if (children) {
                children.classList.toggle('open');
                if (arrow) arrow.classList.toggle('open');
            }
        });
    });

    container.querySelectorAll('.menu-child').forEach(function(item) {
        item.addEventListener('click', function() {
            const path = this.dataset.path;
            if (path) {
                loadModule(path);
            }
        });
    });

    console.log('? ???????');
}

// ============================================================
// ????
// ============================================================
async function loadModule(path) {
    const mainContent = document.getElementById('main-content');
    if (!mainContent) return;

    mainContent.innerHTML = '<div class="loading"><div class="spinner"></div><span>???...</span></div>';

    const fullPath = 'modules/' + path;

    try {
        const response = await fetch(fullPath);
        if (!response.ok) throw new Error('?????: ' + fullPath);
        let html = await response.text();
        const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
        if (bodyMatch) {
            html = bodyMatch[1];
        }
        mainContent.innerHTML = html;
        console.log('? ??????:', fullPath);
    } catch (error) {
        mainContent.innerHTML = '<div style="padding:60px;text-align:center;color:#ef4444;"><h2>?? ????</h2><p style="color:#94a3b8;">' + error.message + '</p></div>';
        console.error('? ????:', error);
    }
}

// ============================================================
// ???
// ============================================================
function initApp() {
    console.log('?? ?????...');
    renderSidebar();
    // ???????
    loadModule('01-dashboard/dashboard/dashboard.html');
    console.log('? ???????');
}

// ??
if (document.readyState === 'complete') {
    initApp();
} else {
    document.addEventListener('DOMContentLoaded', initApp);
}
