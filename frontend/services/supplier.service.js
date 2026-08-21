/**
 * Supplier Service - 供应商管理服务
 */

(function() {
    'use strict';

    class SupplierService {
        constructor() {
            this.table = 'suppliers';
        }

        // 获取所有供应商
        async getAll(filters = {}) {
            try {
                let query = window.Supabase.from(this.table).select('*');
                
                if (filters.organization_id) {
                    query = query.eq('organization_id', filters.organization_id);
                }
                if (filters.status) {
                    query = query.eq('status', filters.status);
                }
                if (filters.search) {
                    query = query.or(`name.ilike.%${filters.search}%,contact_person.ilike.%${filters.search}%,phone.ilike.%${filters.search}%`);
                }
                
                const { data, error } = await query.order('name');
                    
                if (error) throw error;
                return data;
            } catch (error) {
                console.error('获取供应商列表失败:', error);
                return [];
            }
        }

        // 获取单个供应商
        async getById(id) {
            try {
                const { data, error } = await window.Supabase
                    .from(this.table)
                    .select('*, purchases(*)')
                    .eq('id', id)
                    .single();
                    
                if (error) throw error;
                return data;
            } catch (error) {
                console.error('获取供应商失败:', error);
                return null;
            }
        }

        // 创建供应商
        async create(data) {
            try {
                const { data: result, error } = await window.Supabase
                    .from(this.table)
                    .insert([{
                        ...data,
                        supplier_code: await this.generateCode(),
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString()
                    }])
                    .select()
                    .single();
                    
                if (error) throw error;
                return result;
            } catch (error) {
                console.error('创建供应商失败:', error);
                throw error;
            }
        }

        // 更新供应商
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
                console.error('更新供应商失败:', error);
                throw error;
            }
        }

        // 删除供应商
        async delete(id) {
            try {
                // 检查是否有采购单
                const purchases = await window.Supabase
                    .from('purchases')
                    .select('id')
                    .eq('supplier_id', id)
                    .limit(1);
                    
                if (purchases.data && purchases.data.length > 0) {
                    throw new Error('该供应商有关联采购单，无法删除');
                }
                
                const { error } = await window.Supabase
                    .from(this.table)
                    .delete()
                    .eq('id', id);
                    
                if (error) throw error;
                return true;
            } catch (error) {
                console.error('删除供应商失败:', error);
                throw error;
            }
        }

        // 生成供应商编码
        async generateCode() {
            const prefix = 'SUP';
            const { data, error } = await window.Supabase
                .from(this.table)
                .select('supplier_code')
                .order('supplier_code', { ascending: false })
                .limit(1);
                
            if (error || !data || data.length === 0) {
                return `${prefix}0001`;
            }
            
            const lastCode = data[0].supplier_code;
            const num = parseInt(lastCode.replace(prefix, '')) + 1;
            return `${prefix}${String(num).padStart(4, '0')}`;
        }

        // 获取供应商统计
        async getStats(orgId) {
            try {
                let query = window.Supabase.from(this.table).select('*', { count: 'exact' });
                if (orgId) {
                    query = query.eq('organization_id', orgId);
                }
                
                const { count, error } = await query;
                if (error) throw error;
                
                return { total: count || 0 };
            } catch (error) {
                console.error('获取供应商统计失败:', error);
                return { total: 0 };
            }
        }
    }

    window.SupplierService = new SupplierService();

})();