/**
 * api/orders.js - 订单 API（Express Router 版本）
 * GET    /api/orders - 订单列表（支持分页、筛选、排序）
 * GET    /api/orders/:id - 订单详情
 * POST   /api/orders - 创建订单
 * PUT    /api/orders/:id - 更新订单
 * DELETE /api/orders/:id - 删除订单
 * GET    /api/orders/stats/summary - 订单统计
 * 
 * @module orders
 * @description 订单的完整 CRUD 操作
 */

import express from 'express';
import { supabase, getPagination, safeQuery, getUserById } from '../shared/lib/supabase.js';
import { authenticate, requireRole } from '../shared/lib/auth.js';
import { logger } from '../shared/lib/logger.js';

const router = express.Router();

// ============================================================
// GET /api/orders - 订单列表
// ============================================================
router.get('/', authenticate, async (req, res) => {
    try {
        const userId = req.user?.id;
        const {
            page = 1,
            limit = 20,
            status,
            date_from,
            date_to,
            customer_id,
            employee_id,
            search
        } = req.query;

        const user = await getUserById(userId);
        if (!user) {
            return res.status(401).json({
                success: false,
                error: '未授权',
                code: 'UNAUTHORIZED'
            });
        }

        let query = supabase.from('orders').select('*, customers(name, phone), employees(full_name)', { count: 'exact' });

        // 租户隔离
        if (user?.tenant_id) {
            query = query.eq('tenant_id', user.tenant_id);
        }

        // 门店隔离
        if (user?.store_id) {
            query = query.eq('store_id', user.store_id);
        }

        // 普通员工只能看自己的订单
        if (user?.role === 'employee' || user?.role === 'cashier') {
            query = query.eq('employee_id', userId);
        }

        // 筛选条件
        if (status && status !== 'all') {
            query = query.eq('status', status);
        }

        if (date_from) {
            query = query.gte('created_at', date_from);
        }

        if (date_to) {
            query = query.lte('created_at', date_to);
        }

        if (customer_id) {
            query = query.eq('customer_id', customer_id);
        }

        if (employee_id && (user?.role === 'owner' || user?.role === 'admin' || user?.role === 'manager')) {
            query = query.eq('employee_id', employee_id);
        }

        if (search) {
            query = query.or(`order_number.ilike.%${search}%,customer_name.ilike.%${search}%,plate_number.ilike.%${search}%`);
        }

        // 分页和排序
        const { from, to } = getPagination(parseInt(page), parseInt(limit));
        query = query.order('created_at', { ascending: false }).range(from, to);

        const result = await safeQuery(() => query);

        if (!result.success) {
            return res.status(500).json({
                success: false,
                error: '查询订单失败',
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
        logger.error('[Orders] 获取订单列表失败:', error);
        return res.status(500).json({
            success: false,
            error: '获取订单列表失败',
            code: 'INTERNAL_ERROR'
        });
    }
});

// ============================================================
// GET /api/orders/:id - 订单详情
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

        let query = supabase
            .from('orders')
            .select('*, customers(*), employees(full_name, role)')
            .eq('id', id);

        if (user?.tenant_id) {
            query = query.eq('tenant_id', user.tenant_id);
        }

        // 普通员工只能看自己的订单
        if (user?.role === 'employee' || user?.role === 'cashier') {
            query = query.eq('employee_id', userId);
        }

        const result = await safeQuery(() => query.single());

        if (!result.success) {
            return res.status(404).json({
                success: false,
                error: '订单不存在',
                code: 'ORDER_NOT_FOUND'
            });
        }

        // 获取订单项
        const { data: items } = await supabase
            .from('order_items')
            .select('*, products(name, sku)')
            .eq('order_id', id);

        return res.status(200).json({
            success: true,
            data: {
                ...result.data,
                items: items || []
            }
        });

    } catch (error) {
        logger.error('[Orders] 获取订单详情失败:', error);
        return res.status(500).json({
            success: false,
            error: '获取订单详情失败',
            code: 'INTERNAL_ERROR'
        });
    }
});

// ============================================================
// POST /api/orders - 创建订单
// ============================================================
router.post('/', authenticate, async (req, res) => {
    try {
        const userId = req.user?.id;
        const {
            customer_id,
            customer_name,
            plate_number,
            items = [],
            total,
            discount = 0,
            tax = 0,
            payment_method,
            status = 'pending',
            note
        } = req.body;

        const user = await getUserById(userId);
        if (!user) {
            return res.status(401).json({
                success: false,
                error: '未授权',
                code: 'UNAUTHORIZED'
            });
        }

        // 验证必填字段
        if (!items || items.length === 0) {
            return res.status(400).json({
                success: false,
                error: '订单至少包含一个商品',
                code: 'NO_ITEMS'
            });
        }

        if (!plate_number) {
            return res.status(400).json({
                success: false,
                error: '车牌号不能为空',
                code: 'PLATE_REQUIRED'
            });
        }

        // 计算总金额
        let calculatedTotal = 0;
        items.forEach(item => {
            const price = item.price || 0;
            const qty = item.quantity || 1;
            calculatedTotal += price * qty;
        });

        // 应用折扣
        const finalTotal = calculatedTotal - (discount || 0);

        // 生成订单号
        const orderNumber = `ORD${Date.now().toString(36).toUpperCase()}${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
        const now = new Date().toISOString();
        const today = new Date().toISOString().split('T')[0];

        // 创建订单
        const orderData = {
            order_number: orderNumber,
            customer_id: customer_id || null,
            customer_name: customer_name || '散客',
            plate_number: plate_number.toUpperCase(),
            items: items,
            subtotal: calculatedTotal,
            discount: discount || 0,
            tax: tax || 0,
            total: finalTotal,
            payment_method: payment_method || 'cash',
            status: status,
            note: note || null,
            employee_id: userId,
            date: today,
            created_at: now,
            updated_at: now,
            tenant_id: user?.tenant_id || null,
            store_id: user?.store_id || null
        };

        const result = await safeQuery(() =>
            supabase.from('orders').insert(orderData).select().single()
        );

        if (!result.success) {
            logger.error('[Orders] 创建订单失败:', result.error);
            return res.status(500).json({
                success: false,
                error: '创建订单失败',
                code: 'DB_ERROR'
            });
        }

        // 保存订单项
        const orderItems = items.map(item => ({
            order_id: result.data.id,
            product_id: item.product_id || null,
            product_name: item.product_name || item.name || '商品',
            quantity: item.quantity || 1,
            unit_price: item.price || 0,
            total_price: (item.price || 0) * (item.quantity || 1),
            created_at: now
        }));

        if (orderItems.length > 0) {
            await supabase.from('order_items').insert(orderItems);
        }

        // 更新客户信息（如果是老客户）
        if (customer_id) {
            await supabase
                .from('customers')
                .update({
                    last_order_at: now,
                    order_count: supabase.raw('order_count + 1'),
                    total_spent: supabase.raw('total_spent + ?', [finalTotal])
                })
                .eq('id', customer_id);
        }

        // 减少库存
        for (const item of items) {
            if (item.product_id) {
                const { data: product } = await supabase
                    .from('products')
                    .select('stock_quantity')
                    .eq('id', item.product_id)
                    .single();

                if (product && product.stock_quantity !== null) {
                    const newStock = Math.max(0, product.stock_quantity - (item.quantity || 1));
                    await supabase
                        .from('products')
                        .update({ stock_quantity: newStock })
                        .eq('id', item.product_id);
                }
            }
        }

        return res.status(201).json({
            success: true,
            data: result.data,
            message: `订单 ${orderNumber} 创建成功`
        });

    } catch (error) {
        logger.error('[Orders] 创建订单失败:', error);
        return res.status(500).json({
            success: false,
            error: '创建订单失败',
            code: 'INTERNAL_ERROR'
        });
    }
});

// ============================================================
// PUT /api/orders/:id - 更新订单
// ============================================================
router.put('/:id', authenticate, requireRole(['owner', 'admin', 'manager']), async (req, res) => {
    try {
        const { id } = req.params;
        const {
            status,
            payment_method,
            discount,
            note,
            items
        } = req.body;

        const userId = req.user?.id;

        const user = await getUserById(userId);
        if (!user) {
            return res.status(401).json({
                success: false,
                error: '未授权',
                code: 'UNAUTHORIZED'
            });
        }

        // 检查订单是否存在
        const { data: existing } = await supabase
            .from('orders')
            .select('*')
            .eq('id', id)
            .single();

        if (!existing) {
            return res.status(404).json({
                success: false,
                error: '订单不存在',
                code: 'ORDER_NOT_FOUND'
            });
        }

        // 构建更新数据
        const updateData = {
            updated_at: new Date().toISOString()
        };

        if (status) updateData.status = status;
        if (payment_method) updateData.payment_method = payment_method;
        if (discount !== undefined) updateData.discount = discount;
        if (note !== undefined) updateData.note = note;

        // 如果更新了状态为已完成，记录完成时间
        if (status === 'completed' && existing.status !== 'completed') {
            updateData.completed_at = new Date().toISOString();
        }

        // 如果更新了订单项，重新计算总金额
        if (items && Array.isArray(items)) {
            let calculatedTotal = 0;
            items.forEach(item => {
                calculatedTotal += (item.price || 0) * (item.quantity || 1);
            });
            updateData.total = calculatedTotal - (discount || existing.discount || 0);
            updateData.subtotal = calculatedTotal;

            // 更新订单项
            await supabase
                .from('order_items')
                .delete()
                .eq('order_id', id);

            const orderItems = items.map(item => ({
                order_id: id,
                product_id: item.product_id || null,
                product_name: item.product_name || item.name || '商品',
                quantity: item.quantity || 1,
                unit_price: item.price || 0,
                total_price: (item.price || 0) * (item.quantity || 1),
                created_at: new Date().toISOString()
            }));

            if (orderItems.length > 0) {
                await supabase.from('order_items').insert(orderItems);
            }
        }

        const result = await safeQuery(() =>
            supabase.from('orders').update(updateData).eq('id', id).select().single()
        );

        if (!result.success) {
            return res.status(500).json({
                success: false,
                error: '更新订单失败',
                code: 'DB_ERROR'
            });
        }

        return res.status(200).json({
            success: true,
            data: result.data,
            message: '订单更新成功'
        });

    } catch (error) {
        logger.error('[Orders] 更新订单失败:', error);
        return res.status(500).json({
            success: false,
            error: '更新订单失败',
            code: 'INTERNAL_ERROR'
        });
    }
});

// ============================================================
// DELETE /api/orders/:id - 删除订单
// ============================================================
router.delete('/:id', authenticate, requireRole(['owner', 'admin']), async (req, res) => {
    try {
        const { id } = req.params;

        // 检查订单是否存在
        const { data: existing } = await supabase
            .from('orders')
            .select('status')
            .eq('id', id)
            .single();

        if (!existing) {
            return res.status(404).json({
                success: false,
                error: '订单不存在',
                code: 'ORDER_NOT_FOUND'
            });
        }

        // 不允许删除已完成的订单（可以改为取消）
        if (existing.status === 'completed') {
            return res.status(400).json({
                success: false,
                error: '已完成订单不能删除，请使用取消操作',
                code: 'ORDER_COMPLETED'
            });
        }

        // 删除订单项
        await supabase
            .from('order_items')
            .delete()
            .eq('order_id', id);

        // 删除订单
        const result = await safeQuery(() =>
            supabase.from('orders').delete().eq('id', id)
        );

        if (!result.success) {
            return res.status(500).json({
                success: false,
                error: '删除订单失败',
                code: 'DB_ERROR'
            });
        }

        return res.status(200).json({
            success: true,
            message: '订单已删除'
        });

    } catch (error) {
        logger.error('[Orders] 删除订单失败:', error);
        return res.status(500).json({
            success: false,
            error: '删除订单失败',
            code: 'INTERNAL_ERROR'
        });
    }
});

// ============================================================
// POST /api/orders/:id/cancel - 取消订单
// ============================================================
router.post('/:id/cancel', authenticate, async (req, res) => {
    try {
        const { id } = req.params;
        const { reason } = req.body;

        const { data: existing } = await supabase
            .from('orders')
            .select('status')
            .eq('id', id)
            .single();

        if (!existing) {
            return res.status(404).json({
                success: false,
                error: '订单不存在',
                code: 'ORDER_NOT_FOUND'
            });
        }

        if (existing.status === 'completed') {
            return res.status(400).json({
                success: false,
                error: '已完成订单不能取消',
                code: 'ORDER_COMPLETED'
            });
        }

        const result = await safeQuery(() =>
            supabase.from('orders')
                .update({
                    status: 'cancelled',
                    cancel_reason: reason || '用户取消',
                    cancelled_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                })
                .eq('id', id)
                .select()
                .single()
        );

        if (!result.success) {
            return res.status(500).json({
                success: false,
                error: '取消订单失败',
                code: 'DB_ERROR'
            });
        }

        // 恢复库存
        const { data: items } = await supabase
            .from('order_items')
            .select('product_id, quantity')
            .eq('order_id', id);

        for (const item of items || []) {
            if (item.product_id) {
                const { data: product } = await supabase
                    .from('products')
                    .select('stock_quantity')
                    .eq('id', item.product_id)
                    .single();

                if (product) {
                    await supabase
                        .from('products')
                        .update({
                            stock_quantity: (product.stock_quantity || 0) + (item.quantity || 0)
                        })
                        .eq('id', item.product_id);
                }
            }
        }

        return res.status(200).json({
            success: true,
            data: result.data,
            message: '订单已取消'
        });

    } catch (error) {
        logger.error('[Orders] 取消订单失败:', error);
        return res.status(500).json({
            success: false,
            error: '取消订单失败',
            code: 'INTERNAL_ERROR'
        });
    }
});

// ============================================================
// GET /api/orders/stats/summary - 订单统计
// ============================================================
router.get('/stats/summary', authenticate, requireRole(['owner', 'admin', 'manager']), async (req, res) => {
    try {
        const userId = req.user?.id;
        const { date_from, date_to } = req.query;

        const user = await getUserById(userId);
        if (!user) {
            return res.status(401).json({
                success: false,
                error: '未授权',
                code: 'UNAUTHORIZED'
            });
        }

        let query = supabase.from('orders').select('*');

        if (user?.tenant_id) {
            query = query.eq('tenant_id', user.tenant_id);
        }

        if (date_from) {
            query = query.gte('created_at', date_from);
        }

        if (date_to) {
            query = query.lte('created_at', date_to);
        }

        const { data: orders, error } = await query;

        if (error) {
            return res.status(500).json({
                success: false,
                error: '查询订单统计失败',
                code: 'DB_ERROR'
            });
        }

        const totalOrders = orders?.length || 0;
        const completedOrders = orders?.filter(o => o.status === 'completed').length || 0;
        const pendingOrders = orders?.filter(o => o.status === 'pending' || o.status === 'confirmed').length || 0;
        const cancelledOrders = orders?.filter(o => o.status === 'cancelled').length || 0;

        const totalRevenue = orders
            ?.filter(o => o.status === 'completed')
            .reduce((sum, o) => sum + (o.total || 0), 0) || 0;

        const paymentMethods = {};
        orders?.forEach(o => {
            const method = o.payment_method || 'other';
            if (!paymentMethods[method]) {
                paymentMethods[method] = { count: 0, total: 0 };
            }
            paymentMethods[method].count += 1;
            paymentMethods[method].total += (o.total || 0);
        });

        return res.status(200).json({
            success: true,
            data: {
                total_orders: totalOrders,
                completed_orders: completedOrders,
                pending_orders: pendingOrders,
                cancelled_orders: cancelledOrders,
                total_revenue: totalRevenue,
                avg_order_value: completedOrders > 0 ? totalRevenue / completedOrders : 0,
                payment_methods: paymentMethods
            }
        });

    } catch (error) {
        logger.error('[Orders] 获取订单统计失败:', error);
        return res.status(500).json({
            success: false,
            error: '获取订单统计失败',
            code: 'INTERNAL_ERROR'
        });
    }
});

export default router;