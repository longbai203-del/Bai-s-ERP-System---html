/**
 * api/auth.js - 认证 API（Express Router 版本）
 * POST /api/auth/login
 * POST /api/auth/register
 * GET  /api/auth/me
 * POST /api/auth/logout
 * POST /api/auth/reset-password
 * 
 * 增强点：统一使用 Express Router，保持与 orders.js、products.js 等一致
 */

import express from 'express';
import { supabase, getUserById, safeQuery } from '../shared/lib/supabase.js';
import { isRequired, isValidPassword, isValidPhone } from '../shared/validation/index.js';
import { logger } from '../shared/lib/logger.js';
import { authMiddleware } from '../shared/lib/auth.js';  // ✅ 修复：改为 authMiddleware

const router = express.Router();

// ============================================================
// POST /api/auth/login - 登录
// ============================================================
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

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

        const { data: users, error: queryError } = await supabase
            .from('users')
            .select('*')
            .eq('username', username);

        if (queryError) {
            logger.error('[Login] 查询用户失败:', queryError);
            return res.status(500).json({
                success: false,
                error: '数据库查询失败',
                code: 'DB_ERROR'
            });
        }

        if (!users || users.length === 0) {
            return res.status(401).json({
                success: false,
                error: '用户名或密码错误',
                code: 'INVALID_CREDENTIALS'
            });
        }

        const user = users[0];

        // 检查用户状态
        if (user.status === 'pending') {
            return res.status(403).json({
                success: false,
                error: '账号正在审核中，请等待管理员审核',
                code: 'ACCOUNT_PENDING'
            });
        }

        if (user.status === 'rejected') {
            return res.status(403).json({
                success: false,
                error: '账号已被拒绝，请联系管理员',
                code: 'ACCOUNT_REJECTED'
            });
        }

        if (user.status !== 'approved' && user.status !== 'active') {
            return res.status(403).json({
                success: false,
                error: '账号状态异常',
                code: 'ACCOUNT_INVALID'
            });
        }

        // 验证密码
        const crypto = await import('crypto-js');
        const hash = crypto.SHA256(password).toString();

        if (user.password_hash !== hash) {
            return res.status(401).json({
                success: false,
                error: '用户名或密码错误',
                code: 'INVALID_CREDENTIALS'
            });
        }

        // 更新最后登录时间
        await supabase
            .from('users')
            .update({ last_login_at: new Date().toISOString() })
            .eq('id', user.id);

        // 生成 JWT
        const jwt = await import('jsonwebtoken');
        const JWT_SECRET = process.env.JWT_SECRET || 'default_secret_change_this';
        const token = jwt.default.sign(
            {
                id: user.id,
                username: user.username,
                role: user.role,
                tenant_id: user.tenant_id,
                store_id: user.store_id
            },
            JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
        );

        return res.status(200).json({
            success: true,
            data: {
                user: {
                    id: user.id,
                    username: user.username,
                    name: user.name || user.full_name || user.username,
                    role: user.role,
                    status: user.status,
                    email: user.email,
                    phone: user.phone,
                    tenant_id: user.tenant_id,
                    store_id: user.store_id
                },
                token: token
            },
            message: '登录成功'
        });

    } catch (error) {
        logger.error('[Login] 登录异常:', error);
        return res.status(500).json({
            success: false,
            error: '登录失败，请稍后重试',
            code: 'INTERNAL_ERROR'
        });
    }
});

// ============================================================
// POST /api/auth/register - 注册
// ============================================================
router.post('/register', async (req, res) => {
    try {
        const { username, password, name, role, phone, email } = req.body;

        const errors = [];
        const usernameError = isRequired(username, '用户名');
        if (usernameError) errors.push(usernameError);
        const passwordError = isValidPassword(password);
        if (passwordError) errors.push(passwordError);
        if (phone) {
            const phoneError = isValidPhone(phone);
            if (phoneError) errors.push(phoneError);
        }

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

        // 检查手机号是否已存在
        if (phone) {
            const { data: existingPhone } = await supabase
                .from('users')
                .select('id')
                .eq('phone', phone);

            if (existingPhone && existingPhone.length > 0) {
                return res.status(409).json({
                    success: false,
                    error: '手机号已被注册',
                    code: 'PHONE_EXISTS'
                });
            }
        }

        const userRole = role || 'employee';
        if (userRole === 'owner') {
            return res.status(403).json({
                success: false,
                error: '老板账号需管理员创建',
                code: 'ROLE_NOT_ALLOWED'
            });
        }

        const crypto = await import('crypto-js');
        const passwordHash = crypto.SHA256(password).toString();

        const userData = {
            username: username,
            password_hash: passwordHash,
            name: name || username,
            full_name: name || username,
            role: userRole,
            status: 'pending',
            phone: phone || null,
            email: email || null,
            registered_at: new Date().toISOString(),
            created_at: new Date().toISOString()
        };

        const { data: newUser, error: insertError } = await supabase
            .from('users')
            .insert(userData)
            .select('id, username, name, full_name, role, status, phone, email')
            .single();

        if (insertError) {
            logger.error('[Register] 创建用户失败:', insertError);
            return res.status(500).json({
                success: false,
                error: '注册失败，请稍后重试',
                code: 'DB_ERROR'
            });
        }

        return res.status(201).json({
            success: true,
            data: newUser,
            message: '注册成功，请等待管理员审核'
        });

    } catch (error) {
        logger.error('[Register] 注册异常:', error);
        return res.status(500).json({
            success: false,
            error: '注册失败',
            code: 'INTERNAL_ERROR'
        });
    }
});

// ============================================================
// GET /api/auth/me - 获取当前用户信息
// ============================================================
router.get('/me', authMiddleware, async (req, res) => {  // ✅ 修复：改为 authMiddleware
    try {
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({
                success: false,
                error: '未授权',
                code: 'UNAUTHORIZED'
            });
        }

        const user = await getUserById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                error: '用户不存在',
                code: 'USER_NOT_FOUND'
            });
        }

        // 获取用户权限
        const { data: permissions } = await supabase
            .from('user_permissions')
            .select('permission_code')
            .eq('user_id', userId);

        // 移除敏感字段
        const { password_hash, ...safeUser } = user;

        return res.status(200).json({
            success: true,
            data: {
                ...safeUser,
                permissions: permissions ? permissions.map(p => p.permission_code) : []
            }
        });

    } catch (error) {
        logger.error('[Me] 获取用户信息异常:', error);
        return res.status(500).json({
            success: false,
            error: '获取用户信息失败',
            code: 'INTERNAL_ERROR'
        });
    }
});

// ============================================================
// POST /api/auth/logout - 登出
// ============================================================
router.post('/logout', async (req, res) => {
    try {
        // JWT 是无状态的，客户端清除 token 即可
        return res.status(200).json({
            success: true,
            message: '登出成功'
        });
    } catch (error) {
        logger.error('[Logout] 登出异常:', error);
        return res.status(500).json({
            success: false,
            error: '登出失败',
            code: 'INTERNAL_ERROR'
        });
    }
});

// ============================================================
// POST /api/auth/reset-password - 重置密码
// ============================================================
router.post('/reset-password', async (req, res) => {
    try {
        const { username, newPassword } = req.body;

        const errors = [];
        const usernameError = isRequired(username, '用户名');
        if (usernameError) errors.push(usernameError);
        const passwordError = isValidPassword(newPassword);
        if (passwordError) errors.push(passwordError);

        if (errors.length > 0) {
            return res.status(400).json({
                success: false,
                error: '参数验证失败',
                errors: errors,
                code: 'VALIDATION_ERROR'
            });
        }

        const { data: users } = await supabase
            .from('users')
            .select('id, status')
            .eq('username', username);

        if (!users || users.length === 0) {
            return res.status(404).json({
                success: false,
                error: '用户不存在',
                code: 'USER_NOT_FOUND'
            });
        }

        const user = users[0];

        if (user.status !== 'approved' && user.status !== 'active') {
            return res.status(403).json({
                success: false,
                error: '账号未审核通过，无法重置密码',
                code: 'ACCOUNT_NOT_APPROVED'
            });
        }

        const crypto = await import('crypto-js');
        const newHash = crypto.SHA256(newPassword).toString();

        await supabase
            .from('users')
            .update({ password_hash: newHash })
            .eq('id', user.id);

        return res.status(200).json({
            success: true,
            message: '密码重置成功'
        });

    } catch (error) {
        logger.error('[ResetPassword] 重置密码异常:', error);
        return res.status(500).json({
            success: false,
            error: '密码重置失败',
            code: 'INTERNAL_ERROR'
        });
    }
});

// ============================================================
// 导出 Router
// ============================================================
export default router;