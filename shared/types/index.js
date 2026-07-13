/**
 * shared/types/index.js - 共享类型定义
 * 使用 JSDoc 提供类型提示，供前后端共用
 * 
 * @module types
 */

/**
 * @typedef {Object} User
 * @property {string} id - 用户ID (UUID)
 * @property {string} username - 用户名
 * @property {string} email - 邮箱
 * @property {string} name - 姓名
 * @property {string} full_name - 全名
 * @property {string} phone - 手机号
 * @property {string} role - 角色: owner/admin/manager/cashier/employee
 * @property {string} status - 状态: pending/approved/rejected/suspended
 * @property {string} tenant_id - 租户ID
 * @property {string} store_id - 门店ID
 * @property {string} created_at - 创建时间
 * @property {string} updated_at - 更新时间
 * @property {string} last_login_at - 最后登录时间
 */

/**
 * @typedef {Object} Customer
 * @property {string} id - 客户ID (UUID)
 * @property {string} tenant_id - 租户ID
 * @property {string} store_id - 门店ID
 * @property {string} name - 客户姓名
 * @property {string} phone - 手机号
 * @property {string} email - 邮箱
 * @property {string} address - 地址
 * @property {string} level - 等级: vip/gold/silver/bronze
 * @property {number} points - 积分
 * @property {number} total_spent - 累计消费
 * @property {number} total_orders - 总订单数
 * @property {string} last_visit - 最后访问时间
 * @property {string} status - 状态: active/inactive
 * @property {string} notes - 备注
 * @property {string} created_at - 创建时间
 * @property {string} updated_at - 更新时间
 */

/**
 * @typedef {Object} Product
 * @property {string} id - 商品ID (UUID)
 * @property {string} tenant_id - 租户ID
 * @property {string} category_id - 分类ID
 * @property {string} name - 商品名称
 * @property {string} description - 描述
 * @property {string} sku - SKU编码 (唯一)
 * @property {string} barcode - 条码
 * @property {string} unit - 单位: piece/kg/liter/service
 * @property {number} price - 售价
 * @property {number} cost - 成本价
 * @property {number} wholesale_price - 批发价
 * @property {number} stock_quantity - 库存数量
 * @property {number} min_stock - 最低库存预警
 * @property {number} max_stock - 最高库存
 * @property {number} weight - 重量
 * @property {number} vat_rate - VAT税率
 * @property {string} status - 状态: active/inactive
 * @property {boolean} is_service - 是否为服务
 * @property {Object} attributes - 属性 (JSON)
 * @property {string[]} images - 图片URL数组
 * @property {string} created_at - 创建时间
 * @property {string} updated_at - 更新时间
 */

/**
 * @typedef {Object} Order
 * @property {string} id - 订单ID (UUID)
 * @property {string} tenant_id - 租户ID
 * @property {string} store_id - 门店ID
 * @property {string} order_number - 订单号 (唯一)
 * @property {string} customer_id - 客户ID
 * @property {string} customer_name - 客户姓名
 * @property {string} customer_phone - 客户手机
 * @property {string} vehicle_id - 车辆ID
 * @property {number} subtotal - 小计
 * @property {number} discount_amount - 折扣金额
 * @property {number} discount_percent - 折扣百分比
 * @property {number} vat_rate - VAT税率
 * @property {number} vat_amount - VAT金额
 * @property {number} total_amount - 总计
 * @property {string} status - 状态: pending/processing/completed/cancelled
 * @property {string} payment_status - 支付状态: unpaid/paid/partially
 * @property {string} payment_method - 支付方式: cash/mada/visa/apple_pay
 * @property {string} source - 来源: pos/web/app
 * @property {string} notes - 备注
 * @property {string} created_by - 创建人ID
 * @property {string} created_at - 创建时间
 * @property {string} updated_at - 更新时间
 * @property {string} completed_at - 完成时间
 */

/**
 * @typedef {Object} OrderItem
 * @property {string} id - 明细ID (UUID)
 * @property {string} order_id - 订单ID
 * @property {string} product_id - 商品ID
 * @property {string} product_name - 商品名称
 * @property {string} product_sku - 商品SKU
 * @property {number} quantity - 数量
 * @property {number} unit_price - 单价
 * @property {number} discount_amount - 折扣金额
 * @property {number} vat_rate - VAT税率
 * @property {number} vat_amount - VAT金额
 * @property {number} total_price - 总价
 * @property {string} notes - 备注
 * @property {string} created_at - 创建时间
 */

/**
 * @typedef {Object} Employee
 * @property {string} id - 员工ID (UUID)
 * @property {string} tenant_id - 租户ID
 * @property {string} store_id - 门店ID
 * @property {string} user_id - 关联用户ID
 * @property {string} employee_number - 工号 (唯一)
 * @property {string} full_name - 姓名
 * @property {string} phone - 手机号
 * @property {string} email - 邮箱
 * @property {string} department - 部门
 * @property {string} position - 职位
 * @property {number} salary - 薪资
 * @property {string} hire_date - 入职日期
 * @property {string} termination_date - 离职日期
 * @property {string} status - 状态: active/inactive
 * @property {string} notes - 备注
 * @property {string} created_at - 创建时间
 * @property {string} updated_at - 更新时间
 */

/**
 * @typedef {Object} InventoryItem
 * @property {string} id - 库存ID (UUID)
 * @property {string} tenant_id - 租户ID
 * @property {string} warehouse_id - 仓库ID
 * @property {string} product_id - 商品ID
 * @property {string} batch_number - 批次号
 * @property {string} serial_number - 序列号
 * @property {number} quantity - 数量
 * @property {number} reserved_quantity - 预留数量
 * @property {number} min_stock - 最低库存
 * @property {number} max_stock - 最高库存
 * @property {string} expiry_date - 过期日期
 * @property {string} created_at - 创建时间
 * @property {string} updated_at - 更新时间
 */

/**
 * @typedef {Object} VehicleRecord
 * @property {string} id - 记录ID (UUID)
 * @property {string} tenant_id - 租户ID
 * @property {string} store_id - 门店ID
 * @property {string} plate - 车牌号
 * @property {string} plate_color - 车牌颜色
 * @property {string} vehicle_type - 车辆类型: sedan/suv/truck
 * @property {string} vehicle_brand - 品牌
 * @property {string} vehicle_model - 型号
 * @property {string} vehicle_color - 颜色
 * @property {string} entry_time - 入场时间
 * @property {string} exit_time - 出场时间
 * @property {number} duration_minutes - 停留时长(分钟)
 * @property {string} note - 备注
 * @property {string} operator_id - 操作人ID
 * @property {string} created_at - 创建时间
 * @property {string} updated_at - 更新时间
 */

/**
 * @typedef {Object} Attendance
 * @property {string} id - 考勤ID (UUID)
 * @property {string} employee_id - 员工ID
 * @property {string} staff_name - 员工姓名
 * @property {string} date - 日期
 * @property {string} check_in_time - 上班打卡时间
 * @property {string} check_out_time - 下班打卡时间
 * @property {number} work_hours - 工作时长(小时)
 * @property {string} check_in_location - 上班打卡位置
 * @property {string} check_out_location - 下班打卡位置
 * @property {string} status - 状态: present/absent/leave
 * @property {string} tenant_id - 租户ID
 * @property {string} store_id - 门店ID
 * @property {string} created_at - 创建时间
 * @property {string} updated_at - 更新时间
 */

/**
 * @typedef {Object} ApiResponse
 * @property {boolean} success - 是否成功
 * @property {*} [data] - 返回数据
 * @property {string} [message] - 消息
 * @property {string} [error] - 错误信息
 * @property {string} [code] - 错误码
 * @property {string[]} [errors] - 错误列表
 */

/**
 * @typedef {Object} PaginationParams
 * @property {number} page - 当前页码 (默认1)
 * @property {number} limit - 每页数量 (默认20)
 */

/**
 * @typedef {Object} PaginationResult
 * @property {number} page - 当前页码
 * @property {number} limit - 每页数量
 * @property {number} total - 总记录数
 * @property {number} totalPages - 总页数
 */

// ============================================================
// 导出类型 (供 JSDoc 引用)
// ============================================================

/**
 * 角色类型
 * @typedef {'owner' | 'admin' | 'manager' | 'cashier' | 'employee'} UserRole
 */

/**
 * 订单状态
 * @typedef {'pending' | 'processing' | 'completed' | 'cancelled'} OrderStatus
 */

/**
 * 支付状态
 * @typedef {'unpaid' | 'paid' | 'partially'} PaymentStatus
 */

/**
 * 客户等级
 * @typedef {'vip' | 'gold' | 'silver' | 'bronze'} CustomerLevel
 */

/**
 * 用户状态
 * @typedef {'pending' | 'approved' | 'rejected' | 'suspended'} UserStatus
 */

/**
 * 支付方式
 * @typedef {'cash' | 'mada' | 'visa' | 'mastercard' | 'apple_pay' | 'google_pay' | 'bank_transfer'} PaymentMethod
 */

export default {
    // 这里只是为了导出模块，实际类型通过 JSDoc 使用
};
// ============================================================
// 导出模块（供 import 使用）
// ============================================================

/**
 * 创建类型定义对象，方便 IDE 识别
 * @param {T} value - 类型定义值
 * @returns {T}
 * @template T
 */
export function createType(value) {
    return value;
}

// 导出所有类型，供其他模块引用
export const Types = {
    User: null,
    Customer: null,
    Product: null,
    Order: null,
    OrderItem: null,
    Employee: null,
    InventoryItem: null,
    VehicleRecord: null,
    Attendance: null,
    ApiResponse: null,
    PaginationParams: null,
    PaginationResult: null
};

// 导出常用类型别名
export const UserRole = {
    OWNER: 'owner',
    ADMIN: 'admin',
    MANAGER: 'manager',
    CASHIER: 'cashier',
    EMPLOYEE: 'employee'
};

export const OrderStatus = {
    PENDING: 'pending',
    PROCESSING: 'processing',
    COMPLETED: 'completed',
    CANCELLED: 'cancelled'
};

export const PaymentStatus = {
    UNPAID: 'unpaid',
    PAID: 'paid',
    PARTIALLY: 'partially'
};

export const CustomerLevel = {
    VIP: 'vip',
    GOLD: 'gold',
    SILVER: 'silver',
    BRONZE: 'bronze'
};

export const PaymentMethod = {
    CASH: 'cash',
    MADA: 'mada',
    VISA: 'visa',
    MASTERCARD: 'mastercard',
    APPLE_PAY: 'apple_pay',
    GOOGLE_PAY: 'google_pay',
    BANK_TRANSFER: 'bank_transfer'
};