/**
 * POS Service - 销售点服务
 */

(function() {
    'use strict';

    class POSService {
        constructor() {
            this.cart = [];
            this.customer = null;
            this.discount = 0;
            this.tax = 0;
        }

        // 初始化POS
        init(branchId) {
            this.branchId = branchId;
            this.cart = [];
            this.customer = null;
            this.discount = 0;
            this.tax = 0;
            return this;
        }

        // 添加商品到购物车
        addItem(product, quantity = 1) {
            const existing = this.cart.find(item => item.product_id === product.id);
            
            if (existing) {
                existing.quantity += quantity;
                existing.total = existing.quantity * existing.price;
            } else {
                this.cart.push({
                    product_id: product.id,
                    name: product.name,
                    sku: product.sku,
                    price: product.price || 0,
                    quantity: quantity,
                    total: (product.price || 0) * quantity,
                    inventory: product.inventory?.quantity || 0
                });
            }
            
            return this.getCart();
        }

        // 更新商品数量
        updateItem(productId, quantity) {
            const item = this.cart.find(item => item.product_id === productId);
            if (item) {
                if (quantity <= 0) {
                    this.removeItem(productId);
                } else {
                    item.quantity = quantity;
                    item.total = quantity * item.price;
                }
            }
            return this.getCart();
        }

        // 移除商品
        removeItem(productId) {
            this.cart = this.cart.filter(item => item.product_id !== productId);
            return this.getCart();
        }

        // 清空购物车
        clearCart() {
            this.cart = [];
            this.customer = null;
            this.discount = 0;
            this.tax = 0;
            return this.getCart();
        }

        // 设置客户
        setCustomer(customer) {
            this.customer = customer;
            return this;
        }

        // 设置折扣
        setDiscount(amount) {
            this.discount = amount;
            return this;
        }

        // 设置税率
        setTax(rate) {
            this.tax = rate;
            return this;
        }

        // 获取购物车
        getCart() {
            const subtotal = this.cart.reduce((sum, item) => sum + item.total, 0);
            const discountAmount = Math.min(subtotal, this.discount);
            const taxAmount = (subtotal - discountAmount) * (this.tax / 100);
            
            return {
                items: this.cart,
                subtotal: subtotal,
                discount: discountAmount,
                tax: taxAmount,
                total: subtotal - discountAmount + taxAmount,
                itemCount: this.cart.reduce((sum, item) => sum + item.quantity, 0),
                customer: this.customer
            };
        }

        // 创建订单
        async createOrder(data) {
            try {
                const cart = this.getCart();
                
                const orderData = {
                    branch_id: this.branchId,
                    customer_id: this.customer?.id || null,
                    order_number: await this.generateOrderNumber(),
                    items: cart.items,
                    subtotal: cart.subtotal,
                    discount: cart.discount,
                    tax: cart.tax,
                    total: cart.total,
                    status: 'completed',
                    payment_method: data.payment_method || 'cash',
                    payment_status: data.payment_status || 'paid',
                    notes: data.notes || '',
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                };
                
                // 创建订单
                const { data: result, error } = await window.Supabase
                    .from('orders')
                    .insert([orderData])
                    .select()
                    .single();
                    
                if (error) throw error;
                
                // 创建订单项
                await this.createOrderItems(result.id, cart.items);
                
                // 更新库存
                await this.updateInventory(cart.items);
                
                // 记录支付
                await this.createPayment(result.id, cart.total, data.payment_method);
                
                // 清空购物车
                this.clearCart();
                
                return result;
            } catch (error) {
                console.error('创建订单失败:', error);
                throw error;
            }
        }

        // 创建订单项
        async createOrderItems(orderId, items) {
            try {
                const itemsData = items.map(item => ({
                    order_id: orderId,
                    product_id: item.product_id,
                    quantity: item.quantity,
                    unit_price: item.price,
                    total_price: item.total,
                    created_at: new Date().toISOString()
                }));
                
                const { error } = await window.Supabase
                    .from('order_items')
                    .insert(itemsData);
                    
                if (error) throw error;
                return true;
            } catch (error) {
                console.error('创建订单项失败:', error);
                throw error;
            }
        }

        // 更新库存
        async updateInventory(items) {
            try {
                for (const item of items) {
                    const inventory = await window.Supabase
                        .from('inventory')
                        .select('*')
                        .eq('product_id', item.product_id)
                        .eq('branch_id', this.branchId)
                        .single();
                        
                    if (inventory.data) {
                        await window.Supabase
                            .from('inventory')
                            .update({
                                quantity: inventory.data.quantity - item.quantity,
                                last_updated: new Date().toISOString()
                            })
                            .eq('id', inventory.data.id);
                    }
                }
                return true;
            } catch (error) {
                console.error('更新库存失败:', error);
                throw error;
            }
        }

        // 创建支付记录
        async createPayment(orderId, amount, method) {
            try {
                const { error } = await window.Supabase
                    .from('payments')
                    .insert([{
                        order_id: orderId,
                        amount: amount,
                        payment_method: method,
                        status: 'completed',
                        transaction_id: `TXN-${Date.now()}`,
                        created_at: new Date().toISOString()
                    }]);
                    
                if (error) throw error;
                return true;
            } catch (error) {
                console.error('创建支付记录失败:', error);
                throw error;
            }
        }

        // 生成订单号
        async generateOrderNumber() {
            const prefix = 'ORD';
            const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
            const { data, error } = await window.Supabase
                .from('orders')
                .select('order_number')
                .like('order_number', `${prefix}${date}%`)
                .order('order_number', { ascending: false })
                .limit(1);
                
            if (error || !data || data.length === 0) {
                return `${prefix}${date}0001`;
            }
            
            const lastNumber = data[0].order_number;
            const num = parseInt(lastNumber.slice(-4)) + 1;
            return `${prefix}${date}${String(num).padStart(4, '0')}`;
        }

        // 扫码添加商品
        async scanBarcode(barcode) {
            try {
                const { data, error } = await window.Supabase
                    .from('products')
                    .select('*, inventory!inner(quantity)')
                    .eq('barcode', barcode)
                    .eq('inventory.branch_id', this.branchId)
                    .single();
                    
                if (error) throw error;
                
                if (data) {
                    this.addItem(data);
                    return data;
                }
                return null;
            } catch (error) {
                console.error('扫码失败:', error);
                return null;
            }
        }
    }

    window.POSService = new POSService();

})();