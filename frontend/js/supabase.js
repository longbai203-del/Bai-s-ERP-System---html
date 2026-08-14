// frontend/js/supabase.js
// Supabase 客户端初始化

const { createClient } = supabase;

// 从config.js获取配置
const supabaseUrl = SUPABASE_CONFIG.url;
const supabaseAnonKey = SUPABASE_CONFIG.anonKey;

// 创建Supabase客户端
const supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
    }
});

// 导出客户端
window.supabaseClient = supabaseClient;

console.log('✅ Supabase客户端初始化完成');
