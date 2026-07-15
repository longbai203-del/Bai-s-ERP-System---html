// config/app.config.js
export const AppConfig = {
    name: 'BAI ERP',
    version: '1.0.0',
    description: '智能洗车 · 企业管理平台',
    
    // Supabase 配置 (从环境变量读取)
    supabase: {
        url: import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co',
        anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key'
    },
    
    // 功能开关
    features: {
        enableAI: true,
        enableRealtime: true,
        enableMultiTenant: true
    },
    
    // 默认设置
    defaults: {
        language: 'zh-CN',
        theme: 'light',
        currency: 'CNY',
        timezone: 'Asia/Shanghai'
    }
};

export default AppConfig;
