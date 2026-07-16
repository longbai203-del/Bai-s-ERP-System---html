// ============================================================
// 05-customers 模块入口
// ============================================================

export const MODULE = {
    id: 'customers',
    name: '05-customers',
    version: '1.0.0',
    children: 'coupons', 'customers', 'feedback', 'gift-cards', 'membership', 'vehicles', 'wallet'
};

export function init() {
    console.log('✅ 05-customers 模块已初始化');
}

export function onLoad(container) {
    console.log('📄 05-customers 模块已加载');
}

console.log('✅ 05-customers 模块已注册');
