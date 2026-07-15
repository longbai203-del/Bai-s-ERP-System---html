/**
 * @file 02-pos/index.js
 * @description POS收银系统模块 - 入口文件
 * @module modules/02-pos
 */

import { productService } from '@services/product.service.js';
import { customerService } from '@services/customer.service.js';
import { orderService } from '@services/order.service.js';
import { formatCurrency } from '@utils/helpers.js';

import { modal } from '@components/modal.js';

/**
 * 模块元信息
 */
export const meta = {
    name: 'POS收银',
    path: '/pos',
    icon: 'fa-cash-register',
    permission: 'pos:view',
    enabled: true,
    order: 5
};

/**
 * 子模块列表
 */
export const subModules = [
    { id: 'cash-register', label: '收银台', icon: 'fa-cash-register', path: '/pos/cash-register' },
    { id: 'cashier', label: '收银员管理', icon: 'fa-user', path: '/pos/cashier' },
    { id: 'customer-display', label: '客户显示屏', icon: 'fa-tv', path: '/pos/customer-display' },
    { id: 'exchange', label: '换货管理', icon: 'fa-exchange-alt', path: '/pos/exchange' },
    { id: 'kitchen-display', label: '厨房显示屏', icon: 'fa-utensils', path: '/pos/kitchen-display' },
    { id: 'offline-pos', label: '离线收银', icon: 'fa-wifi-slash', path: '/pos/offline-pos' },
    { id: 'quick-sale', label: '快速销售', icon: 'fa-bolt', path: '/pos/quick-sale' },
    { id: 'receipt', label: '小票管理', icon: 'fa-receipt', path: '/pos/receipt' },
    { id: 'returns', label: '退货管理', icon: 'fa-undo', path: '/pos/returns' },
    { id: 'touch-pos', label: '触屏收银', icon: 'fa-hand-pointer', path: '/pos/touch-pos' }
];

/**
 * 模块状态
 */
let state = {
    cart: [],
    total: 0,
    customer: null,
    searchKeyword: '',
    products: [],
    selectedProduct: null,
    activeSub: 'cash-register',
    loading: false
};

/**
 * 渲染模块
 * @param {HTMLElement} container - 容器元素
 * @param {Object} params - 渲染参数
 */
export async function render(container, params = {}) {
    const sub = params.sub || 'cash-register';
    state.activeSub = sub;

    // 更新导航栏面包屑
    const navbarEl = document.querySelector('.navbar-breadcrumb');
    if (navbarEl) {
        navbarEl.innerHTML = '<span class="current">POS收银</span>';
    }

    // 动态加载子模块
    try {
        const moduleMap = {
            'cash-register': './cash-register/cash-register.js',
            'cashier': './cashier/cashier.js',
            'customer-display': './customer-display/customer-display.js',
            'exchange': './exchange/exchange.js',
            'kitchen-display': './kitchen-display/kitchen-display.js',
            'offline-pos': './offline-pos/offline-pos.js',
            'quick-sale': './quick-sale/quick-sale.js',
            'receipt': './receipt/receipt.js',
            'returns': './returns/returns.js',
            'touch-pos': './touch-pos/touch-pos.js'
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
                    <h1>POS收银</h1>
                </div>
                <div class="card">
                    <div class="card-body">
                        <p style="color:#6B7280;">${sub} 模块已加载</p>
                    </div>
                </div>
            `;
        }
    } catch (error) {
        console.error('[POS] 加载子模块 ' + sub + ' 失败:', error);
        container.innerHTML = `
            <div class="page-header">
                <h1>POS收银</h1>
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
    console.log('✅ [POS] 模块已初始化');
}

export default { meta, subModules, render, init };