/**
 * CRM Service - 客户关系管理服务
 */

(function() {
    'use strict';

    class CRMService {
        constructor() {
            this.table = 'crm_activities';
        }

        // 获取所有CRM活动
        async getAll(filters = {}) {
            try {
                let query = window.Supabase.from(this.table).select('*, customers(name, phone), profiles(full_name)');
                
                if (filters.customer_id) {
                    query = query.eq('customer_id', filters.customer_id);
                }
                if (filters.type) {
                    query = query.eq('type', filters.type);
                }
                if (filters.status) {
                    query = query.eq('status', filters.status);
                }
                if (filters.assigned_to) {
                    query = query.eq('assigned_to', filters.assigned_to);
                }
                if (filters.date_from) {
                    query = query.gte('activity_date', filters.date_from);
                }
                if (filters.date_to) {
                    query = query.lte('activity_date', filters.date_to);
                }
                
                const { data, error } = await query.order('activity_date', { ascending: false });
                    
                if (error) throw error;
                return data;
            } catch (error) {
                console.error('获取CRM活动失败:', error);
                return [];
            }
        }

        // 获取单个CRM活动
        async getById(id) {
            try {
                const { data, error } = await window.Supabase
                    .from(this.table)
                    .select('*, customers(*), profiles(full_name)')
                    .eq('id', id)
                    .single();
                    
                if (error) throw error;
                return data;
            } catch (error) {
                console.error('获取CRM活动失败:', error);
                return null;
            }
        }

        // 创建CRM活动
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
                
                // 更新客户最后联系时间
                if (data.customer_id) {
                    await window.Supabase
                        .from('customers')
                        .update({
                            last_contact: new Date().toISOString(),
                            updated_at: new Date().toISOString()
                        })
                        .eq('id', data.customer_id);
                }
                
                return result;
            } catch (error) {
                console.error('创建CRM活动失败:', error);
                throw error;
            }
        }

        // 更新CRM活动
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
                console.error('更新CRM活动失败:', error);
                throw error;
            }
        }

        // 删除CRM活动
        async delete(id) {
            try {
                const { error } = await window.Supabase
                    .from(this.table)
                    .delete()
                    .eq('id', id);
                    
                if (error) throw error;
                return true;
            } catch (error) {
                console.error('删除CRM活动失败:', error);
                throw error;
            }
        }

        // 获取客户互动历史
        async getCustomerHistory(customerId) {
            try {
                const { data, error } = await window.Supabase
                    .from(this.table)
                    .select('*')
                    .eq('customer_id', customerId)
                    .order('activity_date', { ascending: false });
                    
                if (error) throw error;
                return data;
            } catch (error) {
                console.error('获取客户互动历史失败:', error);
                return [];
            }
        }

        // 获取CRM统计
        async getStats(filters = {}) {
            try {
                let query = window.Supabase.from(this.table).select('*');
                
                if (filters.assigned_to) {
                    query = query.eq('assigned_to', filters.assigned_to);
                }
                if (filters.date_from) {
                    query = query.gte('activity_date', filters.date_from);
                }
                if (filters.date_to) {
                    query = query.lte('activity_date', filters.date_to);
                }
                
                const { data, error } = await query;
                if (error) throw error;
                
                const total = data.length;
                const completed = data.filter(item => item.status === 'completed').length;
                const pending = data.filter(item => item.status === 'pending').length;
                
                // 按类型统计
                const byType = {};
                for (const item of data) {
                    if (item.type) {
                        byType[item.type] = (byType[item.type] || 0) + 1;
                    }
                }
                
                return {
                    total,
                    completed,
                    pending,
                    completionRate: total > 0 ? (completed / total * 100) : 0,
                    byType
                };
            } catch (error) {
                console.error('获取CRM统计失败:', error);
                return { total: 0, completed: 0, pending: 0, completionRate: 0, byType: {} };
            }
        }
    }

    window.CRMService = new CRMService();

})();