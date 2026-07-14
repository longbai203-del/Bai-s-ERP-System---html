/**
 * @file supabase.js
 * @description Supabase 客户端配置和工具函数
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// 加载环境变量
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ [Supabase] 环境变量未设置: SUPABASE_URL 或 SUPABASE_SERVICE_ROLE_KEY');
    console.error('   请检查 .env 文件是否存在并包含必要的配置');
}

// 创建 Supabase 客户端
export const supabase = createClient(supabaseUrl, supabaseKey);

// 导出配置信息（用于调试）
export const supabaseConfig = {
    url: supabaseUrl ? supabaseUrl.substring(0, 20) + '...' : '未设置',
    key: supabaseKey ? '已设置' : '未设置'
};

console.log('✅ [Supabase] 客户端初始化完成');
console.log('   URL: ' + supabaseConfig.url);
console.log('   密钥: ' + supabaseConfig.key);

/**
 * 查询数据
 */
export async function queryRows(table, filters = {}, options = {}) {
    try {
        let query = supabase.from(table).select(options.select || '*');
        
        // 应用过滤条件
        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                query = query.eq(key, value);
            }
        });
        
        // 分页
        if (options.limit) query = query.limit(options.limit);
        if (options.offset) query = query.range(options.offset, options.offset + options.limit - 1);
        if (options.orderBy) query = query.order(options.orderBy, { ascending: options.ascending !== false });
        
        const result = await query;
        if (result.error) throw result.error;
        return { success: true, data: result.data, error: null, count: result.count };
    } catch (error) {
        console.error('[Supabase] queryRows 错误:', error);
        return { success: false, data: null, error: error.message };
    }
}

/**
 * 插入数据
 */
export async function insertRow(table, data) {
    try {
        const result = await supabase.from(table).insert(data).select();
        if (result.error) throw result.error;
        return { success: true, data: result.data, error: null };
    } catch (error) {
        console.error('[Supabase] insertRow 错误:', error);
        return { success: false, data: null, error: error.message };
    }
}

/**
 * 更新数据
 */
export async function updateRow(table, id, data) {
    try {
        const result = await supabase.from(table).update(data).eq('id', id).select();
        if (result.error) throw result.error;
        return { success: true, data: result.data, error: null };
    } catch (error) {
        console.error('[Supabase] updateRow 错误:', error);
        return { success: false, data: null, error: error.message };
    }
}

/**
 * 删除数据
 */
export async function deleteRow(table, id) {
    try {
        const result = await supabase.from(table).delete().eq('id', id);
        if (result.error) throw result.error;
        return { success: true, error: null };
    } catch (error) {
        console.error('[Supabase] deleteRow 错误:', error);
        return { success: false, error: error.message };
    }
}

/**
 * 测试连接
 */
export async function testSupabaseConnection() {
    try {
        const { data, error } = await supabase.from('_test').select('*').limit(1);
        if (error) {
            console.warn('⚠️ [Supabase] 连接测试失败:', error.message);
            return false;
        }
        console.log('✅ [Supabase] 连接测试成功');
        return true;
    } catch (err) {
        console.warn('⚠️ [Supabase] 连接测试异常:', err.message);
        return false;
    }
}

export default supabase;
/**
 * 从请求中获取用户信息
 */
export async function getUserFromRequest(req) {
    try {
        // 从 Authorization header 获取 token
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return { user: null, error: '未提供认证令牌' };
        }
        
        const token = authHeader.split(' ')[1];
        const { data: { user }, error } = await supabase.auth.getUser(token);
        
        if (error) {
            return { user: null, error: error.message };
        }
        
        return { user, error: null };
    } catch (error) {
        console.error('[Supabase] getUserFromRequest 错误:', error);
        return { user: null, error: error.message };
    }
}

/**
 * 获取用户会话
 */
export async function getSession(token) {
    try {
        const { data: { session }, error } = await supabase.auth.getSession(token);
        if (error) throw error;
        return { session, error: null };
    } catch (error) {
        console.error('[Supabase] getSession 错误:', error);
        return { session: null, error: error.message };
    }
}

/**
 * 验证用户权限
 */
export async function verifyUserPermission(userId, permission) {
    try {
        // 这里可以根据需要实现权限验证逻辑
        const { data, error } = await supabase
            .from('user_permissions')
            .select('*')
            .eq('user_id', userId)
            .eq('permission', permission)
            .single();
            
        if (error) {
            return { hasPermission: false, error: error.message };
        }
        
        return { hasPermission: !!data, error: null };
    } catch (error) {
        console.error('[Supabase] verifyUserPermission 错误:', error);
        return { hasPermission: false, error: error.message };
    }
}