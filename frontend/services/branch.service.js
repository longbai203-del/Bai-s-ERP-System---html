/**
 * Branch Service - 分支/门店管理服务
 */

(function() {
    'use strict';

    class BranchService {
        constructor() {
            this.table = 'branches';
        }

        // 获取所有分支
        async getAll(orgId) {
            try {
                let query = window.Supabase.from(this.table).select('*');
                if (orgId) {
                    query = query.eq('organization_id', orgId);
                }
                const { data, error } = await query.order('name');
                    
                if (error) throw error;
                return data;
            } catch (error) {
                console.error('获取分支列表失败:', error);
                return [];
            }
        }

        // 获取单个分支
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
                console.error('获取分支失败:', error);
                return null;
            }
        }

        // 创建分支
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
                console.error('创建分支失败:', error);
                throw error;
            }
        }

        // 更新分支
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
                console.error('更新分支失败:', error);
                throw error;
            }
        }

        // 删除分支
        async delete(id) {
            try {
                const { error } = await window.Supabase
                    .from(this.table)
                    .delete()
                    .eq('id', id);
                    
                if (error) throw error;
                return true;
            } catch (error) {
                console.error('删除分支失败:', error);
                throw error;
            }
        }

        // 获取分支统计
        async getStats(branchId) {
            try {
                const [orders, employees, inventory] = await Promise.all([
                    window.Supabase.from('orders').select('*', { count: 'exact' }).eq('branch_id', branchId),
                    window.Supabase.from('profiles').select('*', { count: 'exact' }).eq('branch_id', branchId),
                    window.Supabase.from('inventory').select('*', { count: 'exact' }).eq('branch_id', branchId)
                ]);
                
                return {
                    orders: orders.count || 0,
                    employees: employees.count || 0,
                    inventory: inventory.count || 0
                };
            } catch (error) {
                console.error('获取分支统计失败:', error);
                return { orders: 0, employees: 0, inventory: 0 };
            }
        }
    }

    window.BranchService = new BranchService();

})();