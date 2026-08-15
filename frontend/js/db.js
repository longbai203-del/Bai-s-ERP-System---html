// frontend/js/db.js
// 统一数据库访问层

class Database {
    constructor() {
        this.supabase = window.supabaseClient;
        this.auth = window.authManager;
    }

    async query(table, options = {}) {
        try {
            let query = this.supabase.from(table).select(options.select || '*');
            
            if (options.eq) {
                Object.keys(options.eq).forEach(key => {
                    query = query.eq(key, options.eq[key]);
                });
            }
            
            if (options.in) {
                Object.keys(options.in).forEach(key => {
                    query = query.in(key, options.in[key]);
                });
            }
            
            if (options.order) {
                query = query.order(options.order.column, { ascending: options.order.ascending !== false });
            }
            
            if (options.limit) {
                query = query.limit(options.limit);
            }
            
            if (options.range) {
                query = query.range(options.range.start, options.range.end);
            }
            
            const { data, error } = await query;
            if (error) throw error;
            
            return { success: true, data };
        } catch (error) {
            console.error(查询  失败:, error);
            return { success: false, error: error.message };
        }
    }

    async insert(table, data) {
        try {
            const { data: result, error } = await this.supabase
                .from(table)
                .insert(data)
                .select();
            
            if (error) throw error;
            return { success: true, data: result };
        } catch (error) {
            console.error(插入  失败:, error);
            return { success: false, error: error.message };
        }
    }

    async update(table, data, match) {
        try {
            let query = this.supabase.from(table).update(data);
            
            if (match) {
                Object.keys(match).forEach(key => {
                    query = query.eq(key, match[key]);
                });
            }
            
            const { data: result, error } = await query.select();
            if (error) throw error;
            
            return { success: true, data: result };
        } catch (error) {
            console.error(更新  失败:, error);
            return { success: false, error: error.message };
        }
    }

    async delete(table, match) {
        try {
            let query = this.supabase.from(table).delete();
            
            if (match) {
                Object.keys(match).forEach(key => {
                    query = query.eq(key, match[key]);
                });
            }
            
            const { error } = await query;
            if (error) throw error;
            
            return { success: true };
        } catch (error) {
            console.error(删除  失败:, error);
            return { success: false, error: error.message };
        }
    }

    async getCustomers(filters = {}) {
        const options = {
            select: '*',
            eq: {}
        };
        
        if (filters.organization_id) {
            options.eq.organization_id = filters.organization_id;
        }
        
        if (filters.branch_id) {
            options.eq.branch_id = filters.branch_id;
        }
        
        if (filters.status) {
            options.eq.status = filters.status;
        }
        
        if (filters.search) {
            try {
                const { data, error } = await this.supabase
                    .from('customers')
                    .select('*')
                    .or(ull_name.ilike.%%,phone.ilike.%%,customer_code.ilike.%%)
                    .eq('organization_id', filters.organization_id || this.auth.userProfile?.organization_id);
                
                if (error) throw error;
                return { success: true, data };
            } catch (error) {
                console.error('搜索客户失败:', error);
                return { success: false, error: error.message };
            }
        }
        
        return this.query('customers', options);
    }

    async createCustomer(customerData) {
        const data = {
            ...customerData,
            organization_id: customerData.organization_id || this.auth.userProfile?.organization_id,
            created_by: this.auth.currentUser?.id
        };
        return this.insert('customers', data);
    }

    async getProducts(filters = {}) {
        const options = {
            select: '*',
            eq: {}
        };
        
        if (filters.organization_id) {
            options.eq.organization_id = filters.organization_id;
        }
        
        if (filters.category_id) {
            options.eq.category_id = filters.category_id;
        }
        
        if (filters.status) {
            options.eq.status = filters.status;
        }
        
        if (filters.search) {
            try {
                const { data, error } = await this.supabase
                    .from('products')
                    .select('*')
                    .or(
ame.ilike.%%,product_code.ilike.%%,barcode.ilike.%%)
                    .eq('organization_id', filters.organization_id || this.auth.userProfile?.organization_id);
                
                if (error) throw error;
                return { success: true, data };
            } catch (error) {
                console.error('搜索产品失败:', error);
                return { success: false, error: error.message };
            }
        }
        
        return this.query('products', options);
    }

    async getInventory(filters = {}) {
        try {
            let query = this.supabase
                .from('inventory')
                .select('*, products(*), branches(*)');
            
            if (filters.product_id) {
                query = query.eq('product_id', filters.product_id);
            }
            
            if (filters.branch_id) {
                query = query.eq('branch_id', filters.branch_id);
            }
            
            if (filters.organization_id) {
                query = query.eq('products.organization_id', filters.organization_id);
            }
            
            const { data, error } = await query;
            if (error) throw error;
            
            return { success: true, data };
        } catch (error) {
            console.error('获取库存失败:', error);
            return { success: false, error: error.message };
        }
    }

    async createOrder(orderData, items) {
        try {
            const { data: order, error: orderError } = await this.supabase
                .from('orders')
                .insert([{
                    ...orderData,
                    organization_id: orderData.organization_id || this.auth.userProfile?.organization_id,
                    created_by: this.auth.currentUser?.id
                }])
                .select();
            
            if (orderError) throw orderError;
            
            if (items && items.length > 0) {
                const orderItems = items.map(item => ({
                    ...item,
                    order_id: order[0].id
                }));
                
                const { error: itemsError } = await this.supabase
                    .from('order_items')
                    .insert(orderItems);
                
                if (itemsError) throw itemsError;
            }
            
            return { success: true, data: order[0] };
        } catch (error) {
            console.error('创建订单失败:', error);
            return { success: false, error: error.message };
        }
    }

    async getOrders(filters = {}) {
        const options = {
            select: '*',
            eq: {},
            order: { column: 'created_at', ascending: false }
        };
        
        if (filters.organization_id) {
            options.eq.organization_id = filters.organization_id;
        }
        
        if (filters.branch_id) {
            options.eq.branch_id = filters.branch_id;
        }
        
        if (filters.customer_id) {
            options.eq.customer_id = filters.customer_id;
        }
        
        if (filters.status) {
            options.eq.status = filters.status;
        }
        
        return this.query('orders', options);
    }

    async getDashboardStats(organizationId) {
        try {
            const orgId = organizationId || this.auth.userProfile?.organization_id;
            
            const { count: totalCustomers } = await this.supabase
                .from('customers')
                .select('*', { count: 'exact', head: true })
                .eq('organization_id', orgId);
            
            const { count: totalProducts } = await this.supabase
                .from('products')
                .select('*', { count: 'exact', head: true })
                .eq('organization_id', orgId);
            
            const today = new Date().toISOString().split('T')[0];
            const { count: todayOrders } = await this.supabase
                .from('orders')
                .select('*', { count: 'exact', head: true })
                .eq('organization_id', orgId)
                .gte('created_at', today);
            
            const firstDay = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString();
            const { data: orders } = await this.supabase
                .from('orders')
                .select('total')
                .eq('organization_id', orgId)
                .eq('status', 'completed')
                .gte('created_at', firstDay);
            
            const totalRevenue = orders ? orders.reduce((sum, order) => sum + (order.total || 0), 0) : 0;
            
            return {
                success: true,
                data: {
                    totalCustomers: totalCustomers || 0,
                    totalProducts: totalProducts || 0,
                    todayOrders: todayOrders || 0,
                    totalRevenue: totalRevenue
                }
            };
        } catch (error) {
            console.error('获取统计数据失败:', error);
            return { success: false, error: error.message };
        }
    }
}

const db = new Database();
window.db = db;

console.log('✅ 数据库模块初始化完成');
