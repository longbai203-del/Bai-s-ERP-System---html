// ============================================================
// 02-pos 模块入口
// ============================================================

export const MODULE = {
    id: 'pos',
    name: '02-pos',
    version: '1.0.0',
    children: 'cash-register', 'cashier', 'customer-display', 'exchange', 'kitchen-display', 'offline-pos', 'quick-sale', 'receipt', 'touch-pos'
};

export function init() {
    console.log('✅ 02-pos 模块已初始化');
}

export function onLoad(container) {
    console.log('📄 02-pos 模块已加载');
}

console.log('✅ 02-pos 模块已注册');
