/**
 * @file constants.js
 * @description 应用常量定义
 */

export const API_ENDPOINTS = {
    AUTH: {
        LOGIN: '/auth/login',
        REGISTER: '/auth/register',
        LOGOUT: '/auth/logout',
        ME: '/auth/me',
        REFRESH: '/auth/refresh'
    },
    ORDERS: {
        LIST: '/orders',
        DETAIL: (id) => `/orders/${id}`,
        STATUS: (id) => `/orders/${id}/status`
    },
    PRODUCTS: {
        LIST: '/products',
        DETAIL: (id) => `/products/${id}`,
        STOCK: (id) => `/products/${id}/stock`
    },
    CUSTOMERS: {
        LIST: '/customers',
        DETAIL: (id) => `/customers/${id}`
    },
    DASHBOARD: {
        STATS: '/dashboard/stats',
        CHART: '/dashboard/chart',
        TODAY: '/dashboard/today',
        ACTIVITIES: '/dashboard/activities'
    }
};

export const ORDER_STATUS = {
    PENDING: 'pending',
    CONFIRMED: 'confirmed',
    PROCESSING: 'processing',
    COMPLETED: 'completed',
    CANCELLED: 'cancelled'
};

export const PAYMENT_STATUS = {
    UNPAID: 'unpaid',
    PAID: 'paid',
    PARTIAL: 'partial',
    REFUNDED: 'refunded'
};

export const USER_ROLES = {
    ADMIN: 'admin',
    MANAGER: 'manager',
    USER: 'user',
    OWNER: 'owner'
};

export const CUSTOMER_LEVELS = {
    VIP: 'vip',
    GOLD: 'gold',
    SILVER: 'silver',
    BRONZE: 'bronze'
};

export const PRODUCT_STATUS = {
    ACTIVE: 'active',
    INACTIVE: 'inactive',
    DRAFT: 'draft'
};

export const PAGINATION = {
    DEFAULT_PAGE: 1,
    DEFAULT_PAGE_SIZE: 20,
    PAGE_SIZE_OPTIONS: [10, 20, 50, 100]
};

export const DATE_FORMATS = {
    DISPLAY: 'YYYY-MM-DD',
    DISPLAY_TIME: 'YYYY-MM-DD HH:mm:ss',
    API: 'YYYY-MM-DDTHH:mm:ss.SSSZ'
};

export const STORAGE_KEYS = {
    TOKEN: 'accessToken',
    REFRESH_TOKEN: 'refreshToken',
    USER: 'user',
    THEME: 'theme',
    LANGUAGE: 'language'
};

export default {
    API_ENDPOINTS,
    ORDER_STATUS,
    PAYMENT_STATUS,
    USER_ROLES,
    CUSTOMER_LEVELS,
    PRODUCT_STATUS,
    PAGINATION,
    DATE_FORMATS,
    STORAGE_KEYS
};