/**
 * api/inventory.js - 库存 API（Express Router 版本）
 * GET    /api/inventory - 库存列表
 * GET    /api/inventory/:id - 产品详情
 * PUT    /api/inventory/:id - 更新产品
 * POST   /api/inventory/stock-in - 入库
 * POST   /api/inventory/stock-out - 出库
 * GET    /api/inventory/stats/low-stock - 低库存列表
 * 
 * 增强点：统一使用 Express Router，补充低库存查询和统计
 */

import express from 'express';
import { supabase, getPagination, safeQuery, getUserById } from '../shared/lib/supabase.js';
import { authenticate, requireRole } from '../shared/lib/auth.js';
import { validateInventory, isValidInteger } from '../shared/validation/index.js';
import { logger } from '../shared/lib/logger.js';

const router = express.Router();

// ============================================================
// GET /api/inventory - 库存列表
// ============================================================
router.get('/', authenticate, async (req, res) => {
    try {
        const userId = req.user?.id;
        const { page = 1, limit = 20, search, category, low_stock } = req.query;

        const user = await getUserById(userId);
        if (!user) {
            return res.status(401).json({
                success: false,
                error: '未授权',
                code: 'UNAUTHORIZED'
            });
        }

        let query = supabase.from('products').select('*, categories(name)', { count: 'exact' });

        if (user?.tenant_id) {
            query = query.eq('tenant_id', user.tenant_id);
        }

        if (search) {
            query = query.or(`name.ilike.%${search}%,sku.ilike.%${search}%,barcode.ilike.%${search}%`);
        }

        if (category && category !== 'all') {
            query = query.eq('category_id', category);
        }

        if (low_stock === 'true') {
            query = query.lt('stock_quantity', 'min_stock');
        }

        const { from, to } = getPagination(parseInt(page), parseInt(limit));
        query = query.order('name', { ascending: true }).range(from, to);

        const result = await safeQuery(() => query);

        if (!result.success) {
            return res.status(500).json({
                success: false,
                error: '查询库存失败',
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
        logger.error('[Inventory] 获取库存列表失败:', error);
        return res.status(500).json({
            success: false,
            error: '获取库存列表失败',
            code: 'INTERNAL_ERROR'
        });
    }
});

// ============================================================
// GET /api/inventory/:id - 产品详情
// ============================================================
router.get('/:id', authenticate, async (req, res) => {
    try {
        const { id } = req.params;

        const result = await safeQuery(() =>
            supabase.from('products').select('*, categories(name)').eq('id', id).single()
        );

        if (!result.success) {
            return res.status(404).json({
                success: false,
                error: '产品不存在',
                code: 'PRODUCT_NOT_FOUND'
            });
        }

        // 获取库存变动历史
        const { data: transactions } = await supabase
            .from('stock_transactions')
            .select('*')
            .eq('product_id', id)
            .order('created_at', { ascending: false })
            .limit(20);

        return res.status(200).json({
            success: true,
            data: {
                ...result.data,
                transactions: transactions || []
            }
        });

    } catch (error) {
        logger.error('[Inventory] 获取产品失败:', error);
        return res.status(500).json({
            success: false,
            error: '获取产品失败',
            code: 'INTERNAL_ERROR'
        });
    }
});

// ============================================================
// PUT /api/inventory/:id - 更新产品
// ============================================================
router.put('/:id', authenticate, requireRole(['owner', 'admin', 'manager']), async (req, res) => {
    try {
        const { id } = req.params;
        const body = req.body;

        const errors = validateInventory(body);
        if (errors.length > 0) {
            return res.status(400).json({
                success: false,
                error: '参数验证失败',
                errors: errors,
                code: 'VALIDATION_ERROR'
            });
        }

        const updateData = {
            name: body.name,
            category_id: body.category_id,
            unit: body.unit,
            price: body.price,
            cost: body.cost,
            min_stock: body.min_stock,
            description: body.description,
            status: body.status,
            updated_at: new Date().toISOString()
        };

        Object.keys(updateData).forEach(key => {
            if (updateData[key] === undefined) delete updateData[key];
        });

        const result = await safeQuery(() =>
            supabase.from('products').update(updateData).eq('id', id).select().single()
        );

        if (!result.success) {
            return res.status(500).json({
                success: false,
                error: '更新产品失败',
                code: 'DB_ERROR'
            });
        }

        return res.status(200).json({
            success: true,
            data: result.data,
            message: '产品更新成功'
        });

    } catch (error) {
        logger.error('[Inventory] 更新产品失败:', error);
        return res.status(500).json({
            success: false,
            error: '更新产品失败',
            code: 'INTERNAL_ERROR'
        });
    }
});

// ============================================================
// POST /api/inventory/stock-in - 入库
// ============================================================
router.post('/stock-in', authenticate, requireRole(['owner', 'admin', 'manager']), async (req, res) => {
    try {
        const userId = req.user?.id;
        const { product_id, quantity, unit_price, supplier, note } = req.body;

        // 验证
        const errors = [];
        const productError = isRequired(product_id, '产品ID');
        if (productError) errors.push(productError);
        const qtyError = isValidInteger(quantity, 1);
        if (qtyError) errors.push(qtyError);

        if (errors.length > 0) {
            return res.status(400).json({
                success: false,
                error: '参数验证失败',
                errors: errors,
                code: 'VALIDATION_ERROR'
            });
        }

        // 获取产品
        const { data: product } = await supabase
            .from('products')
            .select('*')
            .eq('id', product_id)
            .single();

        if (!product) {
            return res.status(404).json({
                success: false,
                error: '产品不存在',
                code: 'PRODUCT_NOT_FOUND'
            });
        }

        const newQuantity = (product.stock_quantity || 0) + quantity;

        // 更新库存
        await supabase
            .from('products')
            .update({
                stock_quantity: newQuantity,
                cost: unit_price || product.cost,
                updated_at: new Date().toISOString()
            })
            .eq('id', product_id);

        // 记录入库日志
        await supabase.from('stock_transactions').insert({
            product_id: product_id,
            type: 'in',
            quantity: quantity,
            unit_price: unit_price || 0,
            total_price: (unit_price || 0) * quantity,
            supplier: supplier || '未知',
            note: note || '',
            created_by: userId,
            created_at: new Date().toISOString()
        });

        return res.status(200).json({
            success: true,
            message: `入库成功，${product.name} 当前库存: ${newQuantity}`,
            data: { product_id, new_quantity: newQuantity }
        });

    } catch (error) {
        logger.error('[Inventory] 入库失败:', error);
        return res.status(500).json({
            success: false,
            error: '入库失败',
            code: 'INTERNAL_ERROR'
        });
    }
});

// ============================================================
// POST /api/inventory/stock-out - 出库
// ============================================================
router.post('/stock-out', authenticate, requireRole(['owner', 'admin', 'manager']), async (req, res) => {
    try {
        const userId = req.user?.id;
        const { product_id, quantity, reason, note } = req.body;

        const errors = [];
        const productError = isRequired(product_id, '产品ID');
        if (productError) errors.push(productError);
        const qtyError = isValidInteger(quantity, 1);
        if (qtyError) errors.push(qtyError);

        if (errors.length > 0) {
            return res.status(400).json({
                success: false,
                error: '参数验证失败',
                errors: errors,
                code: 'VALIDATION_ERROR'
            });
        }

        const { data: product } = await supabase
            .from('products')
            .select('*')
            .eq('id', product_id)
            .single();

        if (!product) {
            return res.status(404).json({
                success: false,
                error: '产品不存在',
                code: 'PRODUCT_NOT_FOUND'
            });
        }

        if ((product.stock_quantity || 0) < quantity) {
            return res.status(400).json({
                success: false,
                error: `库存不足！当前库存: ${product.stock_quantity}`,
                code: 'INSUFFICIENT_STOCK'
            });
        }

        const newQuantity = (product.stock_quantity || 0) - quantity;

        await supabase
            .from('products')
            .update({
                stock_quantity: newQuantity,
                updated_at: new Date().toISOString()
            })
            .eq('id', product_id);

        await supabase.from('stock_transactions').insert({
            product_id: product_id,
            type: 'out',
            quantity: quantity,
            reason: reason || '日常消耗',
            note: note || '',
            created_by: userId,
            created_at: new Date().toISOString()
        });

        return res.status(200).json({
            success: true,
            message: `出库成功，${product.name} 当前库存: ${newQuantity}`,
            data: { product_id, new_quantity: newQuantity }
        });

    } catch (error) {
        logger.error('[Inventory] 出库失败:', error);
        return res.status(500).json({
            success: false,
            error: '出库失败',
            code: 'INTERNAL_ERROR'
        });
    }
});

// ============================================================
// GET /api/inventory/stats/low-stock - 低库存列表
// ============================================================
router.get('/stats/low-stock', authenticate, async (req, res) => {
    try {
        const { threshold = 10 } = req.query;

        const { data, error } = await supabase
            .from('products')
            .select('*')
            .lt('stock_quantity', parseInt(threshold))
            .eq('status', 'active')
            .order('stock_quantity', { ascending: true });

        if (error) {
            return res.status(500).json({
                success: false,
                error: '查询低库存失败',
                code: 'DB_ERROR'
            });
        }

        return res.status(200).json({
            success: true,
            data: data || [],
            count: data?.length || 0
        });

    } catch (error) {
        logger.error('[Inventory] 获取低库存失败:', error);
        return res.status(500).json({
            success: false,
            error: '获取低库存失败',
            code: 'INTERNAL_ERROR'
        });
    }
});

export default router;