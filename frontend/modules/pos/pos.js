/**
 * POS Module - 销售点
 */

(function() {
    'use strict';

    let cart = [];
    let currentCustomer = null;

    window.initPOS = function() {
        console.log('🛒 POS 模块加载完成');
        
        // 初始化POS
        window.POSService.init(window._currentBranch || '');
        
        // 加载产品列表
        loadProducts();
        
        // 绑定事件
        bindEvents();
        
        // 键盘快捷键
        bindKeyboard();
    };

    // 加载产品
    async function loadProducts() {
        try {
            const products = await window.ProductService.getAll({
                branch_id: window._currentBranch,
                status: 'active'
            });
            
            renderProducts(products);
        } catch (error) {
            console.error('加载产品失败:', error);
        }
    }

    // 渲染产品
    function renderProducts(products) {
        const container = document.querySelector('.pos-products');
        if (!container) return;
        
        container.innerHTML = products.map(product => `
            <div class="pos-product" data-id="${product.id}" onclick="window.addToCart('${product.id}')">
                <div class="product-name">${product.name}</div>
                <div class="product-price">${product.price} SAR</div>
                <div class="product-stock">库存: ${product.inventory?.quantity || 0}</div>
            </div>
        `).join('');
    }

    // 添加购物车
    window.addToCart = function(productId) {
        const product = window._products?.find(p => p.id === productId);
        if (product) {
            window.POSService.addItem(product);
            renderCart();
        }
    };

    // 渲染购物车
    function renderCart() {
        const cartData = window.POSService.getCart();
        const container = document.querySelector('.pos-cart');
        if (!container) return;
        
        container.innerHTML = `
            <div class="cart-items">
                ${cartData.items.map(item => `
                    <div class="cart-item">
                        <span>${item.name}</span>
                        <span>${item.quantity} x ${item.price}</span>
                        <span>${item.total}</span>
                        <button onclick="window.removeFromCart('${item.product_id}')">✕</button>
                    </div>
                `).join('')}
            </div>
            <div class="cart-total">
                小计: ${cartData.subtotal} SAR
                折扣: ${cartData.discount} SAR
                税额: ${cartData.tax} SAR
                合计: ${cartData.total} SAR
            </div>
            <button class="btn-checkout" onclick="window.checkout()">结账</button>
        `;
    }

    // 结账
    window.checkout = async function() {
        try {
            const order = await window.POSService.createOrder({
                payment_method: document.querySelector('.payment-method')?.value || 'cash'
            });
            
            if (order) {
                alert('订单创建成功!');
                renderCart();
                loadProducts();
            }
        } catch (error) {
            alert('结账失败: ' + error.message);
        }
    };

    // 绑定事件
    function bindEvents() {
        // 搜索
        document.querySelector('.pos-search')?.addEventListener('input', (e) => {
            const keyword = e.target.value;
            window.ProductService.search(keyword, window._currentBranch)
                .then(products => renderProducts(products));
        });
        
        // 客户选择
        document.querySelector('.customer-select')?.addEventListener('change', (e) => {
            window.POSService.setCustomer({ id: e.target.value });
        });
    }

    // 键盘快捷键
    function bindKeyboard() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const search = document.querySelector('.pos-search');
                if (search && document.activeElement === search) {
                    // 搜索
                }
            }
        });
    }

    // 模块加载时初始化
    if (document.querySelector('[data-module="pos"]')) {
        window.initPOS();
    }

})();