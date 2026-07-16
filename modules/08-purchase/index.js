// ============================================================
// 08-purchase 模块入口
// ============================================================

export const MODULE = {
    id: 'purchase',
    name: '08-purchase',
    version: '1.0.0',
    children: 'import', 'quotations', 'receiving', 'supplier-payments', 'suppliers'
};

export function init() {
    console.log('✅ 08-purchase 模块已初始化');
}

export function onLoad(container) {
    console.log('📄 08-purchase 模块已加载');
}

console.log('✅ 08-purchase 模块已注册');
