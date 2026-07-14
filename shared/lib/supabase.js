/**
 * @file supabase.js
 * @description Supabase 客户端配置和完整工具函数集
 * @version 2.0.0
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

// ============================================================
// 1. 基础 CRUD 操作
// ============================================================

/**
 * 查询数据
 * @param {string} table - 表名
 * @param {Object} filters - 过滤条件 { column: value }
 * @param {Object} options - 选项 { select, limit, offset, orderBy, ascending }
 * @returns {Promise<{ success: boolean, data: any, error: string | null, count: number }>}
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
 * @param {string} table - 表名
 * @param {Object|Object[]} data - 要插入的数据
 * @returns {Promise<{ success: boolean, data: any, error: string | null }>}
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
 * @param {string} table - 表名
 * @param {string|number} id - 记录ID
 * @param {Object} data - 要更新的数据
 * @returns {Promise<{ success: boolean, data: any, error: string | null }>}
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
 * @param {string} table - 表名
 * @param {string|number} id - 记录ID
 * @returns {Promise<{ success: boolean, error: string | null }>}
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
 * 批量删除
 * @param {string} table - 表名
 * @param {string} column - 列名
 * @param {Array} values - 要删除的值数组
 * @returns {Promise<{ success: boolean, error: string | null }>}
 */
export async function deleteRows(table, column, values) {
    try {
        const result = await supabase.from(table).delete().in(column, values);
        if (result.error) throw result.error;
        return { success: true, error: null };
    } catch (error) {
        console.error('[Supabase] deleteRows 错误:', error);
        return { success: false, error: error.message };
    }
}

/**
 * 获取单条记录
 * @param {string} table - 表名
 * @param {string|number} id - 记录ID
 * @param {string} select - 要选择的字段
 * @returns {Promise<{ success: boolean, data: any, error: string | null }>}
 */
export async function getRowById(table, id, select = '*') {
    try {
        const { data, error } = await supabase
            .from(table)
            .select(select)
            .eq('id', id)
            .single();
            
        if (error) throw error;
        return { success: true, data, error: null };
    } catch (error) {
        console.error('[Supabase] getRowById 错误:', error);
        return { success: false, data: null, error: error.message };
    }
}

// ============================================================
// 2. 安全查询工具
// ============================================================

/**
 * 安全查询 - 包装查询，处理错误
 * @param {Function} queryFn - 查询函数
 * @returns {Promise<{ data: any, error: string | null }>}
 */
export async function safeQuery(queryFn) {
    try {
        const result = await queryFn();
        return { data: result.data, error: null };
    } catch (error) {
        console.error('[Supabase] safeQuery 错误:', error);
        return { data: null, error: error.message };
    }
}

/**
 * 安全执行 - 通用安全执行器
 * @param {Function} fn - 要执行的函数
 * @param {*} defaultValue - 默认返回值
 * @returns {Promise<{ result: any, error: string | null }>}
 */
export async function safeExecute(fn, defaultValue = null) {
    try {
        const result = await fn();
        return { result, error: null };
    } catch (error) {
        console.error('[Supabase] safeExecute 错误:', error);
        return { result: defaultValue, error: error.message };
    }
}

// ============================================================
// 3. 用户认证相关
// ============================================================

/**
 * 从请求中获取用户信息
 * @param {Request} req - Express 请求对象
 * @returns {Promise<{ user: Object | null, error: string | null }>}
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
 * @param {string} token - JWT token
 * @returns {Promise<{ session: Object | null, error: string | null }>}
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
 * 根据 ID 获取用户
 * @param {string} userId - 用户ID
 * @param {string} select - 要选择的字段
 * @returns {Promise<{ user: Object | null, error: string | null }>}
 */
export async function getUserById(userId, select = '*') {
    try {
        const { data, error } = await supabase
            .from('users')
            .select(select)
            .eq('id', userId)
            .single();
            
        if (error) throw error;
        return { user: data, error: null };
    } catch (error) {
        console.error('[Supabase] getUserById 错误:', error);
        return { user: null, error: error.message };
    }
}

/**
 * 根据邮箱获取用户
 * @param {string} email - 用户邮箱
 * @param {string} select - 要选择的字段
 * @returns {Promise<{ user: Object | null, error: string | null }>}
 */
export async function getUserByEmail(email, select = '*') {
    try {
        const { data, error } = await supabase
            .from('users')
            .select(select)
            .eq('email', email)
            .single();
            
        if (error) throw error;
        return { user: data, error: null };
    } catch (error) {
        console.error('[Supabase] getUserByEmail 错误:', error);
        return { user: null, error: error.message };
    }
}

/**
 * 获取多个用户
 * @param {Array} userIds - 用户ID数组
 * @param {string} select - 要选择的字段
 * @returns {Promise<{ users: Array, error: string | null }>}
 */
export async function getUsersByIds(userIds, select = '*') {
    try {
        if (!userIds || userIds.length === 0) {
            return { users: [], error: null };
        }
        const { data, error } = await supabase
            .from('users')
            .select(select)
            .in('id', userIds);
            
        if (error) throw error;
        return { users: data, error: null };
    } catch (error) {
        console.error('[Supabase] getUsersByIds 错误:', error);
        return { users: [], error: error.message };
    }
}

/**
 * 验证用户权限
 * @param {string} userId - 用户ID
 * @param {string} permission - 权限名称
 * @param {string} table - 表名（可选）
 * @returns {Promise<{ hasPermission: boolean, error: string | null }>}
 */
export async function verifyUserPermission(userId, permission, table = null) {
    try {
        let query = supabase
            .from('user_permissions')
            .select('*')
            .eq('user_id', userId)
            .eq('permission', permission);
            
        if (table) {
            query = query.eq('table_name', table);
        }
        
        const { data, error } = await query.single();
            
        if (error) {
            return { hasPermission: false, error: error.message };
        }
        
        return { hasPermission: !!data, error: null };
    } catch (error) {
        console.error('[Supabase] verifyUserPermission 错误:', error);
        return { hasPermission: false, error: error.message };
    }
}

/**
 * 获取用户角色
 * @param {string} userId - 用户ID
 * @returns {Promise<{ role: string | null, error: string | null }>}
 */
export async function getUserRole(userId) {
    try {
        const { data, error } = await supabase
            .from('users')
            .select('role')
            .eq('id', userId)
            .single();
            
        if (error) throw error;
        return { role: data?.role || 'user', error: null };
    } catch (error) {
        console.error('[Supabase] getUserRole 错误:', error);
        return { role: null, error: error.message };
    }
}

// ============================================================
// 4. 高级查询工具
// ============================================================

/**
 * 计数查询
 * @param {string} table - 表名
 * @param {Object} filters - 过滤条件
 * @returns {Promise<{ count: number, error: string | null }>}
 */
export async function countRows(table, filters = {}) {
    try {
        let query = supabase.from(table).select('*', { count: 'exact', head: true });
        
        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                query = query.eq(key, value);
            }
        });
        
        const { count, error } = await query;
        if (error) throw error;
        return { count, error: null };
    } catch (error) {
        console.error('[Supabase] countRows 错误:', error);
        return { count: 0, error: error.message };
    }
}

/**
 * 分页查询
 * @param {string} table - 表名
 * @param {number} page - 页码（从1开始）
 * @param {number} pageSize - 每页大小
 * @param {Object} filters - 过滤条件
 * @param {string} orderBy - 排序字段
 * @param {boolean} ascending - 是否升序
 * @returns {Promise<{ data: any, total: number, page: number, totalPages: number, error: string | null }>}
 */
export async function paginateRows(table, page = 1, pageSize = 20, filters = {}, orderBy = 'created_at', ascending = false) {
    try {
        const offset = (page - 1) * pageSize;
        
        // 获取总数
        const { count, error: countError } = await countRows(table, filters);
        if (countError) throw countError;
        
        // 获取数据
        const result = await queryRows(table, filters, {
            limit: pageSize,
            offset: offset,
            orderBy: orderBy,
            ascending: ascending
        });
        
        if (!result.success) throw new Error(result.error);
        
        return {
            data: result.data,
            total: count,
            page: page,
            pageSize: pageSize,
            totalPages: Math.ceil(count / pageSize),
            error: null
        };
    } catch (error) {
        console.error('[Supabase] paginateRows 错误:', error);
        return {
            data: [],
            total: 0,
            page: page,
            pageSize: pageSize,
            totalPages: 0,
            error: error.message
        };
    }
}

// ============================================================
// 5. 测试与工具函数
// ============================================================

/**
 * 测试 Supabase 连接
 * @param {string} testTable - 测试用表名
 * @returns {Promise<boolean>}
 */
export async function testSupabaseConnection(testTable = '_test') {
    try {
        // 尝试查询测试表
        const { data, error } = await supabase
            .from(testTable)
            .select('*')
            .limit(1);
            
        if (error) {
            // 如果表不存在，尝试查询 users 表
            const { error: userError } = await supabase
                .from('users')
                .select('*')
                .limit(1);
                
            if (userError) {
                console.warn('⚠️ [Supabase] 连接测试失败:', userError.message);
                return false;
            }
        }
        console.log('✅ [Supabase] 连接测试成功');
        return true;
    } catch (err) {
        console.warn('⚠️ [Supabase] 连接测试异常:', err.message);
        return false;
    }
}

/**
 * 检查表是否存在
 * @param {string} table - 表名
 * @returns {Promise<boolean>}
 */
export async function tableExists(table) {
    try {
        const { error } = await supabase
            .from(table)
            .select('*')
            .limit(1);
            
        return !error;
    } catch {
        return false;
    }
}

/**
 * 获取表结构
 * @param {string} table - 表名
 * @returns {Promise<{ columns: Array, error: string | null }>}
 */
export async function getTableSchema(table) {
    try {
        const { data, error } = await supabase
            .from(table)
            .select('*')
            .limit(1);
            
        if (error) throw error;
        
        const columns = data && data.length > 0 ? Object.keys(data[0]) : [];
        return { columns, error: null };
    } catch (error) {
        console.error('[Supabase] getTableSchema 错误:', error);
        return { columns: [], error: error.message };
    }
}

// ============================================================
// 6. 批量操作
// ============================================================

/**
 * 批量插入
 * @param {string} table - 表名
 * @param {Array} dataArray - 数据数组
 * @returns {Promise<{ success: boolean, data: any, errors: Array }>}
 */
export async function bulkInsert(table, dataArray) {
    const errors = [];
    const results = [];
    
    for (const data of dataArray) {
        const result = await insertRow(table, data);
        if (!result.success) {
            errors.push({ data, error: result.error });
        } else {
            results.push(result.data);
        }
    }
    
    return {
        success: errors.length === 0,
        data: results,
        errors: errors
    };
}

/**
 * 批量更新
 * @param {string} table - 表名
 * @param {Array} updates - 更新数据数组 [{ id, data }]
 * @returns {Promise<{ success: boolean, results: Array, errors: Array }>}
 */
export async function bulkUpdate(table, updates) {
    const results = [];
    const errors = [];
    
    for (const { id, data } of updates) {
        const result = await updateRow(table, id, data);
        if (!result.success) {
            errors.push({ id, data, error: result.error });
        } else {
            results.push(result.data);
        }
    }
    
    return {
        success: errors.length === 0,
        results,
        errors
    };
}

// ============================================================
// 7. 导出所有功能
// ============================================================

export default {
    supabase,
    supabaseConfig,
    // CRUD
    queryRows,
    insertRow,
    updateRow,
    deleteRow,
    deleteRows,
    getRowById,
    // 安全查询
    safeQuery,
    safeExecute,
    // 用户认证
    getUserFromRequest,
    getSession,
    getUserById,
    getUserByEmail,
    getUsersByIds,
    verifyUserPermission,
    getUserRole,
    // 高级查询
    countRows,
    paginateRows,
    // 测试工具
    testSupabaseConnection,
    tableExists,
    getTableSchema,
    // 批量操作
    bulkInsert,
    bulkUpdate
};
/**
 * 获取分页参数
 * @param {number} page - 页码（从1开始）
 * @param {number} size - 每页大小
 * @returns {{ from: number, to: number, limit: number, offset: number }}
 */
export function getPagination(page = 1, size = 10) {
    const limit = size;
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    return { from, to, limit, offset: from };
}