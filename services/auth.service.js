/**
 * @file auth.service.js
 * @description 认证服务 - 封装认证相关 API 调用
 * @module services/auth.service
 */

import { apiClient } from '@services/api-client.js';
import { API_ENDPOINTS } from '@utils/constants.js';

/**
 * 认证服务对象
 */
export const authService = {
    /**
     * 用户登录
     * @param {Object} credentials - 登录凭证
     * @param {string} credentials.username - 用户名
     * @param {string} credentials.password - 密码
     * @returns {Promise<{success: boolean, data?: Object, error?: string}>}
     */
    async login(credentials) {
        try {
            const response = await apiClient.post(API_ENDPOINTS.AUTH.LOGIN, credentials);
            return {
                success: response.success,
                data: response.data,
                error: null
            };
        } catch (error) {
            return {
                success: false,
                data: null,
                error: error.message || '登录失败'
            };
        }
    },

    /**
     * 用户登出
     * @returns {Promise<{success: boolean, error?: string}>}
     */
    async logout() {
        try {
            await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);
            return { success: true, error: null };
        } catch (error) {
            return { success: false, error: error.message || '登出失败' };
        }
    },

    /**
     * 用户注册
     * @param {Object} data - 注册数据
     * @param {string} data.username - 用户名
     * @param {string} data.password - 密码
     * @param {string} data.email - 邮箱
     * @param {string} data.name - 姓名
     * @param {string} data.role - 角色
     * @returns {Promise<{success: boolean, data?: Object, error?: string}>}
     */
    async register(data) {
        try {
            const response = await apiClient.post(API_ENDPOINTS.AUTH.REGISTER, data);
            return {
                success: response.success,
                data: response.data,
                error: null
            };
        } catch (error) {
            return {
                success: false,
                data: null,
                error: error.message || '注册失败'
            };
        }
    },

    /**
     * 获取当前用户信息
     * @returns {Promise<{success: boolean, data?: Object, error?: string}>}
     */
    async getCurrentUser() {
        try {
            const response = await apiClient.get(API_ENDPOINTS.AUTH.ME);
            return {
                success: response.success,
                data: response.data,
                error: null
            };
        } catch (error) {
            return {
                success: false,
                data: null,
                error: error.message || '获取用户信息失败'
            };
        }
    },

    /**
     * 刷新认证令牌
     * @param {string} refreshToken - 刷新令牌
     * @returns {Promise<{success: boolean, data?: Object, error?: string}>}
     */
    async refreshToken(refreshToken) {
        try {
            const response = await apiClient.post('/auth/refresh', { refreshToken });
            return {
                success: response.success,
                data: response.data,
                error: null
            };
        } catch (error) {
            return {
                success: false,
                data: null,
                error: error.message || '刷新令牌失败'
            };
        }
    },

    /**
     * 修改密码
     * @param {Object} data - 密码数据
     * @param {string} data.oldPassword - 旧密码
     * @param {string} data.newPassword - 新密码
     * @returns {Promise<{success: boolean, error?: string}>}
     */
    async changePassword(data) {
        try {
            await apiClient.post('/auth/change-password', data);
            return { success: true, error: null };
        } catch (error) {
            return { success: false, error: error.message || '修改密码失败' };
        }
    },

    /**
     * 重置密码（忘记密码）
     * @param {string} email - 邮箱
     * @returns {Promise<{success: boolean, error?: string}>}
     */
    async resetPassword(email) {
        try {
            await apiClient.post('/auth/reset-password', { email });
            return { success: true, error: null };
        } catch (error) {
            return { success: false, error: error.message || '重置密码失败' };
        }
    }
};

export default authService;