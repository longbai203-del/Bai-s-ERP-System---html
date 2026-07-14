/**
 * @file api-client.js
 * @description API 客户端 - 处理所有 HTTP 请求
 * @version 2.0.0
 */

// ============================================================
// 1. 配置
// ============================================================

const API_BASE_URL = '/api';
const DEFAULT_TIMEOUT = 30000; // 30秒

// ============================================================
// 2. 工具函数
// ============================================================

/**
 * 构建查询字符串
 */
function buildQueryString(params) {
    if (!params || Object.keys(params).length === 0) return '';
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
            searchParams.append(key, value);
        }
    });
    const query = searchParams.toString();
    return query ? `?${query}` : '';
}

/**
 * 获取认证 Token
 */
function getAuthToken() {
    try {
        const session = localStorage.getItem('supabase.auth.token');
        if (session) {
            const parsed = JSON.parse(session);
            return parsed?.access_token || null;
        }
        return null;
    } catch {
        return null;
    }
}

/**
 * 获取请求头
 */
function getHeaders(options = {}) {
    const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...options.headers
    };

    // 添加认证 Token
    const token = options.token || getAuthToken();
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
}

/**
 * 超时控制
 */
function withTimeout(fetchPromise, timeout = DEFAULT_TIMEOUT) {
    return Promise.race([
        fetchPromise,
        new Promise((_, reject) => {
            setTimeout(() => reject(new Error('请求超时')), timeout);
        })
    ]);
}

// ============================================================
// 3. 核心请求函数
// ============================================================

/**
 * 通用请求函数
 */
async function request(endpoint, options = {}) {
    const queryString = buildQueryString(options.params);
    const url = `${API_BASE_URL}${endpoint}${queryString}`;
    
    const config = {
        method: options.method || 'GET',
        headers: getHeaders(options),
        ...options
    };

    // 如果有 body，添加到请求中
    if (options.body && options.method !== 'GET' && options.method !== 'HEAD') {
        config.body = typeof options.body === 'string' ? options.body : JSON.stringify(options.body);
    }

    try {
        const response = await withTimeout(fetch(url, config), options.timeout || DEFAULT_TIMEOUT);
        
        // 处理非 JSON 响应
        const contentType = response.headers.get('content-type');
        let data;
        if (contentType && contentType.includes('application/json')) {
            data = await response.json();
        } else {
            data = await response.text();
        }

        if (!response.ok) {
            const error = data?.error || data?.message || `HTTP ${response.status}: ${response.statusText}`;
            throw new Error(error);
        }

        return data;
    } catch (error) {
        console.error('[API Client] 请求错误:', {
            url,
            method: options.method || 'GET',
            error: error.message
        });
        throw error;
    }
}

// ============================================================
// 4. API 客户端对象
// ============================================================

export const apiClient = {
    /**
     * GET 请求
     * @param {string} endpoint - API 端点
     * @param {Object} options - 选项 { params, headers, timeout }
     */
    get: (endpoint, options = {}) => {
        return request(endpoint, { ...options, method: 'GET' });
    },

    /**
     * POST 请求
     * @param {string} endpoint - API 端点
     * @param {Object} data - 请求数据
     * @param {Object} options - 选项 { params, headers, timeout }
     */
    post: (endpoint, data, options = {}) => {
        return request(endpoint, {
            ...options,
            method: 'POST',
            body: data
        });
    },

    /**
     * PUT 请求
     * @param {string} endpoint - API 端点
     * @param {Object} data - 请求数据
     * @param {Object} options - 选项 { params, headers, timeout }
     */
    put: (endpoint, data, options = {}) => {
        return request(endpoint, {
            ...options,
            method: 'PUT',
            body: data
        });
    },

    /**
     * DELETE 请求
     * @param {string} endpoint - API 端点
     * @param {Object} options - 选项 { params, headers, timeout }
     */
    delete: (endpoint, options = {}) => {
        return request(endpoint, { ...options, method: 'DELETE' });
    },

    /**
     * PATCH 请求
     * @param {string} endpoint - API 端点
     * @param {Object} data - 请求数据
     * @param {Object} options - 选项 { params, headers, timeout }
     */
    patch: (endpoint, data, options = {}) => {
        return request(endpoint, {
            ...options,
            method: 'PATCH',
            body: data
        });
    },

    /**
     * 上传文件
     * @param {string} endpoint - API 端点
     * @param {FormData} formData - 表单数据
     * @param {Object} options - 选项 { params, timeout }
     */
    upload: (endpoint, formData, options = {}) => {
        const headers = options.headers || {};
        // 上传文件时不设置 Content-Type，让浏览器自动设置
        delete headers['Content-Type'];
        
        const token = getAuthToken();
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const queryString = buildQueryString(options.params);
        const url = `${API_BASE_URL}${endpoint}${queryString}`;

        return withTimeout(
            fetch(url, {
                method: 'POST',
                headers,
                body: formData
            }),
            options.timeout || DEFAULT_TIMEOUT
        ).then(async (response) => {
            const contentType = response.headers.get('content-type');
            let data;
            if (contentType && contentType.includes('application/json')) {
                data = await response.json();
            } else {
                data = await response.text();
            }

            if (!response.ok) {
                const error = data?.error || data?.message || `HTTP ${response.status}`;
                throw new Error(error);
            }

            return data;
        });
    }
};

// ============================================================
// 5. 便捷导出（兼容旧版本）
// ============================================================

// 导出默认对象
export default apiClient;

// 导出单个函数（兼容旧版本）
export const get = apiClient.get;
export const post = apiClient.post;
export const put = apiClient.put;
export const del = apiClient.delete;
export const patch = apiClient.patch;

// 也导出为 request（兼容性）
export const requestFn = request;

// ============================================================
// 6. 拦截器支持（可选）
// ============================================================

let requestInterceptors = [];
let responseInterceptors = [];

/**
 * 添加请求拦截器
 */
export function addRequestInterceptor(interceptor) {
    requestInterceptors.push(interceptor);
}

/**
 * 添加响应拦截器
 */
export function addResponseInterceptor(interceptor) {
    responseInterceptors.push(interceptor);
}

/**
 * 带拦截器的请求
 */
export async function requestWithInterceptors(endpoint, options = {}) {
    let config = { endpoint, ...options };
    
    // 执行请求拦截器
    for (const interceptor of requestInterceptors) {
        config = await interceptor(config);
    }
    
    try {
        let result = await request(config.endpoint, config);
        
        // 执行响应拦截器
        for (const interceptor of responseInterceptors) {
            result = await interceptor(result);
        }
        
        return result;
    } catch (error) {
        throw error;
    }
}

// ============================================================
// 7. 初始化日志
// ============================================================

console.log('✅ [API Client] 已初始化');

// ============================================================
// 8. 导出清单
// ============================================================

export default {
    apiClient,
    get: apiClient.get,
    post: apiClient.post,
    put: apiClient.put,
    delete: apiClient.delete,
    patch: apiClient.patch,
    upload: apiClient.upload,
    request,
    requestWithInterceptors,
    addRequestInterceptor,
    addResponseInterceptor
};