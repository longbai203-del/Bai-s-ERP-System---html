/**
 * Finance Service - 财务管理服务
 */

(function() {
    'use strict';

    class FinanceService {
        constructor() {
            this.table = 'finances';
        }

        // 获取所有财务记录
        async getAll(filters = {}) {
            try {
                let query = window.Supabase.from(this.table).select('*, branches(name)');
                
                if (filters.branch_id) {
                    query = query.eq('branch_id', filters.branch_id);
                }
                if (filters.organization_id) {
                    query = query.eq('organization_id', filters.organization_id);
                }
                if (filters.type) {
                    query = query.eq('type', filters.type);
                }
                if (filters.category) {
                    query = query.eq('category', filters.category);
                }
                if (filters.date_from) {
                    query = query.gte('transaction_date', filters.date_from);
                }
                if (filters.date_to) {
                    query = query.lte('transaction_date', filters.date_to);
                }
                if (filters.search) {
                    query = query.ilike('description', `%${filters.search}%`);
                }
                
                const { data, error } = await query.order('transaction_date', { ascending: false });
                    
                if (error) throw error;
                return data;
            } catch (error) {
                console.error('获取财务记录失败:', error);
                return [];
            }
        }

        // 获取单个财务记录
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
                console.error('获取财务记录失败:', error);
                return null;
            }
        }

        // 创建财务记录
        async create(data) {
            try {
                const { data: result, error } = await window.Supabase
                    .from(this.table)
                    .insert([{
                        ...data,
                        voucher_no: await this.generateVoucherNo(),
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString()
                    }])
                    .select()
                    .single();
                    
                if (error) throw error;
                return result;
            } catch (error) {
                console.error('创建财务记录失败:', error);
                throw error;
            }
        }

        // 更新财务记录
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
                console.error('更新财务记录失败:', error);
                throw error;
            }
        }

        // 删除财务记录
        async delete(id) {
            try {
                const { error } = await window.Supabase
                    .from(this.table)
                    .delete()
                    .eq('id', id);
                    
                if (error) throw error;
                return true;
            } catch (error) {
                console.error('删除财务记录失败:', error);
                throw error;
            }
        }

        // 生成凭证号
        async generateVoucherNo() {
            const prefix = 'VCH';
            const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
            const { data, error } = await window.Supabase
                .from(this.table)
                .select('voucher_no')
                .like('voucher_no', `${prefix}${date}%`)
                .order('voucher_no', { ascending: false })
                .limit(1);
                
            if (error || !data || data.length === 0) {
                return `${prefix}${date}0001`;
            }
            
            const lastNo = data[0].voucher_no;
            const num = parseInt(lastNo.slice(-4)) + 1;
            return `${prefix}${date}${String(num).padStart(4, '0')}`;
        }

        // 获取财务统计
        async getStats(filters = {}) {
            try {
                let query = window.Supabase.from(this.table).select('*');
                
                if (filters.branch_id) {
                    query = query.eq('branch_id', filters.branch_id);
                }
                if (filters.organization_id) {
                    query = query.eq('organization_id', filters.organization_id);
                }
                if (filters.date_from) {
                    query = query.gte('transaction_date', filters.date_from);
                }
                if (filters.date_to) {
                    query = query.lte('transaction_date', filters.date_to);
                }
                
                const { data, error } = await query;
                if (error) throw error;
                
                const income = data.filter(item => item.type === 'income');
                const expense = data.filter(item => item.type === 'expense');
                
                const totalIncome = income.reduce((sum, item) => sum + (item.amount || 0), 0);
                const totalExpense = expense.reduce((sum, item) => sum + (item.amount || 0), 0);
                const balance = totalIncome - totalExpense;
                
                // 按类别统计
                const byCategory = {};
                for (const item of data) {
                    if (item.category) {
                        byCategory[item.category] = (byCategory[item.category] || 0) + (item.amount || 0);
                    }
                }
                
                return {
                    totalIncome,
                    totalExpense,
                    balance,
                    byCategory,
                    incomeCount: income.length,
                    expenseCount: expense.length
                };
            } catch (error) {
                console.error('获取财务统计失败:', error);
                return { totalIncome: 0, totalExpense: 0, balance: 0, byCategory: {} };
            }
        }

        // 获取利润表
        async getProfitLoss(filters = {}) {
            try {
                const stats = await this.getStats(filters);
                
                // 计算毛利率
                const grossProfit = stats.totalIncome * 0.3; // 假设毛利率30%
                const netProfit = grossProfit - stats.totalExpense;
                
                return {
                    revenue: stats.totalIncome,
                    costOfGoods: stats.totalIncome * 0.7,
                    grossProfit: grossProfit,
                    expenses: stats.totalExpense,
                    netProfit: netProfit,
                    profitMargin: stats.totalIncome > 0 ? (netProfit / stats.totalIncome) * 100 : 0
                };
            } catch (error) {
                console.error('获取利润表失败:', error);
                return null;
            }
        }
    }

    window.FinanceService = new FinanceService();

})();