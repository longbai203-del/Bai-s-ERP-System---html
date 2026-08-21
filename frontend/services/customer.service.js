/**
 * Customer Service - 客户管理服务
 */

(function() {
    'use strict';

    class CustomerService {
        constructor() {
            this.table = 'customers';
        }

        // 获取所有客户
        async getAll(filters = {}) {
            try {
                let query = window.Supabase.from(this.table).select('*');
                
                if (filters.branch_id) {
                    query = query.eq('branch_id', filters.branch_id);
                }
                if (filters.organization_id) {
                    query = query.eq('organization_id', filters.organization_id);
                }
                if (filters.search) {
                    query = query.or(`name.ilike.%${filters.search}%,phone.ilike.%${filters.search}%,email.ilike.%${filters.search}%`);
                }
                if (filters.member_type) {
                    query = query.eq('member_type', filters.member_type);
                }
                
                const { data, error } = await query.order('name');
                    
                if (error) throw error;
                return data;
            } catch (error) {
                console.error('获取客户列表失败:', error);
                return [];
            }
        }

        // 获取单个客户
        async getById(id) {
            try {
                const { data, error } = await window.Supabase
                    .from(this.table)
                    .select('*, orders(*), memberships(*)')
                    .eq('id', id)
                    .single();
                    
                if (error) throw error;
                return data;
            } catch (error) {
                console.error('获取客户失败:', error);
                return null;
            }
        }

        // 创建客户
        async create(data) {
            try {
                const { data: result, error } = await window.Supabase
                    .from(this.table)
                    .insert([{
                        ...data,
                        customer_code: await this.generateCode(),
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString()
                    }])
                    .select()
                    .single();
                    
                if (error) throw error;
                return result;
            } catch (error) {
                console.error('创建客户失败:', error);
                throw error;
            }
        }

        // 更新客户
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
                console.error('更新客户失败:', error);
                throw error;
            }
        }

        // 删除客户
        async delete(id) {
            try {
                const { error } = await window.Supabase
                    .from(this.table)
                    .delete()
                    .eq('id', id);
                    
                if (error) throw error;
                return true;
            } catch (error) {
                console.error('删除客户失败:', error);
                throw error;
            }
        }

        // 生成客户编码
        async generateCode() {
            const prefix = 'CUS';
            const { data, error } = await window.Supabase
                .from(this.table)
                .select('customer_code')
                .order('customer_code', { ascending: false })
                .limit(1);
                
            if (error || !data || data.length === 0) {
                return `${prefix}0001`;
            }
            
            const lastCode = data[0].customer_code;
            const num = parseInt(lastCode.replace(prefix, '')) + 1;
            return `${prefix}${String(num).padStart(4, '0')}`;
        }

        // 获取客户统计
        async getStats(filters = {}) {
            try {
                let query = window.Supabase.from(this.table).select('*', { count: 'exact' });
                
                if (filters.branch_id) {
                    query = query.eq('branch_id', filters.branch_id);
                }
                if (filters.organization_id) {
                    query = query.eq('organization_id', filters.organization_id);
                }
                
                const { count, error } = await query;
                if (error) throw error;
                
                return { total: count || 0 };
            } catch (error) {
                console.error('获取客户统计失败:', error);
                return { total: 0 };
            }
        }

        // 搜索客户
        async search(keyword) {
            try {
                const { data, error } = await window.Supabase
                    .from(this.table)
                    .select('*')
                    .or(`name.ilike.%${keyword}%,phone.ilike.%${keyword}%,email.ilike.%${keyword}%,customer_code.ilike.%${keyword}%`)
                    .limit(20);
                    
                if (error) throw error;
                return data;
            } catch (error) {
                console.error('搜索客户失败:', error);
                return [];
            }
        }
    }

    window.CustomerService = new CustomerService();

})();