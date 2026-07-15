/**
 * @file 05-customers/index.js
 * @description 客户管理模块 - 入口文件
 * @module modules/05-customers
 */

/**
 * 模块元信息
 */
export const meta = {
    name: '客户管理',
    path: '/customers',
    icon: 'fa-users',
    permission: 'customers:view',
    enabled: true,
    order: 50
};

/**
 * 子模块列表
 */
export const subModules = [
    { id: 'customers', label: '客户列表', icon: 'fa-user', path: '/customers' },
    { id: 'coupons', label: '优惠券管理', icon: 'fa-ticket-alt', path: '/customers/coupons' },
    { id: 'feedback', label: '客户反馈', icon: 'fa-comment', path: '/customers/feedback' },
    { id: 'gift-cards', label: '礼品卡管理', icon: 'fa-gift', path: '/customers/gift-cards' },
    { id: 'membership', label: '会员管理', icon: 'fa-id-card', path: '/customers/membership' },
    { id: 'vehicles', label: '车辆管理', icon: 'fa-car', path: '/customers/vehicles' },
    { id: 'wallet', label: '钱包管理', icon: 'fa-wallet', path: '/customers/wallet' }
];

/**
 * 模块状态
 */
let state = {
    activeSub: 'customers',
    loading: false
};

/**
 * 渲染模块
 * @param {HTMLElement} container - 容器元素
 * @param {Object} params - 渲染参数
 */
export async function render(container, params = {}) {
    const sub = params.sub || 'customers';
    state.activeSub = sub;

    // 更新导航栏面包屑
    const navbar = document.querySelector('.navbar-breadcrumb');
    if (navbar) {
        navbar.innerHTML = '<span class="current">客户管理</span>';
    }

    // 动态加载子模块
    try {
        const moduleMap = {
            'customers': './customers/customers.js',
            'coupons': './coupons/coupons.js',
            'feedback': './feedback/feedback.js',
            'gift-cards': './gift-cards/gift-cards.js',
            'membership': './membership/membership.js',
            'vehicles': './vehicles/vehicles.js',
            'wallet': './wallet/wallet.js'
        };

        const modulePath = moduleMap[sub];
        if (!modulePath) {
            container.innerHTML = '<div style="text-align:center;padding:40px;color:#EF4444;">未知子模块: ' + sub + '</div>';
            return;
        }

        const module = await import(modulePath);
        if (module.render) {
            await module.render(container, params);
        } else if (module.init) {
            await module.init();
            container.innerHTML = `
                <div class="page-header">
                    <h1>客户管理</h1>
                </div>
                <div class="card">
                    <div class="card-body">
                        <p style="color:#6B7280;">${sub} 模块已加载</p>
                    </div>
                </div>
            `;
        }
    } catch (error) {
        console.error('[Customers] 加载子模块 ' + sub + ' 失败:', error);
        container.innerHTML = `
            <div class="page-header">
                <h1>客户管理</h1>
            </div>
            <div class="card">
                <div class="card-body" style="text-align:center;padding:40px;">
                    <div style="font-size:48px;margin-bottom:16px;">⚠️</div>
                    <h3 style="color:#374151;">子模块加载失败</h3>
                    <p style="color:#6B7280;">${error.message || '请检查子模块是否存在'}</p>
                    <button onclick="location.reload()" class="btn btn-primary" style="margin-top:16px;">
                        <i class="fas fa-sync"></i> 刷新
                    </button>
                </div>
            </div>
        `;
    }
}

/**
 * 模块初始化钩子
 */
export async function init() {
    console.log('✅ [Customers] 模块已初始化');
}

export default { meta, subModules, render, init };