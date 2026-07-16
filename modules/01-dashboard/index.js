// ============================================================
// 01-dashboard 模块入口
// ============================================================

export const MODULE = {
    id: 'dashboard',
    name: '01-dashboard',
    version: '1.0.0',
    children: 'dashboard', 'employee', 'executive', 'vehicle-monitor'
};

export function init() {
    console.log('✅ 01-dashboard 模块已初始化');
}

export function onLoad(container) {
    console.log('📄 01-dashboard 模块已加载');
}

console.log('✅ 01-dashboard 模块已注册');
