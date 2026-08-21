/**
 * Member Service - 会员管理服务
 */

(function() {
    'use strict';

    class MemberService {
        constructor() {
            this.table = 'members';
        }

        // 获取所有会员
        async getAll(filters = {}) {
            try {
                let query = window.Supabase.from(this.table).select('*, customers(name, phone)');
                
                if (filters.branch_id) {
                    query = query.eq('branch_id', filters.branch_id);
                }
                if (filters.organization_id) {
                    query = query.eq('organization_id', filters.organization_id);
                }
                if (filters.member_type) {
                    query = query.eq('member_type', filters.member_type);
                }
                if (filters.status) {
                    query = query.eq('status', filters.status);
                }
                if (filters.search) {
                    query = query.or(`membership_number.ilike.%${filters.search}%`);
                }
                
                const { data, error } = await query.order('created_at', { ascending: false });
                    
                if (error) throw error;
                return data;
            } catch (error) {
                console.error('获取会员列表失败:', error);
                return [];
            }
        }

        // 获取单个会员
        async getById(id) {
            try {
                const { data, error } = await window.Supabase
                    .from(this.table)
                    .select('*, customers(*)')
                    .eq('id', id)
                    .single();
                    
                if (error) throw error;
                return data;
            } catch (error) {
                console.error('获取会员失败:', error);
                return null;
            }
        }

        // 创建会员
        async create(data) {
            try {
                const { data: result, error } = await window.Supabase
                    .from(this.table)
                    .insert([{
                        ...data,
                        membership_number: await this.generateNumber(),
                        start_date: data.start_date || new Date().toISOString(),
                        end_date: data.end_date || this.calculateEndDate(data.start_date, data.duration_months || 12),
                        status: 'active',
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString()
                    }])
                    .select()
                    .single();
                    
                if (error) throw error;
                
                // 更新客户会员状态
                await this.updateCustomerMemberStatus(data.customer_id, 'member');
                
                return result;
            } catch (error) {
                console.error('创建会员失败:', error);
                throw error;
            }
        }

        // 更新会员
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
                console.error('更新会员失败:', error);
                throw error;
            }
        }

        // 删除会员
        async delete(id) {
            try {
                const member = await this.getById(id);
                if (member) {
                    await this.updateCustomerMemberStatus(member.customer_id, 'regular');
                }
                
                const { error } = await window.Supabase
                    .from(this.table)
                    .delete()
                    .eq('id', id);
                    
                if (error) throw error;
                return true;
            } catch (error) {
                console.error('删除会员失败:', error);
                throw error;
            }
        }

        // 生成会员编号
        async generateNumber() {
            const prefix = 'M';
            const year = new Date().getFullYear();
            const { data, error } = await window.Supabase
                .from(this.table)
                .select('membership_number')
                .like('membership_number', `${prefix}${year}%`)
                .order('membership_number', { ascending: false })
                .limit(1);
                
            if (error || !data || data.length === 0) {
                return `${prefix}${year}0001`;
            }
            
            const lastNumber = data[0].membership_number;
            const num = parseInt(lastNumber.slice(-4)) + 1;
            return `${prefix}${year}${String(num).padStart(4, '0')}`;
        }

        // 计算结束日期
        calculateEndDate(startDate, months) {
            const date = new Date(startDate);
            date.setMonth(date.getMonth() + months);
            return date.toISOString();
        }

        // 更新客户会员状态
        async updateCustomerMemberStatus(customerId, status) {
            try {
                await window.Supabase
                    .from('customers')
                    .update({ member_type: status })
                    .eq('id', customerId);
            } catch (error) {
                console.error('更新客户会员状态失败:', error);
            }
        }

        // 续费会员
        async renew(id, months) {
            try {
                const member = await this.getById(id);
                if (!member) throw new Error('会员不存在');
                
                const newEndDate = this.calculateEndDate(member.end_date || new Date(), months);
                
                const { data, error } = await window.Supabase
                    .from(this.table)
                    .update({
                        end_date: newEndDate,
                        updated_at: new Date().toISOString(),
                        status: 'active'
                    })
                    .eq('id', id)
                    .select()
                    .single();
                    
                if (error) throw error;
                return data;
            } catch (error) {
                console.error('续费会员失败:', error);
                throw error;
            }
        }

        // 检查会员是否过期
        async checkExpired() {
            try {
                const now = new Date().toISOString();
                const { data, error } = await window.Supabase
                    .from(this.table)
                    .update({ status: 'expired' })
                    .eq('status', 'active')
                    .lt('end_date', now)
                    .select();
                    
                if (error) throw error;
                
                // 更新客户状态
                for (const member of data || []) {
                    await this.updateCustomerMemberStatus(member.customer_id, 'regular');
                }
                
                return data || [];
            } catch (error) {
                console.error('检查过期会员失败:', error);
                return [];
            }
        }

        // 获取会员统计
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
                
                // 按类型统计
                const types = await window.Supabase
                    .from(this.table)
                    .select('member_type, count')
                    .group('member_type');
                    
                return {
                    total: count || 0,
                    byType: types.data || []
                };
            } catch (error) {
                console.error('获取会员统计失败:', error);
                return { total: 0, byType: [] };
            }
        }
    }

    window.MemberService = new MemberService();

})();