/**
 * DB - 数据库操作层
 * 统一使用 window.Supabase
 */

(function() {
    'use strict';

    class Database {
        constructor() {
            this._initialized = false;
            this._client = null;
        }

        async _ensureInit() {
            if (this._client) return;
            if (!window.Supabase) {
                throw new Error('Supabase 未加载');
            }
            await window.Supabase.init();
            this._client = window.Supabase.getClient();
            this._initialized = true;
            console.log('✅ Database 初始化完成');
        }

        get client() {
            if (!this._client) {
                throw new Error('Database 未初始化，请先调用 db.init()');
            }
            return this._client;
        }

        async init() {
            await this._ensureInit();
            return this;
        }

        // 通用查询方法
        async query(table, options = {}) {
            await this._ensureInit();
            let query = this.client.from(table).select(options.select || '*');

            if (options.eq) {
                for (const [key, value] of Object.entries(options.eq)) {
                    query = query.eq(key, value);
                }
            }

            if (options.order) {
                query = query.order(options.order.field, {
                    ascending: options.order.ascending !== false
                });
            }

            if (options.limit) {
                query = query.limit(options.limit);
            }

            if (options.single) {
                query = query.single();
            }

            const { data, error } = await query;
            if (error) throw error;
            return data;
        }

        // 插入
        async insert(table, data) {
            await this._ensureInit();
            const { data: result, error } = await this.client
                .from(table)
                .insert(data)
                .select();
            if (error) throw error;
            return result;
        }

        // 更新
        async update(table, id, data) {
            await this._ensureInit();
            const { data: result, error } = await this.client
                .from(table)
                .update(data)
                .eq('id', id)
                .select();
            if (error) throw error;
            return result;
        }

        // 删除
        async delete(table, id) {
            await this._ensureInit();
            const { error } = await this.client
                .from(table)
                .delete()
                .eq('id', id);
            if (error) throw error;
            return true;
        }

        // 获取用户资料
        async getUserProfile(userId) {
            await this._ensureInit();
            const { data, error } = await this.client
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();
            if (error) throw error;
            return data;
        }

        // 获取当前组织
        async getCurrentOrganization() {
            await this._ensureInit();
            const { data, error } = await this.client
                .from('organizations')
                .select('*')
                .limit(1)
                .single();
            if (error && error.code !== 'PGRST116') throw error;
            return data || null;
        }

        // 获取通知
        async getNotifications(userId) {
            await this._ensureInit();
            const { data, error } = await this.client
                .from('notifications')
                .select('*')
                .eq('user_id', userId)
                .order('created_at', { ascending: false });
            if (error) throw error;
            return data;
        }

        // 标记通知已读
        async markNotificationRead(notificationId) {
            await this._ensureInit();
            const { error } = await this.client
                .from('notifications')
                .update({ is_read: true, read_at: new Date().toISOString() })
                .eq('id', notificationId);
            if (error) throw error;
            return true;
        }

        // 标记所有通知已读
        async markAllNotificationsRead(userId) {
            await this._ensureInit();
            const { error } = await this.client
                .from('notifications')
                .update({ is_read: true, read_at: new Date().toISOString() })
                .eq('user_id', userId)
                .eq('is_read', false);
            if (error) throw error;
            return true;
        }
    }

    // 统一暴露为 window.DB
    window.DB = new Database();

    // 兼容旧代码
    Object.defineProperty(window, 'db', {
        get: function() {
            console.warn('⚠️ window.db 已弃用，请使用 window.DB');
            return window.DB;
        }
    });

    console.log('💾 Database 模块加载完成');
})();
