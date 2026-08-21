/**
 * Inventory Service - 库存管理服务
 */

(function() {
    'use strict';

    class InventoryService {
        constructor() {
            this.table = 'inventory';
        }

        // 获取所有库存
        async getAll(filters = {}) {
            try {
                let query = window.Supabase.from(this.table).select('*, products(name, sku, unit)');
                
                if (filters.branch_id) {
                    query = query.eq('branch_id', filters.branch_id);
                }
                if (filters.organization_id) {
                    query = query.eq('organization_id', filters.organization_id);
                }
                if (filters.product_id) {
                    query = query.eq('product_id', filters.product_id);
                }
                if (filters.low_stock) {
                    query = query.lt('quantity', window.Supabase.raw('min_quantity'));
                }
                if (filters.search) {
                    query = query.ilike('products.name', `%${filters.search}%`);
                }
                
                const { data, error } = await query.order('created_at', { ascending: false });
                    
                if (error) throw error;
                return data;
            } catch (error) {
                console.error('获取库存列表失败:', error);
                return [];
            }
        }

        // 获取单个库存
        async getById(id) {
            try {
                const { data, error } = await window.Supabase
                    .from(this.table)
                    .select('*, products(*)')
                    .eq('id', id)
                    .single();
                    
                if (error) throw error;
                return data;
            } catch (error) {
                console.error('获取库存失败:', error);
                return null;
            }
        }

        // 创建库存
        async create(data) {
            try {
                const { data: result, error } = await window.Supabase
                    .from(this.table)
                    .insert([{
                        ...data,
                        last_updated: new Date().toISOString(),
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString()
                    }])
                    .select()
                    .single();
                    
                if (error) throw error;
                return result;
            } catch (error) {
                console.error('创建库存失败:', error);
                throw error;
            }
        }

        // 更新库存
        async update(id, data) {
            try {
                const { data: result, error } = await window.Supabase
                    .from(this.table)
                    .update({
                        ...data,
                        last_updated: new Date().toISOString(),
                        updated_at: new Date().toISOString()
                    })
                    .eq('id', id)
                    .select()
                    .single();
                    
                if (error) throw error;
                return result;
            } catch (error) {
                console.error('更新库存失败:', error);
                throw error;
            }
        }

        // 调整库存
        async adjust(id, quantity, reason, userId) {
            try {
                const inventory = await this.getById(id);
                if (!inventory) throw new Error('库存不存在');
                
                const newQuantity = inventory.quantity + quantity;
                if (newQuantity < 0) {
                    throw new Error('库存不能为负数');
                }
                
                const { data, error } = await window.Supabase
                    .from(this.table)
                    .update({
                        quantity: newQuantity,
                        last_updated: new Date().toISOString(),
                        updated_at: new Date().toISOString()
                    })
                    .eq('id', id)
                    .select()
                    .single();
                    
                if (error) throw error;
                
                // 记录库存变动日志
                await this.logMovement({
                    inventory_id: id,
                    product_id: inventory.product_id,
                    branch_id: inventory.branch_id,
                    quantity: quantity,
                    old_quantity: inventory.quantity,
                    new_quantity: newQuantity,
                    reason: reason,
                    user_id: userId,
                    created_at: new Date().toISOString()
                });
                
                // 检查低库存警告
                if (newQuantity <= inventory.min_quantity) {
                    if (window.Notifications) {
                        window.Notifications.warning(`产品 ${inventory.products?.name || '未知'} 库存不足: ${newQuantity}`);
                    }
                }
                
                return data;
            } catch (error) {
                console.error('调整库存失败:', error);
                throw error;
            }
        }

        // 记录库存变动
        async logMovement(data) {
            try {
                const { error } = await window.Supabase
                    .from('inventory_movements')
                    .insert([data]);
                    
                if (error) throw error;
                return true;
            } catch (error) {
                console.error('记录库存变动失败:', error);
                return false;
            }
        }

        // 获取库存变动记录
        async getMovements(productId, limit = 100) {
            try {
                const { data, error } = await window.Supabase
                    .from('inventory_movements')
                    .select('*, profiles(full_name)')
                    .eq('product_id', productId)
                    .order('created_at', { ascending: false })
                    .limit(limit);
                    
                if (error) throw error;
                return data;
            } catch (error) {
                console.error('获取库存变动失败:', error);
                return [];
            }
        }

        // 获取低库存产品
        async getLowStock(branchId) {
            try {
                let query = window.Supabase
                    .from(this.table)
                    .select('*, products(name, sku)')
                    .lt('quantity', window.Supabase.raw('min_quantity'));
                    
                if (branchId) {
                    query = query.eq('branch_id', branchId);
                }
                
                const { data, error } = await query;
                if (error) throw error;
                return data;
            } catch (error) {
                console.error('获取低库存产品失败:', error);
                return [];
            }
        }

        // 获取库存统计
        async getStats(branchId) {
            try {
                let query = window.Supabase.from(this.table).select('*');
                if (branchId) {
                    query = query.eq('branch_id', branchId);
                }
                
                const { data, error } = await query;
                if (error) throw error;
                
                const totalItems = data.length;
                const lowStock = data.filter(item => item.quantity <= item.min_quantity).length;
                const totalValue = data.reduce((sum, item) => sum + (item.quantity * item.cost_price || 0), 0);
                
                return {
                    totalItems,
                    lowStock,
                    totalValue
                };
            } catch (error) {
                console.error('获取库存统计失败:', error);
                return { totalItems: 0, lowStock: 0, totalValue: 0 };
            }
        }
    }

    window.InventoryService = new InventoryService();

})();