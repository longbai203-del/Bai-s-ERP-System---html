// ============================================================
// BAI ERP 菜单配置
// 生成时间: 2026-07-16 11:54:17
// ============================================================

export const MENU_CONFIG = [
    {
        id: 'dashboard',
        label: '仪表盘',
        icon: '📊',
        path: '/dashboard',
        modulePath: '01-dashboard',
        children: [
            { label: '总览', path: '/dashboard', file: 'dashboard.html' }
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
