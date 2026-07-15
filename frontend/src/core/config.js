/**
 * @file config.js
 * @description 前端统一配置
 * @module core/config
 */

/**
 * 环境配置对象
 * @typedef {Object} Config
 * @property {string} apiBaseUrl - API 基础地址
 * @property {string} appName - 应用名称
 * @property {string} version - 版本号
 * @property {boolean} debug - 调试模式
 * @property {number} timeout - 请求超时时间(ms)
 * @property {number} retryCount - 重试次数
 * @property {Object} pagination - 分页默认配置
 * @property {number} pagination.defaultPageSize - 默认每页条数
 * @property {number[]} pagination.pageSizeOptions - 每页条数选项
 */

/** @type {Config} */
export const config = {
    // API 配置
    apiBaseUrl: import.meta.env.VITE_API_URL || '/api',
    
    // 应用配置
    appName: import.meta.env.VITE_APP_NAME || 'Bai\'s ERP',
    version: import.meta.env.VITE_APP_VERSION || '3.0.0',
    debug: import.meta.env.DEV || false,
    
    // 请求配置
    timeout: 30000,
    retryCount: 3,
    
    // 分页配置
    pagination: {
        defaultPageSize: 20,
        pageSizeOptions: [10, 20, 50, 100]
    }
};

/**
 * 获取当前环境
 * @returns {'development' | 'production'}
 */
export const getEnvironment = () => {
    return config.debug ? 'development' : 'production';
};

/**
 * 判断是否为开发环境
 * @returns {boolean}
 */
export const isDevelopment = () => config.debug;

export default config;