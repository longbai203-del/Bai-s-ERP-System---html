/**
 * Order Service - 订单管理服务
 */

(function() {
    'use strict';

    class OrderService {
        constructor() {
            this.table = 'orders';
        }

        // 获取所有订单
        async getAll(filters = {}) {
            try {
                let query = window.Supabase.from(this.table).select('*, customers(name, phone), branches(name)');
                
                if (filters.branch_id) {
                    query = query.eq('branch_id', filters.branch_id);
                }
                if (filters.organization_id) {
                    query = query.eq('organization_id', filters.organization_id);
                }
                if (filters.customer_id) {
                    query = query.eq('customer_id', filters.customer_id);
                }
                if (filters.status) {
                    query = query.eq('status', filters.status);
                }
                if (filters.payment_status) {
                    query = query.eq('payment_status', filters.payment_status);
                }
                if (filters.date_from) {
                    query = query.gte('created_at', filters.date_from);
                }
                if (filters.date_to) {
                    query = query.lte('created_at', filters.date_to);
                }
                if (filters.search) {
                    query = query.ilike('order_number', `%${filters.search}%`);
                }
                
                const { data, error } = await query
                    .order('created_at', { ascending: false })
                    .range(filters.offset || 0, (filters.offset || 0) + (filters.limit || 100) - 1);
                    
                if (error) throw error;
                return data;
            } catch (error) {
                console.error('获取订单列表失败:', error);
                return [];
            }
        }

        // 获取单个订单
        async getById(id) {
            try {
                const { data, error } = await window.Supabase
                    .from(this.table)
                    .select('*, customers(*), branches(*), order_items(*, products(name, sku))')
                    .eq('id', id)
                    .single();
                    
                if (error) throw error;
                return data;
            } catch (error) {
                console.error('获取订单失败:', error);
                return null;
            }
        }

        // 创建订单
        async create(data) {
            try {
                const { data: result, error } = await window.Supabase
                    .from(this.table)
                    .insert([{
                        ...data,
                        order_number: await this.generateNumber(),
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString()
                    }])
                    .select()
                    .single();
                    
                if (error) throw error;
                return result;
            } catch (error) {
                console.error('创建订单失败:', error);
                throw error;
            }
        }

        // 更新订单
        async update(id, data) {
            try {
                const { data: result, error } = await window.Supabase
                    .from(this.table)
                    .update({
                        ...data,
                        updated_at: new Date().toISOString()
                    })
                    .eq('id', id)
                    .select()
                    .single();
                    
                if (error) throw error;
                return result;
            } catch (error) {
                console.error('更新订单失败:', error);
                throw error;
            }
        }

        // 更新订单状态
        async updateStatus(id, status) {
            try {
                const { data, error } = await window.Supabase
                    .from(this.table)
                    .update({
                        status: status,
                        updated_at: new Date().toISOString()
                    })
                    .eq('id', id)
                    .select()
                    .single();
                    
                if (error) throw error;
                return data;
            } catch (error) {
                console.error('更新订单状态失败:', error);
                throw error;
            }
        }

        // 取消订单
        async cancel(id, reason) {
            try {
                const order = await this.getById(id);
                if (!order) throw new Error('订单不存在');
                
                if (order.status === 'completed') {
                    throw new Error('已完成订单无法取消');
                }
                
                // 恢复库存
                await this.restoreInventory(order);
                
                const { data, error } = await window.Supabase
                    .from(this.table)
                    .update({
                        status: 'cancelled',
                        cancel_reason: reason,
                        cancelled_at: new Date().toISOString(),
                        updated_at: new Date().toISOString()
                    })
                    .eq('id', id)
                    .select()
                    .single();
                    
                if (error) throw error;
                return data;
            } catch (error) {
                console.error('取消订单失败:', error);
                throw error;
            }
        }

        // 恢复库存（取消订单时）
        async restoreInventory(order) {
            try {
                for (const item of order.order_items || []) {
                    const inventory = await window.Supabase
                        .from('inventory')
                        .select('*')
                        .eq('product_id', item.product_id)
                        .eq('branch_id', order.branch_id)
                        .single();
                        
                    if (inventory.data) {
                        await window.Supabase
                            .from('inventory')
                            .update({
                                quantity: inventory.data.quantity + item.quantity,
                                last_updated: new Date().toISOString()
                            })
                            .eq('id', inventory.data.id);
                    }
                }
                return true;
            } catch (error) {
                console.error('恢复库存失败:', error);
                throw error;
            }
        }

        // 生成订单号
        async generateNumber() {
            const prefix = 'ORD';
            const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
            const { data, error } = await window.Supabase
                .from(this.table)
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

        // 获取订单统计
        async getStats(filters = {}) {
            try {
                let query = window.Supabase.from(this.table).select('*');
                
                if (filters.branch_id) {
                    query = query.eq('branch_id', filters.branch_id);
                }
                if (filters.organization_id) {
                    query = query.eq('organization_id', filters.organization_id);
                }
                if (filters.date_from) {
                    query = query.gte('created_at', filters.date_from);
                }
                if (filters.date_to) {
                    query = query.lte('created_at', filters.date_to);
                }
                
                const { data, error } = await query;
                if (error) throw error;
                
                const total = data.length;
                const totalAmount = data.reduce((sum, item) => sum + (item.total || 0), 0);
                const completed = data.filter(item => item.status === 'completed').length;
                const pending = data.filter(item => item.status === 'pending').length;
                const cancelled = data.filter(item => item.status === 'cancelled').length;
                
                return {
                    total,
                    totalAmount,
                    completed,
                    pending,
                    cancelled
                };
            } catch (error) {
                console.error('获取订单统计失败:', error);
                return { total: 0, totalAmount: 0, completed: 0, pending: 0, cancelled: 0 };
            }
        }

        // 获取今日订单
        async getToday(branchId) {
            const today = new Date().toISOString().slice(0, 10);
            return this.getAll({
                branch_id: branchId,
                date_from: `${today}T00:00:00`,
                date_to: `${today}T23:59:59`
            });
        }
    }

    window.OrderService = new OrderService();

})();