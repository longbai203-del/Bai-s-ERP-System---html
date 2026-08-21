/**
 * Organization Service - 组织管理服务
 */

(function() {
    'use strict';

    class OrganizationService {
        constructor() {
            this.table = 'organizations';
        }

        // 获取当前组织
        async getCurrent() {
            try {
                const { data, error } = await window.Supabase
                    .from(this.table)
                    .select('*')
                    .eq('is_default', true)
                    .single();
                    
                if (error) throw error;
                return data;
            } catch (error) {
                console.error('获取组织失败:', error);
                return null;
            }
        }

        // 获取所有组织
        async getAll() {
            try {
                const { data, error } = await window.Supabase
                    .from(this.table)
                    .select('*')
                    .order('name');
                    
                if (error) throw error;
                return data;
            } catch (error) {
                console.error('获取组织列表失败:', error);
                return [];
            }
        }

        // 获取单个组织
        async getById(id) {
            try {
                const { data, error } = await window.Supabase
                    .from(this.table)
                    .select('*')
                    .eq('id', id)
                    .single();
                    
                if (error) throw error;
                return data;
            } catch (error) {
                console.error('获取组织失败:', error);
                return null;
            }
        }

        // 创建组织
        async create(data) {
            try {
                const { data: result, error } = await window.Supabase
                    .from(this.table)
                    .insert([{
                        ...data,
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString()
                    }])
                    .select()
                    .single();
                    
                if (error) throw error;
                return result;
            } catch (error) {
                console.error('创建组织失败:', error);
                throw error;
            }
        }

        // 更新组织
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
                console.error('更新组织失败:', error);
                throw error;
            }
        }

        // 删除组织
        async delete(id) {
            try {
                const { error } = await window.Supabase
                    .from(this.table)
                    .delete()
                    .eq('id', id);
                    
                if (error) throw error;
                return true;
            } catch (error) {
                console.error('删除组织失败:', error);
                throw error;
            }
        }

        // 获取组织的分支
        async getBranches(orgId) {
            try {
                const { data, error } = await window.Supabase
                    .from('branches')
                    .select('*')
                    .eq('organization_id', orgId)
                    .order('name');
                    
                if (error) throw error;
                return data;
            } catch (error) {
                console.error('获取分支失败:', error);
                return [];
            }
        }

        // 获取组织统计
        async getStats(orgId) {
            try {
                const [branches, employees, customers] = await Promise.all([
                    window.Supabase.from('branches').select('*', { count: 'exact' }).eq('organization_id', orgId),
                    window.Supabase.from('profiles').select('*', { count: 'exact' }).eq('organization_id', orgId),
                    window.Supabase.from('customers').select('*', { count: 'exact' }).eq('organization_id', orgId)
                ]);
                
                return {
                    branches: branches.count || 0,
                    employees: employees.count || 0,
                    customers: customers.count || 0
                };
            } catch (error) {
                console.error('获取组织统计失败:', error);
                return { branches: 0, employees: 0, customers: 0 };
            }
        }
    }

    window.OrganizationService = new OrganizationService();

})();