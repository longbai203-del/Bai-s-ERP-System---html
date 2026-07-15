/**
 * @file order.service.js
 * @description 订单服务 - 封装订单相关 API 调用
 * @module services/order.service
 */

import { apiClient } from '@services/api-client.js';
import { API_ENDPOINTS, ORDER_STATUS } from '@utils/constants.js';

/**
 * 订单查询参数
 * @typedef {Object} OrderQueryParams
 * @property {number} [page] - 页码
 * @property {number} [pageSize] - 每页数量
 * @property {string} [status] - 订单状态
 * @property {string} [customerName] - 客户名称
 * @property {string} [orderNumber] - 订单号
 * @property {string} [startDate] - 开始日期
 * @property {string} [endDate] - 结束日期
 */

/**
 * 订单数据对象
 * @typedef {Object} OrderData
 * @property {string} id - 订单ID
 * @property {string} orderNumber - 订单号
 * @property {string} customerName - 客户名称
 * @property {string} customerPhone - 客户电话
 * @property {number} totalAmount - 总金额
 * @property {string} status - 订单状态
 * @property {string} paymentStatus - 支付状态
 * @property {string} createdAt - 创建时间
 * @property {string} updatedAt - 更新时间
 */

/**
 * 订单服务对象
 */
export const orderService = {
    /**
     * 获取订单列表
     * @param {OrderQueryParams} params - 查询参数
     * @returns {Promise<{success: boolean, data?: {list: OrderData[], total: number, page: number, pageSize: number}, error?: string}>}
     */
    async getList(params = {}) {
        try {
            const response = await apiClient.get(API_ENDPOINTS.ORDERS.LIST, { params });
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
     * 获取订单详情
     * @param {string} id - 订单ID
     * @returns {Promise<{success: boolean, data?: OrderData, error?: string}>}
     */
    async getDetail(id) {
        try {
            const response = await apiClient.get(API_ENDPOINTS.ORDERS.DETAIL(id));
            if (response.success) {
                return { success: true, data: response.data, error: null };
            }
            return { success: false, data: null, error: response.message };
        } catch (error) {
            return { success: false, data: null, error: error.message };
        }
    },

    /**
     * 创建订单
     * @param {Object} data - 订单数据
     * @param {string} data.customerName - 客户名称
     * @param {string} data.customerPhone - 客户电话
     * @param {Array} data.items - 订单商品列表
     * @param {string} [data.note] - 备注
     * @returns {Promise<{success: boolean, data?: OrderData, error?: string}>}
     */
    async create(data) {
        try {
            const response = await apiClient.post(API_ENDPOINTS.ORDERS.BASE, data);
            if (response.success) {
                return { success: true, data: response.data, error: null };
            }
            return { success: false, data: null, error: response.message };
        } catch (error) {
            return { success: false, data: null, error: error.message };
        }
    },

    /**
     * 更新订单
     * @param {string} id - 订单ID
     * @param {Object} data - 更新数据
     * @returns {Promise<{success: boolean, data?: OrderData, error?: string}>}
     */
    async update(id, data) {
        try {
            const response = await apiClient.put(API_ENDPOINTS.ORDERS.DETAIL(id), data);
            if (response.success) {
                return { success: true, data: response.data, error: null };
            }
            return { success: false, data: null, error: response.message };
        } catch (error) {
            return { success: false, data: null, error: error.message };
        }
    },

    /**
     * 删除订单
     * @param {string} id - 订单ID
     * @returns {Promise<{success: boolean, error?: string}>}
     */
    async delete(id) {
        try {
            await apiClient.delete(API_ENDPOINTS.ORDERS.DETAIL(id));
            return { success: true, error: null };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    /**
     * 更新订单状态
     * @param {string} id - 订单ID
     * @param {string} status - 新状态
     * @param {string} [note] - 状态变更备注
     * @returns {Promise<{success: boolean, data?: OrderData, error?: string}>}
     */
    async updateStatus(id, status, note = '') {
        try {
            const response = await apiClient.patch(API_ENDPOINTS.ORDERS.STATUS(id), { status, note });
            if (response.success) {
                return { success: true, data: response.data, error: null };
            }
            return { success: false, data: null, error: response.message };
        } catch (error) {
            return { success: false, data: null, error: error.message };
        }
    },

    /**
     * 获取订单统计
     * @param {Object} params - 统计参数
     * @param {string} [params.startDate] - 开始日期
     * @param {string} [params.endDate] - 结束日期
     * @returns {Promise<{success: boolean, data?: Object, error?: string}>}
     */
    async getStats(params = {}) {
        try {
            const response = await apiClient.get('/orders/stats', { params });
            if (response.success) {
                return { success: true, data: response.data, error: null };
            }
            return { success: false, data: null, error: response.message };
        } catch (error) {
            return { success: false, data: null, error: error.message };
        }
    },

    /**
     * 获取订单状态列表
     * @returns {Object} 订单状态映射
     */
    getStatusOptions() {
        return ORDER_STATUS;
    },

    /**
     * 获取订单状态标签
     * @param {string} status - 状态值
     * @returns {string} 状态标签
     */
    getStatusLabel(status) {
        const labels = {
            [ORDER_STATUS.PENDING]: '待处理',
            [ORDER_STATUS.CONFIRMED]: '已确认',
            [ORDER_STATUS.PROCESSING]: '处理中',
            [ORDER_STATUS.COMPLETED]: '已完成',
            [ORDER_STATUS.CANCELLED]: '已取消'
        };
        return labels[status] || status;
    },

    /**
     * 获取订单状态颜色类名
     * @param {string} status - 状态值
     * @returns {string} CSS 类名
     */
    getStatusClass(status) {
        const classes = {
            [ORDER_STATUS.PENDING]: 'status-pending',
            [ORDER_STATUS.CONFIRMED]: 'status-confirmed',
            [ORDER_STATUS.PROCESSING]: 'status-processing',
            [ORDER_STATUS.COMPLETED]: 'status-completed',
            [ORDER_STATUS.CANCELLED]: 'status-cancelled'
        };
        return classes[status] || '';
    }
};

export default orderService;