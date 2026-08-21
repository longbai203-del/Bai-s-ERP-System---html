/**
 * Report Service - 报表服务
 */

(function() {
    'use strict';

    class ReportService {
        constructor() {
            this.reports = {};
        }

        // 生成销售报表
        async getSalesReport(filters = {}) {
            try {
                const { data, error } = await window.Supabase
                    .from('orders')
                    .select('*, order_items(*, products(name))')
                    .gte('created_at', filters.date_from || '1970-01-01')
                    .lte('created_at', filters.date_to || new Date().toISOString())
                    .eq('status', 'completed');
                    
                if (error) throw error;
                
                // 汇总数据
                const totalRevenue = data.reduce((sum, order) => sum + (order.total || 0), 0);
                const totalOrders = data.length;
                
                // 按日期分组
                const byDate = {};
                // 按产品分组
                const byProduct = {};
                // 按类别分组
                const byCategory = {};
                
                for (const order of data) {
                    const date = order.created_at.slice(0, 10);
                    byDate[date] = (byDate[date] || 0) + (order.total || 0);
                    
                    for (const item of order.order_items || []) {
                        const productName = item.products?.name || '未知产品';
                        byProduct[productName] = (byProduct[productName] || 0) + (item.quantity || 0);
                    }
                }
                
                return {
                    totalRevenue,
                    totalOrders,
                    averageOrderValue: totalOrders > 0 ? totalRevenue / totalOrders : 0,
                    byDate,
                    byProduct,
                    byCategory,
                    data
                };
            } catch (error) {
                console.error('生成销售报表失败:', error);
                return null;
            }
        }

        // 生成库存报表
        async getInventoryReport(filters = {}) {
            try {
                const { data, error } = await window.Supabase
                    .from('inventory')
                    .select('*, products(name, sku, category)')
                    .eq('branch_id', filters.branch_id || '');
                    
                if (error) throw error;
                
                const totalItems = data.length;
                const totalValue = data.reduce((sum, item) => sum + (item.quantity * item.cost_price || 0), 0);
                const lowStock = data.filter(item => item.quantity <= item.min_quantity).length;
                
                // 按类别分组
                const byCategory = {};
                for (const item of data) {
                    const category = item.products?.category || '未分类';
                    byCategory[category] = (byCategory[category] || 0) + (item.quantity || 0);
                }
                
                return {
                    totalItems,
                    totalValue,
                    lowStock,
                    byCategory,
                    data
                };
            } catch (error) {
                console.error('生成库存报表失败:', error);
                return null;
            }
        }

        // 生成财务报表
        async getFinancialReport(filters = {}) {
            try {
                const { data, error } = await window.Supabase
                    .from('finances')
                    .select('*')
                    .gte('transaction_date', filters.date_from || '1970-01-01')
                    .lte('transaction_date', filters.date_to || new Date().toISOString());
                    
                if (error) throw error;
                
                const income = data.filter(item => item.type === 'income');
                const expense = data.filter(item => item.type === 'expense');
                
                const totalIncome = income.reduce((sum, item) => sum + (item.amount || 0), 0);
                const totalExpense = expense.reduce((sum, item) => sum + (item.amount || 0), 0);
                const netProfit = totalIncome - totalExpense;
                
                // 按月分组
                const byMonth = {};
                for (const item of data) {
                    const month = item.transaction_date.slice(0, 7);
                    if (!byMonth[month]) {
                        byMonth[month] = { income: 0, expense: 0 };
                    }
                    if (item.type === 'income') {
                        byMonth[month].income += (item.amount || 0);
                    } else {
                        byMonth[month].expense += (item.amount || 0);
                    }
                }
                
                return {
                    totalIncome,
                    totalExpense,
                    netProfit,
                    profitMargin: totalIncome > 0 ? (netProfit / totalIncome * 100) : 0,
                    byMonth,
                    incomeCount: income.length,
                    expenseCount: expense.length,
                    data
                };
            } catch (error) {
                console.error('生成财务报表失败:', error);
                return null;
            }
        }

        // 生成员工报表
        async getEmployeeReport(filters = {}) {
            try {
                const { data, error } = await window.Supabase
                    .from('profiles')
                    .select('*, attendances(*)')
                    .eq('organization_id', filters.organization_id || '');
                    
                if (error) throw error;
                
                const totalEmployees = data.length;
                const activeEmployees = data.filter(item => item.status === 'active').length;
                
                // 计算考勤率
                const attendanceStats = await window.AttendanceService.getStats(filters);
                
                return {
                    totalEmployees,
                    activeEmployees,
                    attendanceRate: attendanceStats.attendanceRate || 0,
                    byRole: {},
                    data
                };
            } catch (error) {
                console.error('生成员工报表失败:', error);
                return null;
            }
        }

        // 生成客户报表
        async getCustomerReport(filters = {}) {
            try {
                const { data, error } = await window.Supabase
                    .from('customers')
                    .select('*, orders(total)')
                    .eq('organization_id', filters.organization_id || '');
                    
                if (error) throw error;
                
                const totalCustomers = data.length;
                const memberCustomers = data.filter(item => item.member_type === 'member').length;
                
                // 计算客户消费排行
                const customerSpending = {};
                for (const customer of data) {
                    const totalSpent = (customer.orders || []).reduce((sum, order) => sum + (order.total || 0), 0);
                    customerSpending[customer.id] = totalSpent;
                }
                
                return {
                    totalCustomers,
                    memberCustomers,
                    memberRate: totalCustomers > 0 ? (memberCustomers / totalCustomers * 100) : 0,
                    customerSpending,
                    data
                };
            } catch (error) {
                console.error('生成客户报表失败:', error);
                return null;
            }
        }

        // 导出报表为CSV
        exportToCSV(data, filename = 'report') {
            if (!data || data.length === 0) return;
            
            const headers = Object.keys(data[0]);
            const csv = [
                headers.join(','),
                ...data.map(row => headers.map(h => {
                    const value = row[h] || '';
                    return typeof value === 'string' && value.includes(',') ? `"${value}"` : value;
                }).join(','))
            ].join('\n');
            
            const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `${filename}_${new Date().toISOString().slice(0, 10)}.csv`;
            link.click();
            URL.revokeObjectURL(link.href);
        }

        // 生成仪表板数据
        async getDashboardData(filters = {}) {
            try {
                const [sales, inventory, finance, employees, customers] = await Promise.all([
                    this.getSalesReport(filters),
                    this.getInventoryReport(filters),
                    this.getFinancialReport(filters),
                    this.getEmployeeReport(filters),
                    this.getCustomerReport(filters)
                ]);
                
                return {
                    sales: {
                        revenue: sales?.totalRevenue || 0,
                        orders: sales?.totalOrders || 0,
                        averageOrder: sales?.averageOrderValue || 0
                    },
                    inventory: {
                        totalItems: inventory?.totalItems || 0,
                        lowStock: inventory?.lowStock || 0,
                        totalValue: inventory?.totalValue || 0
                    },
                    finance: {
                        income: finance?.totalIncome || 0,
                        expense: finance?.totalExpense || 0,
                        profit: finance?.netProfit || 0
                    },
                    hr: {
                        employees: employees?.totalEmployees || 0,
                        attendance: employees?.attendanceRate || 0
                    },
                    customers: {
                        total: customers?.totalCustomers || 0,
                        members: customers?.memberCustomers || 0
                    },
                    timestamp: new Date().toISOString()
                };
            } catch (error) {
                console.error('获取仪表板数据失败:', error);
                return null;
            }
        }
    }

    window.ReportService = new ReportService();

})();