/**
 * Audit Service - 审计日志服务
 */

(function() {
    'use strict';

    class AuditService {
        constructor() {
            this.table = 'audit_logs';
            this.enabled = true;
        }

        // 启用/禁用审计
        setEnabled(enabled) {
            this.enabled = enabled;
        }

        // 记录审计日志
        async log(data) {
            if (!this.enabled) return;
            
            try {
                const { error } = await window.Supabase
                    .from(this.table)
                    .insert([{
                        ...data,
                        user_id: window._currentUser?.id,
                        user_email: window._currentUser?.email,
                        user_ip: await this.getUserIP(),
                        user_agent: navigator.userAgent,
                        timestamp: new Date().toISOString()
                    }]);
                    
                if (error) throw error;
                return true;
            } catch (error) {
                console.error('记录审计日志失败:', error);
                return false;
            }
        }

        // 获取审计日志
        async getLogs(filters = {}) {
            try {
                let query = window.Supabase.from(this.table).select('*');
                
                if (filters.user_id) {
                    query = query.eq('user_id', filters.user_id);
                }
                if (filters.action) {
                    query = query.eq('action', filters.action);
                }
                if (filters.resource) {
                    query = query.eq('resource', filters.resource);
                }
                if (filters.date_from) {
                    query = query.gte('timestamp', filters.date_from);
                }
                if (filters.date_to) {
                    query = query.lte('timestamp', filters.date_to);
                }
                if (filters.limit) {
                    query = query.limit(filters.limit);
                }
                
                const { data, error } = await query.order('timestamp', { ascending: false });
                    
                if (error) throw error;
                return data;
            } catch (error) {
                console.error('获取审计日志失败:', error);
                return [];
            }
        }

        // 获取用户IP
        async getUserIP() {
            try {
                const response = await fetch('https://api.ipify.org?format=json');
                const data = await response.json();
                return data.ip;
            } catch (error) {
                return 'unknown';
            }
        }

        // 记录登录事件
        async logLogin(userId, success) {
            return this.log({
                action: success ? 'login_success' : 'login_failed',
                resource: 'auth',
                details: { user_id: userId, success }
            });
        }

        // 记录登出事件
        async logLogout(userId) {
            return this.log({
                action: 'logout',
                resource: 'auth',
                details: { user_id: userId }
            });
        }

        // 记录CRUD操作
        async logCRUD(action, resource, resourceId, details = {}) {
            return this.log({
                action: `${action}_${resource}`,
                resource: resource,
                resource_id: resourceId,
                details
            });
        }

        // 记录创建
        async logCreate(resource, resourceId, details) {
            return this.logCRUD('create', resource, resourceId, details);
        }

        // 记录更新
        async logUpdate(resource, resourceId, details) {
            return this.logCRUD('update', resource, resourceId, details);
        }

        // 记录删除
        async logDelete(resource, resourceId, details) {
            return this.logCRUD('delete', resource, resourceId, details);
        }

        // 获取审计统计
        async getStats(filters = {}) {
            try {
                const logs = await this.getLogs(filters);
                
                const total = logs.length;
                
                // 按操作类型统计
                const byAction = {};
                for (const log of logs) {
                    byAction[log.action] = (byAction[log.action] || 0) + 1;
                }
                
                // 按资源统计
                const byResource = {};
                for (const log of logs) {
                    byResource[log.resource] = (byResource[log.resource] || 0) + 1;
                }
                
                // 按日期统计
                const byDate = {};
                for (const log of logs) {
                    const date = log.timestamp.slice(0, 10);
                    byDate[date] = (byDate[date] || 0) + 1;
                }
                
                return {
                    total,
                    byAction,
                    byResource,
                    byDate
                };
            } catch (error) {
                console.error('获取审计统计失败:', error);
                return { total: 0, byAction: {}, byResource: {}, byDate: {} };
            }
        }

        // 清理旧日志
        async cleanOld(days = 30) {
            try {
                const cutoff = new Date();
                cutoff.setDate(cutoff.getDate() - days);
                
                const { error } = await window.Supabase
                    .from(this.table)
                    .delete()
                    .lt('timestamp', cutoff.toISOString());
                    
                if (error) throw error;
                return true;
            } catch (error) {
                console.error('清理旧日志失败:', error);
                throw error;
            }
        }
    }

    window.AuditService = new AuditService();

})();