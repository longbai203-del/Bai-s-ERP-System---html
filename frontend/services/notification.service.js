/**
 * Notification Service - 通知服务
 */

(function() {
    'use strict';

    class NotificationService {
        constructor() {
            this.table = 'notifications';
            this.listeners = [];
        }

        // 获取所有通知
        async getAll(userId, filters = {}) {
            try {
                let query = window.Supabase.from(this.table).select('*')
                    .eq('user_id', userId)
                    .order('created_at', { ascending: false });
                    
                if (filters.read !== undefined) {
                    query = query.eq('read', filters.read);
                }
                if (filters.type) {
                    query = query.eq('type', filters.type);
                }
                if (filters.limit) {
                    query = query.limit(filters.limit);
                }
                
                const { data, error } = await query;
                if (error) throw error;
                return data;
            } catch (error) {
                console.error('获取通知失败:', error);
                return [];
            }
        }

        // 获取未读通知数
        async getUnreadCount(userId) {
            try {
                const { count, error } = await window.Supabase
                    .from(this.table)
                    .select('*', { count: 'exact', head: true })
                    .eq('user_id', userId)
                    .eq('read', false);
                    
                if (error) throw error;
                return count || 0;
            } catch (error) {
                console.error('获取未读通知数失败:', error);
                return 0;
            }
        }

        // 创建通知
        async create(data) {
            try {
                const { data: result, error } = await window.Supabase
                    .from(this.table)
                    .insert([{
                        ...data,
                        read: false,
                        created_at: new Date().toISOString()
                    }])
                    .select()
                    .single();
                    
                if (error) throw error;
                
                // 触发实时通知
                this.emit('notification', result);
                
                // 浏览器通知
                if (data.browser_notify !== false) {
                    await this.sendBrowserNotification(result);
                }
                
                return result;
            } catch (error) {
                console.error('创建通知失败:', error);
                throw error;
            }
        }

        // 批量创建通知
        async createBatch(userIds, data) {
            try {
                const notifications = userIds.map(userId => ({
                    ...data,
                    user_id: userId,
                    read: false,
                    created_at: new Date().toISOString()
                }));
                
                const { data: result, error } = await window.Supabase
                    .from(this.table)
                    .insert(notifications)
                    .select();
                    
                if (error) throw error;
                return result;
            } catch (error) {
                console.error('批量创建通知失败:', error);
                throw error;
            }
        }

        // 标记为已读
        async markAsRead(id) {
            try {
                const { data, error } = await window.Supabase
                    .from(this.table)
                    .update({ 
                        read: true, 
                        read_at: new Date().toISOString() 
                    })
                    .eq('id', id)
                    .select()
                    .single();
                    
                if (error) throw error;
                return data;
            } catch (error) {
                console.error('标记通知失败:', error);
                throw error;
            }
        }

        // 标记所有为已读
        async markAllAsRead(userId) {
            try {
                const { data, error } = await window.Supabase
                    .from(this.table)
                    .update({ 
                        read: true, 
                        read_at: new Date().toISOString() 
                    })
                    .eq('user_id', userId)
                    .eq('read', false)
                    .select();
                    
                if (error) throw error;
                return data;
            } catch (error) {
                console.error('标记所有通知失败:', error);
                throw error;
            }
        }

        // 删除通知
        async delete(id) {
            try {
                const { error } = await window.Supabase
                    .from(this.table)
                    .delete()
                    .eq('id', id);
                    
                if (error) throw error;
                return true;
            } catch (error) {
                console.error('删除通知失败:', error);
                throw error;
            }
        }

        // 发送浏览器通知
        async sendBrowserNotification(notification) {
            if (!('Notification' in window)) return;
            if (Notification.permission !== 'granted') return;
            
            try {
                new Notification(notification.title, {
                    body: notification.message,
                    icon: notification.icon || '/assets/icons/icon-192x192.png',
                    tag: notification.id || 'default',
                    requireInteraction: notification.require_interaction || false
                });
            } catch (error) {
                console.warn('浏览器通知失败:', error);
            }
        }

        // 系统通知事件
        on(event, callback) {
            if (!this.listeners[event]) {
                this.listeners[event] = [];
            }
            this.listeners[event].push(callback);
        }

        emit(event, data) {
            if (this.listeners[event]) {
                for (const callback of this.listeners[event]) {
                    callback(data);
                }
            }
        }
    }

    window.NotificationService = new NotificationService();

})();