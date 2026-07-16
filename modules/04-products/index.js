// ============================================================
// 04-products 模块入口
// ============================================================

export const MODULE = {
    id: 'products',
    name: '04-products',
    version: '1.0.0',
    children: 'barcodes', 'brands', 'categories', 'combos', 'modifiers', 'price-lists', 'products', 'variants'
};

export function init() {
    console.log('✅ 04-products 模块已初始化');
}

export function onLoad(container) {
    console.log('📄 04-products 模块已加载');
}

console.log('✅ 04-products 模块已注册');
