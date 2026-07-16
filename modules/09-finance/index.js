// ============================================================
// 09-finance 模块入口
// ============================================================

export const MODULE = {
    id: 'finance',
    name: '09-finance',
    version: '1.0.0',
    children: 'balance-sheet', 'bank', 'cash-flow', 'expenses', 'income', 'invoices', 'journal', 'payments', 'profit-loss', 'settlements', 'taxes', 'trial-balance', 'vat'
};

export function init() {
    console.log('✅ 09-finance 模块已初始化');
}

export function onLoad(container) {
    console.log('📄 09-finance 模块已加载');
}

console.log('✅ 09-finance 模块已注册');
