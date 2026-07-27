/**
 * @file constants.js
 * @description 全局常量定义
 * @module utils/constants
 */

/**
 * 订单状态
 * @readonly
 * @enum {string}
 */
export const ORDER_STATUS = {
    PENDING: 'pending',
    CONFIRMED: 'confirmed',
    PROCESSING: 'processing',
    COMPLETED: 'completed',
    CANCELLED: 'cancelled'
};

/**
 * 订单状态标签
 */
export const ORDER_STATUS_LABELS = {
    [ORDER_STATUS.PENDING]: '待处理',
    [ORDER_STATUS.CONFIRMED]: '已确认',
    [ORDER_STATUS.PROCESSING]: '处理中',
    [ORDER_STATUS.COMPLETED]: '已完成',
    [ORDER_STATUS.CANCELLED]: '已取消'
};

/**
 * 订单状态颜色
 */
export const ORDER_STATUS_COLORS = {
    [ORDER_STATUS.PENDING]: 'warning',
    [ORDER_STATUS.CONFIRMED]: 'info',
    [ORDER_STATUS.PROCESSING]: 'info',
    [ORDER_STATUS.COMPLETED]: 'success',
    [ORDER_STATUS.CANCELLED]: 'danger'
};

/**
 * 用户角色
 * @readonly
 * @enum {string}
 */
export const USER_ROLES = {
    OWNER: 'owner',
    ADMIN: 'admin',
    MANAGER: 'manager',
    CASHIER: 'cashier',
    EMPLOYEE: 'employee'
};

/**
 * 用户角色标签
 */
export const USER_ROLE_LABELS = {
    [USER_ROLES.OWNER]: '老板',
    [USER_ROLES.ADMIN]: '管理员',
    [USER_ROLES.MANAGER]: '店长',
    [USER_ROLES.CASHIER]: '收银员',
    [USER_ROLES.EMPLOYEE]: '员工'
};

/**
 * 权限列表
 * @readonly
 * @enum {string}
 */
export const PERMISSIONS = {
    DASHBOARD: 'dashboard',
    ORDERS: 'orders',
    PRODUCTS: 'products',
    CUSTOMERS: 'customers',
    INVENTORY: 'inventory',
    REPORTS: 'reports',
    ATTENDANCE: 'attendance',
    EMPLOYEES: 'employees',
    SETTINGS: 'settings',
    VEHICLE_MONITOR: 'vehicle-monitor',
    PERMISSION: 'permission'
};

/**
 * 角色权限映射
 */
export const ROLE_PERMISSIONS = {
    [USER_ROLES.OWNER]: Object.values(PERMISSIONS),
    [USER_ROLES.ADMIN]: Object.values(PERMISSIONS),
    [USER_ROLES.MANAGER]: [
        PERMISSIONS.DASHBOARD,
        PERMISSIONS.ORDERS,
        PERMISSIONS.PRODUCTS,
        PERMISSIONS.CUSTOMERS,
        PERMISSIONS.INVENTORY,
        PERMISSIONS.REPORTS,
        PERMISSIONS.ATTENDANCE
    ],
    [USER_ROLES.CASHIER]: [
        PERMISSIONS.DASHBOARD,
        PERMISSIONS.ORDERS,
        PERMISSIONS.CUSTOMERS
    ],
    [USER_ROLES.EMPLOYEE]: [
        PERMISSIONS.DASHBOARD,
        PERMISSIONS.ATTENDANCE
    ]
};

/**
 * API 端点
 */
export const API_ENDPOINTS = {
    AUTH: {
        LOGIN: '/auth/login',
        LOGOUT: '/auth/logout',
        REGISTER: '/auth/register',
        ME: '/auth/me'
    },
    ORDERS: {
        BASE: '/orders',
        LIST: '/orders',
        DETAIL: (id) => `/orders/${id}`,
        STATUS: (id) => `/orders/${id}/status'
    },
    PRODUCTS: {
        BASE: '/products',
        LIST: '/products',
        DETAIL: (id) => `/products/${id}`
    },
    CUSTOMERS: {
        BASE: '/customers',
        LIST: '/customers',
        DETAIL: (id) => `/customers/${id}`
    },
    DASHBOARD: {
        STATS: '/dashboard/stats',
        CHART: '/dashboard/chart'
    }
};

/**
 * 分页默认配置
 */
export const PAGINATION_DEFAULTS = {
    page: 1,
    pageSize: 20,
    maxPageSize: 100
};

/**
 * 应用名称
 */
export const APP_NAME = 'Bai\'s ERP';

/**
 * 版本号
 */
export const APP_VERSION = '2.0.0';

export default {
    ORDER_STATUS,
    ORDER_STATUS_LABELS,
    ORDER_STATUS_COLORS,
    USER_ROLES,
    USER_ROLE_LABELS,
    PERMISSIONS,
    ROLE_PERMISSIONS,
    API_ENDPOINTS,
    PAGINATION_DEFAULTS,
    APP_NAME,
    APP_VERSION
};