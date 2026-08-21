/**
 * Vehicle Service - 车辆管理服务
 */

(function() {
    'use strict';

    class VehicleService {
        constructor() {
            this.table = 'vehicles';
        }

        // 获取所有车辆
        async getAll(filters = {}) {
            try {
                let query = window.Supabase.from(this.table).select('*');
                
                if (filters.branch_id) {
                    query = query.eq('branch_id', filters.branch_id);
                }
                if (filters.organization_id) {
                    query = query.eq('organization_id', filters.organization_id);
                }
                if (filters.status) {
                    query = query.eq('status', filters.status);
                }
                if (filters.search) {
                    query = query.or(`plate_number.ilike.%${filters.search}%,brand.ilike.%${filters.search}%,model.ilike.%${filters.search}%`);
                }
                
                const { data, error } = await query.order('created_at', { ascending: false });
                    
                if (error) throw error;
                return data;
            } catch (error) {
                console.error('获取车辆列表失败:', error);
                return [];
            }
        }

        // 获取单个车辆
        async getById(id) {
            try {
                const { data, error } = await window.Supabase
                    .from(this.table)
                    .select('*, customers(name, phone)')
                    .eq('id', id)
                    .single();
                    
                if (error) throw error;
                return data;
            } catch (error) {
                console.error('获取车辆失败:', error);
                return null;
            }
        }

        // 创建车辆
        async create(data) {
            try {
                const { data: result, error } = await window.Supabase
                    .from(this.table)
                    .insert([{
                        ...data,
                        vehicle_code: await this.generateCode(),
                        status: data.status || 'active',
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString()
                    }])
                    .select()
                    .single();
                    
                if (error) throw error;
                return result;
            } catch (error) {
                console.error('创建车辆失败:', error);
                throw error;
            }
        }

        // 更新车辆
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
                console.error('更新车辆失败:', error);
                throw error;
            }
        }

        // 删除车辆
        async delete(id) {
            try {
                const { error } = await window.Supabase
                    .from(this.table)
                    .delete()
                    .eq('id', id);
                    
                if (error) throw error;
                return true;
            } catch (error) {
                console.error('删除车辆失败:', error);
                throw error;
            }
        }

        // 生成车辆编码
        async generateCode() {
            const prefix = 'VEH';
            const { data, error } = await window.Supabase
                .from(this.table)
                .select('vehicle_code')
                .order('vehicle_code', { ascending: false })
                .limit(1);
                
            if (error || !data || data.length === 0) {
                return `${prefix}0001`;
            }
            
            const lastCode = data[0].vehicle_code;
            const num = parseInt(lastCode.replace(prefix, '')) + 1;
            return `${prefix}${String(num).padStart(4, '0')}`;
        }

        // 获取车辆统计
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
                const maintenance = data.filter(item => item.status === 'maintenance').length;
                
                return {
                    total,
                    active,
                    maintenance
                };
            } catch (error) {
                console.error('获取车辆统计失败:', error);
                return { total: 0, active: 0, maintenance: 0 };
            }
        }

        // 获取客户车辆
        async getByCustomer(customerId) {
            try {
                const { data, error } = await window.Supabase
                    .from(this.table)
                    .select('*')
                    .eq('customer_id', customerId)
                    .order('created_at', { ascending: false });
                    
                if (error) throw error;
                return data;
            } catch (error) {
                console.error('获取客户车辆失败:', error);
                return [];
            }
        }
    }

    window.VehicleService = new VehicleService();

})();