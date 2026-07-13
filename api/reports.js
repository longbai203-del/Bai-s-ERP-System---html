/**
 * api/reports.js - 报表 API（Express Router 版本）
 * GET /api/reports/daily - 日报
 * GET /api/reports/monthly - 月报
 * GET /api/reports/sales - 销售报表
 * GET /api/reports/top-products - 热销产品
 * GET /api/reports/revenue - 收入报表
 * 
 * @module reports
 * @description 完整的报表系统
 */

import express from 'express';
import { supabase, safeQuery, getUserById } from '../shared/lib/supabase.js';
import { authenticate, requireRole } from '../shared/lib/auth.js';
import { logger } from '../shared/lib/logger.js';

const router = express.Router();

// ============================================================
// GET /api/reports/daily - 日报
// ============================================================
router.get('/daily', authenticate, requireRole(['owner', 'admin', 'manager']), async (req, res) => {
    try {
        const userId = req.user?.id;
        const { date } = req.query;

        const reportDate = date || new Date().toISOString().split('T')[0];

        const user = await getUserById(userId);
        if (!user) {
            return res.status(401).json({
                success: false,
                error: '未授权',
                code: 'UNAUTHORIZED'
            });
        }

        let ordersQuery = supabase
            .from('orders')
            .select('*')
            .eq('date', reportDate);

        if (user?.tenant_id) {
            ordersQuery = ordersQuery.eq('tenant_id', user.tenant_id);
        }
        if (user?.store_id) {
            ordersQuery = ordersQuery.eq('store_id', user.store_id);
        }

        const { data: orders } = await ordersQuery;

        const totalRevenue = (orders || []).reduce((sum, o) => sum + (o.total || o.total_amount || 0), 0);
        const totalOrders = (orders || []).length;
        const pendingOrders = (orders || []).filter(o => o.status === 'pending' || o.status === 'confirmed').length;
        const completedOrders = (orders || []).filter(o => o.status === 'completed').length;
        const cancelledOrders = (orders || []).filter(o => o.status === 'cancelled').length;

        const paymentStats = {};
        (orders || []).forEach(o => {
            const method = o.payment_method || 'other';
            paymentStats[method] = (paymentStats[method] || 0) + (o.total || o.total_amount || 0);
        });

        return res.status(200).json({
            success: true,
            data: {
                date: reportDate,
                summary: {
                    totalRevenue: totalRevenue,
                    totalOrders: totalOrders,
                    pendingOrders: pendingOrders,
                    completedOrders: completedOrders,
                    cancelledOrders: cancelledOrders,
                    avgOrderValue: totalOrders > 0 ? totalRevenue / totalOrders : 0
                },
                paymentBreakdown: paymentStats,
                orders: orders || []
            }
        });

    } catch (error) {
        logger.error('[Reports] 获取日报失败:', error);
        return res.status(500).json({
            success: false,
            error: '获取日报失败',
            code: 'INTERNAL_ERROR'
        });
    }
});

// ============================================================
// GET /api/reports/monthly - 月报
// ============================================================
router.get('/monthly', authenticate, requireRole(['owner', 'admin', 'manager']), async (req, res) => {
    try {
        const userId = req.user?.id;
        const { month } = req.query;

        const reportMonth = month || new Date().toISOString().slice(0, 7);
        const startDate = `${reportMonth}-01`;
        const lastDay = new Date(parseInt(reportMonth.split('-')[0]), parseInt(reportMonth.split('-')[1]), 0).getDate();
        const endDate = `${reportMonth}-${String(lastDay).padStart(2, '0')}`;

        const user = await getUserById(userId);
        if (!user) {
            return res.status(401).json({
                success: false,
                error: '未授权',
                code: 'UNAUTHORIZED'
            });
        }

        let ordersQuery = supabase
            .from('orders')
            .select('*')
            .gte('date', startDate)
            .lte('date', endDate);

        if (user?.tenant_id) {
            ordersQuery = ordersQuery.eq('tenant_id', user.tenant_id);
        }

        const { data: orders } = await ordersQuery;

        const totalRevenue = (orders || []).reduce((sum, o) => sum + (o.total || o.total_amount || 0), 0);
        const totalOrders = (orders || []).length;

        const dailyTrend = {};
        (orders || []).forEach(o => {
            const d = o.date || o.created_at?.split('T')[0];
            if (d) {
                if (!dailyTrend[d]) {
                    dailyTrend[d] = { revenue: 0, count: 0 };
                }
                dailyTrend[d].revenue += (o.total || o.total_amount || 0);
                dailyTrend[d].count += 1;
            }
        });

        // 按日期排序
        const sortedDailyTrend = Object.keys(dailyTrend).sort().reduce((acc, key) => {
            acc[key] = dailyTrend[key];
            return acc;
        }, {});

        return res.status(200).json({
            success: true,
            data: {
                month: reportMonth,
                summary: {
                    totalRevenue: totalRevenue,
                    totalOrders: totalOrders,
                    avgOrderValue: totalOrders > 0 ? totalRevenue / totalOrders : 0
                },
                dailyTrend: sortedDailyTrend,
                orders: orders || []
            }
        });

    } catch (error) {
        logger.error('[Reports] 获取月报失败:', error);
        return res.status(500).json({
            success: false,
            error: '获取月报失败',
            code: 'INTERNAL_ERROR'
        });
    }
});

// ============================================================
// GET /api/reports/sales - 销售报表（按产品/服务）
// ============================================================
router.get('/sales', authenticate, requireRole(['owner', 'admin', 'manager']), async (req, res) => {
    try {
        const userId = req.user?.id;
        const { startDate, endDate, limit = 20 } = req.query;

        const user = await getUserById(userId);
        if (!user) {
            return res.status(401).json({
                success: false,
                error: '未授权',
                code: 'UNAUTHORIZED'
            });
        }

        // 构建查询 - 使用联表查询
        let query = supabase
            .from('order_items')
            .select(`
                product_id,
                product_name,
                quantity,
                unit_price,
                total_price,
                order_id,
                orders:order_id (
                    created_at,
                    status,
                    tenant_id
                )
            `);

        if (user?.tenant_id) {
            query = query.eq('orders.tenant_id', user.tenant_id);
        }

        if (startDate) {
            query = query.gte('orders.created_at', startDate);
        }
        if (endDate) {
            query = query.lte('orders.created_at', endDate);
        }

        query = query.eq('orders.status', 'completed');

        const { data, error } = await query;

        if (error) {
            logger.error('[Reports] 查询销售数据失败:', error);
            return res.status(500).json({
                success: false,
                error: '查询销售数据失败',
                code: 'DB_ERROR'
            });
        }

        // 汇总产品销量
        const productStats = {};
        (data || []).forEach(item => {
            const key = item.product_id || item.product_name;
            if (!productStats[key]) {
                productStats[key] = {
                    product_id: item.product_id,
                    product_name: item.product_name,
                    quantity: 0,
                    revenue: 0,
                    orders: new Set()
                };
            }
            productStats[key].quantity += item.quantity || 0;
            productStats[key].revenue += item.total_price || 0;
            if (item.order_id) {
                productStats[key].orders.add(item.order_id);
            }
        });

        // 排序并限制数量
        const sorted = Object.values(productStats)
            .map(p => ({
                ...p,
                order_count: p.orders.size
            }))
            .sort((a, b) => b.revenue - a.revenue)
            .slice(0, parseInt(limit));

        return res.status(200).json({
            success: true,
            data: sorted,
            total: sorted.length
        });

    } catch (error) {
        logger.error('[Reports] 获取销售报表失败:', error);
        return res.status(500).json({
            success: false,
            error: '获取销售报表失败',
            code: 'INTERNAL_ERROR'
        });
    }
});

// ============================================================
// GET /api/reports/top-products - 热销产品排行
// ============================================================
router.get('/top-products', authenticate, requireRole(['owner', 'admin', 'manager']), async (req, res) => {
    try {
        const userId = req.user?.id;
        const { days = 30, limit = 10 } = req.query;

        const user = await getUserById(userId);
        if (!user) {
            return res.status(401).json({
                success: false,
                error: '未授权',
                code: 'UNAUTHORIZED'
            });
        }

        const startDate = new Date();
        startDate.setDate(startDate.getDate() - parseInt(days));
        const startDateStr = startDate.toISOString().split('T')[0];

        let query = supabase
            .from('order_items')
            .select(`
                product_id,
                product_name,
                quantity,
                total_price,
                orders:order_id (
                    status,
                    tenant_id,
                    created_at
                )
            `)
            .eq('orders.status', 'completed')
            .gte('orders.created_at', startDateStr);

        if (user?.tenant_id) {
            query = query.eq('orders.tenant_id', user.tenant_id);
        }

        const { data, error } = await query;

        if (error) {
            logger.error('[Reports] 查询热销产品失败:', error);
            return res.status(500).json({
                success: false,
                error: '查询热销产品失败',
                code: 'DB_ERROR'
            });
        }

        const productStats = {};
        (data || []).forEach(item => {
            const key = item.product_id || item.product_name;
            if (!productStats[key]) {
                productStats[key] = {
                    product_id: item.product_id,
                    product_name: item.product_name,
                    total_quantity: 0,
                    total_revenue: 0
                };
            }
            productStats[key].total_quantity += item.quantity || 0;
            productStats[key].total_revenue += item.total_price || 0;
        });

        const sorted = Object.values(productStats)
            .sort((a, b) => b.total_quantity - a.total_quantity)
            .slice(0, parseInt(limit));

        return res.status(200).json({
            success: true,
            data: sorted,
            period_days: parseInt(days)
        });

    } catch (error) {
        logger.error('[Reports] 获取热销产品失败:', error);
        return res.status(500).json({
            success: false,
            error: '获取热销产品失败',
            code: 'INTERNAL_ERROR'
        });
    }
});

// ============================================================
// GET /api/reports/revenue - 收入报表
// ============================================================
router.get('/revenue', authenticate, requireRole(['owner', 'admin', 'manager']), async (req, res) => {
    try {
        const userId = req.user?.id;
        const { period = 'month', year, month } = req.query;

        const user = await getUserById(userId);
        if (!user) {
            return res.status(401).json({
                success: false,
                error: '未授权',
                code: 'UNAUTHORIZED'
            });
        }

        const now = new Date();
        const targetYear = parseInt(year) || now.getFullYear();
        const targetMonth = parseInt(month) || (now.getMonth() + 1);

        let startDate, endDate;

        if (period === 'month') {
            startDate = `${targetYear}-${String(targetMonth).padStart(2, '0')}-01`;
            const lastDay = new Date(targetYear, targetMonth, 0).getDate();
            endDate = `${targetYear}-${String(targetMonth).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;
        } else if (period === 'year') {
            startDate = `${targetYear}-01-01`;
            endDate = `${targetYear}-12-31`;
        } else {
            // 默认最近30天
            const d = new Date();
            d.setDate(d.getDate() - 30);
            startDate = d.toISOString().split('T')[0];
            endDate = new Date().toISOString().split('T')[0];
        }

        let query = supabase
            .from('orders')
            .select('*')
            .gte('date', startDate)
            .lte('date', endDate);

        if (user?.tenant_id) {
            query = query.eq('tenant_id', user.tenant_id);
        }

        const { data: orders, error } = await query;

        if (error) {
            logger.error('[Reports] 查询收入数据失败:', error);
            return res.status(500).json({
                success: false,
                error: '查询收入数据失败',
                code: 'DB_ERROR'
            });
        }

        const totalRevenue = (orders || [])
            .filter(o => o.status === 'completed')
            .reduce((sum, o) => sum + (o.total || 0), 0);

        const dailyRevenue = {};
        (orders || [])
            .filter(o => o.status === 'completed')
            .forEach(o => {
                const d = o.date || o.created_at?.split('T')[0];
                if (d) {
                    dailyRevenue[d] = (dailyRevenue[d] || 0) + (o.total || 0);
                }
            });

        // 按日期排序
        const sortedDailyRevenue = Object.keys(dailyRevenue).sort().reduce((acc, key) => {
            acc[key] = dailyRevenue[key];
            return acc;
        }, {});

        return res.status(200).json({
            success: true,
            data: {
                period: period,
                start_date: startDate,
                end_date: endDate,
                total_revenue: totalRevenue,
                total_orders: orders?.length || 0,
                completed_orders: orders?.filter(o => o.status === 'completed').length || 0,
                daily_revenue: sortedDailyRevenue,
                orders: orders || []
            }
        });

    } catch (error) {
        logger.error('[Reports] 获取收入报表失败:', error);
        return res.status(500).json({
            success: false,
            error: '获取收入报表失败',
            code: 'INTERNAL_ERROR'
        });
    }
});

export default router;