/**
 * @file api-client.js
 * @description 统一 HTTP 请求客户端
 * @module services/api-client
 */

import { config } from '@core/config.js';

/**
 * HTTP 请求配置
 * @typedef {Object} RequestOptions
 * @property {string} method - 请求方法
 * @property {Object} [params] - URL 参数
 * @property {Object} [headers] - 自定义请求头
 * @property {*} [body] - 请求体
 * @property {number} [timeout] - 超时时间(ms)
 */

/**
 * HTTP 响应
 * @typedef {Object} ApiResponse
 * @property {boolean} success - 是否成功
 * @property {number} code - 状态码
 * @property {string} message - 消息
 * @property {*} data - 数据
 * @property {number} timestamp - 时间戳
 */

/**
 * API 客户端对象
 */
export const apiClient = {
    /** @type {string} API 基础地址 */
    _baseURL: config.apiBaseUrl,
    
    /** @type {string|null} 认证令牌 */
    _authToken: null,
    
    /** @type {number} 超时时间 */
    _timeout: config.timeout || 30000,

    /**
     * 设置认证令牌
     * @param {string|null} token - 令牌
     */
    setAuthToken(token) {
        this._authToken = token;
    },

    /**
     * 获取认证令牌
     * @returns {string|null}
     */
    getAuthToken() {
        return this._authToken;
    },

    /**
     * 构建请求 URL
     * @private
     * @param {string} endpoint - API 端点
     * @param {Object} params - 查询参数
     * @returns {string}
     */
    _buildURL(endpoint, params = {}) {
        const url = `${this._baseURL}${endpoint}`;
        if (Object.keys(params).length === 0) return url;
        
        const searchParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                searchParams.append(key, value);
            }
        });
        return `${url}?${searchParams.toString()}`;
    },

    /**
     * 构建请求头
     * @private
     * @param {Object} headers - 自定义请求头
     * @returns {Object}
     */
    _buildHeaders(headers = {}) {
        const defaultHeaders = {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        };
        
        if (this._authToken) {
            defaultHeaders['Authorization'] = `Bearer ${this._authToken}`;
        }
        
        return { ...defaultHeaders, ...headers };
    },

    /**
     * 发送请求
     * @private
     * @param {string} endpoint - API 端点
     * @param {RequestOptions} options - 请求选项
     * @returns {Promise<ApiResponse>}
     */
    async _request(endpoint, options = {}) {
        const { method = 'GET', params = {}, headers = {}, body, timeout = this._timeout } = options;
        
        const url = this._buildURL(endpoint, params);
        const requestHeaders = this._buildHeaders(headers);
        
        const fetchOptions = {
            method,
            headers: requestHeaders
        };
        
        if (body && method !== 'GET' && method !== 'HEAD') {
            fetchOptions.body = typeof body === 'string' ? body : JSON.stringify(body);
        }
        
        // 超时控制
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);
        fetchOptions.signal = controller.signal;
        
        try {
            const response = await fetch(url, fetchOptions);
            clearTimeout(timeoutId);
            
            const contentType = response.headers.get('content-type');
            let data;
            if (contentType && contentType.includes('application/json')) {
                data = await response.json();
            } else {
                data = await response.text();
            }
            
            // 标准响应格式
            if (response.ok) {
                return {
                    success: true,
                    code: response.status,
                    message: data?.message || '操作成功',
                    data: data?.data || data,
                    timestamp: data?.timestamp || Date.now()
                };
            }
            
            // 错误响应
            throw {
                status: response.status,
                message: data?.message || data?.error || `HTTP ${response.status}`,
                data: data?.data || null
            };
            
        } catch (error) {
            clearTimeout(timeoutId);
            
            if (error.name === 'AbortError') {
                throw {
                    status: 408,
                    message: '请求超时，请稍后重试',
                    data: null
                };
            }
            
            if (error.status) {
                throw error;
            }
            
            throw {
                status: 500,
                message: error.message || '网络错误，请检查连接',
                data: null
            };
        }
    },

    /**
     * GET 请求
     * @param {string} endpoint - API 端点
     * @param {Object} options - 请求选项
     * @param {Object} options.params - 查询参数
     * @param {Object} options.headers - 自定义请求头
     * @param {number} options.timeout - 超时时间
     * @returns {Promise<ApiResponse>}
     */
    get(endpoint, options = {}) {
        return this._request(endpoint, { ...options, method: 'GET' });
    },

    /**
     * POST 请求
     * @param {string} endpoint - API 端点
     * @param {*} data - 请求体
     * @param {Object} options - 请求选项
     * @param {Object} options.params - 查询参数
     * @param {Object} options.headers - 自定义请求头
     * @param {number} options.timeout - 超时时间
     * @returns {Promise<ApiResponse>}
     */
    post(endpoint, data, options = {}) {
        return this._request(endpoint, { ...options, method: 'POST', body: data });
    },

    /**
     * PUT 请求
     * @param {string} endpoint - API 端点
     * @param {*} data - 请求体
     * @param {Object} options - 请求选项
     * @param {Object} options.params - 查询参数
     * @param {Object} options.headers - 自定义请求头
     * @param {number} options.timeout - 超时时间
     * @returns {Promise<ApiResponse>}
     */
    put(endpoint, data, options = {}) {
        return this._request(endpoint, { ...options, method: 'PUT', body: data });
    },

    /**
     * DELETE 请求
     * @param {string} endpoint - API 端点
     * @param {Object} options - 请求选项
     * @param {Object} options.params - 查询参数
     * @param {Object} options.headers - 自定义请求头
     * @param {number} options.timeout - 超时时间
     * @returns {Promise<ApiResponse>}
     */
    delete(endpoint, options = {}) {
        return this._request(endpoint, { ...options, method: 'DELETE' });
    },

    /**
     * PATCH 请求
     * @param {string} endpoint - API 端点
     * @param {*} data - 请求体
     * @param {Object} options - 请求选项
     * @param {Object} options.params - 查询参数
     * @param {Object} options.headers - 自定义请求头
     * @param {number} options.timeout - 超时时间
     * @returns {Promise<ApiResponse>}
     */
    patch(endpoint, data, options = {}) {
        return this._request(endpoint, { ...options, method: 'PATCH', body: data });
    },

    /**
     * 上传文件
     * @param {string} endpoint - API 端点
     * @param {FormData} formData - 表单数据
     * @param {Object} options - 请求选项
     * @param {Object} options.params - 查询参数
     * @param {Object} options.headers - 自定义请求头
     * @param {number} options.timeout - 超时时间
     * @returns {Promise<ApiResponse>}
     */
    upload(endpoint, formData, options = {}) {
        const headers = { ...options.headers };
        // 移除 Content-Type，让浏览器自动设置
        delete headers['Content-Type'];
        
        return this._request(endpoint, {
            ...options,
            method: 'POST',
            headers,
            body: formData
        });
    }
};

// 导出便捷方法
export const get = apiClient.get.bind(apiClient);
export const post = apiClient.post.bind(apiClient);
export const put = apiClient.put.bind(apiClient);
export const del = apiClient.delete.bind(apiClient);
export const patch = apiClient.patch.bind(apiClient);
export const upload = apiClient.upload.bind(apiClient);

export default apiClient;