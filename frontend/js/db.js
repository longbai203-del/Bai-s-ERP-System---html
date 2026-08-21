// frontend/js/db.js
// 完整统一数据库访问层 (支持全模块)

class Database {
    constructor() {
        this.supabase = window.supabaseClient;
        this.auth = window.authManager;
    }

    // ==========================================================
    // 1. 核心基础操作 (通用)
    // ==========================================================
    async query(table, options = {}) {
        try {
            let query = this.supabase.from(table).select(options.select || '*');
            if (options.eq) { Object.keys(options.eq).forEach(key => { query = query.eq(key, options.eq[key]); }); }
            if (options.in) { Object.keys(options.in).forEach(key => { query = query.in(key, options.in[key]); }); }
            if (options.order) { query = query.order(options.order.column, { ascending: options.order.ascending !== false }); }
            if (options.limit) { query = query.limit(options.limit); }
            if (options.range) { query = query.range(options.range.start, options.range.end); }
            const { data, error } = await query;
            if (error) throw error;
            return { success: true, data };
        } catch (error) { 
            console.error('查询失败:', error); 
            return { success: false, error: error.message }; 
        }
    }

    async insert(table, data) {
        try {
            const { data: result, error } = await this.supabase.from(table).insert(data).select();
            if (error) throw error;
            return { success: true, data: result };
        } catch (error) { 
            console.error('插入失败:', error); 
            return { success: false, error: error.message }; 
        }
    }

    async update(table, data, match) {
        try {
            let query = this.supabase.from(table).update(data);
            if (match) { Object.keys(match).forEach(key => { query = query.eq(key, match[key]); }); }
            const { data: result, error } = await query.select();
            if (error) throw error;
            return { success: true, data: result };
        } catch (error) { 
            console.error('更新失败:', error); 
            return { success: false, error: error.message }; 
        }
    }

    async delete(table, match) {
        try {
            let query = this.supabase.from(table).delete();
            if (match) { Object.keys(match).forEach(key => { query = query.eq(key, match[key]); }); }
            const { error } = await query;
            if (error) throw error;
            return { success: true };
        } catch (error) { 
            console.error('删除失败:', error); 
            return { success: false, error: error.message }; 
        }
    }

    // 快捷方法
    async create(table, data) { return this.insert(table, data); }
    async updateById(table, id, data) { return this.update(table, data, { id }); }
    async deleteById(table, id) { return this.delete(table, { id }); }

    // ==========================================================
    // 2. 客户管理
    // ==========================================================
    async getCustomers(filters = {}) {
        if (filters.search) {
            try {
                const { data, error } = await this.supabase
                    .from('customers')
                    .select('*')
                    .or(`full_name.ilike.%${filters.search}%,phone.ilike.%${filters.search}%,customer_code.ilike.%${filters.search}%`)
                    .eq('organization_id', filters.organization_id || this.auth.userProfile?.organization_id);
                if (error) throw error;
                return { success: true, data };
            } catch (error) { 
                console.error('搜索客户失败:', error); 
                return { success: false, error: error.message }; 
            }
        }
        return this.query('customers', { eq: { organization_id: filters.organization_id || this.auth.userProfile?.organization_id } });
    }
    async createCustomer(customerData) {
        const data = { ...customerData, organization_id: customerData.organization_id || this.auth.userProfile?.organization_id };
        return this.insert('customers', data);
    }

    // ==========================================================
    // 3. 产品与库存管理
    // ==========================================================
    async getProducts(filters = {}) {
        if (filters.search) {
            try {
                const { data, error } = await this.supabase
                    .from('products')
                    .select('*')
                    .or(`name.ilike.%${filters.search}%,product_code.ilike.%${filters.search}%,barcode.ilike.%${filters.search}%`)
                    .eq('organization_id', filters.organization_id || this.auth.userProfile?.organization_id);
                if (error) throw error;
                return { success: true, data };
            } catch (error) { 
                console.error('搜索产品失败:', error); 
                return { success: false, error: error.message }; 
            }
        }
        return this.query('products', { eq: { organization_id: filters.organization_id || this.auth.userProfile?.organization_id } });
    }

    async getInventory(filters = {}) {
        let query = this.supabase.from('inventory').select('*, products(*)');
        if (filters.product_id) query = query.eq('product_id', filters.product_id);
        if (filters.branch_id) query = query.eq('branch_id', filters.branch_id);
        if (filters.organization_id) query = query.eq('products.organization_id', filters.organization_id);
        const { data, error } = await query;
        if (error) throw error;
        return { success: true, data };
    }

    // ==========================================================
    // 4. 订单与 POS
    // ==========================================================
    async createOrder(orderData, items) {
        try {
            const { data: order, error: orderError } = await this.supabase
                .from('orders').insert([{ ...orderData, organization_id: orderData.organization_id || this.auth.userProfile?.organization_id }]).select();
            if (orderError) throw orderError;
            if (items && items.length > 0) {
                const orderItems = items.map(item => ({ ...item, order_id: order[0].id }));
                const { error: itemsError } = await this.supabase.from('order_items').insert(orderItems);
                if (itemsError) throw itemsError;
            }
            return { success: true, data: order[0] };
        } catch (error) { 
            console.error('创建订单失败:', error); 
            return { success: false, error: error.message }; 
        }
    }

    async getOrders(filters = {}) {
        const options = { eq: {}, order: { column: 'created_at', ascending: false } };
        if (filters.organization_id) options.eq.organization_id = filters.organization_id;
        if (filters.branch_id) options.eq.branch_id = filters.branch_id;
        if (filters.customer_id) options.eq.customer_id = filters.customer_id;
        if (filters.status) options.eq.status = filters.status;
        return this.query('orders', options);
    }

    // ==========================================================
    // 5. 采购管理
    // ==========================================================
    async getSuppliers(filters = {}) {
        return this.query('suppliers', { eq: { organization_id: filters.organization_id || this.auth.userProfile?.organization_id } });
    }

    async createPurchaseOrder(poData, items) {
        try {
            const { data: po, error: poError } = await this.supabase
                .from('purchase_orders').insert([{ ...poData, organization_id: poData.organization_id || this.auth.userProfile?.organization_id }]).select();
            if (poError) throw poError;
            if (items && items.length > 0) {
                const poItems = items.map(item => ({ ...item, purchase_order_id: po[0].id }));
                const { error: itemsError } = await this.supabase.from('purchase_order_items').insert(poItems);
                if (itemsError) throw itemsError;
            }
            return { success: true, data: po[0] };
        } catch (error) { 
            console.error('创建采购订单失败:', error); 
            return { success: false, error: error.message }; 
        }
    }

    // ==========================================================
    // 6. 财务管理
    // ==========================================================
    async getFinancialTransactions(filters = {}) {
        return this.query('financial_transactions', { eq: { organization_id: filters.organization_id || this.auth.userProfile?.organization_id }, order: { column: 'created_at', ascending: false } });
    }

    // ==========================================================
    // 7. 人力资源管理
    // ==========================================================
    async getEmployees(filters = {}) {
        return this.query('employees', { eq: { organization_id: filters.organization_id || this.auth.userProfile?.organization_id } });
    }

    // ==========================================================
    // 8. SaaS 订阅
    // ==========================================================
    async getSubscriptions(filters = {}) {
        return this.query('subscriptions', { eq: { organization_id: filters.organization_id || this.auth.userProfile?.organization_id } });
    }

    // ==========================================================
    // 9. 系统设置与审计
    // ==========================================================
    async getAuditLogs() {
        return this.query('audit_logs', { order: { column: 'created_at', ascending: false } });
    }

    // ==========================================================
    // 10. 统计看板
    // ==========================================================
    async getDashboardStats(organizationId) {
        try {
            const orgId = organizationId || this.auth.userProfile?.organization_id;
            const { count: totalCustomers } = await this.supabase.from('customers').select('*', { count: 'exact', head: true }).eq('organization_id', orgId);
            const { count: totalProducts } = await this.supabase.from('products').select('*', { count: 'exact', head: true }).eq('organization_id', orgId);
            const today = new Date().toISOString().split('T')[0];
            const { count: todayOrders } = await this.supabase.from('orders').select('*', { count: 'exact', head: true }).eq('organization_id', orgId).gte('created_at', today);
            const firstDay = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString();
            const { data: orders } = await this.supabase.from('orders').select('total').eq('organization_id', orgId).eq('status', 'completed').gte('created_at', firstDay);
            const totalRevenue = orders ? orders.reduce((sum, order) => sum + (order.total || 0), 0) : 0;
            return { success: true, data: { totalCustomers: totalCustomers || 0, totalProducts: totalProducts || 0, todayOrders: todayOrders || 0, totalRevenue: totalRevenue } };
        } catch (error) { 
            console.error('获取统计数据失败:', error); 
            return { success: false, error: error.message }; 
        }
    }
}

const db = new Database();
window.db = db;

console.log('✅ 数据库模块初始化完成 (全模块支持版)');