// ============================================================
// Bai's ERP System - 配置文件
// ============================================================

const CONFIG = {
    // ============================================================
    // Supabase 配置
    // ============================================================
    SUPABASE_URL: 'https://qryllswlfryaywiajilr.supabase.co',
    SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFyeWxsc3dsZnJ5YXl3aWFqaWxyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY3MzUxMjgsImV4cCI6MjEwMjMxMTEyOH0.g0i02OViDEINfXLMksp1oWNKoactxOBlylyTdDXr5qs',

    // ============================================================
    // 应用配置
    // ============================================================
    APP_NAME: 'Bai\'s ERP System',
    APP_VERSION: '1.0.0',
    DEFAULT_LOCALE: 'zh-CN',

    // ============================================================
    // 功能开关
    // ============================================================
    ENABLE_AI: true,
    ENABLE_MARKETING: true,
    ENABLE_FLEET: true,
    ENABLE_CRM: true,
    ENABLE_ANALYTICS: true,
    ENABLE_REPORTS: true,

    // ============================================================
    // API 配置
    // ============================================================
    API_BASE_URL: '/api',
    API_TIMEOUT: 30000,
    API_RETRY_COUNT: 3,

    // ============================================================
    // 文件上传配置
    // ============================================================
    MAX_FILE_SIZE: 5242880, // 5MB
    ALLOWED_FILE_TYPES: [
        'image/jpeg',
        'image/png',
        'image/webp',
        'image/gif',
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ],

    // ============================================================
    // 分页配置
    // ============================================================
    PAGE_SIZE: 20,
    PAGE_SIZES: [10, 20, 50, 100, 200],

    // ============================================================
    // 本地化配置（沙特阿拉伯）
    // ============================================================
    CURRENCY: 'SAR',
    CURRENCY_SYMBOL: 'ر.س',
    TIMEZONE: 'Asia/Riyadh',
    WEEK_START: 0, // 周日为第一天
    VAT_RATE: 0.15, // 沙特增值税 15%
    DATE_FORMAT: 'YYYY-MM-DD',
    DATETIME_FORMAT: 'YYYY-MM-DD HH:mm:ss',
    TIME_FORMAT: 'HH:mm:ss',

    // ============================================================
    // 多语言支持
    // ============================================================
    SUPPORTED_LOCALES: ['zh-CN', 'en-US', 'ar-SA'],
    DEFAULT_LOCALE: 'zh-CN',

    // ============================================================
    // 认证配置
    // ============================================================
    AUTH: {
        SESSION_TIMEOUT: 3600000, // 1小时
        REFRESH_TOKEN_INTERVAL: 300000, // 5分钟
        MAX_LOGIN_ATTEMPTS: 5,
        LOCKOUT_DURATION: 900000 // 15分钟
    },

    // ============================================================
    // 通知配置
    // ============================================================
    NOTIFICATIONS: {
        ENABLE_BROWSER: true,
        ENABLE_SOUND: true,
        SOUND_URL: '/assets/sounds/notification.mp3',
        MAX_DISPLAY: 5,
        DURATION: 5000
    },

    // ============================================================
    // 图表配置
    // ============================================================
    CHARTS: {
        COLORS: [
            '#4CAF50', '#2196F3', '#FF9800', '#F44336',
            '#9C27B0', '#00BCD4', '#FFEB3B', '#795548'
        ],
        ANIMATION_DURATION: 1000
    },

    // ============================================================
    // 打印配置
    // ============================================================
    PRINT: {
        LOGO_URL: '/assets/images/logo.png',
        FOOTER_TEXT: '© 2026 Bai\'s ERP System. All rights reserved.'
    },

    // ============================================================
    // 模块配置
    // ============================================================
    MODULES: {
        SAAS: { enabled: true, order: 8 },
        DASHBOARD: { enabled: true, order: 1 },
        POS: { enabled: true, order: 2 },
        ORDERS: { enabled: true, order: 3 },
        CUSTOMERS: { enabled: true, order: 4 },
        MEMBERS: { enabled: true, order: 5 },
        PRODUCTS: { enabled: true, order: 6 },
        INVENTORY: { enabled: true, order: 7 },
        PURCHASE: { enabled: true, order: 8 },
        SUPPLIERS: { enabled: true, order: 9 },
        FINANCE: { enabled: true, order: 10 },
        CRM: { enabled: true, order: 11 },
        HR: { enabled: true, order: 12 },
        REPORTS: { enabled: true, order: 13 },
        ANALYTICS: { enabled: true, order: 14 },
        FLEET: { enabled: true, order: 15 },
        AI: { enabled: true, order: 16 },
        SETTINGS: { enabled: true, order: 17 },
        SYSTEM: { enabled: true, order: 18 }
    }
};

// ============================================================
// 导出配置
// ============================================================
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}

// 全局可访问
window.APP_CONFIG = CONFIG;

// ============================================================
// 日志输出
// ============================================================
console.log('✅ Bai\'s ERP System 配置加载完成');
console.log(`📌 应用: ${CONFIG.APP_NAME} v${CONFIG.APP_VERSION}`);
console.log(`📌 Supabase: ${CONFIG.SUPABASE_URL}`);
console.log(`📌 环境: ${window.location.hostname === 'localhost' ? '开发' : '生产'}`);

