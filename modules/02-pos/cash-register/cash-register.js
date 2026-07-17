/**
 * @file pos/submodules/cash-register.js
 * @description 收银台子模块
 * @module modules/pos/submodules/cash-register
 */

import { apiClient } from '@services/api-client.js';
import { formatCurrency } from '@utils/helpers.js';
import { modal } from '@components/modal.js';

export const meta = {
    name: '收银台',
    path: '/pos/cash-register',
    icon: 'fa-cash-register',
    permission: 'pos:cash-register'
};

export async function render(container) {
    container.innerHTML = `
        <div class="cash-register-container">
            <div class="page-header">
                <h1>🧾 收银台</h1>
                <div class="page-actions">
                    <button class="btn btn-outline" id="openDrawer">
                        <i class="fas fa-cash-register"></i> 打开钱箱
                    </button>
                </div>
            </div>
            <div class="card">
                <div class="card-body">
                    <div style="display:grid;grid-template-columns:2fr 1fr;gap:20px;">
                        <div id="registerProducts">
                            <div style="display:flex;gap:8px;margin-bottom:12px;">
                                <input type="text" class="form-control" id="registerSearch" placeholder="扫码/搜索商品...">
                                <button class="btn btn-primary" id="registerSearchBtn"><i class="fas fa-search"></i></button>
                            </div>
                            <div id="registerProductGrid" style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;max-height:400px;overflow-y:auto;">
                                <div style="text-align:center;padding:20px;color:#9CA3AF;">加载商品中...</div>
                            </div>
                        </div>
                        <div id="registerCart" style="background:#F9FAFB;border-radius:8px;padding:16px;">
                            <h4 style="margin-bottom:12px;">🛒 购物车</h4>
                            <div id="registerCartItems" style="max-height:300px;overflow-y:auto;"></div>
                            <div style="border-top:2px solid #E5E7EB;padding-top:12px;margin-top:12px;">
                                <div style="display:flex;justify-content:space-between;font-size:18px;font-weight:700;">
                                    <span>合计</span>
                                    <span id="registerTotal">¥0.00</span>
                                </div>
                                <button class="btn btn-success" style="width:100%;margin-top:8px;" id="registerCheckout">
                                    <i class="fas fa-check"></i> 结账
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // 加载商品
    const result = await apiClient.get('/products', { params: { page: 1, pageSize: 50 } });
    const products = result.success ? result.data.list || [] : [];
    
    const grid = document.getElementById('registerProductGrid');
    if (products.length === 0) {
        grid.innerHTML = '<div style="text-align:center;padding:20px;color:#9CA3AF;">暂无商品</div>';
        return;
    }
    
    grid.innerHTML = products.map(p => `
        <div class="register-product-item" data-id="${p.id}" style="border:1px solid #E5E7EB;border-radius:8px;padding:12px;text-align:center;cursor:pointer;hover:border-color:#4F46E5;">
            <div style="font-weight:500;font-size:14px;">${p.name}</div>
            <div style="font-size:12px;color:#6B7280;">${p.category}</div>
            <div style="font-weight:600;color:#4F46E5;">¥${formatCurrency(p.price)}</div>
        </div>
    `).join('');
    
    let cart = [];
    let total = 0;
    
    function updateCart() {
        const container = document.getElementById('registerCartItems');
        const totalEl = document.getElementById('registerTotal');
        total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        totalEl.textContent = `¥${formatCurrency(total)}`;
        
        if (cart.length === 0) {
            container.innerHTML = '<div style="text-align:center;color:#9CA3AF;padding:20px;">购物车为空</div>';
            return;
        }
        
        container.innerHTML = cart.map(item => `
            <div style="display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid #E5E7EB;">
                <div>
                    <div style="font-weight:500;">${item.name}</div>
                    <div style="font-size:12px;color:#6B7280;">¥${formatCurrency(item.price)} × ${item.quantity}</div>
                </div>
                <div style="display:flex;align-items:center;gap:8px;">
                    <span>¥${formatCurrency(item.price * item.quantity)}</span>
                    <button class="btn btn-sm btn-danger remove-item" data-id="${item.id}"><i class="fas fa-times"></i></button>
                </div>
            </div>
        `).join('');
        
        document.querySelectorAll('.remove-item').forEach(btn => {
            btn.addEventListener('click', () => {
                cart = cart.filter(item => item.id !== btn.dataset.id);
                updateCart();
            });
        });
    }
    
    grid.querySelectorAll('.register-product-item').forEach(el => {
        el.addEventListener('click', () => {
            const id = el.dataset.id;
            const product = products.find(p => p.id === id);
            if (!product) return;
            const existing = cart.find(item => item.id === id);
            if (existing) {
                existing.quantity++;
            } else {
                cart.push({ ...product, quantity: 1 });
            }
            updateCart();
        });
    });
    
    document.getElementById('registerCheckout')?.addEventListener('click', async () => {
        if (cart.length === 0) {
            modal.alert('提示', '购物车为空', '知道了', 'warning');
            return;
        }
        const result = await apiClient.post('/orders', {
            customerName: '散客',
            items: cart.map(item => ({ id: item.id, name: item.name, price: item.price, quantity: item.quantity })),
            totalAmount: total,
            note: 'POS收银'
        });
        if (result.success) {
            modal.alert('✅ 结账成功', `金额 ¥${formatCurrency(total)}`, '知道了', 'success');
            cart = [];
            updateCart();
        } else {
            modal.alert('❌ 失败', result.message, '知道了', 'danger');
        }
    });
    
    document.getElementById('openDrawer')?.addEventListener('click', () => {
        modal.alert('钱箱', '钱箱已打开 ✅', '知道了', 'success');
    });
}

export async function init() {

}

export default { meta, render, init };