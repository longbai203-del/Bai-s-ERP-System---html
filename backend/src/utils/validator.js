/**
 * @file validator.js
 * @description 数据验证工具 - 修复版
 * @module utils/validator
 */

export const required = (value, fieldName = '此字段') => {
    if (value === undefined || value === null || String(value).trim() === '') {
        return { valid: false, message: `${fieldName}为必填项` };
    }
    return { valid: true };
};

export const email = (email) => {
    if (!email) return { valid: true };
    const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!pattern.test(email)) {
        return { valid: false, message: '请输入有效的邮箱地址' };
    }
    return { valid: true };
};

export const phone = (phone) => {
    if (!phone) return { valid: true };
    const pattern = /^1[3-9]\d{9}$/;
    if (!pattern.test(phone)) {
        return { valid: false, message: '请输入有效的手机号' };
    }
    return { valid: true };
};

export const length = (value, options = {}, fieldName = '此字段') => {
    const str = String(value || '');
    const { min = 0, max = Infinity } = options;
    if (str.length < min) {
        return { valid: false, message: `${fieldName}至少${min}个字符` };
    }
    if (str.length > max) {
        return { valid: false, message: `${fieldName}最多${max}个字符` };
    }
    return { valid: true };
};

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
    return { valid: true };
};

export const integer = (value, options = {}, fieldName = '此字段') => {
    const num = Number(value);
    if (!Number.isInteger(num)) {
        return { valid: false, message: `${fieldName}必须是整数` };
    }
    return number(value, options, fieldName);
};

export const password = (password) => {
    if (!password || password.length < 6) {
        return { valid: false, message: '密码至少6个字符' };
    }
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    if (!hasLetter || !hasNumber) {
        return { valid: false, message: '密码必须包含字母和数字' };
    }
    return { valid: true };
};

export const url = (url) => {
    if (!url) return { valid: true };
    try {
        new URL(url);
        return { valid: true };
    } catch {
        return { valid: false, message: '请输入有效的URL地址' };
    }
};

export const oneOf = (value, allowedValues, fieldName = '此字段') => {
    if (!allowedValues.includes(value)) {
        return { valid: false, message: `${fieldName}的值无效` };
    }
    return { valid: true };
};

/**
 * 验证对象
 * @param {Object} data - 要验证的对象
 * @param {Object} schema - 验证规则
 * @returns {ValidationResult}
 */
export const validate = (data, schema) => {
    for (const [field, rules] of Object.entries(schema)) {
        const value = data[field];
        for (const rule of rules) {
            // 确保 rule 是函数
            if (typeof rule !== 'function') {
                continue;
            }
            const result = rule(value, field);
            if (result && result.valid === false) {
                return result;
            }
        }
    }
    return { valid: true };
};

export default {
    required,
    email,
    phone,
    length,
    number,
    integer,
    password,
    url,
    oneOf,
    validate
};