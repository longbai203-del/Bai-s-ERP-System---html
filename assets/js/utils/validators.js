/**
 * @file validators.js
 * @description 表单验证工具
 * @module utils/validators
 */

/**
 * 验证结果对象
 * @typedef {Object} ValidationResult
 * @property {boolean} valid - 是否有效
 * @property {string} message - 错误信息
 */

/**
 * 验证必填
 * @param {*} value - 要验证的值
 * @param {string} fieldName - 字段名称
 * @returns {ValidationResult}
 */
export const required = (value, fieldName = '此字段') => {
    if (value === undefined || value === null || String(value).trim() === '') {
        return { valid: false, message: `${fieldName}为必填项` };
    }
    return { valid: true, message: '' };
};

/**
 * 验证邮箱
 * @param {string} email - 邮箱地址
 * @returns {ValidationResult}
 */
export const email = (email) => {
    if (!email) return { valid: true, message: '' };
    const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!pattern.test(email)) {
        return { valid: false, message: '请输入有效的邮箱地址' };
    }
    return { valid: true, message: '' };
};

/**
 * 验证手机号
 * @param {string} phone - 手机号
 * @returns {ValidationResult}
 */
export const phone = (phone) => {
    if (!phone) return { valid: true, message: '' };
    const pattern = /^1[3-9]\d{9}$/;
    if (!pattern.test(phone)) {
        return { valid: false, message: '请输入有效的手机号' };
    }
    return { valid: true, message: '' };
};

/**
 * 验证长度
 * @param {*} value - 要验证的值
 * @param {Object} options - 选项 { min, max }
 * @param {string} fieldName - 字段名称
 * @returns {ValidationResult}
 */
export const length = (value, options = {}, fieldName = '此字段') => {
    const str = String(value || '');
    const { min = 0, max = Infinity } = options;
    if (str.length < min) {
        return { valid: false, message: `${fieldName}至少${min}个字符` };
    }
    if (str.length > max) {
        return { valid: false, message: `${fieldName}最多${max}个字符` };
    }
    return { valid: true, message: '' };
};

/**
 * 验证数字
 * @param {*} value - 要验证的值
 * @param {Object} options - 选项 { min, max }
 * @param {string} fieldName - 字段名称
 * @returns {ValidationResult}
 */
export const number = (value, options = {}, fieldName = '此字段') => {
    const num = Number(value);
    if (isNaN(num)) {
        return { valid: false, message: `${fieldName}必须是数字` };
    }
    const { min = -Infinity, max = Infinity } = options;
    if (num < min) {
        return { valid: false, message: `${fieldName}不能小于${min}` };
    }
    if (num > max) {
        return { valid: false, message: `${fieldName}不能大于${max}` };
    }
    return { valid: true, message: '' };
};

/**
 * 验证整数
 * @param {*} value - 要验证的值
 * @param {Object} options - 选项 { min, max }
 * @param {string} fieldName - 字段名称
 * @returns {ValidationResult}
 */
export const integer = (value, options = {}, fieldName = '此字段') => {
    const num = Number(value);
    if (!Number.isInteger(num)) {
        return { valid: false, message: `${fieldName}必须是整数` };
    }
    return number(value, options, fieldName);
};

/**
 * 验证URL
 * @param {string} url - URL地址
 * @returns {ValidationResult}
 */
export const url = (url) => {
    if (!url) return { valid: true, message: '' };
    try {
        new URL(url);
        return { valid: true, message: '' };
    } catch {
        return { valid: false, message: '请输入有效的URL地址' };
    }
};

/**
 * 验证密码强度
 * @param {string} password - 密码
 * @returns {ValidationResult}
 */
export const password = (password) => {
    if (!password || password.length < 6) {
        return { valid: false, message: '密码至少6个字符' };
    }
    // 检查是否包含数字和字母
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    if (!hasLetter || !hasNumber) {
        return { valid: false, message: '密码必须包含字母和数字' };
    }
    return { valid: true, message: '' };
};

/**
 * 验证确认密码
 * @param {string} password - 密码
 * @param {string} confirm - 确认密码
 * @returns {ValidationResult}
 */
export const confirmPassword = (password, confirm) => {
    if (password !== confirm) {
        return { valid: false, message: '两次输入的密码不一致' };
    }
    return { valid: true, message: '' };
};

/**
 * 组合验证
 * @param {*} value - 要验证的值
 * @param {Array<Function>} validators - 验证函数数组
 * @returns {ValidationResult}
 */
export const compose = (value, validators) => {
    for (const validator of validators) {
        const result = validator(value);
        if (!result.valid) return result;
    }
    return { valid: true, message: '' };
};

export default {
    required,
    email,
    phone,
    length,
    number,
    integer,
    url,
    password,
    confirmPassword,
    compose
};