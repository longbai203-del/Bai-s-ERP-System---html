/**
 * @file 02-pos/customer-display/customer-display.js
 * @description 客户显示屏 - 面向客户的实时订单信息展示
 * @module modules/02-pos/customer-display
 */

import { formatCurrency } from '@utils/helpers.js';

export const meta = {
    name: '客户显示屏',
    path: '/pos/customer-display',
    icon: 'fa-tv',
    permission: 'pos:customer-display'
};

/**
 * 状态管理
 */
let state = {
    currentOrder: null,
    cart: [],
    total: 0,
    displayMode: 'idle' // idle | ordering | checkout
};

/**
 * 渲染客户显示屏
 * @param {HTMLElement} container - 容器元素
 */
export async function render(container) {
    // 创建显示界面
    container.innerHTML = `
        <div class="customer-display-container">
            <div class="page-header">
                <h1>🖥️ 客户显示屏</h1>
                <div class="page-actions">
                    <button class="btn btn-outline btn-sm" id="resetDisplay">
                        <i class="fas fa-undo"></i> 重置
                    </button>
                    <button class="btn btn-primary btn-sm" id="toggleFullscreen">
                        <i class="fas fa-expand"></i> 全屏
                    </button>
                </div>
            </div>
            
            <!-- 主显示屏 -->
            <div class="display-screen" id="displayScreen" style="background:linear-gradient(135deg,#1a1a2e,#16213e);border-radius:16px;padding:40px;min-height:400px;color:white;display:flex;flex-direction:column;align-items:center;justify-content:center;position:relative;overflow:hidden;">
                <!-- 顶部品牌标识 -->
                <div style="position:absolute;top:20px;left:30px;display:flex;align-items:center;gap:12px;">
                    <div style="font-size:24px;">🚗</div>
                    <div style="font-size:18px;font-weight:700;opacity:0.8;">Bai's ERP</div>
                </div>
                
                <!-- 状态指示器 -->
                <div style="position:absolute;top:20px;right:30px;display:flex;align-items:center;gap:8px;">
                    <span id="displayStatus" style="font-size:14px;opacity:0.6;">等待中</span>
                    <span id="statusDot" style="width:10px;height:10px;border-radius:50%;background:#10B981;display:inline-block;"></span>
                </div>
                
                <!-- 主要内容 -->
                <div id="displayContent" style="text-align:center;width:100%;">
                    <div style="font-size:64px;margin-bottom:20px;">👋</div>
                    <h2 style="font-size:32px;font-weight:300;margin-bottom:12px;">欢迎光临</h2>
                    <p style="font-size:18px;opacity:0.6;">请稍候，正在为您准备服务</p>
                </div>
                
                <!-- 底部信息 -->
                <div style="position:absolute;bottom:20px;left:0;right:0;text-align:center;font-size:12px;opacity:0.3;">
                    © ${new Date().getFullYear()} Bai's ERP System
                </div>
            </div>
            
            <!-- 控制面板 -->
            <div class="control-panel" style="margin-top:20px;display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;background:white;padding:16px;border-radius:12px;border:1px solid #E5E7EB;">
                <div>
                    <label class="form-label" style="font-size:12px;">当前订单</label>
                    <input type="text" class="form-control" id="displayOrderInput" placeholder="输入订单号或客户名" style="font-size:14px;">
                </div>
                <div style="display:flex;gap:8px;align-items:flex-end;">
                    <button class="btn btn-primary" id="loadOrderBtn" style="flex:1;">
                        <i class="fas fa-search"></i> 加载
                    </button>
                    <button class="btn btn-outline" id="clearDisplayBtn" style="flex:1;">
                        <i class="fas fa-times"></i> 清空
                    </button>
                </div>
                <div style="display:flex;gap:8px;align-items:flex-end;">
                    <button class="btn btn-success" id="showThankYou" style="flex:1;">
                        <i class="fas fa-smile"></i> 感谢
                    </button>
                    <button class="btn btn-warning" id="showCheckout" style="flex:1;">
                        <i class="fas fa-credit-card"></i> 结账
                    </button>
                </div>
            </div>
        </div>
    `;

    // 绑定事件
    bindEvents(container);
    
    // 初始化显示
    showIdle();
}

/**
 * 显示空闲状态
 */
function showIdle() {
    const content = document.getElementById('displayContent');
    const status = document.getElementById('displayStatus');
    const dot = document.getElementById('statusDot');
    
    if (content) {
        content.innerHTML = `
            <div style="font-size:64px;margin-bottom:20px;">👋</div>
            <h2 style="font-size:32px;font-weight:300;margin-bottom:12px;">欢迎光临</h2>
            <p style="font-size:18px;opacity:0.6;">请稍候，正在为您准备服务</p>
        `;
    }
    if (status) status.textContent = '空闲';
    if (dot) dot.style.background = '#10B981';
    state.displayMode = 'idle';
}

/**
 * 显示订单信息
 * @param {Object} order - 订单数据
 */
function showOrder(order) {
    const content = document.getElementById('displayContent');
    const status = document.getElementById('displayStatus');
    const dot = document.getElementById('statusDot');
    
    if (!content) return;
    
    const itemsHtml = order.items && order.items.length > 0 
        ? order.items.map(item => `
            <div style="display:flex;justify-content:space-between;padding:4px 0;border-bottom:1px solid rgba(255,255,255,0.1);">
                <span>${item.name} × ${item.quantity}</span>
                <span>¥${formatCurrency(item.price * item.quantity)}</span>
            </div>
        `).join('')
        : '<div style="color:rgba(255,255,255,0.5);">暂无商品</div>';
    
    content.innerHTML = `
        <div style="width:100%;max-width:500px;margin:0 auto;text-align:left;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">
                <h3 style="font-size:20px;font-weight:600;">🧾 订单详情</h3>
                <span style="font-size:14px;opacity:0.6;">#${order.orderNumber || order.id}</span>
            </div>
            <div style="background:rgba(255,255,255,0.05);border-radius:8px;padding:16px;">
                <div style="display:flex;justify-content:space-between;margin-bottom:8px;font-size:14px;opacity:0.6;">
                    <span>商品</span>
                    <span>小计</span>
                </div>
                ${itemsHtml}
                <div style="display:flex;justify-content:space-between;padding-top:12px;border-top:2px solid rgba(255,255,255,0.2);margin-top:8px;font-size:18px;font-weight:700;">
                    <span>合计</span>
                    <span style="color:#FCD34D;">¥${formatCurrency(order.totalAmount || order.total)}</span>
                </div>
                ${order.customerName ? `<div style="margin-top:8px;font-size:14px;opacity:0.6;">客户：${order.customerName}</div>` : ''}
            </div>
        </div>
    `;
    
    if (status) status.textContent = '显示中';
    if (dot) dot.style.background = '#3B82F6';
    state.displayMode = 'ordering';
}

/**
 * 显示感谢页面
 */
function showThankYou() {
    const content = document.getElementById('displayContent');
    const status = document.getElementById('displayStatus');
    const dot = document.getElementById('statusDot');
    
    if (content) {
        content.innerHTML = `
            <div style="font-size:80px;margin-bottom:20px;">🎉</div>
            <h2 style="font-size:36px;font-weight:700;margin-bottom:12px;">感谢您的光临！</h2>
            <p style="font-size:20px;opacity:0.7;">期待下次为您服务</p>
            <div style="margin-top:20px;display:flex;gap:30px;justify-content:center;font-size:14px;opacity:0.5;">
                <span>⭐ 优质服务</span>
                <span>⭐ 值得信赖</span>
                <span>⭐ 专业团队</span>
            </div>
        `;
    }
    if (status) status.textContent = '感谢';
    if (dot) dot.style.background = '#F59E0B';
    state.displayMode = 'checkout';
}

/**
 * 显示结账页面
 */
function showCheckout() {
    const content = document.getElementById('displayContent');
    const status = document.getElementById('displayStatus');
    const dot = document.getElementById('statusDot');
    
    if (content) {
        content.innerHTML = `
            <div style="font-size:64px;margin-bottom:20px;">💳</div>
            <h2 style="font-size:28px;font-weight:600;margin-bottom:8px;">正在结账</h2>
            <p style="font-size:18px;opacity:0.7;">请稍候，正在处理您的支付</p>
            <div style="margin-top:20px;display:flex;gap:20px;justify-content:center;">
                <div style="text-align:center;">
                    <div style="font-size:24px;font-weight:700;color:#FCD34D;">¥${state.total > 0 ? formatCurrency(state.total) : '0.00'}</div>
                    <div style="font-size:12px;opacity:0.5;">应付款</div>
                </div>
            </div>
            <div style="margin-top:16px;display:flex;gap:12px;justify-content:center;">
                <span style="background:rgba(255,255,255,0.1);padding:4px 16px;border-radius:20px;font-size:12px;">💳 刷卡</span>
                <span style="background:rgba(255,255,255,0.1);padding:4px 16px;border-radius:20px;font-size:12px;">📱 扫码</span>
                <span style="background:rgba(255,255,255,0.1);padding:4px 16px;border-radius:20px;font-size:12px;">💵 现金</span>
            </div>
        `;
    }
    if (status) status.textContent = '结账';
    if (dot) dot.style.background = '#EF4444';
    state.displayMode = 'checkout';
}

/**
 * 绑定事件
 */
function bindEvents(container) {
    // 加载订单
    const loadBtn = document.getElementById('loadOrderBtn');
    const orderInput = document.getElementById('displayOrderInput');
    
    if (loadBtn && orderInput) {
        loadBtn.addEventListener('click', () => {
            const value = orderInput.value.trim();
            if (!value) {
                showIdle();
                return;
            }
            // 模拟加载订单
            const mockOrder = {
                id: 'ORD-' + Date.now().toString().slice(-6),
                orderNumber: 'ORD-2026-' + String(Math.floor(Math.random() * 10000)).padStart(4, '0'),
                customerName: value,
                items: [
                    { name: '标准洗车', price: 68, quantity: 1 },
                    { name: '内饰清洁', price: 328, quantity: 1 }
                ],
                totalAmount: 396,
                total: 396
            };
            state.total = 396;
            showOrder(mockOrder);
        });
        
        orderInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                loadBtn.click();
            }
        });
    }
    
    // 清空显示
    const clearBtn = document.getElementById('clearDisplayBtn');
    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            showIdle();
            if (orderInput) orderInput.value = '';
        });
    }
    
    // 感谢
    const thankBtn = document.getElementById('showThankYou');
    if (thankBtn) {
        thankBtn.addEventListener('click', showThankYou);
    }
    
    // 结账
    const checkoutBtn = document.getElementById('showCheckout');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', showCheckout);
    }
    
    // 重置显示
    const resetBtn = document.getElementById('resetDisplay');
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            showIdle();
            if (orderInput) orderInput.value = '';
        });
    }
    
    // 全屏
    const fullscreenBtn = document.getElementById('toggleFullscreen');
    if (fullscreenBtn) {
        fullscreenBtn.addEventListener('click', () => {
            const screen = document.getElementById('displayScreen');
            if (screen) {
                if (!document.fullscreenElement) {
                    screen.requestFullscreen?.();
                } else {
                    document.exitFullscreen?.();
                }
            }
        });
    }
}

/**
 * 模块初始化钩子
 */
export async function init() {

}

export default { meta, render, init };