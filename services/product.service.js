/**
 * @file product.service.js
 * @description 商品服务 - 封装商品相关 API 调用
 * @module services/product.service
 */

import { apiClient } from '@services/api-client.js';

/**
 * 商品数据对象
 * @typedef {Object} ProductData
 * @property {string} id - 商品ID
 * @property {string} name - 商品名称
 * @property {string} category - 分类
 * @property {number} price - 价格
 * @property {number} cost - 成本价
 * @property {number} stock - 库存数量
 * @property {string} unit - 单位
 * @property {string} status - 状态: active/inactive
 * @property {string} description - 描述
 * @property {string} sku - SKU编码
 * @property {string} createdAt - 创建时间
 * @property {string} updatedAt - 更新时间
 */

/**
 * 商品查询参数
 * @typedef {Object} ProductQueryParams
 * @property {number} [page] - 页码
 * @property {number} [pageSize] - 每页数量
 * @property {string} [name] - 商品名称(模糊搜索)
 * @property {string} [category] - 分类
 * @property {string} [status] - 状态
 * @property {string} [sku] - SKU编码
 */

/**
 * 商品服务对象
 */
export const productService = {
    /**
     * 获取商品列表
     * @param {ProductQueryParams} params - 查询参数
     * @returns {Promise<{success: boolean, data?: {list: ProductData[], total: number, page: number, pageSize: number}, error?: string}>}
     */
    async getList(params = {}) {
        try {
            const response = await apiClient.get('/products', { params });
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
     * 获取商品详情
     * @param {string} id - 商品ID
     * @returns {Promise<{success: boolean, data?: ProductData, error?: string}>}
     */
    async getDetail(id) {
        try {
            const response = await apiClient.get(`/products/${id}`);
            if (response.success) {
                return { success: true, data: response.data, error: null };
            }
            return { success: false, data: null, error: response.message };
        } catch (error) {
            return { success: false, data: null, error: error.message };
        }
    },

    /**
     * 创建商品
     * @param {Object} data - 商品数据
     * @param {string} data.name - 商品名称
     * @param {string} data.category - 分类
     * @param {number} data.price - 价格
     * @param {number} data.cost - 成本价
     * @param {number} data.stock - 库存数量
     * @param {string} data.unit - 单位
     * @param {string} [data.description] - 描述
     * @param {string} [data.sku] - SKU编码
     * @returns {Promise<{success: boolean, data?: ProductData, error?: string}>}
     */
    async create(data) {
        try {
            const response = await apiClient.post('/products', data);
            if (response.success) {
                return { success: true, data: response.data, error: null };
            }
            return { success: false, data: null, error: response.message };
        } catch (error) {
            return { success: false, data: null, error: error.message };
        }
    },

    /**
     * 更新商品
     * @param {string} id - 商品ID
     * @param {Object} data - 更新数据
     * @returns {Promise<{success: boolean, data?: ProductData, error?: string}>}
     */
    async update(id, data) {
        try {
            const response = await apiClient.put(`/products/${id}`, data);
            if (response.success) {
                return { success: true, data: response.data, error: null };
            }
            return { success: false, data: null, error: response.message };
        } catch (error) {
            return { success: false, data: null, error: error.message };
        }
    },

    /**
     * 删除商品
     * @param {string} id - 商品ID
     * @returns {Promise<{success: boolean, error?: string}>}
     */
    async delete(id) {
        try {
            await apiClient.delete(`/products/${id}`);
            return { success: true, error: null };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    /**
     * 更新商品库存
     * @param {string} id - 商品ID
     * @param {number} quantity - 数量变化（正数增加，负数减少）
     * @param {string} [note] - 备注
     * @returns {Promise<{success: boolean, data?: ProductData, error?: string}>}
     */
    async updateStock(id, quantity, note = '') {
        try {
            const response = await apiClient.patch(`/products/${id}/stock`, { quantity, note });
            if (response.success) {
                return { success: true, data: response.data, error: null };
            }
            return { success: false, data: null, error: response.message };
        } catch (error) {
            return { success: false, data: null, error: error.message };
        }
    },

    /**
     * 获取分类列表
     * @returns {Promise<{success: boolean, data?: string[], error?: string}>}
     */
    async getCategories() {
        try {
            const response = await apiClient.get('/products/categories');
            if (response.success) {
                return { success: true, data: response.data || [], error: null };
            }
            return { success: false, data: null, error: response.message };
        } catch (error) {
            return { success: false, data: null, error: error.message };
        }
    },

    /**
     * 获取商品统计
     * @returns {Promise<{success: boolean, data?: Object, error?: string}>}
     */
    async getStats() {
        try {
            const response = await apiClient.get('/products/stats');
            if (response.success) {
                return { success: true, data: response.data, error: null };
            }
            return { success: false, data: null, error: response.message };
        } catch (error) {
            return { success: false, data: null, error: error.message };
        }
    },

    /**
     * 批量导入商品
     * @param {Array} products - 商品数组
     * @returns {Promise<{success: boolean, data?: {success: number, failed: number, errors: Array}, error?: string}>}
     */
    async bulkImport(products) {
        try {
            const response = await apiClient.post('/products/bulk', { products });
            if (response.success) {
                return { success: true, data: response.data, error: null };
            }
            return { success: false, data: null, error: response.message };
        } catch (error) {
            return { success: false, data: null, error: error.message };
        }
    },

    /**
     * 导出商品数据
     * @param {Object} params - 导出参数
     * @returns {Promise<{success: boolean, data?: Blob, error?: string}>}
     */
    async exportData(params = {}) {
        try {
            const response = await apiClient.get('/products/export', { params });
            if (response.success) {
                return { success: true, data: response.data, error: null };
            }
            return { success: false, data: null, error: response.message };
        } catch (error) {
            return { success: false, data: null, error: error.message };
        }
    }
};

export default productService;