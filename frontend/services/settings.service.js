/**
 * Settings Service - 设置管理服务
 */

(function() {
    'use strict';

    class SettingsService {
        constructor() {
            this.table = 'settings';
            this.cache = {};
        }

        // 获取所有设置
        async getAll(orgId) {
            try {
                let query = window.Supabase.from(this.table).select('*');
                if (orgId) {
                    query = query.eq('organization_id', orgId);
                }
                
                const { data, error } = await query;
                if (error) throw error;
                
                // 缓存设置
                for (const item of data || []) {
                    this.cache[item.key] = item.value;
                }
                
                return data;
            } catch (error) {
                console.error('获取设置失败:', error);
                return [];
            }
        }

        // 获取单个设置
        async get(key, orgId) {
            try {
                // 先从缓存读取
                if (this.cache[key] !== undefined) {
                    return this.cache[key];
                }
                
                const { data, error } = await window.Supabase
                    .from(this.table)
                    .select('value')
                    .eq('key', key)
                    .eq('organization_id', orgId || '')
                    .single();
                    
                if (error) throw error;
                
                this.cache[key] = data?.value;
                return this.cache[key];
            } catch (error) {
                console.error('获取设置失败:', error);
                return null;
            }
        }

        // 更新设置
        async set(key, value, orgId) {
            try {
                const { data, error } = await window.Supabase
                    .from(this.table)
                    .upsert({
                        key: key,
                        value: value,
                        organization_id: orgId || '',
                        updated_at: new Date().toISOString()
                    }, { onConflict: 'key' })
                    .select()
                    .single();
                    
                if (error) throw error;
                
                this.cache[key] = value;
                return data;
            } catch (error) {
                console.error('更新设置失败:', error);
                throw error;
            }
        }

        // 批量更新设置
        async setMultiple(settings, orgId) {
            try {
                const results = [];
                for (const [key, value] of Object.entries(settings)) {
                    const result = await this.set(key, value, orgId);
                    results.push(result);
                }
                return results;
            } catch (error) {
                console.error('批量更新设置失败:', error);
                throw error;
            }
        }

        // 获取系统设置
        async getSystemSettings() {
            const settings = await this.getAll();
            return {
                companyName: this.cache['company_name'] || 'Bai\'s ERP',
                companyLogo: this.cache['company_logo'] || '',
                companyPhone: this.cache['company_phone'] || '',
                companyAddress: this.cache['company_address'] || '',
                companyEmail: this.cache['company_email'] || '',
                currency: this.cache['currency'] || 'SAR',
                language: this.cache['language'] || 'zh-CN',
                timezone: this.cache['timezone'] || 'Asia/Riyadh',
                taxRate: parseFloat(this.cache['tax_rate'] || '0'),
                enableNotifications: this.cache['enable_notifications'] === 'true',
                enableMultiBranch: this.cache['enable_multi_branch'] === 'true',
                ...settings
            };
        }

        // 获取POS设置
        async getPOSSettings() {
            return {
                defaultDiscount: parseFloat(this.cache['pos_default_discount'] || '0'),
                defaultTax: parseFloat(this.cache['pos_default_tax'] || '0'),
                receiptHeader: this.cache['pos_receipt_header'] || '感谢您的光临',
                receiptFooter: this.cache['pos_receipt_footer'] || '欢迎下次光临',
                enableBarcode: this.cache['pos_enable_barcode'] === 'true',
                autoPrint: this.cache['pos_auto_print'] === 'true',
                paymentMethods: (this.cache['pos_payment_methods'] || 'cash,card,online').split(',')
            };
        }

        // 获取通知设置
        async getNotificationSettings() {
            return {
                emailNotifications: this.cache['notify_email'] === 'true',
                pushNotifications: this.cache['notify_push'] === 'true',
                orderCreated: this.cache['notify_order_created'] === 'true',
                orderCompleted: this.cache['notify_order_completed'] === 'true',
                lowStock: this.cache['notify_low_stock'] === 'true',
                dailyReport: this.cache['notify_daily_report'] === 'true'
            };
        }

        // 重置设置
        async reset(orgId) {
            try {
                await window.Supabase
                    .from(this.table)
                    .delete()
                    .eq('organization_id', orgId || '');
                    
                this.cache = {};
                return true;
            } catch (error) {
                console.error('重置设置失败:', error);
                throw error;
            }
        }
    }

    window.SettingsService = new SettingsService();

})();