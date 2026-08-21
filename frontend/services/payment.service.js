/**
 * Payment Service - 支付管理服务
 */

(function() {
    'use strict';

    class PaymentService {
        constructor() {
            this.table = 'payments';
        }

        // 获取所有支付记录
        async getAll(filters = {}) {
            try {
                let query = window.Supabase.from(this.table).select('*, orders(order_number, total)');
                
                if (filters.order_id) {
                    query = query.eq('order_id', filters.order_id);
                }
                if (filters.status) {
                    query = query.eq('status', filters.status);
                }
                if (filters.payment_method) {
                    query = query.eq('payment_method', filters.payment_method);
                }
                if (filters.date_from) {
                    query = query.gte('created_at', filters.date_from);
                }
                if (filters.date_to) {
                    query = query.lte('created_at', filters.date_to);
                }
                
                const { data, error } = await query.order('created_at', { ascending: false });
                    
                if (error) throw error;
                return data;
            } catch (error) {
                console.error('获取支付记录失败:', error);
                return [];
            }
        }

        // 获取单个支付记录
        async getById(id) {
            try {
                const { data, error } = await window.Supabase
                    .from(this.table)
                    .select('*, orders(*)')
                    .eq('id', id)
                    .single();
                    
                if (error) throw error;
                return data;
            } catch (error) {
                console.error('获取支付记录失败:', error);
                return null;
            }
        }

        // 创建支付记录
        async create(data) {
            try {
                const { data: result, error } = await window.Supabase
                    .from(this.table)
                    .insert([{
                        ...data,
                        transaction_id: await this.generateTransactionId(),
                        status: 'pending',
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString()
                    }])
                    .select()
                    .single();
                    
                if (error) throw error;
                
                // 更新订单支付状态
                if (data.order_id) {
                    await this.updateOrderPaymentStatus(data.order_id);
                }
                
                return result;
            } catch (error) {
                console.error('创建支付记录失败:', error);
                throw error;
            }
        }

        // 更新支付状态
        async updateStatus(id, status, reference = null) {
            try {
                const { data, error } = await window.Supabase
                    .from(this.table)
                    .update({
                        status: status,
                        reference: reference,
                        updated_at: new Date().toISOString()
                    })
                    .eq('id', id)
                    .select()
                    .single();
                    
                if (error) throw error;
                
                // 更新订单支付状态
                if (data.order_id) {
                    await this.updateOrderPaymentStatus(data.order_id);
                }
                
                return data;
            } catch (error) {
                console.error('更新支付状态失败:', error);
                throw error;
            }
        }

        // 更新订单支付状态
        async updateOrderPaymentStatus(orderId) {
            try {
                const payments = await window.Supabase
                    .from(this.table)
                    .select('status')
                    .eq('order_id', orderId);
                    
                if (payments.error) throw payments.error;
                
                const totalPaid = payments.data.filter(p => p.status === 'completed').length;
                const totalPending = payments.data.filter(p => p.status === 'pending').length;
                
                let paymentStatus = 'unpaid';
                if (totalPaid > 0 && totalPending === 0) {
                    paymentStatus = 'paid';
                } else if (totalPaid > 0) {
                    paymentStatus = 'partial';
                }
                
                await window.Supabase
                    .from('orders')
                    .update({
                        payment_status: paymentStatus,
                        updated_at: new Date().toISOString()
                    })
                    .eq('id', orderId);
                    
                return paymentStatus;
            } catch (error) {
                console.error('更新订单支付状态失败:', error);
                return null;
            }
        }

        // 生成交易号
        async generateTransactionId() {
            const prefix = 'TXN';
            const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
            const { data, error } = await window.Supabase
                .from(this.table)
                .select('transaction_id')
                .like('transaction_id', `${prefix}${date}%`)
                .order('transaction_id', { ascending: false })
                .limit(1);
                
            if (error || !data || data.length === 0) {
                return `${prefix}${date}0001`;
            }
            
            const lastId = data[0].transaction_id;
            const num = parseInt(lastId.slice(-4)) + 1;
            return `${prefix}${date}${String(num).padStart(4, '0')}`;
        }

        // 获取支付统计
        async getStats(filters = {}) {
            try {
                let query = window.Supabase.from(this.table).select('*');
                
                if (filters.date_from) {
                    query = query.gte('created_at', filters.date_from);
                }
                if (filters.date_to) {
                    query = query.lte('created_at', filters.date_to);
                }
                
                const { data, error } = await query;
                if (error) throw error;
                
                const total = data.length;
                const totalAmount = data.reduce((sum, item) => sum + (item.amount || 0), 0);
                const completed = data.filter(item => item.status === 'completed').length;
                
                // 按支付方式统计
                const byMethod = {};
                for (const item of data) {
                    if (item.payment_method) {
                        byMethod[item.payment_method] = (byMethod[item.payment_method] || 0) + (item.amount || 0);
                    }
                }
                
                return {
                    total,
                    totalAmount,
                    completed,
                    byMethod
                };
            } catch (error) {
                console.error('获取支付统计失败:', error);
                return { total: 0, totalAmount: 0, completed: 0, byMethod: {} };
            }
        }
    }

    window.PaymentService = new PaymentService();

})();