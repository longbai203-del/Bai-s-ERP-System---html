/**
 * Employee Service - 员工管理服务
 */

(function() {
    'use strict';

    class EmployeeService {
        constructor() {
            this.table = 'profiles';
        }

        // 获取所有员工
        async getAll(filters = {}) {
            try {
                let query = window.Supabase.from(this.table).select('*');
                
                if (filters.branch_id) {
                    query = query.eq('branch_id', filters.branch_id);
                }
                if (filters.organization_id) {
                    query = query.eq('organization_id', filters.organization_id);
                }
                if (filters.role) {
                    query = query.eq('role', filters.role);
                }
                if (filters.status) {
                    query = query.eq('status', filters.status);
                }
                if (filters.search) {
                    query = query.or(`full_name.ilike.%${filters.search}%,email.ilike.%${filters.search}%,phone.ilike.%${filters.search}%`);
                }
                
                const { data, error } = await query.order('full_name');
                    
                if (error) throw error;
                return data;
            } catch (error) {
                console.error('获取员工列表失败:', error);
                return [];
            }
        }

        // 获取单个员工
        async getById(id) {
            try {
                const { data, error } = await window.Supabase
                    .from(this.table)
                    .select('*, branches(name), attendances(*), payrolls(*)')
                    .eq('id', id)
                    .single();
                    
                if (error) throw error;
                return data;
            } catch (error) {
                console.error('获取员工失败:', error);
                return null;
            }
        }

        // 创建员工
        async create(data) {
            try {
                const { data: result, error } = await window.Supabase
                    .from(this.table)
                    .insert([{
                        ...data,
                        employee_code: await this.generateCode(),
                        status: 'active',
                        hire_date: data.hire_date || new Date().toISOString(),
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString()
                    }])
                    .select()
                    .single();
                    
                if (error) throw error;
                return result;
            } catch (error) {
                console.error('创建员工失败:', error);
                throw error;
            }
        }

        // 更新员工
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
                console.error('更新员工失败:', error);
                throw error;
            }
        }

        // 删除员工
        async delete(id) {
            try {
                const { error } = await window.Supabase
                    .from(this.table)
                    .delete()
                    .eq('id', id);
                    
                if (error) throw error;
                return true;
            } catch (error) {
                console.error('删除员工失败:', error);
                throw error;
            }
        }

        // 生成员工编码
        async generateCode() {
            const prefix = 'EMP';
            const { data, error } = await window.Supabase
                .from(this.table)
                .select('employee_code')
                .order('employee_code', { ascending: false })
                .limit(1);
                
            if (error || !data || data.length === 0) {
                return `${prefix}0001`;
            }
            
            const lastCode = data[0].employee_code;
            const num = parseInt(lastCode.replace(prefix, '')) + 1;
            return `${prefix}${String(num).padStart(4, '0')}`;
        }

        // 获取员工统计
        async getStats(orgId) {
            try {
                let query = window.Supabase.from(this.table).select('*');
                if (orgId) {
                    query = query.eq('organization_id', orgId);
                }
                
                const { data, error } = await query;
                if (error) throw error;
                
                const total = data.length;
                const active = data.filter(item => item.status === 'active').length;
                
                // 按角色统计
                const byRole = {};
                for (const item of data) {
                    if (item.role) {
                        byRole[item.role] = (byRole[item.role] || 0) + 1;
                    }
                }
                
                return {
                    total,
                    active,
                    byRole
                };
            } catch (error) {
                console.error('获取员工统计失败:', error);
                return { total: 0, active: 0, byRole: {} };
            }
        }
    }

    window.EmployeeService = new EmployeeService();

})();