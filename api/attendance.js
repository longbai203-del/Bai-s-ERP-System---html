/**
 * api/attendance.js - 考勤 API（Express Router 版本）
 * GET    /api/attendance - 考勤列表
 * POST   /api/attendance/clock - 打卡
 * GET    /api/attendance/stats/summary - 考勤统计
 * GET    /api/attendance/:id - 考勤详情
 * 
 * 增强点：统一使用 Express Router，补充统计和详情接口
 */

import express from 'express';
import { supabase, getPagination, safeQuery, getUserById } from '../shared/lib/supabase.js';
import { authenticate, requireRole } from '../shared/lib/auth.js';
import { isRequired, validateAttendance } from '../shared/validation/index.js';
import { logger } from '../shared/lib/logger.js';

const router = express.Router();

// ============================================================
// GET /api/attendance - 考勤列表
// ============================================================
router.get('/', authenticate, async (req, res) => {
    try {
        const userId = req.user?.id;
        const { page = 1, limit = 20, date, employee_id, status } = req.query;

        const user = await getUserById(userId);
        if (!user) {
            return res.status(401).json({
                success: false,
                error: '未授权',
                code: 'UNAUTHORIZED'
            });
        }

        let query = supabase.from('attendance').select('*, employees(full_name, department)', { count: 'exact' });

        if (user?.tenant_id) {
            query = query.eq('tenant_id', user.tenant_id);
        }

        if (date) {
            query = query.eq('date', date);
        }

        if (status && status !== 'all') {
            query = query.eq('status', status);
        }

        // 普通员工只能看自己的考勤
        if (user?.role === 'employee' || user?.role === 'cashier') {
            query = query.eq('employee_id', userId);
        } else if (employee_id) {
            query = query.eq('employee_id', employee_id);
        }

        const { from, to } = getPagination(parseInt(page), parseInt(limit));
        query = query.order('date', { ascending: false }).range(from, to);

        const result = await safeQuery(() => query);

        if (!result.success) {
            return res.status(500).json({
                success: false,
                error: '查询考勤失败',
                code: 'DB_ERROR'
            });
        }

        return res.status(200).json({
            success: true,
            data: result.data || [],
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total: result.data?.length || 0
            }
        });

    } catch (error) {
        logger.error('[Attendance] 获取考勤列表失败:', error);
        return res.status(500).json({
            success: false,
            error: '获取考勤列表失败',
            code: 'INTERNAL_ERROR'
        });
    }
});

// ============================================================
// GET /api/attendance/:id - 考勤详情
// ============================================================
router.get('/:id', authenticate, async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user?.id;

        const user = await getUserById(userId);
        if (!user) {
            return res.status(401).json({
                success: false,
                error: '未授权',
                code: 'UNAUTHORIZED'
            });
        }

        let query = supabase.from('attendance').select('*, employees(full_name, department)').eq('id', id);

        if (user?.tenant_id) {
            query = query.eq('tenant_id', user.tenant_id);
        }

        // 普通员工只能看自己的考勤
        if (user?.role === 'employee' || user?.role === 'cashier') {
            query = query.eq('employee_id', userId);
        }

        const result = await safeQuery(() => query.single());

        if (!result.success) {
            return res.status(404).json({
                success: false,
                error: '考勤记录不存在',
                code: 'ATTENDANCE_NOT_FOUND'
            });
        }

        return res.status(200).json({
            success: true,
            data: result.data
        });

    } catch (error) {
        logger.error('[Attendance] 获取考勤详情失败:', error);
        return res.status(500).json({
            success: false,
            error: '获取考勤详情失败',
            code: 'INTERNAL_ERROR'
        });
    }
});

// ============================================================
// POST /api/attendance/clock - 打卡
// ============================================================
router.post('/clock', authenticate, async (req, res) => {
    try {
        const userId = req.user?.id;
        const { type, lat, lng, location } = req.body;

        const errors = validateAttendance({ type, employee_id: userId });
        if (errors.length > 0) {
            return res.status(400).json({
                success: false,
                error: '参数验证失败',
                errors: errors,
                code: 'VALIDATION_ERROR'
            });
        }

        if (!['in', 'out'].includes(type)) {
            return res.status(400).json({
                success: false,
                error: '无效的打卡类型，请使用 in 或 out',
                code: 'INVALID_TYPE'
            });
        }

        const user = await getUserById(userId);
        if (!user) {
            return res.status(401).json({
                success: false,
                error: '未授权',
                code: 'UNAUTHORIZED'
            });
        }

        const today = new Date().toISOString().split('T')[0];
        const now = new Date().toISOString();

        const { data: existing } = await supabase
            .from('attendance')
            .select('id, check_in_time, check_out_time, work_hours')
            .eq('employee_id', userId)
            .eq('date', today);

        // ===== 上班打卡 =====
        if (type === 'in') {
            if (existing && existing.length > 0 && existing[0].check_in_time) {
                return res.status(409).json({
                    success: false,
                    error: '今日已打卡上班',
                    code: 'ALREADY_CLOCKED_IN'
                });
            }

            const result = await safeQuery(() =>
                supabase.from('attendance').insert({
                    employee_id: userId,
                    staff_name: user?.name || user?.full_name || user?.username || '员工',
                    date: today,
                    check_in_time: now,
                    check_in_lat: lat || null,
                    check_in_lng: lng || null,
                    check_in_location: location || null,
                    tenant_id: user?.tenant_id || null,
                    store_id: user?.store_id || null,
                    status: 'present',
                    created_at: now,
                    updated_at: now
                }).select().single()
            );

            if (!result.success) {
                logger.error('[Attendance] 上班打卡失败:', result.error);
                return res.status(500).json({
                    success: false,
                    error: '打卡失败',
                    code: 'DB_ERROR'
                });
            }

            return res.status(200).json({
                success: true,
                data: result.data,
                message: '打卡上班成功'
            });
        }

        // ===== 下班打卡 =====
        if (!existing || existing.length === 0 || !existing[0].check_in_time) {
            return res.status(400).json({
                success: false,
                error: '今日尚未打卡上班',
                code: 'NOT_CLOCKED_IN'
            });
        }

        if (existing[0].check_out_time) {
            return res.status(409).json({
                success: false,
                error: '今日已打卡下班',
                code: 'ALREADY_CLOCKED_OUT'
            });
        }

        const checkInTime = new Date(existing[0].check_in_time);
        const checkOutTime = new Date(now);
        const workHours = Math.round(((checkOutTime - checkInTime) / (1000 * 60 * 60)) * 100) / 100;

        const result = await safeQuery(() =>
            supabase.from('attendance')
                .update({
                    check_out_time: now,
                    check_out_lat: lat || null,
                    check_out_lng: lng || null,
                    check_out_location: location || null,
                    work_hours: workHours,
                    updated_at: now
                })
                .eq('id', existing[0].id)
                .select().single()
        );

        if (!result.success) {
            logger.error('[Attendance] 下班打卡失败:', result.error);
            return res.status(500).json({
                success: false,
                error: '打卡失败',
                code: 'DB_ERROR'
            });
        }

        return res.status(200).json({
            success: true,
            data: result.data,
            message: `打卡下班成功，今日工作时长 ${workHours} 小时`
        });

    } catch (error) {
        logger.error('[Attendance] 打卡失败:', error);
        return res.status(500).json({
            success: false,
            error: '打卡失败',
            code: 'INTERNAL_ERROR'
        });
    }
});

// ============================================================
// GET /api/attendance/stats/summary - 考勤统计
// ============================================================
router.get('/stats/summary', authenticate, requireRole(['owner', 'admin', 'manager']), async (req, res) => {
    try {
        const userId = req.user?.id;
        const { date, employee_id } = req.query;

        const user = await getUserById(userId);
        if (!user) {
            return res.status(401).json({
                success: false,
                error: '未授权',
                code: 'UNAUTHORIZED'
            });
        }

        const targetDate = date || new Date().toISOString().split('T')[0];

        let query = supabase.from('attendance').select('*', { count: 'exact' });

        if (user?.tenant_id) {
            query = query.eq('tenant_id', user.tenant_id);
        }

        if (targetDate) {
            query = query.eq('date', targetDate);
        }

        if (employee_id) {
            query = query.eq('employee_id', employee_id);
        }

        const { data, error } = await query;

        if (error) {
            return res.status(500).json({
                success: false,
                error: '查询考勤统计失败',
                code: 'DB_ERROR'
            });
        }

        const total = data?.length || 0;
        const present = data?.filter(r => r.status === 'present').length || 0;
        const absent = data?.filter(r => r.status === 'absent').length || 0;
        const leave = data?.filter(r => r.status === 'leave').length || 0;
        const late = data?.filter(r => r.status === 'late').length || 0;

        return res.status(200).json({
            success: true,
            data: {
                date: targetDate,
                total: total,
                present: present,
                absent: absent,
                leave: leave,
                late: late,
                attendance_rate: total > 0 ? Math.round((present / total) * 100) : 0
            }
        });

    } catch (error) {
        logger.error('[Attendance] 获取考勤统计失败:', error);
        return res.status(500).json({
            success: false,
            error: '获取考勤统计失败',
            code: 'INTERNAL_ERROR'
        });
    }
});

// ============================================================
// PUT /api/attendance/:id - 更新考勤记录（管理员）
// ============================================================
router.put('/:id', authenticate, requireRole(['owner', 'admin', 'manager']), async (req, res) => {
    try {
        const { id } = req.params;
        const { check_in_time, check_out_time, status, note } = req.body;

        const updateData = {};
        if (check_in_time) updateData.check_in_time = check_in_time;
        if (check_out_time) updateData.check_out_time = check_out_time;
        if (status) updateData.status = status;
        if (note !== undefined) updateData.note = note;
        updateData.updated_at = new Date().toISOString();

        const result = await safeQuery(() =>
            supabase.from('attendance').update(updateData).eq('id', id).select().single()
        );

        if (!result.success) {
            return res.status(500).json({
                success: false,
                error: '更新考勤记录失败',
                code: 'DB_ERROR'
            });
        }

        return res.status(200).json({
            success: true,
            data: result.data,
            message: '考勤记录更新成功'
        });

    } catch (error) {
        logger.error('[Attendance] 更新考勤记录失败:', error);
        return res.status(500).json({
            success: false,
            error: '更新考勤记录失败',
            code: 'INTERNAL_ERROR'
        });
    }
});

export default router;