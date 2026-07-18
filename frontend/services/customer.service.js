/**
 * @file customer.service.js
 * @description 客户服务 - 封装客户相关 API 调用
 * @module services/customer.service
 */

import { apiClient } from '@services/api-client.js';

/**
 * 客户数据对象
 * @typedef {Object} CustomerData
 * @property {string} id - 客户ID
 * @property {string} name - 客户名称
 * @property {string} phone - 手机号
 * @property {string} email - 邮箱
 * @property {string} level - 客户等级
 * @property {number} totalSpent - 总消费
 * @property {number} totalOrders - 总订单数
 * @property {string} lastVisit - 最后访问时间
 * @property {string} createdAt - 创建时间
 * @property {string} updatedAt - 更新时间
 */

/**
 * 客户查询参数
 * @typedef {Object} CustomerQueryParams
 * @property {number} [page] - 页码
 * @property {number} [pageSize] - 每页数量
 * @property {string} [name] - 客户名称(模糊搜索)
 * @property {string} [phone] - 手机号
 * @property {string} [level] - 客户等级
 */

/**
 * 客户服务对象
 */
export const customerService = {
    /**
     * 获取客户列表
     * @param {CustomerQueryParams} params - 查询参数
     * @returns {Promise<{success: boolean, data?: {list: CustomerData[], total: number, page: number, pageSize: number}, error?: string}>}
     */
    async getList(params = {}) {
        try {
            const response = await apiClient.get('/customers', { params });
            if (response.success) {
                return {
                    success: true,
                    data: {
                        list: response.data?.list || [],
                        total: response.data?.total || 0,
                        page: response.data?.page || 1,
                        pageSize: response.data?.pageSize || 20
                    },
                    error: null
                };
            }
            return { success: false, data: null, error: response.message };
        } catch (error) {
            return { success: false, data: null, error: error.message };
        }
    },

    /**
     * 获取客户详情
     * @param {string} id - 客户ID
     * @returns {Promise<{success: boolean, data?: CustomerData, error?: string}>}
     */
    async getDetail(id) {
        try {
            const response = await apiClient.get(`/customers/${id}`);
            if (response.success) {
                return { success: true, data: response.data, error: null };
            }
            return { success: false, data: null, error: response.message };
        } catch (error) {
            return { success: false, data: null, error: error.message };
        }
    },

    /**
     * 创建客户
     * @param {Object} data - 客户数据
     * @param {string} data.name - 客户名称
     * @param {string} data.phone - 手机号
     * @param {string} [data.email] - 邮箱
     * @param {string} [data.level] - 客户等级
     * @param {string} [data.address] - 地址
     * @returns {Promise<{success: boolean, data?: CustomerData, error?: string}>}
     */
    async create(data) {
        try {
            const response = await apiClient.post('/customers', data);
            if (response.success) {
                return { success: true, data: response.data, error: null };
            }
            return { success: false, data: null, error: response.message };
        } catch (error) {
            return { success: false, data: null, error: error.message };
        }
    },

    /**
     * 更新客户
     * @param {string} id - 客户ID
     * @param {Object} data - 更新数据
     * @returns {Promise<{success: boolean, data?: CustomerData, error?: string}>}
     */
    async update(id, data) {
        try {
            const response = await apiClient.put(`/customers/${id}`, data);
            if (response.success) {
                return { success: true, data: response.data, error: null };
            }
            return { success: false, data: null, error: response.message };
        } catch (error) {
            return { success: false, data: null, error: error.message };
        }
    },

    /**
     * 删除客户
     * @param {string} id - 客户ID
     * @returns {Promise<{success: boolean, error?: string}>}
     */
    async delete(id) {
        try {
            await apiClient.delete(`/customers/${id}`);
            return { success: true, error: null };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    /**
     * 搜索客户（按电话或名称）
     * @param {string} keyword - 搜索关键词
     * @param {number} [limit] - 返回数量限制
     * @returns {Promise<{success: boolean, data?: CustomerData[], error?: string}>}
     */
    async search(keyword, limit = 10) {
        try {
            const response = await apiClient.get('/customers/search', { params: { keyword, limit } });
            if (response.success) {
                return { success: true, data: response.data || [], error: null };
            }
            return { success: false, data: null, error: response.message };
        } catch (error) {
            return { success: false, data: null, error: error.message };
        }
    },

    /**
     * 获取客户统计
     * @returns {Promise<{success: boolean, data?: Object, error?: string}>}
     */
    async getStats() {
        try {
            const response = await apiClient.get('/customers/stats');
            if (response.success) {
                return { success: true, data: response.data, error: null };
            }
            return { success: false, data: null, error: response.message };
        } catch (error) {
            return { success: false, data: null, error: error.message };
        }
    },

    /**
     * 获取客户等级列表
     * @returns {Object} 客户等级映射
     */
    getLevelOptions() {
        return {
            vip: 'VIP',
            gold: '黄金',
            silver: '白银',
            bronze: '青铜'
        };
    },

    /**
     * 获取客户等级标签
     * @param {string} level - 等级值
     * @returns {string} 等级标签
     */
    getLevelLabel(level) {
        const labels = this.getLevelOptions();
        return labels[level] || level || '普通';
    },

    /**
     * 获取客户等级颜色
     * @param {string} level - 等级值
     * @returns {string} CSS 颜色类
     */
    getLevelColor(level) {
        const colors = {
            vip: 'text-purple-600 bg-purple-50',
            gold: 'text-yellow-600 bg-yellow-50',
            silver: 'text-gray-600 bg-gray-50',
            bronze: 'text-orange-600 bg-orange-50'
        };
        return colors[level] || 'text-gray-600 bg-gray-50';
    }
};

export default customerService;