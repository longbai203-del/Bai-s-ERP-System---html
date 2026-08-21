/**
 * Purchase Service - 采购管理服务
 */

(function() {
    'use strict';

    class PurchaseService {
        constructor() {
            this.table = 'purchases';
        }

        // 获取所有采购单
        async getAll(filters = {}) {
            try {
                let query = window.Supabase.from(this.table).select('*, suppliers(name), branches(name)');
                
                if (filters.branch_id) {
                    query = query.eq('branch_id', filters.branch_id);
                }
                if (filters.organization_id) {
                    query = query.eq('organization_id', filters.organization_id);
                }
                if (filters.supplier_id) {
                    query = query.eq('supplier_id', filters.supplier_id);
                }
                if (filters.status) {
                    query = query.eq('status', filters.status);
                }
                if (filters.search) {
                    query = query.ilike('purchase_number', `%${filters.search}%`);
                }
                
                const { data, error } = await query.order('created_at', { ascending: false });
                    
                if (error) throw error;
                return data;
            } catch (error) {
                console.error('获取采购单列表失败:', error);
                return [];
            }
        }

        // 获取单个采购单
        async getById(id) {
            try {
                const { data, error } = await window.Supabase
                    .from(this.table)
                    .select('*, suppliers(*), branches(*), purchase_items(*)')
                    .eq('id', id)
                    .single();
                    
                if (error) throw error;
                return data;
            } catch (error) {
                console.error('获取采购单失败:', error);
                return null;
            }
        }

        // 创建采购单
        async create(data) {
            try {
                const { data: result, error } = await window.Supabase
                    .from(this.table)
                    .insert([{
                        ...data,
                        purchase_number: await this.generateNumber(),
                        total_amount: data.items?.reduce((sum, item) => sum + item.quantity * item.unit_price, 0) || 0,
                        status: 'draft',
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString()
                    }])
                    .select()
                    .single();
                    
                if (error) throw error;
                
                // 创建采购项
                if (data.items && data.items.length > 0) {
                    await this.createItems(result.id, data.items);
                }
                
                return result;
            } catch (error) {
                console.error('创建采购单失败:', error);
                throw error;
            }
        }

        // 创建采购项
        async createItems(purchaseId, items) {
            try {
                const itemsData = items.map(item => ({
                    purchase_id: purchaseId,
                    product_id: item.product_id,
                    quantity: item.quantity,
                    unit_price: item.unit_price,
                    total_price: item.quantity * item.unit_price,
                    created_at: new Date().toISOString()
                }));
                
                const { error } = await window.Supabase
                    .from('purchase_items')
                    .insert(itemsData);
                    
                if (error) throw error;
                return true;
            } catch (error) {
                console.error('创建采购项失败:', error);
                throw error;
            }
        }

        // 更新采购单状态
        async updateStatus(id, status) {
            try {
                const { data, error } = await window.Supabase
                    .from(this.table)
                    .update({
                        status: status,
                        updated_at: new Date().toISOString()
                    })
                    .eq('id', id)
                    .select()
                    .single();
                    
                if (error) throw error;
                
                // 如果是已收货状态，更新库存
                if (status === 'received') {
                    await this.updateInventory(id);
                }
                
                return data;
            } catch (error) {
                console.error('更新采购单状态失败:', error);
                throw error;
            }
        }

        // 更新库存（收货）
        async updateInventory(purchaseId) {
            try {
                const purchase = await this.getById(purchaseId);
                if (!purchase) throw new Error('采购单不存在');
                
                for (const item of purchase.purchase_items || []) {
                    // 查找或创建库存
                    let inventory = await window.Supabase
                        .from('inventory')
                        .select('*')
                        .eq('product_id', item.product_id)
                        .eq('branch_id', purchase.branch_id)
                        .single();
                    
                    if (inventory.data) {
                        // 更新库存
                        await window.InventoryService.update(inventory.data.id, {
                            quantity: inventory.data.quantity + item.quantity
                        });
                    } else {
                        // 创建库存
                        await window.InventoryService.create({
                            product_id: item.product_id,
                            branch_id: purchase.branch_id,
                            organization_id: purchase.organization_id,
                            quantity: item.quantity,
                            min_quantity: 10,
                            max_quantity: 100
                        });
                    }
                }
                
                return true;
            } catch (error) {
                console.error('更新库存失败:', error);
                throw error;
            }
        }

        // 生成采购单号
        async generateNumber() {
            const prefix = 'PO';
            const year = new Date().getFullYear();
            const { data, error } = await window.Supabase
                .from(this.table)
                .select('purchase_number')
                .like('purchase_number', `${prefix}${year}%`)
                .order('purchase_number', { ascending: false })
                .limit(1);
                
            if (error || !data || data.length === 0) {
                return `${prefix}${year}0001`;
            }
            
            const lastNumber = data[0].purchase_number;
            const num = parseInt(lastNumber.slice(-4)) + 1;
            return `${prefix}${year}${String(num).padStart(4, '0')}`;
        }

        // 获取采购统计
        async getStats(filters = {}) {
            try {
                let query = window.Supabase.from(this.table).select('*');
                
                if (filters.branch_id) {
                    query = query.eq('branch_id', filters.branch_id);
                }
                if (filters.organization_id) {
                    query = query.eq('organization_id', filters.organization_id);
                }
                
                const { data, error } = await query;
                if (error) throw error;
                
                const total = data.length;
                const totalAmount = data.reduce((sum, item) => sum + (item.total_amount || 0), 0);
                const received = data.filter(item => item.status === 'received').length;
                const pending = data.filter(item => item.status === 'pending' || item.status === 'draft').length;
                
                return {
                    total,
                    totalAmount,
                    received,
                    pending
                };
            } catch (error) {
                console.error('获取采购统计失败:', error);
                return { total: 0, totalAmount: 0, received: 0, pending: 0 };
            }
        }
    }

    window.PurchaseService = new PurchaseService();

})();
