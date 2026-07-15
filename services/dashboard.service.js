/**
 * @file dashboard.service.js
 * @description 仪表盘服务 - 封装仪表盘相关 API 调用
 * @module services/dashboard.service
 */

import { apiClient } from '@services/api-client.js';
import { orderService } from '@services/order.service.js';
import { productService } from '@services/product.service.js';
import { customerService } from '@services/customer.service.js';

/**
 * 仪表盘统计数据
 * @typedef {Object} DashboardStats
 * @property {number} todayRevenue - 今日收入
 * @property {number} todayOrders - 今日订单数
 * @property {number} activeCustomers - 活跃客户数
 * @property {number} totalProducts - 商品总数
 * @property {number} lowStockProducts - 低库存商品数
 * @property {number} conversionRate - 转化率
 */

/**
 * 仪表盘服务对象
 */
export const dashboardService = {
    /**
     * 获取仪表盘统计数据
     * @param {Object} params - 统计参数
     * @param {string} [params.startDate] - 开始日期
     * @param {string} [params.endDate] - 结束日期
     * @returns {Promise<{success: boolean, data?: DashboardStats, error?: string}>}
     */
    async getStats(params = {}) {
        try {
            // 尝试从后端获取
            const response = await apiClient.get('/dashboard/stats', { params });
            if (response.success) {
                return { success: true, data: response.data, error: null };
            }
            // 如果后端失败，使用组合数据
            return await this._getLocalStats(params);
        } catch (error) {
            // 降级到本地组合数据
            return await this._getLocalStats(params);
        }
    },

    /**
     * 本地组合统计数据（降级方案）
     * @private
     * @param {Object} params - 统计参数
     * @returns {Promise<{success: boolean, data?: Object, error?: string}>}
     */
    async _getLocalStats(params = {}) {
        try {
            const [orderStats, productStats, customerStats] = await Promise.all([
                orderService.getStats(params),
                productService.getStats(),
                customerService.getStats()
            ]);

            return {
                success: true,
                data: {
                    todayRevenue: orderStats.data?.todayRevenue || 0,
                    todayOrders: orderStats.data?.todayOrders || 0,
                    activeCustomers: customerStats.data?.active || 0,
                    totalProducts: productStats.data?.total || 0,
                    lowStockProducts: productStats.data?.lowStock || 0,
                    conversionRate: orderStats.data?.conversionRate || 0,
                    // 额外数据
                    orderStats: orderStats.data,
                    productStats: productStats.data,
                    customerStats: customerStats.data
                },
                error: null
            };
        } catch (error) {
            return {
                success: false,
                data: null,
                error: error.message || '获取统计数据失败'
            };
        }
    },

    /**
     * 获取图表数据
     * @param {Object} params - 图表参数
     * @param {string} [params.type] - 图表类型: revenue/orders/customers
     * @param {string} [params.period] - 时间周期: day/week/month/year
     * @param {string} [params.startDate] - 开始日期
     * @param {string} [params.endDate] - 结束日期
     * @returns {Promise<{success: boolean, data?: Object, error?: string}>}
     */
    async getChartData(params = {}) {
        try {
            const response = await apiClient.get('/dashboard/chart', { params });
            if (response.success) {
                return { success: true, data: response.data, error: null };
            }
            return { success: false, data: null, error: response.message };
        } catch (error) {
            // 返回模拟数据
            return {
                success: true,
                data: this._getMockChartData(params.type || 'revenue'),
                error: null
            };
        }
    },

    /**
     * 获取模拟图表数据
     * @private
     * @param {string} type - 图表类型
     * @returns {Object}
     */
    _getMockChartData(type) {
        const labels = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
        const revenue = [3200, 4500, 3800, 6200, 5800, 7200, 4800];
        const orders = [12, 18, 15, 25, 22, 30, 20];
        const customers = [5, 8, 6, 12, 10, 15, 9];

        switch (type) {
            case 'orders':
                return { labels, data: orders };
            case 'customers':
                return { labels, data: customers };
            case 'revenue':
            default:
                return { labels, data: revenue };
        }
    },

    /**
     * 获取今日概览数据
     * @param {string} [date] - 日期
     * @returns {Promise<{success: boolean, data?: Object, error?: string}>}
     */
    async getTodayOverview(date) {
        try {
            const response = await apiClient.get('/dashboard/today', { params: { date } });
            if (response.success) {
                return { success: true, data: response.data, error: null };
            }
            return { success: false, data: null, error: response.message };
        } catch (error) {
            return { success: false, data: null, error: error.message };
        }
    },

    /**
     * 获取最近活动
     * @param {number} [limit] - 返回数量
     * @returns {Promise<{success: boolean, data?: Array, error?: string}>}
     */
    async getRecentActivities(limit = 10) {
        try {
            const response = await apiClient.get('/dashboard/activities', { params: { limit } });
            if (response.success) {
                return { success: true, data: response.data || [], error: null };
            }
            return { success: false, data: null, error: response.message };
        } catch (error) {
            // 返回模拟数据
            return {
                success: true,
                data: [
                    { id: 1, type: 'order', message: '新订单 #ORD-2026-0001', time: '刚刚' },
                    { id: 2, type: 'customer', message: '新客户注册: 张伟', time: '5分钟前' },
                    { id: 3, type: 'product', message: '商品 "泡沫洗车液" 库存不足', time: '15分钟前' }
                ],
                error: null
            };
        }
    }
};

export default dashboardService;