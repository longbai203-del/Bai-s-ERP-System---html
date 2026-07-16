// ============================================================
// 14-settings 模块入口
// ============================================================

export const MODULE = {
    id: 'settings',
    name: '14-settings',
    version: '1.0.0',
    children: 'branches', 'company', 'general', 'preferences', 'profile'
};

export function init() {
    console.log('✅ 14-settings 模块已初始化');
}

export function onLoad(container) {
    console.log('📄 14-settings 模块已加载');
}

console.log('✅ 14-settings 模块已注册');
