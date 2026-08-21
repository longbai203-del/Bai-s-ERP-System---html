/**
 * Product Service - 产品管理服务
 */

(function() {
    'use strict';

    class ProductService {
        constructor() {
            this.table = 'products';
        }

        // 获取所有产品
        async getAll(filters = {}) {
            try {
                let query = window.Supabase.from(this.table).select('*');
                
                if (filters.category) {
                    query = query.eq('category', filters.category);
                }
                if (filters.branch_id) {
                    query = query.eq('branch_id', filters.branch_id);
                }
                if (filters.organization_id) {
                    query = query.eq('organization_id', filters.organization_id);
                }
                if (filters.status) {
                    query = query.eq('status', filters.status);
                }
                if (filters.search) {
                    query = query.or(`name.ilike.%${filters.search}%,sku.ilike.%${filters.search}%,barcode.ilike.%${filters.search}%`);
                }
                if (filters.min_price) {
                    query = query.gte('price', filters.min_price);
                }
                if (filters.max_price) {
                    query = query.lte('price', filters.max_price);
                }
                
                const { data, error } = await query.order('name');
                    
                if (error) throw error;
                return data;
            } catch (error) {
                console.error('获取产品列表失败:', error);
                return [];
            }
        }

        // 获取单个产品（含库存）
        async getById(id) {
            try {
                const { data, error } = await window.Supabase
                    .from(this.table)
                    .select('*, inventory(*)')
                    .eq('id', id)
                    .single();
                    
                if (error) throw error;
                return data;
            } catch (error) {
                console.error('获取产品失败:', error);
                return null;
            }
        }

        // 创建产品
        async create(data) {
            try {
                const { data: result, error } = await window.Supabase
                    .from(this.table)
                    .insert([{
                        ...data,
                        sku: await this.generateSKU(data.category),
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString()
                    }])
                    .select()
                    .single();
                    
                if (error) throw error;
                
                // 创建库存记录
                if (window.InventoryService) {
                    await window.InventoryService.create({
                        product_id: result.id,
                        branch_id: data.branch_id,
                        organization_id: data.organization_id,
                        quantity: 0,
                        min_quantity: data.min_quantity || 10,
                        max_quantity: data.max_quantity || 100
                    });
                }
                
                return result;
            } catch (error) {
                console.error('创建产品失败:', error);
                throw error;
            }
        }

        // 更新产品
        async update(id, data) {
            try {
                const { data: result, error } = await window.Supabase
                    .from(this.table)
                    .update({
                        ...data,
                        updated_at: new Date().toISOString()
                    })
                    .eq('id', id)
                    .select()
                    .single();
                    
                if (error) throw error;
                return result;
            } catch (error) {
                console.error('更新产品失败:', error);
                throw error;
            }
        }

        // 删除产品
        async delete(id) {
            try {
                // 检查是否有库存
                const inventory = await window.Supabase
                    .from('inventory')
                    .select('quantity')
                    .eq('product_id', id);
                    
                if (inventory.data && inventory.data.some(item => item.quantity > 0)) {
                    throw new Error('该产品还有库存，无法删除');
                }
                
                // 删除库存记录
                await window.Supabase
                    .from('inventory')
                    .delete()
                    .eq('product_id', id);
                
                const { error } = await window.Supabase
                    .from(this.table)
                    .delete()
                    .eq('id', id);
                    
                if (error) throw error;
                return true;
            } catch (error) {
                console.error('删除产品失败:', error);
                throw error;
            }
        }

        // 生成SKU
        async generateSKU(category) {
            const prefix = category ? category.substring(0, 3).toUpperCase() : 'PRD';
            const { data, error } = await window.Supabase
                .from(this.table)
                .select('sku')
                .like('sku', `${prefix}%`)
                .order('sku', { ascending: false })
                .limit(1);
                
            if (error || !data || data.length === 0) {
                return `${prefix}0001`;
            }
            
            const lastSKU = data[0].sku;
            const num = parseInt(lastSKU.replace(prefix, '')) + 1;
            return `${prefix}${String(num).padStart(4, '0')}`;
        }

        // 获取产品分类
        async getCategories(orgId) {
            try {
                let query = window.Supabase
                    .from(this.table)
                    .select('category')
                    .not('category', 'is', null);
                    
                if (orgId) {
                    query = query.eq('organization_id', orgId);
                }
                
                const { data, error } = await query;
                if (error) throw error;
                
                const categories = [...new Set(data.map(item => item.category))];
                return categories;
            } catch (error) {
                console.error('获取分类失败:', error);
                return [];
            }
        }

        // 获取产品统计
        async getStats(filters = {}) {
            try {
                let query = window.Supabase.from(this.table).select('*', { count: 'exact' });
                
                if (filters.organization_id) {
                    query = query.eq('organization_id', filters.organization_id);
                }
                if (filters.branch_id) {
                    query = query.eq('branch_id', filters.branch_id);
                }
                
                const { count, error } = await query;
                if (error) throw error;
                
                return { total: count || 0 };
            } catch (error) {
                console.error('获取产品统计失败:', error);
                return { total: 0 };
            }
        }

        // 搜索产品（用于POS）
        async search(keyword, branchId) {
            try {
                let query = window.Supabase
                    .from(this.table)
                    .select('*, inventory!inner(quantity)')
                    .or(`name.ilike.%${keyword}%,sku.ilike.%${keyword}%,barcode.ilike.%${keyword}%`)
                    .eq('status', 'active');
                    
                if (branchId) {
                    query = query.eq('inventory.branch_id', branchId);
                }
                
                const { data, error } = await query.limit(20);
                    
                if (error) throw error;
                return data;
            } catch (error) {
                console.error('搜索产品失败:', error);
                return [];
            }
        }
    }

    window.ProductService = new ProductService();

})();