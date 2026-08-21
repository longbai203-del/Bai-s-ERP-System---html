/**
 * Marketing Service - 营销管理服务
 */

(function() {
    'use strict';

    class MarketingService {
        constructor() {
            this.table = 'marketing_campaigns';
        }

        // 获取所有营销活动
        async getAll(filters = {}) {
            try {
                let query = window.Supabase.from(this.table).select('*');
                
                if (filters.branch_id) {
                    query = query.eq('branch_id', filters.branch_id);
                }
                if (filters.organization_id) {
                    query = query.eq('organization_id', filters.organization_id);
                }
                if (filters.type) {
                    query = query.eq('type', filters.type);
                }
                if (filters.status) {
                    query = query.eq('status', filters.status);
                }
                if (filters.date_from) {
                    query = query.gte('start_date', filters.date_from);
                }
                if (filters.date_to) {
                    query = query.lte('end_date', filters.date_to);
                }
                
                const { data, error } = await query.order('start_date', { ascending: false });
                    
                if (error) throw error;
                return data;
            } catch (error) {
                console.error('获取营销活动失败:', error);
                return [];
            }
        }

        // 获取单个营销活动
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
                console.error('获取营销活动失败:', error);
                return null;
            }
        }

        // 创建营销活动
        async create(data) {
            try {
                const { data: result, error } = await window.Supabase
                    .from(this.table)
                    .insert([{
                        ...data,
                        campaign_code: await this.generateCode(),
                        status: data.status || 'draft',
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString()
                    }])
                    .select()
                    .single();
                    
                if (error) throw error;
                return result;
            } catch (error) {
                console.error('创建营销活动失败:', error);
                throw error;
            }
        }

        // 更新营销活动
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
                console.error('更新营销活动失败:', error);
                throw error;
            }
        }

        // 删除营销活动
        async delete(id) {
            try {
                const { error } = await window.Supabase
                    .from(this.table)
                    .delete()
                    .eq('id', id);
                    
                if (error) throw error;
                return true;
            } catch (error) {
                console.error('删除营销活动失败:', error);
                throw error;
            }
        }

        // 生成活动编码
        async generateCode() {
            const prefix = 'MC';
            const year = new Date().getFullYear();
            const { data, error } = await window.Supabase
                .from(this.table)
                .select('campaign_code')
                .like('campaign_code', `${prefix}${year}%`)
                .order('campaign_code', { ascending: false })
                .limit(1);
                
            if (error || !data || data.length === 0) {
                return `${prefix}${year}0001`;
            }
            
            const lastCode = data[0].campaign_code;
            const num = parseInt(lastCode.slice(-4)) + 1;
            return `${prefix}${year}${String(num).padStart(4, '0')}`;
        }

        // 获取营销统计
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
                const completed = data.filter(item => item.status === 'completed').length;
                
                // 按类型统计
                const byType = {};
                for (const item of data) {
                    if (item.type) {
                        byType[item.type] = (byType[item.type] || 0) + 1;
                    }
                }
                
                // 总花费
                const totalSpent = data.reduce((sum, item) => sum + (item.budget_spent || 0), 0);
                
                return {
                    total,
                    active,
                    completed,
                    totalSpent,
                    byType
                };
            } catch (error) {
                console.error('获取营销统计失败:', error);
                return { total: 0, active: 0, completed: 0, totalSpent: 0, byType: {} };
            }
        }

        // 发送营销消息
        async sendCampaign(campaignId, recipients) {
            try {
                // 发送邮件/SMS/推送通知
                // 这里集成第三方服务
                console.log(`发送营销活动 ${campaignId} 给 ${recipients.length} 个收件人`);
                
                // 记录发送日志
                await window.Supabase
                    .from('marketing_logs')
                    .insert([{
                        campaign_id: campaignId,
                        recipients: recipients.length,
                        sent_at: new Date().toISOString(),
                        status: 'sent'
                    }]);
                
                return { success: true, sent: recipients.length };
            } catch (error) {
                console.error('发送营销消息失败:', error);
                throw error;
            }
        }
    }

    window.MarketingService = new MarketingService();

})();