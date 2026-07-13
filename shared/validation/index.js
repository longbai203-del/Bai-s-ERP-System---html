/**
 * shared/validation/index.js - 共享校验规则
 * 前后端共用，确保数据一致性
 * 
 * @module validation
 */

// ============================================================
// 基础校验规则
// ============================================================

/**
 * 检查是否为空
 * @param {*} value - 要检查的值
 * @param {string} fieldName - 字段名称
 * @returns {string|null} 错误信息或 null
 */
export function isRequired(value, fieldName) {
    if (value === undefined || value === null || value === '') {
        return `${fieldName} 不能为空`;
    }
    if (typeof value === 'string' && value.trim() === '') {
        return `${fieldName} 不能为空`;
    }
    if (Array.isArray(value) && value.length === 0) {
        return `${fieldName} 不能为空`;
    }
    return null;
}

/**
 * 检查是否为有效的邮箱
 * @param {string} email - 邮箱地址
 * @returns {string|null} 错误信息或 null
 */
export function isValidEmail(email) {
    if (!email) return null; // 允许为空
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return '请输入有效的邮箱地址';
    }
    return null;
}

/**
 * 检查是否为有效的手机号（沙特格式）
 * @param {string} phone - 手机号
 * @returns {string|null} 错误信息或 null
 */
export function isValidPhone(phone) {
    if (!phone) return null; // 允许为空
    const clean = phone.replace(/\s/g, '');
    // 沙特手机号: 05xxxxxxxx 或 +9665xxxxxxxx
    const phoneRegex = /^(05|\+9665)\d{8}$/;
    if (!phoneRegex.test(clean)) {
        return '请输入有效的手机号（05xxxxxxxx 或 +9665xxxxxxxx）';
    }
    return null;
}

/**
 * 检查密码强度
 * @param {string} password - 密码
 * @param {number} minLength - 最小长度
 * @returns {string|null} 错误信息或 null
 */
export function isValidPassword(password, minLength = 6) {
    if (!password) {
        return '密码不能为空';
    }
    if (password.length < minLength) {
        return `密码至少需要 ${minLength} 位字符`;
    }
    return null;
}

/**
 * 检查是否为有效的金额
 * @param {number|string} amount - 金额
 * @param {boolean} allowZero - 是否允许为0
 * @returns {string|null} 错误信息或 null
 */
export function isValidAmount(amount, allowZero = false) {
    const num = parseFloat(amount);
    if (isNaN(num)) {
        return '请输入有效的数字';
    }
    if (!allowZero && num <= 0) {
        return '金额必须大于0';
    }
    if (allowZero && num < 0) {
        return '金额不能为负数';
    }
    return null;
}

/**
 * 检查是否为有效的整数
 * @param {*} value - 要检查的值
 * @param {number} min - 最小值
 * @param {number} max - 最大值
 * @returns {string|null} 错误信息或 null
 */
export function isValidInteger(value, min = 0, max = Infinity) {
    const num = parseInt(value);
    if (isNaN(num)) {
        return '请输入有效的整数';
    }
    if (num < min) {
        return `数值不能小于 ${min}`;
    }
    if (num > max) {
        return `数值不能大于 ${max}`;
    }
    return null;
}

/**
 * 检查是否为有效的日期
 * @param {string} date - 日期字符串
 * @returns {string|null} 错误信息或 null
 */
export function isValidDate(date) {
    if (!date) return null;
    const d = new Date(date);
    if (isNaN(d.getTime())) {
        return '请输入有效的日期';
    }
    return null;
}

/**
 * 检查字符串长度
 * @param {string} value - 字符串
 * @param {number} min - 最小长度
 * @param {number} max - 最大长度
 * @param {string} fieldName - 字段名称
 * @returns {string|null} 错误信息或 null
 */
export function isLengthValid(value, min, max, fieldName) {
    if (!value) return null;
    if (value.length < min) {
        return `${fieldName} 至少需要 ${min} 个字符`;
    }
    if (value.length > max) {
        return `${fieldName} 不能超过 ${max} 个字符`;
    }
    return null;
}

/**
 * 检查是否为有效的车牌号
 * @param {string} plate - 车牌号
 * @returns {string|null} 错误信息或 null
 */
export function isValidPlate(plate) {
    if (!plate) return null;
    const clean = plate.replace(/\s/g, '').toUpperCase();
    // 简单车牌格式：字母+数字组合，3-8位
    if (!/^[A-Z0-9\-]{3,8}$/.test(clean)) {
        return '请输入有效的车牌号';
    }
    return null;
}

/**
 * 检查是否为有效的 UUID
 * @param {string} uuid - UUID
 * @returns {string|null} 错误信息或 null
 */
export function isValidUUID(uuid) {
    if (!uuid) return null;
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(uuid)) {
        return '无效的 ID 格式';
    }
    return null;
}

// ============================================================
// 实体校验规则
// ============================================================

/**
 * 验证用户注册数据
 * @param {Object} data - 用户数据
 * @param {string} data.username - 用户名
 * @param {string} data.password - 密码
 * @param {string} data.name - 姓名
 * @param {string} data.phone - 手机号
 * @param {string} data.email - 邮箱
 * @returns {string[]} 错误列表
 */
export function validateUserRegister(data) {
    const errors = [];
    
    const usernameError = isRequired(data.username, '用户名');
    if (usernameError) errors.push(usernameError);
    
    const passwordError = isValidPassword(data.password);
    if (passwordError) errors.push(passwordError);
    
    if (data.name) {
        const nameError = isLengthValid(data.name, 2, 50, '姓名');
        if (nameError) errors.push(nameError);
    }
    
    if (data.phone) {
        const phoneError = isValidPhone(data.phone);
        if (phoneError) errors.push(phoneError);
    }
    
    if (data.email) {
        const emailError = isValidEmail(data.email);
        if (emailError) errors.push(emailError);
    }
    
    return errors;
}

/**
 * 验证用户登录数据
 * @param {Object} data - 登录数据
 * @param {string} data.username - 用户名
 * @param {string} data.password - 密码
 * @returns {string[]} 错误列表
 */
export function validateUserLogin(data) {
    const errors = [];
    
    const usernameError = isRequired(data.username, '用户名');
    if (usernameError) errors.push(usernameError);
    
    const passwordError = isRequired(data.password, '密码');
    if (passwordError) errors.push(passwordError);
    
    return errors;
}

/**
 * 验证客户数据
 * @param {Object} data - 客户数据
 * @param {string} data.name - 客户姓名
 * @param {string} data.phone - 手机号
 * @param {string} data.email - 邮箱
 * @param {string} data.level - 等级
 * @param {string} data.address - 地址
 * @returns {string[]} 错误列表
 */
export function validateCustomer(data) {
    const errors = [];
    
    const nameError = isRequired(data.name, '客户姓名');
    if (nameError) errors.push(nameError);
    
    const phoneError = isRequired(data.phone, '手机号');
    if (phoneError) errors.push(phoneError);
    
    if (data.phone) {
        const phoneFormatError = isValidPhone(data.phone);
        if (phoneFormatError) errors.push(phoneFormatError);
    }
    
    if (data.email) {
        const emailError = isValidEmail(data.email);
        if (emailError) errors.push(emailError);
    }
    
    return errors;
}

/**
 * 验证商品数据
 * @param {Object} data - 商品数据
 * @param {string} data.name - 商品名称
 * @param {number} data.price - 售价
 * @param {number} data.cost - 成本价
 * @param {number} data.stock_quantity - 库存数量
 * @param {string} data.unit - 单位
 * @returns {string[]} 错误列表
 */
export function validateProduct(data) {
    const errors = [];
    
    const nameError = isRequired(data.name, '商品名称');
    if (nameError) errors.push(nameError);
    
    if (data.price !== undefined) {
        const priceError = isValidAmount(data.price, true);
        if (priceError) errors.push(priceError);
    }
    
    if (data.cost !== undefined) {
        const costError = isValidAmount(data.cost, true);
        if (costError) errors.push(costError);
    }
    
    if (data.stock_quantity !== undefined) {
        const stockError = isValidInteger(data.stock_quantity, 0);
        if (stockError) errors.push(stockError);
    }
    
    if (data.unit) {
        const unitError = isLengthValid(data.unit, 1, 20, '单位');
        if (unitError) errors.push(unitError);
    }
    
    return errors;
}

/**
 * 验证订单数据
 * @param {Object} data - 订单数据
 * @param {Array} data.items - 订单项
 * @param {number} data.total_amount - 总金额
 * @param {string} data.customer_id - 客户ID
 * @param {string} data.payment_method - 支付方式
 * @returns {string[]} 错误列表
 */
export function validateOrder(data) {
    const errors = [];
    
    if (!data.items || data.items.length === 0) {
        errors.push('订单至少包含一个商品');
    }
    
    if (data.total_amount === undefined || data.total_amount <= 0) {
        errors.push('订单总金额必须大于0');
    }
    
    if (data.items && data.items.length > 0) {
        data.items.forEach((item, index) => {
            if (!item.product_id) {
                errors.push(`第 ${index + 1} 个商品缺少 product_id`);
            }
            if (!item.quantity || item.quantity <= 0) {
                errors.push(`第 ${index + 1} 个商品数量必须大于0`);
            }
        });
    }
    
    if (data.payment_method) {
        const validMethods = ['cash', 'mada', 'visa', 'mastercard', 'apple_pay', 'google_pay', 'bank_transfer'];
        if (!validMethods.includes(data.payment_method)) {
            errors.push('无效的支付方式');
        }
    }
    
    return errors;
}

/**
 * 验证员工数据
 * @param {Object} data - 员工数据
 * @param {string} data.username - 用户名
 * @param {string} data.password - 密码
 * @param {string} data.name - 姓名
 * @param {string} data.role - 角色
 * @param {string} data.phone - 手机号
 * @returns {string[]} 错误列表
 */
export function validateEmployee(data) {
    const errors = [];
    
    const usernameError = isRequired(data.username, '用户名');
    if (usernameError) errors.push(usernameError);
    
    const passwordError = isValidPassword(data.password);
    if (passwordError) errors.push(passwordError);
    
    if (data.name) {
        const nameError = isLengthValid(data.name, 2, 50, '姓名');
        if (nameError) errors.push(nameError);
    }
    
    if (data.phone) {
        const phoneError = isValidPhone(data.phone);
        if (phoneError) errors.push(phoneError);
    }
    
    if (data.role) {
        const validRoles = ['admin', 'manager', 'cashier', 'employee'];
        if (!validRoles.includes(data.role)) {
            errors.push('无效的角色');
        }
    }
    
    return errors;
}

/**
 * 验证库存数据
 * @param {Object} data - 库存数据
 * @param {string} data.product_id - 商品ID
 * @param {number} data.quantity - 数量
 * @param {number} data.unit_price - 单价
 * @param {string} data.warehouse_id - 仓库ID
 * @returns {string[]} 错误列表
 */
export function validateInventory(data) {
    const errors = [];
    
    const productError = isRequired(data.product_id, '商品ID');
    if (productError) errors.push(productError);
    
    if (data.quantity !== undefined) {
        const qtyError = isValidInteger(data.quantity, 1);
        if (qtyError) errors.push(qtyError);
    }
    
    if (data.unit_price !== undefined) {
        const priceError = isValidAmount(data.unit_price, true);
        if (priceError) errors.push(priceError);
    }
    
    return errors;
}

/**
 * 验证车辆记录数据
 * @param {Object} data - 车辆记录数据
 * @param {string} data.plate - 车牌号
 * @param {string} data.vehicle_type - 车辆类型
 * @param {string} data.operator_id - 操作人ID
 * @returns {string[]} 错误列表
 */
export function validateVehicleRecord(data) {
    const errors = [];
    
    const plateError = isRequired(data.plate, '车牌号');
    if (plateError) errors.push(plateError);
    
    if (data.plate) {
        const plateFormatError = isValidPlate(data.plate);
        if (plateFormatError) errors.push(plateFormatError);
    }
    
    if (data.vehicle_type) {
        const validTypes = ['sedan', 'suv', 'truck', 'van', 'sports', 'other'];
        if (!validTypes.includes(data.vehicle_type)) {
            errors.push('无效的车辆类型');
        }
    }
    
    return errors;
}

/**
 * 验证考勤数据
 * @param {Object} data - 考勤数据
 * @param {string} data.type - 打卡类型: in/out
 * @param {string} data.employee_id - 员工ID
 * @param {string} data.location - 打卡位置
 * @returns {string[]} 错误列表
 */
export function validateAttendance(data) {
    const errors = [];
    
    const typeError = isRequired(data.type, '打卡类型');
    if (typeError) errors.push(typeError);
    
    if (data.type && !['in', 'out'].includes(data.type)) {
        errors.push('无效的打卡类型，请使用 in 或 out');
    }
    
    const employeeError = isRequired(data.employee_id, '员工ID');
    if (employeeError) errors.push(employeeError);
    
    return errors;
}

// ============================================================
// 工具函数
// ============================================================

/**
 * 批量验证
 * @param {Array<Function>} validations - 验证函数数组
 * @returns {string[]} 合并后的错误列表
 */
export function validateAll(validations) {
    const allErrors = [];
    validations.forEach(fn => {
        if (typeof fn === 'function') {
            const result = fn();
            if (result && Array.isArray(result)) {
                allErrors.push(...result);
            } else if (result && typeof result === 'string') {
                allErrors.push(result);
            }
        }
    });
    return allErrors;
}

/**
 * 创建统一的验证响应
 * @param {string[]} errors - 错误列表
 * @returns {Object|null} 验证失败响应对象，成功返回 null
 */
export function validationResponse(errors) {
    if (!errors || errors.length === 0) return null;
    return {
        success: false,
        error: '参数验证失败',
        errors: errors,
        code: 'VALIDATION_ERROR'
    };
}

// ============================================================
// 导出所有
// ============================================================

export default {
    // 基础校验
    isRequired,
    isValidEmail,
    isValidPhone,
    isValidPassword,
    isValidAmount,
    isValidInteger,
    isValidDate,
    isLengthValid,
    isValidPlate,
    isValidUUID,
    
    // 实体校验
    validateUserRegister,
    validateUserLogin,
    validateCustomer,
    validateProduct,
    validateOrder,
    validateEmployee,
    validateInventory,
    validateVehicleRecord,
    validateAttendance,
    
    // 工具
    validateAll,
    validationResponse
};