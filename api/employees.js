/**
 * api/employees.js - 员工 API（Express Router 版本）
 * GET    /api/employees - 员工列表
 * POST   /api/employees/approve - 审核员工
 * GET    /api/employees/:id - 员工详情
 * PUT    /api/employees/:id - 更新员工
 * 
 * 增强点：统一使用 Express Router，补充缺失的 CRUD 操作
 */

import express from 'express';
import { supabase, getPagination, safeQuery, getUserById } from '../shared/lib/supabase.js';
import { authenticate, requireRole } from '../shared/lib/auth.js';
import { isRequired } from '../shared/lib/validation.js';
import { logger } from '../shared/lib/logger.js';

const router = express.Router();

// ============================================================
// GET /api/employees - 员工列表
// ============================================================
router.get('/', authenticate, async (req, res) => {
    try {
        const { page = 1, limit = 20, status, role, search } = req.query;

        let query = supabase.from('users').select('*', { count: 'exact' });
        query = query.neq('role', 'owner');

        if (status && status !== 'all') {
            query = query.eq('status', status);
        }

        if (role && role !== 'all') {
            query = query.eq('role', role);
        }

        if (search) {
            query = query.or(`username.ilike.%${search}%,name.ilike.%${search}%,full_name.ilike.%${search}%,email.ilike.%${search}%`);
        }

        const { from, to } = getPagination(parseInt(page), parseInt(limit));
        query = query.order('created_at', { ascending: false }).range(from, to);

        const result = await safeQuery(() => query);

        if (!result.success) {
            return res.status(500).json({
                success: false,
                error: '查询员工失败',
                code: 'DB_ERROR'
            });
        }

        // 移除敏感字段
        const employees = (result.data || []).map(emp => {
            const { password_hash, ...rest } = emp;
            return rest;
        });

        return res.status(200).json({
            success: true,
            data: employees,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total: result.data?.length || 0
            }
        });

    } catch (error) {
        logger.error('[Employees] 获取员工列表失败:', error);
        return res.status(500).json({
            success: false,
            error: '获取员工列表失败',
            code: 'INTERNAL_ERROR'
        });
    }
});

// ============================================================
// GET /api/employees/:id - 员工详情
// ============================================================
router.get('/:id', authenticate, async (req, res) => {
    try {
        const { id } = req.params;

        const result = await safeQuery(() =>
            supabase.from('users').select('*').eq('id', id).single()
        );

        if (!result.success) {
            return res.status(404).json({
                success: false,
                error: '员工不存在',
                code: 'EMPLOYEE_NOT_FOUND'
            });
        }

        // 获取员工的考勤统计
        const { data: attendance } = await supabase
            .from('attendance')
            .select('*')
            .eq('employee_id', id)
            .order('date', { ascending: false })
            .limit(30);

        // 移除敏感字段
        const { password_hash, ...safeEmployee } = result.data;

        return res.status(200).json({
            success: true,
            data: {
                ...safeEmployee,
                recent_attendance: attendance || []
            }
        });

    } catch (error) {
        logger.error('[Employees] 获取员工详情失败:', error);
        return res.status(500).json({
            success: false,
            error: '获取员工详情失败',
            code: 'INTERNAL_ERROR'
        });
    }
});

// ============================================================
// POST /api/employees - 创建员工
// ============================================================
router.post('/', authenticate, requireRole(['owner', 'admin']), async (req, res) => {
    try {
        const { username, password, name, role, phone, email } = req.body;

        const errors = [];
        const usernameError = isRequired(username, '用户名');
        if (usernameError) errors.push(usernameError);
        const passwordError = isRequired(password, '密码');
        if (passwordError) errors.push(passwordError);

        if (errors.length > 0) {
            return res.status(400).json({
                success: false,
                error: '参数验证失败',
                errors: errors,
                code: 'VALIDATION_ERROR'
            });
        }

        // 检查用户名是否已存在
        const { data: existingUsers } = await supabase
            .from('users')
            .select('id')
            .eq('username', username);

        if (existingUsers && existingUsers.length > 0) {
            return res.status(409).json({
                success: false,
                error: '用户名已存在',
                code: 'USERNAME_EXISTS'
            });
        }

        // 不允许创建 owner 角色
        if (role === 'owner') {
            return res.status(403).json({
                success: false,
                error: '不能创建老板账号',
                code: 'ROLE_NOT_ALLOWED'
            });
        }

        const crypto = await import('crypto-js');
        const passwordHash = crypto.SHA256(password).toString();

        const userData = {
            username,
            password_hash: passwordHash,
            name: name || username,
            full_name: name || username,
            role: role || 'employee',
            status: 'approved',
            phone: phone || null,
            email: email || null,
            created_at: new Date().toISOString()
        };

        const result = await safeQuery(() =>
            supabase.from('users').insert(userData).select().single()
        );

        if (!result.success) {
            return res.status(500).json({
                success: false,
                error: '创建员工失败',
                code: 'DB_ERROR'
            });
        }

        const { password_hash: _, ...safeUser } = result.data;

        return res.status(201).json({
            success: true,
            data: safeUser,
            message: '员工创建成功'
        });

    } catch (error) {
        logger.error('[Employees] 创建员工失败:', error);
        return res.status(500).json({
            success: false,
            error: '创建员工失败',
            code: 'INTERNAL_ERROR'
        });
    }
});

// ============================================================
// PUT /api/employees/:id - 更新员工
// ============================================================
router.put('/:id', authenticate, requireRole(['owner', 'admin']), async (req, res) => {
    try {
        const { id } = req.params;
        const { name, role, phone, email, status } = req.body;

        // 检查员工是否存在
        const { data: existing } = await supabase
            .from('users')
            .select('role')
            .eq('id', id)
            .single();

        if (!existing) {
            return res.status(404).json({
                success: false,
                error: '员工不存在',
                code: 'EMPLOYEE_NOT_FOUND'
            });
        }

        // 不允许修改 owner
        if (existing.role === 'owner') {
            return res.status(403).json({
                success: false,
                error: '不能修改老板账号',
                code: 'FORBIDDEN'
            });
        }

        const updateData = {};
        if (name) updateData.name = name;
        if (name) updateData.full_name = name;
        if (role && role !== 'owner') updateData.role = role;
        if (phone !== undefined) updateData.phone = phone;
        if (email !== undefined) updateData.email = email;
        if (status) updateData.status = status;
        updateData.updated_at = new Date().toISOString();

        const result = await safeQuery(() =>
            supabase.from('users').update(updateData).eq('id', id).select().single()
        );

        if (!result.success) {
            return res.status(500).json({
                success: false,
                error: '更新员工失败',
                code: 'DB_ERROR'
            });
        }

        const { password_hash, ...safeUser } = result.data;

        return res.status(200).json({
            success: true,
            data: safeUser,
            message: '员工更新成功'
        });

    } catch (error) {
        logger.error('[Employees] 更新员工失败:', error);
        return res.status(500).json({
            success: false,
            error: '更新员工失败',
            code: 'INTERNAL_ERROR'
        });
    }
});

// ============================================================
// POST /api/employees/approve - 审核员工
// ============================================================
router.post('/approve', authenticate, requireRole(['owner', 'admin']), async (req, res) => {
    try {
        const { userId, status, note } = req.body;

        const errors = [];
        const userIdError = isRequired(userId, '用户ID');
        if (userIdError) errors.push(userIdError);
        const statusError = isRequired(status, '审核状态');
        if (statusError) errors.push(statusError);

        if (errors.length > 0) {
            return res.status(400).json({
                success: false,
                error: '参数验证失败',
                errors: errors,
                code: 'VALIDATION_ERROR'
            });
        }

        if (!['approved', 'rejected'].includes(status)) {
            return res.status(400).json({
                success: false,
                error: '无效的审核状态',
                code: 'INVALID_STATUS'
            });
        }

        const { data: targetUser } = await supabase
            .from('users')
            .select('id, status, username, role')
            .eq('id', userId)
            .single();

        if (!targetUser) {
            return res.status(404).json({
                success: false,
                error: '用户不存在',
                code: 'USER_NOT_FOUND'
            });
        }

        if (targetUser.role === 'owner') {
            return res.status(403).json({
                success: false,
                error: '不能审核老板账号',
                code: 'FORBIDDEN'
            });
        }

        const adminId = req.user?.id;

        const updateData = {
            status: status,
            approved_by: adminId,
            approved_at: new Date().toISOString(),
            note: note || null
        };

        const result = await safeQuery(() =>
            supabase.from('users').update(updateData).eq('id', userId).select().single()
        );

        if (!result.success) {
            return res.status(500).json({
                success: false,
                error: '审核失败',
                code: 'DB_ERROR'
            });
        }

        const { password_hash, ...safeUser } = result.data;
        const message = status === 'approved' ? '用户已审核通过' : '用户已拒绝';

        return res.status(200).json({
            success: true,
            data: safeUser,
            message: message
        });

    } catch (error) {
        logger.error('[Employees] 审核员工失败:', error);
        return res.status(500).json({
            success: false,
            error: '审核失败',
            code: 'INTERNAL_ERROR'
        });
    }
});

// ============================================================
// DELETE /api/employees/:id - 删除员工
// ============================================================
router.delete('/:id', authenticate, requireRole(['owner', 'admin']), async (req, res) => {
    try {
        const { id } = req.params;

        const { data: existing } = await supabase
            .from('users')
            .select('role')
            .eq('id', id)
            .single();

        if (!existing) {
            return res.status(404).json({
                success: false,
                error: '员工不存在',
                code: 'EMPLOYEE_NOT_FOUND'
            });
        }

        if (existing.role === 'owner') {
            return res.status(403).json({
                success: false,
                error: '不能删除老板账号',
                code: 'FORBIDDEN'
            });
        }

        const result = await safeQuery(() =>
            supabase.from('users').delete().eq('id', id)
        );

        if (!result.success) {
            return res.status(500).json({
                success: false,
                error: '删除员工失败',
                code: 'DB_ERROR'
            });
        }

        return res.status(200).json({
            success: true,
            message: '员工删除成功'
        });

    } catch (error) {
        logger.error('[Employees] 删除员工失败:', error);
        return res.status(500).json({
            success: false,
            error: '删除员工失败',
            code: 'INTERNAL_ERROR'
        });
    }
});

// ============================================================
// GET /api/employees/stats/summary - 员工统计
// ============================================================
router.get('/stats/summary', authenticate, requireRole(['owner', 'admin', 'manager']), async (req, res) => {
    try {
        const { count: total } = await supabase
            .from('users')
            .select('*', { count: 'exact', head: true })
            .neq('role', 'owner');

        const { count: active } = await supabase
            .from('users')
            .select('*', { count: 'exact', head: true })
            .neq('role', 'owner')
            .eq('status', 'approved');

        const { count: pending } = await supabase
            .from('users')
            .select('*', { count: 'exact', head: true })
            .neq('role', 'owner')
            .eq('status', 'pending');

        const { data: roleStats } = await supabase
            .from('users')
            .select('role, count')
            .neq('role', 'owner')
            .group('role');

        return res.status(200).json({
            success: true,
            data: {
                total: total || 0,
                active: active || 0,
                pending: pending || 0,
                byRole: roleStats || []
            }
        });

    } catch (error) {
        logger.error('[Employees] 获取统计失败:', error);
        return res.status(500).json({
            success: false,
            error: '获取统计失败',
            code: 'INTERNAL_ERROR'
        });
    }
});

export default router;