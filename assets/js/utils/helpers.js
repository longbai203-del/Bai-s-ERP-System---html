/**
 * @file helpers.js
 * @description 通用工具函数
 * @module utils/helpers
 */

/**
 * 格式化金额
 * @param {number} amount - 金额
 * @param {number} decimals - 小数位数
 * @returns {string}
 */
export const formatCurrency = (amount, decimals = 2) => {
    if (amount === undefined || amount === null) return '0.00';
    return Number(amount).toFixed(decimals);
};

/**
 * 格式化日期
 * @param {string|Date} date - 日期
 * @param {string} format - 格式 (short|long|time)
 * @returns {string}
 */
export const formatDate = (date, format = 'short') => {
    if (!date) return '-';
    const d = typeof date === 'string' ? new Date(date) : date;
    if (isNaN(d.getTime())) return '-';
    
    const opts = {
        short: { year: 'numeric', month: 'short', day: 'numeric' },
        long: { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' },
        time: { hour: '2-digit', minute: '2-digit' }
    };
    
    return d.toLocaleDateString('zh-CN', opts[format] || opts.short);
};

/**
 * 格式化日期时间
 * @param {string|Date} date - 日期
 * @returns {string}
 */
export const formatDateTime = (date) => formatDate(date, 'long');

/**
 * 生成唯一ID
 * @param {string} prefix - 前缀
 * @returns {string}
 */
export const generateId = (prefix = '') => {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 8);
    return prefix ? `${prefix}-${timestamp}-${random}` : `${timestamp}-${random}`;
};

/**
 * 深拷贝对象
 * @param {*} obj - 要拷贝的对象
 * @returns {*}
 */
export const deepClone = (obj) => {
    if (obj === null || typeof obj !== 'object') return obj;
    return JSON.parse(JSON.stringify(obj));
};

/**
 * 防抖函数
 * @param {Function} fn - 要执行的函数
 * @param {number} delay - 延迟时间(ms)
 * @returns {Function}
 */
export const debounce = (fn, delay = 300) => {
    let timer;
    return function(...args) {
        clearTimeout(timer);
        timer = setTimeout(() => fn.apply(this, args), delay);
    };
};

/**
 * 节流函数
 * @param {Function} fn - 要执行的函数
 * @param {number} interval - 间隔时间(ms)
 * @returns {Function}
 */
export const throttle = (fn, interval = 300) => {
    let lastTime = 0;
    return function(...args) {
        const now = Date.now();
        if (now - lastTime >= interval) {
            lastTime = now;
            fn.apply(this, args);
        }
    };
};

/**
 * 获取URL参数
 * @param {string} key - 参数名
 * @returns {string|null}
 */
export const getQueryParam = (key) => {
    const params = new URLSearchParams(window.location.search);
    return params.get(key);
};

/**
 * 构建查询字符串
 * @param {Object} params - 参数对象
 * @returns {string}
 */
export const buildQueryString = (params) => {
    if (!params || Object.keys(params).length === 0) return '';
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
            searchParams.append(key, value);
        }
    });
    const query = searchParams.toString();
    return query ? `?${query}` : '';
};

/**
 * 获取状态颜色
 * @param {string} status - 状态值
 * @param {Object} colorMap - 颜色映射表
 * @returns {string}
 */
export const getStatusColor = (status, colorMap = {}) => {
    const defaultMap = {
        active: 'success',
        inactive: 'gray',
        pending: 'warning',
        completed: 'success',
        cancelled: 'danger',
        processing: 'info'
    };
    const map = { ...defaultMap, ...colorMap };
    return map[status] || 'gray';
};

/**
 * 获取状态标签
 * @param {string} status - 状态值
 * @param {Object} labelMap - 标签映射表
 * @returns {string}
 */
export const getStatusLabel = (status, labelMap = {}) => {
    const defaultMap = {
        active: '启用',
        inactive: '停用',
        pending: '待处理',
        completed: '已完成',
        cancelled: '已取消',
        processing: '处理中'
    };
    const map = { ...defaultMap, ...labelMap };
    return map[status] || status;
};

/**
 * 截断文本
 * @param {string} text - 文本
 * @param {number} maxLength - 最大长度
 * @returns {string}
 */
export const truncateText = (text, maxLength = 50) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
};

/**
 * 判断是否为空值
 * @param {*} value - 要检查的值
 * @returns {boolean}
 */
export const isEmpty = (value) => {
    if (value === null || value === undefined) return true;
    if (typeof value === 'string') return value.trim() === '';
    if (Array.isArray(value)) return value.length === 0;
    if (typeof value === 'object') return Object.keys(value).length === 0;
    return false;
};

export default {
    formatCurrency,
    formatDate,
    formatDateTime,
    generateId,
    deepClone,
    debounce,
    throttle,
    getQueryParam,
    buildQueryString,
    getStatusColor,
    getStatusLabel,
    truncateText,
    isEmpty
};